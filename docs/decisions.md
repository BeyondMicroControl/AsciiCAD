# Architectural Decision Records (ADRs) for AsciiCAD
## Project Overview
AsciiCAD is a browser-based ASCII drawing tool specifically designed for creating electronic and digital schematics that can be embedded directly in source code (particularly Arduino C++). It evolved from recognizing the complexity of existing tools like Asciiflow and the need for a simpler, more maintainable solution.

---

## ADR-001: No Framework/Library Dependencies
**Date**: Initial project inception\
**Status:** Accepted\
**Context:** Need for a lightweight, maintainable ASCII drawing tool\
**Decision:** Build the entire application using vanilla HTML/CSS/JavaScript without frameworks or libraries

### Rationale:

- Reduces complexity and learning curve
- Eliminates dependency management issues
- Ensures the tool is lightweight and fast
- Makes the codebase more accessible for future modifications
- Avoids version conflicts and breaking changes from external dependencies

### Consequences:

- (+) Complete control over all code
- (+) No build system required
- (+) Faster load times
- (-) Need to implement common patterns manually
- (-) More boilerplate code for common functionality

---

## ADR-002: Grid-Based Architecture with 2D Character Array
**Date:** Initial project inception\
**Status:** Accepted\
**Context** Need to represent ASCII art in a structured, editable format\
**Decision:** Implement a 2D array of characters where each grid cell contains exactly one character

### Rationale:

- Direct mapping between visual grid and data structure
- Simplifies save/load operations (plain text files)
- Makes undo/redo implementation straightforward
- Aligns with how ASCII art is actually stored and shared

### Consequences:

- (+) Simple data model
- (+) Easy serialization to text files
- (+) Natural undo/redo through array snapshots
- (+) Clipboard operations are straightforward
- (-) Memory usage scales with grid size
- (-) Need to handle grid boundaries explicitly

---

## ADR-003: Cell Aspect Ratio of 2:1
**Date:** Early development\
**Status:** Accepted, later refined\
**Context** Monospace fonts are typically taller than wide\
**Decision:** Implement grid cells with a 2:1 width-to-height aspect ratio

### Rationale:

- Matches typical monospace character proportions
- Ensures characters like ╬ can create continuous lines both horizontally and vertically
- Prevents visual distortion in the final ASCII output

### Consequences:

- (+) Visual grid matches actual character rendering
- (+) Box-drawing characters align properly
- (-) Required careful calibration during zoom implementation
- (-) Initial implementation had spacing issues that needed debugging

### Related Changes:

- Multiple iterations to match character size to grid size (prompts about 256x128 grid)
- Adjustments for vertical spacing to accommodate characters like ╬

---

## ADR-004: Full-Screen Canvas Experience
**Date:** Initial project inception\
**Status:** Accepted\
**Context** Maximize available workspace for diagram creation\
**Decision:** Canvas borders correspond to browser window borders, providing full-screen drawing area

### Rationale:

- Maximizes usable workspace
- Better user experience for complex diagrams
- Follows modern web application patterns

### Consequences:

- (+) More drawing space
- (+) Professional appearance
- (+) Better for complex schematics
- (-) Need to handle window resize events
- (-) Requires responsive layout design

---

## ADR-005: Pan and Zoom Functionality
**Date:** Early development, extended mid-development\
**Status:** Accepted\
**Context** Large diagrams (256x128 cells) need navigation and detail work\
**Decision:** Implement mouse/trackpad zoom (up to 1000%) and pan capabilities

### Rationale:

- Essential for working with large grid areas
- Allows precision placement of characters
- Standard interaction pattern users expect
- Accommodates increased work area size

### Consequences:

- (+) Can work on both overview and details
- (+) Supports larger diagrams
- (-) Complexity in coordinate transformations
- (-) Need to handle zoom-relative mouse positions

---

## ADR-006: Freeform Character Drawing with Continuous Mode
**Date:** Early development\
**Status:** Accepted\
**Context** Need to place arbitrary UTF-8 characters on the grid\
**Decision:** Implement freeform drawing that:

- Uses a popup character picker organized by category
- Draws continuously while mouse is down and moving
- Only places character when moving to a new grid cell (prevents duplicates)


### Rationale:

- Provides flexibility for custom symbols
- Prevents character spam through movement-based triggering
- Categories (Arrows, Box Drawing, Geometric, Emoji, etc.) organize large character sets
- Follows W3Schools UTF-8 character reference structure

