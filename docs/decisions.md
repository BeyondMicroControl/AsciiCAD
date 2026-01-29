# Architectural Decision Records (ADRs) for AsciiCAD
## Project Overview
AsciiCAD is a browser-based ASCII drawing tool specifically designed for creating electronic and digital schematics that can be embedded directly in source code (particularly Arduino C++). It evolved from recognizing the complexity of existing tools like Asciiflow and the need for a simpler, more maintainable solution.

---

## ADR-001: No Framework/Library Dependencies
**Date**: Initial project inception\
**Status:** Accepted\
**Context:** Need for a lightweight, maintainable ASCII drawing tool\
**Decision:** Build the entire application using vanilla HTML/CSS/JavaScript without frameworks or libraries\
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
**Decision:** Implement a 2D array of characters where each grid cell contains exactly one character\
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
**Decision:** Implement grid cells with a 2:1 width-to-height aspect ratio\
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
**Decision:** Canvas borders correspond to browser window borders, providing full-screen drawing area\
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
**Decision:** Implement mouse/trackpad zoom (up to 1000%) and pan capabilities\
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
\
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
\
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
\
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
\
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
**Decision:** Allow selection origin to extend beyond grid boundaries; only trim content when committing to grid\
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
\
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
\
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
**Decision:** Support loading diagrams via URL parameter (?d=<encoded-data>)\
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
\
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
**Decision:** Display current cell coordinates in Canvas toolbar\
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
**Decision:** Expand grid to 256×128 cells (from original 128×128)\
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
\
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
\
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
\
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
\
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
**Decision:** Implement collapsible left pane for tools using Roboto font\
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
\
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
**Decision:** Use Map data structure to deduplicate stroke operations\
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
\
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
**Decision:** Use Roboto font family\
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
\
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
\
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
\
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
\
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

1. Refactoring: Unified tool lifecycle framework
2. Performance: Optimization for very large grids
3. Export: Additional format support (PNG, SVG)
4. Collaboration: Multi-user editing
5. Dark Mode: Alternative color scheme
6. Mobile: Touch-optimized interface
7. Component Catalog: Expanded library
8. Templates: Pre-built schematic patterns
9. Search: Find components in diagram
10. Layers: Separate annotation/component layers
