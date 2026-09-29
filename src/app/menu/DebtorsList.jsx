import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { ReportTable } from '../../ds/components/data/ReportTable.jsx'
import { ReportShell } from '../shells/ReportShell.jsx'
import { Page, Panel, MetaRow, Callout } from '../shells/Page.jsx'
import { PageHeader } from '../shells/PageHeader.jsx'
import { showrooms } from '../sampleShowroom.js'
import { customerTypes } from '../sampleOthers.js'
import { debtors } from '../sampleMenu.js'
import { fmt, money, moneyShort } from '../utils.js'

/** Age of the oldest unpaid invoice decides how urgent the debt is. */
function ageing(days) {
  if (days > 60) return { label: 'Over 60 days', tone: 'danger' }
  if (days > 30) return { label: '31–60 days', tone: 'warning' }
  return { label: 'Within 30 days', tone: 'success' }
}

/** Drill-down the PRD describes as opening on double-click. */
function DebtorDetail({ debtor, onBack, crumbs }) {
  const invoiced = debtor.transactions.reduce((n, t) => n + t.value, 0)
  const paid = debtor.transactions.reduce((n, t) => n + t.paid, 0)
  const overLimit = debtor.outstanding > debtor.creditLimit

  const columns = [
    { key: 'date', label: 'Date', width: 135 },
    { key: 'ref', label: 'Invoice', width: 140, mono: true },
    { key: 'description', label: 'Purchase', width: 320 },
    { key: 'value', label: 'Invoice value', width: 175, align: 'right', mono: true, render: (t) => money(t.value) },
    {
      key: 'paid', label: 'Paid', width: 165, align: 'right', mono: true,
      render: (t) => (t.paid ? <span style={{ color: 'var(--success)' }}>{money(t.paid)}</span> : '—'),
    },
    {
      key: 'balance', label: 'Balance owed', width: 175, align: 'right', mono: true,
      render: (t) => <span style={{ color: 'var(--danger)' }}>{money(t.balance)}</span>,
    },
    { key: 'dueDate', label: 'Due date', width: 145 },
  ]

  return (
    <Page wide>
      <PageHeader
        crumbs={crumbs}
        title={debtor.name}
        icon="file-warning"
        description="Every transaction and purchase recorded against this debtor, with the balance still owed on each."
        meta={
          <>
            <Badge tone={debtor.type === 'Authorised Dealer' ? 'brand' : 'info'}>{debtor.type}</Badge>
            <Badge tone={ageing(debtor.oldestDays).tone}>{ageing(debtor.oldestDays).label}</Badge>
            {overLimit && <Badge tone="danger">Over credit limit</Badge>}
          </>
        }
        actions={
          <>
            <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>Back to debtors</Button>
            <Button variant="secondary" iconLeft="printer">Print statement</Button>
            <Button iconLeft="send">Send reminder</Button>
          </>
        }
      />

      <Panel title="Account" description="Position and contact details for this debtor.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '0 32px' }}>
          <div>
            <MetaRow label="Code" value={debtor.code} mono />
            <MetaRow label="Phone" value={debtor.phone} />
            <MetaRow label="Home showroom" value={debtor.showroom} />
          </div>
          <div>
            <MetaRow label="Correspondent" value={debtor.rep} />
            <MetaRow label="Open invoices" value={debtor.invoices} mono />
            <MetaRow label="Last payment" value={debtor.lastPayment} />
          </div>
          <div>
            <MetaRow label="Total invoiced" value={money(invoiced)} mono />
            <MetaRow label="Total paid" value={money(paid)} mono tone="positive" />
            <MetaRow label="Outstanding" value={money(debtor.outstanding)} mono tone="negative" />
          </div>
        </div>
        {overLimit && (
          <Callout tone="danger" icon="triangle-alert" title="Outstanding exceeds credit limit" style={{ marginTop: 14 }}>
            {debtor.name} owes {money(debtor.outstanding)} against a credit limit of {money(debtor.creditLimit)}.
            Further credit sales should be withheld until the balance is brought within limit.
          </Callout>
        )}
      </Panel>

      <Panel title="Transactions and purchases" padding={0}>
        <ReportTable
          columns={columns}
          rows={debtor.transactions}
          rowKey={(t) => t.ref}
          totals={{ date: 'Total', value: money(invoiced), paid: money(paid), balance: money(debtor.outstanding) }}
          stickyHeader={false}
          style={{ border: 'none', borderRadius: 0 }}
        />
      </Panel>
    </Page>
  )
}

