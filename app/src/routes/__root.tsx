import { createRootRoute, Outlet, Link, useLocation } from '@tanstack/react-router'
import { LayoutDashboard, Plus } from 'lucide-react'

export const Route = createRootRoute({
  component: Root,
})

function Root() {
  const { pathname } = useLocation()

  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-6 shrink-0">
        <Link to="/" className="flex items-center gap-2 font-bold text-gray-900 text-lg">
          <span className="text-indigo-600">⬡</span> Gonex Builder
        </Link>
        <Link
          to="/projects/new"
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4" /> New Project
        </Link>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-52 border-r border-gray-200 bg-white p-3 shrink-0">
          <nav className="space-y-1">
            <SideLink to="/" icon={<LayoutDashboard className="h-4 w-4" />} label="All Projects" active={pathname === '/'} />
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
