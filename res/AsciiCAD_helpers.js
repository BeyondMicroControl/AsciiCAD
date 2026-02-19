                                                                                                                                                                                                            
//     █████  ███████  ██████ ██ ██  ██████  █████  ██████      ██   ██ ███████ ██      ██████  ███████ ██████  ███████ 
//    ██   ██ ██      ██      ██ ██ ██      ██   ██ ██   ██     ██   ██ ██      ██      ██   ██ ██      ██   ██ ██      
//    ███████ ███████ ██      ██ ██ ██      ███████ ██   ██     ███████ █████   ██      ██████  █████   ██████  ███████ 
//    ██   ██      ██ ██      ██ ██ ██      ██   ██ ██   ██     ██   ██ ██      ██      ██      ██      ██   ██      ██ 
//    ██   ██ ███████  ██████ ██ ██  ██████ ██   ██ ██████      ██   ██ ███████ ███████ ██      ███████ ██   ██ ███████ 





//     █████  ███████  ██████                                                                                           
//    ██   ██ ██      ██                                                                                                
//    ███████ ███████ ██                                                                                                
//    ██   ██      ██ ██                                                                                                
//    ██   ██ ███████  ██████    

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

  this.CADScript = function()
  {
  }
  this.CADScript.help = 
  {
    type: "AsciiCAD_CMD",
    usage: "CADScript {<i>expression</i>}",
    desc: "Run a CADScript expression",
    examples: ["CADScript {clear();doUndo()}"]
  };

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
      this.draw("scheduleResize");
    });
  }

  this.canvasPointToCell = function(clientX, clientY)
  {
    const rect = canvas.getBoundingClientRect();
    const px = oCOM.PanZoomSize(clientX,rect.left,1/stageSize.w, 1/stageSize.w,rect.width)
    const py = oCOM.PanZoomSize(clientY,rect.top,1/stageSize.h, 1/stageSize.h ,rect.height)

    const cx = stageSize.w / 2;
    const cy = stageSize.h / 2;

    const { cw, ch } = this.getCellSize?.() ?? { cw: 0, ch: 0 };
    const c = Math.floor( oCOM.PanZoomSize(px,cx,scale,panX,cw) );
    const r = Math.floor( oCOM.PanZoomSize(py,cy,scale,panY,ch) );

    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return null;
    return { r, c };
  }

  this.expandWideCharsForGrid = function(text) 
  {
    const outLines = [];
    const lines = oCOM.toLines(text); // your normalizeNewlines + split('\n')
    for (const line of lines)
    {
        let out = "";
        for (const ch of line)  // code-point safe
        {
            out += ch;
            if (oCOM.isDoubleWidthChar(ch)) out += ' ';  // pad one cell
        }
        outLines.push(out);
    }
    return outLines.join('\n');
  }

  //     ______                               ___       _____                                      _
  //    |_   _ `.                           .' _ '.    |_   _|                                    / |_
  //      | | `. \ _ .--.  ,--.  _   _   __ | (_) '___   | |      ,--.    _   __   .--.   __   _ `| |-' 
  //      | |  | |[ `/'`\]`'_\ :[ \ [ \ [  ].`___'/ _/   | |   _ `'_\ :  [ \ [  ]/ .'`\ \[  | | | | | 
  //     _| |_.' / | |    // | |,\ \/\ \/ /| (___)  \_  _| |__/ |// | |,  \ '/ / | \__. | | \_/ |,| |,
  //    |______.' [___]   \'-;__/ \__/\__/ `._____.\__||________|\'-;__/[\_:  /   '.__.'  '.__.'_/\__/
  //                                                                     \__.' 
  // SECTION: DRAW & LAYOUT

  // subsection: freeform
  this.beginFreeform = function(cell) 
  {
    isDrawing = true;
    lastCellKey = null;
    this.currentStroke = [];
    if (!cell) return;
    lastCellKey = cell.r + ',' + cell.c;
    this.applyOpAtCell(cell,op);
    this.draw("beginFreeform");
  }

  this.moveFreeform = function(cell) 
  {
    if (!isDrawing || !cell) return;
    const key = cell.r + ',' + cell.c;
    if (key === lastCellKey) return;
    lastCellKey = key;
    this.applyOpAtCell(cell,op);
    this.draw("moveFreeform");
  }

  this.endFreeform = function() 
  {
    if (!isDrawing) return;
    isDrawing = false;
    const stroke = this.currentStroke;
    this.currentStroke = [];
    lastCellKey = null;
    this.pushStrokeIfNonEmpty(stroke);
  }

  this.freeform = function(r, c, next) 
  {
    if(r===undefined || c===undefined || next===undefined) return;  // safe escape if no arguments provided
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS)
      throw new Error("Position out of bounds. Valid: col[0-" + (COLS - 1) + "], row[0-" + (ROWS - 1) + "]");
      
    this.currentStroke = [];
    op.ch    = next;
    op.type  = "place";
    var cell = {"r":r,"c":c};

    this.applyOpAtCell(cell,op);                   // display character on grid & push coordinate to currentStroke
    this.pushStrokeIfNonEmpty(this.currentStroke);   // feed undo buffer
  }
  this.freeform.help = 
    {
      type: "CADScript_FN",
      usage: "freeform(<i>c</i>,<i>r</i>,<i>char</i>)",
      desc: "",
      examples: ["oASC.freeform(0,0,'+')"]
    }

  this.text = function(r, c, str) 
  {
    if(r===undefined || c===undefined || str===undefined) return;  // safe escape if no arguments provided
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS)
      throw new Error("Position out of bounds. Valid: col[0-" + (COLS - 1) + "], row[0-" + (ROWS - 1) + "]");
     
    this.currentStroke = [];
    for(var i=0;i<str.length;i++)
    {
      op.ch    = str.charAt(i);
      op.type  = "place";
      var cell = {"r":r,"c":c+i};
      if(cell.c < COLS)
        this.applyOpAtCell(cell,op);                   // display character on grid & push coordinate to currentStroke
    }

    this.pushStrokeIfNonEmpty(this.currentStroke);     // feed undo buffer
  }
  this.text.help = "text(<i>c</i>,<i>r</i>,<i>string</i>)";
  this.text.help = 
    {
      type: "CADScript_FN",
      usage: "text(<i>c</i>,<i>r</i>,<i>string</i>)",
      desc: "",
      examples: ["oASC.text(0,0,\"TEST\")"]
  }

  // subsection catalog items
  this.cat = function(c, r, a, uid)       // TODO: CONTINUE 
  {
    it = this.findCatalogItemByUID(uid);

    if(pasteDrag==null) pasteDrag = {item_data:{}};
    pasteDrag.item_data.rotation = a;                           // default rotation
    pasteDrag.item_data.uid = uid   // unique id for this catalog item
    const text_data = it.text_data[ pasteDrag.item_data.rotation ];

    updateOpLine("catalog",it);

    const expanded = oASC.expandWideCharsForGrid(text_data || "");

    const forPaste = expanded.replace(new RegExp(WILDCHAR_U, 'g'), " ");   // WILDCARD_U becomes a real space for placement
    oASC.startPasteWithText(forPaste);


    var cell = {"r":r,"c":c}; 
    oASC.commitPasteAt(cell);

  }
  this.cat.help = 
  {
    type: "CADScript_CMD",
    usage: "cat(<i>c</i>,<i>r</i>,<i>angle</i>,<i>uid</i>)",
    desc: "",
    examples: ["oASC.cat(0,0,0,\"ATTINY85V-10PU\")"]
  }

  this.lcat = function() 
  {

    // TODO : list catalog items
    const items = (typeof CATALOG !== "undefined") ? CATALOG : [];
    var tokenlist = [];

    for (let i = 0; i < items.length; i++) 
    {
      const it = items[i];
      const itUID = it.name + "_" + it.type + "_" + it.MFR;
      tokenlist.push(itUID);
    }
    tokenlist.sort();
    oTERM.output(oCOM.escapeHTML( "CATALOG ITEMS:\n\n"+tokenlist.join("\n") ));
  }
  this.lcat.help = 
  {
    type: "CADScript_FN",
    usage: "lcat()",
    desc: "list all catalog item UIDs",
    examples: ["oASC.lcat()"]
  }


  // subsection: lines

  this.beginLine = function(cell,kind) 
  {
    if (!cell) return;
    if(bDebug) console.log("beginLine()")

    // hide selection box when starting a line tool action
    selection = null; selectDrag = null; moveDrag = null;
    lineDrag = {
      kind,
      flip: !shiftDown,      // Shift held => horizontal-first (no vertical leg)
      merge: !oDown,         // 'o' held => override (no merge)
      start: { r: cell.r, c: cell.c },
      cur:   { r: cell.r, c: cell.c }
    };

    this.draw("beginLine");
  }

  this.moveLine = function(cell)
  {
    //if(bDebug) console.log("moveLine() "+lineDrag);
    if (!lineDrag) return;
    if (!cell) return;
    if (cell.r === lineDrag.cur.r && cell.c === lineDrag.cur.c) return;
    lineDrag.cur = { r: cell.r, c: cell.c };
    // live modifiers during preview
    lineDrag.flip  = !shiftDown;
    lineDrag.merge = !oDown;
    this.draw("moveLine");
  }

  // TODO: why is endLine() unused ? 
  this.endLine = function()
  {
    if (!lineDrag) return;

    const path = this.buildOrthogonalPath(lineDrag.start,lineDrag.cur,lineDrag.flip,lineDrag.kind);
    const stroke = [];

    for (const p of path)
    {
      if (p.r < 0 || p.r >= ROWS || p.c < 0 || p.c >= COLS) continue;

      const prev = ascii[p.r][p.c];
      const next = p.ch;

      if (prev !== next) {
        stroke.push({ r: p.r, c: p.c, prev, next });
        this.drawCharAtCell(p.r, p.c, next); // commit writes to ascii
      }
    }

    if(bDebug) console.log("endLine()");
    lineDrag = null;
    this.pushStrokeIfNonEmpty(stroke);
    this.draw("endLine");
  }

  // TODO: why is cancelLine() unused ? 
  this.cancelLine = function() 
  {
    lineDrag = null;
    this.draw("cancelLine");
  }

  this.getCharAtCell  = function(r, c) {  return ascii[r][c] }
  this.drawCharAtCell = function(r, c, ch) { ascii[r][c] = ch; }

  this.drawLinePreview = function() 
  {
    if (!lineDrag) return;
    const path = this.buildOrthogonalPath(lineDrag.start,lineDrag.cur,lineDrag.flip,lineDrag.kind);
  }

  this.buildOrthogonalPath = function(start, end, start_vleg, kind)
  {

    var cornerChar = function(r0, c0, r1, c1, v_leg, chset)  // private helper for buildOrthogonalPath
    {
      if ( (c1 > c0) &&  (r1 > r0)) return v_leg?chset.bl:chset.tr;  // left + down  | up + right
      if ( (c1 > c0) && !(r1 > r0)) return v_leg?chset.tl:chset.br;  // left + up    | up + left
      if (!(c1 > c0) &&  (r1 > r0)) return v_leg?chset.br:chset.tl;  // right + down | down + right
      return v_leg?chset.tr:chset.bl;                                // right + up   | down + left
    }

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

  // TODO: unused, check why
  // INFO: likely replaced by commitLineWithOptionalMerge()
  this.commitLine = function()
  {
    if (!lineDrag) return;

    const path = this.buildOrthogonalPath(lineDrag.start,lineDrag.cur,lineDrag.flip,lineDrag.kind);

    const stroke = [];
    for (const p of path) {
      if (p.r < 0 || p.r >= ROWS || p.c < 0 || p.c >= COLS) continue;

      const prev = ascii[p.r][p.c];
      const next = p.ch;

      if (prev !== next) {
        stroke.push({ r: p.r, c: p.c, prev, next });
        ascii[p.r][p.c] = next;
      }
    }

    lineDrag = null;
    this.pushStrokeIfNonEmpty(stroke);
    this.draw("commitLine");
  }


  this.commitLineWithOptionalMerge = function(mergeEnabled, lineKind)
  {
    if (bDebug) console.log("commitLineWithOptionalMerge() lineDrag=", lineDrag);
    if (!lineDrag) return;

    // TODO: check and describe what this function does
    function addNeighborsToSet(set, r, c) 
    {
      set.add(r + "," + c);
      if (r > 0) set.add((r - 1) + "," + c);
      if (r < ROWS - 1) set.add((r + 1) + "," + c);
      if (c > 0) set.add(r + "," + (c - 1));
      if (c < COLS - 1) set.add(r + "," + (c + 1));
    }

    const path = this.buildOrthogonalPath(lineDrag.start, lineDrag.cur, lineDrag.flip, lineDrag.kind);

    // De-dup: last char wins
    const cellMap = new Map();
    for (const p of path) {
      if (p.r < 0 || p.r >= ROWS || p.c < 0 || p.c >= COLS) continue;
      cellMap.set(p.r + "," + p.c, p.ch);
    }

    const stroke = [];
    const touched = [];

    // PASS 1: write the line characters
    for (const [key, ch] of cellMap) {
      const parts = key.split(",");
      const r = Number(parts[0]);
      const c = Number(parts[1]);

      const prev = ascii[r][c];
      let next = ch;

      // Merge only if both are mergeable (and your this.mergedWireGlyph supports single/double)
      if (mergeEnabled) {
        const prevIsWire = (prev === " ") || this.isWireGlyph(prev);
        const nextIsWire = (next === " ") || this.isWireGlyph(next);

        if (prevIsWire && nextIsWire) {
          // If styles differ and prev is not blank, keep prev style here.
          const prevStyle = isDoubleWire(prev) ? "double" : isThickWire(prev) ? "thick" : (prev === " " ? null : "single");
          const nextStyle = isDoubleWire(next) ? "double" : isThickWire(next) ? "thick" : (next === " " ? null : "single");

          if (prev !== " " && prevStyle && nextStyle && prevStyle !== nextStyle) {
            // leave it for recompute to resolve as mixed junction; don't upgrade
            next = prev;
          } else {
            next = this.mergedWireGlyph(prev, next, lineKind);
          }
        }
      }

      if (prev === " ") next = ch;            // draw into blank
      else if (!this.isWireGlyph(prev)) next = ch; // overwrite non-wire (optional: you may prefer keep prev)
      else next = prev;                       // keep existing wire as-is; recompute will place junction

      if (prev !== next) {
      stroke.push({ r, c, prev, next });
      ascii[r][c] = next;
      touched.push({ r, c });
      } else {
      // even if unchanged, mark touched so recompute can update the crossing cell
      touched.push({ r, c });
      }

    }

    if (mergeEnabled && touched.length)
    {
      const affected = new Set();
      for (let i = 0; i < touched.length; i++) addNeighborsToSet(affected, touched[i].r, touched[i].c);

      this.normalizeAffected(affected, stroke);
    }

    lineDrag = null;
    this.pushStrokeIfNonEmpty(stroke);
    this.draw("commitLineWithOptionalMerge");
  }

  // subsection: boxes

  this.beginBox = function(cell, kind) 
  {
    if (!cell) return;
    selection = null; selectDrag = null; moveDrag = null;
    boxDrag = { kind, start: { r: cell.r, c: cell.c }, cur: { r: cell.r, c: cell.c } };
    this.draw("beginBox");
  }

  this.moveBox = function(cell) 
  {
    if (!boxDrag || !cell) return;
    if (cell.r === boxDrag.cur.r && cell.c === boxDrag.cur.c) return;
    boxDrag.cur = { r: cell.r, c: cell.c };
    this.draw("moveBox");
  }

  this.commitBox = function() 
  {
    if (!boxDrag) return;
    const style = boxDrag.kind === "double" ? BOX_DOUBLE : boxDrag.kind === "thick" ? BOX_THICK : BOX_SINGLE;
    this.box( boxDrag.start.c,boxDrag.start.r , boxDrag.cur.c,boxDrag.cur.r , style );
    boxDrag = null;
    this.draw("commitBox");
  }

  this.BOX_SINGLE = { h:'─', v:'│', tl:'┌', tr:'┐', bl:'└', br:'┘' };
  this.BOX_THICK =  { h:'━', v:'┃', tl:'┏', tr:'┓', bl:'┗', br:'┛' };
  this.BOX_DOUBLE = { h:'═', v:'║', tl:'╔', tr:'╗', bl:'╚', br:'╝' };

  this.box = function(c0,r0,c1,r1, style)
  {
     if(c0===undefined || r0===undefined || c1===undefined || r1===undefined) return;  // safe escape if no arguments provided
    if(style===undefined) var style = { h:'─', v:'│', tl:'┌', tr:'┐', bl:'└', br:'┘' };
    const path = this.buildBoxPath( {"c":c0,"r":r0} , {"c":c1,"r":r1} , style);

    // De-dup (corners overwrite edges)
    const m = new Map();
    for (const p of path)
    {
      if (p.r < 0 || p.r >= ROWS || p.c < 0 || p.c >= COLS) continue;
      m.set(p.r + ',' + p.c, p.ch);
    }

    this.currentStroke = [];
    for (const [key, ch] of m) 
    {
      const [r, c] = key.split(',').map(Number);
      const cell = {"r":r,"c":c};
      const op = {"ch":ch,"type":"place"};
      this.applyOpAtCell( cell , op );                     // display character on grid & build undo buffer
    }
    this.pushStrokeIfNonEmpty(this.currentStroke);   // commit undo buffer 
  }
  this.box.help = 
  {
    type: "CADScript_Fn",
    usage: "box(<i>c0</i>,<i>r0</i>,<i>c1</i>,<i>r1</i>,<i>style</i>)",
    desc: "Draw a box in line style BOX_DOUBLE|BOX_THICK|BOX_DOUBLE",
    examples: ["oASC.box(1,0,3,2,BOX_SINGLE)","oASC.box(1,0,3,2,BOX_THICK)","oASC.box(1,0,3,2,BOX_DOUBLE)"]
  }
  
  "box(<i>c0</i>,<i>r0</i>,<i>c1</i>,<i>r1</i>,<i>style</i>)";

  this.clear = function () 
  {
    this.currentStroke = [];
    for(var c=0;c<COLS;c++)
      for(var r=0;r<ROWS;r++)
      {
        if(ascii[r][c]!=' ')
        {
          const cell = {"r":r,"c":c};
          const op   = {"ch":' ',"type":"place"};
          this.applyOpAtCell?.( cell , op ) ?? {};           // display character on grid & build undo buffer
        }
      };
    this.pushStrokeIfNonEmpty?.(this.currentStroke) ?? {};   // commit undo buffer 
  }
  this.clear.help = 
  {
    type: "CADScript_CMD",
    usage: "clear()",
    desc: "Clears the grid and pushes a single undo stroke.",
    examples: ["oASC.clear()"]
  };

  // TODO: describe what it does, and check if this can be used as generic function or it should be a private function
  // INFO: currently only used in beginFreeform(), moveFreeform(), endFreeform()
  this.applyOpAtCell = function(cell,op)
  {
    const prev = ascii[cell.r][cell.c];
    const next = (op.type === "place") ? op.ch : ' ';
    if (prev === next) return;
    this.currentStroke.push({ r: cell.r, c: cell.c, prev, next });
    ascii[cell.r][cell.c] = next;
  }  

  this.hasDoubleH = function(ch) { return DOUBLE_H.has(ch); }
  this.hasDoubleV = function(ch) { return DOUBLE_V.has(ch); }

  // “double box” check: ╔══╗ / ║  ║ / ╚══╝ ... and intersected with single lines
  this.isValidDoubleBox = function(r0, c0, r1, c1) 
  {
    if (r1 <= r0 || c1 <= c0) return false;

    // Keep corners strict (recommended)
    if (ascii[r0][c0] !== "╔") return false;
    if (ascii[r0][c1] !== "╗") return false;
    if (ascii[r1][c0] !== "╚") return false;
    if (ascii[r1][c1] !== "╝") return false;

    // Top & bottom edges must carry double-horizontal
    for (let c = c0 + 1; c <= c1 - 1; c++) {
      if (!this.hasDoubleH(ascii[r0][c])) return false;
      if (!this.hasDoubleH(ascii[r1][c])) return false;
    }

    // Left & right edges must carry double-vertical
    for (let r = r0 + 1; r <= r1 - 1; r++) {
      if (!this.hasDoubleV(ascii[r][c0])) return false;
      if (!this.hasDoubleV(ascii[r][c1])) return false;
    }

    return true;
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

  this.blank = function(c0,r0,c1,r1)
  {
    const rect = {"c0":c0,"r0":r0,"c1":c1,"r1":r1};
    this.applyBlankRect(rect);
  }
  this.blank.help = 
  {
    type: "CADScript_FN",
    usage: "blank(<i>c0</i>,<i>r0</i>,<i>c1</i>,<i>r1</i>)",
    desc: "",
    examples: ["oASC.blank()"]
  }

  this.applyBlankRect = function(rect)
  {
    if (!rect) return;
    const stroke = [];

    for (let r = rect.r0; r <= rect.r1; r++) {
      for (let c = rect.c0; c <= rect.c1; c++) {
        const prev = ascii[r][c];
        if (prev !== ' ') {
          stroke.push({ r, c, prev, next: ' ' });
          ascii[r][c] = ' ';
        }
      }
    }

    this.pushStrokeIfNonEmpty(stroke);
  }

  this.isWireGlyph = function(ch) { return glyphToMask.has(ch); }


  this.isVisiblyRenderable = function(ch, font = "16px monospace") 
  {
    if (!ch) return false;

    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = font;
    ctx.textBaseline = "top";
    ctx.fillText(ch, 8, 8);

    const img = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    // If any pixel has non-zero alpha, something rendered.
    for (let i = 3; i < img.length; i += 4) {
      if (img[i] !== 0) return true;
    }
    return false;
  }

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

  // TODO: describe what it does, benefits and likely use cases
  // INFO: only used in commitLineWithOptionalMerge() and SanityCheck.js
  this.normalizeAffected = function(affected, stroke) 
  {
    for (let pass = 0; pass < 2; pass++) {
      let changed = false;
      affected.forEach((key) => {
        const [rs, cs] = key.split(",");
        const r = Number(rs), c = Number(cs);
        const prev = ascii[r][c];
        const next = this.recomputeWireCell(r, c);
        if (prev !== next) {
          stroke.push({ r, c, prev, next });
          ascii[r][c] = next;
          changed = true;
        }
      });
      if (!changed) break;
    }
  }
  
  // TODO: describe what it does, benefits and likely use cases
  // INFO: only used in commitLineWithOptionalMerge() and SanityCheck.js (extensively)
  this.recomputeWireCell = function(r, c) 
  {
    const cur = ascii[r][c];

    // only touch blanks or wires
    if (cur !== " " && !this.isWireGlyph(cur)) return cur;

    let m = 0;
    let hDouble = false; // any double on horizontal axis
    let vDouble = false; // any double on vertical axis
    let hThick  = false; // any thick on horizontal axis
    let vThick  = false; // any thick on vertical axis

      // earlier implemented in separate function cellMaskFromNeighbors() and axisStylesFromNeighbors()
      // UP contributes N if it connects DOWN (S)
      if (r > 0) {
        const up = ascii[r - 1][c];
        const um = glyphToMask.get(up) ?? 0;
        if (um & S) { m |= N; if (isDoubleWire(up)) vDouble = true; else if (isThickWire(up)) vThick = true; }
      }

      // DOWN contributes S if it connects UP (N)
      if (r < ROWS - 1) {
        const dn = ascii[r + 1][c];
        const dm = glyphToMask.get(dn) ?? 0;
        if (dm & N) { m |= S; if (isDoubleWire(dn)) vDouble = true; else if (isThickWire(dn)) vThick = true; }
      }

      // LEFT contributes W if it connects RIGHT (E)
      if (c > 0) {
        const lt = ascii[r][c - 1];
        const lm = glyphToMask.get(lt) ?? 0;
        if (lm & E) { m |= W; if (isDoubleWire(lt)) hDouble = true; else if (isThickWire(lt)) hThick = true; }
      }

      // RIGHT contributes E if it connects LEFT (W)
      if (c < COLS - 1) {
        const rt = ascii[r][c + 1];
        const rm = glyphToMask.get(rt) ?? 0;
        if (rm & W) { m |= E; if (isDoubleWire(rt)) hDouble = true; else if (isThickWire(rt)) hThick = true; }
      }

    if (m === 0) { ascii[r][c] = " "; return " "; }

    // Determine style per axis
    const hStyle = hDouble ? "double" : (hThick ? "thick" : "single");
    const vStyle = vDouble ? "double" : (vThick ? "thick" : "single");

    const bothSingle = (hStyle === "single" && vStyle === "single");
    const bothThick  = (hStyle === "thick"  && vStyle === "thick");
    const bothDouble = (hStyle === "double" && vStyle === "double");

    function cross() {
      // same-style crosses
      if (hStyle === "single" && vStyle === "single") return "┼";
      if (hStyle === "thick"  && vStyle === "thick")  return "╋";
      if (hStyle === "double" && vStyle === "double") return "╬";

      // mixed-style crosses
      // double × single
      if (hStyle === "double" && vStyle === "single") return "╪";
      if (hStyle === "single" && vStyle === "double") return "╫";

      // double × thick
      if (hStyle === "thick"  && vStyle === "double") return "╫";
      if (hStyle === "double" && vStyle === "thick")  return "╪";

      // thick × single
      if (hStyle === "thick"  && vStyle === "single") return "┿";
      if (hStyle === "single" && vStyle === "thick")  return "╂";

      return "┼";
    }

    function horiz() { return hDouble ? "═" : (hThick ? "━" : "─"); }
    function vert()  { return vDouble ? "║" : (vThick ? "┃" : "│"); }

    function corner(mask) {
      if (mask === (E|S)) return bothSingle ? "┌" : bothThick ? "┏" : bothDouble ? "╔" : hDouble ? "╒" : vDouble ? "╓" : hThick ? "┍" : "┎";
      if (mask === (W|S)) return bothSingle ? "┐" : bothThick ? "┓" : bothDouble ? "╗" : hDouble ? "╕" : vDouble ? "╖" : hThick ? "┑" : "┒";
      if (mask === (E|N)) return bothSingle ? "└" : bothThick ? "┗" : bothDouble ? "╚" : hDouble ? "╘" : vDouble ? "╙" : hThick ? "┕" : "┖";
      if (mask === (W|N)) return bothSingle ? "┘" : bothThick ? "┛" : bothDouble ? "╝" : hDouble ? "╛" : vDouble ? "╜" : hThick ? "┙" : "┚";
      return cur;
    }

    function tee(mask) {
      if (mask === (E|S|W)) return bothSingle ? "┬" : bothThick ? "┳" : bothDouble ? "╦" : hDouble ? "╤" : vDouble ? "╥" : hThick ? "┯" : "┰";
      if (mask === (E|N|W)) return bothSingle ? "┴" : bothThick ? "┻" : bothDouble ? "╩" : hDouble ? "╧" : vDouble ? "╨" : hThick ? "┷" : "┸";
      if (mask === (N|E|S)) return bothSingle ? "├" : bothThick ? "┣" : bothDouble ? "╠" : hDouble ? "╞" : vDouble ? "╟" : hThick ? "┝" : "┠";
      if (mask === (N|W|S)) return bothSingle ? "┤" : bothThick ? "┫" : bothDouble ? "╣" : hDouble ? "╡" : vDouble ? "╢" : hThick ? "┥" : "┨";
      return cur;
    }

    let next = cur;

    if (m === (E|W)) next = horiz();
    else if (m === (N|S)) next = vert();
    else if (m === (N|E|S|W)) next = cross();
    else if (m === (E|S) || m === (W|S) || m === (E|N) || m === (W|N)) next = corner(m);
    else if (m === (E|S|W) || m === (E|N|W) || m === (N|E|S) || m === (N|W|S)) next = tee(m);
    else {
      // endpoints (N only / S only / etc): DO NOT erase
      next = cur;
    }

    ascii[r][c] = next;
    return next;
  }

  // subsection: freetext

  this.beginFreetext = function(cell)
  {
    if (!cell) return;
    textDrag = { anchor: { r: cell.r, c: cell.c }, text: "" };        // Start a new preview at this anchor.
    canvas.focus?.();                                                 // Ensure canvas can receive key events
    this.draw("beginFreetext");
  }

  this.commitFreetext = function()
  {
    if (!textDrag) return;

    const r = textDrag.anchor.r;
    let   c = textDrag.anchor.c;
    const stroke = [];

    for (const ch of Array.from(textDrag.text)) {
      if (ch === '\n' || ch === '\r') continue;
      if (r < 0 || r >= ROWS) break;
      if (c < 0) { c++; continue; }
      if (c >= COLS) break;

      const prev = ascii[r][c];
      const next = ch;

      if (prev !== next) stroke.push({ r, c, prev, next });
      c++;
    }

    // apply after capturing prev
    for (const s of stroke) ascii[s.r][s.c] = s.next;

    textDrag = null;
    this.pushStrokeIfNonEmpty(stroke);  // TODO: check out what it fixes
    this.draw("commitFreetext");
  }

  this.cancelFreetext = function()
  {
    textDrag = null;
    this.draw("cancelFreetext");
  }

  // subsection: select

  this.beginSelect = function(cell) 
  {
    if (!cell) return;

    const snapshotRect = function(rect)   // private helper for beginSelect
    {
      const m = new Map();
      for (let r = rect.r0; r <= rect.r1; r++) for (let c = rect.c0; c <= rect.c1; c++) m.set(r + ',' + c, ascii[r][c]);
      return m;
    }

    if (selection && cell.r >= selection.r0 && cell.r <= selection.r1 && cell.c >= selection.c0 && cell.c <= selection.c1)
    {
        moveDrag = {
          startCell: cell,
          offset: { dr: 0, dc: 0 },
          baseRect: selection,
          snapshot: snapshotRect(selection),
          action: (tool === "modeCopy") ? "copy" : "move",
        };

        this.draw("beginSelect (begin moveDrag)");
        return;
    }
    selection  = null;
    moveDrag   = null;
    selectDrag = { start: cell, current: cell };
    this.draw("beginSelect");
  }

  this.moveSelect = function(cell)
  {
    if (!cell) return;
    if (moveDrag) {
        const dr = cell.r - moveDrag.startCell.r;
        const dc = cell.c - moveDrag.startCell.c;
        if (dr === moveDrag.offset.dr && dc === moveDrag.offset.dc) return;
        moveDrag.offset = { dr, dc };
        this.draw("moveSelect");
        return;
    }
    if (selectDrag) {
        selectDrag.current = cell;
        this.draw("moveSelect");
    }
  }

  this.endSelect = function() 
  {
    // Keep selection after selecting; clear after move commit.
    if (moveDrag) {
      const base = moveDrag.baseRect;
      const snapMap = moveDrag.snapshot;
      const { dr, dc } = moveDrag.offset;

      if (moveDrag.action === "copy") this.applyCopy(base, dr, dc, snapMap);
      else                            this.applyMove(base, dr, dc, snapMap);

      moveDrag = null;
      selectDrag = null;
      selection = null; // disappear after mouseup (same behavior)
      this.draw("endSelect");
      return;
    }

    if (selectDrag) 
    {
        selection = oCOM.normRect(selectDrag.start, selectDrag.current);
        selectDrag = null;

        if (tool === "modeBlank") {
          this.applyBlankRect(selection);
          selection = null; // clear overlay after blanking
        }

        this.draw("endSelect");
    }
  }

  this.wipeSelection = function(ch)
  {
    // TODO use range selection as parameter
    const stroke = [];
    for (let r = 0; r < ROWS; r++)
    {
        for (let c = 0; c < COLS; c++)
        {
          const prev = ascii[r][c];
          if (prev !== ' ') { stroke.push({ r, c, prev, next: ' ' }); this.drawCharAtCell(r,c,ch);}
        }
    }
    selection = null; selectDrag = null; moveDrag = null; this.cancelPaste();
    this.pushStrokeIfNonEmpty(stroke);
    this.draw("wipeSelection");
  }

  this.applyMove = function(baseRect, dr, dc, snapMap) 
  {
    if (dr === 0 && dc === 0) return;
    const stroke = [];

    // Clear base rect
    for (let r = baseRect.r0; r <= baseRect.r1; r++) {
        for (let c = baseRect.c0; c <= baseRect.c1; c++)
        {
            const prev = ascii[r][c];
            if (prev !== ' ')
            {
                stroke.push({ r, c, prev, next: ' ' });
                ascii[r][c] = ' ';
            }
        }
    }

    // Paste moved snapshot (clip to grid)
    for (let r = baseRect.r0; r <= baseRect.r1; r++)
    {
        for (let c = baseRect.c0; c <= baseRect.c1; c++)
        {
            const chx = snapMap.get(r + ',' + c) || ' ';
            const rr = r + dr;
            const cc = c + dc;
            if (rr < 0 || rr >= ROWS || cc < 0 || cc >= COLS) continue;
            const prev = ascii[rr][cc];
            const next = chx;
            if (prev !== next)
            {
                stroke.push({ r: rr, c: cc, prev, next });
                ascii[rr][cc] = next;
            }
        }
    }
    this.pushStrokeIfNonEmpty(stroke);
  }

  this.applyCopy = function(baseRect, dr, dc, snapMap) 
  {
    if (dr === 0 && dc === 0) return;
    const stroke = [];

    // Paste snapshot at offset (clip to grid) — DO NOT clear source
    for (let r = baseRect.r0; r <= baseRect.r1; r++) {
      for (let c = baseRect.c0; c <= baseRect.c1; c++) {
        const chx = snapMap.get(r + ',' + c) || ' ';
        if (chx === ' ') continue; // optional: keeps copy sparse

        const rr = r + dr;
        const cc = c + dc;
        if (rr < 0 || rr >= ROWS || cc < 0 || cc >= COLS) continue;

        const prev = ascii[rr][cc];
        const next = chx;
        if (prev !== next) {
          stroke.push({ r: rr, c: cc, prev, next });
          ascii[rr][cc] = next;
        }
      }
    }

    this.pushStrokeIfNonEmpty(stroke);
  }

  this.commitPasteAt = function() {
    if (!pasteDrag || !pasteDrag.anchor) return;

    const a = pasteDrag.anchor; // <-- use live anchor (may be outside grid)
    const stroke = [];

    for (let rr = 0; rr < pasteDrag.h; rr++) {
      const line = pasteDrag.lines[rr] || '';
      for (let cc = 0; cc < pasteDrag.w; cc++) {
        const chx = line[cc] || ' ';
        if (pasteDrag.transparentSpaces && chx === ' ') continue;

        const tr = a.r + rr;
        const tc = a.c + cc;

        // commit: clip to grid
        if (tr < 0 || tr >= ROWS || tc < 0 || tc >= COLS) continue;

        const prev = ascii[tr][tc];
        const next = chx;
        if (prev === next) continue;

        stroke.push({ r: tr, c: tc, prev, next });
        ascii[tr][tc] = next;
      }
    }

    pasteDrag = null;
    this.pushStrokeIfNonEmpty(stroke);
    updateUI();
    this.draw("commitPasteAt(anchor)");
  };


  this.cancelPaste = function() 
  {
    if (!pasteDrag) return;
    pasteDrag = null;
    updateUI();
    this.draw("cancelPaste");
  }

  // subsection: generic draw helpers

  this.pushStrokeIfNonEmpty = function(stroke) 
  {
    if (!stroke || stroke.length === 0) return;

    undoStack.push(stroke);
    redoStack.length = 0;

    // Invalidate caches that depend on grid contents
    if (schemaHighlightOn) highlightCache = null;
    if (schemaMatchOn) matchCache = null;

    if (netlistOn) {
      netlistCache = null;     // force recompute on next hover/draw
      hoverNetIndex = -1;      // clear current selection until next hover
    }

    updateUI();
  }




  // Paste (preview + commit)
this.startPasteWithText = function(text) 
{
  const raw = oCOM.normalizeNewlines(text).split('\n');
  while (raw.length > 0 && raw[raw.length - 1] === '') raw.pop();
  if (raw.length === 0) { pasteDrag = null; updateUI(); this.draw("startPasteWithText"); return; }

  let w = 0;
  for (const ln of raw) w = Math.max(w, ln.length);

  const maxH = Math.min(raw.length, ROWS);
  const maxW = Math.min(w, COLS);
  const lines = raw.slice(0, maxH).map(ln => ln.slice(0, maxW));

  // Pointer/hover cell is where the user "is"
  const pointer = hoverCell
    ? { r: hoverCell.r, c: hoverCell.c }
    : { r: Math.floor(ROWS/2), c: Math.floor(COLS/2) };

  // Center offset so the pointer sits in the middle of the paste rect
  const offR = Math.floor(lines.length / 2);
  const offC = Math.floor(maxW / 2);

  // Convert pointer cell -> top-left anchor (clamped to grid)
  let anchorR = pointer.r - offR;
  let anchorC = pointer.c - offC;

  //anchorR = Math.max(0, Math.min(anchorR, ROWS - lines.length));
  //anchorC = Math.max(0, Math.min(anchorC, COLS - maxW));

  pasteDrag = {
    lines,
    h: lines.length,
    w: maxW,
    item_data: pasteDrag == null ? null : pasteDrag.item_data, // carry over item data if any

    anchor: { r: anchorR, c: anchorC },
    anchorMode: "center",
    anchorOffset: { r: offR, c: offC },

    transparentSpaces: true,
  };

  setMode("modeSelect");
  selection = null;
  selectDrag = null;
  moveDrag = null;

  updateUI();
  this.draw("startPasteWithText");
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
        const expanded = this.expandWideCharsForGrid(raw);
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
    if (patCh === WILDCHAR_U) return WILD_U_SET.has(gridCh);
    return patCh === gridCh;
  }

  this.findCatalogItemByUID = function(uid) 
  {
    const items = (typeof CATALOG !== "undefined") ? CATALOG : [];
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      const itUID = it.name + "_" + it.type + "_" + it.MFR;
      if (itUID === uid) return it;
    }
    return null;
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

            if (!this.isValidDoubleBox(r0, c0, r1, c1)) continue;

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
  



  function __computeNetlistCore(opts)
  {
    opts = opts || {};
    const includeCellSet = !!opts.includeCellSet;

    const overlay = oASC.computeHighlightOverlay?.() ?? { redSet: new Set(), insideSet: new Set() };
    const mo = oASC.computeMatchOverlay?.() ?? { solidSet: new Set(), greenSet: new Set(), footprintSet: new Set() };

    // For CE detection we want the footprint (includes wildcard cells)
    const compSet = mo.footprintSet ?? mo.solidSet ?? mo.greenSet ?? new Set();

    // One source of truth for banned
    const banned = oASC.computeNetlistBannedSet?.(mo, overlay) ?? new Set();

    function isNetWireCell(r,c)
    {
      const k = keyRC(r,c);
      if (banned.has(k)) return false;
      const ch = ascii?.[r]?.[c];
      if (ch === undefined) return false;
      if (ch === " ") return false;
      return (glyphToMask.get(ch) ?? 0) !== 0;
    }

    function connectedNeighbors(r,c)
    {
      const out = [];
      const ch = ascii[r][c];
      const m  = glyphToMask.get(ch) ?? 0;

      // up
      if ((m & N) && r > 0 && isNetWireCell(r-1,c)) {
        const m2 = glyphToMask.get(ascii[r-1][c]) ?? 0;
        if (m2 & S) pushUnique(out, r-1, c);
      }
      // down
      if ((m & S) && r < ROWS-1 && isNetWireCell(r+1,c)) {
        const m2 = glyphToMask.get(ascii[r+1][c]) ?? 0;
        if (m2 & N) pushUnique(out, r+1, c);
      }

      // left (with horizontal-only crossing bypass ─│─)
      if ((m & W) && c > 0 && isNetWireCell(r, c-1)) {
        const ch2 = ascii[r][c-1];
        const m2  = glyphToMask.get(ch2) ?? 0;

        if (m2 & E) {
          pushUnique(out, r, c-1);
        } else {
          const isVerticalOnly = (m2 & N) && (m2 & S) && !(m2 & E) && !(m2 & W);
          if (isVerticalOnly && c-2 >= 0 && isNetWireCell(r, c-2)) {
            const m3 = glyphToMask.get(ascii[r][c-2]) ?? 0;
            if (m3 & E) pushUnique(out, r, c-2);
          }
        }
      }

      // right (with horizontal-only crossing bypass ─│─)
      if ((m & E) && c < COLS-1 && isNetWireCell(r, c+1)) {
        const ch2 = ascii[r][c+1];
        const m2  = glyphToMask.get(ch2) ?? 0;

        if (m2 & W) {
          pushUnique(out, r, c+1);
        } else {
          const isVerticalOnly = (m2 & N) && (m2 & S) && !(m2 & E) && !(m2 & W);
          if (isVerticalOnly && c+2 < COLS && isNetWireCell(r, c+2)) {
            const m3 = glyphToMask.get(ascii[r][c+2]) ?? 0;
            if (m3 & W) pushUnique(out, r, c+2);
          }
        }
      }

      return out;
    }

    function pushUniqueCR(out, c, r) {
      for (let i = 0; i < out.length; i++) if (out[i].c === c && out[i].r === r) return;
      out.push({ c, r });
    }
    function hasCR(out, c, r) {
      for (let i = 0; i < out.length; i++) if (out[i].c === c && out[i].r === r) return true;
      return false;
    }

    function tryAddCE(LE, CE, fromR, fromC, compR, compC, needBitOnComp)
    {
      if (compR < 0 || compR >= ROWS || compC < 0 || compC >= COLS) return;
      const kk = KeyRC(compR, compC);
      if (!compSet.has(kk)) return;

      const chC = ascii?.[compR]?.[compC];
      if (!chC || chC === " " || chC === "§") return;

      const mC = glyphToMask.get(chC) ?? 0;
      if (!(mC & needBitOnComp)) return;

      pushUniqueCR(CE, compC, compR);
      if (!hasCR(LE, fromC, fromR)) pushUniqueCR(LE, fromC, fromR);
    }

    const visited = new Set();
    const nets = [];

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!isNetWireCell(r,c)) continue;
        const rootK = KeyRC(r,c);
        if (visited.has(rootK)) continue;

        // BFS
        const q = [{r,c}];
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

        // degrees => LE/LJ
        for (const n of nodes) {
          const d = deg.get(KeyRC(n.r, n.c)) ?? 0;
          if (d === 1) pushUniqueCR(LE, n.c, n.r);
          else if (d >= 3) pushUniqueCR(LJ, n.c, n.r);
        }

        // CE scan on all nodes
        for (const n of nodes) {
          const m = glyphToMask.get(ascii[n.r][n.c]) ?? 0;
          if (m & W) tryAddCE(LE, CE, n.r, n.c, n.r, n.c - 1, E);
          if (m & E) tryAddCE(LE, CE, n.r, n.c, n.r, n.c + 1, W);
          if (m & N) tryAddCE(LE, CE, n.r, n.c, n.r - 1, n.c, S);
          if (m & S) tryAddCE(LE, CE, n.r, n.c, n.r + 1, n.c, N);
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

    return nets;
  }




  // Netlist extraction: follow connected wire glyphs outside double-box boundaries.
  // Returns [{ LE:[{c,r},...], LJ:[{c,r},...]} ...]
  this.computeNetlistLines = function() {
    const nets = __computeNetlistCore({ includeCellSet: false });
    return nets.map(n => ({ LE: n.LE, LJ: n.LJ, CE: n.CE }));
  };


  this.computeNetlistNets = function() {
    const nets = __computeNetlistCore({ includeCellSet: true });
    return nets.map(n => ({ cells: n.cellSet, LE: n.LE, LJ: n.LJ, CE: n.CE, CO: n.CE }));
  };
  

  this.printNetlist = function()
  {
    if (window.oTERM && typeof oTERM.output === "function") 
    {
      const lines = (typeof this.computeNetlistLines === "function")
        ? this.computeNetlistLines()
        : [];

      const pretty = JSON.stringify(lines, null, 2)
        .replace(/\n\s+"r": /g      ,"\"r\":")
        .replace(/\n\s+"c": /g      ,"\"c\":")
        .replace(/\[\n\s+\{/g        ,"[{")
        .replace(/\n\s+\}\n\s+\]/g   ,"}]")
        .replace(/\n(\s+)\},\n(\s)+\{"/g ,"},\n$1{\"")
        .replace(/\]\n(\s+)\},\n\s+\{/g        ,"]\n$1},{");

      const l = lines.length;                          // for JSON line report
      oTERM.output("<b>NETLIST</b> (" +l + " " +(l==1?"net":"nets")+") \n"
            +"<pre>"
            + oCOM.escapeHTML(pretty) +
            "</pre>");
    }
  }
  this.printNetlist.help =
  {
    type: "Tool",
    usage: "PrintNetlist()",
    desc: "Extract connected wire lines (endpoints + junctions), excluding valid double-box boundaries/interiors.",
    examples: ["oASC.PrintNetlist()"]
  };


  function pushUnique(out, r, c)
  {
    for (let i=0;i<out.length;i++) if (out[i].r===r && out[i].c===c) return;
    out.push({r,c});
  }

  function KeyRC(r,c){ return r + "," + c; }


  this.computeNetlistBannedSet = function(moIn, hlIn)
  {
    const banned = new Set();

    // 1) Exclude double-line boxes (frame + interior)
    const hl = hlIn ?? (this.computeHighlightOverlay?.() ?? { redSet: new Set(), insideSet: new Set() });
    hl.redSet?.forEach(k => banned.add(k));
    hl.insideSet?.forEach(k => banned.add(k));

    // 2) Exclude matched catalog components (pattern cells only; skip spaces + '§')
    const mo = moIn ?? (this.computeMatchOverlay?.() ?? { solidSet: new Set(), greenSet: new Set() });
    const banSet = mo.solidSet ?? mo.greenSet ?? new Set();
    banSet.forEach(k => banned.add(k));

    return banned;
  }


  this.computeMatchOverlay = function()
  {
    const greenSet = new Set();
    const rects = [];
    const solidSet = new Set(); // NEW: for netlist masking (skip ' ' and '§')
    const footprintSet = new Set();  // component footprint (skip ' ' only)

    if (!(typeof CATALOG !== "undefined" && Array.isArray(CATALOG)))
      return { greenSet, rects, solidSet, footprintSet };

    if (!catalogVariantsCache) catalogVariantsCache = this.buildCatalogVariants();

    // Build grid lines once for fast access
    const gridLines = new Array(ROWS);
    for (let r = 0; r < ROWS; r++) gridLines[r] = ascii[r].join("");

    for (let v = 0; v < catalogVariantsCache.length; v++)
    {
      const pat = catalogVariantsCache[v];
      const first = pat.first;
      const patLines = pat.lines;

      // compute a stable rectangle width (max line length)
      let w = 0;
      for (let i = 0; i < patLines.length; i++)
        w = Math.max(w, (patLines[i] ?? "").length);
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

          // NEW: record full bounding rectangle (includes spaces)
          rects.push({ r0, c0, r1: r0 + h - 1, c1: c0 + w - 1 });

          // existing: mark matched glyph cells in green (skip spaces)
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

              const k = keyRC(r, c);

              // Footprint includes wildcard cells too (so CE can “see” pins/protrusions)
              footprintSet.add(k);

              // Visual highlight + ban mask exclude wildcard cells
              if (pc !== "§") {
                greenSet.add(k);
                solidSet.add(k);
              }
            }
          }
        }
      }
    }

    return { greenSet, rects, solidSet, footprintSet };
  }


  this.lineMatchesAt = function(gridLine, c0, patLine) // helper for computeMatchOverlay (TODO: useful to privatise or not?)
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
        .replace(/\\r\\n/g, '\n')           // 1) Convert literal escape sequences to real newlines
        .replace(/\\n/g,    '\n')
        .replace(/\\r/g,    '\n')
        .replace(/\r\n/g,   '\n')           // 2) Normalize real CRLF / CR to LF
        .replace(/\r/g,     '\n');

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

    // Invalidate overlays after undo
    highlightCache = null;
    matchCache = null;
    netlistCache = null;
    hoverNetIndex = -1;

    updateUI();
    this.draw("doUndo");
  }
  this.doUndo.help = 
  {
    type: "CADScript_CMD",
    usage: "doUndo()",
    desc: "Undo last action",
    examples: ["oASC.doUndo()"]
  };

  this.doRedo = function() 
  {
    const stroke = redoStack.pop();
    if (!stroke) return;
    for (let i = 0; i < stroke.length; i++) ascii[stroke[i].r][stroke[i].c] = stroke[i].next;
    undoStack.push(stroke);

    // Invalidate overlays after undo
    highlightCache = null;
    matchCache = null;
    netlistCache = null;
    hoverNetIndex = -1;

    updateUI();
    this.draw("doRedo");
  }
  this.doRedo.help = 
  {
    type: "CADScript_CMD",
    usage: "doRedo()",
    desc: "Redo last undone action",
    examples: ["oASC.doRedo()"]
  };


  this.draw = function( str_reason ) 
  {
    function renderCharAtCell(ctx, r, c, ch) 
    {
      const x = c * baseCellW + baseCellW / 2;
      const y = r * baseCellH + baseCellH / 2;
      ctx.fillText(ch, x, y);
    }

    const dpr = window.devicePixelRatio || 1;
    const wCss = stageSize.w;
    const hCss = stageSize.h;

    ctx.setTransform(1,0,0,1,0,0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.fillStyle = GRID_BG;
    ctx.fillRect(0,0,wCss,hCss);

    const cx = wCss/2, cy = hCss/2;
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);
    ctx.translate(-cx + panX, -cy + panY);

    // TODO: refactor this function, as it leads to unreadable code, difficult to debug/understand
    const getSnapFns = function(dpr, scaleNow)
    {
      const pxScale = (dpr || 1) * (scaleNow || 1);
      const snap = (v) => Math.round(v * pxScale) / pxScale;
      const snapLine = (v) => (Math.round(v * pxScale) + 0.5) / pxScale;
      return { snap, snapLine };
    }
    const { snap, snapLine } = getSnapFns(dpr, scale);   // get snap functions

    var { cw, ch } = oASC.getCellSize();

    // Visible bounds in WORLD coordinates (undo pan/zoom around center)
    const left   = (0 - cx) / scale + cx - panX;
    const top    = (0 - cy) / scale + cy - panY;
    const right  = (wCss - cx) / scale + cx - panX;
    const bottom = (hCss - cy) / scale + cy - panY;

    // Convert bounds -> grid indices (clamped)
    const c0 = Math.max(0, Math.floor( oCOM.PanZoomSize(0,cx,scale,panX,cw) ));
    const r0 = Math.max(0, Math.floor( oCOM.PanZoomSize(0,cy,scale,panY,ch) ));
    const c1 = Math.min(COLS, Math.ceil( oCOM.PanZoomSize(wCss,cx,scale,panX,cw) ));
    const r1 = Math.min(ROWS, Math.ceil( oCOM.PanZoomSize(hCss,cy,scale,panY,ch)  ));

    ctx.beginPath();
    ctx.strokeStyle = GRID_LINE;
    ctx.lineWidth = 1 / scale;

    for (let c = c0; c <= c1; c++)  // vertical lines
    {
      const x = snapLine(c * cw);
      ctx.moveTo(x, snapLine(r0 * ch));
      ctx.lineTo(x, snapLine(r1 * ch));
    }

    for (let r = r0; r <= r1; r++)   // horizontal lines
    {
      const y = snapLine(r * ch);
      ctx.moveTo(snapLine(c0 * cw), y);
      ctx.lineTo(snapLine(c1 * cw), y);
    }

    ctx.stroke();
    ctx.fillStyle = "#000";     // Font sized to cell

    const cwr = 0.62;   // 0.62
    const maxByHeight = ch * 0.98;
    const maxByWidth = (cw / cwr) * 0.98;
    const fontPx = Math.max(4, Math.floor(Math.min(maxByHeight, maxByWidth)));

    ctx.font = fontPx + "px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Move preview
    if (moveDrag)
    {
      const b = moveDrag.baseRect;
      const o = moveDrag.offset;
      const snapMap = moveDrag.snapshot;
      ctx.save();
      ctx.globalAlpha = 0.9;
      for (let r = b.r0; r <= b.r1; r++)
      {
        for (let c = b.c0; c <= b.c1; c++)
        {
          const chx = snapMap.get(r + ',' + c) || ' ';
          if (chx === ' ') continue;
          const rr = r + o.dr;
          const cc = c + o.dc;
          if (rr < 0 || rr >= ROWS || cc < 0 || cc >= COLS) continue;
          ctx.fillText(chx, snap(cc * cw + cw/2), snap(rr * ch + ch/2));
        }
      }
      ctx.restore();
    }

    if (schemaHighlightOn && !highlightCache) highlightCache = oASC.computeHighlightOverlay();
    const redSet = highlightCache ? highlightCache.redSet : null;
    const insideSet = highlightCache ? highlightCache.insideSet : null;

    const BLACK = "rgba(0,0,0,1)";
    const BLUE = "rgba(59,130,246,0.9)";
    const RED  = "rgba(239,68,68,0.9)";
    const GREEN = "rgba(34,197,94,0.95)";

    if (schemaMatchOn && !matchCache) matchCache = oASC.computeMatchOverlay();

    const greenSet = matchCache ? matchCache.greenSet : null;
    // Draw all chars (skip base rect while moving)
    for (let r = 0; r < ROWS; r++)
    {
      for (let c = 0; c < COLS; c++)
      {
        const chx = ascii[r][c];
        if (chx === " ") continue;

        if (moveDrag)
        {
          const b = moveDrag.baseRect;
          if (r >= b.r0 && r <= b.r1 && c >= b.c0 && c <= b.c1) continue;
        }

        // Default color
        let color = BLACK;

        // Match overlay has priority (green)
        if (schemaMatchOn && greenSet) 
        {
          const k = keyRC(r, c);
          if (greenSet.has(k)) color = GREEN;
        }

        // Netlist hover highlight (BLUE) — overrides other colors for wire cells in the hovered net
        if (netlistOn && hoverNetIndex >= 0) {
          __ensureNetlistCache();
          const k = keyRC(r, c);
          const net = netlistCache?.nets?.[hoverNetIndex];
          if (net && net.cells && net.cells.has(k)) {
            color = BLUE;
          }
        }

        if (schemaHighlightOn && color === BLACK) 
        {
          const k = keyRC(r, c);
          const inside = insideSet && insideSet.has(k);

          // 1) Red: only double-line frame cells of enclosed rectangles
          // 2) Blue: single-line glyphs + crossings, but NOT inside double rectangles
          if (redSet && redSet.has(k) && (oASC.hasDoubleH(chx) || oASC.hasDoubleV(chx) || chx==="╔"||chx==="╗"||chx==="╚"||chx==="╝"))
            color = RED;
          else if (!inside) // single-line wires are: wire glyphs that are neither double nor thick
          {
            if (oASC.isWireGlyph(chx) && !isDoubleWire(chx) && !isThickWire(chx) && chx !== " ")
              color = BLUE;
          }
        }

        if (bDebug && netlistOn && netlistDebugCESet)
        {
          const kk = r + "," + c;           // MUST match __refreshNetlistDebugCE() keying
          if (netlistDebugCESet.has(kk)) {
            color = RED;                    // LAST override wins
          }
        }

        ctx.fillStyle = color;
        ctx.fillText(chx, snap(c * cw + cw / 2), snap(r * ch + ch / 2));
      }
    }

    // Selection overlay (stays after select; cleared after move mouseup)
    if (selection) 
    {
        const x0 = selection.c0 * cw;
        const y0 = selection.r0 * ch;
        const w = (selection.c1 - selection.c0 + 1) * cw;
        const h = (selection.r1 - selection.r0 + 1) * ch;
        ctx.save();
        ctx.lineWidth = 2 / scale;
        ctx.strokeStyle = "rgba(59,130,246,0.9)";
        ctx.fillStyle = "rgba(59,130,246,0.12)";
        ctx.fillRect(x0, y0, w, h);
        ctx.strokeRect(x0, y0, w, h);
        ctx.restore();
    }

    // Drag-select marquee
    if (selectDrag) 
    {
        const rr = oCOM.normRect(selectDrag.start, selectDrag.current);
        const x0 = rr.c0 * cw;
        const y0 = rr.r0 * ch;
        const w = (rr.c1 - rr.c0 + 1) * cw;
        const h = (rr.r1 - rr.r0 + 1) * ch;
        ctx.save();
        ctx.lineWidth = 2 / scale;
        ctx.setLineDash([6/scale, 4/scale]);
        ctx.strokeStyle = "rgba(16,185,129,0.95)";
        ctx.strokeRect(x0, y0, w, h);
        ctx.restore();
    }

    if (pasteDrag) drawPastePreview(cw, ch, snap);

    oASC.drawLinePreview();

    // Line preview overlay
    if (lineDrag)
    {
      const old = ctx.fillStyle;
      ctx.fillStyle = "rgba(59,130,246,0.9)";
      const path = oASC.buildOrthogonalPath(lineDrag.start,lineDrag.cur,lineDrag.flip,lineDrag.kind);

      for (const p of path)
      {
        if (p.r < 0 || p.r >= ROWS || p.c < 0 || p.c >= COLS) continue;
        renderCharAtCell(ctx, p.r, p.c, p.ch);
      }

      ctx.fillStyle = old;
    }

    if (boxDrag)
    {
      const old = ctx.fillStyle;
      ctx.fillStyle = "rgba(59,130,246,0.9)";
      const style = boxDrag.kind === "double" ? BOX_DOUBLE : boxDrag.kind === "thick" ? BOX_THICK : BOX_SINGLE;
      const path = oASC.buildBoxPath(boxDrag.start, boxDrag.cur, style);

      for (const p of path)
      {
          if (p.r < 0 || p.r >= ROWS || p.c < 0 || p.c >= COLS) continue;
          renderCharAtCell(ctx, p.r, p.c, p.ch); // canvas-only renderer
      }

      ctx.fillStyle = old;
    }

    if (textDrag) 
    {
      const old = ctx.fillStyle;
      ctx.fillStyle = "rgba(59,130,246,0.9)";
      const r = textDrag.anchor.r;
      let c = textDrag.anchor.c;
      renderCharAtCell(ctx, r, c-1, '█');

      for (const ch of Array.from(textDrag.text)) 
      {
          if (ch === '\n' || ch === '\r') continue;
          if (r < 0 || r >= ROWS) break;
          if (c < 0) { c++; continue; }
          if (c >= COLS) break;

          renderCharAtCell(ctx, r, c, ch); // canvas-only renderer
          c++;
      }

      ctx.fillStyle = old;
    }

    if(bDebug) console.log("draw(\""+str_reason+"\")")
  }
}
var oASC = new ASC();



