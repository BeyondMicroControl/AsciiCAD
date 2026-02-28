# Design strategy

## Table of contents

- [Design strategy](#design-strategy)
- [Policy design](#policy-design)
  - [Specialisation layers](#specialisation-layers)
  - [Normative language and scope](#normative-language-and-scope)
  - [Policy terms (reconciled and expanded)](#policy-terms-reconciled-and-expanded)
- [AsciiCAD policy](#asciicad-policy)
  - [Grid Cell](#grid-cell)
  - [Wire](#wire)
  - [Component](#component)
  - [Box](#box)
  - [Label](#label)
  - [Exterior Netline](#exterior-netline)
  - [Interior Netline](#interior-netline)

In January 2026, the idea to develop AsciiCAD was born. As deceiving as it may sound; AsciiCAD was never aiming at becoming a serious application, but was built with serious intent nonetheless.

While mainstream applications, and certainly Computer Aided Design tools are made of **vertical layers** (the complexity makeup, ruled by functions) and **horizontal pillars** (the multimodal makeup or data), our experiment collapses the horizontals and simplifies the foundation, hoping this way (that's our hypothesis) achieving maturity more quickly.

That collapse is not an accident, but a deliberate strategy—quoting the opening statement for this project: “designed as a ‘digital essay’ on fast-tracking complexity by strategising bare-bones simplicity at its conception.”

With collapsing the horizontals, we refer to 'business data' usually living in applications, over three different datasets:
- a dataset tailored for graphical representation and human-machine interfacing
- an internal dataset allowing application functions to make internal process decisions or algorithmic operations
- one or more datasets tailored for interoperability with other compatible applications or systems

In AsciiCAD, we collapse these three layers into just one, allowing just one definition and one policy to do the heavy lifting.

Having only **one representation layer** to worry about brings a practical advantage: it concentrates effort where it matters most—on precise, high-quality policy writing and on forging detailed, shared agreements about interpretation and formatting. Those agreements or policies become the fertile ground for “protocols” that make the system scale.

This matters because AsciiCAD’s strategy for reaching higher complexity is not to multiply parallel abstractions, but to build only understandable layers on top of each other that support complexity at scale:
- start with a stable, minimal base (grid of glyphs)
- define systematic interpretation rules (policy document)
- then add features that compose on top of those rules (netlist, matching, labels, tooling)

# Policy design

Having only one representation layer literally implies **what you see is what you get**; and once wires and components are visually arranged in a 2D grid, this framework needs an accurate recipe across multiple specialisation layers to make correct assumptions on what one gets from what one sees.

This is where both *generation of visual structures* and *meaning extraction* demand a **consistent policy, applicable in both directions**.

It defines these meanings in a precise, testable way, especially for connectivity:
- which glyphs count as wires and why
- how nets are traced
- how crossings and junctions are interpreted
- how catalog components interact with linking wires (pins/protrusions, net labels)
- what is reported in a netlist output and why

The CAD concept implies two fundamental building blocks: wires and components. As wires are supposed to go from everywhere to everywhere, we need a **global policy** to describe their role, behavior and validation criteria. Components however are locally confined elements where a **local policy** may be more suitable. We can use the flexibility of a local policy to overcome rigid wiring rules that are difficult to apply, let alone generalise within the tight inner space typically given to a component.

As our design strategy pursues a blueprint for Computer Aided Design (CAD) applicable in many different specialisations (electronics, architecture, mind mapping, …), we need a solid foundation allowing predictable interpretation that:
- users can learn
- the codebase can maintain
- future features can extend without breaking existing drawings

<br>

## Specialisation layers

             ┌────────────────────────────────┐     Specialisation
             │            Grid Cell           │          │  │
             └────┬──────────────────┬────────┘          │  │
             ┌────┴───┐   ┌──────────┴────────┐          │  │
             │  Wire  │   │ Component  / Box  │          │  │
             └────┬───┘   └─────┬──────────┬──┘          │  │
     ┌────────────┴─────────┐ ┌─┴──────────┴─────────┐   │  │
     │                      │ │                      │   │  │
     │   Exterior Netline   │ │   Interior Netline   │   │  │
     │lineEnd/Junction/Label│ │compEnd/Junction/Label│   │  │
     └────────────┬─────────┘ └───────────┬──────────┘   │  │
    ┌─────────────┴───────────────────────┴──────────┐   │  │
    │                                                │  ─┘  └─
    │                CAD DOMAIN                      │  \    /
    │  e.g. electronics/architecture/mind mapping... │   \  /
    └────────────────────────────────────────────────┘    \/


## Normative language and scope

This document is a **requirements / policy specification** for **detecting** and **interpreting** schematic features on a 2D **UTF‑8 (Unicode)** character grid.

- **must / must not / should / may** are used with their common RFC-style meaning (lowercase to improve readability).
- All rules in this document are **about detection and interpretation**, not about UI rendering.

**Single representation layer:**
All meaning is derived from the grid itself, plus a *catalog* (for components). No separate geometric model is assumed.


## Policy terms (reconciled and expanded)

This document groups rules under a small set of core terms:
**Grid Cell**, **Wire**, **Component**, **Box**, **Label**, **Exterior Netline**, **Interior Netline**.

For each term we specify:
- Formal definition
- Classification / detection requirements
- Derived artefacts (sets / JSON)
- Edge cases and invariants
- Known gaps / decision points (explicitly called out)

`(*)` indicates a novelty or future feature not yet implemented.

---

# AsciiCAD policy

## Grid Cell

### Definition

A **grid cell** is the atomic unit of AsciiCAD’s single representation layer, which must contain **exactly one Unicode code point** (including space).

### Parsing a source text into a grid

Given an input text file:

1) The implementation must normalise line endings to `\n` (LF).  
2) The grid must be formed by splitting on `\n` **without** keeping the newline characters.  
3) Let `H = number of lines`. Let `W = max code-point length of any line`.  
4) The in-memory grid must be a rectangle of size `H × W`:
   - A line shorter than `W` must be padded on the right with ASCII space `' '` cells.
   - A line longer than `W` is impossible by definition; `W` is the maximum observed.

**Rationale:** schematics rely on fixed columns; trimming would destroy alignment.

### Coordinates and keys

- Coordinates must be **0-indexed** integers: `r ∈ [0..H-1]`, `c ∈ [0..W-1]`.
- The canonical stable identity of a cell must be the string key `"r,c"` (row-major).  
- Any “x,y” telemetry may be used in UI (x=column, y=row), but must not change internal semantics.

### Cell classes (foundational)

Every cell falls into exactly one of these classes for the purpose of this document:

1) **Space**: glyph is `' '` (U+0020)  
2) **Wire glyph**: `wireMask(glyph) != 0` (see Wire)  
3) **Component glyph**: covered by a matched component instance footprint (see Component)  
4) **Box glyph**: part of a valid box border or interior (see Box)  
5) **Label glyph**: participates in a label object (see Label)  
6) **Other**: everything else (ignored by net detection unless later specialised)

**Important precedence rule (must):**
- Component detection and Box detection must run **before** label and exterior-net tracing, because they define exclusion areas.

### Testing a cell

    CADScript { freeform(0,0,'+') }    // place a '+' character at grid location (0,0) 

---

## Wire
### Definition

A **wire** is any glyph that provides **orthogonal** connectivity between grid cells **for net tracing**.

Connectivity is defined entirely by a 4-bit directional mask per glyph:

- `N = 0b0001` (connects to cell at `(r-1, c)`)
- `E = 0b0010` (connects to cell at `(r, c+1)`)
- `S = 0b0100` (connects to cell at `(r+1, c)`)
- `W = 0b1000` (connects to cell at `(r, c-1)`)

### `wireMask(glyph)`
The implementation must provide a deterministic function:

`wireMask: (glyph: Unicode code point) -> 0..15`

Rules:
- If `wireMask(glyph) == 0`, the glyph must be treated as **non-wire** for net tracing.
- If `wireMask(glyph) != 0`, the glyph must be treated as a **wire glyph**.
- Unknown/unmapped glyphs must yield mask `0`.

### Minimum required mapping table

The following glyphs must be supported at minimum, with the masks shown.

| light<br>line<br>glyph | heavy<br>line<br>glyph | fallback<br>ASCII<br>glyph | mask |
|:-----:|:----:|:----:|:----:|
|  `─`  | `━`  | `-`  | E\|W |
|  `│`  | `┃`  | `\|` | N\|S |
|  `┌`  | `┏`  | `+`  | E\|S |
|  `┐`  | `┓`  | `+`  | S\|W |
|  `└`  | `┗`  | `+`  | N\|E |
|  `┘`  | `┛`  | `+`  | N\|W |
|  `├`  | `┣`  | `+`  | N\|E\|S |
|  `┤`  | `┫`  | `+`  | N\|S\|W |
|  `┬`  | `┳`  | `+`  | E\|S\|W |
|  `┴`  | `┻`  | `+`  | N\|E\|W |
|  `┼`  | `╋`  | `+`  | N\|S\|E\|W |
|  `╴`  | `╸`  | `-`  | W |
|  `╶`  | `╺`  | `-`  | E |
|  `╵`  | `╹`  | `\|` | N |
|  `╷`  | `╻`  | `\|` | S |



### Interaction with boxes
Pure double-line box-border glyphs are not treated as wires. Mixed box-border connector glyphs may contribute to net tracing only via their single-line protrusions; see **Box** for details.

### Wire adjacency (wire-to-wire)

Two orthogonally adjacent cells `(r,c)` and `(r+dr,c+dc)` connect iff:

1) `wireMask(g0)` includes the direction `(dr,dc)` from the first cell to the second, AND  
2) `wireMask(g1)` includes the reciprocal direction back.

No diagonal connections are allowed.

### Wire graph degree and derived terms

Let `deg(cell)` be the number of connected neighbors (0..4) after adjacency is computed.

- A **Line End** (`LE`) is a wire cell with `deg == 1`.
- A **Line Junction** (`LJ`) is a wire cell with `deg >= 3`.

A wire cell with `deg == 2` is a normal run/turn, not an end and not a junction.

### Crossing without junction (canonical aliases only)
A **non-junction crossing** is permitted **only** in the following explicit canonical 1×3 patterns:

`─│─`  `─┃─`  `━│━`  `━┃━`

(Where the middle cell is a **pure vertical** glyph and the side cells are the same **pure horizontal** glyph.)

#### Detection rule
A cell `p` is a crossing center iff all conditions hold:

1) `grid[p] ∈ { "│", "┃" }` (pure vertical only)
2) `grid[left(p)] == grid[right(p)] ∈ { "─", "━" }` (pure horizontal only, both sides same)
3) `wireMask(grid[up(p)])` and `wireMask(grid[down(p)])` include the reciprocal vertical directions to/from `p`
   (so the vertical line is truly continuous through `p`)

