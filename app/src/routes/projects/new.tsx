import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { api, TEMPLATE_TYPES, TEMPLATE_LABELS, TEMPLATE_ICONS, type TemplateType } from '@/lib/api'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export const Route = createFileRoute('/projects/new')({
  component: NewProject,
})

function NewProject() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [siteId, setSiteId] = useState('')
  const [template, setTemplate] = useState<TemplateType | ''>('')
  const [submitting, setSubmitting] = useState(false)
  const [siteIdManual, setSiteIdManual] = useState(false)

  function handleNameChange(val: string) {
    setName(val)
    if (!siteIdManual) {
      setSiteId(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!template) { toast.error('Pick a template'); return }
    setSubmitting(true)
    try {
      const site = await api.createSite({ name, siteId, templateType: template })
      toast.success('Project created!')
      navigate({ to: '/projects/$siteId/edit', params: { siteId: site.siteId } })
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">New Project</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Template picker */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Choose Template <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {TEMPLATE_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTemplate(t)}
                className={`flex flex-col items-start gap-1.5 rounded-xl border-2 p-4 text-left transition-colors ${
                  template === t
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <span className="text-2xl">{TEMPLATE_ICONS[t]}</span>
                <span className="text-xs font-medium text-gray-800 leading-tight">{TEMPLATE_LABELS[t]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Project Name <span className="text-red-500">*</span>
          </label>
          <input
            required
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Gonex Delhi"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none"
          />
        </div>

        {/* Site ID */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Site ID <span className="text-red-500">*</span>
          </label>
          <input
            required
            value={siteId}
            onChange={(e) => { setSiteIdManual(true); setSiteId(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')) }}
            placeholder="e.g. gonex-delhi"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm font-mono focus:border-indigo-500 focus:outline-none"
          />
          <p className="mt-1.5 text-xs text-gray-500">
            Used as <code className="bg-gray-100 px-1 rounded">VITE_SITE_ID</code> in the client deployment. Lowercase, hyphens only. Cannot be changed later.
          </p>
        </div>

        <button
          type="submit"
          disabled={submitting || !name || !siteId || !template}
          className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitting ? 'Creating...' : 'Create Project'}
        </button>
      </form>
    </div>
  )
}
