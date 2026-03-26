function GASC()
{
    this.gpu = null;
    this.failed = false;

    this.oHighlightOverlay_kernel = {};
    this.Dims = { cols: 0, rows: 0 };

    this.OVERLAY_NONE = 0;
    this.OVERLAY_RED  = 1;
    this.OVERLAY_BLUE = 2;

    this.MAX_RECTS = 4096;
    this.rectScratch = new Float32Array(this.MAX_RECTS * 4);


    // BYTE ARRAY SERIALISATION HELPERS
    this.serial8 = new Uint8Array();
    this.config8_map = {};
    this.config8_idx = {};
    this.ser8_ref = function(name,arr) { this.setlen(name,null); this.serial8 = new Uint8Array([...this.serial8,...arr]) }
    this.ser8_val = function(name,val,modifier) { this.setlen(name,modifier); this.serial8 = new Uint8Array([...this.serial8,...[val&255]]) } 
    this.ser8_map = function() { return "const "+JSON.stringify(this.config8_map).replace(/"|\{|\}/g,"").replace(/:/g,"=")+";" }
    this.idx8 = function(name) { return this.config8_idx[name] }
    this.setlen = function(name,modifier)
    {
        if(modifier===undefined) var modifier = ["cfg[","]"];
        else if(modifier==null)  var modifier = ["",""];
        if(this.config8_map[name]===undefined)
        {
        this.config8_map[name] = modifier[0] + this.serial8.length + modifier[1];
        this.config8_idx[name] = this.serial8.length;
        }
    }

    this.runGPU = function(GPUarg,KERNELarg,config)
    {
        if (this.failed) return false;
        if (this.gpu) return true;
        try
        {
            /*
            // DATA SERIALISATION
            for(var i in config)
            {
                if(config[i][0].constructor === Uint8Array) this.ser8_ref(i,config[i][0])
                else this.ser8_val(i,config[i][0],config[i][1]===undefined?undefined:[config[i][1],config[i][2]])
            }
                */

            // INSTATIATE GPU CONTAINER & ATTACH TO WINDOW OBJECT
            const gpu = window.GPU?.GPU || window.GPU || GPU;
            this.gpu = new gpu(GPUarg);

            // OMMIT TRANSPILATION if kernel object already exists
            if (KERNELarg.kernelObj) return true;

            // TRANSPILE KERNEL SCRIPT into kernel object
            this.Dims = [ config.COLS, config.ROWS ];
            KERNELarg.kernelObj = this.gpu.createKernel(KERNELarg.kernel,KERNELarg);
            
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

    this.computeHighlightOverlay = function(rects, rows, cols)
    {
        if (!rects || !rects.length) return null;

        const ret = this.runGPU(
        {mode: 'gpu'},
        {   output: [cols, rows],
            graphical: false,
            pipeline: false,
            immutable: true,
            precision: "single",
            loopMaxIterations: this.MAX_RECTS,
            dynamicArguments: true,
            kernel: this.KERNELSCRIPT_HighlightOverlay,
            kernelObj: this.oHighlightOverlay_kernel 
        },
        {"COLS":cols,"ROWS":rows});
        if (ret==false) return null;

        try
        {
            if ((rects.length / 4) > this.MAX_RECTS)
                console.warn("AsciiCAD GPU overlay truncated rect list to MAX_RECTS = " + this.MAX_RECTS);

            const rectCount = Math.min((rects.length / 4) | 0, this.MAX_RECTS);
            const rectBuf = this.rectScratch;

            rectBuf.fill(0);
            for (let i = 0; i < rectCount * 4; i++) rectBuf[i] = rects[i];

            return this.oHighlightOverlay_kernel(rectBuf, rectCount);
        }
        catch (e) { console.warn("AsciiCAD GPU overlay kernel failed; falling back to CPU.", e); return null; }
    };


    this.KERNELSCRIPT_HighlightOverlay = function(rects, rectCount)
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


}

window.oGASC = window.oGASC || new GASC();

window.addEventListener("load", () =>
{
    var ret = window.oGASC.runGPU?.(
        {mode: 'gpu'},
        {
            output: [COLS, ROWS],
            graphical: false,
            pipeline: false,
            immutable: true,
            precision: "single",
            loopMaxIterations: 4096,
            dynamicArguments: true,
            kernel: oGASC.KERNELSCRIPT_HighlightOverlay,
            kernelObj: this.oHighlightOverlay_kernel 
        },
        {"COLS":COLS,"ROWS":ROWS});

    if(ret==true)   console.log("runGPU() SUCCESS");
});