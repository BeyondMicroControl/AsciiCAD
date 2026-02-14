/* ZeroRun: simple RLE for a marker "zero word".
 *
 * Default (byte mode): wordsize=1, seq=[zeroByte]
 * Encoding format (byte mode):
 *  - Any byte != zero: emitted as-is
 *  - A run of N consecutive zero bytes (1..255): emitted as: [zero, N]
 *
 * Word mode (wordsize>1):
 *  - Input is treated as fixed-size words of `wordsize` bytes.
 *  - The marker word is `seq` (Uint8Array length = wordsize).
 *  - Any non-marker word is emitted as-is (wordsize bytes).
 *  - A run of N consecutive marker words (1..255) is emitted as:
 *        [seq bytes..., N]
 *    Literal marker words are always encoded as runs (N>=1), so seq never
 *    appears in the output except as a run marker.
 *
 * Notes:
 *  - Streaming-friendly across push() calls.
 *  - For wordsize>1, input length MUST be a multiple of wordsize.
 *  - Optional XOR (per byte) can be applied before compression and after
 *    decompression via opts.xor.
 */

const ZeroRun = (() => {
  function asU8(input) {
    if (input == null) return null;
    if (input instanceof Uint8Array) return input;
    if (input instanceof ArrayBuffer) return new Uint8Array(input);
    // Support views like DataView / TypedArray
    if (ArrayBuffer.isView(input) && input.buffer) {
      return new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
    }
    throw new TypeError("ZeroRun expects ArrayBuffer or Uint8Array (or a view).");
  }

  function xorInPlace(u8, xorByte) {
    if (!xorByte) return u8;
    for (let i = 0; i < u8.length; i++) u8[i] ^= xorByte;
    return u8;
  }

  function makeSeqAndWordsize(opts = {}) {
    const wordsize = Math.max(1, (opts.wordsize ?? 1) | 0);

    if (opts.seq != null) {
      const seqArr = Array.isArray(opts.seq) ? opts.seq : Array.from(opts.seq);
      const seq = Uint8Array.from(seqArr.map(x => (x ?? 0) & 0xff));
      if (seq.length !== wordsize) {
        throw new TypeError(`ZeroRun: opts.seq length (${seq.length}) must equal wordsize (${wordsize}).`);
      }
      return { wordsize, seq };
    }

    // Backward-compatible byte mode: use opts.zero
    const zero = (opts.zero ?? 0x00) & 0xff;
    return { wordsize: 1, seq: Uint8Array.of(zero) };
  }

  function wordEquals(u8, i, seq) {
    for (let k = 0; k < seq.length; k++) {
      if (u8[i + k] !== seq[k]) return false;
    }
    return true;
  }

  class Inflate {
    constructor(opts = {}) {
      const { wordsize, seq } = makeSeqAndWordsize(opts);
      this.wordsize = wordsize;
      this.seq = seq;
      this.xor = (opts.xor ?? 0x00) & 0xff;

      this.err = 0;
      this.msg = "";
      this.result = undefined;

      // Streaming state
      this._awaitCount = false;       // true when seq marker has been consumed
      this._partial = new Uint8Array(0); // buffered bytes (< wordsize)

      this._outChunks = [];
      this._outLen = 0;
    }

    push(data /*, modeIgnored */) {
      try {
        const inU8raw = asU8(data);
        if (!inU8raw) {
          this.result = new Uint8Array(0);
          return true;
        }

        // Copy if we XOR (don’t mutate caller input)
        const inU8 = this.xor ? new Uint8Array(inU8raw) : inU8raw;
        xorInPlace(inU8, this.xor);

        // Prepend any buffered partial
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
            // Need 1 byte count
            if (i >= buf.length) break;
            const count = buf[i++];
            if (count === 0) throw new Error("Invalid ZeroRun stream: run count cannot be 0.");
            // Emit seq repeated count times
            for (let r = 0; r < count; r++) {
              for (let k = 0; k < this.wordsize; k++) out.push(this.seq[k]);
            }
            this._awaitCount = false;
            continue;
          }

          // Need a full word to decide marker vs literal
          if (i + this.wordsize > buf.length) {
            // Buffer remainder
            this._partial = buf.slice(i);
            i = buf.length;
            break;
          }

          if (wordEquals(buf, i, this.seq)) {
            // Marker word; next byte is run count (may arrive later)
            i += this.wordsize;
            this._awaitCount = true;
          } else {
            // Literal word
            for (let k = 0; k < this.wordsize; k++) out.push(buf[i + k]);
            i += this.wordsize;
          }
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

        // XOR back after inflate if using xor mode
        if (this.xor) xorInPlace(joined, this.xor);

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
      const { wordsize, seq } = makeSeqAndWordsize(opts);
      this.wordsize = wordsize;
      this.seq = seq;
      this.xor = (opts.xor ?? 0x00) & 0xff;

      this.err = 0;
      this.msg = "";
      this.result = undefined;

      this._outChunks = [];
      this._outLen = 0;

      // pending run of `seq` words across chunks
      this._runWords = 0;

      // buffer partial input words if chunk doesn't end on word boundary
      this._partial = new Uint8Array(0);
    }

    push(data, final = false) {
      try {
        const inU8raw = asU8(data);
        const inU8 = inU8raw
          ? (this.xor ? xorInPlace(new Uint8Array(inU8raw), this.xor) : inU8raw)
          : new Uint8Array(0);

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
          // In word mode, we require full words. Keep remainder for next push unless final.
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
            // Emit marker seq + count
            for (let k = 0; k < this.wordsize; k++) out.push(this.seq[k]);
            out.push(n);
            this._runWords -= n;
          }
        };

        // Iterate input in word steps
        for (let i = 0; i < buf.length; i += this.wordsize) {
          const isZeroWord = wordEquals(buf, i, this.seq);

          if (isZeroWord) {
            this._runWords++;
            if (this._runWords === 255) flushRun();
          } else {
            if (this._runWords > 0) flushRun();
            for (let k = 0; k < this.wordsize; k++) out.push(buf[i + k]);
          }
        }

        if (final) {
          if (this._partial.length) {
            // Should not happen in word mode; in byte mode partial is always empty.
            throw new Error("ZeroRun: internal partial buffer not empty at final.");
          }
          if (this._runWords > 0) flushRun();
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

        // XOR back after deflate if using xor mode
        if (this.xor) xorInPlace(joined, this.xor);

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
