<a href="https://beyondmicrocontrol.github.io/AsciiCAD/index.html">
<img src="res/AsciiCAD_logo.png">
<img src="res/AsciiCAD_frontpage.png">
</a>

# Presentation

This is a browser-based app built from one of the simplest digital building blocks ever elevated to an art form: **ASCII**. The project was conceived primarily as an essay in accelerating complexity by strategically embracing bare-bones simplicity at the outset, then letting [policy](docs/design.md) and Large Language Models (LLMs) do much of the heavy lifting. In fact, version 1.0 came together in just a few weeks.

At the heart of the project lies a central thesis: **2D semantics**. While LLMs excel at interpreting plain text when it is presented as a one-dimensional stream of words or tokens, they remain remarkably underprepared for two-dimensional meaning. Humans, by contrast, developed language in a fundamentally multimodal way. Images, speech, music, poetry, and even ASCII art are all forms of expression—and many of them still pose a serious challenge for LLMs. Although some of these modalities depend on extracting meaning from vast, richly formatted datasets, ASCII tables, schemas, and diagrams remain extremely lightweight while still being [surprisingly difficult for LLMs to decode](https://www.youtube.com/watch?v=rWtMkoRhm-M). That is precisely the challenge this project explores—and perhaps, eventually, helps solve.

Beyond illustrating this broader ambition, the concept also addresses a very practical use case: **embedding digital and electronic schematics directly inside source code**. Traditionally, microcontroller projects rely on separate CAD files that orbit around the codebase. With AsciiCAD, however, schematics made of **readable text** can live alongside the code itself, evolve with it, and remain tightly integrated into the project. **Caution**: this is not a replacement for full CAD applications designed to support an entire PCB workflow end to end. Rather, it is a playful but serious proof of concept—one that can nonetheless speed up circuit prototyping in a meaningful way.

What makes AsciiCAD especially compelling is that it does more than simply display a schematic visually. Its very 2D arrangement carries enough data density to preserve the metadata and syntax of a wiring diagram, making logical and even electrical simulation possible (for example through SPICE), literally by pasting “just text” into a grid. Some may prefer to keep such a project entirely domain-agnostic, rather than focused on a field like electronics. But by deliberately separating out [specialisation layers](https://github.com/BeyondMicroControl/AsciiCAD/blob/main/docs/design.md#specialisation-layers), the project remains flexible: anyone who wants to fork it for other Computer-Aided Design applications should be able to do so without friction.

Read more about the [design goals](#design-goals), or without further due: 
- <a href=https://beyondmicrocontrol.github.io/AsciiCAD/index.html>Try AsciiCAD</a>
- <a href="https://beyondmicrocontrol.github.io/AsciiCAD/index.html?raw=R05EIOKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUr+KUgeKUgeKUgeKUgeKUgeKUgeKUr+KUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg4pSCICAgICAg4pSCCis1ViDilIDilKzilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilILilIDilIDilIDilIDilIDilIDilILilIDilIDilIDilKzilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIAKICAgICDilIIgICAgICAgICAgICAgICAgICAgICAgICAg4pSCICAgICAg4pSCICAg4pSCCiAgICAg4pSCICAgICAgICAgICAgICAgICAgICAgICAgIOKUgiAgICAgIOKUgiAgIOKUggogICAgIOKUgiAg4pWU4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWXICDilIIgICAgICDilIIgICDilIIKICAgICDilIIgIOKVkSDil48gIFtVMSBBVFRpbnlYMjRdIOKVkSAg4pSCICAgICAg4pSCICAg4pSCCiAgICAg4pSCICDilZEgICAgICAgICAgICAgICAgICAg4pWRICDilIIgICAgICDilIIgICDilIIgICDilIzilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilJAKICAgICDilJTilIDilIDilaIgVkNDICAgICAgICAgICBHTkQg4pWf4pSA4pSA4pSYICAgICAg4pSCICAg4pSCICAg4pSCICAg4pSM4pSA4pSA4pSA4pSA4pSA4pSQIOKUggogICAgICAgIOKVkSAgICAgICAgICAgICAgICAgICDilZEgICAgIOKVlOKVkOKVkOKVkOKVp+KVkOKVkOKVkOKVp+KVkOKVkOKVkOKVp+KVkOKVkOKVkOKVp+KVkOKVkOKVkOKVlyDilIIg4pSCCiAgICAgICAg4pWiIFBBNCAgICAgICBTQ0sgUEEzIOKVnyAgICAg4pWRICBHTkQgVkNDIFNDTCBTREEgIOKVkSDilIIg4pSCCiAgICAgICAg4pWRICAgICAgICAgICAgICAgICAgIOKVkSAgICAg4pWR4pSM4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSQ4pWRIOKUgiDilIIKICAgICAgICDilaIgUEE1ICBSWDEgTUlTTyBQQTIg4pWfICAgICDilZHilIIgICAgICAgICAgICAgICAgIOKUguKVkSDilIIg4pSCCiAgICAgICAg4pWRICAgICAgICAgICAgICAgICAgIOKVkSAgICAg4pWR4pSCICAgIFtTU0QxMzA2XSAgICDilILilZEg4pSCIOKUggogICAgICAgIOKVoiBQQTYgIFRYMSBNT1NJIFBBMSDilZ8gICAgIOKVkeKUgiAgNjQgeCAzMiBPTEVEICAg4pSC4pWRIOKUgiDilIIKICAgICAgICDilZEgICAgICAgICAgICAgICAgICAg4pWRICAgICDilZHilIIgICAgICAgICAgICAgICAgIOKUguKVkSDilIIg4pSCCiAgICAgICAg4pWiIFBBNyAgICAgIFVQREkgUEEwIOKVnyAgICAg4pWR4pSU4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSY4pWRIOKUgiDilIIKICAgICAgICDilZEgICAgICAgICAgICAgICAgICAg4pWRICAgICDilZrilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZ0g4pSCIOKUggogICAgICAgIOKVoiBQQjMgUlgwICAgU0NMIFBCMCDilZ/ilIDilIDilIDilJAgICAgICAgICAgICAgICAgICAgICAgIOKUgiDilIIKICAgICAgICDilZEgICAgICAgICAgICAgICAgICAg4pWRICAg4pSCICAgICAgICAgICAgICAgICAgICAgICDilIIg4pSCCiAgICAgICAg4pWiIFBCMiBUWDAgICBTREEgUEIxIOKVn+KUgOKUgOKUgOKUguKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUmCDilIIKICAgICAgICDilZrilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZ0gICDilJTilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilJg=">Try AsciiCAD + example schema</a>
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
- **Persistence Lab**: Helps create URI data for AsciiCAD (index.html?d=...[URI content]...), which provides an all-containing URL loading AsciiCAD with schema included. (<a href="https://beyondmicrocontrol.github.io/AsciiCAD/index.html?raw=R05EIOKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUr+KUgeKUgeKUgeKUgeKUgeKUgeKUr+KUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg4pSCICAgICAg4pSCCis1ViDilIDilKzilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilILilIDilIDilIDilIDilIDilIDilILilIDilIDilIDilKzilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIAKICAgICDilIIgICAgICAgICAgICAgICAgICAgICAgICAg4pSCICAgICAg4pSCICAg4pSCCiAgICAg4pSCICAgICAgICAgICAgICAgICAgICAgICAgIOKUgiAgICAgIOKUgiAgIOKUggogICAgIOKUgiAg4pWU4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWXICDilIIgICAgICDilIIgICDilIIKICAgICDilIIgIOKVkSDil48gIFtVMSBBVFRpbnlYMjRdIOKVkSAg4pSCICAgICAg4pSCICAg4pSCCiAgICAg4pSCICDilZEgICAgICAgICAgICAgICAgICAg4pWRICDilIIgICAgICDilIIgICDilIIgICDilIzilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilJAKICAgICDilJTilIDilIDilaIgVkNDICAgICAgICAgICBHTkQg4pWf4pSA4pSA4pSYICAgICAg4pSCICAg4pSCICAg4pSCICAg4pSM4pSA4pSA4pSA4pSA4pSA4pSQIOKUggogICAgICAgIOKVkSAgICAgICAgICAgICAgICAgICDilZEgICAgIOKVlOKVkOKVkOKVkOKVp+KVkOKVkOKVkOKVp+KVkOKVkOKVkOKVp+KVkOKVkOKVkOKVp+KVkOKVkOKVkOKVlyDilIIg4pSCCiAgICAgICAg4pWiIFBBNCAgICAgICBTQ0sgUEEzIOKVnyAgICAg4pWRICBHTkQgVkNDIFNDTCBTREEgIOKVkSDilIIg4pSCCiAgICAgICAg4pWRICAgICAgICAgICAgICAgICAgIOKVkSAgICAg4pWR4pSM4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSQ4pWRIOKUgiDilIIKICAgICAgICDilaIgUEE1ICBSWDEgTUlTTyBQQTIg4pWfICAgICDilZHilIIgICAgICAgICAgICAgICAgIOKUguKVkSDilIIg4pSCCiAgICAgICAg4pWRICAgICAgICAgICAgICAgICAgIOKVkSAgICAg4pWR4pSCICAgIFtTU0QxMzA2XSAgICDilILilZEg4pSCIOKUggogICAgICAgIOKVoiBQQTYgIFRYMSBNT1NJIFBBMSDilZ8gICAgIOKVkeKUgiAgNjQgeCAzMiBPTEVEICAg4pSC4pWRIOKUgiDilIIKICAgICAgICDilZEgICAgICAgICAgICAgICAgICAg4pWRICAgICDilZHilIIgICAgICAgICAgICAgICAgIOKUguKVkSDilIIg4pSCCiAgICAgICAg4pWiIFBBNyAgICAgIFVQREkgUEEwIOKVnyAgICAg4pWR4pSU4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSY4pWRIOKUgiDilIIKICAgICAgICDilZEgICAgICAgICAgICAgICAgICAg4pWRICAgICDilZrilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZ0g4pSCIOKUggogICAgICAgIOKVoiBQQjMgUlgwICAgU0NMIFBCMCDilZ/ilIDilIDilIDilJAgICAgICAgICAgICAgICAgICAgICAgIOKUgiDilIIKICAgICAgICDilZEgICAgICAgICAgICAgICAgICAg4pWRICAg4pSCICAgICAgICAgICAgICAgICAgICAgICDilIIg4pSCCiAgICAgICAg4pWiIFBCMiBUWDAgICBTREEgUEIxIOKVn+KUgOKUgOKUgOKUguKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUmCDilIIKICAgICAgICDilZrilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZDilZ0gICDilJTilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilJg=">EXAMPLE SCHEMA</a>).  The [compression test bench](https://beyondmicrocontrol.github.io/AsciiCAD/tools/codecTool.html) helps to make sure most schematics fit a URI since AsciiCAD unpacks (inflates) the URI data using a lightweight compression/decompression library.
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






