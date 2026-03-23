                                                                                                                                                                                                            
//     █████  ███████  ██████ ██ ██  ██████  █████  ██████      ████████  ██████   ██████  ██      ███████ 
//    ██   ██ ██      ██      ██ ██ ██      ██   ██ ██   ██        ██    ██    ██ ██    ██ ██      ██      
//    ███████ ███████ ██      ██ ██ ██      ███████ ██   ██        ██    ██    ██ ██    ██ ██      ███████ 
//    ██   ██      ██ ██      ██ ██ ██      ██   ██ ██   ██        ██    ██    ██ ██    ██ ██           ██ 
//    ██   ██ ███████  ██████ ██ ██  ██████ ██   ██ ██████         ██     ██████   ██████  ███████ ███████ 

 
 function TOOL()
 {
  const self = this;

  function pushUnique(out, r, c)
  {
    for (let i = 0; i < out.length; i++) if (out[i].r === r && out[i].c === c) return;
    out.push({ r, c });
  }

  function KeyRC(r, c) { return r + "," + c; }

  this.computeHighlightOverlay = function()
  {
    const redSet = new Set();
    const insideSet = new Set();

    for (let r0 = 0; r0 < ROWS; r0++)
    {
      for (let c0 = 0; c0 < COLS; c0++)
      {
        if (ascii[r0][c0] !== "╔") continue;

        for (let c1 = c0 + 1; c1 < COLS; c1++)
        {
          if (ascii[r0][c1] !== "╗") continue;

          for (let r1 = r0 + 1; r1 < ROWS; r1++)
          {
            if (ascii[r1][c0] !== "╚") continue;
            if (ascii[r1][c1] !== "╝") continue;
            if (!oASC.isValidDoubleBox?.(r0, c0, r1, c1)) continue;

            for (let c = c0; c <= c1; c++) {
              redSet.add(oASC.keyRC(r0, c));
              redSet.add(oASC.keyRC(r1, c));
            }
            for (let r = r0; r <= r1; r++) {
              redSet.add(oASC.keyRC(r, c0));
              redSet.add(oASC.keyRC(r, c1));
            }
            for (let r = r0 + 1; r <= r1 - 1; r++) {
              for (let c = c0 + 1; c <= c1 - 1; c++) {
                insideSet.add(oASC.keyRC(r, c));
              }
            }
          }
        }
      }
    }
    return { redSet, insideSet };
  };

  function __computeNetlistCore(opts)
  {
    opts = opts || {};
    const includeCellSet = !!opts.includeCellSet;

    const overlay = self.computeHighlightOverlay?.() ?? { redSet: new Set(), insideSet: new Set() };
    const mo = self.computeMatchOverlay?.() ?? { solidSet: new Set(), greenSet: new Set(), footprintSet: new Set() };
    const compSet = mo.solidSet ?? mo.greenSet ?? mo.footprintSet ?? new Set();
    const banned = self.computeNetlistBannedSet?.(mo, overlay) ?? new Set();

    function isNetWireCell(r, c)
    {
      const k = KeyRC(r, c);
      if (banned.has(k)) return false;
      const ch = ascii?.[r]?.[c];
      if (ch === undefined || ch === " ") return false;
      return (oASC.glyphToMask(ch) ?? 0) !== 0;
    }

    function connectedNeighbors(r, c)
    {
      const out = [];
      const ch = ascii[r][c];
      const m  = oASC.glyphToMask(ch) ?? 0;

      if ((m & oASC.N) && r > 0 && isNetWireCell(r - 1, c)) {
        const m2 = oASC.glyphToMask(ascii[r - 1][c]) ?? 0;
        if (m2 & oASC.S) pushUnique(out, r - 1, c);
      }
      if ((m & oASC.S) && r < ROWS - 1 && isNetWireCell(r + 1, c)) {
        const m2 = oASC.glyphToMask(ascii[r + 1][c]) ?? 0;
        if (m2 & oASC.N) pushUnique(out, r + 1, c);
      }

      if ((m & oASC.W) && c > 0 && isNetWireCell(r, c - 1)) {
        const ch2 = ascii[r][c - 1];
        const m2  = oASC.glyphToMask(ch2) ?? 0;
        if (m2 & oASC.E) {
          pushUnique(out, r, c - 1);
        } else {
          const isVerticalOnly = (m2 & oASC.N) && (m2 & oASC.S) && !(m2 & oASC.E) && !(m2 & oASC.W);
          if (isVerticalOnly && c - 2 >= 0 && isNetWireCell(r, c - 2)) {
            const m3 = oASC.glyphToMask(ascii[r][c - 2]) ?? 0;
            if (m3 & oASC.E) pushUnique(out, r, c - 2);
          }
        }
      }

      if ((m & oASC.E) && c < COLS - 1 && isNetWireCell(r, c + 1)) {
        const ch2 = ascii[r][c + 1];
        const m2  = oASC.glyphToMask(ch2) ?? 0;
        if (m2 & oASC.W) {
          pushUnique(out, r, c + 1);
        } else {
          const isVerticalOnly = (m2 & oASC.N) && (m2 & oASC.S) && !(m2 & oASC.E) && !(m2 & oASC.W);
          if (isVerticalOnly && c + 2 < COLS && isNetWireCell(r, c + 2)) {
            const m3 = oASC.glyphToMask(ascii[r][c + 2]) ?? 0;
            if (m3 & oASC.W) pushUnique(out, r, c + 2);
          }
        }
      }

      return out;
    }

    function pushUniqueCR(out, c, r)
    {
      for (let i = 0; i < out.length; i++) if (out[i].c === c && out[i].r === r) return;
      out.push({ c, r });
    }

    function hasCR(out, c, r)
    {
      for (let i = 0; i < out.length; i++) if (out[i].c === c && out[i].r === r) return true;
      return false;
    }

    function tryAddCE(LE, CE, fromR, fromC, compR, compC, needBitOnComp)
    {
      if (compR < 0 || compR >= ROWS || compC < 0 || compC >= COLS) return;
      const kk = KeyRC(compR, compC);
      if (!compSet.has(kk)) return;

      const chC = ascii?.[compR]?.[compC];
      if (!chC || chC === " " || chC === oASC.WILDCHAR_U) return;

      const mC = oASC.glyphToMask(chC) ?? 0;
      if (!(mC & needBitOnComp)) return;

      pushUniqueCR(CE, compC, compR);
      if (!hasCR(LE, fromC, fromR)) pushUniqueCR(LE, fromC, fromR);
    }

    const visited = new Set();
    let nets = [];

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!isNetWireCell(r, c)) continue;
        const rootK = KeyRC(r, c);
        if (visited.has(rootK)) continue;

        const q = [{ r, c }];
        visited.add(rootK);

        const nodes = [];
        const deg = new Map();

        while (q.length) {
          const cur = q.shift();
          const ck = KeyRC(cur.r, cur.c);
          nodes.push(cur);

          const nbs = connectedNeighbors(cur.r, cur.c);
          deg.set(ck, nbs.length);

          for (const nb of nbs) {
            const nk = KeyRC(nb.r, nb.c);
            if (visited.has(nk)) continue;
            visited.add(nk);
            q.push(nb);
          }
        }

        if (nodes.length < 2) continue;

        const LE = [];
        const LJ = [];
        const CE = [];

        for (const n of nodes) {
          const d = deg.get(KeyRC(n.r, n.c)) ?? 0;
          if (d === 1) pushUniqueCR(LE, n.c, n.r);
          else if (d >= 3) pushUniqueCR(LJ, n.c, n.r);
        }

        for (const n of nodes) {
          const m = oASC.glyphToMask(ascii[n.r][n.c]) ?? 0;
          if (m & oASC.W) tryAddCE(LE, CE, n.r, n.c, n.r, n.c - 1, oASC.E);
          if (m & oASC.E) tryAddCE(LE, CE, n.r, n.c, n.r, n.c + 1, oASC.W);
          if (m & oASC.N) tryAddCE(LE, CE, n.r, n.c, n.r - 1, n.c, oASC.S);
          if (m & oASC.S) tryAddCE(LE, CE, n.r, n.c, n.r + 1, n.c, oASC.N);
        }

        const out = { LE, LJ, CE, nodes };
        if (includeCellSet) {
          const s = new Set();
          for (const n of nodes) s.add(KeyRC(n.r, n.c));
          out.cellSet = s;
        }
        nets.push(out);
      }
    }

    if (mo && mo.matches && mo.matchByCell && typeof CATALOG !== "undefined" && Array.isArray(CATALOG))
    {
      const parent = new Array(nets.length);
      for (let i = 0; i < parent.length; i++) parent[i] = i;

      const find = (x) => {
        while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; }
        return x;
      };
      const union = (a, b) => {
        a = find(a); b = find(b);
        if (a !== b) parent[b] = a;
      };

      const labelToNets = new Map();

      for (let ni = 0; ni < nets.length; ni++)
      {
        const net = nets[ni];
        const touched = new Set();

        for (let i = 0; i < (net.CE?.length ?? 0); i++)
        {
          const ce = net.CE[i];
          const k = KeyRC(ce.r, ce.c);
          const mid = mo.matchByCell.get(k);
          if (mid === undefined || mid === null) continue;

          const m = mo.matches[mid];
          if (!m) continue;

          const ty = String(m.type ?? CATALOG?.[m.catalog_idx]?.type ?? "");
          if (ty !== "Net") continue;

          const labelID = oASC.NetLabelID?.(m.catalog_idx, m.rotation) ?? "";
          if (!labelID) continue;
          touched.add(labelID);
        }

        for (const labelID of touched)
        {
          if (!labelToNets.has(labelID)) labelToNets.set(labelID, []);
          labelToNets.get(labelID).push(ni);
        }
      }

      for (const arr of labelToNets.values())
      {
        if (!arr || arr.length < 2) continue;
        const base = arr[0];
        for (let i = 1; i < arr.length; i++) union(base, arr[i]);
      }

      let anyMerge = false;
      for (let i = 0; i < parent.length; i++) { if (parent[i] !== i) { anyMerge = true; break; } }

      if (anyMerge)
      {
        const groups = new Map();

        for (let i = 0; i < nets.length; i++)
        {
          const root = find(i);
          let g = groups.get(root);
          if (!g)
          {
            g = { LE: [], LJ: [], CE: [], nodes: [] };
            if (includeCellSet) g.cellSet = new Set();
            groups.set(root, g);
          }

          const n = nets[i];
          for (let j = 0; j < (n.LE?.length ?? 0); j++) pushUniqueCR(g.LE, n.LE[j].c, n.LE[j].r);
          for (let j = 0; j < (n.LJ?.length ?? 0); j++) pushUniqueCR(g.LJ, n.LJ[j].c, n.LJ[j].r);
          for (let j = 0; j < (n.CE?.length ?? 0); j++) pushUniqueCR(g.CE, n.CE[j].c, n.CE[j].r);

          if (Array.isArray(n.nodes)) g.nodes = g.nodes.concat(n.nodes);

          if (includeCellSet)
          {
            if (n.cellSet && typeof n.cellSet.forEach === "function") {
              n.cellSet.forEach(k => g.cellSet.add(k));
            } else if (Array.isArray(n.nodes)) {
              for (let j = 0; j < n.nodes.length; j++) g.cellSet.add(KeyRC(n.nodes[j].r, n.nodes[j].c));
            }
          }
        }

        const roots = Array.from(groups.keys()).sort((a, b) => a - b);
        const merged = [];
        for (let i = 0; i < roots.length; i++) merged.push(groups.get(roots[i]));
        nets = merged;
      }
    }

    return nets;
  }

  this.computeNetlist = function()
  {
    const nets = __computeNetlistCore({ includeCellSet: false });
    return nets.map(n => ({ LE: n.LE, LJ: n.LJ, CE: n.CE }));
  };

