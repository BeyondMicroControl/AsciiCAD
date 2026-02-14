/* ZeroRun: tiny RLE codec with a pako-like API.
 *
 * Two modes:
 *  1) Byte mode (backward compatible)
 *     - opts.zero is a number 0..255
 *     - "zero byte" is the marker that gets run-length encoded
 *     - Format: [ ... literal bytes ... ] and runs encoded as: [zeroByte, count]
 *
 *  2) Word-XOR mode (requested)
 *     - opts.zero is an Array / Uint8Array (pattern bytes), length = wordsize
 *     - Before compression: data is XORed with that pattern repeated:
 *         data[i] ^= pattern[i % wordsize]
 *       So the "zero word" (pattern itself) becomes 00..00.
 *     - Runs of the all-zero word are encoded as: [00..00 (wordsize bytes), count]
 *     - After decompression: XOR again with the same pattern to restore original.
 *
 * Notes:
 *  - .push(data, true) is supported (the lab uses a single push with final=true).
 *  - Streaming is supported enough for Inflate (handles split marker/count),
 *    and Deflate buffers partial words.
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

  function isArrayLike(x) {
    return Array.isArray(x) || (x instanceof Uint8Array);
  }

  function toPattern(optsZero) {
    const arr = Array.isArray(optsZero) ? optsZero : Array.from(optsZero);
    const pat = Uint8Array.from(arr.map(v => (v ?? 0) & 0xff));
    if (pat.length < 1) throw new TypeError("ZeroRun: opts.zero array must have length >= 1.");
    return pat;
  }

  function xorWithPatternInPlace(u8, pattern) {
    const m = pattern.length;
    for (let i = 0; i < u8.length; i++) u8[i] ^= pattern[i % m];
    return u8;
  }

  function wordEquals(u8, i, seq) {
    for (let k = 0; k < seq.length; k++) if (u8[i + k] !== seq[k]) return false;
    return true;
  }

  class Inflate {
    constructor(opts = {}) {
      this.err = 0;
      this.msg = "";
      this.result = undefined;

      // mode selection
      if (isArrayLike(opts.zero)) {
        this.pattern = toPattern(opts.zero);      // XOR pattern
        this.wordsize = this.pattern.length;
        this.seq = new Uint8Array(this.wordsize); // all zeros marker after XOR
        // Optional padding support (enabled when opts.trailing is provided)
        this.trailing = (opts.trailing === undefined) ? undefined : ((opts.trailing ?? 0) & 0xff);
        this._useHeader = (this.trailing !== undefined);
      } else {
        const z = (opts.zero ?? 0x00) & 0xff;
        this.pattern = null;
        this.wordsize = 1;
        this.seq = Uint8Array.of(z);
        this.trailing = undefined;
        this._useHeader = false;
      }

      // header parsing state (only used in word-xor mode when opts.trailing is set)
      this._readHeader = false;
      this._headerBuf = [];
      this._padLen = 0;

      // streaming state
      this._awaitCount = false;      // we saw marker, waiting for count byte
      this._markerPending = false;   // in word mode: marker bytes may be split
      this._pendingMarkerBytes = 0;  // how many marker bytes already matched at end of chunk

      this._outChunks = [];
      this._outLen = 0;
    }

    push(data, final = false) {
      try {
        let inRaw = asU8(data) ?? new Uint8Array(0);

        // If enabled, read a tiny 2-byte header: [0x5A, padLen]
        // This is emitted by Deflate when opts.trailing is provided in word-xor mode.
        if (this._useHeader && !this._readHeader) {
          if (this._headerBuf.length < 2) {
            const need = 2 - this._headerBuf.length;
            const take = Math.min(need, inRaw.length);
            for (let t = 0; t < take; t++) this._headerBuf.push(inRaw[t]);
            inRaw = inRaw.slice(take);
          }
          if (this._headerBuf.length < 2) {
            if (final) throw new Error("Invalid ZeroRun stream: truncated header at end.");
            return true;
          }
          const magic = this._headerBuf[0];
          const padLen = this._headerBuf[1];
          if (magic !== 0x5A) throw new Error("Invalid ZeroRun stream: missing header magic.");
          if (padLen >= this.wordsize) throw new Error("Invalid ZeroRun stream: bad pad length in header.");
          this._padLen = padLen;
          this._readHeader = true;
          this._headerBuf.length = 0;
        }

        // We'll parse compressed stream as-is (no XOR here);
        // XOR is applied after full output is assembled (pattern mode).
        const out = [];
        const ws = this.wordsize;

        let i = 0;

        // Handle case where previous chunk ended in the middle of marker bytes (word mode)
        if (ws > 1 && this._pendingMarkerBytes > 0) {
          // Continue matching remaining marker bytes (which are all zeros in word-xor mode,
          // or the 1-byte marker handled elsewhere).
          while (this._pendingMarkerBytes < ws && i < inRaw.length) {
            const expected = this.seq[this._pendingMarkerBytes];
            if (inRaw[i] !== expected) {
              throw new Error("Invalid ZeroRun stream: split marker mismatch.");
            }
            this._pendingMarkerBytes++;
            i++;
          }
          if (this._pendingMarkerBytes < ws) {
            // still not enough bytes to finish marker
            this._appendAndSetResult(Uint8Array.from(out));
            if (final) throw new Error("Invalid ZeroRun stream: truncated marker at end.");
            return true;
          }
          // marker fully matched; now we must read count
          this._awaitCount = true;
          this._pendingMarkerBytes = 0;
        }

        // If previous chunk ended right after marker, first byte must be count
        if (this._awaitCount) {
          if (i >= inRaw.length) {
            if (final) throw new Error("Invalid ZeroRun stream: missing count at end.");
            this._appendAndSetResult(Uint8Array.from(out));
            return true;
          }
          const count = inRaw[i++];
          if (count === 0) throw new Error("Invalid ZeroRun stream: count cannot be 0.");
          for (let k = 0; k < count; k++) {
            for (let j = 0; j < ws; j++) out.push(0x00); // marker word bytes
          }
          this._awaitCount = false;
        }

        if (ws === 1) {
          const z = this.seq[0];

          for (; i < inRaw.length; i++) {
            const b = inRaw[i];
            if (b !== z) out.push(b);
            else {
              if (i + 1 >= inRaw.length) {
                // marker at end; wait for count
                this._awaitCount = true;
                break;
              }
              const count = inRaw[++i];
              if (count === 0) throw new Error("Invalid ZeroRun stream: count cannot be 0.");
              for (let k = 0; k < count; k++) out.push(z);
            }
          }
        } else {
          // word mode: read either literal words or marker words + count
          for (; i < inRaw.length; ) {
            // If not enough bytes for a full word, it must be a split marker at the end,
            // but only valid if those bytes match the prefix of seq.
            if (i + ws > inRaw.length) {
              const remaining = inRaw.length - i;
              // remaining must match marker prefix
              for (let k = 0; k < remaining; k++) {
                if (inRaw[i + k] !== this.seq[k]) {
                  throw new Error("Invalid ZeroRun stream: truncated literal word.");
                }
              }
              this._pendingMarkerBytes = remaining;
              break;
            }

            if (!wordEquals(inRaw, i, this.seq)) {
              // literal word
              for (let k = 0; k < ws; k++) out.push(inRaw[i + k]);
              i += ws;
              continue;
            }

            // marker word; need count byte next
            i += ws;
            if (i >= inRaw.length) {
              this._awaitCount = true;
              break;
            }
            const count = inRaw[i++];
            if (count === 0) throw new Error("Invalid ZeroRun stream: count cannot be 0.");
            for (let r = 0; r < count; r++) for (let k = 0; k < ws; k++) out.push(0x00);
          }
        }

        this._appendAndSetResult(Uint8Array.from(out));

        if (final) {
          if (this._awaitCount) throw new Error("Invalid ZeroRun stream: missing count at end.");
          if (this._pendingMarkerBytes) throw new Error("Invalid ZeroRun stream: truncated marker at end.");
        }

        if (final && this._useHeader && this._padLen > 0 && this.result) {
          // Trim the padding bytes (added during Deflate).
          this.result = this.result.slice(0, this.result.length - this._padLen);
        }

        return true;
      } catch (e) {
        this.err = 1;
        this.msg = String(e && e.message ? e.message : e);
        this.result = undefined;
        return false;
      }
    }

    _appendAndSetResult(chunk) {
      this._outChunks.push(chunk);
      this._outLen += chunk.length;

      const joined = new Uint8Array(this._outLen);
      let off = 0;
      for (const c of this._outChunks) { joined.set(c, off); off += c.length; }

      // XOR-postprocess in word-xor mode
      if (this.pattern) xorWithPatternInPlace(joined, this.pattern);

      this.result = joined;
    }
  }

  class Deflate {
    constructor(opts = {}) {
      this.err = 0;
      this.msg = "";
      this.result = undefined;

      if (isArrayLike(opts.zero)) {
        this.pattern = toPattern(opts.zero);
        this.wordsize = this.pattern.length;
        this.seq = new Uint8Array(this.wordsize); // marker after XOR
        this.trailing = (opts.trailing === undefined) ? undefined : ((opts.trailing ?? 0) & 0xff);
        this._useHeader = (this.trailing !== undefined);
      } else {
        const z = (opts.zero ?? 0x00) & 0xff;
        this.pattern = null;
        this.wordsize = 1;
        this.seq = Uint8Array.of(z);
        this.trailing = undefined;
        this._useHeader = false;
      }

      this._wroteHeader = false;

      this._outChunks = [];
      this._outLen = 0;

      // pending run of marker-words
      this._runWords = 0;

      // buffer partial words between pushes
      this._partial = [];
    }

    push(data, final = false) {
      try {
        const inRaw = asU8(data) ?? new Uint8Array(0);
        const ws = this.wordsize;

        // Copy if we will XOR-transform (never mutate caller input)
        let inU8 = inRaw;
        if (this.pattern) {
          inU8 = new Uint8Array(inRaw);
          xorWithPatternInPlace(inU8, this.pattern);
        }

        // prepend any partial from previous push
        let combined;
        if (this._partial.length) {
          combined = new Uint8Array(this._partial.length + inU8.length);
          combined.set(this._partial, 0);
          combined.set(inU8, this._partial.length);
          this._partial = [];
        } else {
          combined = inU8;
        }

        const out = [];

        const flushRun = () => {
          while (this._runWords > 0) {
            const n = Math.min(255, this._runWords);
            // emit marker word (seq) + count byte
            for (let k = 0; k < ws; k++) out.push(this.seq[k]);
            out.push(n);
            this._runWords -= n;
          }
        };

        if (ws === 1) {
          const z = this.seq[0];

          for (let i = 0; i < combined.length; i++) {
            const b = combined[i];
            if (b === z) {
              this._runWords++;
              if (this._runWords === 255) flushRun();
            } else {
              if (this._runWords) flushRun();
              out.push(b);
            }
          }

          if (final && this._runWords) flushRun();
        } else {
          // Process full words; keep remainder for next push
          let fullLen = combined.length - (combined.length % ws);
          let rem = combined.length - fullLen;

          // If final and we have a remainder, optionally pad with trailing bytes (original domain)
          // We are already in XORed domain here, so we append XORed pad bytes consistent with phase.
          let padLen = 0;
          if (final && rem !== 0) {
            if (this.trailing === undefined) {
              throw new Error(`ZeroRun (word mode): input length must be multiple of wordsize (${ws}) on final push.`);
            }
            padLen = ws - rem;
            const padded = new Uint8Array(combined.length + padLen);
            padded.set(combined, 0);
            for (let p = 0; p < padLen; p++) {
              const phase = (combined.length + p) % ws;
              padded[combined.length + p] = ((this.trailing ^ this.pattern[phase]) & 0xff);
            }
            combined = padded;
            fullLen = combined.length;
            rem = 0;
          }

          // If final and header mode enabled, write header now (once)
          if (final && this._useHeader && !this._wroteHeader) {
            out.push(0x5A, padLen & 0xff);
            this._wroteHeader = true;
          }

          for (let i = 0; i < fullLen; i += ws) {
            if (wordEquals(combined, i, this.seq)) {
              this._runWords++;
              if (this._runWords === 255) flushRun();
            } else {
              if (this._runWords) flushRun();
              for (let k = 0; k < ws; k++) out.push(combined[i + k]);
            }
          }

          if (rem) {
            // store remainder bytes
            this._partial = Array.from(combined.slice(fullLen));
          }

          if (final) {
            if (this._partial.length) {
              throw new Error(`ZeroRun (word mode): input length must be multiple of wordsize (${ws}) on final push.`);
            }
            if (this._runWords) flushRun();
          }
        }

        const chunk = Uint8Array.from(out);
        this._outChunks.push(chunk);
        this._outLen += chunk.length;

        const joined = new Uint8Array(this._outLen);
        let off = 0;
        for (const c of this._outChunks) { joined.set(c, off); off += c.length; }

        // No XOR on compressed stream.
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
