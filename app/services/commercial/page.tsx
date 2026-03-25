import type { Metadata } from "next";
import { commercialPageData } from "@/data/services/commercial";
import { ServicePageRenderer } from "@/components/services";
import { createServicePageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createServicePageMetadata(commercialPageData);

export default function CommercialPage() {
  return <ServicePageRenderer data={commercialPageData} />;
}
