#!/usr/bin/env node
/* eslint-disable no-console */

const fs = require("fs");
const path = require("path");
const http = require("http");

const port = Number(process.env.PORT || 8000);
const memoryFilePath =
  process.env.MEMORY_FILE_PATH || "/data/memory-graph.json";

function ensureDirForFile(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function createEmptyGraph() {
  return {
    entities: [],
    relations: [],
  };
}

function loadGraph() {
  try {
    ensureDirForFile(memoryFilePath);
    if (!fs.existsSync(memoryFilePath)) {
      const empty = createEmptyGraph();
      fs.writeFileSync(memoryFilePath, JSON.stringify(empty, null, 2), "utf8");
      return empty;
    }

    const fileContent = fs.readFileSync(memoryFilePath, "utf8");
    const parsed = JSON.parse(fileContent);

    if (!Array.isArray(parsed.entities) || !Array.isArray(parsed.relations)) {
      return createEmptyGraph();
    }

    return parsed;
  } catch (error) {
    console.error("[memory-reference] Failed to load graph:", error);
    return createEmptyGraph();
  }
}

const graph = loadGraph();

function persistGraph() {
  ensureDirForFile(memoryFilePath);
  fs.writeFileSync(memoryFilePath, JSON.stringify(graph, null, 2), "utf8");
}

function normalizeText(value) {
  return String(value || "").trim();
}

function normalizeEntityName(value) {
  return normalizeText(value);
}

function getEntityIndexByName(name) {
  return graph.entities.findIndex((entity) => entity.name === name);
}

function getEntityByName(name) {
  return graph.entities.find((entity) => entity.name === name);
}

function relationExists(relation) {
  return graph.relations.some(
    (existing) =>
      existing.from === relation.from &&
      existing.to === relation.to &&
      existing.relationType === relation.relationType,
  );
}

function writeJson(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1024 * 1024) {
        reject(new Error("Request body too large"));
      }
    });
    req.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error("Invalid JSON body"));
      }
    });
  });
}

const toolDefinitions = [
  {
    name: "create_entities",
    description: "Create multiple entities in the knowledge graph",
    inputSchema: {
      type: "object",
      properties: {
        entities: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              entityType: { type: "string" },
              observations: { type: "array", items: { type: "string" } },
            },
            required: ["name", "entityType", "observations"],
          },
        },
      },
      required: ["entities"],
    },
  },
  {
    name: "create_relations",
    description: "Create directed relations between entities",
    inputSchema: {
      type: "object",
      properties: {
        relations: {
          type: "array",
          items: {
            type: "object",
            properties: {
              from: { type: "string" },
              to: { type: "string" },
              relationType: { type: "string" },
            },
            required: ["from", "to", "relationType"],
          },
        },
      },
      required: ["relations"],
    },
  },
  {
    name: "add_observations",
    description: "Add observations to existing entities",
    inputSchema: {
      type: "object",
      properties: {
        observations: {
          type: "array",
          items: {
            type: "object",
            properties: {
              entityName: { type: "string" },
              contents: { type: "array", items: { type: "string" } },
            },
            required: ["entityName", "contents"],
          },
        },
      },
      required: ["observations"],
    },
  },
  {
    name: "delete_entities",
    description: "Delete entities and cascade-remove related edges",
    inputSchema: {
      type: "object",
      properties: {
        entityNames: { type: "array", items: { type: "string" } },
      },
      required: ["entityNames"],
    },
  },
  {
    name: "delete_observations",
    description: "Delete specific observations from entities",
    inputSchema: {
      type: "object",
      properties: {
        deletions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              entityName: { type: "string" },
              observations: { type: "array", items: { type: "string" } },
            },
            required: ["entityName", "observations"],
          },
        },
      },
      required: ["deletions"],
    },
  },
  {
    name: "delete_relations",
    description: "Delete specific directed relations",
    inputSchema: {
      type: "object",
      properties: {
        relations: {
          type: "array",
          items: {
            type: "object",
            properties: {
              from: { type: "string" },
              to: { type: "string" },
              relationType: { type: "string" },
            },
            required: ["from", "to", "relationType"],
          },
        },
      },
      required: ["relations"],
    },
  },
  {
    name: "read_graph",
    description: "Read complete graph contents",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "search_nodes",
    description: "Search entities by name/type/observation text",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string" },
      },
      required: ["query"],
    },
  },
  {
    name: "open_nodes",
    description: "Open named entities and their internal relations",
    inputSchema: {
      type: "object",
      properties: {
        names: { type: "array", items: { type: "string" } },
      },
      required: ["names"],
    },
  },
];

