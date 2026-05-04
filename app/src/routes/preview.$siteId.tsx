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

  // Always load the /site template instance with ?siteId=... so the iframe shows
  // the editable site. site.previewUrl / customDomain are public-publish URLs and
  // aren't guaranteed to be valid template instances — ignore them here.
  const PREVIEW_BASE = (import.meta.env.VITE_SITE_PREVIEW_URL as string) || 'http://localhost:5173'
  const previewUrl = site ? `${PREVIEW_BASE}/?siteId=${encodeURIComponent(site.siteId)}` : null

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
    </div>
  )

  if (!previewUrl) return null

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
