#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * MCP Smoke Test — Probe all 8 MCP services via Caddy gateway
 *
 * Usage:
 *   node scripts/mcp-smoke.mjs
 *   pnpm docker:mcp:smoke (after adding script to package.json)
 *
 * Validates:
 *   - Each service at /SERVICE_ID/health
 *   - Each service at /SERVICE_ID/tools
 *   - GitHub service at /github/info with mock token (auth test)
 *   - Memory protocol contract via /memory/tools/call (search_nodes/open_nodes/read_graph)
 *   - Caddy gateway at /health
 *
 * Exit codes:
 *   0 = all services healthy
 *   1 = one or more services failed
 */

import https from "https";
import http from "http";

const GATEWAY_URL = "http://127.0.0.1:3100";
const GITHUB_TOKEN = "gQAA_mock_token_for_smoke_test";

const SERVICES = [
  { id: "github", path: "/github", name: "GitHub Official" },
  { id: "openapi", path: "/openapi", name: "OpenAPI Schema" },
  { id: "playwright", path: "/playwright", name: "Playwright" },
  { id: "sequential", path: "/sequential", name: "Sequential Thinking" },
  { id: "memory", path: "/memory", name: "Memory Reference" },
  { id: "nextjs", path: "/nextjs", name: "Next.js DevTools" },
  { id: "executor", path: "/executor", name: "Executor Playwright" },
  { id: "wikipedia", path: "/wikipedia", name: "Wikipedia" },
];

function makeRequest(url, method = "GET", headers = {}, body) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === "https:" ? https : http;

    const options = {
      method,
      headers: {
        "User-Agent": "mcp-smoke-test/1.0",
        ...headers,
      },
    };

    const req = client.request(url, options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        resolve({ status: res.statusCode, data, headers: res.headers });
      });
    });

    req.on("error", (err) => reject(err));
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error("Request timeout"));
    });

    if (body !== undefined) {
      req.write(body);
    }

    req.end();
  });
}

async function testEndpoint(url, label, method = "GET", headers = {}, body) {
  try {
    const { status, data } = await makeRequest(url, method, headers, body);
    if (status !== 200) {
      console.log(`  ✗ ${label} [HTTP ${status}]`);
      return false;
    }
    try {
      JSON.parse(data);
      console.log(`  ✓ ${label}`);
      return true;
    } catch {
      console.log(`  ✓ ${label} (non-JSON response, status OK)`);
      return true;
    }
  } catch (err) {
    console.log(`  ✗ ${label} [${err.message}]`);
    return false;
  }
}

async function runMemoryProtocolChecks() {
  console.log("📍 Memory Protocol Contract:");

  const calls = [
    {
      label: "POST /memory/tools/call search_nodes",
      body: {
        name: "search_nodes",
        arguments: { query: "agent:v1:" },
      },
      validator: (parsed) => Array.isArray(parsed?.content),
    },
    {
      label: "POST /memory/tools/call open_nodes",
      body: {
        name: "open_nodes",
        arguments: { names: ["agent:v1:bootstrap"] },
      },
      validator: (parsed) => Array.isArray(parsed?.content),
    },
    {
      label: "POST /memory/tools/call read_graph",
      body: {
        name: "read_graph",
        arguments: {},
      },
      validator: (parsed) => Array.isArray(parsed?.content),
    },
  ];

  let allPassed = true;

  for (const call of calls) {
    try {
      const payload = JSON.stringify(call.body);
      const { status, data } = await makeRequest(
        `${GATEWAY_URL}/memory/tools/call`,
        "POST",
        {
          "Content-Type": "application/json",
        },
        payload,
      );

      if (status !== 200) {
        console.log(`  ✗ ${call.label} [HTTP ${status}]`);
        allPassed = false;
        continue;
      }

      let parsed;
      try {
        parsed = JSON.parse(data);
      } catch {
        console.log(`  ✗ ${call.label} [invalid JSON response]`);
        allPassed = false;
        continue;
      }

      if (!call.validator(parsed)) {
        console.log(`  ✗ ${call.label} [invalid tool contract]`);
        allPassed = false;
        continue;
      }

      console.log(`  ✓ ${call.label}`);
    } catch (err) {
      console.log(`  ✗ ${call.label} [${err.message}]`);
      allPassed = false;
    }
  }

  console.log();
  return allPassed;
}

async function runTests() {
  console.log("🔍 MCP Smoke Test\n");
  console.log(`Gateway: ${GATEWAY_URL}\n`);

  let allPassed = true;
  const results = [];

  // Test Caddy gateway health
  console.log("📍 Caddy Gateway:");
  const caddy = await testEndpoint(`${GATEWAY_URL}/health`, "GET /health");
  if (!caddy) allPassed = false;
  results.push({ service: "Caddy", passed: caddy });
  console.log();

  // Test each MCP service
  for (const service of SERVICES) {
    console.log(`📍 ${service.name}:`);

    // Test /SERVICE_ID/health
    const healthPassed = await testEndpoint(
      `${GATEWAY_URL}${service.path}/health`,
      `GET ${service.path}/health`,
    );
    if (!healthPassed) allPassed = false;

    // Test /SERVICE_ID/tools
    const toolsPassed = await testEndpoint(
      `${GATEWAY_URL}${service.path}/tools`,
      `GET ${service.path}/tools`,
    );
    if (!toolsPassed) allPassed = false;

    // Special test for GitHub: auth header with /info
    if (service.id === "github") {
      const authHeaders = {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
      };
      const infoPassed = await testEndpoint(
        `${GATEWAY_URL}${service.path}/info`,
        `GET ${service.path}/info (with auth header)`,
        "GET",
        authHeaders,
      );
      if (!infoPassed) allPassed = false;
    }

    results.push({
      service: service.name,
      passed: healthPassed && toolsPassed,
    });
    console.log();
  }

  const memoryProtocolPassed = await runMemoryProtocolChecks();
  if (!memoryProtocolPassed) {
    allPassed = false;
  }
  results.push({
    service: "Memory Protocol Contract",
    passed: memoryProtocolPassed,
  });

  // Summary
  console.log("📊 Test Summary:\n");
  const passed = results.filter((r) => r.passed).length;
  const total = results.length;

  for (const result of results) {
    const icon = result.passed ? "✓" : "✗";
    console.log(`  ${icon} ${result.service}`);
  }

  console.log(`\n${passed}/${total} services passed\n`);

  if (allPassed) {
    console.log("✅ All MCP services are healthy\n");
    process.exit(0);
  } else {
    console.log("❌ One or more services failed\n");
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
