#!/usr/bin/env node
/* eslint-disable no-console */

const http = require("node:http");
const https = require("node:https");

const port = Number(process.env.PORT || 8000);
const MAX_BODY_BYTES = 1_048_576;
const MAX_FETCH_BYTES = 4_000_000;
const DEFAULT_LANGUAGE = "en";
const MAX_LANGUAGE_LENGTH = 32;
const LANGUAGE_TAG_PATTERN = /^[A-Za-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/;
const YOUTUBE_VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;
const USER_AGENT = "electrical-website-youtube-adapter/2.0";

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
  if (
    language.length === 0 ||
    language.length > MAX_LANGUAGE_LENGTH ||
    !LANGUAGE_TAG_PATTERN.test(language)
  ) {
    throw createError(
      "E_LANGUAGE_INVALID",
      "language must be a valid BCP 47 language tag",
    );
  }
  return language;
}

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

function fetchText(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https:") ? https : http;
    const req = client.request(
      url,
      {
        method: "GET",
        timeout: 12000,
        headers: {
          Accept: "text/html,application/json,application/xml;q=0.9,*/*;q=0.8",
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
                `YouTube upstream returned status ${res.statusCode}`,
                502,
              ),
            );
            return;
          }
          resolve(raw);
        });
      },
    );

    req.on("timeout", () => req.destroy(new Error("timeout")));
    req.on("error", (error) => {
      reject(
        createError(
          "E_UPSTREAM",
          error.message || "YouTube upstream request failed",
          502,
        ),
      );
    });
    req.end();
  });
}

function fetchJson(url) {
  return fetchText(url).then((raw) => {
    try {
      return JSON.parse(raw);
    } catch {
      throw createError(
        "E_UPSTREAM_JSON",
        "Upstream returned invalid JSON",
        502,
      );
    }
  });
}

function htmlDecode(text) {
  return String(text)
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_match, code) => String.fromCharCode(Number(code)));
}

function extractBalancedJson(source, marker) {
  const markerIndex = source.indexOf(marker);
  if (markerIndex === -1) {
    return null;
  }

  const startIndex = source.indexOf("{", markerIndex + marker.length);
  if (startIndex === -1) {
    return null;
  }

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = startIndex; index < source.length; index += 1) {
    const char = source[index];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
      continue;
    }

    if (char === "{") {
      depth += 1;
      continue;
    }

    if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return source.slice(startIndex, index + 1);
      }
    }
  }

  return null;
}

async function getWatchPage(videoId) {
  return fetchText(`https://www.youtube.com/watch?v=${videoId}&hl=en`);
}

async function getPlayerResponse(videoId) {
  const html = await getWatchPage(videoId);
  const jsonText =
    extractBalancedJson(html, "var ytInitialPlayerResponse =") ||
    extractBalancedJson(html, "ytInitialPlayerResponse =") ||
    extractBalancedJson(html, '"playerResponse":');

  if (!jsonText) {
    throw createError(
      "E_UPSTREAM_PARSE",
      "Unable to parse YouTube player response",
      502,
    );
  }

  try {
    return JSON.parse(jsonText);
  } catch {
    throw createError(
      "E_UPSTREAM_PARSE",
      "Unable to parse YouTube player response",
      502,
    );
  }
}

function selectCaptionTrack(playerResponse, preferredLanguage) {
  const tracks =
    playerResponse?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
  if (!Array.isArray(tracks) || tracks.length === 0) {
    throw createError(
      "E_CAPTIONS_UNAVAILABLE",
      "No transcript tracks are available for this video",
      404,
    );
  }

  const exact = tracks.find(
    (track) => track.languageCode === preferredLanguage,
  );
  if (exact) {
    return { track: exact, tracks };
  }

  const prefix = tracks.find((track) =>
    String(track.languageCode || "").startsWith(`${preferredLanguage}-`),
  );
  if (prefix) {
    return { track: prefix, tracks };
  }

  return { track: tracks[0], tracks };
}

