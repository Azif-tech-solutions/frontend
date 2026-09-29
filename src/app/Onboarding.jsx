import { useState } from 'react'
import { Icon } from '../ds/components/core/Icon.jsx'
import { Button } from '../ds/components/core/Button.jsx'
import { Input } from '../ds/components/forms/Input.jsx'
import { Dropdown } from './Dropdown.jsx'
import { useStore } from './store.jsx'
import { countries } from './countries.js'

const STEPS = [
  { id: 1, label: 'Company details' },
  { id: 2, label: 'First branch' },
  { id: 3, label: 'First factory' },
  { id: 4, label: 'Review' },
]

const LAST_STEP = STEPS.length

const countryOptions = countries.map((c) => ({ value: c.code, label: `${c.name} (${c.dial})` }))

function PhoneField({ label, countryCode, onCountryChange, number, onNumberChange, error }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 12, alignItems: 'end' }}>
      <Dropdown label={label} size="lg" value={countryCode} onChange={onCountryChange} options={countryOptions} placeholder="Country" />
      <Input size="lg" value={number} onChange={onNumberChange} placeholder="555 010 2200" error={error} />
    </div>
  )
}

export default function Onboarding() {
  const { completeOnboarding } = useStore()
  const [step, setStep] = useState(1)

  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [phoneCountry, setPhoneCountry] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [errors, setErrors] = useState({})

  const [branchName, setBranchName] = useState('')
  const [branchNumber, setBranchNumber] = useState('')

  const [factoryName, setFactoryName] = useState('')
  const [factoryCode, setFactoryCode] = useState('')

  const validateCompany = () => {
    const e = {}
    if (!name.trim()) e.name = 'Company name is required'
    if (!address.trim()) e.address = 'Company address is required'
    if (!phoneCountry || !phoneNumber.trim()) e.phone = 'Company phone number is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const goNext = () => {
    if (step === 1) { if (!validateCompany()) return }
    setStep((s) => Math.min(LAST_STEP, s + 1))
  }
  const goBack = () => setStep((s) => Math.max(1, s - 1))
  const skipBranch = () => {
    setBranchName(''); setBranchNumber('')
    setStep(3)
  }
  const skipFactory = () => {
    setFactoryName(''); setFactoryCode('')
    setStep(4)
  }

  const phoneDial = countries.find((c) => c.code === phoneCountry)?.dial || ''
  const phone = `${phoneDial} ${phoneNumber.trim()}`.trim()

  const finish = () => {
    if (!validateCompany()) { setStep(1); return }
    completeOnboarding(
      { name: name.trim(), address: address.trim(), phone },
      { name: branchName, number: branchNumber },
      { name: factoryName, code: factoryCode },
    )
  }

  const hasBranch = branchName.trim() || branchNumber.trim()
  const hasFactory = !!factoryName.trim()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gradient-warm-wash)', padding: '32px 20px' }}>
      <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-panel)', boxShadow: 'var(--shadow-lg)', padding: '34px 36px', maxWidth: 560, width: '100%', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <span style={{ display: 'grid', placeItems: 'center', width: 40, height: 40, borderRadius: 'var(--radius-lg)', background: 'var(--brand)', color: '#fff', flex: '0 0 auto' }}>
            <Icon name="building-2" size={19} color="#fff" />
          </span>
          <div>
            <div style={{ font: 'var(--type-h3)', letterSpacing: 'var(--ls-tight)', color: 'var(--text-strong)', marginBottom: 5 }}>Set up your company</div>
            <div style={{ font: 'var(--type-body)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>A few details to get your account ready — you can always add more later.</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          {STEPS.map((s, i) => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 8, flex: i < STEPS.length - 1 ? 1 : 'none' }}>
              <span style={{
                width: 24, height: 24, borderRadius: 'var(--radius-full)', display: 'grid', placeItems: 'center',
                font: 'var(--fw-semibold) var(--text-xs)/1 var(--font-ui)', flex: '0 0 auto',
                border: `1.5px solid ${s.id <= step ? 'var(--brand)' : 'var(--border-strong)'}`,
                background: s.id < step ? 'var(--brand)' : 'transparent',
                color: s.id < step ? '#fff' : s.id === step ? 'var(--brand)' : 'var(--text-subtle)',
              }}>{s.id < step ? <Icon name="check" size={12} strokeWidth={2.4} color="#fff" /> : s.id}</span>
              <span style={{ font: 'var(--fw-semibold) var(--text-xs)/1 var(--font-ui)', color: s.id <= step ? 'var(--text-strong)' : 'var(--text-subtle)', whiteSpace: 'nowrap' }}>{s.label}</span>
              {i < STEPS.length - 1 && <span style={{ flex: 1, height: 1, background: 'var(--border-default)', margin: '0 4px' }} />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input label="Company name" size="lg" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ridgeway Manufacturing Ltd" error={errors.name} />
            <Input label="Company address" size="lg" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street, city, state" error={errors.address} />
            <PhoneField label="Company phone number" countryCode={phoneCountry} onCountryChange={setPhoneCountry} number={phoneNumber} onNumberChange={(e) => setPhoneNumber(e.target.value)} error={errors.phone} />
          </div>
        )}

        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', background: 'var(--surface-sunken)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '11px 13px', lineHeight: 1.5 }}>
              Optional — skip this and we'll treat <b style={{ color: 'var(--text-strong)' }}>{name || 'your company'}</b> itself as your single primary location. You can add branches anytime from Settings.
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Input label="Branch name" size="lg" value={branchName} onChange={(e) => setBranchName(e.target.value)} placeholder="e.g. Downtown Branch" />
              <Input label="Branch number / contact" size="lg" value={branchNumber} onChange={(e) => setBranchNumber(e.target.value)} placeholder="e.g. +1 555 010 2201" />
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', background: 'var(--surface-sunken)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '11px 13px', lineHeight: 1.5 }}>
              A factory is what stock, recipes and production runs are recorded against — nothing in the Factory module
              can be used until one exists. Add your first one now, or create it later from <b style={{ color: 'var(--text-strong)' }}>Factory › Factories</b>.
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px', gap: 14 }}>
              <Input label="Factory name" size="lg" value={factoryName} onChange={(e) => setFactoryName(e.target.value)} placeholder="e.g. Ridgeway Factory A" />
              <Input label="Factory code" size="lg" value={factoryCode} onChange={(e) => setFactoryCode(e.target.value)} placeholder="e.g. FA" />
            </div>
          </div>
        )}

        {step === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <div style={{ font: 'var(--type-eyebrow)', letterSpacing: 'var(--ls-widest)', textTransform: 'uppercase', color: 'var(--text-subtle)', marginBottom: 4 }}>Company</div>
              {[['Name', name], ['Address', address], ['Phone', phone]].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: '9px 0', borderTop: '1px solid var(--border-subtle)', font: 'var(--type-ui)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{k}</span><span style={{ fontWeight: 600, color: 'var(--text-strong)', textAlign: 'right' }}>{v}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{ font: 'var(--type-eyebrow)', letterSpacing: 'var(--ls-widest)', textTransform: 'uppercase', color: 'var(--text-subtle)', marginBottom: 4 }}>First branch</div>
              {hasBranch ? (
                [['Name', branchName || '—'], ['Number', branchNumber || '—']].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: '9px 0', borderTop: '1px solid var(--border-subtle)', font: 'var(--type-ui)' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{k}</span><span style={{ fontWeight: 600, color: 'var(--text-strong)', textAlign: 'right' }}>{v}</span>
                  </div>
                ))
              ) : (
                <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>No branch added — {name || 'your company'} will be treated as the primary/single location.</div>
              )}
            </div>
            <div>
              <div style={{ font: 'var(--type-eyebrow)', letterSpacing: 'var(--ls-widest)', textTransform: 'uppercase', color: 'var(--text-subtle)', marginBottom: 4 }}>First factory</div>
              {hasFactory ? (
                [['Name', factoryName], ['Code', factoryCode || '—']].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: '9px 0', borderTop: '1px solid var(--border-subtle)', font: 'var(--type-ui)' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{k}</span><span style={{ fontWeight: 600, color: 'var(--text-strong)', textAlign: 'right' }}>{v}</span>
                  </div>
                ))
              ) : (
                <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>No factory added — create one from Factory › Factories before registering stock.</div>
              )}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {step > 1 ? <Button variant="secondary" size="lg" onClick={goBack}>Back</Button> : <span />}
          <div style={{ display: 'flex', gap: 10 }}>
            {step === 2 && <Button variant="ghost" size="lg" onClick={skipBranch}>Skip this step</Button>}
            {step === 3 && <Button variant="ghost" size="lg" onClick={skipFactory}>Skip this step</Button>}
            {step < LAST_STEP
              ? <Button size="lg" iconRight="chevron-right" onClick={goNext}>Continue</Button>
              : <Button size="lg" iconLeft="check" onClick={finish}>Complete setup</Button>}
          </div>
        </div>
      </div>
    </div>
  )
}
