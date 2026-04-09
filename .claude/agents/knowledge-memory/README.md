# Knowledge / File Memory Agent

# Knowledge / File Memory Agent

## Summary

The knowledge/file memory agent extracts insights and generates metadata from file content. It enables long-term knowledge storage and fast retrieval by creating structured summaries with tags that feed back into decision-making workflows.

## Key Responsibilities

- Content Summarization — Create executive summaries of file content with 3–5 sentence overviews of key findings
- Insight Extraction — Identify 3–7 key insights with supporting evidence, page references, and actionable takeaways
- Metadata Generation — Create searchable tags (topics, themes, projects, source type, dates, keywords) for fast retrieval
- Knowledge Mapping — Identify knowledge gaps, follow-up questions, information requiring verification, and dependencies
- Quality Assessment — Evaluate information reliability, flag sources requiring validation, note assumptions and limitations

## Confidence Level

High (88%+) — Knowledge extraction methodology is sound and pattern-based. Metadata tagging enables reliable retrieval. Limitation: domain-specific or highly technical content may require subject matter expert validation.

## What This Agent Does

The Knowledge/File Memory Agent specialises in understanding file content and extracting actionable knowledge. Whether summarising research reports, extracting insights from interviews, identifying themes across documents, or generating metadata tags, the agent reads one file at a time and produces a structured knowledge summary. This enables long-term memory and fast retrieval across the assistant's growing knowledge base.

### Capabilities

- Summarise file content into executive summaries
- Extract 3–7 key insights with supporting evidence
- Generate metadata tags (topics, themes, related projects, source type)
- Identify knowledge gaps or questions for follow-up
- Compare versions of files or track how understanding evolves
- Map knowledge dependencies across files
- Generate retrieval metadata (searchable keywords, date ranges, author information)
- Flag important definitions, frameworks, or patterns
- Assess information quality and identify sources requiring verification

### Scope Boundaries

This agent does NOT:

- Orchestrate multi-file analysis — That's Opus-level skill coordination
- Route files to archives — Opus handles archival after knowledge extraction is complete
- Multi-step automation — Use `/mcp-automation` agent for workflow design
- Make strategic decisions based on knowledge — Agent informs, Opus and skill owner decide
- Modify or update the Knowledge Memory vault — Agent only reads and extracts; it does not write to `archives/`
- Combine insights across files — Agent analyses ONE file per invocation; synthesis is Opus level

## How It Fits Into the System

1. The **Knowledge/File Memory Skill** (`.claude/skills/knowledge-memory/SKILL.md`) receives a request to extract knowledge from a file
2. Skill reads the file content and gathers any relevant context (prior knowledge, project scope, metadata hints)
3. Skill invokes this **Knowledge/File Memory Agent** with a focused subtask (e.g., "summarise this research report and extract 5 key insights")
4. Agent analyses the input and returns a structured knowledge summary (Summary, Extracted Knowledge, Metadata Tags, Notes, Confidence)
5. Skill (Opus) synthesises the agent output, applies organisation logic, and stores it in the appropriate archive subdirectory
6. **Other skills** later query the memory system to retrieve relevant knowledge and inform decisions

The agent is never called directly by users — only by the Knowledge/File Memory Skill in response to user requests.

## Input Contract

| Parameter | Required | Description                                                                                                                      |
| --------- | -------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `subtask` | Yes      | The specific extraction task (e.g., "summarise and extract 5 key insights", "generate metadata tags", "identify knowledge gaps") |
| `content` | Yes      | The file content to analyse (one file per invocation; multi-file orchestration is Opus-level)                                    |
| `context` | No       | Existing metadata, prior knowledge about the file source, project context, or knowledge themes to consider                       |

**Token guidance:** If content exceeds 3000 tokens, agent should summarise primary sections and flag token limits in Notes. Encourage skill to invoke agent multiple times for large files (section by section).

## Output Contract

| Section             | Always Present | Description                                                                                                |
| ------------------- | -------------- | ---------------------------------------------------------------------------------------------------------- |
| Summary             | Yes            | 3–5 sentence executive summary of the file content                                                         |
| Extracted Knowledge | Yes            | 3–7 bullet points of key insights with supporting evidence or page references                              |
| Metadata Tags       | Yes            | Topics, themes, related projects, source type, date, author, and other retrieval hints                     |
| Notes               | Yes            | Assumptions, knowledge gaps flagged for follow-up, information requiring verification, and recommendations |
| Confidence          | Yes            | High / Medium / Low — indicates reliability of extracted knowledge                                         |

**Format:** Markdown with section headers. Metadata Tags should be structured as a list or table for parsing by the skill.

## Usage Example

**Skill invocation:** `/knowledge-memory "Summarise this research report and extract key insights"`

**Skill supplies to agent:**

```
subtask: Summarise this 15-page competitive analysis report and extract 5 key insights with metadata

content:
[Full text of "Market Analysis: AI Development Platforms 2026" report, 2,800 words, includes competitor features, pricing, market share estimates]

context:
Project: Full Stack Fusion (AI coding assistant product)
Source: Internal research, conducted March 2026
Related files: competitors.md, market-positioning.md
```

**Agent returns:**

