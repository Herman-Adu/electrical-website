/**
 * Robust MCP Client Wrapper
 *
 * Handles:
 * - JSON parsing errors with recovery
 * - Malformed responses (HTML mixed with JSON, encoding issues)
 * - Retry logic with exponential backoff
 * - Response validation and sanitization
 * - Comprehensive error logging
 */

import type { MCPClientFunction, MCPClientPingFunction } from "../types/mcp";

export interface ClientWrapperOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  allowFailOpen?: boolean; // If true, return empty object on final failure instead of throwing
}

const DEFAULT_OPTIONS: Required<ClientWrapperOptions> = {
  maxRetries: 3,
  initialDelayMs: 100,
  maxDelayMs: 2000,
  allowFailOpen: false,
};

/**
 * Extract valid JSON from potentially corrupted response strings
 * Handles: HTML mixed in, multiple JSON objects, encoding artifacts
 */
function extractValidJSON(text: string, position: number = 0): unknown {
  const trimmed = text.slice(position).trim();

  // Try direct parse first
  try {
    return JSON.parse(trimmed);
  } catch {
    // Fallback: extract first valid JSON object/array
  }

  // Try to find and extract first { ... } or [ ... ]
  for (let i = 0; i < trimmed.length; i++) {
    const char = trimmed[i];
    if (char === "{" || char === "[") {
      const isObject = char === "{";
      const closeChar = isObject ? "}" : "]";
      let depth = 1;
      let j = i + 1;

      while (j < trimmed.length && depth > 0) {
        if (trimmed[j] === (isObject ? "{" : "[")) depth++;
        else if (trimmed[j] === closeChar) depth--;
        j++;
      }

      if (depth === 0) {
        try {
          const extracted = trimmed.slice(i, j);
          return JSON.parse(extracted);
        } catch {
          // Continue searching
        }
      }
    }
  }

  throw new Error(
    `No valid JSON found in response. First 200 chars: ${trimmed.slice(0, 200)}`,
  );
}

/**
 * Extract MCP result from various response formats
 */
function extractMCPResult(parsed: unknown): unknown {
  if (!parsed || typeof parsed !== "object") {
    return parsed;
  }

  const obj = parsed as Record<string, unknown>;

  // Standard MCP response
  if (obj["ok"] === true && "result" in obj) {
    return obj["result"];
  }

  // Alternative format: direct result field
  if ("result" in obj) {
    return obj["result"];
  }

  // Content array (text response)
  if (Array.isArray(obj["content"])) {
    // Try JSON part first
    const jsonPart = (obj["content"] as Array<unknown>).find(
      (p) =>
        p &&
        typeof p === "object" &&
        (p as Record<string, unknown>)["type"] === "json" &&
        "json" in (p as Record<string, unknown>),
    );
    if (jsonPart) {
      return (jsonPart as Record<string, unknown>)["json"];
    }

    // Try text part
    const textPart = (obj["content"] as Array<unknown>).find(
      (p) =>
        p &&
        typeof p === "object" &&
        (p as Record<string, unknown>)["type"] === "text" &&
        typeof (p as Record<string, unknown>)["text"] === "string",
    );
    if (textPart) {
      return (textPart as Record<string, unknown>)["text"];
    }
  }

  // If nothing matched, return original object
  return obj;
}

/**
 * Validate HTTP response before processing
 */
function validateHTTPResponse(status: number, contentType: string): void {
  if (status >= 400) {
    throw new Error(`HTTP ${status}: Server returned error status`);
  }

  // Warn if content-type is unexpected
  if (contentType && !contentType.includes("application/json")) {
    console.warn(
      `[MCP] Unexpected Content-Type: ${contentType} (expected application/json)`,
    );
  }
}

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Create wrapped MCP client with robust error handling
 */
export function createRobustMCPClient(
  baseClient: MCPClientFunction,
  options: ClientWrapperOptions = {},
): MCPClientFunction {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  return async (
    serverId: string,
    tool: string,
    args?: Record<string, unknown>,
  ) => {
    let lastError: Error | null = null;
    let delay = opts.initialDelayMs;

    for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          console.error(
            `[MCP] Retry ${attempt}/${opts.maxRetries} for ${serverId}/${tool} after ${delay}ms`,
          );
          await sleep(delay);
          delay = Math.min(delay * 2, opts.maxDelayMs);
        }

        const result = await baseClient(serverId, tool, args);
        return result;
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        console.error(
          `[MCP] Attempt ${attempt + 1}/${opts.maxRetries + 1} failed:`,
          lastError.message,
        );

        // Don't retry on non-transient errors
        if (
          lastError.message.includes("No docker-gateway route") ||
          lastError.message.includes("ECONNREFUSED")
        ) {
          break;
        }

        // Last attempt failed
        if (attempt === opts.maxRetries) {
          break;
        }
      }
    }

    // All retries exhausted
    if (opts.allowFailOpen) {
      console.warn(
        `[MCP] FAIL-OPEN: Returning empty object for ${serverId}/${tool}`,
      );
      return {};
    }

    throw lastError || new Error("MCP client failed after all retries");
  };
}

/**
 * Create wrapped MCP ping function with robust error handling
 */
export function createRobustMCPPing(
  basePing: MCPClientPingFunction,
  options: ClientWrapperOptions = {},
): MCPClientPingFunction {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  return async (serverId: string, timeoutMs: number) => {
    let lastError: Error | null = null;
    let delay = opts.initialDelayMs;

    for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          await sleep(Math.min(delay, timeoutMs / 2));
          delay = Math.min(delay * 2, opts.maxDelayMs);
        }

        const latency = await basePing(serverId, timeoutMs);
        return latency;
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        if (attempt === opts.maxRetries) break;
      }
    }

    throw lastError || new Error("Ping failed after all retries");
  };
}

/**
 * Utility to create safe gateway caller with JSON parsing recovery
 */
export function createGatewayCallFunction(gatewayUrl: string) {
  return async function callGateway(
    route: string,
    tool: string,
    args: Record<string, unknown>,
  ): Promise<unknown> {
    const url = `${gatewayUrl}${route}/tools/call`;
    let rawText = "";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: tool, arguments: args ?? {} }),
      });

      rawText = await res.text();
      const contentType = res.headers.get("Content-Type") || "";

      // Validate response
      validateHTTPResponse(res.status, contentType);

      // Parse JSON with recovery
      const parsed = extractValidJSON(rawText);

      // Extract MCP result
      const result = extractMCPResult(parsed);

      if (result === undefined) {
        throw new Error(
          `MCP returned undefined result. Response: ${rawText.slice(0, 320)}`,
        );
      }

      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);

      throw new Error(
        `[MCP] ${route}/${tool} failed: ${message}\n` +
          `Response (first 400 chars): ${rawText.slice(0, 400)}`,
      );
    }
  };
}

export type { MCPClientFunction, MCPClientPingFunction } from "../types/mcp";
