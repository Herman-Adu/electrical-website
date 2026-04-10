#!/usr/bin/env node
/* eslint-disable no-console */

const http = require("node:http");
const https = require("node:https");

const port = Number(process.env.PORT || 8000);
const MAX_BODY_BYTES = 1_048_576;
const MAX_FETCH_BYTES = 2_000_000;
const DEFAULT_LANGUAGE = "en";
const MAX_QUERY_LENGTH = 300;
const MAX_TITLE_LENGTH = 300;
const MAX_LIMIT = 10;
const USER_AGENT = "electrical-website-wikipedia-adapter/2.0";
const LANGUAGE_TAG_PATTERN = /^[A-Za-z]{2,12}(?:-[A-Za-z0-9]{2,8})*$/;
const WIKIPEDIA_HOST_PATTERN =
  /^(?<lang>[A-Za-z][A-Za-z0-9-]{0,14})\.wikipedia\.org$/;

const TOOL_DEFINITIONS = [
  {
    name: "list_tools",
    description: "Return supported Wikipedia tool definitions.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "search_articles",
    description: "Search Wikipedia articles by query.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string" },
        limit: { type: "integer" },
        language: { type: "string" },
      },
      required: ["query"],
    },
  },
  {
    name: "get_summary",
    description: "Get article summary by title, articleId, or Wikipedia URL.",
    inputSchema: {
      type: "object",
      properties: {
        title: { type: "string" },
        articleId: { type: "integer" },
        url: { type: "string" },
        language: { type: "string" },
      },
    },
  },
  {
    name: "get_article",
    description:
      "Get full plain-text article extract by title, articleId, or Wikipedia URL.",
    inputSchema: {
      type: "object",
      properties: {
        title: { type: "string" },
        articleId: { type: "integer" },
        url: { type: "string" },
        language: { type: "string" },
      },
    },
  },
  {
    name: "get_sections",
    description: "Get article sections by title, articleId, or Wikipedia URL.",
    inputSchema: {
      type: "object",
      properties: {
        title: { type: "string" },
        articleId: { type: "integer" },
        url: { type: "string" },
        language: { type: "string" },
      },
    },
  },
  {
    name: "get_related",
    description: "Get related articles by title, articleId, or Wikipedia URL.",
    inputSchema: {
      type: "object",
      properties: {
        title: { type: "string" },
        articleId: { type: "integer" },
        url: { type: "string" },
        language: { type: "string" },
        limit: { type: "integer" },
      },
    },
  },
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

function createError(code, message, status = 400, details) {
  return Object.assign(new Error(message), {
    code,
    status,
    ...(details ? { details } : {}),
  });
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let bytes = 0;

    req.on("data", (chunk) => {
      const buffer = Buffer.isBuffer(chunk)
        ? chunk
        : Buffer.from(String(chunk));
      bytes += buffer.length;

      if (bytes > MAX_BODY_BYTES) {
        reject(
          createError(
            "E_BODY_TOO_LARGE",
            `Request body exceeds ${MAX_BODY_BYTES} bytes`,
            413,
          ),
        );
        req.destroy();
        return;
      }

      chunks.push(buffer);
    });

    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function parseRequestBody(rawBody) {
  try {
    return rawBody ? JSON.parse(rawBody) : {};
  } catch {
    throw createError("E_JSON_INVALID", "Request body must be valid JSON");
  }
}

function ensureObject(value, field) {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw createError("E_ARGUMENTS_TYPE", `${field} must be an object`);
  }
}

function ensureToolName(value) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw createError("E_VALIDATION", "name is required");
  }
  return value.trim();
}

function rejectUnknownArgs(args, allowedFields) {
  const allowed = new Set(allowedFields);
  const unexpected = Object.keys(args).filter((key) => !allowed.has(key));
  if (unexpected.length > 0) {
    throw createError(
      "E_VALIDATION",
      `Unexpected arguments: ${unexpected.sort().join(", ")}`,
    );
  }
}

function normalizeLanguage(value) {
  if (value === undefined) {
    return DEFAULT_LANGUAGE;
  }
  if (typeof value !== "string") {
    throw createError(
      "E_LANGUAGE_INVALID",
      "language must be a valid BCP 47 language tag",
    );
  }
  const language = value.trim();
  if (language.length === 0 || !LANGUAGE_TAG_PATTERN.test(language)) {
    throw createError(
      "E_LANGUAGE_INVALID",
      "language must be a valid BCP 47 language tag",
    );
  }
  return language;
}

