import authHero from '../assets/auth-hero.jpg'
import logoMark from '../assets/logo-mark.svg'

export default function AuthShell({ children, caption, captionSub }) {
  return (
    <div className="auth-shell" style={{ display: 'flex', height: '100vh' }}>
      <div className="auth-form" style={{ flex: '0 0 500px', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 64px', overflowY: 'auto' }}>
        <div style={{ maxWidth: 360, margin: '0 auto', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 44 }}>
            <img src={logoMark} alt="" style={{ width: 40, height: 40, borderRadius: 'var(--radius-lg)', display: 'block' }} />
            <span style={{ font: 'var(--fw-bold) var(--text-lg)/1 var(--font-ui)', letterSpacing: 'var(--ls-tight)', color: 'var(--text-strong)' }}>Zif iQ</span>
          </div>

          {children}

          <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: 32, paddingTop: 20, textAlign: 'center' }}>
            <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', lineHeight: 1.6 }}>
              By continuing, you agree to our{' '}
              <a href="#" onClick={(e) => e.preventDefault()}>Terms of Service</a> and{' '}
              <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>.
            </div>
          </div>
        </div>
      </div>

      <div className="auth-visual" style={{ flex: 1, position: 'relative', overflow: 'hidden', background: 'var(--surface-shell)' }}>
        <img src={authHero} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'var(--gradient-protect-b)' }} />
        <div style={{ position: 'absolute', left: 48, right: 48, bottom: 52, color: '#fff' }}>
          <div style={{ font: 'var(--type-h2)', letterSpacing: 'var(--ls-tight)', marginBottom: 10 }}>{caption}</div>
          <div style={{ font: 'var(--type-body)', color: 'rgba(255,255,255,.85)', maxWidth: 420 }}>{captionSub}</div>
        </div>
      </div>
    </div>
  )
}