No other variations are allowed.

#### Connectivity rule
If `p` is a crossing center per the rule above:

- Horizontal adjacency must treat `p` as **transparent**:
  - connect `left(p)` ↔ `right(p)` if they reciprocate,
  - and must not connect `left(p)` ↔ `p` nor `right(p)` ↔ `p`.

- Vertical adjacency must treat `p` as a normal vertical wire cell:
  - connect `p` ↔ `up(p)` and `p` ↔ `down(p)` if reciprocal.

If `p` is not a crossing center, no transparency is allowed (i.e. a vertical wire glyph does not automatically permit
horizontal bridging).

## Component
### Definition

A **component** is a catalog-defined 2D template (“sprite”) placed on the grid.

At the net-policy level, a component instance is treated as:
- a bounded set of occupied cells (its **body footprint**)
- a set of **component ends** (`CE`) where exterior nets attach
- optional label slots, and optional net-label identity

### Component catalog
A component catalog entry must provide at minimum:
- `uid` (stable ID)
- `type` (e.g. `"MCU"`, `"R"`, `"Net"`, …)
- `name` (human-readable)
- `template` (2D grid of glyphs, including spaces)
- `rotations` allowed (set of 0/90/180/270 degrees; at least `{0}`)
- optional: `pin_data` (explicit pins), `label_slots`, `bridge_map` (*)

