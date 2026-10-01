
//Toast.jsx
import { useEffect } from 'react'
import { Toast as DSToast } from '../ds/components/feedback/Toast.jsx'
import { useStore } from './store.jsx'

export default function Toast() {
  const { toast, clearToast } = useStore()

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(clearToast, 3200)
    return () => clearTimeout(t)
  }, [toast, clearToast])

  if (!toast) return null
  return (
    <div style={{ position: 'fixed', left: 20, bottom: 20, zIndex: 60 }} role="status" aria-live="polite">
      <DSToast tone={toast.err ? 'danger' : 'success'} onDismiss={clearToast}>
        {toast.msg}{toast.sub ? ` — ${toast.sub}` : ''}
      </DSToast>
    </div>
  )
}
