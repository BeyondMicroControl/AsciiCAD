
# Development Philosophy

## Core Values

**Clarity Above All**
- Code is read far more than it's written
- Write for the next person (often your future self)
- Clarity is an act of kindness to your collaborators
- Simple solutions are usually better than clever ones

**Quality is Incremental**
- Perfect code doesn't exist, but better code does
- Small improvements compound over time
- Leave code cleaner than you found it
- Progress over perfection

**Understanding Before Building**
- Don't start coding until you understand the problem
- Ask questions when requirements are unclear
- Explore the domain before jumping to solutions
- Sometimes the best code is the code you don't write

---

## How We Build Software

**Test-First, Always**
- Every feature begins with a failing test
- One test at a time—focus, implement, refactor
- Tests reveal the design; don't fight them
- Red-green-refactor is our rhythm (see [testing.md](testing.md))

**Work in Small Steps**
- Write one test, make it pass, refactor, commit
- Never refactor on red—get to green first
- Commit after every successful refactor
- Small steps make problems easier to debug

**Let the Code Emerge**
- Don't design everything upfront
- Write the test, write the simplest code, refactor to reveal patterns
- The design emerges through the refactoring step
- Trust the process—over-engineering comes from skipping steps

**Domain-Driven Design**
- Model the business domain in code
- Use domain language everywhere (see [domain-language.md](domain-language.md))
- Business rules live in domain objects
- Keep infrastructure concerns at the edges

---

## Design Principles

**Pure Domain Model (DDD)**
- Business rules belong in domain objects, not services
- Keep the core pure—no databases, no frameworks
- Domain model returns values or raises domain exceptions
- This makes testing trivial and reasoning clear

**Separation of Concerns**
- Domain layer: pure business logic, no external dependencies
- Service layer: coordination, orchestration, and boundary protection
- Infrastructure layer: databases, APIs, external systems
- Exceptions at service boundaries (validate input, catch domain exceptions)
- Clear boundaries make testing and changes easy

**Explicitness**
- Make dependencies and relationships obvious
- Implicit behavior breeds confusion
- Prefer verbose and clear over terse and clever

**Testability**
- If it's hard to test, it's probably poorly designed
- Pure domain model = easy testing, no mocks needed
- Tests guide better architecture

---

## What We Value

**Behavior Over Implementation**
- What the code does matters more than how
- Test behavior, not implementation details
- Implementation can change; behavior should stay stable
- Focus on contracts and interfaces, not internals

**Discovery Over Planning**
- Tests reveal what the code needs to be
- Refactoring reveals the right abstraction
- Small steps reveal the path forward
- Trust emergence over upfront design

**Discipline Over Improvisation**
- Red-green-refactor: no shortcuts
- One test at a time: resist the urge to skip ahead
- Commit after refactoring: preserve progress
- The rhythm produces quality

**Domain Clarity**
- Use the language of the business domain
- Business rules in domain objects, not scattered in services
- Pure domain model makes everything easier
- Code should read like the domain expert talks

**Error Handling Philosophy**
- Domain objects raise exceptions for violated business rules
- Services catch and handle exceptions at boundaries
- Don't let exceptions leak across architectural layers
- Make error messages helpful for debugging

---

## Our Commitment

We strive to:
- Build systems that are easy to understand and change
- Make thoughtful decisions and document them (see [decisions.md](decisions.md))
- Test our assumptions and verify our work
- Learn continuously and update our practices
- Collaborate with respect and curiosity

We acknowledge:
- Not all code will be perfect
- Sometimes pragmatism trumps principle
- Technical debt happens—manage it consciously
- Context matters—adapt principles to the situation

---
