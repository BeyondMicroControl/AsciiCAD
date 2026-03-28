function GASC()
{
    this.gpu = null;
    this.failed = false;

    this.OVERLAY_NONE = 0;
    this.OVERLAY_RED  = 1;
    this.OVERLAY_BLUE = 2;

    this.MAX_RECTS = 4096;
    this.rectScratch = new Float32Array(this.MAX_RECTS * 4);


    // Call function
    this.rasterizeRectsOverlay = function(rects, rows, cols)
    {
        if (!rects || !rects.length) return null;

        const ret = this.runGPU(
        {   mode: 'gpu'},
        {   output: [cols, rows],
            loopMaxIterations:  this.MAX_RECTS,
            precision:          "single",
            graphical: false, pipeline: false, immutable: true, dynamicArguments: true,
            kScript:            this.rasterizeRectsOverlay.kScript,  // <-- input kernel script
            kObject:            this.rasterizeRectsOverlay.kObject   // --> output kernel object
        },
        {"COLS":[cols],"ROWS":[rows]});

        if (ret==false) return null;

        try
        {
            if ((rects.length / 4) > this.MAX_RECTS)
                console.warn("AsciiCAD GPU overlay truncated rect list to MAX_RECTS = " + this.MAX_RECTS);

            const rectCount = Math.min((rects.length / 4) | 0, this.MAX_RECTS);
            const rectBuf = this.rectScratch;

            rectBuf.fill(0);
            for (let i = 0; i < rectCount * 4; i++) rectBuf[i] = rects[i];

             // caution: this.rasterizeRectsOverlay.kObject appears to contain string "Error: not enough arguments for kernel"
             // This is normal behavior. When calling with arguments, GPU kicks in (this.rasterizeRectsOverlay.kObject object resides in the GPU, not accessible by CPU)
            const ret = this.rasterizeRectsOverlay.kObject(rectBuf, rectCount); 
            return ret;
        }
        catch (e) { console.warn("AsciiCAD GPU overlay kernel failed; falling back to CPU.", e); return null; }
    };

    // Kernel object
    this.rasterizeRectsOverlay.kObject = null;

    // Kernel script
    this.rasterizeRectsOverlay.kScript = function(rects, rectCount)
    {
        const r = this.thread.y;
        const c = this.thread.x;

        let state = 0;
        for (let i = 0; i < 4096; i++)
        {
            if (i >= rectCount) break;
            const base = i << 2;
            const r0 = rects[base + 0];
            const c0 = rects[base + 1];
            const r1 = rects[base + 2];
            const c1 = rects[base + 3];
            if (r < r0 || r > r1 || c < c0 || c > c1) continue;
            if (r === r0 || r === r1 || c === c0 || c === c1) return 1;
            state = 2;
        }

        return state;
    }

    this.computeHighlightOverlay = function(ascii2D, rows, cols)
    {
        if (!ascii2D || !rows || !cols) return null;

        const CFG_COLS_LO = 0;
        const CFG_COLS_HI = 1;
        const CFG_ROWS_LO = 2;
        const CFG_ROWS_HI = 3;
        const CFG_LUT_BASE = 8;        // leave a few spare bytes for flags later
        const LUT_CP0 = 0x2500;        // Box Drawing block
        const LUT_LEN = 0x80;          // 0x2500..0x257F inclusive

        const ascii16 = oCOM.packAscii16(ascii2D, rows, cols);
        const cfg8 = new Uint8Array(CFG_LUT_BASE + LUT_LEN);

        cfg8[CFG_COLS_LO] = cols & 0xFF;
        cfg8[CFG_COLS_HI] = (cols >>> 8) & 0xFF;
        cfg8[CFG_ROWS_LO] = rows & 0xFF;
        cfg8[CFG_ROWS_HI] = (rows >>> 8) & 0xFF;

        for (let cp = LUT_CP0; cp < LUT_CP0 + LUT_LEN; cp++) 
        {
            const ch = String.fromCharCode(cp);
            cfg8[CFG_LUT_BASE + (cp - LUT_CP0)] = oASC.glyph2mask(ch) & 0xFF;
        }

        const ok = this.runGPU(
            this.computeHighlightOverlay,
            { mode: "gpu" },
            {
            output: [cols, rows],
            loopMaxIterations: 512,
            precision: "single",
            graphical: false,
            pipeline: false,
            immutable: true,
            dynamicArguments: true
            },
            {
            ascii16: [ascii16],
            cfg8: [cfg8]
            }
        );

        if (ok === false) return null;

        try
        {
            return this.computeHighlightOverlay.kObject(ascii16, cfg8);
        }
        catch (e)
        {
            console.warn("AsciiCAD GPU computeHighlightOverlay failed; falling back to CPU.", e);
            return null;
        }
    };

    this.computeHighlightOverlay.kObject = null;

    this.computeHighlightOverlay.kScript = function(ascii16, cfg8)
    {
        const cols = cfg8[0] | (cfg8[1] << 8);
        const rows = cfg8[2] | (cfg8[3] << 8);

        const CFG_LUT_BASE = 8;
        const LUT_CP0 = 9472;   // 0x2500
        const LUT_CP1 = 9599;   // 0x257F

        const N = 1, E = 2, S = 4, W = 8;

        const CH_TL = 9556; // ╔
        const CH_TR = 9559; // ╗
        const CH_BL = 9562; // ╚
        const CH_BR = 9565; // ╝

        const r = this.thread.y;
        const c = this.thread.x;

        let state = 0;

        for (let r0 = 0; r0 <= r; r0++)
        for (let c0 = 0; c0 <= c; c0++)
        {
            const iTL = r0 * cols + c0;
            if (ascii16[iTL] !== CH_TL) continue;

            for (let c1 = c; c1 < cols; c1++)
            {
            if (c1 <= c0 + 1) continue;
            if (ascii16[r0 * cols + c1] !== CH_TR) continue;

            for (let r1 = r; r1 < rows; r1++)
            {
                if (r1 <= r0 + 1) continue;
                if (ascii16[r1 * cols + c0] !== CH_BL) continue;
                if (ascii16[r1 * cols + c1] !== CH_BR) continue;
                if (r < r0 || r > r1 || c < c0 || c > c1) continue;

                let valid = 1;

                for (let x = c0 + 1; x < c1; x++)
                {
                let chTop = ascii16[r0 * cols + x];
                let mTop = 0;
                if (chTop >= LUT_CP0 && chTop <= LUT_CP1) mTop = cfg8[CFG_LUT_BASE + (chTop - LUT_CP0)] | 0;
                let loTop = mTop & 15;
                let hiTop = (mTop >> 4) & 15;
                if (((loTop & (E | W)) === 0) || ((hiTop & (E | W)) === 0)) { valid = 0; break; }

                let chBot = ascii16[r1 * cols + x];
                let mBot = 0;
                if (chBot >= LUT_CP0 && chBot <= LUT_CP1) mBot = cfg8[CFG_LUT_BASE + (chBot - LUT_CP0)] | 0;
                let loBot = mBot & 15;
                let hiBot = (mBot >> 4) & 15;
                if (((loBot & (E | W)) === 0) || ((hiBot & (E | W)) === 0)) { valid = 0; break; }
                }
                if (valid === 0) continue;

                for (let y = r0 + 1; y < r1; y++)
                {
                let chLeft = ascii16[y * cols + c0];
                let mLeft = 0;
                if (chLeft >= LUT_CP0 && chLeft <= LUT_CP1) mLeft = cfg8[CFG_LUT_BASE + (chLeft - LUT_CP0)] | 0;
                let loLeft = mLeft & 15;
                let hiLeft = (mLeft >> 4) & 15;
                if (((loLeft & (N | S)) === 0) || ((hiLeft & (N | S)) === 0)) { valid = 0; break; }

                let chRight = ascii16[y * cols + c1];
                let mRight = 0;
                if (chRight >= LUT_CP0 && chRight <= LUT_CP1) mRight = cfg8[CFG_LUT_BASE + (chRight - LUT_CP0)] | 0;
                let loRight = mRight & 15;
                let hiRight = (mRight >> 4) & 15;
                if (((loRight & (N | S)) === 0) || ((hiRight & (N | S)) === 0)) { valid = 0; break; }
                }
                if (valid === 0) continue;

                if (r === r0 || r === r1 || c === c0 || c === c1) return 1;
                state = 2;
            }
            }
        }

        return state;
    };



    this.glyph2mask = function()
    {
        return this.glyph2mask_x2();
    };
    this.glyph2mask.help =   
    {
        type: "CADScript_FN",
        usage: "glyph2mask()",
        desc:
        "Translate a wire glyph into an 8-bit mask: low nibble=thin(single/light), high nibble=fat(single/heavy). " +
        "Double wires set both nibbles. Mixed glyphs split directions between thin/fat using a lookup table.  " +
        "Alias glyphs are alternative glyphs for the same (bit)mapping, e.g. '┼' and '+' both map to N|E|S|W.",
        examples: [
        "oTERM.print(oGASC.glyph2mask(),\"array\")"
        ]
    }

    this.glyph2mask.kObject = null;

    this.glyph2mask.kScript = function(ascii16, cfg8)
    {
        const cols = cfg8[0] | (cfg8[1] << 8);
        const CFG_LUT_BASE = 8;
        const LUT_CP0 = 9472; // 0x2500
        const LUT_CP1 = 9599; // 0x257F

        const r = this.thread.y;
        const c = this.thread.x;
        const idx = r * cols + c;

        const ch = ascii16[idx] | 0;

        if (ch < LUT_CP0 || ch > LUT_CP1) return 0;

        return cfg8[CFG_LUT_BASE + (ch - LUT_CP0)] | 0;
    };


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



    this.glyph2mask_x1 = function()
    {
        const ascii16 = oCOM.packAscii16(ascii, ROWS, COLS);

        // SERIALISE CFG parameters for kernel
        var stack = [];
        stack.push((ROWS >>> 8) & 0xFF); stack.push(ROWS & 0xFF);
        stack.push((COLS >>> 8) & 0xFF); stack.push(COLS & 0xFF);
        stack.push(stack.length+1);
        stack = stack.reverse();
        stack.push(...oASC.G2M_CACHE);
        const cfg8 = Uint8Array.from(stack);
        //oTERM.print(cfg8,"array");

        if (!ascii16 || !cfg8) return null;

        const ok = this.runGPU(
            this.glyph2mask_x1,
            { mode: "gpu" },
            {
                output: [COLS, ROWS],
                precision: "single",
                graphical: false,
                pipeline: false,
                immutable: true,
                dynamicArguments: true
            },
            {
                ascii16: [ascii16],
                cfg8: [cfg8]
            }
        );
        if (ok === false) return null;

        try
        {
            var ret = this.glyph2mask_x1.kObject(ascii16, cfg8);
            var bytes = this.unpackGlyph2Mask_x1(ret,ROWS,COLS);
            if(bDebug)
            {
                console.log("(x1) ret.length="+ret.length);
                console.log("(x1) bytes.length="+bytes.length);
                console.log("(x1) CRC="+oCOM.crc32(bytes).toString(16));
            }
            return bytes;
        }
        catch (e)
        {
            console.warn("AsciiCAD GPU glyph2mask failed.", e);
            return null;
        }
    };

    this.glyph2mask_x1.kObject = null;

    this.glyph2mask_x1.kScript = function(ascii16, cfg8)
    {
        // DE-SERIALISE CFG parameters
        const CFG_LUT_BASE = cfg8[0];
        const cols = cfg8[1] | (cfg8[2] << 8);
        //const rows = cfg8[3] | (cfg8[4] << 8);

        const LUT_CP0 = 9472; // 0x2500
        const LUT_CP1 = 9599; // 0x257F

        const idx = this.thread.y * cols + this.thread.x;
        const ch = ascii16[idx] | 0;

        if (ch < LUT_CP0 || ch > LUT_CP1) return 0;

        return cfg8[CFG_LUT_BASE + (ch - LUT_CP0)] | 0;
    };

    this.unpackGlyph2Mask_x1 = function(packed2D, rows, cols)
    {
        return Uint8Array.from(packed2D.flatMap(row => Array.from(row)))
    };


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    this.glyph2mask_x2 = function()
    {
        const ascii16 = oCOM.packAscii16(ascii, ROWS, COLS);

        const CFG_COLS_LO = 0;
        const CFG_COLS_HI = 1;
        const CFG_ROWS_LO = 2;
        const CFG_ROWS_HI = 3;
        const CFG_PACK_LO = 4;
        const CFG_PACK_HI = 5;
        const CFG_LUT_BASE = 8;
        const LUT_CP0 = 0x2500;
        const LUT_LEN = 0x80;

        // 2 output bytes packed into 1 scalar
        const packedCols = (COLS + 1) >> 1;

        const cfg8 = new Uint8Array(CFG_LUT_BASE + LUT_LEN);
        cfg8[CFG_COLS_LO] = COLS & 0xFF;
        cfg8[CFG_COLS_HI] = (COLS >>> 8) & 0xFF;
        cfg8[CFG_ROWS_LO] = ROWS & 0xFF;
        cfg8[CFG_ROWS_HI] = (ROWS >>> 8) & 0xFF;
        cfg8[CFG_PACK_LO] = packedCols & 0xFF;
        cfg8[CFG_PACK_HI] = (packedCols >>> 8) & 0xFF;

        for (let cp = LUT_CP0; cp < LUT_CP0 + LUT_LEN; cp++)
        {
            const ch = String.fromCharCode(cp);
            cfg8[CFG_LUT_BASE + (cp - LUT_CP0)] = oASC.glyph2mask(ch) & 0xFF;
        }

        if (!ascii16 || !cfg8) return null;

        const ok = this.runGPU(
            this.glyph2mask_x2,
            { mode: "gpu" },
            {
                output: [packedCols, ROWS],
                precision: "single",
                graphical: false,
                pipeline: false,
                immutable: true,
                dynamicArguments: true
            },
            { ascii16: [ascii16], cfg8: [cfg8] }
        );

        if (ok === false) return null;

        try
        {
            var ret = this.glyph2mask_x2.kObject(ascii16, cfg8);
            var bytes = this.unpackGlyph2Mask_x2(ret, ROWS, COLS);
            if(bDebug)
            {
                console.log("(x2) ret.length=" + ret.length);
                console.log("(x2) bytes.length=" + bytes.length);
                console.log("(x2) CRC=" + oCOM.crc32(bytes).toString(16));
            }
            return bytes;
        }
        catch (e)
        {
            console.warn("AsciiCAD GPU glyph2mask failed.", e);
            return null;
        }
    };

    this.glyph2mask_x2.kObject = null;

    this.glyph2mask_x2.kScript = function(ascii16, cfg8)
    {
        const cols = cfg8[0] | (cfg8[1] << 8);
        const CFG_LUT_BASE = 8;
        const LUT_CP0 = 9472;       // 0x2500
        const LUT_CP1 = 9599;       // 0x257F

        const r = this.thread.y;
        const packedX = this.thread.x;
        const c0 = packedX << 1;   // 2 columns per packed output

        let m0 = 0, m1 = 0;

        let c = c0;
        if (c < cols) {
            let ch = ascii16[r * cols + c] | 0;
            if (ch >= LUT_CP0 && ch <= LUT_CP1) {
                m0 = cfg8[CFG_LUT_BASE + (ch - LUT_CP0)] | 0;
            }
        }

        c = c0 + 1;
        if (c < cols) {
            let ch = ascii16[r * cols + c] | 0;
            if (ch >= LUT_CP0 && ch <= LUT_CP1) {
                m1 = cfg8[CFG_LUT_BASE + (ch - LUT_CP0)] | 0;
            }
        }

        return m0 | (m1<< 8);
    };

    this.unpackGlyph2Mask_x2 = function(packed2D, rows, cols)
    {
        const out = new Uint8Array(rows * cols);
        const packedCols = (cols + 1) >> 1;
        const tmp16 = new Uint16Array(packedCols);
        const tmp8  = new Uint8Array(tmp16.buffer);

        for (let r = 0; r < rows; r++)
        {
            const row = packed2D[r];   // usually Float32Array from GPU.js
            tmp16.set(row);            // float32 -> uint16 conversion
            out.set(tmp8.subarray(0, cols), r * cols);
        }

        return out;
    };


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

this.glyph2mask_x3 = function() {
  const ascii16 = oCOM.packAscii16(ascii, ROWS, COLS);

  const CFG_COLS_LO = 0;
  const CFG_COLS_HI = 1;
  const CFG_ROWS_LO = 2;
  const CFG_ROWS_HI = 3;
  const CFG_PACK_LO = 4;
  const CFG_PACK_HI = 5;
  const CFG_LUT_BASE = 8;
  const LUT_CP0 = 0x2500;
  const LUT_LEN = 0x80;

  const packedCols = (COLS + 2) / 3 | 0;
  const cfg8 = new Uint8Array(CFG_LUT_BASE + LUT_LEN);

  cfg8[CFG_COLS_LO] = COLS & 0xFF;
  cfg8[CFG_COLS_HI] = (COLS >>> 8) & 0xFF;
  cfg8[CFG_ROWS_LO] = ROWS & 0xFF;
  cfg8[CFG_ROWS_HI] = (ROWS >>> 8) & 0xFF;
  cfg8[CFG_PACK_LO] = packedCols & 0xFF;
  cfg8[CFG_PACK_HI] = (packedCols >>> 8) & 0xFF;

  for (let cp = LUT_CP0; cp < LUT_CP0 + LUT_LEN; cp++) {
    const ch = String.fromCharCode(cp);
    cfg8[CFG_LUT_BASE + (cp - LUT_CP0)] = oASC.glyph2mask(ch) & 0xFF;
  }

  if (!ascii16 || !cfg8) return null;

  const ok = this.runGPU(
    this.glyph2mask_x3,
    { mode: "gpu" },
    {
      output: [packedCols, ROWS],
      precision: "single",
      graphical: false,
      pipeline: false,
      immutable: true,
      dynamicArguments: true
    },
    { ascii16: [ascii16], cfg8: [cfg8] }
  );
  if (ok === false) return null;

  try 
  {
        const ret = this.glyph2mask_x3.kObject(ascii16, cfg8);
        const bytes = this.unpackGlyph2Mask_x3(ret, ROWS, COLS);
        if(bDebug)
        {
            console.log("(x3) ret.length="+ret.length);
            console.log("(x3) bytes.length="+bytes.length);
            console.log("(x3) CRC="+oCOM.crc32(bytes).toString(16));
        }
        return bytes;
  } catch (e) { console.warn("AsciiCAD GPU glyph2mask_x3 failed.", e);
    return null;
  }
};

this.glyph2mask_x3.kObject = null;

this.glyph2mask_x3.kScript = function(ascii16, cfg8) 
{
  const cols = cfg8[0] | (cfg8[1] << 8);
  const CFG_LUT_BASE = 8;
  const LUT_CP0 = 9472;
  const LUT_CP1 = 9599;

  const r = this.thread.y;
  const packedX = this.thread.x;
  const c0 = packedX * 3;

  let m0 = 0, m1 = 0, m2 = 0;

  let c = c0;
  if (c < cols) {
    let ch = ascii16[r * cols + c] | 0;
    if (ch >= LUT_CP0 && ch <= LUT_CP1) m0 = cfg8[CFG_LUT_BASE + (ch - LUT_CP0)] | 0;
  }

  c = c0 + 1;
  if (c < cols) {
    let ch = ascii16[r * cols + c] | 0;
    if (ch >= LUT_CP0 && ch <= LUT_CP1) m1 = cfg8[CFG_LUT_BASE + (ch - LUT_CP0)] | 0;
  }

  c = c0 + 2;
  if (c < cols) {
    let ch = ascii16[r * cols + c] | 0;
    if (ch >= LUT_CP0 && ch <= LUT_CP1) m2 = cfg8[CFG_LUT_BASE + (ch - LUT_CP0)] | 0;
  }

  return m0 | (m1 << 8) | (m2 << 16);
};

this.unpackGlyph2Mask_x3 = function(packed2D, rows, cols)
{
  const out = new Uint8Array(rows * cols);

  for (let r = 0; r < rows; r++)
  {
    const rowBase = r * cols;
    for (let px = 0; px < packed2D[r].length; px++)
    {
      const v = packed2D[r][px] | 0;
      const c0 = px * 3;

      if (c0 < cols)       out[rowBase + c0]     =  v        & 0xFF;
      if (c0 + 1 < cols)   out[rowBase + c0 + 1] = (v >> 8)  & 0xFF;
      if (c0 + 2 < cols)   out[rowBase + c0 + 2] = (v >> 16) & 0xFF;
    }
  }

  return out;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    this.runGPU = function(kernelFn, GPUarg, kernelArg, config)
    {
        if (this.failed) return false;

        try
        {
            for (const name in config)
            {
            const value = config[name][0];
            if (
                value.constructor === Uint8Array ||
                value.constructor === Uint16Array ||
                value.constructor === Float32Array
            )
                oCOM.ser8_ref(name, value);
            else
                oCOM.ser8_val(
                name,
                value,
                config[name][1] === undefined ? undefined : [config[name][1], config[name][2]]
                );
            }

            if (!this.gpu)
            {
            const GPUCtor = window.GPU?.GPU || window.GPU || GPU;
            this.gpu = new GPUCtor(GPUarg);
            }

            if (!kernelFn.kObject)
            kernelFn.kObject = this.gpu.createKernel(kernelFn.kScript, kernelArg);

            return true;
        }
        catch (e)
        {
            console.warn("AsciiCAD GPU disabled; falling back to CPU.", e);
            this.failed = true;
            this.gpu = null;
            return false;
        }
    };


}

window.oGASC = window.oGASC || new GASC();