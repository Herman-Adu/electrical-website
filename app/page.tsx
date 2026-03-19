import { Hero } from '@/components/hero';
import { Services, Features, Schematic, Dashboard, Footer } from '@/components/sections';
import { Illumination } from '@/components/sections/illumination';
import { SmartLiving } from '@/components/sections/smart-living';

export default function Home() {
  return (
    <main className="relative">
      {/* Hero Section with animated electrical grid */}
      <Hero />
      
      {/* Core Services Grid */}
      <Services />
      
      {/* Illumination Reveal - Industrial Showcase */}
      <Illumination />
      
      {/* Animated Feature Cards */}
      <Features />
      
      {/* Schematic Architecture Section */}
      <Schematic />
      
      {/* Live Dashboard with metrics */}
      <Dashboard />
      
      {/* Smart Living - Residential Showcase */}
      <SmartLiving />
      
      {/* Footer */}
      <Footer />
    </main>
  );
}
