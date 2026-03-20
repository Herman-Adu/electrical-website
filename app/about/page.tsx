import { Metadata } from 'next';
import { Footer } from '@/components/sections';
import {
  AboutHero,
  CompanyIntro,
  DirectorProfile,
  CompanyTimeline,
  PeaceOfMind,
  VisionMission,
  Certifications,
  CoreValues,
  CommunitySection,
  AboutCTA,
} from '@/components/about';

export const metadata: Metadata = {
  title: 'About Us | Intact Electrical Innovations',
  description:
    'Meet the team behind Intact Electrical Innovations. NICEIC Approved Contractors delivering gold-standard electrical engineering across London and the Home Counties since 2009.',
  openGraph: {
    title: 'About Intact Electrical Innovations',
    description:
      'Gold-standard electrical engineering, community commitment, and 15 years of excellence.',
    type: 'website',
  },
};

const director1 = {
  name: 'Marcus Johnson',
  title: 'Managing Director & Master Electrician',
  credentials: ['NICEIC Approved', 'Part P Certified', 'IEE Member', '18th Edition'],
  bio: [
    'Marcus founded Intact Electrical Innovations in 2009 with a single van, a handful of tools, and an uncompromising belief that electrical work should be done right — every single time. What started as a domestic rewiring service in South London has grown into one of the region\'s most respected multi-disciplinary electrical contractors.',
    'With over 22 years of hands-on experience spanning domestic, commercial, and industrial sectors, Marcus brings rare depth of knowledge to every project. He holds a Master Electrician qualification and is a registered member of the Institution of Engineering and Technology.',
    'Beyond the business, Marcus is a passionate advocate for skills development in the electrical trade. He personally mentors apprentices and sits on the advisory board of two local colleges, helping shape the next generation of qualified electricians.',
  ],
  quote: 'Integrity is not a policy. It\'s the only way I know how to work. Every circuit we wire, every panel we install — it has our name on it. That\'s not a responsibility I take lightly.',
  imageSrc: '/images/director-1.jpg',
  imageAlt: 'Marcus Johnson, Managing Director of Intact Electrical Innovations',
  socialLinks: [
    { platform: 'linkedin' as const, url: 'https://linkedin.com' },
    { platform: 'email' as const, url: 'mailto:marcus@intactelectrical.co.uk' },
  ],
};

const director2 = {
  name: 'David Clarke',
  title: 'Technical Director & Systems Engineer',
  credentials: ['ECS Gold Card', 'ISO 9001 Lead', 'IPAF Licensed', 'CHAS Accredited'],
  bio: [
    'David joined Marcus as a co-founder in the company\'s first year, bringing a background in industrial systems engineering and a meticulous approach to technical design. Together, they built the technical foundations that define Intact\'s reputation for precision and reliability.',
    'As Technical Director, David leads all engineering design, quality management, and compliance operations. His expertise in high-voltage systems and complex power distribution networks has been pivotal in expanding the company into industrial and large commercial projects.',
    'A qualified ISO 9001 Lead Auditor, David drives the company\'s commitment to continuous improvement and quality management — ensuring that every system we design and install meets not just minimum standards, but exceptional ones.',
  ],
  quote: 'Technical excellence isn\'t just about knowing the regulations. It\'s about understanding why they exist — and then going further. Our clients deserve systems that are safe, efficient, and built to last a generation.',
  imageSrc: '/images/director-2.jpg',
  imageAlt: 'David Clarke, Technical Director of Intact Electrical Innovations',
  socialLinks: [
    { platform: 'linkedin' as const, url: 'https://linkedin.com' },
    { platform: 'email' as const, url: 'mailto:david@intactelectrical.co.uk' },
  ],
};

export default function AboutPage() {
  return (
    <main className="relative">
      {/* Section 1: Cinematic Hero */}
      <AboutHero />

      {/* Section 2: Company Introduction */}
      <CompanyIntro />

      {/* Section 3: Director 1 — Image left, text right */}
      <DirectorProfile {...director1} sectionId="directors" />

      {/* Section 4: Director 2 — Text left, image right (reversed) */}
      <DirectorProfile {...director2} reversed sectionId="director-2" />

      {/* Section 5: Company History Timeline */}
      <CompanyTimeline />

      {/* Section 6: Peace of Mind Guaranteed */}
      <PeaceOfMind />

      {/* Section 7 & 8: Vision & Mission */}
      <VisionMission />

      {/* Section 9: Certifications Bento Grid */}
      <Certifications />

      {/* Section 10: Core Values */}
      <CoreValues />

      {/* Section 11: Community Section */}
      <CommunitySection />

      {/* Section 12: Why Choose Us + Social + CTA */}
      <AboutCTA />

      {/* Footer */}
      <Footer />
    </main>
  );
}
