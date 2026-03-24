import type { Metadata } from 'next';
import { commercialPageData } from '@/data/services/commercial';
import { ServicePageRenderer } from '@/components/services';

export const metadata: Metadata = {
  title: commercialPageData.meta.title,
  description: commercialPageData.meta.description,
  keywords: commercialPageData.meta.keywords,
};

export default function CommercialPage() {
  return <ServicePageRenderer data={commercialPageData} />;
}
