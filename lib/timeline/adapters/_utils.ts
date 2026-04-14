import { ZodError } from "zod";

export class TimelineAdapterError extends Error {
  readonly source: "company" | "project" | "news";

  constructor(source: "company" | "project" | "news", cause: unknown) {
    const message =
      cause instanceof ZodError
        ? `${source} timeline adapter validation failed: ${cause.issues
            .map(
              (issue) => `${issue.path.join(".") || "root"}: ${issue.message}`,
            )
            .join("; ")}`
        : `${source} timeline adapter validation failed`;

    super(message);
    this.name = "TimelineAdapterError";
    this.source = source;
    this.cause = cause;
  }
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
}

export function createTimelineId(
  source: "company" | "project" | "news",
  label: string,
  title: string,
  index: number,
): string {
  const safeLabel = slugify(label);
  const safeTitle = slugify(title);
  return `${source}-${safeLabel}-${safeTitle}-${index + 1}`;
}
