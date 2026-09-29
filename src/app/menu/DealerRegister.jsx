import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import { Switch } from '../../ds/components/forms/Switch.jsx'
import { RegisterShell } from '../shells/RegisterShell.jsx'
import { FormShell } from '../shells/FormShell.jsx'
import { Panel, FieldSet, MetaRow, Callout } from '../shells/Page.jsx'
import { showrooms } from '../sampleShowroom.js'
import { nigerianStates, correspondents } from '../sampleProcess.js'
import { banks } from '../sampleAccount.js'
import { dealerRegister, dealerCategories } from '../sampleMenu.js'
import { money, moneyShort } from '../utils.js'

const CATEGORY_TONE = { Platinum: 'brand', Gold: 'warning', Silver: 'neutral', Bronze: 'neutral' }

const columns = [
  { key: 'code', label: 'Code', width: 110, mono: true },
  { key: 'name', label: 'Dealer', width: 240 },
  {
    key: 'category', label: 'Category', width: 130,
    render: (d) => <Badge tone={CATEGORY_TONE[d.category] || 'neutral'}>{d.category}</Badge>,
  },
  { key: 'contact', label: 'Contact person', width: 180 },
  { key: 'phone', label: 'Phone', width: 175, mono: true },
  { key: 'address', label: 'Address', width: 300 },
  { key: 'showroom', label: 'Home showroom', width: 185 },
  { key: 'rep', label: 'Correspondent', width: 185 },
  { key: 'wallet', label: 'Wallet balance', width: 170, align: 'right', mono: true, render: (d) => money(d.wallet) },
  { key: 'creditLimit', label: 'Credit limit', width: 165, align: 'right', mono: true, render: (d) => money(d.creditLimit) },
  { key: 'registered', label: 'Registered', width: 150 },
  {
    key: 'status', label: 'Status', width: 120,
    render: (d) => <Badge tone={d.status === 'Active' ? 'success' : 'warning'}>{d.status}</Badge>,
  },
]

