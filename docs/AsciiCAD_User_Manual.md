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
   - [Modes overview](#modes-overview)
   - [Terminal mode reference](#terminal-mode-reference)
   - [CADScript mode reference](#cadscript-mode-reference)
   - [Examples](#examples)
4. [Concepts](#concepts)
5. [Troubleshooting](#troubleshooting)

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

### Drawing tools

#### Freeform
Place individual characters on the grid.
- Choose a character (often via a picker organized by categories).
- Click or drag to place repeatedly.
- Useful for: symbols, junction markers, custom glyphs, annotations.

#### Line routing
Draw orthogonal wires with automatic merging at intersections.
- Usually available in **single-line** and **double-line** styles.
- As you drag, the tool chooses corners, T-junctions, and crossings automatically.

#### Box drawing
Draw rectangular frames, with signle, thick or double lines and corresponding corner characters.  In contrast to line routing Box frames are simply overlay their outline edges with the existing content, they do not try to merge or resolve their outline with the environment.  The inner side of the box is also left untouched, this tool does not fill boxes with blanks.  Another tool was purposed for blanking a rectangular area.   
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

### Modes overview

AsciiCAD’s CLI has two explicit languages/modes:

1. **Terminal mode** (prompt: `AsciiCAD>`)
   - Linux-like commands (words + options).
   - Intended for terminal management and switching into scripting.

2. **CADScript mode** (prompt: `CADScript>`)
   - JavaScript-like function calls (e.g. `freeform(10,5,'+')`).
   - Intended for scripted grid edits.

This separation avoids ambiguity and keeps errors readable.

---

### Terminal mode reference

Prompt: `AsciiCAD>`

| Command/option | Meaning |
|---|---|
| `help` | List terminal commands only |
| `clear` | Clear terminal screen |
| `history` | Show command history |
| `history -c` | Clear command history |
| `CADScript -h` | List all documented CADScript functions |
| `CADScript {<expression>}` | Run a CADScript expression |
| `exit` | Exit CLI and return to UI sidebar |

Notes:
- `exec("...")` runs CADScript statements; it is useful for quick one-liners or pasting a short script without switching modes.

---

### CADScript reference

Prompt: `CADScript>`

| Function | Meaning |
|---|---|
| `help()` | List CADScript functions only |
| `clear()` | Clear the entire grid |
| `undo()` | Undo last action |
| `redo()` | Redo last undone action |
| `freeform(col,row,char)` | Place one character at the given position |
| `exec("terminal command ...")` | Run exactly one terminal command (including options) from CADScript (e.g. `exec("clear")`) |
| `exit()` | Leave CADScript mode and return to Terminal mode |

CADScript parsing rules:
- Multiple statements can be separated by `;` (semicolon).
- Quotes are respected; “smart quotes” are normalized to plain ASCII quotes.

---

### Examples

#### Switch modes
```text
AsciiCAD> script
CADScript> help()
```

#### Place a few characters (CADScript)
```text
CADScript> freeform(0,2,'+'); freeform(1,2,'+'); freeform(1,3,'+');
```

#### Run CADScript while staying in Terminal mode
```text
AsciiCAD> exec("freeform(10,5,'+'); freeform(11,5,'+');")
```

#### Run a terminal command from CADScript
```text
CADScript> exec("clear")
```

#### Exit back to UI
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

### Undo/Redo doesn’t affect the terminal
- Undo/redo affect grid operations.
- Terminal history is separate (use `history -c` to clear terminal history).

### My diagram looks misaligned in another editor
- Use a monospace font in your editor.
- Some UTF‑8 characters are not perfectly monospace in all fonts; prefer box-drawing characters and common symbols.

---

## Reference

- Project overview and features: see the project README.
- Design decisions and rationale: see <a href="https://github.com/BeyondMicroControl/AsciiCAD/blob/main/docs/decisions.md">`docs/decisions.md`</a>.
