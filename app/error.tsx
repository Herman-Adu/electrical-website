"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

/**
 * Global Error Boundary
 * Captures and logs errors to Sentry while providing fallback UI
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to Sentry
    if (error) {
      Sentry.captureException(error, {
        contexts: {
          react: {
            componentStack: error.stack || "No stack trace",
          },
        },
      });
    }
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 py-12">
      <div className="max-w-md text-center">
        <h1 className="mb-2 text-3xl font-bold">Oops!</h1>
        <p className="mb-6 text-neutral-600 dark:text-neutral-400">
          Something went wrong. Our team has been notified and we're working to
          fix it.
        </p>
        <button
          onClick={reset}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Try again
        </button>
      </div>
      {error.digest && (
        <p className="text-xs text-neutral-500">Error ID: {error.digest}</p>
      )}
    </div>
  );
}
