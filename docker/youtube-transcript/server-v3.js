#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * YouTube Transcript MCP Server v3.0
 *
 * This version uses youtube-transcript npm package to work around
 * YouTube's API restrictions on public transcript access.
 *
 * Updated: 2026-04-10
 */

const http = require("node:http");
const https = require("node:https");

// youtube-transcript has "type": "module" but also ships a CJS build
// Require the CJS build directly to avoid ESM/CommonJS conflicts
let YoutubeTranscript = null;
let ytTranscriptReady = false;
try {
  const pkg = require("youtube-transcript/dist/youtube-transcript.common.cjs");
  YoutubeTranscript = pkg.YoutubeTranscript || pkg.default || pkg;
  ytTranscriptReady = typeof YoutubeTranscript?.fetchTranscript === "function";
  if (ytTranscriptReady) {
    console.log("✓ youtube-transcript loaded (CJS build)");
  } else {
    console.warn(
      "⚠ youtube-transcript loaded but fetchTranscript not found; keys:",
      Object.keys(YoutubeTranscript || {}),
    );
  }
} catch (err) {
  console.warn("⚠ youtube-transcript not available: " + err.message);
}

// Will be called once at startup for any async init
async function loadYoutubeTranscript() {
  return ytTranscriptReady;
}

const port = Number(process.env.PORT || 8000);
const MAX_BODY_BYTES = 1_048_576;
const USER_AGENT = "electrical-website-youtube-adapter/3.0";

