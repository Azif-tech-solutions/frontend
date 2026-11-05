// import { useState } from 'react'
// import { Badge } from '../../ds/components/core/Badge.jsx'
// import { Button } from '../../ds/components/core/Button.jsx'
// import { Input } from '../../ds/components/forms/Input.jsx'
// import { Select } from '../../ds/components/forms/Select.jsx'
// import { Switch } from '../../ds/components/forms/Switch.jsx'
// import { RegisterShell } from '../shells/RegisterShell.jsx'
// import { FormShell } from '../shells/FormShell.jsx'
// import { Panel, FieldSet, MetaRow, Callout } from '../shells/Page.jsx'
// import { showrooms } from '../sampleShowroom.js'
// import { nigerianStates, correspondents } from '../sampleProcess.js'
// import { banks } from '../sampleAccount.js'
// import { dealerRegister, dealerCategories } from '../sampleMenu.js'
// import { money, moneyShort } from '../utils.js'

// const CATEGORY_TONE = { Platinum: 'brand', Gold: 'warning', Silver: 'neutral', Bronze: 'neutral' }

// const columns = [
//   { key: 'code', label: 'Code', width: 110, mono: true },
//   { key: 'name', label: 'Dealer', width: 240 },
//   {
//     key: 'category', label: 'Category', width: 130,
//     render: (d) => <Badge tone={CATEGORY_TONE[d.category] || 'neutral'}>{d.category}</Badge>,
//   },
//   { key: 'contact', label: 'Contact person', width: 180 },
//   { key: 'phone', label: 'Phone', width: 175, mono: true },
//   { key: 'address', label: 'Address', width: 300 },
//   { key: 'showroom', label: 'Home showroom', width: 185 },
//   { key: 'rep', label: 'Correspondent', width: 185 },
//   { key: 'wallet', label: 'Wallet balance', width: 170, align: 'right', mono: true, render: (d) => money(d.wallet) },
//   { key: 'creditLimit', label: 'Credit limit', width: 165, align: 'right', mono: true, render: (d) => money(d.creditLimit) },
//   { key: 'registered', label: 'Registered', width: 150 },
//   {
//     key: 'status', label: 'Status', width: 120,
//     render: (d) => <Badge tone={d.status === 'Active' ? 'success' : 'warning'}>{d.status}</Badge>,
//   },
// ]

// function DealerForm({ crumbs, onBack }) {
//   const [categoryValue, setCategoryValue] = useState('')
//   const [fund, setFund] = useState('')
//   const [fundNow, setFundNow] = useState(true)

//   const category = dealerCategories.find((c) => c.value === categoryValue)
//   const opening = Number(fund) || 0

//   return (
//     <FormShell
//       crumbs={crumbs}
//       title="Register dealer"
//       icon="user-round-plus"
//       description="Onboard a new dealer, assign them to a category within the company structure, and optionally fund their wallet so they can transact straight away."
//       headerActions={<Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>Back to register</Button>}
//       submitLabel={fundNow && opening ? 'Register and fund wallet' : 'Register dealer'}
//       onCancel={onBack}
//       note="Once registered the dealer is immediately selectable at the point of sale. Any opening balance credits their wallet on save."
//       aside={
//         <>
//           <Panel title="Account setup">
//             <MetaRow label="Category" value={category?.label || '—'} />
//             <MetaRow label="Dealer discount" value={category?.discount || '—'} />
//             <MetaRow label="Suggested credit limit" value={category ? money(category.limit) : '—'} mono />
//             <MetaRow label="Opening wallet" value={fundNow && opening ? money(opening) : money(0)} mono tone={fundNow && opening ? 'positive' : undefined} />
//             <div style={{ marginTop: 14, padding: '14px 16px', background: 'var(--brand-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
//               <div style={{ font: 'var(--type-eyebrow)', letterSpacing: 'var(--ls-widest)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Wallet on registration</div>
//               <div style={{ marginTop: 8, font: 'var(--fw-bold) var(--text-2xl)/1 var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: 'var(--text-strong)' }}>
//                 {money(fundNow ? opening : 0)}
//               </div>
//             </div>
//           </Panel>