### Consequences:

- (+) Supports vast range of symbols
- (+) Organized character selection
- (+) Efficient continuous drawing
- (-) Complex picker UI with multiple tabs
- (-) Need to curate useful character sets

Character Categories Implemented:

- Arrows & Misc
- Box Drawing
- Geometric
- Emoji
- Technical
- Places
- Recycling
- Number Forms

---

## ADR-007: Intelligent Line Drawing with Automatic Merging
**Date:** Mid-development\
**Status:** Accepted (with ongoing refinements)\
**Context** Need to create clean electronic schematics with connected lines\
**Decision:** Implement single and double line modes that:

- Automatically detect and merge line intersections
- Use appropriate box-drawing characters for corners, T-junctions, and crossings
- Support both single (thin) and double (thick) line styles


### Rationale:

- Essential feature for schematic drawings
- Reduces manual character selection
- Creates professional-looking diagrams
- Aligns with electronic schematic conventions

### Consequences:

- (+) Dramatically improves drawing efficiency
- (+) Professional appearance
- (+) Reduces errors in line connections
- (-) Complex logic for all intersection cases
- (-) Edge cases with single/double line mixing required extensive debugging

Known Challenges (from prompts):

- Double lines not appearing during dragging (fixed)
- Single/double line crossing conflicts
- Line endings at component boundaries
- Special cases like capacitor symbols (⏊+⏉)

Decision to Defer: Full line conflict resolution moved to separate tool due to complexity of all edge cases---

## ADR-008: Box Drawing Mode
**Date:** Mid-development\
**Status:** Accepted\
**Context** Need to create rectangular enclosures quickly\
**Decision:** Implement single and double box drawing modes that create rectangles with:

- Appropriate corner characters
- Proper side characters
- Drag-to-create interaction model


### Rationale:

- Common pattern in schematics (component boundaries, regions)
- Faster than drawing lines individually
- Ensures proper corner characters automatically

### Consequences:

- (+) Rapid rectangle creation
- (+) Consistent box styling
- (-) Needed separate handling for single vs double boxes
- (-) Intersection with existing content needs consideration

---

## ADR-009: Select, Move, Copy, and Blank Operations
**Date:** Mid-development\
**Status:** Accepted\
**Context** Need editing capabilities for created content\
**Decision:** Implement four selection-based modes:

- Move: Select region, drag to new location, original cleared
- Copy: Select region, drag to new location, original preserved
- Blank: Select region to clear it
- Paste: Special case of Copy for clipboard content

### Interaction Design:

- Drag creates green dashed "rubber band" selection
- Blue overlay shows preview during move/copy
- Apply on mouseup
- Clamp/trim to grid boundaries
- Entire operation = one undoable stroke


### Rationale:

- Standard editing operations users expect
- Visual feedback during operation
- Consistent undo/redo behavior

### Consequences:

- (+) Full editing capability
- (+) Clear visual feedback
- (+) Consistent with user expectations
- (-) Complex state management for drag operations
- (-) Edge cases with grid boundaries

---

## ADR-010: Unrestricted Selection Beyond Grid Boundaries
**Date:** Mid-development\
**Status:** Accepted\
**Context** Users need to move partially visible selections\
**Decision:** Allow selection origin to extend beyond grid boundaries; only trim content when committing to grid

### Rationale:

- More flexible editing
- Allows repositioning of partially visible content
- Only enforce boundaries at commit time

### Consequences:

- (+) Better user experience
- (+) More forgiving editing
- (-) Need to handle clipping logic on commit
- (-) More complex coordinate validation

---

## ADR-011: Undo/Redo System
**Date:** Mid-development\
**Status:** Accepted\
**Context** Need to support iterative editing and error recovery\
**Decision:** Implement undo/redo with:

- Each complete operation = one stroke in undo stack
- Keyboard shortcuts: Cmd/Ctrl+Z (undo), Cmd/Ctrl+Shift+Z (redo)
- Integrated into Load & Save toolbar
- All operations (draw, move, paste, load) add to stack


### Rationale:

- Essential editing feature
- Standard keyboard shortcuts
- Grouped with load/save as related file operations

### Consequences:

