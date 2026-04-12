# AsciiCAD User Manual

AsciiCAD is a browser-based ASCII/UTF‑8 schematic editor designed to embed electronic and digital schematics directly inside source code and documentation as readable text.

---

# Contents

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
3. [Table mode (draft)](#table-mode-draft)
   - [Purpose](#purpose)
   - [Plain-text table representation](#plain-text-table-representation)
   - [Interaction model](#interaction-model)
   - [Body editing and navigation](#body-editing-and-navigation)
   - [Data and structural rules](#data-and-structural-rules)
   - [Future spreadsheet layer](#future-spreadsheet-layer)
   - [Open questions](#open-questions)
+4. [CLI manual](#cli-manual)
   - [Opening the CLI](#opening-the-cli)
   - [Terminal mode](#terminal-mode)
   - [CADScript mode](#CADScript-mode)
   - [Examples](#examples)
5. [Concepts](#concepts)
6. [Troubleshooting](#troubleshooting)
7. [Appendix](#appendix)
   - [User Interaction zones](#user-interaction-zones)
   - [User interactions per feature](#user-interactions-per-feature)
      - [Grid zone](#grid-zone)
      - [Left Sidebar zone](#left-sidebar-zone)
      - [CLI Sidebar zone](#CLI-Sidebar-Zone)
      - [Modal dialogs zone](#modal-dialogs-zone)
      - [Behaviors that affect all zones](#behaviors-that-affect-all-zones)
   - [CADScript command reference](#CADScript-command-reference)
      - [oASC object](#oASC-object)
      - [oGASC object](#oGASC-object)
      - [oCMD object](#oCMD-object)
      - [oTERM object](#oTERM-object)
---

# Quick start

## 1) Open AsciiCAD
- Run the <a href="https://beyondmicrocontrol.github.io/AsciiCAD/index.html" target="_blank">hosted version on GitHub</a>, or <a href="https://beyondmicrocontrol.github.io/AsciiCAD/dist/AsciiCAD.html?download=self">download</a> the portable “single-file” distribution (a standalone `AsciiCAD.html` that runs offline).
- When AsciiCAD loads, you’ll see:
  - A large grid canvas (your drawing area)
  - A left sidebar with tools (UI)
  - A toggle to switch to the CLI sidebar

## 2) Draw your first schematic elements
1. **Pick a drawing tool** in the UI sidebar:
   - Use **Line** tools to route orthogonal wires.
   - Use **Box** tools to frame modules/components.
   - Use **Free** to place individual characters/symbols.
2. **Draw on the canvas** by click‑dragging (or click‑click depending on the tool).
3. **Add labels** using the Text tool (for net names, pin labels, etc.).
4. Use **Undo/Redo** to iterate quickly.

## 3) Edit and arrange
- Use **Select** (rubber-band rectangle) to create a region.
- Use **Move** or **Copy** to reposition repeated structures.
- Use **Blank** to erase a rectangular area.

## 4) Save, share, embed
- **Save** to a plain text file (easy to commit to Git and embed in code).
- **Load** from a plain text file.
- Optionally use **permalink / URL parameter loading** when available to share a diagram quickly.

## 5) Try the Terminal (optional, but powerful)
Terminal commands aim two purposes: giving minimal CLI convenience (like clearing the CLI window), secondly, enabling users to access internal drawing functions of AsciiCAD and run 
- Switch to the CLI sidebar.
- Type `help` to see all the documented terminal commands in alphabetical order.  Undocumented commands are usually untested or purposed for UI interaction only.  Type any terminal command 
- Type `clear` to clear the terminal screen.
- Use arrow up and down to navigate through the command history.
- Type `history` to list the command history. Option -c clears the history.
- Type `CADScript {box(0,0,3,3,BOX_DOUBLE)}` to draw a small double-lined box in the grid

---

# UI manual

## Layout

AsciiCAD’s UI is intentionally lightweight:
- **Canvas** (center/right): the grid where you draw.
- **UI sidebar** (left): tools and actions (drawing, editing, catalog, save/load, analysis).
- **CLI sidebar** (left): a terminal-like interface for commands and scripting.
- **Resizable sidebar**: the sidebar width can be adjusted (handy for long scripts or help output).

## Navigation: pan, zoom, coordinates

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

## Drawing tools

### Free
Place individual characters on the grid.
- Choose a character (often via a picker organised by categories).
- Click or drag to place repeatedly.
- Useful for: symbols, junction markers, custom glyphs, annotations.

### Line routing
Draw orthogonal wires with automatic merging at intersections.
- Usually available in **single-line**, **fat-line**and **double-line** styles.
- As one drags, the tool chooses corners, T-junctions, and crossings automatically.

### Box drawing
Draw rectangular frames, with signle, thick or double lines and corresponding corner characters.  In contrast to line routing Box frames are overwriting the outline edges over the existing content, it intentionally does not try to merge or resolve their outline with the environment.  The inner side of the box is also left untouched, this tool does not fill boxes with blanks.  Another tool was purposed for blanking a rectangular area.   
- Useful for: module boundaries, IC outlines, labeled zones.

### Blank drawing
Fills any selected rectangular region with only blanks, including the edges of that region.

### Text placement
Add labels and annotations directly on the grid.
- Useful for: net names, pin numbers, voltages, notes.

## Selection and editing tools

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

## Component catalog

AsciiCAD includes a component catalog for common schematic symbols:
- Browse by category.
- Insert a component into the grid with one action.
- Catalog items may be parameterised (labels/values).

## Analysis tools

Two analysis features are commonly used:
- **Highlight**: helps visually separate structural frames and wiring.
- **Match**: highlights catalog component matches in the current diagram (useful for validation and semantic extraction).
- **Netlist**: identifies wire networks (“nets”) and lets you inspect connectivity interactively.

### Netlist (interactive connectivity)
- Toggle **Netlist** in the Tools section to enter net inspection mode.
- **Hover a wire/line cell** on the grid to highlight the entire connected net in **blue**.
- The Canvas card shows **Net: _N_** (real-time index of the currently highlighted net). If you hover something that isn’t a wire, it returns to **Net: —** and the drawing stays black.
- Net detection follows the same rules as highlighting:
  - Wires **inside** or **bounding** valid **double-line boxes** are excluded from net discovery.
  - Crossings of the form `─│─` are treated as two independent nets that visually cross without a junction; the horizontal segment remains continuous across the `│` without connecting to it.

## History and persistence

AsciiCAD is designed for iterative work:
- **Undo / Redo**: recover from mistakes and experiment freely.
- **Clear**: wipe the diagram (undo can bring it back).
- **Save / Load**: plain text files (Git-friendly, editor-friendly).
- **Permalink / URL loading**: share or open a diagram from a URL when enabled.

## Clipboard and paste-to-grid

AsciiCAD supports two paste workflows:
1. **Paste into the grid** (canvas workflow):
   - Pasting enters a “paste preview” mode.
   - Position the pasted block, then commit to the grid.
2. **Paste into sidebars / terminal** (text workflow):
   - Normal browser copy/paste should work (select, right-click paste, Cmd/Ctrl+V).

AsciiCAD is designed so the global paste-to-grid behavior does **not** break normal text copy/paste inside the sidebars.

---


# Table mode (draft)

## Purpose

Table mode introduces a plain-text table editor inside the AsciiCAD grid. It is intended to stay faithful to AsciiCAD’s core model: one visible character per cell, readable source text, and direct editing on the canvas.

The initial goal is to support:

- placing a table anchor directly on the grid
- editing a pipe-delimited header row
- generating a separator row and body rows automatically
- navigating between body fields with keyboard control
- keeping formulas outside the table perimeter (for example via `#+TBLFM:` metadata)

This chapter describes the currently discussed functional specification. The formula parser and evaluator are explicitly left for a later phase.

## Plain-text table representation

Table mode uses a plain-text layout inspired by traditional ASCII tables.

### Header row

The first row is the header row and is entered as a pipe-delimited line, for example:

```text
| n | n^2 | n^3 | n^4 | sqrt(n) |
```

### Separator row

When the header is committed, a separator row is generated directly below it. The separator uses `+` at column boundaries and spans the full width of the table.

Example:

```text
| n | n^2 | n^3 |
+---+-----+-----+
```

### Body rows

Body rows reuse the same pipe positions as the header:

```text
| 1 |  1  |  1  |
| 2 |  4  |  8  |
```

### Formula row

A single formula row is reserved directly below the last body row. It uses `[` and `]` and has exactly the same width as the table.

Example:

```text
[                     ]
```

At this stage the formula row is only a reserved editing area.

## Interaction model

### Entering Table mode

A new draw mode named **Table** is available in the Draw mode toolbar. It behaves like the other draw modes and acts as a radio-style mode button.

### Travelling cursor before placement

While Table mode is active but no table has been placed yet, a travelling cursor follows the mouse over the grid, similar in spirit to Text mode.

### Table anchor

Clicking a grid cell in Table mode defines the **top-left corner** of the table and starts header editing.

### Header editing

After the anchor is placed, the user enters the header row as plain text using `|` characters as field separators.

During header editing:

- `Left Arrow` moves the cursor left
- `Right Arrow` moves the cursor right
- printable characters overwrite existing characters in place
- `Backspace` clears the previous editable position
- `Escape` cancels table editing
- `Return` commits the header structure and switches to body editing

### Pipe-boundary rule

When editing the header row, a field boundary is determined by the next valid `|` character on the right.

To reduce ambiguity, pipes enclosing **more than 8 spaces** are treated as **not forming a valid column end** for this purpose.

This rule is specific to AsciiCAD and is meant to avoid misinterpreting distant pipes as intentional field boundaries.

### Header commit

When the user presses `Return` in header-editing phase:

1. the header row is finalised
2. column boundaries are parsed from the header row
3. a separator row is generated directly below it
4. the first empty body row is generated below the separator
5. the formula row is generated below the first body row
6. the logical cursor moves to the first field of the first body row

## Body editing and navigation

### Initial body position

After the header is committed, editing begins at:

- body row `0`
- column `0`

### Horizontal movement

Inside the body:

- `Left Arrow` moves left within the current field, then into the previous field when needed
- `Right Arrow` moves right within the current field, then into the next field when needed
- `Tab` may behave like move-right in body editing
- printable characters overwrite the current character position

The vertical pipe positions remain fixed once the table structure has been derived from the header row.

### Vertical movement

- `Down Arrow` moves to the same logical column in the next body row
- `Up Arrow` moves to the same logical column in the previous body row
- `Return` may behave like move-down in body editing

### Auto-create row on downward expansion

If the user moves down while already positioned on the last existing body row, the editor shall:

1. create a new empty body row with the same pipe positions
2. move the formula row down by one line so it remains directly below the last body row
3. move the cursor into the newly created body row

### Auto-remove trailing empty row

If the user moves back up from the last body row and that row is still completely empty, the editor shall remove that row using the existing undo stack.

The intended behavior is:

- the last row must have been auto-created
- the row must contain no user text in any editable field
- moving away upward from that row triggers an `undo`

This keeps trailing empty rows from accumulating.

## Data and structural rules

### Column boundaries

Once the header is committed, the table’s column structure is defined by the header row’s pipe positions. All generated body rows reuse those exact positions.

### Table width

The table width is the width of the committed header row, from its first character through its last character.

That width governs:

- the separator row
- every body row
- the formula row

### Body row emptiness

A body row is considered empty when all editable positions between its pipes contain only spaces.

### Formula row placement

The formula row is always positioned:

- directly below the last body row
- at the same left column as the table anchor
- at exactly the same width as the table

## Future spreadsheet layer

The spreadsheet layer is not yet implemented, but the formula row is intended to support a later syntax for:

- field formulas
- row formulas
- column formulas
- range formulas

The guiding idea is that spreadsheet semantics should remain layered on top of a still-readable plain-text table, rather than replacing the table with a separate hidden model.

## Open questions

The following items remain intentionally open for later design:

- formula syntax and parser design
- whether `Tab` and `Return` should have field-only or row-creation side effects
- how strictly malformed header rows should be normalised
- whether the formula row is a free-form line, a per-cell formula editor, or a compact mini-language

## Reference inspiration

The current design direction is informed by plain-text table editing patterns such as:

- pipe-delimited fields
- a distinct separator row between header and body
- row creation through navigation
- spreadsheet semantics layered on top of readable text tables

Useful reference material:

- [Org Manual: Built-in Table Editor](https://orgmode.org/manual/Built_002din-Table-Editor.html)
- [Org Manual: The Spreadsheet](https://orgmode.org/manual/The-Spreadsheet.html)
- [Org tutorial: Tables](https://orgmode.org/worg/org-tutorials/tables.html)
- [Org tutorial: Spreadsheet introduction](https://orgmode.org/worg/org-tutorials/org-spreadsheet-intro.html)

---

# CLI manual

## Opening the CLI
- Switch from the UI sidebar to the **CLI sidebar** (toggle control in the sidebar header).
- The CLI behaves like a terminal: type a line, press **Enter** to run it.

---

## Terminal mode

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

## Examples

## CADScript mode


## Examples


### Place a few characters (CADScript)
```text
AsciiCAD> CADScript {cell(0,2,'+'); cell(1,2,'+'); cell(1,3,'+')};
```

### Run a terminal command from CADScript
```text
AsciiCAD> CADScript {oCMD.run("clear")};            // clears the terminal window
```

### Run a query command + JSON printing from CADScript
```text
AsciiCAD> CADScript { oASC.cat(0,0,0,"ATTinyX12_MCU_ATTINY412") }
AsciiCAD> CADScript { oASC.oASC.cell(5,4,"01") }
AsciiCAD> CADScript { oTERM.printJSON(oASC.qryLocate({type:"M.U"})) }
```
### Run a query command + JSON printing from CADScript

```text
AsciiCAD> CADScript {oTERM.pushPrompt("CADScript")}
CADScript> cell(0,0,"ABCDE\nFGHIJ\nKLMNO\nPQRST\nUVWXY");
CADScript> oTERM.print(getCell(2,2));                  // returns "M"
CADScript> oTERM.print(getCell(2,2,2));                // returns "GHI\nLMN\nQRS"
CADScript> env.STR = getCell(0,2,3,E);
CADScript> oTERM.print(env.STR); oTERM.popPrompt();    // returns "KLM"
AsciiCAD>
```

### CADScript input prompt

```text
CADScript { oTERM.pushPrompt("CADScript") }   // enter CADScript mode
oTERM.input("label","label?","###Ω",true);    // capture user input in environment variable "label"
oTERM.print(oTERM.getenv("label"));           // print the content of environment variable
```

### Exit back to the UI
```text
AsciiCAD> exit
```



---

# Concepts

## Grid model
AsciiCAD uses a fixed-size grid, where each cell contains exactly one character. This is what makes diagrams:
- easy to save as plain text
- easy to diff in version control
- easy to embed directly in source code

## File format
Saved diagrams are plain text:
- one row per line
- columns are characters in that line
- AsciiCAD pads/truncates as needed

## Why UTF‑8
Using UTF‑8 (box-drawing, arrows, symbols) makes compact schematics possible while remaining plain text.

## Direction mask
TODO

---

# Troubleshooting

## Paste doesn’t go where I expect
- If you paste while your focus is in the **canvas**, AsciiCAD may enter paste-to-grid preview mode.
- If you want to paste text into the **CLI**, click inside the terminal first (so it has focus), then paste.

## I can’t copy/select text in the CLI
- Copy/select should work normally inside the CLI sidebar.
- If you notice selection collapsing, ensure you’re interacting in the CLI and not triggering canvas shortcuts.

## My diagram looks misaligned in another editor
- Use a monospace font in your editor.
- Some UTF‑8 characters are not perfectly monospace in all fonts; prefer box-drawing characters and common symbols.


---

# Appendix

## User interaction zones

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

## User interactions per feature

### Grid zone

 | Feature / mode                                | Input device          | Gesture (order)                                                         | Events observed in code                                                                                                                                                                                     | Modifiers / special keys                     | Outcome / notes                                                                                                              |
| --------------------------------------------- | --------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **Hover / live cell coordinate**              | Mouse                 | move pointer                                                            | `canvas.mousemove` → `setHoverFromEvent()` → `canvasPointToCell()`                                                                                                                                          | —                                            | Updates hover cell + UI “Cell: Ln…, Col…”                                                                                    |
| **Pan (drag)**                                | Mouse                 | middle-drag **or** right-drag                                           | `canvas.mousedown` (button 1 or 2) → sets `panDrag` → `canvas.mousemove` updates `panX/panY` → `window.mouseup` clears `panDrag`                                                                            | —                                            | Pan is clamped so screen center stays within grid (prevents grid fully leaving view)                                         |
| **Pan (two-finger scroll)**                   | Trackpad              | two-finger scroll                                                       | `canvas.wheel` with “looksLikeTrackpad” heuristic → adjust `panX/panY`                                                                                                                                      | —                                            | Uses wheel deltas as pan; also clamped                                                                                       |
| **Zoom (pinch)**                              | Trackpad              | pinch gesture                                                           | `canvas.wheel` with `e.ctrlKey` (browser pinch heuristic) → `__zoomAtCanvasPoint(mx,my, zoomFactor)`                                                                                                        | —                                            | Zoom anchor is the **pointer position** (mouse location in canvas coords)                                                    |
| **Zoom (wheel)**                              | Mouse wheel           | wheel up/down                                                           | `canvas.wheel` (not trackpad-like) → `__zoomAtCanvasPoint(mx,my, zoomFactor)`                                                                                                                               | —                                            | Wheel zooms; anchor is pointer position; clamped after zoom                                                                  |
| **Freeform draw (modeFreeform)**              | Mouse                 | left-down → drag → release                                              | `canvas.mousedown` (left) → `oASC.beginFreeform(cell)` → `canvas.mousemove` → `oASC.moveFreeform(cell)` → `window.mouseup` → `oASC.endFreeform()`                                                           | —                                            | Draw cell-by-cell; stroke is pushed for undo on end                                                                          |
| **Select / Move (modeSelect)**                | Mouse                 | left-down → drag select → release                                       | `canvas.mousedown` → `oASC.beginSelect(cell)` → `canvas.mousemove` → `oASC.moveSelect(cell)` → `window.mouseup` → `oASC.endSelect()`                                                                        | —                                            | Drag makes selection rectangle; release finalises. If starting inside an existing selection, it turns into a move-drag.      |
| **Copy (modeCopy)**                           | Mouse                 | same as Select/Move                                                     | same chain as Select                                                                                                                                                                                        | —                                            | Same mechanics, but moveDrag action becomes `"copy"` and source remains                                                      |
| **Blank (modeBlank)**                         | Mouse                 | left-down → drag select → release                                       | Select chain                                                                                                                                                                                                | —                                            | On endSelect, selected area is blanked and overlay cleared                                                                   |
| **Lines (modeSLine / TLine / DLine)**         | Mouse                 | left-down set start → move preview → release commit                     | `canvas.mousedown` → `oASC.beginLine(cell, kind)` → `canvas.mousemove` → `oASC.moveLine(cell)` → `window.mouseup` → `oASC.commitLineWithOptionalMerge(lineDrag.merge, lineDrag.kind)`                       | `Shift` and `o` affect preview+commit (live) | `Shift` toggles “flip” behavior and `o` toggles merge/override; updates during drag on keydown/keyup                         |
| **Boxes (modeSBox / TBox / DBox)**            | Mouse                 | left-down set start → move preview → release commit                     | `canvas.mousedown` → `oASC.beginBox(cell, kind)` → `canvas.mousemove` → `oASC.moveBox(cell)` → `window.mouseup` → `oASC.commitBox()`                                                                        | —                                            | Commit builds box path and writes chars as a stroke (undoable)                                                               |
| **Free text preview (modeFreetext)**          | Mouse + keyboard      | click to set anchor → type → Enter commit / Esc cancel                  | `canvas.mousedown` → `oASC.beginFreetext(cell)`; then `window.keydown` intercepts while `textDrag` active                                                                                                   | Enter / Escape / Backspace                   | While `textDrag` active: keys are consumed; Enter commits, Esc cancels, Backspace edits; printable chars append to preview   |
| **Table mode (modeTable)**                    | Mouse + keyboard      | move anchor preview → click top-left → type header → Enter → edit body | `canvas.mousemove` → `oASC.moveTable(cell)` for travelling anchor; `canvas.mousedown` → `oASC.beginTable(cell)`; `window.keydown` → `oASC.handleTableKeydown(e)` while `tableDrag` is active              | Arrow keys / Enter / Escape / Backspace      | Header row is edited first. Enter generates separator row, first body row, and formula row. Body navigation may auto-create or auto-remove trailing empty rows. |
| **Clipboard paste into grid (paste preview)** | Keyboard (Cmd/Ctrl+V) | paste → preview follows mouse → click to place                          | `window.paste` (only if not in sidebar + not editing text) → `oASC.startPasteWithText(text)`; then `canvas.mousemove` updates `pasteDrag.anchor`; `canvas.mousedown` commits via `oASC.commitPasteAt(cell)` | —                                            | Paste is **context-dependent**: if focus is in sidebars, paste is NOT hijacked                                               |
| **Catalog item paste (preview + rotate)**     | Mouse + keyboard      | pick catalog item → preview in grid → optional rotate (r) → click place | catalog item click calls `startPasteWithText(...)`; during paste preview `keydown` “r” rotates by swapping `text_data[...]` and restarting paste; click commits same as normal paste                        | `r` rotates                                  | Rotation keeps anchor stable across rotations                                                                                |
| **Undo / Redo**                               | Keyboard              | Cmd/Ctrl+Z / Cmd/Ctrl+Shift+Z                                           | `window.keydown` always allows undo/redo (even when typing)                                                                                                                                                 | Cmd/Ctrl                                     | `Z` undo, `Shift+Z` redo                                                                                                     |
| **Context menu suppression on canvas**        | Mouse                 | right click                                                             | `canvas.contextmenu` → `preventDefault()`                                                                                                                                                                   | —                                            | Prevents native context menu on canvas                                                                                       |
| **Netlist hover (inspect connectivity)** | Mouse | move pointer over a wire cell | `canvas.mousemove` → `setHoverFromEvent()` → net lookup → `draw()` | — | When Netlist is ON, hovering a wire highlights the whole net in **blue** and shows **Net: N** in Canvas card; hovering non-wire clears it. |

<br><br><br>

### Left Sidebar zone

 | Feature                              | Input device | Gesture (order)     | Events in code                                                                           | Outcome / notes                                                                     |
| ------------------------------------ | ------------ | ------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| **Mode buttons (radio behavior)**    | Mouse        | click button        | `button.click` → `setMode(...)` → clears active drags + cancels paste                    | Sets active draw mode; updates hint line; behaves like radio UI                     |
| **Eraser**                           | Mouse        | click               | `eraserBtn.click` sets `op={type:"erase"}` and forces Free mode                          | Turns Free mode into “erase”                                                        |
| **Table mode button**                | Mouse        | click `Table`       | same mode-button path as the other draw modes; activates `modeTable`                      | Enters Table mode, enabling travelling table-anchor preview and table-editing flow  |
| **Undo / Redo (buttons)**            | Mouse        | click               | buttons call `oASC.doUndo()` / `oASC.doRedo()` (wired elsewhere in file)                 | Mirrors keyboard undo/redo; buttons are disabled when stacks empty (UI update)      |
| **Load**                             | Mouse        | click → choose file | `loadBtn.click` → hidden file input; `fileInput.change` loads text and writes it to grid | Uses `toLines()` + writes full ROWS/COLS buffer, then clears drags and push stroke  |
| **Clear grid**                       | Mouse        | click               | `clearBtn.click` → `oASC.wipeSelection(' ')`                                             | Clears grid (and cancels selection/paste)                                           |
| **PermaLink / Save**                 | Mouse        | click               | generates compressed URI and injects link                                                | Produces link to open saved state; debug variant routes to debug wrapper            |
| **Schema Highlight / Match toggles** | Mouse        | click (toggle)      | `schemaHighlightBtn.click` / `schemaMatchBtn.click` → toggle + clear caches + redraw     | Toggle-style buttons (primary class indicates active)                               |
| **Netlist (toggle)** | Mouse | click (toggle) | `netlistBtn.click` → toggle + compute cache + redraw | When ON, enables hover-to-highlight nets; prints net count once and shows `Net:` in Canvas card. |

<br><br><br>

### CLI Sidebar zone

 | Feature                                       | Input device | Gesture (order)       | Events in code                                                             | Outcome / notes                                                                                     |
| --------------------------------------------- | ------------ | --------------------- | -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| **Open CLI**                                  | Mouse        | click ⌘ button        | `toggleSidebar.click` → `switchToSidebar('cli')`                           | Shows CLI sidebar, hides UI sidebar; launches terminal if needed                                    |
| **Close CLI / back to UI**                    | Mouse        | click ◀ button        | `toggleCLI.click` → `switchToSidebar('ui')`                                | Shows UI sidebar again                                                                              |
| **Typing commands**                           | Keyboard     | type → Enter          | vanilla-terminal `input.keydown` Enter → dispatch → host `onInputCallback` | Terminal collects history; echoes commands; uses your `__cliHandleTerminal` to parse/compile/run    |
| **History navigation**                        | Keyboard     | ↑ / ↓                 | terminal `input.keyup` handles arrow up/down                               | Loads previous commands into input                                                                  |
| **Click-to-focus without breaking selection** | Mouse        | click inside terminal | terminal root `click` focuses input **unless** clicking on output area     | Prevents “stealing focus” when selecting/copying output text                                        |

<br><br><br>

### Modal dialogs zone

 | Feature                  | Input device | Gesture (order)          | Events in code                                        | Outcome / notes                                               |
| ------------------------ | ------------ | ------------------------ | ----------------------------------------------------- | ------------------------------------------------------------- |
| **Char picker open**     | Mouse        | click “Pick char”        | opens modal + renders tabs/grid                       | Select char sets current op + closes picker                   |
| **Char picker close**    | Mouse        | click backdrop or Close  | `pickerBackdrop.click` / `pickerClose.click`          | Closes modal and returns to Free mode                         |
| **Catalog open / close** | Mouse        | open → pick item → close | `openCatalogBtn.click`, `catalogClose/backdrop.click` | Picking item starts paste-preview in grid and focuses canvas  |

<br><br><br>

### Behaviors that affect all zones

 | Behavior                                                 | Input device   | Events                                                                                      | What it does                                                                                                                         |                                                      |
| -------------------------------------------------------- | -------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------- |
| **Paste hijack is context-dependent**                    | Keyboard paste | `window.paste` checks `isInSidebar(target or activeElement)` and `isEditingTextTarget(...)` | If user is in **UI/CLI sidebar** or typing in input/textarea, paste is **not hijacked**; otherwise it becomes a grid paste-preview   |                                                      |
| **Canvas shortcuts do not run while typing in sidebars** | Keyboard       | `window.keydown` early-return if `isEditingTextTarget(e)` or `isInSidebar(...)`             | Prevents “grid shortcuts” from interfering with terminal / text inputs (undo/redo is still allowed)                                  |                                                      |
| **Sidebar resizing**                                     | Mouse          | resize handle mousedown → drag → mouseup                                                    | `resizeHandle*.mousedown` + `document.mousemove/mouseup`                                                                             | Width clamped to min 180px and max 50% window width  |

---

## CADScript command reference


### oASC.blank()

Blank a rectangular region by replacing its cells with spaces.

#### Syntax

```txt
blank(<c0>,<r0>,<c1>,<r1>)
```

#### Parameters

| Parameter | Description |
|---|---|
| \<c0\> | First rectangle column. |
| \<r0\> | First rectangle row. |
| \<c1\> | Opposite rectangle column. |
| \<r1\> | Opposite rectangle row. |

#### Remarks

- Coordinates are treated as the rectangle bounds forwarded to applyBlankRect().

#### Examples

```txt
oASC.blank(1,1,3,2)
```

#### Returns

- Type: `void`

#### Output

- Channel: `canvas`
- Format: `ASCII grid`
- The selected rectangular region is cleared on the grid.

#### Effects

- Clears all non-space cells inside the rectangle.
- Pushes one undo history stroke if at least one cell changes.
- Invalidates derived board caches through the history path.

---

### oASC.box()

Draw a box using BOX_SINGLE, BOX_FAT, or BOX_DOUBLE contours.

#### Syntax

```txt
box(<c0>,<r0>,<c1>,<r1>,{kind:[boxStyle]})
```

#### Parameters

| Parameter | Description |
|---|---|
| \<c0\> | First corner column. |
| \<r0\> | First corner row. |
| \<c1\> | Opposite corner column. |
| \<r1\> | Opposite corner row. |
| {kind:[boxStyle]} | Style object selecting BOX_SINGLE, BOX_FAT, or BOX_DOUBLE. |

#### Remarks

- Corner cells overwrite edge cells during path deduplication.
- Degenerate one-cell boxes still place a visible corner glyph.

#### Examples

```txt
oASC.box(1,0,3,2,{kind:BOX_SINGLE})
```
```txt
oASC.box(1,0,3,2,{kind:BOX_FAT})
```
```txt
oASC.box(1,0,3,2,{kind:BOX_DOUBLE})
```

#### Returns

- Type: `void`

#### Output

- Channel: `canvas`
- Format: `ASCII grid`
- The requested box outline is drawn onto the grid.

#### Effects

- Modifies grid cells along the box outline.
- Pushes one undo history stroke if at least one cell changes.
- Invalidates derived board caches through the history path.

---

### oASC.CADScript()

Run a CADScript expression.

#### Syntax

```txt
CADScript {<expression>}
```

#### Parameters

| Parameter | Description |
|---|---|
| \<expression\> | CADScript expression block to execute. |

#### Remarks

- Use this command wrapper when entering CADScript directly from the terminal command line.

#### Examples

```txt
CADScript {clear();stack("undo")}
```

#### Returns

- Type: `void`
- No direct JS value is returned to the terminal command line.

#### Output

- Channel: `depends`
- Format: `depends`
- Any visible output depends on the invoked expression, for example terminal text or grid changes.

#### Effects

- Evaluates the supplied expression in the AsciiCAD command scope.
- May mutate the grid, session environment, history, or terminal depending on the expression.

---

### oASC.cat()

Place a catalog item at top-left cell (c,r) using the selected rotation variant.

#### Syntax

```txt
cat(<c>,<r>,<angle>,<uid>)
```

#### Parameters

| Parameter | Description |
|---|---|
| \<c\> | Top-left placement column. |
| \<r\> | Top-left placement row. |
| \<angle\> | Rotation variant index to use from the item's text_data. |
| \<uid\> | Catalog item UID, typically name_type_MFR. |

#### Remarks

- The scripted placement path forces the requested cell to be the top-left anchor of the pasted block.

#### Examples

```txt
oASC.cat(0,0,0,"ATTinyX12_MCU_ATTINY412")
```

#### Returns

- Type: `void`

#### Output

- Channel: `canvas`
- Format: `ASCII grid`
- The selected catalog item is placed onto the grid.

#### Effects

- Looks up the catalog item by UID.
- Expands wide characters and replaces wildcard placeholders with spaces for placement.
- Commits the catalog footprint to the grid and pushes one undo history stroke.

---

### oASC.cell()

Write text starting at (c,r). Newlines advance to the next row.

#### Syntax

```txt
cell(<c>,<r>,<string>)
```

#### Parameters

| Parameter | Description |
|---|---|
| \<c\> | Start column for the text write. |
| \<r\> | Start row for the text write. |
| \<string\> | Text to write. Newline characters advance to the next row. |

#### Remarks

- Writing is clipped at the right grid edge.
- Positions outside the grid bounds raise an error before writing begins.

#### Examples

```txt
oASC.cell(0,0,"ABC\nDEF\nGHI")
```

#### Returns

- Type: `void`

#### Output

- Channel: `canvas`
- Format: `ASCII grid`
- The provided text is written onto the grid.

#### Effects

- Modifies addressed grid cells.
- Pushes one undo history stroke if at least one cell changes.
- Invalidates derived board caches through the history path.

---

### oASC.clear()

Clear the grid and push a single undo stroke.

#### Syntax

```txt
clear()
```

#### Remarks

- Only cells that actually change are recorded in the undo stroke.

#### Examples

```txt
oASC.clear()
```

#### Returns

- Type: `void`

#### Output

- Channel: `canvas`
- Format: `ASCII grid`
- All non-space cells are cleared from the grid.

#### Effects

- Replaces all non-space grid cells with spaces.
- Pushes one undo history stroke if at least one cell changes.
- Invalidates derived board caches through the history path.

---

### oASC.computeNetlist()

Compute the current netlist including line ends (LE), line junctions (LJ), and component ends (CE).

#### Syntax

```txt
computeNetlist()
```

#### Remarks

- Valid double-box boundaries and interiors are excluded from the extracted wire graph.
- Matched catalog footprints are excluded through the banned-set logic.
- Nets may be logically merged when connected through catalog items of type Net.

#### Examples

```txt
oTERM.printJSON(oASC.computeNetlist())
```

#### Returns

- Type: `Array<object>`
- Array of net objects, each containing LE, LJ, and CE arrays with {c,r} coordinates.

#### Output

- Channel: `none`
- Does not print or draw anything unless the caller prints the returned netlist.

---

### oASC.getCell()

Windowing-only grid getter. Returns a rectangular text block (\n separated) in grid order. len controls radius: len=1 origin only; len=2 one cell outward; ...

#### Syntax

```txt
getCell(<c>,<r>,[len],[dir])
```

#### Parameters

| Parameter | Description |
|---|---|
| \<c\> | Origin column of the requested window. |
| \<r\> | Origin row of the requested window. |
| [len] | Optional radius. len=1 returns only the origin cell; len=2 extends one cell outward; and so on. |
| [dir] | Optional direction mask (N\|E\|S\|W) selecting which sides extend from the origin. |

#### Remarks

- Omitted dir defaults to N|E|S|W.
- Off-grid cells are padded with spaces so the returned block keeps its rectangular shape.

#### Examples

```txt
oTERM.print(getCell(2,2))
```
```txt
oTERM.print(getCell(1,1,2,N|E|S|W))
```
```txt
oTERM.print(getCell(1,1,2,W|N|S))
```
```txt
oTERM.print(getCell(0,0,2,N|W|E|S))
```

#### Returns

- Type: `string`
- Rectangular text block in grid order, with rows separated by newline characters.

#### Output

- Channel: `none`
- Does not print or draw anything unless the caller prints the returned string.

---

### oASC object

The oASC object contains Javascript functions interacting with or perform relevant operations for the Ascii grid.



### oASC.getLabel()

Find the nearest label near (c,r). Returns {c:<originCol>, r:<row>, str:<labelString>} and optionally stores it into oASC.env[env_retval].

#### Syntax

```txt
getLabel(<c>,<r>,[env_retval])
```

#### Parameters

| Parameter | Description |
|---|---|
| \<c\> | Search origin column. |
| \<r\> | Search origin row. |
| [env_retval] | Optional environment variable name that receives the returned object. |

#### Remarks

- Search expands ring by ring around the origin and prefers the nearest label origin by Euclidean distance.
- The label character policy includes the wildcard character used for catalog text.

#### Examples

```txt
oTERM.printJSON(getLabel(10,5,'ret'))
```
```txt
oTERM.printJSON(oASC.env.ret)
```

#### Returns

- Type: `object|null`
- Nearest label object, or null when no label can be found.

#### Output

- Channel: `none`
- Does not print or draw anything unless the caller prints the returned object.

#### Effects

- Optionally stores the returned label object in oASC.env[env_retval].

---

### oASC.glyph2dir()

Return the [collapsed 4-bit direction mask](#direction-mask) (N|E|S|W) for a glyph. Unknown glyph returns 0.

#### Syntax

```txt
glyph2dir(<ch>)
```

#### Parameters

| Parameter | Description |
|---|---|
| \<ch\> | Wire glyph to translate into a 4-bit direction mask. |

#### Remarks

- Thin and fat information are collapsed into one 4-bit direction result.
- Alias and stand-in glyphs may still resolve to the same direction mask, for example '┼' and '+' both map to N|E|S|W.

#### Examples

```txt
printJSON(glyph2dir('┼'))
```
```txt
printJSON(glyph2dir('╵'))
```

#### Returns

- Type: `number`
- Collapsed 4-bit direction mask with thin and fat information merged together.

#### Output

- Channel: `none`
- Does not print or draw anything.

---

### oASC.glyph2mask()

Translate a wire glyph into a packed 8-bit mask: low nibble=thin(single/light), high nibble=fat(single/heavy). Double wires set both nibbles. Mixed glyphs split directions between thin and fat using a lookup table.

#### Syntax

```txt
glyph2mask(<glyph>)
```

#### Parameters

| Parameter | Description |
|---|---|
| \<glyph\> | Wire glyph to translate into a packed mask. |

#### Remarks

- The low nibble stores thin(single/light) directions and the high nibble stores fat(single/heavy) directions.
- Alias glyphs are allowed to map to the same mask, for example '┼' and '+' both map to N|E|S|W.

#### Examples

```txt
oTERM.printJSON(oASC.glyph2mask('╇'))
```
```txt
oTERM.printJSON(oASC.glyph2mask('╧'))
```

#### Returns

- Type: `number`
- Packed 8-bit wire mask. Returns 0 for falsy or empty input.

#### Output

- Channel: `none`
- Does not print or draw anything.

---

### oASC.isWireGlyph()

True if ch is a known wire glyph in the glyph mask table.

#### Syntax

```txt
isWireGlyph(<ch>)
```

#### Parameters

| Parameter | Description |
|---|---|
| \<ch\> | Character to test. |

#### Remarks

- This helper checks membership in the glyph mask table rather than general text renderability.

#### Examples

```txt
oTERM.printJSON(isWireGlyph('┼'))
```
```txt
oTERM.printJSON(isWireGlyph('A'))
```

#### Returns

- Type: `boolean`
- true when the glyph exists in the wire lookup table and is not a space.

#### Output

- Channel: `none`
- Does not print or draw anything.

---

### oASC.line()

Draw a polyline through multiple waypoints. Path tuples use [c,r] order, requiring minimum 2 tuples.

#### Syntax

```txt
line({path:[[<c>,<r>],[<c>,<r>],...],
wire:[enumW],
router:[enumR],
target:[processor],
cont:[lineC]})
```

#### Parameters

| Parameter | Description |
|---|---|
| path | Ordered list of waypoints. At least two points are required. |
| \<c\> | Path waypoint column. |
| \<r\> | Path waypoint row. |
| [enumW] | Optional line wire family: **SINGLE**\|FAT\|DOUBLE. |
| [enumR] | Optional routing algorithm: **ORTHO**\|MIKAMI\|DIJKSTRA\|ASTAR. |
| [processor] | Optional routing target: **CPU**\|GPU. |
| [lineC] | Optional flag enabling line continuation: **true**\|false. |

#### Remarks

- Waypoints may be supplied as [c,r] tuples or as objects with {c,r} fields.
- Only MIKAMI and DIJKSTRA have a GPU implementation.
- When line continuation is switched off, the first drawn wire glyph is not merged but supraposed with any pre-existing wire glyph in this cell.

#### Examples

```txt
line({path:[[0,0],[5,6]],
wire:SINGLE})
```
```txt
line({path:[[0,0],[5,6],[2,2]],
wire:FAT,
router:MIKAMI,
target:GPU})
```
```txt
line({path:[[0,0],[10,0],[10,5]],
wire:DOUBLE,
router:DIJKSTRA,
target:CPU})
```

#### Returns

- Type: `void`

#### Output

- Channel: `canvas`
- Format: `ASCII grid`
- The resulting line is drawn onto the grid.

#### Effects

- Modifies grid cells along the routed path.
- Pushes one undo history stroke.
- Invalidates derived overlay caches.

---

### oASC.mask2glyph()

Reverse of glyph2mask: map extended 8-bit mask (fat<<4 | thin) back to a wire glyph. Returns ' ' if unknown. Stand-in mappings are required when e.g. a fat wire glyph for '╞' does not exist, so when E|(N|S|E)<<4 is requested, a close-enough stand-in glyph like '┣' or '╞' will be returned (better than nothing). By policy, stand-in glyphs must prioritise correct rendering of single and fat wires over double wires, because double wires are primarily used for drawing boxes not lines.

#### Syntax

```txt
mask2glyph(m)
```

#### Examples

```txt
oTERM.print(mask2glyph(
(N|E|S|W)<<4))
```
```txt
oTERM.print(mask2glyph(
(N|E|S|W) | ((N|E|S|W)<<4)))
```

---

### oASC.mirrorMask()

Mirror a packed 8-bit wire mask around either the vertical or horizontal axis.

#### Syntax

```txt
mirrorMask(<m>,<bVertAxis>)
```

#### Parameters

| Parameter | Description |
|---|---|
| \<m\> | Packed 8-bit wire mask to mirror. |
| \<bVertAxis\> | true mirrors around the vertical axis (E\<-\>W); false mirrors around the horizontal axis (N\<-\>S). |

#### Remarks

- Thin and fat nibbles are mirrored independently before being packed back together.

#### Examples

```txt
oTERM.print(mask2glyph(
mirrorMask(glyph2mask('╆'),
true)))
```
```txt
oTERM.print(mask2glyph(
mirrorMask(glyph2mask('╆'),
false)))
```

#### Returns

- Type: `number`
- Mirrored packed 8-bit wire mask.

#### Output

- Channel: `none`
- Does not print or draw anything.

---

### oASC.printCat()

List all catalog item UIDs.

#### Syntax

```txt
printCat()
```

#### Remarks

- Uses the current CATALOG contents and sorts the resulting UID list alphabetically before printing.

#### Examples

```txt
oASC.printCat()
```

#### Returns

- Type: `void`

#### Output

- Channel: `terminal`
- Format: `plain text`
- Prints the sorted catalog item UIDs to the terminal.

---

### oASC.printNetlist

Compute and print the current netlist as formatted JSON.

#### Syntax

```txt
printNetlist()
```

#### Remarks

- Uses computeNetlist() as its data source and pretty-prints the result for terminal display.

#### Examples

```txt
oASC.printNetlist()
```

#### Returns

- Type: `void`

#### Output

- Channel: `terminal`
- Format: `formatted JSON`
- Prints the extracted netlist to the terminal using oTERM.output().

---

### oASC.qryLocate()

Locate matching catalog components, BOX rectangles, and labels with regular expressions; returns bounding rectangles with tl/br coordinates.

#### Syntax

```txt
qryLocate({<key>:<regexp>})
```

#### Parameters

| Parameter | Description |
|---|---|
| \<key\> | One of ref, type, name, or MFR. |
| \<regexp\> | Regular-expression text matched against the selected field. |

#### Remarks

- BOX and LABEL queries target definition hits, while other type filters target catalog items.
- Returned objects use tl and br coordinate objects rather than flattened r0/c0/r1/c1 fields.

#### Examples

```txt
oASC.qryLocate({ref:'CAT.+'})
```
```txt
oASC.qryLocate({type:'BOX'})
```
```txt
oASC.qryLocate({name:'ATTiny85'})
```
```txt
oASC.qryLocate({name:'ATTiny85'
,MFR:'ATTINY85V-10PU'})
```

#### Returns

- Type: `Array<object>`
- Array of hits containing ref/type/name metadata together with tl/br coordinates.

#### Output

- Channel: `none`
- Does not print or draw anything unless the caller prints the returned array.

---

### oASC.rotateMask()

Rotate a packed 8-bit wire mask 90 degrees clockwise.

#### Syntax

```txt
rotateMask(<m>)
```

#### Parameters

| Parameter | Description |
|---|---|
| \<m\> | Packed 8-bit wire mask to rotate. |

#### Remarks

- The low nibble (thin) and high nibble (fat) are rotated independently before being packed back together.

#### Examples

```txt
oTERM.printJSON(rotateMask(
glyph2mask('╆')))
```
```txt
oTERM.print(mask2glyph(
rotateMask(glyph2mask('╆'))))
```

#### Returns

- Type: `number`
- Rotated packed 8-bit wire mask.

#### Output

- Channel: `none`
- Does not print or draw anything.

---

### oASC.setLabel()

Write label_str at (c,r). If an old label exists starting at (c,r) and is longer, clear the remainder with spaces.

#### Syntax

```txt
setLabel(<c>,<r>,<label_str>)
```

#### Parameters

| Parameter | Description |
|---|---|
| \<c\> | Label start column. |
| \<r\> | Label row. |
| \<label_str\> | Single-line label text to write. |

#### Remarks

- Label replacement is row-local and uses the same label-character policy as getLabel().

#### Examples

```txt
setLabel(5,3,'Net_1')
```
```txt
oTERM.printJSON(getLabel(5,3,'ret'))
```

#### Returns

- Type: `void`

#### Output

- Channel: `canvas`
- Format: `ASCII grid`
- The label text is written onto the grid.

#### Effects

- Writes the label on the grid at (c,r).
- Clears leftover characters when the previous label at that origin was longer.
- Pushes undo history through the underlying cell() calls.

---
### oGASC Object

The oGASC object contains GPU-specific Javascript functions interacting with or perform relevant operations for the Ascii grid.


# oGASC.glyph2mask()

Translate the current grid into an 8-bit wire-mask raster. Low nibble encodes thin/single directions and high nibble encodes fat directions. Double wires set both nibbles.

## Syntax

```txt
glyph2mask([pack])
```

## Parameters

| Parameter | Description |
|---|---|
| [pack] | Optional packing width in columns per GPU output word. Supported values are 1, 2, or 3. |

## Remarks

- Alias glyphs are alternative glyphs for the same mapping, for example '┼' and '+' both map to N|E|S|W.
- Packed GPU output is unpacked back into one byte per board cell before being returned.

## Examples

```txt
oTERM.print(oGASC.glyph2mask(),"array")
```
```txt
oTERM.print(oGASC.glyph2mask(2),"array")
```

## Returns

- Type: `Uint8Array|null`
- Returns one byte per grid cell in row-major order, or null when GPU execution is unavailable or fails.

## Output

- Channel: `none`
- No terminal output is produced.

## Effects

- Reads the current AsciiCAD board state.
- Initialises and reuses GPU kernels on first successful execution.

---

# oGASC.mikamiPath()

Run the tentative GPU.js Mikami-style router using the same outer signature as the CPU Mikami router.

## Syntax

```txt
mikamiPath(from,to,modifiers)
```

## Parameters

| Parameter | Description |
|---|---|
| from | Start cell as an object with row and column coordinates. |
| to | Target cell as an object with row and column coordinates. |
| modifiers | Routing modifiers using the same shape as the CPU Mikami router. |

## Remarks

- This first GPU pass is intentionally limited to least-bends-first behavior.
- leastBridges is not supported and causes the function to return null so the caller can fall back to CPU routing.

## Examples

```txt
oTERM.printJSON(oGASC.mikamiPath({r:0,c:0},{r:4,c:8},{}))
```

## Returns

- Type: `Array<object>|null`
- Returns a routed path array on success, or null when GPU routing is unavailable, unsupported by the requested modifiers, or no path is found.

## Output

- Channel: `none`
- No terminal output is produced.

## Effects

- Reads the current board state and routing context.
- Caches successful path results and reuses them while the board revision and request stay unchanged.

---

# oGASC.routePathDijkstra()

Run the tentative GPU.js Dijkstra router using the same outer signature as the CPU router.

## Syntax

```txt
routePathDijkstra(from,to,modifiers)
```

## Parameters

| Parameter | Description |
|---|---|
| from | Start cell as an object with row and column coordinates. |
| to | Target cell as an object with row and column coordinates. |
| modifiers | Routing modifiers using the same shape as the CPU router. |

## Remarks

- The first GPU pass does not support least-corners or least-bridges tie-break behavior and will return null in those cases.
- When GPU compilation or execution fails, callers are expected to fall back to the CPU implementation.

## Examples

```txt
oTERM.printJSON(oGASC.routePathDijkstra({r:0,c:0},{r:0,c:5},{}))
```

## Returns

- Type: `Array<object>|null`
- Returns a routed path array on success, or null when GPU routing is unavailable, unsupported by the requested modifiers, or no path is found.

## Output

- Channel: `none`
- No terminal output is produced.

## Effects

- Reads the current board state and routing context.
- May populate and reuse the cached 16-bit route mask.

---

### oCMD Object

### oCMD.run()

Execute a terminal command line through the AsciiCAD command dispatcher.

#### Syntax

```txt
run(<CMD>)
```

#### Parameters

| Parameter | Description |
|---|---|
| \<CMD\> | Complete command line string to dispatch. |

#### Remarks

- CADScript command lines are normalised through the same CLI handling path used by the interactive terminal.
- Unknown commands print an error to the terminal.

#### Examples

```txt
oCMD.run("clear")
```
```txt
oCMD.run("history -h")
```

#### Returns

- Type: `boolean`
- Returns true once the command line has been handled or rejected.

#### Output

- Channel: `terminal`
- Format: `plain text|HTML`
- Writes command feedback, help text, or errors to the terminal depending on the dispatched command.

#### Effects

- May dispatch terminal built-ins such as help, clear, history, and exit.
- May route CADScript command lines into the shared CLI handler and worker pipeline.

---

### oTERM Object


### oTERM.clear()

Clear the terminal output area and restore the live input line.

#### Syntax

```txt
clear()
```

#### Remarks

- This affects only the terminal view and does not clear command history or environment values.

#### Examples

```txt
oTERM.clear()
```

#### Returns

- Type: `void`
- No JavaScript value is returned.

#### Output

- Channel: `terminal`
- Format: `cleared output`
- Removes all rendered terminal output lines.

#### Effects

- Clears the terminal output DOM.
- Resets the live command input visibility and scroll position.

---

### oTERM.idle()

Toggle the terminal busy state.

#### Syntax

```txt
idle()
```

#### Remarks

- Call a second time to return the terminal to the available state.

#### Examples

```txt
oTERM.idle();
```

#### Returns

- Type: `void`
- No JavaScript value is returned.

#### Output

- Channel: `terminal`
- Format: `prompt state`
- Shows a spinner while busy and restores the normal prompt when toggled back.

#### Effects

- Toggles oTERM._o.state.idle.
- Switches the prompt between busy and interactive modes.
- Refocuses the input when returning to interactive mode.

---

### oTERM.input()

Prompt the user and store the answer in oTERM._o.env[varName].

#### Syntax

```txt
input(<varName>,<question>
,[prefill],[overwriteMode])
```

#### Parameters

| Parameter | Description |
|---|---|
| \<varName\> | Environment variable name used to store the answer. |
| \<question\> | Prompt text shown while waiting for the answer. |
| [prefill] | Optional initial input value inserted into the live command line. |
| [overwriteMode] | Optional flag enabling terminal-like overwrite editing while prompting. |

#### Remarks

- overwriteMode=true enables terminal-like overwrite editing instead of pure insert behavior.

#### Examples

```txt
oTERM.input("label","Enter","1234",false)
```
```txt
oTERM.input("label","Enter","1234",true)
```

#### Returns

- Type: `void`
- No JavaScript value is returned.

#### Output

- Channel: `terminal`
- Format: `interactive prompt`
- Shows the supplied question as the active prompt and waits for the next submitted line.

#### Effects

- Pushes the current prompt onto the prompt stack.
- Enables prompt mode for the next Enter key submission.
- Stores the answer in oTERM._o.env[varName].

---

### oTERM.popPrompt()

Restore the previous prompt from the prompt stack.

#### Syntax

```txt
popPrompt([opts])
```

#### Parameters

| Parameter | Description |
|---|---|
| [opts] | Optional configuration object supporting render. |

#### Remarks

- When the prompt stack is empty, the current prompt remains active and null is returned.

#### Examples

```txt
oTERM.popPrompt()
```

#### Returns

- Type: `object|null`
- Returns the restored prompt object, or null when the prompt stack is empty.

#### Output

- Channel: `terminal`
- Format: `prompt state`
- Updates the visible prompt unless opts.render is false.

#### Effects

- Pops one prompt record from oTERM._o.promptStack when available.
- Restores the active prompt configuration.

---

### oTERM.print()

Format a value and write it to the terminal.

#### Syntax

```txt
print(<obj>,[fmt])
```

#### Parameters

| Parameter | Description |
|---|---|
| \<obj\> | Value to format and print. |
| [fmt] | Optional formatter: array, array_hex, literal, html, or URL. |

#### Remarks

- Without a formatter, multiline or space-sensitive strings are wrapped in <pre> output.
- fmt="html" writes the string directly as HTML.

#### Examples

```txt
oTERM.print("DONE")
```
```txt
oTERM.print([0,1,2,3,4],"array")
```
```txt
oTERM.print([0,1,2,3,4],"array_hex")
```

#### Returns

- Type: `void`
- No JavaScript value is returned.

#### Output

- Channel: `terminal`
- Format: `plain text|preformatted text|HTML`
- Writes the formatted value to the terminal output.

#### Effects

- Appends a new terminal output line.

---

### oTERM.printJSON()

Pretty-print a value as JSON-like terminal output.

#### Syntax

```txt
printJSON(<obj>)
```

#### Parameters

| Parameter | Description |
|---|---|
| \<obj\> | Value to format for terminal display. |

#### Remarks

- Error objects are rendered from stack or message text.
- Non-serializable objects fall back to their string representation.

#### Examples

```txt
oTERM.printJSON({so:true})
```

#### Returns

- Type: `void`
- No JavaScript value is returned.

#### Output

- Channel: `terminal`
- Format: `formatted JSON`
- Writes the value as pretty-printed JSON inside preformatted terminal output.

#### Effects

- Appends a new terminal output line.

---

### oTERM.pushPrompt()

Push the current prompt onto the prompt stack and replace it with a new prompt.

#### Syntax

```txt
pushPrompt(<newPrompt>,[opts])
```

#### Parameters

| Parameter | Description |
|---|---|
| \<newPrompt\> | Prompt label to make active. |
| [opts] | Optional configuration object supporting separator, render, and replace. |

#### Remarks

- Use opts.replace=true to avoid pushing the previous prompt onto the stack.

#### Examples

```txt
oTERM.pushPrompt("CADScript")
```

#### Returns

- Type: `void`
- No JavaScript value is returned.

#### Output

- Channel: `terminal`
- Format: `prompt state`
- Updates the visible prompt unless opts.render is false.

#### Effects

- Pushes the current prompt and separator onto oTERM._o.promptStack unless opts.replace is true.
- Replaces the active prompt configuration.

---

# Other references

- Project overview and features: see the project README.
- Design decisions and rationale: see <a href="https://github.com/BeyondMicroControl/AsciiCAD/blob/main/docs/decisions.md">`docs/decisions.md`</a>.
