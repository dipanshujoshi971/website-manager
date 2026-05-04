import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { api, type Site, TEMPLATE_LABELS } from '@/lib/api'
import { toast } from 'sonner'
import { CheckCircle2, ExternalLink, Loader2, Trash2 } from 'lucide-react'

export const Route = createFileRoute('/projects/$siteId/settings')({
  component: Settings,
})

function Settings() {
  const { siteId } = Route.useParams()
  const navigate = useNavigate()
  const [site, setSite] = useState<Site | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [domain, setDomain] = useState('')
  const [previewUrl, setPreviewUrl] = useState('')
  const [cfProject, setCfProject] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    api.getSite(siteId)
      .then((s) => {
        setSite(s)
        setDomain(s.customDomain ?? '')
        setPreviewUrl(s.previewUrl ?? '')
        setCfProject(s.cfPagesProject ?? '')
      })
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false))
  }, [siteId])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const updated = await api.updateSite(siteId, {
        customDomain: domain || null,
        previewUrl: previewUrl || null,
        cfPagesProject: cfProject || null,
      })
      setSite(updated)
      toast.success('Settings saved')
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete project "${site?.name}"? This cannot be undone.`)) return
    setDeleting(true)
    try {
      await api.deleteSite(siteId)
      toast.success('Project deleted')
      navigate({ to: '/' })
    } catch (e: any) {
      toast.error(e.message)
      setDeleting(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
    </div>
  )
  if (!site) return <div className="p-8 text-red-600 text-sm">Project not found.</div>

  const liveUrl = site.cfPagesProject ? `https://${site.cfPagesProject}.pages.dev` : null

  return (
    <div className="p-8 max-w-xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Settings</h1>
        <p className="text-sm text-gray-500">{site.name} · {TEMPLATE_LABELS[site.templateType]}</p>
      </div>

      {/* Read-only info */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-2 text-sm">
        <Row label="Site ID" value={<code className="font-mono text-xs bg-white border border-gray-200 rounded px-2 py-0.5">{site.siteId}</code>} />
        <Row label="Template" value={TEMPLATE_LABELS[site.templateType]} />
        <Row label="Created" value={new Date(site.createdAt).toLocaleDateString()} />
      </div>

      {/* Live URL (if deployed) */}
      {liveUrl && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
          <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-green-800 mb-0.5">Live on Cloudflare Pages</p>
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-mono text-green-700 hover:underline truncate block"
            >
              {liveUrl}
            </a>
          </div>
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded hover:bg-green-100 text-green-600 flex-shrink-0"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      )}

      {/* Editable settings */}
      <form onSubmit={handleSave} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Custom Domain</label>
          <input
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="e.g. gonex.in"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none"
          />
          <p className="mt-1 text-xs text-gray-400">Add via Cloudflare Pages dashboard after setting here.</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Preview URL</label>
          <input
            value={previewUrl}
            onChange={(e) => setPreviewUrl(e.target.value)}
            placeholder="e.g. http://localhost:5173"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none"
          />
          <p className="mt-1 text-xs text-gray-400">Used by the in-editor live preview iframe.</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">CF Pages Project Name</label>
          <input
            value={cfProject}
            onChange={(e) => setCfProject(e.target.value)}
            placeholder="auto-set when you deploy"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm font-mono focus:border-indigo-500 focus:outline-none"
          />
          <p className="mt-1 text-xs text-gray-400">Set automatically when you click Deploy in the editor.</p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>

      {/* Danger zone */}
      <div className="border border-red-200 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-red-700 mb-2">Danger Zone</h2>
        <p className="text-xs text-gray-500 mb-4">Deleting this project removes all content and submissions. This cannot be undone.</p>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
        >
          {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          {deleting ? 'Deleting...' : 'Delete Project'}
        </button>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-900">{value}</span>
    </div>
  )
}
