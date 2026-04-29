# Frontmatter Schema (Cheatsheet)
> Full reference: `.claude/rules/archives/frontmatter-schema-full.md`

**SKILL.md** — required fields: `name` (kebab-case), `description` (80–200 words, starts "Use this skill…"), `argument-hint`, `disable-model-invocation: true`

**AGENT.md** — required fields: `name` (kebab-case), `mode` (analyze|research|execute|validate|synthesize), `role` (≤2 sentences), `trigger`

**Docs** — required fields: `title`, `description` (1 line), `category` (guides|reference|playbook|example), `status` (active|draft|archived), `last-updated` (YYYY-MM-DD)
