# Design strategy

In January 2026, the idea to develop AsciiCAD was born. As deceiving as it may sound; AsciiCAD was never aiming at becoming a serious application, but built with serious intent nonetheless.

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

# AsciiCAD policy
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

---

# Normative language and scope

This document is a **requirements / policy specification** for **detecting** and **interpreting** schematic features on a 2D **UTF‑8 (Unicode)** character grid.

- **MUST / MUST NOT / SHOULD / MAY** are used with their common RFC-style meaning.
- All rules in this document are **about detection and interpretation**, not about UI rendering.

**Single representation layer:**
All meaning is derived from the grid itself, plus a *catalog* (for components). No separate geometric model is assumed.

---

# Policy terms (reconciled and expanded)

This document groups rules under a small set of core terms:
**Grid Cell**, **Wire**, **Component**, **Box**, **Label**, **Exterior Netline**.

For each term we specify:
- Formal definition
- Classification / detection requirements
- Derived artefacts (sets / JSON)
- Edge cases and invariants
- Known gaps / decision points (explicitly called out)

`(*)` indicates a novelty or future feature not yet implemented.

---

## Grid Cell

### Definition

A **grid cell** is the atomic unit of AsciiCAD’s single representation layer.

A grid cell MUST contain **exactly one Unicode code point** (including space).

### Parsing a source text into a grid

Given an input text file:

1) The implementation MUST normalise line endings to `\n` (LF).  
2) The grid MUST be formed by splitting on `\n` **without** keeping the newline characters.  
3) Let `H = number of lines`. Let `W = max code-point length of any line`.  
4) The in-memory grid MUST be a rectangle of size `H × W`:
   - A line shorter than `W` MUST be padded on the right with ASCII space `' '` cells.
   - A line longer than `W` is impossible by definition; `W` is the maximum observed.

**Rationale:** schematics rely on fixed columns; trimming would destroy alignment.

### Coordinates and keys

- Coordinates MUST be **0-indexed** integers: `r ∈ [0..H-1]`, `c ∈ [0..W-1]`.
- The canonical stable identity of a cell MUST be the string key `"r,c"` (row-major).  
- Any “x,y” telemetry MAY be used in UI (x=column, y=row), but MUST NOT change internal semantics.

### Cell classes (foundational)

Every cell falls into exactly one of these classes for the purpose of this document:

1) **Space**: glyph is `' '` (U+0020)  
2) **Wire glyph**: `wireMask(glyph) != 0` (see Wire)  
3) **Component glyph**: covered by a matched component instance footprint (see Component)  
4) **Box glyph**: part of a valid box border or interior (see Box)  
5) **Label glyph**: participates in a label object (see Label)  
6) **Other**: everything else (ignored by net detection unless later specialised)

**Important precedence rule (MUST):**
- Component detection and Box detection MUST run **before** label and exterior-net tracing, because they define exclusion areas.

---

## Wire
### Definition

A **wire** is any glyph that provides **orthogonal** connectivity between grid cells **for net tracing**.

Connectivity is defined entirely by a 4-bit directional mask per glyph:

- `N = 0b0001` (connects to cell at `(r-1, c)`)
- `E = 0b0010` (connects to cell at `(r, c+1)`)
- `S = 0b0100` (connects to cell at `(r+1, c)`)
- `W = 0b1000` (connects to cell at `(r, c-1)`)

### `wireMask(glyph)` (MUST)

The implementation MUST provide a deterministic function:

`wireMask: (glyph: Unicode code point) -> 0..15`

Rules:
- If `wireMask(glyph) == 0`, the glyph MUST be treated as **non-wire** for net tracing.
- If `wireMask(glyph) != 0`, the glyph MUST be treated as a **wire glyph**.
- Unknown/unmapped glyphs MUST yield mask `0`.

### Minimum required mapping table (baseline)

The following glyphs MUST be supported at minimum, with the masks shown.

