import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Icon } from '../../ds/components/core/Icon.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { RegisterShell } from '../shells/RegisterShell.jsx'
import { Panel } from '../shells/Page.jsx'
import { exchangeRates } from '../sampleProcess.js'

const rate = (n) => `₦${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export default function ExchangeRate({ leaf, moduleLabel, parentLabel }) {
  const [edits, setEdits] = useState({})

  const rows = exchangeRates.map((r) => {
    const move = r.buy - r.previous
    const pct = (move / r.previous) * 100
    return { ...r, move, pct }
  })

  const stale = rows.filter((r) => !r.updated.startsWith('24 Aug'))

  const columns = [
    { key: 'code', label: 'Code', width: 90, mono: true },
    { key: 'currency', label: 'Currency', width: 200 },
    { key: 'buy', label: 'Buying rate', width: 165, align: 'right', mono: true, render: (r) => rate(r.buy) },
    { key: 'sell', label: 'Selling rate', width: 165, align: 'right', mono: true, render: (r) => rate(r.sell) },
    { key: 'spread', label: 'Spread', width: 130, align: 'right', mono: true, render: (r) => rate(r.sell - r.buy) },
    {
      key: 'move', label: 'Movement', width: 165, align: 'right', mono: true,
      render: (r) => (
        r.move === 0
          ? <span style={{ color: 'var(--text-subtle)' }}>No change</span>
          : (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: r.move > 0 ? 'var(--success)' : 'var(--danger)' }}>
              <Icon name={r.move > 0 ? 'trending-up' : 'trending-down'} size={12} />
              {r.move > 0 ? '+' : ''}{r.pct.toFixed(2)}%
            </span>
          )
      ),
    },
    { key: 'updated', label: 'Last updated', width: 190 },
    { key: 'updatedBy', label: 'Updated by', width: 160 },
    {
      key: 'freshness', label: 'Status', width: 130,
      render: (r) => <Badge tone={r.updated.startsWith('24 Aug') ? 'success' : 'warning'}>{r.updated.startsWith('24 Aug') ? 'Current' : 'Stale'}</Badge>,
    },
  ]

  return (
    <RegisterShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Exchange Rate'}
      icon={leaf?.icon}
      description="Maintain the daily rate of each foreign currency against the Naira. Rates set here are applied wherever imported costs and foreign-currency transactions are valued."
      headerActions={<Button iconLeft="save">Publish today&rsquo;s rates</Button>}
      searchPlaceholder="Search by currency or code…"
      stats={[
        { label: 'Currencies tracked', value: String(rows.length) },
        { label: 'Updated today', value: String(rows.length - stale.length) },
        { label: 'Stale rates', value: String(stale.length), tone: stale.length ? 'warning' : undefined, hint: stale.length ? 'Needs review' : undefined },
        { label: 'USD buying rate', value: rate(rows[0].buy), hint: `${rows[0].move > 0 ? '+' : ''}${rows[0].pct.toFixed(2)}% on previous` },
      ]}
      columns={columns}
      rows={rows}
      onRowClick={() => {}}
      emptyTitle="No currencies configured"
      emptyDescription="Add a currency to begin maintaining its daily rate."
      footnote="Rates apply from the moment they are published and are stamped against every transaction valued in foreign currency, so historic records keep the rate that applied at the time."
    >
      <Panel title="Set today&rsquo;s rates" description="Enter the buying and selling rate for each currency, then publish.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {exchangeRates.map((r) => (
            <div key={r.code} style={{ padding: '14px 16px', background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ display: 'grid', placeItems: 'center', width: 26, height: 26, borderRadius: 'var(--radius-sm)', background: 'var(--surface-sunken)', font: 'var(--fw-bold) var(--text-sm)/1 var(--font-mono)', color: 'var(--text-strong)' }}>
                  {r.symbol}
                </span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ font: 'var(--fw-bold) var(--text-sm)/1.2 var(--font-ui)', color: 'var(--text-strong)' }}>{r.code}</div>
                  <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)' }}>{r.currency}</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <Input
                  label="Buy"
                  type="number"
                  value={edits[`${r.code}-buy`] ?? r.buy}
                  onChange={(e) => setEdits((s) => ({ ...s, [`${r.code}-buy`]: e.target.value }))}
                />
                <Input
                  label="Sell"
                  type="number"
                  value={edits[`${r.code}-sell`] ?? r.sell}
                  onChange={(e) => setEdits((s) => ({ ...s, [`${r.code}-sell`]: e.target.value }))}
                />
              </div>
              <div style={{ marginTop: 8, font: 'var(--type-caption)', color: 'var(--text-subtle)' }}>
                Previous close {rate(r.previous)}
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </RegisterShell>
  )
}
