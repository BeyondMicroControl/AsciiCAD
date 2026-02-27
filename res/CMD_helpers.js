//       ______  ____    ____  ______    
//     .' ___  ||_   \  /   _||_   _ '.  
//    / .'   \_|  |   \/   |    | | '. \ 
//    | |         | |\  /| |    | |  | | 
//    \ '.___.'\ _| |_\/_| |_  _| |_.' / 
//     '.____ .'|_____||_____||______.'  
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
  //    [___]'.__.'[__]'\_]             
  //      _____      _                  
  //     |_   _|    (_)                 
  //       | |      __   _ .--.  .---.  
  //       | |   _ [  | [ '.-. |/ /__\\ 
  //      _| |__/ | | |  | | | || \__., 
  //     |________|[___][___||__]'.__.'       
  //                                   
  /// Lex line into tokens: words + operators ; && || | &

  /// Internal: render a "raw" string that is human-friendly and keeps grouping visible.
  /// Since lexLine strips quote characters, this reconstructs a safe representation:
  /// - wraps args containing whitespace (or empty) in double quotes
  /// - escapes backslash and double quote inside those quoted args
  this._renderRawWords = function(words)
  {
    if (!Array.isArray(words)) return "";
    const needsQuotes = (s) => (s === "") || /\s/.test(s);
    const escForDq = (s) => String(s).replace(/\\/g, "\\\\").replace(/\"/g, '\\"');
    return words.map(w => {
      const s = String(w);
      return needsQuotes(s) ? ('"' + escForDq(s) + '"') : s;
    }).join(" ");
  };

  // Public alias (handy if you export a reduced API)
  this.renderRawWords = this._renderRawWords;

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
  //    [ '/''\ \''_\ : [ '/''\]( ('\]/ /__\\                              
  //     | \__/ |// | |, | |     ''.'.| \__.,                              
  //     | ;.__/ \'-;__/[___]   [\__) )'.__.'                              
  //    [__|____    _          _                                      _    
  //    .' ____ \  / |_       / |_                                   / |_  
  //    | (___ \_|'| |-',--. '| |-'.---.  _ .--..--.  .---.  _ .--. '| |-' 
  //     _.____'.  | | ''_\ : | | / /__\\[ '.-. .-. |/ /__\\[ '.-. | | |   
  //    | \____) | | |,// | |,| |,| \__., | | | | | || \__., | | | | | |,  
  //     \______.' \__/\'-;__/\__/ '.__.'[___||__||__]'.__.'[___||__]\__/ 
  //
  /// Parse a single statement (no top-level operators) into:
  /// { ok, name, arguments:[ {opt:value}, "positional", ... ], data:[{key,value},...] }
  /// Internal: parse a statement from an already-tokenized word array (quotes already handled by lexLine).
  /// 'words' must be an array like ["cmd","arg1","arg 2",...]
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
  //    [ '/''\ \''_\ : [ '/''\]( ('\]/ /__\\ 
  //     | \__/ |// | |, | |     ''.'.| \__., 
  //     | ;.__/ \'-;__/[___]   [\__) )'.__.' 
  //    [__|___      _                        
  //     |_   _|    (_)                       
  //       | |      __   _ .--.  .---.        
  //       | |   _ [  | [ '.-. |/ /__\\       
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
      // 'currentWords' already contains the shell-merged words (e.g. ["echo","Hello $name"]).
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


  this.compile = function(parsedJson, initialCtx) 
  {
    // create compiler instance once (cache it)
    if (!this._compiler) this._compiler = new CMDCompiler(/* optional opts */);
    return this._compiler.compile(parsedJson, initialCtx);
  };


//       ______  ____    ____  ______        ______                                _   __                 
//     .' ___  ||_   \  /   _||_   _ '.    .' ___  |                              (_) [  |                
//    / .'   \_|  |   \/   |    | | '. \  / .'   \_|  .--.   _ .--..--.  _ .--.   __   | | .---.  _ .--.  
//    | |         | |\  /| |    | |  | |  | |       / .''\ \[ '.-. .-. |[ '/''\ \[  |  | |/ /__\\[ '/''\] 
//    \ '.___.'\ _| |_\/_| |_  _| |_.' /  \ '.___.'\| \__. | | | | | | | | \__/ | | |  | || \__., | |     
//     '.____ .'|_____||_____||______.'    '.____ .' '.__.' [___||__||__]| ;.__/ [___][___]'.__.'[___]    
//                                                                      [__|

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
    // Your parser makes name be first word; for 'name="Sylvia"' it becomes 'name=Sylvia'
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


//       ______  ____    ____  ______     _______                                             
//     .' ___  ||_   \  /   _||_   _ `.  |_   __ \                                            
//    / .'   \_|  |   \/   |    | | `. \   | |__) |  __   _   _ .--.   _ .--.  .---.  _ .--.  
//    | |         | |\  /| |    | |  | |   |  __ /  [  | | | [ `.-. | [ `.-. |/ /__\\[ `/'`\] 
//    \ `.___.'\ _| |_\/_| |_  _| |_.' /  _| |  \ \_ | \_/ |, | | | |  | | | || \__., | |     
//     `.____ .'|_____||_____||______.'  |____| |___|'.__.'_/[___||__][___||__]'.__.'[___]    

// WORKER THREAD FUNCTIONS

  // Keep instance context inside Worker callbacks (because event listeners lose "this")
  var cmd = this;

  // Extract cloneable "constant" values from a container object.
  // We only snapshot these into the Worker; methods are always executed on main thread.
  cmd._extractConsts = function(obj, prefixes, explicitKeys, exposeAllNonFunctions)
  {
    prefixes = Array.isArray(prefixes) ? prefixes : (prefixes ? [prefixes] : []);
    explicitKeys = Array.isArray(explicitKeys) ? explicitKeys : null;

    var out = Object.create(null);

    function isCloneable(v)
    {
      if (v == null) return true;
      if (typeof v === "function") return false;
      try {
        // structuredClone is available in modern browsers + Workers
        if (typeof structuredClone === "function") { structuredClone(v); return true; }
      } catch(e) { /* fallthrough */ }

      // Fallback: JSON stringify test (won't keep undefined, but ok for constants)
      try { JSON.stringify(v); return true; }
      catch(e2) { return false; }
    }

    function shouldTakeKey(k)
    {
      if (explicitKeys) return explicitKeys.indexOf(k) >= 0;
      if (exposeAllNonFunctions) return true;
      for (var i = 0; i < prefixes.length; i++) {
        if (String(k).indexOf(prefixes[i]) === 0) return true;
      }
      return false;
    }

    for (var k in obj)
    {
      if (!shouldTakeKey(k)) continue;
      var v = obj[k];
      if (!isCloneable(v)) continue;
      out[k] = v;
    }
    return out;
  };

  // Create a generic "CMD Worker" that can call back into multiple containers.
  //
  // bindings: [
  //   { name:"oASC", obj:oASC, constPrefixes:["BOX_"], aliases:["ASC"] },
  //   { name:"oCOM", obj:oCOM }
  // ]
  //
  // Rules:
  // - Only the *default* binding is "proxied" for unqualified calls (freeform(...)).
  // - Other bindings must be used by name (oCOM.isDoubleWidthChar('+')).
  // - Constants are snapshotted into the worker (cloneable values only).
  this.createCMDWorker = function(bindings, opts)
  {
    opts = opts || {};
    var allowAliases = !!opts.allowAliases;
    if (!Array.isArray(bindings) || bindings.length === 0)
      throw new Error("createCMDWorker: bindings array required");

    cmd._bindings   = Object.create(null);
    cmd._aliasMap   = Object.create(null);
    cmd._defaultObj = String(opts.defaultObj || bindings[0].name || "oASC");

    // Optional alias map provided by caller (disabled by default)
    if (allowAliases && opts.aliasMap) {
      for (var a in opts.aliasMap) cmd._aliasMap[a] = String(opts.aliasMap[a]);
    }

    // Prepare init payload (const snapshots) + store main-thread container refs
    var initBindings = [];
    for (var i = 0; i < bindings.length; i++)
    {
      var b = bindings[i];
      if (!b || !b.name || !b.obj) continue;

      var name = String(b.name);
      cmd._bindings[name] = b.obj;

      var consts = cmd._extractConsts(
        b.obj,
        b.constPrefixes || b.exposePrefixes || [],
        b.constKeys || null,
        !!b.exposeAllNonFunctions
      );

      initBindings.push({ name: name, consts: consts });

      // Optional aliases (disabled by default to avoid confusing ASC vs oASC)
      if (allowAliases) {
        var aliases = b.aliases || [];
        if (Array.isArray(aliases)) {
          for (var j = 0; j < aliases.length; j++) {
            cmd._aliasMap[String(aliases[j])] = name;
          }
        }
      }
    }

    // Build & start the Worker
    cmd._worker = cmd._makeCMDWorker();

    cmd._worker.addEventListener("message", cmd.onWorkerMessage);

    // Better diagnostics if the Worker fails to parse/execute (often shows as "Script error")
    cmd._worker.addEventListener("error", function(e) {
      console.error("[main] worker error event:", {
        message:  e && e.message,
        filename: e && e.filename,
        lineno:   e && e.lineno,
        colno:    e && e.colno
      });
    });

    cmd._worker.addEventListener("messageerror", function(e) {
      console.error("[main] worker messageerror:", e);
    });

    cmd._worker.postMessage({
      type: "init",
      bindings: initBindings,
      aliasMap: cmd._aliasMap,
      defaultObj: cmd._defaultObj
    });

    return cmd._worker;
  };

  // Worker source (no template literals/backticks to avoid escaping traps)
  cmd._makeCMDWorker = function()
  {
    var src = [
      "let BINDINGS = Object.create(null);       // name -> { consts }",
      "let ALIAS = Object.create(null);          // alias -> name",
      "let DEFAULT_OBJ = null;",
      "let nextId = 1;",
      "const pending = new Map();",
      "",

      "// --- add near top of worker src (after pending Map is fine) ---",
      "let SEQ = Promise.resolve();",

      "function enqueue(task) {",
      "  const p = SEQ.then(task, task);",
      "  // keep SEQ alive even if a task fails",
      "  SEQ = p.catch(() => {});",
      "  return p;",
      "}",


      "function safeLogArgs(args) {",
      "  const out = [];",
      "  for (let i = 0; i < args.length; i++) {",
      "    const v = args[i];",
      "    if (typeof v === 'function') out.push('[Function]');",
      "    else out.push(v);",
      "  }",
      "  return out;",
      "}",
      "",
      "function log() {",
      "  postMessage({ type: 'log', args: safeLogArgs(arguments) });",
      "}",
      "",
      "function ensureCloneableArgs(objName, fnName, args) {",
      "  for (let i = 0; i < args.length; i++) {",
      "    const v = args[i];",
      "    if (typeof v === 'function') {",
      "      throw new Error('Argument ' + i + ' to ' + objName + '.' + fnName + '() is a function. ' +",
      "                      'Likely a misspelled constant (e.g. BOX_DOUUBLE).');",
      "    }",
      "  }",
      "}",
      "",

      "// Move/keep your existing await$ BEFORE callMainSeq uses it.",
      "// (You already have await$ in the worker.) :contentReference[oaicite:4]{index=4}",
      "",
      "// --- queued + arg-resolving RPC ---",
      "function callMainSeq(objName, fnName, args) {",
      "  return enqueue(async () => {",
      "    const resolvedArgs = await await$(args);",

      //"    // format AFTER promise resolution",
      //"    if (objName === \"oTERM\" && (fnName === \"output\" || fnName === \"print\")) {",
      //"      resolvedArgs[0] = formatForOutput(resolvedArgs[0]);",
      //"    }",

      "    ensureCloneableArgs(objName, fnName, resolvedArgs);",

      "    const id = nextId++;",
      "    postMessage({ type: \"call\", id, obj: objName, name: fnName, args: resolvedArgs });",

      "    return await new Promise((resolve, reject) => pending.set(id, { resolve, reject }));",
      "  });",
      "}",



      //"function formatForOutput(v) {",
      //"  // already HTML/string: keep as-is",
      //"  if (typeof v === \"string\") return v;",

      //"  // null/undefined",
      //"  if (v == null) return String(v); // \"null\" / \"undefined\"",

      //"  // Error objects",
      //"  if (v instanceof Error) {",
      //"    const msg = v.stack || v.message || String(v);",
      //"    return \"<pre>\" + escapeHtml(msg) + \"</pre>\";",
      //"  }",

      //"  // Try JSON pretty print for objects/arrays",
      //"  if (typeof v === \"object\") {",
      //"    try {",
      //"      return \"<pre>\" + escapeHtml(JSON.stringify(v, null, 2)) + \"</pre>\";",
      //"    } catch (e) {",
      //"      // circular or non-serializable",
      //"      return \"<pre>\" + escapeHtml(String(v)) + \"</pre>\";",
      //"    }",
      //"  }",

      //"  // numbers, booleans, symbols, functions",
      //"  return \"<pre>\" + escapeHtml(String(v)) + \"</pre>\";",
      //"}",

      //"function escapeHtml(s) {",
      //"  return String(s).replace(/[&<>\"']/g, (ch) => {",
      //"    switch (ch) {",
      //"      case \"&\": return \"&amp;\";",
      //"      case \"<\": return \"&lt;\";",
      //"      case \">\": return \"&gt;\";",
      //"      case '\"': return \"&quot;\";",
      //"      case \"'\": return \"&#39;\";",
      //"      default: return ch;",
      //"    }",
      //"  });",
      //"}",


      "function makeContainerProxy(objName) {",
      "  return new Proxy({}, {",
      "    get(_t, prop) {",
      "      const p = String(prop);",
      "      const b = BINDINGS[objName];",
      "      if (b && b.consts && (p in b.consts)) return b.consts[p];",
      "",
      "      // Optional: special-case output/print to pretty-print objects",
      "      if (objName === \"oTERM\" && (p === \"output\" || p === \"print\")) {",
      "        return (...args) => callMainSeq(\"oTERM\", p, args);",
      "      }",
      "",
      "      return (...args) => callMainSeq(objName, p, args);",
      "    }",
      "  });",
      "}",

      "",
      "function buildScope(defaultObj, scopeObj) {",
      "  DEFAULT_OBJ = defaultObj || DEFAULT_OBJ;",
      "",
      "  // Base API objects (oASC, oCOM, ...)",
      "  const api = Object.create(null);",
      "  const allowed = Array.isArray(scopeObj) ? scopeObj.map(String) : Object.keys(BINDINGS);",
      "  if (DEFAULT_OBJ && allowed.indexOf(DEFAULT_OBJ) < 0) allowed.push(DEFAULT_OBJ);",
      "  for (let i=0;i<allowed.length;i++){ const name=allowed[i]; if (name in BINDINGS) api[name] = makeContainerProxy(name); }",
      "  for (const a in ALIAS) { const n = ALIAS[a]; if (api[n]) api[a] = api[n]; }",
      "",
      "  return new Proxy(api, {",
      "    has() { return true; },",
      "    get(target, prop) {",
      "      if (prop === Symbol.unscopables) return undefined;",
      "      if (prop in target) return target[prop];",
      "",
      "      // bare constants resolve against the *default* container only",
      "      const p = String(prop);",
      "      const b = DEFAULT_OBJ ? BINDINGS[DEFAULT_OBJ] : null;",
      "      if (b && b.consts && (p in b.consts)) return b.consts[p];",
      "",
      "      // allow a small safe standard library",
      "      if (p === 'Math') return Math;",
      "      if (p === 'JSON') return JSON;",
      "      if (p === 'Number') return Number;",
      "      if (p === 'String') return String;",
      "      if (p === 'await$') return await$;",
      "      if (p === 'print$') return print$;",
      "",
      "      // Do not allow confusing container names like ASC (use oASC. or unqualified calls)",
      "      if (p === 'ASC') { throw new ReferenceError('Unknown container: ASC (use oASC. or unqualified calls)'); }",
      "",
      "      // nicer error for BOX_* typos",
      "      if (p.indexOf('BOX_') === 0 && (!b || !b.consts || !(p in b.consts))) {",
      "        throw new ReferenceError('Unknown constant: ' + p + ' (check spelling, e.g. BOX_DOUBLE)');",
      "      }",
      "",
      "      // unqualified calls route to the default container",
      "      return (...args) => callMainSeq(DEFAULT_OBJ, p, args);",
      "    }",
      "  });",
      "}",
      "",

      "function escapeHTML_local(str) {",
      "  return String(str)",
      "    .replaceAll(\"&\",\"&amp;\")",
      "    .replaceAll(\"<\",\"&lt;\")",
      "    .replaceAll(\">\",\"&gt;\")",
      "    .replaceAll('\"',\"&quot;\")",
      "    .replaceAll(\"'\",\"&#039;\");",
      "}",

      "// Recursively resolve Promises; preserves arrays/objects.",
      "// (Also works if input is not a Promise.)",
      "async function await$(v) {",
      "  v = await v;",

      "  if (Array.isArray(v)) {",
      "    const out = [];",
      "    for (let i=0;i<v.length;i++) out.push(await await$(v[i]));",
      "    return out;",
      "  }",
      "  if (v && typeof v === \"object\") {",
      "    // don't try to expand DOM nodes etc; keep plain objects",
      "    const out = {};",
      "    for (const k of Object.keys(v)) out[k] = await await$(v[k]);",
      "    return out;",
      "  }",
      "  return v;",
      "}",

      "// Print helper: prints value or promise; if object => JSON.",
      "async function print$(v) {",
      "  const x = await await$(v);",
      "  let s = x;",
      "  if (x && typeof x === \"object\")",
      "     s = JSON.stringify(x, null, 2).replace(/\\{\\n\\s+\"r\":\\s+(\\d+),\\n\\s+\"c\":\\s+(\\d+)\\n\\s+\}/g,'{\"r\":$1,\"c\":$2}\"');",
      "  return callMainSeq(\"oTERM\", \"output\", [\"<pre>\" + escapeHTML_local(s) + \"</pre>\"]);",
      "}"
      ,
      "function runInScope(code, defaultObj, scopeObj) {",
      "  // Allow '{ ... }' wrapper blocks",
      "  const t = String(code).trim();",
      "  if (t.length >= 2 && t.charAt(0) === '{' && t.charAt(t.length - 1) === '}') {",
      "    code = t.slice(1, -1);",
      "  }",
      "",
      "  const scope = buildScope(defaultObj, scopeObj);",
      "  const fn = new Function('scope', 'return (async function(){ with(scope){\\n' + code + '\\n} })();');",
      "  return fn(scope);",
      "}",
      "",
      "onmessage = async (e) => {",
      "  const msg = e.data;",
      "  if (!msg) return;",
      "",
      "  if (msg.type === 'init') {",
      "    BINDINGS = Object.create(null);",
      "    const list = Array.isArray(msg.bindings) ? msg.bindings : [];",
      "    for (let i = 0; i < list.length; i++) {",
      "      const it = list[i];",
      "      if (!it || !it.name) continue;",
      "      BINDINGS[String(it.name)] = { consts: it.consts || Object.create(null) };",
      "    }",
      "    ALIAS = msg.aliasMap || Object.create(null);",
      "    DEFAULT_OBJ = msg.defaultObj || (list[0] ? String(list[0].name) : null);",
      "    log('INIT bindings:', Object.keys(BINDINGS), 'default=', DEFAULT_OBJ);",
      "    return;",
      "  }",
      "",
      "  if (msg.type === 'ret') {",
      "    const p = pending.get(msg.id);",
      "    if (!p) return;",
      "    pending.delete(msg.id);",
      "    msg.ok ? p.resolve(msg.result) : p.reject(new Error(msg.error));",
      "    return;",
      "  }",
      "",
      "  if (msg.type === 'run') {",
      "  const runId = msg.runId;",
      "  const code = msg.code;",
      "  const def  = msg.defaultObj || DEFAULT_OBJ;",
      "  const scopeObj = msg.scopeObj || null;",
      "  log('RUN start', runId, 'default=' + def, code);",
      "  postMessage({ type: 'ack', runId: runId });",
      "  SEQ = Promise.resolve();           // reset per-run",
      "  try {",
      "    await runInScope(code, def, scopeObj);",
      "    await SEQ;                       // drain queued RPC calls",
      "    postMessage({ type: \"done\", runId });",
      "  } catch (err) {",
      "      postMessage({",
      "        type: 'error',",
      "        runId: runId,",
      "        error: { name: err && err.name, message: err && err.message, stack: err && err.stack }",
      "      });",
      "    }",
      "  }",
      "};"
    ].join("\n");

    var blob = new Blob([src], { type: "application/javascript" });
    return new Worker(URL.createObjectURL(blob));
  };

  // Run code in the already-created Worker.
  // opts.defaultObj can select which container is used for unqualified calls.
  this.runExternalScript = function(code, opts)
  {
    opts = opts || {};
    var worker = cmd._worker;
    if (!worker) {
      return Promise.reject({ name: 'Error', message: 'Worker not initialized. Call createCMDWorker() first.' });
    }

    return new Promise(function(resolve, reject) {
      var runId = Math.random().toString(16).slice(2);
      var settled = false;

      var timeoutMs = (opts.timeoutMs != null) ? Number(opts.timeoutMs) : 5000;
      if (!isFinite(timeoutMs) || timeoutMs <= 0) timeoutMs = 5000;

      // Fast failure: if the Worker never even ACKs the run request, it's usually not running.
      var ackWaitMs = (opts.ackWaitMs != null) ? Number(opts.ackWaitMs) : 500;
      if (!isFinite(ackWaitMs) || ackWaitMs <= 0) ackWaitMs = 500;
      var ackSeen = false;

      var timer = null;
      var ackTimer = null;

      function cleanup(onMsg, onErr, onMsgErr)
      {
        worker.removeEventListener('message', onMsg);
        worker.removeEventListener('error', onErr);
        worker.removeEventListener('messageerror', onMsgErr);
        if (timer != null) { clearTimeout(timer); timer = null; }
        if (ackTimer != null) { clearTimeout(ackTimer); ackTimer = null; }
      }

      function succeed(onMsg, onErr, onMsgErr)
      {
        if (settled) return;
        settled = true;
        cleanup(onMsg, onErr, onMsgErr);
        resolve();
      }

      function fail(err, onMsg, onErr, onMsgErr)
      {
        if (settled) return;
        settled = true;
        cleanup(onMsg, onErr, onMsgErr);
        reject(err);
      }

      function onMsg(e)
      {
        var msg = e.data;
        if (!msg || msg.runId !== runId) return;

        if (msg.type === 'ack') {
          ackSeen = true;
          if (ackTimer != null) { clearTimeout(ackTimer); ackTimer = null; }
          if (bDebug) console.log('[main] worker ack:', runId);
          return;
        }

        if (msg.type === 'done') {
          if (bDebug) console.log('[main] worker done:', runId);
          succeed(onMsg, onErr, onMsgErr);
          return;
        }

        if (msg.type === 'error') {
          console.error('[main] worker error:', msg.error);
          fail(msg.error, onMsg, onErr, onMsgErr);
          return;
        }
      }

      function onErr(e)
      {
        var err = {
          name: 'WorkerError',
          message: (e && e.message) ? String(e.message) : 'Worker error',
          filename: e && e.filename ? String(e.filename) : '',
          lineno: e && typeof e.lineno === 'number' ? e.lineno : 0,
          colno: e && typeof e.colno === 'number' ? e.colno : 0,
          runId: runId
        };
        console.error('[main] worker error event:', err);
        fail(err, onMsg, onErr, onMsgErr);
      }

      function onMsgErr(e)
      {
        var err = { name: 'MessageError', message: 'Worker messageerror', runId: runId };
        console.error('[main] worker messageerror:', e);
        fail(err, onMsg, onErr, onMsgErr);
      }

      worker.addEventListener('message', onMsg);
      worker.addEventListener('error', onErr);
      worker.addEventListener('messageerror', onMsgErr);

      ackTimer = setTimeout(function() {
        if (ackSeen) return;
        fail({ name: 'NoAckError', message: 'Worker did not ACK the run request.', runId: runId }, onMsg, onErr, onMsgErr);
      }, ackWaitMs);

      timer = setTimeout(function() {
        fail({ name: 'TimeoutError', message: 'Worker did not respond (no done/error).', runId: runId }, onMsg, onErr, onMsgErr);
      }, timeoutMs);

      if (bDebug) console.log('[main] sending script to worker:', String(code));

      try {
        worker.postMessage({
          type: 'run',
          runId: runId,
          code: String(code),
          defaultObj: String(opts.defaultObj || cmd._defaultObj),
          scopeObj: Array.isArray(opts.scopeObj) ? opts.scopeObj.map(String) : null
        });
      } catch (ex) {
        fail({ name: ex && ex.name ? String(ex.name) : 'Error', message: ex && ex.message ? String(ex.message) : String(ex), runId: runId }, onMsg, onErr, onMsgErr);
      }
    });
  };


  this.onWorkerMessage = function(e)
  {
    const msg = e.data;
    if (!msg) return;

    if (bDebug && msg.type === 'log') {
      console.log('[worker]', ...(msg.args || []));
      return;
    }

    // IMPORTANT: reply back to the *same* worker instance that asked.
    if (msg.type === 'call') {
      const w = (e && (e.currentTarget || e.target)) ? (e.currentTarget || e.target) : cmd._worker;
      handleWorkerCall(msg, w);
      return;
    }
  };

  function handleWorkerCall(msg, workerRef)
  {
    const id   = msg.id;
    const obj  = String(msg.obj || cmd._defaultObj);
    const name = String(msg.name);
    const args = msg.args || [];

    if (bDebug) console.log("[main] call from worker:", obj + "." + name, args);

    try {
      const target = cmd._bindings[obj];
      if (!target) throw new Error("No such container: " + obj);

      const fn = target[name];
      if (typeof fn !== "function") throw new Error("No such method: " + obj + "." + name);

      const result = fn.apply(target, args);
      workerRef.postMessage({ type: 'ret', id: id, ok: true, result: result });
    } catch (err) {
      try {
        workerRef.postMessage({
          type: 'ret',
          id: id,
          ok: false,
          error: String(err && err.message ? err.message : err)
        });
      } catch (postErr) {
        // If we can't even reply, at least log it so we don't fail silently.
        console.error('[main] failed to post ret to worker:', postErr);
      }
    }
  }


    // TODO : put this inline ?   first make sure CMD commands in the shape of serialised data
  this.CMDHelp = function()
  {
    oTERM.output(
      oCOM.escapeHTML("Terminal commands:\n" +
        "  <cmd> -h - detailed help\n" +
        "  CADScript   - run CADScript\n" +
        "  clear       - clear terminal screen\n" +
        "  exit        - exit CLI\n"+
        "  help        - terminal help\n" +
        "  history     - show command history\n")
    );
  }


  this.run = function(line)
  {
    // TERMINAL COMMAND HANDLER
    
    const m = line.match(/^([A-Za-z_]\w*)\s*(.*)$/);
    if (!m) {
      oTERM.output("[ERROR] Invalid command");
      return true;
    }

    const cmd = m[1].toLowerCase();
    const rest = (m[2] || "").trim();

    if (cmd === "help") { this.CMDHelp(); return true; }
    if (cmd === "clear")
    {
      const usage = "Usage:\n" +
      "<bare> - clear terminal screen\n" +
      " -h    - <command> help\n"

      const opt = rest.trim();
      if (opt === "-h") oTERM.output(oCOM.escapeHTML(usage));
      else if (opt == "") oTERM.clear();
      else  oTERM.output("[ERROR] "+oCOM.escapeHTML(usage));
      return true;
    }

    if (cmd === "history") 
    {
      const opt = rest.trim();
      const usage = "Usage:\n" +
        "Navigate command history\n" +
        "by pushing arrow up/down.\n\n" +
        "<bare> - show command history\n" +
        " -c    - clear command history\n" +
        " -h    - <command> help\n"

      if (!opt) 
      {
        if (!oTERM.history || oTERM.history.length === 0) oTERM.output("(history empty)");
        else {
          const lines = oTERM.history
            .map((h, i) => String(i + 1) + ": " + oCOM.escapeHTML(h))
            .join("<br>");
          oTERM.output(lines);
        }
        return true;
      }

      if (opt === "-h") {
        oTERM.output(oCOM.escapeHTML(usage));
        return true;
      }

      if (opt === "-c") {
        try {
          window.localStorage.removeItem("VanillaTerm");
        } catch (_) {}
        oTERM.history = [];
        oTERM.historyCursor = 0;
        oTERM.output("History cleared");
        return true;
      }

      oTERM.output("[ERROR] "+oCOM.escapeHTML(usage));
      return true;
    }

    if (cmd === "exit") {
      if (typeof switchToSidebar === "function") switchToSidebar("ui");
      oTERM.output("Switched to UI sidebar");
      return true;
    }

    oTERM.output("[ERROR] Unknown command. Type <u>help</u>");
      return true;
  }
  this.run.help =   
  {
    type: "AsciiCAD_CMD",
    usage: "run(<i>CMD</i>)",
    desc: "",
    examples: ["oCMD.run(\"clear\")"]
  }

   ////////////////////////////
   // OTHER HELPER FUNCTIONS //
   ////////////////////////////





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


  this.bind = function( bindings )
  {
    for(var i=0;i<bindings.length;i++)
    {
        bindings[i].obj = globalThis[bindings[i].name];
        if (bindings[i].obj === undefined) 
          { console.warn(`Global '${bindings[i].name}' not found`); delete bindings[i];  }
          //throw new Error(`Global '${bindings[i].name}' not found`);
    }
    worker = this.createCMDWorker( bindings );  // RUN THE WORKER TO TELL WE HAVE NEW BINDINGS
  }

  this.list_bindings = function()
  {
    return cmd._bindings;
  }


  this.launchTerminal = function(terminalObj)
  {
    // VANILLA-TERMINAL RUNTIME (AsciiCAD CLI)
    // Two modes:
    //  1) Terminal mode (Linux-like): help, clear, history [-c], script, exec("..."), exit
    //  2) Script mode (CADScript): help(), clear(), undo(), redo(), freeform(col,row,char), exit()

    // object instantiation/initialisation
    oTERM = new TERMINAL(
    {
      // We handle all input via oTERM.onInput; commands are kept for discoverability.
      welcome: sbTitle.querySelector("big").textContent + " terminal - type <u>help</u>",
      prompt: "AsciiCAD",
      separator: '>',
    });

    // Authorise terminal access to internal JavaScript objects (by name) 
    this.bind([
      { name: "oASC", constPrefixes: ["BOX_"] }
      ,{ name: "oCMD" }
      ,{ name: "oTERM" }
      ,{ name: "oCOM" }
    ]);

    // Start capturing Terminal command lines (after user pushed 'enter')
    oTERM.onInput((command, parameters, rawLine) => 
    {
      const line =  oCOM.normaliseQuotes(rawLine || "").trim();
      if (!line) { oTERM.output("&nbsp;"); return true; }
      return __cliHandleTerminal(line);  // TODO MOVE __cliHandleTerminal somewhere here instead of index.html ?
    });
  }

}

