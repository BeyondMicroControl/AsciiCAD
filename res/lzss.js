/* lzss_v2.js - Vanilla JS LZSS with variable windowBits (up to 15) and pako-like API
 *
 * Differences vs earlier lzss.js:
 * - Supports windowBits 9..15.
 * - Compressed stream header includes: [u32 origLen LE][u8 windowBits][u8 threshold][u8 lookahead]
 * - Token groups: 1 flag byte + up to 8 tokens (LSB-first)
 *   - literal token: 1 byte
 *   - match token: 2 bytes when windowBits<=12, else 3 bytes
 *
 * Match encoding:
 *   If windowBits <= 12:
 *     offset: 12 bits (1..2^windowBits-1), lenNib: 4 bits (len-threshold, 0..15)
 *     b1 = offset & 0xFF
 *     b2 = ((offset>>8)&0x0F) | ((lenNib&0x0F)<<4)
 *     maxLen = threshold + 15
 *
 *   If windowBits 13..15:
 *     offset: up to 15 bits, lenNib: 5 bits (len-threshold, 0..31)
 *     b1 = offset & 0xFF
 *     b2 = (offset>>8) & 0xFF
 *     b3 = ((offset>>16)&0x07) | ((lenNib&0x1F)<<3)
 *     maxLen = threshold + 31
 *
 * Notes:
 * - Buffers all input until final=true (lab tool).
 */

