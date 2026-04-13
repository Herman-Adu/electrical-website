"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ServicesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[SERVICES_SEGMENT_ERROR]", error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[50vh] w-full max-w-5xl flex-col items-center justify-center px-4 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.24em] text-red-400/80">
        Services Segment Error
      </p>
      <h1 className="mt-4 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
        Unable to Load This Service View
      </h1>
      <p className="mt-4 max-w-2xl text-foreground/70">
        Something interrupted this route segment. Retry to recover, or return to
        the main services overview.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="border border-electric-cyan/40 bg-electric-cyan/10 px-5 py-2.5 text-sm font-bold uppercase tracking-widest text-electric-cyan transition-colors hover:bg-electric-cyan/20"
        >
          Retry
        </button>
        <Link
          href="/services"
          className="border border-slate-700 px-5 py-2.5 text-sm font-bold uppercase tracking-widest text-slate-200 transition-colors hover:border-slate-500"
        >
          Back to Services
        </Link>
      </div>
    </main>
  );
}