### Template semantics (glyph classes inside templates)

In a component template, each cell glyph is interpreted as one of:

1) **Spacer**: ASCII space `' '`  
   - must be ignored for footprint, masking, and matching constraints (it matches anything).

2) **Fixed glyph**: any non-space glyph that is not a wildcard  
   - must match exactly the same glyph in the design grid.
   - Fixed wire-drawing glyphs, if present, are treated as *component art*, not as exterior wiring.

3) **Component-end wildcard**: `§` (must)  
   - `§` must match **exactly one wire glyph** in the design grid (i.e. `wireMask(gridGlyph) != 0`).
   - `§` must not match space.
   - `§` must be used **only** to represent a **flexible component end** (pin/protrusion zone).
   - A `§` position must be orthogonally adjacent to at least one fixed (non-space, non-label-slot) template glyph cell.  
     (This guarantees ends lie on the component perimeter.)

4) **Label-local wildcards**: `#`, `$`, …  
   - must only be legal inside **label slots** and must not participate in component geometry.

### Matching policy
A component instance exists at location `(r0,c0)` if, for some allowed rotation, all template cells satisfy their matching rule against the design grid at that placement.

Matching must be deterministic:
- Same input grid + same catalog must yield the same set of matches.

### Validity constraint: overlap resolution
The **final** detection output must contain **no overlapping component bodies** (including box-defined components).

However, the matching/detection stage may produce overlapping or nested *candidates* (e.g. a box inside a larger box,
or a catalog component inside a larger catalog component). In that case the implementation must resolve overlaps
deterministically so downstream steps remain well-defined.

**Winner selection (must):**
- When two candidates overlap in their **body footprint** (`componentFootprintSet`), the winner must be the candidate with
  the larger footprint area (`|componentFootprintSet|`).
- Nested candidates are therefore resolved by keeping the larger/outer candidate.

**Tie-break (must):**
1) Larger `|componentFootprintSet|`.
2) If tied, lexicographically smaller `(rMin,cMin)` of the candidate’s body bounding box.
3) If still tied, lexicographically smaller `uid`.

The implementation must emit a diagnostic listing all discarded candidates and the winner(s).

### Derived sets per matched component instance
For a matched component instance, derive the following sets of cell keys `"r,c"`:

