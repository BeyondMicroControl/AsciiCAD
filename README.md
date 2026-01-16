# AsciiCAD

AsciiCAD is a browser-based ASCII / UTF-8 schematic editor designed to embed **digital and electronic schematics directly inside source code**.  Instead of external CAD files, schematics become **readable text** that lives next to the firmware, HDL, or documentation it describes.

Try it online:  
- <a href=https://beyondmicrocontrol.github.io/AsciiCAD/index.html>RUN AsciiCAD</a>
- <a href="https://beyondmicrocontrol.github.io/AsciiCAD/index.html?d=eNqtlU9rgzAYxu9+ive+i//qztaMUuamLK4USj9ALztvt9bzDhYilcEYlMEuhX2nfJIlqV3VRk1VCZo3kDy/503eOHlEQMlm6ParPKjaNGh+KIn/O9rNaMa+a0oO4j1Ui9sGr5bTyuwtvnJ3/ebQlNA06dp2ratvgR6+ARZuFK1e3uamvYTjcPtEiRP5PPF+V0hwclIg+Ui6h5nnFRQmvADSr9OETKZUp5ecPUCjA6im/efK/k5QlNX2ELp2HmHvnkUWd3JW5da4Wez5gJGbb87FOs3UW7VES1IvV+PUI4CnuQEPUxywyCxSy441r7Fu5GKtBcbIsHRn2bgW53IAIs4V4CmLjAsux4ZXsEwI/DvUn0vNI+e6PQbPIeJcepmLdNqdrAv5R4+L41PubWyxo6CLE+yzSC/Woqiw+htOlbz+ppQTmewQCCJWMuHYqBDFA/1Lsopyv9wWr7iB+P4AnMC7VA==#">EXAMPLE SCHEMA</a>
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

- Image to Base64: This tool helps extending the component catalog. Since catalog items are represented by icons sized at 64x64 pixels, they are   

---

## Technical Notes

- Browser-only focused HTML and JavaScript codebase
- Runs fully client-side
- No frameworks
- No build step
- Output is optimized for monospace editors (VS Code, Arduino IDE, terminals)

---

## Feature wish-list

- [ ] Refactor index.html (main file) to fully run in a signle file, with no external resources
- [ ] Line conflict resolution is buggy, for the simple reason it can be complex (single lines, double lines, double thickness lines, etc...)

## Status

Actively evolving.  
Focused on correctness, editor compatibility, and expressive schematic text.






