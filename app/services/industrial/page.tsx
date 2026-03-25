import type { Metadata } from "next";
import { industrialPageData } from "@/data/services/industrial";
import { ServicePageRenderer } from "@/components/services";
import { createServicePageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createServicePageMetadata(industrialPageData);

export default function IndustrialPage() {
  return <ServicePageRenderer data={industrialPageData} />;
}
