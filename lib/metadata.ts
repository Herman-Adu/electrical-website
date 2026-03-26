import type { Metadata } from "next";
import type { ServicePageData } from "@/types/sections";

interface StandardPageMetadataOptions {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  openGraphTitle?: string;
  openGraphDescription?: string;
  ogImage?: string;
}

export function createStandardPageMetadata({
  title,
  description,
  path,
  keywords,
  openGraphTitle,
  openGraphDescription,
  ogImage,
}: StandardPageMetadataOptions): Metadata {
  const ogConfig: Record<string, any> = {
    title: openGraphTitle ?? title,
    description: openGraphDescription ?? description,
    url: path,
    type: "website",
  };

  if (ogImage) {
    ogConfig.images = [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: title,
      },
    ];
  }

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: path,
    },
    openGraph: ogConfig,
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
