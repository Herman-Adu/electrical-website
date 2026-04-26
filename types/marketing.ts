export type MarketingIconName =
  | "Zap"
  | "Home"
  | "Building2"
  | "Factory"
  | "ShieldCheck"
  | "Clock"
  | "Award"
  | "Phone"
  | "ArrowRight"
  | "AlertTriangle"
  | "Wrench"
  | "Lightbulb"
  | "Cable"
  | "Gauge"
  | "Mail"
  | "MessageSquare"
  | "Shield";

export interface MarketingCta {
  label: string;
  href: string;
  icon: MarketingIconName;
}

export interface MarketingActionCta extends MarketingCta {
  variant: "primary" | "outline";
}

export interface MarketingHomeContent {
  hero: {
    badge: {
      icon: MarketingIconName;
      text: string;
    };
    title: string;
    description: string;
    primaryCta: MarketingCta;
    secondaryCta: MarketingCta;
  };
  servicesOverview: {
    title: string;
    description: string;
    items: Array<{
      title: string;
      description: string;
      icon: MarketingIconName;
    }>;
    cta: MarketingCta;
  };
  trustIndicators: {
    items: Array<{
      value: string;
      label: string;
      icon: MarketingIconName;
    }>;
  };
  cta: {
    title: string;
    description: string;
    actions: MarketingActionCta[];
  };
}

export interface MarketingServicesContent {
  hero: {
    badge: {
      icon: MarketingIconName;
      text: string;
    };
    title: string;
    description: string;
    primaryCta: MarketingCta;
    secondaryCta: MarketingCta;
  };
  services: Array<{
    icon: MarketingIconName;
    title: string;
    description: string;
    features: string[];
  }>;
  servicesSection: {
    title: string;
    description: string;
  };
  specializations: Array<{
    icon: MarketingIconName;
    label: string;
  }>;
  certifications: Array<{
    title: string;
    description: string;
  }>;
  whyChooseUs: {
    title: string;
    description: string;
  };
  trustIndicators: Array<{
    value: string;
    label: string;
    icon: MarketingIconName;
  }>;
  requestForm: {
    title: string;
    description: string;
  };
  finalCta: {
    title: string;
    description: string;
    primaryCta: {
      label: string;
      href: string;
    };
  };
}

export interface MarketingQuotationContent {
  header: {
    title: string;
    description: string;
  };
  trustIndicators: Array<{
    icon: MarketingIconName;
    title: string;
    description: string;
  }>;
  faq: {
    title: string;
    items: Array<{
      question: string;
      answer: string;
    }>;
  };
}

export interface MarketingContactContent {
  hero: {
    badge: {
      icon: MarketingIconName;
      text: string;
    };
    title: string;
    description: string;
  };
  trustIndicators: Array<{
    icon: MarketingIconName;
    title: string;
    description: string;
  }>;
  faqTeaser: {
    title: string;
    description: string;
    items: Array<{
      question: string;
      answer: string;
    }>;
  };
}
