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

  ["log", "warn", "error"].forEach(type => {
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

function assertEq(name, got, exp) {
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

function getSmallGridText(h, w) {
  let s = "";
  for (let r = 0; r < h; r++) {
    let line = "";
    for (let c = 0; c < w; c++) line += ascii[r][c];
    s += line + "\n";
  }
  return s;
}

function assertGrid(name, got, exp) {
  console.assert(got === exp, name + "\nGOT:\n" + got + "\nEXP:\n" + exp);
}



// TEST DATA

function runJunctionTests() {
  // Keep tests small: use top-left 5x5 of your big grid
  const H = 5, W = 5;

  // --- 1) single + single => ┼
  gridFromText(
    "  │  \n" +
    "  │  \n" +
    "─────\n" +
    "  │  \n" +
    "  │  \n"
  );
  // draw single horizontal across the middle again (idempotent)
  applyHorizontalLine(2, 0, 4, "single", true);
  assertEq("single×single => ┼", textFromGrid(H, W),
    "  │  \n" +
    "  │  \n" +
    "──┼──\n" +
    "  │  \n" +
    "  │  \n"
  );

  // --- 2) double + double => ╬
  gridFromText(
    "  ║  \n" +
    "  ║  \n" +
    "═════\n" +
    "  ║  \n" +
    "  ║  \n"
  );
  applyHorizontalLine(2, 0, 4, "double", true);
  assertEq("double×double => ╬", textFromGrid(H, W),
    "  ║  \n" +
    "  ║  \n" +
    "══╬══\n" +
    "  ║  \n" +
    "  ║  \n"
  );

  // --- 3) double vertical + single horizontal => ╫
  gridFromText(
    "  ║  \n" +
    "  ║  \n" +
    "─────\n" +
    "  ║  \n" +
    "  ║  \n"
  );
  applyHorizontalLine(2, 0, 4, "single", true);
  assertEq("double vert × single horz => ╫", textFromGrid(H, W),
    "  ║  \n" +
    "  ║  \n" +
    "──╫──\n" +
    "  ║  \n" +
    "  ║  \n"
  );

  // --- 4) single vertical + double horizontal => ╪
  gridFromText(
    "  │  \n" +
    "  │  \n" +
    "═════\n" +
    "  │  \n" +
    "  │  \n"
  );
  applyHorizontalLine(2, 0, 4, "double", true);
  assertEq("single vert × double horz => ╪", textFromGrid(H, W),
    "  │  \n" +
    "  │  \n" +
    "══╪══\n" +
    "  │  \n" +
    "  │  \n"
  );

  // --- 5) Your provided case: two single verticals crossed by double horizontal
  gridFromText(
    " ││  \n" +
    " ││  \n" +
    " ││  \n"
  );
  applyHorizontalLine(1, 0, 3, "double", true);
  assertEq("two single verticals crossed by double horizontal", textFromGrid(3, 4),
    " ││ \n" +
    "═╪╪═\n" +
    " ││ \n"
  );

  console.log("Junction tests done.");
}



function runMixedJunctionTests() {
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
  assertGrid("single×single => ┼", getSmallGridText(H,W),
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
  assertGrid("double×double => ╬", getSmallGridText(H,W),
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
  assertGrid("single vert × double horz => ╪", getSmallGridText(H,W),
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
  assertGrid("double vert × single horz => ╫", getSmallGridText(H,W),
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
  assertGrid("two single verticals crossed by double horiz", getSmallGridText(3,4),
    " ││ \n═╪╪═\n ││ \n"
  );

  console.log("Mixed junction tests done.");
}


function testDoubleBusCross() {
  setSmallGridFromLines([
    "   ",
    "   ",
    "═══",
    "═══",
    "   ",
  ]);

  // simulate committing a vertical double line in middle col=1
  for (let r = 0; r < 5; r++) ascii[r][1] = "║";

  // normalize around affected area (simple: whole 5x3 here)
  const affected = new Set();
  for (let r = 0; r < 5; r++) for (let c = 0; c < 3; c++) affected.add(r + "," + c);

  const stroke = [];
  oASC.normalizeAffected(affected, stroke);

  const got = getSmallGridText(5,3);
  const exp =
    " ║ \n" +
    " ║ \n" +
    "═╬═\n" +
    "═╬═\n" +
    " ║ \n";

  assertGrid("double bus cross over 2 rows => ╬╬", got, exp);
  console.log("double bus cross over 2 rows tests done.");
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

function runWorkerThreadSmokeTests()
{
  // Start with a clean area
  oASC.wipeSelection(' ');

  // Authorise terminal access to internal JavaScript objects (by name) 

  // caution: oTERM does not exist yet at this stage (because instantiation has to wait for "onload")
  oCMD.bind([
     { name: "oASC", exposeAllNonFunctions:true }
    ,{ name: "oCMD" }
    ,{ name: "oCOM" }
  ]);
  
  console.log("-1-");
  // Place 3 pluses using the three supported syntaxes
  return                     oCMD.runExternalScript("{oASC.freeform(0,0,'+');}")
    .then(function(){ return oCMD.runExternalScript("freeform(1,0,'+');"); })
    .then(function(){ return oCMD.runExternalScript("{ freeform(2,0,'+'); oCOM.isDoubleWidthChar('+'); }"); })
    .then(function(){
      var got = getSmallGridText(3,1);
      assertGrid("worker freeform syntaxes => 3 pluses", got, small3x1Plus());
      console.log("-2-");
    })
    .then(function(){
      // Undo 3 times (all 3 pluses should disappear)
      return oCMD.runExternalScript("oASC.stack('undo');oASC.stack('undo');oASC.stack('undo');");
    })
    .then(function(){
      console.log("-3-");
      var got2 = getSmallGridText(3,1);
      assertGrid("worker undo x3 => cleared", got2, small3x1Spaces());
    })
    .then(function(){
      console.log("-4-");
      // Redo 3 times (all 3 pluses should reappear)
      return oCMD.runExternalScript("oASC.stack('redo');oASC.stack('redo');oASC.stack('redo');");
    })
    .then(function(){
      console.log("-5-");
      var got3 = getSmallGridText(3,1);
      assertGrid("worker redo x3 => 3 pluses", got3, small3x1Plus());
      console.log("Worker thread smoke tests done.");
    })
    .then(function(){
      // cleanup
    return oCMD.runExternalScript("oASC.resetUndo();");
    })
    .then(function() { worker?.terminate?.(); });
}

// TEST RUNNER

(function init() 
{
  if (bDebug != true) return;  // only run assertions if we have a debug flag

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


  runJunctionTests(); oASC.wipeSelection(' ');
  runMixedJunctionTests(); oASC.wipeSelection(' ');
  testDoubleBusCross(); oASC.wipeSelection(' ');

  // Run worker sandbox tests after the synchronous sanity checks.
  runWorkerThreadSmokeTests()
    .then(function(){ updateUI(); oASC.draw(); })
    .catch(function(err){ console.error('Worker smoke tests failed:', err); updateUI(); draw(); });
  })();

}
