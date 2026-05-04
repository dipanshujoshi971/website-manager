import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { api, type Site } from '@/lib/api'
import { toast } from 'sonner'
import { Loader2, ArrowLeft, RefreshCw, ExternalLink } from 'lucide-react'

export const Route = createFileRoute('/preview/$siteId')({
  component: PreviewPage,
})

function PreviewPage() {
  const { siteId } = Route.useParams()
  const [site, setSite] = useState<Site | null>(null)
  const [loading, setLoading] = useState(true)
  const [key, setKey] = useState(0)

  useEffect(() => {
    api.getSite(siteId)
      .then(setSite)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false))
  }, [siteId])

  const previewUrl = site?.previewUrl || (site?.customDomain ? `https://${site.customDomain}` : null)

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
    </div>
  )

  if (!previewUrl) return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 text-center px-4">
      <p className="text-gray-500 text-sm">No preview URL set for this project.</p>
      <Link
        to="/projects/$siteId/settings"
        params={{ siteId }}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
      >
        Go to Settings
      </Link>
    </div>
  )

  return (
    <div className="flex flex-col h-screen">
      {/* Toolbar */}
      <div className="flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-2 shrink-0">
        <Link
          to="/projects/$siteId/edit"
          params={{ siteId }}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Editor
        </Link>
        <div className="flex-1 mx-4">
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-500 font-mono">
            <span className="h-2 w-2 rounded-full bg-green-400 shrink-0" />
            {previewUrl}
          </div>
        </div>
        <button
          onClick={() => setKey(k => k + 1)}
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
        >
          <RefreshCw className="h-4 w-4" /> Reload
        </button>
        <a
          href={previewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
        >
          <ExternalLink className="h-4 w-4" /> Open tab
        </a>
      </div>

      {/* Iframe */}
      <iframe
        key={key}
        src={previewUrl}
        className="flex-1 w-full border-0"
        title={`Preview — ${site?.name}`}
      />
    </div>
  )
}
