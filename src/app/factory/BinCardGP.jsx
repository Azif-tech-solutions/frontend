import { useState } from 'react'
import { ReportShell } from '../shells/ReportShell.jsx'
import { CardIdentity, GroupMembers } from './cardParts.jsx'
import { cardFilters } from './cardConfig.js'
import { stockGroups, stockCardRows, cardOpeningBalance, withRunningBalance, summariseByDate } from '../sample.js'

const num = (n) => (n ? n.toLocaleString() : '—')

export default function BinCardGP({ leaf, moduleLabel, parentLabel }) {
  const [group] = useState(stockGroups[0])
  const summarised = summariseByDate(stockCardRows)
  const rows = withRunningBalance(summarised, cardOpeningBalance, 'balance')

  const totalIn = summarised.reduce((n, r) => n + r.qtyIn, 0)
  const totalOut = summarised.reduce((n, r) => n + r.qtyOut, 0)
  const closing = cardOpeningBalance + totalIn - totalOut

  const columns = [
    { key: 'sn', label: 'SN', width: 64, align: 'right', mono: true },
    { key: 'date', label: 'Date', width: 160 },
    { key: 'qtyIn', label: 'Qty in', width: 140, align: 'right', mono: true, render: (r) => (r.qtyIn ? <span style={{ color: 'var(--success)' }}>{num(r.qtyIn)}</span> : '—') },
    { key: 'qtyOut', label: 'Qty out', width: 140, align: 'right', mono: true, render: (r) => (r.qtyOut ? <span style={{ color: 'var(--danger)' }}>{num(r.qtyOut)}</span> : '—') },
    { key: 'balance', label: 'Balance', width: 160, align: 'right', mono: true, render: (r) => num(r.balance) },
  ]

  return (
    <ReportShell
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Bin Card (GP)'}
      icon={leaf?.icon}
      meta={<CardIdentity group={group} />}
      description="Summarised stock movement for a selected group. Shows the total quantity of group members that came in and went out on each date, rather than listing every individual activity."
      filters={cardFilters}
      stats={[
        { label: 'Opening balance', value: cardOpeningBalance.toLocaleString(), hint: '01 Aug 2026' },
        { label: 'Total qty in', value: totalIn.toLocaleString() },
        { label: 'Total qty out', value: totalOut.toLocaleString(), tone: 'negative' },
        { label: 'Closing balance', value: closing.toLocaleString(), hint: '22 Aug 2026' },
      ]}
      columns={columns}
      rows={rows}
      totals={{ sn: 'Total', qtyIn: totalIn.toLocaleString(), qtyOut: totalOut.toLocaleString(), balance: closing.toLocaleString() }}
      tableTitle={`Daily movement summary — ${group.label}`}
      tableActions={<CardIdentity group={group} />}
      emptyTitle="No movement for this group in the selected period"
      emptyDescription="Widen the date range or choose a different stock group, then generate again."
      footnote="Report data reflects the underlying transactional records at the moment of generation."
    >
      <GroupMembers group={group} />
    </ReportShell>
  )
}
