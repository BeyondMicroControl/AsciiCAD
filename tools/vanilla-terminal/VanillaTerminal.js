/*!
  Vanilla Terminal (plain globals + instance methods, no IIFE, no prototype)

  Requirements:
  - Load commands.plain.js before this file (for built-in commands).
  - Include VanillaTerminal.css via <link rel="stylesheet">.

  Usage:
    var oVanillaTerminal = new VanillaTerminal({ container: "vanilla-terminal" });
*/

"use strict";

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
