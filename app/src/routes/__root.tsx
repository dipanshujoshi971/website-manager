import { createRootRoute, Outlet, Link, useLocation, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { LayoutDashboard, LogOut, Plus, Users } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { ROLE_LABELS } from '@/lib/api'

export const Route = createRootRoute({
  component: Root,
})

function Root() {
  const { pathname } = useLocation()
  const { state, logout } = useAuth()
  const navigate = useNavigate()

  // /login and /preview/:siteId render outside the chrome and don't require auth.
  const isPublicRoute = pathname === '/login' || pathname.startsWith('/preview/')

  useEffect(() => {
    if (isPublicRoute) return
    if (state.status === 'guest') navigate({ to: '/login' })
  }, [state.status, isPublicRoute, navigate])

  if (isPublicRoute) {
    return (
      <>
        <Outlet />
      </>
    )
  }

  if (state.status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-sm text-gray-500">Loading…</div>
      </div>
    )
  }

  if (state.status !== 'authed') {
    // Effect above will redirect; render nothing in the meantime.
    return null
  }

  const { user } = state
  const canCreateProject = user.role === 'super_admin' || user.role === 'admin'
  const canManageUsers = user.role === 'super_admin'

  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-6 shrink-0">
        <Link to="/" className="flex items-center gap-2 font-bold text-gray-900 text-lg">
          <span className="text-indigo-600">⬡</span> Gonex Builder
        </Link>
        <div className="flex items-center gap-3">
          {canCreateProject && (
            <Link
              to="/projects/new"
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
            >
              <Plus className="h-4 w-4" /> New Project
            </Link>
          )}
          <div className="flex items-center gap-2 text-sm">
            <div className="text-right leading-tight">
              <div className="font-medium text-gray-900">{user.username}</div>
              <div className="text-xs text-gray-500">{ROLE_LABELS[user.role]}</div>
            </div>
            <button
              onClick={() => { logout(); navigate({ to: '/login' }) }}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-52 border-r border-gray-200 bg-white p-3 shrink-0">
          <nav className="space-y-1">
            <SideLink to="/" icon={<LayoutDashboard className="h-4 w-4" />} label="All Projects" active={pathname === '/'} />
            {canManageUsers && (
              <SideLink to="/users" icon={<Users className="h-4 w-4" />} label="Users" active={pathname.startsWith('/users')} />
            )}
          </nav>
        </aside>
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function SideLink({ to, icon, label, active }: { to: string; icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        active ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      {icon} {label}
    </Link>
  )
}
