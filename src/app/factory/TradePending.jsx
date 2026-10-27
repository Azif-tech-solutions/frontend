// import { useState } from 'react'
// import { Badge } from '../../ds/components/core/Badge.jsx'
// import { Button } from '../../ds/components/core/Button.jsx'
// import { RegisterShell } from '../shells/RegisterShell.jsx'
// import { Callout } from '../shells/Page.jsx'
// import { factoryTrades, materialPosition } from '../sample.js'
// import { fmt, money, moneyShort } from '../utils.js'

// const TABS = [
//   { value: 'pending', label: 'Awaiting response', icon: 'hourglass' },
//   { value: 'responded', label: 'Responded', icon: 'circle-check-big' },
// ]

// const STATUS_TONE = { Pending: 'warning', Accepted: 'success', Rejected: 'danger' }

// /**
//  * Whether accepting an offer helps this factory — the basis on which the PRD
//  * says trades are evaluated ("based on their production needs").
//  */
// function assess(trade) {
//   const p = materialPosition[trade.code]
//   const shortfall = Math.max(0, p.reorderLevel - p.onHand)
//   if (!shortfall) return { label: 'Not needed', tone: 'neutral', note: 'Stock is above re-order level' }
//   if (trade.qty >= shortfall) return { label: 'Covers shortfall', tone: 'success', note: `Clears a ${fmt(shortfall)} ${p.unit.toLowerCase()} shortfall` }
//   return { label: 'Partly covers', tone: 'warning', note: `${fmt(shortfall - trade.qty)} ${p.unit.toLowerCase()} still short` }
// }

// export default function TradePending({ leaf, moduleLabel, parentLabel }) {
//   const [tab, setTab] = useState('pending')

//   const incoming = factoryTrades.filter((t) => t.direction === 'Incoming')
//   const pending = incoming.filter((t) => t.status === 'Pending')
//   const rows = (tab === 'pending' ? pending : incoming.filter((t) => t.status !== 'Pending'))
//     .map((t) => ({ ...t, assessment: assess(t), position: materialPosition[t.code] }))

//   const pendingValue = pending.reduce((n, t) => n + t.qty * materialPosition[t.code].unitCost, 0)
//   const needed = pending.filter((t) => assess(t).tone !== 'neutral')

//   const columns = [
//     { key: 'ref', label: 'Offer ref.', width: 110, mono: true },
//     { key: 'from', label: 'From factory', width: 140 },
//     { key: 'material', label: 'Raw material', width: 235, render: (t) => t.position.name },
//     { key: 'qty', label: 'Qty offered', width: 130, align: 'right', mono: true, render: (t) => fmt(t.qty) },
//     { key: 'unit', label: 'Unit', width: 105, render: (t) => t.position.unit },
//     { key: 'value', label: 'Value', width: 155, align: 'right', mono: true, render: (t) => money(t.qty * t.position.unitCost) },
//     { key: 'onHand', label: 'Your stock', width: 120, align: 'right', mono: true, render: (t) => fmt(t.position.onHand) },
//     { key: 'reorderLevel', label: 'Your level', width: 115, align: 'right', mono: true, render: (t) => fmt(t.position.reorderLevel) },
//     {
//       key: 'assessment', label: 'Assessment', width: 165,
//       render: (t) => <Badge tone={t.assessment.tone}>{t.assessment.label}</Badge>,
//     },
//     { key: 'reason', label: 'Offered because', width: 220 },
//     { key: 'offered', label: 'Offered on', width: 130 },
//     ...(tab === 'pending'
//       ? [
//           { key: 'expires', label: 'Expires', width: 125 },
//           {
//             key: 'action', label: 'Action', width: 175, sortable: false,
//             render: () => (
//               <div style={{ display: 'flex', gap: 6 }}>
//                 <Button size="sm" iconLeft="check">Accept</Button>
//                 <Button size="sm" variant="secondary">Reject</Button>
//               </div>
//             ),
//           },
//         ]
//       : [
//           { key: 'responded', label: 'Responded on', width: 140 },
//           { key: 'status', label: 'Outcome', width: 120, render: (t) => <Badge tone={STATUS_TONE[t.status]}>{t.status}</Badge> },
//           { key: 'respondedBy', label: 'Responded by', width: 160 },
//         ]),
//   ]