function callTool(name, args) {
  switch (name) {
    case "create_entities": {
      const entities = Array.isArray(args.entities) ? args.entities : [];
      const created = [];

      for (const entity of entities) {
        const candidateName = normalizeEntityName(entity.name);
        const candidateType = normalizeText(entity.entityType);
        const candidateObservations = Array.isArray(entity.observations)
          ? entity.observations.map(normalizeText).filter(Boolean)
          : [];

        if (!candidateName || !candidateType) {
          continue;
        }

        if (getEntityIndexByName(candidateName) !== -1) {
          continue;
        }

        const createdEntity = {
          name: candidateName,
          entityType: candidateType,
          observations: [...new Set(candidateObservations)],
        };

        graph.entities.push(createdEntity);
        created.push(createdEntity);
      }

      persistGraph();
      return { createdCount: created.length, entities: created };
    }

    case "create_relations": {
      const relations = Array.isArray(args.relations) ? args.relations : [];
      const created = [];

      for (const relation of relations) {
        const from = normalizeEntityName(relation.from);
        const to = normalizeEntityName(relation.to);
        const relationType = normalizeText(relation.relationType);

        if (!from || !to || !relationType) {
          continue;
        }

        if (!getEntityByName(from) || !getEntityByName(to)) {
          continue;
        }

        const candidate = { from, to, relationType };
        if (relationExists(candidate)) {
          continue;
        }

        graph.relations.push(candidate);
        created.push(candidate);
      }

      persistGraph();
      return { createdCount: created.length, relations: created };
    }

    case "add_observations": {
      const observationGroups = Array.isArray(args.observations)
        ? args.observations
        : [];
      const result = [];

      for (const group of observationGroups) {
        const entityName = normalizeEntityName(group.entityName);
        const entity = getEntityByName(entityName);

        if (!entity) {
          continue;
        }

        const contents = Array.isArray(group.contents)
          ? group.contents.map(normalizeText).filter(Boolean)
          : [];

        const existing = new Set(entity.observations || []);
        const added = [];

        for (const observation of contents) {
          if (!existing.has(observation)) {
            existing.add(observation);
            added.push(observation);
          }
        }

        entity.observations = [...existing];
        result.push({ entityName, added });
      }

      persistGraph();
      return { updates: result };
    }

    case "delete_entities": {
      const entityNames = Array.isArray(args.entityNames)
        ? args.entityNames
        : [];
      const namesSet = new Set(
        entityNames.map(normalizeEntityName).filter(Boolean),
      );

      const beforeEntities = graph.entities.length;
      const beforeRelations = graph.relations.length;

      graph.entities = graph.entities.filter(
        (entity) => !namesSet.has(entity.name),
      );
      graph.relations = graph.relations.filter(
        (relation) =>
          !namesSet.has(relation.from) && !namesSet.has(relation.to),
      );

      persistGraph();
      return {
        deletedEntities: beforeEntities - graph.entities.length,
        deletedRelations: beforeRelations - graph.relations.length,
      };
    }

    case "delete_observations": {
      const deletions = Array.isArray(args.deletions) ? args.deletions : [];
      const updates = [];

      for (const deletion of deletions) {
        const entityName = normalizeEntityName(deletion.entityName);
        const entity = getEntityByName(entityName);

        if (!entity) {
          continue;
        }

        const toDelete = new Set(
          (Array.isArray(deletion.observations) ? deletion.observations : [])
            .map(normalizeText)
            .filter(Boolean),
        );

        const before = entity.observations.length;
        entity.observations = entity.observations.filter(
          (observation) => !toDelete.has(observation),
        );
        updates.push({
          entityName,
          removed: before - entity.observations.length,
        });
      }

      persistGraph();
      return { updates };
    }

    case "delete_relations": {
      const relations = Array.isArray(args.relations) ? args.relations : [];
      const targets = relations
        .map((relation) => ({
          from: normalizeEntityName(relation.from),
          to: normalizeEntityName(relation.to),
          relationType: normalizeText(relation.relationType),
        }))
        .filter(
          (relation) => relation.from && relation.to && relation.relationType,
        );

      const before = graph.relations.length;
      graph.relations = graph.relations.filter(
        (existing) =>
          !targets.some(
            (target) =>
              target.from === existing.from &&
              target.to === existing.to &&
              target.relationType === existing.relationType,
          ),
      );

      persistGraph();
      return { deletedCount: before - graph.relations.length };
    }

    case "read_graph": {
      return {
        entities: graph.entities,
        relations: graph.relations,
      };
    }

    case "search_nodes": {
      const query = normalizeText(args.query).toLowerCase();
      if (!query) {
        return { entities: [], relations: [] };
      }

      const entities = graph.entities.filter((entity) => {
        const nameMatch = entity.name.toLowerCase().includes(query);
        const typeMatch = entity.entityType.toLowerCase().includes(query);
        const observationMatch = entity.observations.some((observation) =>
          observation.toLowerCase().includes(query),
        );
        return nameMatch || typeMatch || observationMatch;
      });

      const nameSet = new Set(entities.map((entity) => entity.name));
      const relations = graph.relations.filter(
        (relation) => nameSet.has(relation.from) || nameSet.has(relation.to),
      );

      return { entities, relations };
    }

    case "open_nodes": {
      const names = Array.isArray(args.names)
        ? args.names.map(normalizeEntityName).filter(Boolean)
        : [];
      const nameSet = new Set(names);

      const entities = graph.entities.filter((entity) =>
        nameSet.has(entity.name),
      );
      const existingNameSet = new Set(entities.map((entity) => entity.name));

      const relations = graph.relations.filter(
        (relation) =>
          existingNameSet.has(relation.from) &&
          existingNameSet.has(relation.to),
      );

      return { entities, relations };
    }

    default:
      throw new Error(`Unsupported tool: ${name}`);
  }
}

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    writeJson(res, 204, {});
    return;
  }

  if (req.method === "GET" && req.url === "/health") {
    writeJson(res, 200, {
      status: "healthy",
      service: "memory-reference",
      backend: "knowledge-graph",
      persistence: "enabled",
    });
    return;
  }

  if (req.method === "GET" && req.url === "/tools") {
    writeJson(res, 200, {
      service: "memory-reference",
      backend: "knowledge-graph",
      tools: toolDefinitions,
      ready: true,
    });
    return;
  }

  if (req.method === "GET" && req.url === "/info") {
    writeJson(res, 200, {
      name: "Memory Reference MCP Server",
      version: "2.0.0",
      role: "Knowledge graph persistent memory",
      storage: memoryFilePath,
      entities: graph.entities.length,
      relations: graph.relations.length,
    });
    return;
  }

  if (req.method === "POST" && req.url === "/tools/call") {
    try {
      const body = await parseBody(req);
      const toolName = normalizeText(body.name);
      const args =
        typeof body.arguments === "object" && body.arguments !== null
          ? body.arguments
          : {};

      const result = callTool(toolName, args);
      writeJson(res, 200, { content: [{ type: "json", json: result }] });
      return;
    } catch (error) {
      writeJson(res, 400, { error: error.message || "Tool call failed" });
      return;
    }
  }

  if (req.method === "POST" && req.url === "/open_nodes") {
    try {
      const body = await parseBody(req);
      const result = callTool("open_nodes", body);
      writeJson(res, 200, result);
      return;
    } catch (error) {
      writeJson(res, 400, { error: error.message || "open_nodes failed" });
      return;
    }
  }

  if (req.method === "POST" && req.url === "/search_nodes") {
    try {
      const body = await parseBody(req);
      const result = callTool("search_nodes", body);
      writeJson(res, 200, result);
      return;
    } catch (error) {
      writeJson(res, 400, { error: error.message || "search_nodes failed" });
      return;
    }
  }

  if (req.method === "GET" && req.url === "/read_graph") {
    try {
      const result = callTool("read_graph", {});
      writeJson(res, 200, result);
      return;
    } catch (error) {
      writeJson(res, 400, { error: error.message || "read_graph failed" });
      return;
    }
  }

  writeJson(res, 404, { error: "Not found" });
});

server.listen(port, () => {
  console.log(`[memory-reference] Knowledge graph server listening on ${port}`);
  console.log(`[memory-reference] Persisting graph to ${memoryFilePath}`);
});

process.on("SIGTERM", () => {
  try {
    persistGraph();
  } catch (error) {
    console.error("[memory-reference] Persist failed during shutdown:", error);
  }
  server.close(() => process.exit(0));
});
