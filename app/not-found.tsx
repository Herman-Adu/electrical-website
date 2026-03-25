import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-4xl flex-col items-center justify-center px-4 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.24em] text-slate-500">
        404 // Route Not Found
      </p>
      <h1 className="mt-4 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
        This Circuit Doesn&apos;t Exist
      </h1>
      <p className="mt-4 max-w-2xl text-slate-400">
        The page you requested is unavailable or has been moved. Return to a
        known route to continue.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="border border-electric-cyan/40 bg-electric-cyan/10 px-5 py-2.5 text-sm font-bold uppercase tracking-widest text-electric-cyan transition-colors hover:bg-electric-cyan/20"
        >
          Go Home
        </Link>
        <Link
          href="/services"
          className="border border-slate-700 px-5 py-2.5 text-sm font-bold uppercase tracking-widest text-slate-200 transition-colors hover:border-slate-500"
        >
          View Services
        </Link>
      </div>
    </main>
  );
}