function DealerForm({ crumbs, onBack }) {
  const [categoryValue, setCategoryValue] = useState('')
  const [fund, setFund] = useState('')
  const [fundNow, setFundNow] = useState(true)

  const category = dealerCategories.find((c) => c.value === categoryValue)
  const opening = Number(fund) || 0

  return (
    <FormShell
      crumbs={crumbs}
      title="Register dealer"
      icon="user-round-plus"
      description="Onboard a new dealer, assign them to a category within the company structure, and optionally fund their wallet so they can transact straight away."
      headerActions={<Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>Back to register</Button>}
      submitLabel={fundNow && opening ? 'Register and fund wallet' : 'Register dealer'}
      onCancel={onBack}
      note="Once registered the dealer is immediately selectable at the point of sale. Any opening balance credits their wallet on save."
      aside={
        <>
          <Panel title="Account setup">
            <MetaRow label="Category" value={category?.label || '—'} />
            <MetaRow label="Dealer discount" value={category?.discount || '—'} />
            <MetaRow label="Suggested credit limit" value={category ? money(category.limit) : '—'} mono />
            <MetaRow label="Opening wallet" value={fundNow && opening ? money(opening) : money(0)} mono tone={fundNow && opening ? 'positive' : undefined} />
            <div style={{ marginTop: 14, padding: '14px 16px', background: 'var(--brand-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ font: 'var(--type-eyebrow)', letterSpacing: 'var(--ls-widest)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Wallet on registration</div>
              <div style={{ marginTop: 8, font: 'var(--fw-bold) var(--text-2xl)/1 var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: 'var(--text-strong)' }}>
                {money(fundNow ? opening : 0)}
              </div>
            </div>
          </Panel>

          <Callout tone="info" icon="wallet" title="How the wallet works">
            A dealer wallet is debited at the point of sale and credited by returns, commission and direct
            funding. It can never go negative, so a sale larger than the balance must be part-settled another way.
          </Callout>
        </>
      }
    >
      <Panel title="Dealer details">
        <FieldSet columns={2}>
          <Input label="Dealer / business name" placeholder="e.g. Ibadan Beverage Traders" />
          <Input label="Dealer code" placeholder="Auto-generated" disabled value="DL-0042" />
          <Input label="Contact person" placeholder="e.g. Femi Adeyinka" />
          <Input label="Phone number" placeholder="+234 …" />
          <Input label="Email address" placeholder="Optional" />
          <Input label="Tax identification no." placeholder="Optional" />
        </FieldSet>
      </Panel>

      <Panel title="Address & assignment">
        <FieldSet columns={2}>
          <Input label="Street address" placeholder="e.g. 12 Ring Road" />
          <Input label="City / town" placeholder="e.g. Ibadan" />
          <Select label="State" options={nigerianStates} placeholder="Select state…" />
          <Select label="Home showroom" options={showrooms} placeholder="Select showroom…" />
          <Select
            label="Assigned correspondent"
            options={correspondents.filter((c) => c.status === 'Assigned').map((c) => ({ value: c.code, label: c.name }))}
            placeholder="Select correspondent…"
          />
          <Select
            label="Dealer category"
            options={dealerCategories}
            value={categoryValue}
            onChange={(e) => setCategoryValue(e.target.value)}
            placeholder="Select category…"
          />
        </FieldSet>
        {category && (
          <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <Badge tone={CATEGORY_TONE[category.label] || 'neutral'}>{category.label}</Badge>
            <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
              {category.discount} dealer discount · suggested credit limit {money(category.limit)}
            </span>
          </div>
        )}
      </Panel>

      <Panel title="Wallet & credit" description="Fund the dealer's wallet now so they can transact immediately.">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <Switch checked={fundNow} onChange={setFundNow} />
          <div>
            <div style={{ font: 'var(--fw-semibold) var(--text-sm)/1.3 var(--font-ui)', color: 'var(--text-strong)' }}>Fund wallet on registration</div>
            <div style={{ font: 'var(--fw-regular) var(--text-xs)/1.4 var(--font-ui)', color: 'var(--text-muted)', marginTop: 2 }}>
              The wallet can also be funded later through Tenderable — Wallet Funds.
            </div>
          </div>
        </div>
        <FieldSet columns={3}>
          <Input
            label="Opening wallet balance (₦)"
            type="number"
            placeholder="0.00"
            value={fund}
            onChange={(e) => setFund(e.target.value)}
            disabled={!fundNow}
          />
          <Select label="Funding source" options={banks} placeholder="Select account…" disabled={!fundNow} />
          <Input label="Credit limit (₦)" type="number" placeholder={category ? String(category.limit) : '0.00'} />
        </FieldSet>
      </Panel>
    </FormShell>
  )
}

export default function DealerRegister({ leaf, moduleLabel, parentLabel }) {
  const [mode, setMode] = useState('list')
  const crumbs = [moduleLabel, parentLabel, leaf?.label].filter(Boolean)

  if (mode === 'create') return <DealerForm crumbs={crumbs} onBack={() => setMode('list')} />

  const totalWallet = dealerRegister.reduce((n, d) => n + d.wallet, 0)

  return (
    <RegisterShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Dealer Register'}
      icon={leaf?.icon}
      description="Create and manage dealer accounts — capturing their details, assigning them to a category within the company structure, and funding their wallet so they can transact."
      createLabel="Register dealer"
      onCreate={() => setMode('create')}
      searchPlaceholder="Search by dealer name, code or contact…"
      filters={
        <>
          <Select options={dealerCategories} placeholder="All categories" style={{ width: 180 }} />
          <Select options={showrooms} placeholder="All showrooms" style={{ width: 190 }} />
        </>
      }
      stats={[
        { label: 'Dealers registered', value: String(dealerRegister.length) },
        { label: 'Active', value: String(dealerRegister.filter((d) => d.status === 'Active').length) },
        { label: 'Combined wallet balance', value: moneyShort(totalWallet) },
        { label: 'Credit extended', value: moneyShort(dealerRegister.reduce((n, d) => n + d.creditLimit, 0)) },
      ]}
      columns={columns}
      rows={dealerRegister}
      onRowClick={() => {}}
      emptyTitle="No dealers registered"
      emptyDescription="Register a dealer to make them selectable at the point of sale."
      footnote="A dealer cannot be created with missing required fields or a name that duplicates an existing account. Wallet balances update immediately on any credit or debit and can never go negative."
    />
  )
}
