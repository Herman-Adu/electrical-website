# Knowledge / File Memory Skill

Second brain for persistent knowledge management: store, retrieve, summarize, organize, and discover knowledge across projects and conversations.

## When to Use

- **Save research and insights** — Archive research reports, competitive analyses, market insights for future reference
- **Organize learning** — Store frameworks, templates, patterns, and solutions discovered during projects
- **Retrieve historical decisions** — Find prior decisions, agreements, or strategic directions made in past conversations
- **Summarize long documents** — Extract key insights from 10-page reports into 1-page summaries with metadata
- **Update context files** — Maintain living documents (priorities, goals, strategy notes) that inform future work
- **Archive completed projects** — Organize deliverables, code, designs, and documentation by project
- **Build a knowledge graph** — Connect related insights, flag dependencies, and discover patterns across all knowledge
- **Onboard team members** — Provide structured access to organizational knowledge, decisions, and past work

**Trigger:** `/knowledge-memory "[action: save, retrieve, summarize, organize, tag, or search]"`

## Key Features

- **Persistent Storage** — All files persist across conversations and sessions
- **Organized Archives** — 6 topic-specific folders (research, insights, content, plans, meetings, client-work) + context files
- **Canonical Routing** — Single authoritative location for each knowledge type (no duplication)
- **Smart Summarization** — Extract key insights and metadata from long documents automatically
- **Full-Text Search** — Find knowledge by keyword, date, project, or client
- **Metadata Tagging** — Track source, date, relevance, and relationships
- **Context Management** — Maintain living priorities, goals, and strategy files
- **Version History** — Track how knowledge evolves (e.g., strategy changes)

## How to Invoke

```bash
/knowledge-memory "Save this competitive analysis report to archives/insights/"
/knowledge-memory "Retrieve all past decisions about Full Stack Fusion pricing"
/knowledge-memory "Summarize this 15-page research report with key insights"
/knowledge-memory "Organize all client documents under Acme Corp"
/knowledge-memory "Update context/current-priorities.md with new Q1 goals"
/knowledge-memory "Find all insights about AI development platforms"
/knowledge-memory "Create a knowledge map linking related research findings"
```

## Archive Organization

| Location                         | Purpose                                                | Examples                                                                        |
| -------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------- |
| `archives/research/`             | Research reports, market analysis, competitive studies | "Market Analysis: AI Platforms 2026", competitor reviews                        |
| `archives/insights/`             | Strategic insights, frameworks, brand voice, decisions | "Brand Voice Profile", "5 Lessons from Full Stack Fusion", strategic frameworks |
| `archives/content/`              | Published content, blogs, social posts, scripts        | Blog posts, LinkedIn threads, email sequences                                   |
| `archives/plans/`                | Strategic plans, roadmaps, phases, timelines           | "Q1 2026 Roadmap", phase breakdowns, sprint plans                               |
| `archives/meetings/`             | Meeting summaries, notes, decisions, action items      | "Discovery Call: Nexgen Electrical", client kickoffs                            |
| `archives/client-work/[client]/` | All client-specific materials                          | Proposals, SOWs, scope docs, email chains                                       |
| `context/`                       | Living files that inform daily work                    | `priorities.md`, `goals.md`, `brand-voice.md`, `work.md`                        |

## Examples

### Example 1: Save Research Report

```
/knowledge-memory "Save this competitive analysis to archives/insights/ with metadata"
[Report content provided]
Context: Project = Full Stack Fusion, Topic = AI Platforms, Date = March 2026
```

**Output:**

- Saved to: `archives/insights/competitive-analysis-ai-platforms-2026-03-11.md`
- Metadata: Tags = [AI, competition, FSD], Source = Internal research, Date = 2026-03-11
- Summary: "8 major platforms analyzed; market consolidation around 3 leaders; education segment fragmented"

### Example 2: Retrieve Related Knowledge

```
/knowledge-memory "Find all past decisions about FSD pricing strategy"
```

**Output:**

- Retrieved 3 documents:
  1. "FSD Pricing Strategy v1.0" (2026-01-15) — Initial pricing model
  2. "FSD Pricing Revision" (2026-02-28) — Changed to mid-market focus
  3. "Q1 FSD Review" (2026-03-10) — Confirmed mid-market positioning
- Timeline shows evolution of strategy
- Key decision: Targeted $5-15/month (underserved segment)

### Example 3: Summarize & Archive

```
/knowledge-memory "Summarize this 12-page research report and save to archives/insights/"
[12-page report provided]
```

**Output:**

- Summary (300 words): Key findings, surprising insights, actionable recommendations
- Metadata generated: Keywords, date range, source, confidence level
- Saved to: `archives/insights/[summary-title]-2026-03-11.md`

## Integration with Other Skills

- **All skills** — Knowledge Memory supports every other skill by providing context (past decisions, brand voice, project history)
- **Research** — Research skill saves findings here
- **Planning** — Uses priorities and goals from `context/`
- **Content Creation** — References past content style and strategy
- **Client Management** — Archives all client communications
- **Business Strategy** — Maintains strategic decisions and market analysis

## When NOT to Use

❌ Do NOT use knowledge-memory for:

- Temporary notes (use a local text file instead)
- Private/sensitive data requiring encryption (this is unencrypted storage)
- Live operational dashboards (archives are historical, not real-time)
- General task management (use phase-tracker instead)
- Purely personal notes without organization

## Worked Examples

**For full worked examples:** `.claude/reference/examples/knowledge-memory/worked-examples.md`

## Error Handling

| Scenario                                              | What Happens                              | How to Fix                                                     |
| ----------------------------------------------------- | ----------------------------------------- | -------------------------------------------------------------- |
| File already exists in archive                        | Skill asks: update or create new version? | Specify: "create v2" or "update existing"                      |
| Unclear routing (e.g., is this research or insights?) | Skill flags ambiguous category            | Clarify: "this is market research" vs. "this is a key insight" |
| Missing metadata (no date or source)                  | Skill uses current date and infers source | Provide explicit: date, source, project context                |
| Very long document (>5000 words)                      | Skill may sample sections for summary     | Provide clear brief or let skill summarize primary sections    |
| Knowledge not found on search                         | Skill returns empty result                | Verify filename/keywords or check multiple archive folders     |
| Context file conflicts (e.g., priorities changed)     | Skill flags breaking change before update | Review old vs. new, approve change                             |

## Advanced Usage

- **Knowledge graph visualization** — Map relationships between insights ("A depends on B", "C contradicts D")
- **Periodic updates** — Archive knowledge that evolves quarterly (e.g., quarterly strategy review)
- **Cross-project learning** — Link insights across projects to find patterns
- **Onboarding packs** — Create curated sets of knowledge for new team members
- **Decision audits** — Track why decisions were made and how they evolved

## Related Files

- **Knowledge Agent:** `.claude/agents/knowledge-memory/AGENT.md` — Haiku sub-agent for extraction and summarization
- **Storage:** `archives/*/` — All archive folders + `context/` for living documents
- **Related skills:** Research (generates insights), Planning (uses context), Client Management (archives client work)

---

**For full technical documentation, see [`SKILL.md`](SKILL.md)**