function normalizeQuery(value) {
  if (typeof value !== "string") {
    throw createError(
      "E_QUERY_INVALID",
      `query must be a non-empty string up to ${MAX_QUERY_LENGTH} characters`,
    );
  }
  const query = value.trim();
  if (query.length === 0 || query.length > MAX_QUERY_LENGTH) {
    throw createError(
      "E_QUERY_INVALID",
      `query must be a non-empty string up to ${MAX_QUERY_LENGTH} characters`,
    );
  }
  return query;
}

function normalizeTitle(value) {
  if (typeof value !== "string") {
    throw createError(
      "E_TITLE_INVALID",
      `title must be a non-empty string up to ${MAX_TITLE_LENGTH} characters`,
    );
  }
  const title = value.trim();
  if (
    title.length === 0 ||
    title.length > MAX_TITLE_LENGTH ||
    /[\r\n\u0000]/u.test(title)
  ) {
    throw createError(
      "E_TITLE_INVALID",
      `title must be a non-empty string up to ${MAX_TITLE_LENGTH} characters`,
    );
  }
  return title;
}

function normalizeArticleId(value) {
  if (!Number.isInteger(value) || value < 1) {
    throw createError(
      "E_ARTICLE_ID_INVALID",
      "articleId must be a positive integer",
    );
  }
  return value;
}

function normalizeLimit(value, field) {
  if (value === undefined) {
    return undefined;
  }
  if (!Number.isInteger(value) || value < 1 || value > MAX_LIMIT) {
    throw createError(
      "E_LIMIT_INVALID",
      `${field} must be an integer between 1 and ${MAX_LIMIT}`,
    );
  }
  return value;
}

function parseWikipediaUrl(value) {
  if (typeof value !== "string") {
    throw createError(
      "E_WIKIPEDIA_URL_INVALID",
      "url must be a valid Wikipedia article URL",
    );
  }

  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    throw createError(
      "E_WIKIPEDIA_URL_INVALID",
      "url must be a valid Wikipedia article URL",
    );
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    throw createError(
      "E_WIKIPEDIA_URL_INVALID",
      "url must be a valid Wikipedia article URL",
    );
  }

  const hostMatch = parsed.hostname.match(WIKIPEDIA_HOST_PATTERN);
  if (!hostMatch) {
    throw createError(
      "E_WIKIPEDIA_URL_INVALID",
      "url must be a valid Wikipedia article URL",
    );
  }

  const curid = parsed.searchParams.get("curid");
  if (curid) {
    if (!/^[1-9]\d*$/u.test(curid)) {
      throw createError(
        "E_ARTICLE_ID_INVALID",
        "articleId must be a positive integer",
      );
    }
    return {
      language: hostMatch.groups?.lang || DEFAULT_LANGUAGE,
      selector: "articleId",
      articleId: Number(curid),
    };
  }

  if (!parsed.pathname.startsWith("/wiki/")) {
    throw createError(
      "E_WIKIPEDIA_URL_INVALID",
      "url must be a valid Wikipedia article URL",
    );
  }

  const rawTitle = parsed.pathname.slice("/wiki/".length);
  if (!rawTitle) {
    throw createError(
      "E_WIKIPEDIA_URL_INVALID",
      "url must be a valid Wikipedia article URL",
    );
  }

  return {
    language: hostMatch.groups?.lang || DEFAULT_LANGUAGE,
    selector: "title",
    title: normalizeTitle(decodeURIComponent(rawTitle.replace(/_/g, " "))),
  };
}

function resolveSelector(args, allowedFields) {
  rejectUnknownArgs(args, allowedFields);
  const hasTitle = args.title !== undefined;
  const hasArticleId = args.articleId !== undefined;
  const hasUrl = args.url !== undefined;
  if ((hasTitle ? 1 : 0) + (hasArticleId ? 1 : 0) + (hasUrl ? 1 : 0) !== 1) {
    throw createError(
      "E_SELECTOR_REQUIRED",
      "Provide exactly one of title, articleId, or url",
    );
  }

  if (hasUrl) {
    const parsed = parseWikipediaUrl(args.url);
    return {
      language: normalizeLanguage(args.language ?? parsed.language),
      selector: parsed.selector,
      ...(parsed.selector === "title"
        ? { title: parsed.title }
        : { articleId: parsed.articleId }),
    };
  }

  return {
    language: normalizeLanguage(args.language),
    ...(hasTitle
      ? { selector: "title", title: normalizeTitle(args.title) }
      : {}),
    ...(hasArticleId
      ? { selector: "articleId", articleId: normalizeArticleId(args.articleId) }
      : {}),
  };
}

