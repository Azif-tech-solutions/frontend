// import { Badge } from '../../ds/components/core/Badge.jsx'
// import { ReportShell } from '../shells/ReportShell.jsx'
// import { factories, suppliers, manufacturers, materialReceipts } from '../sample.js'
// import { fmt } from '../utils.js'

// const CONDITION_TONE = {
//   Accepted: 'success',
//   'Accepted with exceptions': 'warning',
//   'Pending verification': 'neutral',
//   Rejected: 'danger',
// }

// export default function MaterialReceiveReport({ leaf, moduleLabel, parentLabel }) {
//   const verified = materialReceipts.filter((r) => r.verifiedBy !== '—')
//   const pending = materialReceipts.filter((r) => r.verifiedBy === '—')

//   const columns = [
//     { key: 'date', label: 'Arrival date', width: 130 },
//     { key: 'ref', label: 'Reference', width: 110, mono: true },
//     { key: 'item', label: 'Material / recipe', width: 240 },
//     {
//       key: 'type', label: 'Type', width: 150,
//       render: (r) => <Badge tone={r.type === 'In-house recipe' ? 'brand' : 'neutral'}>{r.type}</Badge>,
//     },
//     { key: 'supplier', label: 'Supplier', width: 210 },
//     { key: 'manufacturer', label: 'Manufacturer', width: 200 },
//     { key: 'qty', label: 'Qty received', width: 130, align: 'right', mono: true, render: (r) => fmt(r.qty) },
//     { key: 'unit', label: 'Unit', width: 110 },
//     { key: 'mfgDate', label: 'Manufactured', width: 135 },
//     { key: 'expiry', label: 'Expiry', width: 130 },
//     {
//       key: 'verifiedBy', label: 'Verified by', width: 140,
//       render: (r) => (r.verifiedBy === '—'
//         ? <span style={{ color: 'var(--text-subtle)' }}>Not verified</span>
//         : r.verifiedBy),
//     },
//     {
//       key: 'offloaded', label: 'Offloaded', width: 130,
//       render: (r) => (r.offloaded === '—' ? <span style={{ color: 'var(--text-subtle)' }}>—</span> : r.offloaded),
//     },
//     {
//       key: 'condition', label: 'Condition', width: 200,
//       render: (r) => <Badge tone={CONDITION_TONE[r.condition] || 'neutral'}>{r.condition}</Badge>,
//     },
//   ]

//   return (
//     <ReportShell
//       wide
//       crumbs={[moduleLabel, parentLabel]}
//       title={leaf?.label || 'Material/Recipe Receive Report'}
//       icon={leaf?.icon}
//       description="All materials and recipes received into the factory with their arrival dates, supplier and manufacturer details, and the Stock Keeper's inspection and offloading verification."
//       filters={[
//         { key: 'factory', label: 'Factory', type: 'select', options: factories },
//         { key: 'supplier', label: 'Supplier', type: 'select', options: suppliers },
//         { key: 'manufacturer', label: 'Manufacturer', type: 'select', options: manufacturers },
//         { key: 'from', label: 'Date from', type: 'date' },
//         { key: 'to', label: 'Date to', type: 'date' },
//       ]}
//       stats={[
//         { label: 'Deliveries received', value: String(materialReceipts.length) },
//         { label: 'Verified & offloaded', value: String(verified.length), delta: `${Math.round((verified.length / materialReceipts.length) * 100)}% of arrivals` },
//         { label: 'Pending verification', value: String(pending.length), tone: pending.length ? 'warning' : undefined, hint: pending.length ? 'Awaiting Stock Keeper' : undefined },
//         { label: 'Suppliers', value: String(new Set(materialReceipts.map((r) => r.supplier)).size) },
//       ]}
//       columns={columns}
//       rows={materialReceipts}
//       tableTitle="Arrivals and verification"
//       emptyTitle="No materials received in this period"
//       emptyDescription="Widen the date range or clear the supplier filter, then generate again."
//       footnote="The Stock Keeper is responsible for inspecting, confirming and recording the offloading of every incoming delivery. Unverified arrivals are not counted as available stock."
//     />
//   )
// }

import { useEffect, useState, useCallback } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import Loader from '../../ds/components/core/Loader.jsx'
import { ReportShell } from '../shells/ReportShell.jsx'
import { useStore } from '../store.jsx'
import { fmt, fmtDate } from '../utils.js'
import InventoryApi from '../../api/InventoryApi.js'

const inventoryApi = new InventoryApi()
const PAGE_SIZE = 50

const CONDITION_LABEL = {
  ACCEPTED: 'Accepted',
  ACCEPTED_WITH_EXCEPTIONS: 'Accepted with exceptions',
  PENDING_VERIFICATION: 'Pending verification',
  REJECTED: 'Rejected',
}
const CONDITION_TONE = {
  ACCEPTED: 'success',
  ACCEPTED_WITH_EXCEPTIONS: 'warning',
  PENDING_VERIFICATION: 'neutral',
  REJECTED: 'danger',
}
const CONDITION_OPTIONS = [
  { value: '', label: 'All conditions' },
  ...Object.entries(CONDITION_LABEL).map(([value, label]) => ({ value, label })),
]

const TYPE_LABEL = {
  RAW_MATERIAL: 'Raw material',
  FINISHED_PRODUCT: 'Finished product',
  OUTSOURCED: 'Outsourced',
}

const EMPTY_FILTERS = { locationId: '', condition: '' }

