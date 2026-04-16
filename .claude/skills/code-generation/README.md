# Code Generation Skill

Senior engineer for writing, testing, refactoring, and documenting code.

## When to Use

Use Code Generation when you need to:
- Write new features or APIs
- Refactor or optimize existing code
- Generate or improve tests
- Debug errors and troubleshoot
- Create architecture diagrams
- Write technical documentation
- Explain code behavior or design

**Trigger phrases:**
- `/code-generation "[task]"`
- "Write a function that X"
- "Refactor this code"
- "Create tests for X"
- "Debug this error"
- "Explain how this works"

## How It Works

```
1. You provide code task, file path, or error
2. Skill reads relevant files and context
3. Haiku agents handle: debugging, refactoring, test generation
4. Opus synthesizes code, documentation, explanation
5. Code saved to specified path with git-ready commits
```

## Key Features

- **Multi-Language** — JS, Python, Go, Rust, etc.
- **Test Generation** — Unit + integration tests
- **Refactoring** — Optimization + readability
- **Documentation** — Code comments + API docs
- **Error Analysis** — Debugging + solutions
- **Architecture** — Diagrams + design explanations

## Output

Code files written to your project:
- Feature code → Specified path (e.g., `src/utils/`)
- Tests → `[path].test.js` or `test_[name].py`
- Docs → `[feature].md` or code comments
- Architecture → Saved to `/docs/`

## Integration

- **Planning** — Code generation follows dev roadmap
- **Brand Voice** — Documentation uses consistent tone
- **Knowledge Memory** — Archives generated code examples

## Example

```
/code-generation "Create a React component for user dashboard with tests"
```

Produces:
- Dashboard component (React)
- Unit tests
- Component documentation
- TypeScript types if applicable

## Common Use Cases

### 1. Feature Implementation
**Scenario:** Build a new component or API endpoint
**Process:**
- Provide: Feature description, tech stack, acceptance criteria
- Skill generates: Code + tests + documentation
- Output: Pull-request-ready code

**Example:** `/code-generation "Create Express middleware for JWT authentication with tests"`

### 2. Debugging & Error Resolution
**Scenario:** Production error or unexpected behavior
**Process:**
- Provide: Stack trace, code snippet, reproduction steps
- Skill analyzes: Root cause, explains why it happens
- Output: Fix + regression test + lesson learned

**Example:** `/code-generation "Debug: React component renders twice on mount. I have Strict Mode enabled."`

### 3. Test Generation & Coverage
**Scenario:** Increase test coverage or add missing tests
**Process:**
- Provide: Code to test, test framework, coverage goals
- Skill generates: Unit tests + integration tests
- Output: Ready-to-run test suite

**Example:** `/code-generation "Generate Jest tests for validateEmail function. Cover edge cases: null, undefined, XSS attempts."`

### 4. Refactoring & Modernization
**Scenario:** Improve code quality, reduce technical debt
**Process:**
- Provide: Current code, refactoring goals (DX, performance, type safety)
- Skill refactors: Applies best practices, modernizes syntax
- Output: Improved code + performance benchmarks

**Example:** `/code-generation "Refactor this Promise chain to async/await. Improve error handling and reduce nesting."`

## Execution Strategies

### Super Powers Workflow (For Large Features)

Use for substantial features, architectural decisions, or multi-component projects (2–3h+ effort).

**Process:**
1. **Brainstorm** — Generate spec (500–1000 words) exploring scope, architecture, edge cases
2. **Plan** — Design component hierarchy, API surface, test structure
3. **Execute** — Generate tests first (TDD), then implementation code
4. **Auto-review** — Verify against spec, run tests, validate types

**Benefits:**
- Specs prevent rework and clarify requirements
- TDD ensures code correctness
- 60–70% token savings vs. baseline

**When to use:**
- New features (2–3h+)
- Architecture redesign
- Critical production features
- Ambiguous requirements

### Standard Workflow (For Quick Tasks)

Use for debugging, refactoring, one-off utilities, or when speed matters more than planning.

**Process:**
1. Parse request (language, framework, goal)
2. Fetch latest framework docs (Context7)
3. Delegate to code-generation agent if needed
4. Generate output

**When to use:**
- Bug fixes
- Quick refactors
- One-off functions
- Performance optimizations
- <2 hour effort

| Scenario | Workflow | Why |
|----------|----------|-----|
| New feature (2–3h+) | **Super Powers** | Specs prevent rework; TDD ensures correctness |
| Bug fix / Quick refactor | **Standard** | Faster feedback, less overhead |
| Architecture redesign | **Super Powers** | Plan ensures alignment, prevents mistakes |
| One-off utility | **Standard** | Overhead not justified |
| Critical production feature | **Super Powers** | TDD + auto-review catches issues early |

## Integration with Planning Skill

**Recommended workflow:**
1. **Planning Skill** defines features and architecture
2. **Code-Generation Skill** implements features from plan (using Super Powers workflow)
3. **Planning** provides context (tech stack, constraints) to Code-Generation
4. Code-Generation returns code ready for review and deployment

**Example:**
- Planning: "Build a three-tier authentication system with sessions and JWT"
- Code-Generation: Implements each tier (models, middleware, routes) with tests
- Result: Complete, tested implementation aligned with plan

## How to Structure Requests for Best Results

**Good request structure:**
```
/code-generation "[TASK]: [CONTEXT] | Tech: [STACK] | Test: [FRAMEWORK]"
```

**Example:**
```
/code-generation "Create: Form validation utility | Tech: TypeScript, React 18 | Test: Jest + React Testing Library"
```

**What to include:**
- **Task:** Clear, specific action (Create, Debug, Refactor, Test)
- **Context:** What the code does, who uses it, why it matters
- **Tech stack:** Language, framework, version, preferred libraries
- **Constraints:** Performance requirements, security needs, file size limits
- **Acceptance criteria:** What "done" looks like

**What NOT to include:**
- Vague requests ("make this better")
- Architectural decisions (handled by Planning)
- Multiple unrelated tasks (break into separate invocations)

## Error Scenarios & Recovery

**Scenario: Generated code has bugs**
- Check: Did you provide all context (framework versions, style guide)?
- Fix: Clarify the task and ask skill to reconsider edge cases
- Validate: Always test generated code before merging

**Scenario: Code doesn't match your conventions**
- Provide: Code style guide or example files in context
- Ask: "Match the style in [reference-file]"
- Validate: Review output against your standards

**Scenario: Skill refuses the request**
- Usually means: Task is too large or architectural
- Solution: Break into smaller tasks or use Planning first
- Example: Instead of "Refactor entire service", try "Refactor validateUser function"

## Performance & Optimization Tips

- **Token efficiency:** Provide only relevant code snippets (not entire files)
- **Test speed:** For large test suites, generate in batches (per component)
- **Refactor scope:** Limit to one function/component per request for accuracy
- **Context length:** Keep tech stack details concise (e.g., "TS 4.9, Node 18, Jest 29")

**Cost optimization:**
- Simple tasks (< 20 lines): ~$0.01–0.03
- Medium tasks (20–100 lines): ~$0.05–0.15
- Large tasks (100+ lines + tests): ~$0.20–0.40

## Limitations

- **Architecture decisions** — Best handled by Planning first
- **Large refactors** — Plan scope before execution
- **Framework choice** — Should be decided strategically beforehand
- **Multi-file coordination** — Break into single-file tasks when possible

---

**For full documentation, see [`SKILL.md`](SKILL.md)**