1) `componentFootprintSet` (**body footprint**)  
   - All template positions where template glyph is a **fixed glyph** (non-space, non-label-slot, non-`§`).  
   - must exclude all label-slot positions.  
   - must exclude all `§` positions.

2) `netTraceMaskSet` (**net blocking mask**)  
   - In current policy, this must be identical to `componentFootprintSet`.  
   - Rationale: exterior nets are traced after filtering out the component body, but **not** its ends.

3) `matchHighlightSet` (**visual match highlight**)  
   - Cells highlighted as a stable part of the component’s shape.  
   - must include all fixed glyph positions in the template.  
   - must exclude spaces, all label slots, and all `§` positions.

4) `componentEndSet` (**end/perimeter cells**)  
   - All grid cell coordinates corresponding to `§` positions in the template (after placement + rotation).  
   - Every cell in `componentEndSet` must be a wire cell in the grid (`wireMask != 0`).  
   - Every cell in `componentEndSet` must be orthogonally adjacent to at least one cell in `componentFootprintSet`.

> These sets correspond to the legacy names `footprintSet`, `solidSet`, and `greenSet`, except that `§` is now unambiguously treated as an end and excluded from footprint/masking/highlight.

### Component Ends (`CE`)
A **Component End** (`CE`) is any cell in `componentEndSet`.

Policy meaning:
- A `CE` is **part of the exterior netline geometry** (it is a wire cell).
- A `CE` is also an attachment point owned by exactly one component instance.

Consequences:
- A cell may be simultaneously classified as `CE` and `LE`/`LJ` (depending on degree).
- `CE` cells must not be removed during exterior net tracing.

### Net-label components (`type == "Net"`)
Some catalog components represent a logical net label. If `type === "Net"`:

- The component instance must be considered a **NetLabel source** for net merging (see Exterior Netline).

#### `LabelID` extraction
Given the (rotation-aware) template glyph grid:

1) Concatenate all glyphs into a string in row-major order.
2) Remove:
   - whitespace/newlines
   - the `§` glyph
   - any glyph with `wireMask(glyph) != 0`
3) The remaining string is `LabelID`.
4) If `LabelID` is empty, fallback to catalog `name`.

### Component Bridge Map (*) (future)

Some components tie multiple ends together internally (jumpers, connectors, etc.). Instead of tracing internal art, AsciiCAD may use a per-component bridge policy:

**Bridge Map contract (proposed):**
- Input: a matched component instance and its detected CEs.
- Output: a list of groups, each group is a list of CE identifiers that are internally connected.

Example:
- `[[CE1, CE2], [CE3, CE4, CE5]]`

Pin identity should come from explicit `pin_data` when available; otherwise from CE coordinates.

---

## Box
### Definition

A **box** is a non-catalog container defined by a **double-line, axis-aligned rectangular outline**.

Boxes exist to:
- delimit a rectangular area where local policy applies (grouping / sub-circuit / note region)
- provide controlled “ports” on the border for net connectivity (via mixed glyphs)

A box must be detectable directly from the grid.

### Dual semantics: box-border vs net-wire

Box borders are drawn with **double-line** glyphs (and some **mixed** glyphs that include single-line protrusions).

- For **box detection**, border connectivity must be validated using **double-line connectivity** (“box connectivity”).
- For **net tracing**, border glyphs must not become wires **except** for the single-line protrusions of the mixed connector glyphs (handled via `wireMask` in Wire).

### Box-border glyphs and net tracing
All **pure double-line**  glyphs must have `wireMask == 0` as they won't participate in any wiring:
- `═ ║ ╔ ╗ ╚ ╝ ╠ ╣ ╦ ╩ ╬`

**Rationale:** boxes are detected as container borders and must not accidentally become exterior nets.

### Box-border connector glyphs (mixed double + single)
Certain **box-border** glyphs include **single-line** protrusions and are allowed to participate in net tracing **only via those single-line protrusions**.

For these glyphs, `wireMask` must reflect **only** the single-line portions (the double-line portions are ignored for net tracing):

`╢`:`W`&nbsp;&nbsp;&nbsp;`╟`:`E`&nbsp;&nbsp;&nbsp;`╧`:`N`&nbsp;&nbsp;&nbsp;`╤`:`S`&nbsp;&nbsp;&nbsp;`╫`:`E|W`&nbsp;&nbsp;&nbsp;`╪`:`N|S`

These glyphs are *also* used by Box detection (see Box).

### Allowed border glyph set

A valid box border may use only the following glyphs:

| Category | Glyphs | Notes |
|---|---|---|
| Pure double-line border (not wires) | `═║╔╗╚╝╠╣╦╩` | Used to form a rectangle perimeter (see edge predicates). |
| Mixed double+single connector glyphs | `╢╟╧╤╫╪` | Double-line part contributes to box detection; single-line part may connect to nets via `wireMask`. |
| Explicitly disallowed | `╬` | If present on a candidate perimeter, the rectangle is rejected as a box. |
### `boxMask(glyph)`
The implementation must provide a deterministic function for box detection:

