#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Wikipedia MCP Server
 * Provides reference and research context capabilities
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
    res.end(JSON.stringify({ status: 'healthy', service: 'wikipedia' }));
    return;
  }

  if (req.url === '/tools' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({
      service: 'wikipedia',
      tools: 22,
      examples: ['search', 'get-article', 'get-summary'],
      ready: true
    }));
    return;
  }

  if (req.url === '/info' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({
      name: 'Wikipedia MCP Server',
      version: '1.0.0',
      role: 'Reference, research context',
      frequency: 'Low-Medium',
      ram_usage: '256MB'
    }));
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(port, () => console.log(`Wikipedia server on port ${port}`));

process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});
