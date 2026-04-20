#!/usr/bin/env node
/**
 * sync-session-5.mjs
 *
 * Sync Phase 8 blocker context to Docker memory before Session 5 starts.
 * This ensures continuity: Docker holds session state, not .md files.
 */

const GATEWAY_URL = process.env.MCP_GATEWAY_URL || "http://127.0.0.1:3100";

async function callTool(toolName, args) {
  // Use Caddy gateway route: /memory → memory-reference:8000
  const response = await fetch(`${GATEWAY_URL}/memory/tools/call`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: toolName,
      arguments: args,
    }),
  });

  const rawText = await response.text();
  let data;

  try {
    data = JSON.parse(rawText);
  } catch {
    throw new Error(`Failed to parse response: ${rawText.substring(0, 200)}`);
  }

  if (!response.ok) {
    throw new Error(
      `Tool call failed: ${data.error || response.statusText}`
    );
  }

  // Memory service returns: { content: [{ type: "json", json: result }] }
  if (data.content && Array.isArray(data.content) && data.content[0]) {
    const jsonData = data.content[0].json || data.content[0];
    return jsonData;
  }
  return data;
}

async function main() {
  try {
    console.log("[sync-session-5] Starting Docker memory sync...\n");

    // Step 1: Search for existing project state
    console.log("Step 1: Searching for electrical-website-state...");
    let searchResult = await callTool("search_nodes", {
      query: "electrical-website-state",
    });

    let projectStateEntity = searchResult.entities?.find(
      (e) => e.name === "electrical-website-state"
    );

    if (!projectStateEntity) {
      console.log(
        "  ⚠️  Project state not found. Creating initial entity...\n"
      );
      const createResult = await callTool("create_entities", {
        entities: [
          {
            name: "electrical-website-state",
            entityType: "project_state",
            observations: [
              "Session 5 start: Phase 8 blockers identified",
              "Branch: feat/phase-8-scrollreveal-production",
              "Commits ahead: 18",
              "Tests passing: 267/270 (4 skipped)",
              "Build status: passing (58 pages)",
              "Active phase: Phase 8 - ScrollReveal Production",
            ],
          },
        ],
      });
      console.log(
        `  ✅ Created entity: ${
          createResult.createdCount || createResult.entities?.length || 1
        } entity\n`
      );
    } else {
      console.log("  ✅ Found existing entity\n");
    }

    // Step 2: Create Phase 8 feature entity with blocker details
    console.log("Step 2: Creating Phase 8 feature entity with blockers...");
    const featureResult = await callTool("create_entities", {
      entities: [
        {
          name: "feat-phase-8-scrollreveal-production",
          entityType: "feature",
          observations: [
            "Phase 8: ScrollReveal Production Finalization",
            "Session 4 completed: SectionValues reveal animation removed, card layout refactored",
            "Tests modified: 267/270 passing (4 skipped)",
            "BLOCKER 1 - SectionValues Reveal Animation: Tests expect animation (INVALID, was removed). Action: DELETE e2e/phase-8-blockers.spec.ts",
            "BLOCKER 2 - Peace of Mind Dropdown Link: Selector mismatch a[href='/about#peace-of-mind'] vs a[href='#peace-of-mind']. Action: Debug navbar dropdown selectors",
            "BLOCKER 3 - Scroll-to Race Condition: 8 tests check same-page scroll, deep link, cross-page nav, hash-before-scroll timing. Action: Verify scroll-to-anchor handler",
            "Hero styling TODO: Apply brightness/saturation to ServicesHero and ProjectCategoryHero (reference: AboutHero pattern)",
            "Commits: b7f9a4f (remove reveal), 3c00b5b (refactor layout), 5137b0b (reduce gap), e146894 (reduce row gap)",
          ],
        },
      ],
    });
    console.log(
      `  ✅ Created feature entity: ${
        featureResult.createdCount || featureResult.entities?.length || 1
      } entity\n`
    );

    // Step 3: Create blocker decision entity
    console.log("Step 3: Creating blocker decision entity...");
    const blockerResult = await callTool("create_entities", {
      entities: [
        {
          name: "decide-phase-8-blocker-resolution",
          entityType: "decision",
          observations: [
            "Decision: Delete e2e/phase-8-blockers.spec.ts (phase-specific tests anti-pattern). Tests reference outdated SectionValues reveal animation implementation.",
            "Migration path: Valid tests for Blocker 2 (dropdown selectors) and Blocker 3 (scroll-to race) should move to main e2e suites before deletion.",
            "Blocker 2 (Peace of Mind): Debug navbar component selectors for about dropdown link. Tests verify dropdown visibility and hash navigation.",
            "Blocker 3 (Scroll-to race): Verify hash updates before scroll measurement. Tests use waitForTimeout(500) and Promise.all() for sync timing.",
            "Hero styling: Apply CSS brightness/saturation filters from AboutHero to ServicesHero and ProjectCategoryHero for visual consistency.",
          ],
        },
      ],
    });
    console.log(
      `  ✅ Created blocker decision: ${
        blockerResult.createdCount || blockerResult.entities?.length || 1
      } entity\n`
    );

    // Step 4: Create session 5 entity
    console.log("Step 4: Creating Session 5 entity...");
    const sessionResult = await callTool("create_entities", {
      entities: [
        {
          name: "session-2026-04-20-005",
          entityType: "session",
          observations: [
            "Session 5 start: 2026-04-20 17:45 UTC",
            "Previous session completed: SectionValues refactor (Session 4)",
            "Current context: Blocker tests identified, need triage and resolution",
            "Immediate tasks: (1) Run pnpm test to confirm blocker failures, (2) Delete e2e/phase-8-blockers.spec.ts, (3) Apply hero styling, (4) Build/commit/merge",
            "Build status at start: passing (267/270 tests, 4 skipped)",
            "Git status: 18 commits ahead, 16 files modified (components, data, baselines)",
            "Expected duration: 1-2 hours (blocker triage + hero styling + merge)",
          ],
        },
      ],
    });
    console.log(
      `  ✅ Created session entity: ${
        sessionResult.createdCount || sessionResult.entities?.length || 1
      } entity\n`
    );

    // Step 5: Add observations to project state (non-destructive update)
    console.log(
      "Step 5: Adding observations to project state (session context)..."
    );
    const obsResult = await callTool("add_observations", {
      observations: [
        {
          entityName: "electrical-website-state",
          contents: [
            "Session 5 context: Blocker tests triage, hero styling application, Phase 8 merge",
            "Active blockers: (1) SectionValues reveal animation tests (invalid, delete), (2) Peace of Mind dropdown selector, (3) scroll-to race condition timing",
            "Next step: Run pnpm test, delete phase-8-blockers.spec.ts, apply hero styling to Services and Projects heroes",
            "Orchestrator mode: Delegate detailed hero styling to architecture SME if needed",
            "Phase 8 completion target: Merge feat/phase-8-scrollreveal-production → main after blockers resolved",
          ],
        },
      ],
    });
    console.log(`  ✅ Updated observations\n`);

    // Step 6: Create relations
    console.log("Step 6: Creating entity relations...");
    const relResult = await callTool("create_relations", {
      relations: [
        {
          from: "feat-phase-8-scrollreveal-production",
          to: "decide-phase-8-blocker-resolution",
          relationType: "has_blocker",
        },
        {
          from: "session-2026-04-20-005",
          to: "feat-phase-8-scrollreveal-production",
          relationType: "resolves",
        },
        {
          from: "session-2026-04-20-005",
          to: "electrical-website-state",
          relationType: "updates",
        },
      ],
    });
    console.log(
      `  ✅ Created relations: ${
        relResult.createdCount || relResult.relations?.length || 3
      } relations\n`
    );

    console.log("========================================");
    console.log("✅ Docker memory sync complete!");
    console.log("========================================\n");
    console.log("Summary:");
    console.log("  - Project state entity: electrical-website-state");
    console.log(
      "  - Feature entity: feat-phase-8-scrollreveal-production"
    );
    console.log(
      "  - Decision entity: decide-phase-8-blocker-resolution"
    );
    console.log("  - Session entity: session-2026-04-20-005");
    console.log(
      "\nReady for Session 5! Use the rehydration prompt above to start.\n"
    );
  } catch (error) {
    console.error("❌ Sync failed:", error.message);
    process.exit(1);
  }
}

main();
