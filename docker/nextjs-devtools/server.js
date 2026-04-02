#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Next.js DevTools MCP Server
 * Provides development tools and local testing capabilities
 *
 * Phase 22 Foundation Implementation
 */

const http = require('http');
const port = process.env.PORT || 8000;

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.url === '/health' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'healthy', service: 'nextjs-devtools' }));
    return;
  }

  if (req.url === '/tools' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({
      service: 'nextjs-devtools',
      tools: 5,
      examples: ['compile', 'test', 'build', 'dev-server'],
      ready: true
    }));
    return;
  }

  if (req.url === '/info' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({
      name: 'Next.js DevTools MCP Server',
      version: '1.0.0',
      role: 'Development tools, local testing',
      frequency: 'Medium',
      ram_usage: '1GB'
    }));
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(port, () => console.log(`Next.js DevTools server on port ${port}`));

process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});
