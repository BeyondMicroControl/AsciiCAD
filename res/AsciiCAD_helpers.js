const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

function normalizeNewlines(t) {
return String(t ?? "")
.replace(/\r\n/g, '\n') // real CRLF -> LF
.replace(/\r/g, '\n');  // real CR   -> LF
}

function toLines(t) {
return normalizeNewlines(t).split('\n'); // split on real LF
}

const normRect = (a, b) => ({ r0: Math.min(a.r,b.r), r1: Math.max(a.r,b.r), c0: Math.min(a.c,b.c), c1: Math.max(a.c,b.c) });

const rangeChars = (start, end) => {
    const out = [];
    for (let cp = start; cp <= end; cp++) out.push(String.fromCharCode(cp));
    return out;
};

function catalogTypes()
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

const catalogItemsForTab = (tab) => tab === 'All' ? CATALOG : CATALOG.filter(it => String(it.type || 'Other') === tab);
const catalogItemByUID = (uid) => CATALOG.find(it => (it.name+'_'+it.type+'_'+it.MFR) === uid);

// Stage sizing: ensure integer cell sizes (avoid remainder pixels -> spacing artifacts)
function computeStageSize() 
{
    const r = container.getBoundingClientRect();
    let w = Math.max(1, Math.floor(r.width));
    let h = Math.max(1, Math.floor(r.height));
    if (w >= COLS) w = Math.floor(w / COLS) * COLS;
    if (h >= ROWS) h = Math.floor(h / ROWS) * ROWS;
    return { w: Math.max(1, w), h: Math.max(1, h) };
}

function syncCanvasBufferToStage() 
{
    const dpr = window.devicePixelRatio || 1;
    const w = Math.max(1, Math.floor(stageSize.w * dpr));
    const h = Math.max(1, Math.floor(stageSize.h * dpr));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
}

function getSnapFns(dpr, scaleNow)
{
    const pxScale = (dpr || 1) * (scaleNow || 1);
    const snap = (v) => Math.round(v * pxScale) / pxScale;
    const snapLine = (v) => (Math.round(v * pxScale) + 0.5) / pxScale;
    return { snap, snapLine };
}

const getCellSize = () => ({ cw: baseCellW, ch: baseCellH });

function PanZoomSize(pos,centre,scale,pan,size)
{
    return ((pos - centre) / scale + centre - pan) / size;
}

function serializeToText() {
const lines = [];
for (let r = 0; r < ROWS; r++) lines.push(ascii[r].join(''));
return lines.join('\n');
}

function deEscapeLiteralNewlines(t) {
return String(t ?? "")
    .replace(/\\r\\n/g, '\n')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\n');
}

function sanitizeForSave(text) {
let t = String(text ?? "")
    // 1) Convert literal escape sequences to real newlines
    .replace(/\\r\\n/g, '\n')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\n')

    // 2) Normalize real CRLF / CR to LF
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n');

t = collapseAfterWideCharsForSave(t);

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


function isDoubleWidthChar(ch)
{
    if (!ch) return false;
    const cp = ch.codePointAt(0);

    // Quick ASCII / Latin
    if (cp <= 0x1FFF) return false;

    // Common wide ranges (wcwidth-style; not exhaustive but good enough)
    return (
        (cp >= 0x1100 && cp <= 0x115F) || // Hangul Jamo init.
        cp === 0x2329 || cp === 0x232A ||
        (cp >= 0x2E80 && cp <= 0xA4CF) || // CJK, Yi, radicals...
        (cp >= 0xAC00 && cp <= 0xD7A3) || // Hangul syllables
        (cp >= 0xF900 && cp <= 0xFAFF) || // CJK compatibility ideographs
        (cp >= 0xFE10 && cp <= 0xFE19) ||
        (cp >= 0xFE30 && cp <= 0xFE6F) ||
        (cp >= 0xFF00 && cp <= 0xFF60) || // Fullwidth forms
        (cp >= 0xFFE0 && cp <= 0xFFE6) ||
        (cp >= 0x1F300 && cp <= 0x1FAFF) || // emoji blocks (often wide)
        (cp >= 0x20000 && cp <= 0x3FFFD) || // CJK ext
        cp === 0x2B24 // ⬤ specifically
    );
}

function downloadText(text, filename) {
const name = filename || "ascii-drawing.txt";
const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = name;
a.rel = "noopener";
a.style.display = "none";
document.body.appendChild(a);
try { a.click(); } finally { setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 0); }
}

