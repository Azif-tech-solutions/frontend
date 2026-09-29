import { Badge } from '../../ds/components/core/Badge.jsx'
import { ReportShell } from '../shells/ReportShell.jsx'
import { Statement } from '../shells/Statement.jsx'
import { dealerWallets } from '../sampleShowroom.js'
import { walletWithdrawals } from '../sampleHistory.js'
import { money, moneyShort } from '../utils.js'

const STATUS_TONE = { Completed: 'success', 'Under review': 'warning', Reversed: 'danger' }

export default function WalletWithdrawalHistory({ leaf, moduleLabel, parentLabel }) {
  const rows = walletWithdrawals.map((w) => ({ ...w, balanceAfter: w.balanceBefore - w.amount }))

  const total = rows.reduce((n, w) => n + w.amount, 0)
  const byDealer = rows.filter((w) => w.initiatedBy === 'Dealer')
  const byCompany = rows.filter((w) => w.initiatedBy === 'Company')
  const underReview = rows.filter((w) => w.status === 'Under review')

  // A withdrawal may never take a wallet below zero — surfaced here as an audit check.
  const wouldGoNegative = rows.filter((w) => w.balanceAfter < 0)

  const columns = [
    { key: 'ref', label: 'Reference', width: 115, mono: true },
    { key: 'date', label: 'Date', width: 130 },
    { key: 'dealer', label: 'Dealer', width: 240 },
    {
      key: 'initiatedBy', label: 'Initiated by', width: 145,
      render: (w) => <Badge tone={w.initiatedBy === 'Dealer' ? 'brand' : 'neutral'}>{w.initiatedBy}</Badge>,
    },
    { key: 'reason', label: 'Reason', width: 270 },
    { key: 'balanceBefore', label: 'Balance before', width: 170, align: 'right', mono: true, render: (w) => money(w.balanceBefore) },
    {
      key: 'amount', label: 'Withdrawn', width: 165, align: 'right', mono: true,
      render: (w) => <span style={{ color: 'var(--danger)' }}>− {money(w.amount)}</span>,
    },
    {
      key: 'balanceAfter', label: 'Balance after', width: 170, align: 'right', mono: true,
      render: (w) => (
        <span style={{ color: w.balanceAfter < 0 ? 'var(--danger)' : w.balanceAfter === 0 ? 'var(--text-muted)' : 'var(--text-strong)' }}>
          {money(w.balanceAfter)}
        </span>
      ),
    },
    { key: 'method', label: 'Method', width: 165 },
    {
      key: 'otp', label: 'OTP', width: 140,
      render: (w) => <Badge tone={w.otp === 'Verified' ? 'success' : 'neutral'}>{w.otp}</Badge>,
    },
    { key: 'processedBy', label: 'Processed by', width: 160 },
    {
      key: 'status', label: 'Status', width: 150,
      render: (w) => <Badge tone={STATUS_TONE[w.status] || 'neutral'}>{w.status}</Badge>,
    },
  ]

  return (
    <ReportShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Wallet Withdrawal History'}
      icon={leaf?.icon}
      description="Every withdrawal made against a dealer wallet, whether requested by the dealer or initiated by the company, with the balance before and after and the party who processed it."
      filters={[
        { key: 'dealer', label: 'Dealer', type: 'select', options: dealerWallets },
        { key: 'initiatedBy', label: 'Initiated by', type: 'select', options: [{ value: 'dealer', label: 'Dealer' }, { value: 'company', label: 'Company' }] },
        { key: 'status', label: 'Status', type: 'select', options: Object.keys(STATUS_TONE).map((s) => ({ value: s, label: s })) },
        { key: 'from', label: 'Date from', type: 'date' },
        { key: 'to', label: 'Date to', type: 'date' },
      ]}
      stats={[
        { label: 'Total withdrawn', value: moneyShort(total), delta: `${rows.length} withdrawals` },
        { label: 'Dealer-initiated', value: moneyShort(byDealer.reduce((n, w) => n + w.amount, 0)), hint: `${byDealer.length} requests` },
        { label: 'Company-initiated', value: moneyShort(byCompany.reduce((n, w) => n + w.amount, 0)), hint: `${byCompany.length} recoveries` },
        { label: 'Under review', value: String(underReview.length), tone: underReview.length ? 'warning' : undefined, hint: underReview.length ? 'Awaiting audit' : undefined },
      ]}
      columns={columns}
      rows={rows}
      totals={{ ref: 'Total', amount: money(total) }}
      tableTitle="Wallet withdrawal records"
      emptyTitle="No withdrawals in this period"
      emptyDescription="Widen the date range or clear the dealer filter, then generate again."
      footnote={`Dealer-requested withdrawals require a verified one-time code; company-initiated recoveries are authorised by Management instead. No withdrawal may take a wallet below zero${wouldGoNegative.length ? ' — one record breaches this and requires investigation.' : ', and none in this period did.'}`}
    >
      <Statement
        columns={['Amount']}
        sections={[
          {
            title: 'Withdrawals requested by dealers',
            tone: 'negative',
            rows: byDealer.map((w) => ({
              label: w.dealer,
              note: `${w.date} · ${w.method}`,
              values: [money(w.amount)],
            })),
            subtotal: { label: 'Total dealer-initiated', values: [money(byDealer.reduce((n, w) => n + w.amount, 0))] },
          },
          {
            title: 'Withdrawals initiated by the company',
            tone: 'negative',
            rows: byCompany.map((w) => ({
              label: w.dealer,
              note: `${w.date} · ${w.reason}`,
              values: [money(w.amount)],
            })),
            subtotal: { label: 'Total company-initiated', values: [money(byCompany.reduce((n, w) => n + w.amount, 0))] },
          },
        ]}
        result={{
          label: 'Total withdrawn from dealer wallets',
          note: `Across ${new Set(rows.map((w) => w.dealer)).size} dealers in the selected period.`,
          values: [money(total)],
          tone: 'negative',
        }}
      />
    </ReportShell>
  )
}
