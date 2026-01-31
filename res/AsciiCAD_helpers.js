//    ███████ ██████  ███████  ██████ ██ ███████ ██  ██████ 
//    ██      ██   ██ ██      ██      ██ ██      ██ ██
//    ███████ ██████  █████   ██      ██ █████   ██ ██
//         ██ ██      ██      ██      ██ ██      ██ ██
//    ███████ ██      ███████  ██████ ██ ██      ██  ██████ 
// 
//    ██   ██ ███████ ██      ██████  ███████ ██████  ███████ 
//    ██   ██ ██      ██      ██   ██ ██      ██   ██ ██
//    ███████ █████   ██      ██████  █████   ██████  ███████ 
//    ██   ██ ██      ██      ██      ██      ██   ██      ██ 
//    ██   ██ ███████ ███████ ██      ███████ ██   ██ ███████ 


function ASC()
{

  //       ______           _        __
  //     .' ___  |         (_)      |  ] 
  //    / .'   \_| _ .--.  __   .--.| |
  //    | |   ____[ `/'`\][  |/ /'`\' |
  //    \ `.___]  || |     | || \__/  |
  //     `._____.'[___]   [___]'.__.;__]
  //
  // SECTION: GRID

  // Stage sizing: ensure integer cell sizes (avoid remainder pixels -> spacing artifacts)
  this.computeStageSize = function() 
  {
      const r = container.getBoundingClientRect();
      let w = Math.max(1, Math.floor(r.width));
      let h = Math.max(1, Math.floor(r.height));
      if (w >= COLS) w = Math.floor(w / COLS) * COLS;
      if (h >= ROWS) h = Math.floor(h / ROWS) * ROWS;
      return { w: Math.max(1, w), h: Math.max(1, h) };
  }

  this.syncCanvasBufferToStage =  function() 
  {
      const dpr = window.devicePixelRatio || 1;
      const w = Math.max(1, Math.floor(stageSize.w * dpr));
      const h = Math.max(1, Math.floor(stageSize.h * dpr));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
  }

  this.getCellSize = function() { return { cw: baseCellW, ch: baseCellH }; }

    // Resize observer (debounced via rAF)
  this.resizeRaf = null;
  this.scheduleResize = function() 
  {
    if (this.resizeRaf != null) return;
    this.resizeRaf = requestAnimationFrame(() => {
      this.resizeRaf = null;
      const next = this.computeStageSize();
      if (next.w === stageSize.w && next.h === stageSize.h) return;
      stageSize = next;
      stage.style.width = stageSize.w + "px";
      stage.style.height = stageSize.h + "px";
      this.syncCanvasBufferToStage();
      draw();
    });
  }

  //     ______                               ___       _____                                      _
  //    |_   _ `.                           .' _ '.    |_   _|                                    / |_
  //      | | `. \ _ .--.  ,--.  _   _   __ | (_) '___   | |      ,--.    _   __   .--.   __   _ `| |-' 
  //      | |  | |[ `/'`\]`'_\ :[ \ [ \ [  ].`___'/ _/   | |   _ `'_\ :  [ \ [  ]/ .'`\ \[  | | | | | 
  //     _| |_.' / | |    // | |,\ \/\ \/ /| (___)  \_  _| |__/ |// | |,  \ '/ / | \__. | | \_/ |,| |,
  //    |______.' [___]   \'-;__/ \__/\__/ `._____.\__||________|\'-;__/[\_:  /   '.__.'  '.__.'_/\__/
  //                                                                     \__.' 
  // SECTION: DRAW & LAYOUT

  this.pushStrokeIfNonEmpty = function(stroke) 
  {
    if (!stroke || stroke.length === 0) return;
    undoStack.push(stroke);
    redoStack.length = 0;
    updateUI();
    if (schemaHighlightOn) highlightCache = null;
  }

  this.snapshotRect = function(rect) 
  {
    const m = new Map();
    for (let r = rect.r0; r <= rect.r1; r++) for (let c = rect.c0; c <= rect.c1; c++) m.set(r + ',' + c, ascii[r][c]);
    return m;
  }

  this.buildOrthogonalPath = function(start, end, start_vleg, kind)
  {
    const chset = kind === "double" ? BOX_DOUBLE : (kind === "thick" ? BOX_THICK : BOX_SINGLE);

    const r0 = start.r, c0 = start.c;
    const r1 = end.r, c1 = end.c;
    const out = [];

    // Same cell → nothing
    if (r0 === r1 && c0 === c1) return out;

    if (start_vleg) {
      // ===== Vertical then Horizontal =====

      // 1) Vertical segment at column c0
      if (r0 !== r1) {
        const stepR = r1 > r0 ? 1 : -1;
        for (let r = r0; r !== r1; r += stepR) {
          out.push({ r, c: c0, ch: chset.v });
        }
        out.push({ r: r1, c: c0, ch: chset.v });
      }

      // 2) Corner
      if (r0 !== r1 && c0 !== c1)
      {
        out[out.length - 1].ch = cornerChar(r0, c0, r1, c1, start_vleg, chset);
      }

      // 3) Horizontal segment at row r1
      if (c0 !== c1) {
        const stepC = c1 > c0 ? 1 : -1;
        let cStart = c0;
        if (r0 !== r1) cStart = c0 + stepC;

        for (let c = cStart; c !== c1; c += stepC) {
          out.push({ r: r1, c, ch: chset.h });
        }
        out.push({ r: r1, c: c1, ch: chset.h });
      }

    } else {
      // ===== Horizontal then Vertical =====

      // 1) Horizontal segment at row r0
      if (c0 !== c1) {
        const stepC = c1 > c0 ? 1 : -1;
        for (let c = c0; c !== c1; c += stepC) {
          out.push({ r: r0, c, ch: chset.h });
        }
        out.push({ r: r0, c: c1, ch: chset.h });
      }

      // 2) Corner
      if (c0 !== c1 && r0 !== r1)
        out[out.length - 1].ch = cornerChar(r0, c0, r1, c1, start_vleg, chset);
      else if (c0 !== c1) return out;  // purely horizontal

      // 3) Vertical segment at column c1
      if (r0 !== r1) {
        const stepR = r1 > r0 ? 1 : -1;
        let rStart = r0;
        if (c0 !== c1) rStart = r0 + stepR;

        for (let r = rStart; r !== r1; r += stepR) {
          out.push({ r, c: c1, ch: chset.v });
        }
        out.push({ r: r1, c: c1, ch: chset.v });
      }
    }

    return out;
  }

  this.buildBoxPath = function(start, end, style) 
  {
    const r0 = start.r, c0 = start.c;
    const r1 = end.r, c1 = end.c;

    const top   = Math.min(r0, r1);
    const bot   = Math.max(r0, r1);
    const left  = Math.min(c0, c1);
    const right = Math.max(c0, c1);

    const out = [];

    // Degenerate: a line or a point — we still draw something useful
    if (top === bot && left === right) {
      out.push({ r: top, c: left, ch: style.tl }); // or '+'; your call
      return out;
    }

    // Top edge
    for (let c = left + 1; c <= right - 1; c++) out.push({ r: top, c, ch: style.h });
    // Bottom edge
    if (bot !== top) {
      for (let c = left + 1; c <= right - 1; c++) out.push({ r: bot, c, ch: style.h });
    }

    // Left edge
    for (let r = top + 1; r <= bot - 1; r++) out.push({ r, c: left, ch: style.v });
    // Right edge
    if (right !== left) {
      for (let r = top + 1; r <= bot - 1; r++) out.push({ r, c: right, ch: style.v });
    }

    // Corners (only if box has width/height)
    out.push({ r: top, c: left, ch: style.tl });
    if (right !== left) out.push({ r: top, c: right, ch: style.tr });
    if (bot !== top) out.push({ r: bot, c: left, ch: style.bl });
    if (bot !== top && right !== left) out.push({ r: bot, c: right, ch: style.br });

    return out;
  }

  this.lineMatchesAt = function(gridLine, c0, patLine)
  {
    // gridLine is a string of length COLS
    // patLine is a string; must fit fully
    if (c0 < 0) return false;
    if (c0 + patLine.length > gridLine.length) return false;

    for (let i = 0; i < patLine.length; i++) {
      const pc = patLine[i];
      const gc = gridLine[c0 + i] || " ";
      if (!this.charMatchesPatternCell(pc, gc)) return false;
    }
    return true;
  }

  this.isWireGlyph = function(ch) { return glyphToMask.has(ch); }

  this.mergedWireGlyph = function(prevCh, nextCh, lineKind /* "single"|"double","thick" */)
  {
    const pm = glyphToMask.get(prevCh) ?? 0;
    const nm = glyphToMask.get(nextCh) ?? 0;
    const m  = pm | nm;

    // double wins:
    const wantDouble = (lineKind === "double") || isDoubleWire(prevCh) || isDoubleWire(nextCh);
    const wantThick  = (lineKind === "thick")  || isThickWire(prevCh)  || isThickWire(nextCh);

    const out = wantDouble ? maskToDouble.get(m) : wantThick ? maskToThick.get(m) : maskToSingle.get(m);
    return out ?? nextCh;
  }

  //       ______         _          __ 
  //     .' ___  |       / |_       [  |
  //    / .'   \_| ,--. `| |-',--.   | |  .--.   .--./) 
  //    | |       `'_\ : | | `'_\ :  | |/ .'`\ \/ /'`\; 
  //    \ `.___.'\// | |,| |,// | |, | || \__. |\ \._// 
  //     `.____ .'\'-;__/\__/\'-;__/[___]'.__.' .',__`
  //                                           ( ( __)) 
  // SECTION: COMPONENT CATALOG

  this.catalogTypes = function()
  {
    const set = new Set();
    for (let i = 0; i < CATALOG.length; i++)
    {
      const item = CATALOG[i];
      let type = item && item.type;
      if (type === null || type === undefined) type = "Other";
      else { type = String(type).trim(); if (type === "") type = "Other"; }
      set.add(type);
    }
    return Array.from(set).sort();
  }

  this.catalogItemsForTab = (tab) => tab === 'All' ? CATALOG : CATALOG.filter(it => String(it.type || 'Other') === tab);

  // TODO: why never used ??
  this.catalogItemByUID = (uid) => CATALOG.find(it => (it.name+'_'+it.type+'_'+it.MFR) === uid);


  this.buildCatalogVariants = function()    // Helper for matching catalog items
  {
    // Returns array of { lines:[string], first:string, w:int, h:int }
    const out = [];
    const items = (typeof CATALOG !== "undefined" && Array.isArray(CATALOG)) ? CATALOG : [];
    for (let i = 0; i < items.length; i++)
    {
      const it = items[i];
      const td = it && it.text_data;
      if (!td) continue;
      const variants = Array.isArray(td) ? td : [td];
      for (let k = 0; k < variants.length; k++)
      {
        const raw = String(variants[k] ?? "");
        if (!raw) continue;

        // Use same wide-char expansion as paste/load to stay aligned with grid.
        const expanded = expandWideCharsForGrid(raw);
        const lines = oCOM.toLines(expanded);
        if (!lines || lines.length === 0) continue;

        const first = lines[0] ?? "";
        if (first.length === 0) continue;

        let w = 0;
        for (let j = 0; j < lines.length; j++) w = Math.max(w, (lines[j] ?? "").length);

        out.push({ lines, first, w, h: lines.length });
      }
    }
    return out;
  }

  this.charMatchesPatternCell = function(patCh, gridCh)   // detect wildcards in catalog items
  {
    if (patCh === "#") return WILD_D_SET.has(gridCh);
    if (patCh === "$") return WILD_S_SET.has(gridCh);
    if (patCh === "§") return WILD_U_SET.has(gridCh);
    return patCh === gridCh;
  }

  //     _________               __
  //    |  _   _  |             [  | 
  //    |_/ | | \_|.--.    .--.  | |  .--. 
  //        | |  / .'`\ \/ .'`\ \| | ( (`\]
  //       _| |_ | \__. || \__. || |  `'.'.
  //      |_____| '.__.'  '.__.'[___][\__) ) 
  //
  // SECTION: TOOLS

  this.computeHighlightOverlay = function() 
  {
    const redSet = new Set();    // frame cells of valid double boxes
    const insideSet = new Set(); // interior cells of valid double boxes

    // Find boxes by scanning for ╔ and matching to a ╗ on same row + a ╚/╝ on lower row.
    for (let r0 = 0; r0 < ROWS; r0++) 
    {
      for (let c0 = 0; c0 < COLS; c0++)
      {
        if (ascii[r0][c0] !== "╔") continue;

        // find candidate top-right corners on same row
        for (let c1 = c0 + 1; c1 < COLS; c1++) 
        {
          if (ascii[r0][c1] !== "╗") continue;

          // find candidate bottom row
          for (let r1 = r0 + 1; r1 < ROWS; r1++)
          {
            // quick corner check before full validation
            if (ascii[r1][c0] !== "╚") continue;
            if (ascii[r1][c1] !== "╝") continue;

            if (!isValidDoubleBox(r0, c0, r1, c1)) continue;

            // frame: top/bottom
            for (let c = c0; c <= c1; c++) {
              redSet.add(keyRC(r0, c));
              redSet.add(keyRC(r1, c));
            }
            // frame: left/right
            for (let r = r0; r <= r1; r++) {
              redSet.add(keyRC(r, c0));
              redSet.add(keyRC(r, c1));
            }
            // interior
            for (let r = r0 + 1; r <= r1 - 1; r++) {
              for (let c = c0 + 1; c <= c1 - 1; c++) {
                insideSet.add(keyRC(r, c));
              }
            }
          }
        }
      }
    }
    return { redSet, insideSet };
  }

  this.computeMatchOverlay = function() 
  {
    const greenSet = new Set();
    if (!(typeof CATALOG !== "undefined" && Array.isArray(CATALOG))) return { greenSet };

    if (!catalogVariantsCache) catalogVariantsCache = oASC.buildCatalogVariants();

    // Build grid lines once for fast access
    const gridLines = new Array(ROWS);
    for (let r = 0; r < ROWS; r++) gridLines[r] = ascii[r].join("");

    for (let v = 0; v < catalogVariantsCache.length; v++) 
    {
      const pat = catalogVariantsCache[v];
      const first = pat.first;
      const patLines = pat.lines;

      // Stage 1: find first-line candidates across all rows
      for (let r0 = 0; r0 < ROWS; r0++) 
      {
        const gl0 = gridLines[r0];
        const maxC = COLS - first.length;
        if (maxC < 0) continue;

        for (let c0 = 0; c0 <= maxC; c0++) {
          if (!oASC.lineMatchesAt(gl0, c0, first)) continue;

          // Stage 2: verify full multi-line match (including spaces)
          if (r0 + patLines.length > ROWS) continue;

          let ok = true;
          for (let rr = 0; rr < patLines.length; rr++) {
            const pl = patLines[rr] ?? "";
            const gl = gridLines[r0 + rr];

            if (!oASC.lineMatchesAt(gl, c0, pl)) { ok = false; break; }
          }
          if (!ok) continue;

          // Mark matched glyph cells in green (skip spaces to reduce noise)
          for (let rr = 0; rr < patLines.length; rr++) {
            const pl = patLines[rr] ?? "";
            for (let cc = 0; cc < pl.length; cc++) {
              const pc = pl[cc];
              if (pc === " ") continue;
              const r = r0 + rr;
              const c = c0 + cc;
              if (r < 0 || r >= ROWS || c < 0 || c >= COLS) continue;
              greenSet.add(keyRC(r, c));
            }
          }
        }
      }
    }
    return { greenSet };
  }

  //     ____  ____   _          _                              ___ 
  //    |_   ||   _| (_)        / |_                          .' _ '. 
  //      | |__| |   __   .--. `| |-' .--.   _ .--.  _   __   | (_) '___
  //      |  __  |  [  | ( (`\] | | / .'`\ \[ `/'`\][ \ [  ]  .`___'/ _/
  //     _| |  | |_  | |  `'.'. | |,| \__. | | |     \ '/ /  | (___)  \_
  //    |____||____|[___][\__) )\__/ '.__.' [___]  [\_:  /   `._____.\__| 
  //     _______                         _          \__.' 
  //    |_   __ \                       (_)        / |_ 
  //      | |__) |.---.  _ .--.  .--.   __   .--. `| |-'.---.  _ .--.   .---.  .---.
  //      |  ___// /__\\[ `/'`\]( (`\] [  | ( (`\] | | / /__\\[ `.-. | / /'`\]/ /__\\ 
  //     _| |_   | \__., | |     `'.'.  | |  `'.'. | |,| \__., | | | | | \__. | \__., 
  //    |_____|   '.__.'[___]   [\__) )[___][\__) )\__/ '.__.'[___||__]'.___.' '.__.' 
  //
  // SECTION: HISTORY & PERSISTENCE

  this.serializeToText = function () 
  {
    const lines = [];
    for (let r = 0; r < ROWS; r++) lines.push(ascii[r].join(''));
    return lines.join('\n');
  }

  this.sanitizeForSave = function(text) 
  {
    let t = String(text ?? "")
        .replace(/\\r\\n/g, '\n')         // 1) Convert literal escape sequences to real newlines
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '\n')
        .replace(/\r\n/g, '\n')           // 2) Normalize real CRLF / CR to LF
        .replace(/\r/g, '\n');

    t = this.collapseAfterWideCharsForSave(t);

    // 3) Trim trailing spaces/tabs per line
    let lines = t
        .split('\n')
        .map(line => line.replace(/[ \t]+$/g, ""));


    // 4) Remove leading empty lines
    while (lines.length > 0 && lines[0] === "") {
        lines.shift();
    }

    // 5) Remove trailing empty lines
    while (lines.length > 0 && lines[lines.length - 1] === "") {
        lines.pop();
    }

    return lines.join('\n');
  }

  this.collapseAfterWideCharsForSave = function(text)
  {
    const lines = oCOM.toLines(text);
    const out = [];
    for (const line of lines)
    {
        // Work at code-point level but treat output as "cells"
        const cells = Array.from(line); // code points
        const filtered = [];
        for (let i = 0; i < cells.length; i++)
        {
            const ch = cells[i];
            filtered.push(ch);
            if (oCOM.isDoubleWidthChar(ch)) i ++;  // Remove the following cell by skipping it
        }
        out.push(filtered.join(""));
    }

    return out.join('\n');
  }

  this.doUndo = function() 
  {
    const stroke = undoStack.pop();
    if (!stroke) return;
    for (let i = stroke.length - 1; i >= 0; i--) ascii[stroke[i].r][stroke[i].c] = stroke[i].prev;
    redoStack.push(stroke);
    updateUI();
    draw("doUndo");
  }

  this.doRedo = function() 
  {
    const stroke = redoStack.pop();
    if (!stroke) return;
    for (let i = 0; i < stroke.length; i++) ascii[stroke[i].r][stroke[i].c] = stroke[i].next;
    undoStack.push(stroke);
    updateUI();
    draw("doRedo");
  }


}