var worker; 
var oCMD = new CMD();



////////////////////////////////////////////////////////////////////////////////////////////









//        _____   ______     ___   ____  _____                               
//       |_   _|.' ____ \  .'   '.|_   \|_   _|                              
//         | |  | (___ \_|/  .-.  \ |   \ | |                                
//     _   | |   _.____'. | |   | | | |\ \| |                                
//    | |__' |  | \____) |\  '-'  /_| |_\   |_                               
//    '.____.'   \______.' '.___.'|_____|\____|       _    _                 
//     (_)          / |_                             / |_ (_)                
//     __   _ .--. '| |-'.---.  _ .--.  ,--.   .---.'| |-'__  _   __  .---.  
//    [  | [ '.-. | | | / /__\\[ '/''\]''_\ : / /''\]| | [  |[ \ [  ]/ /__\\ 
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
    const sel = '.json-boundary[data-pair="' + CSS.escape(String(pairId)) + '"]';
    root.querySelectorAll(sel).forEach(el => el.classList.add("active"));
  }

  function clearActive() {
    if (activePair == null) return;
    const sel = '.json-boundary[data-pair="' + CSS.escape(String(activePair)) + '"]';
    root.querySelectorAll(sel).forEach(el => el.classList.remove("active"));
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

  // 1) Move ': {' and ': [' to the next line, aligned to the property's indentation.
  //    Example: '      "parsed": {'  ->  '      "parsed":\n      {'
  //    Also handles '...": {}' and '...": []'
  s = s.replace(
    /^(\s*)"([^"]+)"\s*:\s*([{\[])([}\]])?\s*(,?)\s*$/gm,
    (m, ws, key, open, maybeClose, comma) => {
      // Case: inline empty {} or [] on same line
      if (maybeClose) {
        return ws + '"' + key + '":\n' +
               ws + open + '\n' +
               ws + ' '.repeat(indent) + '\n' +
               ws + maybeClose + comma;
      }
      // Case: normal ': {' or ': ['
      return ws + '"' + key + '":\n' + ws + open;
    }
  );

  // 2) Move ': null/true/false/number/string'? No — leave primitives as-is.
  // 3) Optional: Move '{' / '[' that follow ': ' but are not at end-of-line (rare in JSON.stringify output).

  return s;
}

