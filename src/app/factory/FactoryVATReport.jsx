// import { Badge } from '../../ds/components/core/Badge.jsx'
// import { ReportShell } from '../shells/ReportShell.jsx'
// import { Statement } from '../shells/Statement.jsx'
// import { factories, VAT_RATE, vatOutputs, vatInputs, vatTransactions } from '../sample.js'
// import { money, moneyShort } from '../utils.js'

// const rate = `${(VAT_RATE * 100).toFixed(1)}%`

// export default function FactoryVATReport({ leaf, moduleLabel, parentLabel }) {
//   const outputVat = vatOutputs.reduce((n, r) => n + r.base * VAT_RATE, 0)
//   const inputVat = vatInputs.reduce((n, r) => n + r.base * VAT_RATE, 0)
//   const netVat = outputVat - inputVat
//   const payable = netVat >= 0

//   const outputBase = vatOutputs.reduce((n, r) => n + r.base, 0)
//   const inputBase = vatInputs.reduce((n, r) => n + r.base, 0)

//   const line = (r) => ({
//     label: r.label,
//     note: `on ${money(r.base)}`,
//     values: [money(r.base * VAT_RATE)],
//   })

//   const rows = vatTransactions.map((t) => ({ ...t, vat: t.base * VAT_RATE }))

//   const columns = [
//     { key: 'date', label: 'Date', width: 130 },
//     { key: 'ref', label: 'Document', width: 130, mono: true },
//     { key: 'counterparty', label: 'Counterparty', width: 220 },
//     { key: 'description', label: 'Description', width: 300 },
//     {
//       key: 'type', label: 'VAT type', width: 120,
//       render: (t) => <Badge tone={t.type === 'Output' ? 'brand' : 'neutral'}>{t.type}</Badge>,
//     },
//     { key: 'base', label: 'Taxable amount', width: 170, align: 'right', mono: true, render: (t) => money(t.base) },
//     { key: 'rate', label: 'Rate', width: 90, align: 'right', mono: true, render: () => rate },
//     {
//       key: 'vat', label: 'VAT', width: 165, align: 'right', mono: true,
//       render: (t) => (
//         <span style={{ color: t.type === 'Output' ? 'var(--success)' : 'var(--danger)' }}>
//           {t.type === 'Output' ? '+' : '−'}{money(t.vat)}
//         </span>
//       ),
//     },
//   ]

