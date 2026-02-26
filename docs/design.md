# Design strategy

In Januray 2026, the idea to develop AsciiCAD was born.
As deceiving it may sound; AsciiCAD was never aiming at becoming a serious application, but was built with serious intent nonetheless. 

While mainstream applications, and certainly Computer Aided Design tools are made of **vertical layers** -the complexity makeup, ruled by functions- and **horizontal pillars** -the multimodal makeup or data-, our experiment collapses the horizontals and simplifies the foundation, hoping this way (that's our hypothesis) achieving maturity more quickly.

That collapse is not an accident, but a deliberate strategy - quoting the opening statement for this project “designed as a ‘digital essay’ on fast-tracking complexity by strategising bare-bones simplicity at its conception.”  

This deserves more elaboration:
With collapsing the horizontals, we refer to 'business data' usually living in applications, over three different datasets:
- a dataset tailored for graphical representation and human-machine interfacing
- an internal dataset allowing application functions to make internal process decisions or algorithmic operations.
- plus one or more datasets tailored for interoperability with other compatible applications or systems   

In AsciiCAD, we collapse these three layers into just one, allowing just one definition and one policy to do the heavy lifting.

Having only **one representation layer** to worry about brings a practical advantage: it concentrates effort where it matters most — on precise, high-quality policy writing and on forging detailed, shared agreements about interpretation and formatting. Those agreements or policies become the fertile ground for “protocols” that make the system scale.

This matters because AsciiCAD’s strategy for reaching higher complexity is not to multiply parallel abstractions, but to build only understandable layers on top of each other that support complexity at scale:
- start with a stable, minimal base (grid of glyphs)
- define systematic interpretation rules (policy document)
- then add features that compose on top of those rules (netlist, matching, labels, tooling)

# Policy design

Having only one representation layer literally implies **'what you see is what you get'**; and once wires and components are visually arranged in a 2D grid, this framework needs an accurate recipe across multiple [specialisation layers](#specialisation-layers) to make correct assumptions on **what one gets from what one sees.**

This is where both _generation of visual structures_ and _meaning extraction_ demand a **consistent policy, applicable in both ways**.

It defines these meanings in a precise, testable way, especially for connectivity:
- which glyphs count as wires and why
- how nets are traced
- how crossings and junctions are interpreted
- how catalog components interact with linking wires (pins/protrusions, net labels)
- what is reported in a netlist output and why

The CAD concept implies 2 fundamental building blocks: wires and components.  As wires are supposed to go from everywhere to everywhere, we need a **global policy** to describe their role, behavior and validation criteria.  Components however are locally confined elements where a **local policy** may be more suitable.  We can use the flexibility of a local policy to overcome ridgid wiring rules that are difficult to apply, let alone generalise within the tight inner space typically given to a component.

As our design strategy pursues a blueprint for Computer Aided Design (CAD) applicable in many different specialisations.  e.g. Enterprise or IT architectural design, mind mapping, electrical engineering etc... we need a solid foundation allowing predictable interpretation that
- users can learn
- the codebase can maintain
- future features can extend without breaking existing drawings

More contet about the power of character/glyph encoding:
It's one-dimensional aspects, text, paragraphs, phrases, idioms, words, syllables, and at it's atomic level: symbols, glyphs, characters, letters, digits, numbers, operators, punctuation, diacritics, ligatures, marks, spaces and even emoji's have become the basis of language.   

A construct allowing intelligent entities to **Transform thought into data, and data into thought.**.  This is how we preceive language, in it's very one-dimensional space.  But just like barcodes and QR codes relate to each other, in a 2D space however, data density increases quadratically and so it's potential to bear more meaning in the same space.  And we utilise this potential to stuff graphic representation, internal data including references to metadata and interoperability all in one place, where multiple modes collapse into one ultimate form of simplicity: 'what you see is what you get'.

## Why the AsciiCAD experiment can unify these policies

- **Stable graphical representation:**
  Glyphs associated with characters are standardized and relatively stable. Their rendering is governed by character encoding standards (Unicode/UTF-8) and fonts, which gives AsciiCAD a dependable baseline for “what a symbol looks like.”

- **Direct in-memory representation:**
  The design can be stored “as-is” — typically as a 2D array of characters (rows × columns). There is no need to translate into a separate geometric object model just to hold the drawing.

- **Natural interchange format:**
  Plain text files are one of the most universal interchange formats available. Any editor, terminal, diff tool, or viewer can display and transmit AsciiCAD output. This makes schematics inherently portable and human-readable, without a special exporter.

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

# Policy terms

This document reconciles AsciiCAD’s net-related policy by grouping rules under a small set of core terms:
**Grid Cell**, **Wire**, **Component**, **Box**, **Exterior Netline**.  
(We will add **Interior Netline** later.)

For each term we describe:
- Definition and representation
- Rules that apply
- Derived artifacts (sets/overlays/JSON fields)
- Open questions / gaps (explicitly called out)

`(*)` indicates a novelty or future feature not yet implemented.

---

## Grid Cell

### Definition
A **grid cell** is the atomic unit of AsciiCAD’s single representation layer. Each cell contains exactly **one UTF‑8 character** (including space).

### Representation
- **In memory:** `ascii[r][c]` where `r` is row index and `c` is column index.
- **Stable key for Set/Map:** `"r,c"` string key (row-major).

**Rationale (why `"r,c"`):**
- JavaScript `Map`/`Set` treat objects by identity, not by value. A key like `{r:1,c:2}` is not stable unless the same object instance is reused.
- A string key gives stable value identity, predictable hashing, easy logging/serialization, and matches array indexing order (`ascii[r][c]`).

### Coordinate conventions
- **Internal keys:** `"r,c"` (row, column).
- **User-facing UI telemetry:** often uses “x,y” phrasing where **x = column** and **y = row**, but the underlying keys remain row-major.

### Open questions / gaps
- (*) Numeric packed keys (e.g. `(r<<16)|c`) could be a future micro-optimization, but would reduce readability and require careful bounds management.

---

## Wire

### Definition
A **wire** is any glyph that fulfills a *connectivity function* in the grid (not a decorative character).

### Representation: `glyphToMask`
Wires are modeled using a 4-bit directional mask:

- `N = 0b0001`
- `E = 0b0010`
- `S = 0b0100`
- `W = 0b1000`

A wire glyph’s meaning is encoded as a bitwise OR of the directions it connects.

**Example:** `╤` connects East + South + West ⇒ `E|S|W = 0b1110`

**Why this matters:**
- Many Unicode variants represent the same *connectivity function*; `glyphToMask` makes them behave consistently.
- The bitmask keeps code readable: `if (m & E)` expresses intent directly and remains stable across glyph additions.

### Connectivity rules (wire-to-wire)
Two adjacent wire cells connect if:
1) the current glyph has the directional bit toward its neighbor, and  
2) the neighbor glyph has the reciprocal bit back.