`boxMask: (glyph: Unicode code point) -> 0..15`

Interpretation:
- `boxMask` encodes **double-line** border connectivity only.
- Unknown/unmapped glyphs must yield mask `0`.

Required mappings:

| Pure double-line<br>(only straigt and corner parts) | Mixed connectors<br>(double part only) |
|:---:|:---:|
| `═` \: `E\|W` | `╢` \: `N\|S` |
| `║` \: `N\|S` | `╟` \: `N\|S` |
| `╔` \: `E\|S` | `╧` \: `E\|W` |
| `╗` \: `S\|W` | `╤` \: `E\|W` |
| `╚` \: `N\|E` | `╫` \: `N\|S` |
| `╝` \: `N\|W` | `╪` \: `E\|W` |

`╬` must not be used for boxes, even though it has a well-defined double mask.

### Box detection algorithm
The implementation must provide a deterministic detection algorithm.

**Key constraint (must):**  
A box border is defined by **double-line** connectivity *along* the rectangle perimeter.  
Perpendicular crossings over that border are permitted **only as single-line** protrusions.

Therefore, perimeter scanning must reject any cell on an edge (excluding corners) that contains a **double-line**
protrusion perpendicular to that edge (e.g. `╦`, `╩`, `╠`, `╣`, `╬`). Mixed glyphs that provide only **single-line**
perpendicular protrusions (e.g. `╤`, `╧`, `╪`, `╢`, `╟`, `╫`) are allowed.

#### Edge predicates
Let `g` be a glyph.

- `isTopOrBottomEdgeCell(g)` is true iff:
  - `boxMask(g)` includes `E|W`, AND
  - `boxMask(g)` does **not** include `N` and does **not** include `S`.

- `isLeftOrRightEdgeCell(g)` is true iff:
  - `boxMask(g)` includes `N|S`, AND
  - `boxMask(g)` does **not** include `E` and does **not** include `W`.

#### Minimal compliant algorithm
1) Enumerate candidate top-left corners `╔`.
2) For each candidate `(r0,c0)`:
   - Scan right from `(r0,c0+1)` until a `╗` is found at `(r0,c1)`.  
     Every visited intermediate cell `(r0,c)` with `c0 < c < c1` must satisfy `isTopOrBottomEdgeCell(grid[r0,c])`.
   - Scan down from `(r0+1,c0)` until a `╚` is found at `(r1,c0)`.  
     Every visited intermediate cell `(r,c0)` with `r0 < r < r1` must satisfy `isLeftOrRightEdgeCell(grid[r,c0])`.
   - The bottom-right corner must be `╝` at `(r1,c1)`.

3) Validate the entire perimeter (excluding corners):
   - Top edge interior cells `(r0, c0+1..c1-1)` must satisfy `isTopOrBottomEdgeCell`.
   - Bottom edge interior cells `(r1, c0+1..c1-1)` must satisfy `isTopOrBottomEdgeCell`.
   - Left edge interior cells `(r0+1..r1-1, c0)` must satisfy `isLeftOrRightEdgeCell`.
   - Right edge interior cells `(r0+1..r1-1, c1)` must satisfy `isLeftOrRightEdgeCell`.
   - Corners must be exactly `╔`, `╗`, `╚`, `╝`.

4) Reject if any perimeter cell contains a glyph outside the Allowed border glyph set, or if any perimeter cell is `╬`.

5) Define:
   - `boxBorderSet` = all perimeter cell coordinates
   - `boxInteriorSet` = all cells `(r,c)` where `r0 < r < r1` and `c0 < c < c1`

#### Overlap resolution for detected boxes
Detection may find nested/overlapping box *candidates*. The final accepted box set must be **non-overlapping**.

If two detected boxes overlap in their `boxBorderSet ∪ boxInteriorSet`, the winner must be chosen deterministically:

1) Prefer the larger box by area `(r1-r0+1) * (c1-c0+1)`.
2) If tied, prefer the one with lexicographically smaller top-left `(r0,c0)`.
3) If still tied, prefer earlier detection order (row-major scan).

All discarded boxes must be reported in diagnostics.

### Box ports (`BP`)
A **box port** is a border cell that participates in net tracing via a single-line protrusion:

- `BP` = `{ cell ∈ boxBorderSet | wireMask(gridGlyph(cell)) != 0 }`

Port connectivity is defined by the normal net rules (Wire):
- a wire inside the box can connect to the port only if the port’s `wireMask` includes the inward direction and the neighbor wire reciprocates
- a wire outside the box can connect to the port only if the port’s `wireMask` includes the outward direction and the neighbor wire reciprocates