this.computeNetlist.help =
{
  type: "CADScript_FN",
  usage: "computeNetlist()",
  desc: "Compute netlist including Line Ends (LE) and Component Ends (CE)",
  examples: [
    "oTERM.printJSON(oASC.computeNetlist())"
  ],
  unitTests: [
    "oASC.clear();",
    "oASC.cell(0,0,\""
    + "     ⎽⎽⎽⎽⎽\\n"
    + "  ┌─[  11Ω]───◠◠◠◠─┐\\n"
    + "  │  ⎺⎺⎺⎺⎺         │\\n"
    + "╭─╵─╮              │\\n"
    + "( ~ )              │\\n"
    + "╰─╷─╯              │\\n"
    + "  │   [103]        │\\n"
    + "  ├────┨┠─────(A)──┘\\n"
    + "  ╧\");",
    "oASC.assert(\"(await oASC.computeNetlist()).length\", (await oASC.computeNetlist()).length, 5);",
    "oASC.stack(\"undo\");"
  ]
};

  this.computeNetlistNets = function()
  {
    const nets = __computeNetlistCore({ includeCellSet: true });
    return nets.map(n => ({ cells: n.cellSet, LE: n.LE, LJ: n.LJ, CE: n.CE, CO: n.CE }));
  };

  this.printNetlist = function()
  {
    if (window.oTERM && typeof oTERM.output === "function")
    {
      const lines = (typeof this.computeNetlist === "function") ? this.computeNetlist() : [];
      const pretty = JSON.stringify(lines, null, 2)
        .replace(/\n\s+"r": /g, "\"r\":")
        .replace(/\n\s+"c": /g, "\"c\":")
        .replace(/\[\n\s+\{/g, "[{")
        .replace(/\n\s+\}\n\s+\]/g, "}]")
        .replace(/\n(\s+)\},\n(\s)+\{\"/g, "},\n$1{\"")
        .replace(/\]\n(\s+)\},\n\s+\{/g, "]\n$1},{");

      const l = lines.length;
      oTERM.output("<b>NETLIST</b> (" + l + " " + (l == 1 ? "net" : "nets") + ") \n<pre>" + oCOM.escapeHTML(pretty) + "</pre>");
    }
  };

  this.computeNetlistBannedSet = function(moIn, hlIn)
  {
    const banned = new Set();
    const hl = hlIn ?? (this.computeHighlightOverlay?.() ?? { redSet: new Set(), insideSet: new Set() });
    hl.redSet?.forEach(k => banned.add(k));
    hl.insideSet?.forEach(k => banned.add(k));

    const mo = moIn ?? (this.computeMatchOverlay?.() ?? { solidSet: new Set(), greenSet: new Set() });
    const banSet = mo.solidSet ?? mo.greenSet ?? new Set();
    banSet.forEach(k => banned.add(k));
    return banned;
  };

  this.lineMatchesAt = function(gridLine, c0, patLine)
  {
    if (c0 < 0) return false;
    if (c0 + patLine.length > gridLine.length) return false;
    for (let i = 0; i < patLine.length; i++) {
      const pc = patLine[i];
      const gc = gridLine[c0 + i] || " ";
      if (!oASC.charMatchesPatternCell(pc, gc)) return false;
    }
    return true;
  };

  this.computeMatchOverlay = function()
  {
    const greenSet = new Set();
    const rects = [];
    const matches = [];
    const matchByCell = new Map();
    const solidSet = new Set();
    const footprintSet = new Set();

    if (!(typeof CATALOG !== "undefined" && Array.isArray(CATALOG)))
      return { greenSet, rects, solidSet, footprintSet, matches, matchByCell };

    const catalogVariants = oASC.buildCatalogVariants();
    const gridLines = new Array(ROWS);
    for (let r = 0; r < ROWS; r++) gridLines[r] = ascii[r].join("");

    for (let v = 0; v < catalogVariants.length; v++)
    {
      const pat = catalogVariants[v];
      const first = pat.first;
      const patLines = pat.lines;

      let w = 0;
      for (let i = 0; i < patLines.length; i++) w = Math.max(w, (patLines[i] ?? "").length);
      const h = patLines.length;

      for (let r0 = 0; r0 < ROWS; r0++)
      {
        const gl0 = gridLines[r0];
        const maxC = COLS - first.length;
        if (maxC < 0) continue;

        for (let c0 = 0; c0 <= maxC; c0++)
        {
          if (!this.lineMatchesAt(gl0, c0, first)) continue;
          if (r0 + h > ROWS) continue;

          let ok = true;
          for (let rr = 0; rr < h; rr++)
          {
            const pl = patLines[rr] ?? "";
            const gl = gridLines[r0 + rr];
            if (!this.lineMatchesAt(gl, c0, pl)) { ok = false; break; }
          }
          if (!ok) continue;

          const matchId = matches.length;
          const r1 = r0 + h - 1;
          const c1 = c0 + w - 1;
          matches.push({ matchId, r0, c0, r1, c1, catalog_idx: pat.catalog_idx, rotation: pat.rotation, uid: pat.uid, name: pat.name, type: pat.type });
          rects.push({ r0, c0, r1, c1 });

          for (let rr = 0; rr < h; rr++)
          {
            const pl = patLines[rr] ?? "";
            for (let cc = 0; cc < pl.length; cc++)
            {
              const pc = pl[cc];
              if (pc === " ") continue;

              const r = r0 + rr;
              const c = c0 + cc;
              if (r < 0 || r >= ROWS || c < 0 || c >= COLS) continue;

              const k = oASC.keyRC(r, c);
              footprintSet.add(k);

              if (pc !== oASC.WILDCHAR_U) {
                greenSet.add(k);
                solidSet.add(k);
                matchByCell.set(k, matchId);
              }
            }
          }
        }
      }
    }

    return { greenSet, rects, solidSet, footprintSet, matches, matchByCell };
  };

  this.netHeatPalette = function()
  {
    const fallback = ["#E4F4FF", "#E9FBE8", "#D1FCC7", "#B0F6A1", "#BDE485", "#DCCA76", "#F6844F", "#FF0000"];
    const src = oASC.heatMapCols;
    return (Array.isArray(src) && src.length) ? src.slice() : fallback;
  };

  this.netHeatHexToRGBA = function(hex, alpha)
  {
    const txt = String(hex || "#000000").trim();
    const m = txt.match(/^#?([0-9a-f]{6})$/i);
    if (!m) return "rgba(255,0,0," + (alpha ?? 0.28) + ")";
    const n = parseInt(m[1], 16);
    const r = (n >> 16) & 255;
    const g = (n >> 8) & 255;
    const b = n & 255;
    return "rgba(" + r + "," + g + "," + b + "," + (alpha ?? 0.28) + ")";
  };

  this.netHeatMapColor = function(value, minScore, maxScore, palette)
  {
    const cols = (Array.isArray(palette) && palette.length) ? palette : this.netHeatPalette();
    if (!Number.isFinite(value)) return cols[cols.length - 1];
    if (!Number.isFinite(minScore) || !Number.isFinite(maxScore) || maxScore <= minScore) return cols[0];

    const t = Math.max(0, Math.min(1, (value - minScore) / (maxScore - minScore)));
    const idx = Math.max(0, Math.min(cols.length - 1, Math.round(t * (cols.length - 1))));
    return cols[idx];
  };

  this.netHeatConfig = function()
  {
    return Object.assign({
      blockerWeight: 15,
      bridgeWeight: 2,
      rayLength: 16,
      sideRadius: 4,
      alpha: 0.30
    }, oASC.netHeatCfg || {});
  };

  this.netHeatDistancePenalty = function(weight, distance)
  {
    const d = Math.max(1, Number(distance) || 1);
    return Number(weight || 0) / (d * d);
  };

  this.netHeatCellPenaltyKind = function(r, c, ctx)
  {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return "blocker";
    const kind = oASC.routeCellKind(r, c, ctx);
    if (kind === "blocked") return "blocker";
    if (kind === "wire_v" || kind === "wire_h") return "bridge";
    return null;
  };

  this.computeNetHeatScoreAt = function(r, c, dir, ctx, cfg)
  {
    const vec = oASC.routeDirVec(dir);
    const perpA = (dir === oASC.N || dir === oASC.S) ? { dr: 0, dc: -1 } : { dr: -1, dc: 0 };
    const perpB = (dir === oASC.N || dir === oASC.S) ? { dr: 0, dc:  1 } : { dr:  1, dc: 0 };
    const nr = r + vec.dr;
    const nc = c + vec.dc;

    if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) return Number.POSITIVE_INFINITY;
    if (!oASC.routeStepVerdict(nr, nc, dir, ctx).allowed) return Number.POSITIVE_INFINITY;

    let score = 0;
    let rr = r;
    let cc = c;

    for (let step = 1; step <= cfg.rayLength; step++)
    {
      rr += vec.dr;
      cc += vec.dc;

      if (rr < 0 || rr >= ROWS || cc < 0 || cc >= COLS)
      {
        score += this.netHeatDistancePenalty(cfg.blockerWeight, step);
        break;
      }

      const verdict = oASC.routeStepVerdict(rr, cc, dir, ctx);
      if (!verdict.allowed)
      {
        score += this.netHeatDistancePenalty(cfg.blockerWeight, step);
        break;
      }

      if (verdict.bridge)
        score += this.netHeatDistancePenalty(cfg.bridgeWeight, step);

      for (let side = 1; side <= cfg.sideRadius; side++)
      {
        const checks = [
          { r: rr + perpA.dr * side, c: cc + perpA.dc * side },
          { r: rr + perpB.dr * side, c: cc + perpB.dc * side }
        ];

        for (const p of checks)
        {
          const hit = this.netHeatCellPenaltyKind(p.r, p.c, ctx);
          if (!hit) continue;
          const dist = step + side;
          score += this.netHeatDistancePenalty(hit === "bridge" ? cfg.bridgeWeight : cfg.blockerWeight, dist);
        }
      }
    }

    return score;
  };

  this.computeNetHeatField = function(dirMask)
  {
    const activeMask = (Number(dirMask) || 0) & (oASC.N | oASC.E | oASC.S | oASC.W);
    if (!activeMask) return null;

    const cfg = this.netHeatConfig();
    const dummy = { r: -9999, c: -9999 };
    const ctx = oASC.routeBuildContext(dummy, dummy);
    const dirs = [oASC.N, oASC.E, oASC.S, oASC.W].filter(m => (activeMask & m) !== 0);
    const size = ROWS * COLS;
    const layers = Object.create(null);

    let minScore = Number.POSITIVE_INFINITY;
    let maxScore = -Number.POSITIVE_INFINITY;

    for (const dir of dirs) layers[dir] = new Float32Array(size);

    for (let r = 0; r < ROWS; r++)
    {
      for (let c = 0; c < COLS; c++)
      {
        const idx = r * COLS + c;

        for (const dir of dirs)
        {
          const score = this.computeNetHeatScoreAt(r, c, dir, ctx, cfg);
          layers[dir][idx] = score;
          if (Number.isFinite(score))
          {
            if (score < minScore) minScore = score;
            if (score > maxScore) maxScore = score;
          }
        }
      }
    }

    if (!Number.isFinite(minScore)) minScore = 0;
    if (!Number.isFinite(maxScore) || maxScore <= minScore) maxScore = minScore + 1;

    return { layers, minScore, maxScore, activeMask, cfg };
  };
 }
 
 var oTOOL = new TOOL();



function bindToolMethod(name)
{
  const fn = function(...args) {
    return oTOOL[name](...args);
  };

  Object.defineProperty(fn, "help", {
    get() { return oTOOL[name]?.help; },
    configurable: true
  });

  oASC[name] = fn;
}

[
  "computeHighlightOverlay",
  "lineMatchesAt",
  "computeMatchOverlay",
  "computeNetlistBannedSet",
  "computeNetlist",
  "computeNetlistNets",
  "printNetlist",
  "netHeatPalette",
  "netHeatHexToRGBA",
  "netHeatMapColor",
  "netHeatConfig",
  "netHeatDistancePenalty",
  "netHeatCellPenaltyKind",
  "computeNetHeatScoreAt",
  "computeNetHeatField"
].forEach(bindToolMethod);
