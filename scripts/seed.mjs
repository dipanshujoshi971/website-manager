/**
 * Seeds / updates the GoNex project with actual default content.
 * Safe to run multiple times — upserts content.
 * node scripts/seed.mjs
 */
import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const envPath = join(root, '.env')

if (!existsSync(envPath)) {
  console.error('❌  .env not found')
  process.exit(1)
}

const env = Object.fromEntries(
  readFileSync(envPath, 'utf-8')
    .split('\n')
    .filter((l) => l.trim() && !l.startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
    .filter(([k]) => k)
)

const { neon } = await import('@neondatabase/serverless')
const sql = neon(env.DATABASE_URL)

const defaultContent = {
  global: {
    siteName: "GoNex",
    tagline: "Ready to go? Let's GoNex.",
    logo: "/assets/gonex-logo.png",
    navbar: {
      links: [
        { to: "/ride", label: "Ride", show: true },
        { to: "/drive", label: "Drive", show: true },
        { to: "/safety", label: "Safety", show: true },
        { to: "/help", label: "Help", show: true },
        { to: "/about", label: "About Us", show: true },
      ],
      ctaButton: { show: true, text: "Get the App", link: "/#download" },
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
    storeLinks: { appStore: "#", playStore: "#" },
    colors: { primary: "#1A56DB", primaryGlow: "#60A5FA" },
  },
  home: {
    hero: {
      badge: "New rides every second",
      title: "Ready to go?",
      titleHighlight: "Let's GoNex.",
      subtitle: "Request a ride in seconds. Safe, affordable, and always on time — wherever you're headed.",
      ctaPrimary: { show: true, text: "Ride with GoNex", link: "/ride" },
      ctaSecondary: { show: true, text: "Become a Driver", link: "/drive" },
      appStoreButton: { show: true },
      playStoreButton: { show: true },
      rating: "4.9",
      ratingText: "Trusted by 2M+ riders",
      backgroundImage: "",
      phoneImage: "",
    },
    stats: { show: true, items: [
      { value: 2, suffix: "M+", label: "Riders worldwide" },
      { value: 150, suffix: "K+", label: "Active drivers" },
      { value: 50, suffix: "+", label: "Cities served" },
      { value: 4.9, suffix: "★", label: "Average rating", decimals: 1 },
    ]},
    howItWorks: {
      title: "How it works",
      subtitle: "Three steps to your destination.",
      steps: [
        { icon: "Smartphone", title: "Open the App", description: "Sign in and set your destination in seconds." },
        { icon: "MapPin", title: "Book Your Ride", description: "Pick the ride class that fits — see the price upfront." },
        { icon: "ShieldCheck", title: "Arrive Safely", description: "Track your driver in real time and ride with confidence." },
      ],
    },
    download: {
      title: "GoNex is available on iOS and Android",
      subtitle: "Download the app and take your first ride in minutes.",
      image: "",
    },
  },
}

// Upsert site
const existing = await sql`SELECT id FROM sites WHERE site_id = 'gonex' LIMIT 1`

if (existing.length === 0) {
  await sql`
    INSERT INTO sites (name, site_id, template_type, preview_url)
    VALUES ('GoNex', 'gonex', 'ride-hailing', 'http://localhost:8080')
  `
  console.log('✓  GoNex project created')
} else {
  await sql`
    UPDATE sites SET preview_url = 'http://localhost:8080', updated_at = now()
    WHERE site_id = 'gonex'
  `
  console.log('✓  GoNex project already exists — updated preview URL')
}

// Upsert content
const existingContent = await sql`SELECT id FROM site_content WHERE site_id = 'gonex' LIMIT 1`
if (existingContent.length === 0) {
  await sql`INSERT INTO site_content (site_id, content) VALUES ('gonex', ${JSON.stringify(defaultContent)})`
} else {
  await sql`UPDATE site_content SET content = ${JSON.stringify(defaultContent)}, updated_at = now() WHERE site_id = 'gonex'`
}

console.log('✓  GoNex content seeded with default data')
console.log('   Run: npm run db:seed to re-seed anytime')
