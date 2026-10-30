// import { useCallback, useEffect, useMemo, useState } from 'react'
// import { Badge } from '../../ds/components/core/Badge.jsx'
// import { Input } from '../../ds/components/forms/Input.jsx'
// import { Select } from '../../ds/components/forms/Select.jsx'
// import { ReportTable } from '../../ds/components/data/ReportTable.jsx'
// import { FormShell } from '../shells/FormShell.jsx'
// import { Panel, FieldSet, MetaRow, Callout } from '../shells/Page.jsx'
// import { tradeReasons } from '../sample.js'
// import { fmt } from '../utils.js'
// import { useStore } from '../store.jsx'
// import  InventoryApi  from '../../api/InventoryApi.js'
// import  FactoryApi  from '../../api/FactoryApi.js'
// const inventoryApi = new InventoryApi()
// const factoryApi = new FactoryApi()

// const PAGE_SIZE = 10
// const STOCK_PAGE_SIZE = 200 // enough for one factory's raw materials; see notes

// const STATUS_TONE = {
//   OPEN: 'info', PENDING: 'info',
//   ACCEPTED: 'success',
//   REJECTED: 'danger',
//   WITHDRAWN: 'neutral', EXPIRED: 'neutral',
// }

// const sentence = (s = '') => {
//   const t = s.toLowerCase().replace(/_/g, ' ')
//   return t.charAt(0).toUpperCase() + t.slice(1)
// }

// const fmtDate = (iso) => {
//   if (!iso) return '—'
//   const d = new Date(iso)
//   return Number.isNaN(d.getTime())
//     ? iso
//     : d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
// }

// const EMPTY_FORM = { code: '', qty: '', reason: '', toId: '', expires: '' }

// export default function TradeOffer({ leaf, moduleLabel, parentLabel }) {
//   const { factories, showToast } = useStore()

//   // form
//   const [fromId, setFromId] = useState('')
//   const [form, setForm] = useState(EMPTY_FORM)
//   const [submitting, setSubmitting] = useState(false)
//   const setField = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }))

//   // raw materials at the offering factory
//   const [stock, setStock] = useState([])

//   // my offers
//   const [page, setPage] = useState(0)
//   const [offers, setOffers] = useState([])
//   const [pageInfo, setPageInfo] = useState({ totalItems: 0, totalPages: 1 })
//   const [reloadKey, setReloadKey] = useState(0)

//   // Default the offering factory when there is only one.
//   useEffect(() => {
//     if (!fromId && factories?.length === 1) setFromId(factories[0].id)
//   }, [factories, fromId])

//   // Raw materials held at the offering factory, with on-hand and re-order level.
//   useEffect(() => {
//     if (!fromId) { setStock([]); return }
//     let cancelled = false
//     inventoryApi
//       .listStockItems(fromId, 'RAW_MATERIAL', { page: 0, size: STOCK_PAGE_SIZE })
//       .then((res) => {
//         console.log("data comming from api list")
//         console.log(res.data.items)
//         if (!cancelled) return
//         setStock(res.data.items ?? [])
//       })
//       .catch((e) => !cancelled && showToast('Could not load stock', e.message, true))
//     return () => { cancelled = true }
//   }, [fromId, showToast])

//   // Only stock above its re-order level can honestly be offered as surplus.
//   const surplusItems = useMemo(
//     () =>
//       stock
//         .map((s) => ({
//           id: s.id,
//           code: s.code,
//           name: s.name,
//           unit: s.unitOfMeasure?.symbol || s.unitOfMeasure?.name || '',
//           onHand: Number(s.quantityOnHand) || 0,
//           reorderLevel: Number(s.reorderLevel) || 0,
//         }))
//         .filter((s) => s.id && s.onHand > s.reorderLevel),
//     [stock],
//   )

//   const surplusOptions = useMemo(
//     () => surplusItems.map((s) => ({ value: s.id, label: `${s.code} · ${s.name}` })),
//     [surplusItems],
//   )

//   const position = surplusItems.find((s) => s.id === form.code)
//   const surplus = position ? position.onHand - position.reorderLevel : 0
//   const offering = Number(form.qty) || 0
//   const overOffered = !!position && offering > surplus

