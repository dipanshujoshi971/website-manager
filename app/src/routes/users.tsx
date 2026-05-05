import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { api, ROLES, ROLE_LABELS, type ManagedUser, type Role, type Site } from '@/lib/api'
import { useCurrentUser } from '@/lib/auth-context'
import { toast } from 'sonner'
import { KeyRound, Loader2, Plus, Trash2, X } from 'lucide-react'

export const Route = createFileRoute('/users')({
  component: UsersPage,
})

function UsersPage() {
  const me = useCurrentUser()
  const navigate = useNavigate()
  const [users, setUsers] = useState<ManagedUser[]>([])
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [editingSitesFor, setEditingSitesFor] = useState<ManagedUser | null>(null)
  const [resettingPwFor, setResettingPwFor] = useState<ManagedUser | null>(null)

  useEffect(() => {
    if (me && me.role !== 'super_admin') {
      toast.error('Only super admins can manage users')
      navigate({ to: '/' })
    }
  }, [me, navigate])

  const refresh = async () => {
    setLoading(true)
    try {
      const [u, s] = await Promise.all([api.listUsers(), api.listSites()])
      setUsers(u)
      setSites(s)
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { refresh() }, [])

  if (!me || me.role !== 'super_admin') return null

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" /> New User
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3 font-medium">Username</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Sites</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{u.username}</td>
                  <td className="px-4 py-3">
                    <RolePill role={u.role} />
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {u.role === 'super_admin' || u.role === 'admin'
                      ? <span className="text-xs text-gray-400 italic">all</span>
                      : u.sites.length
                        ? <span className="text-xs">{u.sites.join(', ')}</span>
                        : <span className="text-xs text-gray-400">none</span>}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {u.role === 'site_owner' && (
                        <button
                          onClick={() => setEditingSitesFor(u)}
                          className="px-2 py-1 text-xs rounded hover:bg-gray-100 text-gray-700"
                        >
                          Sites
                        </button>
                      )}
                      <button
                        onClick={() => setResettingPwFor(u)}
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-500"
                        title="Reset password"
                      >
                        <KeyRound className="h-4 w-4" />
                      </button>
                      {u.id !== me.id && (
                        <button
                          onClick={async () => {
                            if (!confirm(`Delete user "${u.username}"?`)) return
                            try {
                              await api.deleteUser(u.id)
                              toast.success('User deleted')
                              refresh()
                            } catch (e: any) { toast.error(e.message) }
                          }}
                          className="p-1.5 rounded hover:bg-red-50 text-red-500"
                          title="Delete user"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-sm text-gray-500">No users yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showCreate && (
        <CreateUserModal
          sites={sites}
          onClose={() => setShowCreate(false)}
          onCreated={() => { setShowCreate(false); refresh() }}
        />
      )}

      {editingSitesFor && (
        <AssignSitesModal
          user={editingSitesFor}
          sites={sites}
          onClose={() => setEditingSitesFor(null)}
          onSaved={() => { setEditingSitesFor(null); refresh() }}
        />
      )}

      {resettingPwFor && (
        <ResetPasswordModal
          user={resettingPwFor}
          onClose={() => setResettingPwFor(null)}
          onSaved={() => setResettingPwFor(null)}
        />
      )}
    </div>
  )
}

function RolePill({ role }: { role: Role }) {
  const colors: Record<Role, string> = {
    super_admin: 'bg-purple-50 text-purple-700 border-purple-200',
    admin: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    site_owner: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  }
  return (
    <span className={`text-xs font-medium border rounded-full px-2 py-0.5 ${colors[role]}`}>
      {ROLE_LABELS[role]}
    </span>
  )
}

function ModalShell({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

function CreateUserModal({ sites, onClose, onCreated }: { sites: Site[]; onClose: () => void; onCreated: () => void }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<Role>('site_owner')
  const [selectedSites, setSelectedSites] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.createUser({
        username: username.trim(),
        password,
        role,
        sites: role === 'site_owner' ? selectedSites : undefined,
      })
      toast.success('User created')
      onCreated()
    } catch (e: any) { toast.error(e.message) } finally { setSubmitting(false) }
  }

  return (
    <ModalShell title="New User" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Username">
          <input
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
          />
        </Field>
        <Field label="Password" hint="Min 8 characters">
          <input
            required
            type="password"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
          />
        </Field>
        <Field label="Role">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
          >
            {ROLES.map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
          </select>
        </Field>
        {role === 'site_owner' && (
          <Field label="Assigned Sites" hint="Site owner can only access these sites">
            <SitePicker sites={sites} selected={selectedSites} onChange={setSelectedSites} />
          </Field>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Create User
        </button>
      </form>
    </ModalShell>
  )
}

function AssignSitesModal({ user, sites, onClose, onSaved }: {
  user: ManagedUser; sites: Site[]; onClose: () => void; onSaved: () => void
}) {
  const [selected, setSelected] = useState<string[]>(user.sites)
  const [saving, setSaving] = useState(false)

  async function save() {
    setSaving(true)
    try {
      await api.setUserSites(user.id, selected)
      toast.success('Sites updated')
      onSaved()
    } catch (e: any) { toast.error(e.message) } finally { setSaving(false) }
  }

  return (
    <ModalShell title={`Sites for ${user.username}`} onClose={onClose}>
      <SitePicker sites={sites} selected={selected} onChange={setSelected} />
      <div className="flex gap-2 mt-4">
        <button onClick={onClose} className="flex-1 rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          Cancel
        </button>
        <button
          onClick={save}
          disabled={saving}
          className="flex-1 rounded-lg bg-indigo-600 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          Save
        </button>
      </div>
    </ModalShell>
  )
}

function ResetPasswordModal({ user, onClose, onSaved }: {
  user: ManagedUser; onClose: () => void; onSaved: () => void
}) {
  const [password, setPassword] = useState('')
  const [saving, setSaving] = useState(false)

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await api.updateUser(user.id, { password })
      toast.success('Password updated')
      onSaved()
    } catch (e: any) { toast.error(e.message) } finally { setSaving(false) }
  }

  return (
    <ModalShell title={`Reset password for ${user.username}`} onClose={onClose}>
      <form onSubmit={save} className="space-y-4">
        <Field label="New password" hint="Min 8 characters">
          <input
            required
            type="password"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
          />
        </Field>
        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          Update Password
        </button>
      </form>
    </ModalShell>
  )
}

function SitePicker({ sites, selected, onChange }: {
  sites: Site[]; selected: string[]; onChange: (s: string[]) => void
}) {
  const set = useMemo(() => new Set(selected), [selected])
  function toggle(siteId: string) {
    const next = new Set(set)
    if (next.has(siteId)) next.delete(siteId)
    else next.add(siteId)
    onChange(Array.from(next))
  }
  if (sites.length === 0) {
    return <p className="text-xs text-gray-500 italic">No sites yet.</p>
  }
  return (
    <div className="max-h-64 overflow-auto rounded-lg border border-gray-200 divide-y divide-gray-100">
      {sites.map((s) => (
        <label key={s.siteId} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer">
          <input
            type="checkbox"
            checked={set.has(s.siteId)}
            onChange={() => toggle(s.siteId)}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900">{s.name}</div>
            <div className="text-xs text-gray-500 font-mono">{s.siteId}</div>
          </div>
        </label>
      ))}
    </div>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    </div>
  )
}