export default function DebtorsList({ leaf, moduleLabel, parentLabel }) {
  const [selected, setSelected] = useState(null)
  const crumbs = [moduleLabel, parentLabel, leaf?.label].filter(Boolean)

  if (selected) return <DebtorDetail debtor={selected} crumbs={crumbs} onBack={() => setSelected(null)} />

  const rows = debtors.map((d) => ({ ...d, ...ageing(d.oldestDays), overLimit: d.outstanding > d.creditLimit }))
  const total = rows.reduce((n, d) => n + d.outstanding, 0)
  const overdue = rows.filter((d) => d.oldestDays > 30)
  const overLimit = rows.filter((d) => d.overLimit)

  const columns = [
    { key: 'code', label: 'Code', width: 110, mono: true },
    { key: 'name', label: 'Debtor', width: 250 },
    {
      key: 'type', label: 'Type', width: 180,
      render: (d) => <Badge tone={d.type === 'Authorised Dealer' ? 'brand' : 'info'}>{d.type}</Badge>,
    },
    { key: 'showroom', label: 'Showroom', width: 185 },
    { key: 'rep', label: 'Correspondent', width: 180 },
    { key: 'invoices', label: 'Open invoices', width: 145, align: 'right', mono: true, render: (d) => fmt(d.invoices) },
    { key: 'outstanding', label: 'Amount owed', width: 175, align: 'right', mono: true, render: (d) => <span style={{ color: 'var(--danger)' }}>{money(d.outstanding)}</span> },
    { key: 'creditLimit', label: 'Credit limit', width: 165, align: 'right', mono: true, render: (d) => money(d.creditLimit) },
    {
      key: 'label', label: 'Ageing', width: 155,
      render: (d) => <Badge tone={d.tone}>{d.label}</Badge>,
    },
    { key: 'lastPayment', label: 'Last payment', width: 150 },
    {
      key: 'action', label: '', width: 130, sortable: false,
      render: (d) => <Button size="sm" variant="secondary" iconLeft="eye" onClick={() => setSelected(d)}>Open</Button>,
    },
  ]

  return (
    <ReportShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Debtors List'}
      icon={leaf?.icon}
      description="Every individual and organisation with money owed to the company. Open any debtor to see the full detail of their transactions and purchases."
      filters={[
        { key: 'showroom', label: 'Showroom', type: 'select', options: showrooms },
        { key: 'type', label: 'Customer type', type: 'select', options: customerTypes },
        { key: 'ageing', label: 'Ageing', type: 'select', options: [{ value: 'current', label: 'Within 30 days' }, { value: 'mid', label: '31–60 days' }, { value: 'old', label: 'Over 60 days' }] },
        { key: 'from', label: 'Date from', type: 'date' },
        { key: 'to', label: 'Date to', type: 'date' },
      ]}
      stats={[
        { label: 'Total owed', value: moneyShort(total), tone: 'negative', delta: `${rows.length} debtors` },
        { label: 'Overdue past 30 days', value: moneyShort(overdue.reduce((n, d) => n + d.outstanding, 0)), tone: 'negative' },
        { label: 'Over credit limit', value: String(overLimit.length), tone: overLimit.length ? 'negative' : undefined },
        { label: 'Open invoices', value: fmt(rows.reduce((n, d) => n + d.invoices, 0)) },
      ]}
      columns={columns}
      rows={rows}
      onRowClick={(d) => setSelected(d)}
      totals={{ code: 'Total', outstanding: money(total) }}
      tableTitle="Outstanding balances"
      emptyTitle="No debtors"
      emptyDescription="Nothing is currently owed to the company."
      footnote="Open a debtor to generate the detailed report of their transactions and purchases. Ageing is measured from the oldest unpaid invoice on the account."
    >
      {overLimit.length > 0 && (
        <Callout tone="danger" icon="triangle-alert" title={`${overLimit.length} debtor${overLimit.length === 1 ? '' : 's'} over their credit limit`}>
          {overLimit.map((d) => d.name).join(', ')} owe more than their approved limit. Credit sales to these
          accounts should be withheld until the balance is brought back within limit.
        </Callout>
      )}
    </ReportShell>
  )
}