This defines the adjacency edges used for exterior net tracing.

### Junctions (`LJ`)
A wire cell is a junction when its **graph degree ≥ 3** after adjacency is computed.

The policy relies on topology (degree), not on a glyph list, although junction glyphs often include: `├ ┤ ┬ ┴ ┼` and Unicode variants.

### Crossings without junction: canonical pattern
The canonical non-junction crossing is:

`─│─`

Policy meaning:
- horizontal and vertical lines cross visually but do **not** connect as a junction.

Implementation policy:
- horizontal continuity may “bridge over” a vertical-only glyph to keep the horizontal net continuous.
- vertical continuity does **not** bridge (consensus: one canonical crossing pattern avoids excessive aliasing).

**Note:** supporting additional crossing aliases is possible (*), but increases ambiguity and raises detection/matching failure risks.

---

## Component

### Definition
A **component** is a catalog-defined 2D template (“sprite”) placed on the grid.

At the net-policy level, components are treated as **shapes with ends (pins/protrusions)** plus optional metadata (type, label ID). Any deeper semantics belong to higher layers.

### Spaces inside components
Spaces inside a component template are **pure spacers**:
- they exist to position glyphs correctly in preview/paste and in matching alignment.
- they do not participate in footprint, masking, or connectivity rules.

### Labels are separate objects (policy)
Component labels are treated as **separate objects** positioned within or near a component.
- The label *area* does not participate in component rules (net masking, CE, perimeter, etc.).
- Wildcards used for labels are therefore **label-local only**.

### Wildcards (re-scoped)

#### `§` wildcard (component-local)
`§` is a wildcard for **exactly one wire glyph** (it cannot match a space).  
It serves as a **flexible component end**: it allows tight turns near the component while still acting as an “end region” for connectivity.

**Consequences:**
- `§` participates in matching.
- Whether `§` participates in CE/pin-zone reasoning is policy-defined:
  - Intended: `§` may designate a pin-zone cell *when it matches a wire glyph*.
  - Visual match highlight should still not highlight `§` positions, to avoid showing “variable” structure as fixed. (*)

#### Other wildcards (`#`, `$`, …) (label-local)
Other wildcards (such as `#` digit patterns and `$` alphanumeric patterns) are **label-local only**.
They are not used to define component geometry and do not influence net tracing or CE.

### Component matching artifacts (current implementation; to be replaced by Query API) (*)
Historically, matching yields multiple sets:

- `matchHighlightSet` (formerly `greenSet`): cells highlighted visually as part of a match (skips spaces and `§`)
- `netTraceMaskSet` (formerly `solidSet`): cells excluded from exterior net tracing (skips spaces and `§`)
- `componentFootprintSet` (formerly `footprintSet`): cells representing component presence for adjacency (skips spaces; may include `§` depending on policy)

**Forward-looking note:** a dedicated Query API is expected to replace the set/overlay approach (*), including the current “Match” tool.

### Protrusions / pins and Component Ends (`CE`)
A **component end** is the protruding/pin cell on the component side that connects to an exterior net.

