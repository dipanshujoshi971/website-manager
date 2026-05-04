import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { api, type Site, TEMPLATE_LABELS, TEMPLATE_ICONS } from '@/lib/api'
import { ExternalLink, Settings, Inbox, Pencil, Loader2 } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: Dashboard,
})

function Dashboard() {
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api.listSites()
      .then(setSites)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
    </div>
  )

  if (error) return (
    <div className="p-8 text-red-600 text-sm">Failed to load projects: {error}</div>
  )

  if (sites.length === 0) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
      <p className="text-gray-500 text-sm">No projects yet.</p>
      <Link
        to="/projects/new"
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
      >
        Create your first project
      </Link>
    </div>
  )

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Projects</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {sites.map((site) => (
          <SiteCard key={site.id} site={site} />
        ))}
      </div>
    </div>
  )
}

function SiteCard({ site }: { site: Site }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{TEMPLATE_ICONS[site.templateType]}</span>
            <h2 className="font-semibold text-gray-900">{site.name}</h2>
          </div>
          <span className="text-xs text-gray-500 bg-gray-100 rounded px-2 py-0.5">
            {TEMPLATE_LABELS[site.templateType]}
          </span>
        </div>
      </div>

      <div className="text-xs text-gray-400 font-mono">
        SITE_ID: {site.siteId}
      </div>

      {site.customDomain && (
        <a
          href={`https://${site.customDomain}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-indigo-600 hover:underline"
        >
          <ExternalLink className="h-3 w-3" /> {site.customDomain}
        </a>
      )}

      <div className="flex gap-2 mt-auto pt-2 border-t border-gray-100">
        <Link
          to="/projects/$siteId/edit"
          params={{ siteId: site.siteId }}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
        >
          <Pencil className="h-3.5 w-3.5" /> Edit Content
        </Link>
        <Link
          to="/projects/$siteId/submissions"
          params={{ siteId: site.siteId }}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
        >
          <Inbox className="h-3.5 w-3.5" /> Submissions
        </Link>
        <Link
          to="/projects/$siteId/settings"
          params={{ siteId: site.siteId }}
          className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
        >
          <Settings className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  )
}