**Two-sided ports (feedthrough):**
- If a border cell’s `wireMask` includes both directions across the border (e.g. `E|W` on a vertical edge, or `N|S` on a horizontal edge), then nets may pass from exterior region to interior region through that port cell.
- If a border cell’s `wireMask` includes only one side, nets may terminate at that border (but cannot pass through).

### Relationship to component policy (clarification)

Boxes serve a similar “diagram role” as catalog components (they reserve area, impose local policy, and have perimeter ports),
but they are detected from the grid, not from a catalog template.

---

## Label

### Definition
A **label** is semantic text stored on the grid that does **not** participate in geometry:
- label cells must not participate in component masking (`componentFootprintSet`, `netTraceMaskSet`), and
- label cells must not participate in wire connectivity (`wireMask` / `boxMask`).

All label-related cells must be collected into `labelCellSet` and excluded from the masking/tracing sets.

### Label kinds
There are only two label kinds that exist in the **exterior space**:

1) **Component labels** (renamed from “catalog-defined labels”)  
2) **Net-labels** (materialised as catalog components with `type == "Net"`)

The **interior space** (within a component body) may also contain labels:
- Component labels (same rules as exterior), and
- **Component-end labels** (`CE labels`, also called pin labels), which are direction-sensitive (specified below).

### Component label syntax and detection
A component label is a **single-row** bracketed sequence:

`[<text>]`

Rules:
- `[` and `]` must be on the same row.
- `<text>` must contain at least one 7-bit ASCII character (codepoints `0x20..0x7E`) and may include spaces.
- The extracted label text is `<text>` with leading/trailing spaces trimmed, and must contain at least one non-space
  character to be accepted.
- Bracketed labels must not overlap. The first `]` to the right closes the label.

The cells of `[` + `<text>` + `]` must be added to `labelCellSet`.

#### Component label anchor
Let `[` be at `(r,cL)` and `]` at `(r,cR)` with `cL < cR`.

Define the label anchor point in **half-cell coordinates** as:

- `labelAnchor = (r + 0.0, (cL + cR) / 2)`

(So the anchor can have a `.5` column coordinate.)

### Component label association
Each detected component label must be linked to exactly one **eligible** component instance (catalog component or
box-defined component) by **nearest-anchor**.

#### Component anchor
For any component instance, define:

- `componentAnchor = ((rMin + rMax) / 2, (cMin + cMax) / 2)` in half-cell coordinates,

where `(rMin,rMax,cMin,cMax)` is the bounding rectangle of its `componentFootprintSet` (after excluding `labelCellSet`
and component ends).

#### Distance metric and tie-break
- Distance is Manhattan distance on half-cell coordinates:
  - `dist = abs(rL - rC) + abs(cL - cC)`

Tie-break ordering (deterministic):
1) Smaller `dist`
2) Larger `|componentFootprintSet|`
3) Lexicographically smaller `uid`

Eligibility constraint (must):
- Net-label components (`type == "Net"`) must not be eligible targets for component labels.

If no eligible component exists, the label must be reported as an `OrphanComponentLabel` diagnostic and must not be
attached to any component.

### Net-labels
A **Net-label** is produced only by a matched catalog component instance with `type == "Net"`.

- Its extracted label ID/text must be used to merge exterior nets (see Component: Net-label components and Exterior Netline).
- Net-label component cells belong to the component footprint policy; their label text itself is still a label and must be
  excluded via `labelCellSet`.

- For `labelCellSet`, the **label-text cells** of a Net-label component instance must be derived the same way as `LabelID` extraction:
  - include any cell whose glyph is not whitespace, is not `§`, and has `wireMask(glyph) == 0`
  - (i.e. the remaining non-wire glyphs that contribute to the `LabelID` string)

### Component-end labels (`CE labels` / pin labels)
A **CE label** is a direction-sensitive label associated to a **component end** located on a **closed double-line**
component border.

Applicability:
- CE labels apply only to components (catalog or box-defined) featuring a closed double-line box border.

#### Eligible protrusion glyphs
A component end on a double-line border may be represented by:

- Left edge protrusion: `╢` or `╫`
- Right edge protrusion: `╟` or `╫`
- Top edge protrusion: `╧` or `╪`
- Bottom edge protrusion: `╤` or `╪`

These protrusion cells are component-end (`CE`) cells and may coincide with `LJ`/`LE` tagging (see Wire).

#### CE label extraction
**Horizontal CE labels** (left/right edges) accept multi-character strings.

Let ASCII7 be any character with codepoint `0x20..0x7E` (including space).

1) Left edge (`╢` / `╫`) at `(r,c)`:
   - scan right starting at `(r,c+1)`
   - collect consecutive ASCII7 characters
   - stop when:
     - a non-ASCII7 character is encountered, OR
     - two consecutive spaces `"  "` are encountered, OR
     - grid boundary is reached
   - strip trailing spaces from the collected string (including any terminating spaces)
   - accept only if the result contains at least one non-space character