Policy meaning:
- `CE` records the **component-side** glyph cell (pin/protrusion), not the wire cell.

Detection policy (exterior perspective):
- A wire cell that has a directional exit into an adjacent component footprint cell,
- and that component cell has a `glyphToMask` that points back,
⇒ record the component cell as `CE`.

Additionally:
- the wire cell is forced into `LE` (a termination into a component), even if it is also a junction.

### Net-label components (type: `Net`)
Some catalog components represent a **logical net label**.
If `type === "Net"`, the component carries a `LabelID` that ties exterior nets together.

**LabelID extraction**
Derived from the template text (rotation-aware) by stripping:
- whitespace/newlines
- `§`
- wire glyphs (`glyphToMask != 0`)
Fallback: catalog `name` if the result is empty.

**Merge rule**
All exterior nets that touch (via `CE`) a Net-label component with the same `LabelID` are considered the same net.

### Component Bridge Map (internal connectivity) (*)
Some components (connectors, jumpers, fixed links) tie their ends together **inside the component**.
Rather than tracing internal glyphs, AsciiCAD will use a dedicated per-component policy function:

**Component Bridge Map**: given a matched component instance, return groups of ends that are internally connected.

Example (group-based):
- `[[P1, P2], [P3, P4, P5]]`

or coordinate-based early form:
- `[[{r,c},{r,c}], ...]`

**Pin identity source** (*):
- Prefer explicit `pin_data` if available.
- Otherwise derive pin identities from CE coordinates.

---

## Box

### Definition
A **box** is a non-catalog, generic container defined by a **double-line rectangular outline**.

### Rules
- A box is valid if its border is a closed rectangle with double-line glyphs.
- Boxes can contain labels, but labels are separate objects and do not change net tracing rules.

### Interaction with exterior net tracing (Option A)
Boxes act as **containers**:
- The **interior** of a valid double-line box is not part of exterior nets.
- The **border and protrusions** are not automatically eliminated and may participate in exterior nets (e.g., wires can connect on the outside).

**Rationale:** excluding border+interior wholesale was too destructive; container semantics belong to the interior.

### Open questions / gaps
- (*) Define explicit “box pin” exceptions if we want controlled connectivity between exterior nets and interior nets in the future.

---

## Exterior Netline

### Definition
An **exterior netline** is the wiring graph traced outside component internals and outside box interiors.

It is computed as connected components over wire cells after filtering, then optionally merged by label/bridges.

### Filtering (inputs to exterior net tracing)
Exterior net tracing operates on a filtered grid:
- exclude valid double-line box **interiors** (container semantics)
- exclude catalog component `netTraceMaskSet` (component solids; excluding `§`)
- apply canonical crossing rule (`─│─`)

### Derived JSON entry (netline report)
A netline entry contains:
- `LE`: line ends  
  - classic endpoints (degree==1)  
  - plus wire cells terminating into components (forced LE)
- `LJ`: junctions (degree ≥ 3)
- `CE`: component-end cells adjacent to wire
- `CJ`: component-internal connections (*deferred; see Component Bridge Map*)

### Trace-then-bridge pipeline
Exterior netline discovery is conceptualized as:

1) **Trace:** build provisional nets from wire connectivity in the filtered grid.
2) **Attach ends:** determine which provisional nets touch which component ends (`CE`) and which component instances.
3) **Bridge within components** (*): apply the Component Bridge Map to union provisional nets that are internally tied by a component.
4) **Merge by net labels:** union nets that touch Net-label components with the same `LabelID`.

**Implementation note:** union-find is the preferred merging mechanism for steps (3) and (4).

### Output / interactivity
- Netlist interactive mode highlights hovered net in BLUE.
- Debug mode may overlay `CE` cells in RED when Netlist is ON.

### Open questions / gaps
- (*) Interior Netline will later describe nets inside boxes and/or component interiors.
- (*) Component Bridge Map is the intended mechanism for “fixed internal connections” without tracing component internals.

---

# Contradictions and gaps to discuss (before further editing)

1) **`§` as flexible component end vs masking/highlight**
   - `§` matches exactly one wire glyph and represents a flexible end-zone.
   - We must decide precisely how `§` participates in:
     - CE detection (likely yes, when it matches a wire glyph)
     - netTraceMaskSet (likely no)
     - matchHighlightSet (likely no)

2) **Component footprint / pin-zone definition**
   - Since labels are separate objects, the component perimeter/pin-zone should be defined purely by the component template + adjacency rules (mask reciprocity).
   - Avoid perimeter rules that depend on label semantics.

3) **Box border semantics**
   - Option A excludes interior from exterior nets; border/protrusions remain.
   - Clarify whether exterior wires may connect to border glyphs as “pins” or only to protrusions.

4) **Transition to Query API** (*)
   - The current multi-set matching outputs are expected to be replaced.
   - Policy should remain stable even if implementation changes.

5) **Component Bridge Map** (*)
   - Define minimal output contract and testing strategy before implementation.

---

`(*)` indicates a novelty or future implementation idea not yet implemented.