function apiRequestJson(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https:") ? https : http;
    const req = client.request(
      url,
      {
        method: "GET",
        timeout: 12000,
        headers: {
          Accept: "application/json",
          "User-Agent": USER_AGENT,
        },
      },
      (res) => {
        let raw = "";
        res.on("data", (chunk) => {
          raw += chunk.toString();
          if (raw.length > MAX_FETCH_BYTES) {
            req.destroy(new Error("Response too large"));
          }
        });
        res.on("end", () => {
          if ((res.statusCode || 500) < 200 || (res.statusCode || 500) >= 300) {
            reject(
              createError(
                "E_UPSTREAM",
                `Wikipedia upstream returned status ${res.statusCode}`,
                502,
              ),
            );
            return;
          }
          try {
            resolve(JSON.parse(raw));
          } catch {
            reject(
              createError(
                "E_UPSTREAM_JSON",
                "Wikipedia upstream returned invalid JSON",
                502,
              ),
            );
          }
        });
      },
    );

    req.on("timeout", () => req.destroy(new Error("timeout")));
    req.on("error", (error) => {
      reject(
        createError(
          "E_UPSTREAM",
          error.message || "Wikipedia upstream request failed",
          502,
        ),
      );
    });
    req.end();
  });
}

function buildRestBase(language) {
  return `https://${language}.wikipedia.org/api/rest_v1`;
}

function buildActionBase(language) {
  return `https://${language}.wikipedia.org/w/api.php`;
}

async function resolveTitleFromArticleId(language, articleId) {
  const url = `${buildActionBase(language)}?format=json&action=query&pageids=${articleId}&prop=info&inprop=url`;
  const data = await apiRequestJson(url);
  const page = data?.query?.pages?.[String(articleId)];
  if (!page || page.missing !== undefined) {
    throw createError(
      "E_ARTICLE_NOT_FOUND",
      `Wikipedia article not found for articleId ${articleId}`,
      404,
    );
  }
  return {
    title: page.title,
    articleId,
    canonicalUrl: page.fullurl || null,
  };
}

async function resolveTarget(selector) {
  if (selector.selector === "title") {
    return {
      language: selector.language,
      title: selector.title,
      articleId: null,
      canonicalUrl: `https://${selector.language}.wikipedia.org/wiki/${encodeURIComponent(selector.title.replace(/ /g, "_"))}`,
    };
  }

  const resolved = await resolveTitleFromArticleId(
    selector.language,
    selector.articleId,
  );
  return {
    language: selector.language,
    title: resolved.title,
    articleId: selector.articleId,
    canonicalUrl: resolved.canonicalUrl,
  };
}

async function searchArticles(args) {
  rejectUnknownArgs(args, ["query", "limit", "language"]);
  const query = normalizeQuery(args.query);
  const language = normalizeLanguage(args.language);
  const limit = normalizeLimit(args.limit, "limit") ?? 5;
  const url = `${buildActionBase(language)}?format=json&action=query&list=search&utf8=1&srsearch=${encodeURIComponent(query)}&srlimit=${limit}`;
  const data = await apiRequestJson(url);
  const results = Array.isArray(data?.query?.search)
    ? data.query.search.map((item) => ({
        articleId: item.pageid,
        title: item.title,
        snippet:
          typeof item.snippet === "string"
            ? item.snippet.replace(/<[^>]+>/g, "")
            : "",
        url: `https://${language}.wikipedia.org/wiki/${encodeURIComponent(String(item.title).replace(/ /g, "_"))}`,
      }))
    : [];
  return { language, query, limit, count: results.length, results };
}

async function getSummary(args) {
  const selector = resolveSelector(args, [
    "title",
    "articleId",
    "url",
    "language",
  ]);
  const target = await resolveTarget(selector);
  const data = await apiRequestJson(
    `${buildRestBase(target.language)}/page/summary/${encodeURIComponent(target.title)}`,
  );
  return {
    language: target.language,
    title: data.title || target.title,
    articleId: data.pageid || target.articleId,
    summary: data.extract || "",
    description: data.description || null,
    canonicalUrl: data.content_urls?.desktop?.page || target.canonicalUrl,
    thumbnail: data.thumbnail?.source || null,
  };
}

