interface DetailSectionHeadingProps {
  title: string;
  mono?: boolean;
}

export function DetailSectionHeading({ title, mono = false }: DetailSectionHeadingProps) {
  if (mono) {
    return (
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-linear-to-r from-electric-cyan/40 to-transparent" />
        <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-electric-cyan">{title}</h2>
        <div className="h-px flex-1 bg-linear-to-l from-electric-cyan/40 to-transparent" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="h-px flex-1 bg-linear-to-r from-electric-cyan/40 to-transparent" />
      <h2 className="text-2xl font-bold text-foreground">{title}</h2>
      <div className="h-px flex-1 bg-linear-to-l from-electric-cyan/40 to-transparent" />
    </div>
  );
}
