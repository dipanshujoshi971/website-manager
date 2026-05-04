export interface SiteContent {
  global: GlobalContent;
  home: HomeContent;
  ride: RideContent;
  drive: DriveContent;
  about: AboutContent;
  safety: SafetyContent;
  help: HelpContent;
}

export interface GlobalContent {
  siteName: string;
  tagline: string;
  logo: string;
  favicon?: string;
  navbar: {
    links: { to: string; label: string }[];
    ctaText: string;
    ctaLink: string;
  };
  footer: {
    description: string;
    socials: { platform: string; url: string }[];
    columns: { title: string; links: { to: string; label: string }[] }[];
    copyright: string;
  };
  seo: {
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
  };
  storeLinks: {
    appStore: string;
    playStore: string;
  };
  colors: {
    primary: string;
    primaryGlow: string;
  };
}

export interface StatItem {
  value: number;
  suffix: string;
  prefix?: string;
  label: string;
  decimals?: number;
}

export interface CardItem {
  icon: string;
  title: string;
  description: string;
}

export interface TestimonialItem {
  quote: string;
  name: string;
  city: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface HomeContent {
  seo: { title: string; description: string };
  hero: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    ctaPrimary: { text: string; link: string };
    ctaSecondary: { text: string; link: string };
    rating: string;
    ratingText: string;
    backgroundImage: string;
    phoneImage: string;
  };
  stats: StatItem[];
  howItWorks: {
    title: string;
    subtitle: string;
    steps: CardItem[];
  };
  whyUs: {
    title: string;
    subtitle: string;
    features: CardItem[];
  };
  cities: {
    title: string;
    subtitle: string;
    backgroundImage: string;
    list: string[];
  };
  download: {
    title: string;
    subtitle: string;
    image: string;
  };
  testimonials: {
    title: string;
    subtitle: string;
    items: TestimonialItem[];
  };
}

export interface RideContent {
  seo: { title: string; description: string };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    image: string;
  };
  stats: StatItem[];
  steps: {
    title: string;
    subtitle: string;
    items: CardItem[];
  };
  pricing: {
    title: string;
    subtitle: string;
    features: string[];
    estimate: {
      total: string;
      distance: string;
      breakdown: { label: string; value: string }[];
      disclaimer: string;
    };
  };
  lifestyle: {
    title: string;
    subtitle: string;
    image: string;
    features: CardItem[];
  };
  categories: {
    title: string;
    subtitle: string;
    items: { name: string; description: string; price: string }[];
  };
}

export interface DriveContent {
  seo: { title: string; description: string };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  stats: StatItem[];
  featured: {
    title: string;
    subtitle: string;
    image: string;
    features: CardItem[];
  };
  benefits: {
    title: string;
    items: CardItem[];
  };
  requirements: {
    title: string;
    subtitle: string;
    items: string[];
    image: string;
  };
  earnings: {
    title: string;
    subtitle: string;
    tiers: { hours: string; min: string; max: string }[];
  };
}

export interface AboutContent {
  seo: { title: string; description: string };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  mission: {
    title: string;
    body: string;
  };
  stats: StatItem[];
  team: {
    title: string;
    body: string;
    body2: string;
    image: string;
  };
  values: {
    title: string;
    items: CardItem[];
  };
  timeline: {
    title: string;
    items: { year: string; title: string; description: string }[];
  };
  cityBanner: {
    title: string;
    subtitle: string;
    image: string;
  };
  contact: {
    title: string;
    subtitle: string;
    emails: { label: string; email: string }[];
  };
}

export interface SafetyContent {
  seo: { title: string; description: string };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  stats: StatItem[];
  riderFeatures: {
    title: string;
    items: CardItem[];
  };
  driverFeatures: {
    title: string;
    items: CardItem[];
  };
  trust: {
    title: string;
    subtitle: string;
    badges: string[];
    image: string;
  };
  pillars: {
    title: string;
    subtitle: string;
    items: CardItem[];
  };
  emergency: {
    title: string;
    subtitle: string;
    image: string;
  };
}

export interface HelpContent {
  seo: { title: string; description: string };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  channels: CardItem[];
  riderFaqs: FaqItem[];
  driverFaqs: FaqItem[];
  support: {
    title: string;
    subtitle: string;
    image: string;
  };
}
