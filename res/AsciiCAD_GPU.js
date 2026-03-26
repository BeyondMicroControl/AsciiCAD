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





    this.computeHighlightOverlay = function(ascii16, cfg8)
    {
    if (!ascii16 || !cfg8) return null;

    const cols = cfg8[0] | (cfg8[1] << 8);
    const rows = cfg8[2] | (cfg8[3] << 8);

    const ok = this.runGPU(
        { mode: 'gpu' },
        {
        output: [cols, rows],
        loopMaxIterations: 512,
        precision: 'single',
        graphical: false,
        pipeline: false,
        immutable: true,
        dynamicArguments: true,
        kScript: this.computeHighlightOverlay.kScript,
        kObject: this.computeHighlightOverlay.kObject
        },
        { "cfg8": [cfg8] }
    );

    if (ok === false) return null;

    try
    {
        // keep the compiled kernel cached on the comprehensive object
        this.computeHighlightOverlay.kObject = this.computeHighlightOverlay.kObject || null;
        const ret = this.computeHighlightOverlay.kObject(ascii16, cfg8);
        return ret;
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

    const r = this.thread.y;
    const c = this.thread.x;

    const CH_SPACE = 32;
    const CH_H = 9552;   // ═
    const CH_V = 9553;   // ║
    const CH_TL = 9556;  // ╔
    const CH_TR = 9559;  // ╗
    const CH_BL = 9562;  // ╚
    const CH_BR = 9565;  // ╝

    let state = 0;

    // Search candidate rectangles that may contain this cell.
    for (let r0 = 0; r0 <= r; r0++)
    {
        for (let c0 = 0; c0 <= c; c0++)
        {
        const iTL = r0 * cols + c0;
        if (ascii16[iTL] !== CH_TL) continue;

        for (let c1 = c; c1 < cols; c1++)
        {
            const iTR = r0 * cols + c1;
            if (ascii16[iTR] !== CH_TR) continue;
            if (c1 <= c0 + 1) continue;

            for (let r1 = r; r1 < rows; r1++)
            {
            const iBL = r1 * cols + c0;
            const iBR = r1 * cols + c1;

            if (ascii16[iBL] !== CH_BL) continue;
            if (ascii16[iBR] !== CH_BR) continue;
            if (r1 <= r0 + 1) continue;

            // Current cell must lie inside candidate bounds.
            if (r < r0 || r > r1 || c < c0 || c > c1) continue;

            let valid = 1;

            // Top and bottom edges must be ═
            for (let x = c0 + 1; x < c1; x++)
            {
                if (ascii16[r0 * cols + x] !== CH_H) { valid = 0; break; }
                if (ascii16[r1 * cols + x] !== CH_H) { valid = 0; break; }
            }
            if (valid === 0) continue;

            // Left and right edges must be ║
            for (let y = r0 + 1; y < r1; y++)
            {
                if (ascii16[y * cols + c0] !== CH_V) { valid = 0; break; }
                if (ascii16[y * cols + c1] !== CH_V) { valid = 0; break; }
            }
            if (valid === 0) continue;

            // Border takes priority over interior.
            if (r === r0 || r === r1 || c === c0 || c === c1) return 1;
            state = 2;
            }
        }
        }
    }

    return state;
    };





    this.runGPU = function(GPUarg, KERNELarg, config)
    {
    if (this.failed) return false;

    try
    {
        for (var i in config)
        {
        if (config[i][0].constructor === Uint8Array || config[i][0].constructor === Uint16Array || config[i][0].constructor === Float32Array)
            oCOM.ser8_ref(i, config[i][0]);
        else
            oCOM.ser8_val(i, config[i][0], config[i][1] === undefined ? undefined : [config[i][1], config[i][2]]);
        }

        if (!this.gpu)
        {
        const gpu = window.GPU?.GPU || window.GPU || GPU;
        this.gpu = new gpu(GPUarg);
        }

        if (!KERNELarg.kObject)
        KERNELarg.kObject = this.gpu.createKernel(KERNELarg.kScript, KERNELarg);

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
