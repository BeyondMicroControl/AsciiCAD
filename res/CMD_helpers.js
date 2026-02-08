//       ______  ____    ____  ______    
//     .' ___  ||_   \  /   _||_   _ `.  
//    / .'   \_|  |   \/   |    | | `. \ 
//    | |         | |\  /| |    | |  | | 
//    \ `.___.'\ _| |_\/_| |_  _| |_.' / 
//     `.____ .'|_____||_____||______.'  
//
// * Minimal Linux-style command line parsing (shell-ish, not a full shell).
// - parseLine: splits a line into statements by operators ; && || | &
// - parseStatement: parses one statement into {ok, name, arguments, data}
//
// Notes:
// - Supports quotes '...' and "..." and backslash escaping.
// - Supports comments starting with # when not inside quotes.
// - Does NOT implement variable expansion, globbing, command substitution, redirections, etc.

function CMD()
{  
  //     __                             
  //    [  |                            
  //     | | .---.  _   __              
  //     | |/ /__\\[ \ [  ]             
  //     | || \__., > '  <              
  //    [___]'.__.'[__]`\_]             
  //      _____      _                  
  //     |_   _|    (_)                 
  //       | |      __   _ .--.  .---.  
  //       | |   _ [  | [ `.-. |/ /__\\ 
  //      _| |__/ | | |  | | | || \__., 
  //     |________|[___][___||__]'.__.'       
  //                                   
  /// Lex line into tokens: words + operators ; && || | &

  this.lexLine = function(line) 
  {
    const ops = new Set([";", "&&", "||", "|", "&"]);
    const tokens = []; // {type:"word"|"op", value:string}
    let buf = "";

    let inSingle = false;
    let inDouble = false;
    let escape = false;

    const pushBuf = () => { if (buf.length) { tokens.push({ type: "word", value: buf }); buf = ""; } };

    const pushOp = (op) => tokens.push({ type: "op", value: op });

    for (let i = 0; i < line.length; i++) 
    {
      const ch = line[i];
      if (escape) { buf += ch; escape = false; continue; }   // Keep escaped char literally (typical shell-ish behavior)
      if (!inSingle && ch === "\\") { escape = true; continue; }
      // Comments: # starts a comment only when not in quotes and at token boundary-ish
      if (!inSingle && !inDouble && ch === "#") { break; }     // discard rest of line
      if (!inDouble && ch === "'" ) { inSingle = !inSingle; continue; }
      if (!inSingle && ch === '"') { inDouble = !inDouble; continue; }

      if (!inSingle && !inDouble)
      {
        if (/\s/.test(ch)) { pushBuf(); continue; }                   // whitespace splits words
        const two = line.slice(i, i + 2);                             // recognize multi-char operators first
        if (ops.has(two)) { pushBuf(); pushOp(two); i++; continue; }  // consumed 2 chars
        if (ops.has(ch)) { pushBuf(); pushOp(ch); continue; }
      }
      buf += ch;
    }

    if (escape) { return { ok: false, error: "dangling escape at end of line", tokens: [] }; }
    if (inSingle || inDouble) { return { ok: false, error: "unclosed quote", tokens: [] }; }

    pushBuf();
    return { ok: true, tokens };
  }

  //     _ .--.   ,--.   _ .--.  .--.  .---.                               
  //    [ '/'`\ \`'_\ : [ `/'`\]( (`\]/ /__\\                              
  //     | \__/ |// | |, | |     `'.'.| \__.,                              
  //     | ;.__/ \'-;__/[___]   [\__) )'.__.'                              
  //    [__|____    _          _                                      _    
  //    .' ____ \  / |_       / |_                                   / |_  
  //    | (___ \_|`| |-',--. `| |-'.---.  _ .--..--.  .---.  _ .--. `| |-' 
  //     _.____`.  | | `'_\ : | | / /__\\[ `.-. .-. |/ /__\\[ `.-. | | |   
  //    | \____) | | |,// | |,| |,| \__., | | | | | || \__., | | | | | |,  
  //     \______.' \__/\'-;__/\__/ '.__.'[___||__||__]'.__.'[___||__]\__/ 
  //
  /// Parse a single statement (no top-level operators) into:
  /// { ok, name, arguments:[ {opt:value}, "positional", ... ], data:[{key,value},...] }
  /// Internal: parse a statement from an already-tokenized word array (quotes already handled by lexLine).
  /// `words` must be an array like ["cmd","arg1","arg 2",...]
  this._parseStatementWords = function(words, dataIn)
  {
    const data = this.normalizeData(dataIn);

    if (!Array.isArray(words) || words.length === 0)
      return { ok: false, name: "", arguments: [], data: dataToPairs(data), error: "empty statement" };

    const name = words[0];
    const argv = words.slice(1);

    const outArgs = [];
    let stopOptions = false;

    const pushOpt = (optName, optValue) => { outArgs.push({ [optName]: optValue }); };

    for (let i = 0; i < argv.length; i++)
    {
      const tok = argv[i];

      if (!stopOptions && tok === "--") { stopOptions = true; continue; }

      if (!stopOptions && tok.startsWith("--") && tok.length > 2)
      {
        const eq = tok.indexOf("=");
        if (eq >= 0) { const opt = tok.slice(2, eq); const val = tok.slice(eq + 1); pushOpt(opt, val); }
        else
        {
          const opt = tok.slice(2);
          const next = argv[i + 1];
          if (next != null && !(next.startsWith("-") && next !== "-")) { pushOpt(opt, next); i++; }
          else pushOpt(opt, true);
        }

  /// Internal: render a "raw" string that is human-friendly and keeps grouping visible.
  /// Since lexLine strips quote characters, this reconstructs a safe representation:
  /// - wraps args containing whitespace (or empty) in double quotes
  /// - escapes backslash and double quote inside those quoted args
  this._renderRawWords = function(words)
  {
    if (!Array.isArray(words)) return "";
    const needsQuotes = (s) => (s === "") || /\s/.test(s);
    const escForDq = (s) => String(s).replace(/\\/g, "\\\\").replace(/"/g, '\"');
    return words.map(w => {
      const s = String(w);
      return needsQuotes(s) ? `"${escForDq(s)}"` : s;
    }).join(" ");
  }

  // Optional public alias (handy if you export a reduced API)
  this.renderRawWords = this._renderRawWords;

        continue;
      }

      if (!stopOptions && tok.startsWith("-") && tok !== "-" && tok.length > 1)
      {
        const body = tok.slice(1);

        if (body.length === 1)
        {
          const opt = body;
          const next = argv[i + 1];
          if (next != null && !(next.startsWith("-") && next !== "-")) { pushOpt(opt, next); i++; }
          else pushOpt(opt, true);
        }
        else
        {
          const first = body[0];
          const rest = body.slice(1);
          const restIsAllLetters = /^[A-Za-z]+$/.test(rest);
          if (!restIsAllLetters) pushOpt(first, rest);
          else { for (const ch of body) pushOpt(ch, true); }
        }
        continue;
      }

      outArgs.push(tok);
    }

    data.lastCommand = name;
    return { ok: true, name, arguments: outArgs, data: dataToPairs(data) };
  }


   
  this.parseStatement = function(stmtString, dataIn) 
  {
    const lex = this.lexLine(stmtString);
    if (!lex.ok)
      return { ok: false, name: "", arguments: [], data: dataToPairs(this.normalizeData(dataIn)), error: lex.error };

    // In a statement string, lexer might have produced operators if user passed them in.
    // Treat that as an error here to keep responsibilities clean.
    if (lex.tokens.some(t => t.type === "op"))
      return { ok: false, name: "", arguments: [], data: dataToPairs(this.normalizeData(dataIn)), error: "operator found inside statement" };

    const words = lex.tokens.filter(t => t.type === "word").map(t => t.value);
    return this._parseStatementWords(words, dataIn);
  }


  //     _ .--.   ,--.   _ .--.  .--.  .---.  
  //    [ '/'`\ \`'_\ : [ `/'`\]( (`\]/ /__\\ 
  //     | \__/ |// | |, | |     `'.'.| \__., 
  //     | ;.__/ \'-;__/[___]   [\__) )'.__.' 
  //    [__|___      _                        
  //     |_   _|    (_)                       
  //       | |      __   _ .--.  .---.        
  //       | |   _ [  | [ `.-. |/ /__\\       
  //      _| |__/ | | |  | | | || \__.,       
  //     |________|[___][___||__]'.__.' 
  ///
  /// Parse a full command line into statements split by operators.
  /// Returns:
  /// {
  ///   ok,
  ///   pipelineOrChain: [{ opBefore, raw, parsed }, ...],
  ///   data:[{key,value},...]
  /// }

  this.parseLine = function parseLine(line, dataIn) 
  {
    const data = this.normalizeData(dataIn);

    const lex = this.lexLine(line);
    if (!lex.ok) {
      return { ok: false, pipelineOrChain: [], data: dataToPairs(data), error: lex.error };
    }

    const segments = [];
    let currentWords = [];
    let opBefore = null;

    const flushSegment = () => 
    {
      // NOTE: we do NOT rebuild a statement string from tokens, because that would lose quotes.
      // `currentWords` already contains the shell-merged words (e.g. ["echo","Hello $name"]).
      if (!currentWords.length) return;

      const parsed = this._parseStatementWords(currentWords, data); // pass shared data object

      const updated = this.normalizeData(parsed.data);
      for (const [k, v] of Object.entries(updated)) data[k] = v;

      // Human-friendly only (original quotes are stripped by lexLine, so we reconstruct grouping)
      const raw = (typeof this._renderRawWords === "function") ? this._renderRawWords(currentWords) : currentWords.join(" ");
      segments.push({ opBefore, raw, parsed });
      currentWords = [];
    };

    for (const t of lex.tokens) 
    {
      if (t.type === "op") { flushSegment(); opBefore = t.value; }  // operator splits statements
      else currentWords.push(t.value);
    }
    flushSegment();

    const ok = segments.every(s => s.parsed && s.parsed.ok);

    return { ok, pipelineOrChain: segments, data: dataToPairs(data) };
  }

  // HELPER FUNCTIONS

  /// Convert plain object / Map / array-of-pairs into a mutable plain object
  this.normalizeData = function(input) 
  {
    if (!input) return {};
    if (input instanceof Map) {
      const o = {};
      for (const [k, v] of input.entries()) o[String(k)] = v;
      return o;
    }
    if (Array.isArray(input)) {
      // Accept [{key, value}] or [[k,v]] or [{k:v}]
      const o = {};
      for (const item of input) {
        if (Array.isArray(item) && item.length >= 2) o[String(item[0])] = item[1];
        else if (item && typeof item === "object")
        {
          if ("key" in item && "value" in item) o[String(item.key)] = item.value;
          else { for (const [k, v] of Object.entries(item)) o[String(k)] = v; }
        }
      }
      return o;
    }
    if (typeof input === "object") return { ...input };
    return {};
  }

  function dataToPairs(obj)
  {
    return Object.entries(obj).map(([key, value]) => ({ key, value }));
  }
}









//        _____   ______     ___   ____  _____                               
//       |_   _|.' ____ \  .'   `.|_   \|_   _|                              
//         | |  | (___ \_|/  .-.  \ |   \ | |                                
//     _   | |   _.____`. | |   | | | |\ \| |                                
//    | |__' |  | \____) |\  `-'  /_| |_\   |_                               
//    `.____.'   \______.' `.___.'|_____|\____|       _    _                 
//     (_)          / |_                             / |_ (_)                
//     __   _ .--. `| |-'.---.  _ .--.  ,--.   .---.`| |-'__  _   __  .---.  
//    [  | [ `.-. | | | / /__\\[ `/'`\]`'_\ : / /'`\]| | [  |[ \ [  ]/ /__\\ 
//     | |  | | | | | |,| \__., | |    // | |,| \__. | |, | | \ \/ / | \__., 
//    [___][___||__]\__/ '.__.'[___]   \'-;__/'.___.'\__/[___] \__/   '.__.'


/**
 * Make a JSON string pretty and interactive by showing boundary character [] {} pairs.
 *
 * @param {string} jsonStr - JSON string input (can be minified or pretty).
 * @param {Object|Array} boundaryStyles - e.g. { "{}":"color:#0f0;font-weight:800", "[]":"color:#f0f;font-weight:800" }
 *                                      If you pass an array, it should be like:
 *                                      [ ["{}", "color:#0f0"], ["[]", "color:#f0f"] ]
 * @param {HTMLElement} mountEl - where to render
 * @param {number} [indent=2] - pretty-print indent
 * @returns {HTMLElement} root element
 */
function makeInteractiveJson(jsonStr, boundaryStyles, mountEl, indent = 2) 
{
  if (!mountEl) throw new Error("mountEl is required");

  // Normalize boundaryStyles into an object map: pairKey -> styleString
  const styleMap = Array.isArray(boundaryStyles)
    ? Object.fromEntries(boundaryStyles)
    : (boundaryStyles || {});

  // Build open/close lookup maps: char -> pairKey
  const openToKey = {};
  const closeToKey = {};
  for (const pairKey of Object.keys(styleMap)) {
    if (typeof pairKey !== "string" || pairKey.length !== 2) continue;
    const open = pairKey[0];
    const close = pairKey[1];
    openToKey[open] = pairKey;
    closeToKey[close] = pairKey;
  }

  // Pretty-print the JSON for readability and stable bracket pairing
  let pretty;
  try 
  {
    const obj = JSON.parse(jsonStr);
    pretty = prettyJsonAllman(obj,2);
    //pretty = JSON.stringify(obj, null, indent);

  } 
  catch (e) 
  {
    // If invalid JSON, still render raw text without pairing logic
    const fallback = document.createElement("pre");
    fallback.className = "json-view";
    fallback.textContent = jsonStr;
    mountEl.replaceChildren(fallback);
    return fallback;
  }

  const root = document.createElement("pre");
  root.className = "json-view";

  // Pairing state: stacks per pairKey, because you might use multiple boundary types
  const stacks = {}; // pairKey -> [{ id, openSpan }]
  let nextPairId = 1;

  const frag = document.createDocumentFragment();

  // Helper to append normal text char safely (as text node)
  function appendTextChar(ch) {
    frag.appendChild(document.createTextNode(ch));
  }

  // Helper to append a boundary span
  function appendBoundarySpan(ch, pairKey, pairId) {
    const sp = document.createElement("span");
    sp.className = "json-boundary";
    sp.textContent = ch;
    sp.dataset.pair = String(pairId);
    if (styleMap[pairKey]) sp.setAttribute("style", styleMap[pairKey]);
    frag.appendChild(sp);
    return sp;
  }

  // Scan pretty JSON string and wrap boundary chars
  for (let i = 0; i < pretty.length; i++) {
    const ch = pretty[i];

    // Opening boundary?
    if (openToKey[ch]) {
      const pairKey = openToKey[ch];
      const pairId = nextPairId++;

      const openSpan = appendBoundarySpan(ch, pairKey, pairId);

      if (!stacks[pairKey]) stacks[pairKey] = [];
      stacks[pairKey].push({ id: pairId, openSpan });
      continue;
    }

    // Closing boundary?
    if (closeToKey[ch]) {
      const pairKey = closeToKey[ch];

      // Pop the most recent opening of the same type
      const stack = stacks[pairKey];
      if (stack && stack.length) {
        const { id: pairId } = stack.pop();
        appendBoundarySpan(ch, pairKey, pairId);
      } else {
        // Unmatched close: render as plain text
        appendTextChar(ch);
      }
      continue;
    }

    // Otherwise normal character
    appendTextChar(ch);
  }

  root.appendChild(frag);
  mountEl.replaceChildren(root);

  // Event delegation for hover highlighting
  let activePair = null;

  function setActive(pairId) {
    if (activePair === pairId) return;
    clearActive();
    activePair = pairId;
    root.querySelectorAll(`.json-boundary[data-pair="${CSS.escape(pairId)}"]`)
      .forEach(el => el.classList.add("active"));
  }

  function clearActive() {
    if (activePair == null) return;
    root.querySelectorAll(`.json-boundary[data-pair="${CSS.escape(activePair)}"]`)
      .forEach(el => el.classList.remove("active"));
    activePair = null;
  }

  root.addEventListener("mousemove", (e) => {
    const b = e.target.closest(".json-boundary");
    if (!b || !root.contains(b)) {
      clearActive();
      return;
    }
    setActive(b.dataset.pair);
  });

  root.addEventListener("mouseleave", clearActive);

  return root;
}

function prettyJsonAllman(value, indent = 2) {
  // Normalize to an object/array first
  const obj = (typeof value === "string") ? JSON.parse(value) : value;

  // Start from standard pretty JSON
  let s = JSON.stringify(obj, null, indent);

  // 1) Move `: {` and `: [` to the next line, aligned to the property's indentation.
  //    Example: '      "parsed": {'  ->  '      "parsed":\n      {'
  //    Also handles '...": {}' and '...": []'
  s = s.replace(
    /^(\s*)"([^"]+)"\s*:\s*([{\[])([}\]])?\s*(,?)\s*$/gm,
    (m, ws, key, open, maybeClose, comma) => {
      // Case: inline empty {} or [] on same line
      if (maybeClose) {
        return `${ws}"${key}":\n${ws}${open}\n${ws}${" ".repeat(indent)}\n${ws}${maybeClose}${comma}`;
      }
      // Case: normal `: {` or `: [`
      return `${ws}"${key}":\n${ws}${open}`;
    }
  );

  // 2) Move `: null/true/false/number/string`? No — leave primitives as-is.
  // 3) Optional: Move `{` / `[` that follow `: ` but are not at end-of-line (rare in JSON.stringify output).

  return s;
}

var oCMD = new CMD();