//   return (
//     <RegisterShell
//       wide
//       crumbs={[moduleLabel, parentLabel]}
//       title={leaf?.label || 'Pending Trade'}
//       icon={leaf?.icon}
//       description="Trade offers submitted by other factories. Review each against your own production needs and accept or reject it before the exchange is finalised."
//       tabs={TABS}
//       tab={tab}
//       onTabChange={setTab}
//       searchPlaceholder="Search by reference, material or offering factory…"
//       stats={[
//         { label: 'Awaiting your response', value: String(pending.length), tone: pending.length ? 'warning' : undefined },
//         { label: 'Value on offer', value: moneyShort(pendingValue) },
//         { label: 'Materials you are short of', value: String(needed.length), hint: needed.length ? 'Worth accepting' : 'None' },
//         { label: 'Soonest expiry', value: pending.length ? '28 Aug' : '—', hint: pending.length ? 'FT-0212' : undefined },
//       ]}
//       columns={columns}
//       rows={rows}
//       emptyTitle={tab === 'pending' ? 'No offers awaiting your response' : 'No trades responded to yet'}
//       emptyDescription={tab === 'pending' ? 'Other factories have not listed any surplus for you at the moment.' : undefined}
//       footnote="Accepting a trade moves the material from the offering factory to yours and records the exchange in the Trade Report. Stock does not move until you accept."
//     >
//       {tab === 'pending' && needed.length > 0 && (
//         <Callout tone="success" icon="lightbulb" title={`${needed.length} of these offers cover a shortfall you have`}>
//           {needed.map((t) => {
//             const a = assess(t)
//             return `${materialPosition[t.code].name.split(' · ')[1]} — ${a.note.toLowerCase()}`
//           }).join('; ')}. Accepting internally avoids an external purchase order.
//         </Callout>
//       )}
//     </RegisterShell>
//   )
// }
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import Loader from '../../ds/components/core/Loader.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import { RegisterShell } from '../shells/RegisterShell.jsx'
import { Callout } from '../shells/Page.jsx'
import { fmt } from '../utils.js'
import { useStore } from '../store.jsx'
import  FactoryApi  from '../../api/FactoryApi.js'
import InventoryApi from '../../api/InventoryApi.js'
const   factoryApi = new FactoryApi()
const inventoryApi = new InventoryApi()
const PAGE_SIZE = 20
const STOCK_PAGE_SIZE = 200

const TABS = [
  { value: 'pending', label: 'Awaiting response', icon: 'hourglass' },
  { value: 'responded', label: 'Responded', icon: 'circle-check-big' },
]

const OUTCOMES = [
  { value: 'ACCEPTED', label: 'Accepted' },
  { value: 'REJECTED', label: 'Rejected' },
]

const STATUS_TONE = { PENDING: 'warning', ACCEPTED: 'success', REJECTED: 'danger' }

const sentence = (s = '') => {
  const t = s.toLowerCase().replace(/_/g, ' ')
  return t.charAt(0).toUpperCase() + t.slice(1)
}

