/* ZeroRun: simple RLE for a single byte value (the "zero" marker).
 *
 * Encoding format:
 *  - Any byte != zero: emitted as-is
 *  - A run of N consecutive 'zero' bytes (1..255):
 *      emitted as: [zero, N]
 *    If literal 'zero' occurs, it is always encoded as a run (N>=1).
 *
 * Notes:
 *  - This is streaming-friendly in the sense of push() calls, but:
 *    - Inflate() supports streaming (handles split [zero,count] across chunks).
 *    - Deflate() supports streaming too (keeps pending run across chunks),
 *      but flushes the final run only on push(lastChunk, true).
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

  class Inflate {
    constructor(opts = {}) {
      // If you want runs of SPACE directly: zero=0x20, xor=0
      // If you prefer true-zero runs but data has many spaces:
      //   set xor=0x20 and zero=0x00
      this.zero = (opts.zero ?? 0x00) & 0xff;
      this.xor = (opts.xor ?? 0x00) & 0xff;

      this.err = 0;
      this.msg = "";
      this.result = undefined;

      // streaming state if a chunk ends right after `zero`
      this._awaitCount = false;
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

        // Worst-case output is about input length * 255 if malicious,
        // but for valid encoding it’s bounded. We'll push to an array and concat once.
        const out = [];

        let i = 0;

        // If previous chunk ended with a lone `zero`, first byte must be count
        if (this._awaitCount) {
          if (inU8.length === 0) {
            // still waiting
          } else {
            const count = inU8[0];
            if (count === 0) throw new Error("Invalid ZeroRun stream: zero-run count cannot be 0.");
            for (let k = 0; k < count; k++) out.push(this.zero);
            i = 1;
            this._awaitCount = false;
          }
        }

        for (; i < inU8.length; i++) {
          const b = inU8[i];
          if (b !== this.zero) {
            out.push(b);
          } else {
            // need count byte next; if missing, carry state to next push
            if (i + 1 >= inU8.length) {
              this._awaitCount = true;
              break;
            }
            const count = inU8[++i];
            if (count === 0) throw new Error("Invalid ZeroRun stream: zero-run count cannot be 0.");
            for (let k = 0; k < count; k++) out.push(this.zero);
          }
        }

        const chunk = Uint8Array.from(out);
        this._outChunks.push(chunk);
        this._outLen += chunk.length;

        // Update result as “all output so far”, like pako does after push
        // (pako’s result may change each push; this mimics that behavior)
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
      this.zero = (opts.zero ?? 0x00) & 0xff;
      this.xor = (opts.xor ?? 0x00) & 0xff;

      this.err = 0;
      this.msg = "";
      this.result = undefined;

      this._outChunks = [];
      this._outLen = 0;

      // pending run of `zero` across chunks
      this._run = 0;
    }

    push(data, final = false) {
      try {
        const inU8raw = asU8(data);
        const inU8 = inU8raw
          ? (this.xor ? xorInPlace(new Uint8Array(inU8raw), this.xor) : inU8raw)
          : new Uint8Array(0);

        const out = [];

        const flushRun = () => {
          while (this._run > 0) {
            const n = Math.min(255, this._run);
            out.push(this.zero, n);
            this._run -= n;
          }
        };

        for (let i = 0; i < inU8.length; i++) {
          const b = inU8[i];
          if (b === this.zero) {
            this._run++;
            if (this._run === 255) flushRun(); // keep bounded
          } else {
            if (this._run > 0) flushRun();
            out.push(b);
          }
        }

        if (final && this._run > 0) flushRun();

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
