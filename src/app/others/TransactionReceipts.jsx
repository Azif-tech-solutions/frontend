import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { RegisterShell } from '../shells/RegisterShell.jsx'
import { transactionDocuments } from '../sampleOthers.js'
import { money, moneyShort } from '../utils.js'

const TABS = [
  { value: 'all', label: 'All documents', icon: 'files' },
  { value: 'Invoice', label: 'Invoices', icon: 'file-text' },
  { value: 'Waybill', label: 'Waybills', icon: 'truck' },
  { value: 'Receipt', label: 'Receipts', icon: 'receipt' },
]

const TYPE_TONE = { Invoice: 'brand', Waybill: 'neutral', Receipt: 'success', 'Pro-forma': 'info' }

export default function TransactionReceipts({ leaf, moduleLabel, parentLabel }) {
  const [tab, setTab] = useState('all')
  const rows = tab === 'all' ? transactionDocuments : transactionDocuments.filter((d) => d.type === tab)

  const reprinted = transactionDocuments.filter((d) => d.reprints > 0)
  const totalReprints = transactionDocuments.reduce((n, d) => n + d.reprints, 0)

  const columns = [
    { key: 'ref', label: 'Document no.', width: 145, mono: true },
    {
      key: 'type', label: 'Type', width: 140,
      render: (d) => <Badge tone={TYPE_TONE[d.type] || 'neutral'}>{d.type}</Badge>,
    },
    { key: 'date', label: 'Issued', width: 135 },
    { key: 'party', label: 'Customer / party', width: 250 },
    { key: 'showroom', label: 'Issued at', width: 190 },
    { key: 'issuedBy', label: 'Issued by', width: 160 },
    { key: 'value', label: 'Value', width: 170, align: 'right', mono: true, render: (d) => money(d.value) },
    {
      key: 'reprints', label: 'Reprints', width: 120, align: 'right', mono: true,
      render: (d) => (d.reprints ? <span style={{ color: 'var(--warning)' }}>{d.reprints}</span> : '—'),
    },
    {
      key: 'action', label: 'Action', width: 190, sortable: false,
      render: () => (
        <div style={{ display: 'flex', gap: 6 }}>
          <Button size="sm" variant="secondary" iconLeft="eye">View</Button>
          <Button size="sm" variant="secondary" iconLeft="printer">Reprint</Button>
        </div>
      ),
    },
  ]

  return (
    <RegisterShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Transaction Receipts'}
      icon={leaf?.icon}
      description="Reference store for every invoice, waybill, receipt and pro-forma the system has issued. Retrieve, review and reprint any transaction document when a duplicate is needed."
      exportLabel="Export index"
      tabs={TABS}
      tab={tab}
      onTabChange={setTab}
      searchPlaceholder="Search by document number, customer or issuer…"
      filters={<Button variant="secondary" iconLeft="calendar">Date range</Button>}
      stats={[
        { label: 'Documents on file', value: String(transactionDocuments.length) },
        { label: 'Combined value', value: moneyShort(transactionDocuments.reduce((n, d) => n + d.value, 0)) },
        { label: 'Documents reprinted', value: String(reprinted.length), hint: `${totalReprints} reprints total` },
        { label: 'Locations', value: String(new Set(transactionDocuments.map((d) => d.showroom)).size) },
      ]}
      columns={columns}
      rows={rows}
      onRowClick={() => {}}
      emptyTitle="No documents match this filter"
      emptyDescription="Change the document type or search term to find what you are looking for."
      footnote="Reprints are counted against each document so duplicates can be traced. A reprinted document carries the same reference as the original and is marked as a duplicate copy."
    />
  )
}
