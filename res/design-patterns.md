# Design Patterns: Preferred Solutions

> 📝 **Template Note:** Replace these examples with patterns your team actually uses. Remove this file if patterns aren't a focus.

This document lists design patterns we find useful and when to apply them. Patterns are tools, not rules—use them when they solve a real problem, not because they're clever.

---

## When to Use Patterns

**Do Use Patterns When:**
- You recognize a recurring problem
- The pattern simplifies the solution
- Team members will understand the pattern
- The pattern makes future changes easier

**Don't Use Patterns When:**
- A simpler solution exists
- You're applying patterns for their own sake
- The problem doesn't match the pattern's intent
- The pattern adds unnecessary complexity

---

## Creational Patterns

**Factory Method**
- **When:** Need to create objects without specifying exact class
- **Benefit:** Flexibility in object creation
- **Example:** Creating different types of reports, notifications, or parsers

**Builder**
- **When:** Constructing complex objects step by step
- **Benefit:** Clear, readable object construction
- **Example:** Building configuration objects, queries, or test data

---

## Structural Patterns

**Adapter**
- **When:** Need to make incompatible interfaces work together
- **Benefit:** Integrate third-party libraries without changing your code
- **Example:** Wrapping external APIs, converting data formats

**Dependency Injection**
- **When:** Components need external dependencies
- **Benefit:** Testability and flexibility
- **Example:** Passing database connections, services, or configuration to objects
- **Note:** This is arguably the most important pattern for testable code

**Repository**
- **When:** Need to separate data access from business logic
- **Benefit:** Business logic doesn't know about databases
- **Example:** UserRepository, OrderRepository abstract data storage

---

## Behavioral Patterns

**Strategy**
- **When:** Need to swap algorithms or behaviors at runtime
- **Benefit:** Flexibility without conditionals
- **Example:** Different sorting algorithms, payment processors, or validation rules

**Template Method**
- **When:** Algorithm structure stays the same, but steps vary
- **Benefit:** Reuse common structure, customize specific parts
- **Example:** Data processing pipelines, test setup/teardown

**Observer**
- **When:** Objects need to react to changes in other objects
- **Benefit:** Loose coupling between components
- **Example:** Event systems, UI updates, notification systems

---

## Patterns We Favor

List the patterns your team uses most often and specific guidance on how you prefer to implement them. Examples:

- **Dependency Injection**: Prefer constructor injection for required dependencies
- **Repository Pattern**: Keep repositories focused on a single aggregate root
- **Strategy Pattern**: Use when you have 3+ conditional branches doing similar things
- **Factory Method**: Better than complex constructors or multiple constructor overloads

---

## Anti-Patterns to Avoid

**God Objects**
- Classes that know or do too much
- **Instead:** Split into focused, single-responsibility classes

**Premature Abstraction**
- Creating patterns before you need them
- **Instead:** Wait until you see the pattern emerge naturally (Rule of Three)

**Pattern Obsession**
- Using patterns because they exist, not because they help
- **Instead:** Start simple, add patterns when complexity demands them

---

## Learning More

When facing a design challenge:
1. Understand the problem fully first
2. Consider if a simple solution exists
3. If complexity persists, explore relevant patterns
4. Apply the pattern, then refactor based on actual use
5. Document your decision in [decisions.md](decisions.md)

---

*Update this file as you discover patterns that work well for your team and domain. Remove patterns that don't add value. Make it your own.*