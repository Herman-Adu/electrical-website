import type { Metadata } from 'next';
import { industrialPageData } from '@/data/services/industrial';
import { ServicePageRenderer } from '@/components/services';

export const metadata: Metadata = {
  title: industrialPageData.meta.title,
  description: industrialPageData.meta.description,
  keywords: industrialPageData.meta.keywords,
};

export default function IndustrialPage() {
  return <ServicePageRenderer data={industrialPageData} />;
}
