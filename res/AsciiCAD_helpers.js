                                                                                                                                                                                                            
//     █████  ███████  ██████ ██ ██  ██████  █████  ██████      ██   ██ ███████ ██      ██████  ███████ ██████  ███████ 
//    ██   ██ ██      ██      ██ ██ ██      ██   ██ ██   ██     ██   ██ ██      ██      ██   ██ ██      ██   ██ ██      
//    ███████ ███████ ██      ██ ██ ██      ███████ ██   ██     ███████ █████   ██      ██████  █████   ██████  ███████ 
//    ██   ██      ██ ██      ██ ██ ██      ██   ██ ██   ██     ██   ██ ██      ██      ██      ██      ██   ██      ██ 
//    ██   ██ ███████  ██████ ██ ██  ██████ ██   ██ ██████      ██   ██ ███████ ███████ ██      ███████ ██   ██ ███████ 


// TODO UPDATE CELL WHEN PANNING !!!


//     █████  ███████  ██████                                                                                           
//    ██   ██ ██      ██                                                                                                
//    ███████ ███████ ██                                                                                                
//    ██   ██      ██ ██                                                                                                
//    ██   ██ ███████  ██████    

function ASC()
{

  //       ______  __                    __              
  //     .' ___  |[  |                  [  |             
  //    / .'   \_| | |   _   __  _ .--.  | |--.   .--.   
  //    | |   ____ | |  [ \ [  ][ '/'`\ \| .-. | ( (`\]  
  //    \ `.___]  || |   \ '/ /  | \__/ || | | |  `'.'.  
  //     `._____.'[___][\_:  /   | ;.__/[___]|__][\__) ) 
  //                    \__.'   [__|

  this.N = 0b0001, this.E = 0b0010, this.S = 0b0100, this.W = 0b1000;
  const N = this.N, E = this.E, S = this.S, W = this.W;

  // ------------------------------------------------------------
  // One builder for BOTH glyph->mask3 and mask3->glyph
  // ------------------------------------------------------------
  let __glyph3Codec = null;


  function getGlyph3Codec()
  {
    // cache is absent? => build it
    if (__glyph3Codec) return __glyph3Codec;

    // ---- build codec (single source of truth) ----
    const g2m = Object.create(null);         // glyph -> mask3
    const m2g = Object.create(null);         // mask3 -> glyph
    const m2gStandIn = Object.create(null);  // mask3 -> stand-in glyph

    const put = (glyph, mask3) =>    // canonical glyph: forward + reverse
    {
      g2m[glyph] = mask3;
      if (m2g[mask3] === undefined) m2g[mask3] = glyph;
    }

    const alias = (glyph, mask3) =>   // fallback glyph: forward only
    {
      g2m[glyph] = mask3;        
    }

    const standIn = (mask3, glyph) => // stand-in glyph: reverse-only
    {
      //if (m2gStandIn[mask3] === undefined) 
        m2gStandIn[mask3] = glyph;
    }

    // Pure style sets (single source of truth)
    const GL3_THIN_SET   = "─│┌┐└┘├┤┬┴┼╴╵╶╷";
    const GL3_FAT_SET    = "━┃┏┓┗┛┣┫┳┻╋╸╹╺╻";
    const GL3_DOUBLE_SET = "═║╔╗╚╝╠╣╦╩╬";

    // local direction-only mapping for pure sets (NO dirMask3 dependency)
    const dir4 = (g) => {
      const D = {
        "─":E|W,"━":E|W,"═":E|W,
        "│":N|S,"┃":N|S,"║":N|S,
        "┌":E|S,"┏":E|S,"╔":E|S,
        "┐":W|S,"┓":W|S,"╗":W|S,
        "└":E|N,"┗":E|N,"╚":E|N,
        "┘":W|N,"┛":W|N,"╝":W|N,
        "├":N|E|S,"┣":N|E|S,"╠":N|E|S,
        "┤":N|W|S,"┫":N|W|S,"╣":N|W|S,
        "┬":E|S|W,"┳":E|S|W,"╦":E|S|W,
        "┴":E|N|W,"┻":E|N|W,"╩":E|N|W,
        "┼":N|E|S|W,"╋":N|E|S|W,"╬":N|E|S|W,
        "╴":E,"╶":W,"╵":N,"╷":S,
        "╸":E,"╺":W,"╹":N,"╻":S
      }
      return (D[g] ?? 0) & 0xF;
    }

    // 1) MIX first (more specific)
    for (const glyph in GL3_MIX) {
      const e = GL3_MIX[glyph];
      put(glyph, pack3(e.thin, e.fat, e.doub));
    }

    // 2) Pure sets
    for (const glyph of GL3_DOUBLE_SET) put(glyph, pack3(0, 0, dir4(glyph)));
    for (const glyph of GL3_FAT_SET)    put(glyph, pack3(0, dir4(glyph), 0));
    for (const glyph of GL3_THIN_SET)   put(glyph, pack3(dir4(glyph), 0, 0));

    // 3) alternative sets
    alias("+", pack3(N|E|S|W, 0, 0));
    alias("-", pack3(E|W, 0, 0));
    alias("|", pack3(N|S, 0, 0));

    // 3) stand-in sets

    standIn(pack3(0, N|S, E), '┣');
    standIn(pack3(0, N|S, W), '┫');
    standIn(pack3(0, W, N|S), '╢');
    standIn(pack3(0, E, N|S), '╟');

    standIn(pack3(0, E|W, S), '┳');
    standIn(pack3(0, E|W, N), '┻');
    standIn(pack3(0, S, E|W), '╤');
    standIn(pack3(0, N, E|W), '╧');  


    standIn(pack3(0, 0, N), '║');
    standIn(pack3(0, 0, S), '║');
    standIn(pack3(0, 0, E), '═');
    standIn(pack3(0, 0, W), '═');

    __glyph3Codec = { g2m, m2g, m2gStandIn };
    return __glyph3Codec;
  }

  // Mixed table (thin/fat/doub split)
  const GL3_MIX = {
    // light/heavy stubs
    "╼": { thin: W,     fat: E },
    "╾": { thin: E,     fat: W },
    "╽": { thin: N,     fat: S },
    "╿": { thin: S,     fat: N },

    // mixed corners (light+heavy)
    "┍": { thin: S,     fat: E },
    "┎": { thin: E,     fat: S },
    "┑": { thin: S,     fat: W },
    "┒": { thin: W,     fat: S },
    "┕": { thin: N,     fat: E },
    "┖": { thin: E,     fat: N },
    "┙": { thin: N,     fat: W },
    "┚": { thin: W,     fat: N },

    // mixed crossings
    "┽": { thin: N|E|S, fat: W },
    "╀": { thin: E|S|W, fat: N },
    "┾": { thin: S|W|N, fat: E },
    "╁": { thin: W|N|E, fat: S },

    "┿": { thin: N|S,   fat: E|W },
    "╃": { thin: E|S,   fat: W|N },
    "╄": { thin: S|W,   fat: N|E },
    "╆": { thin: W|N,   fat: E|S },
    "╅": { thin: N|E,   fat: S|W },

    "╊": { thin: W,     fat: N|E|S },
    "╈": { thin: N,     fat: E|S|W },
    "╉": { thin: E,     fat: S|W|N },
    "╇": { thin: S,     fat: W|N|E },

    // mixed tees
    "┞": { thin: E|S,   fat: N },
    "┝": { thin: N|S,   fat: E },
    "┟": { thin: N|E,   fat: S },
    "┢": { thin: N,     fat: E|S },
    "┠": { thin: E,     fat: N|S },
    "┡": { thin: S,     fat: N|E },

    "┥": { thin: N|S,   fat: W },
    "┦": { thin: W|S,   fat: N },
    "┧": { thin: W|N,   fat: S },
    "┨": { thin: W,     fat: N|S },
    "┪": { thin: N,     fat: W|S },
    "┩": { thin: S,     fat: W|N },

    '┶': { thin: W|N,   fat: W },
    '┸': { thin: W|E,   fat: N },
    '┵': { thin: N|E,   fat: E },
    '┺': { thin: W,     fat: N|E },
    '┷': { thin: N,     fat: W|E },
    '┹': { thin: E,     fat: W|N },

    "┭": { thin: E|S,   fat: W },
    "┮": { thin: S|W,   fat: E },
    "┰": { thin: W|E,   fat: S },
    "┲": { thin: W,     fat: E|S },
    "┱": { thin: E,     fat: S|W },
    "┯": { thin: S,     fat: W|E },

    // light+double (doub sets both nibbles for those dirs)
    "╜": { thin: W,     doub: N },
    "╖": { thin: W,     doub: S },
    "╛": { thin: N,     doub: W },
    "╘": { thin: N,     doub: E },
    "╙": { thin: E,     doub: N },
    "╓": { thin: E,     doub: S },
    "╕": { thin: S,     doub: W },
    "╒": { thin: S,     doub: E },

    "╢": { thin: W,     doub: N|S },
    "╧": { thin: N,     doub: W|E },
    "╟": { thin: E,     doub: N|S },
    "╤": { thin: S,     doub: W|E },
    "╡": { thin: N|S,   doub: W },
    "╨": { thin: W|E,   doub: N },
    "╞": { thin: N|S,   doub: E },
    "╥": { thin: W|E,   doub: S },

    "╪": { thin: N|S,   doub: W|E },
    "╫": { thin: W|E,   doub: N|S }
  }

  // Pack rule: low nibble thin, high nibble fat; "doub" sets both.
  function pack3(thin, fat, doub) 
  {
    const t = ((thin || 0) | (doub || 0)) & 0xF;
    const f = ((fat  || 0) | (doub || 0)) & 0xF;
    return (t | (f << 4)) & 0xFF;
  }

// ------------------------------------------------------------
// Public APIs using the shared codec
// ------------------------------------------------------------

  this.glyph2mask = function(g) 
  {
    if (!g) return 0;
    const codec = getGlyph3Codec();
    return codec.g2m[g] ?? pack3(this.dirMask3(g), 0, 0);
  }
  this.glyph2mask.help =   
  {
    type: "CADScript_FN",
    usage: "glyph2mask(<i>glyph</i>)",
    desc:
      "Translate a wire glyph into an 8-bit mask: low nibble=thin(single/light), high nibble=fat(single/heavy). " +
      "Double wires set both nibbles. Mixed glyphs split directions between thin/fat using a lookup table.  " +
      "Alias glyphs are alternative glyphs for the same (bit)mapping, e.g. '┼' and '+' both map to N|E|S|W.",
    examples: [
      "oTERM.printJSON(oASC.glyph2mask('╇'))",
      "oTERM.printJSON(oASC.glyph2mask('╧'))",
    ],
    unitTests: [
      "oASC.assert('oASC.glyph2mask(\\'┼\\')', oASC.glyph2mask('┼') , N|E|S|W)",              // unitype-glyph canonical mapping (ignoring alias)
      "oASC.assert('oASC.glyph2mask(\\'+\\')', oASC.glyph2mask('+') , N|E|S|W)",              // unitype-glyph alias mapping
      "oASC.assert('oASC.glyph2mask(\\'╇\\')', oASC.glyph2mask('╇') , (S) | (W|N|E)<<4 )",    // mixed-glyph canonical mapping
      "oASC.assert('oASC.glyph2mask(\\'╧\\')', oASC.glyph2mask('╧') , (N|E|W) | (W|E)<<4 )",  // mixed-glyph canonical mapping (no stand-in)
      "oASC.assert('oASC.glyph2mask(\\'┣\\')', oASC.glyph2mask('┣') , (N|E|S)<<4 )"           // canonical mapping (ignoring stand-in)
    ]
  }

  this.mask2glyph = function(m) 
  {
    const v = (Number(m) || 0) & 0xFF;
    const codec = getGlyph3Codec();
    return codec.m2g[v] ?? codec.m2gStandIn[v] ?? " ";
  }
  this.mask2glyph.help = {
    type: "CADScript_FN",
    usage: "mask2glyph(<i>m</i>)",
    desc: "Reverse of glyph2mask: map extended 8-bit mask (fat<<4 | thin) back to a wire glyph. Returns ' ' if unknown. " +
    "Stand-in mappings are required when e.g. a fat wire glyph for '╞' does not exist, so when E|(N|S|E)<<4 is requested, a close-enough stand-in glyph like '┣' or '╞' will be returned (better than nothing). " +
    "By policy, stand-in glyphs must prioritise correct rendering of single and fat wires over double wires, because double wires are primarily used for drawing boxes not lines.",
    examples: [
      "oTERM.print(mask2glyph(\n(N|E|S|W)<<4))",              // ╋
      "oTERM.print(mask2glyph(\n(N|E|S|W) | ((N|E|S|W)<<4)))" // ╬
    ],
    unitTests: [
      "oASC.assert('oASC.mask2glyph( N|E|S|W )'   , oASC.mask2glyph( N|E|S|W )     ,'┼');",    // canonical mapping (ignoring fall-back)
      "oASC.assert('oASC.mask2glyph(S|(W|N|E)<<4)', oASC.mask2glyph(S|(W|N|E)<<4)  ,'╇');",    // canonical mapping (no fall-back present)
      "oASC.assert('oASC.mask2glyph(E|(N|S|E)<<4)', oASC.mask2glyph(E | (N|S|E)<<4),'┣');"     // stand-in mapping (no canonical mapping present)
    ]
  }

  this.glyphToMask = function(ch) 
  {
    const k = String(ch ?? "");
    const v = this.glyph2mask(k);
    return (v === undefined) ? 0 : ((v | v>>4) & 0xF);  // suprapose high bits with lower
  }
  this.glyphToMask.help = 
  {
    type: "CADScript_FN",
    usage: "glyphMask(<i>ch</i>)",
    desc: "Return 4-bit wire direction mask for a glyph (N|E|S|W). Unknown glyph returns 0. "+
    "Stand-in glyphs fullfil a inexistent (bit)mapping, e.g. '┼' and '+' both map to N|E|S|W.",
    examples: ["printJSON(glyphMask('┼'))", "printJSON(glyphMask('╵'))"]
  }

  this.dirMask3 = function(ch) 
  {
    const codec = getGlyph3Codec();
    const m8 = codec.g2m[String(ch ?? "")] ?? 0;
    return ((m8 & 0xF) | ((m8 >> 4) & 0xF)) & 0xF;
  }
  this.dirMask3.help = 
  {
    type: "CADScript_FN",
    usage: "dirMask3(<i>ch</i>)",
    desc: "Return 4-bit direction mask (N|E|S|W) for supported wire glyphs, independent of glyphToMask.",
    examples: ["printJSON(dirMask3('┼'))", "printJSON(dirMask3('╵'))"]
  }

  this.rotateMask3 = function(m)
  {
    const v = (Number(m) || 0) & 0xFF;
    const lo = v & 0xF;         // thin
    const hi = (v >> 4) & 0xF;  // fat
    const rot4 = (x) => (((x << 1) | (x >> 3)) & 0xF);
    return rot4(lo) | (rot4(hi) << 4);
  }

  this.rotateMask3.help = {
    type: "CADScript_FN",
    usage: "rotateMask(<i>m</i>)",
    desc: "Rotate an 8-bit wire mask 90 degrees clockwise. Low nibble (thin) and high nibble (fat) are rotated independently.",
    examples: [
      "oTERM.printJSON(rotateMask(\nglyph2mask('╆')))",
      "oTERM.print(mask2glyph(\nrotateMask(glyph2mask('╆'))))"
    ]
  }

  this.mirrorMask3 = function(m, bVertAxis)
  {
    const v  = (Number(m) || 0) & 0xFF;
    const lo = v & 0xF;
    const hi = (v >> 4) & 0xF;

    let lo2, hi2;

    if (bVertAxis) {
      lo2 = (lo & N) | (lo & E) << 2 | (lo & S) | (lo & W) >> 2;
      hi2 = (hi & N) | (hi & E) << 2 | (hi & S) | (hi & W) >> 2;
    } else {
      lo2 = (lo & N) << 2 | (lo & E) | (lo & S) >> 2 | (lo & W);
      hi2 = (hi & N) << 2 | (hi & E) | (hi & S) >> 2 | (hi & W);
    }

    return lo2 | (hi2 << 4);
  }
  this.mirrorMask3.help = 
  {
    type: "CADScript_FN",
    usage: "mirrorMask(<i>m</i>,<i>bVertAxis</i>)",
    desc: "Mirror an 8-bit wire mask. bVertAxis=true mirrors around vertical axis (E<->W). bVertAxis=false mirrors around horizontal axis (N<->S). Thin and fat nibbles are mirrored independently.",
    examples: [
      "oTERM.print(mask2glyph(\nmirrorMask(glyph2mask('╆'), true)))",
      "oTERM.print(mask2glyph(\nmirrorMask(glyph2mask('╆'), false)))"
    ]
  }

  // 4-bit -> glyph (thin/fat/double) via mask2glyph (8-bit)
  this.maskToSingle = function(m4){ return this.mask2glyph((Number(m4)||0) & 0xF) }
  this.maskToFat = function(m4){ return this.mask2glyph(((Number(m4)||0) & 0xF) << 4) }
  this.maskToDouble = function(m4){ const m = (Number(m4)||0) & 0xF; return this.mask2glyph(m | (m << 4)) }

  const BOX_CONTOUR = { h:E|W, v:N|S, tl:E|S, tr:W|S, bl:E|N, br:W|N }

  function buildBox(maskTo){
    return {
      h:  maskTo(BOX_CONTOUR.h),
      v:  maskTo(BOX_CONTOUR.v),
      tl: maskTo(BOX_CONTOUR.tl),
      tr: maskTo(BOX_CONTOUR.tr),
      bl: maskTo(BOX_CONTOUR.bl),
      br: maskTo(BOX_CONTOUR.br),
    }
  }

  this.BOX_SINGLE = buildBox(this.maskToSingle.bind(this));
  this.BOX_FAT    = buildBox(this.maskToFat.bind(this));
  this.BOX_DOUBLE = buildBox(this.maskToDouble.bind(this));

  this.hasDoubleH = function(ch){
    const m = this.glyph2mask(ch) & 0xFF;
    const lo = m & 0xF, hi = (m >> 4) & 0xF;
    return ((lo & (E|W)) !== 0) && ((hi & (E|W)) !== 0);
  }

  this.hasDoubleV = function(ch){
    const m = this.glyph2mask(ch) & 0xFF;
    const lo = m & 0xF, hi = (m >> 4) & 0xF;
    return ((lo & (N|S)) !== 0) && ((hi & (N|S)) !== 0);
  }

  this.isFatWire = function(ch){
    const m = this.glyph2mask(ch) & 0xFF;
    const lo = m & 0xF, hi = (m >> 4) & 0xF;
    return (hi !== 0) && (lo === 0);
  }

  this.isDoubleWire = function(ch){
    const m = this.glyph2mask(ch) & 0xFF;
    const lo = m & 0xF, hi = (m >> 4) & 0xF;
    return (lo !== 0) && (lo === hi);
  }

  // ===== Match overlay (catalog pattern matching) =====
  // Wildcards:
  //   #  => one digit [0-9]
  //   $  => one of [0-9A-Za-z +-*/%Ωπµ⍉⍵°.,;:?@&§_]
  const WILDCARD_D = "0123456789. ";
  const WILDCARD_S = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+-*/%Ωπµ⍉⍵°.,;:?@&§_ ";
  const WILDCARD_U = /*oCOM.rangeChars(0x0020, 0x007E)+*/oCOM.rangeChars(0x2500, 0x257F);
  this.WILDCHAR_U = '§';
  const WILD_D_SET = new Set(Array.from(WILDCARD_D));
  const WILD_S_SET = new Set(Array.from(WILDCARD_S));
  const WILD_U_SET = new Set(Array.from(WILDCARD_U));

  function keyRC(r, c) { return r + "," + c; }
  this.keyRC = function(r, c) { return r + "," + c; }

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
    type:  "AsciiCAD_CMD",
    usage: "CADScript {<i>expression</i>}",
    desc:  "Run a CADScript expression",
    examples: ["CADScript {clear();stack(\"undo\")}"]
  }

  this.env = Object.create(null);
  this.env.help = 
  {
    type:  "AsciiCAD_Var",
    usage: "env.my_variable = <i>expression<i>;",
    desc:  "assign a session persistent environment variable",
    examples: ["oASC.env.my_variable = 123","oASC.env.my_variable = \"ABC\""]
  }

  var undoStack = [];
  var redoStack = [];

  this.assert = function(name,got,exp)
  {
    if(typeof(got)=="boolean" || typeof(got)=="number" || typeof(got)=="undefined")
    {
      if(got==exp)
        console.assert("[UnitTest] "+name.replace(/\n/g,"↵"),"| GOT:" + got + " EXP:" + exp );
      else
        console.error("[UnitTest] "+name.replace(/\n/g,"↵"),"| GOT:" + got + " EXP:" + exp );
    }
    else if(typeof(got)=="object")
    {
      if(JSON.stringify(got)==JSON.stringify(exp))
        console.assert("[UnitTest] "+name.replace(/\n/g,"↵"),"| GOT:" + JSON.stringify(got) + " EXP:" + JSON.stringify(exp) );
      else
        console.error("[UnitTest] "+name.replace(/\n/g,"↵"),"| GOT:" + JSON.stringify(got) + " EXP:" + JSON.stringify(exp) );      
    }
    else if(got==exp)
      console.assert("[UnitTest] "+name.replace(/\n/g,"↵"),"| GOT:\""+got.replace(/\n/g,"↵") + "\" EXP:\"" + exp.replace(/\n/g,"↵")+"\"");
    else
       console.error("[UnitTest] "+name.replace(/\n/g,"↵"),"| GOT:\""+got.replace(/\n/g,"↵") + "\" EXP:\"" + exp.replace(/\n/g,"↵")+"\"");
  }

  // Stage sizing: ensure integer cell sizes (avoid remainder pixels -> spacing artifacts)
  this.computeStageSize = function() 
  {
      const r = container.getBoundingClientRect();
      let w = Math.max(1, Math.floor(r.width));
      let h = Math.max(1, Math.floor(r.height));
      if (w >= COLS) w = Math.floor(w / COLS) * COLS;
      if (h >= ROWS) h = Math.floor(h / ROWS) * ROWS;
      return { w: Math.max(1, w), h: Math.max(1, h) }
  }

  this.syncCanvasBufferToStage =  function() 
  {
      const dpr = window.devicePixelRatio || 1;
      const w = Math.max(1, Math.floor(stageSize.w * dpr));
      const h = Math.max(1, Math.floor(stageSize.h * dpr));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
  }

  this.getCellSize = function() { return { cw: baseCellW, ch: baseCellH } }

  // Resize observer (debounced via rAF)
  this.scheduleResize = function() 
  {
    if (typeof(this.resizeRaf) != "undefined") return;
    this.resizeRaf = requestAnimationFrame(() => 
    {
      delete this.resizeRaf;
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

    const { cw, ch } = this.getCellSize?.() ?? { cw: 0, ch: 0 }
    const c = Math.floor( oCOM.PanZoomSize(px,cx,scale,panX,cw) );
    const r = Math.floor( oCOM.PanZoomSize(py,cy,scale,panY,ch) );

    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return null;
    return { r, c }
  }

  this.expandWideCharsForGrid = function(text) 
  {
    const outLines = [];
    const lines = oCOM.toLines(text);
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
    this._currentStroke = [];
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
    const stroke = this._currentStroke;
    this._currentStroke = [];
    lastCellKey = null;
    this.pushStrokeIfNonEmpty(stroke);
  }

  this.cell = function(c, r, str) 
  {
    if(r===undefined || c===undefined || str===undefined) return;  // safe escape if no arguments provided
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS)
      throw new Error("Position out of bounds. Valid: col[0-" + (COLS - 1) + "], row[0-" + (ROWS - 1) + "]");
     
    this._currentStroke = [];
    for(var i=0,dx=0;i<str.length;i++,dx++)
    {
      op.ch    = str.charAt(i);  if(op.ch=="\n") { dx=-1; r++; continue; }
      op.type  = "place";
      var cell = {"r":r,"c":c+dx}
      if(cell.c < COLS)
        this.applyOpAtCell(cell,op);                   // display character on grid & push coordinate to currentStroke
    }

    this.pushStrokeIfNonEmpty(this._currentStroke);     // feed undo buffer
  }
  this.cell.help = 
  {
    type: "CADScript_FN",
    usage: "cell(<i>c</i>,<i>r</i>,<i>string</i>)",
    desc: "",
    examples: ["oASC.cell(0,0,\"ABC\\nDEF\\nGHI\")"],
    unitTests:
    ["oASC.cell(0,0,\"ABC\\nDEF\\nGHI\");",
     "oASC.assert('cell(0,0,\"ABC\\nDEF\\nGHI\")',oASC.getCell(0,0,3,S),'A\\nD\\nG');",
     "oASC.stack(\"undo\")"]
  }

  this.getCell = function(c, r, len, dir)
  {
    if (r===undefined || c===undefined) return;
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS)
      throw new Error("Position out of bounds. Valid: col[0-" + (COLS - 1) + "], row[0-" + (ROWS - 1) + "]");

    const L = (len === undefined || len === null) ? 1 : Math.max(1, Math.floor(Number(len) || 1));
    const radius = L - 1;

    const charAtSafe = (rr, cc) => {
      if (rr < 0 || rr >= ROWS || cc < 0 || cc >= COLS) return " ";
      const row = ascii?.[rr];
      if (!row) return " ";
      return (row[cc] === undefined) ? " " : row[cc];
    }

    // dir is a bitmask; omitted => all directions
    const fullMask = (N|E|S|W);
    const mask = (dir === undefined || dir === null) ? fullMask : (typeof dir === "number" ? (dir >>> 0) : fullMask);

    const hasW = (mask & W) !== 0;
    const hasE = (mask & E) !== 0;
    const hasN = (mask & N) !== 0;
    const hasS = (mask & S) !== 0;

    const minC = c - (hasW ? radius : 0);
    const maxC = c + (hasE ? radius : 0);
    const minR = r - (hasN ? radius : 0);
    const maxR = r + (hasS ? radius : 0);

    const lines = [];
    for (let rr = minR; rr <= maxR; rr++) {
      let line = "";
      for (let cc = minC; cc <= maxC; cc++) line += charAtSafe(rr, cc);
      lines.push(line);              // IMPORTANT: do NOT trim here
    }
    return lines.join("\n");         // IMPORTANT: do NOT sanitize here
  }

  this.getCell.help = 
  {
    type: "CADScript_FN",
    usage: "getCell(c,r,len,dir)",
    desc:
      "Windowing-only grid getter. Returns a rectangular text block (\\n separated) in grid order. " +
      "len controls radius: len=1 origin only; len=2 one cell outward; ... " +
      "dir is a mask (N|E|S|W) selecting which sides extend from the origin. Omitted dir => N|E|S|W. " +
      "Off-grid cells are padded with spaces.",
    examples: [
      "oTERM.print(getCell(2,2))",
      "oTERM.print(getCell(1,1,2,N|E|S|W))",
      "oTERM.print(getCell(1,1,2,W|N|S))",
      "oTERM.print(getCell(0,0,2,N|W|E|S))"
    ]
  }


  // subsection catalog items

  let catalogVariantsCache = null; // rebuilt on demand (CATALOG is static during a session)

  // TODO:  Extend cat to prefill wildcard characters in labels
  this.cat = function(c, r, a, uid)
  {
    const it = this.findCatalogItemByUID(uid);
    if (!it) throw new Error("Catalog UID not found: " + uid);

    if (pasteDrag == null) pasteDrag = { item_data: {} };
    pasteDrag.item_data.rotation = a || 0;
    pasteDrag.item_data.uid = uid;

    // FIX #1: text_data may be string or array
    const td = it.text_data;
    const variants = Array.isArray(td) ? td : [td];
    const rot = pasteDrag.item_data.rotation || 0;
    const text_data = String(variants[rot] ?? variants[0] ?? "");

    updateOpLine("catalog", it);

    const expanded = this.expandWideCharsForGrid(text_data);
    const forPaste = expanded.replace(new RegExp(this.WILDCHAR_U, "g"), " ");

    this.startPasteWithText(forPaste);

    // Force scripted placement: treat (c,r) as TOP-LEFT of the paste block
    if (pasteDrag) {
      pasteDrag.anchor = { r: r, c: c };
      pasteDrag.anchorMode = "topleft";
      pasteDrag.anchorOffset = { r: 0, c: 0 };
    }

    // FIX #2: ensure paste anchor is the requested cell
    const cell = { r, c };
    this.commitPasteAt(cell);
  }

  this.cat.help = 
  {
    type: "CADScript_CMD",
    usage: "cat(<i>c</i>,<i>r</i>,<i>angle</i>,<i>uid</i>)",
    desc: "",
    examples: ["oASC.cat(0,0,0,\"ATTinyX12_MCU_ATTINY412\")"],
    unitTests:
    [
      
     "oASC.cat(0,0,0,\"ATTinyX12_MCU_ATTINY412\")",
     "oASC.assert('oASC.cat(0,0,0,\"ATTinyX12_MCU_ATTINY412\")',oASC.getCell(0,0,3,E),'╔══');",
     "oASC.stack(\"undo\")"
    ]
  }

  this.printCat = function() 
  {

    // TODO : list catalog items
    const items = (typeof CATALOG !== "undefined") ? CATALOG : [];
    var tokenlist = [];
    for (let i = 0; i < items.length; i++) 
      tokenlist.push(this.itemUID(items[i]));
    tokenlist.sort();
    oTERM.output(oCOM.escapeHTML( "CATALOG ITEMS:\n\n"+tokenlist.join("\n") ));
  }
  this.printCat.help = 
  {
    type: "CADScript_FN",
    usage: "printCat()",
    desc: "list all catalog item UIDs",
    examples: ["oASC.printCat()"]
  }



  // subsection: lines

  this.beginLine = function(cell,modifiers) 
  {
    if (!cell) return;
    if(bDebug) console.log("beginLine()");

    // hide selection box when starting a line tool action
    selection = null; selectDrag = null; moveDrag = null;
    lineDrag = 
    {
      kind: modifiers.kind,         // TODO: use modifiers below instead and remove this one
      flip: !shiftDown,             // Shift held => flip orthogonal direction (against dominant direction)
      merge: !oDown,                // 'o' held => override (no merge)
      modifiers: modifiers,         // routing is opt-in; keep legacy orthogonal preview by default
      start: { r: cell.r, c: cell.c },
      cur:   { r: cell.r, c: cell.c }
    }

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
    lineDrag.modifiers.flip  = !shiftDown;
    lineDrag.modifiers.merge = !oDown;

    this.draw("moveLine");
  }

  // TODO: why is cancelLine() unused ? 
  this.cancelLine = function() 
  {
    lineDrag = null;
    this.draw("cancelLine");
  }

  this.getCharAtCell  = function(r, c) {  return ascii[r][c] }
  this.drawCharAtCell = function(r, c, ch) { ascii[r][c] = ch; }

  // this.N = 0b0001, this.E = 0b0010, this.S = 0b0100, this.W = 0b1000;
  this.dominantDir = function(matrix,vector)
  {
    const v = [vector.r<0?-vector.r:0,vector.c>0?vector.c>>1:0,vector.r>0?vector.r:0,vector.c<0?-(vector.c>>1):0];
    const maskDir  = 1 << v.indexOf( Math.max(...v) );   // dominant direction taken from vector
    
    var bInv = (maskDir & (this.E|this.W)) !=0;  // define if starting point must go vertical (true) or horizontal (false)
    if(matrix[5]=="─") bInv = true;   // override
    if(matrix[5]=="│") bInv = false;  // override

    //console.log("\n"+matrix.replace(/ /g,"."));
    //console.log(Math.random(1)+" "+this.maskToString(maskDir)+" '"+matrix[5]+"'" );
    return bInv;
  }

  this.buildOrthogonalPath = function(start, end, modifiers)
  {
    var start_vleg = modifiers.startVertical === undefined ? !!modifiers.flip : modifiers.startVertical;

    console.log("this.buildOrthogonalPath("+start+","+end+","+JSON.stringify(modifiers)+")");

    var watchMatrix = this.getCell(start.c,start.r,2);
    var vector = {"c":end.c-start.c,"r":end.r-start.r};
    var bInv = this.dominantDir(watchMatrix,vector);
    if(bInv) start_vleg = !start_vleg;
    
    var cornerChar = function(r0, c0, r1, c1, v_leg, chset)          // private helper for buildOrthogonalPath
    {
      if ( (c1 > c0) &&  (r1 > r0)) return v_leg?chset.bl:chset.tr;  // left + down  | up + right
      if ( (c1 > c0) && !(r1 > r0)) return v_leg?chset.tl:chset.br;  // left + up    | up + left
      if (!(c1 > c0) &&  (r1 > r0)) return v_leg?chset.br:chset.tl;  // right + down | down + right
      return v_leg?chset.tr:chset.bl;                                // right + up   | down + left
    }

    var chset = modifiers.kind;
    const r0  = start.r, c0 = start.c;
    const r1  = end.r, c1 = end.c;
    const out = [];

    // Same cell → nothing
    if (r0 === r1 && c0 === c1) return out;

    if (start_vleg) 
    {
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

  // Extract a stable LabelID from a CATALOG item (used for CATALOG items of type "Net").
  // - Removes whitespace/newlines and the wildcard character ("§").
  // - Removes wire glyphs (box-drawing) so rotation does not affect the ID.
  // - Falls back to the catalog item name (e.g. GND).
  this.NetLabelID = function(catalog_idx, rotation)
  {
    const items = (typeof CATALOG !== "undefined" && Array.isArray(CATALOG)) ? CATALOG : [];
    const it = items[catalog_idx];
    if (!it) return "";

    const td = it.text_data;
    const variants = Array.isArray(td) ? td : [td];
    const raw = String(variants[rotation] ?? "");

    const expanded = this.expandWideCharsForGrid(raw);
    let out = "";

    for (let i = 0; i < expanded.length; i++)
    {
      const ch = expanded[i];
      if (ch === " " || ch === "\n" || ch === "\r" || ch === "\t") continue;
      if (typeof this.WILDCHAR_U !== "undefined" && ch === this.WILDCHAR_U) continue;

      // Drop wire glyphs (box drawing chars) so rotation/protrusions don't affect LabelID.
      if ((this.glyphToMask(ch) ?? 0) !== 0) continue;

      out += ch;
    }

    out = out.trim();
    if (!out) out = String(it.name ?? "");
    return out;
  }

  this.maskToString = function(num)
  {
    var s = [];
    var dirS = ["N","E","S","W"];
    for(var i=0;i<4;i++)
      if(((num>>i) & 1) == 1) s[s.length] = dirS[i];

    if((num>>4 & 16)!=0)
    {
      s[s.length-1] += "(";
      for(var i=4;i<8;i++)
        if(((num>>i) & 1) == 1) s[s.length] = dirS[i];
      s[s.length-1] += ")<<4";
    }                                                                                                                                                                                                       
    return s.join("|");
  }

  this.solveIntersect = function(path)
  {
    var outPath = {}, pathIdx=0
    outPath[pathIdx] = path[pathIdx];

    var _pre = path[pathIdx];
    var _cur, pathDir, pathType, pathMask3;
    
    for (;pathIdx<path.length;pathIdx++) // iterate through the entire path of an orthogonal line
    {
      bFirst = pathIdx==0, bLast = pathIdx==(path.length-1); 

      if(!bLast)  // determine path direction by comparing the position of the next step
      {
        _cur = path[pathIdx+1];
        var dr    = _cur.r - _pre.r
        var dc    = _cur.c - _pre.c;
        pathDir   = 1 << (dr-dc+dc*dc+1);           // get path direction
        pathType  = this.glyph2mask(_cur.ch);       // get path wire type
        pathMask3 = ((pathType&0b1111)>0?pathDir:0) | ((pathType&0b11110000)>0?pathDir:0)<<4;
      }

      var Hfilter    = E | E<<4 | W | W<<4;  // horizontal filter
      var Vfilter    = N | N<<4 | S | S<<4;  // vertical filter
      var bDir1      = (pathDir & Hfilter) != 0;
      var bDir2      = (pathDir & Vfilter) != 0;
      var dirFilter1 = bDir1 ? Vfilter : Hfilter;
      var dirFilter2 = bDir1 ? Hfilter : Vfilter;

      var cellD = (N|S|E|W) ^ pathDir;                  // defines direction where to look 
      var cellP = oASC.getCell(_cur.c,_cur.r,2,cellD);  // grab ascii matrix (straight)
      var watchMatrix = this.rotate(cellP,pathDir,E);   // align the ascii matrix
      //console.log("Solve:"+JSON.stringify(path[pathIdx])+" cellD:"+this.maskToString(cellD)+" pathDir:"+this.maskToString(pathDir)+"\n"+watchMatrix.replace(/ /g,".")+" "+watchMatrix.charAt(5) +" MatrixLen="+watchMatrix.length);

      if(bFirst)
      {
        var watchCell     = watchMatrix.charAt(3);
        var watchCell_dir = this.glyph2mask(watchCell);
        if((watchCell_dir & dirFilter1) != 0)
        {
          res_dir = watchCell_dir | pathMask3;                                        // assemble both elements to form a T-shape start
          path[pathIdx].ch = this.mask2glyph(res_dir);                              //this.cell(path[pathIdx].c+6,path[pathIdx].r,"*");
          //console.log("Solve: '"+this.mask2glyph(watchCell_dir)+"' + '"+this.mask2glyph(pathMask3)+"' = '"+this.mask2glyph(res_dir)+"'");
        }
      }
      else if(!bFirst && !bLast)
      {
        if(!bDir2)
        {
          var watchCell = watchMatrix.charAt(3);
          if((this.glyph2mask(watchCell) & Vfilter) != 0) 
            path[pathIdx].ch = watchCell;  // when horizontal goes through a straigt line => override '-' (on path) by '|' (on grid)
        }
      }
      else if(bLast)
      {
        var watchCell     = watchMatrix.charAt(4);
        var watchCell_dir = this.glyph2mask(watchCell);
        if((watchCell_dir & dirFilter1) != 0) 
        {
          res_dir = watchCell_dir | this.mirrorMask3(pathMask3 & dirFilter2,bDir1);    // assemble both elements to form a T-shape ending
          path[pathIdx].ch = this.mask2glyph(res_dir);                                     //this.cell(path[pathIdx].c+6,path[pathIdx].r,"*");
          //console.log("Solve: '"+this.mask2glyph(watchCell_dir)+"' + '"+this.mask2glyph(this.mirrorMask3(pathMask3 & dirFilter2,bDir1))+"' = '"+this.mask2glyph(res_dir)+"'");
        }
      }
      _pre = _cur;
      outPath[pathIdx] = path[pathIdx];
    }
    return path;
  }

  this.rotate = function(str,dir1,dir2)
  {
    if      (dir1     == dir2)                       return str;
    else if((dir2>>1) == dir1 || (dir1>>3) == dir2 ) return r90(str)
    else if((dir1>>1) == dir2 || (dir2>>3) == dir1 ) return r90( r180(str) )
    else if((dir1>>2) == dir2 || (dir2>>2) == dir1 ) return r180(str);
    function r90(str)
    {
      var rows = str.split("\n").map(function(line) { return line.split("") });
      for (var c = 0, h = rows.length, w = rows[0].length , out = []; c < w; c++)
      {
        for (var r = h - 1, line = ""; r >= 0; r--) line += rows[r][c];
        out.push(line);
      }
      return out.join("\n");
    }
    function r180(str) { return str.split("").reverse().join("") }
  }

  this.commitLine = function()
  {
    if (!lineDrag) return;

    const drag = 
    {
      start:     lineDrag.start,
      cur:       lineDrag.cur,
      modifiers: Object.assign({}, lineDrag.modifiers || {})
    }

    lineDrag = null;
    this.line(drag);
  }

  // Build line paths with synchronous methods
  this.buildLinePath = function(from, to, modifiers)
  {
    // modifiers.startVertical
    // modifiers.flip
    // modifiers.route
    // modifiers.leastCorners
    // modifiers.leastBridges
    // modifiers.kind

    const mods = Object.assign({}, modifiers || {});
    const method = String(mods.routeMethod || mods.routeAlgo || "astar").toLowerCase();

    if (mods.route === true)
    {
      if (method === "mikami" || method === "mikami-mw") return this.mikamiPath(from, to, mods);
      return this.routePathAStar(from, to, mods);
    }

  return this.buildOrthogonalPath(from, to, mods);
  }

  // Build line paths with asynchronous methods
  this.buildLinePathAsync = async function(from, to, modifiers)
  {
    const mods = Object.assign({}, modifiers || {});
    const method = String(mods.routeMethod || mods.routeAlgo || "astar").toLowerCase();

    if (mods.route !== true)
      return this.buildOrthogonalPath(from, to, mods);

    if (method === "mikami-mw")
      return await this.mikamiPathMultiWorker(from, to, mods);

    if (method === "mikami")
      return this.mikamiPath(from, to, mods);

    return this.routePathAStar(from, to, mods);
  }

  this.commitLineAsync = async function()
  {
    if (!lineDrag) return;

    const drag = {
      start: lineDrag.start,
      cur: lineDrag.cur,
      modifiers: Object.assign({}, lineDrag.modifiers || {})
    };

    lineDrag = null;
    await this.lineAsync(drag);
  }

  this.lineAsync = async function(lineArg)
  {
    if (!lineArg) return;

    const from = lineArg.from ?? lineArg.start;
    const to   = lineArg.to   ?? lineArg.cur;

    let modifiers = lineArg.modifiers || {};
    if (typeof modifiers !== "object") modifiers = { flip: !!modifiers };
    if (modifiers.kind === undefined) modifiers.kind = this.BOX_SINGLE;

    const merge   = modifiers.merge === undefined ? true : modifiers.merge;
    const rawPath = await this.buildLinePathAsync(from, to, modifiers);
    const path    = merge ? this.solveIntersect(rawPath) : rawPath;

    const stroke = [];
    for (const p of path)
    {
      if (p.r < 0 || p.r >= ROWS || p.c < 0 || p.c >= COLS) continue;
      const prev = ascii[p.r][p.c];
      const next = p.ch;
      if (prev !== next)
      {
        stroke.push({ r: p.r, c: p.c, prev, next });
        ascii[p.r][p.c] = next;
      }
    }

    this.pushStrokeIfNonEmpty(stroke);
    this.draw("lineAsync");
  }

  this.benchRoutePair = async function(from, to, modifiers, runs = 5)
  {
    const serialMods = Object.assign({}, modifiers, { route:true, routeMethod:"mikami" });
    const multiMods  = Object.assign({}, modifiers, { route:true, routeMethod:"mikami-mw" });

    const eqPath = (a, b) => JSON.stringify(a) === JSON.stringify(b);

    let serialMs = 0;
    let multiMs  = 0;
    let same = true;

    for (let i = 0; i < runs; i++)
    {
      let t0 = performance.now();
      const p1 = this.mikamiPath(from, to, serialMods);
      serialMs += (performance.now() - t0);

      t0 = performance.now();
      const p2 = await this.mikamiPathMultiWorker(from, to, multiMods);
      multiMs += (performance.now() - t0);

      if (!eqPath(p1, p2)) same = false;
    }

    return {
      runs,
      serialAvgMs: serialMs / runs,
      multiAvgMs:  multiMs / runs,
      speedup: (multiMs > 0) ? (serialMs / multiMs) : 0,
      same
    };
  }


  this.line = function(lineArg)
  {
    if (!lineArg) return;

    console.log("this.line("+JSON.stringify(lineArg)+")");

    // Accept both programmatic shape ({from,to,...}) and UI shape ({start,cur,...})
    const from      = lineArg.from ?? lineArg.start;
    const to        = lineArg.to   ?? lineArg.cur;

    var modifiers = lineArg.modifiers || {};
    const flip      = !!modifiers.flip;
    const kind      = modifiers.kind===undefined?this.BOX_SINGLE:modifiers.kind;
    const merge     = modifiers.merge===undefined?true:modifiers.merge;

    if(typeof(modifiers) != "object") 
      modifiers = {flip:flip,kind:kind};
    else
    {
      if(modifiers["flip"]===undefined) modifiers["flip"] = flip;
      if(modifiers["kind"]===undefined) modifiers["kind"] = kind;
    }

    if (!from || !to) return;

    //const rawPath = this.buildLinePath(from, to, flip, modifiers, kind);
    const rawPath = this.buildLinePath(from, to, modifiers);
    const path    = merge ? this.solveIntersect(rawPath) : rawPath;    // solve all intersections

    const stroke = [];
    for (const p of path)
    {
      if (p.r < 0 || p.r >= ROWS || p.c < 0 || p.c >= COLS) continue;
      const prev = ascii[p.r][p.c];
      const next = p.ch;
      if (prev !== next)
      {
        stroke.push({ r: p.r, c: p.c, prev, next });
        ascii[p.r][p.c] = next;
      }
    }

    this.pushStrokeIfNonEmpty(stroke);
    this.draw("line");
  }


// TODO ADD A UNIT TEST ON LINE ROUTING

  this.line.help =
  {
    type: "CADScript_Fn",
    usage: "line({from:{r:0,c:0},\nto:{r:0,c:0},flip:,kind})",
    desc: "Draw line in style BOX_DOUBLE|BOX_FAT|BOX_DOUBLE",
    examples:  [
      "CADScript {oASC.line({from:{r:0,c:0},\nto:{r:5,c:5},flip:true,kind:BOX_SINGLE})}"
    ],
    unitTests: [
     "oASC.clear();",
     "oASC.line({from:{r:1,c:1},to:{r:0,c:0},modifiers:{flip:true}});",
     "oASC.assert('simple line',oASC.getCell(0,0,2,oASC.E),'─┐');",
     "oASC.stack(\"undo\");",
     
     "oASC.box(3,1,5,3,{kind:BOX_DOUBLE});",
     "oASC.cell(4,4,'*');",
     "oASC.cell(0,0,'╟\\n╟\\n╟\\n╟\\n╟');",
     "oASC.cell(8,0,'╢\\n╢\\n╢\\n╢\\n╢');",
     "oASC.line({from:{c:6,r:0},to:{c:6,r:4}});",
     "oASC.line({from:{c:2,r:0},to:{c:2,r:3}});",
     "oASC.line({from:{c:0,r:2},to:{c:8,r:2},modifiers:{route:true,leastCorners:true,leastBridges:true}});",
     "oASC.line({from:{c:0,r:3},to:{c:8,r:3},modifiers:{route:true,leastCorners:true,leastBridges:true}});",
     "oASC.assert('routed line',oASC.getCell(0,0,9,E|S),'╟┌│───│┐╢\\n╟││╔═╗││╢\\n╟┘│║ ║│└╢\\n╟┐│╚═╝│┌╢\\n╟│  * ││╢\\n └─────┘ \\n         \\n         \\n         ');",
    //"throw Error('StopChain');",
     "oASC.stack(\"undo5\")",
     "oASC.stack(\"undo\")",
     "oASC.stack(\"undo\")",
     "oASC.stack(\"undo\")",

    ]
  }


  ////////////////////////////////////////////////////
  // A* routing subsection

  // ------------------------------------------------------------
  // ROUTER (A* over (r,c,dir))
  // ------------------------------------------------------------

  this.routeLexLess = function(a, b)
  {
    for (let i = 0; i < a.length; i++) {
      if (a[i] < b[i]) return true;
      if (a[i] > b[i]) return false;
    }
    return false;
  }

  this.routeLexEq = function(a, b)
  {
    return !this.routeLexLess(a, b) && !this.routeLexLess(b, a);
  }

  this.routeAddCost = function(a, b)
  {
    const out = new Array(a.length);
    for (let i = 0; i < a.length; i++) out[i] = a[i] + b[i];
    return out;
  }

  this.routeOppositeDir = function(dir)
  {
    if (dir === N) return S;
    if (dir === S) return N;
    if (dir === E) return W;
    if (dir === W) return E;
    return 0;
  }

  this.routeNormalizeModifiers = function(from, to, modifiers)
  {
    let m = (typeof modifiers === "boolean")
      ? { startVertical: !!modifiers }
      : Object.assign({}, modifiers || {});

    // compatibility with old "flip" convention
    if (m.flip !== undefined && m.startVertical === undefined)
      m.startVertical = !!m.flip;

    m.startVertical = !!m.startVertical;
    m.leastCorners  = !!m.leastCorners;
    m.leastBridges  = !!m.leastBridges;

    // preserve old dominantDir influence as a tie-break preference
    const watchMatrix = this.getCell(from.c, from.r, 2);
    const vector = { c: to.c - from.c, r: to.r - from.r };
    if (this.dominantDir(watchMatrix, vector))
      m.startVertical = !m.startVertical;

    return m;
  }

  this.routeBuildContext = function(from, to)
  {
    const hl = this.computeHighlightOverlay?.() ?? { redSet: new Set(), insideSet: new Set() };
    const mo = this.computeMatchOverlay?.() ?? { solidSet: new Set(), greenSet: new Set() };
    const banned = this.computeNetlistBannedSet?.(mo, hl) ?? new Set();

    return { from, to, hl, mo, banned };
  }

  this.routeCellKind = function(r, c, ctx)
  {
    if (r === ctx.from.r && c === ctx.from.c) return "terminal";
    if (r === ctx.to.r   && c === ctx.to.c)   return "terminal";

    const k = keyRC(r, c);
    if (ctx.banned.has(k)) return "blocked";

    const ch = ascii?.[r]?.[c] ?? " ";
    if (ch === " ") return "free";

    const mask = this.glyphToMask(ch) ?? 0;
    if (mask === 0) return "blocked";          // labels / text / unknown glyphs

    // Current bridge renderer only really supports single vertical wire
    // being crossed by a horizontal route:  ─│─
    if (this.isDoubleWire(ch) || this.isFatWire(ch)) return "blocked";

    const deg =
      ((mask & N) ? 1 : 0) +
      ((mask & E) ? 1 : 0) +
      ((mask & S) ? 1 : 0) +
      ((mask & W) ? 1 : 0);

    if (deg === 2 && mask === (E|W)) return "wire_h";
    if (deg === 2 && mask === (N|S)) return "wire_v";

    // stubs, corners, tees, crosses, mixeds => obstacles
    return "blocked";
  }

  this.routeStepVerdict = function(nr, nc, dirOut, ctx)
  {
    const kind = this.routeCellKind(nr, nc, ctx);

    switch (kind)
    {
      case "free":
      case "terminal":
        return { allowed: true, bridge: false };

      case "wire_v":
        return {
          allowed: (dirOut === E || dirOut === W),
          bridge:  (dirOut === E || dirOut === W)
        };

      case "wire_h":
        return {
          allowed: (dirOut === N || dirOut === S),
          bridge:  (dirOut === N || dirOut === S)
        };

      case "blocked":
      default:
        return { allowed: false, bridge: false };
    }
  }


  this.netHeatPalette = function()
  {
    const fallback = ["#E4F4FF", "#E9FBE8", "#D1FCC7", "#B0F6A1", "#BDE485", "#DCCA76", "#F6844F", "#FF0000"];
    const src = this.heatMapCols;
    return (Array.isArray(src) && src.length) ? src.slice() : fallback;
  }

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
  }

  this.netHeatMapColor = function(value, minScore, maxScore, palette)
  {
    const cols = (Array.isArray(palette) && palette.length) ? palette : this.netHeatPalette();
    if (!Number.isFinite(value)) return cols[cols.length - 1];
    if (!Number.isFinite(minScore) || !Number.isFinite(maxScore) || maxScore <= minScore)
      return cols[0];

    const t = Math.max(0, Math.min(1, (value - minScore) / (maxScore - minScore)));
    const idx = Math.max(0, Math.min(cols.length - 1, Math.round(t * (cols.length - 1))));
    return cols[idx];
  }

  this.netHeatConfig = function()
  {
    return Object.assign({
      blockerWeight: 15,
      bridgeWeight: 2,
      rayLength: 16,
      sideRadius: 4,
      alpha: 0.30
    }, this.netHeatCfg || {});
  }

  this.netHeatDistancePenalty = function(weight, distance)
  {
    const d = Math.max(1, Number(distance) || 1);
    return Number(weight || 0) / (d * d);
  }

  this.netHeatCellPenaltyKind = function(r, c, ctx)
  {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return "blocker";
    const kind = this.routeCellKind(r, c, ctx);
    if (kind === "blocked") return "blocker";
    if (kind === "wire_v" || kind === "wire_h") return "bridge";
    return null;
  }

  this.computeNetHeatScoreAt = function(r, c, dir, ctx, cfg)
  {
    const vec = this.routeDirVec(dir);
    const perpA = (dir === N || dir === S) ? { dr: 0, dc: -1 } : { dr: -1, dc: 0 };
    const perpB = (dir === N || dir === S) ? { dr: 0, dc:  1 } : { dr:  1, dc: 0 };
    const nr = r + vec.dr;
    const nc = c + vec.dc;

    if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) return Number.POSITIVE_INFINITY;
    if (!this.routeStepVerdict(nr, nc, dir, ctx).allowed) return Number.POSITIVE_INFINITY;

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

      const verdict = this.routeStepVerdict(rr, cc, dir, ctx);
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
          score += this.netHeatDistancePenalty(
            hit === "bridge" ? cfg.bridgeWeight : cfg.blockerWeight,
            dist
          );
        }
      }
    }

    return score;
  }

  this.computeNetHeatField = function(dirMask)
  {
    const activeMask = (Number(dirMask) || 0) & (N|E|S|W);
    if (!activeMask) return null;

    const cfg = this.netHeatConfig();
    const dummy = { r: -9999, c: -9999 };
    const ctx = this.routeBuildContext(dummy, dummy);
    const dirs = [N, E, S, W].filter(m => (activeMask & m) !== 0);
    const size = ROWS * COLS;
    const layers = Object.create(null);

    let minScore = Number.POSITIVE_INFINITY;
    let maxScore = -Number.POSITIVE_INFINITY;

    for (const dir of dirs)
      layers[dir] = new Float32Array(size);

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
  }

  this.routeHeuristic = function(r, c, to)
  {
    return [Math.abs(r - to.r) + Math.abs(c - to.c), 0, 0, 0];
  }

  this.routeMaskToGlyph = function(mask, chset)
  {
    switch (mask)
    {
      case E:
      case W:
      case E|W: return chset.h;

      case N:
      case S:
      case N|S: return chset.v;

      case E|S: return chset.tl;
      case W|S: return chset.tr;
      case E|N: return chset.bl;
      case W|N: return chset.br;
    }
    return " ";
  }

  this.routeStatesToPath = function(states, modifiers)
  {
    const chset = modifiers.kind;
    const out = [];

    if (!states || states.length <= 1) return out;

    for (let i = 0; i < states.length; i++)
    {
      const prev = i > 0 ? states[i - 1] : null;
      const cur  = states[i];
      const next = i + 1 < states.length ? states[i + 1] : null;

      let mask = 0;

      if (prev) {
        if (prev.r < cur.r) mask |= N;
        if (prev.r > cur.r) mask |= S;
        if (prev.c < cur.c) mask |= W;
        if (prev.c > cur.c) mask |= E;
      }

      if (next) {
        if (next.r < cur.r) mask |= N;
        if (next.r > cur.r) mask |= S;
        if (next.c < cur.c) mask |= W;
        if (next.c > cur.c) mask |= E;
      }

      if (!mask) continue;
      out.push({ r: cur.r, c: cur.c, ch: this.routeMaskToGlyph(mask, chset) });
    }

    return out;
  }

  this.routePathAStar = function(from, to, modifiers)
  {
    if (!from || !to) return [];
    if (from.r === to.r && from.c === to.c) return [];
    console.log("routePath("+from+","+to+","+JSON.stringify(modifiers)+")");

    const mods = this.routeNormalizeModifiers(from, to, modifiers);
    const ctx  = this.routeBuildContext(from, to);
    const self = this;

    const DIRS = [
      { dir: N, dr: -1, dc:  0, vertical: true  },
      { dir: E, dr:  0, dc:  1, vertical: false },
      { dir: S, dr:  1, dc:  0, vertical: true  },
      { dir: W, dr:  0, dc: -1, vertical: false }
    ];

    const stateKey = (r, c, dir) => r + "," + c + "," + dir;

    function heapLess(a, b)
    {
      if (self.routeLexLess(a.f, b.f)) return true;
      if (self.routeLexLess(b.f, a.f)) return false;
      return self.routeLexLess(a.g, b.g);
    }

    const open = [];

    function heapPush(node)
    {
      open.push(node);
      let i = open.length - 1;
      while (i > 0) {
        const p = (i - 1) >> 1;
        if (!heapLess(open[i], open[p])) break;
        const t = open[i]; open[i] = open[p]; open[p] = t;
        i = p;
      }
    }

    function heapPop()
    {
      if (open.length === 0) return null;
      const top = open[0];
      const last = open.pop();
      if (open.length > 0) {
        open[0] = last;
        let i = 0;
        for (;;) {
          let l = i * 2 + 1;
          let r = l + 1;
          let m = i;
          if (l < open.length && heapLess(open[l], open[m])) m = l;
          if (r < open.length && heapLess(open[r], open[m])) m = r;
          if (m === i) break;
          const t = open[i]; open[i] = open[m]; open[m] = t;
          i = m;
        }
      }
      return top;
    }

    const gBest     = new Map();
    const parent    = new Map();
    const stateByKey= new Map();

    const startKey = stateKey(from.r, from.c, 0);
    const g0 = [0, 0, 0, 0];
    const f0 = this.routeAddCost(g0, this.routeHeuristic(from.r, from.c, to));

    gBest.set(startKey, g0);
    stateByKey.set(startKey, { r: from.r, c: from.c, dir: 0 });

    heapPush({
      key: startKey,
      r: from.r,
      c: from.c,
      dir: 0,
      g: g0,
      f: f0
    });

    while (open.length)
    {
      const cur = heapPop();
      const best = gBest.get(cur.key);
      if (!best || !this.routeLexEq(cur.g, best)) continue;

      if (cur.r === to.r && cur.c === to.c)
      {
        const states = [];
        let k = cur.key;
        while (k) {
          states.push(stateByKey.get(k));
          const p = parent.get(k);
          k = p ? p.prevKey : null;
        }
        states.reverse();
        return this.routeStatesToPath(states, modifiers);
      }

      for (const d of DIRS)
      {
        if (cur.dir && d.dir === this.routeOppositeDir(cur.dir)) continue;

        const nr = cur.r + d.dr;
        const nc = cur.c + d.dc;

        if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) continue;

        const verdict = this.routeStepVerdict(nr, nc, d.dir, ctx);
        if (!verdict.allowed) continue;

        const turn = (cur.dir !== 0 && cur.dir !== d.dir) ? 1 : 0;
        const firstMovePenalty = (cur.dir === 0)
          ? ((mods.startVertical && !d.vertical) || (!mods.startVertical && d.vertical) ? 1 : 0)
          : 0;

        const delta = [
          1,
          mods.leastCorners ? turn : 0,
          mods.leastBridges ? (verdict.bridge ? 1 : 0) : 0,
          firstMovePenalty
        ];

        const g2 = this.routeAddCost(cur.g, delta);
        const k2 = stateKey(nr, nc, d.dir);
        const old= gBest.get(k2);

        if (!old || this.routeLexLess(g2, old))
        {
          gBest.set(k2, g2);
          parent.set(k2, { prevKey: cur.key });
          stateByKey.set(k2, { r: nr, c: nc, dir: d.dir });

          const f2 = this.routeAddCost(g2, this.routeHeuristic(nr, nc, to));
          heapPush({ key: k2, r: nr, c: nc, dir: d.dir, g: g2, f: f2 });
        }
      }
    }

    // fallback: preserve old behaviour when no obstacle-free route exists
    return this.buildOrthogonalPath(from, to, mods);
  }








  ////////////////////////////////////////////////////
  // mikami routing subsection


