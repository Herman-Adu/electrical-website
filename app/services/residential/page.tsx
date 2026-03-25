import type { Metadata } from "next";
import { residentialPageData } from "@/data/services/residential";
import { ServicePageRenderer } from "@/components/services";
import { createServicePageMetadata } from "@/lib/metadata";

export const metadata: Metadata =
  createServicePageMetadata(residentialPageData);

export default function ResidentialPage() {
  return <ServicePageRenderer data={residentialPageData} />;
}
