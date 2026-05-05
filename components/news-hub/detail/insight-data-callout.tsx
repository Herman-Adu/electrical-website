interface InsightDataCalloutProps {
  text: string;
  eyebrow?: string;
}

export function InsightDataCallout({ text, eyebrow }: InsightDataCalloutProps) {
  return (
    <blockquote className="border-l-4 border-l-electric-cyan bg-electric-cyan/5 px-6 py-5">
      {eyebrow && (
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-electric-cyan">
          {eyebrow}
        </p>
      )}
      <p className="text-lg italic text-foreground/90">{text}</p>
    </blockquote>
  );
}
