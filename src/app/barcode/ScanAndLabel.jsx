import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Icon } from '../../ds/components/core/Icon.jsx'
import { Checkbox } from '../../ds/components/forms/Checkbox.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import { Tabs } from '../../ds/components/navigation/Tabs.jsx'
import { ReportTable } from '../../ds/components/data/ReportTable.jsx'
import { Page, Panel, MetaRow, Callout, EmptyState } from '../shells/Page.jsx'
import { PageHeader } from '../shells/PageHeader.jsx'
import { CodeMark } from './CodeArt.jsx'
import { scannableItems, recentScans, labelSizes } from '../sampleBarcode.js'
import { fmt, money } from '../utils.js'

const TABS = [
  { value: 'scan', label: 'Scan', icon: 'scan-line' },
  { value: 'labels', label: 'Generate labels', icon: 'qr-code' },
]

const KIND_TONE = {
  'Finished product': 'brand',
  'Raw material': 'neutral',
  'In-house recipe': 'info',
  'Outsourced product': 'warning',
}

const RESULT_TONE = { Matched: 'success', 'Not recognised': 'danger', Blocked: 'warning' }

/** Resolves a scanned value the way each scan-enabled screen would. */
function resolve(code) {
  const value = code.trim()
  if (!value) return null
  const item = scannableItems.find((i) => i.barcode && i.barcode.toLowerCase() === value.toLowerCase())
  if (!item) return { outcome: 'Not recognised', code: value }
  // A transaction may never proceed against a suspended product.
  if (item.status !== 'Active') return { outcome: 'Blocked', code: value, item }
  return { outcome: 'Matched', code: value, item }
}