function pushStrokeIfNonEmpty(stroke) {
if (!stroke || stroke.length === 0) return;
undoStack.push(stroke);
redoStack.length = 0;
updateUI();
if (schemaHighlightOn) highlightCache = null;
}

function doUndo() {
const stroke = undoStack.pop();
if (!stroke) return;
for (let i = stroke.length - 1; i >= 0; i--) ascii[stroke[i].r][stroke[i].c] = stroke[i].prev;
redoStack.push(stroke);
updateUI();
draw("doUndo");
}

function doRedo() {
const stroke = redoStack.pop();
if (!stroke) return;
for (let i = 0; i < stroke.length; i++) ascii[stroke[i].r][stroke[i].c] = stroke[i].next;
undoStack.push(stroke);
updateUI();
draw("doRedo");
}

function snapshotRect(rect) {
const m = new Map();
for (let r = rect.r0; r <= rect.r1; r++) for (let c = rect.c0; c <= rect.c1; c++) m.set(r + ',' + c, ascii[r][c]);
return m;
}


//     ____   ____                _   __   __        _________                              _                   __   
//    |_  _| |_  _|              (_) [  | [  |      |  _   _  |                            (_)                 [  |  
//      \ \   / /,--.   _ .--.   __   | |  | |  ,--.|_/ | | \_|.---.  _ .--.  _ .--..--.   __   _ .--.   ,--.   | |  
//       \ \ / /`'_\ : [ `.-. | [  |  | |  | | `'_\ :   | |   / /__\\[ `/'`\][ `.-. .-. | [  | [ `.-. | `'_\ :  | |  
//        \ ' / // | |, | | | |  | |  | |  | | // | |, _| |_  | \__., | |     | | | | | |  | |  | | | | // | |, | |  
//         \_/  \'-;__/[___||__][___][___][___]\'-;__/|_____|  '.__.'[___]   [___||__||__][___][___||__]\'-;__/[___] 
//       _       _       _     
//      | |     | |     | |    
//      | |     | |     | |    
//      | |     | |     | |    
//     _| |__  _| |__  _| |__  
//    [ \_[  ][ \_[  ][ \_[  ] 
//     \ \/ /  \ \/ /  \ \/ /  
//      \__/    \__/    \__/   
// 


var VanillaTerminal = function VanillaTerminal(props) {
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

    // Dispatch
    var parts = commandLine.split(" ");
    var command = parts[0];
    var params = parts.slice(1);
    var callback = self.commands[command];

    if (typeof callback === "function") {
      callback(self, params);
      if (typeof self.onInputCallback === "function") {
        self.onInputCallback(command, params);
      }
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
  var observer = new MutationObserver(function () {
    setTimeout(function () {
      self.DOM.input.scrollIntoView({ block: "nearest" });
    }, 0);
  });
  observer.observe(self.DOM.output, { childList: true, subtree: true });

  // Focus handling
  window.addEventListener(
    "click",
    function () {
      self.DOM.input.focus();
    },
    false
  );

  self.DOM.output.addEventListener(
    "click",
    function (ev) {
      ev.stopPropagation();
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

  window.addEventListener(
    "keyup",
    function (ev) {
      self.DOM.input.focus();
      ev.stopPropagation();
      ev.preventDefault();
    },
    false
  );

  // ---- initial output ------------------------------------------------------

  if (welcome) this.output(welcome);
};


//      ___     ___     ___   
//     / _ \   / _ \   / _ \  
//    |_/ \_| |_/ \_| |_/ \_| 
//      | |     | |     | |   
//      | |     | |     | |   
//      | |     | |     | |   
//      |_|     |_|     |_|   
// 
//     ____   ____                _   __   __        _________                              _                   __   
//    |_  _| |_  _|              (_) [  | [  |      |  _   _  |                            (_)                 [  |  
//      \ \   / /,--.   _ .--.   __   | |  | |  ,--.|_/ | | \_|.---.  _ .--.  _ .--..--.   __   _ .--.   ,--.   | |  
//       \ \ / /`'_\ : [ `.-. | [  |  | |  | | `'_\ :   | |   / /__\\[ `/'`\][ `.-. .-. | [  | [ `.-. | `'_\ :  | |  
//        \ ' / // | |, | | | |  | |  | |  | | // | |, _| |_  | \__., | |     | | | | | |  | |  | | | | // | |, | |  
//         \_/  \'-;__/[___||__][___][___][___]\'-;__/|_____|  '.__.'[___]   [___||__||__][___][___||__]\'-;__/[___]