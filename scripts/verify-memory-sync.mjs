#!/usr/bin/env node
import process from "node:process";
import {
  deriveEntityKey,
  getDeletedMarkdownFilesFromGit,
  verifyEntityKeys,
} from "./memory-reconciliation-lib.mjs";

async function main() {
  try {
    const deletedFiles = getDeletedMarkdownFilesFromGit();
    const entityKeys = deletedFiles.map((filePath) =>
      deriveEntityKey(filePath),
    );
    const verification = await verifyEntityKeys(entityKeys);

    const result = {
      deletedFiles,
      entityKeys,
      totalDeletedFiles: deletedFiles.length,
      verifiedCount: verification.verifiedCount,
      missing: verification.missing,
    };

    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);

    if (verification.missing.length > 0) {
      process.exitCode = 1;
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`[verify] Error: ${msg}`);
    process.exit(1);
  }
}

main();
