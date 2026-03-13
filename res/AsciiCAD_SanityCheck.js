if (typeof bDebug === "undefined" || !bDebug) {
  // Sanity checks disabled.
} else {

//    ███████  █████  ███    ██ ██ ████████ ██    ██  
//    ██      ██   ██ ████   ██ ██    ██     ██  ██   
//    ███████ ███████ ██ ██  ██ ██    ██      ████    
//         ██ ██   ██ ██  ██ ██ ██    ██       ██     
//    ███████ ██   ██ ██   ████ ██    ██       ██     
//                                                    
//                                                    
//     ██████ ██   ██ ███████  ██████ ██   ██ ███████ 
//    ██      ██   ██ ██      ██      ██  ██  ██      
//    ██      ███████ █████   ██      █████   ███████ 
//    ██      ██   ██ ██      ██      ██  ██       ██ 
//     ██████ ██   ██ ███████  ██████ ██   ██ ███████ 


(function () {
  if (window.__ASCIICAD_LOG_FORWARD__) return;
  window.__ASCIICAD_LOG_FORWARD__ = true;

  function forward(type, args) {
    try {
      parent.postMessage(
        {
          __asciicadLog: true,
          type,
          args: args.map(a =>
            typeof a === "object" ? JSON.stringify(a) : String(a)
          )
        },
        "*"
      );
    } catch {}
  }

  ["log", "warn", "error", "assert"].forEach(type => {
    const orig = console[type];
    console[type] = (...args) => {
      forward(type, args);
      orig.apply(console, args);
    };
  });
})();



// TEST HELPERS

function gridFromText(text) {
  const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  for (let r = 0; r < ROWS; r++) {
    const line = lines[r] || "";
    for (let c = 0; c < COLS; c++) ascii[r][c] = line[c] || " ";
  }
}

function textFromGrid(h, w) {
  let out = "";
  for (let r = 0; r < h; r++) {
    let line = "";
    for (let c = 0; c < w; c++) line += ascii[r][c] || " ";
    out += line + "\n";
  }
  return out;
}

function assertEq(name, got, exp) 
{
  if (got !== exp) {
    console.error("TEST FAILED:", name);
    console.error("GOT:\n" + got.split("\n").map(l => JSON.stringify(l)).join("\n"));
    console.error("EXP:\n" + exp.split("\n").map(l => JSON.stringify(l)).join("\n"));
  }
  console.assert(got === exp, name);
}


function applyHorizontalLine(r, c0, c1, kind, mergeEnabled) 
{

  // TODO: check and describe what this function does
  function addNeighborsToSet(set, r, c) 
  {
    set.add(r + "," + c);
    if (r > 0) set.add((r - 1) + "," + c);
    if (r < ROWS - 1) set.add((r + 1) + "," + c);
    if (c > 0) set.add(r + "," + (c - 1));
    if (c < COLS - 1) set.add(r + "," + (c + 1));
  }

  const hChar = (kind === "double") ? "═" : "─";
  const stroke = [];
  const touched = [];

  const step = c1 >= c0 ? 1 : -1;
  for (let c = c0; c !== c1 + step; c += step) {
    const prev = ascii[r][c];
    let next = hChar;

    if (mergeEnabled) {
      const prevIsWire = (prev === " ") || oASC.isWireGlyph(prev);
      const nextIsWire = (next === " ") || oASC.isWireGlyph(next);
      if (prevIsWire && nextIsWire) next = oASC.mergedWireGlyph(prev, next, kind);
    }

    if (prev !== next) {
      stroke.push({ r, c, prev, next });
      ascii[r][c] = next;
      touched.push({ r, c });
    }
  }

  if (mergeEnabled && touched.length) {
    const affected = new Set();
    for (let i = 0; i < touched.length; i++) addNeighborsToSet(affected, touched[i].r, touched[i].c);
    affected.forEach((key) => {
      const parts = key.split(",");
      const rr = Number(parts[0]);
      const cc = Number(parts[1]);
      const prev = ascii[rr][cc];
      const next = oASC.recomputeWireCell(rr, cc);
      if (prev !== next) {
        stroke.push({ r: rr, c: cc, prev, next });
        ascii[rr][cc] = next;
      }
    });
  }

  return stroke; // in case you want to pushStrokeIfNonEmpty in tests
}


function setSmallGridFromLines(lines) {
  for (let r = 0; r < lines.length; r++) {
    for (let c = 0; c < lines[r].length; c++) ascii[r][c] = lines[r][c];
  }
}

function getSmallGridText(w,h) 
{
  let s = "";
  for (let r = 0; r < h; r++) {
    let line = "";
    for (let c = 0; c < w; c++) line += ascii[r][c];
    s += line + "\n";
  }
  return s;
}

function assertGrid(name, got, exp) 
{
  if (got !== exp) {
    console.error("TEST FAILED:", name);
    console.error("GOT:\n" + got.split("\n").map(l => JSON.stringify(l)).join("\n"));
    console.error("EXP:\n" + exp.split("\n").map(l => JSON.stringify(l)).join("\n"));
  }

  if(got === exp)
    console.assert(true, name + "\nGOT: \"" + got.replace(/\n/g,"↵") + "\"\nEXP: \"" + exp.replace(/\n/g,"↵") +"\"");
}


// HELP SANITY ---------------------------------------------------------------
function listHelpFns(obj) {
  const out = [];
  if (!obj) return out;
  Object.keys(obj).forEach((k) => {
    try {
      const v = obj[k];
      if (typeof v === "function" && v.help) out.push(k);
    } catch {}
  });
  return out.sort();
}

// SANITY CHECK ON HELP OBJECTS
function sanityHelpMeta(objName, obj) 
{
  const fns = listHelpFns(obj);
  console.assert(`${objName}: ${fns.length} documented commands (.help)`);

  fns.forEach((name) => {
    const fn = obj[name];

    if (typeof fn !== "function") {
      console.error(`[SANITY] ${objName}.${name} is not a function`, fn);
      return;
    }

    const h = fn.help;
    if (!h || typeof h !== "object") {
      console.error(`[SANITY] ${objName}.${name} missing .help object`, h);
      return;
    }

    if (typeof h.usage !== "string" || !h.usage.length) {
      console.error(`[SANITY] ${objName}.${name} missing help.usage`, h);
      return;
    }
  });

  return fns;
}

// Worker symbol checks (safe for ALL oASC commands: no args required)
function sanityWorkerSymbolsForASC(fnNames) {
  let p = Promise.resolve();
  fnNames.forEach((name) => {
    p = p.then(() => oCMD.runExternalScript(`typeof ${name} === 'function'`))
      .then((ret) => {
        console.assert(ret === true, `worker symbol missing or not function: ${name} (got ${ret})`);
      })
      .catch((err) => {
        console.error(`worker symbol check failed for ${name}`, err);
      });
  });
  return p;
}





// TEST DATA

function runMixedJunctionTests() 
{
  // Use a 5x5 window in the real grid
  const H=5, W=5;

  // single×single => ┼
  setSmallGridFromLines([
    "  │  ",
    "  │  ",
    "─────",
    "  │  ",
    "  │  ",
  ]);
  // normalize center
  oASC.recomputeWireCell(2,2);
  assertGrid("single×single => ┼", getSmallGridText(W,H),
    "  │  \n  │  \n──┼──\n  │  \n  │  \n"
  );

  // double×double => ╬
  setSmallGridFromLines([
    "  ║  ",
    "  ║  ",
    "═════",
    "  ║  ",
    "  ║  ",
  ]);
  oASC.recomputeWireCell(2,2);
  assertGrid("double×double => ╬", getSmallGridText(W,H),
    "  ║  \n  ║  \n══╬══\n  ║  \n  ║  \n"
  );

  // single vert × double horz => ╪
  setSmallGridFromLines([
    "  │  ",
    "  │  ",
    "═════",
    "  │  ",
    "  │  ",
  ]);
  oASC.recomputeWireCell(2,2);
  assertGrid("single vert × double horz => ╪", getSmallGridText(W,H),
    "  │  \n  │  \n══╪══\n  │  \n  │  \n"
  );

  // double vert × single horz => ╫
  setSmallGridFromLines([
    "  ║  ",
    "  ║  ",
    "─────",
    "  ║  ",
    "  ║  ",
  ]);
  oASC.recomputeWireCell(2,2);
  assertGrid("double vert × single horz => ╫", getSmallGridText(W,H),
    "  ║  \n  ║  \n──╫──\n  ║  \n  ║  \n"
  );

  // Your example: two single verticals crossed by double horizontal => ╪ ╪
  setSmallGridFromLines([
    " ││  ",
    " ││  ",
    " ││  ",
    "     ",
    "     ",
  ]);
  // draw the double line into row 1 (like your example), then normalize around
  for (let c=0;c<4;c++) ascii[1][c] = "═";
  for (let c=0;c<4;c++) { oASC.recomputeWireCell(1,c); oASC.recomputeWireCell(0,c); oASC.recomputeWireCell(2,c); }
  assertGrid("two single verticals crossed by double horiz", getSmallGridText(4,3),
    " ││ \n═╪╪═\n ││ \n"
  );

  console.log("Mixed junction tests done.");
}


// WORKER THREAD SMOKE TESTS (requires CMD worker)

function small3x1Plus()
{
  return "+\n+\n+\n";
}

function small3x1Spaces()
{
  return " \n \n \n";
}

function HlineSEQ(o)
{
  var co;
  o.rc++; co = 1;

  oASC.putLine({from:{c:o.cc+co,r:o.rc},to:{c:o.cc+co+2,r:o.rc},kind:o.lkind,flip:true}); oASC.putCell(o.cc+4,o.rc,"▶"); o.rc++; co--;
  oASC.putLine({from:{c:o.cc+co,r:o.rc},to:{c:o.cc+co+2,r:o.rc},kind:o.lkind,flip:true}); oASC.putCell(o.cc+4,o.rc,"▶"); o.rc++; co--;
  oASC.putLine({from:{c:o.cc+co,r:o.rc},to:{c:o.cc+co+2,r:o.rc},kind:o.lkind,flip:true}); oASC.putCell(o.cc+4,o.rc,"▶"); o.rc++; co--;
  oASC.putLine({from:{c:o.cc+co,r:o.rc},to:{c:o.cc+co+2,r:o.rc},kind:o.lkind,flip:true}); oASC.putCell(o.cc+4,o.rc,"▶"); o.rc++; co--;
  oASC.putLine({from:{c:o.cc+co,r:o.rc},to:{c:o.cc+co+2,r:o.rc},kind:o.lkind,flip:true}); oASC.putCell(o.cc+4,o.rc,"▶"); o.rc++; co--;

  o.rc++; co = 1; 

  oASC.putLine({from:{c:o.cc+co+2,r:o.rc},to:{c:o.cc+co,r:o.rc},kind:o.lkind,flip:true}); oASC.putCell(o.cc-4,o.rc,"◀"); o.rc++; co--;
  oASC.putLine({from:{c:o.cc+co+2,r:o.rc},to:{c:o.cc+co,r:o.rc},kind:o.lkind,flip:true}); oASC.putCell(o.cc-4,o.rc,"◀"); o.rc++; co--;
  oASC.putLine({from:{c:o.cc+co+2,r:o.rc},to:{c:o.cc+co,r:o.rc},kind:o.lkind,flip:true}); oASC.putCell(o.cc-4,o.rc,"◀"); o.rc++; co--;
  oASC.putLine({from:{c:o.cc+co+2,r:o.rc},to:{c:o.cc+co,r:o.rc},kind:o.lkind,flip:true}); oASC.putCell(o.cc-4,o.rc,"◀"); o.rc++; co--;
  oASC.putLine({from:{c:o.cc+co+2,r:o.rc},to:{c:o.cc+co,r:o.rc},kind:o.lkind,flip:true}); oASC.putCell(o.cc-4,o.rc,"◀"); o.rc++; co--;
  return o.rc;
}

function VlineSEQ(o)
{
  var co;
  o.rc++; co = 1;

  oASC.putLine({from:{c:o.rc,r:o.cc+co},to:{c:o.rc,r:o.cc+co+2},kind:o.lkind,flip:true}); oASC.putCell(o.rc,o.cc+4,"▼"); o.rc++; co--;
  oASC.putLine({from:{c:o.rc,r:o.cc+co},to:{c:o.rc,r:o.cc+co+2},kind:o.lkind,flip:true}); oASC.putCell(o.rc,o.cc+4,"▼"); o.rc++; co--;
  oASC.putLine({from:{c:o.rc,r:o.cc+co},to:{c:o.rc,r:o.cc+co+2},kind:o.lkind,flip:true}); oASC.putCell(o.rc,o.cc+4,"▼"); o.rc++; co--;
  oASC.putLine({from:{c:o.rc,r:o.cc+co},to:{c:o.rc,r:o.cc+co+2},kind:o.lkind,flip:true}); oASC.putCell(o.rc,o.cc+4,"▼"); o.rc++; co--;
  oASC.putLine({from:{c:o.rc,r:o.cc+co},to:{c:o.rc,r:o.cc+co+2},kind:o.lkind,flip:true}); oASC.putCell(o.rc,o.cc+4,"▼"); o.rc++; co--;

  o.rc++; co = 1; 

  oASC.putLine({from:{c:o.rc,r:o.cc+co+2},to:{c:o.rc,r:o.cc+co},kind:o.lkind,flip:true}); oASC.putCell(o.rc,o.cc-4,"▲"); o.rc++; co--;
  oASC.putLine({from:{c:o.rc,r:o.cc+co+2},to:{c:o.rc,r:o.cc+co},kind:o.lkind,flip:true}); oASC.putCell(o.rc,o.cc-4,"▲"); o.rc++; co--;
  oASC.putLine({from:{c:o.rc,r:o.cc+co+2},to:{c:o.rc,r:o.cc+co},kind:o.lkind,flip:true}); oASC.putCell(o.rc,o.cc-4,"▲"); o.rc++; co--;
  oASC.putLine({from:{c:o.rc,r:o.cc+co+2},to:{c:o.rc,r:o.cc+co},kind:o.lkind,flip:true}); oASC.putCell(o.rc,o.cc-4,"▲"); o.rc++; co--;
  oASC.putLine({from:{c:o.rc,r:o.cc+co+2},to:{c:o.rc,r:o.cc+co},kind:o.lkind,flip:true}); oASC.putCell(o.rc,o.cc-4,"▲"); o.rc++; co--;
 
  return o.rc;
}

function runWorkerThreadSmokeTests()
{
  // Start with a clean area
  oASC.wipeSelection(' ');
  var exp = "";

 return Promise.resolve()
     .then(() => {
        console.log("-0-");
        console.log("worker symbol checks for oASC ...");
        //return sanityWorkerSymbolsForASC(__help_oASC);
     })
    .then(function(){
      console.log("-1-");
      exp = "TEST";
      // set environment variable
    return oCMD.runExternalScript("oTERM.setenv(\"myVar\",\""+exp +"\")");
    })
    .then(function(){
      console.log("-2-");
      var got = oTERM._o.env.myVar;
      assertEq("set environment variable oTERM.setenv(\"myVar\",\""+exp +"\")", got, exp);
      // get environment variable
    return oCMD.runExternalScript("{ oTERM.setenv(\"cpyVar\",oTERM.getenv(\"myVar\"))}");
    })
    .then(function(){
      console.log("-3-");
      var got = oTERM._o.env.cpyVar;
      assertEq("get environment variable oTERM.setenv(\"cpyVar\",oTERM.getenv(\"myvar\"))", got, exp);
      console.log("-4-");
    return oCMD.runExternalScript(oASC.putCell.help.unitTests.join(";"));          // UNIT test
    })
    .then(function(){
    return oCMD.runExternalScript(oASC.cat.help.unitTests.join(";"));              // UNIT test
    })
    .then(function(){
    return oCMD.runExternalScript(oASC.box.help.unitTests.join(";"));              // UNIT test
    }) 
    .then(function(){
    return oCMD.runExternalScript(oASC.putLine.help.unitTests.join(";"));          // UNIT test
    }) 
    .then(function(){
    return oCMD.runExternalScript(oASC.glyphToMask3.help.unitTests.join(";"));     // UNIT test
    })
    .then(function(){
    return oCMD.runExternalScript(oASC.mask3ToGlyph.help.unitTests.join(";"));     // UNIT test
    })
    .then(function(){
    return oCMD.runExternalScript(oASC.computeNetlist.help.unitTests.join(";"));   // UNIT test
    }) 
    .then(function(){
        // TEST HORIZONTAL LINE CROSSINGS
        var rc = 0, cc = 4;
        oASC.putLine({from:{c:cc,r:rc},to:{c:cc,r:rc+35},kind:oASC.BOX_SINGLE,flip:true});
        rc = HlineSEQ({"cc":cc,"rc":rc,"lkind":oASC.BOX_SINGLE});
        rc = HlineSEQ({"cc":cc,"rc":rc,"lkind":oASC.BOX_FAT});
        rc = HlineSEQ({"cc":cc,"rc":rc,"lkind":oASC.BOX_DOUBLE});

        var rc = 0, cc = 14;
        oASC.putLine({from:{c:cc,r:rc},to:{c:cc,r:rc+35},kind:oASC.BOX_FAT,flip:true});
        rc = HlineSEQ({"cc":cc,"rc":rc,"lkind":oASC.BOX_SINGLE});
        rc = HlineSEQ({"cc":cc,"rc":rc,"lkind":oASC.BOX_FAT});
        rc = HlineSEQ({"cc":cc,"rc":rc,"lkind":oASC.BOX_DOUBLE});

        var rc = 0, cc = 24;
        oASC.putLine({from:{c:cc,r:rc},to:{c:cc,r:rc+35},kind:oASC.BOX_DOUBLE,flip:true});
        rc = HlineSEQ({"cc":cc,"rc":rc,"lkind":oASC.BOX_SINGLE});
        rc = HlineSEQ({"cc":cc,"rc":rc,"lkind":oASC.BOX_FAT});
        rc = HlineSEQ({"cc":cc,"rc":rc,"lkind":oASC.BOX_DOUBLE});

        var ar = [
        "    │         ┃         ║           ",
        "    │───▶     ┃───▶     ║───▶       ",
        "    ├── ▶     ┠── ▶     ╟── ▶       ",
        "   ─│─  ▶    ─┃─  ▶    ─║─  ▶       ",
        "  ──┤   ▶   ──┨   ▶   ──╢   ▶       ",
        " ───│   ▶  ───┃   ▶  ───║   ▶       ",
        "    │         ┃         ║           ",
        "◀   │───  ◀   ┃───  ◀   ║───        ",
        "◀   ├──   ◀   ┠──   ◀   ╟──         ",
        "◀  ─│─    ◀  ─┃─    ◀  ─║─          ",
        "◀ ──┤     ◀ ──┨     ◀ ──╢           ",
        "◀───│     ◀───┃     ◀───║           ",
        "    │         ┃         ║           ",
        "    │━━━▶     ┃━━━▶     ║━━━▶       ",
        "    ┝━━ ▶     ┣━━ ▶     ╟━━ ▶       ",
        "   ━│━  ▶    ━┃━  ▶    ━║━  ▶       ",
        "  ━━┥   ▶   ━━┫   ▶   ━━╢   ▶       ",
        " ━━━│   ▶  ━━━┃   ▶  ━━━║   ▶       ",
        "    │         ┃         ║           ",
        "◀   │━━━  ◀   ┃━━━  ◀   ║━━━        ",
        "◀   ┝━━   ◀   ┣━━   ◀   ╟━━         ",
        "◀  ━│━    ◀  ━┃━    ◀  ━║━          ",
        "◀ ━━┥     ◀ ━━┫     ◀ ━━╢           ",
        "◀━━━│     ◀━━━┃     ◀━━━║           ",
        "    │         ┃         ║           ",
        "    │═══▶     ┃═══▶     ║═══▶       ",
        "    ╞══ ▶     ┣══ ▶     ╠══ ▶       ",
        "   ═│═  ▶    ═┃═  ▶    ═║═  ▶       ",
        "  ══╡   ▶   ══┫   ▶   ══╣   ▶       ",
        " ═══│   ▶  ═══┃   ▶  ═══║   ▶       ",
        "    │         ┃         ║           ",
        "◀   │═══  ◀   ┃═══  ◀   ║═══        ",
        "◀   ╞══   ◀   ┣══   ◀   ╠══         ",
        "◀  ═│═    ◀  ═┃═    ◀  ═║═          ",
        "◀ ══╡     ◀ ══┫     ◀ ══╣           ",
        "◀═══│     ◀═══┃     ◀═══║           "
        ]

        oASC.assert("combined horizontal crossing", oASC.getCell(0,0,36,oASC.E|oASC.S) ,ar.join("\n"));



        var n = 1+3*20 +1+3*20 +1+3*20 - 0
        oASC.stack("undo100");
        n -= 100;
        oASC.stack("undo20");
        oASC.stack("undo20");
        oASC.stack("undo20");
        oASC.stack("undo20");
        n -= 80;
        for(var i=0;i<n;i++) oASC.stack("undo");

  
    return
    })
    .then(function(){
        // TEST VERTICAL LINE CROSSINGS

        var rc = 0, cc = 4;
        oASC.putLine({from:{c:rc,r:cc},to:{c:rc+35,r:cc},kind:oASC.BOX_SINGLE,flip:true});
        rc = VlineSEQ({"cc":cc,"rc":rc,"lkind":oASC.BOX_SINGLE});
        rc = VlineSEQ({"cc":cc,"rc":rc,"lkind":oASC.BOX_FAT});
        rc = VlineSEQ({"cc":cc,"rc":rc,"lkind":oASC.BOX_DOUBLE});

        var rc = 0, cc = 14;
         oASC.putLine({from:{c:rc,r:cc},to:{c:rc+35,r:cc},kind:oASC.BOX_FAT,flip:true});
        rc = VlineSEQ({"cc":cc,"rc":rc,"lkind":oASC.BOX_SINGLE});
        rc = VlineSEQ({"cc":cc,"rc":rc,"lkind":oASC.BOX_FAT});
        rc = VlineSEQ({"cc":cc,"rc":rc,"lkind":oASC.BOX_DOUBLE});
         
        var rc = 0, cc = 24;
        oASC.putLine({from:{c:rc,r:cc},to:{c:rc+35,r:cc},kind:oASC.BOX_DOUBLE,flip:true});
        rc = VlineSEQ({"cc":cc,"rc":rc,"lkind":oASC.BOX_SINGLE});
        rc = VlineSEQ({"cc":cc,"rc":rc,"lkind":oASC.BOX_FAT});
        rc = VlineSEQ({"cc":cc,"rc":rc,"lkind":oASC.BOX_DOUBLE});

        var ar = [
        "       ▲▲▲▲▲       ▲▲▲▲▲       ▲▲▲▲▲",
        "     │     │     ┃     ┃     ║     ║",
        "    ││    ││    ┃┃    ┃┃    ║║    ║║",
        "   │││   │││   ┃┃┃   ┃┃┃   ║║║   ║║║",
        "──┬│┴───┬│┴───┰┃┸───┰┃┸───╥║╨───╥║╨─",
        " │││   │││   ┃┃┃   ┃┃┃   ║║║   ║║║  ",
        " ││    ││    ┃┃    ┃┃    ║║    ║║   ",
        " │     │     ┃     ┃     ║     ║    ",
        " ▼▼▼▼▼       ▼▼▼▼▼       ▼▼▼▼▼      ",
        "                                    ",
        "       ▲▲▲▲▲       ▲▲▲▲▲       ▲▲▲▲▲",
        "     │     │     ┃     ┃     ║     ║",
        "    ││    ││    ┃┃    ┃┃    ║║    ║║",
        "   │││   │││   ┃┃┃   ┃┃┃   ║║║   ║║║",
        "━━┯│┷━━━┯│┷━━━┳┃┻━━━┳┃┻━━━┳║┻━━━┳║┻━",
        " │││   │││   ┃┃┃   ┃┃┃   ║║║   ║║║  ",
        " ││    ││    ┃┃    ┃┃    ║║    ║║   ",
        " │     │     ┃     ┃     ║     ║    ",
        " ▼▼▼▼▼       ▼▼▼▼▼       ▼▼▼▼▼      ",
        "                                    ",
        "       ▲▲▲▲▲       ▲▲▲▲▲       ▲▲▲▲▲",
        "     │     │     ┃     ┃     ║     ║",
        "    ││    ││    ┃┃    ┃┃    ║║    ║║",
        "   │││   │││   ┃┃┃   ┃┃┃   ║║║   ║║║",
        "══╤│╧═══╤│╧═══╤┃╧═══╤┃╧═══╦║╩═══╦║╩═",
        " │││   │││   ┃┃┃   ┃┃┃   ║║║   ║║║  ",
        " ││    ││    ┃┃    ┃┃    ║║    ║║   ",
        " │     │     ┃     ┃     ║     ║    ",
        " ▼▼▼▼▼       ▼▼▼▼▼       ▼▼▼▼▼      ",
        "                                    ",
        "                                    ",
        "                                    ",
        "                                    ",
        "                                    ",
        "                                    ",
        "                                    "
        ]

        oASC.assert("combined vertical crossing", oASC.getCell(0,0,36,oASC.E|oASC.S) ,ar.join("\n"));

        
        var n = 1+3*20 +1+3*20 +1+3*20 - 0
        oASC.stack("undo100");
        n -= 100;
        oASC.stack("undo20");
        oASC.stack("undo20");
        oASC.stack("undo20");
        oASC.stack("undo20");
        n -= 80;
        for(var i=0;i<n;i++) oASC.stack("undo");
        

    })
    .then(function() { worker?.terminate?.(); })
    .then(function()
    {
      op = { type: "place", ch: '+' };
      //oCMD.runExternalScript("oASC.stack('reset')");
    });
}


// TEST RUNNER

(function init() 
{
  if (bDebug != true) return;  // only run assertions if we have a debug flag

  const __help_oASC = sanityHelpMeta("oASC", oASC);
  const __help_oCMD = sanityHelpMeta("oCMD", oCMD);

  oTERM = new TERMINAL(
  {
    welcome: sbTitle.querySelector("big").textContent + " terminal - type <u>help</u>",
    prompt: "AsciiCAD",
    separator: '>',
  });

  // Authorise terminal access to internal JavaScript objects (by name)
  // We can authorise by prefix, explicit variable names, or just scope all variables in the object 
  oCMD.bind([
     { name: "oASC" ,  exposeAllNonFunctions:true /*constPrefixes: ["BOX_"],*/  /*, explicitKeys: ["BOX_SINGLE","BOX_DOUBLE","BOX_FAT","N","S","E","W"]*/ }
    ,{ name: "oCMD"  }
    ,{ name: "oTERM" }
    ,{ name: "oCOM"  }
  ]);
  const __help_oTERM = sanityHelpMeta("oTERM", oTERM);

  
  stageSize = oASC.computeStageSize();
  stage.style.width = stageSize.w + 'px';
  stage.style.height = stageSize.h + 'px';
  oASC.syncCanvasBufferToStage();

  // Light sanity checks
  console.assert(oASC.serializeToText().split('\n')[0].length === COLS, 'serializeToText -> COLS chars/line');
  console.assert(oCOM.toLines('A\r\nB\rC\nD').length === 4, 'newline normalization');
  console.assert(!oASC.serializeToText().includes("\\n"), "Save must not contain literal \\n");

  console.assert(
      oASC.sanitizeForSave("A\\nB\\rC\\r\\nD").split("\n").length === 4,
      "Literal escape normalization failed"
  );

  console.assert(
      oASC.sanitizeForSave("A   \nB\t\t\n\n").endsWith("A\nB"),
      "Trailing whitespace or empty-line trimming failed"
  );

  console.assert(
      !oASC.sanitizeForSave("A\\nB").includes("\\n"),
      "Saved text must not contain literal \\n"
  );

  console.assert(!oASC.catalogTypes().includes(null), "catalogTypes contains null");

  console.assert(!oASC.catalogTypes().includes(""), "catalogTypes contains empty string");

  runMixedJunctionTests(); oASC.wipeSelection(' ');

  // Run worker sandbox tests after the synchronous sanity checks.
  runWorkerThreadSmokeTests()
    .then(function()
    {
       updateUI(); 
       oASC.draw("smoketest"); 
    })
    .catch(function(err){ console.error('Worker smoke tests failed:', err); updateUI(); draw(); });
  })();

  
}