var oASC = new ASC();
/////////////////////////////////////////////////////////////////////



//     ____   ____                _   __   __        _________                              _                   __ 
//    |_  _| |_  _|              (_) [  | [  |      |  _   _  |                            (_)                 [  |
//      \ \   / /,--.   _ .--.   __   | |  | |  ,--.|_/ | | \_|.---.  _ .--.  _ .--..--.   __   _ .--.   ,--.   | |
//       \ \ / /`'_\ : [ `.-. | [  |  | |  | | `'_\ :   | |   / /__\\[ `/'`\][ `.-. .-. | [  | [ `.-. | `'_\ :  | |
//        \ ' / // | |, | | | |  | |  | |  | | // | |, _| |_  | \__., | |     | | | | | |  | |  | | | | // | |, | |
//         \_/  \'-;__/[___||__][___][___][___]\'-;__/|_____|  '.__.'[___]   [___||__||__][___][___||__]\'-;__/[___] 


function TERMINAL(props) 
{
  props = props || {};

  // ---- config --------------------------------------------------------------
  var containerId = props.container || "vanilla-terminal";
  var userCommands = props.commands || {};
  var welcome =
    props.welcome !== undefined ? props.welcome : 'Welcome to <a href="">Vanilla</a> terminal.';
  var prompt = props.prompt || "";
  var separator = props.separator || "&gt;";

  // ---- constants -----------------------------------------------------------
  var STORAGE_KEY = "VanillaTerm";
  var ROOT_CLASS = "VanillaTerm";

  // ---- helpers -------------------------------------------------------------

  function renderMarkup(shell) {
    return (
      '\n      <div class="container">\n' +
      "        <output></output>\n" +
      '        <div class="command">\n' +
      '          <div class="prompt">' +
      shell.prompt +
      shell.separator +
      "</div>\n" +
      '          <input class="input" spellcheck="false" autofocus />\n' +
      "        </div>\n" +
      "      </div>\n    "
    );
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function cloneCommandNode(commandEl) {
    var line = commandEl.cloneNode(true);
    var input = line.querySelector(".input");

    input.autofocus = false;
    input.readOnly = true;
    input.insertAdjacentHTML("beforebegin", escapeHtml(input.value));
    input.parentNode.removeChild(input);

    line.classList.add("line");
    return line;
  }

  function loadHistory() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (_) {
      return [];
    }
  }

  function saveHistory(history) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (_) {
      // ignore quota / privacy mode errors
    }
  }

  // ---- instance state ------------------------------------------------------

  var builtins =
    window.VanillaTerminalBuiltins &&
    typeof window.VanillaTerminalBuiltins.createBuiltInCommands === "function"
      ? window.VanillaTerminalBuiltins.createBuiltInCommands()
      : {};

  this.commands = Object.assign({}, userCommands, builtins);

  this.history = loadHistory();
  this.historyCursor = this.history.length;

  this.shell = { prompt: prompt, separator: separator };

  this.state = {
    prompt: false, // prompt mode = next ENTER answers a question
    idle: false,
  };

  this.onAskCallback = function () {};
  this.onInputCallback = null;

  // ---- DOM -----------------------------------------------------------------

  var root = document.getElementById(containerId);
  if (!root) {
    throw new Error("Container #" + containerId + " doesn't exists.");
  }

  // Cache DOM
  root.classList.add(ROOT_CLASS);
  root.insertAdjacentHTML("beforeEnd", renderMarkup(this.shell));

  var container = root.querySelector(".container");
  this.DOM = {
    root: root,
    container: container,
    output: container.querySelector("output"),
    command: container.querySelector(".command"),
    input: container.querySelector(".command .input"),
    prompt: container.querySelector(".command .prompt"),
  };

  // ---- internal methods that need `this` -----------------------------------

  var self = this;

  function resetCommand() {
    self.DOM.input.value = "";
    self.DOM.command.classList.remove("input");
    self.DOM.command.classList.remove("hidden");

    if (typeof self.DOM.input.scrollIntoView === "function") {
      self.DOM.input.scrollIntoView({ block: "nearest" });
    }
  }

  function handleKeyUp(event) {
    var key = event.key || "";
    var code = event.keyCode;

    if (key === "Escape" || code === 27) {
      self.DOM.input.value = "";
      event.stopPropagation();
      event.preventDefault();
      return;
    }

    var isUp = key === "ArrowUp" || code === 38;
    var isDown = key === "ArrowDown" || code === 40;
    if (!isUp && !isDown) return;

    if (isUp && self.historyCursor > 0) self.historyCursor -= 1;
    if (isDown && self.historyCursor < self.history.length - 1) self.historyCursor += 1;

    var value = self.history[self.historyCursor];
    if (value !== undefined) self.DOM.input.value = value;
  }

  function handleKeyDown(event) {
    var key = event.key || "";
    var code = event.keyCode;

    var isEnter = key === "Enter" || code === 13;
    if (!isEnter) return;

    var commandLine = self.DOM.input.value.trim();
    if (!commandLine) return;

    // Prompt mode: answer a question instead of dispatching a command
    if (self.state.prompt) {
      self.state.prompt = false;
      self.onAskCallback(commandLine);
      self.setPrompt(); // restore normal prompt
      resetCommand();
      return;
    }

    // Save in history
    self.history.push(commandLine);
    saveHistory(self.history);
    self.historyCursor = self.history.length;

    // Echo command as output line
    self.DOM.output.appendChild(cloneCommandNode(self.DOM.command));

    // Hide live command line while processing
    self.DOM.command.classList.add("hidden");
    self.DOM.input.value = "";

    // Pre-dispatch hook: allow host to handle the raw line.
    var parts = commandLine.split(" ");
    var command = parts[0];
    var params = parts.slice(1);


    if (typeof self.onInputCallback === "function") {
      try {
        var handled = self.onInputCallback(command, params, commandLine);
        if (handled === true) {
          resetCommand();
          return;
        }
      } catch (err) {
        self.output("[ERROR] " + escapeHtml(err && err.message ? err.message : String(err)));
        resetCommand();
        return;
      }
    }

    // Dispatch (built-ins / user commands)
    var callback = self.commands[command];

    if (typeof callback === "function") {
      callback(self, params);
    } else {
      self.output("<u>" + escapeHtml(command) + "</u>: command not found.");
    }
  }

  // ---- public API (instance methods defined here) ---------------------------

  this.clear = function () {
    self.DOM.output.innerHTML = "";
    resetCommand();
  };

  this.idle = function () {
    self.state.idle = true;
    self.DOM.command.classList.add("idle");
    self.DOM.prompt.innerHTML = '<div class="spinner"></div>';
  };

  this.prompt = function (question, callback) {
    self.state.prompt = true;
    self.onAskCallback = typeof callback === "function" ? callback : function () {};

    self.DOM.prompt.innerHTML = String(question) + ":";
    resetCommand();
    self.DOM.command.classList.add("input");
  };

  this.onInput = function (callback) {
    self.onInputCallback = callback;
  };

  this.output = function (html) {
    if (html === undefined) html = "&nbsp;";
    self.DOM.output.insertAdjacentHTML("beforeEnd", "<span>" + html + "</span>");
    resetCommand();
  };

  this.setPrompt = function (newPrompt) {
    if (newPrompt === undefined) newPrompt = self.shell.prompt;

    self.shell = { prompt: newPrompt, separator: self.shell.separator };
    self.state.idle = false;

    self.DOM.command.classList.remove("idle");
    self.DOM.prompt.innerHTML = String(newPrompt) + self.shell.separator;
    self.DOM.input.focus();
  };

  // ---- listeners -----------------------------------------------------------

  // Auto-scroll when new output is appended.
  var observer = new MutationObserver(function () 
  {
    setTimeout(function () {
      self.DOM.input.scrollIntoView({ block: "nearest" });
    }, 0);
  });
  observer.observe(self.DOM.output, { childList: true, subtree: true });

  // Focus handling: focus the input when clicking inside the terminal,
  // but do NOT steal focus when selecting/copying text in the output.
  self.DOM.root.addEventListener(
    "click",
    function (ev) {
      // Ignore clicks outside the terminal root
      if (!self.DOM.root.contains(ev.target)) return;
      // Don't steal focus when the user is interacting with the output area (selection/copy)
      if (self.DOM.output.contains(ev.target)) return;
      self.DOM.input.focus();
    },
    false
  );

  self.DOM.command.addEventListener(
    "click",
    function () {
      self.DOM.input.focus();
    },
    false
  );

  self.DOM.input.addEventListener("keyup", handleKeyUp, false);
  self.DOM.input.addEventListener("keydown", handleKeyDown, false);

  // ---- initial output ------------------------------------------------------

  if (welcome) this.output(welcome);
};
