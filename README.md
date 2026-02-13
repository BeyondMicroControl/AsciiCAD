<a href="https://beyondmicrocontrol.github.io/AsciiCAD/index.html">
<img src="res/AsciiCAD_logo.png">
<img src="res/AsciiCAD_frontpage.png">
</a>

## Intro

This is a browser-based app based on building blocks once raised to the level of art: ASCII. It was designed as a "digital essay" on fasttracking complexity by strategising bare-bones simplicity at its conception.  As a matter of fact, v1.0 was put together in a few weeks time.

Apart from it's higher purpose, its product covers a real need: **embedding digital and electronic schematics directly inside source code**. Instead of attaching a cluster of external CAD files to source code, by means of AsciiCAD, schematics become **readable text** that live as close as possible to the software, firmware, or documentation they describe. **Caution**: AsciiCAD does not replace CAD apps for driving an entire PCB design workflow end-to-end; it is most effective for fast circuit prototyping.  Adding (e.g., Arduino) source-code-embedded schematics indeed makes prototyping circuits and flashing their associated codebase into a microprocessor  <i>harder, better, faster & stronger</i> (credits: Daft Punk) as, now, **codebase and schematic can be united as one**.

Moreover, not only does AsciiCAD depict the entire schema visually; its 2D aspect has the potential to hold much of the metadata & syntactics of a wiring diagram inside the ASCII composition itself.  In other words, it may even allow logical and even electric behavior simulation (e.g. SPICE), literally by pasting "just text" into the AsciiCAD grid.

Try online:  
- <a href=https://beyondmicrocontrol.github.io/AsciiCAD/index.html>RUN AsciiCAD</a>
- <a href="https://beyondmicrocontrol.github.io/AsciiCAD/index.html?d=eNqtlUFrgzAUx+9+inffxah1Z6ujlLopiy2F0g+wy87bbfU8mIWIMhiDXnYZ7DvlkyzJ7Ko2aqpK0LxA8v/9X/Li7M4DSnZjtx/lQdWmQftDSfzf0a4mK/Z9oeRbvMdqcdfgxXJalb3DV+Fu2ByaEpomfVvWufoeaPYGsFkicKLo4fF5bVhbMd49U2JFPk+8XxUynBwVSDGSHmDluiWFGa+A9PM4IZcpNeklJw/Q6gDqef+6sJ8JiqraAULHKiLsLlhkcicnVW6Nm8WuD9hzit05W6edeq+WaEnq5WqcegJwv0ZwO8cBi4wytexc8yLrRy7W2mDsIVO3t61rcS4bIOJcAZ6zCJ1x2RY8gWlA4N94w7nUPHKu679gGXqcS69ykV67k/chfx9wc3zIvU1NdhR0cYJ9FunlWhQV1nzFqZI3X5VyIoMdAkHESiacohpRPNLPJK8pD8tt+Yobie8XKn27kA==">RUN AsciiCAD + example schema</a>
- Download a portable all-in-one-file: <a href="https://beyondmicrocontrol.github.io/AsciiCAD/dist/AsciiCAD.html?download=self">AsciiCAD.html</a>

<a href=https://github.com/BeyondMicroControl/AsciiCAD/blob/main/docs/AsciiCAD_User_Manual.md#quick-start>Get started - user manual</a>

---

## Why AsciiCAD?

- Hardware and Software become 'one': **sourcecode**
- It's text-based schematics allow semantic extraction (beyond 'just a drawing')
- Ideal for MCU, CPU, and digital designs
- No binaries, no lock-in

---

## Features at a glance

- Drawing & Layout
  - Freeform drawing
  - Orthogonal line routing
  - Box drawing modes
  - Free text placement
- Component Catalog
  - Integrated component catalog
  - Parameterised catalog items
- Schema Highlighting & Analysis
  - Schema Highlight
  - Schema Match (semantic extraction)
- Selection & Editing
  - Area selection
  - Move, Copy, Paste, Blank (rectangle)
- Navigation & View
  - Large grid support
  - Pan, Zoom
- History & Persistence
  - Undo / Redo / Clear
  - Load / Save /Permalink support
- Terminal
  - Command-line interface
  - Scripting (basics) 

---

## AsciiCAD Lab

<a href="https://beyondmicrocontrol.github.io/AsciiCAD/tools/TOOLS_CATALOG.html"><img src="/res/VintageLab256.png?raw=true" width=100% /></a>

<a href=https://beyondmicrocontrol.github.io/AsciiCAD/tools/TOOLS_CATALOG.html>LAB TOOLS</a>

- **Test harness** <a href="https://beyondmicrocontrol.github.io/AsciiCAD/tools/AsciiCAD_debug.html">AsciiCAD debug</a>
- **Image to Base64**: Helps extending your component catalog. Since catalog items are represented by icons sized at 64x64 pixels and hard-coded as base64 strings.   
- **FileJS**: Helps create URI data for AsciiCAD (index.html?d=...[URI content]...), which provides an all-containing URL loading AsciiCAD with schema included. (<a href="https://beyondmicrocontrol.github.io/AsciiCAD/index.html?d=eNqtlUFrgzAUx+9+inffxah1Z6ujlLopiy2F0g+wy87bbfU8mIWIMhiDXnYZ7DvlkyzJ7Ko2aqpK0LxA8v/9X/Li7M4DSnZjtx/lQdWmQftDSfzf0a4mK/Z9oeRbvMdqcdfgxXJalb3DV+Fu2ByaEpomfVvWufoeaPYGsFkicKLo4fF5bVhbMd49U2JFPk+8XxUynBwVSDGSHmDluiWFGa+A9PM4IZcpNeklJw/Q6gDqef+6sJ8JiqraAULHKiLsLlhkcicnVW6Nm8WuD9hzit05W6edeq+WaEnq5WqcegJwv0ZwO8cBi4wytexc8yLrRy7W2mDsIVO3t61rcS4bIOJcAZ6zCJ1x2RY8gWlA4N94w7nUPHKu679gGXqcS69ykV67k/chfx9wc3zIvU1NdhR0cYJ9FunlWhQV1nzFqZI3X5VyIoMdAkHESiacohpRPNLPJK8pD8tt+Yobie8XKn27kA==">EXAMPLE SCHEMA</a>).  We made sure most schematics fit a URI since AsciiCAD unpacks (inflates) the URI data using ZLIB.   FileJS uses the same library to compress schema text files into a small-size URI string, usually below 1024 characters.
- **VanillaTerminal**: A vanilla-JavaScript terminal framework test

---

## Wish-list

- [x] Automatically deploy a one-file .html app in /dist (v1.0)
- [x] CLI (terminal and script parser) enabling scripting automation and AI agent interaction
  - [ ] alias (command aliases for easier typing, e.g. alias CS="CADScript")
- [ ] Junction resolution is buggy, for the simple reason it is complex (single lines, double lines, double thickness lines, etc...)
- [ ] Not all UTF8 characters are monospace-friendly, leading to less perfect character selection (still buggy)
- [ ] Embed a component editor + Import/Export Ascii component catalog
- [ ] SPICE circuit simulation
- [ ] Tabbed multi-page grid with waypoints
- [ ] MCP service to generate AsciiCAD schema within IDE (VSCode, Arduino,..)

## Status

Actively evolving.  
Focused on correctness, editor compatibility, and expressive schematic text.






