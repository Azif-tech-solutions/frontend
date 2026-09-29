import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { ReportShell } from '../shells/ReportShell.jsx'
import { Panel, MetaRow } from '../shells/Page.jsx'
import { banks, bankOpeningBalance, bankTransactions } from '../sampleAccount.js'
import { money, moneyShort, withBalance } from '../utils.js'

export default function BankStatement({ leaf, moduleLabel, parentLabel }) {
  const [bankId] = useState('bk-zenith')
  const account = banks.find((b) => b.value === bankId) || banks[0]

  const rows = withBalance(bankTransactions, bankOpeningBalance, (t) => (t.type === 'Credit' ? t.amount : -t.amount))

  const credits = bankTransactions.filter((t) => t.type === 'Credit').reduce((n, t) => n + t.amount, 0)
  const debits = bankTransactions.filter((t) => t.type === 'Debit').reduce((n, t) => n + t.amount, 0)
  const closing = bankOpeningBalance + credits - debits

  const columns = [
    { key: 'date', label: 'Date', width: 135 },
    { key: 'ref', label: 'Reference', width: 120, mono: true },
    { key: 'description', label: 'Description', width: 400 },
    {
      key: 'type', label: 'Type', width: 110,
      render: (t) => <Badge tone={t.type === 'Credit' ? 'success' : 'neutral'}>{t.type}</Badge>,
    },
    {
      key: 'credit', label: 'Credit', width: 165, align: 'right', mono: true,
      render: (t) => (t.type === 'Credit' ? <span style={{ color: 'var(--success)' }}>{money(t.amount)}</span> : '—'),
    },
    {
      key: 'debit', label: 'Debit', width: 165, align: 'right', mono: true,
      render: (t) => (t.type === 'Debit' ? <span style={{ color: 'var(--danger)' }}>{money(t.amount)}</span> : '—'),
    },
    { key: 'balance', label: 'Balance', width: 175, align: 'right', mono: true, render: (t) => money(t.balance) },
  ]

  return (
    <ReportShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Bank Statement'}
      icon={leaf?.icon}
      description="Account statement for a selected company bank account over a chosen date range, with a running balance after every entry."
      filters={[
        { key: 'bank', label: 'Bank account', type: 'select', options: banks },
        { key: 'type', label: 'Entry type', type: 'select', options: [{ value: 'credit', label: 'Credits only' }, { value: 'debit', label: 'Debits only' }] },
        { key: 'from', label: 'Period from', type: 'date' },
        { key: 'to', label: 'Period to', type: 'date' },
      ]}
      stats={[
        { label: 'Opening balance', value: moneyShort(bankOpeningBalance), hint: '01 Aug 2026' },
        { label: 'Total credits', value: moneyShort(credits) },
        { label: 'Total debits', value: moneyShort(debits), tone: 'negative' },
        { label: 'Closing balance', value: moneyShort(closing), hint: '23 Aug 2026' },
      ]}
      columns={columns}
      rows={rows}
      totals={{ date: 'Total', credit: money(credits), debit: money(debits), balance: money(closing) }}
      tableTitle="Account transactions"
      emptyTitle="No transactions in this period"
      emptyDescription="Widen the period or select a different account, then generate again."
      footnote="Cash lodgements reconcile to the Cash Inflow/Outflow Statement, and transfers to petty cash appear as funding entries on the Petty Cash Statement."
    >
      <Panel title="Account" description="The bank account this statement covers.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '0 32px' }}>
          <div>
            <MetaRow label="Bank" value={account.label} />
            <MetaRow label="Account number" value={account.account} mono />
            <MetaRow label="Account type" value={account.type} />
          </div>
          <div>
            <MetaRow label="Branch" value={account.branch} />
            <MetaRow label="Signatory" value={account.signatory} />
            <MetaRow label="Statement period" value="01 – 23 Aug 2026" />
          </div>
        </div>
      </Panel>
    </ReportShell>
  )
}