this.routeMarkKey = function(r, c, axis)
{
  return r + "," + c + "," + axis;
}

this.routeAxisForDir = function(dir)
{
  return (dir === E || dir === W) ? "H" : "V";
}

this.routeScoreMark = function(mark, modifiers)
{
  const score = [mark.level];
  if (modifiers.leastBridges) score.push(mark.bridges);
  score.push(mark.steps);
  score.push(mark.firstAxisPenalty || 0);
  return score;
}

this.routeAllowedDirs = function(prevAxis, modifiers)
{
  const verticalFirst = !!modifiers.startVertical;

  if (prevAxis === "H") return [N, S];
  if (prevAxis === "V") return [E, W];

  return verticalFirst ? [N, S, E, W] : [E, W, N, S];
}

this.routeDirVec = function(dir)
{
  if (dir === N) return { dr: -1, dc:  0 };
  if (dir === E) return { dr:  0, dc:  1 };
  if (dir === S) return { dr:  1, dc:  0 };
  if (dir === W) return { dr:  0, dc: -1 };
  return { dr: 0, dc: 0 };
}

this.routeBacktraceMarksToStates = function(finalMark, markMap)
{
  if (!finalMark) return [];

  const marks = [];
  let cur = finalMark;

  while (cur)
  {
    marks.push(cur);
    cur = cur.parentKey ? (markMap.get(cur.parentKey) || null) : null;
  }

  marks.reverse();
  if (marks.length === 0) return [];

  const states = [{ r: marks[0].r, c: marks[0].c }];

  for (let i = 1; i < marks.length; i++)
  {
    const a = marks[i - 1];
    const b = marks[i];

    if (a.r === b.r)
    {
      const step = b.c > a.c ? 1 : -1;
      for (let c = a.c + step; c !== b.c + step; c += step)
        states.push({ r: a.r, c });
    }
    else if (a.c === b.c)
    {
      const step = b.r > a.r ? 1 : -1;
      for (let r = a.r + step; r !== b.r + step; r += step)
        states.push({ r, c: a.c });
    }
  }

  return states;
}

