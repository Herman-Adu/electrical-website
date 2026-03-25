export default function ServicesLoading() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="animate-pulse space-y-6">
        <div className="h-3 w-44 bg-slate-800" />
        <div className="h-10 w-2/3 max-w-xl bg-slate-800" />
        <div className="h-4 w-full max-w-3xl bg-slate-800" />
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="h-52 border border-slate-800 bg-deep-slate/50 animate-pulse" />
        <div className="h-52 border border-slate-800 bg-deep-slate/50 animate-pulse" />
        <div className="h-52 border border-slate-800 bg-deep-slate/50 animate-pulse" />
      </div>
    </main>
  );
}