function ScanTab() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [log, setLog] = useState(recentScans)

  function submit(e) {
    e.preventDefault()
    const r = resolve(input)
    if (!r) return
    setResult(r)
    setLog((l) => [
      {
        time: 'just now',
        code: r.code,
        result: r.outcome,
        item: r.item ? `${r.item.code} · ${r.item.name}` : '—',
        context: 'Scan & Label',
        by: 'F. Adeniyi',
        note: r.outcome === 'Blocked' ? 'Product suspended from sale' : undefined,
      },
      ...l,
    ])
    setInput('')
  }

  const logColumns = [
    { key: 'time', label: 'Time', width: 120, mono: true },
    { key: 'code', label: 'Code scanned', width: 190, mono: true },
    {
      key: 'result', label: 'Result', width: 165,
      render: (s) => <Badge tone={RESULT_TONE[s.result] || 'neutral'}>{s.result}</Badge>,
    },
    { key: 'item', label: 'Resolved to', width: 280 },
    { key: 'context', label: 'Scanned in', width: 180 },
    { key: 'by', label: 'Scanned by', width: 160 },
    { key: 'note', label: 'Note', width: 240, render: (s) => s.note || '—' },
  ]

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, minWidth: 0 }}>
          <Panel title="Scan a code" description="Use a handheld scanner, a mobile camera, or key the value in by hand.">
            <form onSubmit={submit} style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10, height: 46, padding: '0 14px', flex: '1 1 300px',
                background: 'var(--surface-card)', border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-control)', boxShadow: 'var(--shadow-xs)',
              }}>
                <Icon name="scan-line" size={19} color="var(--brand)" />
                <input
                  autoFocus
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Scan or type a barcode / QR value…"
                  style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent', font: 'var(--fw-medium) var(--text-lg)/1 var(--font-mono)', color: 'var(--text-strong)' }}
                />
              </div>
              <Button type="submit" size="lg" iconLeft="search">Look up</Button>
              <Button type="button" size="lg" variant="secondary" iconLeft="camera">Use camera</Button>
            </form>
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)' }}>Try:</span>
              {['6151100101012', 'ZIQ-RC-01-0480', '6151100420010', '5901234123457'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setInput(c)}
                  style={{
                    height: 24, padding: '0 9px', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                    background: 'var(--surface-sunken)', border: '1px solid var(--border-subtle)',
                    font: 'var(--fw-medium) var(--text-2xs)/1 var(--font-mono)', color: 'var(--text-body)',
                  }}
                >{c}</button>
              ))}
            </div>
          </Panel>

          {result?.outcome === 'Matched' && (
            <Panel title="Match found" description="The scanned code resolves to a registered item, ready to act on.">
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
                <div style={{ padding: 10, background: '#fff', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)' }}>
                  <CodeMark value={result.item.barcode} symbology={result.item.symbology} />
                </div>
                <div style={{ flex: '1 1 260px', minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                    <span style={{ font: 'var(--fw-bold) var(--text-lg)/1.2 var(--font-ui)', color: 'var(--text-strong)' }}>{result.item.name}</span>
                    <Badge tone={KIND_TONE[result.item.kind] || 'neutral'}>{result.item.kind}</Badge>
                  </div>
                  <MetaRow label="Product code" value={result.item.code} mono />
                  <MetaRow label="Unit price" value={money(result.item.price)} mono />
                  <MetaRow label="Available" value={`${fmt(result.item.stock)} ${result.item.unit.toLowerCase()}`} mono />
                  <MetaRow label="Location" value={result.item.location} />
                  <MetaRow label="Symbology" value={result.item.symbology} />
                </div>
              </div>
              <Callout tone="success" icon="circle-check" title="Ready to use" style={{ marginTop: 16 }}>
                Product, price and available stock are populated from the scan. In Stock Refill, Transfer,
                Adjustment, Receive Product or POS this would fill the product field directly.
              </Callout>
            </Panel>
          )}

          {result?.outcome === 'Not recognised' && (
            <Panel title="Code not recognised">
              <Callout tone="danger" icon="circle-alert" title={`No registered product matches ${result.code}`}>
                No transaction can proceed against an unrecognised code. Register the item first, or enter the
                product manually using the fallback that every scan-enabled screen keeps available.
              </Callout>
              <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Button iconLeft="plus">Register this item</Button>
                <Button variant="secondary" iconLeft="keyboard">Enter manually instead</Button>
                <Button variant="ghost" onClick={() => setResult(null)}>Scan again</Button>
              </div>
            </Panel>
          )}

          {result?.outcome === 'Blocked' && (
            <Panel title="Product recognised but blocked">
              <Callout tone="warning" icon="circle-pause" title={`${result.item.name} is ${result.item.status.toLowerCase()}`}>
                The code matched a registered product, but it is currently suspended from sale. A transaction
                cannot be processed against a suspended, deleted or inactive product — resume it in Recycle Bin
                first if this is wrong.
              </Callout>
              <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
                <Button variant="secondary" iconLeft="play">Review in Recycle Bin</Button>
                <Button variant="ghost" onClick={() => setResult(null)}>Scan again</Button>
              </div>
            </Panel>
          )}

          {!result && (
            <Panel padding={0}>
              <EmptyState
                icon="scan-line"
                title="Waiting for a scan"
                description="Scan a product to see what it resolves to. Nothing is committed here — this screen only identifies the item."
              />
            </Panel>
          )}
      </div>

      <Panel title="Scan log" description="Recent scans across every scan-enabled screen." padding={0}>
        <ReportTable
          columns={logColumns}
          rows={log}
          rowKey={(s, i) => `${s.time}-${s.code}-${i}`}
          stickyHeader={false}
          style={{ border: 'none', borderRadius: 0 }}
        />
      </Panel>
    </>
  )
}

function LabelsTab() {
  const labelled = scannableItems.filter((i) => i.barcode)
  const unlabelled = scannableItems.filter((i) => !i.barcode)
  const [selected, setSelected] = useState([labelled[0].code])
  const [size, setSize] = useState('58x40')

  const toggle = (code) =>
    setSelected((s) => (s.includes(code) ? s.filter((c) => c !== code) : [...s, code]))

  const chosen = scannableItems.filter((i) => selected.includes(i.code))

  return (
    <>
      {unlabelled.length > 0 && (
        <Callout tone="warning" icon="triangle-alert" title={`${unlabelled.length} registered items have no code assigned`}>
          {unlabelled.map((i) => `${i.code} · ${i.name}`).join(', ')} cannot be scanned anywhere until a code is
          generated. Generate one below so they are scannable from day one.
        </Callout>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: 20, alignItems: 'start' }} className="zq-formlayout">
        <Panel
          title="Select items to label"
          description="Every registered finished product, raw material, outsourced product and in-house recipe can carry a code."
          actions={
            <Button
              variant="secondary"
              size="sm"
              iconLeft={selected.length === scannableItems.length ? 'square' : 'check-check'}
              onClick={() => setSelected(selected.length === scannableItems.length ? [] : scannableItems.map((i) => i.code))}
            >
              {selected.length === scannableItems.length ? 'Clear all' : 'Select all'}
            </Button>
          }
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 10 }}>
            {scannableItems.map((i) => {
              const on = selected.includes(i.code)
              return (
                <div
                  key={i.code}
                  onClick={() => toggle(i.code)}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', cursor: 'pointer',
                    background: on ? 'var(--brand-subtle)' : 'var(--surface-card)',
                    border: `1px solid ${on ? 'var(--brand-border)' : 'var(--border-default)'}`,
                    borderRadius: 'var(--radius-md)', transition: 'var(--transition-control)',
                  }}
                >
                  <Checkbox checked={on} onChange={() => toggle(i.code)} />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
                      <span style={{ font: 'var(--fw-bold) var(--text-sm)/1.3 var(--font-mono)', color: 'var(--text-strong)' }}>{i.code}</span>
                      <Badge tone={KIND_TONE[i.kind] || 'neutral'}>{i.kind}</Badge>
                    </div>
                    <div style={{ font: 'var(--fw-medium) var(--text-sm)/1.3 var(--font-ui)', color: 'var(--text-body)', marginTop: 4 }}>{i.name}</div>
                    <div style={{ font: 'var(--type-caption)', color: i.barcode ? 'var(--text-subtle)' : 'var(--warning)', marginTop: 3 }}>
                      {i.barcode ? `${i.symbology} · ${i.barcode}` : 'No code assigned — will be generated'}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Panel>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Panel title="Label preview">
            {chosen.length === 0 ? (
              <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)' }}>
                Select an item to preview its label.
              </div>
            ) : (
              <div style={{
                display: 'grid', placeItems: 'center', gap: 8, padding: '18px 14px',
                background: '#fff', border: '1px dashed var(--border-strong)', borderRadius: 'var(--radius-md)',
              }}>
                <div style={{ font: 'var(--fw-bold) var(--text-sm)/1.2 var(--font-ui)', color: 'var(--n-950)', textAlign: 'center' }}>
                  {chosen[0].name}
                </div>
                <div style={{ font: 'var(--fw-medium) var(--text-2xs)/1 var(--font-mono)', color: 'var(--n-700)' }}>
                  {chosen[0].code} · {chosen[0].unit}
                </div>
                <CodeMark
                  value={chosen[0].barcode || `ZIQ-${chosen[0].code}-NEW`}
                  symbology={chosen[0].symbology || 'QR'}
                />
                <div style={{ font: 'var(--fw-medium) var(--text-2xs)/1 var(--font-mono)', letterSpacing: '0.1em', color: 'var(--n-950)' }}>
                  {chosen[0].barcode || 'Generated on save'}
                </div>
              </div>
            )}
            <div style={{ marginTop: 12, font: 'var(--type-caption)', color: 'var(--text-subtle)', lineHeight: 1.6 }}>
              Preview only — the scannable encoding is applied by the label renderer at print.
            </div>
          </Panel>

          <Panel title="Print run">
            <Select label="Label size" options={labelSizes} value={size} onChange={(e) => setSize(e.target.value)} />
            <div style={{ marginTop: 12 }}>
              <MetaRow label="Items selected" value={chosen.length} mono />
              <MetaRow label="Codes to generate" value={chosen.filter((i) => !i.barcode).length} mono tone={chosen.some((i) => !i.barcode) ? 'positive' : undefined} />
              <MetaRow label="Label size" value={labelSizes.find((l) => l.value === size)?.label.split(' — ')[0]} />
            </div>
            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Button fullWidth iconLeft="printer" disabled={chosen.length === 0}>Print {chosen.length} label{chosen.length === 1 ? '' : 's'}</Button>
              <Button fullWidth variant="secondary" iconLeft="download" disabled={chosen.length === 0}>Download as PDF</Button>
            </div>
          </Panel>
        </div>
      </div>
    </>
  )
}

export default function ScanAndLabel({ leaf, moduleLabel, parentLabel }) {
  const [tab, setTab] = useState('scan')

  return (
    <Page wide>
      <PageHeader
        crumbs={[moduleLabel, parentLabel]}
        title={leaf?.label || 'Scan & Label'}
        icon={leaf?.icon}
        description="Identify products by scanning instead of searching, and generate the printable codes that make that possible. Scanning is optional everywhere it is offered — manual entry always remains available."
        actions={<Button variant="secondary" iconLeft="settings-2">Scanner settings</Button>}
      />

      <Tabs tabs={TABS} value={tab} onChange={setTab} />

      {tab === 'scan' ? <ScanTab /> : <LabelsTab />}
    </Page>
  )
}
