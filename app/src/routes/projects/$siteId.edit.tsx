import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { api, type Site, type SiteContent, TEMPLATE_LABELS } from '@/lib/api'
import { toast } from 'sonner'
import { Loader2, Save, Eye } from 'lucide-react'

// Shared editors
import { GlobalEditor } from '@/components/editors/GlobalEditor'
import { NavbarEditor } from '@/components/editors/NavbarEditor'
import { HeroEditor } from '@/components/editors/HeroEditor'
import { HowItWorksEditor } from '@/components/editors/HowItWorksEditor'
import { StatsEditor } from '@/components/editors/StatsEditor'
import { AppDownloadEditor } from '@/components/editors/AppDownloadEditor'
import { FooterEditor } from '@/components/editors/FooterEditor'

// Launchpad-specific editors
import { PageHeroEditor } from '@/components/editors/PageHeroEditor'
import { WhyUsEditor } from '@/components/editors/WhyUsEditor'
import { CitiesEditor } from '@/components/editors/CitiesEditor'
import { TestimonialsEditor } from '@/components/editors/TestimonialsEditor'
import { ImageFeaturesEditor } from '@/components/editors/ImageFeaturesEditor'
import { RidePricingEditor } from '@/components/editors/RidePricingEditor'
import { RideCategoriesEditor } from '@/components/editors/RideCategoriesEditor'
import { CardSectionEditor } from '@/components/editors/CardSectionEditor'
import { DriveRequirementsEditor } from '@/components/editors/DriveRequirementsEditor'
import { DriveEarningsEditor } from '@/components/editors/DriveEarningsEditor'
import { AboutMissionEditor } from '@/components/editors/AboutMissionEditor'
import { AboutTeamEditor } from '@/components/editors/AboutTeamEditor'
import { AboutTimelineEditor } from '@/components/editors/AboutTimelineEditor'
import { AboutContactEditor } from '@/components/editors/AboutContactEditor'
import { SafetyTrustEditor } from '@/components/editors/SafetyTrustEditor'
import { FaqEditor } from '@/components/editors/FaqEditor'
import { SimpleBannerEditor } from '@/components/editors/SimpleBannerEditor'
import { StatListEditor } from '@/components/editors/shared'

export const Route = createFileRoute('/projects/$siteId/edit')({
  component: EditContent,
})

// ── Shared sections shown for non-launchpad templates ─────────────────────────
const SHARED_SECTIONS = [
  { key: 'global', label: 'Global' },
  { key: 'navbar', label: 'Navbar' },
  { key: 'hero', label: 'Hero' },
  { key: 'howItWorks', label: 'How It Works' },
  { key: 'stats', label: 'Stats' },
  { key: 'appDownload', label: 'App Download' },
  { key: 'footer', label: 'Footer' },
]

// ── Template-specific sections for non-launchpad templates ───────────────────
const TEMPLATE_SECTIONS: Record<string, { key: string; label: string }[]> = {
  'ride-hailing':      [{ key: 'forRiders', label: 'For Riders' }, { key: 'forDrivers', label: 'For Drivers' }, { key: 'safety', label: 'Safety' }],
  'logistics':         [{ key: 'sendPackage', label: 'Send Package' }, { key: 'fleetPartners', label: 'Fleet Partners' }, { key: 'pricing', label: 'Pricing' }],
  'food-delivery':     [{ key: 'forCustomers', label: 'For Customers' }, { key: 'forRestaurants', label: 'For Restaurants' }, { key: 'forRiders', label: 'For Delivery Riders' }],
  'grocery-delivery':  [{ key: 'forShoppers', label: 'For Shoppers' }, { key: 'storePartners', label: 'Store Partners' }, { key: 'delivery', label: 'Delivery' }],
  'handyman':          [{ key: 'services', label: 'Services' }, { key: 'forHomeowners', label: 'For Homeowners' }, { key: 'forPros', label: 'For Pros' }],
  'super-app':         [{ key: 'servicesGrid', label: 'Services Grid' }, { key: 'forPartners', label: 'For Partners' }, { key: 'forDrivers', label: 'For Drivers' }],
  'carpooling':        [{ key: 'findRide', label: 'Find a Ride' }, { key: 'offerRide', label: 'Offer a Ride' }, { key: 'safety', label: 'Safety' }],
  'bus-booking':       [{ key: 'searchRoutes', label: 'Search Routes' }, { key: 'popularRoutes', label: 'Popular Routes' }, { key: 'forOperators', label: 'For Operators' }],
  'pharmacy-delivery': [{ key: 'orderMedicine', label: 'Order Medicine' }, { key: 'forPharmacies', label: 'For Pharmacies' }, { key: 'prescription', label: 'Prescription Upload' }],
}

