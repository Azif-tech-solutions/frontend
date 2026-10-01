import { useState, useCallback } from 'react'
import { Navigate, useNavigate, useLocation } from 'react-router-dom'
import { useStore } from './app/store.jsx'
import { IconButton } from './ds/components/core/IconButton.jsx'
import SignIn from './app/SignIn'
import SignUp from './app/SignUp'
import Onboarding from './app/Onboarding'
import Sidebar from './app/Sidebar'
import Toast from './app/Toast'
import Placeholder from './app/shells/Placeholder.jsx'
import { screens } from './app/screens'
import { navById, moduleById, parentLabelById } from './app/nav'
import { NavProvider } from './app/navContext.jsx'
import { initials } from './app/utils.js'

// location.state is structured-cloned by the History API; a function or React
// element inside a target would throw. Strip to plain data.
const toPlain = (v) => {
  try { return JSON.parse(JSON.stringify(v)) } catch { return null }
}

/** URL → the same three values the old useState calls held. */
function resolveRoute(pathname, state) {
  const params = state?.params || {}
  const segs = pathname.split('/').filter(Boolean)
  if (!segs.length) return { activeId: 'overview', offNavLeaf: null, params, param: undefined }

  const [first, second, third, ...rest] = segs
  if (rest.length) return null
  const dec = (s) => (s == null ? undefined : decodeURIComponent(s))

  if (first === 'view') {
    if (!second) return null
    const view = decodeURIComponent(second)
    const leaf = state?.leaf || { id: view, view, label: view } // direct-link fallback
    return { activeId: leaf.id ?? view, offNavLeaf: leaf, params, param: dec(third) }
  }

  if (third) return null
  if (navById[first]) return { activeId: first, offNavLeaf: null, params, param: dec(second) }
  return null
}

export default function App() {
  const { loggedIn, company } = useStore()
  const routerNavigate = useNavigate()
  const { pathname, state } = useLocation()
  const [navOpen, setNavOpen] = useState(false)
  console.log(`pathname: ${pathname}`)
  console.log(`state: ${JSON.stringify(state)}`)
  console.log(`Company: ${JSON.stringify(company)}`)
  // Same signature and semantics as before.
  const navigate = useCallback((target) => {
  const id = target.id ?? 'overview'
  const inNav = !!navById[id]
  const base = id === 'overview'
    ? '/'
    : inNav
      ? `/${id}`
      : `/view/${encodeURIComponent(target.view ?? id)}`
  const suffix = id !== 'overview' && target.param != null
    ? `/${encodeURIComponent(String(target.param))}`
    : ''
  routerNavigate(base + suffix, {
    state: { params: toPlain(target.params) || {}, leaf: inNav ? null : toPlain(target) },
  })
  setNavOpen(false)
}, [routerNavigate])

  // ── Auth gate (all hooks are above, so early returns are safe) ──
  if (!loggedIn) {
    if (pathname === '/signin') return <><SignIn onSwitch={() => routerNavigate('/signup')} /><Toast /></>
    if (pathname === '/signup') return <><SignUp onSwitch={() => routerNavigate('/signin')} /><Toast /></>
    return <Navigate to="/signin" replace />
  }
  if (pathname === '/signin' || pathname === '/signup') return <Navigate to="/" replace />

  // Onboarding gate stays state-driven and keeps whatever URL the user is on.
  if (!company.onboarded) return <><Onboarding /><Toast /></>

  const route = resolveRoute(pathname, state)
  if (!route) return <Navigate to="/" replace />
const { activeId, offNavLeaf, params, param } = route
  // const { activeId, offNavLeaf, params } = route
  const leaf = navById[activeId] || offNavLeaf
  const moduleLabel = leaf?.moduleId ? moduleById[leaf.moduleId]?.label : undefined
  const parentLabel = parentLabelById[activeId]
  const Screen = screens[leaf?.view]
  
  return (
    
    <NavProvider value={navigate}>
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 'var(--topbar-h)', padding: '0 16px', borderBottom: '1px solid var(--border-default)', background: 'var(--surface-page)', flex: '0 0 auto' }}>
        <IconButton className="app-hamburger" icon="menu" label="Toggle menu" onClick={() => setNavOpen((v) => !v)} style={{ display: 'none' }} />
        <span style={{ display: 'grid', placeItems: 'center', width: 28, height: 28, borderRadius: 'var(--radius-md)', background: 'var(--brand)', color: '#fff', flex: '0 0 auto', font: 'var(--fw-bold) var(--text-2xs)/1 var(--font-mono)' }}>{initials(company.name)}</span>
        <span style={{ font: 'var(--fw-bold) var(--text-md)/1 var(--font-ui)', letterSpacing: 'var(--ls-tight)', color: 'var(--text-strong)', whiteSpace: 'nowrap' }}>{company.name || 'Company'}</span>
        <span style={{ width: 1, height: 18, background: 'var(--border-default)', flex: '0 0 auto' }} />
        <span style={{ font: 'var(--fw-semibold) var(--text-md)/1 var(--font-ui)', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{leaf?.label}</span>
      </div>

      <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        <div className={`app-scrim ${navOpen ? 'open' : ''}`} onClick={() => setNavOpen(false)} />
        <Sidebar activeId={activeId} onNavigate={navigate} open={navOpen} />
        <main style={{ flex: 1, minWidth: 0, overflow: 'auto', background: 'var(--surface-sunken)' }}>
         {Screen
          ? <Screen
              key={`${activeId}:${param ?? ''}`}
              onNavigate={navigate} leaf={leaf} moduleLabel={moduleLabel} parentLabel={parentLabel}
              {...(leaf?.params || {})} {...params}
              routeParam={param}
            />
          : <Placeholder key={activeId} leaf={leaf} moduleLabel={moduleLabel} parentLabel={parentLabel} />}
        </main>
      </div>
      <Toast />
    </div>
    </NavProvider>
  )
}