```
### Summary
This competitive analysis covers 8 major AI development platforms in 2026, identifying market positioning, feature differentiation, and pricing models. The report reveals a shift toward open-source and self-hosted options, with proprietary platforms competing on integration depth and developer experience. Full Stack Fusion's target niche (education-focused, affordable, human-in-the-loop) has moderate competition but strong adoption potential.

### Extracted Knowledge

1. **Market consolidation around 3 leaders:** GitHub Copilot (code completion), Claude Code (full IDE integration), and Open Source Ollama (self-hosted) control 65% of enterprise adoption. Smaller platforms focus on niches.

2. **Pricing as differentiator:** Proprietary tools ($20–100/month) vs. open-source free + self-hosting. Mid-market pricing ($5–15/month) is underserved; opportunity for Full Stack Fusion.

3. **Integration depth is competitive moat:** Platforms with tight IDE/workflow integration (VS Code, GitHub, Claude Code) show higher user retention (75%+ vs. 45% for web-only tools).

4. **Education segment is fragmented:** No dominant player in educational coding—most platforms assume professional users. Full Stack Fusion's education focus is a clear differentiator.

5. **Human-in-the-loop feedback is emerging trend:** ChatGPT and Claude Code users value explanation + criticism, not just code generation. The market is shifting away from pure automation.

### Metadata Tags

**Topics:** Competitive analysis, AI platforms, market positioning, pricing models, developer experience

**Themes:** Market consolidation, integration depth, education gap, human-in-the-loop feedback, open-source adoption

**Related projects:** Full Stack Fusion, Adu Dev website, AI Executive Assistant

**Source type:** Internal research report, date range: March 2026, author: [Herman Adu]

**Key dates:** Report compiled 2026-03-09; market data from Feb 2026

**Search keywords:** AI platforms, competitive positioning, pricing, code completion, IDE integration, education market

### Notes

- **Knowledge gap:** Report does not include international markets (EU, APAC adoption rates). Consider adding regional analysis for future planning.
- **Verification needed:** Market share percentages (65% for leaders) are estimates; recommend validating with additional sources (Gartner, IDC).
- **Opportunity flag:** Human-in-the-loop feedback emerging as trend — aligns with Full Stack Fusion's differentiation. Recommend highlighting in positioning.
- **Follow-up:** Update this analysis quarterly as market evolves; AI space moves rapidly.

### Confidence

High (Report is recent, internally researched, and covers primary platforms thoroughly. Some market estimates should be cross-referenced with external sources.)
```

## Error Handling

| Scenario                                                                       | Agent Behaviour                                                                                                                                                                         |
| ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Empty/missing content                                                          | Returns Confidence: Low; Notes: "No file content provided. Cannot extract knowledge from empty input."                                                                                  |
| Ambiguous subtask (e.g., "analyse this")                                       | Best-effort analysis of provided content; flags: "Subtask was broad; this is a full knowledge extraction. For targeted analysis (e.g., 'extract pricing info only'), be more specific." |
| Non-text input (images, PDFs, binary files)                                    | Returns Confidence: Low; Notes: "Agent specialises in text analysis. For images/PDFs, convert to text first or provide text summary."                                                   |
| Out-of-scope request (e.g., "compare 5 files and synthesise")                  | Notes: "Out of scope — agent analyses ONE file per invocation. For multi-file synthesis, use Opus-level skill coordination." Completes single-file analysis.                            |
| Contradictory or unreliable content (e.g., conflicting statements within file) | Confidence: Medium; Notes: "Content contains contradictions between [section A] and [section B]. Flag for manual review."                                                               |

## Related Files

- **Calling skill:** `.claude/skills/knowledge-memory/SKILL.md` — User-facing skill that orchestrates agent invocations and routes output to archives
- **Agent prompt:** `.claude/agents/knowledge-memory/AGENT.md` — The sub-agent Haiku prompt (source of truth for I/O)
- **Output archives:**
  - `archives/research/` — Research reports and analyses
  - `archives/insights/` — Strategic insights and frameworks
  - `archives/content/` — Published content
  - `archives/plans/` — Strategic plans and roadmaps
  - `archives/meetings/` — Meeting notes
  - `archives/client-work/` — Client materials
- **Related skills:** `.claude/skills/mcp-automation/SKILL.md` (designs multi-step workflows), `.claude/skills/code-generation/SKILL.md` (consumes retrieved knowledge for implementation context)

## Integration

- **Receives from:** `/knowledge-memory` skill via Agent tool delegation (for knowledge extraction and metadata generation subtasks)
- **Returns to:** `/knowledge-memory` skill for organization and archive routing
- **Invocation pattern:** Body text in knowledge-memory SKILL.md delegates focused knowledge extraction subtask (e.g., "Summarise and extract key insights from this research report")
- **Data format:** Structured output with summary, extracted knowledge, metadata tags, notes, and confidence level

## Integration Notes

- **Single-file assumption:** This agent is designed for one-file-at-a-time analysis. For large files, the skill may invoke the agent multiple times (section by section), with Opus combining results.
- **Knowledge graph building:** Metadata tags enable retrieval — skill stores tags in a queryable format. Over time, the system builds a searchable knowledge graph.
- **Retrieval workflow:** When other skills need knowledge (e.g., "recent research on X"), the Knowledge Memory skill queries archives using metadata tags and returns summaries to inform decision-making.
- **Long-term memory:** The combination of structured extraction, metadata tagging, and archival creates a persistent knowledge base that grows more useful over time.
