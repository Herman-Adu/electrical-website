import type { Metadata } from 'next';
import { residentialPageData } from '@/data/services/residential';
import { ServicePageRenderer } from '@/components/services';

export const metadata: Metadata = {
  title: residentialPageData.meta.title,
  description: residentialPageData.meta.description,
  keywords: residentialPageData.meta.keywords,
};

export default function ResidentialPage() {
  return <ServicePageRenderer data={residentialPageData} />;
}