this.routeBuildCellCodeGrid = function(ctx)
{
  const grid = new Uint8Array(ROWS * COLS);
  let i = 0;

  for (let r = 0; r < ROWS; r++)
  {
    for (let c = 0; c < COLS; c++, i++)
    {
      const kind = this.routeCellKind(r, c, ctx);
      grid[i] = kind === "free"     ? 1
              : kind === "terminal" ? 1
              : kind === "wire_h"   ? 2
              : kind === "wire_v"   ? 3
              : 0;
    }
  }

  return grid;
}

this.routeRecommendedWorkerCount = function(modifiers)
{
  const forced = Number(modifiers?.workerCount || modifiers?.workers || 0) || 0;
  if (forced > 0) return Math.max(1, forced | 0);

  const hc = Number(globalThis.navigator?.hardwareConcurrency || 0) || 0;
  if (!hc) return 2;
  return Math.max(2, Math.min(4, hc));
}

this.routeDisposeWorkerPool = function()
{
  const pool = this._routeWorkerPool;
  this._routeWorkerPool = null;

  if (!pool) return;

  try {
    for (const w of (pool.workers || [])) {
      try { w.terminate(); } catch (_) {}
    }
  } catch (_) {}

  if (pool.url) {
    try { URL.revokeObjectURL(pool.url); } catch (_) {}
  }
}

