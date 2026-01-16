# AsciiCAD

AsciiCAD is a browser-based ASCII / UTF-8 schematic editor designed to embed **digital and electronic schematics directly inside source code**.  Instead of external CAD files, schematics become **readable text** that lives next to the firmware, HDL, or documentation it describes.

Try it online:  
- <a href=https://beyondmicrocontrol.github.io/AsciiCAD/index.html>RUN AsciiCAD</a>
- <a href="https://beyondmicrocontrol.github.io/AsciiCAD/index.html?d=eNqtlU9rgzAYxu9+ive+i//qztaMUuamLK4USj9ALztvt9bzDhYilcEYlMEuhX2nfJIlqV3VRk1VCZo3kDy/503eOHlEQMlm6ParPKjaNGh+KIn/O9rNaMa+a0oO4j1Ui9sGr5bTyuwtvnJ3/ebQlNA06dp2ratvgR6+ARZuFK1e3uamvYTjcPtEiRP5PPF+V0hwclIg+Ui6h5nnFRQmvADSr9OETKZUp5ecPUCjA6im/efK/k5QlNX2ELp2HmHvnkUWd3JW5da4Wez5gJGbb87FOs3UW7VES1IvV+PUI4CnuQEPUxywyCxSy441r7Fu5GKtBcbIsHRn2bgW53IAIs4V4CmLjAsux4ZXsEwI/DvUn0vNI+e6PQbPIeJcepmLdNqdrAv5R4+L41PubWyxo6CLE+yzSC/Woqiw+htOlbz+ppQTmewQCCJWMuHYqBDFA/1Lsopyv9wWr7iB+P4AnMC7VA==#">EXAMPLE SCHEMA</a>

**Caution**: AsciiCAD does not replace the need for a real CAD program for electronic schema design, but when someone is downloading (e.g. Arduino) source code only, a simple embedded schematic can help to test this code very quickly on a breadboard.

---

## Why AsciiCAD?

- Schematics as plain text
- Clean Git diffs
- No binaries, no lock-in
- Schematics stay close to code
- Ideal for MCU, CPU, and digital designs

---

## Features

- Freeform drawing with curated UTF-8 glyphs
- Single and double line routing with automatic junction resolution
- Single and double boxes (ICs, modules, blocks)
- Free text placement
- Component catalog (MCUs, logic, symbols)
- Paste from clipboard with preview
- Undo / Redo
- Load, Save, Clear
- Load schematics via URL parameters
- Pan and zoom for large grids

---

## Designed For

- Embedded and firmware developers
- Open-source hardware projects
- Documentation inside codebases
- Architecture sketches and design reviews

---

## AsciiCAD Lab

<a href="https://beyondmicrocontrol.github.io/AsciiCAD/tools/TOOLS_CATALOG.html"><img src="/res/VintageLab256.png?raw=true" width=100% /></a>

<a href=https://beyondmicrocontrol.github.io/AsciiCAD/tools/TOOLS_CATALOG.html>LAB TOOLS</a>

- Image to Base64: Helps extending your component catalog. Since catalog items are represented by icons sized at 64x64 pixels and hard-coded as base64 strings.   
- FileJS: Helps create URI data for AsciiCAD (index.html?d=...[URI content]...), which provides an all-containing URL loading AsciiCAD with schema included. (<a href="https://beyondmicrocontrol.github.io/AsciiCAD/index.html?d=eNqtlU9rgzAYxu9+ive+i//qztaMUuamLK4USj9ALztvt9bzDhYilcEYlMEuhX2nfJIlqV3VRk1VCZo3kDy/503eOHlEQMlm6ParPKjaNGh+KIn/O9rNaMa+a0oO4j1Ui9sGr5bTyuwtvnJ3/ebQlNA06dp2ratvgR6+ARZuFK1e3uamvYTjcPtEiRP5PPF+V0hwclIg+Ui6h5nnFRQmvADSr9OETKZUp5ecPUCjA6im/efK/k5QlNX2ELp2HmHvnkUWd3JW5da4Wez5gJGbb87FOs3UW7VES1IvV+PUI4CnuQEPUxywyCxSy441r7Fu5GKtBcbIsHRn2bgW53IAIs4V4CmLjAsux4ZXsEwI/DvUn0vNI+e6PQbPIeJcepmLdNqdrAv5R4+L41PubWyxo6CLE+yzSC/Woqiw+htOlbz+ppQTmewQCCJWMuHYqBDFA/1Lsopyv9wWr7iB+P4AnMC7VA==#">EXAMPLE SCHEMA</a>).  We can fit decent size schematics into a URI since AsciiCAD unpacks (inflates) the URI data using ZLIB.   FileJS uses the same library to compress schema text files into a small-size URI string, usually below 1024 characters.
---

## Technical Notes

- Browser-only focused HTML and JavaScript codebase
- Runs fully client-side
- No frameworks, no build step
- Output is optimized for monospace editors (VS Code, Arduino IDE, terminals)

---

## Feature wish-list

- [ ] Refactor index.html (main file) to fully run in a signle file, with no immediate external dependencies 
- [ ] Line conflict resolution is buggy, for the simple reason it is complex ;-) (single lines, double lines, double thickness lines, etc...)
- [ ] Embed a component editor + Import/Export Ascii component library

## Status

Actively evolving.  
Focused on correctness, editor compatibility, and expressive schematic text.






