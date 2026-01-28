# Domain Language: Project Vocabulary

> 📝 **Template Note:** Replace examples with your actual domain terms. This becomes most valuable as your project grows.

This document defines key terms and concepts for your project. A shared vocabulary reduces confusion and makes communication clearer between team members and in the codebase.

---

## Purpose

Domain language establishes:
- **Consistent naming** across code, docs, and conversations
- **Shared understanding** of key concepts
- **Clear boundaries** between different parts of the system
- **Reduced ambiguity** in requirements and discussions

---

## How to Use This File

1. **Add terms as they emerge** - Don't try to define everything upfront
2. **Define them clearly** - What does this term mean in *your* domain?
3. **Keep definitions short** - One or two sentences is usually enough
4. **Use terms consistently** - In code, docs, tests, and conversations
5. **Update when understanding changes** - Refine definitions as you learn

---

## Core Domain Terms

Define the key concepts in your domain. Examples:

**User**
A person with an account who can log in and access the system.

**Administrator**
A user with elevated privileges who can manage other users and system settings.

**Session**
A period of authenticated interaction between a user and the system, typically ending after timeout or logout.

**Transaction**
An atomic operation that either fully succeeds or fully fails, maintaining data consistency.

---

## Business Concepts

Define business-specific terms. Examples:

**Order**
A customer request to purchase one or more products, including shipping and payment information.

**Inventory**
The current quantity of each product available for sale.

**Fulfillment**
The process of preparing and shipping an order to a customer.

---

## Technical Terms

Define technical concepts specific to your architecture. Examples:

**Repository**
An interface for accessing and persisting domain objects, abstracting data storage details.

**Service**
A component that coordinates business operations across multiple domain objects.

**Event**
A notification that something significant happened in the system, triggering downstream actions.

---

## Ubiquitous Language

Use these terms everywhere:
- ✅ In code: class names, function names, variables
- ✅ In tests: test names and descriptions
- ✅ In documentation: READMEs, comments, guides
- ✅ In conversations: team discussions, requirements

When code and conversations use different words for the same concept, confusion follows. Align your language.

---

## Anti-Glossary: Terms to Avoid

List vague or overloaded terms that cause confusion:

**❌ "Process"** - Too vague. Use specific verbs: validate, calculate, send, etc.
**❌ "Manager"** - Usually means a class is doing too much. Be more specific.
**❌ "Data"** - What kind of data? User? Order? Configuration?
**❌ "Handle"** - Handle how? Parse? Validate? Store? Be explicit.

---

## Template Entry

When adding new terms, use this format:

**[Term Name]**
[One sentence definition explaining what it means in your domain.]
[Optional: Example usage or clarification.]

---

## Getting Started

1. Start with 5-10 core terms from your domain
2. Add new terms when they appear in multiple places
3. Update definitions when your understanding evolves
4. Review this file when onboarding new team members
5. Reference it during design discussions

---

*This is a living document. As your project grows and understanding deepens, your domain language will evolve. Keep it current and keep it simple.*