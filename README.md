<a href="https://beyondmicrocontrol.github.io/AsciiCAD/index.html">
<img src="res/AsciiCAD_logo.png">
<img src="res/AsciiCAD_frontpage.png">
</a>

# Presentation

This is a browser-based app built from one of the simplest digital building blocks ever elevated to an art form: **ASCII**. The project was conceived primarily as an essay in accelerating complexity by strategically embracing bare-bones simplicity at the outset, then letting [policy](docs/design.md) and Large Language Models (LLMs) do much of the heavy lifting. In fact, version 1.0 came together in just a few weeks.

At the heart of the project lies a central thesis: **2D semantics**. While LLMs excel at interpreting plain text when it is presented as a one-dimensional stream of words or tokens, they remain remarkably unprepared for two-dimensional semantics. Humans, by contrast, developed language in a fundamentally multimodal way. Images, speech, music, poetry, and even ASCII art. Even considering the lightweight aspect of ASCII tables, schemas, and diagrams compared to typically much denser datasets found in other modalities, differently arranged ASCII data remains [surprisingly difficult for LLMs to decode](https://www.youtube.com/watch?v=rWtMkoRhm-M). That is precisely the challenge this project explores and eventually, helps solve.

Beyond illustrating this broader ambition, the concept also addresses a very practical use case: **embedding digital and electronic schematics directly inside source code**. Traditionally, microcontroller projects rely on separate CAD files that orbit around the codebase. With AsciiCAD, however, schematics made of **readable text** can live alongside the code itself, evolve with it, and remain tightly integrated into the project. **Caution**: this is not a replacement for full CAD applications designed to support an entire PCB workflow end to end. Rather, it is a playful but serious proof of concept—one that can nonetheless speed up circuit prototyping in a meaningful way.

What makes AsciiCAD especially compelling is that it does more than simply display a schematic visually. Its very 2D arrangement carries enough data density to preserve the metadata and syntax of a wiring diagram, making logical and even electrical simulation possible (for example through SPICE), literally by pasting “just text” into a grid. Some may prefer to keep such a project entirely domain-agnostic, rather than focused on a field like electronics. But by deliberately separating out [specialisation layers](https://github.com/BeyondMicroControl/AsciiCAD/blob/main/docs/design.md#specialisation-layers), the project remains flexible: anyone who wants to fork it for other Computer-Aided Design applications should be able to do so without friction.

Read more about the [design goals](#design-goals), or without further due: 
- <a href=https://beyondmicrocontrol.github.io/AsciiCAD/index.html>Try AsciiCAD</a>
- <a href="https://beyondmicrocontrol.github.io/AsciiCAD/index.htmlLZSS=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">Try AsciiCAD + example schema</a>
- <a href="https://beyondmicrocontrol.github.io/AsciiCAD/dist/AsciiCAD.html?download=self">Download AsciiCAD.html</a> - the all-in-one portable file.

---

# Documentation

| File | Read When... |
|------|--------------|
| [User manual](docs/AsciiCAD_User_Manual.md#quick-start) | Getting started and learning how to use the App. |
| [Change Log](docs/decisions.md) | Learning how the App evolved, and will continue so. |
| [Design Strategy](docs/design.md) | Discussing approach, writing policy or making design decisions.<br>Understanding why something was built a certain way. |
| [How to contribute](docs/style-guide.md) | Bringing up new ideas or learn to add new features. |

<!--| [Contrinute - testing] | Writing tests or discuss a test strategy |-->
<!--| working-agreement.md | Starting any session |-->
<!--| refactoring.md | Code needs improvement or restructuring |-->
<!--| design-patterns.md | Solving a design problem or choosing an approach |-->
<!--| domain-language.md | Discussing domain concepts or naming on electronic design |-->
<!--| decisions.md | Understanding why something was built a certain way |-->

---

# Specification

| Draw Modes | Component Catalog | Tools | Select & Edit | Navigate | History & Persistence | Terminal |
|---------------|-------------------|-------|---------------|----------|-----------------------|----------|
| Freeform drawing<br>& Free text | Catalog picker | Schema highlight | Area selection | Large grid support | Undo / Redo<br>Clear | CLI
| Orthogonal<br>line routing | Parameterised<br>catalog items | Schema match<br>(extraction) | Move, Copy,<br>Paste, Blank<br>(rectangle) | Pan, Zoom | Load / Save<br>Permalink | Scripting<br>(basics)
| Box drawing | | Netlist highlight<br> & report | | |

---

# Experimentation

<a href="https://beyondmicrocontrol.github.io/AsciiCAD/tools/TOOLS_CATALOG.html"><img src="/res/VintageLab256.png?raw=true" width=100% /></a>

## AsciiCAD Lab

<a href=https://beyondmicrocontrol.github.io/AsciiCAD/tools/TOOLS_CATALOG.html>LAB TOOLS</a>

- **Main App Debugger**: <a href="https://beyondmicrocontrol.github.io/AsciiCAD/tools/AsciiCAD_debug.html">AsciiCAD debug</a>
- **Inline Image Lab**: [Image2Base64](https://beyondmicrocontrol.github.io/AsciiCAD/tools/Image_to_Base64.html) helps extending the component catalog. Since catalog items are represented by icons sized at 64x64 pixels and hard-coded in as base64 strings, this is the tool we need.
- **Picking the perfect glyph**: Requires a toolchain with
   -  A tool [generating training data](https://beyondmicrocontrol.github.io/AsciiCAD/tools/AsciiCAD_helper_tools/README.md) built from the most common UTF-8 glyphs (offline python script)
   -  [Font to BMP](https://beyondmicrocontrol.github.io/AsciiCAD/tools/UTF8_to_bmp.html): to rasterise one glyph, and model its bitmap to what we approximately need
   -  [Score Glyph](https://beyondmicrocontrol.github.io/AsciiCAD/tools/score_glyph.html): generating a top-list of UTF-8 characters that are most resembling to any given bitmap   
- **Persistence Lab**: Helps create URI data for AsciiCAD (index.html?d=...[URI content]...), which provides an all-containing URL loading AsciiCAD with schema included. - <a href="https://beyondmicrocontrol.github.io/AsciiCAD/index.html?raw=R05EIOKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUr+KUgeKUgeKUgeKUgeKUgeKUgeKUr+KUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg4pSCICAgICAg4pSCCis1ViDilIDilKzilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilILilIDilIDilIDilIDilIDilIDilILilIDilIDilIDilKzilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIAKICAgICDilIIgICAgICAgICAgICAgICAgICAgICAgICAg4pSCICAgICAg4pSCICAg4pSCCiAgICAg4pSCICAgICAgICAgICAgICAgICAgICAgICAgIOKUgiAgICAgIOKUgiAgIOKUggogICAgIOKUgiAg4pWU4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWXICDilIIgICAgICDilIIgICDilIIKICAgICDilIIgIOKVkSDil48gIFtVMSBBVFRpbnlYMjRdIOKVkSAg4pSCICAgICAg4pSCICAg4pSCCiAgICAg4pSCICDilZEgICAgICAgICAgICAgICAgICAg4pWRICDilIIgICAgICDilIIgICDilIIgICDilIzilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilJAKICAgICDilJTilIDilIDilaIgVkNDICAgICAgICAgICBHTkQg4pWf4pSA4pSA4pSYICAgICAg4pSCICAg4pSCICAg4pSCICAg4pSM4pSA4pSA4pSA4pSA4pSA4pSQIOKUggogICAgICAgIOKVkSAgICAgICAgICAgICAgICAgICDilZEgICAgIOKVlOKVkOKVkOKVkOKVp+KVkOKVkOKVkOKVp+KVkOKVkOKVkOKVp+KVkOKVkOKVkOKVp+KVkOKVkOKVkOKVlyDilIIg4pSCCiAgICAgICAg4pWiIFBBNCAgICAgICBTQ0sgUEEzIOKVnyAgICAg4pWRICBHTkQgVkNDIFNDTCBTREEgIOKVkSDilIIg4pSCCiAgICAgICAg4pWRICAgICAgICAgICAgICAgICAgIOKVkSAgICAg4pWR4pSM4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSQ4pWRIOKUgiDilIIKICAgICAgICDilaIgUEE1ICBSWDEgTUlTTyBQQTIg4pWfICAgICDilZHilIIgICAgICAgICAgICAgICAgIOKUguKVkSDilIIg4pSCCiAgICAgICAg4pWRICAgICAgICAgICAgICAgICAgIOKVkSAgICAg4pWR4pSCICAgIFtTU0QxMzA2XSAgICDilILilZEg4pSCIOKUggogICAgICAgIOKVoiBQQTYgIFRYMSBNT1NJIFBBMSDilZ8gICAgIOKVkeKUgiAgNjQgeCAzMiBPTEVEICAg4pSC4pWRIOKUgiDilIIKICAgICAgICDilZEgICAgICAgICAgICAgICAgICAg4pWRICAgICDilZHilIIgICAgICAgICAgICAgICAgIOKUguKVkSDilIIg4pSCCiAgICAgICAg4pWiIFBBNyAgICAgIFVQREkgUEEwIOKVnyAgICAg4pWR4pSU4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSY4pWRIOKUgiDilIIKICAgICAgICDilZEgICAgICAgICAgICAgICAgICAg4pWRICAgICDilZrilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZ0g4pSCIOKUggogICAgICAgIOKVoiBQQjMgUlgwICAgU0NMIFBCMCDilZ/ilIDilIDilIDilJAgICAgICAgICAgICAgICAgICAgICAgIOKUgiDilIIKICAgICAgICDilZEgICAgICAgICAgICAgICAgICAg4pWRICAg4pSCICAgICAgICAgICAgICAgICAgICAgICDilIIg4pSCCiAgICAgICAg4pWiIFBCMiBUWDAgICBTREEgUEIxIOKVn+KUgOKUgOKUgOKUguKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUmCDilIIKICAgICAgICDilZrilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZ0gICDilJTilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilJg=">EXAMPLE SCHEMA</a>.  The [compression test bench](https://beyondmicrocontrol.github.io/AsciiCAD/tools/codecTool.html) helps to make sure most schematics fit a URI since AsciiCAD unpacks (inflates) the URI data using a lightweight compression/decompression library.
- **Terminal Lab**
   - A minimal [vanilla-JavaScript terminal](https://beyondmicrocontrol.github.io/AsciiCAD/tools/VanillaTerminal.html)
   - CMD instruction [parser and compiler](https://beyondmicrocontrol.github.io/AsciiCAD/tools/CMD_tool.html)
   - A test bench for secure script execution via a [worker-thread](https://beyondmicrocontrol.github.io/AsciiCAD/tools/WorkerTest.html)

---

# Expectation

<a href="docs/design.md"><img src="/res/gazing.jpg?raw=true" width=100% /></a>

## Design goals

Last but not least (we haven't yet reached that point), the Terminal CLI will be used to expand the tools capability from a UI-driven tool to an AI-driven tool.  Wouldn't it be satisfying to see a schematic built in real-time by interacting with an LLM trained in electronic design?  Likely, but here's the thing: the end goal would be to demonstrate one can design an app that conceptially embraces 2 types of agents.  
- One agent in charge of electronic design, which makes the agent a Senior User (PRINCE2) having the ability to do business with the tool (electronic design) and understand business needs that can help to express new requirements.
- A second agent specialised in software design, a Product Delivery Manager as it were, with the ability to create and extend the tool itself and explain to the Senior User how to use the new features implemented as required.

This emulates a necessary **'tension' between operations and projects** that (since sliced bread) has been the succes formula of the <a href="https://www.youtube.com/watch?v=6v8e7dUwq_Q">modern enterprise</a>.

---

## Wish-list


- [ ] Improve the CLI (terminal and script parser, enabler for script automation)
- [ ] Script automation and AI agent interaction
- [ ] Create a built-in catalog item wizard (CADScript-based?)
- [ ] Forge a better plan for junction resolution (single lines, double lines, double thickness lines, etc...)
- [ ] Debug Monospace issues.  Not all UTF8 characters are monospace-friendly, requiring meticuloust character selection (still buggy)
- [ ] Analog circuit simulation (simple filters and op-amp circuits), based on netlist and catalog item parsing
- [ ] Tabbed multi-page grid with cross-page waypoints
- [ ] Improve Netline algorithm
- [ ] MCP service to generate AsciiCAD schema within IDE (VSCode, Arduino,..)

## Status

Actively evolving ==> check [work in progress](docs/decisions.md#work-in-progress)  
Focused on correctness, editor compatibility, and expressive schematic text.






