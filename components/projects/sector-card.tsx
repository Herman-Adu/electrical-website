import Link from "next/link";
import Image from "next/image";
import type { ProjectCategory } from "@/types/projects";

interface SectorCardProps {
  category: ProjectCategory;
  projectCount: number;
  recentProjectTitle: string;
  coverImageSrc: string;
  coverImageAlt: string;
}

export function SectorCard({
  category,
  projectCount,
  recentProjectTitle,
  coverImageSrc,
  coverImageAlt,
}: SectorCardProps) {
  return (
    <Link
      href={`/projects/category/${category.slug}`}
      className="group relative flex h-64 flex-col justify-end overflow-hidden rounded-xl sm:h-72"
    >
      <Image
        src={coverImageSrc}
        alt={coverImageAlt}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="relative z-10 p-5">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-white">{category.label}</h2>
          <span className="rounded-full bg-cyan-400 px-2 py-0.5 text-xs font-semibold text-black">
            {projectCount}
          </span>
        </div>
        <p className="mt-1 text-sm text-white/70 line-clamp-1">
          {recentProjectTitle}
        </p>
        <p className="mt-2 text-xs font-medium text-cyan-400">
          View {projectCount} project{projectCount !== 1 ? "s" : ""} →
        </p>
      </div>
    </Link>
  );
}