function parseTranscriptXml(xml) {
  const segments = [];

  const classicRegex =
    /<text\s+start="([^"]+)"(?:\s+dur="([^"]+)")?[^>]*>([\s\S]*?)<\/text>/gu;
  let match = classicRegex.exec(xml);
  while (match) {
    const startSeconds = Number(match[1]);
    const durationSeconds = Number(match[2] || 0);
    const text = htmlDecode(match[3].replace(/<[^>]+>/g, ""))
      .replace(/\s+/g, " ")
      .trim();
    segments.push({
      startMs: Math.round(startSeconds * 1000),
      durationMs: Math.round(durationSeconds * 1000),
      text,
    });
    match = classicRegex.exec(xml);
  }

  if (segments.length > 0) {
    return segments.filter((segment) => segment.text.length > 0);
  }

  const srv3Regex =
    /<p\s+t="([^"]+)"(?:\s+d="([^"]+)")?[^>]*>([\s\S]*?)<\/p>/gu;
  match = srv3Regex.exec(xml);
  while (match) {
    const startMs = Number(match[1]);
    const durationMs = Number(match[2] || 0);
    const text = htmlDecode(match[3].replace(/<[^>]+>/g, " "))
      .replace(/\s+/g, " ")
      .trim();
    segments.push({
      startMs: Math.round(startMs),
      durationMs: Math.round(durationMs),
      text,
    });
    match = srv3Regex.exec(xml);
  }

  return segments.filter((segment) => segment.text.length > 0);
}

function extractCaptionsFromPlayerResponse(playerResponse) {
  const engagementPanels = playerResponse?.engagementPanels || [];
  for (const panel of engagementPanels) {
    const content = panel?.engagementPanelSectionListRenderer?.content;
    if (content?.structuredDescriptionContentRenderer?.items) {
      const items = content.structuredDescriptionContentRenderer.items;
      for (const item of items) {
        if (item?.videoDescriptionMusicSectionRenderer?.contents) {
          const text = item.videoDescriptionMusicSectionRenderer.contents
            .map(
              (c) =>
                c?.videoDescriptionMusicVideoRenderer?.title?.simpleText || "",
            )
            .join(" ");
          if (text) return [{ startMs: 0, durationMs: 0, text }];
        }
      }
    }
  }
  return [];
}

async function getVideoInfo(args) {
  const videoId = normalizeVideoSelector(args, ["videoId", "url"]);
  const playerResponse = await getPlayerResponse(videoId);
  const details = playerResponse?.videoDetails || {};
  const oembed = await fetchJson(
    `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${videoId}`)}&format=json`,
  );

  return {
    videoId,
    title: details.title || oembed.title || null,
    author: oembed.author_name || details.author || null,
    channelId: details.channelId || null,
    lengthSeconds: Number(details.lengthSeconds || 0),
    shortDescription: details.shortDescription || null,
    thumbnail: oembed.thumbnail_url || null,
    url: `https://www.youtube.com/watch?v=${videoId}`,
    captionsAvailable: Boolean(
      playerResponse?.captions?.playerCaptionsTracklistRenderer?.captionTracks
        ?.length,
    ),
  };
}

async function getAvailableLanguages(args) {
  const videoId = normalizeVideoSelector(args, ["videoId", "url"]);
  const playerResponse = await getPlayerResponse(videoId);
  const tracks =
    playerResponse?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
  if (!Array.isArray(tracks) || tracks.length === 0) {
    return { videoId, count: 0, languages: [] };
  }

  return {
    videoId,
    count: tracks.length,
    languages: tracks.map((track) => ({
      languageCode: track.languageCode || null,
      name: track.name?.simpleText || null,
      kind: track.kind || null,
      isTranslatable: Boolean(track.isTranslatable),
    })),
  };
}

