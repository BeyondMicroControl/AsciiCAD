# AsciiCAD User Manual

AsciiCAD is a browser-based ASCII/UTF‑8 schematic editor designed to embed electronic and digital schematics directly inside source code and documentation as readable text.

---

## Contents

1. [Quick start](#quick-start)
2. [UI manual](#ui-manual)
   - [Layout](#layout)
   - [Navigation: pan, zoom, coordinates](#navigation-pan-zoom-coordinates)
   - [Drawing tools](#drawing-tools)
   - [Selection and editing tools](#selection-and-editing-tools)
   - [Component catalog](#component-catalog)
   - [Analysis tools](#analysis-tools)
   - [History and persistence](#history-and-persistence)
   - [Clipboard and paste-to-grid](#clipboard-and-paste-to-grid)
3. [CLI manual](#cli-manual)
   - [Opening the CLI](#opening-the-cli)
   - [Terminal mode](#terminal-mode)
   - [CADScript mode](#CADScript-mode)
   - [Examples](#examples)
4. [Concepts](#concepts)
5. [Troubleshooting](#troubleshooting)
6. [Appendix](#appendix)
   - [User Interaction zones](#user-interaction-zones)
   - [User interactions per feature](#user-interactions-per-feature)
      - [Grid zone](#grid-zone)
      - [Left Sidebar zone](#left-sidebar-zone)
      - [CLI Sidebar zone](#CLI-Sidebar-Zone)
      - [Modal dialogs zone](#modal-dialogs-zone)
      - [Behaviors that affect all zones](#behaviors-that-affect-all-zones)

---

## Quick start

### 1) Open AsciiCAD
- Run the <a href="https://beyondmicrocontrol.github.io/AsciiCAD/index.html" target="_blank">hosted version on GitHub</a>, or <a href="https://beyondmicrocontrol.github.io/AsciiCAD/dist/AsciiCAD.html?download=self">download</a> the portable “single-file” distribution (a standalone `AsciiCAD.html` that runs offline).
- When AsciiCAD loads, you’ll see:
  - A large grid canvas (your drawing area)
  - A left sidebar with tools (UI)
  - A toggle to switch to the CLI sidebar

### 2) Draw your first schematic elements
1. **Pick a drawing tool** in the UI sidebar:
   - Use **Line** tools to route orthogonal wires.
   - Use **Box** tools to frame modules/components.
   - Use **Freeform** to place individual characters/symbols.
2. **Draw on the canvas** by click‑dragging (or click‑click depending on the tool).
3. **Add labels** using the Text tool (for net names, pin labels, etc.).
4. Use **Undo/Redo** to iterate quickly.

### 3) Edit and arrange
- Use **Select** (rubber-band rectangle) to create a region.
- Use **Move** or **Copy** to reposition repeated structures.
- Use **Blank** to erase a rectangular area.

### 4) Save, share, embed
- **Save** to a plain text file (easy to commit to Git and embed in code).
- **Load** from a plain text file.
- Optionally use **permalink / URL parameter loading** when available to share a diagram quickly.

### 5) Try the Terminal (optional, but powerful)
Terminal commands aim two purposes: giving minimal CLI convenience (like clearing the CLI window), secondly, enabling users to access internal drawing functions of AsciiCAD and run 
- Switch to the CLI sidebar.
- Type `help` to see all the documented terminal commands in alphabetical order.  Undocumented commands are usually untested or purposed for UI interaction only.  Type any terminal command 
- Type `clear` to clear the terminal screen.
- Use arrow up and down to navigate through the command history.
- Type `history` to list the command history. Option -c clears the history.
- Type `CADScript {box(0,0,3,3,BOX_DOUBLE)}` to draw a small double-lined box in the grid

---

## UI manual

### Layout

AsciiCAD’s UI is intentionally lightweight:
- **Canvas** (center/right): the grid where you draw.
- **UI sidebar** (left): tools and actions (drawing, editing, catalog, save/load, analysis).
- **CLI sidebar** (left): a terminal-like interface for commands and scripting.
- **Resizable sidebar**: the sidebar width can be adjusted (handy for long scripts or help output).

### Navigation: pan, zoom, coordinates

AsciiCAD supports working on large diagrams:
- **Pan**: use your usual canvas navigation gesture (drag-pan tool or trackpad scroll depending on configuration).
- **Zoom**: mouse wheel / trackpad; AsciiCAD supports high zoom levels for detailed work.
- **Coordinates**: the UI can show the current cell coordinates to help precise placement.

**Tip:** When working on dense schematics, use zoom for detail edits and pan to move between modules.

**Canvas telemetry (top-left “Canvas” card):**
- **Cells**: grid size (e.g. 256 × 128)
- **Zoom**: current zoom percentage
- **Cell**: hovered cell coordinate (Ln/Col)
- **Pan**: pan offset in *cell units* (right = +x, up = +y)
- **Net**: (when Netlist mode is enabled) the currently hovered net index

### Drawing tools

#### Freeform
Place individual characters on the grid.
- Choose a character (often via a picker organized by categories).
- Click or drag to place repeatedly.
- Useful for: symbols, junction markers, custom glyphs, annotations.

#### Line routing
Draw orthogonal wires with automatic merging at intersections.
- Usually available in **single-line** and **double-line** styles.
- As one drags, the tool chooses corners, T-junctions, and crossings automatically.

#### Box drawing
Draw rectangular frames, with signle, thick or double lines and corresponding corner characters.  In contrast to line routing Box frames are overwriting the outline edges over the existing content, it intentionally does not try to merge or resolve their outline with the environment.  The inner side of the box is also left untouched, this tool does not fill boxes with blanks.  Another tool was purposed for blanking a rectangular area.   
- Useful for: module boundaries, IC outlines, labeled zones.

#### Blank drawing
Fills any selected rectangular region with only blanks, including the edges of that region.

#### Text placement
Add labels and annotations directly on the grid.
- Useful for: net names, pin numbers, voltages, notes.

### Selection and editing tools

Editing is selection-driven:
- **Select**: drag a rectangle (rubber band) to define a region.
- **Move**: drag a selection to a new place; original is cleared.
- **Copy**: drag a selection to a new place; original remains.
- **Blank**: clears everything inside the selection.
- **Paste**: a special selection-based operation for clipboard content (preview, position, then commit).

Visual feedback:
- Selection is shown with a dashed overlay.
- Move/copy/paste typically show a preview before commit.
- A completed drag/commit becomes a single undoable operation (one “stroke”).

### Component catalog

AsciiCAD includes a component catalog for common schematic symbols:
- Browse by category.
- Insert a component into the grid with one action.
- Catalog items may be parameterized (labels/values).

### Analysis tools

Two analysis features are commonly used:
- **Highlight**: helps visually separate structural frames and wiring.
- **Match**: highlights catalog component matches in the current diagram (useful for validation and semantic extraction).
- **Netlist**: identifies wire networks (“nets”) and lets you inspect connectivity interactively.

#### Netlist (interactive connectivity)
- Toggle **Netlist** in the Tools section to enter net inspection mode.
- **Hover a wire/line cell** on the grid to highlight the entire connected net in **blue**.
- The Canvas card shows **Net: _N_** (real-time index of the currently highlighted net). If you hover something that isn’t a wire, it returns to **Net: —** and the drawing stays black.
- Net detection follows the same rules as highlighting:
  - Wires **inside** or **bounding** valid **double-line boxes** are excluded from net discovery.
  - Crossings of the form `─│─` are treated as two independent nets that visually cross without a junction; the horizontal segment remains continuous across the `│` without connecting to it.

### History and persistence

AsciiCAD is designed for iterative work:
- **Undo / Redo**: recover from mistakes and experiment freely.
- **Clear**: wipe the diagram (undo can bring it back).
- **Save / Load**: plain text files (Git-friendly, editor-friendly).
- **Permalink / URL loading**: share or open a diagram from a URL when enabled.

### Clipboard and paste-to-grid

AsciiCAD supports two paste workflows:
1. **Paste into the grid** (canvas workflow):
   - Pasting enters a “paste preview” mode.
   - Position the pasted block, then commit to the grid.
2. **Paste into sidebars / terminal** (text workflow):
   - Normal browser copy/paste should work (select, right-click paste, Cmd/Ctrl+V).

AsciiCAD is designed so the global paste-to-grid behavior does **not** break normal text copy/paste inside the sidebars.

---

## CLI manual

### Opening the CLI
- Switch from the UI sidebar to the **CLI sidebar** (toggle control in the sidebar header).
- The CLI behaves like a terminal: type a line, press **Enter** to run it.

---

### Terminal mode

Prompt: `AsciiCAD>`

| Command/option | Meaning |
|---|---|
| `help` | List terminal commands only |
| `clear` | Clear terminal screen |
| `history` | Show command history |
| `history -c` | Clear command history |
| `CADScript -h [objName]` | List authorised CADScript objects and their documented functions |
| `CADScript {<expression>}` | Run a CADScript expression |
| `exit` | Exit CLI and return to UI sidebar |

---

### Examples

### CADScript mode


### Examples


#### Place a few characters (CADScript)
```text
AsciiCAD> CADScript {cell(0,2,'+'); cell(1,2,'+'); cell(1,3,'+')};
```

#### Run a terminal command from CADScript
```text
AsciiCAD> CADScript {oCMD.run("clear")};            // clears the terminal window
```

#### Run a query command + JSON printing from CADScript
```text
AsciiCAD> CADScript { oASC.cat(0,0,0,"ATTinyX12_MCU_ATTINY412") }
AsciiCAD> CADScript { oASC.oASC.cell(5,4,"01") }
AsciiCAD> CADScript { oTERM.printJSON(oASC.qryLocate({type:"M.U"})) }
```
#### Run a query command + JSON printing from CADScript

```text
AsciiCAD> CADScript {oTERM.pushPrompt("CADScript")}
CADScript> cell(0,0,"ABCDE\nFGHIJ\nKLMNO\nPQRST\nUVWXY");
CADScript> oTERM.print(getCell(2,2));                  // returns "M"
CADScript> oTERM.print(getCell(2,2,2));                // returns "GHI\nLMN\nQRS"
CADScript> env.STR = getCell(0,2,3,E);
CADScript> oTERM.print(env.STR); oTERM.popPrompt();    // returns "KLM"
AsciiCAD>
```

#### CADScript input prompt

```text
CADScript { oTERM.pushPrompt("CADScript") }   // enter CADScript mode
oTERM.input("label","label?","###Ω",true);    // capture user input in environment variable "label"
oTERM.print(oTERM.getenv("label"));           // print the content of environment variable
```

#### Exit back to the UI
```text
AsciiCAD> exit
```



---

## Concepts

### Grid model
AsciiCAD uses a fixed-size grid, where each cell contains exactly one character. This is what makes diagrams:
- easy to save as plain text
- easy to diff in version control
- easy to embed directly in source code

### File format
Saved diagrams are plain text:
- one row per line
- columns are characters in that line
- AsciiCAD pads/truncates as needed

### Why UTF‑8
Using UTF‑8 (box-drawing, arrows, symbols) makes compact schematics possible while remaining plain text.

---

## Troubleshooting

### Paste doesn’t go where I expect
- If you paste while your focus is in the **canvas**, AsciiCAD may enter paste-to-grid preview mode.
- If you want to paste text into the **CLI**, click inside the terminal first (so it has focus), then paste.

### I can’t copy/select text in the CLI
- Copy/select should work normally inside the CLI sidebar.
- If you notice selection collapsing, ensure you’re interacting in the CLI and not triggering canvas shortcuts.

### My diagram looks misaligned in another editor
- Use a monospace font in your editor.
- Some UTF‑8 characters are not perfectly monospace in all fonts; prefer box-drawing characters and common symbols.


---

## Appendix

### User interaction zones

<pre>

 ┌─────────┐┌─────────┐┌┬┬┬┬┬┬┬┬┬┬┬┬┬┬┬┬┐ Grid zone ┌┬┬┬┬┬┬┬┬┬┬┬┬┬┬┬┬┬┐
 │   CLI   ││  Button │├┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┬┬┬┬┬┬┬┬┬┬┬┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┤
 │ sidebar ││ sidebar │├┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┤
 │  zone   ││  zone   │├┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┤
 │         ││╭───────╮│├┼┼┼┼┼┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴╁┼┼┼┼┼┤
 │         │││ Card  ││├┼┼┼┼┤         Modal dialog zone         ┠┼┼┼┼┼┤
 │         │││subzone││├┼┼┼┼┤                                   ┠┼┼┼┼┼┤
 │         ││╰───────╯│├┼┼┼┼┤                                   ┠┼┼┼┼┼┤
 │         ││╭ ─ ─ ─ ╮│├┼┼┼┼┤                                   ┠┼┼┼┼┼┤
 │         ││|       |│├┼┼┼┼┤                                   ┠┼┼┼┼┼┤
 │         ◀▶|       |│├┼┼┼┼┤                                   ┠┼┼┼┼┼┤
 │         ││╰ ─ ─ ─ ╯│├┼┼┼┼┤                                   ┠┼┼┼┼┼┤
 │         ││╭ ─ ─ ─ ╮│├┼┼┼┼┤                                   ┠┼┼┼┼┼┤
 │         ││|       |│├┼┼┼┼┤                                   ┠┼┼┼┼┼┤
 │         ││|       |│├┼┼┼┼┤                                   ┠┼┼┼┼┼┤
 │         ││╰ ─ ─ ─ ╯│├┼┼┼┼┤                                   ┠┼┼┼┼┼┤
 │         ││╭ ─ ─ ─ ╮│├┼┼┼┼┤                                   ┠┼┼┼┼┼┤
 │         ││|       |│├┼┼┼┼┤                                   ┠┼┼┼┼┼┤
 │         ││|       |│├┼┼┼┼┾┯┯┯┯┯┯┯┯┯┯┯┯┯┯┯┯┯┯┯┯┯┯┯┯┯┯┯┯┯┯┯┯┯┯┯╃┼┼┼┼┼┤
 │         ││╰ ─ ─ ─ ╯│├┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┤
 │         ││         │├┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┤
 └─────────┘└─────────┘└┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┴┘
   
</pre>

### User interactions per feature

#### Grid zone

 | Feature / mode                                | Input device          | Gesture (order)                                                         | Events observed in code                                                                                                                                                                                     | Modifiers / special keys                     | Outcome / notes                                                                                                              |
| --------------------------------------------- | --------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **Hover / live cell coordinate**              | Mouse                 | move pointer                                                            | `canvas.mousemove` → `setHoverFromEvent()` → `canvasPointToCell()`                                                                                                                                          | —                                            | Updates hover cell + UI “Cell: Ln…, Col…”                                                                                    |
| **Pan (drag)**                                | Mouse                 | middle-drag **or** right-drag                                           | `canvas.mousedown` (button 1 or 2) → sets `panDrag` → `canvas.mousemove` updates `panX/panY` → `window.mouseup` clears `panDrag`                                                                            | —                                            | Pan is clamped so screen center stays within grid (prevents grid fully leaving view)                                         |
| **Pan (two-finger scroll)**                   | Trackpad              | two-finger scroll                                                       | `canvas.wheel` with “looksLikeTrackpad” heuristic → adjust `panX/panY`                                                                                                                                      | —                                            | Uses wheel deltas as pan; also clamped                                                                                       |
| **Zoom (pinch)**                              | Trackpad              | pinch gesture                                                           | `canvas.wheel` with `e.ctrlKey` (browser pinch heuristic) → `__zoomAtCanvasPoint(mx,my, zoomFactor)`                                                                                                        | —                                            | Zoom anchor is the **pointer position** (mouse location in canvas coords)                                                    |
| **Zoom (wheel)**                              | Mouse wheel           | wheel up/down                                                           | `canvas.wheel` (not trackpad-like) → `__zoomAtCanvasPoint(mx,my, zoomFactor)`                                                                                                                               | —                                            | Wheel zooms; anchor is pointer position; clamped after zoom                                                                  |
| **Freeform draw (modeFreeform)**              | Mouse                 | left-down → drag → release                                              | `canvas.mousedown` (left) → `oASC.beginFreeform(cell)` → `canvas.mousemove` → `oASC.moveFreeform(cell)` → `window.mouseup` → `oASC.endFreeform()`                                                           | —                                            | Draw cell-by-cell; stroke is pushed for undo on end                                                                          |
| **Select / Move (modeSelect)**                | Mouse                 | left-down → drag select → release                                       | `canvas.mousedown` → `oASC.beginSelect(cell)` → `canvas.mousemove` → `oASC.moveSelect(cell)` → `window.mouseup` → `oASC.endSelect()`                                                                        | —                                            | Drag makes selection rectangle; release finalizes. If starting inside an existing selection, it turns into a move-drag.      |
| **Copy (modeCopy)**                           | Mouse                 | same as Select/Move                                                     | same chain as Select                                                                                                                                                                                        | —                                            | Same mechanics, but moveDrag action becomes `"copy"` and source remains                                                      |
| **Blank (modeBlank)**                         | Mouse                 | left-down → drag select → release                                       | Select chain                                                                                                                                                                                                | —                                            | On endSelect, selected area is blanked and overlay cleared                                                                   |
| **Lines (modeSLine / TLine / DLine)**         | Mouse                 | left-down set start → move preview → release commit                     | `canvas.mousedown` → `oASC.beginLine(cell, kind)` → `canvas.mousemove` → `oASC.moveLine(cell)` → `window.mouseup` → `oASC.commitLineWithOptionalMerge(lineDrag.merge, lineDrag.kind)`                       | `Shift` and `o` affect preview+commit (live) | `Shift` toggles “flip” behavior and `o` toggles merge/override; updates during drag on keydown/keyup                         |
| **Boxes (modeSBox / TBox / DBox)**            | Mouse                 | left-down set start → move preview → release commit                     | `canvas.mousedown` → `oASC.beginBox(cell, kind)` → `canvas.mousemove` → `oASC.moveBox(cell)` → `window.mouseup` → `oASC.commitBox()`                                                                        | —                                            | Commit builds box path and writes chars as a stroke (undoable)                                                               |
| **Free text preview (modeFreetext)**          | Mouse + keyboard      | click to set anchor → type → Enter commit / Esc cancel                  | `canvas.mousedown` → `oASC.beginFreetext(cell)`; then `window.keydown` intercepts while `textDrag` active                                                                                                   | Enter / Escape / Backspace                   | While `textDrag` active: keys are consumed; Enter commits, Esc cancels, Backspace edits; printable chars append to preview   |
| **Clipboard paste into grid (paste preview)** | Keyboard (Cmd/Ctrl+V) | paste → preview follows mouse → click to place                          | `window.paste` (only if not in sidebar + not editing text) → `oASC.startPasteWithText(text)`; then `canvas.mousemove` updates `pasteDrag.anchor`; `canvas.mousedown` commits via `oASC.commitPasteAt(cell)` | —                                            | Paste is **context-dependent**: if focus is in sidebars, paste is NOT hijacked                                               |
| **Catalog item paste (preview + rotate)**     | Mouse + keyboard      | pick catalog item → preview in grid → optional rotate (r) → click place | catalog item click calls `startPasteWithText(...)`; during paste preview `keydown` “r” rotates by swapping `text_data[...]` and restarting paste; click commits same as normal paste                        | `r` rotates                                  | Rotation keeps anchor stable across rotations                                                                                |
| **Undo / Redo**                               | Keyboard              | Cmd/Ctrl+Z / Cmd/Ctrl+Shift+Z                                           | `window.keydown` always allows undo/redo (even when typing)                                                                                                                                                 | Cmd/Ctrl                                     | `Z` undo, `Shift+Z` redo                                                                                                     |
| **Context menu suppression on canvas**        | Mouse                 | right click                                                             | `canvas.contextmenu` → `preventDefault()`                                                                                                                                                                   | —                                            | Prevents native context menu on canvas                                                                                       |
| **Netlist hover (inspect connectivity)** | Mouse | move pointer over a wire cell | `canvas.mousemove` → `setHoverFromEvent()` → net lookup → `draw()` | — | When Netlist is ON, hovering a wire highlights the whole net in **blue** and shows **Net: N** in Canvas card; hovering non-wire clears it. |

<br><br><br>

#### Left Sidebar zone

 | Feature                              | Input device | Gesture (order)     | Events in code                                                                           | Outcome / notes                                                                     |
| ------------------------------------ | ------------ | ------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| **Mode buttons (radio behavior)**    | Mouse        | click button        | `button.click` → `setMode(...)` → clears active drags + cancels paste                    | Sets active draw mode; updates hint line; behaves like radio UI                     |
| **Eraser**                           | Mouse        | click               | `eraserBtn.click` sets `op={type:"erase"}` and forces Free mode                          | Turns Free mode into “erase”                                                        |
| **Undo / Redo (buttons)**            | Mouse        | click               | buttons call `oASC.doUndo()` / `oASC.doRedo()` (wired elsewhere in file)                 | Mirrors keyboard undo/redo; buttons are disabled when stacks empty (UI update)      |
| **Load**                             | Mouse        | click → choose file | `loadBtn.click` → hidden file input; `fileInput.change` loads text and writes it to grid | Uses `toLines()` + writes full ROWS/COLS buffer, then clears drags and push stroke  |
| **Clear grid**                       | Mouse        | click               | `clearBtn.click` → `oASC.wipeSelection(' ')`                                             | Clears grid (and cancels selection/paste)                                           |
| **PermaLink / Save**                 | Mouse        | click               | generates compressed URI and injects link                                                | Produces link to open saved state; debug variant routes to debug wrapper            |
| **Schema Highlight / Match toggles** | Mouse        | click (toggle)      | `schemaHighlightBtn.click` / `schemaMatchBtn.click` → toggle + clear caches + redraw     | Toggle-style buttons (primary class indicates active)                               |
| **Netlist (toggle)** | Mouse | click (toggle) | `netlistBtn.click` → toggle + compute cache + redraw | When ON, enables hover-to-highlight nets; prints net count once and shows `Net:` in Canvas card. |

<br><br><br>

#### CLI Sidebar zone

 | Feature                                       | Input device | Gesture (order)       | Events in code                                                             | Outcome / notes                                                                                     |
| --------------------------------------------- | ------------ | --------------------- | -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| **Open CLI**                                  | Mouse        | click ⌘ button        | `toggleSidebar.click` → `switchToSidebar('cli')`                           | Shows CLI sidebar, hides UI sidebar; launches terminal if needed                                    |
| **Close CLI / back to UI**                    | Mouse        | click ◀ button        | `toggleCLI.click` → `switchToSidebar('ui')`                                | Shows UI sidebar again                                                                              |
| **Typing commands**                           | Keyboard     | type → Enter          | vanilla-terminal `input.keydown` Enter → dispatch → host `onInputCallback` | Terminal collects history; echoes commands; uses your `__cliHandleTerminal` to parse/compile/run    |
| **History navigation**                        | Keyboard     | ↑ / ↓                 | terminal `input.keyup` handles arrow up/down                               | Loads previous commands into input                                                                  |
| **Click-to-focus without breaking selection** | Mouse        | click inside terminal | terminal root `click` focuses input **unless** clicking on output area     | Prevents “stealing focus” when selecting/copying output text                                        |

<br><br><br>

#### Modal dialogs zone

 | Feature                  | Input device | Gesture (order)          | Events in code                                        | Outcome / notes                                               |
| ------------------------ | ------------ | ------------------------ | ----------------------------------------------------- | ------------------------------------------------------------- |
| **Char picker open**     | Mouse        | click “Pick char”        | opens modal + renders tabs/grid                       | Select char sets current op + closes picker                   |
| **Char picker close**    | Mouse        | click backdrop or Close  | `pickerBackdrop.click` / `pickerClose.click`          | Closes modal and returns to Free mode                         |
| **Catalog open / close** | Mouse        | open → pick item → close | `openCatalogBtn.click`, `catalogClose/backdrop.click` | Picking item starts paste-preview in grid and focuses canvas  |

<br><br><br>

#### Behaviors that affect all zones

 | Behavior                                                 | Input device   | Events                                                                                      | What it does                                                                                                                         |                                                      |
| -------------------------------------------------------- | -------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------- |
| **Paste hijack is context-dependent**                    | Keyboard paste | `window.paste` checks `isInSidebar(target or activeElement)` and `isEditingTextTarget(...)` | If user is in **UI/CLI sidebar** or typing in input/textarea, paste is **not hijacked**; otherwise it becomes a grid paste-preview   |                                                      |
| **Canvas shortcuts do not run while typing in sidebars** | Keyboard       | `window.keydown` early-return if `isEditingTextTarget(e)` or `isInSidebar(...)`             | Prevents “grid shortcuts” from interfering with terminal / text inputs (undo/redo is still allowed)                                  |                                                      |
| **Sidebar resizing**                                     | Mouse          | resize handle mousedown → drag → mouseup                                                    | `resizeHandle*.mousedown` + `document.mousemove/mouseup`                                                                             | Width clamped to min 180px and max 50% window width  |


### Terminal command reference

### line




---

## Reference

- Project overview and features: see the project README.
- Design decisions and rationale: see <a href="https://github.com/BeyondMicroControl/AsciiCAD/blob/main/docs/decisions.md">`docs/decisions.md`</a>.