// ── Launchpad sections grouped by page ───────────────────────────────────────
type SectionGroup = { group: string; sections: { key: string; label: string }[] }

const LAUNCHPAD_SECTION_GROUPS: SectionGroup[] = [
  {
    group: 'Global',
    sections: [
      { key: 'lp.global', label: 'Global Settings' },
      { key: 'lp.navbar', label: 'Navbar' },
      { key: 'lp.footer', label: 'Footer' },
    ],
  },
  {
    group: 'Home Page',
    sections: [
      { key: 'lp.home.hero', label: 'Hero' },
      { key: 'lp.home.stats', label: 'Stats' },
      { key: 'lp.home.howItWorks', label: 'How It Works' },
      { key: 'lp.home.whyUs', label: 'Why Us' },
      { key: 'lp.home.cities', label: 'Cities' },
      { key: 'lp.home.download', label: 'App Download' },
      { key: 'lp.home.testimonials', label: 'Testimonials' },
    ],
  },
  {
    group: 'Ride Page',
    sections: [
      { key: 'lp.ride.hero', label: 'Hero' },
      { key: 'lp.ride.stats', label: 'Stats' },
      { key: 'lp.ride.steps', label: 'Steps' },
      { key: 'lp.ride.pricing', label: 'Pricing' },
      { key: 'lp.ride.lifestyle', label: 'Lifestyle' },
      { key: 'lp.ride.categories', label: 'Categories' },
    ],
  },
  {
    group: 'Drive Page',
    sections: [
      { key: 'lp.drive.hero', label: 'Hero' },
      { key: 'lp.drive.stats', label: 'Stats' },
      { key: 'lp.drive.featured', label: 'Featured' },
      { key: 'lp.drive.benefits', label: 'Benefits' },
      { key: 'lp.drive.requirements', label: 'Requirements' },
      { key: 'lp.drive.earnings', label: 'Earnings' },
    ],
  },
  {
    group: 'About Page',
    sections: [
      { key: 'lp.about.hero', label: 'Hero' },
      { key: 'lp.about.mission', label: 'Mission' },
      { key: 'lp.about.stats', label: 'Stats' },
      { key: 'lp.about.team', label: 'Team' },
      { key: 'lp.about.values', label: 'Values' },
      { key: 'lp.about.timeline', label: 'Timeline' },
      { key: 'lp.about.cityBanner', label: 'City Banner' },
      { key: 'lp.about.contact', label: 'Contact' },
    ],
  },
  {
    group: 'Safety Page',
    sections: [
      { key: 'lp.safety.hero', label: 'Hero' },
      { key: 'lp.safety.stats', label: 'Stats' },
      { key: 'lp.safety.riderFeatures', label: 'Rider Features' },
      { key: 'lp.safety.driverFeatures', label: 'Driver Features' },
      { key: 'lp.safety.trust', label: 'Trust' },
      { key: 'lp.safety.pillars', label: 'Pillars' },
      { key: 'lp.safety.emergency', label: 'Emergency' },
    ],
  },
  {
    group: 'Help Page',
    sections: [
      { key: 'lp.help.hero', label: 'Hero' },
      { key: 'lp.help.channels', label: 'Channels' },
      { key: 'lp.help.riderFaqs', label: 'Rider FAQs' },
      { key: 'lp.help.driverFaqs', label: 'Driver FAQs' },
      { key: 'lp.help.support', label: 'Support' },
    ],
  },
]

// ── Deep get/set helpers ──────────────────────────────────────────────────────
function getPath(obj: Record<string, unknown>, path: string): any {
  return path.split('.').reduce((acc: any, key) => acc?.[key], obj)
}

function setPath(obj: Record<string, unknown>, path: string, value: unknown): Record<string, unknown> {
  const keys = path.split('.')
  const result = { ...obj }
  let cur: any = result
  for (let i = 0; i < keys.length - 1; i++) {
    cur[keys[i]] = cur[keys[i]] ? { ...cur[keys[i]] } : {}
    cur = cur[keys[i]]
  }
  cur[keys[keys.length - 1]] = value
  return result
}

