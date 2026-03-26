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
    this.computeHighlightOverlay = function(rects, rows, cols)
    {
        if (!rects || !rects.length) return null;

        const ret = this.runGPU(
        {   mode: 'gpu'},
        {   output: [cols, rows],
            loopMaxIterations:  this.MAX_RECTS,
            precision:          "single",
            graphical: false, pipeline: false, immutable: true, dynamicArguments: true,
            kScript:            this.computeHighlightOverlay.kScript,  // <-- input kernel script
            kObject:            this.computeHighlightOverlay.kObject   // --> output kernel object
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

             // caution: this.computeHighlightOverlay.kObject appears to contain string "Error: not enough arguments for kernel"
             // This is normal behavior. When calling with arguments, GPU kicks in (this.computeHighlightOverlay.kObject object resides in the GPU, not accessible by CPU)
            const ret = this.computeHighlightOverlay.kObject(rectBuf, rectCount); 
            return ret;
        }
        catch (e) { console.warn("AsciiCAD GPU overlay kernel failed; falling back to CPU.", e); return null; }
    };

    // Kernel object
    this.computeHighlightOverlay.kObject = null;

    // Kernel script
    this.computeHighlightOverlay.kScript = function(rects, rectCount)
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

    this.runGPU = function(GPUarg,KERNELarg,config)
    {
        if (this.failed) return false;
        if (this.gpu)    return true;
        try
        {
            // DATA SERIALISATION
            for(var i in config)
            {
                if(config[i][0].constructor === Uint8Array) oCOM.ser8_ref(i,config[i][0]);
                else oCOM.ser8_val(i,config[i][0],config[i][1]===undefined?undefined:[config[i][1],config[i][2]]);
            }

            // INSTATIATE GPU CONTAINER & ATTACH TO WINDOW OBJECT
            const gpu = window.GPU?.GPU || window.GPU || GPU;
            this.gpu  = new gpu(GPUarg);

            // OMMIT TRANSPILATION if kernel object already exists
            if(this.gpu.kernels.length!=0)
            {
                for(var i=0; i < this.gpu.kernels.length; i++ )
                    if(this.gpu.kernels[i].source == KERNELarg.kScript.toString())
                        return true;
            }

            // TRANSPILE KERNEL SCRIPT into kernel object
            KERNELarg.kObject = this.gpu.createKernel(KERNELarg.kScript,KERNELarg);
            
            return true;
        }
        catch (e)
        {
            console.warn("AsciiCAD GPU (oHighlightOverlay_kernel) disabled; falling back to CPU.", e);
            this.failed = true;
            this.gpu = null;
            return false;
        }
    };


}

window.oGASC = window.oGASC || new GASC();
