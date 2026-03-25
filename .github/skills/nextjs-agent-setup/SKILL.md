---
name: nextjs-agent-setup
description: "Generate AI agent setup files for a Next.js project, including AGENTS.md, CLAUDE.md, and Copilot-oriented guidance. Use this when asked to bootstrap AI coding agent instructions for create-next-app or retrofit an existing Next.js repository."
---

# Next.js Agent Setup

This skill packages the emerging Next.js AI-agent setup pattern into a reusable bootstrap.

It is especially useful for:

- new `create-next-app` projects
- retrofitting older Next.js repos
- aligning Copilot, Claude, and other agents to version-matched Next.js docs

## What this skill should produce

- `AGENTS.md` at repo root
- optional `CLAUDE.md` importing `AGENTS.md`
- optional `.github/copilot-instructions.md` supplement
- a short checklist for keeping these files current during Next.js upgrades

## When to use

- "Set this project up for AI coding agents"
- "Add AGENTS.md to this Next.js repo"
- "Bootstrap Copilot/Claude instructions for create-next-app"
- "Retrofit our existing Next.js app with agent setup"

## Guidelines

- Keep the Next.js-managed AGENTS block minimal and source-of-truth oriented.
- Put project-specific rules outside the managed markers.
- Prefer root-level `AGENTS.md` for cross-tool compatibility.
- Do not duplicate the same instructions across multiple files if one can import another.