async function getTranscriptInternal(args, timed) {
  const videoId = normalizeVideoSelector(args, ["videoId", "url", "language"]);
  const language = normalizeLanguage(args.language);
  const playerResponse = await getPlayerResponse(videoId);
  const { track, tracks } = selectCaptionTrack(playerResponse, language);

  if (!track || !track.baseUrl) {
    throw createError(
      "E_CAPTIONS_UNAVAILABLE",
      "No caption track URL available for this language",
      404,
      {
        videoId,
        language,
        trackCount: tracks.length,
      },
    );
  }

  // Construct URLs with proper parameters
  const baseUrl = track.baseUrl.split("&lang=")[0].split("?lang=")[0];
  const lang = track.languageCode || language;

  const transcriptUrls = [
    // Direct construction with srv3
    `${baseUrl}&lang=${lang}&fmt=srv3`,
    // Direct construction with default
    `${baseUrl}&lang=${lang}`,
    // With kind
    `${baseUrl}&lang=${lang}&kind=${track.kind || "asr"}`,
    // Original baseUrl
    track.baseUrl,
    // Try without language override
    baseUrl,
  ];

  let segments = [];
  const attempts = [];

  for (const url of transcriptUrls) {
    try {
      // Add extra headers for youtube requests
      const xml = await new Promise((resolve, reject) => {
        const client = url.startsWith("https:") ? https : http;
        const req = client.request(
          url,
          {
            method: "GET",
            timeout: 12000,
            headers: {
              Accept: "text/xml,application/xml,application/json",
              "User-Agent": USER_AGENT,
              Origin: "https://www.youtube.com",
              Referer: `https://www.youtube.com/watch?v=${videoId}`,
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
              if (
                (res.statusCode || 500) < 200 ||
                (res.statusCode || 500) >= 300
              ) {
                reject(new Error(`Status ${res.statusCode}`));
                return;
              }
              resolve(raw);
            });
          },
        );
        req.on("timeout", () => req.destroy(new Error("timeout")));
        req.on("error", reject);
        req.end();
      });

      const content = xml?.trim() || "";

      attempts.push({
        url: url.substring(0, 100) + "...",
        statusOk: true,
        length: content.length,
      });

      if (content.length > 0) {
        segments = parseTranscriptXml(xml);
        if (segments.length > 0) {
          break;
        }
      }
    } catch (err) {
      attempts.push({
        url: url.substring(0, 100) + "...",
        error: err.message,
        statusOk: false,
      });
      continue;
    }
  }

  if (segments.length === 0) {
    throw createError(
      "E_TRANSCRIPT_UNAVAILABLE",
      "YouTube transcript API is not returning caption data for this video - this may be due to YouTube's API restrictions or regional limitations",
      404,
      {
        videoId,
        language,
        trackCount: tracks.length,
        selectedLanguage: track.languageCode,
        tracks: tracks.map((t) => t.languageCode),
        debugInfo: {
          trackAvailable: !!track,
          baseUrlExists: !!track?.baseUrl,
          attempts: attempts.length,
          allEmpty: attempts.every((a) => !a.statusOk || a.length === 0),
        },
      },
    );
  }

  if (timed) {
    return {
      videoId,
      languageRequested: language,
      languageResolved: track.languageCode || language,
      availableLanguages: tracks.length,
      segments,
    };
  }

  return {
    videoId,
    languageRequested: language,
    languageResolved: track.languageCode || language,
    availableLanguages: tracks.length,
    transcript: segments
      .map((segment) => segment.text)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim(),
  };
}

async function callTool(name, args = {}) {
  if (name === "list_tools") {
    return {
      tools: TOOL_DEFINITIONS,
      validation: {
        bodySizeLimitBytes: MAX_BODY_BYTES,
        fetchSizeLimitBytes: MAX_FETCH_BYTES,
        selectorRule: "exactly one of videoId or url",
      },
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
      status: "healthy",
      service: "youtube-transcript",
      tools_call: true,
    });
    return;
  }

  if (req.url === "/tools" && req.method === "GET") {
    sendJson(res, 200, {
      service: "youtube-transcript",
      tools: TOOL_DEFINITIONS.length,
      definitions: TOOL_DEFINITIONS,
      examples: ["get_video_info", "get_available_languages", "get_transcript"],
      ready: true,
    });
    return;
  }

  if (req.url === "/info" && req.method === "GET") {
    sendJson(res, 200, {
      name: "YouTube Transcript MCP Server",
      version: "2.0.0",
      role: "YouTube metadata and transcript retrieval",
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
  console.log(`YouTube Transcript server on port ${port}`);
});

process.on("SIGTERM", () => {
  server.close(() => process.exit(0));
});
