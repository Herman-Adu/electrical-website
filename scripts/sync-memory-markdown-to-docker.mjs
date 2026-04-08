#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import process from "node:process";

const REPO_ROOT = process.cwd();
const DOCS_ROOT = path.join(REPO_ROOT, "docs");
const GATEWAY_URL = process.env.MCP_GATEWAY_URL || "http://127.0.0.1:3100";

// In-scope patterns
const IN_SCOPE_PATTERNS = [
  "**/*FULL_MEMORY_SYNC*.md",
  "**/*NEXT_WINDOW_PROMPT*.md",
  "**/*NEXT_SESSION_PROMPT*.md",
  "**/*HANDOFF*.md",
  "**/NEW_CHAT_START_HERE.md",
  "**/MEMORY_SYNC_REFERENCE.md",
];

// Exclusion patterns
const EXCLUSION_PATTERNS = [
  "docs/ORCHESTRATOR_MEMORY_FIRST_PLAYBOOK.md",
  "docs/**/RUNBOOK*.md",
  "docs/**/runbook*.md",
  "docs/standards/**",
  "**/*lift-and-shift.md",
  "**/service-request-form-section-only-migration.md",
];

function normalizeSlug(filename) {
  return filename
    .replace(/\.md$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function findInScopeFiles() {
  const files = [];

  function walkDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relPath = path.relative(REPO_ROOT, fullPath).replace(/\\/g, "/");

      if (entry.isDirectory()) {
        if (entry.name !== "node_modules" && entry.name !== ".git") {
          walkDir(fullPath);
        }
      } else if (entry.name.endsWith(".md")) {
        // Check if it matches in-scope pattern
        const matchesInScope = IN_SCOPE_PATTERNS.some((pattern) =>
          relPath.includes(pattern.replace(/\*\*/g, "").replace(/\*/g, "")),
        );

        // Check if it matches exclusion pattern
        const matchesExclusion = EXCLUSION_PATTERNS.some((pattern) => {
          if (pattern.includes("**")) {
            const globPart = pattern.replace(/\*\*/g, "");
            return relPath.includes(globPart);
          }
          return relPath === pattern;
        });

        // For more accurate pattern matching, check against individual patterns
        let isInScope = false;
        for (const pattern of IN_SCOPE_PATTERNS) {
          const regexPattern = pattern
            .replace(/\*\*/g, ".*")
            .replace(/\*/g, "[^/]*")
            .replace(/\.md$/, "\\.md$");
          if (new RegExp(regexPattern).test(relPath)) {
            isInScope = true;
            break;
          }
        }

        // Check exclusions more carefully
        let isExcluded = false;
        for (const pattern of EXCLUSION_PATTERNS) {
          const regexPattern = pattern
            .replace(/\*\*/g, ".*")
            .replace(/\*/g, "[^/]*")
            .replace(/\.md$/, "\\.md$");
          if (new RegExp(regexPattern).test(relPath)) {
            isExcluded = true;
            break;
          }
        }

        if (isInScope && !isExcluded) {
          files.push(fullPath);
        }
      }
    }
  }

  walkDir(DOCS_ROOT);
  return files;
}

function extractObservations(content) {
  const lines = content.split("\n");
  const observations = [];

  // Extract from frontmatter if present
  if (content.startsWith("---")) {
    const endFrontmatter = content.indexOf("---", 3);
    if (endFrontmatter > 0) {
      const fm = content.substring(3, endFrontmatter);
      const titleMatch = fm.match(/title:\s*(.+)/);
      if (titleMatch) {
        observations.push(titleMatch[1].trim());
      }
    }
  }

  // Extract heading (# title)
  for (const line of lines) {
    if (line.startsWith("# ")) {
      observations.push(line.substring(2).trim());
      break;
    }
  }

  // Extract key bullet points
  let inBulletSection = false;
  for (const line of lines) {
    if (line.startsWith("##")) {
      inBulletSection = true;
    }
    if (
      inBulletSection &&
      line.trim().startsWith("-") &&
      observations.length < 8
    ) {
      observations.push(line.trim().substring(1).trim());
    }
  }

  // Deduplicate and limit to 8
  return [...new Set(observations)].slice(0, 8);
}

function deriveEntityName(filePath, content) {
  // Check if content has specific entity key in frontmatter or first section
  if (content.includes("agent:v1:handoff")) {
    const match = content.match(/agent:v1:handoff[:\s]+([^\n]+)/i);
    if (match) return match[1].trim();
  }
  if (content.includes("agent:v1:reasoning")) {
    const match = content.match(/agent:v1:reasoning[:\s]+([^\n]+)/i);
    if (match) return match[1].trim();
  }

  // Derive from filename
  const filename = path.basename(filePath, ".md");
  const slug = normalizeSlug(filename);
  return `agent:v1:doc:${slug}`;
}

async function callMemoryTool(toolName, args) {
  const response = await fetch(`${GATEWAY_URL}/memory/tools/call`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: toolName,
      arguments: args,
    }),
  });

  const text = await response.text();
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    const start = text.indexOf("{");
    if (start >= 0) {
      let depth = 0;
      for (let i = start; i < text.length; i++) {
        if (text[i] === "{") depth++;
        if (text[i] === "}") {
          depth--;
          if (depth === 0) {
            try {
              parsed = JSON.parse(text.substring(start, i + 1));
              break;
            } catch {
              // continue
            }
          }
        }
      }
    }
  }

  if (!response.ok) {
    const msg =
      parsed?.error || `HTTP ${response.status}: ${text.substring(0, 100)}`;
    throw new Error(String(msg));
  }

  return parsed;
}

