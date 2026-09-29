import { useState } from 'react'
import { Button } from '../ds/components/core/Button.jsx'
import { Input } from '../ds/components/forms/Input.jsx'
import AuthShell from './AuthShell.jsx'
import { useStore } from './store.jsx'

export default function SignIn({ onSwitch }) {
  const { signIn } = useStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})

  const submit = () => {
    const e = {}
    if (!email.trim()) e.email = 'Email is requaaired'
    if (!password) e.password = 'Password is required'
    setErrors(e)
    if (Object.keys(e).length) return
    signIn({ email })
  }

  return (
    <AuthShell
      caption="Run your business with clarity."
      captionSub="Track stock, branches and factories in one place — built for teams who'd rather spend time on the work than the paperwork.">
      <div style={{ font: 'var(--type-h3)', letterSpacing: 'var(--ls-tight)', color: 'var(--text-strong)', marginBottom: 6 }}>Sign in</div>
      <div style={{ font: 'var(--type-body)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: 28 }}>Welcome back — enter your details to continue.</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Input label="Work email" size="lg" type="email" iconLeft="mail" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" error={errors.email} />
        <div>
          <Input label="Password" size="lg" type="password" iconLeft="lock" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" error={errors.password} onKeyDown={(e) => e.key === 'Enter' && submit()} />
          <div style={{ textAlign: 'right', marginTop: 8 }}>
            <a href="#" onClick={(e) => e.preventDefault()} style={{ font: 'var(--type-caption)' }}>Forgot password?</a>
          </div>
        </div>
        <Button size="lg" fullWidth onClick={submit} style={{ marginTop: 6 }}>Sign in</Button>
      </div>

      <div style={{ textAlign: 'center', marginTop: 20, font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
        Don't have an account?{' '}
        <button onClick={onSwitch} style={{ background: 'none', border: 'none', padding: 0, color: 'var(--text-link)', font: 'inherit', fontWeight: 600, cursor: 'pointer' }}>Sign up</button>
      </div>
    </AuthShell>
  )
}