// ── Component ─────────────────────────────────────────────────────────────────
function EditContent() {
  const { siteId } = Route.useParams()
  const [site, setSite] = useState<Site | null>(null)
  const [contentRow, setContentRow] = useState<SiteContent | null>(null)
  const [draft, setDraft] = useState<Record<string, unknown>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState<string>('')

  const isLaunchpad = site?.templateType === 'gonex-launchpad'

  useEffect(() => {
    Promise.all([api.getSite(siteId), api.getContent(siteId)])
      .then(([s, c]) => {
        setSite(s)
        setContentRow(c)
        setDraft(c.content)
        // Set default active section based on template
        if (s.templateType === 'gonex-launchpad') {
          setActiveSection('lp.global')
        } else {
          setActiveSection('global')
        }
      })
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false))
  }, [siteId])

  async function handleSave() {
    setSaving(true)
    try {
      const updated = await api.updateContent(siteId, draft)
      setContentRow(updated)
      toast.success('Content published!')
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  function handleChange(path: string, value: unknown) {
    setDraft((prev) => setPath(prev, path, value))
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-6 w-6 animate-spin text-indigo-600" /></div>
  if (!site) return <div className="p-8 text-red-600 text-sm">Project not found.</div>

  const templateSections = TEMPLATE_SECTIONS[site.templateType] ?? []
  const allSections = [...SHARED_SECTIONS, ...templateSections]

  return (
    <div className="flex flex-col h-full">
      {/* Topbar */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3 shrink-0">
        <div>
          <h1 className="font-semibold text-gray-900">{site.name}</h1>
          <p className="text-xs text-gray-500">{TEMPLATE_LABELS[site.templateType]}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate({ to: '/preview/$siteId', params: { siteId } })}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            <Eye className="h-4 w-4" /> Preview
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Section sidebar */}
        <div className="w-52 border-r border-gray-200 bg-white p-3 shrink-0 overflow-auto">
          {isLaunchpad ? (
            // Launchpad: grouped sidebar by page
            LAUNCHPAD_SECTION_GROUPS.map((group) => (
              <div key={group.group} className="mb-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-1">{group.group}</p>
                {group.sections.map((s) => (
                  <SidebarItem key={s.key} label={s.label} active={activeSection === s.key} onClick={() => setActiveSection(s.key)} />
                ))}
              </div>
            ))
          ) : (
            // Other templates: flat sidebar
            <>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">Sections</p>
              {SHARED_SECTIONS.map((s) => (
                <SidebarItem key={s.key} label={s.label} active={activeSection === s.key} onClick={() => setActiveSection(s.key)} />
              ))}
              {templateSections.length > 0 && (
                <>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mt-4 mb-2">Template</p>
                  {templateSections.map((s) => (
                    <SidebarItem key={s.key} label={s.label} active={activeSection === s.key} onClick={() => setActiveSection(s.key)} />
                  ))}
                </>
              )}
            </>
          )}
        </div>

        {/* Editor panel */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-2xl">
            <ActiveEditor
              section={activeSection}
              draft={draft}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function SidebarItem({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-lg px-3 py-2 text-sm transition-colors ${active ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
    >
      {label}
    </button>
  )
}

// ── Route section keys to content paths ──────────────────────────────────────
function ActiveEditor({ section, draft, onChange }: {
  section: string
  draft: Record<string, unknown>
  onChange: (path: string, value: unknown) => void
}) {
  switch (section) {
    // ── Non-launchpad shared sections ─────────────────────────────────────────
    case 'global':
      return <GlobalEditor value={getPath(draft, 'global') ?? {}} onChange={(v) => onChange('global', v)} />
    case 'navbar':
      return <NavbarEditor value={getPath(draft, 'global.navbar') ?? {}} onChange={(v) => onChange('global.navbar', v)} />
    case 'hero':
      return <HeroEditor value={getPath(draft, 'home.hero') ?? {}} onChange={(v) => onChange('home.hero', v)} />
    case 'howItWorks':
      return <HowItWorksEditor value={getPath(draft, 'home.howItWorks') ?? {}} onChange={(v) => onChange('home.howItWorks', v)} />
    case 'stats':
      return <StatsEditor value={getPath(draft, 'home.stats') ?? {}} onChange={(v) => onChange('home.stats', v)} />
    case 'appDownload':
      return <AppDownloadEditor value={getPath(draft, 'home.download') ?? {}} onChange={(v) => onChange('home.download', v)} />
    case 'footer':
      return <FooterEditor value={getPath(draft, 'global.footer') ?? {}} onChange={(v) => onChange('global.footer', v)} />

    // ── Launchpad: Global ─────────────────────────────────────────────────────
    case 'lp.global':
      return <GlobalEditor value={getPath(draft, 'global') ?? {}} onChange={(v) => onChange('global', v)} />
    case 'lp.navbar':
      return <NavbarEditor value={getPath(draft, 'global.navbar') ?? {}} onChange={(v) => onChange('global.navbar', v)} />
    case 'lp.footer':
      return <FooterEditor value={getPath(draft, 'global.footer') ?? {}} onChange={(v) => onChange('global.footer', v)} />

    // ── Launchpad: Home Page ──────────────────────────────────────────────────
    case 'lp.home.hero':
      return <HeroEditor value={getPath(draft, 'home.hero') ?? {}} onChange={(v) => onChange('home.hero', v)} />
    case 'lp.home.stats':
      return (
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-gray-900">Stats</h2>
          <StatListEditor value={getPath(draft, 'home.stats') ?? []} onChange={(v) => onChange('home.stats', v)} />
        </div>
      )
    case 'lp.home.howItWorks':
      return <HowItWorksEditor value={getPath(draft, 'home.howItWorks') ?? {}} onChange={(v) => onChange('home.howItWorks', v)} />
    case 'lp.home.whyUs':
      return <WhyUsEditor value={getPath(draft, 'home.whyUs') ?? {}} onChange={(v) => onChange('home.whyUs', v)} />
    case 'lp.home.cities':
      return <CitiesEditor value={getPath(draft, 'home.cities') ?? {}} onChange={(v) => onChange('home.cities', v)} />
    case 'lp.home.download':
      return <AppDownloadEditor value={getPath(draft, 'home.download') ?? {}} onChange={(v) => onChange('home.download', v)} />
    case 'lp.home.testimonials':
      return <TestimonialsEditor value={getPath(draft, 'home.testimonials') ?? {}} onChange={(v) => onChange('home.testimonials', v)} />

    // ── Launchpad: Ride Page ──────────────────────────────────────────────────
    case 'lp.ride.hero':
      return <PageHeroEditor value={getPath(draft, 'ride.hero') ?? {}} onChange={(v) => onChange('ride.hero', v)} showImage />
    case 'lp.ride.stats':
      return (
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-gray-900">Stats</h2>
          <StatListEditor value={getPath(draft, 'ride.stats') ?? []} onChange={(v) => onChange('ride.stats', v)} />
        </div>
      )
    case 'lp.ride.steps':
      // ride.steps uses { title, subtitle, items: CardItem[] } (not "steps" key like home.howItWorks)
      return <CardSectionEditor value={getPath(draft, 'ride.steps') ?? {}} onChange={(v) => onChange('ride.steps', v)} showSubtitle sectionLabel="Steps" />
    case 'lp.ride.pricing':
      return <RidePricingEditor value={getPath(draft, 'ride.pricing') ?? {}} onChange={(v) => onChange('ride.pricing', v)} />
    case 'lp.ride.lifestyle':
      return <ImageFeaturesEditor value={getPath(draft, 'ride.lifestyle') ?? {}} onChange={(v) => onChange('ride.lifestyle', v)} featuresLabel="Lifestyle Features" />
    case 'lp.ride.categories':
      return <RideCategoriesEditor value={getPath(draft, 'ride.categories') ?? {}} onChange={(v) => onChange('ride.categories', v)} />

    // ── Launchpad: Drive Page ─────────────────────────────────────────────────
    case 'lp.drive.hero':
      return <PageHeroEditor value={getPath(draft, 'drive.hero') ?? {}} onChange={(v) => onChange('drive.hero', v)} showImage={false} />
    case 'lp.drive.stats':
      return (
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-gray-900">Stats</h2>
          <StatListEditor value={getPath(draft, 'drive.stats') ?? []} onChange={(v) => onChange('drive.stats', v)} />
        </div>
      )
    case 'lp.drive.featured':
      return <ImageFeaturesEditor value={getPath(draft, 'drive.featured') ?? {}} onChange={(v) => onChange('drive.featured', v)} featuresLabel="Driver Features" />
    case 'lp.drive.benefits':
      return <CardSectionEditor value={getPath(draft, 'drive.benefits') ?? {}} onChange={(v) => onChange('drive.benefits', v)} sectionLabel="Benefits" />
    case 'lp.drive.requirements':
      return <DriveRequirementsEditor value={getPath(draft, 'drive.requirements') ?? {}} onChange={(v) => onChange('drive.requirements', v)} />
    case 'lp.drive.earnings':
      return <DriveEarningsEditor value={getPath(draft, 'drive.earnings') ?? {}} onChange={(v) => onChange('drive.earnings', v)} />

    // ── Launchpad: About Page ─────────────────────────────────────────────────
    case 'lp.about.hero':
      return <PageHeroEditor value={getPath(draft, 'about.hero') ?? {}} onChange={(v) => onChange('about.hero', v)} showImage={false} />
    case 'lp.about.mission':
      return <AboutMissionEditor value={getPath(draft, 'about.mission') ?? {}} onChange={(v) => onChange('about.mission', v)} />
    case 'lp.about.stats':
      return (
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-gray-900">Stats</h2>
          <StatListEditor value={getPath(draft, 'about.stats') ?? []} onChange={(v) => onChange('about.stats', v)} />
        </div>
      )
    case 'lp.about.team':
      return <AboutTeamEditor value={getPath(draft, 'about.team') ?? {}} onChange={(v) => onChange('about.team', v)} />
    case 'lp.about.values':
      return <CardSectionEditor value={getPath(draft, 'about.values') ?? {}} onChange={(v) => onChange('about.values', v)} sectionLabel="Values" />
    case 'lp.about.timeline':
      return <AboutTimelineEditor value={getPath(draft, 'about.timeline') ?? {}} onChange={(v) => onChange('about.timeline', v)} />
    case 'lp.about.cityBanner':
      return <SimpleBannerEditor value={getPath(draft, 'about.cityBanner') ?? {}} onChange={(v) => onChange('about.cityBanner', v)} imageLabel="City Banner Image" />
    case 'lp.about.contact':
      return <AboutContactEditor value={getPath(draft, 'about.contact') ?? {}} onChange={(v) => onChange('about.contact', v)} />

    // ── Launchpad: Safety Page ────────────────────────────────────────────────
    case 'lp.safety.hero':
      return <PageHeroEditor value={getPath(draft, 'safety.hero') ?? {}} onChange={(v) => onChange('safety.hero', v)} showImage={false} />
    case 'lp.safety.stats':
      return (
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-gray-900">Stats</h2>
          <StatListEditor value={getPath(draft, 'safety.stats') ?? []} onChange={(v) => onChange('safety.stats', v)} />
        </div>
      )
    case 'lp.safety.riderFeatures':
      return <CardSectionEditor value={getPath(draft, 'safety.riderFeatures') ?? {}} onChange={(v) => onChange('safety.riderFeatures', v)} sectionLabel="Rider Safety Features" />
    case 'lp.safety.driverFeatures':
      return <CardSectionEditor value={getPath(draft, 'safety.driverFeatures') ?? {}} onChange={(v) => onChange('safety.driverFeatures', v)} sectionLabel="Driver Safety Features" />
    case 'lp.safety.trust':
      return <SafetyTrustEditor value={getPath(draft, 'safety.trust') ?? {}} onChange={(v) => onChange('safety.trust', v)} />
    case 'lp.safety.pillars':
      return <CardSectionEditor value={getPath(draft, 'safety.pillars') ?? {}} onChange={(v) => onChange('safety.pillars', v)} showSubtitle sectionLabel="Safety Pillars" />
    case 'lp.safety.emergency':
      return <SimpleBannerEditor value={getPath(draft, 'safety.emergency') ?? {}} onChange={(v) => onChange('safety.emergency', v)} imageLabel="Emergency Image" />

    // ── Launchpad: Help Page ──────────────────────────────────────────────────
    case 'lp.help.hero':
      return <PageHeroEditor value={getPath(draft, 'help.hero') ?? {}} onChange={(v) => onChange('help.hero', v)} showImage={false} />
    case 'lp.help.channels':
      // help.channels is a plain CardItem[] (no title wrapper)
      return (
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-gray-900">Support Channels</h2>
          <p className="text-sm text-gray-500">Cards shown at the top of the Help page.</p>
          <CardSectionEditor
            value={{ items: getPath(draft, 'help.channels') ?? [] }}
            onChange={(v) => onChange('help.channels', v.items ?? [])}
            sectionLabel="Channels"
          />
        </div>
      )
    case 'lp.help.riderFaqs':
      return <FaqEditor value={getPath(draft, 'help.riderFaqs') ?? []} onChange={(v) => onChange('help.riderFaqs', v)} sectionTitle="Rider FAQs" />
    case 'lp.help.driverFaqs':
      return <FaqEditor value={getPath(draft, 'help.driverFaqs') ?? []} onChange={(v) => onChange('help.driverFaqs', v)} sectionTitle="Driver FAQs" />
    case 'lp.help.support':
      return <SimpleBannerEditor value={getPath(draft, 'help.support') ?? {}} onChange={(v) => onChange('help.support', v)} imageLabel="Support Image" />

    default:
      return (
        <div className="rounded-xl border-2 border-dashed border-gray-200 p-12 text-center text-sm text-gray-400">
          Editor for <strong>{section}</strong> coming soon.
        </div>
      )
  }
}