//   const factoryOptions = useMemo(
//     () => (factories || []).map((f) => ({ value: f.id, label: f.name })),
//     [factories],
//   )
//   const recipientOptions = factoryOptions.filter((f) => f.value !== fromId)

//   const changeFrom = (e) => {
//     setFromId(e.target.value)
//     setForm((s) => ({ ...s, code: '', qty: '', toId: '' }))
//     setPage(0)
//   }

//   // My offers
//   useEffect(() => {
//     if (!fromId) { setOffers([]); setPageInfo({ totalItems: 0, totalPages: 1 }); return }
//     let cancelled = false
//     factoryApi
//       .listTradeOffers({ locationId: fromId, page, size: PAGE_SIZE })
//       .then((res) => {
//         if (cancelled) return
//         const d = res.data
//         setOffers(d.items ?? [])
//         setPageInfo({ totalItems: d.totalItems ?? 0, totalPages: d.totalPages ?? 1 })
//       })
//       .catch((e) => !cancelled && showToast('Could not load offers', e.message, true))
//     return () => { cancelled = true }
//   }, [fromId, page, reloadKey, showToast])

//   const rows = useMemo(
//     () =>
//       offers.map((t) => ({
//         id: t.id,
//         material: t.stockItemId ? `${t.stockItemId.code} · ${t.stockItemId.name}` : '—',
//         qty: Number(t.quantity) || 0,
//         from: t.fromLocationId?.name || '—',
//         to: t.toLocationId?.name || '—',
//         reason: t.reason ? sentence(t.reason) : '—',
//         offered: fmtDate(t.offeredAt),
//         expires: fmtDate(t.expiresAt),
//         status: t.status || '',
//       })),
//     [offers],
//   )

//   const columns = [
//     { key: 'material', label: 'Item', width: 260 },
//     { key: 'qty', label: 'Qty offered', width: 130, align: 'right', mono: true, render: (t) => fmt(t.qty) },
//     { key: 'to', label: 'Offered to', width: 170 },
//     { key: 'reason', label: 'Reason', width: 180 },
//     { key: 'offered', label: 'Offered on', width: 130 },
//     { key: 'expires', label: 'Expires', width: 130 },
//     {
//       key: 'status', label: 'Status', width: 130,
//       render: (t) => <Badge tone={STATUS_TONE[t.status.toUpperCase()] || 'neutral'}>{sentence(t.status) || '—'}</Badge>,
//     },
//   ]

//   // Submit
//   const submit = async () => {
//     if (submitting) return
//     if (!fromId) return showToast('Choose the offering factory', undefined, true)
//     if (!form.code) return showToast('Choose a material to offer', undefined, true)
//     if (offering <= 0) return showToast('Enter a quantity to offer', undefined, true)
//     if (overOffered) return showToast('Quantity exceeds surplus', `Only ${fmt(surplus)} sits above the re-order level.`, true)
//     if (!form.toId) return showToast('Choose who to offer to', undefined, true)
//     if (!form.reason) return showToast('Choose a reason for the surplus', undefined, true)
//     if (!form.expires) return showToast('Set an expiry date', undefined, true)

//     const expiresAt = new Date(`${form.expires}T23:59:59`)
//     if (Number.isNaN(expiresAt.getTime()) || expiresAt <= new Date()) {
//       return showToast('Expiry must be in the future', undefined, true)
//     }

//     setSubmitting(true)
//     try {
//       await factoryApi.createTradeOffer({
//         fromLocationId: fromId,
//         toLocationId: form.toId,
//         stockItemId: form.code,
//         quantity: offering,
//         reason: form.reason,
//         expiresAt: expiresAt.toISOString(),
//       })
//       showToast('Offer listed', 'The receiving factory can now review it.')
//       setForm(EMPTY_FORM)
//       setPage(0)
//       setReloadKey((k) => k + 1)
//     } catch (e) {
//       showToast('Could not list offer', e.message, true)
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   const cancel = useCallback(() => setForm(EMPTY_FORM), [])

//   const fromName = factoryOptions.find((f) => f.value === fromId)?.label