async function syncFilesToMemory(files) {
  const results = {
    synced: [],
    skipped: [],
    errors: [],
  };

  // Batch create all entities first
  const entitiesToCreate = [];
  const fileMap = new Map(); // Track which file corresponds to which entity

  for (const filePath of files) {
    try {
      const content = fs.readFileSync(filePath, "utf8");
      const entityName = deriveEntityName(filePath, content);
      const observations = extractObservations(content);

      if (!observations.length) {
        results.skipped.push({
          file: path.relative(REPO_ROOT, filePath),
          reason: "no observations extracted",
        });
        continue;
      }

      entitiesToCreate.push({
        name: entityName,
        entityType: "doc",
        observations,
      });

      fileMap.set(entityName, {
        file: path.relative(REPO_ROOT, filePath),
        observations: observations.length,
      });
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      results.errors.push({
        file: path.relative(REPO_ROOT, filePath),
        error: msg,
      });
    }
  }

  // Create all entities in batch
  if (entitiesToCreate.length > 0) {
    try {
      await callMemoryTool("create_entities", {
        entities: entitiesToCreate,
      });

      // Record all as synced
      for (const entity of entitiesToCreate) {
        const info = fileMap.get(entity.name);
        results.synced.push({
          ...info,
          entity: entity.name,
        });
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      // If batch create fails, record all as errors
      for (const entity of entitiesToCreate) {
        const info = fileMap.get(entity.name);
        results.errors.push({
          file: info.file,
          error: msg,
        });
      }
    }
  }

  return results;
}

async function verifyEntities(synced) {
  const verified = [];
  const notFound = [];

  for (const record of synced) {
    try {
      const result = await callMemoryTool("open_nodes", {
        names: [record.entity],
      });

      // Parse nested response structure
      const entities =
        result?.content?.[0]?.json?.entities ?? result?.entities ?? [];

      if (entities.length > 0 && entities[0].name === record.entity) {
        verified.push(record.entity);
      } else {
        notFound.push(record.entity);
      }
    } catch (error) {
      notFound.push(record.entity);
    }
  }

  return { verified, notFound };
}

function deletefiles(filePaths) {
  const deleted = [];
  const failed = [];

  for (const filePath of filePaths) {
    try {
      fs.unlinkSync(filePath);
      deleted.push(path.relative(REPO_ROOT, filePath));
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      failed.push({
        file: path.relative(REPO_ROOT, filePath),
        error: msg,
      });
    }
  }

  return { deleted, failed };
}

async function main() {
  console.log("[sync-memory-markdown-to-docker] Starting memory sync...\n");

  // Step 1: Discover files
  console.log("[1] Discovering in-scope files...");
  const files = findInScopeFiles();
  console.log(`Found ${files.length} in-scope files\n`);

  if (files.length === 0) {
    console.log("No files to sync.");
    return;
  }

  // Step 2: Sync files to memory
  console.log("[2] Syncing files to memory MCP...");
  const syncResults = await syncFilesToMemory(files);
  console.log(
    `Synced: ${syncResults.synced.length}, Errors: ${syncResults.errors.length}, Skipped: ${syncResults.skipped.length}\n`,
  );

  if (syncResults.errors.length > 0) {
    console.log("Sync errors:");
    for (const err of syncResults.errors) {
      console.log(`  - ${err.file}: ${err.error}`);
    }
    console.log();
  }

  if (syncResults.skipped.length > 0) {
    console.log("Skipped files:");
    for (const skip of syncResults.skipped) {
      console.log(`  - ${skip.file}: ${skip.reason}`);
    }
    console.log();
  }

  // Step 3: Verify entities
  console.log("[3] Verifying synced entities...");
  const { verified, notFound } = await verifyEntities(syncResults.synced);
  console.log(`Verified: ${verified.length}, Not found: ${notFound.length}\n`);

  if (notFound.length > 0) {
    console.log("Verification failures:");
    for (const entity of notFound) {
      console.log(`  - ${entity}`);
    }
    console.log();
  }

  // Step 4: Delete files (only if verification passed)
  if (notFound.length === 0) {
    console.log("[4] Deleting synced markdown files...");
    const syncedFilePaths = syncResults.synced.map((r) =>
      path.join(REPO_ROOT, r.file),
    );
    const deleteResults = deletefiles(syncedFilePaths);
    console.log(
      `Deleted: ${deleteResults.deleted.length}, Failed: ${deleteResults.failed.length}\n`,
    );

    if (deleteResults.failed.length > 0) {
      console.log("Delete failures:");
      for (const fail of deleteResults.failed) {
        console.log(`  - ${fail.file}: ${fail.error}`);
      }
      console.log();
    }

    // Final summary
    console.log("=== FINAL SUMMARY ===");
    console.log(`Files synced & deleted: ${deleteResults.deleted.length}`);
    console.log(`Entities created/updated: ${syncResults.synced.length}`);
    console.log(`Entities verified: ${verified.length}`);
    console.log(`Skipped files: ${syncResults.skipped.length}`);
  } else {
    console.log(
      "[!] Verification failed. Skipping deletion until issues resolved.",
    );
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("[sync-memory-markdown-to-docker] Fatal error:", error);
  process.exit(1);
});
