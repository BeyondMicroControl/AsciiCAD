# Architectural Decision Records (ADRs)


This document captures important architectural and design decisions for the project. Recording decisions helps future contributors understand why things are the way they are.

---

## Why Document Decisions?

**Context fades quickly**
- What seemed obvious in the moment becomes mysterious later
- Without context, changes get reversed or repeated

**Decisions have consequences**
- Understanding trade-offs prevents naive "improvements" that backfire
- New team members can see the reasoning behind current architecture

**Learning compounds**
- Reviewing past decisions reveals patterns
- Mistakes become lessons when documented

---

## When to Document a Decision

Record decisions that:
- **Affect architecture** - Structure, layers, major components
- **Involve trade-offs** - You chose one approach over alternatives
- **Are controversial** - Team debated the best approach
- **Constrain future work** - Later decisions depend on this choice
- **Might surprise others** - "Why did they do it this way?"

Don't document:
- Trivial or obvious choices
- Easily reversible decisions
- Standard practices or patterns

---

## Decision Template

Use this format for each decision:

### [Source packager] - [28-Jan-2026]

- [ ] Create a software packager for client-side JavaScript/HTML, quickly putting all includable files into one single production release file with absolutely no dependencies.
- [ ] Refactor index.html (main file) to fully run in a signle file, with no immediate external dependencies 
- [ ] Junction resolution is buggy, for the simple reason it is complex (single lines, double lines, double thickness lines, etc...)
- [ ] Not all UTF8 characters are monospace-friendly, leading to less perfect character selection (still buggy)
- [ ] Embed a component editor + Import/Export Ascii component catalog


**Context**
Since AsciiCAD is meant as a rapid schema development tool, it sould be portable in every sense, having one file that does it all would be ideal.
Therefore we though about creating a software packager for client-side JavaScript/HTML, quickly putting all includable files into one single production release file with absolutely no dependencies.

**Decision**
Even if very handy, do not consider merging this codebase in one file, reasons listed in consequences.
We'd only reconsider after successfully indentifying and validating a candidate package manager.  Preferably offered within the GitHub web environment.

**Alternatives Considered**
What other options did we evaluate?
- Include a package manager that compiles all dependencies into one file: rejected because unhandy for the user, and hard to offer multi-platform versions.

**Consequences**
- **Benefits:** Keep vibe coding low cost by separating codebase logically into multiple files.
- **Trade-offs:** Less friendly for  consumers of this app, need to keep all dependencies in a directory structure.
- **Risks:** Less attractive for end users.

**Status**
Active

---

## Example Decision Record

### Use Repository Pattern for Data Access - 2024-01-15

**Context**
We need to persist users, orders, and products. Current code directly uses database queries scattered throughout business logic, making testing difficult and coupling domain logic to SQL.

**Decision**
Implement Repository pattern to abstract data access. Each domain object gets a repository interface (UserRepository, OrderRepository) implemented by concrete database repositories.

**Alternatives Considered**
- **Active Record:** Objects save themselves. Rejected because it tightly couples domain logic to persistence.
- **Direct SQL everywhere:** Current approach. Rejected because it makes testing hard and violates separation of concerns.
- **ORM without abstraction:** Use ORM directly in business logic. Rejected because it still couples to a specific ORM library.

**Consequences**
- **Benefits:** Business logic becomes testable with mock repositories. Can swap databases without changing domain code. Clear separation of concerns.
- **Trade-offs:** Extra abstraction layer adds some complexity. More files to maintain.
- **Risks:** Over-abstraction if repositories get too generic. Must keep interfaces focused.

**Status**
Active

---

## Your Decision Records

Start adding your decisions below:

---

### [Your First Decision] - [Date]

**Context**
[Why did you need to make this decision?]

**Decision**
[What did you choose to do?]

**Alternatives Considered**
- Option 1: [Description and why rejected]

**Consequences**
- **Benefits:**
- **Trade-offs:**
- **Risks:**

**Status**
Active

---

## Tips for Writing Good ADRs

**Be concise** - Aim for clarity, not completeness. One page is ideal.

**Capture alternatives** - Show you considered options thoughtfully.

**Focus on "why"** - The decision itself is visible in code; explain the reasoning.

**Update status** - When decisions change, mark them superseded rather than deleting them.

**Write soon after deciding** - Capture context while it's fresh.

---

*Decision records are most valuable when revisited. Review them when making related decisions, onboarding new team members, or evaluating whether to change direction.*