- (+) Error recovery
- (+) Supports experimentation
- (+) Standard UX
- (-) Memory usage for large diagrams
- (-) Need to track all state-changing operations

---

## ADR-012: Plain Text File Format
**Date:** Mid-development\
**Status:** Accepted\
**Context** Need save/load functionality\
**Decision:** Use plain text files (ROWS × COLS characters) with:

- Each row on a separate line
- Padding/truncation per row as needed
- Direct grid array serialization


### Rationale:

- Human-readable format
- Can be edited in any text editor
- Easy to embed in source code (primary use case)
- No parsing complexity
- Version control friendly

### Consequences:

- (+) Maximum portability
- (+) Human-readable
- (+) Easy embedding in code
- (+) Version control compatible
- (-) No metadata storage
- (-) Fixed grid size per file

---

## ADR-013: URL Parameter Loading
**Date:** Later development\
**Status:** Accepted\
**Context** Need to share diagrams via hyperlinks\
**Decision:** Support loading diagrams via URL parameter (?d=<encoded-data>)

### Rationale:

- Easy sharing without file exchange
- Enables linking from documentation
- Supports embedding in web pages

### Consequences:

- (+) Shareable links
- (+) No server storage needed
- (+) Works with static hosting
- (-) URL length limits for large diagrams
- (-) Need compression/encoding scheme

---

## ADR-014: Clipboard Integration (Paste Mode)
**Date:** Mid-development\
**Status:** Accepted\
**Context** Need to import ASCII art from external sources\
**Decision:** Implement Cmd/Ctrl+V to trigger paste mode that:

- Captures clipboard text
- Shows preview overlay (using move/copy visual feedback)
- Allows positioning before committing
- Clips content beyond grid boundaries


### Rationale:

- Import from other tools
- Quick integration of external content
- Consistent with move/copy interaction

### Consequences:

- (+) Easy content import
- (+) Familiar interaction pattern
- (+) Preview before commit
- (-) Need clipboard API access
- (-) Browser permission requirements

---

## ADR-015: Real-Time Coordinate Display
**Date:** Mid-development\
**Status:** Accepted\
**Context** Users need position feedback for precise placement\
**Decision:** Display current cell coordinates in Canvas toolbar

### Rationale:

- Helps with precise positioning
- Useful for documentation/communication
- Low implementation cost

### Consequences:

- (+) Better spatial awareness
- (+) Easier collaboration
- (-) Minimal screen space usage

---

## ADR-016: Large Grid Size (256×128 cells)
**Date:** Mid-development\
**Status:** Accepted\
**Context** Complex electronic schematics need substantial workspace\
**Decision:** Expand grid to 256×128 cells (from original 128×128)

### Rationale:

- Accommodate complex CPU/MCU schematics
- Provide generous working area
- Reduce need for multiple files

### Consequences:

- (+) Can create complex diagrams in single file
- (+) Reduces splitting of related content
- (-) Increased memory usage
- (-) Required zoom up to 1000% for detail work
- (-) Character spacing calibration challenges

---

## ADR-017: Component Catalog System
**Date:** Later development\
**Status:** Accepted\
**Context** Electronic schematics use standard component symbols\
**Decision:** Implement component catalog with:

- Curated library of discrete and digital components
- Category organization
- One-click insertion
- Catalog stored in JSON-like structure with text_data field


### Rationale:

- Speed up common schematic tasks
- Ensure consistent component representation
- Build library of reusable elements
- Reduce need to redraw common symbols

### Consequences:

- (+) Faster schematic creation
- (+) Consistent symbol library
- (+) Extensible catalog
- (-) Need to maintain catalog content
- (-) Need UI for catalog selection

---

## ADR-018: Wildcard Matching System for Catalog
**Date:** Later development (v0.95)\
**Status:** Accepted\
**Context** Component symbols often contain labels/values that vary\
**Decision:** Implement wildcard system:

- '#' matches any digit [0-9]
- '$' matches alphanumeric + special [0-9A-Za-z+-*/%Ωπµ⍉⍵°.,;:?@&§_]
- '§' (WILDCARD_U) matches line characters (single, double) - replaced with space when pasting


### Rationale:

- Flexible pattern matching for components
- Recognize components regardless of specific labels
- Support schematic highlighting/matching features

### Consequences:

- (+) Flexible component recognition
- (+) Enables automated highlighting
- (+) Supports labeled components
- (-) Regex complexity
- (-) Need careful pattern design