//   return (
//     <FormShell
//       wide
//       crumbs={[moduleLabel, parentLabel]}
//       title={leaf?.label || 'Offer Trade'}
//       icon={leaf?.icon}
//       description="Offer excess raw materials to other factories in the organisation, so surplus is redistributed internally rather than purchased externally. Other factories review and accept offers against their own production needs."
//       submitLabel={submitting ? 'Listing…' : 'List offer'}
//       onSubmit={submit}
//       onCancel={cancel}
//       note="Listing an offer does not move stock. The material stays in your factory until the receiving factory accepts and the transfer completes."
//       aside={
//         <>
//           <Panel title="Offer summary">
//             <MetaRow label="Material" value={position ? position.name : '—'} />
//             <MetaRow
//               label="On hand"
//               value={position ? `${fmt(position.onHand)} ${position.unit}`.trim() : '—'}
//               mono
//             />
//             <MetaRow label="Re-order level" value={position ? fmt(position.reorderLevel) : '—'} mono />
//             <MetaRow
//               label="Surplus available"
//               value={position ? fmt(surplus) : '—'}
//               mono
//               tone={position ? 'positive' : undefined}
//             />
//             {overOffered && (
//               <Callout tone="danger" icon="circle-alert" title="Exceeds surplus" style={{ marginTop: 14 }}>
//                 You are offering {fmt(offering)} but only {fmt(surplus)} sits above your re-order level.
//                 Offering more would push this material below its threshold.
//               </Callout>
//             )}
//           </Panel>

//           <Panel title="How trading works">
//             <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', lineHeight: 1.7 }}>
//               Offers are visible to the receiving factory under Pending Trade, where they are accepted or rejected
//               against production needs. Accepted trades move stock between factories and appear in the Trade Report
//               with both the offer and response dates.
//             </div>
//           </Panel>
//         </>
//       }
//     >
//       <Panel title="Material to offer" description="Only stock held above its re-order level can be offered as surplus.">
//         <FieldSet columns={3}>
//           <Select label="Offering factory" options={factoryOptions} value={fromId} onChange={changeFrom} placeholder="Select factory…" />
//           <Select
//             label="Raw material"
//             options={surplusOptions}
//             value={form.code}
//             onChange={setField('code')}
//             placeholder={fromId ? 'Select surplus material…' : 'Choose a factory first'}
//           />
//           <Input
//             label="Quantity to offer"
//             type="number"
//             placeholder="0"
//             value={form.qty}
//             onChange={setField('qty')}
//             error={overOffered ? `Only ${fmt(surplus)} available above threshold` : undefined}
//           />
//           <Input label="Unit" value={position?.unit || ''} onChange={() => {}} disabled />
//           <Select label="Reason for surplus" options={tradeReasons} value={form.reason} onChange={setField('reason')} placeholder="Select reason…" />
//           <Select label="Offer to" options={recipientOptions} value={form.toId} onChange={setField('toId')} placeholder="Select recipient…" />
//           <Input label="Offer expires" type="date" value={form.expires} onChange={setField('expires')} />
//         </FieldSet>
//         <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
//           {fromName && <Badge tone="brand">Offering from {fromName}</Badge>}
//           {fromId && (
//             <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
//               {surplusItems.length} material{surplusItems.length === 1 ? '' : 's'} currently sit above their re-order level.
//             </span>
//           )}
//         </div>
//       </Panel>

//       <Panel title="My active offers" description="Offers this factory has listed, and how other factories responded." padding={0}>
//         <ReportTable
//           columns={columns}
//           rows={rows}
//           rowKey={(t) => t.id}
//           stickyHeader={false}
//           style={{ border: 'none', borderRadius: 0 }}
//           emptyLabel={fromId ? 'No offers listed yet' : 'Choose a factory to see its offers'}
//           pagination={{
//             page,
//             pageCount: pageInfo.totalPages,
//             pageSize: PAGE_SIZE,
//             total: pageInfo.totalItems,
//             onPage: setPage,
//           }}
//         />
//       </Panel>
//     </FormShell>
//   )
// }


import { useCallback, useEffect, useMemo, useState } from 'react'

import { Badge } from '../../ds/components/core/Badge.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import { ReportTable } from '../../ds/components/data/ReportTable.jsx'
import { FormShell } from '../shells/FormShell.jsx'
import { Panel, FieldSet, MetaRow, Callout } from '../shells/Page.jsx'
import { tradeReasons } from '../sample.js'
import { fmt } from '../utils.js'
import { useStore } from '../store.jsx'