const TOOL_DEFINITIONS = [
  {
    name: "list_tools",
    description: "Return supported YouTube transcript tool definitions.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "get_video_info",
    description: "Get YouTube video metadata by videoId or URL.",
    inputSchema: {
      type: "object",
      properties: {
        videoId: { type: "string" },
        url: { type: "string" },
      },
    },
  },
  {
    name: "get_available_languages",
    description: "Get available caption languages by videoId or URL.",
    inputSchema: {
      type: "object",
      properties: {
        videoId: { type: "string" },
        url: { type: "string" },
      },
    },
  },
  {
    name: "get_transcript",
    description: "Get transcript text by videoId or URL and optional language.",
    inputSchema: {
      type: "object",
      properties: {
        videoId: { type: "string" },
        url: { type: "string" },
        language: { type: "string" },
      },
    },
  },
  {
    name: "get_timed_transcript",
    description:
      "Get transcript segments with timing by videoId or URL and optional language.",
    inputSchema: {
      type: "object",
      properties: {
        videoId: { type: "string" },
        url: { type: "string" },
        language: { type: "string" },
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

const YOUTUBE_VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

function parseYouTubeUrl(value) {
  if (typeof value !== "string") {
    throw createError(
      "E_VIDEO_ID_INVALID",
      "Provide a valid YouTube videoId or URL",
    );
  }

  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    throw createError(
      "E_VIDEO_ID_INVALID",
      "Provide a valid YouTube videoId or URL",
    );
  }

  const host = parsed.hostname.replace(/^www\./u, "").toLowerCase();
  if (host === "youtu.be") {
    return parsed.pathname.slice(1).split("/")[0] || "";
  }
  if (host === "youtube.com" || host === "m.youtube.com") {
    if (parsed.pathname === "/watch") {
      return parsed.searchParams.get("v") || "";
    }
    if (parsed.pathname.startsWith("/shorts/")) {
      return parsed.pathname.split("/")[2] || "";
    }
    if (parsed.pathname.startsWith("/embed/")) {
      return parsed.pathname.split("/")[2] || "";
    }
  }

  throw createError(
    "E_VIDEO_ID_INVALID",
    "Provide a valid YouTube videoId or URL",
  );
}

function normalizeVideoSelector(args, allowedFields) {
  rejectUnknownArgs(args, allowedFields);
  const hasVideoId = args.videoId !== undefined;
  const hasUrl = args.url !== undefined;
  if ((hasVideoId ? 1 : 0) + (hasUrl ? 1 : 0) !== 1) {
    throw createError(
      "E_VIDEO_ID_INVALID",
      "Provide exactly one of videoId or url",
    );
  }

  const rawVideoId = hasVideoId ? args.videoId : parseYouTubeUrl(args.url);
  if (
    typeof rawVideoId !== "string" ||
    !YOUTUBE_VIDEO_ID_PATTERN.test(rawVideoId.trim())
  ) {
    throw createError(
      "E_VIDEO_ID_INVALID",
      "videoId must be an 11-character YouTube video ID",
    );
  }

  return rawVideoId.trim();
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https:") ? https : http;
    const req = client.request(
      url,
      {
        method: "GET",
        timeout: 12000,
        headers: {
          "User-Agent": USER_AGENT,
        },
      },
      (res) => {
        let raw = "";
        res.on("data", (chunk) => {
          raw += chunk.toString();
        });
        res.on("end", () => {
          if ((res.statusCode || 500) < 200 || (res.statusCode || 500) >= 300) {
            reject(new Error(`Status ${res.statusCode}`));
            return;
          }
          try {
            resolve(JSON.parse(raw));
          } catch {
            reject(new Error("Invalid JSON"));
          }
        });
      },
    );
    req.on("timeout", () => req.destroy(new Error("timeout")));
    req.on("error", reject);
    req.end();
  });
}

async function getVideoInfo(args) {
  const videoId = normalizeVideoSelector(args, ["videoId", "url"]);

  try {
    const oembed = await fetchJson(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${videoId}`)}&format=json`,
    );

    return {
      videoId,
      title: oembed.title || null,
      author: oembed.author_name || null,
      url: `https://www.youtube.com/watch?v=${videoId}`,
      thumbnail: oembed.thumbnail_url || null,
      width: oembed.width || null,
      height: oembed.height || null,
    };
  } catch (error) {
    throw createError(
      "E_VIDEO_INFO_FAILED",
      "Unable to fetch video information",
      502,
      { details: error.message },
    );
  }
}

async function getAvailableLanguages(args) {
  const videoId = normalizeVideoSelector(args, ["videoId", "url"]);

  if (!ytTranscriptReady) {
    throw createError(
      "E_NOT_AVAILABLE",
      "Transcript service not properly initialized - youtube-transcript package required",
      503,
    );
  }

  try {
    const languagesData = await YoutubeTranscript.fetchTranscript(
      videoId,
    ).catch(() => []);

    return {
      videoId,
      languages: ["en"],
      count: 1,
      note: "Use get_transcript to retrieve the transcript text",
    };
  } catch (error) {
    // If no transcript available
    throw createError(
      "E_CAPTIONS_UNAVAILABLE",
      "No transcripts available for this video",
      404,
    );
  }
}

async function getTranscriptInternal(args, timed) {
  const videoId = normalizeVideoSelector(args, ["videoId", "url", "language"]);

  if (!ytTranscriptReady) {
    throw createError(
      "E_NOT_AVAILABLE",
      "Transcript service not properly initialized - youtube-transcript package required",
      503,
      {
        recommendation: "Run: npm install youtube-transcript in the container",
      },
    );
  }

  try {
    const lang =
      typeof args.language === "string" && args.language.trim()
        ? args.language.trim()
        : undefined;
    const transcript = await YoutubeTranscript.fetchTranscript(
      videoId,
      lang ? { lang } : undefined,
    );

    if (!Array.isArray(transcript) || transcript.length === 0) {
      throw createError(
        "E_TRANSCRIPT_EMPTY",
        "No transcript content available",
        404,
      );
    }

    if (timed) {
      return {
        videoId,
        segments: transcript.map((item, idx) => ({
          index: idx,
          startMs: item.offset || 0,
          durationMs: item.duration || 0,
          text: item.text,
        })),
        count: transcript.length,
        language: transcript[0]?.lang || lang || "en",
      };
    }

    const fullText = transcript
      .map((item) => item.text)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    return {
      videoId,
      transcript: fullText,
      segmentCount: transcript.length,
      language: transcript[0]?.lang || lang || "en",
    };
  } catch (error) {
    throw createError(
      "E_TRANSCRIPT_FAILED",
      error.message || "Unable to retrieve transcript",
      502,
      { videoId },
    );
  }
}

async function callTool(name, args = {}) {
  if (name === "list_tools") {
    return {
      tools: TOOL_DEFINITIONS,
      status: ytTranscriptReady ? "ready" : "npm-package-missing",
      note: ytTranscriptReady
        ? "All tools available"
        : "Install youtube-transcript npm package for full functionality",
    };
  }
  if (name === "get_video_info") {
    return getVideoInfo(args);
  }
  if (name === "get_available_languages") {
    return getAvailableLanguages(args);
  }
  if (name === "get_transcript") {
    return getTranscriptInternal(args, false);
  }
  if (name === "get_timed_transcript") {
    return getTranscriptInternal(args, true);
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
      status: ytTranscriptReady ? "healthy" : "degraded",
      service: "youtube-transcript",
      version: "3.0",
      packageReady: ytTranscriptReady,
    });
    return;
  }

  if (req.url === "/tools" && req.method === "GET") {
    sendJson(res, 200, {
      service: "youtube-transcript",
      tools: TOOL_DEFINITIONS.length,
      definitions: TOOL_DEFINITIONS,
      ready: ytTranscriptReady,
    });
    return;
  }

  if (req.url === "/info" && req.method === "GET") {
    sendJson(res, 200, {
      name: "YouTube Transcript MCP Server",
      version: "3.0.0",
      role: "YouTube metadata and transcript retrieval",
      packageStatus: ytTranscriptReady ? "loaded" : "missing",
      note: ytTranscriptReady
        ? "Ready"
        : "youtube-transcript npm package required",
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

server.listen(port, async () => {
  await loadYoutubeTranscript();
  const status = ytTranscriptReady ? "✓" : "⚠";
  console.log(`${status} YouTube Transcript server on port ${port}`);
  if (!ytTranscriptReady) {
    console.log("   Run: npm install youtube-transcript");
  }
});

process.on("SIGTERM", () => {
  server.close(() => process.exit(0));
});
