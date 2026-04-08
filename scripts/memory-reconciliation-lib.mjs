import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

export const REPO_ROOT = process.cwd();
export const REPORT_PATH = path.join(
  REPO_ROOT,
  "scripts",
  "memory-reconciliation-report.json",
);
const GATEWAY_URL = process.env.MCP_GATEWAY_URL || "http://127.0.0.1:3100";

function runGit(args) {
  return execFileSync("git", args, {
    cwd: REPO_ROOT,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function parseJsonPayload(text) {
  const raw = String(text ?? "").trim();
  if (!raw) {
    throw new Error("Empty response body");
  }

  try {
    return JSON.parse(raw);
  } catch {
    const start = raw.indexOf("{");
    if (start < 0) {
      throw new Error("No JSON object in response");
    }

    let depth = 0;
    let inString = false;
    let escaped = false;

    for (let i = start; i < raw.length; i += 1) {
      const ch = raw[i];

      if (inString) {
        if (escaped) {
          escaped = false;
        } else if (ch === "\\") {
          escaped = true;
        } else if (ch === '"') {
          inString = false;
        }
        continue;
      }

      if (ch === '"') {
        inString = true;
        continue;
      }

      if (ch === "{") {
        depth += 1;
      } else if (ch === "}") {
        depth -= 1;
        if (depth === 0) {
          return JSON.parse(raw.slice(start, i + 1));
        }
      }
    }
  }

  throw new Error("Unable to parse JSON payload");
}

function uniqueSorted(values) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

function normalizeLines(text) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function cleanObservation(text) {
  return String(text)
    .replace(/\[[^\]]+\]\([^\)]+\)/g, (match) => {
      const label = match.match(/^\[([^\]]+)\]/);
      return label?.[1] ?? "";
    })
    .replace(/[`*_>#]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 180);
}

function pushUniqueObservation(list, value) {
  const cleaned = cleanObservation(value);
  if (!cleaned) {
    return;
  }

  if (!list.includes(cleaned)) {
    list.push(cleaned);
  }
}

export function getDeletedMarkdownFilesFromGit() {
  const staged = runGit([
    "diff",
    "--cached",
    "--name-only",
    "--diff-filter=D",
    "--",
    "docs",
  ]);
  const unstaged = runGit([
    "diff",
    "--name-only",
    "--diff-filter=D",
    "--",
    "docs",
  ]);

  const files = normalizeLines(`${staged}\n${unstaged}`).filter((line) =>
    line.toLowerCase().endsWith(".md"),
  );

  return uniqueSorted(files);
}

export function getFileContentFromHead(filePath) {
  return runGit(["show", `HEAD:${filePath}`]);
}

export function deriveEntityKey(filePath) {
  const normalizedPath = filePath
    .replace(/\\/g, "/")
    .toLowerCase()
    .replace(/\.md$/i, "");

  const slug = normalizedPath
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return `agent:v1:doc:${slug}`;
}

export function extractObservations(content) {
  const lines = String(content ?? "").split(/\r?\n/);
  const observations = [];

  const frontmatterMatch = String(content).match(
    /^---\s*[\r\n]+([\s\S]*?)[\r\n]+---/,
  );
  if (frontmatterMatch?.[1]) {
    const titleMatch = frontmatterMatch[1].match(/^title:\s*(.+)$/im);
    if (titleMatch?.[1]) {
      pushUniqueObservation(observations, `Title: ${titleMatch[1]}`);
    }
  }

  const h1 = lines.find((line) => /^#\s+/.test(line));
  if (h1) {
    pushUniqueObservation(observations, `Heading: ${h1.replace(/^#\s+/, "")}`);
  }

  for (const line of lines) {
    if (observations.length >= 8) {
      break;
    }

    if (/^##\s+/.test(line)) {
      pushUniqueObservation(
        observations,
        `Section: ${line.replace(/^##\s+/, "")}`,
      );
    }
  }

  for (const line of lines) {
    if (observations.length >= 8) {
      break;
    }

    if (/^\s*[-*]\s+/.test(line) || /^\s*\d+\.\s+/.test(line)) {
      pushUniqueObservation(
        observations,
        line.replace(/^\s*([-*]|\d+\.)\s+/, ""),
      );
    }
  }

  if (observations.length < 8) {
    for (const line of lines) {
      if (observations.length >= 8) {
        break;
      }

      if (!line.trim()) {
        continue;
      }

      if (/^([#>*-]|\d+\.)\s+/.test(line.trim())) {
        continue;
      }

      pushUniqueObservation(observations, line);
      break;
    }
  }

  if (observations.length === 0) {
    observations.push("Document sync record");
  }

  return observations.slice(0, 8);
}

export async function callMemoryTool(name, args) {
  const response = await fetch(`${GATEWAY_URL}/memory/tools/call`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, arguments: args }),
  });

  const bodyText = await response.text();
  const parsed = parseJsonPayload(bodyText);

  if (!response.ok) {
    const message =
      typeof parsed?.error === "string"
        ? parsed.error
        : `HTTP ${response.status}`;
    throw new Error(message);
  }

  return parsed;
}

export function extractEntities(result) {
  return result?.content?.[0]?.json?.entities ?? result?.entities ?? [];
}

export async function upsertEntityWithObservations(entityKey, observations) {
  const opened = await callMemoryTool("open_nodes", { names: [entityKey] });
  const existingEntities = extractEntities(opened);
  const existingEntity = existingEntities.find(
    (item) => item.name === entityKey,
  );

  if (!existingEntity) {
    await callMemoryTool("create_entities", {
      entities: [
        {
          name: entityKey,
          entityType: "doc",
          observations,
        },
      ],
    });
    return;
  }

  const existingObservations = new Set(existingEntity.observations ?? []);
  const toAdd = observations.filter((obs) => !existingObservations.has(obs));

  if (toAdd.length === 0) {
    return;
  }

  await callMemoryTool("add_observations", {
    observations: [
      {
        entityName: entityKey,
        observations: toAdd,
      },
    ],
  });
}

export async function verifyEntityKeys(entityKeys) {
  const existing = new Set();

  for (let index = 0; index < entityKeys.length; index += 20) {
    const chunk = entityKeys.slice(index, index + 20);
    const result = await callMemoryTool("open_nodes", { names: chunk });
    const entities = extractEntities(result);
    for (const entity of entities) {
      if (typeof entity?.name === "string") {
        existing.add(entity.name);
      }
    }
  }

  const missing = entityKeys.filter((key) => !existing.has(key));
  return {
    verifiedCount: entityKeys.length - missing.length,
    missing,
  };
}

export function writeReconciliationReport(report) {
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
}
