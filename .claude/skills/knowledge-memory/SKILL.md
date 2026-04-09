---
name: knowledge-memory
description: Use when someone asks to save content to archives, store knowledge in context, retrieve stored files or knowledge, search for information, summarize documents, or manage long-term knowledge.
argument-hint: "[operation and topic or file]"
disable-model-invocation: true
---

# Knowledge / File Memory Skill

A system that stores, retrieves, summarises, updates, and manages long-term knowledge across files, archives, and context.
This skill acts as the Second Brain of the Executive Assistant.

It integrates with:

- Research Skill (store insights)
- Planning Skill (store roadmaps, tasks)
- Brand Voice Skill (store voice updates)
- Content Creation & Social Media (store content libraries)
- Client Management (store client histories)
- MCP Automation Skill (automated saving and retrieval)

## Live Context (auto-injected)

**Archives index:** !`ls -1 archives/ 2>/dev/null | grep -v "^\." || echo "No archives indexed yet"`

**Previous knowledge maps:** !`find archives/insights -name "*.md" 2>/dev/null | head -5 || echo "No knowledge maps archived yet"`

**Recent research reports:** !`find archives/research -name "*.md" 2>/dev/null | sort -r | head -3 || echo "No research archived yet"`

**Context files available:** !`ls -1 context/*.md 2>/dev/null | xargs -n1 basename || echo "No context files found"`

---

## Execution Method

1. **Parse the request**
   - The request is: $ARGUMENTS
   - **DISAMBIGUATION:** If the request involves multiple automated steps (e.g., “summarize this meeting, save to archives, and email the client”), delegate to MCP Automation. This skill handles single file operations only.
   - Identify whether the user wants:
     - storage
     - retrieval
     - summarisation
     - updating
     - file search
     - context modification

2. **If needed, call the Knowledge Memory Agent**
   - Call `.claude/agents/knowledge-memory/AGENT.md` with:
     - `subtask`: [the specific memory request: file summarization, knowledge extraction, context updates, version comparison, or metadata generation]
     - `content`: [file content or text]
     - `context`: [existing knowledge or metadata]
   - Use the agent for: summarization, extraction, metadata generation, version comparison
   - Do NOT use the agent for: synthesis or final knowledge narrative (keep at Opus level)

3. **Perform the memory operation** (ultrathink)
   - Save to the correct folder using the canonical routing table below
   - Retrieve and present the requested file or knowledge
   - Summarise or transform content as needed
   - Update context files safely and cleanly
   - **Collision handling:** If a file exists, create a versioned copy (`-v2`, `-v3`) unless the user explicitly confirms overwrite

4. **Return the final output**
   - Clean summary
   - Retrieved content
   - Confirmation of save/update with file path
   - Knowledge map

---

## Canonical Archive Routing Table

Use this table to determine where to save content. All other skills reference this table for file paths:

| Content Type | Archive Path | File Format |
|---|---|---|
| **Research reports** | `archives/research/YYYY-MM-DD-[slug].md` | Markdown |
| **Blog posts, social content** | `archives/content/YYYY-MM-DD-[type]-[slug].md` | Markdown (type: blog, social, email, etc.) |
| **Strategic plans, roadmaps, task breakdowns** | `archives/plans/YYYY-MM-DD-[slug].md` | Markdown |
| **Meeting summaries, call notes** | `archives/meetings/YYYY-MM-DD-[slug].md` | Markdown |
| **Strategic insights, frameworks, knowledge maps** | `archives/insights/YYYY-MM-DD-[slug].md` | Markdown |
| **Client work (proposals, invoices, scope)** | `archives/client-work/[client-name]/YYYY-MM-DD-[type].md` | Markdown (type: proposal, invoice, scope, etc.) |
| **Context updates (goals, priorities, voice)** | `context/[filename].md` | Markdown (filename: goals.md, current-priorities.md, brand-voice.md, etc.) |

**Naming conventions:**
- `[slug]` = lowercase, hyphen-separated, no spaces (e.g., `ai-automation-society-strategy`)
- `[client-name]` = exact client folder name (e.g., `Nexgen Electrical`)
- `[type]` = content type short code (blog, social, proposal, invoice, etc.)
- Always include date as `YYYY-MM-DD` for versioning and retrieval

---

## Output Format

### For saving:

# Save Confirmation

Saved to: `{path}`  
File: `{filename}`  
Notes: `{metadata}`

---

### For retrieval:

# Retrieved Content

{content}

---

### For summarisation:

# Summary

## Key Points

- …

## Insights

- …

## Action Items

- …

---

### For knowledge lookup:

# Knowledge Map: {Topic}

## Files

- …

## Summaries

- …

## Insights

- …

---

## Integration Points

### Consumers
- **Planning** — Retrieves archived roadmaps, past decisions, and strategic context to inform new plan development
- **Business Strategy** — Accesses long-term strategic notes, competitor analysis, and decision history for pattern recognition and consistency
- **All Skills** — Provides unified retrieval interface for archived outputs, enabling context-aware decision-making across the skill suite

---

## Notes

- Always maintain clean, structured file naming.
- Never overwrite without explicit permission.
- Use Haiku for summarisation and extraction.
- Use Opus for synthesis and context updates.
- For multi-step automation workflows, use MCP Automation (not this skill).
- **This table is authoritative** — all other skills reference it for file paths. Update only if archive structure changes.
- See `README.md` for documentation and knowledge templates.
