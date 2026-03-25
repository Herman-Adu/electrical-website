import type { Metadata } from "next";
import { emergencyPageData } from "@/data/services/emergency";
import { ServicePageRenderer } from "@/components/services";
import { createServicePageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createServicePageMetadata(emergencyPageData);

export default function EmergencyPage() {
  return <ServicePageRenderer data={emergencyPageData} />;
}