#### Light (single) lines
- `─` : `E|W`
- `│` : `N|S`
- `┌` : `E|S`
- `┐` : `S|W`
- `└` : `N|E`
- `┘` : `N|W`
- `├` : `N|E|S`
- `┤` : `N|S|W`
- `┬` : `E|S|W`
- `┴` : `N|E|W`
- `┼` : `N|E|S|W`
- `╴` : `W`
- `╶` : `E`
- `╵` : `N`
- `╷` : `S`

#### Heavy lines (treated as equivalent connectivity)
- `━` : `E|W`
- `┃` : `N|S`
- `┏` : `E|S`
- `┓` : `S|W`
- `┗` : `N|E`
- `┛` : `N|W`
- `┣` : `N|E|S`
- `┫` : `N|S|W`
- `┳` : `E|S|W`
- `┻` : `N|E|W`
- `╋` : `N|E|S|W`

#### ASCII fallbacks (optional but recommended)
- `-` : `E|W`
- `|` : `N|S`
- `+` : `N|E|S|W`

### Box-border glyphs are NOT wires (MUST)

All **pure double-line** box-border glyphs MUST have `wireMask == 0`:
- `═║╔╗╚╝╠╣╦╩╬` (and any other double-line-only border glyphs)

**Rationale:** boxes are detected as container borders and must not accidentally become exterior nets.

### Box-border connector glyphs (mixed double + single) (MUST)

Certain **box-border** glyphs include **single-line** protrusions and are allowed to participate in net tracing **only via those single-line protrusions**.

For these glyphs, `wireMask` MUST reflect **only** the single-line portions (the double-line portions are ignored for net tracing):

- `╢` (VERTICAL DOUBLE AND LEFT SINGLE): `W`
- `╟` (VERTICAL DOUBLE AND RIGHT SINGLE): `E`
- `╧` (UP SINGLE AND HORIZONTAL DOUBLE): `N`
- `╤` (DOWN SINGLE AND HORIZONTAL DOUBLE): `S`
- `╫` (VERTICAL DOUBLE AND HORIZONTAL SINGLE): `E|W`
- `╪` (VERTICAL SINGLE AND HORIZONTAL DOUBLE): `N|S`

These glyphs are *also* used by Box detection (see Box).

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

### Crossing without junction (canonical)

The canonical non-junction crossing is the pattern:

`─│─`

Meaning:
- Horizontal and vertical lines cross visually but MUST NOT connect as a junction.

Detection rule (MUST):
- During horizontal adjacency evaluation, a purely vertical glyph (mask == `N|S`) MAY be treated as **transparent** *only* when both its left and right neighbors are horizontal-capable and reciprocal.
- During vertical adjacency evaluation, purely horizontal glyph (mask == `E|W`) MUST NOT be treated as transparent (no vertical bridging).

This rule is intentionally asymmetric to keep ambiguity low.

(*) Supporting more crossing aliases is possible but MUST be specified explicitly before implementation.

---

## Component
### Definition

A **component** is a catalog-defined 2D template (“sprite”) placed on the grid.

At the net-policy level, a component instance is treated as:
- a bounded set of occupied cells (its **body footprint**)
- a set of **component ends** (`CE`) where exterior nets attach
- optional label slots, and optional net-label identity

### Component catalog (MUST)

A component catalog entry MUST provide at minimum:
- `uid` (stable ID)
- `type` (e.g. `"MCU"`, `"R"`, `"Net"`, …)
- `name` (human-readable)
- `template` (2D grid of glyphs, including spaces)
- `rotations` allowed (set of 0/90/180/270 degrees; at least `{0}`)
- optional: `pin_data` (explicit pins), `label_slots`, `bridge_map` (*)

### Template semantics (glyph classes inside templates)

In a component template, each cell glyph is interpreted as one of:

1) **Spacer**: ASCII space `' '`  
   - MUST be ignored for footprint, masking, and matching constraints (it matches anything).

