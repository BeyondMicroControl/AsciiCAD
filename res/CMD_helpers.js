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

    // CADScript block mode: if first word is CADScript and the next token begins with "{ ... }",
    // then everything inside the brace block is treated literally as ONE argument token.
    // This prevents operators like ';' inside the block from splitting statements.
    let cadScriptSeen = false;
    let scriptMode = false;
    let braceDepth = 0;
    let scriptInSingle = false;
    let scriptInDouble = false;
    let scriptEscape = false;
const pushBuf = () => {
      if (buf.length) {
        tokens.push({ type: "word", value: buf });
        // Detect leading CADScript command (first word)
        if (tokens.length === 1 && tokens[0].type === "word" && tokens[0].value === "CADScript") {
          cadScriptSeen = true;
        }
        buf = "";
      }
    };

    const pushOp = (op) => tokens.push({ type: "op", value: op });

    for (let i = 0; i < line.length; i++) 
    {
      const ch = line[i];

      // If we're inside a CADScript { ... } block, treat content literally.
      if (scriptMode)
      {
        // Keep escapes and quotes as characters, but track them so braces in strings don't end the block.
        if (scriptEscape) { buf += ch; scriptEscape = false; continue; }
        if (ch === "\\") { buf += ch; scriptEscape = true; continue; }

        if (!scriptInDouble && ch === "'") { buf += ch; scriptInSingle = !scriptInSingle; continue; }
        if (!scriptInSingle && ch === '"') { buf += ch; scriptInDouble = !scriptInDouble; continue; }

        if (!scriptInSingle && !scriptInDouble)
        {
          if (ch === "{") { braceDepth++; buf += ch; continue; }
          if (ch === "}") {
            braceDepth--;
            buf += ch;
            if (braceDepth <= 0) { scriptMode = false; pushBuf(); }
            continue;
          }
        }

        buf += ch;
        continue;
      }

      if (escape) { buf += ch; escape = false; continue; }   // Keep escaped char literally (typical shell-ish behavior)
      if (!inSingle && ch === "\\") { escape = true; continue; }
      // Comments: # starts a comment only when not in quotes and at token boundary-ish
      if (!inSingle && !inDouble && ch === "#") { break; }     // discard rest of line
      if (!inDouble && ch === "'" ) { inSingle = !inSingle; continue; }
      if (!inSingle && ch === '"') { inDouble = !inDouble; continue; }

      if (!inSingle && !inDouble)
      {
        // Start CADScript literal block as a single token: { ... }
        if (cadScriptSeen && ch === "{")
        {
          pushBuf();               // ensure we're at token boundary
          scriptMode = true;
          braceDepth = 1;
          scriptInSingle = false;
          scriptInDouble = false;
          scriptEscape = false;
          buf += ch;               // begin literal token with '{'
          continue;
        }

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
          const escForDq = (s) => String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
          return words.map(w => {
            const s = String(w);
            return needsQuotes(s) ? `"${escForDq(s)}"` : s;
          }).join(" ");
        }

          // Public alias (handy if you export a reduced API)
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





this.compile = function(parsedJson, initialCtx) {
  // create compiler instance once (cache it)
  if (!this._compiler) this._compiler = new CMDCompiler(/* optional opts */);
  return this._compiler.compile(parsedJson, initialCtx);
};




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



////////////////////////////////////////////////////////////////////////////////////////////




/* CMD_compiler.js
 *
 * Compiler stage for CMD parser JSON:
 * - groups pipeline statements
 * - validates operator tokens
 * - resolves env assignments and $var expansion (keeps raw + resolved)
 * - emits a compiled execution plan (no execution)
 */

function CMDCompiler(opts) 
{
  opts = opts || {};

  // Operator tokens we recognize (from your parser)
  const OP_TOKENS = opts.opTokens || [";", "&&", "||", "|", "&", null];

  // Command “token reference table” (minimal, extend as you like)
  // If a command is not in this table, we still allow it by default unless strict=true.
  const commandTable = opts.commandTable || {
    echo: { token: "CMD", resolveArgs: true },
    CADScript: { token: "CADScript", resolveArgs: false }
  };

  const strict = !!opts.strict;

  // ---------- helpers ----------
  function pairsToObj(pairs) {
    const o = {};
    if (!pairs) return o;
    for (let i = 0; i < pairs.length; i++) {
      const p = pairs[i];
      if (p && typeof p.key === "string") o[p.key] = p.value;
    }
    return o;
  }

  function objToPairs(o) {
    return Object.keys(o).map(k => ({ key: k, value: o[k] }));
  }

  function isValidOp(op) {
    for (let i = 0; i < OP_TOKENS.length; i++) if (OP_TOKENS[i] === op) return true;
    return false;
  }

  // Basic shell-ish identifier
  function isIdent(s) {
    return /^[A-Za-z_][A-Za-z0-9_]*$/.test(s);
  }

  // Detect assignment statement, based on parsed.name or raw.
  // Your parser makes name be first word; for `name="Sylvia"` it becomes `name=Sylvia`
  function parseAssignmentFromStatement(stmt) {
    // Prefer parsed.name (most stable)
    const s = (stmt && stmt.parsed && stmt.parsed.name) ? String(stmt.parsed.name) : "";
    // Accept NAME=VALUE (VALUE may be empty)
    const eq = s.indexOf("=");
    if (eq <= 0) return null;

    const key = s.slice(0, eq);
    const value = s.slice(eq + 1);

    if (!isIdent(key)) return null;

    // In shell, assignments can appear before a command, but for now
    // we treat a statement whose "name" contains '=' and has no args as an assignment.
    const args = (stmt.parsed && Array.isArray(stmt.parsed.arguments)) ? stmt.parsed.arguments : [];
    if (args.length !== 0) return null;

    return { key, valueRaw: value };
  }

  // Expand $var occurrences using env (very small subset, by design)
  // - supports $name and ${name}
  // - leaves unknown variables as "" (shell-ish)
  function expandVars(rawStr, envObj) {
    const s = String(rawStr);

    // ${name}
    let out = s.replace(/\$\{([A-Za-z_][A-Za-z0-9_]*)\}/g, function(_, name) {
      return (envObj && envObj[name] != null) ? String(envObj[name]) : "";
    });

    // $name
    out = out.replace(/\$([A-Za-z_][A-Za-z0-9_]*)/g, function(_, name) {
      return (envObj && envObj[name] != null) ? String(envObj[name]) : "";
    });

    return out;
  }

  // Extract positional strings from parsed.arguments array:
  // your parser uses either:
  //   - strings for positionals
  //   - objects like {opt:true} or {opt:"value"} for options
  function splitArgs(parsedArgs) {
    const options = [];     // array of {key,value}
    const positionals = []; // array of strings (raw)
    for (let i = 0; i < parsedArgs.length; i++) {
      const a = parsedArgs[i];
      if (typeof a === "string") {
        positionals.push(a);
      } else if (a && typeof a === "object" && !Array.isArray(a)) {
        // take first key
        const ks = Object.keys(a);
        if (ks.length) options.push({ key: ks[0], value: a[ks[0]] });
      } else {
        // ignore unknown shapes, but keep raw string form if possible
        positionals.push(String(a));
      }
    }
    return { options, positionals };
  }

  // Lookup command metadata (token, resolveArgs flag)
  function getCommandMeta(name) {
    if (commandTable[name]) return commandTable[name];
    // default behavior: unknown commands still behave like CMD commands
    return { token: "CMD", resolveArgs: true };
  }

  // ---------- compile ----------
  this.compile = function(parsedJson, initialCtx) {
    const errors = [];
    const warnings = [];

    if (!parsedJson || !parsedJson.ok || !Array.isArray(parsedJson.pipelineOrChain)) {
      return { ok: false, errors: ["Input JSON missing or parser ok=false"], plan: null };
    }

    const ctx = initialCtx || {};
    const env = pairsToObj(ctx.envPairs || parsedJson.data || []); // seed from parser data pairs
    const devices = ctx.devices || {}; // later: stdout devices, files, etc.

    // Step 1: validate operators + build pipeline groups
    const groups = [];
    let currentGroup = null;

    function startGroup(connectorFromPrev) {
      currentGroup = {
        connectorFromPrev: connectorFromPrev || null, // null, ;, &&, ||, &, etc.
        pipeline: [] // compiled statements
      };
      groups.push(currentGroup);
    }

    for (let i = 0; i < parsedJson.pipelineOrChain.length; i++) {
      const node = parsedJson.pipelineOrChain[i];

      if (!isValidOp(node.opBefore)) {
        errors.push("Invalid operator token opBefore=" + String(node.opBefore) + " at index " + i);
      }

      // Determine whether this node starts a new pipeline group:
      // - first node starts a group
      // - nodes with opBefore === '|' continue current group
      // - otherwise start a new group with connectorFromPrev = opBefore
      if (i === 0) {
        startGroup(null);
      } else if (node.opBefore !== "|") {
        startGroup(node.opBefore);
      } else if (!currentGroup) {
        startGroup(null);
      }

      // Compile this statement
      const compiledStmt = compileStatement(node, env, devices, errors, warnings);
      currentGroup.pipeline.push(compiledStmt);

      // Apply env updates immediately (compiler-side semantics)
      if (compiledStmt.kind === "assign" && compiledStmt.envDelta) {
        env[compiledStmt.envDelta.key] = compiledStmt.envDelta.value;
      }
    }

    // Step 2: attach data + basic I/O wiring info (no execution)
    // For each pipeline group, define how stdin/stdout conceptually flows.
    for (let g = 0; g < groups.length; g++) {
      const grp = groups[g];

      // conceptual input: from previous group unless first
      grp.input = { source: (g === 0) ? "initial" : "prevGroup" };
      grp.output = { sink: (g === groups.length - 1) ? "device:stdout" : "nextGroup? (depends on connectors)" };

      // pipeline internal wiring
      for (let j = 0; j < grp.pipeline.length; j++) {
        const s = grp.pipeline[j];
        s.io = s.io || {};
        s.io.stdin = (j === 0) ? { source: "group.stdin" } : { source: "pipe", from: j - 1 };
        s.io.stdout = (j === grp.pipeline.length - 1) ? { sink: "group.stdout" } : { sink: "pipe", to: j + 1 };
      }
    }

    const ok = errors.length === 0;
    return {
      ok,
      errors,
      warnings,
      env: objToPairs(env),
      plan: {
        groups
      }
    };
  };

  function compileStatement(node, env, devices, errors, warnings) {
    const parsed = node.parsed || {};
    const name = String(parsed.name || "");
    const raw = String(node.raw || "");

    // 1) assignment?
    const asn = parseAssignmentFromStatement(node);
    if (asn) {
      // Resolve assignment value (we keep both)
      const valueResolved = expandVars(asn.valueRaw, env);

      return {
        kind: "assign",
        token: "ASSIGN",
        raw: raw,                 // as displayed by parser
        envDelta: {
          key: asn.key,
          rawValue: asn.valueRaw,
          value: valueResolved
        },
        // Keep for uniformity
        name: asn.key + "=",
        arguments: {
          raw: [asn.valueRaw],
          resolved: [valueResolved]
        }
      };
    }

    // 2) command
    const meta = getCommandMeta(name);

    // validate command token/table if strict
    if (strict && !commandTable[name]) {
      errors.push("Unknown command: " + name);
    }

    const parsedArgs = Array.isArray(parsed.arguments) ? parsed.arguments : [];
    const split = splitArgs(parsedArgs);

    // Resolve positionals unless this command opts out (CADScript)
    const posRaw = split.positionals.slice();
    const posResolved = meta.resolveArgs
      ? posRaw.map(s => expandVars(s, env))
      : posRaw.slice(); // keep raw, do not resolve

    return {
      kind: "command",
      token: meta.token || "CMD",
      resolveArgs: !!meta.resolveArgs,
      name: name,
      raw: raw, // display-raw (not guaranteed exact original)
      options: split.options, // [{key,value},...]
      arguments: {
        raw: posRaw,
        resolved: posResolved
      },
      // This is where, later, execution would attach runtime stdout/stderr/code
      output: {
        to: "auto" // will be wired by pipeline grouping
      }
    };
  }
}







////////////////////////////////////////////////////////////////////////////////////////////









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
  * @param {HTMLElement} mountEl - where to get JSON input and where to render output
 * @param {Object|Array} boundaryStyles - e.g. { "{}":"color:#0f0;font-weight:800", "[]":"color:#f0f;font-weight:800" }
 *                                      If you pass an array, it should be like:
 *                                      [ ["{}", "color:#0f0"], ["[]", "color:#f0f"] ]
 * @param {number} [indent=2] - pretty-print indent
 * @returns {HTMLElement} root element
 */
JSON.prettify = function makeInteractiveJson(mountEl, boundaryStyles, indent = 2) 
{
  if (!mountEl) throw new Error("mountEl is required");
  var jsonStr = mountEl.textContent;

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