import InventoryApi from '../../api/InventoryApi.js'
import FactoryApi from '../../api/FactoryApi.js'

const inventoryApi = new InventoryApi()
const factoryApi = new FactoryApi()

const PAGE_SIZE = 10
const STOCK_PAGE_SIZE = 200

const STATUS_TONE = {
  OPEN: 'info',
  PENDING: 'info',
  ACCEPTED: 'success',
  REJECTED: 'danger',
  WITHDRAWN: 'neutral',
  EXPIRED: 'neutral',
}

const sentence = (s = '') => {
  const t = s.toLowerCase().replace(/_/g, ' ')
  return t.charAt(0).toUpperCase() + t.slice(1)
}

const fmtDate = (iso) => {
  if (!iso) return '—'

  const d = new Date(iso)

  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
}

const EMPTY_FORM = {
  code: '',
  qty: '',
  reason: '',
  toId: '',
  expires: '',
}

export default function TradeOffer({ leaf, moduleLabel, parentLabel }) {
  const { factories, showToast } = useStore()

  // Form
  const [fromId, setFromId] = useState('')
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)

  const setField = (k) => (e) =>
    setForm((s) => ({ ...s, [k]: e.target.value }))

  // Raw materials at the offering factory
  const [stock, setStock] = useState([])

  // My offers
  const [page, setPage] = useState(0)
  const [offers, setOffers] = useState([])
  const [pageInfo, setPageInfo] = useState({
    totalItems: 0,
    totalPages: 1,
  })
  const [reloadKey, setReloadKey] = useState(0)

  // Default to the only available factory
  useEffect(() => {
    if (!fromId && factories?.length === 1) {
      setFromId(factories[0].id)
    }
  }, [factories, fromId])

  // Load raw materials held at the offering factory
  useEffect(() => {
    if (!fromId) {
      setStock([])
      return
    }

    let cancelled = false

    const loadStock = async () => {
      try {
        const res = await inventoryApi.listStockItems(
          fromId,
          'RAW_MATERIAL',
          {
            page: 0,
            size: STOCK_PAGE_SIZE,
          },
        )

        // Ignore responses from a previous factory selection
        if (cancelled) return

        const items = res?.data?.items ?? []

        console.log('Raw materials from API:', items)

        setStock(items)
      } catch (e) {
        if (!cancelled) {
          setStock([])
          showToast(
            'Could not load stock',
            e.message,
            true,
          )
        }
      }
    }

    loadStock()

    return () => {
      cancelled = true
    }
  }, [fromId, showToast])

  // Only stock above its reorder level can be offered
  const surplusItems = useMemo(
    () =>
      stock
        .map((s) => ({
          id: s.id,
          code: s.code,
          name: s.name,
          unit:
            s.unitOfMeasure?.symbol ||
            s.unitOfMeasure?.name ||
            '',
          onHand: Number(s.quantityOnHand) || 0,
          reorderLevel: Number(s.reorderLevel) || 0,
        }))
        .filter(
          (s) => s.id && s.onHand > s.reorderLevel,
        ),
    [stock],
  )

  // Dropdown options
  const surplusOptions = useMemo(
    () =>
      surplusItems.map((s) => ({
        value: s.id,
        label: `${s.code} · ${s.name}`,
      })),
    [surplusItems],
  )

  // Selected material and available surplus
  const position = surplusItems.find(
    (s) => s.id === form.code,
  )

  const surplus = position
    ? position.onHand - position.reorderLevel
    : 0

  const offering = Number(form.qty) || 0
  const overOffered = !!position && offering > surplus

  // Factory dropdown options
  const factoryOptions = useMemo(
    () =>
      (factories || []).map((f) => ({
        value: f.id,
        label: f.name,
      })),
    [factories],
  )

  const recipientOptions = factoryOptions.filter(
    (f) => f.value !== fromId,
  )

  const changeFrom = (e) => {
    setFromId(e.target.value)

    setForm((s) => ({
      ...s,
      code: '',
      qty: '',
      toId: '',
    }))

    setPage(0)
  }

  // Load my offers
  useEffect(() => {
    if (!fromId) {
      setOffers([])
      setPageInfo({
        totalItems: 0,
        totalPages: 1,
      })
      return
    }

    let cancelled = false

    factoryApi
      .listTradeOffers({
        locationId: fromId,
        page,
        size: PAGE_SIZE,
      })
      .then((res) => {
        if (cancelled) return

        const d = res.data

        setOffers(d.items ?? [])
        setPageInfo({
          totalItems: d.totalItems ?? 0,
          totalPages: d.totalPages ?? 1,
        })
      })
      .catch((e) => {
        if (!cancelled) {
          showToast(
            'Could not load offers',
            e.message,
            true,
          )
        }
      })

    return () => {
      cancelled = true
    }
  }, [fromId, page, reloadKey, showToast])

  // Format offers for the table
  const rows = useMemo(
    () =>
      offers.map((t) => ({
        id: t.id,
        material: t.stockItem
          ? `${t.stockItem.code} · ${t.stockItem.name}`
          : '—',
        qty: Number(t.quantity) || 0,
        from: t.fromLocation.name || '—',
        to: t.toLocation.name || '—',
        reason: t.reason ? sentence(t.reason) : '—',
        offered: fmtDate(t.offeredAt),
        expires: fmtDate(t.expiresAt),
        status: t.status || '',
      })),
    [offers],
  )

  const columns = [
    {
      key: 'material',
      label: 'Item',
      width: 260,
    },
    {
      key: 'qty',
      label: 'Qty offered',
      width: 130,
      align: 'right',
      mono: true,
      render: (t) => fmt(t.qty),
    },
    {
      key: 'to',
      label: 'Offered to',
      width: 170,
    },
    {
      key: 'reason',
      label: 'Reason',
      width: 180,
    },
    {
      key: 'offered',
      label: 'Offered on',
      width: 130,
    },
    {
      key: 'expires',
      label: 'Expires',
      width: 130,
    },
    {
      key: 'status',
      label: 'Status',
      width: 130,
      render: (t) => (
        <Badge
          tone={
            STATUS_TONE[t.status.toUpperCase()] ||
            'neutral'
          }
        >
          {sentence(t.status) || '—'}
        </Badge>
      ),
    },
  ]

  // Submit offer
  const submit = async () => {
    if (submitting) return

    if (!fromId) {
      return showToast(
        'Choose the offering factory',
        undefined,
        true,
      )
    }

    if (!form.code) {
      return showToast(
        'Choose a material to offer',
        undefined,
        true,
      )
    }

    if (offering <= 0) {
      return showToast(
        'Enter a quantity to offer',
        undefined,
        true,
      )
    }

    if (overOffered) {
      return showToast(
        'Quantity exceeds surplus',
        `Only ${fmt(surplus)} sits above the re-order level.`,
        true,
      )
    }

    if (!form.toId) {
      return showToast(
        'Choose who to offer to',
        undefined,
        true,
      )
    }

    if (!form.reason) {
      return showToast(
        'Choose a reason for the surplus',
        undefined,
        true,
      )
    }

    if (!form.expires) {
      return showToast(
        'Set an expiry date',
        undefined,
        true,
      )
    }

    const expiresAt = new Date(
      `${form.expires}T23:59:59`,
    )

    if (
      Number.isNaN(expiresAt.getTime()) ||
      expiresAt <= new Date()
    ) {
      return showToast(
        'Expiry must be in the future',
        undefined,
        true,
      )
    }

    setSubmitting(true)

    try {
      await factoryApi.createTradeOffer({
        fromLocationId: fromId,
        toLocationId: form.toId,
        stockItemId: form.code,
        quantity: offering,
        reason: form.reason,
        expiresAt: expiresAt.toISOString(),
      })

      showToast(
        'Offer listed',
        'The receiving factory can now review it.',
      )

      setForm(EMPTY_FORM)
      setPage(0)
      setReloadKey((k) => k + 1)
    } catch (e) {
      showToast(
        'Could not list offer',
        e.message,
        true,
      )
    } finally {
      setSubmitting(false)
    }
  }

  const cancel = useCallback(
    () => setForm(EMPTY_FORM),
    [],
  )

  const fromName = factoryOptions.find(
    (f) => f.value === fromId,
  )?.label

  return (
    <FormShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Offer Trade'}
      icon={leaf?.icon}
      description="Offer excess raw materials to other factories in the organisation, so surplus is redistributed internally rather than purchased externally. Other factories review and accept offers against their own production needs."
      submitLabel={submitting ? 'Listing…' : 'List offer'}
      onSubmit={submit}
      onCancel={cancel}
      note="Listing an offer does not move stock. The material stays in your factory until the receiving factory accepts and the transfer completes."
      aside={
        <>
          <Panel title="Offer summary">
            <MetaRow
              label="Material"
              value={position ? position.name : '—'}
            />

            <MetaRow
              label="On hand"
              value={
                position
                  ? `${fmt(position.onHand)} ${position.unit}`.trim()
                  : '—'
              }
              mono
            />

            <MetaRow
              label="Re-order level"
              value={
                position
                  ? fmt(position.reorderLevel)
                  : '—'
              }
              mono
            />

            <MetaRow
              label="Surplus available"
              value={
                position ? fmt(surplus) : '—'
              }
              mono
              tone={position ? 'positive' : undefined}
            />

            {overOffered && (
              <Callout
                tone="danger"
                icon="circle-alert"
                title="Exceeds surplus"
                style={{ marginTop: 14 }}
              >
                You are offering {fmt(offering)} but
                only {fmt(surplus)} sits above your
                re-order level. Offering more would
                push this material below its threshold.
              </Callout>
            )}
          </Panel>

          <Panel title="How trading works">
            <div
              style={{
                font: 'var(--type-caption)',
                color: 'var(--text-muted)',
                lineHeight: 1.7,
              }}
            >
              Offers are visible to the receiving
              factory under Pending Trade, where they
              are accepted or rejected against
              production needs. Accepted trades move
              stock between factories and appear in
              the Trade Report with both the offer and
              response dates.
            </div>
          </Panel>
        </>
      }
    >
      <Panel
        title="Material to offer"
        description="Only stock held above its re-order level can be offered as surplus."
      >
        <FieldSet columns={3}>
          <Select
            label="Offering factory"
            options={factoryOptions}
            value={fromId}
            onChange={changeFrom}
            placeholder="Select factory…"
          />

          <Select
            label="Raw material"
            options={surplusOptions}
            value={form.code}
            onChange={setField('code')}
            placeholder={
              fromId
                ? 'Select surplus material…'
                : 'Choose a factory first'
            }
          />

          <Input
            label="Quantity to offer"
            type="number"
            placeholder="0"
            value={form.qty}
            onChange={setField('qty')}
            error={
              overOffered
                ? `Only ${fmt(surplus)} available above threshold`
                : undefined
            }
          />

          <Input
            label="Unit"
            value={position?.unit || ''}
            onChange={() => {}}
            disabled
          />

          <Select
            label="Reason for surplus"
            options={tradeReasons}
            value={form.reason}
            onChange={setField('reason')}
            placeholder="Select reason…"
          />

          <Select
            label="Offer to"
            options={recipientOptions}
            value={form.toId}
            onChange={setField('toId')}
            placeholder="Select recipient…"
          />

          <Input
            label="Offer expires"
            type="date"
            value={form.expires}
            onChange={setField('expires')}
          />
        </FieldSet>

        <div
          style={{
            marginTop: 14,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flexWrap: 'wrap',
          }}
        >
          {fromName && (
            <Badge tone="brand">
              Offering from {fromName}
            </Badge>
          )}

          {fromId && (
            <span
              style={{
                font: 'var(--type-caption)',
                color: 'var(--text-muted)',
              }}
            >
              {surplusItems.length} material
              {surplusItems.length === 1 ? '' : 's'}{' '}
              currently sit above their re-order level.
            </span>
          )}
        </div>
      </Panel>

      <Panel
        title="My active offers"
        description="Offers this factory has listed, and how other factories responded."
        padding={0}
      >
        <ReportTable
          columns={columns}
          rows={rows}
          rowKey={(t) => t.id}
          stickyHeader={false}
          style={{
            border: 'none',
            borderRadius: 0,
          }}
          emptyLabel={
            fromId
              ? 'No offers listed yet'
              : 'Choose a factory to see its offers'
          }
          pagination={{
            page,
            pageCount: pageInfo.totalPages,
            pageSize: PAGE_SIZE,
            total: pageInfo.totalItems,
            onPage: setPage,
          }}
        />
      </Panel>
    </FormShell>
  )
}