async function getArticle(args) {
  const selector = resolveSelector(args, [
    "title",
    "articleId",
    "url",
    "language",
  ]);
  const target = await resolveTarget(selector);
  const url =
    selector.selector === "articleId"
      ? `${buildActionBase(target.language)}?format=json&action=query&prop=extracts&explaintext=1&exsectionformat=plain&pageids=${selector.articleId}`
      : `${buildActionBase(target.language)}?format=json&action=query&prop=extracts&explaintext=1&exsectionformat=plain&titles=${encodeURIComponent(target.title)}`;
  const data = await apiRequestJson(url);
  const pages = data?.query?.pages || {};
  const firstPage = Object.values(pages)[0];
  if (!firstPage || firstPage.missing !== undefined) {
    throw createError(
      "E_ARTICLE_NOT_FOUND",
      `Wikipedia article not found for ${target.title}`,
      404,
    );
  }
  return {
    language: target.language,
    title: firstPage.title || target.title,
    articleId: firstPage.pageid || target.articleId,
    extract: typeof firstPage.extract === "string" ? firstPage.extract : "",
    canonicalUrl: target.canonicalUrl,
  };
}

async function getSections(args) {
  const selector = resolveSelector(args, [
    "title",
    "articleId",
    "url",
    "language",
  ]);
  const target = await resolveTarget(selector);
  const data = await apiRequestJson(
    `${buildActionBase(target.language)}?format=json&action=parse&page=${encodeURIComponent(target.title)}&prop=sections`,
  );
  const sections = Array.isArray(data?.parse?.sections)
    ? data.parse.sections.map((section) => ({
        index: section.index,
        line: section.line,
        number: section.number,
        level: section.level,
      }))
    : [];
  return {
    language: target.language,
    title: target.title,
    count: sections.length,
    sections,
  };
}

async function getRelated(args) {
  const selector = resolveSelector(args, [
    "title",
    "articleId",
    "url",
    "language",
    "limit",
  ]);
  const target = await resolveTarget(selector);
  const limit = normalizeLimit(args.limit, "limit") ?? 5;
  const data = await apiRequestJson(
    `${buildRestBase(target.language)}/page/related/${encodeURIComponent(target.title)}`,
  );
  const pages = Array.isArray(data?.pages) ? data.pages.slice(0, limit) : [];
  return {
    language: target.language,
    title: target.title,
    count: pages.length,
    results: pages.map((page) => ({
      articleId: page.id || null,
      title: page.title || null,
      summary: page.extract || "",
      canonicalUrl: page.content_urls?.desktop?.page || null,
      thumbnail: page.thumbnail?.source || null,
    })),
  };
}

async function callTool(name, args = {}) {
  if (name === "list_tools") {
    return {
      tools: TOOL_DEFINITIONS,
      validation: {
        bodySizeLimitBytes: MAX_BODY_BYTES,
        fetchSizeLimitBytes: MAX_FETCH_BYTES,
        selectorRule: "exactly one of title, articleId, or url",
      },
    };
  }
  if (name === "search_articles") {
    return searchArticles(args);
  }
  if (name === "get_summary") {
    return getSummary(args);
  }
  if (name === "get_article") {
    return getArticle(args);
  }
  if (name === "get_sections") {
    return getSections(args);
  }
  if (name === "get_related") {
    return getRelated(args);
  }
  throw createError("E_TOOL_NOT_FOUND", `Unknown tool: ${name}`, 404);
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
      service: "wikipedia",
      tools_call: true,
    });
    return;
  }

  if (req.url === "/tools" && req.method === "GET") {
    sendJson(res, 200, {
      service: "wikipedia",
      tools: TOOL_DEFINITIONS.length,
      definitions: TOOL_DEFINITIONS,
      examples: ["search_articles", "get_summary", "get_article"],
      ready: true,
    });
    return;
  }

  if (req.url === "/info" && req.method === "GET") {
    sendJson(res, 200, {
      name: "Wikipedia MCP Server",
      version: "2.0.0",
      role: "Wikipedia research and article retrieval",
      tools_call: "enabled",
      bodySizeLimitBytes: MAX_BODY_BYTES,
    });
    return;
  }

  if (req.url === "/tools/call" && req.method === "POST") {
    try {
      const rawBody = await readBody(req);
      const parsed = parseRequestBody(rawBody);
      ensureObject(parsed, "request body");
      const name = ensureToolName(parsed.name);
      const args = parsed.arguments ?? {};
      ensureObject(args, "arguments");
      const result = await callTool(name, args);
      sendJson(res, 200, { ok: true, name, result });
      return;
    } catch (error) {
      sendToolError(
        res,
        Number.isInteger(error?.status) ? error.status : 500,
        error?.code || "E_INTERNAL",
        error instanceof Error ? error.message : String(error),
        error?.details,
      );
      return;
    }
  }

  sendJson(res, 404, {
    ok: false,
    error: { code: "E_ROUTE_NOT_FOUND", message: "Route not found" },
  });
});

server.listen(port, () => {
  console.log(`Wikipedia server on port ${port}`);
});

process.on("SIGTERM", () => {
  server.close(() => process.exit(0));
});
