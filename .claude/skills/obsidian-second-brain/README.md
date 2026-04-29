# Obsidian Second Brain Skill

Platinum-standard knowledge management: read, write, and search an Obsidian vault through the Local REST API — Daily Notes, decision logs, research scratch, and Docker memory bridge.

## When to Use

- **Daily Notes** — Create or append to today's work journal with branch, commits, decisions, and next steps
- **Capture research** — Append long-form research to `Research/{topic}.md` (too rich for Docker entities)
- **Mirror decisions** — Create `Decisions/decide-{name}.md` as a human-readable mirror of a Docker `decide-*` entity
- **Load vault context** — Search the vault for notes relevant to the current feature before starting work
- **Session notes** — Create `Sessions/session-YYYY-MM-DD-NNN.md` linked back to the Docker session entity
- **Search notes** — Find prior research, decisions, or context by keyword across the entire vault

**Trigger:** `/obsidian-second-brain "[daily-note|create|read|search|append|capture|sync-to-docker]"`

## Prerequisites

- Obsidian running with the **Local REST API** community plugin enabled (port 27124)
- `OBSIDIAN_API_KEY=<your-key>` in `.env.local`
- Vault at `obsidian-vault/` (gitignored from this repo; syncs to its own GitHub remote)

## Relationship to Docker Memory

Docker memory (`memory-reference` MCP service) is the **primary** session store — structured entities, session handoffs, rehydration. Obsidian is the **secondary** long-form store — journals, research, human-readable mirrors. Never replace Docker with Obsidian; use both together.

**Last Updated:** 2026-04-29
**Maintainer:** Orchestrator (Herman Adu / Claude Code)
