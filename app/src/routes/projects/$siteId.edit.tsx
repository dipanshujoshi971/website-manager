import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { api, type Site, type SiteContent, TEMPLATE_LABELS } from '@/lib/api'
import { toast } from 'sonner'
import { CheckCircle2, ChevronDown, ExternalLink, Eye, EyeOff, Globe, Loader2, RefreshCw, Rocket, Save } from 'lucide-react'

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
import { StatListEditor, SectionVisibilityToggle } from '@/components/editors/shared'

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
  const [deploying, setDeploying] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('')
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({ Global: true })
  const [sectionFilter, setSectionFilter] = useState('')
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewReady, setPreviewReady] = useState(false)
  const [previewKey, setPreviewKey] = useState(0)
  const previewIframeRef = useRef<HTMLIFrameElement | null>(null)

  const isLaunchpad = site?.templateType === 'gonex-launchpad'

  // Keep the group containing the active section expanded so users never lose their place
  useEffect(() => {
    if (!activeSection) return
    const owner = LAUNCHPAD_SECTION_GROUPS.find((g) => g.sections.some((s) => s.key === activeSection))
    if (owner) setExpandedGroups((prev) => (prev[owner.group] ? prev : { ...prev, [owner.group]: true }))
  }, [activeSection])

  // Live editor preview always loads the /site template instance with ?siteId=...
  // We deliberately ignore site.previewUrl / customDomain here — those describe where
  // the *published* site lives, not the editable template needed for postMessage drafts.
  const PREVIEW_BASE = (import.meta.env.VITE_SITE_PREVIEW_URL as string) || 'http://localhost:5173'
  const previewSrc = site
    ? `${PREVIEW_BASE}/?siteId=${encodeURIComponent(site.siteId)}&preview=1`
    : ''
  const previewOrigin = (() => {
    try { return new URL(PREVIEW_BASE).origin } catch { return '*' }
  })()

  // Listen for the iframe's "I'm ready" handshake, then start pushing drafts.
  useEffect(() => {
    if (!previewOpen) {
      setPreviewReady(false)
      return
    }
    const onMessage = (e: MessageEvent) => {
      if (e.data?.type === 'preview:ready') setPreviewReady(true)
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [previewOpen, previewKey])

  // Push current draft to the iframe whenever it changes (and once on ready).
  useEffect(() => {
    if (!previewOpen || !previewReady) return
    previewIframeRef.current?.contentWindow?.postMessage(
      { type: 'preview:content', content: draft },
      previewOrigin,
    )
  }, [draft, previewOpen, previewReady, previewOrigin])

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
      toast.success('Content saved!')
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDeploy() {
    setDeploying(true)
    try {
      const liveUrl = await api.deployLocal(siteId)
      // Refresh site to get updated cfPagesProject / previewUrl
      const updated = await api.getSite(siteId)
      setSite(updated)
      toast.success(
        <span>
          Deployed!{' '}
          {liveUrl && (
            <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="underline font-medium">
              {liveUrl}
            </a>
          )}
        </span>,
        { duration: 10000 },
      )
    } catch (e: any) {
      toast.error(`Deploy failed: ${e.message}`)
    } finally {
      setDeploying(false)
    }
  }

  function handleChange(path: string, value: unknown) {
    setDraft((prev) => setPath(prev, path, value))
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-6 w-6 animate-spin text-indigo-600" /></div>
  if (!site) return <div className="p-8 text-red-600 text-sm">Project not found.</div>

  const templateSections = TEMPLATE_SECTIONS[site.templateType] ?? []
  const allSections = [...SHARED_SECTIONS, ...templateSections]
  const liveUrl = site.cfPagesProject ? `https://${site.cfPagesProject}.pages.dev` : null

  return (
    <div className="flex flex-col h-full">
      {/* Topbar */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3 shrink-0 gap-4">
        {/* Left: site info */}
        <div className="min-w-0">
          <h1 className="font-semibold text-gray-900 truncate">{site.name}</h1>
          <p className="text-xs text-gray-500 truncate">{TEMPLATE_LABELS[site.templateType]}</p>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Live URL chip — shown when deployed */}
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 pl-2.5 pr-3 py-1 text-xs font-medium text-green-700 hover:bg-green-100 transition-colors"
            >
              <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="max-w-[180px] truncate">{liveUrl.replace('https://', '')}</span>
              <ExternalLink className="h-3 w-3 opacity-60 flex-shrink-0" />
            </a>
          )}

          {/* Preview toggle */}
          <button
            type="button"
            onClick={() => setPreviewOpen((v) => !v)}
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
              previewOpen
                ? 'border-indigo-200 bg-indigo-50 text-indigo-700'
                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {previewOpen ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span className="hidden sm:inline">{previewOpen ? 'Hide Preview' : 'Preview'}</span>
          </button>

          {/* Save content */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span className="hidden sm:inline">{saving ? 'Saving...' : 'Save'}</span>
          </button>

          {/* Deploy to CF Pages */}
          <button
            onClick={handleDeploy}
            disabled={deploying}
            className="flex items-center gap-2 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:opacity-50 px-3 py-2 text-sm font-semibold text-white transition-colors"
          >
            {deploying
              ? <Loader2 className="h-4 w-4 animate-spin" />
              : liveUrl
                ? <Globe className="h-4 w-4" />
                : <Rocket className="h-4 w-4" />
            }
            <span className="hidden sm:inline">
              {deploying ? 'Deploying…' : liveUrl ? 'Redeploy' : 'Deploy'}
            </span>
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Section sidebar */}
        <div className="w-60 border-r border-gray-200 bg-gray-50/50 shrink-0 overflow-auto flex flex-col">
          {/* Search */}
          <div className="sticky top-0 z-10 bg-gray-50/95 backdrop-blur border-b border-gray-200 px-3 py-2.5">
            <input
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              placeholder="Search sections..."
              className="w-full rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs placeholder:text-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/15"
            />
          </div>

          <div className="flex-1 p-2">
            {isLaunchpad ? (
              // Launchpad: collapsible grouped sidebar by page
              LAUNCHPAD_SECTION_GROUPS.map((group) => {
                const filtered = sectionFilter
                  ? group.sections.filter((s) => s.label.toLowerCase().includes(sectionFilter.toLowerCase()))
                  : group.sections
                if (sectionFilter && filtered.length === 0) return null
                const expanded = sectionFilter ? true : expandedGroups[group.group] ?? false
                return (
                  <div key={group.group} className="mb-1">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedGroups((prev) => ({ ...prev, [group.group]: !expanded }))
                      }
                      className="flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500 hover:bg-gray-200/60"
                    >
                      <span>{group.group}</span>
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform ${expanded ? 'rotate-0' : '-rotate-90'}`}
                      />
                    </button>
                    {expanded && (
                      <div className="mt-0.5 space-y-0.5 pl-2">
                        {filtered.map((s) => (
                          <SidebarItem
                            key={s.key}
                            label={s.label}
                            active={activeSection === s.key}
                            onClick={() => setActiveSection(s.key)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )
              })
            ) : (
              // Other templates: flat sidebar with optional filter
              <>
                <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-2.5 mt-1 mb-1">Sections</p>
                {SHARED_SECTIONS.filter((s) =>
                  !sectionFilter || s.label.toLowerCase().includes(sectionFilter.toLowerCase()),
                ).map((s) => (
                  <SidebarItem key={s.key} label={s.label} active={activeSection === s.key} onClick={() => setActiveSection(s.key)} />
                ))}
                {templateSections.length > 0 && (
                  <>
                    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-2.5 mt-4 mb-1">Template</p>
                    {templateSections.filter((s) =>
                      !sectionFilter || s.label.toLowerCase().includes(sectionFilter.toLowerCase()),
                    ).map((s) => (
                      <SidebarItem key={s.key} label={s.label} active={activeSection === s.key} onClick={() => setActiveSection(s.key)} />
                    ))}
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* Editor panel */}
        <div className={`${previewOpen ? 'w-[480px] shrink-0 border-r border-gray-200' : 'flex-1'} overflow-auto p-6`}>
          <div className="max-w-2xl">
            <ActiveEditor
              section={activeSection}
              draft={draft}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Live preview pane — postMessages the current draft to /site */}
        {previewOpen && (
          <div className="flex flex-1 flex-col bg-gray-100">
            <div className="flex items-center gap-2 border-b border-gray-200 bg-white px-3 py-2 shrink-0">
              <span className="h-2 w-2 rounded-full bg-green-400 shrink-0" />
              <span className="flex-1 truncate font-mono text-xs text-gray-500">{previewSrc}</span>
              <button
                type="button"
                onClick={() => setPreviewKey((k) => k + 1)}
                className="flex items-center gap-1 rounded border border-gray-200 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50"
                title="Reload preview"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
              <a
                href={previewSrc}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 rounded border border-gray-200 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50"
                title="Open in new tab"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
            <iframe
              key={previewKey}
              ref={previewIframeRef}
              src={previewSrc}
              className="flex-1 w-full border-0 bg-white"
              title={`Live preview — ${site.name}`}
            />
          </div>
        )}
      </div>
    </div>
  )
}

function SidebarItem({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-md px-2.5 py-1.5 text-[13px] transition-colors ${
        active
          ? 'bg-indigo-100 text-indigo-700 font-semibold'
          : 'text-gray-600 hover:bg-gray-200/60 hover:text-gray-900'
      }`}
    >
      {label}
    </button>
  )
}

// Wraps a section editor with a "Show on page" toggle that drives
// `<page>.sectionsVisible.<key>` in the draft. /site reads the same path.
function WithVisibility({
  pagePath, label, draft, onChange, children,
}: {
  pagePath: string                 // e.g. "home.hero" or "ride.pricing"
  label?: string
  draft: Record<string, unknown>
  onChange: (path: string, value: unknown) => void
  children: React.ReactNode
}) {
  const [page, key] = pagePath.split('.')
  const visPath = `${page}.sectionsVisible.${key}`
  const visible = getPath(draft, visPath) !== false
  return (
    <div className="space-y-4">
      <SectionVisibilityToggle
        visible={visible}
        onToggle={(v) => onChange(visPath, v)}
        label={label ?? `Show "${key}" on the ${page} page`}
      />
      {children}
    </div>
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
      return (
        <WithVisibility pagePath="home.hero" label="Show Hero on Home page" draft={draft} onChange={onChange}>
          <HeroEditor value={getPath(draft, 'home.hero') ?? {}} onChange={(v) => onChange('home.hero', v)} />
        </WithVisibility>
      )
    case 'howItWorks':
      return (
        <WithVisibility pagePath="home.howItWorks" label="Show How It Works on Home page" draft={draft} onChange={onChange}>
          <HowItWorksEditor value={getPath(draft, 'home.howItWorks') ?? {}} onChange={(v) => onChange('home.howItWorks', v)} />
        </WithVisibility>
      )
    case 'stats':
      return (
        <WithVisibility pagePath="home.stats" label="Show Stats on Home page" draft={draft} onChange={onChange}>
          <StatsEditor value={getPath(draft, 'home.stats') ?? {}} onChange={(v) => onChange('home.stats', v)} />
        </WithVisibility>
      )
    case 'appDownload':
      return (
        <WithVisibility pagePath="home.download" label="Show App Download on Home page" draft={draft} onChange={onChange}>
          <AppDownloadEditor value={getPath(draft, 'home.download') ?? {}} onChange={(v) => onChange('home.download', v)} />
        </WithVisibility>
      )
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
      return (
        <WithVisibility pagePath="home.hero" label="Show Hero on Home page" draft={draft} onChange={onChange}>
          <HeroEditor value={getPath(draft, 'home.hero') ?? {}} onChange={(v) => onChange('home.hero', v)} />
        </WithVisibility>
      )
    case 'lp.home.stats':
      return (
        <WithVisibility pagePath="home.stats" label="Show Stats on Home page" draft={draft} onChange={onChange}>
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-gray-900">Stats</h2>
            <StatListEditor value={getPath(draft, 'home.stats') ?? []} onChange={(v) => onChange('home.stats', v)} />
          </div>
        </WithVisibility>
      )
    case 'lp.home.howItWorks':
      return (
        <WithVisibility pagePath="home.howItWorks" label="Show How It Works on Home page" draft={draft} onChange={onChange}>
          <HowItWorksEditor value={getPath(draft, 'home.howItWorks') ?? {}} onChange={(v) => onChange('home.howItWorks', v)} />
        </WithVisibility>
      )
    case 'lp.home.whyUs':
      return (
        <WithVisibility pagePath="home.whyUs" label="Show Why Us on Home page" draft={draft} onChange={onChange}>
          <WhyUsEditor value={getPath(draft, 'home.whyUs') ?? {}} onChange={(v) => onChange('home.whyUs', v)} />
        </WithVisibility>
      )
    case 'lp.home.cities':
      return (
        <WithVisibility pagePath="home.cities" label="Show Cities on Home page" draft={draft} onChange={onChange}>
          <CitiesEditor value={getPath(draft, 'home.cities') ?? {}} onChange={(v) => onChange('home.cities', v)} />
        </WithVisibility>
      )
    case 'lp.home.download':
      return (
        <WithVisibility pagePath="home.download" label="Show App Download on Home page" draft={draft} onChange={onChange}>
          <AppDownloadEditor value={getPath(draft, 'home.download') ?? {}} onChange={(v) => onChange('home.download', v)} />
        </WithVisibility>
      )
    case 'lp.home.testimonials':
      return (
        <WithVisibility pagePath="home.testimonials" label="Show Testimonials on Home page" draft={draft} onChange={onChange}>
          <TestimonialsEditor value={getPath(draft, 'home.testimonials') ?? {}} onChange={(v) => onChange('home.testimonials', v)} />
        </WithVisibility>
      )

    // ── Launchpad: Ride Page ──────────────────────────────────────────────────
    case 'lp.ride.hero':
      return (
        <WithVisibility pagePath="ride.hero" label="Show Hero on Ride page" draft={draft} onChange={onChange}>
          <PageHeroEditor value={getPath(draft, 'ride.hero') ?? {}} onChange={(v) => onChange('ride.hero', v)} showImage />
        </WithVisibility>
      )
    case 'lp.ride.stats':
      return (
        <WithVisibility pagePath="ride.stats" label="Show Stats on Ride page" draft={draft} onChange={onChange}>
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-gray-900">Stats</h2>
            <StatListEditor value={getPath(draft, 'ride.stats') ?? []} onChange={(v) => onChange('ride.stats', v)} />
          </div>
        </WithVisibility>
      )
    case 'lp.ride.steps':
      return (
        <WithVisibility pagePath="ride.steps" label="Show Steps on Ride page" draft={draft} onChange={onChange}>
          <CardSectionEditor value={getPath(draft, 'ride.steps') ?? {}} onChange={(v) => onChange('ride.steps', v)} showSubtitle sectionLabel="Steps" />
        </WithVisibility>
      )
    case 'lp.ride.pricing':
      return (
        <WithVisibility pagePath="ride.pricing" label="Show Pricing on Ride page" draft={draft} onChange={onChange}>
          <RidePricingEditor value={getPath(draft, 'ride.pricing') ?? {}} onChange={(v) => onChange('ride.pricing', v)} />
        </WithVisibility>
      )
    case 'lp.ride.lifestyle':
      return (
        <WithVisibility pagePath="ride.lifestyle" label="Show Lifestyle on Ride page" draft={draft} onChange={onChange}>
          <ImageFeaturesEditor value={getPath(draft, 'ride.lifestyle') ?? {}} onChange={(v) => onChange('ride.lifestyle', v)} featuresLabel="Lifestyle Features" />
        </WithVisibility>
      )
    case 'lp.ride.categories':
      return (
        <WithVisibility pagePath="ride.categories" label="Show Categories on Ride page" draft={draft} onChange={onChange}>
          <RideCategoriesEditor value={getPath(draft, 'ride.categories') ?? {}} onChange={(v) => onChange('ride.categories', v)} />
        </WithVisibility>
      )

    // ── Launchpad: Drive Page ─────────────────────────────────────────────────
    case 'lp.drive.hero':
      return (
        <WithVisibility pagePath="drive.hero" label="Show Hero on Drive page" draft={draft} onChange={onChange}>
          <PageHeroEditor value={getPath(draft, 'drive.hero') ?? {}} onChange={(v) => onChange('drive.hero', v)} showImage={false} />
        </WithVisibility>
      )
    case 'lp.drive.stats':
      return (
        <WithVisibility pagePath="drive.stats" label="Show Stats on Drive page" draft={draft} onChange={onChange}>
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-gray-900">Stats</h2>
            <StatListEditor value={getPath(draft, 'drive.stats') ?? []} onChange={(v) => onChange('drive.stats', v)} />
          </div>
        </WithVisibility>
      )
    case 'lp.drive.featured':
      return (
        <WithVisibility pagePath="drive.featured" label="Show Featured on Drive page" draft={draft} onChange={onChange}>
          <ImageFeaturesEditor value={getPath(draft, 'drive.featured') ?? {}} onChange={(v) => onChange('drive.featured', v)} featuresLabel="Driver Features" />
        </WithVisibility>
      )
    case 'lp.drive.benefits':
      return (
        <WithVisibility pagePath="drive.benefits" label="Show Benefits on Drive page" draft={draft} onChange={onChange}>
          <CardSectionEditor value={getPath(draft, 'drive.benefits') ?? {}} onChange={(v) => onChange('drive.benefits', v)} sectionLabel="Benefits" />
        </WithVisibility>
      )
    case 'lp.drive.requirements':
      return (
        <WithVisibility pagePath="drive.requirements" label="Show Requirements on Drive page" draft={draft} onChange={onChange}>
          <DriveRequirementsEditor value={getPath(draft, 'drive.requirements') ?? {}} onChange={(v) => onChange('drive.requirements', v)} />
        </WithVisibility>
      )
    case 'lp.drive.earnings':
      return (
        <WithVisibility pagePath="drive.earnings" label="Show Earnings on Drive page" draft={draft} onChange={onChange}>
          <DriveEarningsEditor value={getPath(draft, 'drive.earnings') ?? {}} onChange={(v) => onChange('drive.earnings', v)} />
        </WithVisibility>
      )

    // ── Launchpad: About Page ─────────────────────────────────────────────────
    case 'lp.about.hero':
      return (
        <WithVisibility pagePath="about.hero" label="Show Hero on About page" draft={draft} onChange={onChange}>
          <PageHeroEditor value={getPath(draft, 'about.hero') ?? {}} onChange={(v) => onChange('about.hero', v)} showImage={false} />
        </WithVisibility>
      )
    case 'lp.about.mission':
      return (
        <WithVisibility pagePath="about.mission" label="Show Mission on About page" draft={draft} onChange={onChange}>
          <AboutMissionEditor value={getPath(draft, 'about.mission') ?? {}} onChange={(v) => onChange('about.mission', v)} />
        </WithVisibility>
      )
    case 'lp.about.stats':
      return (
        <WithVisibility pagePath="about.stats" label="Show Stats on About page" draft={draft} onChange={onChange}>
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-gray-900">Stats</h2>
            <StatListEditor value={getPath(draft, 'about.stats') ?? []} onChange={(v) => onChange('about.stats', v)} />
          </div>
        </WithVisibility>
      )
    case 'lp.about.team':
      return (
        <WithVisibility pagePath="about.team" label="Show Team on About page" draft={draft} onChange={onChange}>
          <AboutTeamEditor value={getPath(draft, 'about.team') ?? {}} onChange={(v) => onChange('about.team', v)} />
        </WithVisibility>
      )
    case 'lp.about.values':
      return (
        <WithVisibility pagePath="about.values" label="Show Values on About page" draft={draft} onChange={onChange}>
          <CardSectionEditor value={getPath(draft, 'about.values') ?? {}} onChange={(v) => onChange('about.values', v)} sectionLabel="Values" />
        </WithVisibility>
      )
    case 'lp.about.timeline':
      return (
        <WithVisibility pagePath="about.timeline" label="Show Timeline on About page" draft={draft} onChange={onChange}>
          <AboutTimelineEditor value={getPath(draft, 'about.timeline') ?? {}} onChange={(v) => onChange('about.timeline', v)} />
        </WithVisibility>
      )
    case 'lp.about.cityBanner':
      return (
        <WithVisibility pagePath="about.cityBanner" label="Show City Banner on About page" draft={draft} onChange={onChange}>
          <SimpleBannerEditor value={getPath(draft, 'about.cityBanner') ?? {}} onChange={(v) => onChange('about.cityBanner', v)} imageLabel="City Banner Image" />
        </WithVisibility>
      )
    case 'lp.about.contact':
      return (
        <WithVisibility pagePath="about.contact" label="Show Contact on About page" draft={draft} onChange={onChange}>
          <AboutContactEditor value={getPath(draft, 'about.contact') ?? {}} onChange={(v) => onChange('about.contact', v)} />
        </WithVisibility>
      )

    // ── Launchpad: Safety Page ────────────────────────────────────────────────
    case 'lp.safety.hero':
      return (
        <WithVisibility pagePath="safety.hero" label="Show Hero on Safety page" draft={draft} onChange={onChange}>
          <PageHeroEditor value={getPath(draft, 'safety.hero') ?? {}} onChange={(v) => onChange('safety.hero', v)} showImage={false} />
        </WithVisibility>
      )
    case 'lp.safety.stats':
      return (
        <WithVisibility pagePath="safety.stats" label="Show Stats on Safety page" draft={draft} onChange={onChange}>
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-gray-900">Stats</h2>
            <StatListEditor value={getPath(draft, 'safety.stats') ?? []} onChange={(v) => onChange('safety.stats', v)} />
          </div>
        </WithVisibility>
      )
    case 'lp.safety.riderFeatures':
      return (
        <WithVisibility pagePath="safety.riderFeatures" label="Show Rider Features on Safety page" draft={draft} onChange={onChange}>
          <CardSectionEditor value={getPath(draft, 'safety.riderFeatures') ?? {}} onChange={(v) => onChange('safety.riderFeatures', v)} sectionLabel="Rider Safety Features" />
        </WithVisibility>
      )
    case 'lp.safety.driverFeatures':
      return (
        <WithVisibility pagePath="safety.driverFeatures" label="Show Driver Features on Safety page" draft={draft} onChange={onChange}>
          <CardSectionEditor value={getPath(draft, 'safety.driverFeatures') ?? {}} onChange={(v) => onChange('safety.driverFeatures', v)} sectionLabel="Driver Safety Features" />
        </WithVisibility>
      )
    case 'lp.safety.trust':
      return (
        <WithVisibility pagePath="safety.trust" label="Show Trust on Safety page" draft={draft} onChange={onChange}>
          <SafetyTrustEditor value={getPath(draft, 'safety.trust') ?? {}} onChange={(v) => onChange('safety.trust', v)} />
        </WithVisibility>
      )
    case 'lp.safety.pillars':
      return (
        <WithVisibility pagePath="safety.pillars" label="Show Pillars on Safety page" draft={draft} onChange={onChange}>
          <CardSectionEditor value={getPath(draft, 'safety.pillars') ?? {}} onChange={(v) => onChange('safety.pillars', v)} showSubtitle sectionLabel="Safety Pillars" />
        </WithVisibility>
      )
    case 'lp.safety.emergency':
      return (
        <WithVisibility pagePath="safety.emergency" label="Show Emergency on Safety page" draft={draft} onChange={onChange}>
          <SimpleBannerEditor value={getPath(draft, 'safety.emergency') ?? {}} onChange={(v) => onChange('safety.emergency', v)} imageLabel="Emergency Image" />
        </WithVisibility>
      )

    // ── Launchpad: Help Page ──────────────────────────────────────────────────
    case 'lp.help.hero':
      return (
        <WithVisibility pagePath="help.hero" label="Show Hero on Help page" draft={draft} onChange={onChange}>
          <PageHeroEditor value={getPath(draft, 'help.hero') ?? {}} onChange={(v) => onChange('help.hero', v)} showImage={false} />
        </WithVisibility>
      )
    case 'lp.help.channels':
      return (
        <WithVisibility pagePath="help.channels" label="Show Support Channels on Help page" draft={draft} onChange={onChange}>
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-gray-900">Support Channels</h2>
            <p className="text-sm text-gray-500">Cards shown at the top of the Help page.</p>
            <CardSectionEditor
              value={{ items: getPath(draft, 'help.channels') ?? [] }}
              onChange={(v) => onChange('help.channels', v.items ?? [])}
              sectionLabel="Channels"
            />
          </div>
        </WithVisibility>
      )
    case 'lp.help.riderFaqs':
      return (
        <WithVisibility pagePath="help.riderFaqs" label="Show Rider FAQs on Help page" draft={draft} onChange={onChange}>
          <FaqEditor value={getPath(draft, 'help.riderFaqs') ?? []} onChange={(v) => onChange('help.riderFaqs', v)} sectionTitle="Rider FAQs" />
        </WithVisibility>
      )
    case 'lp.help.driverFaqs':
      return (
        <WithVisibility pagePath="help.driverFaqs" label="Show Driver FAQs on Help page" draft={draft} onChange={onChange}>
          <FaqEditor value={getPath(draft, 'help.driverFaqs') ?? []} onChange={(v) => onChange('help.driverFaqs', v)} sectionTitle="Driver FAQs" />
        </WithVisibility>
      )
    case 'lp.help.support':
      return (
        <WithVisibility pagePath="help.support" label="Show Support Banner on Help page" draft={draft} onChange={onChange}>
          <SimpleBannerEditor value={getPath(draft, 'help.support') ?? {}} onChange={(v) => onChange('help.support', v)} imageLabel="Support Image" />
        </WithVisibility>
      )

    default:
      return (
        <div className="rounded-xl border-2 border-dashed border-gray-200 p-12 text-center text-sm text-gray-400">
          Editor for <strong>{section}</strong> coming soon.
        </div>
      )
  }
}
