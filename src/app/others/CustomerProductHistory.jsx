import { useEffect, useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import Loader from '../../ds/components/core/Loader.jsx'
import { ReportShell } from '../shells/ReportShell.jsx'
import { Panel, MetaRow } from '../shells/Page.jsx'
import { useStore } from '../store.jsx'
import { fmt, money, moneyShort, fmtDate } from '../utils.js'
import ReportsApi from '../../api/ReportsApi.js'

const reportsApi = new ReportsApi()

const TYPE_TONE = {
  AUTHORISED_DEALER: 'brand',
  SPECIAL_CUSTOMER: 'info',
  ORDINARY_CUSTOMER: 'neutral',
  NO_CREDIT_WALKIN: 'neutral',
}
const STATUS_TONE = { ACTIVE: 'success', WATCH: 'warning', SUSPENDED: 'danger' }

const TOP_PRODUCTS = 10

const isoDaysAgo = (n) => {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

const normStatus = (s) => String(s || '').toUpperCase()
const invoiceTone = (s) => {
  const v = normStatus(s)
  if (v === 'DRAFT') return 'neutral'
  if (v === 'PAID') return 'success'
  if (v.includes('PARTIAL')) return 'warning'
  if (v.includes('OVERDUE') || v.includes('VOID') || v.includes('CANCEL')) return 'danger'
  return 'brand'
}

const pretty = (s) =>
  String(s || '')
    .toLowerCase()
    .split('_')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

// Simple CSS-grid table for the secondary panels
function SimpleTable({ template, headers, rows, empty = 'Nothing to show.', onRowClick }) {
  const rowStyle = {
    display: 'grid',
    gridTemplateColumns: template,
    gap: 10,
    padding: '10px 0',
  }
  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ minWidth: 'fit-content' }}>
        <div
          style={{
            ...rowStyle,
            borderBottom: '1px solid var(--border-default)',
            font: 'var(--type-eyebrow)',
            letterSpacing: 'var(--ls-widest)',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
          }}
        >
          {headers.map((h, i) => (
            <div key={i} style={{ textAlign: h.align }}>
              {h.label}
            </div>
          ))}
        </div>
        {rows.length === 0 && (
          <div style={{ padding: '14px 0', color: 'var(--text-muted)' }}>{empty}</div>
        )}
        {rows.map((cells, ri) => (
          <div
            key={ri}
            onClick={onRowClick ? () => onRowClick(ri) : undefined}
            style={{
              ...rowStyle,
              alignItems: 'center',
              borderBottom: '1px solid var(--border-subtle)',
              font: 'var(--type-body)',
              color: 'var(--text-strong)',
              cursor: onRowClick ? 'pointer' : undefined,
            }}
          >
            {cells.map((c, ci) => (
              <div
                key={ci}
                style={{
                  textAlign: headers[ci].align,
                  fontFamily: headers[ci].mono ? 'var(--font-mono)' : undefined,
                }}
              >
                {c}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function CustomerProductHistory({
  leaf,
  moduleLabel,
  parentLabel,
  customerId,
  onNavigate,
}) {
  const { showToast } = useStore()

  const [from, setFrom] = useState(isoDaysAgo(90))
  const [to, setTo] = useState(isoDaysAgo(0))
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!customerId) {
      setReport(null)
      return
    }
    let cancelled = false
    setLoading(true)
    reportsApi
      .getCustomerHistoryReports(customerId, {
        from,
        to,
        products: TOP_PRODUCTS,
      })
      .then((res) => {
        if (!cancelled) setReport(res?.data || null)
      })
      .catch((e) => {
        if (!cancelled) {
          setReport(null)
          showToast('Could not load customer history', e.message, true)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [customerId, from, to, showToast])

  const customer = report?.customer
  const purchases = report?.purchases
  const account = report?.account
  const products = report?.products || []
  const openInvoices = report?.openInvoices || []
  const transactions = account?.recentTransactions || []

  const columns = [
    {
      key: 'date',
      label: 'Date',
      width: 150,
      render: (t) => (t.date ? fmtDate(t.date) : '—'),
    },
    {
      key: 'type',
      label: 'Activity',
      width: 220,
      render: (t) => <Badge tone="neutral">{pretty(t.type) || '—'}</Badge>,
    },
    { key: 'id', label: 'Transaction ID', width: 300, mono: true },
    {
      key: 'amount',
      label: 'Amount',
      width: 175,
      align: 'right',
      mono: true,
      render: (t) => (
        <span style={{ color: t.amount < 0 ? 'var(--danger)' : 'var(--text-strong)' }}>
          {t.amount < 0 ? '− ' : ''}
          {money(Math.abs(t.amount || 0))}
        </span>
      ),
    },
  ]

  const emptyTitle = customerId ? 'No activity recorded' : 'No customer selected'
  const emptyDescription = customerId
    ? 'This customer has no payment activity in the selected period.'
    : 'Open this report from a customer record to see their payment history.'

  // Invoice Details is its own page; pass the invoice id as a param.
  function openInvoice(row) {
    const id = row?.id || row?.ref?.id
    if (!id) return
    if (!onNavigate) {
      showToast('Navigation unavailable', 'This page was not given an onNavigate handler.', true)
      return
    }
    onNavigate({
      id: 'invoicedetails',
      view: 'invoicedetails',
      label: 'Invoice Details',
      params: { invoiceId: id },
    })
  }

  return (
    <>
      {loading && <Loader overlay label="Loading customer history…" />}
      <ReportShell
        wide
        crumbs={[moduleLabel, parentLabel]}
        title={leaf?.label || 'Customer Payment History'}
        icon={leaf?.icon}
        description="Payment and purchase history for a customer — account credits and debits, wallet and deposit activity, products bought and open invoices."
        filters={[
          { key: 'from', label: 'Date from', type: 'date' },
          { key: 'to', label: 'Date to', type: 'date' },
        ]}
        filterValues={{ from, to }}
        onFilterChange={(k, v) => {
          if (k === 'from') setFrom(v)
          if (k === 'to') setTo(v)
        }}
        stats={[
          {
            label: 'Purchases in period',
            value: moneyShort(purchases?.total || 0),
            delta: `${fmt(purchases?.orders || 0)} orders`,
          },
          {
            label: 'Account credits',
            value: moneyShort(account?.credits?.amount || 0),
            delta: `${fmt(account?.credits?.count || 0)} entries`,
          },
          {
            label: 'Account debits',
            value: moneyShort(account?.debits?.amount || 0),
            delta: `${fmt(account?.debits?.count || 0)} entries`,
          },
          {
            label: 'Outstanding',
            value: moneyShort(purchases?.outstanding || 0),
            tone: purchases?.outstanding ? 'negative' : undefined,
            delta: `${fmt(purchases?.openInvoiceCount || 0)} open invoices`,
          },
        ]}
        columns={columns}
        rows={transactions}
        tableTitle={customer ? `Payment activity for ${customer.name}` : 'Payment activity'}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}
        footnote={
          account?.truncated
            ? 'Only the most recent transactions are shown. Narrow the date range to see older activity.'
            : 'Credits add to the customer’s account (wallet or deposit); debits reduce it.'
        }
      >
        {customer && (
          <>
            <Panel title="Customer" description="Details on file for this customer.">
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
                  gap: '0 32px',
                }}
              >
                <div>
                  <MetaRow label="Code" value={customer.code} mono />
                  <MetaRow label="Name" value={customer.name} />
                  <MetaRow label="Phone" value={customer.phone || '—'} />
                  <MetaRow label="Email" value={customer.email || '—'} />
                </div>
                <div>
                  <MetaRow label="Home showroom" value={customer.location?.name || '—'} />
                  <MetaRow label="Correspondent" value={customer.correspondent?.name || '—'} />
                  <MetaRow label="TIN" value={customer.tin || '—'} mono />
                  <MetaRow
                    label="Dealer category"
                    value={customer.dealerCategoryName || '—'}
                  />
                </div>
                <div>
                  <MetaRow label="Wallet balance" value={money(customer.walletBalance || 0)} mono />
                  <MetaRow label="Deposit balance" value={money(customer.depositBalance || 0)} mono />
                  <MetaRow label="Credit limit" value={money(customer.creditLimit || 0)} mono />
                </div>
              </div>
              <div
                style={{
                  marginTop: 14,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  flexWrap: 'wrap',
                }}
              >
                <Badge tone={TYPE_TONE[customer.type] || 'neutral'}>
                  {customer.typeLabel || pretty(customer.type)}
                </Badge>
                <Badge tone={STATUS_TONE[customer.status] || 'neutral'}>
                  {pretty(customer.status)}
                </Badge>
                <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
                  {[customer.address, customer.city].filter(Boolean).join(', ')}
                </span>
              </div>
            </Panel>

            <Panel
              title="Purchases"
              description={`${report.period?.from ? fmtDate(report.period.from) : '—'} – ${
                report.period?.to ? fmtDate(report.period.to) : '—'
              }`}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
                  gap: '0 32px',
                }}
              >
                <div>
                  <MetaRow label="Orders" value={fmt(purchases?.orders || 0)} mono />
                  <MetaRow label="Lines" value={fmt(purchases?.lines || 0)} mono />
                  <MetaRow label="Quantity" value={fmt(purchases?.quantity || 0)} mono />
                </div>
                <div>
                  <MetaRow label="Gross" value={money(purchases?.gross || 0)} mono />
                  <MetaRow label="Discounts" value={money(purchases?.discounts || 0)} mono />
                  <MetaRow label="Net" value={money(purchases?.net || 0)} mono />
                  <MetaRow label="VAT" value={money(purchases?.vat || 0)} mono />
                </div>
                <div>
                  <MetaRow label="Total" value={money(purchases?.total || 0)} mono />
                  <MetaRow
                    label="Average order"
                    value={money(purchases?.averageOrderValue || 0)}
                    mono
                  />
                  <MetaRow
                    label="First purchase"
                    value={purchases?.firstPurchase ? fmtDate(purchases.firstPurchase) : '—'}
                  />
                  <MetaRow
                    label="Last purchase"
                    value={purchases?.lastPurchase ? fmtDate(purchases.lastPurchase) : '—'}
                  />
                </div>
              </div>
            </Panel>

            <Panel title="Account activity" description="Wallet and deposit movements in the period.">
              <SimpleTable
                template="minmax(160px, 1.5fr) 120px 140px 120px 140px 140px"
                headers={[
                  { label: 'Balance' },
                  { label: 'Credits', align: 'right', mono: true },
                  { label: 'Credit total', align: 'right', mono: true },
                  { label: 'Debits', align: 'right', mono: true },
                  { label: 'Debit total', align: 'right', mono: true },
                  { label: 'Current', align: 'right', mono: true },
                ]}
                rows={[account?.wallet, account?.deposit].filter(Boolean).map((b) => [
                  pretty(b.balanceType),
                  fmt(b.credits?.count || 0),
                  money(b.credits?.amount || 0),
                  fmt(b.debits?.count || 0),
                  money(b.debits?.amount || 0),
                  money(b.currentBalance || 0),
                ])}
              />
              {(account?.byType || []).length > 0 && (
                <div style={{ marginTop: 18 }}>
                  <SimpleTable
                    template="minmax(200px, 2fr) 120px 160px"
                    headers={[
                      { label: 'Transaction type' },
                      { label: 'Count', align: 'right', mono: true },
                      { label: 'Amount', align: 'right', mono: true },
                    ]}
                    rows={account.byType.map((t) => [
                      pretty(t.type),
                      fmt(t.count || 0),
                      money(t.amount || 0),
                    ])}
                  />
                </div>
              )}
            </Panel>

            <Panel
              title="Products purchased"
              description={`Top ${TOP_PRODUCTS} products by value in the period.`}
            >
              <SimpleTable
                template="minmax(200px, 2fr) 110px 90px 110px 140px 140px 130px 90px"
                headers={[
                  { label: 'Product' },
                  { label: 'Code', mono: true },
                  { label: 'Orders', align: 'right', mono: true },
                  { label: 'Qty', align: 'right', mono: true },
                  { label: 'Net', align: 'right', mono: true },
                  { label: 'Total', align: 'right', mono: true },
                  { label: 'Last bought' },
                  { label: 'Share', align: 'right', mono: true },
                ]}
                empty="No products purchased in this period."
                rows={products.map((p) => [
                  p.name || p.stockItem?.name || '—',
                  p.code || p.stockItem?.code || '—',
                  fmt(p.orders || 0),
                  fmt(p.quantity || 0),
                  money(p.net || 0),
                  money(p.total || 0),
                  p.lastPurchased ? fmtDate(p.lastPurchased) : '—',
                  `${(p.shareOfNetPct || 0).toFixed(1)}%`,
                ])}
              />
            </Panel>

            <Panel
              title="Open invoices"
              description="Invoices with an unpaid balance. Click one to open its full details."
            >
              <SimpleTable
                template="minmax(160px, 1.5fr) 140px 140px 150px 150px 130px"
                headers={[
                  { label: 'Invoice', mono: true },
                  { label: 'Issued' },
                  { label: 'Due' },
                  { label: 'Total', align: 'right', mono: true },
                  { label: 'Balance', align: 'right', mono: true },
                  { label: 'Status' },
                ]}
                empty="No open invoices."
                onRowClick={(i) => openInvoice(openInvoices[i])}
                rows={openInvoices.map((inv) => [
                  inv.number || inv.ref?.number || '(draft)',
                  inv.issueDate ? fmtDate(inv.issueDate) : '—',
                  inv.dueDate ? fmtDate(inv.dueDate) : '—',
                  money(inv.total || 0),
                  <span key="b" style={{ color: 'var(--danger)' }}>
                    {money(inv.balance || 0)}
                  </span>,
                  <Badge key="s" tone={invoiceTone(inv.ref?.status)}>
                    {pretty(inv.ref?.status) || '—'}
                  </Badge>,
                ])}
              />
            </Panel>
          </>
        )}
      </ReportShell>
    </>
  )
}