this.routeInlineWorkerSource = function()
{
  return `
const N = 1, E = 2, S = 4, W = 8;
let __rows = 0;
let __cols = 0;
let __grid = null;

function routeMarkKey(r, c, axis) {
  return r + "," + c + "," + axis;
}

function routeAxisForDir(dir) {
  return (dir === E || dir === W) ? "H" : "V";
}

function routeAllowedDirs(prevAxis, modifiers) {
  const verticalFirst = !!modifiers.startVertical;
  if (prevAxis === "H") return [N, S];
  if (prevAxis === "V") return [E, W];
  return verticalFirst ? [N, S, E, W] : [E, W, N, S];
}

function routeDirVec(dir) {
  if (dir === N) return { dr: -1, dc:  0 };
  if (dir === E) return { dr:  0, dc:  1 };
  if (dir === S) return { dr:  1, dc:  0 };
  if (dir === W) return { dr:  0, dc: -1 };
  return { dr: 0, dc: 0 };
}

function routeLexLess(a, b) {
  for (let i = 0; i < a.length; i++) {
    if (a[i] < b[i]) return true;
    if (a[i] > b[i]) return false;
  }
  return false;
}

function routeScoreMark(mark, modifiers) {
  const score = [mark.level];
  if (modifiers.leastBridges) score.push(mark.bridges);
  score.push(mark.steps);
  score.push(mark.firstAxisPenalty || 0);
  return score;
}

function routeCellCode(r, c) {
  return __grid[r * __cols + c] | 0;
}

function routeStepVerdict(nr, nc, dirOut, from, to) {
  if ((nr === from.r && nc === from.c) || (nr === to.r && nc === to.c)) {
    return { allowed: true, bridge: false };
  }

  const code = routeCellCode(nr, nc);

  if (code === 1) return { allowed: true, bridge: false }; // free / terminal

  if (code === 3) { // wire_v
    const ok = (dirOut === E || dirOut === W);
    return { allowed: ok, bridge: ok };
  }

  if (code === 2) { // wire_h
    const ok = (dirOut === N || dirOut === S);
    return { allowed: ok, bridge: ok };
  }

  return { allowed: false, bridge: false };
}

function expandChunk(frontier, modifiers, from, to) {
  const best = new Map();
  const hits = [];

  for (const base of frontier) {
    const dirs = routeAllowedDirs(base.axis, modifiers);

    for (const dir of dirs) {
      const vec = routeDirVec(dir);
      const axis = routeAxisForDir(dir);

      let r = base.r;
      let c = base.c;
      let segSteps = 0;
      let segBridges = 0;

      for (;;) {
        r += vec.dr;
        c += vec.dc;

        if (r < 0 || r >= __rows || c < 0 || c >= __cols) break;

        const verdict = routeStepVerdict(r, c, dir, from, to);
        if (!verdict.allowed) break;

        segSteps += 1;
        if (verdict.bridge) segBridges += 1;

        const mark = {
          key: routeMarkKey(r, c, axis),
          r,
          c,
          axis,
          level: base.level + 1,
          steps: base.steps + segSteps,
          bridges: base.bridges + segBridges,
          firstAxisPenalty: base.axis === "ROOT"
            ? ((modifiers.startVertical && axis !== "V") || (!modifiers.startVertical && axis !== "H") ? 1 : 0)
            : (base.firstAxisPenalty || 0),
          parentKey: base.key
        };

        const prev = best.get(mark.key);
        if (prev && !routeLexLess(routeScoreMark(mark, modifiers), routeScoreMark(prev, modifiers))) {
          continue;
        }

        best.set(mark.key, mark);
        if (r === to.r && c === to.c) hits.push(mark);
      }
    }
  }

  return { candidates: Array.from(best.values()), hits };
}

self.onmessage = function(ev) {
  const msg = ev.data || {};

  if (msg.type === "init") {
    __rows = msg.rows | 0;
    __cols = msg.cols | 0;
    __grid = new Uint8Array(msg.grid);
    self.postMessage({ type: "inited", id: msg.id });
    return;
  }

  if (msg.type === "expand") {
    const out = expandChunk(msg.frontier || [], msg.modifiers || {}, msg.from, msg.to);
    self.postMessage({ type: "expandResult", id: msg.id, candidates: out.candidates, hits: out.hits });
    return;
  }
};`;
}

