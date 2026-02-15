/* TopToken (Top-4 tokenizer) - vanilla JS, no deps.
 *
 * Args:
 *   { top: [b0,b1,b2,b3] }   // most prevalent bytes, in order
 *
 * Format (no header for 'top' since it is provided as args):
 *   - 4-byte little-endian original length (uint32)
 *   - bitstream:
 *       symbol (3 bits):
 *         0..3 => output corresponding top byte
 *         4    => ESC: next 8 bits are literal byte
 *         5..7 unused (reserved)
 *   - bit packing: MSB-first within each output byte.
 *
 * Notes:
 *   - Intended for lab use; implemented as "buffer until final push".
 *   - result is Uint8Array.
 */
const TopToken = (() => {
  function asU8(input) {
    if (input == null) return null;
    if (input instanceof Uint8Array) return input;
    if (input instanceof ArrayBuffer) return new Uint8Array(input);
    if (ArrayBuffer.isView(input) && input.buffer) {
      return new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
    }
    throw new TypeError("TopToken expects ArrayBuffer or Uint8Array (or a view).");
  }

  function parseTop(args) {
    const top = args && args.top;
    if (!Array.isArray(top) || top.length !== 4) {
      throw new Error("TopToken requires args.top as an array of 4 byte values, e.g. {top:[0x20,0xE2,0x94,0x80]}");
    }
    return top.map(x => (Number(x) & 0xff));
  }

  function u32le(n) {
    return new Uint8Array([n & 0xff, (n >>> 8) & 0xff, (n >>> 16) & 0xff, (n >>> 24) & 0xff]);
  }
  function readU32le(u8, off) {
    return (u8[off] | (u8[off+1] << 8) | (u8[off+2] << 16) | (u8[off+3] << 24)) >>> 0;
  }

  class BitWriter {
    constructor() {
      this.bytes = [];
      this.acc = 0;
      this.bits = 0; // number of bits currently in acc (0..7)
    }
    writeBits(value, bitCount) {
      // MSB-first packing into bytes.
      for (let i = bitCount - 1; i >= 0; i--) {
        const bit = (value >>> i) & 1;
        this.acc = (this.acc << 1) | bit;
        this.bits++;
        if (this.bits === 8) {
          this.bytes.push(this.acc & 0xff);
          this.acc = 0;
          this.bits = 0;
        }
      }
    }
    finish() {
      if (this.bits > 0) {
        this.acc <<= (8 - this.bits);
        this.bytes.push(this.acc & 0xff);
        this.acc = 0;
        this.bits = 0;
      }
      return Uint8Array.from(this.bytes);
    }
  }

  class BitReader {
    constructor(u8, offset=0) {
      this.u8 = u8;
      this.i = offset;
      this.acc = 0;
      this.bits = 0;
    }
    readBit() {
      if (this.bits === 0) {
        if (this.i >= this.u8.length) throw new Error("Unexpected end of bitstream.");
        this.acc = this.u8[this.i++];
        this.bits = 8;
      }
      const bit = (this.acc >>> (this.bits - 1)) & 1; // MSB-first
      this.bits--;
      return bit;
    }
    readBits(n) {
      let v = 0;
      for (let k = 0; k < n; k++) v = (v << 1) | this.readBit();
      return v >>> 0;
    }
  }

  class Deflate {
    constructor(args = {}) {
      this.args = args;
      this.err = 0;
      this.msg = "";
      this.result = undefined;
      this._chunks = [];
      this._len = 0;
    }
    push(data, final = false) {
      try {
        const u8 = asU8(data);
        if (u8 && u8.length) { this._chunks.push(u8); this._len += u8.length; }
        if (!final) return true;

        const top = parseTop(this.args);
        const map = new Int16Array(256);
        for (let i = 0; i < 256; i++) map[i] = -1;
        for (let k = 0; k < 4; k++) map[top[k]] = k;

        const bw = new BitWriter();
        // tokens
        for (const c of this._chunks) {
          for (let i = 0; i < c.length; i++) {
            const b = c[i];
            const idx = map[b];
            if (idx >= 0) {
              bw.writeBits(idx, 3);
            } else {
              bw.writeBits(4, 3);      // ESC
              bw.writeBits(b, 8);      // literal byte
            }
          }
        }

        const body = bw.finish();
        const header = u32le(this._len);
        const out = new Uint8Array(header.length + body.length);
        out.set(header, 0);
        out.set(body, header.length);
        this.result = out;
        return true;
      } catch (e) {
        this.err = 1;
        this.msg = String(e && e.message ? e.message : e);
        this.result = undefined;
        return false;
      }
    }
  }

  class Inflate {
    constructor(args = {}) {
      this.args = args;
      this.err = 0;
      this.msg = "";
      this.result = undefined;
      this._chunks = [];
      this._len = 0;
    }
    push(data, final = false) {
      try {
        const u8 = asU8(data);
        if (u8 && u8.length) { this._chunks.push(u8); this._len += u8.length; }
        if (!final) return true;

        const top = parseTop(this.args);

        // Join compressed chunks
        const comp = new Uint8Array(this._len);
        let off = 0;
        for (const c of this._chunks) { comp.set(c, off); off += c.length; }

        if (comp.length < 4) throw new Error("Invalid TopToken stream: missing length header.");
        const outLen = readU32le(comp, 0);

        const br = new BitReader(comp, 4);
        const out = new Uint8Array(outLen);
        let o = 0;

        while (o < outLen) {
          const sym = br.readBits(3);
          if (sym <= 3) {
            out[o++] = top[sym];
          } else if (sym === 4) {
            out[o++] = br.readBits(8) & 0xff;
          } else {
            throw new Error("Invalid TopToken stream: reserved symbol encountered.");
          }
        }

        this.result = out;
        return true;
      } catch (e) {
        this.err = 1;
        this.msg = String(e && e.message ? e.message : e);
        this.result = undefined;
        return false;
      }
    }
  }

  return { Deflate, Inflate };
})();

// Expose as a classic-script global (like pako does).
// Note: a top-level `const` does NOT create `window.TopToken`, so the lab's
// availability check (`typeof window.TopToken !== "undefined"`) would fail.
// Using `globalThis` keeps it working in browsers and other JS runtimes.
globalThis.TopToken = TopToken;