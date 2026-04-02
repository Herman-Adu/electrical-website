#!/usr/bin/env node
/* eslint-disable no-console */

import { readdirSync, statSync, existsSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const SECTION_DIR = path.join(process.cwd(), "components", "sections");
const BASE_FILES = [
  "smart-living.tsx",
  "illumination.tsx",
  "dashboard.tsx",
  "cta-power.tsx",
  "schematic.tsx",
];
const KEYWORDS = [
  "smart-living",
  "illumination",
  "dashboard",
  "cta-power",
  "schematic",
];

function toPosixPath(filePath) {
  return filePath.split(path.sep).join("/");
}

function walkFiles(dirPath, output = []) {
  if (!existsSync(dirPath)) return output;

  const entries = readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      walkFiles(fullPath, output);
      continue;
    }

    if (/\.(tsx?|jsx?)$/i.test(entry.name)) {
      output.push(fullPath);
    }
  }

  return output;
}

function collectWave2Files() {
  const files = new Set();

  for (const fileName of BASE_FILES) {
    const fullPath = path.join(SECTION_DIR, fileName);
    if (existsSync(fullPath)) {
      files.add(fullPath);
    }
  }

  if (!existsSync(SECTION_DIR)) {
    return { files: [], extractedCount: 0, baseCount: 0 };
  }

  const sectionEntries = readdirSync(SECTION_DIR, { withFileTypes: true });
  for (const entry of sectionEntries) {
    if (!entry.isDirectory()) continue;

    const directoryName = entry.name.toLowerCase();
    const isWave2Extract = KEYWORDS.some((keyword) =>
      directoryName.includes(keyword),
    );

    if (!isWave2Extract) continue;

    const directoryFiles = walkFiles(path.join(SECTION_DIR, entry.name));
    for (const filePath of directoryFiles) {
      files.add(filePath);
    }
  }

  const allFiles = Array.from(files)
    .filter((filePath) => existsSync(filePath) && statSync(filePath).isFile())
    .sort((a, b) => a.localeCompare(b));

  const baseCount = allFiles.filter((filePath) =>
    BASE_FILES.includes(path.basename(filePath)),
  ).length;
  const extractedCount = Math.max(allFiles.length - baseCount, 0);

  return {
    files: allFiles,
    baseCount,
    extractedCount,
  };
}

function runCommand(bin, args) {
  const result = spawnSync(bin, args, {
    cwd: process.cwd(),
    encoding: "utf8",
    stdio: "pipe",
    shell: process.platform === "win32",
    windowsHide: true,
  });

  const stdout = result.stdout ?? "";
  const stderr = result.stderr ?? "";
  const output = `${stdout}\n${stderr}`.trim();

  return {
    ok: result.status === 0,
    status: result.status ?? 1,
    output,
  };
}

function summarizeProblems(output) {
  const match = output.match(
    /(\d+)\s+problems?\s*\((\d+)\s+errors?,\s*(\d+)\s+warnings?\)/i,
  );
  if (!match) return null;

  return {
    total: Number(match[1]),
    errors: Number(match[2]),
    warnings: Number(match[3]),
  };
}

function tailLines(text, lineCount = 12) {
  if (!text) return "";
  const lines = text.split(/\r?\n/).map((line) => line.trimEnd());
  return lines.slice(-lineCount).join("\n").trim();
}

function extractTargetDiagnosticLines(output, targetFiles) {
  const targetMarkers = targetFiles
    .map((filePath) =>
      toPosixPath(path.relative(process.cwd(), filePath)).toLowerCase(),
    )
    .filter(Boolean);

  if (targetMarkers.length === 0) return [];

  const lines = output
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter(Boolean);

  return lines.filter((line) => {
    const normalized = line.toLowerCase().replace(/\\/g, "/");
    return targetMarkers.some((marker) => normalized.includes(marker));
  });
}

const startTime = Date.now();
const { files: wave2Files, baseCount, extractedCount } = collectWave2Files();

console.log(
  `[wave2] targets: ${wave2Files.length} files (${baseCount} base + ${extractedCount} extracted)`,
);

let diagnosticsOk = false;
let diagnosticsSummary = "not run";

if (wave2Files.length === 0) {
  diagnosticsSummary = "no Wave 2 files found";
  console.log("[wave2] diagnostics: skipped (no targets found)");
} else {
  const tscArgs = [
    "exec",
    "tsc",
    "--noEmit",
    "--pretty",
    "false",
    "--project",
    "tsconfig.json",
    "--incremental",
    "false",
  ];
  const diagnosticsRun = runCommand("pnpm", tscArgs);
  const targetDiagnosticLines = extractTargetDiagnosticLines(
    diagnosticsRun.output,
    wave2Files,
  );
  diagnosticsOk = diagnosticsRun.ok || targetDiagnosticLines.length === 0;

  if (diagnosticsOk) {
    diagnosticsSummary = `pass (${wave2Files.length} files checked)`;
    console.log(
      `[wave2] diagnostics: pass (${wave2Files.length} files checked)`,
    );
  } else {
    const parsedProblems = summarizeProblems(diagnosticsRun.output);
    if (parsedProblems) {
      diagnosticsSummary = `fail (${parsedProblems.errors} errors, ${parsedProblems.warnings} warnings in targets)`;
    } else if (targetDiagnosticLines.length > 0) {
      diagnosticsSummary = `fail (${targetDiagnosticLines.length} target diagnostics)`;
    } else {
      diagnosticsSummary = `fail (exit ${diagnosticsRun.status})`;
    }

    console.log(`[wave2] diagnostics: ${diagnosticsSummary}`);
    const tail = tailLines(
      targetDiagnosticLines.join("\n") || diagnosticsRun.output,
    );
    if (tail) {
      console.log("[wave2] diagnostics tail:");
      console.log(tail);
    }
  }
}

const buildRun = runCommand("pnpm", ["build"]);
const buildOk = buildRun.ok;

if (buildOk) {
  console.log("[wave2] build: pass");
} else {
  console.log(`[wave2] build: fail (exit ${buildRun.status})`);
  const tail = tailLines(buildRun.output);
  if (tail) {
    console.log("[wave2] build tail:");
    console.log(tail);
  }
}

const overallOk = diagnosticsOk && buildOk && wave2Files.length > 0;
const durationSeconds = ((Date.now() - startTime) / 1000).toFixed(1);

console.log("\n[wave2] summary");
console.log(`- touched files: ${wave2Files.length}`);
console.log(`- diagnostics: ${diagnosticsSummary}`);
console.log(`- build: ${buildOk ? "pass" : "fail"}`);
console.log(`- duration: ${durationSeconds}s`);
console.log(`- overall: ${overallOk ? "PASS" : "FAIL"}`);

process.exit(overallOk ? 0 : 1);
