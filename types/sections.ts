/**
 * Shared Section Component Types
 * Data-driven interfaces for reusable section components
 * Designed for TypeScript safety and future Strapi CMS integration
 */

// =============================================================================
// COMMON TYPES
// =============================================================================

export type IconName =
  | 'Shield'
  | 'Clock'
  | 'Award'
  | 'ThumbsUp'
  | 'CheckCircle'
  | 'Zap'
  | 'Building2'
  | 'Factory'
  | 'Home'
  | 'Lightbulb'
  | 'Wifi'
  | 'Wrench'
  | 'Phone'
  | 'AlertTriangle'
  | 'Battery'
  | 'Plug'
  | 'Settings'
  | 'Gauge'
  | 'ClipboardCheck'
  | 'Users'
  | 'Heart'
  | 'Star'
  | 'Activity'
  | 'BookOpen';

export type AccentColor = 'cyan' | 'amber';

export interface ImageData {
  src: string;
  alt: string;
  priority?: boolean;
}

export interface CTAData {
  label: string;
  href: string;
  variant?: 'primary' | 'secondary' | 'outline';
}

export interface SocialLink {
  platform: 'linkedin' | 'twitter' | 'email' | 'facebook' | 'instagram' | 'youtube';
  url: string;
  handle?: string;
}

// =============================================================================
// SECTION HERO
// =============================================================================

export interface SectionHeroStat {
  value: string;
  label: string;
}

export interface SectionHeroData {
  /** Optional status text that animates through states */
  statusSequence?: string[];
  /** Eyebrow text above headline */
  eyebrow?: string;
  /** Main headline - can include line breaks with array */
  headline: string | string[];
  /** Highlighted/gradient portion of headline */
  headlineHighlight?: string;
  /** Subheadline paragraph */
  subheadline: string;
  /** Stats bar below subheadline */
  stats?: SectionHeroStat[];
  /** Technical metadata tags */
  metadata?: string[];
  /** Scroll target section ID */
  scrollTargetId?: string;
  /** Scroll button label */
  scrollLabel?: string;
  /** Background image (optional - uses BlueprintBackground if not provided) */
  backgroundImage?: ImageData;
}

// =============================================================================
// SECTION INTRO
// =============================================================================

export interface SectionIntroPillar {
  num: string;
  title: string;
  description: string;
}

export interface SectionIntroData {
  sectionId?: string;
  /** Section label (e.g., "Our Story") */
  label: string;
  /** Animated headline words (each word animates in sequence) */
  headlineWords?: string[];
  /** Or static headline if not animated */
  headline?: string;
  /** First paragraph below headline */
  leadParagraph: string;
  /** Two-column paragraphs */
  bodyParagraphs?: string[];
  /** Three pillar cards */
  pillars?: SectionIntroPillar[];
}

// =============================================================================
// SECTION PROFILE (Based on DirectorProfile)
// =============================================================================

export interface SectionProfileData {
  sectionId?: string;
  /** Section label (e.g., "Leadership", "Commercial Installations") */
  label: string;
  /** Name or title of the profile/service */
  name: string;
  /** Subtitle or role */
  title?: string;
  /** Credential badges */
  credentials?: string[];
  /** Bio paragraphs */
  bio: string[];
  /** Featured quote */
  quote?: string;
  /** Quote attribution (defaults to name if not provided) */
  quoteAttribution?: string;
  /** Main image */
  image: ImageData;
  /** Social links (optional) */
  socialLinks?: SocialLink[];
  /** Reverse layout (image on right) */
  reversed?: boolean;
  /** CTA button */
  cta?: CTAData;
}

// =============================================================================
// SECTION FEATURES (Based on PeaceOfMind)
// =============================================================================

export interface SectionFeaturePillar {
  icon: IconName;
  title: string;
  description: string;
  highlight?: boolean;
}

export interface SectionFeaturePartner {
  name: string;
  abbr: string;
}

export interface SectionFeaturesData {
  sectionId?: string;
  /** Section label */
  label: string;
  /** Headline - can include highlighted text */
  headline: string;
  /** Highlighted portion of headline */
  headlineHighlight?: string;
  /** Description paragraph */
  description: string;
  /** Feature pillars (typically 4) */
  pillars: SectionFeaturePillar[];
  /** Checklist items */
  checklist?: string[];
  /** Partner/accreditation logos */
  partners?: SectionFeaturePartner[];
  /** Background variant */
  background?: 'default' | 'dark';
}

// =============================================================================
// SECTION VALUES (Based on CoreValues)
// =============================================================================

export interface SectionValue {
  icon: IconName;
  title: string;
  short: string;
  full: string;
  color?: AccentColor;
}

export interface SectionValuesData {
  sectionId?: string;
  /** Section label */
  label: string;
  /** Headline */
  headline: string;
  /** Highlighted portion of headline */
  headlineHighlight?: string;
  /** Description */
  description: string;
  /** Value cards (typically 6) */
  values: SectionValue[];
  /** Tagline at bottom */
  tagline?: string;
}

// =============================================================================
// SECTION CTA (Based on AboutCTA)
// =============================================================================

export interface SectionCTAArticle {
  tag: string;
  title: string;
  excerpt: string;
  readTime: string;
  href?: string;
}

export interface SectionCTAData {
  sectionId?: string;
  /** "Why Choose" section */
  whyChoose?: {
    label: string;
    headline: string;
    headlineHighlight?: string;
    description: string;
    points: string[];
  };
  /** Featured article card */
  article?: SectionCTAArticle;
  /** Social links section */
  socials?: {
    label: string;
    headline: string;
    links: (SocialLink & { handle: string })[];
  };
  /** Final CTA block */
  finalCTA: {
    label: string;
    headline: string;
    headlineHighlight?: string;
    description: string;
    primaryCTA: CTAData;
    secondaryCTA?: CTAData;
  };
}

// =============================================================================
// PAGE DATA STRUCTURES
// =============================================================================

export type SectionType = 'hero' | 'intro' | 'profile' | 'features' | 'values' | 'cta';

export interface PageSection {
  type: SectionType;
  data: SectionHeroData | SectionIntroData | SectionProfileData | SectionFeaturesData | SectionValuesData | SectionCTAData;
}

export interface ServicePageData {
  slug: string;
  meta: {
    title: string;
    description: string;
    keywords?: string[];
  };
  hero: SectionHeroData;
  intro?: SectionIntroData;
  sections: PageSection[];
}

export interface AboutPageData {
  meta: {
    title: string;
    description: string;
  };
  hero: SectionHeroData;
  sections: PageSection[];
}
