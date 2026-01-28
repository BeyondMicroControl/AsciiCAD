# Refactoring: When and How

Refactoring is improving code structure without changing behavior. It's an act of care—making code clearer, more maintainable, and easier to extend.

---

## When to Refactor

**Always Refactor When:**
- Tests are green and you see an improvement
- You've just made a test pass and the code can be better
- Duplication has appeared
- A new concept has emerged that deserves a name

**The Green Bar Rule:**
- Only refactor when all tests are green
- If tests are red, make them green first
- If you break tests while refactoring, undo and take a smaller step
- Never mix refactoring with adding features

**Don't Refactor When:**
- Tests are failing (get to green first)
- You don't have tests (write them first)
- You're guessing at future needs (YAGNI—You Ain't Gonna Need It)

---

## The Golden Rules of Refactoring

**1. Never refactor on red—only on green**
Tests must pass before you refactor. If they don't, make them pass first.

**2. Commit after every successful refactor**
When tests are green after refactoring, commit immediately. This creates safety checkpoints.

**3. Never refactor and add features at the same time**
Refactor OR add functionality, never both.

**The Rhythm:**
1. Write a failing test (RED)
2. Make it pass with simple code (GREEN)
3. Refactor to improve the design (REFACTOR)
4. Run tests to confirm still green
5. Commit with a clear message
6. Repeat for next test

This rhythm creates safety, clarity, and continuous progress.

---

## Common Refactoring Patterns

**Extract Method/Function**
- Break large functions into smaller, focused ones
- Give each piece a descriptive name
- Improves readability and reusability

**Rename**
- Update names to reflect current understanding
- Better names make code self-documenting
- Don't be afraid to change names as understanding grows

**Extract Class**
- When a class does too much, split it
- Each class should have one clear responsibility
- Makes code easier to test and modify

**Simplify Conditionals**
- Extract complex conditions into well-named functions
- Use guard clauses to reduce nesting
- Flatten deeply nested structures

**Remove Duplication**
- Don't repeat yourself (DRY principle)
- Extract repeated code into shared functions
- But don't obsess—some duplication is acceptable if abstractions would be forced

---

## Safe Refactoring Process

1. **Verify green bar** - All tests must pass before refactoring
2. **Make one small change** - Extract a method, rename a variable, etc.
3. **Run tests immediately** - Verify behavior hasn't changed
4. **If green, commit** - Preserve this checkpoint
5. **If red, undo** - Take a smaller step
6. **Repeat** - Small improvements, committed frequently

**Each commit represents:**
- A stable, working state
- One logical improvement
- A safe rollback point if needed

**Commit messages should describe what improved:**
- "Extract calculateDiscount method"
- "Rename userId to customerId for clarity"
- "Remove duplication in validation logic"

---

## Red Flags: Code Smells

These patterns suggest code might benefit from refactoring:

- **Long functions** - Hard to understand what's happening
- **Large classes** - Trying to do too much
- **Long parameter lists** - Consider an object or configuration
- **Duplicated code** - Changes require updates in multiple places
- **Dead code** - Unused functions or variables add confusion
- **Comments explaining what code does** - Code should be self-explanatory
- **Complex conditionals** - Hard to trace logic
- **Tight coupling** - Changes in one place force changes elsewhere

---

## Refactoring Mindset

**Refactoring is continuous**
- Happens after every test passes
- Not a separate phase—it's part of the red-green-refactor cycle
- Small, frequent refactorings prevent big, scary ones

**Listen to the code**
- Refactoring reveals the design that wants to emerge
- Don't force abstractions—let them appear naturally
- Duplication is okay until you see the pattern (Rule of Three)

**Commit discipline creates safety**
- Each green refactor gets committed
- Small commits mean easy rollback
- Frequent commits mean never losing much work
- Clear messages mean understanding history later

**Trust your tests**
- Green bar means you can refactor fearlessly
- Tests catch mistakes immediately
- Without tests, refactoring is guessing

---

*Refactoring makes future work easier. Invest a little time now to save a lot of time later. See [testing.md](testing.md) for ensuring safe refactoring.*