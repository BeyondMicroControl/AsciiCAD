function GASC()
{
  this.gpu = null;
  this.failed = false;

  this.overlayKernel = null;
  this.overlayDims = { cols: 0, rows: 0 };

  this.OVERLAY_NONE = 0;
  this.OVERLAY_RED  = 1;
  this.OVERLAY_BLUE = 2;

  this.MAX_RECTS = 4096;
  this.rectScratch = new Float32Array(this.MAX_RECTS * 4);




  this.initGPU = function(GPUarg,KERNELarg,config)
  {
    if (this.failed) return false;
    if (this.gpu) return true;

    try
    {
        var cols = config.COLS;
        var rows = config.ROWS;

        const gpu = window.GPU?.GPU || window.GPU || GPU;
        this.gpu = new gpu(GPUarg);

        if (this.overlayKernel && this.overlayDims.cols === cols && this.overlayDims.rows === rows) return true;
        this.overlayDims = { cols, rows };
        this.overlayKernel = this.gpu.createKernel(KERNELarg.kernel,KERNELarg);       // one thread per grid cell

        return true;
    }
    catch (e)
    {
      console.warn("AsciiCAD GPU overlay disabled; falling back to CPU.", e);
      this.failed = true;
      this.gpu = null;
      return false;
    }
  };




  this.ensureOverlayKernel = function(cols, rows)
  {
    return this.initGPU(
        {mode: 'gpu'},
        {   output: [cols, rows],
            graphical: false,
            pipeline: false,
            immutable: true,
            precision: "single",
            loopMaxIterations: 4096,
            dynamicArguments: true,
            kernel: this.KERNEL_HighlightOverlay
        },
        {"COLS":cols,"ROWS":rows});
  };

    this.computeHighlightOverlay = function(rects, rows, cols)
    {
        if (!rects || !rects.length) return null;
        if (!this.ensureOverlayKernel(cols, rows)) return null;

        try
        {
        if ((rects.length / 4) > this.MAX_RECTS)
            console.warn("AsciiCAD GPU overlay truncated rect list to MAX_RECTS = " + this.MAX_RECTS);

        const rectCount = Math.min((rects.length / 4) | 0, this.MAX_RECTS);
        const rectBuf = this.rectScratch;

        rectBuf.fill(0);
        for (let i = 0; i < rectCount * 4; i++) rectBuf[i] = rects[i];

        return this.overlayKernel(rectBuf, rectCount);
        }
        catch (e)
        {
        console.warn("AsciiCAD GPU overlay kernel failed; falling back to CPU.", e);
        return null;
        }
    };


    this.KERNEL_HighlightOverlay = function(rects, rectCount)
    {
        const r = this.thread.y;
        const c = this.thread.x;

        let state = 0;

        for (let i = 0; i < 4096; i++)
        {
            if (i >= rectCount) break;

            const base = i * 4;
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
  window.oGASC.ensureOverlayKernel?.(COLS, ROWS);
});