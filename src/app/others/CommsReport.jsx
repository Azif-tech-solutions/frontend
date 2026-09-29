import { Badge } from '../../ds/components/core/Badge.jsx'
import { ReportShell } from '../shells/ReportShell.jsx'
import { Statement } from '../shells/Statement.jsx'
import { regions } from '../sampleProcess.js'
import { unpaidCommissions } from '../sampleOthers.js'
import { money, moneyShort } from '../utils.js'

export default function CommsReport({ leaf, moduleLabel, parentLabel }) {
  const rows = unpaidCommissions.map((c) => ({ ...c, outstanding: c.earned - c.paid }))
  const current = rows.filter((c) => c.period === 'August 2026')

  const earned = rows.reduce((n, c) => n + c.earned, 0)
  const paid = rows.reduce((n, c) => n + c.paid, 0)
  const outstanding = earned - paid

  const byAgent = Object.values(
    rows.reduce((acc, c) => {
      acc[c.agent] ||= { label: c.agent, outstanding: 0, periods: 0 }
      acc[c.agent].outstanding += c.outstanding
      acc[c.agent].periods += 1
      return acc
    }, {})
  ).filter((a) => a.outstanding > 0).sort((a, b) => b.outstanding - a.outstanding)

  const columns = [
    { key: 'agent', label: 'Agent', width: 210 },
    { key: 'code', label: 'Code', width: 110, mono: true },
    { key: 'region', label: 'Region', width: 180 },
    { key: 'period', label: 'Period', width: 150 },
    { key: 'dealers', label: 'Dealers', width: 110, align: 'right', mono: true },
    { key: 'sales', label: 'Sales generated', width: 180, align: 'right', mono: true, render: (c) => money(c.sales) },
    { key: 'earned', label: 'Commission earned', width: 190, align: 'right', mono: true, render: (c) => money(c.earned) },
    {
      key: 'paid', label: 'Paid to date', width: 165, align: 'right', mono: true,
      render: (c) => (c.paid ? money(c.paid) : '—'),
    },
    {
      key: 'outstanding', label: 'Unpaid balance', width: 180, align: 'right', mono: true,
      render: (c) => (c.outstanding ? <span style={{ color: 'var(--danger)' }}>{money(c.outstanding)}</span> : money(0)),
    },
    {
      key: 'status', label: 'Status', width: 140,
      render: (c) => <Badge tone={c.outstanding === 0 ? 'success' : c.paid ? 'warning' : 'danger'}>
        {c.outstanding === 0 ? 'Settled' : c.paid ? 'Part paid' : 'Unpaid'}
      </Badge>,
    },
  ]

  return (
    <ReportShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Comms. Report'}
      icon={leaf?.icon}
      description="Agents and the commission still owed to them for a chosen month, based on completed sales and the allocations run for that period."
      filters={[
        { key: 'period', label: 'Month', type: 'select', options: [{ value: 'aug', label: 'August 2026' }, { value: 'jul', label: 'July 2026' }, { value: 'jun', label: 'June 2026' }] },
        { key: 'agent', label: 'Agent', type: 'select', options: [...new Set(rows.map((c) => c.agent))].map((a) => ({ value: a, label: a })) },
        { key: 'region', label: 'Region', type: 'select', options: regions },
        { key: 'status', label: 'Status', type: 'select', options: [{ value: 'unpaid', label: 'Unpaid' }, { value: 'part', label: 'Part paid' }, { value: 'settled', label: 'Settled' }] },
      ]}
      stats={[
        { label: 'Commission earned', value: moneyShort(earned) },
        { label: 'Paid to date', value: moneyShort(paid) },
        { label: 'Outstanding', value: moneyShort(outstanding), tone: 'negative', delta: `${byAgent.length} agents owed` },
        { label: 'Current month', value: moneyShort(current.reduce((n, c) => n + c.outstanding, 0)), hint: 'August 2026' },
      ]}
      columns={columns}
      rows={rows}
      totals={{ agent: 'Total', earned: money(earned), paid: money(paid), outstanding: money(outstanding) }}
      tableTitle="Commission by agent and period"
      emptyTitle="No commission records for this period"
      emptyDescription="Run an allocation in Comms Allocator to generate commission for the period."
      footnote="Commission is earned once an allocation run completes, and stays outstanding until paid. Amounts here reconcile to dealer commissions shown within operating expenses on the SCI Report."
    >
      <Statement
        columns={['Outstanding']}
        sections={[
          {
            title: 'Unpaid balance by agent',
            tone: 'negative',
            rows: byAgent.map((a) => ({
              label: a.label,
              note: `${a.periods} period${a.periods === 1 ? '' : 's'} with activity`,
              values: [money(a.outstanding)],
            })),
            subtotal: { label: 'Total outstanding', values: [money(outstanding)] },
          },
        ]}
        result={{
          label: 'Commission payable',
          note: `Owed to ${byAgent.length} agents across all periods with an unsettled balance.`,
          values: [money(outstanding)],
          tone: 'negative',
        }}
      />
    </ReportShell>
  )
}
