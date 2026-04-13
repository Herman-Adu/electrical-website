"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

/**
 * Error boundary test fixture for the `/services` segment.
 *
 * This page exists solely to provide a controllable, non-destructive way to
 * exercise `app/services/error.tsx` during automated boundary verification.
 *
 * Behavior:
 *   - GET /services/error-test           → renders an informational message (safe in all envs)
 *   - GET /services/error-test?trigger=error → throws during render, activating the
 *                                              services segment error boundary
 *
 * The throw-path is only activated by an explicit query parameter, so production
 * traffic is never affected. The Playwright boundary test navigates to the
 * `?trigger=error` URL and asserts the recovery surface.
 */

function ErrorThrower() {
  const searchParams = useSearchParams();

  if (searchParams.get("trigger") === "error") {
    throw new Error(
      "[E2E] Intentional render error for services error boundary verification.",
    );
  }

  return (
    <main className="mx-auto flex min-h-[40vh] w-full max-w-4xl flex-col items-center justify-center px-4 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.24em] text-slate-500">
        Error Boundary Test Fixture
      </p>
      <h1 className="mt-4 text-2xl font-black uppercase tracking-tight text-white">
        Services Error Boundary Fixture
      </h1>
      <p className="mt-3 max-w-lg text-foreground/70">
        This route is a test fixture for automated boundary verification. Add{" "}
        <code className="rounded bg-slate-800 px-1 py-0.5 text-sm text-electric-cyan">
          ?trigger=error
        </code>{" "}
        to the URL to activate the error boundary.
      </p>
    </main>
  );
}

export default function ErrorTestPage() {
  return (
    <Suspense>
      <ErrorThrower />
    </Suspense>
  );
}