---

## ADR-019: Schema Highlighting Feature
**Date:** v0.94\
**Status:** Accepted\
**Context** Visual organization of complex schematics\
**Decision:** Implement toggleable highlighting mode:

- Double-line frames: Red (defines enclosed areas/modules)
- Single-line wires: Blue (within and outside enclosed areas)
- Exception: Single lines inside double-line enclosed areas remain black
- Update highlighting on each commit (editable while highlighted)
- Overlay approach (non-destructive)


### Rationale:

Visual hierarchy for complex schematics
Distinguish structural boundaries (modules) from connections (wires)
Helps understand circuit organization
Non-destructive (doesn't modify actual data)

### Consequences:

- (+) Better visual organization
- (+) Easier to understand complex circuits
- (+) Non-destructive overlay
- (-) Performance consideration for large grids
- (-) Complex detection logic for enclosed areas

Double-line frame characters: ═ ║ ╔ ╗ ╚ ╝ ╢ ╟ ╠ ╣ ╬ ╤ ╧ ╦ ╩ ╪ ╫---

## ADR-020: Catalog Matching Feature (Green Highlighting)
**Date:** v0.95\
**Status:** Accepted\
**Context** Identify where catalog components are used in diagrams\
**Decision:** Implement "Match" button that:

- Highlights catalog components in green
- Uses first line of catalog item for fast initial match
- Performs full match including wildcards on promising candidates
- Searches across all catalog categories


### Rationale:

- Visual feedback of component placement
- Helps identify reusable patterns
- Quality check for catalog usage
- Documentation aid

### Consequences:

- (+) Visual component identification
- (+) Catalog validation
- (+) Learning aid for catalog contents
- (-) Performance considerations for large catalogs
- (-) Regex matching complexity

---

## ADR-021: Collapsible Left Pane UI
**Date:** Initial project inception\
**Status:** Accepted\
**Context** Balance between tools access and workspace\
**Decision:** Implement collapsible left pane for tools using Roboto font

### Rationale:

- Maximize canvas space when not selecting tools
- Organized tool presentation
- Standard UI pattern

### Consequences:

- (+) Efficient space usage
- (+) Clean interface
- (+) Expandable for more tools
- (-) Need toggle mechanism
- (-) Layout calculations for expand/collapse

---

## ADR-022: Tool Life-Cycle Pattern Standardization
**Date:** Later refactoring phase\
**Status:** Proposed\
**Context** Repetitive code patterns across tools (line, box, text, select, etc.)\
**Decision:** Refactor to unified tool framework:
```javascript
const dragTools = {
  modeSLine: { begin, move, end, cancel },
  modeTLine: { begin, move, end, cancel },
  // ... other tools
};
```

### Rationale:

- Reduce code duplication
- Prevent tool mismatch bugs
- Easier to add new tools
- Consistent behavior across tools

### Consequences:

- (+) Less code duplication
- (+) Easier maintenance
- (+) Consistent tool behavior
- (+) Easier to add new tools
- (-) Upfront refactoring effort
- (-) Need to design generic interface

---

## ADR-023: Freetext Mode
**Date:** Mid-development\
**Status:** Accepted\
**Context** Need to add labels and annotations\
**Decision:** Implement freetext mode that:

- Allows typing text directly on grid
- Positions text at specific grid location
- Commits as single undo stroke


### Rationale:

- Essential for labeling components
- Annotations and documentation
- Pin numbers, signal names, etc.

### Consequences:

- (+) Complete annotation capability
- (+) Direct text input
- (-) Need cursor positioning
- (-) Text wrapping considerations

---

## ADR-024: Stroke Deduplication with Map
**Date:** Later development\
**Status:** Accepted (inconsistently applied)\
**Context** Prevent duplicate characters in same cell during continuous drawing\
**Decision:** Use Map data structure to deduplicate stroke operations

### Rationale:

- Prevents overwriting same cell multiple times in one operation
- Cleaner undo history
- More efficient

### Consequences:

- (+) Cleaner operations
- (+) Better undo behavior
- (-) Not consistently applied across all tools (noted as refactoring need)

---

## ADR-025: Light Color Scheme
**Date:** Initial project inception\
**Status:** Accepted\
**Context** Long editing sessions, readability\
**Decision:** Use light color scheme:

- Canvas: White (#FFFFFF)
- Grid: Light grey (#EEEEEE)
- Text: Black (default)
- Accent colors: Green (selection), Blue (preview), Red (highlights)


### Rationale:

- Better for extended use
- Standard for CAD/technical tools
- Good contrast for black text
- educes eye strain

### Consequences:

- (+) Better readability
- (+) Reduced eye strain
- (+) Professional appearance
- (-) May not suit all user preferences (no dark mode)

---

## ADR-026: Roboto Font Choice
**Date:** Initial project inception\
**Status:** Accepted\
**Context** Need clean, readable monospace rendering\
**Decision:** Use Roboto font family

### Rationale:

- Clean, modern appearance
- Good readability
- Wide character support
- Professional look

### Consequences:

- (+) Professional appearance
- (+) Good UTF-8 support
- (+) Widely available
- (-) May need fallbacks for missing characters

---

## ADR-027: Clear Function
**Date:** Mid-development\
**Status:** Accepted\
**Context** Need to start fresh or remove all content\
**Decision:** Add Clear button to Load & Save toolbar that:

- Wipes a selected area on the grid
- Adds to undo stack
- Requires no confirmation (relying on undo)


### Rationale:

- Quick reset functionality
- Grouped with file operations
- Undo provides safety net

### Consequences:

- (+) Quick fresh start
- (+) Recoverable via undo
- (-) No confirmation dialog (could be accidental)

---

## ADR-028: Separate Line Conflict Resolution Tool (Deferred)
**Date:** Mid-development\
**Status:** Deferred\
**Context** Complex edge cases in single/double line crossing\
**Decision:** Extract line conflict resolution to separate tool for:

- Identifying sensitive crossing cells
- Indicating which cells need modification
- Handling line endings (e.g., capacitor symbols)
- Human feedback and refinement


### Rationale:

- Too many edge cases for automated solution
- Benefits from human oversight
- Cleaner separation of concerns
- Can iterate independently

### Consequences:

- (+) Focused development on core tool
- (+) Better resolution for edge cases
- (+) Human-in-the-loop for complex patterns
- (-) Separate tool maintenance
- (-) Two-step workflow for perfect crossings

---

## ADR-029: Tool Organization and Grouping
**Date:** Throughout development\
**Status:** Accepted\
**Context** Growing number of tools and features\
**Decision:** Organize tools into logical groups:

- Drawing: Freeform, Line (Single/Double), Box (Single/Double), Text
- Editing: Select, Move, Copy, Blank
- File: Load, Save, Clear, Undo, Redo
- Canvas: Pan, Zoom, Coordinates
- Analysis: Highlight, Match


### Rationale:

- Logical organization
- Easy to find tools
- Scalable for future additions

### Consequences:

- (+) Better UX
- (+) Easier to learn
- (+) Scalable organization
- (-) Need UI space for all groups

---

## ADR-030: Event-Driven Architecture
**Date:** Initial implementation\
**Status:** Accepted\
**Context** Interactive canvas with multiple tools\
**Decision:** Use event-driven architecture with:

- Mouse events: mousedown, mousemove, mouseup
- Keyboard events: keydown for shortcuts
- Mode-based event handling (current tool determines behavior)


### Rationale:

- Natural for interactive applications
- Clean separation of concerns
- Easy to extend with new tools

### Consequences:

- (+) Responsive UI
- (+) Clean event flow
- (+) Easy to extend
- (-) Need careful state management
- (-) Potential for event handler conflicts

---

## ADR-031: Self-downloading app & CLI foundation
**Date:** 29-Jan-2029 v1.02\
**Status:** Accepted\
**Context** App portability and prompt interfacing\
**Decision:** Make app self-downloading (.html) and add a basic sidebar prompt

- Self-download: A link located at the left-bottom allows self-download
- CLI (basic commands):
  - freeform(col, row, char) - Place character at position
  - clear() - Clear the entire grid
  - undo() - Undo last action
  - redo() - Redo last undone action
  - help - Show this help message
- make the sidebar resizable (explanding the CLI up to 50% window width)
- basic clipboard copy/paste function while interacting with the CLI

### Rationale:

- Ultimate portability, easy to copy online app to a local file
- Allow scripting (JavaScript syntax) to produce schemas

### Consequences:

- (+) Self-download: Easy to copy the app from the web, and deploy offline
- (+) CLI window opens plenty new windows of opportunity
- (-) Self-download: Only works when running the <a href="https://beyondmicrocontrol.github.io/AsciiCAD/dist/AsciiCAD.html">one-file distribution</a>. It does so by a trick, detecting the filename: if filename = "AsciiCAD.html" the download link appears, otherwise not.
- (-) CLI functions
  


---

## ADR-032: Vanilla-Terminal CLI with dual modes and context-aware paste
**Date:** 30-Jan-2026 (v1.03 CLI)\
**Status:** Accepted\
**Context:** The initial textarea-based CLI caused recurring issues with selection, copy/paste, and focus management as new features were added (sidebar resizing, grid paste hijacking, multi-command scripting).\
**Decision:** Replace the textarea CLI with a dedicated terminal widget (vanilla-terminal) and introduce two explicit command languages (“Terminal mode” and “CADScript mode”). Keep the global paste-to-grid feature, but make it context-dependent so it never breaks copy/paste in the sidebars.

### CLI Modes

**1) Terminal mode (prompt `AsciiCAD>`)** — Linux-like commands and options:

- `help` — list terminal commands only
- `clear` — clear the terminal screen
- `history` — show command history
- `history -c` — clear command history
- `script` — switch to CADScript mode (prompt becomes `CADScript>`)
- `exec("...")` — execute one or more CADScript statements without switching mode
- `exit` — leave the CLI and return to the UI sidebar (`switchToSidebar('ui')`)

**2) CADScript mode (prompt `CADScript>`)** — function-call syntax:

- `help()` — list CADScript functions only
- `clear()` — clear the entire grid
- `undo()` / `redo()` — invoke undo/redo (each as a single stroke)
- `freeform(col,row,char)` — place a character
- `exec("terminal-command ...")` — run exactly one terminal command (including options) from CADScript (e.g. `exec("clear")` clears the terminal)
- `exit()` — leave CADScript mode and return to Terminal mode (prompt becomes `AsciiCAD>`)

### Parsing & robustness rules

- **Quote normalization:** smart quotes are normalized to ASCII quotes before parsing (so pasted `’+’` works as `'+'`).
- **Multi-statement support:** CADScript input accepts multiple statements separated by `;` (semicolon-aware, respecting quotes/escapes).
- **Strict separation of languages:**
  - Terminal mode rejects CADScript-looking input and suggests `script` or `exec("...")`.
  - CADScript mode rejects bare words and requires function calls.

### Paste / selection policy

- **Keep paste-to-grid hijack** (Cmd/Ctrl+V) for the drawing area, because it enables “paste preview” and commit-to-grid workflows.
- **Context-dependent guard:** the global paste hijack must *not* run when paste originates from, or focus is inside, either sidebar (UI sidebar or CLI sidebar/terminal). In those cases, native browser paste/copy/selection behavior is preserved.
- **Scrollbar track artifact:** the terminal container uses `overflow-y: auto` (not `scroll`) so the scrollbar track is not permanently reserved/visible.

### Rationale

- A dedicated terminal widget reduces ad-hoc event handling and improves consistency for selection/copy/paste.
- Explicit modes avoid ambiguous parsing and allow both Linux-like commands and JS-like CADScript functions without collisions.
- Context-aware paste preserves the CAD paste workflow without breaking sidebar text editing.

### Consequences

- (+) Reliable copy/select/paste inside the terminal and sidebars.
- (+) Clear user mental model: commands vs functions.
- (+) CADScript can batch actions via `;` and can call back into Terminal via `exec("...")`.
- (-) Requires maintaining two small parsers/dispatchers (Terminal + CADScript), plus mode transitions.


---

## ADR-033: Pan/Zoom usability upgrades (anchored zoom, bounded pan, live navigation telemetry)

**Date:** 06-Feb-2026 (v1.04–v1.05)

**Status:** Proposed → Accepted (once merged)

**Context:** After the CLI foundation work in ADR-032 (v1.03), user feedback shifted to navigation comfort in large grids (256×128). The current “zoom around screen center” workflow forces users to pan the area-of-interest to the center before zooming, which is inefficient during repeated inspect/zoom cycles. Additionally, unrestricted panning risks losing the grid entirely (user can pan the grid fully out of view). 

### Decision

Improve navigation ergonomics by introducing:

**1. Zoom anchored to pointer position**
- Wheel / pinch zoom uses the grid location under the pointer as the anchor, for both zoom-in and zoom-out.
- This removes the need to pre-pan the area of interest to screen center before zooming.

**2. Bounded panning to prevent losing the grid**
- Panning is constrained so the grid cannot be moved completely out of view.
- Hard rule: stop moving the grid when trying to push any grid corner “past the screen center.”
- Practical implementation: keep the screen center point always inside the grid’s transformed bounds, so in the worst case ~3/4 of the screen may be off-grid, but not 100%.

**3. Live navigation telemetry in the Canvas card**
Display, in real time:
- Cells: 256 × 128
- Zoom: …%
- Cell: Ln …, Col … (hover cell)
- Pan: x …, y … in cell units, with consistent sign convention:
  - Pan right by one cell width → x = +1
  - Pan left by one cell width → x = -1
  - Pan up by one cell height → y = +1
  - Pan down by one cell height → y = -1
Note: because zoom is centered (or anchored at pointer), even without active panning the grid origin shifts during zoom, so “pan units” must reflect the effective transform, not just raw panX/panY.

### Rationale
**Pointer-anchored zoom** matches mainstream CAD / map / schematic UX: users zoom into the region they are looking at, where the cursor is.
**Bounded pan** prevents disorientation and “lost canvas” situations, especially at high zoom factors.
**Telemetry** provides immediate feedback for precision work (documentation, scripting, collaboration, and debugging gesture logic).

### Consequences
- (+) Faster inspection workflow: users can zoom into a detail without pre-centering it.
- (+) Reduced “navigation churn”: fewer alternating pan/zoom gestures.
- (+) Users can’t lose the grid completely; recovery is always possible without reset.
- (+) Visible telemetry improves spatial awareness and helps validate transformations.
- (-) Implementation complexity increases: zoom must adjust pan to preserve a chosen anchor point; pan offsets must be derived from the full transform (especially when zoom is not around the origin).
- (-) Requires careful coordination with trackpad gestures (wheel pan vs ctrlKey pinch-zoom) and with the existing paste/CLI sidebars so input focus and gesture routing remain predictable.

### Implementation notes
- **Anchored zoom math:** when changing scale from s0 → s1, adjust pan so the world point under the pointer stays fixed in screen space.
- **Clamp rule:** apply clamp after any pan update (drag-pan, wheel-pan) and after zoom (since effective extents change).
- **Telemetry:** compute pan offsets in cell units based on the effective screen-space position of the grid origin after applying the current transform; do not assume raw panX/panY remain valid under center-zoom.
- **UI polish:** ensure terminal/container scrollbars do not reserve persistent track width (overflow-y: auto vs scroll) to avoid visual artifacts next to the sidebar.


---

## ADR-034: Debug/Production separation and developer UX improvements

**Date:** 07-Feb-2026 (v1.06–v1.07)**Status:** Accepted**Context:** After usability and gesture improvements (ADR-033), development started to require quicker diagnosis of parsing, tool state, and event/gesture edge cases. Production builds should remain lean and avoid debug-only overhead, while debug builds should maximize visibility and reduce friction when reproducing issues (including when using URL arguments).

### Decision

Introduce an explicit **Debug vs Production** workflow split:

1. **UI toggle: `D🐞`** (read:debug)
   - Add a Tools button **D🐞** to quickly switch between Production and Debug experience without changing code manually.
   - Goal: make the “debug loop” fast and accessible.

2. **Sanity checks only in Debug mode**
   - Sanity checks are executed only when debug mode is enabled.
   - Production mode avoids runtime overhead and avoids “debug noise” in logs.

3. **Exclude sanity-check code from the one-file distro**
   - Update the distro build workflow (`inline.cjs`) so `bAsciiCAD_SanityCheck.js` is excluded from the distribution using the token **`ExcludeFromDistro`**.
   - Goal: keep the dist HTML smaller and reduce shipped surface area.

4. **CLI debug affordance: link to parsing visualizer**
   - In Debug mode, the CLI proposes a link to a lab tool: **CMD_tool.html** (visual parsing result debugger).
   - Goal: shorten time-to-root-cause for command parsing and statement/argument tokenization.

5. **Upgrade `AsciiCAD_debug` wrapper**
   - Provide direct links to key source code references (fast navigation for developers).
   - Make the log panel **scrollable** and **user-resizable**.
   - Provide a direct path back to the non-debug version (`index.html`).
   - Forward URI arguments into the iframe-loaded `index.html` to reproduce issues using query parameters.  This enables saving a dedicated permalink for debug mode.
   - Inform the app about debug state by loading `index.html?bDebug=true`.

### Rationale

- Debug work benefits from maximum observability (parsing visualization, sanity checks, rich logs).
- Production builds should prioritize small size and predictable behavior (no debug-only dependencies).
- A one-click toggle reduces friction and encourages frequent sanity-check use without burdening normal usage.

### Consequences

- (+) Faster debugging and triage (especially parsing/CLI issues and state bugs).
- (+) Clear separation between production UX and developer UX.
- (+) Smaller and cleaner distribution artifact (excludes sanity-check code).
- (+) Easier reproduction of issues via forwarded URL arguments.
- (-) Two “entry points” to maintain (`index.html` and debug wrapper).
- (-) Requires discipline to keep debug-only hooks out of production paths.

### Notes

- Debug mode is treated as an **opt-in** developer experience; the default user path remains production.
- The `ExcludeFromDistro` token provides a lightweight, maintainable way to keep dist files lean without complex build tooling.

---

### Work in progress
- [x] 1. Decommission old CADScript parser
- [x] 2. Mode 'TERMINAL COMMAND HANDLER' from index.html --> CMD_helpers.js (prep for nr 3)
- [x] 3. Allow calling terminal commands in CADScript <pre>CADScript {oCMD.run("clear")}</pre>
- [x] 4. Use by less heavy compression/decompression codec than Pako --> found LZSS after experimentation with <a href="../tools/codecTool.html">codecTool</a>, turns out almost 38KB smaller and code is more readable
- [x] 5. Integrate new CADScript functions:  catalog list, place catalog item, blank box, text(string)  - v1.13
- [ ] 6. Integrate new CADScript functions: line(override) and line (resolve), move/copy
- [x] 7. Extend self-help documentation: display syntax and usage in an Ascii table - AsciiTable() became factually a generic function 
- [x] 8. One single zone-sensitive pasteSink (instead of 3 confusing event handlers), pasteSink anchor placed in the center and clipped when navigating over the grid edges
- [x] 9. Netlist builder: report netlist in JSON format in Terminal, color nets onmouseover and identify real-time the net number in button sidebar (canvas card). v1.15
- [ ] 10. Conceptualise bridges (connectors)
- [x] 11. CADScript { oTERM.printJSON( oASC.qryLocate(_regexp_) ); }  (also fixing function call precedence with await)
- [x] 11. CADScript {oTERM.print(getCell(2,2,2))}
- [x] 12. CADScript {oASC.putCell(0,0,"TEST\nABCD")}
- [x] 13. CADScript {vars.STR = getCell(0,2,3,E)}
- [x] 14. abort pasteDrag when user is pressing the 'esc' key
- [ ] Extend oASC.cat() parameter to prefill wildcard characters in labels
         example:   cat(0,0,0,'ATTiny85_MCU_ATTINY85V-10PU'); (getLabel(0,0,"label>>","loc>>")) oTERM.prompt("?",">>label","####",true); (setLabel("label",">>loc"))
- [x] CADScript promptInput() -> demonstrate how to process user input
- [ ] CADScript pushPrompt() / pushPrompt() -> True nested prompt behavior
- [ ] Write a gentle sanityCheck for each CADScript command
- [x] Replace doUndo, doRedo, resetUndo and getUndoRedo by stack(<arg>)  - "undo", "redo" , "reset", "get"
---

## Summary of Key Design Principles

1. Simplicity: No frameworks, vanilla JavaScript
2. Purposeful: Optimized for electronic schematics in code
3. Portability: Plain text format for easy embedding
4. Professional: Intelligent line merging, component catalog
5. User-Friendly: Visual feedback, undo/redo, familiar shortcuts
6. Extensible: Catalog system, organized tools, clear architecture
7. Visual Clarity: Highlighting for structure and component matching


## Future Considerations
Based on the prompts, areas for potential future development:

1. Mobile: Touch-optimized interface
2. Component Catalog: Expanded library
2. Templates: Pre-built schematic patterns
3. Search: Find components in diagram
