import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { api, type ContactSubmission, type Site } from '@/lib/api'
import { toast } from 'sonner'
import { Loader2, Mail, Phone, MailOpen } from 'lucide-react'

export const Route = createFileRoute('/projects/$siteId/submissions')({
  component: Submissions,
})

function Submissions() {
  const { siteId } = Route.useParams()
  const [site, setSite] = useState<Site | null>(null)
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.getSite(siteId), api.getSubmissions(siteId)])
      .then(([s, rows]) => { setSite(s); setSubmissions(rows) })
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false))
  }, [siteId])

  async function markRead(id: string) {
    try {
      const updated = await api.markRead(siteId, id)
      setSubmissions((prev) => prev.map((s) => s.id === id ? updated : s))
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-6 w-6 animate-spin text-indigo-600" /></div>

  const unread = submissions.filter((s) => !s.read).length

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Submissions</h1>
          <p className="text-sm text-gray-500">{site?.name} · {submissions.length} total{unread > 0 ? `, ${unread} unread` : ''}</p>
        </div>
      </div>

      {submissions.length === 0 ? (
        <div className="text-center text-gray-500 text-sm py-16">No submissions yet.</div>
      ) : (
        <div className="space-y-3">
          {submissions.map((sub) => (
            <div
              key={sub.id}
              className={`bg-white rounded-xl border p-5 ${sub.read ? 'border-gray-200' : 'border-indigo-200 bg-indigo-50/30'}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {!sub.read && <span className="h-2 w-2 rounded-full bg-indigo-500 shrink-0" />}
                    <h3 className="font-semibold text-gray-900 truncate">{sub.fullName}</h3>
                    <span className="text-xs text-gray-400 shrink-0">
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-700 mb-1">{sub.subject}</p>
                  <p className="text-sm text-gray-600 line-clamp-2">{sub.message}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1 text-xs text-gray-500"><Mail className="h-3 w-3" />{sub.email}</span>
                    {sub.phone && <span className="flex items-center gap-1 text-xs text-gray-500"><Phone className="h-3 w-3" />{sub.phone}</span>}
                  </div>
                </div>
                {!sub.read && (
                  <button
                    onClick={() => markRead(sub.id)}
                    className="shrink-0 flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                  >
                    <MailOpen className="h-3.5 w-3.5" /> Mark read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
