import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import { api, auth as authStore, setUnauthorizedHandler, type AuthUser } from './api'

type AuthState =
  | { status: 'loading' }
  | { status: 'authed'; user: AuthUser; sites: string[] }
  | { status: 'guest' }

interface AuthContextValue {
  state: AuthState
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: 'loading' })

  const refresh = useCallback(async () => {
    if (!authStore.getToken()) {
      setState({ status: 'guest' })
      return
    }
    try {
      const { user, sites } = await api.me()
      setState({ status: 'authed', user, sites })
    } catch {
      authStore.clear()
      setState({ status: 'guest' })
    }
  }, [])

  useEffect(() => {
    setUnauthorizedHandler(() => setState({ status: 'guest' }))
    refresh()
  }, [refresh])

  const login = useCallback(async (username: string, password: string) => {
    const { token, user } = await api.login(username, password)
    authStore.setToken(token)
    // Fetch full me payload (includes mapped sites) right after login.
    try {
      const me = await api.me()
      setState({ status: 'authed', user: me.user, sites: me.sites })
    } catch {
      setState({ status: 'authed', user, sites: [] })
    }
  }, [])

  const logout = useCallback(() => {
    // Best-effort revoke of the server-side session; ignore errors so logout always works.
    api.logout().catch(() => {})
    authStore.clear()
    setState({ status: 'guest' })
  }, [])

  return (
    <AuthContext.Provider value={{ state, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

export function useCurrentUser(): AuthUser | null {
  const { state } = useAuth()
  return state.status === 'authed' ? state.user : null
}