2) **Fixed glyph**: any non-space glyph that is not a wildcard  
   - MUST match exactly the same glyph in the design grid.
   - Fixed wire-drawing glyphs, if present, are treated as *component art*, not as exterior wiring.

3) **Component-end wildcard**: `§` (MUST)  
   - `§` MUST match **exactly one wire glyph** in the design grid (i.e. `wireMask(gridGlyph) != 0`).
   - `§` MUST NOT match space.
   - `§` MUST be used **only** to represent a **flexible component end** (pin/protrusion zone).
   - A `§` position MUST be orthogonally adjacent to at least one fixed (non-space, non-label-slot) template glyph cell.  
     (This guarantees ends lie on the component perimeter.)

4) **Label-local wildcards**: `#`, `$`, …  
   - MUST only be legal inside **label slots** and MUST NOT participate in component geometry.

### Matching policy (MUST)

A component instance exists at location `(r0,c0)` if, for some allowed rotation, all template cells satisfy their matching rule against the design grid at that placement.

Matching MUST be deterministic:
- Same input grid + same catalog MUST yield the same set of matches.

### Validity constraint: non-overlap (MUST)

**Valid diagrams MUST NOT contain overlapping components or boxes.**

If the matching stage produces overlapping component body footprints, the implementation MUST:
- emit an explicit diagnostic (error/warning with involved uids and cells), AND
- apply a deterministic tie-break to pick a single winner per cell (so downstream steps remain deterministic).

### Derived sets per matched component instance (MUST)

For a matched component instance, derive the following sets of cell keys `"r,c"`:

1) `componentFootprintSet` (**body footprint**)  
   - All template positions where template glyph is a **fixed glyph** (non-space, non-label-slot, non-`§`).  
   - MUST exclude all label-slot positions.  
   - MUST exclude all `§` positions.

2) `netTraceMaskSet` (**net blocking mask**)  
   - In current policy, this MUST be identical to `componentFootprintSet`.  
   - Rationale: exterior nets are traced after filtering out the component body, but **not** its ends.

3) `matchHighlightSet` (**visual match highlight**)  
   - Cells highlighted as a stable part of the component’s shape.  
   - MUST include all fixed glyph positions in the template.  
   - MUST exclude spaces, all label slots, and all `§` positions.

4) `componentEndSet` (**end/perimeter cells**)  
   - All grid cell coordinates corresponding to `§` positions in the template (after placement + rotation).  
   - Every cell in `componentEndSet` MUST be a wire cell in the grid (`wireMask != 0`).  
   - Every cell in `componentEndSet` MUST be orthogonally adjacent to at least one cell in `componentFootprintSet`.

> These sets correspond to the legacy names `footprintSet`, `solidSet`, and `greenSet`, except that `§` is now unambiguously treated as an end and excluded from footprint/masking/highlight.

### Component Ends (`CE`) (MUST)

A **Component End** (`CE`) is any cell in `componentEndSet`.

Policy meaning:
- A `CE` is **part of the exterior netline geometry** (it is a wire cell).
- A `CE` is also an attachment point owned by exactly one component instance.

Consequences:
- A cell MAY be simultaneously classified as `CE` and `LE`/`LJ` (depending on degree).
- `CE` cells MUST NOT be removed during exterior net tracing.

### Net-label components (`type == "Net"`) (MUST)

Some catalog components represent a logical net label. If `type === "Net"`:

- The component instance MUST be considered a **NetLabel source** for net merging (see Exterior Netline).

#### `LabelID` extraction (MUST)

Given the (rotation-aware) template glyph grid:

1) Concatenate all glyphs into a string in row-major order.
2) Remove:
   - whitespace/newlines
   - the `§` glyph
   - any glyph with `wireMask(glyph) != 0`
3) The remaining string is `LabelID`.
4) If `LabelID` is empty, fallback to catalog `name`.

