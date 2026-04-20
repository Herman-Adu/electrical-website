import http from "http";

// Service registry (internal Docker hostnames)
const SERVICES = [
  "memory-reference",
  "github-official",
  "nextjs-devtools",
  "playwright",
  "executor-playwright",
  "sequential-thinking",
  "wikipedia",
  "youtube-transcript",
  "openapi-schema",
];

const SERVICE_BASE_URL = (service) => `http://${service}:8000`;
const CALL_TIMEOUT_MS = 600000; // 10 min
const CACHE_TTL_MS = 60000;

let toolCache = new Map();
let aggregatedTools = null;
let aggregatedToolsTime = 0;

// Discover tools from a service
async function discoverToolsFromService(service) {
  try {
    // Try GET /tools first
    let toolsData = null;
    try {
      const res = await fetch(`${SERVICE_BASE_URL(service)}/tools`, {
        timeout: 5000,
      });
      if (res.ok) {
        const data = await res.json();
        toolsData = data.tools || data;
      }
    } catch (e) {
      // Fallback
    }

    // Fallback to POST /tools/call
    if (!toolsData) {
      const res = await fetch(`${SERVICE_BASE_URL(service)}/tools/call`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "list_tools", arguments: {} }),
        timeout: 5000,
      });
      if (res.ok) {
        const data = await res.json();
        toolsData = data.result?.tools || data.tools || [];
      }
    }

    if (!Array.isArray(toolsData)) {
      toolsData = [];
    }

    return toolsData.filter((t) => t.name !== "list_tools");
  } catch (err) {
    console.warn(`[${service}] discovery failed:`, err.message);
    return [];
  }
}

// Aggregate tools from all services
async function aggregateTools() {
  const now = Date.now();
  if (aggregatedTools && now - aggregatedToolsTime < CACHE_TTL_MS) {
    return aggregatedTools;
  }

  const allTools = [];
  let servicesReachable = 0;

  for (const service of SERVICES) {
    const tools = await discoverToolsFromService(service);
    if (tools.length > 0) {
      servicesReachable++;
    }
    const namespaced = tools.map((t) => ({
      ...t,
      name: `${service.replace(/-/g, "_")}__${t.name}`,
      _source: service,
    }));
    allTools.push(...namespaced);
  }

  aggregatedTools = allTools;
  aggregatedToolsTime = now;

  console.log(
    `[aggregator] discovered ${allTools.length} tools from ${servicesReachable}/${SERVICES.length} services`
  );

  return allTools;
}

// Call upstream tool
async function callUpstreamTool(serviceName, toolName, args) {
  const url = `${SERVICE_BASE_URL(serviceName)}/tools/call`;
  const controller = new AbortController();
  const timeoutHandle = setTimeout(() => controller.abort(), CALL_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: toolName, arguments: args }),
      signal: controller.signal,
    });

    if (!res.ok) {
      return {
        content: [
          {
            type: "text",
            text: `Error from ${serviceName}: HTTP ${res.status}`,
          },
        ],
      };
    }

    const data = await res.json();

    if (data.content && Array.isArray(data.content)) {
      return { content: data.content };
    }

    if (data.ok && data.result !== undefined) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(data.result, null, 2),
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  } catch (err) {
    const msg =
      err.name === "AbortError"
        ? `Timeout after ${CALL_TIMEOUT_MS}ms`
        : err.message;
    return {
      content: [
        {
          type: "text",
          text: `Error calling ${serviceName}/${toolName}: ${msg}`,
        },
      ],
    };
  } finally {
    clearTimeout(timeoutHandle);
  }
}

// HTTP request handler
async function handleRequest(req, res) {
  if (req.method === "GET" && req.url === "/health") {
    const tools = aggregatedTools || [];
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        status: "healthy",
        toolCount: tools.length,
        servicesReachable: SERVICES.filter((s) =>
          tools.some((t) => t._source === s)
        ).length,
        totalServices: SERVICES.length,
      })
    );
    return;
  }

  if (req.url === "/tools" && req.method === "GET") {
    const tools = await aggregateTools();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        tools: tools.map(({ _source, ...t }) => t),
      })
    );
    return;
  }

  if (req.url === "/tools/call" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", async () => {
      try {
        const { name, arguments: args } = JSON.parse(body);
        const [service, toolName] = name.split("__");

        if (!service || !toolName) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              error: `Invalid tool name: ${name}. Expected format: service__toolName`,
            })
          );
          return;
        }

        const serviceName = service.replace(/_/g, "-");
        console.log(
          `[aggregator] routing ${name} -> ${serviceName}/${toolName}`
        );

        const result = await callUpstreamTool(serviceName, toolName, args || {});
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result));
      } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // Fallback
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
}

// Main
async function main() {
  console.log("[aggregator] initializing...");
  await aggregateTools();

  const server = http.createServer(handleRequest);

  const PORT = 8000;
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`[aggregator] listening on port ${PORT}`);
    console.log(`[aggregator] health endpoint: http://localhost:${PORT}/health`);
    console.log(`[aggregator] tools endpoint: http://localhost:${PORT}/tools`);
    console.log(`[aggregator] call endpoint: http://localhost:${PORT}/tools/call`);
  });

  // Refresh cache periodically
  setInterval(() => {
    aggregateTools();
  }, CACHE_TTL_MS);
}

main().catch((err) => {
  console.error("[aggregator] startup failed:", err);
  process.exit(1);
});
