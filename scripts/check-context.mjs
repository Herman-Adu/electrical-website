#!/usr/bin/env node

import { spawnSync } from "node:child_process";

const WARNING_THRESHOLD = 40;

const result = spawnSync("git", ["status", "--short"], {
  cwd: process.cwd(),
  encoding: "utf8",
  stdio: "pipe",
  shell: process.platform === "win32",
  windowsHide: true,
});

if (result.status !== 0) {
  const errorOutput = `${result.stdout ?? ""}\n${result.stderr ?? ""}`.trim();
  console.log("[context] unable to read git status");
  if (errorOutput) {
    console.log(errorOutput.split(/\r?\n/).slice(-8).join("\n"));
  }
  process.exit(result.status ?? 1);
}

const changedLines = (result.stdout ?? "")
  .split(/\r?\n/)
  .map((line) => line.trimEnd())
  .filter(Boolean);

const changedCount = changedLines.length;

console.log(`[context] changed files: ${changedCount}`);

if (changedCount > 0) {
  for (const line of changedLines) {
    console.log(line);
  }
} else {
  console.log("[context] workspace is clean");
}

if (changedCount > WARNING_THRESHOLD) {
  console.log(
    `[context] warning: ${changedCount} changed files (> ${WARNING_THRESHOLD}). Consider checkpointing to keep context manageable.`,
  );
}
