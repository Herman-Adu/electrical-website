#!/usr/bin/env node
/* eslint-disable no-console */

const crypto = require("node:crypto");
const http = require("node:http");
const https = require("node:https");

const port = Number(process.env.PORT || 8000);
const MAX_BODY_BYTES = 1_048_576;
const MAX_FETCH_BYTES = 2_000_000;
const documents = new Map();

const TOOL_DEFINITIONS = [
  {
    name: "list_tools",
    description: "Return supported OpenAPI schema tool definitions.",
  },
  {
    name: "load_document",
    description:
      "Load an OpenAPI JSON document from arguments.documentJson or arguments.url and return documentId.",
  },
  {
    name: "validate_document",
    description:
      "Validate OpenAPI core fields and integrity checks. Args: documentId or documentJson.",
  },
  {
    name: "list_operations",
    description: "List HTTP operations by path/method. Args: documentId.",
  },
  {
    name: "get_operation",
    description:
      "Get operation details by path+method or operationId. Args: documentId + selector.",
  },
  {
    name: "schema_summary",
    description:
      "Get a high-level summary of paths/components/security/tags. Args: documentId.",
  },
];

const HTTP_METHODS = [
  "get",
  "put",
  "post",
  "delete",
  "options",
  "head",
  "patch",
  "trace",
];

function setCommonHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Content-Type", "application/json");
}

function sendJson(res, status, payload) {
  res.writeHead(status);
  res.end(JSON.stringify(payload));
}

function sendToolError(res, status, code, message, details) {
  sendJson(res, status, {
    ok: false,
    error: {
      code,
      message,
      ...(details ? { details } : {}),
    },
  });
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > MAX_BODY_BYTES) {
        reject(
          Object.assign(
            new Error(`Request body exceeds ${MAX_BODY_BYTES} bytes`),
            { code: "E_BODY_TOO_LARGE" },
          ),
        );
      }
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function ensureString(value, field) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw Object.assign(new Error(`${field} is required`), {
      status: 400,
      code: "E_VALIDATION",
    });
  }
}

function ensureObject(value, field) {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw Object.assign(new Error(`${field} must be an object`), {
      status: 400,
      code: "E_VALIDATION",
    });
  }
}

function safeParseJson(text, fieldName) {
  try {
    return JSON.parse(text);
  } catch {
    throw Object.assign(new Error(`${fieldName} must be valid JSON`), {
      status: 400,
      code: "E_JSON_INVALID",
    });
  }
}

function isHttpUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function fetchUrlJson(url) {
  if (!isHttpUrl(url)) {
    throw Object.assign(new Error("url must use http or https"), {
      status: 400,
      code: "E_VALIDATION",
    });
  }

  const client = url.startsWith("https:") ? https : http;
  return new Promise((resolve, reject) => {
    const req = client.request(
      url,
      {
        method: "GET",
        timeout: 10000,
        headers: {
          Accept: "application/json",
          "User-Agent": "electrical-website-openapi-adapter/1.0",
        },
      },
      (res) => {
        let raw = "";
        res.on("data", (chunk) => {
          raw += chunk.toString();
          if (raw.length > MAX_FETCH_BYTES) {
            req.destroy(new Error("Fetched payload too large"));
          }
        });
        res.on("end", () => {
          if ((res.statusCode || 500) < 200 || (res.statusCode || 500) >= 300) {
            reject(
              Object.assign(
                new Error(`Upstream returned status ${res.statusCode}`),
                {
                  status: 400,
                  code: "E_FETCH_FAILED",
                },
              ),
            );
            return;
          }
          try {
            resolve(JSON.parse(raw));
          } catch {
            reject(
              Object.assign(new Error("Fetched document is not valid JSON"), {
                status: 400,
                code: "E_JSON_INVALID",
              }),
            );
          }
        });
      },
    );

    req.on("timeout", () => req.destroy(new Error("Fetch timeout")));
    req.on("error", (error) => {
      reject(
        Object.assign(new Error(error.message || "Fetch failed"), {
          status: 400,
          code: "E_FETCH_FAILED",
        }),
      );
    });
    req.end();
  });
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function extractOperations(doc) {
  const operations = [];
  const paths =
    typeof doc.paths === "object" && doc.paths !== null ? doc.paths : {};

  for (const [path, pathItem] of Object.entries(paths)) {
    if (!pathItem || typeof pathItem !== "object") {
      continue;
    }
    for (const method of HTTP_METHODS) {
      if (pathItem[method] && typeof pathItem[method] === "object") {
        operations.push({
          path,
          method,
          operationId:
            typeof pathItem[method].operationId === "string"
              ? pathItem[method].operationId
              : null,
          summary:
            typeof pathItem[method].summary === "string"
              ? pathItem[method].summary
              : null,
          tags: Array.isArray(pathItem[method].tags)
            ? [...pathItem[method].tags]
            : [],
        });
      }
    }
  }

  return operations;
}

function validateDocument(doc) {
  const issues = [];

  if (typeof doc !== "object" || doc === null || Array.isArray(doc)) {
    issues.push({ level: "error", message: "Document root must be an object" });
    return { valid: false, issues };
  }

  if (typeof doc.openapi !== "string" || !doc.openapi.startsWith("3.")) {
    issues.push({
      level: "error",
      message: "openapi must be a 3.x version string",
    });
  }

  if (!doc.info || typeof doc.info !== "object") {
    issues.push({ level: "error", message: "info object is required" });
  } else {
    if (
      typeof doc.info.title !== "string" ||
      doc.info.title.trim().length === 0
    ) {
      issues.push({ level: "error", message: "info.title is required" });
    }
    if (
      typeof doc.info.version !== "string" ||
      doc.info.version.trim().length === 0
    ) {
      issues.push({ level: "error", message: "info.version is required" });
    }
  }

  if (!doc.paths || typeof doc.paths !== "object" || Array.isArray(doc.paths)) {
    issues.push({ level: "error", message: "paths object is required" });
  }

  const operations = extractOperations(doc);
  const operationIdSet = new Set();
  for (const op of operations) {
    if (op.operationId) {
      if (operationIdSet.has(op.operationId)) {
        issues.push({
          level: "error",
          message: `operationId must be unique: ${op.operationId}`,
        });
      }
      operationIdSet.add(op.operationId);
    }
  }

  if (operations.length === 0) {
    issues.push({
      level: "warning",
      message: "No HTTP operations detected in paths",
    });
  }

  return {
    valid: issues.every((issue) => issue.level !== "error"),
    issues,
    operationsCount: operations.length,
  };
}

function resolveDocumentFromArgs(args) {
  if (args.documentId) {
    ensureString(args.documentId, "documentId");
    const existing = documents.get(args.documentId);
    if (!existing) {
      throw Object.assign(new Error(`Unknown documentId: ${args.documentId}`), {
        status: 404,
        code: "E_DOCUMENT_NOT_FOUND",
      });
    }
    return {
      documentId: args.documentId,
      doc: existing.doc,
      source: existing.source,
    };
  }

  if (args.documentJson !== undefined) {
    const doc =
      typeof args.documentJson === "string"
        ? safeParseJson(args.documentJson, "documentJson")
        : args.documentJson;
    ensureObject(doc, "documentJson");
    return { documentId: null, doc, source: "inline" };
  }

  throw Object.assign(new Error("documentId or documentJson is required"), {
    status: 400,
    code: "E_VALIDATION",
  });
}

async function callTool(name, args = {}) {
  if (name === "list_tools") {
    return { tools: TOOL_DEFINITIONS };
  }

  if (name === "load_document") {
    let doc;
    let source = "inline";

    if (args.documentJson !== undefined) {
      doc =
        typeof args.documentJson === "string"
          ? safeParseJson(args.documentJson, "documentJson")
          : args.documentJson;
      ensureObject(doc, "documentJson");
    } else if (args.url !== undefined) {
      ensureString(args.url, "url");
      doc = await fetchUrlJson(args.url);
      ensureObject(doc, "fetched document");
      source = String(args.url);
    } else {
      throw Object.assign(new Error("documentJson or url is required"), {
        status: 400,
        code: "E_VALIDATION",
      });
    }

    const documentId = `openapi_${crypto.randomUUID()}`;
    documents.set(documentId, {
      doc: clone(doc),
      source,
      loadedAt: new Date().toISOString(),
    });

    return {
      documentId,
      source,
      openapi: typeof doc.openapi === "string" ? doc.openapi : null,
      pathsCount:
        doc.paths && typeof doc.paths === "object"
          ? Object.keys(doc.paths).length
          : 0,
      componentsCount:
        doc.components && typeof doc.components === "object"
          ? Object.keys(doc.components).length
          : 0,
    };
  }

  if (name === "validate_document") {
    const target = resolveDocumentFromArgs(args);
    return {
      documentId: target.documentId,
      source: target.source,
      ...validateDocument(target.doc),
    };
  }

  if (name === "list_operations") {
    const { documentId, doc } = resolveDocumentFromArgs(args);
    return {
      documentId,
      operations: extractOperations(doc),
    };
  }

  if (name === "get_operation") {
    const { documentId, doc } = resolveDocumentFromArgs(args);
    const operations = extractOperations(doc);

    if (args.operationId !== undefined) {
      ensureString(args.operationId, "operationId");
      const match = operations.find(
        (op) => op.operationId === args.operationId,
      );
      if (!match) {
        throw Object.assign(
          new Error(`operationId not found: ${args.operationId}`),
          {
            status: 404,
            code: "E_OPERATION_NOT_FOUND",
          },
        );
      }
      return { documentId, operation: match };
    }

    ensureString(args.path, "path");
    ensureString(args.method, "method");
    const method = args.method.toLowerCase();
    if (!HTTP_METHODS.includes(method)) {
      throw Object.assign(new Error("method must be a valid HTTP method"), {
        status: 400,
        code: "E_VALIDATION",
      });
    }

    const target = operations.find(
      (op) => op.path === args.path && op.method === method,
    );
    if (!target) {
      throw Object.assign(
        new Error(
          `Operation not found for ${method.toUpperCase()} ${args.path}`,
        ),
        {
          status: 404,
          code: "E_OPERATION_NOT_FOUND",
        },
      );
    }

    return { documentId, operation: target };
  }

  if (name === "schema_summary") {
    const { documentId, doc } = resolveDocumentFromArgs(args);
    const operations = extractOperations(doc);

    return {
      documentId,
      openapi: doc.openapi || null,
      title: doc.info?.title || null,
      version: doc.info?.version || null,
      pathsCount:
        doc.paths && typeof doc.paths === "object"
          ? Object.keys(doc.paths).length
          : 0,
      operationsCount: operations.length,
      tagsCount: Array.isArray(doc.tags) ? doc.tags.length : 0,
      securitySchemesCount:
        doc.components?.securitySchemes &&
        typeof doc.components.securitySchemes === "object"
          ? Object.keys(doc.components.securitySchemes).length
          : 0,
      hasServers: Array.isArray(doc.servers) && doc.servers.length > 0,
    };
  }

  throw Object.assign(new Error(`Unknown tool: ${name}`), {
    status: 404,
    code: "E_TOOL_NOT_FOUND",
  });
}

const server = http.createServer(async (req, res) => {
  setCommonHeaders(res);

  if (req.method === "OPTIONS") {
    sendJson(res, 204, {});
    return;
  }

  if (req.url === "/health" && req.method === "GET") {
    sendJson(res, 200, {
      status: "healthy",
      service: "openapi-schema",
      documentsLoaded: documents.size,
    });
    return;
  }

  if (req.url === "/tools" && req.method === "GET") {
    sendJson(res, 200, {
      service: "openapi-schema",
      tools: TOOL_DEFINITIONS.length,
      definitions: TOOL_DEFINITIONS,
      examples: ["load_document", "validate_document", "list_operations"],
      ready: true,
    });
    return;
  }

  if (req.url === "/info" && req.method === "GET") {
    sendJson(res, 200, {
      name: "OpenAPI Schema MCP Server",
      version: "2.0.0",
      role: "OpenAPI loading, validation, and operation introspection",
      runtime: "node",
      tools_call: "enabled",
    });
    return;
  }

  if (req.url === "/tools/call" && req.method === "POST") {
    try {
      const rawBody = await readBody(req);
      let parsed = {};
      try {
        parsed = rawBody ? JSON.parse(rawBody) : {};
      } catch {
        sendToolError(
          res,
          400,
          "E_JSON_INVALID",
          "Request body must be valid JSON",
        );
        return;
      }

      const name = parsed?.name;
      const args = parsed?.arguments ?? {};
      ensureString(name, "name");

      if (typeof args !== "object" || args === null || Array.isArray(args)) {
        throw Object.assign(new Error("arguments must be an object"), {
          status: 400,
          code: "E_ARGUMENTS_TYPE",
        });
      }

      const result = await callTool(name, args);
      sendJson(res, 200, { ok: true, name, result });
      return;
    } catch (error) {
      const status = Number.isInteger(error?.status) ? error.status : 500;
      const code = error?.code || "E_INTERNAL";
      sendToolError(
        res,
        status,
        code,
        error instanceof Error ? error.message : String(error),
      );
      return;
    }
  }

  sendJson(res, 404, {
    ok: false,
    error: { code: "E_ROUTE_NOT_FOUND", message: "Route not found" },
  });
});

server.listen(port, () => console.log(`OpenAPI Schema server on port ${port}`));

process.on("SIGTERM", () => {
  server.close(() => process.exit(0));
});