/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////

                                                                  
//    ████████ ███████ ██████  ███    ███ ██ ███    ██  █████  ██      
//       ██    ██      ██   ██ ████  ████ ██ ████   ██ ██   ██ ██      
//       ██    █████   ██████  ██ ████ ██ ██ ██ ██  ██ ███████ ██      
//       ██    ██      ██   ██ ██  ██  ██ ██ ██  ██ ██ ██   ██ ██      
//       ██    ███████ ██   ██ ██      ██ ██ ██   ████ ██   ██ ███████ 






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
  root.insertAdjacentHTML("beforeEnd", renderMarkup(this.shell));   // Expected behavior in iframe: Blocked autofocusing on a form control in a cross-origin subframe.

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

    /*
    // REMOVED, we prefer to have no built-ins as such, everything should be handled as user command

    // Dispatch (built-ins / user commands)
    var callback = self.commands[command];

    if (typeof callback === "function") {
      callback(self, params);
    } else {
      self.output("<u>" + escapeHtml(command) + "</u>: command not found.");
    }
    */
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

  this.print = function(str)
  {
    this.output(str);
  }
  this.print.help = 
  {
    type: "",
    usage: "print(<i>str</i>)",
    desc: "",
    examples: ["oTERM.print(\"DONE\")"]    
  }

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


var oTERM;