### Component Bridge Map (*) (future)

Some components tie multiple ends together internally (jumpers, connectors, etc.). Instead of tracing internal art, AsciiCAD MAY use a per-component bridge policy:

**Bridge Map contract (proposed):**
- Input: a matched component instance and its detected CEs.
- Output: a list of groups, each group is a list of CE identifiers that are internally connected.

Example:
- `[[CE1, CE2], [CE3, CE4, CE5]]`

Pin identity SHOULD come from explicit `pin_data` when available; otherwise from CE coordinates.

---

## Box
### Definition

A **box** is a non-catalog container defined by a **double-line, axis-aligned rectangular outline**.

Boxes exist to:
- delimit a rectangular area where local policy applies (grouping / sub-circuit / note region)
- provide controlled “ports” on the border for net connectivity (via mixed glyphs)

A box MUST be detectable directly from the grid.

### Dual semantics: box-border vs net-wire

Box borders are drawn with **double-line** glyphs (and some **mixed** glyphs that include single-line protrusions).

- For **box detection**, border connectivity MUST be validated using **double-line connectivity** (“box connectivity”).
- For **net tracing**, border glyphs MUST NOT become wires **except** for the single-line protrusions of the mixed connector glyphs (handled via `wireMask` in Wire).

### Allowed border glyph set (MUST)

A valid box border MAY use only the following glyphs:

**Pure double-line border glyphs (NOT wires):**
- `═║╔╗╚╝╠╣╦╩`

**Mixed double+single connector glyphs (wire via protrusion only):**
- `╢╟╧╤╫╪`

**Explicitly disallowed on box borders (MUST):**
- `╬` (DOUBLE VERTICAL AND HORIZONTAL)  
  If `╬` is present on the candidate border path, the rectangle MUST be rejected as a box.

### `boxMask(glyph)` (MUST)

The implementation MUST provide a deterministic function for box detection:

`boxMask: (glyph: Unicode code point) -> 0..15`

Interpretation:
- `boxMask` encodes **double-line** border connectivity only.
- Unknown/unmapped glyphs MUST yield mask `0`.

Required mappings:

**Pure double-line:**
- `═` : `E|W`
- `║` : `N|S`
- `╔` : `E|S`
- `╗` : `S|W`
- `╚` : `N|E`
- `╝` : `N|W`
- `╠` : `N|E|S`
- `╣` : `N|S|W`
- `╦` : `E|S|W`
- `╩` : `N|E|W`

**Mixed connectors (double part only):**
- `╢` : `N|S`   (vertical double)
- `╟` : `N|S`   (vertical double)
- `╧` : `E|W`   (horizontal double)
- `╤` : `E|W`   (horizontal double)
- `╫` : `N|S`   (vertical double)
- `╪` : `E|W`   (horizontal double)

`╬` MUST NOT be used for boxes, even though it has a well-defined double mask.

### Box detection algorithm (MUST)

The implementation MUST provide a deterministic detection algorithm.

A minimal compliant algorithm is:

1) Enumerate candidate top-left corners `╔`.
2) For each candidate `(r0,c0)`:
   - Find the top-right corner by scanning right until a `╗` is found, requiring that every visited cell has `boxMask` including `E|W` **or** is a top-edge-compatible glyph (`╦`, or a mixed glyph whose `boxMask` includes `E|W`).
   - Find the bottom-left corner by scanning down until a `╚` is found, requiring that every visited cell has `boxMask` including `N|S` **or** is a left-edge-compatible glyph (`╠`, or a mixed glyph whose `boxMask` includes `N|S`).
   - Let the found corners be `(r0,c1)` and `(r1,c0)`. The bottom-right corner MUST be `╝` at `(r1,c1)`.
