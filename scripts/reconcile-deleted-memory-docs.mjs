#!/usr/bin/env node
import process from "node:process";
import {
  deriveEntityKey,
  extractObservations,
  getDeletedMarkdownFilesFromGit,
  getFileContentFromHead,
  upsertEntityWithObservations,
  verifyEntityKeys,
  writeReconciliationReport,
} from "./memory-reconciliation-lib.mjs";

async function main() {
  const deletedFiles = getDeletedMarkdownFilesFromGit();
  const entityKeys = deletedFiles.map((file) => deriveEntityKey(file));

  const skipped = [];
  let syncedCount = 0;

  for (const filePath of deletedFiles) {
    const entityKey = deriveEntityKey(filePath);

    try {
      const content = getFileContentFromHead(filePath);
      const observations = extractObservations(content);
      await upsertEntityWithObservations(entityKey, observations);
      syncedCount += 1;
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      skipped.push({ file: filePath, reason });
    }
  }

  const verification = await verifyEntityKeys(entityKeys);

  const report = {
    deletedFiles,
    entityKeys,
    syncedCount,
    verifiedCount: verification.verifiedCount,
    missing: verification.missing,
  };

  writeReconciliationReport(report);

  process.stdout.write(`${JSON.stringify({ ...report, skipped }, null, 2)}\n`);

  if (verification.missing.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[memory-reconcile] ${message}`);
  process.exit(1);
});
