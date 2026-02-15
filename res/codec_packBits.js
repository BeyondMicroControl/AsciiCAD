const PackBits = (() => {
  function asU8(input) {
    if (input == null) return null;
    if (input instanceof Uint8Array) return input;
    if (input instanceof ArrayBuffer) return new Uint8Array(input);
    if (ArrayBuffer.isView(input) && input.buffer) {
      return new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
    }
    throw new TypeError("PackBits expects ArrayBuffer or Uint8Array (or a view).");
  }

  function concatChunks(chunks, totalLen) {
    const out = new Uint8Array(totalLen);
    let off = 0;
    for (const c of chunks) {
      out.set(c, off);
      off += c.length;
    }
    return out;
  }

  // ------- Inflate (decompress) -------
  class Inflate {
    constructor() {
      this.err = 0;
      this.msg = "";
      this.result = undefined;

      this._outChunks = [];
      this._outLen = 0;

      // streaming state
      this._needCtrl = true;
      this._ctrl = 0;

      // For literals: need N bytes
      this._litRemaining = 0;
      this._litBuf = []; // gather if split across chunks

      // For runs: need 1 byte value
      this._needRunByte = false;
      this._runCount = 0;
    }

    push(data /*, modeIgnored */) {
      try {
        const inU8 = asU8(data) ?? new Uint8Array(0);
        const out = [];

        let i = 0;

        // Helper: flush any accumulated literal buffer
        const flushLitBuf = () => {
          if (this._litBuf.length) {
            for (let k = 0; k < this._litBuf.length; k++) out.push(this._litBuf[k]);
            this._litBuf.length = 0;
          }
        };

        while (i < inU8.length) {
          // If we are in the middle of collecting literal bytes
          if (this._litRemaining > 0) {
            const take = Math.min(this._litRemaining, inU8.length - i);
            // push directly
            for (let k = 0; k < take; k++) out.push(inU8[i + k]);
            i += take;
            this._litRemaining -= take;
            if (this._litRemaining === 0) {
              // done with literal block
              this._needCtrl = true;
            }
            continue;
          }

          // If we are waiting for the run byte
          if (this._needRunByte) {
            if (i >= inU8.length) break;
            const b = inU8[i++];
            for (let k = 0; k < this._runCount; k++) out.push(b);
            this._needRunByte = false;
            this._needCtrl = true;
            continue;
          }

          // Need a new control byte
          if (this._needCtrl) {
            if (i >= inU8.length) break;
            this._ctrl = inU8[i++];
            this._needCtrl = false;

            // Interpret as signed int8
            const n = (this._ctrl << 24) >> 24;

            if (n >= 0 && n <= 127) {
              // literal block of (n+1) bytes
              this._litRemaining = n + 1;
              // loop continues, will read literals
              continue;
            } else if (n >= -127 && n <= -1) {
              // run block: repeat next byte (1 - n) times
              this._runCount = 1 - n;
              this._needRunByte = true;
              continue;
            } else {
              // n == -128 => NOP
              this._needCtrl = true;
              continue;
            }
          }
        }

        flushLitBuf();

        const chunk = Uint8Array.from(out);
        this._outChunks.push(chunk);
        this._outLen += chunk.length;

        this.result = concatChunks(this._outChunks, this._outLen);
        return true;
      } catch (e) {
        this.err = 1;
        this.msg = String(e && e.message ? e.message : e);
        this.result = undefined;
        return false;
      }
    }
  }

  // ------- Deflate (compress) -------
  class Deflate {
    constructor() {
      this.err = 0;
      this.msg = "";
      this.result = undefined;

      this._outChunks = [];
      this._outLen = 0;

      // pending literals across chunks
      this._lit = [];

      // pending run across chunks
      this._runByte = -1;
      this._runLen = 0;

      // last byte seen (for run detection)
      this._prev = -1;
      this._havePrev = false;
    }

    push(data, final = false) {
      try {
        const inU8 = asU8(data) ?? new Uint8Array(0);
        const out = [];

        const flushLiterals = () => {
          let idx = 0;
          while (idx < this._lit.length) {
            const n = Math.min(128, this._lit.length - idx); // max 128 literals
            out.push((n - 1) & 0xff);
            for (let k = 0; k < n; k++) out.push(this._lit[idx + k]);
            idx += n;
          }
          this._lit.length = 0;
        };

        const flushRun = () => {
          // runLen is 1..128 max per packet
          let remaining = this._runLen;
          while (remaining > 0) {
            const n = Math.min(128, remaining);
            // control byte = 1 - n (signed), encoded as uint8
            const ctrl = (1 - n) & 0xff;
            out.push(ctrl, this._runByte & 0xff);
            remaining -= n;
          }
          this._runLen = 0;
          this._runByte = -1;
        };

        // Move current run into output if it’s “good”, else move into literals
        const commitRunOrLit = () => {
          if (this._runLen >= 3) {
            // beneficial as run packet
            flushLiterals();
            flushRun();
          } else if (this._runLen > 0) {
            // not worth it: dump as literals
            for (let k = 0; k < this._runLen; k++) this._lit.push(this._runByte);
            this._runLen = 0;
            this._runByte = -1;
          }
        };

        for (let i = 0; i < inU8.length; i++) {
          const b = inU8[i];

          if (!this._havePrev) {
            this._prev = b;
            this._havePrev = true;
            this._runByte = b;
            this._runLen = 1;
            continue;
          }

          if (b === this._runByte) {
            // continue run
            this._runLen++;

            // PackBits run packet max is 128
            if (this._runLen === 128) {
              // commit immediately (as run, since len=128 >=3)
              commitRunOrLit();
              // start new run with current byte (still same byte, but we committed full 128)
              this._runByte = b;
              this._runLen = 0; // will be incremented below
            }
            continue;
          } else {
            // byte changed: commit previous run appropriately
            commitRunOrLit();

            // start new run with current byte
            this._runByte = b;
            this._runLen = 1;
            this._prev = b;
          }

          // If literals got too big, flush in chunks
          if (this._lit.length >= 128) flushLiterals();
        }

        if (final) {
          // commit remaining run and literals
          commitRunOrLit();
          flushLiterals();
        } else {
          // If not final, keep state (run/lit) for next push.
          // But if literals buffer is huge, flush to avoid memory growth.
          if (this._lit.length > 256) flushLiterals();
        }

        const chunk = Uint8Array.from(out);
        this._outChunks.push(chunk);
        this._outLen += chunk.length;

        this.result = concatChunks(this._outChunks, this._outLen);
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
