# Design strategy

In Januray 2026, the idea to develop AsciiCAD was born.
As deceiving it may sound; AsciiCAD was never aiming at becoming a serious application, but it was built with serious intent nonetheless. 

While mainstream applications, and certainly Computer Aided Design tools are made of vertical layers -the complexity makeup, ruled by functions- and horizontal pillars -the multimodal makeup or data-, our experiment collapses the horizontals and simplifies the foundation, hoping this way (that's our hypothesis) achieving maturity more quickly.

That collapse is not an accident, but a deliberate strategy - quoting the opening statement for this project “designed as a ‘digital essay’ on fast-tracking complexity by strategising bare-bones simplicity at its conception.”  

This deserves more elaboration:
With collapsing the horizontals, we refer to 'business data' usually living in applications, over three separate datasets:
- a dataset tailored for graphical representation and human-machine interfacing
- an internal dataset allowing application functions to make internal process decisions, or perform algorithmic operations.
- plus one or more datasets tailored for interoperability with other compatible applications or systems   

In AsciiCAD, we collapse these three layers into just one, allowing just one definition and one policy to do all the heavy lifting.
ed as a ‘digital essay’ on fast-tracking complexity by strategising bare-bones simplicity at its conception.”

Having only one representation layer to worry about brings a practical advantage: it concentrates effort where it matters most — on precise, high-quality policy writing and on forging detailed, shared agreements about interpretation and formatting. Those agreements become the “protocols” that makes the system scale.

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



## The AsciiCAD policy makeup

### Terminology

#### Grid Cell

We represent a cell location as a stable string key "r,c".

Because:
- Native JavaScript Map/Set use reference identity for objects, so {r:1,c:2} can’t be used reliably as a key unless you keep the same object instance around.
- A string key gives:
  - value identity ("1,2" equals "1,2" anywhere)
  - predictable hashing in Set/Map
  - easy serialization and debugging (console logs, JSON)

- We keep "r,c" rather than e.g. "c,r" purely as a global convention: row-major ordering matches how arrays are indexed (ascii[r][c]), which reduces accidental swapping bugs.

Note: other encodings are possible (e.g. r<<16|c), but "r,c" is explicit, safe, and readable. (A packed numeric key could be a later micro-optimization, if needed.) (*)

#### Wire glyph

Why glyphToMask exists (and why it’s used for net logic)

AsciiCAD treats “wire symbols” as functions (“connectivity directions”) rather than as literal characters.

We encode each glyph’s connectivity using a 4-bit mask:
- N = 0b0001
- E = 0b0010
- S = 0b0100
- W = 0b1000

A glyph’s “line function” is then just a bitwise OR of the directions it connects.

**Example:**
╤ connects E + S + W, which becomes:

- E | S | W = 0b0010 | 0b0100 | 0b1000 = 0b1110

Why this is better than character checks:
- It generalizes across many Unicode box-drawing variants.
- It makes junction tests trivial: e.g. a junction-like cell often has 3+ bits set.
- It keeps code readable and stable: if (m & E) says exactly what it means.

This approach scales better than large “if char in …” lists and reduces bugs when new glyphs are introduced.


#### Netline

A netline entry contains:
- <pre>LE</pre>: wire ends and wire→component terminations
- LJ: branching junctions (graph degree ≥ 3)
- CE: component-edge glyph cells (pins/protrusions) adjacent to wire
- CJ: component-internal junctions / pin-to-pin connections (*)

CJ **— component internal connectivity (*)**

Some components create **permanent** connectivity between pins without external wires:
- connectors (pin ↔ pin)
- jumpers / shunts (bridging nets)
- some fixed “wired” adapters

Policy intent:
- When a matched catalog component has known internal wiring, it should contribute a CJ structure describing which pins are tied together.

Notes:
- Switches are special: their connectivity can depend on state, so they may be excluded from netlist policy or represented as conditional connectivity (*).
- CJ would allow the net engine to optionally “collapse” nets through components that behave like fixed links. (*)