3) Validate the entire perimeter:
   - top edge cells `(r0, c0..c1)` must all have `boxMask` containing `E` and/or `W` appropriately for continuous double-horizontal connectivity.
   - bottom edge cells `(r1, c0..c1)` likewise.
   - left edge cells `(r0..r1, c0)` must all have `boxMask` containing `N`/`S` appropriately.
   - right edge cells `(r0..r1, c1)` likewise.
4) Reject if any perimeter cell contains a glyph outside the Allowed border glyph set, or if any perimeter cell is `╬`.
5) Define:
   - `boxBorderSet` = all perimeter cell coordinates
   - `boxInteriorSet` = all cells `(r,c)` where `r0 < r < r1` and `c0 < c < c1`

Boxes MUST NOT overlap each other. If multiple detected boxes overlap, emit diagnostics and deterministically choose a resolution.

### Box ports (`BP`) (MUST)

A **box port** is a border cell that participates in net tracing via a single-line protrusion:

- `BP` = `{ cell ∈ boxBorderSet | wireMask(gridGlyph(cell)) != 0 }`

Port connectivity is defined by the normal net rules (Wire):
- a wire inside the box can connect to the port only if the port’s `wireMask` includes the inward direction and the neighbor wire reciprocates
- a wire outside the box can connect to the port only if the port’s `wireMask` includes the outward direction and the neighbor wire reciprocates

**Two-sided ports (feedthrough):**
- If a border cell’s `wireMask` includes both directions across the border (e.g. `E|W` on a vertical edge, or `N|S` on a horizontal edge), then nets MAY pass from exterior region to interior region through that port cell.
- If a border cell’s `wireMask` includes only one side, nets MAY terminate at that border (but cannot pass through).

### Relationship to component policy (clarification)

Boxes serve a similar “diagram role” as catalog components (they reserve area, impose local policy, and have perimeter ports),
but they are detected from the grid, not from a catalog template.

---

## Label

### Definition

A **label** is a semantic identifier extracted from the grid that can be attached to:
- a component instance (component reference / name label), or
- an exterior net (net label).

Labels are **separate objects**:
- label areas MUST NOT participate in component footprint or net masking
- label content MUST NOT affect exterior net tracing (no hidden connectivity)

This matches the established intent that labels are not geometry.

### Label sources (current)

This document specifies two label sources:

1) **Net-label components** (`type == "Net"`)  
   - Produce a `LabelID` (see Component: Net-label components).
   - Used to merge exterior nets.

2) **Catalog-defined component label slots**  
   - A component template MAY define `label_slots` (set of template coordinates) where label characters exist or can be matched.
   - Labels in these slots belong to the component instance, not to nets.

(*) Free-floating text labels near wires are intentionally **out of scope** until specified.

### Label character class (MUST)

For label slots, the catalog MUST specify which characters are allowed; if not specified, the default allowed class MUST be:

- `A..Z`, `a..z`, `0..9`, `_`

Spaces are allowed inside a label slot for padding but MUST be trimmed from the extracted label.

### Label-local wildcards (MUST)

The following wildcards are reserved for label matching inside label slots:

- `#` matches exactly one digit `0..9`
- `$` matches exactly one alphanumeric or `_` (same class as default allowed)

Any additional label wildcards MUST be defined explicitly and MUST be restricted to label slots only.

### Label extraction (MUST)

Given a matched component instance with label slots:

1) Read the grid glyphs at the label-slot positions.
2) Concatenate in a deterministic order:
   - default: left-to-right, top-to-bottom (row-major) within the smallest bounding rectangle of the slot set
   - rotation-aware: order MUST rotate consistently with the component rotation
3) Trim leading/trailing spaces from the resulting string.
4) The remaining string is the component label; if empty, the component is considered “unlabeled” (no label object emitted).

### Derived label artefact

A label object MUST minimally contain:

- `kind`: `"ComponentLabel"` or `"NetLabel"`
- `text`: extracted label text
- `owner`: component instance ID (for ComponentLabel) or net ID (for NetLabel)
- `cells`: list of cell coordinates that contributed to the label

---