//           <Callout tone="info" icon="wallet" title="How the wallet works">
//             A dealer wallet is debited at the point of sale and credited by returns, commission and direct
//             funding. It can never go negative, so a sale larger than the balance must be part-settled another way.
//           </Callout>
//         </>
//       }
//     >
//       <Panel title="Dealer details">
//         <FieldSet columns={2}>
//           <Input label="Dealer / business name" placeholder="e.g. Ibadan Beverage Traders" />
//           <Input label="Dealer code" placeholder="Auto-generated" disabled value="DL-0042" />
//           <Input label="Contact person" placeholder="e.g. Femi Adeyinka" />
//           <Input label="Phone number" placeholder="+234 …" />
//           <Input label="Email address" placeholder="Optional" />
//           <Input label="Tax identification no." placeholder="Optional" />
//         </FieldSet>
//       </Panel>

//       <Panel title="Address & assignment">
//         <FieldSet columns={2}>
//           <Input label="Street address" placeholder="e.g. 12 Ring Road" />
//           <Input label="City / town" placeholder="e.g. Ibadan" />
//           <Select label="State" options={nigerianStates} placeholder="Select state…" />
//           <Select label="Home showroom" options={showrooms} placeholder="Select showroom…" />
//           <Select
//             label="Assigned correspondent"
//             options={correspondents.filter((c) => c.status === 'Assigned').map((c) => ({ value: c.code, label: c.name }))}
//             placeholder="Select correspondent…"
//           />
//           <Select
//             label="Dealer category"
//             options={dealerCategories}
//             value={categoryValue}
//             onChange={(e) => setCategoryValue(e.target.value)}
//             placeholder="Select category…"
//           />
//         </FieldSet>
//         {category && (
//           <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
//             <Badge tone={CATEGORY_TONE[category.label] || 'neutral'}>{category.label}</Badge>
//             <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
//               {category.discount} dealer discount · suggested credit limit {money(category.limit)}
//             </span>
//           </div>
//         )}
//       </Panel>

//       <Panel title="Wallet & credit" description="Fund the dealer's wallet now so they can transact immediately.">
//         <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
//           <Switch checked={fundNow} onChange={setFundNow} />
//           <div>
//             <div style={{ font: 'var(--fw-semibold) var(--text-sm)/1.3 var(--font-ui)', color: 'var(--text-strong)' }}>Fund wallet on registration</div>
//             <div style={{ font: 'var(--fw-regular) var(--text-xs)/1.4 var(--font-ui)', color: 'var(--text-muted)', marginTop: 2 }}>
//               The wallet can also be funded later through Tenderable — Wallet Funds.
//             </div>
//           </div>
//         </div>
//         <FieldSet columns={3}>
//           <Input
//             label="Opening wallet balance (₦)"
//             type="number"
//             placeholder="0.00"
//             value={fund}
//             onChange={(e) => setFund(e.target.value)}
//             disabled={!fundNow}
//           />
//           <Select label="Funding source" options={banks} placeholder="Select account…" disabled={!fundNow} />
//           <Input label="Credit limit (₦)" type="number" placeholder={category ? String(category.limit) : '0.00'} />
//         </FieldSet>
//       </Panel>
//     </FormShell>
//   )
// }

// export default function DealerRegister({ leaf, moduleLabel, parentLabel }) {
//   const [mode, setMode] = useState('list')
//   const crumbs = [moduleLabel, parentLabel, leaf?.label].filter(Boolean)

//   if (mode === 'create') return <DealerForm crumbs={crumbs} onBack={() => setMode('list')} />

//   const totalWallet = dealerRegister.reduce((n, d) => n + d.wallet, 0)

