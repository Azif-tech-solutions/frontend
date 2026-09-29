import { useState } from 'react'
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

export default function App() {
  const { loggedIn, company } = useStore()
  const [authView, setAuthView] = useState('signin')
  const [activeId, setActiveId] = useState('overview')
  // Targets that live outside the nav tree (quick actions, in-screen drill-downs)
  // carry their own leaf so the screen registry can still resolve them.
  const [offNavLeaf, setOffNavLeaf] = useState(null)
  const [params, setParams] = useState({})
  const [navOpen, setNavOpen] = useState(false)

  if (!loggedIn) {
    return (
      <>
        {authView === 'signin'
          ? <SignIn onSwitch={() => setAuthView('signup')} />
          : <SignUp onSwitch={() => setAuthView('signin')} />}
        <Toast />
      </>
    )
  }

  if (!company.onboarded) return <><Onboarding /><Toast /></>

  function navigate(target) {
    const id = target.id ?? 'overview'
    setActiveId(id)
    setOffNavLeaf(navById[id] ? null : target)
    setParams(target.params || {})
    setNavOpen(false)
  }

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
            ? <Screen key={activeId} onNavigate={navigate} leaf={leaf} moduleLabel={moduleLabel} parentLabel={parentLabel} {...(leaf?.params || {})} {...params} />
            : <Placeholder key={activeId} leaf={leaf} moduleLabel={moduleLabel} parentLabel={parentLabel} />}
        </main>
      </div>
      <Toast />
    </div>
    </NavProvider>
  )
}