2) Right edge (`╟` / `╫`) at `(r,c)`:
   - scan left starting at `(r,c-1)` with the same stop conditions
   - reverse the collected characters to obtain the label text
   - strip trailing spaces and accept only if it contains at least one non-space character

**Vertical CE labels** (top/bottom edges) are single-character only.

3) Top edge (`╧` / `╪`) at `(r,c)`:
   - if `(r+1,c)` exists and is ASCII7 and is **not a space**, the CE label text is exactly that one character
   - otherwise no CE label is present
   - vertically stacked multi-character labels are NOT allowed

4) Bottom edge (`╤` / `╪`) at `(r,c)`:
   - if `(r-1,c)` exists and is ASCII7 and is **not a space**, the CE label text is exactly that one character
   - otherwise no CE label is present

All CE-label character cells used by these rules must be added to `labelCellSet`.

#### CE label ownership
A CE label is a property of the **component end located at the protrusion cell**. It must be emitted as part of the CE artefact, e.g.:

- `CE.pinLabel: string | null`

### Label artefacts
A label artefact must minimally include:

- `kind`: `"ComponentLabel"` or `"NetLabel"`
- `text`: label text
- `anchor`: `(r,c)` in half-cell coordinates (for ComponentLabel)
- `owner`: component instance ID (for ComponentLabel) or net ID / LabelID (for NetLabel)
- `cells`: list of grid cell coordinates that contributed to the label

---

## Exterior Netline

### Definition

An **exterior netline** is the wiring graph traced on the grid **after excluding all component bodies** (component `netTraceMaskSet`).

Key clarifications:
- Component ends (`CE`, i.e. `§`-matched cells) are **not** excluded; they remain part of the traced net geometry.
- Box borders are not removed; they delimit regions because pure double-line border glyphs are **not wires** (`wireMask == 0`), except at explicit box ports.

### Inputs and filtering
Exterior net tracing must operate on a filtered view of the grid:

Exclude (treat as non-wire / space for adjacency purposes):
1) all cells in every component instance `netTraceMaskSet` (which equals `componentFootprintSet` in current policy)

Do NOT exclude:
- `CE` cells (`componentEndSet`)
- labels (labels do not affect net tracing)
- box borders (they remain, but most border glyphs have `wireMask == 0`)

Apply the canonical crossing rule (`─│─`) during adjacency evaluation (see Wire).

### Trace → attach → merge pipeline
Exterior netline discovery must follow this conceptual pipeline:

1) **Trace provisional nets**  
   Build a wire adjacency graph on the filtered grid and compute connected components. Each connected component is a **provisional net**.

2) **Derive LE/LJ sets**  
   For each provisional net:
   - `LJ` = wire cells with `deg >= 3`
   - `LE` = wire cells with `deg == 1`

3) **Attach Component Ends (`CE`)**  
   For each component instance:
   - For each `CE` cell coordinate in its `componentEndSet`, find the provisional net that contains that cell.
   - Record an attachment `(componentInstance, CEcell) -> netId`.

   Requirements:
   - Each `CE` must be owned by exactly one component instance.
   - A `CE` must attach to exactly one provisional net (possibly a single-cell net).

4) **Bridge within components (*)**  
   If a matched component provides a Bridge Map, provisional nets touching bridged CEs must be unioned.

5) **Merge by net labels (must for `type=="Net"`)**  
   If a provisional net attaches to a Net-label component with `LabelID`, then all nets attaching to Net-label components of the same `LabelID` must be unioned.

Union-find is the recommended structure for steps (4) and (5), but any deterministic equivalent is acceptable.

### CE adjacency edge-case
Components/boxes do not overlap, but component ends may be **directly adjacent**.

Policy requirement:
- The tracer must allow a cell to be simultaneously classified as `CE` and as `LE`/`LJ`.
- If a provisional net consists of exactly **two adjacent wire cells**, and both cells are `CE` cells owned by different components (or a component and a box port),
  then both cells must be reported as `LJ` (connection nodes) and must not be reported as `LE`, even though their graph degree is 1.

**Rationale:** this pattern represents a direct pin-to-pin connection and should be treated as a junction, not as two “dangling ends”.

### Derived netline artefact (JSON schema)

Each final netline must provide at least:

- `id`: stable net identifier (deterministic across runs)
- `cells`: list/set of all wire cell coordinates in the final net
- `LE`: list of line-end wire cell coordinates
- `LJ`: list of junction wire cell coordinates
- `CE`: list of component-end cell coordinates that belong to this net (the `§`-matched cells)
- `labels`: list of `LabelID` strings attached to this net via Net-label components (may be empty)
- `components`: list of component instance IDs touched by this net (for reporting)

If interior bridges are present, the netline report should also include a `CJ` list describing which component-internal ties contributed to unions (see Interior Netline).