this.routeEnsureWorkerPool = async function(workerCount, grid)
{
  if (typeof Worker === "undefined" || typeof Blob === "undefined" || !URL?.createObjectURL)
    return null;

  workerCount = Math.max(1, workerCount | 0);

  let pool = this._routeWorkerPool;
  const needFresh = !pool || pool.workerCount !== workerCount || pool.rows !== ROWS || pool.cols !== COLS;

  if (needFresh)
  {
    this.routeDisposeWorkerPool();

    const blob = new Blob([this.routeInlineWorkerSource()], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const workers = [];

    for (let i = 0; i < workerCount; i++)
      workers.push(new Worker(url));

    pool = {
      url,
      workers,
      workerCount,
      rows: ROWS,
      cols: COLS,
      seq: 1
    };

    this._routeWorkerPool = pool;
  }

  {
    const initJobs = pool.workers.map((worker) => new Promise((resolve, reject) => {
      const id = pool.seq++;
      const onMessage = (ev) => {
        const msg = ev.data || {};
        if (msg.id !== id || msg.type !== "inited") return;
        cleanup();
        resolve();
      };
      const onError = (err) => {
        cleanup();
        reject(err);
      };
      const cleanup = () => {
        worker.removeEventListener("message", onMessage);
        worker.removeEventListener("error", onError);
      };
      worker.addEventListener("message", onMessage);
      worker.addEventListener("error", onError);
      worker.postMessage({ type: "init", id, rows: ROWS, cols: COLS, grid });
    }));

    await Promise.all(initJobs);
  }

  return pool;
}

this.routeWorkerExpand = function(worker, pool, frontierChunk, from, to, modifiers)
{
  return new Promise((resolve, reject) => {
    const id = pool.seq++;
    const onMessage = (ev) => {
      const msg = ev.data || {};
      if (msg.id !== id || msg.type !== "expandResult") return;
      cleanup();
      resolve(msg);
    };
    const onError = (err) => {
      cleanup();
      reject(err);
    };
    const cleanup = () => {
      worker.removeEventListener("message", onMessage);
      worker.removeEventListener("error", onError);
    };
    worker.addEventListener("message", onMessage);
    worker.addEventListener("error", onError);
    worker.postMessage({ type: "expand", id, frontier: frontierChunk, from, to, modifiers });
  });
}

this.routeChunkFrontier = function(frontier, chunkCount)
{
  const out = [];
  const n = frontier.length;
  chunkCount = Math.max(1, Math.min(chunkCount | 0, n || 1));
  const base = Math.floor(n / chunkCount);
  let extra = n % chunkCount;
  let off = 0;

  for (let i = 0; i < chunkCount; i++)
  {
    const len = base + (extra-- > 0 ? 1 : 0);
    if (len > 0) out.push(frontier.slice(off, off + len));
    off += len;
  }

  return out;
}

this.mikamiPathMultiWorker = async function(from, to, modifiers)
{
  if (!from || !to) return [];
  if (from.r === to.r && from.c === to.c) return [];

  const mods = this.routeNormalizeModifiers(from, to, modifiers);
  const ctx  = this.routeBuildContext(from, to);

  const workerCount = this.routeRecommendedWorkerCount(mods);
  if (workerCount <= 1) return this.mikamiPath(from, to, mods);

  const grid = this.routeBuildCellCodeGrid(ctx);
  let pool = null;

  try {
    pool = await this.routeEnsureWorkerPool(workerCount, grid);
  } catch (err) {
    console.warn("MikamiMultiWorker init failed, falling back to serial Mikami:", err);
    this.routeDisposeWorkerPool();
    return this.mikamiPath(from, to, mods);
  }

  if (!pool || !pool.workers?.length)
    return this.mikamiPath(from, to, mods);

  const root = {
    key: this.routeMarkKey(from.r, from.c, "ROOT"),
    r: from.r,
    c: from.c,
    axis: "ROOT",
    level: 0,
    steps: 0,
    bridges: 0,
    firstAxisPenalty: 0,
    parentKey: null
  };

  const marks = new Map();
  marks.set(root.key, root);

  let frontier = [root];

  while (frontier.length)
  {
    const chunks = this.routeChunkFrontier(frontier, Math.min(pool.workers.length, frontier.length));
    const jobs = chunks.map((chunk, i) => this.routeWorkerExpand(pool.workers[i], pool, chunk, from, to, mods));

    let results;
    try {
      results = await Promise.all(jobs);
    } catch (err) {
      console.warn("MikamiMultiWorker expand failed, falling back to serial Mikami:", err);
      this.routeDisposeWorkerPool();
      return this.mikamiPath(from, to, mods);
    }

    const nextBest = new Map();
    const hits = [];

    for (const res of results)
    {
      for (const mark of (res.candidates || []))
      {
        const prevCommitted = marks.get(mark.key);
        if (prevCommitted && !this.routeLexLess(this.routeScoreMark(mark, mods), this.routeScoreMark(prevCommitted, mods)))
          continue;

        const prevWave = nextBest.get(mark.key);
        if (prevWave && !this.routeLexLess(this.routeScoreMark(mark, mods), this.routeScoreMark(prevWave, mods)))
          continue;

        nextBest.set(mark.key, mark);
      }
    }

    const nextFrontier = Array.from(nextBest.values());
    for (const mark of nextFrontier)
    {
      marks.set(mark.key, mark);
      if (mark.r === to.r && mark.c === to.c) hits.push(mark);
    }

    if (hits.length)
    {
      let best = hits[0];
      for (let i = 1; i < hits.length; i++)
      {
        if (this.routeLexLess(this.routeScoreMark(hits[i], mods), this.routeScoreMark(best, mods)))
          best = hits[i];
      }

      const states = this.routeBacktraceMarksToStates(best, marks);
      return this.routeStatesToPath(states, mods);
    }

    frontier = nextFrontier;
  }

  return this.buildOrthogonalPath(from, to, mods);
}


this.mikamiPath = function(from, to, modifiers)
{
  if (!from || !to) return [];
  if (from.r === to.r && from.c === to.c) return [];

  const mods = this.routeNormalizeModifiers(from, to, modifiers);
  const ctx  = this.routeBuildContext(from, to);

  const root = {
    key: this.routeMarkKey(from.r, from.c, "ROOT"),
    r: from.r,
    c: from.c,
    axis: "ROOT",
    level: 0,
    steps: 0,
    bridges: 0,
    firstAxisPenalty: 0,
    parentKey: null
  };

  const marks = new Map();
  marks.set(root.key, root);

  let frontier = [root];

  while (frontier.length)
  {
    const nextFrontier = [];
    const hits = [];

    for (const base of frontier)
    {
      const dirs = this.routeAllowedDirs(base.axis, mods);

      for (const dir of dirs)
      {
        const vec = this.routeDirVec(dir);
        const axis = this.routeAxisForDir(dir);

        let r = base.r;
        let c = base.c;
        let segSteps = 0;
        let segBridges = 0;

        for (;;)
        {
          r += vec.dr;
          c += vec.dc;

          if (r < 0 || r >= ROWS || c < 0 || c >= COLS) break;

          const verdict = this.routeStepVerdict(r, c, dir, ctx);
          if (!verdict.allowed) break;

          segSteps += 1;
          if (verdict.bridge) segBridges += 1;

          const key = this.routeMarkKey(r, c, axis);
          const mark = {
            key,
            r,
            c,
            axis,
            level: base.level + 1,
            steps: base.steps + segSteps,
            bridges: base.bridges + segBridges,
            firstAxisPenalty: base.axis === "ROOT"
              ? ((mods.startVertical && axis !== "V") || (!mods.startVertical && axis !== "H") ? 1 : 0)
              : (base.firstAxisPenalty || 0),
            parentKey: base.key
          };

          const prev = marks.get(key);
          if (prev && !this.routeLexLess(this.routeScoreMark(mark, mods), this.routeScoreMark(prev, mods)))
            continue;

          marks.set(key, mark);
          nextFrontier.push(mark);

          if (r === to.r && c === to.c)
            hits.push(mark);
        }
      }
    }

    if (hits.length)
    {
      let best = hits[0];
      for (let i = 1; i < hits.length; i++)
      {
        if (this.routeLexLess(this.routeScoreMark(hits[i], mods), this.routeScoreMark(best, mods)))
          best = hits[i];
      }

      const states = this.routeBacktraceMarksToStates(best, marks);
      return this.routeStatesToPath(states, mods);
    }

    frontier = nextFrontier;
  }

  // Conservative fallback preserves the previous behavior when no obstacle-avoiding route exists.
  return this.buildOrthogonalPath(from, to, mods);
}

  ///////////////////////////////////////////////////////


  // dispatcher
  this.routePath = function(from, to, modifiers)
  {
    const method = String(modifiers?.routeMethod || modifiers?.routeAlgo || "astar").toLowerCase();
    if (method === "mikami" || method === "mikami-mw") return this.mikamiPath(from, to, modifiers || {});
    return this.routePathAStar(from, to, modifiers || {});
  }



  // subsection: boxes

  this.beginBox = function(cell, modifiers) 
  {
    if (!cell) return;
    selection = null; selectDrag = null; moveDrag = null;
    boxDrag = { start: { r: cell.r, c: cell.c }, cur: { r: cell.r, c: cell.c }, modifiers:modifiers };
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
    this.box( boxDrag.start.c,boxDrag.start.r , boxDrag.cur.c,boxDrag.cur.r , boxDrag.modifiers );
    boxDrag = null;
    this.draw("commitBox");
  }

  this.cancelBox = function()
  {
      boxDrag = null;
      oASC.draw("cancelBox");
  }

  this.box = function(c0,r0,c1,r1, modifiers)
  {
    console.log("this.box("+c0+","+r0+","+c1+","+r1+","+JSON.stringify(modifiers)+")");

    if(c0===undefined || r0===undefined || c1===undefined || r1===undefined) return;  // safe escape if no arguments provided
    if(modifiers===undefined) var modifiers = {kind:{ h:'─', v:'│', tl:'┌', tr:'┐', bl:'└', br:'┘' }};
    const path = this.buildBoxPath( {"c":c0,"r":r0} , {"c":c1,"r":r1} , modifiers);

    // De-dup (corners overwrite edges)
    const m = new Map();
    for (const p of path)
    {
      if (p.r < 0 || p.r >= ROWS || p.c < 0 || p.c >= COLS) continue;
      m.set(p.r + ',' + p.c, p.ch);
    }

    this._currentStroke = [];
    for (const [key, ch] of m) 
    {
      const [r, c] = key.split(',').map(Number);
      const cell = {"r":r,"c":c};
      const op = {"ch":ch,"type":"place"};
      this.applyOpAtCell( cell , op );                     // display character on grid & build undo buffer
    }
    this.pushStrokeIfNonEmpty(this._currentStroke);   // commit undo buffer 
  }
  this.box.help = 
  {
    type: "CADScript_Fn",
    usage: "box(<i>c0</i>,<i>r0</i>,<i>c1</i>,<i>r1</i>,<i>style</i>)",
    desc: "Draw a box in line style BOX_DOUBLE|BOX_FAT|BOX_DOUBLE",
    examples:  ["oASC.box(1,0,3,2,BOX_SINGLE)","oASC.box(1,0,3,2,BOX_FAT)","oASC.box(1,0,3,2,BOX_DOUBLE)"],
    unitTests: [
     "oASC.box(0,0,2,2,{kind:BOX_SINGLE});oASC.box(3,0,5,2,{kind:BOX_FAT});oASC.box(6,0,8,2,{kind:BOX_DOUBLE});",
     "oASC.assert('box',oASC.getCell(0,0,9,E),'┌─┐┏━┓╔═╗');",
     "oASC.assert('oASC.isValidDoubleBox(0,6,2,8)',oASC.isValidDoubleBox(0,6,2,8),true);",
     "oASC.stack(\"undo\");oASC.stack(\"undo\");oASC.stack(\"undo\");"]
  }

  this.clear = function () 
  {
    this._currentStroke = [];
    for(var c=0;c<COLS;c++)
      for(var r=0;r<ROWS;r++)
      {
        if(ascii[r][c]!=' ')
        {
          const cell = {"r":r,"c":c};
          const op   = {"ch":' ',"type":"place"};
          this.applyOpAtCell?.( cell , op ) ?? {};           // display character on grid & build undo buffer
        }
      }
    this.pushStrokeIfNonEmpty?.(this._currentStroke) ?? {};   // commit undo buffer 
  }
  this.clear.help = 
  {
    type: "CADScript_CMD",
    usage: "clear()",
    desc: "Clears the grid and pushes a single undo stroke.",
    examples: ["oASC.clear()"]
  }

  // TODO: describe what it does, and check if this can be used as generic function or it should be a private function
  // INFO: currently only used in beginFreeform(), moveFreeform(), endFreeform()
  this.applyOpAtCell = function(cell,op)
  {
    const prev = ascii[cell.r][cell.c];
    const next = (op.type === "place") ? op.ch : ' ';
    if (prev === next) return;
    this._currentStroke.push({ r: cell.r, c: cell.c, prev, next });
    ascii[cell.r][cell.c] = next;
  }  

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

  this.buildBoxPath = function(start, end, modifiers) 
  {
    const style = modifiers.kind;
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

  this.isWireGlyph = function(ch) {
    const k = String(ch ?? "");
    return this.glyph2mask(k) !== undefined && k !== " ";
  }
  // or: return this.glyphMask(ch) !== 0;
  this.isWireGlyph.help = {
    type: "CADScript_FN",
    usage: "isWireGlyph(<i>ch</i>)",
    desc: "True if ch is a known wire glyph in the glyph mask table.",
    examples: ["oTERM.printJSON(isWireGlyph('┼'))", "oTERM.printJSON(isWireGlyph('A'))"]
  }

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
        }

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

  this.commitPasteAt = function(cell) 
  {
    if (!pasteDrag) return;
    if (cell && cell.r !== undefined && cell.c !== undefined) {
      pasteDrag.anchor = { r: cell.r, c: cell.c };
    }
    if (!pasteDrag.anchor) return;

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
  }


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

    if (netTraceOn) {
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
  }

  //setMode("modeSelect");
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

        const uid = (String(it.name ?? "") + "_" + String(it.type ?? "Other") + "_" + String(it.MFR ?? ""));
        out.push({ lines, first, w, h: lines.length, catalog_idx: i, rotation: k, uid, name: it.name, type: it.type, MFR: it.MFR });
      }
    }
    return out;
  }

  this.charMatchesPatternCell = function(patCh, gridCh)   // detect wildcards in catalog items
  {
    if (patCh === "#") return WILD_D_SET.has(gridCh);
    if (patCh === "$") return WILD_S_SET.has(gridCh);
    if (patCh === this.WILDCHAR_U) return WILD_U_SET.has(gridCh);
    return patCh === gridCh;
  }

  this.itemUID = function(it)
  {
    return it.name + "_" + it.type + "_" + it.MFR;
  }

  this.findCatalogItemByUID = function(uid) 
  {
    const items = (typeof CATALOG !== "undefined") ? CATALOG : [];
    for (let cit = 0; cit < items.length; cit++)
      if (this.itemUID(items[cit]) === uid) return items[cit];
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


  // ---------------------------------------------------------------------------
  // SECTION: QUERY (Locate)
  //
  // Policy note:
  // - Components are located via computeMatchOverlay() (catalog pattern matching).
  // - Boxes are located via the same “valid double-line box” rule used by highlight.
  //
  // qryLocate() is intended as a *pre-step* to richer queries:
  // it returns only bounding rectangles (top-left + bottom-right), plus minimal metadata.
  // ---------------------------------------------------------------------------

  // Extract a human label for a BOX (optional):
  // convention: first bracketed token inside the box, e.g. "[ATTiny85]".
  // Returns "" if none is found.
  this.computeBoxLabel = function(r0, c0, r1, c1)
  {
    const top   = Math.min(r0, r1) + 1;
    const bot   = Math.max(r0, r1) - 1;
    const left  = Math.min(c0, c1) + 1;
    const right = Math.max(c0, c1) - 1;

    if (top > bot || left > right) return "";

    for (let r = top; r <= bot; r++)
    {
      const row = ascii?.[r];
      if (!row) continue;

      // Find '['
      let s = -1;
      for (let c = left; c <= right; c++) { if (row[c] === "[") { s = c; break; } }
      if (s < 0) continue;

      // Find matching ']'
      let e = -1;
      for (let c = s + 1; c <= right; c++) { if (row[c] === "]") { e = c; break; } }
      if (e <= s) continue;

      const label = row.slice(s + 1, e).join("").trim();
      if (label) return label;
    }

    return "";
  }

  // Locate all valid BOX rectangles (double-line boxes) on the grid.
  // Returns [{ ref:"DEFINITION", r0,c0,r1,c1, name, type:"BOX" }, ...]
  this.computeBoxRects = function()
  {
    const out = [];
    const seen = new Set();

    for (let r0 = 0; r0 < ROWS; r0++)
    {
      for (let c0 = 0; c0 < COLS; c0++)
      {
        if (ascii?.[r0]?.[c0] !== "╔") continue;

        for (let c1 = c0 + 1; c1 < COLS; c1++)
        {
          if (ascii[r0][c1] !== "╗") continue;

          for (let r1 = r0 + 1; r1 < ROWS; r1++)
          {
            if (ascii[r1][c0] !== "╚") continue;
            if (ascii[r1][c1] !== "╝") continue;

            if (!this.isValidDoubleBox?.(r0, c0, r1, c1)) continue;

            const k = r0 + "," + c0 + "," + r1 + "," + c1;
            if (seen.has(k)) continue;
            seen.add(k);

            const name = this.computeBoxLabel?.(r0, c0, r1, c1) ?? "";

            out.push({
              ref: "DEFINITION",  // referring to the definition (of a BOX)
              type: "BOX",
              name,
              tl: { r: r0, c: c0 },
              br: { r: r1, c: c1 },
            });
          }
        }
      }
    }

    return out;
  }

  // Locate matching catalog components and/or boxes according to policy.
  //
  // Examples:
  //   oASC.qryLocate({type:'MCU'})
  //   oASC.qryLocate({type:'BOX'})
  //   oASC.qryLocate({name:'ATTiny85'})
  //   oASC.qryLocate({name:'ATTiny85',MFR:'ATTINY85V-10PU'})
  //
  // Return format (per hit):
  //   {
  //     ref: "CATALOG"|"DEFINITION",
  //     name, type, MFR,
  //     r0,c0,r1,c1,
  //     tl:{r,c}, br:{r,c},
  //     ... (catalog-only: catalog_idx, rotation, uid)
  //   }
  // Locate matching catalog components, boxes, and labels according to policy.
  this.qryLocate = function(criteria) 
  {
    const q = criteria || {};

    const wantRef  = (q.ref === undefined  || q.ref === null) ? null : String(q.ref);
    const wantType = (q.type === undefined || q.type === null) ? null : String(q.type);
    const wantName = (q.name === undefined || q.name === null) ? null : String(q.name);
    const wantMFR  = (q.MFR  === undefined || q.MFR  === null) ? null : String(q.MFR);

    function matchField(val, want) {
      if (want === null) return true;
      return String(val ?? "").match(new RegExp(want, "g")) != null;
    }

    function accept(item) {
      // ref
      if (wantRef !== null && !matchField(item.ref, wantRef)) return false;
      // type
      if (wantType !== null) {
        if (wantType === "BOX") {
          if (item.ref !== "DEFINITION") return false;
        } else if (wantType === "LABEL") {
          if (item.ref !== "DEFINITION") return false;
        } else {
          // any non-BOX/LABEL type (so far) targets catalog items
          if (item.ref !== "CATALOG") return false;
          if (!matchField(item.type, wantType)) return false;
        }
      }
      // name
      if (wantName !== null && !matchField(item.name, wantName)) return false;
      // MFR only makes sense for catalog items
      if (wantMFR !== null) {
        if (item.ref !== "CATALOG") return false;
        if (!matchField(item.MFR, wantMFR)) return false;
      }
      return true;
    }

    const out = [];

    // ---- Catalog components (pattern matches) ----
    const mo = (typeof this.computeMatchOverlay === "function") ? this.computeMatchOverlay() : null;
    const matches = mo?.matches || [];

    if (matches && matches.length) {
      const items = (typeof CATALOG !== "undefined" && Array.isArray(CATALOG)) ? CATALOG : [];
      for (let i = 0; i < matches.length; i++) 
      {
        const m = matches[i];
        const it = items[m.catalog_idx] || {};
        const name = String(m.name ?? it.name ?? "");
        const type = String(m.type ?? it.type ?? "");
        const MFR  = String(m.MFR  ?? it.MFR  ?? "");
        const uid  = String(m.uid  ?? (name + "_" + type + "_" + MFR));
        const hit = {
          ref: "CATALOG",
          name, type, MFR,
          uid,
          catalog_idx: m.catalog_idx,
          rotation: m.rotation,
          tl: { r: m.r0, c: m.c0 },
          br: { r: m.r1, c: m.c1 },
        }
        if (accept(hit)) out.push(hit);
      }
    }

    // ---- Boxes (valid double-line rectangles) ----
    const shouldIncludeBoxes = (wantType === null) || (wantType === "BOX") || (wantName !== null);
    if (shouldIncludeBoxes) {
      const boxes = (typeof this.computeBoxRects === "function") ? this.computeBoxRects() : [];
      for (let i = 0; i < boxes.length; i++) {
        const b = boxes[i];
        if (accept(b)) out.push(b);
      }
    }

    // ---- Labels (text strings) ----
    const shouldIncludeLabels = (wantType === "LABEL") || (wantName !== null);
    if (shouldIncludeLabels) {
      const labels = (typeof this.computeLabelRects === "function") ? this.computeLabelRects() : [];
      for (let i = 0; i < labels.length; i++) {
        const l = labels[i];
        if (accept(l)) out.push(l);
      }
    }

    return out;
  }

  this.qryLocate.help =
  {
    type: "CADScript_FN",
    usage: "qryLocate({<i>key</i>:<i>regexp</i>})",
    desc: "Locate matching catalog components and BOX rectangles with regular expressions; returns bounding rectangles with tl/br coordinates.",
    examples: [
      "oASC.qryLocate({ref:'CAT.+'})",
      "oASC.qryLocate({type:'BOX'})",
      "oASC.qryLocate({name:'ATTiny85'})",
      "oASC.qryLocate({name:'ATTiny85'\n\t,MFR:'ATTINY85V-10PU'})"
    ],
    unitTests: [
     "oASC.cat(0,0,0,\"ATTinyX12_MCU_ATTINY412\")",
     "oASC.cell(5,4,\"01\")",
     "oASC.assert(\"(await oASC.qryLocate({type:'MCU'})).length\",(await oASC.qryLocate({type:'MCU'})).length,1);",
     "oASC.stack(\"undo\");oASC.stack(\"undo\");"
    ]
  }


  // Locate all labels (text strings) on the grid.
  // Returns [{ ref:"DEFINITION", name, type:"LABEL", tl:{r,c}, br:{r,c} }, ...]
  this.computeLabelRects = function() {
    const out = [];
    const seen = new Set();

    // Iterate through the grid
    for (let r = 0; r < ROWS; r++) {
      const row = ascii[r];
      if (!row) continue;

      let c = 0;
      while (c < COLS) {
        const ch = row[c];
        if (!ch || ch === " " || ch === "\n" || ch === "\r" || ch === "\t") {
          c++;
          continue;
        }

        // Check if this is the start of a label (e.g., alphanumeric string)
        if (/[a-zA-Z0-9\+-µ]/.test(ch)) {
          let label = "";
          let startC = c;
          let endC = c;

          // Find the end of the label
          while (endC < COLS && /[a-zA-Z0-9\.Ωµ\+-]/.test(row[endC])) {
            label += row[endC];
            endC++;
          }

          if (label.length > 0) {
            const key = `${r},${startC},${r},${endC - 1}`;
            if (!seen.has(key)) {
              seen.add(key);
              out.push({
                ref: "DEFINITION",
                name: label,
                type: "LABEL",
                tl: { r, c: startC },
                br: { r, c: endC - 1 }
              });
            }

            // Skip ahead to avoid detecting substrings of the same label
            c = endC;
          } else {
            c++;
          }
        } else {
          c++;
        }
      }
    }

    return out;
  }




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
    return { redSet, insideSet }
  }
  


    // ---- internal methods that need `this` -----------------------------------

  var self = this;

  function __computeNetlistCore(opts)
  {
    opts = opts || {};
    const includeCellSet = !!opts.includeCellSet;

    const overlay = self.computeHighlightOverlay?.() ?? { redSet: new Set(), insideSet: new Set() };
    const mo = self.computeMatchOverlay?.() ?? { solidSet: new Set(), greenSet: new Set(), footprintSet: new Set() };

    // For CE detection we want the footprint (includes wildcard cells)
    const compSet = mo.solidSet ?? mo.greenSet ?? mo.footprintSet ?? new Set();

    // One source of truth for banned
    const banned = self.computeNetlistBannedSet?.(mo, overlay) ?? new Set();

    function isNetWireCell(r,c)
    {
      const k = KeyRC(r,c);
      if (banned.has(k)) return false;
      const ch = ascii?.[r]?.[c];
      if (ch === undefined) return false;
      if (ch === " ") return false;
      return (self.glyphToMask(ch) ?? 0) !== 0;
    }

    function connectedNeighbors(r,c)
    {
      const out = [];
      const ch = ascii[r][c];
      const m  = self.glyphToMask(ch) ?? 0;

      // up
      if ((m & N) && r > 0 && isNetWireCell(r-1,c)) {
        const m2 = self.glyphToMask(ascii[r-1][c]) ?? 0;
        if (m2 & S) pushUnique(out, r-1, c);
      }
      // down
      if ((m & S) && r < ROWS-1 && isNetWireCell(r+1,c)) {
        const m2 = self.glyphToMask(ascii[r+1][c]) ?? 0;
        if (m2 & N) pushUnique(out, r+1, c);
      }

      // left (with horizontal-only crossing bypass ─│─)
      if ((m & W) && c > 0 && isNetWireCell(r, c-1)) {
        const ch2 = ascii[r][c-1];
        const m2  = self.glyphToMask(ch2) ?? 0;

        if (m2 & E) {
          pushUnique(out, r, c-1);
        } else {
          const isVerticalOnly = (m2 & N) && (m2 & S) && !(m2 & E) && !(m2 & W);
          if (isVerticalOnly && c-2 >= 0 && isNetWireCell(r, c-2)) {
            const m3 = self.glyphToMask(ascii[r][c-2]) ?? 0;
            if (m3 & E) pushUnique(out, r, c-2);
          }
        }
      }

      // right (with horizontal-only crossing bypass ─│─)
      if ((m & E) && c < COLS-1 && isNetWireCell(r, c+1)) {
        const ch2 = ascii[r][c+1];
        const m2  = self.glyphToMask(ch2) ?? 0;

        if (m2 & W) {
          pushUnique(out, r, c+1);
        } else {
          const isVerticalOnly = (m2 & N) && (m2 & S) && !(m2 & E) && !(m2 & W);
          if (isVerticalOnly && c+2 < COLS && isNetWireCell(r, c+2)) {
            const m3 = self.glyphToMask(ascii[r][c+2]) ?? 0;
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
      if (!chC || chC === " " || chC === this.WILDCHAR_U) return;

      const mC = self.glyphToMask(chC) ?? 0;
      if (!(mC & needBitOnComp)) return;

      pushUniqueCR(CE, compC, compR);
      if (!hasCR(LE, fromC, fromR)) pushUniqueCR(LE, fromC, fromR);
    }

    const visited = new Set();
    let nets = [];

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
          const m = self.glyphToMask(ascii[n.r][n.c]) ?? 0;
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

    // Merge nets that are logically tied together by catalog items of type "Net" (e.g. GND, NetLabel).
    // A net is considered connected to a Net-label item if one of its CE coordinates lies on that catalog item.
    if (mo && mo.matches && mo.matchByCell && typeof CATALOG !== "undefined" && Array.isArray(CATALOG))
    {
      const parent = new Array(nets.length);
      for (let i = 0; i < parent.length; i++) parent[i] = i;

      const find = (x) => {
        while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; }
        return x;
      }
      const union = (a, b) => {
        a = find(a); b = find(b);
        if (a !== b) parent[b] = a;
      }

      // labelID -> [netIdx,...]
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

          const labelID = self.NetLabelID?.(m.catalog_idx, m.rotation) ?? "";
          if (!labelID) continue;
          touched.add(labelID);
        }

        for (const labelID of touched)
        {
          if (!labelToNets.has(labelID)) labelToNets.set(labelID, []);
          labelToNets.get(labelID).push(ni);
        }
      }

      // Union nets that share the same labelID
      for (const arr of labelToNets.values())
      {
        if (!arr || arr.length < 2) continue;
        const base = arr[0];
        for (let i = 1; i < arr.length; i++) union(base, arr[i]);
      }

      // If nothing merged, keep as-is
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
            if (n.cellSet && typeof n.cellSet.forEach === "function")
            {
              n.cellSet.forEach(k => g.cellSet.add(k));
            }
            else if (Array.isArray(n.nodes))
            {
              for (let j = 0; j < n.nodes.length; j++) g.cellSet.add(KeyRC(n.nodes[j].r, n.nodes[j].c));
            }
          }
        }

        const roots = Array.from(groups.keys()).sort((a,b) => a-b);
        const merged = [];
        for (let i = 0; i < roots.length; i++) merged.push(groups.get(roots[i]));
        nets = merged;
      }
    }

    return nets;
  }


  // Netlist extraction: follow connected wire glyphs outside double-box boundaries.
  // Returns [{ LE:[{c,r},...], LJ:[{c,r},...]} ...]
  this.computeNetlist = function()
  {
    const nets = __computeNetlistCore({ includeCellSet: false });
    return nets.map(n => ({ LE: n.LE, LJ: n.LJ, CE: n.CE }));
  }
  this.computeNetlist.help =
  {
    type: "CADScript_FN",
    usage: "computeNetlist()",
    desc: "Compute netlist including Line Ends (LE) and Component Ends (CE)",
    examples: [
      "oTERM.printJSON(oASC.computeNetlist())"
    ],
    unitTests:[
      "oASC.clear();",
      "oASC.cell(0,0,\""
      +"     ⎽⎽⎽⎽⎽\\n"
      +"  ┌─[  11Ω]───◠◠◠◠─┐\\n"
      +"  │  ⎺⎺⎺⎺⎺         │\\n"
      +"╭─╵─╮              │\\n"
      +"( ~ )              │\\n"
      +"╰─╷─╯              │\\n"
      +"  │   [103]        │\\n"
      +"  ├────┨┠─────(A)──┘\\n"
      +"  ╧\");",
      //"oASC.assert(\"oASC.computeNetlist()\",oASC.computeNetlist().length,5);",
      "oASC.assert(\"(await oASC.computeNetlist()).length\", (await oASC.computeNetlist()).length, 5);",
      //"oASC.assert(\"oASC.computeNetlist()\",oASC.computeNetlist(),[{\"LE\":[{\"c\":2,\"r\":2},{\"c\":3,\"r\":1}],\"LJ\":[],\"CE\":[{\"c\":2,\"r\":3}]},{\"LE\":[{\"c\":11,\"r\":1},{\"c\":12,\"r\":1}],\"LJ\":[],\"CE\":[{\"c\":13,\"r\":1}]},{\"LE\":[{\"c\":19,\"r\":1},{\"c\":18,\"r\":7}],\"LJ\":[],\"CE\":[{\"c\":18,\"r\":1},{\"c\":17,\"r\":7}]},{\"LE\":[{\"c\":2,\"r\":6},{\"c\":5,\"r\":7},{\"c\":2,\"r\":7}],\"LJ\":[],\"CE\":[{\"c\":2,\"r\":5},{\"c\":2,\"r\":8},{\"c\":6,\"r\":7}]},{\"LE\":[{\"c\":10,\"r\":7},{\"c\":12,\"r\":7}],\"LJ\":[],\"CE\":[{\"c\":9,\"r\":7},{\"c\":13,\"r\":7}]}]);",
      "oASC.stack(\"undo\");"
    ]
  }

  this.computeNetlistNets = function() {
    const nets = __computeNetlistCore({ includeCellSet: true });
    return nets.map(n => ({ cells: n.cellSet, LE: n.LE, LJ: n.LJ, CE: n.CE, CO: n.CE }));
  }
  

  this.printNetlist = function()
  {
    if (window.oTERM && typeof oTERM.output === "function") 
    {
      const lines = (typeof this.computeNetlist === "function")
        ? this.computeNetlist()
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
    usage: "printNetlist()",
    desc: "Extract connected wire lines (endpoints + junctions), excluding valid double-box boundaries/interiors.",
    examples: ["oASC.printNetlist()"]
  }


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
    const matches = [];            // [{matchId,r0,c0,r1,c1,catalog_idx,rotation,uid,name,type}]
    const matchByCell = new Map(); // keyRC(r,c) -> matchId (solid cells only)
    const solidSet = new Set(); // NEW: for netlist masking (skip ' ' and '§')
    const footprintSet = new Set();  // component footprint (skip ' ' only)

    if (!(typeof CATALOG !== "undefined" && Array.isArray(CATALOG)))
      return { greenSet, rects, solidSet, footprintSet, matches, matchByCell };

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
          // NEW: record match meta (catalog item + rotation)
          const matchId = matches.length;
          const r1 = r0 + h - 1;
          const c1 = c0 + w - 1;
          matches.push({ matchId, r0, c0, r1, c1, catalog_idx: pat.catalog_idx, rotation: pat.rotation, uid: pat.uid, name: pat.name, type: pat.type });

          // NEW: record full bounding rectangle (includes spaces)
          rects.push({ r0, c0, r1, c1 });

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
              if (pc !== this.WILDCHAR_U) {
                greenSet.add(k);
                solidSet.add(k);
                matchByCell.set(k, matchId);
              }
            }
          }
        }
      }
    }

    return { greenSet, rects, solidSet, footprintSet, matches, matchByCell }
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

  this.stack = function(command)
  {
    switch(command)
    {
      case "undo100": 
        if(multi===undefined) var multi = 100;
      case "undo20": 
        if(multi===undefined) var multi = 20;
      case "undo5": 
        if(multi===undefined) var multi = 5;
      case "undo_org": 
        if(multi===undefined)
        {
          multi = undoStack.length;
        }
      case "undo":
        if(multi===undefined) var multi = 1;
        for(var i=0;i<multi;i++)
        {
          var stroke = undoStack.pop();
          if (!stroke) return;
          if(lineDrag && undoStack.length>0)
          {
            var _stroke = undoStack[undoStack.length-1];
            var item    = _stroke[_stroke.length-1]
            console.log("_stroke="+JSON.stringify(_stroke))
            console.log("New origin -> c:"+item.c+" r:"+item.r+" next:"+item.next);

            lineDrag.start.c = item.c;
            lineDrag.start.r = item.r;
          }
          //console.log("undo: "+JSON.stringify(undoStack).replace(/\},\{/g,"}\n,{"));

          for (let i = stroke.length - 1; i >= 0; i--) 
            ascii[stroke[i].r][stroke[i].c] = stroke[i].prev;
          redoStack.push(stroke);

   



          highlightCache = null;             // Invalidate overlays after undo
          matchCache     = null;
          netlistCache   = null;
          hoverNetIndex  = -1;

          updateUI();
        }
        this.draw("stack."+command); 
      break;
      case "redo":
        var stroke = redoStack.pop();
        if (!stroke) return;
        for (let i = 0; i < stroke.length; i++) ascii[stroke[i].r][stroke[i].c] = stroke[i].next;
        undoStack.push(stroke);

        // Invalidate overlays after redo
        highlightCache = null;
        matchCache = null;
        netlistCache = null;
        hoverNetIndex = -1;

        updateUI();
        this.draw("stack."+command); 
      break;
      case "reset":
        undoStack = [];
        redoStack = [];
        updateUI();
        this.draw("stack."+command); 
      break;
      case "get":
        return {"undoStack":undoStack,"redoStack":redoStack}

    }
  }

  // ---------------------------------------------------------------------------
  // getLabel(c,r,<env_retval>)
  //   - finds nearest label to (c,r)
  //   - returns {c:<originCol>, r:<row>, str:<labelString>}
  //   - if env_retval is a string, stores the object to oASC.env[env_retval]
  //
  // setLabel(c,r,label_str)
  //   - overwrites label at (c,r) (row r, starting at col c)
  //   - clears remaining chars if new label is shorter
  //
  this.getLabel = function(c, r, env_retval)
  {
    if (r===undefined || c===undefined) return null;
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS)
      throw new Error("Position out of bounds. Valid: col[0-" + (COLS - 1) + "], row[0-" + (ROWS - 1) + "]");

    if (!this.env) this.env = Object.create(null);

    const wc = this.WILDCHAR_U;

    const isLabelChar = (ch) => {
      if (!ch || ch === " ") return false;
      if (ch === wc) return true;
      return /[A-Za-z0-9_\-\.#:/\\\[\]\(\)]/.test(ch);
    }

    const charAt = (rr, cc) => {
      if (rr < 0 || rr >= ROWS || cc < 0 || cc >= COLS) return " ";
      const row = ascii?.[rr];
      if (!row) return " ";
      return (row[cc] === undefined) ? " " : row[cc];
    }

    // Given a cell (rr,cc) that isLabelChar, return the label's origin col and full string on that row.
    const extractLabelAt = (rr, cc) => {
      // find left boundary
      let oc = cc;
      while (oc - 1 >= 0 && isLabelChar(charAt(rr, oc - 1))) oc--;

      // read right
      let s = "";
      let x = oc;
      while (x < COLS && isLabelChar(charAt(rr, x))) {
        s += charAt(rr, x);
        x++;
      }
      return { c: oc, r: rr, str: s };
    }

    // Search expanding radius around (c,r) for any label char; pick nearest by Euclidean distance to origin.
    let best = null;
    let bestD2 = Infinity;

    const maxRad = Math.max(ROWS, COLS); // safe upper bound
    for (let rad = 0; rad <= maxRad; rad++)
    {
      let foundThisRing = false;

      // scan square ring (rad) around (c,r)
      const r0 = r - rad, r1 = r + rad;
      const c0 = c - rad, c1 = c + rad;

      for (let rr = r0; rr <= r1; rr++)
      {
        // only edges (ring), not full square, to keep it reasonable
        if (rr !== r0 && rr !== r1) {
          // left edge
          let cc = c0;
          if (cc >= 0 && cc < COLS && rr >= 0 && rr < ROWS && isLabelChar(charAt(rr, cc))) {
            const L = extractLabelAt(rr, cc);
            const d2 = (L.c - c) * (L.c - c) + (L.r - r) * (L.r - r);
            if (d2 < bestD2) { best = L; bestD2 = d2; }
            foundThisRing = true;
          }
          // right edge
          cc = c1;
          if (cc >= 0 && cc < COLS && rr >= 0 && rr < ROWS && isLabelChar(charAt(rr, cc))) {
            const L = extractLabelAt(rr, cc);
            const d2 = (L.c - c) * (L.c - c) + (L.r - r) * (L.r - r);
            if (d2 < bestD2) { best = L; bestD2 = d2; }
            foundThisRing = true;
          }
          continue;
        }

        // top/bottom edges: scan full row segment
        for (let cc = c0; cc <= c1; cc++)
        {
          if (rr < 0 || rr >= ROWS || cc < 0 || cc >= COLS) continue;
          if (!isLabelChar(charAt(rr, cc))) continue;

          const L = extractLabelAt(rr, cc);
          const d2 = (L.c - c) * (L.c - c) + (L.r - r) * (L.r - r);
          if (d2 < bestD2) { best = L; bestD2 = d2; }
          foundThisRing = true;
        }
      }

      // If we found something at this radius, we can stop early because larger radii can't be closer.
      if (foundThisRing && best) break;
    }

    // store into env var name if provided (string)
    if (typeof env_retval === "string" && env_retval.length > 0) {
      this.env[env_retval] = best;
    }

    return best;
  }

  this.getLabel.help = {
    type: "CADScript_FN",
    usage: "getLabel(c,r,<i>env_retval</i>)",
    desc: "Find nearest label near (c,r). Returns {c:<originCol>, r:<row>, str:<labelString>} and optionally stores it into oASC.env[env_retval].",
    examples: [
      "oTERM.printJSON(getLabel(10,5,'ret'))",
      "oTERM.printJSON(oASC.env.ret)"
    ]
  }

  this.setLabel = function(c, r, label_str)
  {
    if (r===undefined || c===undefined) return;
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS)
      throw new Error("Position out of bounds. Valid: col[0-" + (COLS - 1) + "], row[0-" + (ROWS - 1) + "]");

    const s = String(label_str ?? "");

    const wc = this.WILDCHAR_U;
    const isLabelChar = (ch) => {
      if (!ch || ch === " ") return false;
      if (ch === wc) return true;
      return /[A-Za-z0-9_\-\.#:/\\\[\]\(\)]/.test(ch);
    }
    const charAt = (rr, cc) => {
      if (rr < 0 || rr >= ROWS || cc < 0 || cc >= COLS) return " ";
      const row = ascii?.[rr];
      if (!row) return " ";
      return (row[cc] === undefined) ? " " : row[cc];
    }

    // Determine old label length starting at (c,r) so we can clear leftovers if needed.
    let oldLen = 0;
    while ((c + oldLen) < COLS && isLabelChar(charAt(r, c + oldLen))) oldLen++;

    // Write new label (single-line). Use cell to keep your existing stroke/undo behavior.
    this.cell(c, r, s);

    // Clear leftover chars if the new label is shorter
    if (oldLen > s.length) {
      this.cell(c + s.length, r, " ".repeat(oldLen - s.length));
    }
  }

  this.setLabel.help = {
    type: "CADScript_FN",
    usage: "setLabel(c,r,<i>label_str</i>)",
    desc: "Write label_str at (c,r). If an old label exists starting at (c,r) and is longer, clears the remainder with spaces.",
    examples: [
      "setLabel(5,3,'Net_1')",
      "oTERM.printJSON(getLabel(5,3,'ret'))"
    ]
  }


}
var oASC = new ASC();


