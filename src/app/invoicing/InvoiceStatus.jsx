import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import { ReportShell } from '../shells/ReportShell.jsx'
import { Panel, Callout } from '../shells/Page.jsx'
import { Statement } from '../shells/Statement.jsx'
import { ExportButton } from '../../ds/components/data/ExportButton.jsx'
import { useTableExport } from '../useTableExport.js'
import { showrooms } from '../sampleShowroom.js'
import { INVOICE_STATUSES, STATUS_TONE } from '../sampleInvoicing.js'
import { allInvoices, receivables, outstandingTotal } from './invoiceModel.js'
import { fmt, money, moneyShort } from '../utils.js'

const VIEWS = [
  { value: 'receivables', label: 'Outstanding receivables' },
  { value: 'all', label: 'All invoices' },
]

export default function InvoiceStatus({ leaf, moduleLabel, parentLabel }) {
  const [view, setView] = useState('receivables')
  const rows = view === 'receivables' ? receivables : allInvoices

  const overdue = receivables.filter((i) => i.status === 'Overdue')
  const partial = receivables.filter((i) => i.status === 'Partially Paid')
  const voided = allInvoices.filter((i) => i.status === 'Void')

  const byCustomer = Object.values(
    receivables.reduce((acc, i) => {
      acc[i.customer] ||= { label: i.customer, balance: 0, count: 0 }
      acc[i.customer].balance += i.balance
      acc[i.customer].count += 1
      return acc
    }, {})
  ).sort((a, b) => b.balance - a.balance)

  const columns = [
    { key: 'number', label: 'Invoice', width: 140, mono: true },
    { key: 'issued', label: 'Issued', width: 130, render: (i) => i.issued || <span style={{ color: 'var(--text-subtle)' }}>—</span> },
    { key: 'due', label: 'Due', width: 130, render: (i) => i.due || <span style={{ color: 'var(--text-subtle)' }}>—</span> },
    { key: 'customer', label: 'Customer', width: 250 },
    { key: 'showroom', label: 'Showroom', width: 185 },
    { key: 'total', label: 'Invoice total', width: 175, align: 'right', mono: true, render: (i) => money(i.total) },
    {
      key: 'paid', label: 'Paid', width: 165, align: 'right', mono: true,
      render: (i) => (i.paid ? <span style={{ color: 'var(--success)' }}>{money(i.paid)}</span> : '—'),
    },
    {
      key: 'balance', label: 'Balance', width: 175, align: 'right', mono: true,
      render: (i) => (i.balance && i.status !== 'Void' ? <span style={{ color: 'var(--danger)' }}>{money(i.balance)}</span> : money(0)),
    },
    {
      key: 'status', label: 'Status', width: 165,
      render: (i) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <Badge tone={STATUS_TONE[i.status]}>{i.status}</Badge>
          {i.daysOverdue > 0 && (
            <span style={{ font: 'var(--fw-medium) var(--text-2xs)/1 var(--font-mono)', color: 'var(--danger)' }}>{i.daysOverdue}d</span>
          )}
        </span>
      ),
    },
    {
      key: 'action', label: 'Action', width: 190, sortable: false,
      render: (i) => (
        <div style={{ display: 'flex', gap: 6 }}>
          <Button size="sm" variant="secondary">Record payment</Button>
          {i.status !== 'Void' && <Button size="sm" variant="secondary">Void</Button>}
        </div>
      ),
    },
  ]

  const title = leaf?.label || 'Status & Payment Tracking'
  const doExport = useTableExport({ columns, rows, title, emptyHint: 'No invoices match this view.' })

  return (
    <ReportShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Invoice Status & Payment Tracking'}
      icon={leaf?.icon}
      description="Every invoice through its lifecycle, with payments received via POS, bank or wallet linked against it — so Accounts has a clear view of what is still owed."
      headerActions={
        <>
          <ExportButton onExport={doExport} />
          <Select options={VIEWS} value={view} onChange={(e) => setView(e.target.value)} style={{ width: 230 }} />
        </>
      }
      filters={[
        { key: 'customer', label: 'Customer', type: 'select', options: [...new Set(allInvoices.map((i) => i.customer))].map((c) => ({ value: c, label: c })) },
        { key: 'showroom', label: 'Showroom', type: 'select', options: showrooms },
        { key: 'status', label: 'Status', type: 'select', options: INVOICE_STATUSES.map((s) => ({ value: s, label: s })) },
        { key: 'from', label: 'Issued from', type: 'date' },
        { key: 'to', label: 'Issued to', type: 'date' },
      ]}
      stats={[
        { label: 'Outstanding receivables', value: moneyShort(outstandingTotal), tone: 'negative', delta: `${receivables.length} invoices` },
        { label: 'Overdue', value: moneyShort(overdue.reduce((n, i) => n + i.balance, 0)), tone: 'negative', hint: `${overdue.length} past due date` },
        { label: 'Partially paid', value: moneyShort(partial.reduce((n, i) => n + i.balance, 0)), tone: 'warning', hint: `${partial.length} invoices` },
        { label: 'Voided', value: String(voided.length), hint: voided.length ? 'Records retained' : undefined },
      ]}
      columns={columns}
      rows={rows}
      totals={{ number: 'Total', total: money(rows.reduce((n, i) => n + i.total, 0)), paid: money(rows.reduce((n, i) => n + i.paid, 0)), balance: money(rows.filter((i) => i.status !== 'Void').reduce((n, i) => n + i.balance, 0)) }}
      tableTitle={view === 'receivables' ? 'Issued, partially paid and overdue' : 'All invoices'}
      emptyTitle="Nothing outstanding"
      emptyDescription="Every issued invoice has been settled in full."
      footnote="Status is derived from the payments linked to each invoice and its due date — it is never set by hand, so it can never disagree with the money actually received. Voiding retains the original invoice record and is tracked as a linked event."
    >
      {overdue.length > 0 && (
        <Callout tone="danger" icon="triangle-alert" title={`${moneyShort(overdue.reduce((n, i) => n + i.balance, 0))} is overdue across ${overdue.length} invoices`}>
          The oldest is {overdue.reduce((m, i) => (i.daysOverdue > m.daysOverdue ? i : m), overdue[0]).number}, now{' '}
          {Math.max(...overdue.map((i) => i.daysOverdue))} days past its due date. Overdue status is applied
          automatically — no manual review is needed to surface these.
        </Callout>
      )}

      {voided.length > 0 && (
        <Panel title="Voided invoices" description="Retained in full, with the documented reason for the void.">
          {voided.map((i) => (
            <div key={i.number} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ font: 'var(--fw-bold) var(--text-sm)/1.4 var(--font-mono)', color: 'var(--text-strong)', flex: '0 0 auto' }}>{i.number}</span>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ font: 'var(--fw-regular) var(--text-sm)/1.5 var(--font-ui)', color: 'var(--text-body)' }}>{i.voidReason}</div>
                <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', marginTop: 3 }}>
                  {i.customer} · issued {i.issued} · {money(i.total)} · voided by Accounts
                </div>
              </div>
              <Badge tone="neutral">Void</Badge>
            </div>
          ))}
        </Panel>
      )}

      <Statement
        columns={['Balance owed']}
        sections={[
          {
            title: 'Outstanding by customer',
            tone: 'negative',
            rows: byCustomer.map((c) => ({
              label: c.label,
              note: `${c.count} invoice${c.count === 1 ? '' : 's'}`,
              values: [money(c.balance)],
            })),
            subtotal: { label: 'Total receivables', values: [money(outstandingTotal)] },
          },
        ]}
        result={{
          label: 'Owed to the company',
          note: `Reconciles exactly with the sum of unpaid and partially paid invoice balances across ${fmt(receivables.length)} invoices.`,
          values: [money(outstandingTotal)],
          tone: 'negative',
        }}
      />
    </ReportShell>
  )
}