//   return (
//     <ReportShell
//       wide
//       crumbs={[moduleLabel, parentLabel]}
//       title={leaf?.label || 'Factory VAT Report'}
//       icon={leaf?.icon}
//       description="Value Added Tax on the factory's transactions — VAT charged on sales set against VAT paid on purchases, for tax calculation, reporting and reconciliation."
//       filters={[
//         { key: 'factory', label: 'Factory', type: 'select', options: factories },
//         { key: 'type', label: 'VAT type', type: 'select', options: [{ value: 'output', label: 'Output (on sales)' }, { value: 'input', label: 'Input (on purchases)' }] },
//         { key: 'from', label: 'Period from', type: 'date' },
//         { key: 'to', label: 'Period to', type: 'date' },
//       ]}
//       stats={[
//         { label: 'Output VAT', value: moneyShort(outputVat), hint: `on ${moneyShort(outputBase)} of sales` },
//         { label: 'Input VAT', value: moneyShort(inputVat), hint: `on ${moneyShort(inputBase)} of purchases` },
//         { label: payable ? 'Net VAT payable' : 'Net VAT reclaimable', value: moneyShort(Math.abs(netVat)), tone: payable ? 'negative' : 'positive' },
//         { label: 'Applied rate', value: rate, hint: 'Per VAT Control' },
//       ]}
//       columns={columns}
//       rows={rows}
//       totals={{ date: 'Total', base: money(outputBase + inputBase), vat: money(netVat) }}
//       tableTitle="VAT transaction detail"
//       emptyTitle="No VAT transactions in this period"
//       emptyDescription="Widen the period or clear the VAT type filter, then generate again."
//       footnote={`VAT is calculated at the rate configured for the relevant location in VAT Control, currently ${rate}. Output VAT is collected on behalf of the tax authority; input VAT is recoverable against it.`}
//     >
//       <Statement
//         columns={[`VAT at ${rate}`]}
//         sections={[
//           {
//             title: 'Output VAT — charged on sales',
//             tone: 'positive',
//             rows: vatOutputs.map(line),
//             subtotal: { label: 'Total output VAT', values: [money(outputVat)] },
//           },
//           {
//             title: 'Input VAT — paid on purchases',
//             tone: 'negative',
//             rows: vatInputs.map(line),
//             subtotal: { label: 'Total input VAT', values: [money(inputVat)] },
//           },
//         ]}
//         result={{
//           label: payable ? 'Net VAT payable to authority' : 'Net VAT reclaimable',
//           note: payable
//             ? 'Output VAT collected exceeds input VAT recoverable for this period.'
//             : 'Input VAT recoverable exceeds output VAT collected for this period.',
//           values: [money(Math.abs(netVat))],
//           tone: payable ? 'negative' : 'positive',
//         }}
//       />
//     </ReportShell>
//   )
// }
import { useEffect, useMemo, useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import Loader from '../../ds/components/core/Loader.jsx'
import { ReportTable } from '../../ds/components/data/ReportTable.jsx'
import { Statement } from '../shells/Statement.jsx'
import { Page, Panel, FieldSet, Callout, EmptyState } from '../shells/Page.jsx'
import { PageHeader } from '../shells/PageHeader.jsx'
import { useStore } from '../store.jsx'
import { fmtDate, money, moneyShort } from '../utils.js'
import { ComplianceApi } from '../../api/ComplianceApi.js'
// Assumption: FactoryApi is a default export, like CashierApi. Use { FactoryApi } if it is named.
import FactoryApi from '../../api/FactoryApi.js'

const complianceApi = new ComplianceApi()
const factoryApi = new FactoryApi()

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function val(payload) {
  if (payload == null) return payload
  if (typeof payload === 'object') {
    if (payload.target && 'value' in payload.target) return payload.target.value
    if ('value' in payload) return payload.value
  }
  return payload
}

// Backend VAT type values for the filter. Adjust if the API expects different strings.
const TYPE_OPTIONS = [
  { value: '', label: 'Output and input' },
  { value: 'OUTPUT', label: 'Output (on sales)' },
  { value: 'INPUT', label: 'Input (on purchases)' },
]

const isoDate = (d) => d.toISOString().slice(0, 10)
const monthStart = () => {
  const d = new Date()
  return isoDate(new Date(d.getFullYear(), d.getMonth(), 1))
}

// Rates come back as fractions (0.075 → 7.5%), matching the rest of the app
const pct = (r) => `${((Number(r) || 0) * 100).toFixed(1)}%`

const isOutput = (t) => String(t || '').toUpperCase().includes('OUTPUT')

function StatCard({ label, value, hint, tone }) {
  const color =
    tone === 'negative' ? 'var(--danger)' : tone === 'positive' ? 'var(--success)' : 'var(--text-strong)'
  return (
    <div
      style={{
        padding: '14px 16px',
        background: 'var(--surface-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
      }}
    >
      <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>{label}</div>
      <div
        style={{
          marginTop: 8,
          font: 'var(--fw-bold) var(--text-xl)/1 var(--font-mono)',
          fontVariantNumeric: 'tabular-nums',
          color,
        }}
      >
        {value}
      </div>
      {hint && (
        <div style={{ marginTop: 6, font: 'var(--type-caption)', color: 'var(--text-muted)' }}>{hint}</div>
      )}
    </div>
  )
}

// Group report rows by rate so the statement shows one line per rate that applied in the period
function statementLines(rows, wantOutput, fallbackBase, fallbackVat, fallbackRate) {
  const groups = new Map()
  rows
    .filter((r) => isOutput(r.type) === wantOutput)
    .forEach((r) => {
      const key = String(r.rate)
      const g = groups.get(key) || { rate: r.rate, base: 0, vat: 0 }
      g.base += Number(r.taxableAmount) || 0
      g.vat += Number(r.vat) || 0
      groups.set(key, g)
    })
  if (groups.size === 0) {
    return [
      {
        label: `VAT at ${pct(fallbackRate)}`,
        note: `on ${money(fallbackBase || 0)}`,
        values: [money(fallbackVat || 0)],
      },
    ]
  }
  return [...groups.values()].map((g) => ({
    label: `VAT at ${pct(g.rate)}`,
    note: `on ${money(g.base)}`,
    values: [money(g.vat)],
  }))
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function FactoryVATReport({ leaf, moduleLabel, parentLabel }) {
  const { showToast } = useStore()
  const crumbs = [moduleLabel, parentLabel, leaf?.label].filter(Boolean)

  // Filters
  const [factories, setFactories] = useState([])
  const [locationId, setLocationId] = useState('')
  const [type, setType] = useState('')
  const [from, setFrom] = useState(monthStart())
  const [to, setTo] = useState(isoDate(new Date()))

  // Report
  const [report, setReport] = useState(null) // { header, rows }
  const [generatedFor, setGeneratedFor] = useState(null) // { factory, from, to }
  const [loading, setLoading] = useState(false)

  // Load factories, preselect the first
  useEffect(() => {
    let cancelled = false
    factoryApi
      .listFactories()
      .then((res) => {
        if (cancelled) return
        const d = res?.data
        const list = Array.isArray(d) ? d : d?.items ?? []
        const opts = list
          .filter((f) => !f.status || String(f.status).toUpperCase() === 'ACTIVE')
          .map((f) => ({
            value: f.id,
            label: f.code ? `${f.code} · ${f.name}` : f.name,
          }))
        setFactories(opts)
        setLocationId((cur) => cur || opts[0]?.value || '')
      })
      .catch((e) => {
        if (!cancelled) showToast('Could not load factories', e.message, true)
      })
    return () => {
      cancelled = true
    }
  }, [showToast])

  const filterError =
    !locationId ? 'Pick a factory' : !from || !to ? 'Pick both dates' : from > to ? '“From” must be on or before “To”' : ''
  const canGenerate = !filterError && !loading

  async function generate() {
    if (!canGenerate) return
    setLoading(true)
    try {
      const body = { locationId, from, to }
      if (type) body.type = type
      const res = await complianceApi.getVatReport(body)
      setReport(res.data)
      setGeneratedFor({
        factory: factories.find((s) => s.value === locationId)?.label || '',
        from,
        to,
      })
    } catch (e) {
      showToast('Could not generate VAT report', e.message, true)
    } finally {
      setLoading(false)
    }
  }

  const header = report?.header
  const rows = report?.rows || []

  const view = useMemo(() => {
    if (!header) return null
    const net = Number(header.netVatPayable) || 0
    return {
      outputVat: Number(header.outputVat) || 0,
      outputBase: Number(header.outputBase) || 0,
      inputVat: Number(header.inputVat) || 0,
      inputBase: Number(header.inputBase) || 0,
      net,
      payable: net >= 0,
      rate: pct(header.currentRate),
      outputLines: statementLines(rows, true, header.outputBase, header.outputVat, header.currentRate),
      inputLines: statementLines(rows, false, header.inputBase, header.inputVat, header.currentRate),
    }
  }, [header, rows])

  const columns = [
    { key: 'date', label: 'Date', width: 130, render: (t) => (t.date ? fmtDate(t.date) : '—') },
    { key: 'document', label: 'Document', width: 140, mono: true },
    {
      key: 'counterparty',
      label: 'Counterparty',
      width: 260,
      render: (t) => (
        <span>
          {t.counterparty || '—'}
          {t.counterpartyTin && (
            <span style={{ display: 'block', font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
              TIN {t.counterpartyTin}
            </span>
          )}
        </span>
      ),
    },
    { key: 'description', label: 'Description', width: 300 },
    {
      key: 'type',
      label: 'VAT type',
      width: 120,
      render: (t) => (
        <Badge tone={isOutput(t.type) ? 'brand' : 'neutral'}>{isOutput(t.type) ? 'Output' : 'Input'}</Badge>
      ),
    },
    {
      key: 'taxableAmount',
      label: 'Taxable amount',
      width: 170,
      align: 'right',
      mono: true,
      render: (t) => money(t.taxableAmount || 0),
    },
    { key: 'rate', label: 'Rate', width: 90, align: 'right', mono: true, render: (t) => pct(t.rate) },
    {
      key: 'vat',
      label: 'VAT',
      width: 165,
      align: 'right',
      mono: true,
      render: (t) => (
        <span style={{ color: isOutput(t.type) ? 'var(--success)' : 'var(--danger)' }}>
          {isOutput(t.type) ? '+' : '−'}
          {money(Math.abs(t.vat || 0))}
        </span>
      ),
    },
  ]

  return (
    <>
      {loading && <Loader overlay label="Generating VAT report…" />}
      <Page wide>
        <PageHeader
          crumbs={crumbs}
          title={leaf?.label || 'Factory VAT Report'}
          icon={leaf?.icon}
          description="Value Added Tax on the factory's transactions — VAT charged on sales set against VAT paid on purchases, for tax calculation, reporting and reconciliation."
          actions={
            report ? (
              <Button variant="secondary" iconLeft="printer" onClick={() => window.print()}>
                Print report
              </Button>
            ) : null
          }
        />

        <Panel title="Report filters" description="Choose the factory and period, then generate.">
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ width: 240 }}>
              <Select
                label="Factory *"
                options={[{ value: '', label: 'Select factory…' }, ...factories]}
                value={locationId}
                onChange={(v) => setLocationId(val(v))}
              />
            </div>
            <div style={{ width: 210 }}>
              <Select label="VAT type" options={TYPE_OPTIONS} value={type} onChange={(v) => setType(val(v))} />
            </div>
            <div style={{ width: 170 }}>
              <Input label="Period from *" type="date" value={from} onChange={(e) => setFrom(val(e))} />
            </div>
            <div style={{ width: 170 }}>
              <Input label="Period to *" type="date" value={to} onChange={(e) => setTo(val(e))} />
            </div>
            <Button iconLeft="play" onClick={generate} disabled={!canGenerate}>
              Generate report
            </Button>
          </div>
          {filterError && (
            <div style={{ marginTop: 10, font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
              {filterError} to generate.
            </div>
          )}
        </Panel>

        {!report && (
          <EmptyState
            icon="file-text"
            title="No report generated yet"
            description="Pick a factory and period above, then choose Generate report."
          />
        )}

        {report && view && (
          <>
            <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', margin: '4px 0 12px' }}>
              {generatedFor?.factory || header.location?.name} · {fmtDate(generatedFor?.from)} to{' '}
              {fmtDate(generatedFor?.to)}
            </div>

            {!header.vatEnabled && (
              <Callout
                tone="warning"
                icon="circle-alert"
                title="VAT collection is disabled for this factory"
                style={{ marginBottom: 14 }}
              >
                A factory with VAT collection disabled reports zero output VAT for the period.
              </Callout>
            )}

            {header.costVisible === false && (
              <Callout
                tone="info"
                icon="circle-alert"
                title="Purchase costs are hidden for your role"
                style={{ marginBottom: 14 }}
              >
                Input VAT figures may be incomplete because purchase costs aren't visible to you.
              </Callout>
            )}

            {(header.rateChanges || []).length > 1 && (
              <Callout
                tone="info"
                icon="circle-alert"
                title="The VAT rate changed"
                style={{ marginBottom: 14 }}
              >
                {header.rateChanges
                  .map((c) => `${pct(c.rate)} from ${fmtDate(c.effectiveFrom)}`)
                  .join(' · ')}
              </Callout>
            )}

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 12,
                marginBottom: 16,
              }}
            >
              <StatCard
                label="Output VAT"
                value={moneyShort(view.outputVat)}
                hint={`on ${moneyShort(view.outputBase)} of sales`}
              />
              <StatCard
                label="Input VAT"
                value={moneyShort(view.inputVat)}
                hint={`on ${moneyShort(view.inputBase)} of purchases`}
              />
              <StatCard
                label={view.payable ? 'Net VAT payable' : 'Net VAT reclaimable'}
                value={moneyShort(Math.abs(view.net))}
                tone={view.payable ? 'negative' : 'positive'}
              />
              <StatCard label="Factory rate" value={view.rate} hint="Per VAT Control" />
            </div>

            <Statement
              columns={['VAT']}
              sections={[
                {
                  title: 'Output VAT — charged on sales',
                  tone: 'positive',
                  rows: view.outputLines,
                  subtotal: { label: 'Total output VAT', values: [money(view.outputVat)] },
                },
                {
                  title: 'Input VAT — paid on purchases',
                  tone: 'negative',
                  rows: view.inputLines,
                  subtotal: { label: 'Total input VAT', values: [money(view.inputVat)] },
                },
              ]}
              result={{
                label: view.payable ? 'Net VAT payable to authority' : 'Net VAT reclaimable',
                note: view.payable
                  ? 'Output VAT collected exceeds input VAT recoverable for this period.'
                  : 'Input VAT recoverable exceeds output VAT collected for this period.',
                values: [money(Math.abs(view.net))],
                tone: view.payable ? 'negative' : 'positive',
              }}
            />

            <Panel title="VAT transaction detail" padding={0} style={{ marginTop: 16 }}>
              {rows.length === 0 ? (
                <EmptyState
                  compact
                  icon="file-text"
                  title="No VAT transactions in this period"
                  description="Widen the period or clear the VAT type filter, then generate again."
                />
              ) : (
                <ReportTable
                  columns={columns}
                  rows={rows}
                  rowKey={(t, i) => `${t.document}-${i}`}
                  totals={{ date: 'Net VAT', vat: money(view.net) }}
                  stickyHeader={false}
                  style={{ border: 'none', borderRadius: 0 }}
                />
              )}
            </Panel>

            <div style={{ marginTop: 12, font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
              VAT is applied at the rate configured for this factory in VAT Control, currently {view.rate}.
            </div>
          </>
        )}
      </Page>
    </>
  )
}