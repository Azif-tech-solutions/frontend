import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Icon } from '../../ds/components/core/Icon.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import { Page, MetaRow, Callout } from '../shells/Page.jsx'
import { PageHeader } from '../shells/PageHeader.jsx'
import { DocumentSheet } from '../shells/DocumentView.jsx'
import { VAT_RATE } from '../sample.js'
import { posCatalogue, posCustomers, paymentChannels } from '../sampleMenu.js'
import { fmt, money } from '../utils.js'

const CATEGORIES = ['All', 'Citrus Drink', 'Malt Classic', 'Outsourced', 'Ungrouped']

function Till({ leaf, moduleLabel, parentLabel, onComplete }) {
  const [customerId, setCustomerId] = useState('walkin')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [cart, setCart] = useState([])
  const [paid, setPaid] = useState({})

  const customer = posCustomers.find((c) => c.value === customerId) || posCustomers[0]
  const isDealer = customer.type === 'Authorised Dealer'
  const priceFor = (p) => (isDealer ? p.dealerPrice : p.price)

  const visible = posCatalogue.filter((p) => {
    const matchesCategory = category === 'All' || p.group === category
    const q = query.trim().toLowerCase()
    const matchesQuery = !q || p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q) || p.barcode.includes(q)
    return matchesCategory && matchesQuery
  })

  function addToCart(p) {
    setCart((c) => {
      const found = c.find((l) => l.code === p.code)
      if (found) {
        if (found.qty >= p.stock) return c
        return c.map((l) => (l.code === p.code ? { ...l, qty: l.qty + 1 } : l))
      }
      return [...c, { code: p.code, name: p.name, unit: p.unit, stock: p.stock, qty: 1 }]
    })
  }

  const setQty = (code, qty) =>
    setCart((c) => c.map((l) => (l.code === code ? { ...l, qty: Math.max(0, Math.min(qty, l.stock)) } : l)).filter((l) => l.qty > 0))

  const subtotal = cart.reduce((n, l) => {
    const p = posCatalogue.find((x) => x.code === l.code)
    return n + priceFor(p) * l.qty
  }, 0)
  const vat = subtotal * VAT_RATE
  const total = subtotal + vat

  const allocated = paymentChannels.reduce((n, ch) => n + (Number(paid[ch.key]) || 0), 0)
  const remaining = total - allocated
  const walletUsed = Number(paid.wallet) || 0

  // Guards the PRD is explicit about: a wallet may never go negative, and the
  // payment split must settle the invoice exactly before the sale completes.
  const walletOverdrawn = isDealer && customer.wallet != null && walletUsed > customer.wallet
  const walletUnavailable = !isDealer && walletUsed > 0
  const overAllocated = remaining < -0.005
  const settled = cart.length > 0 && Math.abs(remaining) < 0.005 && !walletOverdrawn && !walletUnavailable

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <div style={{ padding: '20px var(--gutter) 0' }}>
        <PageHeader
          crumbs={[moduleLabel, parentLabel]}
          title={leaf?.label || 'Point of Sale'}
          icon={leaf?.icon}
          meta={
            <>
              <Badge tone="neutral" uppercase>Till POS-IKJ-01</Badge>
              <Badge tone="neutral">Cashier · F. Adeniyi</Badge>
              <Badge tone="neutral">Showroom Ikeja</Badge>
            </>
          }
          actions={<Button variant="secondary" iconLeft="rotate-ccw" onClick={() => { setCart([]); setPaid({}) }}>Clear sale</Button>}
        />
      </div>

      <div className="zq-pos" style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 420px', gap: 20, padding: '20px var(--gutter) 28px' }}>
        {/* ── Catalogue ─────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0, minHeight: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, height: 38, padding: '0 12px', flex: '1 1 280px',
              background: 'var(--surface-card)', border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-control)', boxShadow: 'var(--shadow-xs)',
            }}>
              <Icon name="search" size={16} color="var(--text-subtle)" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search or scan a product…"
                style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent', font: 'var(--fw-regular) var(--text-md)/1 var(--font-ui)', color: 'var(--text-strong)' }}
              />
              <Button size="sm" variant="secondary" iconLeft="qr-code">Scan</Button>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  style={{
                    height: 30, padding: '0 12px', borderRadius: 'var(--radius-full)', cursor: 'pointer',
                    background: category === c ? 'var(--brand)' : 'var(--surface-card)',
                    border: `1px solid ${category === c ? 'var(--brand)' : 'var(--border-default)'}`,
                    color: category === c ? 'var(--brand-on)' : 'var(--text-body)',
                    font: 'var(--fw-semibold) var(--text-xs)/1 var(--font-ui)', transition: 'var(--transition-control)',
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', paddingRight: 2 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 12 }}>
              {visible.map((p) => {
                const inCart = cart.find((l) => l.code === p.code)?.qty || 0
                const soldOut = inCart >= p.stock
                const low = p.stock < 100
                return (
                  <button
                    key={p.code}
                    type="button"
                    onClick={() => addToCart(p)}
                    disabled={soldOut}
                    style={{
                      textAlign: 'left', padding: '14px 15px', cursor: soldOut ? 'not-allowed' : 'pointer',
                      background: 'var(--surface-card)',
                      border: `1px solid ${inCart ? 'var(--brand-border)' : 'var(--border-default)'}`,
                      borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-xs)',
                      opacity: soldOut ? 0.55 : 1, position: 'relative',
                      transition: 'var(--transition-control)',
                    }}
                  >
                    {inCart > 0 && (
                      <span style={{
                        position: 'absolute', top: 10, right: 10, display: 'grid', placeItems: 'center',
                        minWidth: 20, height: 20, padding: '0 6px', borderRadius: 'var(--radius-full)',
                        background: 'var(--brand)', color: 'var(--brand-on)',
                        font: 'var(--fw-bold) var(--text-2xs)/1 var(--font-mono)',
                      }}>{inCart}</span>
                    )}
                    <div style={{ font: 'var(--fw-semibold) var(--text-2xs)/1 var(--font-mono)', color: 'var(--text-subtle)' }}>{p.code}</div>
                    <div style={{ font: 'var(--fw-semibold) var(--text-sm)/1.35 var(--font-ui)', color: 'var(--text-strong)', marginTop: 6, minHeight: 36 }}>{p.name}</div>
                    <div style={{ font: 'var(--fw-bold) var(--text-md)/1 var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: 'var(--text-strong)', marginTop: 8 }}>
                      {money(priceFor(p))}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                      <span style={{ font: 'var(--type-caption)', color: low ? 'var(--warning)' : 'var(--text-subtle)' }}>
                        {fmt(p.stock)} {p.unit.toLowerCase()} in stock
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
            {visible.length === 0 && (
              <div style={{ display: 'grid', placeItems: 'center', padding: 48, font: 'var(--type-ui)', color: 'var(--text-subtle)' }}>
                No products match “{query}”.
              </div>
            )}
          </div>
        </div>

        {/* ── Sale ──────────────────────────────────────────────────── */}
        <div style={{
          display: 'flex', flexDirection: 'column', minHeight: 0,
          background: 'var(--surface-card)', border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-xs)', overflow: 'hidden',
        }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
            <Select
              label="Customer"
              options={posCustomers}
              value={customerId}
              onChange={(e) => { setCustomerId(e.target.value); setPaid({}) }}
            />
            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <Badge tone={isDealer ? 'brand' : customer.type === 'Special Customer' ? 'info' : 'neutral'}>{customer.type}</Badge>
              {customer.category && <Badge tone="neutral">{customer.category}</Badge>}
              {isDealer && <Badge tone="neutral">Dealer pricing applied</Badge>}
            </div>
            <div style={{ marginTop: 10 }}>
              <MetaRow label="Assigned correspondent" value={customer.rep} />
              {isDealer && <MetaRow label="Wallet balance" value={money(customer.wallet)} mono />}
              {customer.deposit != null && <MetaRow label="Deposit held" value={money(customer.deposit)} mono />}
            </div>
          </div>

          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
            {cart.length === 0 ? (
              <div style={{ display: 'grid', placeItems: 'center', gap: 8, padding: '48px 20px', textAlign: 'center' }}>
                <Icon name="shopping-cart" size={22} color="var(--text-subtle)" />
                <div style={{ font: 'var(--fw-semibold) var(--text-sm)/1.3 var(--font-ui)', color: 'var(--text-muted)' }}>No items yet</div>
                <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', maxWidth: '30ch' }}>
                  Search, scan or tap a product to begin the sale.
                </div>
              </div>
            ) : (
              cart.map((l) => {
                const p = posCatalogue.find((x) => x.code === l.code)
                const atMax = l.qty >= l.stock
                return (
                  <div key={l.code} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ font: 'var(--fw-semibold) var(--text-sm)/1.3 var(--font-ui)', color: 'var(--text-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.name}</div>
                      <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', marginTop: 2 }}>
                        {money(priceFor(p))} × {l.qty}{atMax ? ' · max stock' : ''}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: '0 0 auto' }}>
                      <button type="button" onClick={() => setQty(l.code, l.qty - 1)} aria-label="Decrease"
                        style={{ display: 'grid', placeItems: 'center', width: 24, height: 24, border: '1px solid var(--border-default)', background: 'var(--surface-card)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: 'var(--text-body)' }}>
                        <Icon name="minus" size={12} />
                      </button>
                      <span style={{ minWidth: 26, textAlign: 'center', font: 'var(--fw-bold) var(--text-sm)/1 var(--font-mono)', color: 'var(--text-strong)' }}>{l.qty}</span>
                      <button type="button" onClick={() => setQty(l.code, l.qty + 1)} disabled={atMax} aria-label="Increase"
                        style={{ display: 'grid', placeItems: 'center', width: 24, height: 24, border: '1px solid var(--border-default)', background: 'var(--surface-card)', borderRadius: 'var(--radius-sm)', cursor: atMax ? 'not-allowed' : 'pointer', opacity: atMax ? 0.4 : 1, color: 'var(--text-body)' }}>
                        <Icon name="plus" size={12} />
                      </button>
                    </div>
                    <span style={{ minWidth: 92, textAlign: 'right', font: 'var(--fw-semibold) var(--text-sm)/1 var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: 'var(--text-strong)' }}>
                      {money(priceFor(p) * l.qty)}
                    </span>
                  </div>
                )
              })
            )}
          </div>

          <div style={{ borderTop: '1px solid var(--border-default)', padding: '14px 16px', background: 'var(--surface-sunken)' }}>
            <MetaRow label={`Subtotal · ${cart.length} line${cart.length === 1 ? '' : 's'}`} value={money(subtotal)} mono />
            <MetaRow label={`VAT at ${(VAT_RATE * 100).toFixed(1)}%`} value={money(vat)} mono />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 12 }}>
              <span style={{ font: 'var(--fw-bold) var(--text-md)/1 var(--font-ui)', color: 'var(--text-strong)' }}>Total</span>
              <span style={{ font: 'var(--fw-bold) var(--text-2xl)/1 var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: 'var(--text-strong)' }}>{money(total)}</span>
            </div>

            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ font: 'var(--type-eyebrow)', letterSpacing: 'var(--ls-widest)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Payment</div>
              {paymentChannels.map((ch) => {
                const disabled = ch.key === 'wallet' && !isDealer
                const invalid = ch.key === 'wallet' && walletOverdrawn
                return (
                  <div key={ch.key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 7, flex: 1, minWidth: 0, opacity: disabled ? 0.45 : 1 }}>
                      <Icon name={ch.icon} size={14} color="var(--text-muted)" />
                      <span style={{ font: 'var(--type-ui)', color: 'var(--text-body)' }}>{ch.label}</span>
                    </span>
                    <input
                      type="number"
                      value={paid[ch.key] ?? ''}
                      onChange={(e) => setPaid((s) => ({ ...s, [ch.key]: e.target.value }))}
                      placeholder="0.00"
                      disabled={disabled}
                      style={{
                        width: 130, height: 30, padding: '0 10px', textAlign: 'right',
                        background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
                        border: `1px solid ${invalid ? 'var(--danger)' : 'var(--border-default)'}`,
                        borderRadius: 'var(--radius-control)', outline: 'none',
                        font: 'var(--fw-medium) var(--text-sm)/1 var(--font-mono)', fontVariantNumeric: 'tabular-nums',
                        color: invalid ? 'var(--danger)' : 'var(--text-strong)',
                      }}
                    />
                  </div>
                )
              })}
              {cart.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 6 }}>
                  <span style={{ font: 'var(--type-ui)', color: 'var(--text-muted)' }}>
                    {remaining > 0.005 ? 'Left to allocate' : remaining < -0.005 ? 'Over-allocated' : 'Fully settled'}
                  </span>
                  <span style={{
                    font: 'var(--fw-bold) var(--text-sm)/1 var(--font-mono)', fontVariantNumeric: 'tabular-nums',
                    color: Math.abs(remaining) < 0.005 ? 'var(--success)' : 'var(--danger)',
                  }}>
                    {money(Math.abs(remaining))}
                  </span>
                </div>
              )}
            </div>

            {walletOverdrawn && (
              <Callout tone="danger" icon="circle-alert" title="Wallet balance exceeded" style={{ marginTop: 12 }}>
                {customer.label} holds {money(customer.wallet)}. A wallet may never go negative — reduce the wallet
                amount and settle the balance another way.
              </Callout>
            )}
            {overAllocated && !walletOverdrawn && (
              <Callout tone="warning" icon="circle-alert" style={{ marginTop: 12 }}>
                Payment exceeds the invoice total by {money(Math.abs(remaining))}.
              </Callout>
            )}

            <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
              <Button fullWidth disabled={!settled} iconLeft="check" onClick={() => settled && onComplete({ customer, cart, subtotal, vat, total, paid })}>
                Complete sale
              </Button>
            </div>
            <div style={{ marginTop: 8, font: 'var(--type-caption)', color: 'var(--text-subtle)', textAlign: 'center' }}>
              Stock is deducted and the wallet debited only once the sale completes.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Invoice({ sale, onBack, crumbs }) {
  const { customer, cart, subtotal, vat, total, paid } = sale
  const isDealer = customer.type === 'Authorised Dealer'
  const priceFor = (p) => (isDealer ? p.dealerPrice : p.price)

  return (
    <Page>
      <PageHeader
        crumbs={crumbs}
        title="Sale completed"
        icon="receipt"
        description="An invoice has been generated and assigned to the customer's correspondent. Stock has been deducted and any wallet payment applied."
        meta={<Badge tone="success">Invoice INV-31392 issued</Badge>}
        actions={
          <>
            <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>New sale</Button>
            <Button variant="secondary" iconLeft="send">Email invoice</Button>
            <Button iconLeft="printer">Print receipt</Button>
          </>
        }
      />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <DocumentSheet
          docType="Invoice"
          docNumber="INV-31392"
          issuer={{
            name: 'ZifIQ Manufacturing Ltd',
            address: 'Showroom Ikeja — 14 Awolowo Way, Ikeja, Lagos',
            contact: 'sales@zifiq.com · +234 802 000 0000',
            vatId: 'NG-VAT-4471029',
          }}
          party={{ name: customer.label, address: customer.type, contact: `Correspondent: ${customer.rep}` }}
          meta={[
            { label: 'Date', value: '24 Aug 2026' },
            { label: 'Cashier', value: 'F. Adeniyi' },
            { label: 'Till', value: 'POS-IKJ-01', mono: true },
          ]}
          columns={[
            { key: 'name', label: 'Description' },
            { key: 'qty', label: 'Qty', align: 'right', mono: true },
            { key: 'unit', label: 'Unit' },
            { key: 'price', label: 'Unit price', align: 'right', mono: true },
            { key: 'amount', label: 'Amount', align: 'right', mono: true },
          ]}
          lines={cart.map((l) => {
            const p = posCatalogue.find((x) => x.code === l.code)
            return { name: l.name, qty: fmt(l.qty), unit: l.unit, price: money(priceFor(p)), amount: money(priceFor(p) * l.qty) }
          })}
          totals={[
            { label: 'Subtotal', value: money(subtotal) },
            { label: 'VAT', value: money(vat) },
            { label: 'Total paid', value: money(total), emphasis: true },
            ...paymentChannels
              .filter((ch) => Number(paid[ch.key]) > 0)
              .map((ch) => ({ label: `— ${ch.label}`, value: money(Number(paid[ch.key])) })),
          ]}
          stamp={<Badge tone="success" uppercase>Paid</Badge>}
          footer={`Sale assigned to ${customer.rep} for commission attribution. Goods not collected at the point of sale can be released later through Generate Waybill against this invoice number.`}
        />
      </div>
    </Page>
  )
}

export default function POS({ leaf, moduleLabel, parentLabel }) {
  const [sale, setSale] = useState(null)
  const crumbs = [moduleLabel, parentLabel, leaf?.label].filter(Boolean)

  if (sale) return <Invoice sale={sale} crumbs={crumbs} onBack={() => setSale(null)} />
  return <Till leaf={leaf} moduleLabel={moduleLabel} parentLabel={parentLabel} onComplete={setSale} />
}