const fmtDate = (iso) => {
  if (!iso) return '—'
  const d = new Date(iso)
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

/**
 * Whether accepting an offer helps this factory: the basis on which the PRD
 * says trades are evaluated ("based on their production needs").
 * `own` is this factory's own stock record for the same item, if it has one.
 */
function assess(qty, own) {
  if (!own) return { label: 'Not stocked', tone: 'neutral', note: 'You do not stock this item' }
  const shortfall = Math.max(0, own.reorderLevel - own.onHand)
  const unit = own.unit ? ` ${own.unit.toLowerCase()}` : ''
  if (!shortfall) return { label: 'Not needed', tone: 'neutral', note: 'Stock is above re-order level' }
  if (qty >= shortfall) return { label: 'Covers shortfall', tone: 'success', note: `Clears a ${fmt(shortfall)}${unit} shortfall` }
  return { label: 'Partly covers', tone: 'warning', note: `${fmt(shortfall - qty)}${unit} still short` }
}

export default function TradePending({ leaf, moduleLabel, parentLabel }) {
  const { factories, showToast } = useStore()

  const [tab, setTab] = useState('pending')
  const [locationId, setLocationId] = useState('') // the receiving factory
  const [outcome, setOutcome] = useState('') // responded tab only: '' = all

  // data
  const [page, setPage] = useState(0)
  const [items, setItems] = useState([])
  const [pageInfo, setPageInfo] = useState({ totalItems: 0, totalPages: 1 })
  const [loading, setLoading] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)
  const [actingId, setActingId] = useState(null)

  // this factory's own raw-material stock, used for the assessment
  const [ownStock, setOwnStock] = useState([])

  const factoryOptions = useMemo(
    () => (factories || []).map((f) => ({ value: f.id, label: f.name })),
    [factories],
  )

  // Default the receiving factory when there is only one.
  useEffect(() => {
    if (!locationId && factories?.length === 1) setLocationId(factories[0].id)
  }, [factories, locationId])

  // Own stock at the receiving factory.
  useEffect(() => {
    if (!locationId) { setOwnStock([]); return }
    let cancelled = false
    inventoryApi
      .listStockItems(locationId, 'RAW_MATERIAL', { page: 0, size: STOCK_PAGE_SIZE })
      .then((res) => !cancelled && setOwnStock(res.data.items ?? []))
      .catch((e) => !cancelled && showToast('Could not load your stock', e.message, true))
    return () => { cancelled = true }
  }, [locationId, showToast])

  // Own stock by item code (the offered item is the offering factory's record, so match on code).
  const ownByCode = useMemo(() => {
    const m = new Map()
    for (const s of ownStock) {
      m.set(s.code, {
        onHand: Number(s.quantityOnHand) || 0,
        reorderLevel: Number(s.reorderLevel) || 0,
        unit: s.unitOfMeasure?.symbol || s.unitOfMeasure?.name || '',
      })
    }
    return m
  }, [ownStock])

  // One page of offers. Runs again when the factory, tab, outcome, page or reloadKey change.
  useEffect(() => {
    if (!locationId) { setItems([]); setPageInfo({ totalItems: 0, totalPages: 1 }); return }
    let cancelled = false
    setLoading(true)

    const status = tab === 'pending' ? 'PENDING' : outcome || undefined

    factoryApi
      .listTradeOffers({ locationId, status, page, size: PAGE_SIZE })
      .then((res) => {
        if (cancelled) return
        const d = res.data
        setItems(d.items ?? [])
        setPageInfo({ totalItems: d.totalItems ?? 0, totalPages: d.totalPages ?? 1 })
      })
      .catch((e) => !cancelled && showToast('Could not load trade offers', e.message, true))
      .finally(() => !cancelled && setLoading(false))
    return () => { cancelled = true }
  }, [locationId, tab, outcome, page, reloadKey, showToast])

  const changeTab = (t) => { setTab(t); setOutcome(''); setPage(0) }
  const changeFactory = (e) => { setLocationId(e.target.value); setPage(0) }
  const changeOutcome = (e) => { setOutcome(e.target.value); setPage(0) }

  // Incoming offers only: the ones addressed to the chosen factory.
  // On the responded tab with no outcome picked, pending offers are hidden.
  const rows = useMemo(
    () =>
      items
        .filter((t) => !t.toLocationId?.id || t.toLocationId.id === locationId)
        .filter((t) => tab === 'pending' || t.status !== 'PENDING')
        .map((t) => {
          const qty = Number(t.quantity) || 0
          const own = ownByCode.get(t.stockItem?.code)
          return {
            id: t.id,
            from: t.fromLocation.name || '—',
            material: t.stockItem ? `${t.stockItem.code} · ${t.stockItem.name}` : '—',
            materialName: t.stockItem?.name || '—',
            qty,
            unit: own?.unit || '—',
            onHand: own ? own.onHand : null,
            reorderLevel: own ? own.reorderLevel : null,
            assessment: assess(qty, own),
            reason: t.reason ? sentence(t.reason) : '—',
            offered: fmtDate(t.offeredAt),
            expiresAt: t.expiresAt,
            expires: fmtDate(t.expiresAt),
            status: t.status || '',
          }
        }),
    [items, ownByCode, locationId, tab],
  )

  const needed = rows.filter((r) => r.assessment.tone === 'success' || r.assessment.tone === 'warning')

  const soonest = useMemo(() => {
    const dated = rows.filter((r) => r.expiresAt && !Number.isNaN(new Date(r.expiresAt).getTime()))
    if (!dated.length) return null
    return dated.reduce((a, b) => (new Date(a.expiresAt) < new Date(b.expiresAt) ? a : b))
  }, [rows])

  const respond = useCallback(
    async (row, decision) => {
      if (actingId) return
      setActingId(row.id)
      try {
        await factoryApi.tradeOfferResponse(row.id, { decision })
        showToast(
          decision === 'ACCEPTED' ? 'Trade accepted' : 'Trade rejected',
          decision === 'ACCEPTED' ? `${row.materialName} will move to your factory.` : undefined,
        )
        setReloadKey((k) => k + 1)
      } catch (e) {
        showToast('Could not respond to the offer', e.message, true)
      } finally {
        setActingId(null)
      }
    },
    [actingId, showToast],
  )

  const columns = [
    { key: 'from', label: 'From factory', width: 150 },
    { key: 'material', label: 'Raw material', width: 260 },
    { key: 'qty', label: 'Qty offered', width: 130, align: 'right', mono: true, render: (t) => fmt(t.qty) },
    { key: 'unit', label: 'Unit', width: 100 },
    {
      key: 'onHand', label: 'Your stock', width: 120, align: 'right', mono: true,
      render: (t) => (t.onHand == null ? '—' : fmt(t.onHand)),
    },
    {
      key: 'reorderLevel', label: 'Your level', width: 115, align: 'right', mono: true,
      render: (t) => (t.reorderLevel == null ? '—' : fmt(t.reorderLevel)),
    },
    {
      key: 'assessment', label: 'Assessment', width: 165,
      render: (t) => <Badge tone={t.assessment.tone}>{t.assessment.label}</Badge>,
    },
    { key: 'reason', label: 'Offered because', width: 200 },
    { key: 'offered', label: 'Offered on', width: 130 },
    ...(tab === 'pending'
      ? [
          { key: 'expires', label: 'Expires', width: 125 },
          {
            key: 'action', label: 'Action', width: 190, sortable: false,
            render: (t) => (
              <div style={{ display: 'flex', gap: 6 }}>
                <Button size="sm" iconLeft="check" disabled={!!actingId} onClick={() => respond(t, 'ACCEPTED')}>Accept</Button>
                <Button size="sm" variant="secondary" disabled={!!actingId} onClick={() => respond(t, 'REJECTED')}>Reject</Button>
              </div>
            ),
          },
        ]
      : [
          {
            key: 'status', label: 'Outcome', width: 120,
            render: (t) => <Badge tone={STATUS_TONE[t.status.toUpperCase()] || 'neutral'}>{sentence(t.status) || '—'}</Badge>,
          },
        ]),
  ]

  return (
    <RegisterShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Pending Trade'}
      icon={leaf?.icon}
      description="Trade offers submitted by other factories. Review each against your own production needs and accept or reject it before the exchange is finalised."
      tabs={TABS}
      tab={tab}
      onTabChange={changeTab}
      searchPlaceholder="Search by material or offering factory…"
      filters={
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Select
            options={factoryOptions}
            value={locationId}
            onChange={changeFactory}
            placeholder="Select your factory…"
            style={{ width: 220 }}
          />
          {tab === 'responded' && (
            <Select
              options={OUTCOMES}
              value={outcome}
              onChange={changeOutcome}
              placeholder="All outcomes"
              style={{ width: 170 }}
            />
          )}
        </div>
      }
      stats={[
        {
          label: tab === 'pending' ? 'Awaiting your response' : 'Responded',
          value: String(pageInfo.totalItems),
          tone: tab === 'pending' && pageInfo.totalItems ? 'warning' : undefined,
          hint: 'Matching the filters',
        },
        { label: 'Offers on this page', value: String(rows.length) },
        {
          label: 'Materials you are short of',
          value: String(needed.length),
          hint: needed.length ? 'Worth accepting (this page)' : 'None on this page',
        },
        {
          label: 'Soonest expiry',
          value: soonest ? soonest.expires : '—',
          hint: soonest ? soonest.materialName : undefined,
        },
      ]}
      columns={columns}
      rows={rows}
      pagination={{
        page,
        pageCount: pageInfo.totalPages,
        pageSize: PAGE_SIZE,
        total: pageInfo.totalItems,
        onPage: setPage,
      }}
      emptyTitle={
        !locationId
          ? 'Choose your factory'
          : tab === 'pending' ? 'No offers awaiting your response' : 'No trades responded to yet'
      }
      emptyDescription={
        !locationId
          ? 'Select the receiving factory above to see the offers addressed to it.'
          : tab === 'pending' ? 'Other factories have not listed any surplus for you at the moment.' : undefined
      }
      footnote="Accepting a trade moves the material from the offering factory to yours and records the exchange in the Trade Report. Stock does not move until you accept."
    >
      {loading && <Loader overlay label="Loading trade offers…" />}

      {tab === 'pending' && needed.length > 0 && (
        <Callout tone="success" icon="lightbulb" title={`${needed.length} of these offers cover a shortfall you have`}>
          {needed.map((t) => `${t.materialName}: ${t.assessment.note.toLowerCase()}`).join('; ')}.
          Accepting internally avoids an external purchase order.
        </Callout>
      )}
    </RegisterShell>
  )
}