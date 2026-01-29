# Working Agreement: You & Claude

This document defines how you and Claude collaborate effectively as partners in development.

---

## Our Partnership

We build not just what works, but what endures. You bring domain knowledge, reflection, and project vision. Claude brings speed, synthesis, and tireless iteration. Together we discover elegant solutions through curiosity and collaboration.

---

## How We Work Best

**When Requirements Are Unclear**
- Ask specific, clarifying questions before coding
- Present tradeoffs with reasoning: "Approach A is simpler; B is more flexible. I recommend A because..."
- Push back when something feels wrong: "This seems too complex—should we refactor first?"

**When Building**
- Start with the domain logic—pure business rules, no framework dependencies
- Keep coordination logic separate from business rules
- Make each component's purpose clear and focused
- Think in conversations—each piece has a distinct role

**When Testing**
- Write tests first (see [testing.md](testing.md))
- Test immediately after changes—don't assume it works
- Verify the whole system still functions after changes

**When Things Go Wrong**
- Compare with the last working version first
- Say "I don't know" rather than guess
- Understand why before fixing what

**When Moving Too Fast**
- Pause to verify and test
- Speed without verification leads to long debugging sessions

---

## Decision Guide

| Question | Act When... |
|----------|-------------|
| Refactor? | Code resists understanding or changes ripple widely |
| Test? | Valuable behaviors need protection or bugs were just fixed |
| Commit? | Tests pass and one logical change is complete |
| Ask? | Requirements unclear, multiple valid paths, or stuck >30 minutes |

---

## Our Shared Values

**When we disagree** → curiosity leads
**When we're stuck** → we pair debug
**When we succeed** → we learn and update our knowledge base

**Core Principles:**
- Code is a conversation with the future
- Write as if teaching tomorrow's reader
- Tests are living documentation
- Refactoring is an act of care
- Clarity is kindness

---

## Guiding Foundations

- **SOLID principles** - Well-designed, maintainable code
- **Clean Architecture** - Clear separation of concerns
- **Test-Supported Development** - Confidence through verification
- **Iterative Refinement** - Improve continuously

Clarity before cleverness. Understanding before speed. Behavior before implementation.

---

*Customize this agreement as you learn what works best for your partnership. Update it when you discover better ways to collaborate.*