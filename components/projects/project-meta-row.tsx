import { cn } from "@/lib/utils";

interface ProjectMetaRowProps {
  label: string;
  value: string;
  className?: string;
}

export function ProjectMetaRow({
  label,
  value,
  className,
}: ProjectMetaRowProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between border-b border-border/40 py-2",
        className,
      )}
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </span>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
  );
}