## Exterior Netline

### Definition

An **exterior netline** is the wiring graph traced on the grid **after excluding all component bodies** (component `netTraceMaskSet`).

Key clarifications:
- Component ends (`CE`, i.e. `§`-matched cells) are **not** excluded; they remain part of the traced net geometry.
- Box borders are not removed; they delimit regions because pure double-line border glyphs are **not wires** (`wireMask == 0`), except at explicit box ports.

### Inputs and filtering (MUST)

Exterior net tracing MUST operate on a filtered view of the grid:

Exclude (treat as non-wire / space for adjacency purposes):
1) all cells in every component instance `netTraceMaskSet` (which equals `componentFootprintSet` in current policy)

Do NOT exclude:
- `CE` cells (`componentEndSet`)
- labels (labels do not affect net tracing)
- box borders (they remain, but most border glyphs have `wireMask == 0`)

Apply the canonical crossing rule (`─│─`) during adjacency evaluation (see Wire).

### Trace → attach → merge pipeline (MUST)

Exterior netline discovery MUST follow this conceptual pipeline:

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
   - Each `CE` MUST be owned by exactly one component instance.
   - A `CE` MUST attach to exactly one provisional net (possibly a single-cell net).

4) **Bridge within components (*)**  
   If a matched component provides a Bridge Map, provisional nets touching bridged CEs MUST be unioned.

5) **Merge by net labels (MUST for `type=="Net"`)**  
   If a provisional net attaches to a Net-label component with `LabelID`, then all nets attaching to Net-label components of the same `LabelID` MUST be unioned.

Union-find is the recommended structure for steps (4) and (5), but any deterministic equivalent is acceptable.

### CE adjacency edge-case (MUST)

Components/boxes do not overlap, but component ends may be **directly adjacent**.

Policy requirement:
- The tracer MUST allow a cell to be simultaneously classified as `CE` and as `LE`/`LJ`.
- If a provisional net consists of exactly **two adjacent wire cells**, and both cells are `CE` cells owned by different components (or a component and a box port),
  then both cells MUST be reported as `LJ` (connection nodes) and MUST NOT be reported as `LE`, even though their graph degree is 1.

**Rationale:** this pattern represents a direct pin-to-pin connection and should be treated as a junction, not as two “dangling ends”.

### Derived netline artefact (JSON schema)

Each final netline MUST provide at least:

- `id`: stable net identifier (deterministic across runs)
- `cells`: list/set of all wire cell coordinates in the final net
- `LE`: list of line-end wire cell coordinates
- `LJ`: list of junction wire cell coordinates
- `CE`: list of component-end cell coordinates that belong to this net (the `§`-matched cells)
- `labels`: list of `LabelID` strings attached to this net via Net-label components (may be empty)
- `components`: list of component instance IDs touched by this net (for reporting)

`CJ` (component-internal connections) is deferred to Bridge Map (*) and is not required in current policy.

### Invariants (MUST)

- A wire cell belongs to at most one final netline.
- A `CE` cell belongs to exactly one component instance and at most one final netline.
- Every final netline MUST be a union of one or more provisional nets.
- Merging MUST be transitive and deterministic.

---

# Contradictions, gaps, and required decisions (separate before further editing)

The following items are explicitly *not fully pinned down* by current text and MUST be resolved before shipping additional behaviour:

1) **Component overlap resolution policy (diagnostics + tie-break)**
   - Valid diagrams MUST NOT overlap components/boxes.
   - However, matching may still yield overlapping candidates; the deterministic tie-break ordering is still an implementation decision.

2) **Label scope**
   - Only catalog-defined label slots and Net-label components are specified.
   - Free-form text labels near wires are not specified yet.

3) **Crossing aliases**
   - Only the canonical `─│─` crossing is specified.
   - Any additional aliases must be listed explicitly to avoid ambiguity.

`(*)` indicates a novelty or future feature not yet implemented.
