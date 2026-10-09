import { useState, useEffect } from 'react'
import { Icon } from '../ds/components/core/Icon.jsx'
import { Button } from '../ds/components/core/Button.jsx'
import { Input } from '../ds/components/forms/Input.jsx'
import { Dropdown } from './Dropdown.jsx'
import { useStore } from './store.jsx'
import { countries } from './countries.js'
import FactoryApi from '../api/FactoryApi.js'
import Loader from '../ds/components/core/Loader.jsx'
import InvoiceApi from '../api/InvoiceApi.js'
import SettingsApi from '../api/SettingsApi.js'

const factoryApi = new FactoryApi()
const settingsApi = new SettingsApi()
const invoiceApi = new InvoiceApi()

const STEPS = [
  { id: 1, label: 'Company details' },
  { id: 2, label: 'First branch' },
  { id: 3, label: 'First factory' },
  { id: 4, label: 'Review' },
]

const LAST_STEP = STEPS.length

// The states endpoint only serves Nigerian states, so the country is fixed.
const COUNTRY_CODE = 'NG'

const MONTH_OPTIONS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
].map((label, i) => ({ value: String(i + 1), label }))

const countryOptions = countries.map((c) => ({ value: c.code, label: `${c.name} (${c.dial})` }))

const sectionStyle = { display: 'flex', flexDirection: 'column', gap: 16 }
const twoCol = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }
const eyebrowStyle = { font: 'var(--type-eyebrow)', letterSpacing: 'var(--ls-widest)', textTransform: 'uppercase', color: 'var(--text-subtle)' }

function SectionLabel({ children }) {
  return <div style={eyebrowStyle}>{children}</div>
}

// For dropdowns, which have no built-in error text like Input does.
function FieldError({ message }) {
  if (!message) return null
  return <div style={{ font: 'var(--type-caption)', color: 'var(--text-danger, #b42318)', marginTop: 6 }}>{message}</div>
}

function PhoneField({ label, countryCode, onCountryChange, number, onNumberChange, error }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 12, alignItems: 'end' }}>
      <Dropdown label={label} size="lg" value={countryCode} onChange={onCountryChange} options={countryOptions} placeholder="Country" />
      <Input size="lg" value={number} onChange={onNumberChange} placeholder="555 010 2200" error={error} />
    </div>
  )
}

