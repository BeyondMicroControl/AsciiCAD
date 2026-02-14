/* ZeroRun (word-aware): simple RLE for a marker "zero word".
 *
 * API (pako-like):
 *   const def = new ZeroRun.Deflate({ zero: [0x20,0x20,0x20,0x20] });
 *   def.push(u8, true);   // result is Uint8Array
 *
 *   const inf = new ZeroRun.Inflate({ zero: [0x20,0x20,0x20,0x20] });
 *   inf.push(def.result, true);
 *
 * Options:
 *   - zero:
 *       * number (0..255): byte-mode marker (backward compatible)
 *       * array / Uint8Array: word-mode marker pattern (wordsize = zero.length)
 *
 * Word mode semantics (zero is an array/view):
 *   - Input is treated as fixed-size words of wordsize = zero.length bytes.
 *   - Before compression, we XOR the input *per word* with the provided pattern:
 *       byte[i] ^= pattern[i % wordsize]
 *     This makes the marker word (pattern itself) become 0x00..0x00.
 *   - Compression then run-encodes runs of the all-zero word.
 *   - After decompression, we XOR the output with the same pattern to restore.
 *
 * Encoding format:
 *   - Any non-marker word is emitted literally (wordsize bytes).
 *   - A run of N consecutive marker words (1..255) is emitted as:
 *         [markerWordBytes..., N]
 *     where markerWordBytes are all zeros in word mode.
 *
 * Notes:
 *   - Streaming-friendly across push() calls.
 *   - In word mode, input length MUST be a multiple of wordsize by the time
 *     you call push(..., true). Non-final pushes may end mid-word.
 */

