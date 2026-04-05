#!/usr/bin/env node
import process from "node:process";

const gatewayUrl = process.env.MCP_GATEWAY_URL || "http://127.0.0.1:3100";

function usage() {
  console.error(
    "Usage: node scripts/mcp-memory-call.mjs <toolName> [jsonArgs]\n" +
      'Example: node scripts/mcp-memory-call.mjs search_nodes \'{"query":"agent:v1:"}\'',
  );
}

function extractFirstJsonPayload(raw) {
  const text = String(raw ?? "").trim();
  if (!text) {
    throw new Error("Empty response body");
  }

  try {
    return JSON.parse(text);
  } catch {
    // Recover from noisy wrappers that append non-JSON text after a valid object.
  }

  const start = text.indexOf("{");
  if (start < 0) {
    throw new Error("No JSON object found in response body");
  }

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = start; index < text.length; index += 1) {
    const char = text[index];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
      continue;
    }

    if (char === "{") {
      depth += 1;
      continue;
    }

    if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        const candidate = text.slice(start, index + 1);
        try {
          return JSON.parse(candidate);
        } catch {
          break;
        }
      }
    }
  }

  throw new Error("Unable to parse response as JSON payload");
}

async function callMemoryTool(toolName, args) {
  const response = await fetch(`${gatewayUrl}/memory/tools/call`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: toolName,
      arguments: args,
    }),
  });

  const rawText = await response.text();
  const parsed = extractFirstJsonPayload(rawText);

  if (!response.ok) {
    const errorMessage =
      typeof parsed?.error === "string"
        ? parsed.error
        : `HTTP ${response.status}`;
    throw new Error(errorMessage);
  }

  return parsed;
}

async function main() {
  const toolName = process.argv[2];
  const rawArgs = process.argv.slice(3);

  if (!toolName) {
    usage();
    process.exit(1);
  }

  let args = {};
  const firstArg = rawArgs[0];

  if (firstArg && firstArg.trim().startsWith("{")) {
    try {
      args = JSON.parse(firstArg);
    } catch {
      console.error("Invalid jsonArgs argument. Must be valid JSON object.");
      process.exit(1);
    }
  } else if (toolName === "search_nodes" && rawArgs.length > 0) {
    args = { query: rawArgs.join(" ") };
  } else if (toolName === "open_nodes" && rawArgs.length > 0) {
    args = { names: rawArgs };
  }

  try {
    const result = await callMemoryTool(toolName, args);
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[mcp-memory-call] ${message}`);
    process.exit(1);
  }
}

main();