### Invariants
- A wire cell belongs to at most one final netline.
- A `CE` cell belongs to exactly one component instance and at most one final netline.
- Every final netline must be a union of one or more provisional nets.
- Merging must be transitive and deterministic.

---

## Interior Netline

### Definition

An **interior netline** is a connectivity relation that is **created inside a component** (including a box-defined component), without requiring exterior wires to draw every internal tie explicitly.

Interior netlines exist to model **permanent pin-to-pin connectivity** that is intrinsic to a component instance, such as:
- connectors that internally tie pins (pin ↔ pin)
- jumpers / shunts (bridging nets when “on”)
- fixed wired adapters

Switches are a special case: they may be *stateful* rather than permanent, but they can still be handled by the same mechanism via a state-dependent transform (see below).

### Netline entry taxonomy (wire-graph reporting)

When reporting net structures, the following “entry” roles are used:

- `LE`: line ends (wire degree == 1) and wire→component terminations
- `LJ`: branching junctions (wire degree ≥ 3)
- `CE`: component-end cells (pins / protrusions) adjacent to wire, represented by the component-end wildcard `§`
- `CJ`: component-internal junctions / internal pin-to-pin connectivity derived from the component’s local policy

`CJ` is not a separate glyph class on the global grid; it is a **derived artefact** emitted by interior-net processing.

### Component Bridge Map

A **Component Bridge Map** is an **instance-level** description of internal electrical ties between component ends.

It is the formal output of interior-net processing.

**Input**
- a matched component instance (catalog index + rotation + placement)
- the instance’s detected `CE` pins (component-end cells)
- optional: instance-specific state (e.g. jumper on/off, switch position)

**Output (recommended group-based form)**

A list of CE groups, where each group is a set of pins that are electrically tied inside the component:

```json
[
  ["P1", "P2"],
  ["P3", "P4", "P5"]
]
```

**Alternative output (coordinate-based form, early implementation)**

```json
[
  [{"r":1,"c":8}, {"r":1,"c":11}],
  [{"r":5,"c":20}, {"r":6,"c":20}]
]
```

**Policy intent**
- Exterior net tracing discovers connectivity **outside components**.
- Bridge maps then create additional **unions** between those exterior nets.
- This avoids treating every character *inside* a component as global wiring, while still letting jumpers/connectors tie nets together.

### Local policy mechanism for deriving a Bridge Map

Each catalog component (and each box-defined component) may define an optional **local policy** that produces a Bridge Map.

The mechanism is deliberately shaped to reuse the **same net tracer** as exterior wiring.

#### Step 1 — Normalization: build a temporary internal grid

From the component’s rotated template `text_data[rotation]` (plus any instance text needed for labels), build a temporary internal grid:

- it uses the same `wireMask()` mapping table and adjacency rules as exterior tracing
- it reuses the same crossing canonical forms
- it treats `§` as “pin zone markers” (component ends) inside the local grid

The temporary grid is independent of the global grid: it exists only to compute interior connectivity.

#### Step 2 — Transform: rewrite symbol conventions into explicit wire glyphs

A local policy may specify a sequence of deterministic rewrite rules on the temporary grid.

Three transform primitives cover the known use cases:

**T1 — Placeholder-to-wire replacement**  
Replace placeholders by wire glyphs to make internal bridges traceable.

Examples:
- `# → ─`
- `● → ─`

**T2 — Pattern-based rewrite (“semantic normalization”)**  
Rewrite non-wire drawing conventions (e.g. `o`, `/`) into explicit wire glyphs.

Example (illustrative):
- `o─/ → ───┘`
- `/-o → ┌──`

**T3 — Conditional transform based on component state**  
Apply different rewrites depending on instance state.

Example (jumper):
- `●` (head on) → `─`
- `○` (head off) → `' '` (leave open)

All transforms must be:
- deterministic (same input → same output)
- local (operate only within the component’s temporary grid)
- explicitly enumerated per component type (no global heuristics)

#### Step 3 — Trace: run the net tracer on the temporary internal grid

Run the same connectivity tracer used for exterior nets, but with a local goal:

- identify which `§` positions belong to the same connected component in the temporary grid
- emit each connected pin group as one Bridge Map group

No global wires are involved at this stage.

### Applying Bridge Maps to exterior nets

After exterior nets are traced and `CE` attachments are known:

For each Bridge Map group:
1) collect the exterior net IDs attached to each member `CE`
2) if the group touches multiple distinct exterior nets, union them
3) record a `CJ` entry for reporting, so the final netlist explains *why* the union happened (component-internal connectivity)

This “bridge step” is transitive and should be implemented using union-find (or any deterministic equivalent).

### Interaction with Box-defined components

A drawn box can be treated as a component instance for interior-net purposes:

- the box border defines the component boundary
- mixed connector glyphs (`╢╟╧╤╫╪`) define `CE` pins
- the same local policy mechanism (temporary grid + transforms + trace) can be applied if the box type defines one