const ZeroRun = (() => {
  function asU8(input) {
    if (input == null) return null;
    if (input instanceof Uint8Array) return input;
    if (input instanceof ArrayBuffer) return new Uint8Array(input);
    if (ArrayBuffer.isView(input) && input.buffer) {
      return new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
    }
    throw new TypeError("ZeroRun expects ArrayBuffer or Uint8Array (or a view).");
  }

  function normalizeOptions(opts = {}) {
    if (opts.zero != null && (Array.isArray(opts.zero) || (ArrayBuffer.isView(opts.zero) && opts.zero.buffer))) {
      const arr = Array.isArray(opts.zero) ? opts.zero : Array.from(opts.zero);
      if (arr.length < 1) throw new TypeError("ZeroRun: opts.zero array must have length >= 1.");
      const pattern = Uint8Array.from(arr.map(x => (x ?? 0) & 0xff));
      const wordsize = pattern.length;
      const marker = new Uint8Array(wordsize); // all zeros
      return { wordsize, pattern, marker, wordMode: true };
    }

    // Byte mode (backward compatible): no XOR preprocessing.
    const z = (opts.zero ?? 0x00) & 0xff;
    return { wordsize: 1, pattern: Uint8Array.of(0x00), marker: Uint8Array.of(z), wordMode: false };
  }

  function wordEquals(u8, i, seq) {
    for (let k = 0; k < seq.length; k++) {
      if (u8[i + k] !== seq[k]) return false;
    }
    return true;
  }

  function xorWithPatternInPlace(u8, pattern) {
    const w = pattern.length;
    if (w === 1) {
      const x = pattern[0];
      if (!x) return u8;
      for (let i = 0; i < u8.length; i++) u8[i] ^= x;
      return u8;
    }
    for (let i = 0; i < u8.length; i++) u8[i] ^= pattern[i % w];
    return u8;
  }

  class Inflate {
    constructor(opts = {}) {
      const { wordsize, pattern, marker, wordMode } = normalizeOptions(opts);
      this.wordsize = wordsize;
      this.pattern = pattern;
      this.marker = marker;
      this.wordMode = wordMode;

      this.err = 0;
      this.msg = "";
      this.result = undefined;

      this._awaitCount = false;
      this._partial = new Uint8Array(0);
      this._outChunks = [];
      this._outLen = 0;
    }

    push(data /*, modeIgnored */) {
      try {
        const inU8 = asU8(data) ?? new Uint8Array(0);

        // Prepend partial
        let buf;
        if (this._partial.length) {
          buf = new Uint8Array(this._partial.length + inU8.length);
          buf.set(this._partial, 0);
          buf.set(inU8, this._partial.length);
          this._partial = new Uint8Array(0);
        } else {
          buf = inU8;
        }

        const out = [];
        let i = 0;

        while (i < buf.length) {
          if (this._awaitCount) {
            if (i >= buf.length) break;
            const count = buf[i++];
            if (count === 0) throw new Error("Invalid ZeroRun stream: run count cannot be 0.");
            for (let r = 0; r < count; r++) {
              for (let k = 0; k < this.wordsize; k++) out.push(this.marker[k]);
            }
            this._awaitCount = false;
            continue;
          }

          if (i + this.wordsize > buf.length) {
            this._partial = buf.slice(i);
            i = buf.length;
            break;
          }

          if (wordEquals(buf, i, this.marker)) {
            i += this.wordsize;
            this._awaitCount = true;
          } else {
            for (let k = 0; k < this.wordsize; k++) out.push(buf[i + k]);
            i += this.wordsize;
          }
        }

        let chunk = Uint8Array.from(out);
        if (this.wordMode && chunk.length) xorWithPatternInPlace(chunk, this.pattern);

        this._outChunks.push(chunk);
        this._outLen += chunk.length;

        const joined = new Uint8Array(this._outLen);
        let off = 0;
        for (const c of this._outChunks) {
          joined.set(c, off);
          off += c.length;
        }

        this.result = joined;
        return true;
      } catch (e) {
        this.err = 1;
        this.msg = String(e && e.message ? e.message : e);
        this.result = undefined;
        return false;
      }
    }
  }

  class Deflate {
    constructor(opts = {}) {
      const { wordsize, pattern, marker, wordMode } = normalizeOptions(opts);
      this.wordsize = wordsize;
      this.pattern = pattern;
      this.marker = marker;
      this.wordMode = wordMode;

      this.err = 0;
      this.msg = "";
      this.result = undefined;

      this._outChunks = [];
      this._outLen = 0;

      this._runWords = 0;
      this._partial = new Uint8Array(0);
    }

    push(data, final = false) {
      try {
        const inU8raw = asU8(data) ?? new Uint8Array(0);
        const inU8 = this.wordMode ? new Uint8Array(inU8raw) : inU8raw;
        if (this.wordMode && inU8.length) xorWithPatternInPlace(inU8, this.pattern);

        // Prepend partial
        let buf;
        if (this._partial.length) {
          buf = new Uint8Array(this._partial.length + inU8.length);
          buf.set(this._partial, 0);
          buf.set(inU8, this._partial.length);
          this._partial = new Uint8Array(0);
        } else {
          buf = inU8;
        }

        if (this.wordsize > 1) {
          const rem = buf.length % this.wordsize;
          if (rem !== 0) {
            if (final) {
              throw new Error(`ZeroRun (word mode): input length (${buf.length}) not divisible by wordsize (${this.wordsize}).`);
            }
            this._partial = buf.slice(buf.length - rem);
            buf = buf.slice(0, buf.length - rem);
          }
        }

        const out = [];

        const flushRun = () => {
          while (this._runWords > 0) {
            const n = Math.min(255, this._runWords);
            for (let k = 0; k < this.wordsize; k++) out.push(this.marker[k]);
            out.push(n);
            this._runWords -= n;
          }
        };

        for (let i = 0; i < buf.length; i += this.wordsize) {
          const isMarker = wordEquals(buf, i, this.marker);
          if (isMarker) {
            this._runWords++;
            if (this._runWords === 255) flushRun();
          } else {
            if (this._runWords) flushRun();
            for (let k = 0; k < this.wordsize; k++) out.push(buf[i + k]);
          }
        }

        if (final) {
          if (this._partial.length) throw new Error("ZeroRun: internal partial buffer not empty at final.");
          if (this._runWords) flushRun();
        }

        const chunk = Uint8Array.from(out);
        this._outChunks.push(chunk);
        this._outLen += chunk.length;

        const joined = new Uint8Array(this._outLen);
        let off = 0;
        for (const c of this._outChunks) {
          joined.set(c, off);
          off += c.length;
        }

        this.result = joined;
        return true;
      } catch (e) {
        this.err = 1;
        this.msg = String(e && e.message ? e.message : e);
        this.result = undefined;
        return false;
      }
    }
  }

  return { Inflate, Deflate };
})();
