import type { Metadata } from "next";
import type { ServicePageData } from "@/types/sections";

interface StandardPageMetadataOptions {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  openGraphTitle?: string;
  openGraphDescription?: string;
}

export function createStandardPageMetadata({
  title,
  description,
  path,
  keywords,
  openGraphTitle,
  openGraphDescription,
}: StandardPageMetadataOptions): Metadata {
  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: openGraphTitle ?? title,
      description: openGraphDescription ?? description,
      url: path,
      type: "website",
    },
  };
}

export function createServicePageMetadata(data: ServicePageData): Metadata {
  return createStandardPageMetadata({
    title: data.meta.title,
    description: data.meta.description,
    keywords: data.meta.keywords,
    path: `/services/${data.slug}`,
  });
}
