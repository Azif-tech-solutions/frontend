import { useState } from 'react'
import { Button } from '../ds/components/core/Button.jsx'
import { Input } from '../ds/components/forms/Input.jsx'
import AuthShell from './AuthShell.jsx'
import { useStore } from './store.jsx'
import AuthApi from '../api/AuthApi.ts'
import Loader from '../ds/components/core/Loader.jsx'
const authApi = new AuthApi()

export default function SignIn({ onSwitch }) {
  const { signIn,showToast } = useStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  
  // const submit = () => {
  //   const e = {}
  //   if (!email.trim()) e.email = 'Email is requaaired'
  //   if (!password) e.password = 'Password is required'
  //   setErrors(e)
  //   if (Object.keys(e).length) return
  //   signIn({ email })
  // }

  const [loading, setLoading] = useState(false)

  const submit = async () => {
    const e = {}
    if (!email.trim()) e.email = 'Email is required'
    if (!password) e.password = 'Password is required'
    setErrors(e)
    if (Object.keys(e).length) return

    setLoading(true)
    try {
      const data = await authApi.login({ email, password })
      
      console.log(`login data: ${JSON.stringify(data)}`)
      // data.data.
      signIn({ email, userId: data.data.userId, tenantId: data.data.activeTenantId })
    } catch (err) {
      // console.log('login error')
      // console.log(err)
      // showToast(err)
      showToast('Login failed', err.message, true)
      setErrors({ password: err.status === 401 ? 'Invalid email or dpassword' : err.message })
    } finally {
      setLoading(false)
    }
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
        {loading && <Loader label="Signing in..."   />}
        {loading ? null : <Button size="lg" fullWidth onClick={submit} style={{ marginTop: 6 }}>Sign in</Button>}
      </div>
      <div style={{ textAlign: 'center', marginTop: 20, font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
        Don't have an account?{' '}
        <button onClick={onSwitch} style={{ background: 'none', border: 'none', padding: 0, color: 'var(--text-link)', font: 'inherit', fontWeight: 600, cursor: 'pointer' }}>Sign upp...</button>
      </div>
    </AuthShell>
  )
}
