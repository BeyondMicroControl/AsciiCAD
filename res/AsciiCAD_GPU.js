function GASC()
{
  this.gpu = null;
  this.failed = false;
  this.overlayKernel = null;
  this.overlayDims = { cols: 0, rows: 0 };

  this.OVERLAY_NONE   = 0;
  this.OVERLAY_RED    = 1;
  this.OVERLAY_BLUE   = 2;
  this.MAX_RECTS = 4096;
  this.rectScratch = new Float32Array(this.MAX_RECTS * 4);

  this.ensureGPU = function() 
  {
    if (this.failed) return false;
    if (this.gpu) return true;
    try 
    {
      const GPUCtor = window.GPU?.GPU || window.GPU || GPU;
      this.gpu = new GPUCtor({ mode: 'gpu' });
      return true;
    } 
    catch (e) 
    {
      console.warn('AsciiCAD GPU overlay disabled; falling back to CPU.', e);
      this.failed = true; this.gpu = null;
      return false;
     }
  };
    
    this.ensureOverlayKernel = function(cols, rows) 
    {
        if (!this.ensureGPU()) return false;
        if (
        this.overlayKernel &&
        this.overlayDims.cols === cols &&
        this.overlayDims.rows === rows
        ) return true;

        this.overlayDims = { cols, rows };

        // Each thread paints one grid cell.
        // Input is a flat rect list: [r0,c0,r1,c1, r0,c0,r1,c1, ...]
        this.overlayKernel = this.gpu.createKernel(function(rects, rectCount) {
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
        }, {
        output: [cols, rows],
        graphical: false,
        pipeline: false,
        immutable: true,
        precision: 'single',
        loopMaxIterations: 4096,
        dynamicArguments: true
        });

        return true;
    }

    this.collectDoubleBoxRects = function(ascii, asc, rows, cols) 
    {
        const rects = [];

        for (let r0 = 0; r0 < rows; r0++) 
        {
            for (let c0 = 0; c0 < cols; c0++) 
            {
                if (ascii[r0][c0] !== '╔') continue;

                for (let c1 = c0 + 1; c1 < cols; c1++) {
                    if (ascii[r0][c1] !== '╗') continue;

                    for (let r1 = r0 + 1; r1 < rows; r1++) {
                    if (ascii[r1][c0] !== '╚') continue;
                    if (ascii[r1][c1] !== '╝') continue;
                    if (!asc.isValidDoubleBox(r0, c0, r1, c1)) continue;
                    rects.push(r0, c0, r1, c1);
                    }
                }
            }
        }
        return rects;
    }

    this.buildOverlaySets = function(mask2D, rows, cols) 
    {
        const redSet = new Set();
        const insideSet = new Set();
        for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
        {
            const v = mask2D[r][c] | 0;
            if (v === this.OVERLAY_RED) redSet.add(r + ',' + c);
            else if (v === this.OVERLAY_BLUE) insideSet.add(r + ',' + c);
        }
        return { redSet, insideSet };
    }
 
    this.computeHighlightOverlayCPUFromRects = function(rects, rows, cols) 
    {
        const mask2D = Array.from({ length: rows }, () => Array(cols).fill(0));

        for (let i = 0; i < rects.length; i += 4)
        {
            const r0 = rects[i + 0];
            const c0 = rects[i + 1];
            const r1 = rects[i + 2];
            const c1 = rects[i + 3];

            for (let c = c0; c <= c1; c++) 
            {
                mask2D[r0][c] = this.OVERLAY_RED;
                mask2D[r1][c] = this.OVERLAY_RED;
            }
            for (let r = r0; r <= r1; r++)
            {
                mask2D[r][c0] = this.OVERLAY_RED;
                mask2D[r][c1] = this.OVERLAY_RED;
            }

            for (let r = r0 + 1; r <= r1 - 1; r++)
                for (let c = c0 + 1; c <= c1 - 1; c++)
                    if (mask2D[r][c] !== this.OVERLAY_RED) mask2D[r][c] = this.OVERLAY_BLUE;
        }

        return mask2D;
    };


  this.computeHighlightOverlay = function(ascii, asc, rows, cols) 
  {
    const rects = this.collectDoubleBoxRects(ascii, asc, rows, cols);
    let mask2D  = null;
    if (rects.length && this.ensureOverlayKernel(cols, rows)) 
    {
      try 
      {
        if ((rects.length / 4) > this.MAX_RECTS) console.warn('AsciiCAD GPU overlay truncated rect list to MAX_RECTS = ' + this.MAX_RECTS);
        const rectCount = Math.min((rects.length / 4) | 0, this.MAX_RECTS);
        const rectBuf = this.rectScratch;
        rectBuf.fill(0);
        for (let i = 0; i < rectCount * 4; i++) rectBuf[i] = rects[i];
        mask2D = this.overlayKernel(rectBuf, rectCount);
      } catch (e) { console.warn('AsciiCAD GPU overlay kernel failed; falling back to CPU.', e); mask2D = null; }
    }
 
    if (!mask2D) mask2D = this.computeHighlightOverlayCPUFromRects(rects, rows, cols);
     const sets = this.buildOverlaySets(mask2D, rows, cols);

    return { rects, mask: mask2D, redSet: sets.redSet, insideSet: sets.insideSet };
  };



}

window.oGASC = window.oGASC || new GASC();
window.addEventListener('load', () => {
  window.oGASC.ensureOverlayKernel?.(COLS, ROWS);
});






