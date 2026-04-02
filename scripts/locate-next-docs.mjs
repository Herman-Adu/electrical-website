#!/usr/bin/env node
/* eslint-disable no-console */

import { existsSync } from "node:fs";
import { resolve } from "node:path";

const workspaceRoot = process.cwd();

const candidates = [
  "node_modules/next/dist/docs",
  "node_modules/next/docs",
  "node_modules/next/README.md",
];

const found = candidates
  .map((candidate) => ({
    candidate,
    absolutePath: resolve(workspaceRoot, candidate),
    exists: existsSync(resolve(workspaceRoot, candidate)),
  }))
  .filter((entry) => entry.exists);

console.log("[next-docs] candidate scan:");
for (const entry of candidates) {
  const absolutePath = resolve(workspaceRoot, entry);
  const status = existsSync(absolutePath) ? "found" : "missing";
  console.log(`- ${entry} :: ${status}`);
}

if (found.length === 0) {
  console.log("[next-docs] no local Next.js docs source found.");
  process.exit(1);
}

console.log("[next-docs] preferred source:");
console.log(`- ${found[0].candidate}`);