export default function Onboarding() {
  const { completeOnboarding, showToast } = useStore()
  const [step, setStep] = useState(1)

  // Company details
  const [tradingName, setTradingName] = useState('')
  const [legalName, setLegalName] = useState('')
  const [registrationNumber, setRegistrationNumber] = useState('')
  const [tin, setTin] = useState('')
  const [vatRegistrationNumber, setVatRegistrationNumber] = useState('')
  const [businessDescription, setBusinessDescription] = useState('')
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [phoneCountry, setPhoneCountry] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [streetAddress, setStreetAddress] = useState('')
  const [city, setCity] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [stateCode, setStateCode] = useState('')
  const [lgaCode, setLgaCode] = useState('')
  const [documentFooter, setDocumentFooter] = useState('')
  const [financialYearStartMonth, setFinancialYearStartMonth] = useState('1')
  const [errors, setErrors] = useState({})

  // State and LGA lists come from the server
  const [stateOptions, setStateOptions] = useState([])
  const [lgaOptions, setLgaOptions] = useState([])
  const [statesLoading, setStatesLoading] = useState(false)
  const [lgasLoading, setLgasLoading] = useState(false)

  const [branchName, setBranchName] = useState('')
  const [branchNumber, setBranchNumber] = useState('')

  const [factoryName, setFactoryName] = useState('')
  const [factoryCode, setFactoryCode] = useState('')
  const [factoryAddress, setFactoryAddress] = useState('')
  const [factoryState, setFactoryState] = useState('')
  const [factoryPhone, setFactoryPhone] = useState('')
  const [factoryVatRate, setFactoryVatRate] = useState('')
  const [factoryVatEnabled, setFactoryVatEnabled] = useState(false)
  const [factoryVatRegistration, setFactoryVatRegistration] = useState('')
  const [factoryStatus, setFactoryStatus] = useState('ACTIVE')//active and inactive
  const [factoryErrors, setFactoryErrors] = useState({})
  const [loading, setLoading] = useState(false)
  

  // Load the list of states once.
  useEffect(() => {
    let cancelled = false
    setStatesLoading(true)
    invoiceApi.getStateList()
      .then(({ data }) => {
        if (cancelled) return
        setStateOptions((data || []).map((s) => ({ value: s.code, label: s.name })))
      })
      .catch((error) => {
        if (!cancelled) showToast('Could not load states', error.message, true)
      })
      .finally(() => { if (!cancelled) setStatesLoading(false) })

    return () => { cancelled = true }
  }, [showToast])

  // Reload the LGAs whenever the chosen state changes. If the user switches
  // state quickly, `cancelled` makes sure a slow, old response can't overwrite
  // the newer list.
  useEffect(() => {
    if (!stateCode) return

    let cancelled = false
    setLgasLoading(true)
    invoiceApi.getLGAList(stateCode)
      .then(({ data }) => {
        if (cancelled) return
        setLgaOptions((data || []).map((l) => ({ value: l.code, label: l.name })))
      })
      .catch((error) => {
        if (!cancelled) showToast('Could not load local governments', error.message, true)
      })
      .finally(() => { if (!cancelled) setLgasLoading(false) })

    return () => { cancelled = true }
  }, [stateCode, showToast])

  // Picking a different state invalidates the old LGA, so clear it and its list.
  const changeState = (code) => {
    setStateCode(code)
    setLgaCode('')
    setLgaOptions([])
  }

  const validateCompany = () => {
    const e = {}
    if (!tradingName.trim()) e.tradingName = 'Trading name is required'
    if (!legalName.trim()) e.legalName = 'Legal name is required'
    if (!tin.trim()) e.tin = 'TIN is required'
    if (!email.trim()) e.email = 'Company email is required'
    if (!phoneCountry || !phoneNumber.trim()) e.phone = 'Company phone number is required'
    if (!streetAddress.trim()) e.streetAddress = 'Street address is required'
    if (!city.trim()) e.city = 'City is required'
    if (!stateCode) e.stateCode = 'Select a state'
    else if (!lgaCode) e.lgaCode = 'Select a local government area'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validateFactory = () => {
    const e = {}
    const started = factoryVatEnabled ||
      [factoryName, factoryCode, factoryAddress, factoryState, factoryPhone].some((v) => v.trim())

    if (started) {
      if (!factoryName.trim()) e.factoryName = 'Factory name is required'
      if (!factoryCode.trim()) e.factoryCode = 'Factory code is required'
      if (!factoryAddress.trim()) e.factoryAddress = 'Factory address is required'
      if (!factoryState.trim()) e.factoryState = 'State is required'
      if (!factoryPhone.trim()) e.factoryPhone = 'Factory phone number is required'
    }

    if (factoryVatEnabled) {
      const rate = Number(factoryVatRate)
      if (!String(factoryVatRate).trim()) e.factoryVatRate = 'VAT rate is required'
      else if (Number.isNaN(rate) || rate < 0 || rate > 100) e.factoryVatRate = 'Enter a rate between 0 and 100'
      if (!factoryVatRegistration.trim()) e.factoryVatRegistration = 'VAT registration number is required'
    }

    setFactoryErrors(e)
    return Object.keys(e).length === 0
  }

  const goNext = () => {
    if (step === 1) { if (!validateCompany()) return }
    if (step === 3) { if (!validateFactory()) return }
    setStep((s) => Math.min(LAST_STEP, s + 1))
  }

  const goBack = () => setStep((s) => Math.max(1, s - 1))
  const skipBranch = () => {
    setBranchName(''); setBranchNumber('')
    setStep(3)
  }

  const skipFactory = () => {
    setFactoryName(''); setFactoryCode(''); setFactoryAddress(''); setFactoryState('')
    setFactoryPhone(''); setFactoryVatRate(''); setFactoryVatEnabled(false)
    setFactoryVatRegistration(''); setFactoryStatus('ACTIVE')
    setFactoryErrors({})
    setStep(4)
  }

  const phoneDial = countries.find((c) => c.code === phoneCountry)?.dial || ''
  const phone = `${phoneDial} ${phoneNumber.trim()}`.trim()

  const stateName = stateOptions.find((o) => o.value === stateCode)?.label || ''
  const fullAddress = [streetAddress.trim(), city.trim(), stateName].filter(Boolean).join(', ')

  const hasBranch = branchName.trim() || branchNumber.trim()
  const hasFactory = !!factoryName.trim()

  // Optional fields that are left blank are left out of the request entirely.
  const optional = (v) => v.trim() || undefined

  const buildCompanyPayload = () => ({
    tradingName: tradingName.trim(),
    legalName: legalName.trim(),
    registrationNumber: optional(registrationNumber),
    tin: tin.trim(),
    vatRegistrationNumber: optional(vatRegistrationNumber),
    businessDescription: optional(businessDescription),
    email: email.trim(),
    phone,
    website: optional(website),
    streetAddress: streetAddress.trim(),
    city: city.trim(),
    postalCode: optional(postalCode),
    stateCode,
    lgaCode,
    countryCode: COUNTRY_CODE,
    documentFooter: optional(documentFooter),
    financialYearStartMonth: Number(financialYearStartMonth),
  })

  const finish = async () => {
    if (!validateCompany()) { setStep(1); return }
    if (hasFactory && !validateFactory()) { setStep(3); return }

    setLoading(true)
    let stage = 'Company setup'   // tells the error toast which call failed
    let factory = null            // declared out here so it's in scope below

    try {
      const company = buildCompanyPayload()
      await settingsApi.updateCompany(company)

      // The factory step is optional, so only call the API if one was entered.
      if (hasFactory) {
        stage = 'Factory setup'
        const res = await factoryApi.createFactory({
          name: factoryName.trim(),
          code: factoryCode.trim(),
          address: factoryAddress.trim(),
          state: factoryState.trim(),
          phone: factoryPhone.trim(),
          vatEnabled: factoryVatEnabled,
          vatRate: factoryVatEnabled ? Number(factoryVatRate) : 0,
          vatRegistrationNumber: factoryVatEnabled ? factoryVatRegistration.trim() : '',
          status: factoryStatus,
        })
        factory = res.data
      }

      // Only reached if every API call above succeeded.
      completeOnboarding(
        {
          ...company, // every detail the backend now holds
          // The names the rest of the app already reads:
          name: company.tradingName,
          address: fullAddress,
          taxRegistrationNumber: company.tin,
        },
        { name: branchName, number: branchNumber },
        factory, // null when skipped; completeOnboarding already handles that
      )
    } catch (error) {
      showToast(`${stage} failed`, error.message, true)
    } finally {
      setLoading(false) // runs on success AND on failure
    }
  }

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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
            <div style={sectionStyle}>
              <SectionLabel>Business</SectionLabel>
              <div style={twoCol}>
                <Input label="Trading name" size="lg" value={tradingName} onChange={(e) => setTradingName(e.target.value)} placeholder="e.g. Apex Industries Ltd" error={errors.tradingName} />
                <Input label="Legal name" size="lg" value={legalName} onChange={(e) => setLegalName(e.target.value)} placeholder="e.g. Apex Industries Limited" error={errors.legalName} />
              </div>
              <div style={twoCol}>
                <Input label="Registration number" hint="Optional" size="lg" value={registrationNumber} onChange={(e) => setRegistrationNumber(e.target.value)} placeholder="e.g. RC-1849302" />
                <Input label="TIN" size="lg" value={tin} onChange={(e) => setTin(e.target.value)} placeholder="e.g. 33467982-0001" error={errors.tin} />
              </div>
              <Input label="VAT registration number" hint="Optional" size="lg" value={vatRegistrationNumber} onChange={(e) => setVatRegistrationNumber(e.target.value)} placeholder="e.g. NG-VAT-4471029" />
              <Input label="Business description" hint="Optional" size="lg" value={businessDescription} onChange={(e) => setBusinessDescription(e.target.value)} placeholder="e.g. Beverage manufacturing and distribution" />
            </div>

            <div style={sectionStyle}>
              <SectionLabel>Contact</SectionLabel>
              <div style={twoCol}>
                <Input label="Company email" size="lg" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="info@company.com" error={errors.email} />
                <Input label="Website" hint="Optional" size="lg" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://company.com" />
              </div>
              <PhoneField label="Company phone number" countryCode={phoneCountry} onCountryChange={setPhoneCountry} number={phoneNumber} onNumberChange={(e) => setPhoneNumber(e.target.value)} error={errors.phone} />
            </div>

            <div style={sectionStyle}>
              <SectionLabel>Head office address</SectionLabel>
              <Input label="Street address" size="lg" value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)} placeholder="e.g. 12 Industrial Way" error={errors.streetAddress} />
              <div style={twoCol}>
                <Input label="City" size="lg" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Aba" error={errors.city} />
                <Input label="Postal code" hint="Optional" size="lg" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="e.g. 450001" />
              </div>
              <div style={twoCol}>
                <div>
                  <Dropdown
                    label="State" size="lg" value={stateCode} onChange={changeState} options={stateOptions}
                    placeholder={statesLoading ? 'Loading states…' : 'Select state'}
                  />
                  <FieldError message={errors.stateCode} />
                </div>
                <div>
                  <Dropdown
                    label="Local government area" size="lg" value={lgaCode} onChange={setLgaCode} options={lgaOptions}
                    disabled={!stateCode}
                    placeholder={!stateCode ? 'Select a state first' : lgasLoading ? 'Loading areas…' : 'Select area'}
                  />
                  <FieldError message={errors.lgaCode} />
                </div>
              </div>
            </div>

            <div style={sectionStyle}>
              <SectionLabel>Documents</SectionLabel>
              <Input label="Document footer" hint="Optional" size="lg" value={documentFooter} onChange={(e) => setDocumentFooter(e.target.value)} placeholder="Shown at the bottom of invoices and receipts" />
              <Dropdown label="Financial year starts in" size="lg" value={financialYearStartMonth} onChange={setFinancialYearStartMonth} options={MONTH_OPTIONS} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', background: 'var(--surface-sunken)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '11px 13px', lineHeight: 1.5 }}>
              Optional — skip this and we'll treat <b style={{ color: 'var(--text-strong)' }}>{tradingName || 'your company'}</b> itself as your single primary location. You can add branches anytime from Settings.
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
              <Input label="Factory name" size="lg" value={factoryName} onChange={(e) => setFactoryName(e.target.value)} placeholder="e.g. Ridgeway Factory A" error={factoryErrors.factoryName} />
              <Input label="Factory code" size="lg" value={factoryCode} onChange={(e) => setFactoryCode(e.target.value)} placeholder="e.g. FA" error={factoryErrors.factoryCode} />
            </div>
            <Input label="Factory address" size="lg" value={factoryAddress} onChange={(e) => setFactoryAddress(e.target.value)} placeholder="Street, city" error={factoryErrors.factoryAddress} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Input label="State" size="lg" value={factoryState} onChange={(e) => setFactoryState(e.target.value)} placeholder="e.g. Lagos" error={factoryErrors.factoryState} />
              <Input label="Factory phone number" size="lg" value={factoryPhone} onChange={(e) => setFactoryPhone(e.target.value)} placeholder="e.g. +234 800 000 0000" error={factoryErrors.factoryPhone} />
            </div>
            <Dropdown
              label="Status" size="lg" value={factoryStatus} onChange={setFactoryStatus}
              options={[{ value: 'ACTIVE', label: 'Active' }, { value: 'INACTIVE', label: 'Inactive' }]}
            />
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, font: 'var(--type-ui)', color: 'var(--text-strong)', cursor: 'pointer' }}>
              <input type="checkbox" checked={factoryVatEnabled} onChange={(e) => setFactoryVatEnabled(e.target.checked)} />
              This factory charges VAT
            </label>
            {factoryVatEnabled && (
              <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 14 }}>
                <Input label="VAT rate (%)" size="lg" type="number" value={factoryVatRate} onChange={(e) => setFactoryVatRate(e.target.value)} placeholder="e.g. 7.5" error={factoryErrors.factoryVatRate} />
                <Input label="VAT registration number" size="lg" value={factoryVatRegistration} onChange={(e) => setFactoryVatRegistration(e.target.value)} placeholder="VAT registration number" error={factoryErrors.factoryVatRegistration} />
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <div style={{ font: 'var(--type-eyebrow)', letterSpacing: 'var(--ls-widest)', textTransform: 'uppercase', color: 'var(--text-subtle)', marginBottom: 4 }}>Company</div>
              {[['Trading name', tradingName], ['Legal name', legalName], ['TIN', tin], ['Address', fullAddress], ['Phone', phone]].map(([k, v]) => (
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
                <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>No branch added — {tradingName || 'your company'} will be treated as the primary/single location.</div>
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
        {loading ? (
          <Loader label="Setting up your company…" />
        ) : (
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
        )}
      </div>
    </div>
  )
}