//   return (
//     <RegisterShell
//       wide
//       crumbs={[moduleLabel, parentLabel]}
//       title={leaf?.label || 'Dealer Register'}
//       icon={leaf?.icon}
//       description="Create and manage dealer accounts — capturing their details, assigning them to a category within the company structure, and funding their wallet so they can transact."
//       createLabel="Register dealer"
//       onCreate={() => setMode('create')}
//       searchPlaceholder="Search by dealer name, code or contact…"
//       filters={
//         <>
//           <Select options={dealerCategories} placeholder="All categories" style={{ width: 180 }} />
//           <Select options={showrooms} placeholder="All showrooms" style={{ width: 190 }} />
//         </>
//       }
//       stats={[
//         { label: 'Dealers registered', value: String(dealerRegister.length) },
//         { label: 'Active', value: String(dealerRegister.filter((d) => d.status === 'Active').length) },
//         { label: 'Combined wallet balance', value: moneyShort(totalWallet) },
//         { label: 'Credit extended', value: moneyShort(dealerRegister.reduce((n, d) => n + d.creditLimit, 0)) },
//       ]}
//       columns={columns}
//       rows={dealerRegister}
//       onRowClick={() => {}}
//       emptyTitle="No dealers registered"
//       emptyDescription="Register a dealer to make them selectable at the point of sale."
//       footnote="A dealer cannot be created with missing required fields or a name that duplicates an existing account. Wallet balances update immediately on any credit or debit and can never go negative."
//     />
//   )
// }
import { useEffect, useState, useCallback } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import Loader from '../../ds/components/core/Loader.jsx'
import { RegisterShell } from '../shells/RegisterShell.jsx'
import { FormShell } from '../shells/FormShell.jsx'
import { Panel, FieldSet, MetaRow, Callout } from '../shells/Page.jsx'
import { useStore } from '../store.jsx'
import { money, moneyShort, fmtDate } from '../utils.js'
import CustomerApi from '../../api/CustomerApi.js'
import ShowroomApi from '../../api/ShowroomApi.js'
import InvoiceApi from '../../api/InvoiceApi.js'

const customerApi = new CustomerApi()
const showroomApi = new ShowroomApi()
const invoiceApi = new InvoiceApi()

const PAGE_SIZE = 20

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'WATCH', label: 'Watch' },
  { value: 'SUSPENDED', label: 'Suspended' },
  { value: 'REMOVED', label: 'Removed' },
]
const STATUS_LABEL = Object.fromEntries(STATUS_OPTIONS.map((o) => [o.value, o.label]))
const STATUS_TONE = { ACTIVE: 'success', WATCH: 'warning', SUSPENDED: 'danger', REMOVED: 'neutral' }

const TEXTAREA_STYLE = {
  width: '100%',
  padding: '10px 12px',
  resize: 'vertical',
  background: 'var(--surface-card)',
  border: '1px solid var(--border-default)',
  borderRadius: 'var(--radius-control)',
  boxShadow: 'var(--shadow-xs)',
  font: 'var(--fw-regular) var(--text-sm)/1.5 var(--font-ui)',
  color: 'var(--text-strong)',
  outline: 'none',
}

const today = () => new Date().toISOString().slice(0, 10)