(function (global) {
  "use strict";

  function asU8(input) {
    if (input == null) return null;
    if (input instanceof Uint8Array) return input;
    if (input instanceof ArrayBuffer) return new Uint8Array(input);
    if (ArrayBuffer.isView(input) && input.buffer) {
      return new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
    }
    throw new TypeError("LZSS expects Uint8Array, ArrayBuffer, or a view.");
  }

  function concatU8(chunks, total) {
    const out = new Uint8Array(total);
    let off = 0;
    for (const c of chunks) { out.set(c, off); off += c.length; }
    return out;
  }

  function writeU32LE(n) {
    const a = new Uint8Array(4);
    a[0] = n & 0xFF;
    a[1] = (n >>> 8) & 0xFF;
    a[2] = (n >>> 16) & 0xFF;
    a[3] = (n >>> 24) & 0xFF;
    return a;
  }

  function readU32LE(u8, off) {
    return (u8[off] | (u8[off + 1] << 8) | (u8[off + 2] << 16) | (u8[off + 3] << 24)) >>> 0;
  }

  function makeKey(u8, i) {
    return (u8[i] << 16) | (u8[i + 1] << 8) | u8[i + 2];
  }

  function lzssCompress(u8, opts) {
    const windowBits = opts.windowBits ?? 12;
    if (windowBits < 9 || windowBits > 15) throw new Error("windowBits must be 9..15");

    const windowSize = 1 << windowBits;
    const threshold = opts.threshold ?? 3;
    if (threshold < 2 || threshold > 15) throw new Error("threshold must be 2..15");

    const lookahead = opts.lookahead ?? 18;

    const lenNibBits = (windowBits <= 12) ? 4 : 5;
    const maxLen = Math.min(lookahead, threshold + ((1 << lenNibBits) - 1));

    if (maxLen < threshold) throw new Error("lookahead too small");

    const out = [];
    // header
    out.push(...writeU32LE(u8.length));
    out.push(windowBits & 0xFF, threshold & 0xFF, lookahead & 0xFF);

    const dict = new Map();
    const maxCandidates = opts.maxCandidates ?? 64;

    function dictAdd(pos) {
      if (pos + 2 >= u8.length) return;
      const key = makeKey(u8, pos);
      let arr = dict.get(key);
      if (!arr) { arr = []; dict.set(key, arr); }
      arr.push(pos);
      if (arr.length > maxCandidates) arr.splice(0, arr.length - maxCandidates);
    }

    function dictPrune(minPos) {
      for (const [k, arr] of dict.entries()) {
        while (arr.length && arr[0] < minPos) arr.shift();
        if (arr.length === 0) dict.delete(k);
      }
    }

    let i = 0;
    let sincePrune = 0;

    while (i < u8.length) {
      let flags = 0;
      const tokenBytes = [];

      for (let bit = 0; bit < 8 && i < u8.length; bit++) {
        let bestLen = 0;
        let bestOff = 0;

        const minPos = Math.max(0, i - (windowSize - 1));

        if (i + 2 < u8.length) {
          const key = makeKey(u8, i);
          const candidates = dict.get(key);
          if (candidates && candidates.length) {
            for (let ci = candidates.length - 1; ci >= 0; ci--) {
              const pos = candidates[ci];
              if (pos < minPos) break;

              const off = i - pos;
              if (off <= 0 || off >= windowSize) continue;

              let L = 3;
              const maxTest = Math.min(maxLen, u8.length - i);
              while (L < maxTest && u8[pos + L] === u8[i + L]) L++;

              if (L > bestLen) {
                bestLen = L;
                bestOff = off;
                if (bestLen === maxTest) break;
              }
              if (bestLen === maxLen) break;
            }
          }
        }

        if (bestLen >= threshold) {
          const lenNib = bestLen - threshold;

          if (windowBits <= 12) {
            // 2-byte match
            tokenBytes.push(bestOff & 0xFF);
            tokenBytes.push(((bestOff >>> 8) & 0x0F) | ((lenNib & 0x0F) << 4));
          } else {
            // 3-byte match
            tokenBytes.push(bestOff & 0xFF);
            tokenBytes.push((bestOff >>> 8) & 0xFF);
            tokenBytes.push(((bestOff >>> 16) & 0x07) | ((lenNib & 0x1F) << 3));
          }

          for (let k = 0; k < bestLen; k++) dictAdd(i + k);
          i += bestLen;
        } else {
          flags |= (1 << bit);
          tokenBytes.push(u8[i]);
          dictAdd(i);
          i += 1;
        }

        sincePrune++;
        if (sincePrune >= 2048) {
          dictPrune(Math.max(0, i - (windowSize - 1)));
          sincePrune = 0;
        }
      }

      out.push(flags);
      out.push(...tokenBytes);
    }

    return Uint8Array.from(out);
  }

  function lzssDecompress(u8, opts) {
    if (u8.length < 7) throw new Error("Truncated input (missing header).");
    const outLen = readU32LE(u8, 0);
    const windowBits = u8[4];
    const threshold = u8[5];
    const lookahead = u8[6];

    if (windowBits < 9 || windowBits > 15) throw new Error("Invalid windowBits in stream: " + windowBits);
    if (threshold < 2 || threshold > 15) throw new Error("Invalid threshold in stream: " + threshold);

    const windowSize = 1 << windowBits;
    const lenNibBits = (windowBits <= 12) ? 4 : 5;
    const maxLen = Math.min(lookahead, threshold + ((1 << lenNibBits) - 1));

    const out = new Uint8Array(outLen);
    let outPos = 0;
    let i = 7;

    while (outPos < outLen) {
      if (i >= u8.length) throw new Error("Truncated input (missing flags).");
      const flags = u8[i++];

      for (let bit = 0; bit < 8 && outPos < outLen; bit++) {
        const isLit = (flags >>> bit) & 1;
        if (isLit) {
          if (i >= u8.length) throw new Error("Truncated input (literal).");
          out[outPos++] = u8[i++];
        } else {
          let off = 0;
          let len = 0;

          if (windowBits <= 12) {
            if (i + 1 >= u8.length) throw new Error("Truncated input (match).");
            const b1 = u8[i++], b2 = u8[i++];
            off = b1 | ((b2 & 0x0F) << 8);
            len = threshold + (b2 >>> 4);
          } else {
            if (i + 2 >= u8.length) throw new Error("Truncated input (match).");
            const b1 = u8[i++], b2 = u8[i++], b3 = u8[i++];
            off = b1 | (b2 << 8) | ((b3 & 0x07) << 16);
            len = threshold + (b3 >>> 3);
          }

          if (off <= 0 || off >= windowSize) throw new Error("Invalid match offset: " + off);
          if (len < threshold || len > maxLen) throw new Error("Invalid match length: " + len);

          let src = outPos - off;
          if (src < 0) throw new Error("Match references before output start.");

          for (let k = 0; k < len && outPos < outLen; k++) {
            out[outPos++] = out[src++];
          }
        }
      }
    }

    return out;
  }

  class Deflate {
    constructor(opts = {}) {
      this.opts = opts;
      this.err = 0; this.msg = ""; this.result = undefined;
      this._chunks = []; this._len = 0;
    }
    push(data, final = false) {
      try {
        const u = asU8(data);
        if (u && u.length) { this._chunks.push(u); this._len += u.length; }
        if (!final) return true;
        const input = this._chunks.length === 1 ? this._chunks[0] : concatU8(this._chunks, this._len);
        this.result = lzssCompress(input, this.opts);
        return true;
      } catch (e) {
        this.err = 1; this.msg = String(e && e.message ? e.message : e); this.result = undefined;
        return false;
      }
    }
  }

  class Inflate {
    constructor(opts = {}) {
      this.opts = opts;
      this.err = 0; this.msg = ""; this.result = undefined;
      this._chunks = []; this._len = 0;
    }
    push(data, final = false) {
      try {
        const u = asU8(data);
        if (u && u.length) { this._chunks.push(u); this._len += u.length; }
        if (!final) return true;
        const input = this._chunks.length === 1 ? this._chunks[0] : concatU8(this._chunks, this._len);
        this.result = lzssDecompress(input, this.opts);
        return true;
      } catch (e) {
        this.err = 1; this.msg = String(e && e.message ? e.message : e); this.result = undefined;
        return false;
      }
    }
  }

  const LZSS = { Deflate, Inflate };
  global.LZSS = LZSS;
})(typeof globalThis !== "undefined" ? globalThis : (typeof window !== "undefined" ? window : this));
