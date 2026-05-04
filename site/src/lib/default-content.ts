import type { SiteContent } from "./content-types";

export const defaultContent: SiteContent = {
  global: {
    siteName: "GoNex",
    tagline: "Ready to go? Let's GoNex.",
    logo: "/assets/gonex-logo.png",
    navbar: {
      links: [
        { to: "/ride", label: "Ride" },
        { to: "/drive", label: "Drive" },
        { to: "/safety", label: "Safety" },
        { to: "/help", label: "Help" },
        { to: "/about", label: "About Us" },
      ],
      ctaText: "Get the App",
      ctaLink: "/#download",
    },
    footer: {
      description: "Ready to go? Let's GoNex. Safe, affordable rides — wherever, whenever.",
      socials: [
        { platform: "instagram", url: "#" },
        { platform: "twitter", url: "#" },
        { platform: "linkedin", url: "#" },
      ],
      columns: [
        { title: "Company", links: [{ to: "/about", label: "About" }, { to: "/about", label: "Careers" }, { to: "/about", label: "Press" }] },
        { title: "Riders", links: [{ to: "/ride", label: "Ride" }, { to: "/safety", label: "Safety" }, { to: "/help", label: "Help" }] },
        { title: "Drivers", links: [{ to: "/drive", label: "Drive" }, { to: "/drive", label: "Earnings" }, { to: "/drive", label: "Requirements" }] },
      ],
      copyright: "© 2025 GoNex. All rights reserved.",
    },
    seo: {
      title: "GoNex — Ready to go? Let's GoNex.",
      description: "GoNex is a modern ride-hailing app. Request safe, affordable rides in seconds — available 24/7 on iOS and Android.",
      ogTitle: "GoNex — Ready to go? Let's GoNex.",
      ogDescription: "Safe, affordable rides on demand. Available on iOS and Android.",
    },
    storeLinks: {
      appStore: "#",
      playStore: "#",
    },
    colors: {
      primary: "#1A56DB",
      primaryGlow: "#60A5FA",
    },
  },

  home: {
    seo: {
      title: "GoNex — Ready to go? Let's GoNex.",
      description: "Request a ride in seconds. Safe, affordable, always on time. Download GoNex on iOS and Android.",
    },
    hero: {
      badge: "New rides every second",
      title: "Ready to go?",
      titleHighlight: "Let's GoNex.",
      subtitle: "Request a ride in seconds. Safe, affordable, and always on time — wherever you're headed.",
      ctaPrimary: { text: "Ride with GoNex", link: "/ride" },
      ctaSecondary: { text: "Become a Driver", link: "/drive" },
      rating: "4.9",
      ratingText: "Trusted by 2M+ riders",
      backgroundImage: "",
      phoneImage: "",
    },
    stats: [
      { value: 2, suffix: "M+", label: "Riders worldwide" },
      { value: 150, suffix: "K+", label: "Active drivers" },
      { value: 50, suffix: "+", label: "Cities served" },
      { value: 4.9, suffix: "★", label: "Average rating", decimals: 1 },
    ],
    howItWorks: {
      title: "How it works",
      subtitle: "Three steps to your destination.",
      steps: [
        { icon: "Smartphone", title: "Open the App", description: "Sign in and set your destination in seconds." },
        { icon: "MapPin", title: "Book Your Ride", description: "Pick the ride class that fits — see the price upfront." },
        { icon: "ShieldCheck", title: "Arrive Safely", description: "Track your driver in real time and ride with confidence." },
      ],
    },
    whyUs: {
      title: "Why GoNex",
      subtitle: "A smarter way to move through your city.",
      features: [
        { icon: "Zap", title: "Fast Pickup", description: "Average pickup under 4 minutes in supported cities." },
        { icon: "ShieldCheck", title: "Safe Rides", description: "Verified drivers, live tracking, and 24/7 support." },
        { icon: "Wallet", title: "Affordable Fares", description: "Upfront pricing with no hidden fees, ever." },
        { icon: "Headphones", title: "24/7 Support", description: "Real humans, ready when you need them." },
      ],
    },
    cities: {
      title: "Now in 50+ cities and growing fast",
      subtitle: "From neighborhood corners to international airports — GoNex meets you wherever the day takes you. New cities launching every month.",
      backgroundImage: "",
      list: ["New York", "Bengaluru", "Lisbon", "London", "Mumbai", "Berlin", "Toronto", "Singapore", "Sydney", "Dubai", "Paris", "Tokyo"],
    },
    download: {
      title: "GoNex is available on iOS and Android",
      subtitle: "Download the app and take your first ride in minutes. Smooth onboarding, transparent pricing, real-time tracking, and a tap-away emergency button keep every trip stress-free.",
      image: "",
    },
    testimonials: {
      title: "Loved by riders",
      subtitle: "Real stories from people who ride and drive with GoNex.",
      items: [
        { quote: "Pickup was 2 minutes. Driver was friendly. Best ride app I've used.", name: "Aanya R.", city: "Bengaluru" },
        { quote: "Transparent pricing finally. No surprises at the end of the trip.", name: "Marco S.", city: "Lisbon" },
        { quote: "I use GoNex for every airport run. Always on time.", name: "Priya K.", city: "Delhi" },
      ],
    },
  },

  ride: {
    seo: {
      title: "Ride with GoNex — Your ride, on demand",
      description: "Book a ride in seconds with GoNex. Choose Go, XL, or Premium with upfront pricing and real-time tracking.",
    },
    hero: {
      eyebrow: "For Riders",
      title: "Your ride, on demand.",
      subtitle: "Tap once. We'll do the rest. From quick crosstown trips to airport runs, GoNex gets you there fast — with upfront pricing and a driver you can trust.",
      image: "",
    },
    stats: [
      { value: 4, suffix: " min", label: "Avg. pickup time" },
      { value: 99, suffix: "%", label: "On-time arrivals" },
      { value: 24, suffix: "/7", label: "Support available" },
      { value: 0, suffix: "", prefix: "$", label: "Hidden fees" },
    ],
    steps: {
      title: "Booking is simple",
      subtitle: "Four taps and you're on your way.",
      items: [
        { icon: "Smartphone", title: "Open GoNex", description: "Launch the app — your map loads instantly." },
        { icon: "MapPin", title: "Set destination", description: "Drop a pin or search for any address." },
        { icon: "Car", title: "Pick a ride", description: "Compare options and confirm in one tap." },
        { icon: "CheckCircle2", title: "Enjoy the ride", description: "Track in real time and arrive safely." },
      ],
    },
    pricing: {
      title: "Know the fare before you ride",
      subtitle: "Every GoNex trip shows the exact price upfront — no surge surprises, no hidden fees. Promo codes and rider credits apply automatically at checkout.",
      features: [
        "Upfront pricing on every trip",
        "Apply promo codes instantly",
        "Multiple payment methods supported",
        "Tip your driver in-app",
        "Split fares with friends",
      ],
      estimate: {
        total: "$12.40",
        distance: "5.2 km • ~14 min",
        breakdown: [
          { label: "Base fare", value: "$3.00" },
          { label: "Distance", value: "$7.20" },
          { label: "Time", value: "$2.20" },
        ],
        disclaimer: "Sample estimate. Actual fares vary by city and demand.",
      },
    },
    lifestyle: {
      title: "Designed around your day",
      subtitle: "Whether you're commuting, catching a flight, or heading out with friends, GoNex adapts to your schedule. Schedule rides up to 30 days ahead, save your favorite places, and get there with a tap.",
      image: "",
      features: [
        { icon: "Clock", title: "Schedule in advance", description: "Book up to 30 days ahead." },
        { icon: "CreditCard", title: "All payment methods", description: "Cards, wallets, cash where supported." },
        { icon: "Users", title: "Group rides", description: "XL fits up to 6 with luggage." },
        { icon: "Sparkles", title: "Premium option", description: "Top-rated drivers and luxury cars." },
      ],
    },
    categories: {
      title: "Choose your ride",
      subtitle: "A class for every trip.",
      items: [
        { name: "GoNex Go", description: "Affordable everyday rides for 1–4 people. Perfect for short trips and daily commutes.", price: "from $4" },
        { name: "GoNex XL", description: "Spacious rides for groups up to 6 — extra room for luggage and friends.", price: "from $9" },
        { name: "GoNex Premium", description: "Top-rated drivers in luxury vehicles. The ride for special occasions and clients.", price: "from $15" },
      ],
    },
  },

  drive: {
    seo: {
      title: "Drive with GoNex — Earn on your terms",
      description: "Drive with GoNex. Flexible hours, weekly payouts, and full support. Start earning on your schedule.",
    },
    hero: {
      eyebrow: "For Drivers",
      title: "Drive with GoNex. Earn on your terms.",
      subtitle: "Set your own hours. Get paid weekly. Drive with a partner that has your back — no quotas, no pressure, just earnings on your schedule.",
    },
    stats: [
      { value: 150, suffix: "K+", label: "Active drivers" },
      { value: 28, suffix: "/hr", prefix: "$", label: "Avg. peak earnings" },
      { value: 7, suffix: " days", label: "Payout cycle" },
      { value: 100, suffix: "%", label: "Driver-owned tips" },
    ],
    featured: {
      title: "Meet drivers earning their way",
      subtitle: "Our drivers come from every walk of life — full-timers, students, parents, weekend hustlers. Whatever your goal, GoNex gives you the tools to hit it on your own schedule.",
      image: "",
      features: [
        { icon: "TrendingUp", title: "Surge boosts", description: "Earn more during peak hours." },
        { icon: "ShieldCheck", title: "On-trip insurance", description: "Coverage included on every trip." },
        { icon: "Car", title: "Vehicle rewards", description: "Discounts on fuel and maintenance." },
        { icon: "Headphones", title: "Driver hotline", description: "Talk to a real person, anytime." },
      ],
    },
    benefits: {
      title: "Why drive with GoNex",
      items: [
        { icon: "Clock", title: "Flexible Hours", description: "Drive when you want, as long as you want. No quotas, no pressure." },
        { icon: "Wallet", title: "Weekly Payouts", description: "Reliable, on-time deposits to your bank account every week — plus instant cash-out." },
        { icon: "Headphones", title: "Full Support", description: "Real-time help from a driver support team that actually cares." },
      ],
    },
    requirements: {
      title: "Requirements to drive",
      subtitle: "A simple checklist to get you on the road.",
      items: [
        "Valid driver's license (1+ year experience)",
        "Vehicle that meets local GoNex standards",
        "Active vehicle insurance and registration",
        "Pass a background and driving-history check",
        "Smartphone with iOS 13+ or Android 8+",
      ],
      image: "",
    },
    earnings: {
      title: "Estimate your earnings",
      subtitle: "Based on average active drivers in supported cities.",
      tiers: [
        { hours: "10 hrs / week", min: "$180", max: "$280" },
        { hours: "20 hrs / week", min: "$360", max: "$540" },
        { hours: "40 hrs / week", min: "$720", max: "$1,080" },
      ],
    },
  },

  about: {
    seo: {
      title: "About GoNex — Moving people forward",
      description: "GoNex is on a mission to make safe, affordable rides available to everyone. Learn our story and get in touch.",
    },
    hero: {
      eyebrow: "About Us",
      title: "Moving people forward.",
      subtitle: "GoNex exists to make every ride safer, fairer, and a little more delightful. We're rethinking the basics so getting around just works.",
    },
    mission: {
      title: "Our mission",
      body: "We believe great transportation should be available to everyone. GoNex is building a ride network where riders feel safe, drivers earn fairly, and every trip — short or long — feels effortless. We're rethinking the basics: pricing, support, safety, and trust, so the simple act of getting somewhere works the way it should.",
    },
    stats: [
      { value: 2, suffix: "M+", label: "Riders" },
      { value: 150, suffix: "K+", label: "Drivers" },
      { value: 50, suffix: "+", label: "Cities" },
      { value: 4, suffix: "", label: "Continents" },
    ],
    team: {
      title: "A team that rides too",
      body: "We're product designers, engineers, drivers, and city builders — united by the belief that moving through a city should never feel like a hassle. We test our own product every day.",
      body2: "Headquartered across three continents with hubs in Bengaluru, Lisbon, and Toronto, we ship fast and listen even faster.",
      image: "",
    },
    values: {
      title: "What we stand for",
      items: [
        { icon: "ShieldCheck", title: "Safety", description: "Every decision starts with the safety of our riders and drivers." },
        { icon: "Heart", title: "Reliability", description: "We show up. On time. Every time." },
        { icon: "Users", title: "Community", description: "We build with the cities and drivers we serve." },
        { icon: "Sparkles", title: "Innovation", description: "Constantly improving the experience of getting from A to B." },
      ],
    },
    timeline: {
      title: "How GoNex started",
      items: [
        { year: "2023", title: "The idea", description: "Two friends, one bad ride home, and a sketch of a better app." },
        { year: "2024", title: "First city", description: "GoNex launches in our home city with a small driver community." },
        { year: "2025", title: "Going wider", description: "Expanding to multiple cities with new ride classes and 24/7 support." },
        { year: "2026", title: "Going global", description: "Now serving 50+ cities across 4 continents — and just getting started." },
      ],
    },
    cityBanner: {
      title: "Built with the cities we serve",
      subtitle: "We work hand-in-hand with local drivers, regulators, and communities to build a ride network that respects every place we operate in.",
      image: "",
    },
    contact: {
      title: "Get in touch",
      subtitle: "Questions, feedback, partnership ideas — we'd love to hear from you. Drop us a message and our team will reply as soon as possible.",
      emails: [
        { label: "General", email: "hello@gonex.app" },
        { label: "Press", email: "press@gonex.app" },
        { label: "Partnerships", email: "partners@gonex.app" },
      ],
    },
  },

  safety: {
    seo: {
      title: "Safety — Your safety is our priority | GoNex",
      description: "Real-time GPS tracking, in-app emergency button, driver verification, and 24/7 incident support keep every GoNex ride safe.",
    },
    hero: {
      eyebrow: "Safety First",
      title: "Your safety is our priority.",
      subtitle: "Every GoNex ride is built around protecting you — before, during, and after the trip. Verified drivers, live tracking, and 24/7 incident response come standard.",
    },
    stats: [
      { value: 100, suffix: "%", label: "Drivers background-checked" },
      { value: 24, suffix: "/7", label: "Incident support" },
      { value: 99.9, suffix: "%", label: "Safe rides", decimals: 1 },
      { value: 60, suffix: "s", label: "Avg. response time" },
    ],
    riderFeatures: {
      title: "For Riders",
      items: [
        { icon: "MapPin", title: "Real-time GPS tracking", description: "Watch your trip move on the map from pickup to drop-off." },
        { icon: "BellRing", title: "In-app emergency button", description: "One tap connects you to local emergency services." },
        { icon: "Users", title: "Share your ride", description: "Send live trip status to trusted contacts in one tap." },
        { icon: "Lock", title: "Privacy by default", description: "Your phone number stays masked from drivers." },
        { icon: "Eye", title: "Anonymous feedback", description: "Rate trips and report issues without revealing your identity." },
      ],
    },
    driverFeatures: {
      title: "For Drivers",
      items: [
        { icon: "UserCheck", title: "Verified riders", description: "Every account is verified before the first trip." },
        { icon: "BellRing", title: "Emergency assistance", description: "Instant access to support and emergency services." },
        { icon: "PhoneCall", title: "24/7 incident support", description: "A real human, ready when something goes wrong." },
        { icon: "ShieldCheck", title: "Trip insurance coverage", description: "On-trip coverage backed by trusted partners." },
        { icon: "AlertTriangle", title: "Fatigue alerts", description: "Smart reminders to take a break on long shifts." },
      ],
    },
    trust: {
      title: "Trusted, verified, accountable",
      subtitle: "Every GoNex driver completes background and driving-history checks. Vehicles are inspected, and ratings are reviewed continuously to maintain the standard you expect.",
      badges: ["Background-checked", "Vehicle inspected", "Insured trips", "24/7 monitored"],
      image: "",
    },
    pillars: {
      title: "Built on three safety pillars",
      subtitle: "Prevention, protection, and rapid response — together on every trip.",
      items: [
        { icon: "ShieldCheck", title: "Prevention", description: "Identity checks, vehicle inspections, and continuous monitoring stop issues before they start." },
        { icon: "HeartPulse", title: "Protection", description: "Real-time tracking, ride sharing, and insurance keep you covered on every trip." },
        { icon: "PhoneCall", title: "Response", description: "A 24/7 incident team responds in under a minute, with direct lines to local services." },
      ],
    },
    emergency: {
      title: "Help is one tap away",
      subtitle: "The in-app emergency button shares your live location with our safety team and local responders. We stay on the line until you're safe.",
      image: "",
    },
  },

  help: {
    seo: {
      title: "Help & FAQ — We're here to help | GoNex",
      description: "Get answers to common questions about riding and driving with GoNex. 24/7 support whenever you need it.",
    },
    hero: {
      eyebrow: "Support",
      title: "We're here to help.",
      subtitle: "Find answers fast, or get in touch with our 24/7 team. We typically reply in under 5 minutes.",
    },
    channels: [
      { icon: "MessageCircle", title: "Live chat", description: "Chat with our team in the app, 24/7." },
      { icon: "Mail", title: "Email us", description: "support@gonex.app — replies within an hour." },
      { icon: "PhoneCall", title: "Emergency line", description: "Tap the SOS button in-app for instant help." },
    ],
    riderFaqs: [
      { question: "How do I cancel a ride?", answer: "Open the app, tap your active trip, then tap Cancel. Cancellations are free within 2 minutes of booking." },
      { question: "How are fares calculated?", answer: "Fares combine a base rate, distance, and time. You'll always see the upfront price before you confirm." },
      { question: "Can I schedule a ride in advance?", answer: "Yes — tap the calendar icon on the home screen to schedule a ride up to 30 days ahead." },
      { question: "How do I report an issue with a trip?", answer: "Open the trip in your history and tap Get Help. Our team responds 24/7." },
      { question: "Can I add a stop to my trip?", answer: "Yes. Tap 'Add a stop' before or during your trip — fares update automatically." },
      { question: "What payment methods are supported?", answer: "Credit and debit cards, Apple Pay, Google Pay, and digital wallets are supported in most cities." },
    ],
    driverFaqs: [
      { question: "When do I get paid?", answer: "Earnings are deposited to your bank account every Tuesday for the previous week. Instant cash-out is also available." },
      { question: "Can I drive in multiple cities?", answer: "Yes, as long as you meet each city's local requirements. Update your driving region in the Driver app." },
      { question: "What happens if a rider cancels?", answer: "If a rider cancels after the cancellation window, you receive a cancellation fee automatically." },
      { question: "How do I update my vehicle info?", answer: "Go to Account → Vehicles in the Driver app to add or update vehicle details and documents." },
      { question: "Do I keep 100% of tips?", answer: "Yes — every cent of your tips goes to you, with no GoNex fee." },
      { question: "Is on-trip insurance included?", answer: "Yes. All active trips are covered by GoNex partner insurance at no cost to you." },
    ],
    support: {
      title: "Real humans, ready when you need them",
      subtitle: "Our support team is staffed around the clock with trained specialists for both riders and drivers. Whether it's a question about a fare, a lost item, or an urgent safety issue — we're one tap away.",
      image: "",
    },
  },
};