// ── Create ─────────────────────────────────────────────────
function DealerForm({ crumbs, showrooms, categories, correspondents, onBack, onDone }) {
  const store = useStore()
  const showToast = store.showToast

  // dealer details
  const [name, setName] = useState('')
  const [contactPerson, setContactPerson] = useState('')
  const [phone, setPhone] = useState('')
  const [alternatePhone, setAlternatePhone] = useState('')
  const [email, setEmail] = useState('')
  const [tin, setTin] = useState('')

  // address & assignment
  const [streetAddress, setStreetAddress] = useState('')
  const [city, setCity] = useState('')
  const [stateCode, setStateCode] = useState('')
  const [lgaCode, setLgaCode] = useState('')
  const [locationId, setLocationId] = useState('')
  const [correspondentId, setCorrespondentId] = useState('')
  const [dealerCategoryId, setDealerCategoryId] = useState('')

  // business
  const [businessDescription, setBusinessDescription] = useState('')
  const [customerSince, setCustomerSince] = useState(today)

  // wallet & credit (only creditLimit is submitted)
  const [creditLimit, setCreditLimit] = useState('')

  const [submitting, setSubmitting] = useState(false)

  // states / lgas
  const [states, setStates] = useState([])
  const [lgas, setLgas] = useState([])
  const [loadingLgas, setLoadingLgas] = useState(false)

  useEffect(() => {
    let cancelled = false
    invoiceApi
      .getStateList()
      .then((res) => {
        if (cancelled) return
        setStates(
          (res.data || []).map((s) => ({
            value: s.code || s.stateCode,
            label: s.name,
          }))
        )
      })
      .catch((e) => {
        if (!cancelled) showToast('Could not load states', e.message, true)
      })
    return () => {
      cancelled = true
    }
  }, [showToast])

  useEffect(() => {
    if (!stateCode) {
      setLgas([])
      setLgaCode('')
      return
    }
    let cancelled = false
    setLoadingLgas(true)
    setLgaCode('')
    invoiceApi
      .getLGAList(stateCode)
      .then((res) => {
        if (cancelled) return
        setLgas(
          (res.data || []).map((l) => ({
            value: l.code || l.stateCode,
            label: l.name,
          }))
        )
      })
      .catch((e) => {
        if (!cancelled) showToast('Could not load LGAs', e.message, true)
      })
      .finally(() => {
        if (!cancelled) setLoadingLgas(false)
      })
    return () => {
      cancelled = true
    }
  }, [stateCode, showToast])

  const category = categories.find((c) => c.id === dealerCategoryId)

  const canSubmit =
    name.trim() &&
    contactPerson.trim() &&
    phone.trim() &&
    streetAddress.trim() &&
    city.trim() &&
    stateCode &&
    lgaCode &&
    locationId &&
    dealerCategoryId &&
    !submitting

  async function submit() {
    if (!canSubmit) return
    setSubmitting(true)
    try {
      await customerApi.createCustomer({
        type: 'AUTHORISED_DEALER',
        name: name.trim(),
        contactPerson: contactPerson.trim(),
        phone: phone.trim(),
        alternatePhone: alternatePhone.trim(),
        email: email.trim(),
        tin: tin.trim(),
        businessDescription: businessDescription.trim(),
        streetAddress: streetAddress.trim(),
        city: city.trim(),
        stateCode,
        lgaCode,
        locationId,
        correspondentId: correspondentId || '',
        dealerCategoryId,
        creditLimit: Number(creditLimit) || 0,
        customerSince,
        customAttributes: {},
      })
      showToast(
        'Dealer registered',
        `${name.trim()} has been added to the dealer register.`
      )
      onDone()
    } catch (e) {
      showToast('Could not register dealer', e.message, true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {submitting && <Loader overlay label="Registering dealer…" />}
      <FormShell
        crumbs={crumbs}
        title="Register dealer"
        icon="user-round-plus"
        description="Onboard a new authorised dealer, assign them to a category within the company structure, and optionally fund their wallet so they can transact straight away."
        headerActions={
          <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>
            Back to register
          </Button>
        }
        submitLabel="Register dealer"
        onSubmit={submit}
        onCancel={onBack}
        submitDisabled={!canSubmit}
        note="Once registered the dealer is immediately selectable at the point of sale. Wallet funding is completed after registration through Wallet Funds."
        aside={
          <>
            <Panel title="Account setup">
              <MetaRow label="Category" value={category?.name || '—'} />
              <MetaRow
                label="Dealer discount"
                value={category ? `${category.discountPct}%` : '—'}
              />
              <MetaRow
                label="Suggested credit limit"
                value={category ? money(category.suggestedCreditLimit) : '—'}
                mono
              />
              <MetaRow
                label="Credit limit"
                value={money(Number(creditLimit) || 0)}
                mono
              />
              <MetaRow
                label="Customer since"
                value={fmtDate(customerSince)}
              />
            </Panel>

            <Callout tone="info" icon="wallet" title="Funding happens separately">
              Wallet funding is completed after registration through the Wallet
              Funds module. The dealer is usable at point of sale as soon as
              they are registered.
            </Callout>
          </>
        }
      >
        <Panel title="Dealer details">
          <FieldSet columns={2}>
            <Input
              label="Dealer / business name"
              placeholder="e.g. Ibadan Beverage Traders"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input label="Dealer code" value="Auto-generated" disabled />
            <Input
              label="Contact person"
              placeholder="e.g. Femi Adeyinka"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
            />
            <Input
              label="Phone number"
              placeholder="+234 …"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Input
              label="Alternate phone"
              placeholder="Optional"
              value={alternatePhone}
              onChange={(e) => setAlternatePhone(e.target.value)}
            />
            <Input
              label="Email address"
              placeholder="Optional"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Tax identification no."
              placeholder="Optional"
              value={tin}
              onChange={(e) => setTin(e.target.value)}
            />
            <Input
              label="Customer since"
              type="date"
              value={customerSince}
              onChange={(e) => setCustomerSince(e.target.value)}
            />
          </FieldSet>
        </Panel>

        <Panel title="Address & assignment">
          <FieldSet columns={2}>
            <Input
              label="Street address"
              placeholder="e.g. 12 Ring Road"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
            />
            <Input
              label="City / town"
              placeholder="e.g. Ibadan"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <Select
              label="State"
              options={states}
              placeholder="Select state…"
              value={stateCode}
              onChange={(e) => setStateCode(e.target.value)}
            />
            <Select
              label="LGA"
              options={lgas}
              placeholder={
                !stateCode
                  ? 'Select a state first'
                  : loadingLgas
                    ? 'Loading LGAs…'
                    : 'Select LGA…'
              }
              value={lgaCode}
              onChange={(e) => setLgaCode(e.target.value)}
              disabled={!stateCode || loadingLgas}
            />
            <Select
              label="Home showroom"
              options={showrooms}
              placeholder="Select showroom…"
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
            />
            <Select
              label="Assigned correspondent"
              options={correspondents}
              placeholder="Optional — can be linked later"
              value={correspondentId}
              onChange={(e) => setCorrespondentId(e.target.value)}
            />
            <Select
              label="Dealer category"
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
              placeholder="Select category…"
              value={dealerCategoryId}
              onChange={(e) => setDealerCategoryId(e.target.value)}
            />
          </FieldSet>
          {category && (
            <div
              style={{
                marginTop: 14,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                flexWrap: 'wrap',
              }}
            >
              <Badge tone="brand">{category.name}</Badge>
              <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
                {category.discountPct}% dealer discount · suggested credit limit{' '}
                {money(category.suggestedCreditLimit)}
              </span>
            </div>
          )}
        </Panel>

        <Panel title="Business description">
          <textarea
            rows={3}
            placeholder="What the dealer sells, which areas they cover, etc."
            value={businessDescription}
            onChange={(e) => setBusinessDescription(e.target.value)}
            style={TEXTAREA_STYLE}
          />
        </Panel>

        <Panel
          title="Wallet & credit"
          description="Set a credit limit here. Wallet funding is completed separately after registration."
        >
          <FieldSet columns={3}>
            <Input
              label="Credit limit (₦)"
              type="number"
              placeholder={
                category ? String(category.suggestedCreditLimit) : '0.00'
              }
              value={creditLimit}
              onChange={(e) => setCreditLimit(e.target.value)}
            />
            <Input
              label="Opening wallet balance (₦)"
              type="number"
              placeholder="0.00"
              value=""
              disabled
              hint="Fund via Wallet Funds after registration."
            />
            <Select
              label="Funding source"
              options={[]}
              placeholder="Post-registration"
              disabled
            />
          </FieldSet>
        </Panel>
      </FormShell>
    </>
  )
}

// ── Main list ──────────────────────────────────────────────
export default function DealerRegister({ leaf, moduleLabel, parentLabel }) {
  const store = useStore()
  const showToast = store.showToast
  const crumbs = [moduleLabel, parentLabel, leaf?.label].filter(Boolean)

  const [mode, setMode] = useState('list')

  // filters
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [showroomFilter, setShowroomFilter] = useState('')
  const [correspondentFilter, setCorrespondentFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  // pagination
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)

  // data
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)

  // lookups
  const [categories, setCategories] = useState([])
  const [showrooms, setShowrooms] = useState([])
  const [correspondents, setCorrespondents] = useState([])

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 300)
    return () => clearTimeout(t)
  }, [searchInput])

  // lookups on mount
  useEffect(() => {
    let cancelled = false
    Promise.all([
      customerApi.listDealerCategories(),
      showroomApi.lookupPickerWithAreas({ status: ['ACTIVE'] }),
      customerApi.listCorrespondents({
        status: ['ASSIGNED'],
        page: 0,
        size: 200,
      }),
    ])
      .then(([catRes, showroomRes, corrRes]) => {
        if (cancelled) return
        setCategories(catRes.data || [])
        setShowrooms(
          (showroomRes.data || []).map((s) => ({
            value: s.id,
            label: s.label || s.name || s.code,
          }))
        )
        setCorrespondents(
          (corrRes.data?.items || []).map((c) => ({
            value: c.id,
            label: c.name,
          }))
        )
      })
      .catch((e) => {
        if (!cancelled) showToast('Could not load lookups', e.message, true)
      })
    return () => {
      cancelled = true
    }
  }, [showToast])

  // reset to page 0 when filters change
  useEffect(() => {
    setPage(0)
  }, [search, categoryFilter, showroomFilter, correspondentFilter, statusFilter])

  // load list
  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await customerApi.listCustomers({
        type: ['AUTHORISED_DEALER'],
        page,
        size: PAGE_SIZE,
        q: search || undefined,
        dealerCategoryId: categoryFilter || undefined,
        locationId: showroomFilter || undefined,
        correspondentId: correspondentFilter || undefined,
        status: statusFilter ? [statusFilter] : undefined,
      })
      const paged = res.data
      setRows(paged.items || [])
      setTotalPages(paged.totalPages || 0)
      setTotalItems(paged.totalItems || 0)
    } catch (e) {
      showToast('Could not load dealers', e.message, true)
    } finally {
      setLoading(false)
    }
  }, [
    page,
    search,
    categoryFilter,
    showroomFilter,
    correspondentFilter,
    statusFilter,
    showToast,
  ])

  useEffect(() => {
    load()
  }, [load])

  const afterCreate = () => {
    setMode('list')
    load()
  }

  if (mode === 'create') {
    return (
      <DealerForm
        crumbs={crumbs}
        showrooms={showrooms}
        categories={categories}
        correspondents={correspondents}
        onBack={() => setMode('list')}
        onDone={afterCreate}
      />
    )
  }

  // columns
  const columns = [
    { key: 'code', label: 'Code', width: 110, mono: true },
    { key: 'name', label: 'Dealer', width: 240 },
    {
      key: 'category',
      label: 'Category',
      width: 140,
      render: (d) =>
        d.dealerCategoryName ? (
          <Badge tone="brand">{d.dealerCategoryName}</Badge>
        ) : (
          '—'
        ),
    },
    {
      key: 'contact',
      label: 'Contact person',
      width: 180,
      render: (d) => d.contactPerson || '—',
    },
    {
      key: 'phone',
      label: 'Phone',
      width: 175,
      mono: true,
      render: (d) => d.phone || '—',
    },
    {
      key: 'state',
      label: 'State',
      width: 160,
      render: (d) => d.stateName || '—',
    },
    {
      key: 'showroom',
      label: 'Home showroom',
      width: 185,
      render: (d) => d.location?.name || '—',
    },
    {
      key: 'rep',
      label: 'Correspondent',
      width: 185,
      render: (d) => d.correspondent?.name || '—',
    },
    {
      key: 'wallet',
      label: 'Wallet balance',
      width: 170,
      align: 'right',
      mono: true,
      render: (d) => money(d.walletBalance || 0),
    },
    {
      key: 'creditLimit',
      label: 'Credit limit',
      width: 165,
      align: 'right',
      mono: true,
      render: (d) => money(d.creditLimit || 0),
    },
    {
      key: 'registered',
      label: 'Customer since',
      width: 150,
      render: (d) => (d.customerSince ? fmtDate(d.customerSince) : '—'),
    },
    {
      key: 'status',
      label: 'Status',
      width: 120,
      render: (d) => (
        <Badge tone={STATUS_TONE[d.status] || 'neutral'}>
          {STATUS_LABEL[d.status] || d.status}
        </Badge>
      ),
    },
  ]

  // page-level stats (no global summary on this endpoint)
  const pageActiveCount = rows.filter((d) => d.status === 'ACTIVE').length
  const pageWalletTotal = rows.reduce((n, d) => n + (d.walletBalance || 0), 0)
  const pageCreditTotal = rows.reduce((n, d) => n + (d.creditLimit || 0), 0)

  const categoryOptions = [
    { value: '', label: 'All categories' },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ]
  const showroomOptions = [
    { value: '', label: 'All showrooms' },
    ...showrooms,
  ]
  const correspondentOptions = [
    { value: '', label: 'All correspondents' },
    ...correspondents,
  ]
  const statusOptions = [{ value: '', label: 'All statuses' }, ...STATUS_OPTIONS]

  return (
    <>
      {loading && <Loader overlay label="Loading dealers…" />}
      <RegisterShell
        wide
        crumbs={[moduleLabel, parentLabel]}
        title={leaf?.label || 'Dealer Register'}
        icon={leaf?.icon}
        description="Create and manage authorised dealer accounts — capturing their details, assigning them to a category within the company structure, and setting their credit limit."
        createLabel="Register dealer"
        onCreate={() => setMode('create')}
        search={searchInput}
        onSearch={setSearchInput}
        searchPlaceholder="Search by dealer name, code or contact…"
        pagination={{
          page,
          pageCount: totalPages,
          pageSize: PAGE_SIZE,
          total: totalItems,
          onPage: setPage,
        }}
        filters={
          <>
            <Select
              options={categoryOptions}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{ width: 200 }}
            />
            <Select
              options={showroomOptions}
              value={showroomFilter}
              onChange={(e) => setShowroomFilter(e.target.value)}
              style={{ width: 200 }}
            />
            <Select
              options={correspondentOptions}
              value={correspondentFilter}
              onChange={(e) => setCorrespondentFilter(e.target.value)}
              style={{ width: 200 }}
            />
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: 170 }}
            />
          </>
        }
        stats={[
          { label: 'Dealers registered', value: String(totalItems) },
          { label: 'Active (this page)', value: String(pageActiveCount) },
          { label: 'Wallet (this page)', value: moneyShort(pageWalletTotal) },
          { label: 'Credit extended (this page)', value: moneyShort(pageCreditTotal) },
        ]}
        columns={columns}
        rows={rows}
        onRowClick={() => {}}
        emptyTitle="No dealers registered"
        emptyDescription="Register a dealer to make them selectable at the point of sale."
        footnote="Only customers of type Authorised Dealer are shown here. Wallet balances update via the Wallet Funds module and can never go negative."
      />
    </>
  )
}