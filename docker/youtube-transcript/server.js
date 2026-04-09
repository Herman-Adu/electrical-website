#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * YouTube Transcript MCP Server (HTTP adapter)
 * Provides routed MCP health/tools/info endpoints for local gateway consistency.
 */

const http = require("http");
const port = process.env.PORT || 8000;

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Content-Type", "application/json");

  if (req.url === "/health" && req.method === "GET") {
    res.writeHead(200);
    res.end(
      JSON.stringify({ status: "healthy", service: "youtube-transcript" }),
    );
    return;
  }

  if (req.url === "/tools" && req.method === "GET") {
    res.writeHead(200);
    res.end(
      JSON.stringify({
        service: "youtube-transcript",
        tools: 4,
        examples: ["get_video_info", "get_transcript", "get_timed_transcript"],
        ready: true,
      }),
    );
    return;
  }

  if (req.url === "/info" && req.method === "GET") {
    res.writeHead(200);
    res.end(
      JSON.stringify({
        name: "YouTube Transcript MCP Server",
        version: "1.0.0",
        role: "YouTube metadata and transcript retrieval",
        frequency: "Low-Medium",
        ram_usage: "256MB",
      }),
    );
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(port, () =>
  console.log(`YouTube Transcript server on port ${port}`),
);

process.on("SIGTERM", () => {
  server.close(() => process.exit(0));
});
