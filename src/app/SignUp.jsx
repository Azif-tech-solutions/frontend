import { useState } from 'react'
import { Button } from '../ds/components/core/Button.jsx'
import { Input } from '../ds/components/forms/Input.jsx'
import AuthShell from './AuthShell.jsx'
import { useStore } from './store.jsx'

export default function SignUp({ onSwitch }) {
  const { signUp } = useStore()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState({})

  const submit = () => {
    const e = {}
    if (!name.trim()) e.name = 'Your name is required'
    if (!email.trim()) e.email = 'Email is required'
    if (!password) e.password = 'Password is required'
    else if (password.length < 8) e.password = 'Use at least 8 characters'
    if (confirm !== password) e.confirm = "Passwords don't match"
    setErrors(e)
    if (Object.keys(e).length) return
    signUp({ name, email })
  }

  return (
    <AuthShell
      caption="Set up your workspace in minutes."
      captionSub="Register factories, track stock by variant, and keep every branch on the same numbers.">
      <div style={{ font: 'var(--type-h3)', letterSpacing: 'var(--ls-tight)', color: 'var(--text-strong)', marginBottom: 6 }}>Create your account</div>
      <div style={{ font: 'var(--type-body)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: 28 }}>Start with your details — you'll set up your company next.</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Input label="Your full name" size="lg" iconLeft="user" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. C. Eze" error={errors.name} hint="Shown on every record you create." />
        <Input label="Work email" size="lg" type="email" iconLeft="mail" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" error={errors.email} />
        <Input label="Password" size="lg" type="password" iconLeft="lock" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" error={errors.password} />
        <Input label="Confirm password" size="lg" type="password" iconLeft="lock" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Re-enter your password" error={errors.confirm} onKeyDown={(e) => e.key === 'Enter' && submit()} />
        <Button size="lg" fullWidth onClick={submit} style={{ marginTop: 6 }}>Create account</Button>
      </div>

      <div style={{ textAlign: 'center', marginTop: 20, font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
        Already have an account?{' '}
        <button onClick={onSwitch} style={{ background: 'none', border: 'none', padding: 0, color: 'var(--text-link)', font: 'inherit', fontWeight: 600, cursor: 'pointer' }}>Sign in</button>
      </div>
    </AuthShell>
  )
}
