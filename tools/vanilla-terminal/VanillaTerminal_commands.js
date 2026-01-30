/*!
  Vanilla Terminal - built-in commands (plain globals, no IIFE)

  Exposes:
    - VanillaTerminalBuiltins (object)
      - VERSION
      - createBuiltInCommands()
*/

var VanillaTerminalBuiltins = (function () {
  "use strict";

  var STORAGE_KEY = "VanillaTerm";
  var VERSION = "0.0.11";

  var HELP = {
    clear: "clear the terminal screen",
    version: "print the terminal version",
    wipe: "Remove all your history of command lines",
    help: "print this message",
  };

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function createBuiltInCommands() {
    return {
      "clear": function (terminal) {
        terminal.clear();
      },

      "help": function (terminal, params) {
        params = params || [];
        var command = params[0];

        if (command) {
          terminal.output(
            "help: " +
              (HELP[command] || ("no help topics match <u>" + escapeHtml(command) + "</u>"))
          );
          return;
        }

        terminal.output(
          "These shell commands are defined internally. Type <u>help</u> for see the list."
        );
        terminal.output(
          "Type <u>help name</u> to find out more about the function <u>name</u>."
        );
        terminal.output(Object.keys(terminal.commands).join(", "));
      },

      "version": function (terminal) {
        terminal.output("Vanilla Terminal v" + VERSION);
      },

      "wipe": function (terminal) {
        terminal.prompt("Are you sure remove all your commands history? Y/N", function (value) {
          if (String(value).trim().toUpperCase() === "Y") {
            try {
              window.localStorage.removeItem(STORAGE_KEY);
            } catch (_) {}
            terminal.history = [];
            terminal.historyCursor = 0;
            terminal.output("History of commands wiped.");
          }
        });
      },
    };
  }

  return {
    VERSION: VERSION,
    createBuiltInCommands: createBuiltInCommands,
  };
})();
