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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



   this.glyph2mask = function(pack) 
   {
        const ascii16 = oCOM.packAscii16(ascii, ROWS, COLS);
        const packedCols = pack?pack:1;

        const param_bytes = 8;        // SERIALISE CFG parameters for kernel
        const cfg8 = new Uint8Array(param_bytes + oASC.G2M_CACHE.length);
        cfg8[0] = param_bytes;
        cfg8[1] = COLS & 0xFF; cfg8[2] = (COLS >>> 8) & 0xFF;
        cfg8[3] = oASC.G2M_LUT_CP0 & 0xFF; cfg8[4] = (oASC.G2M_LUT_CP0 >>> 8) & 0xFF; 
        cfg8[5] = oASC.G2M_LUT_LEN & 0xFF; cfg8[6] = (oASC.G2M_LUT_LEN >>> 8) & 0xFF;
        cfg8[7] = packedCols; // columns per packed output
        cfg8.set(oASC.G2M_CACHE, param_bytes);
        //oTERM.print(cfg8,"array");

        if (!ascii16 || !cfg8) return null;

        const ok = this.runGPU(
        this.glyph2mask,
        { mode: "gpu" },
        {
            output: [Math.ceil(COLS/packedCols), ROWS],
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
        const ret = this.glyph2mask.kObject(ascii16, cfg8);
        const bytes = this.unpackGlyph2Mask(ret, ROWS, COLS, packedCols);
        if(bDebug)
        {
            console.log("(x"+packedCols+") ret.length="+ret.length);
            console.log("(x"+packedCols+") bytes.length="+bytes.length);
            //console.log("(x"+packedCols+") CRC="+oCOM.crc32(bytes).toString(16));
        }
        return bytes;
        } catch (e) { console.warn("AsciiCAD GPU glyph2mask_x3 failed.", e);
        return null;
        }
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
        // DE-SERIALISE CFG parameters
        const CFG_LUT_BASE  = cfg8[0];
        const COLS          = cfg8[1] | (cfg8[2] << 8);
        const G2M_LUT_CP0   = cfg8[3] | (cfg8[4] << 8);
        const G2M_LUT_LEN   = cfg8[5] | (cfg8[6] << 8);
        const PAC_LEN       = cfg8[7];

        const G2M_LUT_CP1   = G2M_LUT_CP0 + G2M_LUT_LEN - 1;
        const r0            = this.thread.y * COLS;
        const c0            = this.thread.x * PAC_LEN;   // 2 columns per packed output

        for(var i=0, m=0;i<PAC_LEN;i++)
        {
            let c = c0 + i;
            if (c < COLS)
            {
                let ch = ascii16[r0 + c] | 0;
                if (ch >= G2M_LUT_CP0 && ch <= G2M_LUT_CP1)
                    m = m | ((cfg8[CFG_LUT_BASE + (ch - G2M_LUT_CP0)] | 0) << (i<<3));
            }
        }
        return m;
    };

       // RUN ONCE
    this.isLittleEndian = (function()
    {
        const u16 = new Uint16Array([0x0102]);
        return new Uint8Array(u16.buffer)[0] === 0x02;
    })();

    this.unpackGlyph2Mask = function(packed2D, rows, cols, packBytes)
    {
        if (packBytes < 1 || packBytes > 3)
            throw new RangeError("packBytes must be 1, 2, or 3");
        const out = new Uint8Array(rows * cols);


        if (packBytes === 1)        // Fast path for x1
        {
            return Uint8Array.from(packed2D.flatMap(row => Array.from(row)))
            //for (let r = 0, rowBase = 0; r < rows; r++, rowBase += cols) out.set(packed2D[r], rowBase);
            //return out;
        }

        // Fast path for x2 on little-endian systems
        if (packBytes === 2 && this.isLittleEndian)
        {
            const packedCols = (cols + 1) >> 1;
            const tmp16 = new Uint16Array(packedCols);
            const tmp8  = new Uint8Array(tmp16.buffer);

            for (let r = 0, rowBase = 0; r < rows; r++, rowBase += cols)
            {
                const row = packed2D[r];
                const n = Math.min(row.length, packedCols);
                tmp16.fill(0);
                for (let i = 0; i < n; i++) tmp16[i] = row[i];
                out.set(tmp8.subarray(0, cols), rowBase);
            }
            return out;
        }

        // Generic row-aware scalar path for 2 or 3 bytes
        for (let r = 0; r < rows; r++)
        {
            const row = packed2D[r], rowBase = r * cols;
            for (let px = 0, c0 = 0; px < row.length; px++, c0 += packBytes)
            {
                const v = row[px] | 0;
                if (c0 < cols) out[rowBase + c0] = v & 0xFF;
                if (packBytes >= 2 && c0 + 1 < cols) out[rowBase + c0 + 1] = (v >>> 8) & 0xFF;
                if (packBytes >= 3 && c0 + 2 < cols) out[rowBase + c0 + 2] = (v >>> 16) & 0xFF;
            }
        }

        return out;
    };

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

this.glyph2mask16 = function()
{
    const ascii16 = oCOM.packAscii16(ascii, ROWS, COLS);

    const param_bytes = 7;
    const cfg8 = new Uint8Array(param_bytes + oASC.G2M_CACHE.length);
    cfg8[0] = param_bytes;
    cfg8[1] = COLS & 0xFF;
    cfg8[2] = (COLS >>> 8) & 0xFF;
    cfg8[3] = oASC.G2M_LUT_CP0 & 0xFF;
    cfg8[4] = (oASC.G2M_LUT_CP0 >>> 8) & 0xFF;
    cfg8[5] = oASC.G2M_LUT_LEN & 0xFF;
    cfg8[6] = (oASC.G2M_LUT_LEN >>> 8) & 0xFF;
    cfg8.set(oASC.G2M_CACHE, param_bytes);

    const ok = this.runGPU(
        this.glyph2mask16,
        { mode: "gpu" },
        {
            output: [COLS, ROWS],
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
        const ret2D = this.glyph2mask16.kObject(ascii16, cfg8);
        const out = new Uint16Array(ROWS * COLS);
        let k = 0;
        for (let r = 0; r < ROWS; r++)
        {
            const row = ret2D[r];
            for (let c = 0; c < COLS; c++) out[k++] = row[c] | 0;
        }
        return out;
    }
    catch (e)
    {
        console.warn("AsciiCAD GPU glyph2mask16 failed.", e);
        return null;
    }
};

this.glyph2mask16.kObject = null;

this.glyph2mask16.kScript = function(ascii16, cfg8)
{
    const CFG_LUT_BASE  = cfg8[0];
    const COLS          = cfg8[1] | (cfg8[2] << 8);
    const G2M_LUT_CP0   = cfg8[3] | (cfg8[4] << 8);
    const G2M_LUT_LEN   = cfg8[5] | (cfg8[6] << 8);
    const G2M_LUT_CP1   = G2M_LUT_CP0 + G2M_LUT_LEN - 1;

    const N = 1, E = 2, S = 4, W = 8;

    const r = this.thread.y;
    const c = this.thread.x;
    const idx = r * COLS + c;
    const ch = ascii16[idx] | 0;

    let m8 = 0;
    if (ch >= G2M_LUT_CP0 && ch <= G2M_LUT_CP1)
        m8 = cfg8[CFG_LUT_BASE + (ch - G2M_LUT_CP0)] | 0;

    let code = 0;

    if (ch === 32) code = 1;                  // space
    else if (m8 === 0) code = 0;              // text / unknown
    else
    {
        const lo = m8 & 15;
        const hi = (m8 >> 4) & 15;

        if (hi !== 0 && lo === 0) code = 0;   // fat wire obstacle
        else if (lo !== 0 && lo === hi) code = 0; // double wire obstacle
        else
        {
            const dir = (lo | hi) & 15;
            const deg =
                ((dir & N) ? 1 : 0) +
                ((dir & E) ? 1 : 0) +
                ((dir & S) ? 1 : 0) +
                ((dir & W) ? 1 : 0);

            if (deg === 2 && dir === (E | W)) code = 2;
            else if (deg === 2 && dir === (N | S)) code = 3;
            else code = 0;
        }
    }

    return (code << 8) | m8;
};

this.routeBaseCodeFromMask16 = function(v16)
{
    return (v16 >>> 8) & 3;
};

this.routeCodeAtMask16 = function(mask16, idx, srcIdx, dstIdx, bannedBits)
{
    if (idx === srcIdx || idx === dstIdx) return 1;
    if (bannedBits && bannedBits[idx]) return 0;
    return (mask16[idx] >>> 8) & 3;
};

this.routeBuildBannedBits = function(ctx)
{
    const bits = new Uint8Array(ROWS * COLS);
    if (!ctx?.banned) return bits;

    ctx.banned.forEach(key => {
        const p = key.indexOf(",");
        if (p < 0) return;
        const r = key.slice(0, p) | 0;
        const c = key.slice(p + 1) | 0;
        if (r >= 0 && r < ROWS && c >= 0 && c < COLS)
            bits[r * COLS + c] = 1;
    });

    return bits;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    this.DIJKSTRA_INF = 16777215;

    this.routeCellCodeFromMask = function(m8, ch, isBanned, isTerminal)
    {
        const N = 1, E = 2, S = 4, W = 8;

        if (isTerminal) return 1;
        if (isBanned) return 0;
        if (ch === " ") return 1;

        const v = (m8 | 0) & 0xFF;
        if (v === 0) return 0;                        // labels / text / unknown glyphs

        const lo = v & 15;
        const hi = (v >> 4) & 15;

        if (hi !== 0 && lo === 0) return 0;          // fat wire => obstacle
        if (lo !== 0 && lo === hi) return 0;         // double wire => obstacle

        const dir = (lo | hi) & 15;
        const deg =
            ((dir & N) ? 1 : 0) +
            ((dir & E) ? 1 : 0) +
            ((dir & S) ? 1 : 0) +
            ((dir & W) ? 1 : 0);

        if (deg === 2 && dir === (E | W)) return 2;  // wire_h
        if (deg === 2 && dir === (N | S)) return 3;  // wire_v
        return 0;                                     // corners / tees / crosses / mixeds => obstacle
    };

    this.routeBuildCellCodeGridFromMask = function(mask8, ctx, from, to)
    {
        if (!mask8) return null;

        const grid = new Uint8Array(ROWS * COLS);
        let i = 0;

        for (let r = 0; r < ROWS; r++)
        {
            for (let c = 0; c < COLS; c++, i++)
            {
                const isTerminal = (r === from.r && c === from.c) || (r === to.r && c === to.c);
                const isBanned = !!ctx?.banned?.has?.(r + "," + c);
                const ch = ascii?.[r]?.[c] ?? " ";
                grid[i] = this.routeCellCodeFromMask(mask8[i], ch, isBanned, isTerminal);
            }
        }

        return grid;
    };

    this.routePathDijkstraCanEnter = function(code, dir)
    {
        const N = 1, E = 2, S = 4, W = 8;
        code = code | 0;
        if (code === 1) return true;                         // free / terminal
        if (code === 2) return (dir === N || dir === S);    // wire_h, vertical crossing
        if (code === 3) return (dir === E || dir === W);    // wire_v, horizontal crossing
        return false;
    };

    this.routePathDijkstraBacktraceOrder = function(modifiers)
    {
        const N = 1, E = 2, S = 4, W = 8;

        if (modifiers?.startVertical)
        {
            return [
                { dr: -1, dc:  0, dir: S },
                { dr:  1, dc:  0, dir: N },
                { dr:  0, dc: -1, dir: E },
                { dr:  0, dc:  1, dir: W }
            ];
        }

        return [
            { dr:  0, dc: -1, dir: E },
            { dr:  0, dc:  1, dir: W },
            { dr: -1, dc:  0, dir: S },
            { dr:  1, dc:  0, dir: N }
        ];
    };

    this.routePathDijkstraBacktrace = function(dist2D, grid, from, to, modifiers)
    {
        if (!dist2D || !grid) return null;

        const INF = this.DIJKSTRA_INF;
        const td = dist2D?.[to.r]?.[to.c];
        if (!(Number.isFinite(td) && td < INF)) return null;

        const states = [{ r: to.r, c: to.c }];
        const order = this.routePathDijkstraBacktraceOrder(modifiers);
        let curR = to.r;
        let curC = to.c;
        let guard = ROWS * COLS + 4;

        while ((curR !== from.r || curC !== from.c) && guard-- > 0)
        {
            const curDist = dist2D[curR][curC];
            const curCode = grid[curR * COLS + curC] | 0;

            let pick = null;
            let pickDist = Number.POSITIVE_INFINITY;

            for (let i = 0; i < order.length; i++)
            {
                const n = order[i];
                const nr = curR + n.dr;
                const nc = curC + n.dc;

                if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) continue;
                if (!this.routePathDijkstraCanEnter(curCode, n.dir)) continue;

                const pd = dist2D?.[nr]?.[nc];
                if (!(Number.isFinite(pd) && pd < INF)) continue;
                if (Math.abs((pd + 1) - curDist) > 0.25) continue;

                if (pd < pickDist)
                {
                    pick = { r: nr, c: nc };
                    pickDist = pd;
                }
            }

            if (!pick)
            {
                for (let i = 0; i < order.length; i++)
                {
                    const n = order[i];
                    const nr = curR + n.dr;
                    const nc = curC + n.dc;

                    if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) continue;
                    if (!this.routePathDijkstraCanEnter(curCode, n.dir)) continue;

                    const pd = dist2D?.[nr]?.[nc];
                    if (!(Number.isFinite(pd) && pd < curDist)) continue;

                    if (pd < pickDist)
                    {
                        pick = { r: nr, c: nc };
                        pickDist = pd;
                    }
                }
            }

            if (!pick) return null;

            curR = pick.r;
            curC = pick.c;
            states.push({ r: curR, c: curC });
        }

        if (guard <= 0) return null;

        states.reverse();
        return oASC.routeStatesToPath(states, modifiers);
    };


    this.routePathDijkstra = function(from, to, modifiers)
    {
        oCOM.startChrono("oGASC.routePathDijkstra", JSON.stringify({ from, to }));

        if (!from || !to) return oCOM.debugDone(null, "GPU routePathDijkstra()", "early-exit(!from||!to)");
        if (from.r === to.r && from.c === to.c) return oCOM.debugDone([], "GPU routePathDijkstra()", "early-exit(same-cell)");

        if (modifiers?.leastCorners || modifiers?.leastBridges)
            return oCOM.debugDone(null, "GPU routePathDijkstra()", "unsupported-modifiers");

        if (!oASC || typeof oASC.routeNormalizeModifiers !== "function")
            return oCOM.debugDone(null, "GPU routePathDijkstra()", "missing-routeNormalizeModifiers");
        if (!oASC || typeof oASC.routeBuildContext !== "function")
            return oCOM.debugDone(null, "GPU routePathDijkstra()", "missing-routeBuildContext");

        const mods = oASC.routeNormalizeModifiers(from, to, modifiers);
        const ctx  = oASC.routeBuildContext(from, to);

        const mask8 = this.glyph2mask(2);
        if (!mask8) return oCOM.debugDone(null, "GPU routePathDijkstra()", "glyph2mask-failed");

        const grid = this.routeBuildCellCodeGridFromMask(mask8, ctx, from, to);
        if (!grid) return oCOM.debugDone(null, "GPU routePathDijkstra()", "grid-build-failed");

        const cfg16 = new Uint16Array(4);
        cfg16[0] = COLS;
        cfg16[1] = ROWS;
        cfg16[2] = from.c;
        cfg16[3] = from.r;

        const okInit = this.runGPU(
            this.routePathDijkstraInit,
            { mode: "gpu" },
            {
                output: [COLS, ROWS],
                precision: "single",
                graphical: false,
                pipeline: false,
                immutable: true,
                dynamicArguments: true
            },
            { grid: [grid], cfg16: [cfg16] }
        );
        if (okInit === false) return oCOM.debugDone(null, "GPU routePathDijkstra()", "kernel-init-compile-failed");

        const okStep = this.runGPU(
            this.routePathDijkstraStep,
            { mode: "gpu" },
            {
                output: [COLS, ROWS],
                precision: "single",
                graphical: false,
                pipeline: false,
                immutable: true,
                dynamicArguments: true
            },
            { distPrev: [ [[0]] ], grid: [grid], cfg16: [cfg16] }
        );
        if (okStep === false) return oCOM.debugDone(null, "GPU routePathDijkstra()", "kernel-step-compile-failed");

        try
        {
            let dist = this.routePathDijkstraInit.kObject(grid, cfg16);
            let targetDist = dist?.[to.r]?.[to.c];

            for (let iter = 0; iter < (ROWS * COLS); iter++)
            {
                if (Number.isFinite(targetDist) && targetDist < this.DIJKSTRA_INF) break;
                dist = this.routePathDijkstraStep.kObject(dist, grid, cfg16);
                targetDist = dist?.[to.r]?.[to.c];
            }

            if (!(Number.isFinite(targetDist) && targetDist < this.DIJKSTRA_INF))
                return oCOM.debugDone(null, "GPU routePathDijkstra()", "no-path");

            var ret = this.routePathDijkstraBacktrace(dist, grid, from, to, mods);
            oCOM.stopChrono("oGASC.routePathDijkstra", "ok");
            return oCOM.debugDone(ret, "GPU routePathDijkstra()", "ok");
        }
        catch (e)
        {
            console.warn("AsciiCAD GPU Dijkstra failed; falling back to CPU.", e);
            return oCOM.debugDone(null, "GPU routePathDijkstra()", "exception");
        }
    };
    this.routePathDijkstra.help =
    {
        type: "CADScript_FN",
        usage: "routePathDijkstra(from,to,modifiers)",
        desc:
            "Tentative GPU.js Dijkstra reimplementation. " +
            "Uses the same outer signature as the CPU router and returns a path array when successful; " +
            "returns null when unavailable or when modifiers require the exact CPU tie-break behavior."
    };


    this.routePathDijkstraInit = function() {};
    this.routePathDijkstraStep = function() {};


    this.routePathDijkstraInit.kObject = null;

    this.routePathDijkstraInit.kScript = function(grid, cfg16)
    {
        const srcC = cfg16[2] | 0;
        const srcR = cfg16[3] | 0;
        const r = this.thread.y;
        const c = this.thread.x;

        if (r === srcR && c === srcC) return 0;
        return 16777215;
    };

    this.routePathDijkstraStep.kObject = null;
    this.routePathDijkstraStep.kScript = function(distPrev, grid, cfg16)
    {
        const cols = cfg16[0] | 0;
        const rows = cfg16[1] | 0;
        const srcC = cfg16[2] | 0;
        const srcR = cfg16[3] | 0;
        const INF = 16777215;

        const r = this.thread.y;
        const c = this.thread.x;
        const idx = r * cols + c;
        const code = grid[idx] | 0;

        if (r === srcR && c === srcC) return 0;
        if (code === 0) return INF;

        let best = distPrev[r][c];
        let cand = 0;

        // from up => move S into current
        if (r > 0)
        {
            cand = distPrev[r - 1][c];
            if (cand < INF && (code === 1 || code === 2))
            {
                cand = cand + 1;
                if (cand < best) best = cand;
            }
        }

        // from down => move N into current
        if ((r + 1) < rows)
        {
            cand = distPrev[r + 1][c];
            if (cand < INF && (code === 1 || code === 2))
            {
                cand = cand + 1;
                if (cand < best) best = cand;
            }
        }

        // from left => move E into current
        if (c > 0)
        {
            cand = distPrev[r][c - 1];
            if (cand < INF && (code === 1 || code === 3))
            {
                cand = cand + 1;
                if (cand < best) best = cand;
            }
        }

        // from right => move W into current
        if ((c + 1) < cols)
        {
            cand = distPrev[r][c + 1];
            if (cand < INF && (code === 1 || code === 3))
            {
                cand = cand + 1;
                if (cand < best) best = cand;
            }
        }

        return best;
    };



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////





    this.MIKAMI_INF = 65535;

    this.logMikamiTargetState = function(tag, h2D, v2D, to)
    {
        if (!bDebug) return;

        const h = h2D?.[to.r]?.[to.c];
        const v = v2D?.[to.r]?.[to.c];

        console.log("[" + tag + "] target=(" + to.r + "," + to.c + ") h=" + h + " v=" + v);
    };

    this.routePathMikamiCanEnterH = function(code)
    {
        code = code | 0;
        return code === 1 || code === 3;   // free / terminal OR wire_v bridge cell
    };

    this.routePathMikamiCanEnterV = function(code)
    {
        code = code | 0;
        return code === 1 || code === 2;   // free / terminal OR wire_h bridge cell
    };

    this.mikamiBacktraceOrder = function(modifiers)
    {
        const verticalFirst = !!modifiers?.startVertical;
        if (verticalFirst)
        {
            return {
                H: [ { dc: -1 }, { dc: 1 } ],
                V: [ { dr: -1 }, { dr: 1 } ]
            };
        }

        return {
            H: [ { dc: 1 }, { dc: -1 } ],
            V: [ { dr: 1 }, { dr: -1 } ]
        };
    };

    this.mikamiChooseTargetAxis = function(h2D, v2D, to, modifiers)
    {
        const hArr = (h2D && typeof h2D.toArray === "function") ? h2D.toArray() : h2D;
        const vArr = (v2D && typeof v2D.toArray === "function") ? v2D.toArray() : v2D;

        const h = hArr?.[to.r]?.[to.c];
        const v = vArr?.[to.r]?.[to.c];
        const INF = this.MIKAMI_INF;
        const hf = Number.isFinite(h) && h < INF;
        const vf = Number.isFinite(v) && v < INF;

        if (hf && !vf) return "H";
        if (vf && !hf) return "V";
        if (!hf && !vf) return null;
        if (h < v) return "H";
        if (v < h) return "V";
        return modifiers?.startVertical ? "V" : "H";
    };

    this.mikamiPathClearH = function(grid, r, c0, c1)
    {
        const step = c1 >= c0 ? 1 : -1;
        for (let c = c0 + step; c !== c1 + step; c += step)
        {
            const code = grid[r * COLS + c] | 0;
            if (!this.routePathMikamiCanEnterH(code)) return false;
        }
        return true;
    };

    this.mikamiPathClearV = function(grid, c, r0, r1)
    {
        const step = r1 >= r0 ? 1 : -1;
        for (let r = r0 + step; r !== r1 + step; r += step)
        {
            const code = grid[r * COLS + c] | 0;
            if (!this.routePathMikamiCanEnterV(code)) return false;
        }
        return true;
    };

    this.mikamiBacktrace = function(hState, vState, grid, from, to, modifiers)
    {
        const h2D = (hState && typeof hState.toArray === "function") ? hState.toArray() : hState;
        const v2D = (vState && typeof vState.toArray === "function") ? vState.toArray() : vState;
        if (!h2D || !v2D || !grid) return null;

        let axis = this.mikamiChooseTargetAxis(h2D, v2D, to, modifiers);
        if (!axis) return null;

        const order = this.mikamiBacktraceOrder(modifiers);
        const states = [ { r: to.r, c: to.c } ];
        let curR = to.r;
        let curC = to.c;
        let level = axis === "H" ? h2D[curR][curC] : v2D[curR][curC];
        let guard = ROWS * COLS * 2;

        if (bDebug)
        {
            console.log("[GPU mikamiBacktrace] axis=" + axis + " level=" + level +
                        " from=" + JSON.stringify(from) + " to=" + JSON.stringify(to));
        }

        while ((curR !== from.r || curC !== from.c) && guard-- > 0)
        {
            let found = null;

            if (axis === "H")
            {
                const tries = order.H;

                if (level === 0)
                {
                    if (curR === from.r && this.mikamiPathClearH(grid, curR, from.c, curC))
                    {
                        found = { r: from.r, c: from.c, nextAxis: null, nextLevel: -1 };
                    }
                }

                if (!found)
                {
                    for (let i = 0; i < tries.length && !found; i++)
                    {
                        const step = tries[i].dc;
                        for (let c = curC - step; c >= 0 && c < COLS; c -= step)
                        {
                            if (!this.mikamiPathClearH(grid, curR, c, curC)) break;
                            const prevV = v2D?.[curR]?.[c];
                            if (Number.isFinite(prevV) && prevV === (level - 1))
                            {
                                found = { r: curR, c, nextAxis: "V", nextLevel: prevV };
                                break;
                            }
                        }
                    }
                }
            }
            else
            {
                const tries = order.V;

                if (level === 0)
                {
                    if (curC === from.c && this.mikamiPathClearV(grid, curC, from.r, curR))
                    {
                        found = { r: from.r, c: from.c, nextAxis: null, nextLevel: -1 };
                    }
                }

                if (!found)
                {
                    for (let i = 0; i < tries.length && !found; i++)
                    {
                        const step = tries[i].dr;
                        for (let r = curR - step; r >= 0 && r < ROWS; r -= step)
                        {
                            if (!this.mikamiPathClearV(grid, curC, r, curR)) break;
                            const prevH = h2D?.[r]?.[curC];
                            if (Number.isFinite(prevH) && prevH === (level - 1))
                            {
                                found = { r, c: curC, nextAxis: "H", nextLevel: prevH };
                                break;
                            }
                        }
                    }
                }
            }

            if (!found)
            {
                if (bDebug)
                    console.log("[GPU mikamiBacktrace] failed axis=" + axis +
                                " cur=(" + curR + "," + curC + ") level=" + level);
                return null;
            }

            if (!found) return null;

            if (found.r === from.r && found.c === from.c)
            {
                states.push({ r: from.r, c: from.c });
                break;
            }

            states.push({ r: found.r, c: found.c });
            curR = found.r;
            curC = found.c;
            axis = found.nextAxis;
            level = found.nextLevel;
        }

        if (guard <= 0) return null;

        states.reverse();

        const fullStates = oASC.routeExpandWaypointStates(states);
        if (!fullStates || fullStates.length === 0) return null;

        const ret = oASC.routeStatesToPath(fullStates, modifiers);
        if (bDebug) console.log("[GPU mikamiBacktrace] statesLen=" + states.length +
                        " fullStatesLen=" + fullStates.length +
                        " pathLen=" + (Array.isArray(ret) ? ret.length : -1));
        return ret;
    };

    this.mikamiPath_cache = { key: "", path: null };

    this.mikamiPath = function(from, to, modifiers)
    {
        oCOM.startChrono("oGASC.mikamiPath", JSON.stringify({ from, to }));
        oCOM.startChrono("gridbuild");
        if (!from || !to) return oCOM.debugDone(null, "GPU mikamiPath()", "early-exit(!from||!to)");
        if (from.r === to.r && from.c === to.c) return oCOM.debugDone([], "GPU mikamiPath()", "early-exit(same-cell)");

        if (modifiers?.leastBridges) return oCOM.debugDone(null, "GPU mikamiPath()", "unsupported-leastBridges");

        if (!oASC || typeof oASC.routeNormalizeModifiers !== "function")
            return oCOM.debugDone(null, "GPU mikamiPath()", "missing-routeNormalizeModifiers");
        if (!oASC || typeof oASC.routeBuildContext !== "function")
            return oCOM.debugDone(null, "GPU mikamiPath()", "missing-routeBuildContext");

        const mods = oASC.routeNormalizeModifiers(from, to, modifiers);
        const ctx  = oASC.routeBuildContext(from, to);
        const key = JSON.stringify({fr: from.r, fc: from.c,tr: to.r, tc: to.c,sv: !!mods.startVertical,lc: !!mods.leastCorners,lb: !!mods.leastBridges});

        if (this.mikamiPath_cache.key === key && Array.isArray(this.mikamiPath_cache.path))
        {
            oCOM.stopChrono("oGASC.mikamiPath", "cache-hit");
            return this.mikamiPath_cache.path.slice();
        }

        const mask8 = this.glyph2mask(2);
        if (!mask8) return oCOM.debugDone(null, "GPU mikamiPath()", "glyph2mask-failed");

        const grid = this.routeBuildCellCodeGridFromMask(mask8, ctx, from, to);
        this.logRouteGridStats("GPU mikamiPath", grid, from, to);
        if (!grid) return oCOM.debugDone(null, "GPU mikamiPath()", "grid-build-failed");

        const cfg16 = new Uint16Array(8);
        cfg16[0] = COLS;
        cfg16[1] = ROWS;
        cfg16[2] = from.c;
        cfg16[3] = from.r;
        cfg16[4] = to.c;
        cfg16[5] = to.r;
        cfg16[6] = mods.startVertical ? 1 : 0;
        cfg16[7] = this.MIKAMI_INF;
        oCOM.stopChrono("gridbuild");

        oCOM.startChrono("initH");
        const okInitH = this.runGPU(
            this.mikamiInitH,
            { mode: "gpu" },
            {
                output: [COLS, ROWS],
                precision: "single",
                graphical: false,
                pipeline: true,
                immutable: true,
                dynamicArguments: true,
                loopMaxIterations: COLS
            },
            { grid: [grid], cfg16: [cfg16] }
        );
         oCOM.stopChrono("initH");
        if (okInitH === false) return oCOM.debugDone(null, "GPU mikamiPath()", "kernel-initH-compile-failed");
        oCOM.startChrono("initV");
        const okInitV = this.runGPU(
            this.mikamiInitV,
            { mode: "gpu" },
            {
                output: [COLS, ROWS],
                precision: "single",
                graphical: false,
                pipeline: true,
                immutable: true,
                dynamicArguments: true,
                loopMaxIterations: ROWS
            },
            { grid: [grid], cfg16: [cfg16] }
        );
        oCOM.stopChrono("initV");
        if (okInitV === false) return oCOM.debugDone(null, "GPU mikamiPath()", "kernel-initV-compile-failed");
        oCOM.startChrono("stepH");
        const okStepH = this.runGPU(
            this.mikamiStepH,
            { mode: "gpu" },
            {
                output: [COLS, ROWS],
                precision: "single",
                graphical: false,
                pipeline:true,
                immutable: true,
                dynamicArguments: true,
                loopMaxIterations: COLS
            },
            { prevAxis: [ [[0]] ], selfAxis: [ [[0]] ], grid: [grid], cfg16: [cfg16] }
        );
        oCOM.stopChrono("stepH");
        if (okStepH === false) return oCOM.debugDone(null, "GPU mikamiPath()", "kernel-stepH-compile-failed");
        oCOM.startChrono("stepV");
        const okStepV = this.runGPU(
            this.mikamiStepV,
            { mode: "gpu" },
            {
                output: [COLS, ROWS],
                precision: "single",
                graphical: false,
                pipeline:true,
                immutable: true,
                dynamicArguments: true,
                loopMaxIterations: ROWS
            },
            { prevAxis: [ [[0]] ], selfAxis: [ [[0]] ], grid: [grid], cfg16: [cfg16] }
        );
        oCOM.startChrono("stepV");
        if (okStepV === false) return oCOM.debugDone(null, "GPU mikamiPath()", "kernel-stepV-compile-failed");
        try
        {
            oCOM.startChrono("backtrace");
            let h = this.mikamiInitH.kObject(grid, cfg16);
            let v = this.mikamiInitV.kObject(grid, cfg16);

            this.logMikamiTargetState("GPU mikamiPath init", h, v, to);
            let bestAxis = this.mikamiChooseTargetAxis(h, v, to, mods);
            if (bestAxis)
            {
                const ret = this.mikamiBacktrace(h, v, grid, from, to, mods);
                this.mikamiPath_cache = { key, path: ret.slice() };
                oCOM.stopChrono("backtrace");
                oCOM.stopChrono("oGASC.mikamiPath", "ok-direct");
                return oCOM.debugDone(this.logPathSummary("GPU mikamiPath ok-direct", ret), "GPU mikamiPath()", "ok-direct");
            }

            for (let iter = 0; iter < (ROWS + COLS); iter++)
            {
                const h2 = this.mikamiStepH.kObject(v, h, grid, cfg16);
                const v2 = this.mikamiStepV.kObject(h2, v, grid, cfg16);
                h = h2;
                v = v2;

                this.logMikamiTargetState("GPU mikamiPath iter " + iter, h, v, to);
                bestAxis = this.mikamiChooseTargetAxis(h, v, to, mods);
                if (bestAxis)
                {
                    const ret = this.mikamiBacktrace(h, v, grid, from, to, mods);
                    this.mikamiPath_cache = { key, path: ret.slice() };
                    oCOM.stopChrono("backtrace");
                    oCOM.stopChrono("oGASC.mikamiPath", "ok-iter");
                    return oCOM.debugDone(this.logPathSummary("GPU mikamiPath ok-iter", ret), "GPU mikamiPath()", "ok-iter");
                }
            }

            oCOM.stopChrono("oGASC.mikamiPath", "no-path");
            return oCOM.debugDone(null, "GPU mikamiPath()", "no-path");
        }
        catch (e)
        {
            console.warn("AsciiCAD GPU Mikami failed; falling back to CPU.", e);
            return oCOM.debugDone(null, "GPU mikamiPath()", "exception");
        }
    };

    this.mikamiPath.help =
    {
        type: "CADScript_FN",
        usage: "mikamiPath(from,to,modifiers)",
        desc:
            "Tentative GPU.js Mikami-style router. " +
            "Uses the same outer signature as the CPU Mikami router and is intentionally limited to least-bends-first behavior in this first GPU pass."
    };

    this.mikamiInitH = function() {};
    this.mikamiInitV = function() {};
    this.mikamiStepH = function() {};
    this.mikamiStepV = function() {};

    this.mikamiInitH.kObject = null;
    this.mikamiInitH.kScript = function(grid, cfg16)
    {
        const cols = cfg16[0] | 0;
        const srcC = cfg16[2] | 0;
        const srcR = cfg16[3] | 0;
        const INF  = cfg16[7] | 0;

        const r = this.thread.y;
        const c = this.thread.x;
        const idx = r * cols + c;
        const code = grid[idx] | 0;

        if (r !== srcR) return INF;
        if (r === srcR && c === srcC) return 0;
        if (!(code === 1 || code === 3)) return INF;

        const step = c > srcC ? 1 : -1;
        for (let cc2 = srcC + step; cc2 !== c + step; cc2 += step)
        {
            const k = grid[r * cols + cc2] | 0;
            if (!(k === 1 || k === 3)) return INF;
        }

        return 0;
    };

    this.mikamiInitV.kObject = null;
    this.mikamiInitV.kScript = function(grid, cfg16)
    {
        const cols = cfg16[0] | 0;
        const srcC = cfg16[2] | 0;
        const srcR = cfg16[3] | 0;
        const INF  = cfg16[7] | 0;

        const r = this.thread.y;
        const c = this.thread.x;
        const idx = r * cols + c;
        const code = grid[idx] | 0;

        if (c !== srcC) return INF;
        if (r === srcR && c === srcC) return 0;
        if (!(code === 1 || code === 2)) return INF;

        const step = r > srcR ? 1 : -1;
        for (let rr2 = srcR + step; rr2 !== r + step; rr2 += step)
        {
            const k = grid[rr2 * cols + c] | 0;
            if (!(k === 1 || k === 2)) return INF;
        }

        return 0;
    };

   this.mikamiStepH.kObject = null;
    this.mikamiStepH.kScript = function(prevAxis, selfAxis, grid, cfg16)
    {
        const cols = cfg16[0] | 0;
        const INF  = cfg16[7] | 0;

        const r = this.thread.y;
        const c = this.thread.x;
        const idx = r * cols + c;
        const code = grid[idx] | 0;

        if (!(code === 1 || code === 3)) return INF;

        let best = selfAxis[r][c];
        let cand = 0;

        for (let ccLeft = c - 1; ccLeft >= 0; ccLeft--)
        {
            const k = grid[r * cols + ccLeft] | 0;
            if (!(k === 1 || k === 3)) break;
            cand = prevAxis[r][ccLeft];
            if (cand < INF)
            {
                cand = cand + 1;
                if (cand < best) best = cand;
            }
        }

        for (let ccRight = c + 1; ccRight < cols; ccRight++)
        {
            const k = grid[r * cols + ccRight] | 0;
            if (!(k === 1 || k === 3)) break;
            cand = prevAxis[r][ccRight];
            if (cand < INF)
            {
                cand = cand + 1;
                if (cand < best) best = cand;
            }
        }

        return best;
    };

    this.mikamiStepV.kObject = null;
    this.mikamiStepV.kScript = function(prevAxis, selfAxis, grid, cfg16)
    {
        const cols = cfg16[0] | 0;
        const rows = cfg16[1] | 0;
        const INF  = cfg16[7] | 0;

        const r = this.thread.y;
        const c = this.thread.x;
        const idx = r * cols + c;
        const code = grid[idx] | 0;

        if (!(code === 1 || code === 2)) return INF;

        let best = selfAxis[r][c];
        let cand = 0;

        for (let rrUp = r - 1; rrUp >= 0; rrUp--)
        {
            const k = grid[rrUp * cols + c] | 0;
            if (!(k === 1 || k === 2)) break;
            cand = prevAxis[rrUp][c];
            if (cand < INF)
            {
                cand = cand + 1;
                if (cand < best) best = cand;
            }
        }

        for (let rrDown = r + 1; rrDown < rows; rrDown++)
        {
            const k = grid[rrDown * cols + c] | 0;
            if (!(k === 1 || k === 2)) break;
            cand = prevAxis[rrDown][c];
            if (cand < INF)
            {
                cand = cand + 1;
                if (cand < best) best = cand;
            }
        }

        return best;
    };

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

 this.mikamiPath_v2 = function(from, to, modifiers)
    {
        oCOM.startChrono("oGASC.mikamiPath", JSON.stringify({ from, to }));
        oCOM.startChrono("gridbuild");
        if (!from || !to) return oCOM.debugDone(null, "GPU mikamiPath()", "early-exit(!from||!to)");
        if (from.r === to.r && from.c === to.c) return oCOM.debugDone([], "GPU mikamiPath()", "early-exit(same-cell)");

        if (modifiers?.leastBridges) return oCOM.debugDone(null, "GPU mikamiPath()", "unsupported-leastBridges");

        if (!oASC || typeof oASC.routeNormalizeModifiers !== "function")
            return oCOM.debugDone(null, "GPU mikamiPath()", "missing-routeNormalizeModifiers");
        if (!oASC || typeof oASC.routeBuildContext !== "function")
            return oCOM.debugDone(null, "GPU mikamiPath()", "missing-routeBuildContext");

        const mods = oASC.routeNormalizeModifiers(from, to, modifiers);
        const ctx  = oASC.routeBuildContext(from, to);
        const key = JSON.stringify({fr: from.r, fc: from.c,tr: to.r, tc: to.c,sv: !!mods.startVertical,lc: !!mods.leastCorners,lb: !!mods.leastBridges});

        if (this.mikamiPath_cache.key === key && Array.isArray(this.mikamiPath_cache.path))
        {
            oCOM.stopChrono("oGASC.mikamiPath", "cache-hit");
            return this.mikamiPath_cache.path.slice();
        }

        const mask8 = this.glyph2mask(2);
        if (!mask8) return oCOM.debugDone(null, "GPU mikamiPath()", "glyph2mask-failed");

        const grid = this.routeBuildCellCodeGridFromMask(mask8, ctx, from, to);
        this.logRouteGridStats("GPU mikamiPath", grid, from, to);
        if (!grid) return oCOM.debugDone(null, "GPU mikamiPath()", "grid-build-failed");

        const cfg16 = new Uint16Array(8);
        cfg16[0] = COLS;
        cfg16[1] = ROWS;
        cfg16[2] = from.c;
        cfg16[3] = from.r;
        cfg16[4] = to.c;
        cfg16[5] = to.r;
        cfg16[6] = mods.startVertical ? 1 : 0;
        cfg16[7] = this.MIKAMI_INF;
        oCOM.stopChrono("gridbuild");

        oCOM.startChrono("initH");
        const okInitH = this.runGPU(
            this.mikamiInitH,
            { mode: "gpu" },
            {
                output: [COLS, ROWS],
                precision: "single",
                graphical: false,
                pipeline: true,
                immutable: true,
                dynamicArguments: true,
                loopMaxIterations: COLS
            },
            { grid: [grid], cfg16: [cfg16] }
        );
         oCOM.stopChrono("initH");
        if (okInitH === false) return oCOM.debugDone(null, "GPU mikamiPath()", "kernel-initH-compile-failed");
        oCOM.startChrono("initV");
        const okInitV = this.runGPU(
            this.mikamiInitV,
            { mode: "gpu" },
            {
                output: [COLS, ROWS],
                precision: "single",
                graphical: false,
                pipeline: true,
                immutable: true,
                dynamicArguments: true,
                loopMaxIterations: ROWS
            },
            { grid: [grid], cfg16: [cfg16] }
        );
        oCOM.stopChrono("initV");
        if (okInitV === false) return oCOM.debugDone(null, "GPU mikamiPath()", "kernel-initV-compile-failed");
        oCOM.startChrono("stepH");
        const okStepH = this.runGPU(
            this.mikamiStepH,
            { mode: "gpu" },
            {
                output: [COLS, ROWS],
                precision: "single",
                graphical: false,
                pipeline:true,
                immutable: true,
                dynamicArguments: true,
                loopMaxIterations: COLS
            },
            { prevAxis: [ [[0]] ], selfAxis: [ [[0]] ], grid: [grid], cfg16: [cfg16] }
        );
        oCOM.stopChrono("stepH");
        if (okStepH === false) return oCOM.debugDone(null, "GPU mikamiPath()", "kernel-stepH-compile-failed");
        oCOM.startChrono("stepV");
        const okStepV = this.runGPU(
            this.mikamiStepV,
            { mode: "gpu" },
            {
                output: [COLS, ROWS],
                precision: "single",
                graphical: false,
                pipeline:true,
                immutable: true,
                dynamicArguments: true,
                loopMaxIterations: ROWS
            },
            { prevAxis: [ [[0]] ], selfAxis: [ [[0]] ], grid: [grid], cfg16: [cfg16] }
        );
        oCOM.startChrono("stepV");
        if (okStepV === false) return oCOM.debugDone(null, "GPU mikamiPath()", "kernel-stepV-compile-failed");
        try
        {
            oCOM.startChrono("backtrace");
            let h = this.mikamiInitH.kObject(grid, cfg16);
            let v = this.mikamiInitV.kObject(grid, cfg16);

            this.logMikamiTargetState("GPU mikamiPath init", h, v, to);
            let bestAxis = this.mikamiChooseTargetAxis(h, v, to, mods);
            if (bestAxis)
            {
                const ret = this.mikamiBacktrace(h, v, grid, from, to, mods);
                this.mikamiPath_cache = { key, path: ret.slice() };
                oCOM.stopChrono("backtrace");
                oCOM.stopChrono("oGASC.mikamiPath", "ok-direct");
                return oCOM.debugDone(this.logPathSummary("GPU mikamiPath ok-direct", ret), "GPU mikamiPath()", "ok-direct");
            }

            for (let iter = 0; iter < (ROWS + COLS); iter++)
            {
                const h2 = this.mikamiStepH.kObject(v, h, grid, cfg16);
                const v2 = this.mikamiStepV.kObject(h2, v, grid, cfg16);
                h = h2;
                v = v2;

                this.logMikamiTargetState("GPU mikamiPath iter " + iter, h, v, to);
                bestAxis = this.mikamiChooseTargetAxis(h, v, to, mods);
                if (bestAxis)
                {
                    const ret = this.mikamiBacktrace(h, v, grid, from, to, mods);
                    this.mikamiPath_cache = { key, path: ret.slice() };
                    oCOM.stopChrono("backtrace");
                    oCOM.stopChrono("oGASC.mikamiPath", "ok-iter");
                    return oCOM.debugDone(this.logPathSummary("GPU mikamiPath ok-iter", ret), "GPU mikamiPath()", "ok-iter");
                }
            }

            oCOM.stopChrono("oGASC.mikamiPath", "no-path");
            return oCOM.debugDone(null, "GPU mikamiPath()", "no-path");
        }
        catch (e)
        {
            console.warn("AsciiCAD GPU Mikami failed; falling back to CPU.", e);
            return oCOM.debugDone(null, "GPU mikamiPath()", "exception");
        }
    };

    this.mikamiPath_v2.help =
    {
        type: "CADScript_FN",
        usage: "mikamiPath(from,to,modifiers)",
        desc:
            "Tentative GPU.js Mikami-style router. " +
            "Uses the same outer signature as the CPU Mikami router and is intentionally limited to least-bends-first behavior in this first GPU pass."
    };

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



    this.logPathSummary = function(tag, path)
    {
        if (!bDebug) return path;

        const n = Array.isArray(path) ? path.length : -1;
        const first = (n > 0) ? path[0] : null;
        const last  = (n > 0) ? path[n - 1] : null;

        console.log(
            "[" + tag + "] pathLen=" + n +
            " first=" + JSON.stringify(first) +
            " last=" + JSON.stringify(last)
        );

        if (n > 0)
        {
            const head = path.slice(0, Math.min(6, n));
            const tail = path.slice(Math.max(0, n - 6));
            console.log("[" + tag + "] head=" + JSON.stringify(head));
            if (n > 6) console.log("[" + tag + "] tail=" + JSON.stringify(tail));
        }

        return path;
    };

    this.logRouteGridStats = function(tag, grid, from, to)
    {
        if (!bDebug || !grid) return;

        let n0 = 0, n1 = 0, n2 = 0, n3 = 0;
        for (let i = 0; i < grid.length; i++)
        {
            const v = grid[i] | 0;
            if (v === 0) n0++;
            else if (v === 1) n1++;
            else if (v === 2) n2++;
            else if (v === 3) n3++;
        }

        const src = grid[from.r * COLS + from.c] | 0;
        const dst = grid[to.r * COLS + to.c] | 0;

        console.log(
            "[" + tag + "] gridStats" +
            " free=" + n1 +
            " blocked=" + n0 +
            " wire_h=" + n2 +
            " wire_v=" + n3 +
            " src=" + src +
            " dst=" + dst
        );
    };   

    this.runGPU = function(kernelFn, GPUarg, kernelArg, config)
    {
        if (this.failed) return false;

        try
        {
            oCOM.ser8_reset();
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