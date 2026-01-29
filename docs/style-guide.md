# Code Style Guide

This guide defines coding standards and conventions for our project. Consistency makes code easier to read, maintain, and collaborate on.

---

## General Principles

**Clarity Over Cleverness**
- Write code that's easy to understand, not code that shows off
- If it needs extensive comments to explain, it probably needs refactoring
- Choose obvious solutions over clever ones

**Naming Matters**
- Use descriptive names in camelCase that reveal intent
- Functions and methods should be verbs: `calculateTotal()`, `validateInput()`
- Classes and types should be nouns: `UserAccount`, `OrderProcessor`
- Booleans should read like questions: `isValid`, `hasPermission`, `canEdit`

**Keep It Small**
- Functions should do one thing well
- Object containers (classes, user defined types) should have a single, clear responsibility

---

## Code Organization

**File Structure**
- Group related functionality together
- Keep public/gui interfaces at the top
- Internal/helper implementation below
- One primary class/concept per file

**Imports/Dependencies**
- Standard library first
- Third-party libraries next
- Local project imports last
- Alphabetize within each group

---

## Formatting

**Indentation**
- Use consistent indentation for code blocks, typically 2 spaces

**Line Length**
- Aim for 80-120 characters per line
- Break long lines at logical points
- Don't sacrifice readability for line length rules

**Whitespace**
- Use blank lines to separate logical sections
- Add space around operators: `x = a + b` not `x=a+b`

---

## Comments and Documentation

**When to Comment**
- Explain *why*, not *what*
- Document non-obvious decisions
- Warn about gotchas or edge cases
- Provide examples for complex APIs

**When NOT to Comment**
- Don't explain what the code obviously does
- Don't leave commented-out code (use version control instead)
- Don't apologize for code quality (fix it instead)

**Documentation**
- Include parameter descriptions and return values
- Provide usage examples in test harness for complex functionality

---

## Error Handling

- Fail fast and loudly during development
- Provide helpful error messages
- Don't swallow exceptions silently
- Validate input at boundaries

---

## Testing Considerations

- Write testable code (see [testing.md](testing.md))
- Avoid tight coupling to external dependencies
- Make dependencies explicit and injectable
- Keep side effects isolated and obvious

---

## JavaScript Conventions

**Language:** JavaScript

**Testing:**
- Debug using the <a href="https://beyondmicrocontrol.github.io/AsciiCAD/tools/AsciiCAD_debugger.html">overlay app</a>, aided by header/footer space providing debug commands and console messages
- Focus on unit-level testing
- Test harness and test assertions are maintained and updated </a href="https://github.com/BeyondMicroControl/AsciiCAD/blob/main/res/AsciiCAD_SanityCheck.js">here</a>

**Application Structure:**
- Apps should have a clear sections
   - HTML header & body, JavaScript body, HTML footer & SanityCheck (include file)
   - JavaScript body is sub-devided into
        - global variable declarations and initialisers
        - application-specific helpers
        - main codebase
- To be considered: CLI interface for E2E testing and LLM prompting

**Code Style:**
- Use 2 compound statement bracket styles {..} according to line length:
  - K&R Style until 80 characters
  - Allman Style above 80 characters
- Don't use compound statement brackets for single statements
- Use descriptive variable names (not abbreviated)

**Example Test Assertions:**

Simple one-liners below 120 characters
```javascript
console.assert(serializeToText().split('\n')[0].length === COLS, 'serializeToText -> COLS chars/line');
```
More complex/compound tests
```javascript
function setSmallGridFromLines(lines)
{
  for (let r = 0; r < lines.length; r++)
    for (let c = 0; c < lines[r].length; c++) ascii[r][c] = lines[r][c];
}

function testDoubleBusCross()
{
  setSmallGridFromLines([
    "   ",
    "   ",
    "═══",
    "═══",
    "   ",
  ]);
}

if (bDebug) { testDoubleBusCross(); wipeSelection(' '); }  
```
---

*These are our conventions for Client-side browser JavaScript development. Consistency across the codebase makes collaboration easier.*