export default function MaterialReceiveReport({ leaf, moduleLabel, parentLabel }) {
  const { factories, showToast } = useStore()

  // applied = last set of filters the user clicked "Generate" with
  const [applied, setApplied] = useState(EMPTY_FILTERS)
  const [page, setPage] = useState(0)

  const [rows, setRows] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const [loading, setLoading] = useState(false)

  // "Generate report" → new filter set, back to page 0
  const handleGenerate = useCallback((values) => {
    setApplied({
      locationId: values?.locationId || '',
      condition: values?.condition || '',
    })
    setPage(0)
  }, [])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      // locationId is optional — omit when the user is viewing all factories
      const query = {
        page,
        size: PAGE_SIZE,
      }
      if (applied.locationId) query.locationId = applied.locationId
      if (applied.condition) query.condition = applied.condition

      const res = await inventoryApi.listStockReceiptsReports(query)
      const paged = res.data
      setRows(paged.items || [])
      setTotalPages(paged.totalPages || 0)
      setTotalItems(paged.totalItems || 0)
    } catch (e) {
      showToast('Could not load receipts', e.message, true)
    } finally {
      setLoading(false)
    }
  }, [applied, page, showToast])

  useEffect(() => {
    load()
  }, [load])

  const verified = rows.filter((r) => r.verifiedBy)
  const pending = rows.filter((r) => !r.verifiedBy)
  const supplierCount = new Set(rows.map((r) => r.supplier?.id).filter(Boolean)).size

  const columns = [
    {
      key: 'manufacturedDate',
      label: 'Manufactured',
      width: 135,
      render: (r) => (r.manufacturedDate ? fmtDate(r.manufacturedDate) : '—'),
    },
    { key: 'ref', label: 'Reference', width: 110, mono: true },
    {
      key: 'item',
      label: 'Material / recipe',
      width: 240,
      render: (r) => r.stockItem?.name || '—',
    },
    {
      key: 'type',
      label: 'Type',
      width: 160,
      render: (r) => {
        const t = r.stockItem?.itemType
        return (
          <Badge tone={t === 'FINISHED_PRODUCT' ? 'brand' : 'neutral'}>
            {TYPE_LABEL[t] || t || '—'}
          </Badge>
        )
      },
    },
    {
      key: 'supplier',
      label: 'Supplier',
      width: 210,
      render: (r) => r.supplier?.name || '—',
    },
    {
      key: 'manufacturer',
      label: 'Manufacturer',
      width: 200,
      render: (r) => r.manufacturer?.name || '—',
    },
    {
      key: 'quantity',
      label: 'Qty received',
      width: 130,
      align: 'right',
      mono: true,
      render: (r) => fmt(r.quantity || 0),
    },
    {
      key: 'unitCost',
      label: 'Unit cost',
      width: 130,
      align: 'right',
      mono: true,
      render: (r) => (r.unitCost != null ? fmt(r.unitCost) : '—'),
    },
    {
      key: 'expiryDate',
      label: 'Expiry',
      width: 130,
      render: (r) => (r.expiryDate ? fmtDate(r.expiryDate) : '—'),
    },
    {
      key: 'verifiedBy',
      label: 'Verified by',
      width: 150,
      render: (r) =>
        r.verifiedBy ? (
          r.verifiedBy.name || '—'
        ) : (
          <span style={{ color: 'var(--text-subtle)' }}>Not verified</span>
        ),
    },
    {
      key: 'offloadedAt',
      label: 'Offloaded',
      width: 130,
      render: (r) =>
        r.offloadedAt ? (
          fmtDate(r.offloadedAt)
        ) : (
          <span style={{ color: 'var(--text-subtle)' }}>—</span>
        ),
    },
    {
      key: 'condition',
      label: 'Condition',
      width: 200,
      render: (r) => (
        <Badge tone={CONDITION_TONE[r.condition] || 'neutral'}>
          {CONDITION_LABEL[r.condition] || r.condition || '—'}
        </Badge>
      ),
    },
  ]

  const factoryOptions = [
    { value: '', label: 'All factories' },
    ...factories.map((f) => ({ value: f.id, label: f.name })),
  ]

  return (
    <>
      {loading && <Loader overlay label="Loading receipts…" />}
      <ReportShell
        wide
        crumbs={[moduleLabel, parentLabel]}
        title={leaf?.label || 'Material/Recipe Receive Report'}
        icon={leaf?.icon}
        description="All materials and recipes received into the factory with their arrival dates, supplier and manufacturer details, and the Stock Keeper's inspection and offloading verification."
        onGenerate={handleGenerate}
        filters={[
          {
            key: 'locationId',
            label: 'Factory',
            type: 'select',
            options: factoryOptions,
            defaultValue: applied.locationId,
          },
          {
            key: 'condition',
            label: 'Condition',
            type: 'select',
            options: CONDITION_OPTIONS,
            defaultValue: applied.condition,
          },
        ]}
        stats={[
          { label: 'Deliveries received', value: String(totalItems) },
          {
            label: 'Verified & offloaded',
            value: String(verified.length),
            hint: rows.length
              ? `${Math.round((verified.length / rows.length) * 100)}% of this page`
              : undefined,
          },
          {
            label: 'Pending verification',
            value: String(pending.length),
            tone: pending.length ? 'warning' : undefined,
            hint: pending.length ? 'Awaiting Stock Keeper' : undefined,
          },
          { label: 'Suppliers (this page)', value: String(supplierCount) },
        ]}
        columns={columns}
        rows={rows}
        tableTitle="Arrivals and verification"
        pagination={{
          page,
          pageCount: totalPages,
          pageSize: PAGE_SIZE,
          total: totalItems,
          onPage: setPage,
        }}
        emptyTitle="No materials received in this period"
        emptyDescription="Adjust the filters and generate again."
        footnote="The Stock Keeper is responsible for inspecting, confirming and recording the offloading of every incoming delivery. Unverified arrivals are not counted as available stock."
      />
    </>
  )
}