# Design strategy

In Januray 2026, the idea to develop AsciiCAD was born.
As deceiving it may sound; AsciiCAD was never aiming at becoming a serious application, but was built with serious intent nonetheless. 

While mainstream applications, and certainly Computer Aided Design tools are made of **vertical layers** -the complexity makeup, ruled by functions- and **horizontal pillars** -the multimodal makeup or data-, our experiment collapses the horizontals and simplifies the foundation, hoping this way (that's our hypothesis) achieving maturity more quickly.

That collapse is not an accident, but a deliberate strategy - quoting the opening statement for this project “designed as a ‘digital essay’ on fast-tracking complexity by strategising bare-bones simplicity at its conception.”  

This deserves more elaboration:
With collapsing the horizontals, we refer to 'business data' usually living in applications, over three different datasets:
- a dataset tailored for graphical representation and human-machine interfacing
- an internal dataset allowing application functions to make internal process decisions, or perform algorithmic operations.
- plus one or more datasets tailored for interoperability with other compatible applications or systems   

In AsciiCAD, we collapse these three layers into just one, allowing just one definition and one policy to do all the heavy lifting.
ed as a ‘digital essay’ on fast-tracking complexity by strategising bare-bones simplicity at its conception.”

Having only **one representation layer** to worry about brings a practical advantage: it concentrates effort where it matters most — on precise, high-quality policy writing and on forging detailed, shared agreements about interpretation and formatting. Those agreements become the “protocols” that makes the system scale.

This matters because AsciiCAD’s strategy for reaching higher complexity is not to multiply parallel abstractions, but to build understandable layers on top of each other:
- start with a stable, minimal base (grid of glyphs)
- define strict interpretation rules (policy document)
- then add features that compose on top of those rules (netlist, matching, labels, tooling)


# Design policy

In concrete terms, this chapter answers the core question:
“Given a 2D grid of characters, what do they mean — and what must the software do consistently as a result?”

It defines these meanings in a precise, testable way, especially for connectivity:
- which glyphs count as wires and why
- how nets are traced
- how crossings and junctions are interpreted
- how catalog components interact with linking wires (pins/protrusions, net labels)
- what is reported in a netlist output and why

The goal is not perfect electrical semantics for every possible ASCII style; the goal is predictable interpretation that users can learn, that the codebase can maintain, and that future features can extend without breaking existing drawings.  This design strategy can be used as a blueprint for Computer Aided Design that can be applied in many other usecases.  e.g. Enterprise or IT architectural design, mind mapping, etc...

More about character encoding practice:
It's one-dimensional aspects, text, paragraphs, phrases, idioms, words, syllables, and at it's atomic level: symbols, glyphs, characters, letters, digits, numbers, operators, punctuation, diacritics, ligatures, marks, spaces and even emoji's have become the basis of language.   

A construct allowing intelligent entities to **Transform thought into data, and data into thought.**.  This is how we preceive language, in it's very one-dimensional space.  But just like barcodes and QR codes relate to each other, in a 2D space however, data density increases quadratically and so it's potential to bear more meaning in the same space.  And we utilise this potential to stuff graphic representation, internal data including references to metadata and interoperability all in one place, where multiple modes collapse into one ultimate form of simplicity: 'what you see is what you get'.

## Why the AsciiCAD experiment can unify these policies

- **Stable graphical representation:**
  Glyphs associated with characters are standardized and relatively stable. Their rendering is governed by character encoding standards (Unicode/UTF-8) and fonts, which gives AsciiCAD a dependable baseline for “what a symbol looks like.”

- **Direct in-memory representation:**
  The design can be stored “as-is” — typically as a 2D array of characters (rows × columns). There is no need to translate into a separate geometric object model just to hold the drawing.

- **Natural interchange format:**
  Plain text files are one of the most universal interchange formats available. Any editor, terminal, diff tool, or viewer can display and transmit AsciiCAD output. This makes schematics inherently portable and human-readable, without a special exporter.



# AsciiCAD policy
## Terminology
### Grid Cell
We represent a cell location as a stable string key "r,c".

Because:
- Native JavaScript Map/Set use reference identity for objects, so {r:1,c:2} can’t be used reliably as a key unless you keep the same object instance around.
- A string key gives:
  - value identity ("1,2" equals "1,2" anywhere)
  - predictable hashing in Set/Map
  - easy serialization and debugging (console logs, JSON)

- We keep "r,c" rather than e.g. "c,r" purely as a global convention: row-major ordering matches how arrays are indexed (ascii[r][c]), which reduces accidental swapping bugs.

Note: other encodings are possible (e.g. r<<16|c), but "r,c" is explicit, safe, and readable. (A packed numeric key could be a later micro-optimization, if needed.) (*)

### Wire glyph

Why `glyphToMask` exists (and why it’s used for net logic)

AsciiCAD treats “wire symbols” as functions (“connectivity directions”) rather than as literal characters.

We encode each glyph’s connectivity using a 4-bit mask:
- N = `0b0001`
- E = `0b0010`
- S = `0b0100`
- W = `0b1000`

A glyph’s “line function” is then just a bitwise OR of the directions it connects.

**Example:**
`╤` connects E + S + W, which becomes:

- `E | S | W = 0b0010 | 0b0100 | 0b1000 = 0b1110`

Why this is better than character checks:
- It generalizes across many Unicode box-drawing variants.
- It makes junction tests trivial: e.g. a junction-like cell often has 3+ bits set.
- It keeps code readable and stable: `if (m & E)` says exactly what it means.

This approach scales better than large “if char in …” lists and reduces bugs when new glyphs are introduced.


### Netline

A netline entry contains:
- `LE`: wire ends and wire→component terminations
- `LJ`: branching junctions (graph degree ≥ 3, meaning 3 legs)
- `CE`: component-edge glyph cells (pins/protrusions) adjacent to wire
- `CJ`: component-internal junctions / pin-to-pin connections (*)

`CJ` **— component internal connectivity (*)**

Some components create **permanent** connectivity between pins without external wires:
- connectors (pin ↔ pin)
- jumpers / shunts (bridging nets)
- some fixed “wired” adapters

Policy intent:
- When a matched catalog component has known internal wiring, it should contribute a CJ structure describing which pins are tied together.

Notes:
- Switches are special: their connectivity can depend on state, so they may be excluded from netlist policy or represented as conditional connectivity (*).
- `CJ` would allow the net engine to optionally “collapse” nets through components that behave like fixed links. (*)


## Input filtering policy
### A. Exclude double-line boxes

Wires that lie **inside** or **on the boundary** of valid double-line boxes must be ignored for netlist purposes.
- Uses the same box-detection logic as computeHighlightOverlay().
- Banned cells include:
  - box boundary (“redSet”)
  - box interior (“insideSet”)

**Rationale:** double-line boxes represent grouped blocks; internal wiring should not leak into external nets.

### B. Exclude matched catalog component interior glyphs (net tracing)

Catalog components can include wire-like characters (e.g., `─│═║`) that must not be interpreted as wiring.

For net tracing, cells belonging to matched catalog items are filtered out using a catalog-derived set:

- **solidSet** = all matched pattern cells that are:
  - not a space
  - not the wildcard character §

**Rationale:** a component symbol can visually contain lines that are not part of the external wiring network.

### C. Wildcard meaning

The wildcard character is used in CATALOG patterns to match variable content.

Policy:

- `§` participates in matching (pattern recognition).
- `§` does not participate in:
  - match highlighting
  - netlist banned masking (`solidSet`)
  - `CE` detection (it should not create a phantom protrusion)

Connectivity policy (wire-to-wire)

### D. Local connectivity model

Connectivity between cells is determined using:
- `glyphToMask` for a cell’s directional exits
- reciprocal direction requirement in the neighbor

Example: a connection from A → right requires:
- `A` has `E`
- neighbor has `W`

### E. Crossings without junction `─│─`

We intentionally support **one canonical crossing pattern**:

`─│─`

Meaning:
- horizontal and vertical lines cross without connection (no junction)
  - horizontal connectivity may “bridge over” a vertical-only glyph to continue
  - - vertical connectivity does not bridge through horizontal-only glyphs

**Clarifying note / design tradeoff:**
- We could add an equally valid rotated/alternative crossing convention (e.g. a different arrangement or spacing), but every additional alias increases:
  - detection ambiguity
  - risk of false junctions
  - maintenance burden
- Since users can already draw crossings reliably using a single convention, we prefer “one pattern, well-tested” over multiple patterns that are hard to validate.

### F. Junction glyphs

Junctions are characters with branching masks, e.g.:

- `├ ┤ ┬ ┴ ┼` and similar box-drawing junctions

A cell is considered a junction (`LJ`) when its graph degree is ≥ 3.



## Endpoint policy

### G. Line ends `LE`

A wire cell is considered a line end if:

1. It has graph degree == 1 (classic endpoint), OR
2. It terminates into a component footprint (see CE rules) even if its graph degree != 1

This allows a node to be both:
- a junction (`LJ`, degree ≥ 3, meaning min. 3 legs)
- and a termination into a component (LE via component adjacency)

**Rationale:** a tee/junction glyph can still represent a “terminal” into a component even while conducting elsewhere.

## Component interaction policy
### H. Component footprint sets

We derive multiple sets from catalog matching. The goal is to separate **three different concerns:**
1. What we highlight visually
2. What we remove from net tracing
3. What we consider part of the component presence for CE/pin adjacency

Current naming:
- `greenSet`: used for match highlight (green overlay)
- `solidSet`: used as “ban mask” for net tracing
- `footprintSet`: used for component presence / CE detection

**Clarifying explanations**
- `greenSet` (“highlight set”)
  Cells that should be visually highlighted as part of a match.
  Skips spaces and wildcard § so we don’t highlight “variable/unknown” placeholders.

- `solidSet` (“ban mask”)
  Cells that are treated as “occupied by a component” for net tracing.
  Also skips § because wildcard regions should not erase wiring by default.

`footprintSet` (“presence/shape set”)
Cells that define where the component exists for adjacency tests (CE).
Includes wildcard § positions because those positions still belong to the component’s “shape,” even if we don’t highlight or ban them.

**Possible naming improvement (*)**

If we agree, we can rename in the document (and optionally in code later):
- `greenSet` → `matchHighlightSet`
- `solidSet` → `netTraceBanSet` (or componentOccupancySet)
- `footprintSet` → `componentFootprintSet`

This would reduce cognitive load for new contributors. (*)

### I. Component ends `CE`

A component end is recorded when a wire cell has a directional exit into an adjacent cell that:
- belongs to a matched catalog item’s footprintSet, and
- contains a glyph that expresses directional connectivity toward the wire (via glyphToMask)

The component-side cell coordinate is recorded as:
- `CE += {c, r}`

Additionally, the wire cell is forced into `LE` (“termination into component”).

**Rationale:** CE represents the component’s “pin/protrusion glyph”, not the wire cell itself.

### J. “Protrusions” and pin glyphs

Pins/protrusions can be:
- straight wire glyphs on the component edge: ─ │
- small connector glyphs: `╪ ╫ ╢ ╟ ╧ ╤` (and others supported by `glyphToMask`)

Policy: CE detection relies on `glyphToMask`, not a narrow `isWireGlyph()`, so these protrusions are supported.

## Net-label (“type: Net”) policy
### K. Net-label components

Catalog items with:
- type === "Net"

are interpreted as logical connectivity labels.

Examples:
- `GND`
- `NetLabel` (circled digits)

### L. LabelID extraction

Each Net-label match has:
- `catalog_idx`
- `rotation`

LabelID is derived from the catalog pattern text_data\[rotation\] by stripping:
- whitespace + newlines
- wildcard `§`
- wire glyphs (any glyph where `glyphToMask != 0`)

If the result is empty, fallback to:
- `CATALOG\[catalog_idx\].name`

### M. Net merge rule

If two (or more) nets each touch a Net-label component with the same LabelID, they are considered **the same net**.

“Touch” means:
- a net has a CE cell that belongs to that Net-label match footprint

Merge behavior:
- union of `cells`
- union of `LE`, `LJ`, `CE`

**Rationale:** labels create logical connectivity without a drawn wire.

## Output policy
### N. Netlist interactive mode

When Netlist mode is ON:
- hovering a wire cell highlights the entire net in BLUE
- in debug mode, CE cells can be overlaid in RED for inspection

### O. JSON netlist report

The JSON report uses netline objects:
- `{ LE, LJ, CE }`

and is derived from the same core net computation to ensure consistency with interactive highlighting.
