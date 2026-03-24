import type { Metadata } from 'next';
import { emergencyPageData } from '@/data/services/emergency';
import { ServicePageRenderer } from '@/components/services';

export const metadata: Metadata = {
  title: emergencyPageData.meta.title,
  description: emergencyPageData.meta.description,
  keywords: emergencyPageData.meta.keywords,
};

export default function EmergencyPage() {
  return <ServicePageRenderer data={emergencyPageData} />;
}
