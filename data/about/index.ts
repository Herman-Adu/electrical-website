/**
 * About Page Data
 * Data-driven content for the About page sections
 * Designed for future CMS integration
 */

import type {
  SectionIntroData,
  SectionProfileData,
  SectionValuesData,
} from '@/types/sections';

// =============================================================================
// COMPANY INTRO DATA
// =============================================================================

export const companyIntroData: SectionIntroData = {
  sectionId: 'company-intro',
  label: 'Our Story',
  headlineWords: [
    'Powering',
    'London',
    '&',
    'the',
    'Home',
    'Counties',
    'with',
    'Gold-Standard',
    'Electrical',
    'Engineering',
    'Since',
    '2009.',
  ],
  leadParagraph:
    'What started as a one-man operation in South London has grown into a leading electrical contractor serving homes, businesses, and industrial clients across the capital and surrounding counties.',
  bodyParagraphs: [
    'Intact Electrical Innovations was founded with a simple belief: that electrical work should be done with integrity, precision, and pride. Over fifteen years, we\'ve built a reputation for delivering projects on time, within budget, and to standards that exceed expectations.',
    'Today, we employ a team of highly qualified electricians, apprentices, and project managers — all committed to the same founding principles. From small domestic repairs to large-scale industrial installations, we bring the same attention to detail and commitment to every job.',
  ],
  pillars: [
    {
      num: '01',
      title: 'Precision Engineering',
      description:
        'Every circuit, every connection, engineered to exacting standards with zero compromise on quality or safety.',
    },
    {
      num: '02',
      title: 'Community First',
      description:
        'We reinvest in the communities we serve — from apprenticeship programmes to charitable initiatives that power local growth.',
    },
    {
      num: '03',
      title: 'Trusted Partnership',
      description:
        'Our clients are partners. We communicate transparently, deliver consistently, and stand behind every job we complete.',
    },
  ],
};

// =============================================================================
// DIRECTOR PROFILES DATA
// =============================================================================

export const director1Data: SectionProfileData = {
  sectionId: 'directors',
  label: 'Leadership',
  name: 'Marcus Johnson',
  title: 'Managing Director & Master Electrician',
  credentials: ['NICEIC Approved', 'Part P Certified', 'IEE Member', '18th Edition'],
  bio: [
    "Marcus founded Intact Electrical Innovations in 2009 with a single van, a handful of tools, and an uncompromising belief that electrical work should be done right — every single time. What started as a domestic rewiring service in South London has grown into one of the region's most respected multi-disciplinary electrical contractors.",
    'With over 22 years of hands-on experience spanning domestic, commercial, and industrial sectors, Marcus brings rare depth of knowledge to every project. He holds a Master Electrician qualification and is a registered member of the Institution of Engineering and Technology.',
    'Beyond the business, Marcus is a passionate advocate for skills development in the electrical trade. He personally mentors apprentices and sits on the advisory board of two local colleges, helping shape the next generation of qualified electricians.',
  ],
  quote:
    "Integrity is not a policy. It's the only way I know how to work. Every circuit we wire, every panel we install — it has our name on it. That's not a responsibility I take lightly.",
  image: {
    src: '/images/director-1.jpg',
    alt: 'Marcus Johnson, Managing Director of Intact Electrical Innovations',
    priority: true,
  },
  socialLinks: [
    { platform: 'linkedin', url: 'https://linkedin.com' },
    { platform: 'email', url: 'mailto:marcus@intactelectrical.co.uk' },
  ],
  reversed: false,
};

export const director2Data: SectionProfileData = {
  sectionId: 'director-2',
  label: 'Leadership',
  name: 'David Clarke',
  title: 'Technical Director & Systems Engineer',
  credentials: ['ECS Gold Card', 'ISO 9001 Lead', 'IPAF Licensed', 'CHAS Accredited'],
  bio: [
    "David joined Marcus as a co-founder in the company's first year, bringing a background in industrial systems engineering and a meticulous approach to technical design. Together, they built the technical foundations that define Intact's reputation for precision and reliability.",
    "As Technical Director, David leads all engineering design, quality management, and compliance operations. His expertise in high-voltage systems and complex power distribution networks has been pivotal in expanding the company into industrial and large commercial projects.",
    "A qualified ISO 9001 Lead Auditor, David drives the company's commitment to continuous improvement and quality management — ensuring that every system we design and install meets not just minimum standards, but exceptional ones.",
  ],
  quote:
    "Technical excellence isn't just about knowing the regulations. It's about understanding why they exist — and then going further. Our clients deserve systems that are safe, efficient, and built to last a generation.",
  image: {
    src: '/images/director-2.jpg',
    alt: 'David Clarke, Technical Director of Intact Electrical Innovations',
    priority: false,
  },
  socialLinks: [
    { platform: 'linkedin', url: 'https://linkedin.com' },
    { platform: 'email', url: 'mailto:david@intactelectrical.co.uk' },
  ],
  reversed: true,
};

// =============================================================================
// CORE VALUES DATA
// =============================================================================

export const coreValuesData: SectionValuesData = {
  sectionId: 'core-values',
  label: 'How We Operate',
  headline: 'Our Core Values',
  headlineHighlight: 'Core Values',
  description:
    'The principles that guide every decision, every interaction, and every project we undertake.',
  values: [
    {
      icon: 'Shield',
      title: 'Integrity',
      short: "We don't cut corners. Ever.",
      full: "Our reputation is built on doing the right thing — even when no one's looking. Transparent pricing, honest timelines, and work that stands the test of time.",
      color: 'cyan',
    },
    {
      icon: 'Award',
      title: 'Excellence',
      short: 'Gold standard, every time.',
      full: "We set our bar higher than the regulations require. From cable dressing to final inspection, every detail reflects our commitment to exceptional craftsmanship.",
      color: 'cyan',
    },
    {
      icon: 'Users',
      title: 'Teamwork',
      short: 'Our greatest asset is our people.',
      full: 'A culture of mutual respect, shared responsibility, and collective pride. When one of us succeeds, all of us succeed.',
      color: 'amber',
    },
    {
      icon: 'Lightbulb',
      title: 'Innovation',
      short: "We embrace tomorrow's technology today.",
      full: 'From smart systems to sustainable solutions, we actively invest in emerging electrical technology to deliver better, faster, and more efficient outcomes.',
      color: 'cyan',
    },
    {
      icon: 'Zap',
      title: 'Reliability',
      short: 'On time. On budget. Without compromise.',
      full: "We show up when we say we will, complete work when we commit to, and deliver within the agreed price. Reliability isn't a feature — it's our baseline.",
      color: 'amber',
    },
    {
      icon: 'Heart',
      title: 'Community',
      short: 'We give back to where we came from.',
      full: 'From apprenticeship programmes to local charity partnerships, we actively invest in the communities we serve — because success means nothing if it isn\'t shared.',
      color: 'cyan',
    },
  ],
  tagline: 'THESE ARE NOT JUST WORDS ON A WALL — THEY ARE HOW WE WORK.',
};

// =============================================================================
// ALL ABOUT DATA EXPORT
// =============================================================================

export const aboutPageData = {
  companyIntro: companyIntroData,
  director1: director1Data,
  director2: director2Data,
  coreValues: coreValuesData,
};
