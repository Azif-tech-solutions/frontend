// import { useState } from 'react'
// import { Badge } from '../../ds/components/core/Badge.jsx'
// import { Button } from '../../ds/components/core/Button.jsx'
// import { Input } from '../../ds/components/forms/Input.jsx'
// import { Select } from '../../ds/components/forms/Select.jsx'
// import { ReportTable } from '../../ds/components/data/ReportTable.jsx'
// import { FormShell } from '../shells/FormShell.jsx'
// import { Panel, FieldSet, MetaRow, Callout } from '../shells/Page.jsx'
// import { LineItems } from '../shells/LineItems.jsx'
// import { showrooms, outsourcedProducts, outsourcePartners, outsourceReceipts, CURRENT_SHOWROOM } from '../sampleShowroom.js'
// import { fmt, money } from '../utils.js'

// const COSTS = Object.fromEntries(outsourcedProducts.map((p) => [p.value, p.unitCost]))

// const blank = () => ({ id: Math.random().toString(36).slice(2), product: '', qty: '', batch: '', expiry: '' })

// export default function OutsourceStock({ leaf, moduleLabel, parentLabel }) {
//   const [rows, setRows] = useState([blank()])

//   function update(i, key, value) {
//     setRows((rs) => rs.map((r, ri) => (ri === i ? { ...r, [key]: value } : r)))
//   }

//   const decorated = rows.map((r) => {
//     const unitCost = COSTS[r.product]
//     const total = unitCost ? unitCost * (Number(r.qty) || 0) : undefined
//     return {
//       ...r,
//       unit: r.product ? 'Cartons' : undefined,
//       unitCost: unitCost ? money(unitCost) : undefined,
//       lineTotal: total ? money(total) : undefined,
//     }
//   })

//   const columns = [
//     // A select, not free text — only company-registered outsourced products.
//     { key: 'product', label: 'Registered outsourced product', type: 'select', options: outsourcedProducts, width: 300, placeholder: 'Select registered product…' },
//     { key: 'qty', label: 'Quantity', type: 'number', width: 130, placeholder: '0' },
//     { key: 'unit', label: 'Unit', type: 'static', width: 110 },
//     { key: 'batch', label: 'Batch no.', type: 'text', width: 140, placeholder: 'e.g. AQ-2214' },
//     { key: 'expiry', label: 'Expiry date', type: 'date', width: 160 },
//     { key: 'unitCost', label: 'Unit cost', type: 'static', align: 'right', width: 150 },
//     { key: 'lineTotal', label: 'Line total', type: 'static', align: 'right', width: 160 },
//   ]

//   const active = rows.filter((r) => r.product)
//   const value = rows.reduce((n, r) => n + (COSTS[r.product] || 0) * (Number(r.qty) || 0), 0)
//   const missingExpiry = rows.some((r) => r.product && !r.expiry)

//   const historyColumns = [
//     { key: 'date', label: 'Date', width: 130 },
//     { key: 'ref', label: 'Reference', width: 110, mono: true },
//     { key: 'product', label: 'Outsourced product', width: 260 },
//     { key: 'partner', label: 'Outsource partner', width: 210 },
//     { key: 'batch', label: 'Batch', width: 120, mono: true },
//     { key: 'expiry', label: 'Expiry', width: 130 },
//     { key: 'qty', label: 'Quantity', width: 120, align: 'right', mono: true, render: (r) => fmt(r.qty) },
//     { key: 'unitCost', label: 'Unit cost', width: 150, align: 'right', mono: true, render: (r) => money(r.unitCost) },
//     { key: 'receivedBy', label: 'Received by', width: 140 },
//   ]

//   return (
//     <FormShell
//       wide
//       crumbs={[moduleLabel, parentLabel]}
//       title={leaf?.label || 'Outsource Stock'}
//       icon={leaf?.icon}
//       description="Receive outsourced stock — products not manufactured by the company but formally registered by it. Only registered outsourced products can be received here."
//       submitLabel="Receive outsourced stock"
//       onCancel={() => {}}
//       note="Outsourced products are company-registered, so they carry a product code and are selectable across every dependent module."
//       secondaryAction={<Button variant="secondary" iconLeft="save">Save draft</Button>}
//       aside={
//         <>
//           <Panel title="Receipt summary">
//             <MetaRow label="Product lines" value={active.length || '—'} mono />
//             <MetaRow label="Total value" value={value ? money(value) : '—'} mono />
//             <MetaRow label="Receiving into" value={CURRENT_SHOWROOM} />
//             {missingExpiry && (
//               <Callout tone="warning" icon="calendar-off" style={{ marginTop: 14 }}>
//                 One or more lines are missing an expiry date. Shelf-life alerts will not fire for those products.
//               </Callout>
//             )}
//           </Panel>

//           <Panel title="Outsource vs finished product">
//             <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', lineHeight: 1.7 }}>
//               <strong style={{ color: 'var(--text-strong)' }}>Outsource</strong> means a product the company sells
//               but does not manufacture. <strong style={{ color: 'var(--text-strong)' }}>Finished product</strong> means
//               one produced internally. Both are registered; only their origin differs.
//             </div>
//             <div style={{ marginTop: 12 }}>
//               <Callout tone="info" icon="circle-alert">
//                 For third-party goods the company has <strong>not</strong> registered, use Stock Entry (Direct) instead.
//               </Callout>
//             </div>
//           </Panel>
//         </>
//       }
//     >
//       <Panel title="Partner & delivery" description="Which outsource partner supplied the goods and against which document.">
//         <FieldSet columns={3}>
//           <Select label="Receiving showroom" options={showrooms} value="sr-ikeja" onChange={() => {}} />
//           <Select label="Outsource partner" options={outsourcePartners} placeholder="Select partner…" />
//           <Input label="Date received" type="date" />
//           <Input label="Partner invoice / waybill" placeholder="e.g. AQ-2214" />
//           <Input label="Checked by" placeholder="Showroom staff" />
//           <Input label="Reference no." placeholder="Auto-generated" disabled value="OS-1145" />
//         </FieldSet>
//         <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
//           <Badge tone="brand">Company-registered products only</Badge>
//           <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
//             {outsourcedProducts.length} outsourced products are currently registered.
//           </span>
//         </div>
//       </Panel>

//       <Panel
//         title="Outsourced products received"
//         description="Select each product from the registered outsourced catalogue. Unregistered goods cannot be received here."
//         actions={<Button variant="secondary" size="sm" iconLeft="qr-code">Scan</Button>}
//       >
//         <LineItems
//           columns={columns}
//           rows={decorated}
//           onChange={update}
//           onAdd={() => setRows((rs) => [...rs, blank()])}
//           onRemove={(i) => setRows((rs) => (rs.length === 1 ? rs : rs.filter((_, ri) => ri !== i)))}
//           addLabel="Add product"
//           emptyLabel="No products added yet."
//           summary={[
//             { label: 'Lines', value: active.length },
//             { label: 'Value', value: money(value) },
//           ]}
//         />
//       </Panel>

//       <Panel title="Recent outsource receipts" padding={0}>
//         <ReportTable
//           columns={historyColumns}
//           rows={outsourceReceipts}
//           rowKey={(r) => r.ref}
//           stickyHeader={false}
//           style={{ border: 'none', borderRadius: 0 }}
//         />
//       </Panel>
//     </FormShell>
//   )
// }
import { useEffect, useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import Loader from '../../ds/components/core/Loader.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import { ReportTable } from '../../ds/components/data/ReportTable.jsx'
import { FormShell } from '../shells/FormShell.jsx'
import { Panel, FieldSet, MetaRow, Callout } from '../shells/Page.jsx'
import { LineItems } from '../shells/LineItems.jsx'
import { outsourcePartners } from '../sampleShowroom.js'
import { fmt, money } from '../utils.js'
import { useStore } from '../store.jsx'
import ShowroomApi from '../../api/ShowroomApi.js'
import InventoryApi from '../../api/InventoryApi.js'
import TenantApi from '../../api/TenantApi.js'
import FactoryApi from '../../api/FactoryApi.js'

const showroomApi = new ShowroomApi()
const inventoryApi = new InventoryApi()
const tenantApi = new TenantApi()
const factoryApi=new FactoryApi()

const PAGE_SIZE = 50
const RECENT_PAGE_SIZE = 10

const rid = () => Math.random().toString(36).slice(2)
const blank = () => ({ id: rid(), product: '', qty: '', batch: '', expiry: '' })

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

// Options may arrive as { value, label } objects or as plain strings.
const toOption = (o) => (typeof o === 'string' ? { value: o, label: sentence(o) } : o)

/**
 * Turns the endpoint's field list into filter controls.
 *   ENUM -> select, MONEY / numeric -> min / max pair, DATE -> from / to pair
 *   (the primary date uses plain from / to, with the period presets before it),
 *   text-like -> text box.
 * Fields that need a lookup (UUID pickers) are skipped.
 */
function buildFilterDefs(meta) {
  if (!meta) return []
  const out = []
  for (const f of meta.fields || []) {
    if (f.lookup) continue
    if (f.type === 'ENUM') {
      out.push({ key: f.key, label: f.label, kind: 'select', options: (f.options || []).map(toOption) })
    } else if (['MONEY', 'NUMBER', 'DECIMAL', 'INTEGER'].includes(f.type)) {
      out.push(
        { key: `${f.key}Min`, label: `${f.label} from`, kind: 'number' },
        { key: `${f.key}Max`, label: `${f.label} to`, kind: 'number' },
      )
    } else if (f.type === 'DATE') {
      const primary = f.key === meta.primaryDate
      if (primary && meta.periodPresets?.length) {
        out.push({
          key: 'period', label: 'Period', kind: 'select',
          options: meta.periodPresets.map((p) => ({ value: p, label: sentence(p) })),
        })
      }
      out.push(
        { key: primary ? 'from' : `${f.key}From`, label: `${f.label} from`, kind: 'date' },
        { key: primary ? 'to' : `${f.key}To`, label: `${f.label} to`, kind: 'date' },
      )
    } else if (['STRING', 'TEXT'].includes(f.type)) {
      out.push({ key: f.key, label: f.label, kind: 'text' })
    }
  }
  return out
}

const cleanFilters = (values = {}) =>
  Object.fromEntries(Object.entries(values).filter(([, v]) => v !== '' && v != null))

export default function OutsourceStock({ leaf, moduleLabel, parentLabel }) {
  const { showToast } = useStore()

  /* ---------------- receive form ---------------- */
  const [rows, setRows] = useState([blank()])
  const [showroomId, setShowroomId] = useState('')
  const [manufacturerId,setManufacturerId]=useState("")
  const [areaId, setAreaId] = useState('')
  const [partnerId, setPartnerId] = useState('')
  const [receivedDate, setReceivedDate] = useState('')
  const [partnerRef, setPartnerRef] = useState('')
  const [checkedById, setCheckedById] = useState('')
  const [submitting, setSubmitting] = useState(false)


  // lookups
  const [showrooms, setShowrooms] = useState([]) // [{ id, code, label, areas }]
  const [manufacturers,setManufacturers]=useState([])
  const [members, setMembers] = useState([])
  const [outsourcedItems, setOutsourcedItems] = useState([])
  const [loadingSetup, setLoadingSetup] = useState(false)
  const [loadingItems, setLoadingItems] = useState(false)

  /* ---------------- recent receipts ---------------- */
  const [filterDefs, setFilterDefs] = useState([])
  const [filterValues, setFilterValues] = useState({})
  const [applied, setApplied] = useState({})
  const [page, setPage] = useState(0)
  const [receipts, setReceipts] = useState([])
  const [pageInfo, setPageInfo] = useState({ totalItems: 0, totalPages: 1 })
  const [loadingReceipts, setLoadingReceipts] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  // One-time lookups: showrooms (with their areas) and members.
  useEffect(() => {
    let cancelled = false
    setLoadingSetup(true)
    Promise.all([
      showroomApi.lookupPickerWithAreas({}),
      tenantApi.getTenantMemberList({ page: 0, size: 200 }),
      factoryApi.listManufacturers()
    ])
      .then(([sr, mem,manu]) => {
        if (cancelled) return
        const list = sr.data || []
        setShowrooms(list)

        if (list.length === 1) setShowroomId(list[0].id)
        setMembers(mem.data?.items ?? [])

        setManufacturers(manu.data)
      })
      .catch((e) => !cancelled && showToast('Could not load setup data', e.message, true))
      .finally(() => !cancelled && setLoadingSetup(false))
    return () => { cancelled = true }
  }, [showToast])

  // Picking a showroom selects its default receiving area.
  useEffect(() => {
    setAreaId('')
    if (!showroomId) return
    let cancelled = false
    const firstArea = () => showrooms.find((s) => s.id === showroomId)?.areas?.[0]?.id || ''
    showroomApi
      .retrieveShowroom(showroomId)
      .then((res) => {
        if (cancelled) return
        setAreaId(res.data?.defaultReceivingLocation?.id || firstArea())
      })
      .catch(() => { if (!cancelled) setAreaId(firstArea()) })
    return () => { cancelled = true }
  }, [showroomId, showrooms])

  // The registered outsourced products held at the chosen showroom.
  useEffect(() => {
    if (!showroomId) {
      setOutsourcedItems([])
      return
    }
    let cancelled = false
    setLoadingItems(true)

    const loadAll = async () => {
      let p = 0
      let all = []
      let hasMore = true
      while (hasMore && !cancelled) {
        const { data } = await inventoryApi.listStockItems(showroomId, 'OUTSOURCED', { page: p, size: PAGE_SIZE })
        const pageItems = data?.items ?? []
        all = [...all, ...pageItems]
        hasMore = data?.totalPages != null ? p + 1 < data.totalPages : pageItems.length === PAGE_SIZE
        p += 1
      }
      return all
    }

    loadAll()
      .then((all) => { if (!cancelled) setOutsourcedItems(all) })
      .catch((e) => !cancelled && showToast('Could not load outsourced products', e.message, true))
      .finally(() => !cancelled && setLoadingItems(false))
    return () => { cancelled = true }
  }, [showroomId, showToast])

  // Filters for the recent-receipts table come from the backend.
  useEffect(() => {
    let cancelled = false
    showroomApi
      .getOutsourceReceiptFilters()
      .then((res) => { if (!cancelled) setFilterDefs(buildFilterDefs(res.data)) })
      .catch((e) => !cancelled && showToast('Could not load filters', e.message, true))
    return () => { cancelled = true }
  }, [showToast])

  // One page of recent receipts.
  useEffect(() => {
    let cancelled = false
    setLoadingReceipts(true)
    showroomApi
      .listOutsourceReceipts({ ...applied, page, size: RECENT_PAGE_SIZE })
      .then((res) => {
        if (cancelled) return
        const d = res.data
        setReceipts(d.items ?? [])
        setPageInfo({ totalItems: d.totalItems ?? 0, totalPages: d.totalPages ?? 1 })
      })
      .catch((e) => !cancelled && showToast('Could not load recent receipts', e.message, true))
      .finally(() => !cancelled && setLoadingReceipts(false))
    return () => { cancelled = true }
  }, [applied, page, refreshKey, showToast])

  /* ---------------- derived ---------------- */
  const showroom = showrooms.find((s) => s.id === showroomId)
  const showroomOptions = showrooms.map((s) => ({ value: s.id, label: s.label }))
  const areaOptions = (() => {
    const opts = (showroom?.areas || []).map((a) => ({ value: a.id, label: a.kind ? `${a.name} (${sentence(a.kind)})` : a.name }))
    if (areaId && !opts.some((o) => o.value === areaId)) opts.push({ value: areaId, label: 'Default receiving area' })
    return opts
  })()
  const memberOptions = members.map((m) => ({ value: m.userId, label: m.displayName }))
  const checker = members.find((m) => m.userId === checkedById)
  const manufacturerOptions=manufacturers.map((m) => ({ value: m.id, label: m.name }))

  const itemById = Object.fromEntries(outsourcedItems.map((p) => [p.id, p]))
  const productOptions = outsourcedItems.map((p) => ({ value: p.id, label: `${p.name} (${p.code})` }))

  // A new showroom has its own product list, so lines picked earlier are cleared.
  const changeShowroom = (id) => {
    setShowroomId(id)
    setRows((rs) => rs.map((r) => ({ ...r, product: '' })))
  }

  function update(i, key, value) {
    setRows((rs) => rs.map((r, ri) => (ri === i ? { ...r, [key]: value } : r)))
  }

  const decorated = rows.map((r) => {
    const it = itemById[r.product]
    const unitCost = it ? Number(it.landingCost) || 0 : undefined
    const total = unitCost ? unitCost * (Number(r.qty) || 0) : undefined
    return {
      ...r,
      unit: it ? (it.unitOfMeasure?.symbol || it.unitOfMeasure?.name || '—') : undefined,
      unitCost: unitCost ? money(unitCost) : undefined,
      lineTotal: total ? money(total) : undefined,
    }
  })

  const columns = [
    // A select, not free text — only company-registered outsourced products.
    { key: 'product', label: 'Registered outsourced product', type: 'select', options: productOptions, width: 300, placeholder: showroomId ? 'Select registered product…' : 'Select showroom first' },
    { key: 'qty', label: 'Quantity', type: 'number', width: 130, placeholder: '0' },
    { key: 'unit', label: 'Unit', type: 'static', width: 110 },
    { key: 'batch', label: 'Batch no.', type: 'text', width: 140, placeholder: 'e.g. AQ-2214' },
    { key: 'expiry', label: 'Expiry date', type: 'date', width: 160 },
    { key: 'unitCost', label: 'Unit cost', type: 'static', align: 'right', width: 150 },
    { key: 'lineTotal', label: 'Line total', type: 'static', align: 'right', width: 160 },
  ]

  const active = rows.filter((r) => r.product)
  const value = rows.reduce((n, r) => n + (Number(itemById[r.product]?.landingCost) || 0) * (Number(r.qty) || 0), 0)
  const missingExpiry = rows.some((r) => r.product && !r.expiry)

  function reset() {
    setRows([blank()])
    setPartnerId(''); setReceivedDate(''); setPartnerRef(''); setCheckedById('')
  }

  async function submit() {
    if (!showroomId) return showToast('Select the receiving showroom', '', true)
    if (!partnerId) return showToast('Select the outsource partner', '', true)
    if (!receivedDate) return showToast('Enter the date received', '', true)
    if (!checker) return showToast('Select who checked the goods', '', true)

    const started = rows.filter((r) => r.product || r.qty)
    if (!started.length) return showToast('Add at least one product', '', true)
    if (started.some((r) => !r.product || !(Number(r.qty) > 0))) {
      return showToast('Each line needs a product and a quantity', '', true)
    }

    const lines = started.map((r) => ({
      stockItemId: r.product,
      quantity: Number(r.qty),
      inputVatRate: Number(itemById[r.product]?.vatCategory?.rate) || 0,
      batchNo: r.batch.trim(),
      expiryDate: r.expiry || null,
    }))

    setSubmitting(true)
    try {
      const res = await showroomApi.receiveOutsourceStock({
        locationId: showroomId,
        intoLocationId: areaId || showroomId,
        // manufacturerId: partnerId,
        // partnerReference: partnerRef.trim(),
        manufacturerId:manufacturerId,
        partnerReference:null,
        checkedBy: checker.displayName,
        receivedDate,
        lines,
      })
      const created = res.data
      const warnings = created.warnings?.length ? created.warnings.join(' · ') : ''
      showToast(
        `Outsourced stock received — ${created.ref}`,
        warnings || `${lines.length} line${lines.length === 1 ? '' : 's'} · ${showroom?.label || ''}`,
      )
      reset()
      setPage(0)
      setRefreshKey((k) => k + 1)
    } catch (e) {
      showToast('Could not receive stock', e.message, true)
    } finally {
      setSubmitting(false)
    }
  }

  /* ---------------- recent receipts table ---------------- */
  const historyColumns = [
    { key: 'date', label: 'Date', width: 130 },
    { key: 'ref', label: 'Reference', width: 110, mono: true },
    { key: 'product', label: 'Outsourced product', width: 260 },
    { key: 'partner', label: 'Outsource partner', width: 210 },
    { key: 'batch', label: 'Batch', width: 120, mono: true },
    { key: 'expiry', label: 'Expiry', width: 130 },
    { key: 'qty', label: 'Quantity', width: 120, align: 'right', mono: true, render: (r) => fmt(r.qty) },
    { key: 'unitCost', label: 'Unit cost', width: 150, align: 'right', mono: true, render: (r) => money(r.unitCost) },
    { key: 'receivedBy', label: 'Received by', width: 140 },
  ]

  const historyRows = receipts.map((e) => ({
    key: e.lineId || `${e.entryId}-${e.ref}`,
    date: fmtDate(e.date),
    ref: e.ref,
    product: e.product,
    partner: e.party || '—',
    batch: e.batchNo || '—',
    expiry: fmtDate(e.expiryDate),
    qty: e.quantity,
    unitCost: e.unitCost,
    receivedBy: e.enteredBy?.name || '—',
  }))

  const setFilter = (key, v) => setFilterValues((fv) => ({ ...fv, [key]: v }))
  const applyFilters = () => { setApplied(cleanFilters(filterValues)); setPage(0) }
  const clearFilters = () => { setFilterValues({}); setApplied({}); setPage(0) }

  return (
    <FormShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Outsource Stock'}
      icon={leaf?.icon}
      description="Receive outsourced stock — products not manufactured by the company but formally registered by it. Only registered outsourced products can be received here."
      submitLabel="Receive outsourced stock"
      loading={submitting}
      onSubmit={submit}
      onCancel={reset}
      note="Outsourced products are company-registered, so they carry a product code and are selectable across every dependent module."
      secondaryAction={<Button variant="secondary" iconLeft="save">Save draft</Button>}
      aside={
        <>
          <Panel title="Receipt summary">
            <MetaRow label="Product lines" value={active.length || '—'} mono />
            <MetaRow label="Total value" value={value ? money(value) : '—'} mono />
            <MetaRow label="Receiving into" value={showroom?.label || '—'} />
            {missingExpiry && (
              <Callout tone="warning" icon="calendar-off" style={{ marginTop: 14 }}>
                One or more lines are missing an expiry date. Shelf-life alerts will not fire for those products.
              </Callout>
            )}
          </Panel>

          <Panel title="Outsource vs finished product">
            <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', lineHeight: 1.7 }}>
              <strong style={{ color: 'var(--text-strong)' }}>Outsource</strong> means a product the company sells
              but does not manufacture. <strong style={{ color: 'var(--text-strong)' }}>Finished product</strong> means
              one produced internally. Both are registered; only their origin differs.
            </div>
            <div style={{ marginTop: 12 }}>
              <Callout tone="info" icon="circle-alert">
                For third-party goods the company has <strong>not</strong> registered, use Stock Entry (Direct) instead.
              </Callout>
            </div>
          </Panel>
        </>
      }
    >
      {(loadingSetup || submitting) && (
        <Loader overlay label={submitting ? 'Receiving stock…' : 'Loading…'} />
      )}

      <Panel title="Partner & delivery" description="Which outsource partner supplied the goods and against which document.">
        <FieldSet columns={3}>
          <Select label="Receiving showroom" options={showroomOptions} value={showroomId} onChange={(e) => changeShowroom(e.target.value)} placeholder="Select showroom…" />
          <Select label="Receiving area" options={areaOptions} value={areaId} onChange={(e) => setAreaId(e.target.value)} placeholder={showroomId ? 'Select area…' : 'Pick a showroom first'} />
          <Select label="Outsource partner" options={outsourcePartners} value={partnerId} onChange={(e) => setPartnerId(e.target.value)} placeholder="Select partner…" />
          <Input label="Date received" type="date" value={receivedDate} onChange={(e) => setReceivedDate(e.target.value)} />
          <Select label="Manufacturers " options={manufacturerOptions} value={manufacturerId} onChange={(e) => setManufacturerId(e.target.value)} placeholder="Select manufacturer..." />

          <Input label="Partner invoice / waybill" placeholder="e.g. AQ-2214" value={partnerRef} onChange={(e) => setPartnerRef(e.target.value)} />
          <Select label="Checked by" options={memberOptions} value={checkedById} onChange={(e) => setCheckedById(e.target.value)} placeholder="Select member…" />
          <Input label="Reference no." placeholder="Assigned on save" disabled value="" />
        </FieldSet>
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <Badge tone="brand">Company-registered products only</Badge>
          <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
            {showroomId
              ? loadingItems
                ? 'Loading outsourced products…'
                : `${outsourcedItems.length} outsourced product${outsourcedItems.length === 1 ? ' is' : 's are'} registered at this showroom.`
              : 'Select a showroom to see its registered outsourced products.'}
          </span>
        </div>
      </Panel>

      <Panel
        title="Outsourced products received"
        description="Select each product from the registered outsourced catalogue. Unregistered goods cannot be received here."
        actions={<Button variant="secondary" size="sm" iconLeft="qr-code">Scan</Button>}
      >
        {loadingItems && <Loader label="Loading products…" size={28} />}
        <LineItems
          columns={columns}
          rows={decorated}
          onChange={update}
          onAdd={() => setRows((rs) => [...rs, blank()])}
          onRemove={(i) => setRows((rs) => (rs.length === 1 ? rs : rs.filter((_, ri) => ri !== i)))}
          addLabel="Add product"
          emptyLabel="No products added yet."
          summary={[
            { label: 'Lines', value: active.length },
            { label: 'Value', value: money(value) },
          ]}
        />
      </Panel>

      <Panel title="Recent outsource receipts" padding={0}>
        {filterDefs.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-end', padding: 16, borderBottom: '1px solid var(--border-subtle)' }}>
            {filterDefs.map((f) =>
              f.kind === 'select' ? (
                <div key={f.key} style={{ width: 180 }}>
                  <Select
                    label={f.label}
                    options={[{ value: '', label: 'All' }, ...f.options]}
                    value={filterValues[f.key] ?? ''}
                    onChange={(e) => setFilter(f.key, e.target.value)}
                    placeholder="All"
                  />
                </div>
              ) : (
                <div key={f.key} style={{ width: 180 }}>
                  <Input
                    label={f.label}
                    type={f.kind}
                    value={filterValues[f.key] ?? ''}
                    onChange={(e) => setFilter(f.key, e.target.value)}
                  />
                </div>
              ),
            )}
            <Button iconLeft="search" onClick={applyFilters}>Apply</Button>
            <Button variant="ghost" onClick={clearFilters}>Clear</Button>
          </div>
        )}

        {loadingReceipts && <Loader label="Loading recent receipts…" />}

        <ReportTable
          columns={historyColumns}
          rows={historyRows}
          rowKey={(r) => r.key}
          stickyHeader={false}
          style={{ border: 'none', borderRadius: 0 }}
        />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderTop: '1px solid var(--border-subtle)' }}>
          <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
            {pageInfo.totalItems} receipt line{pageInfo.totalItems === 1 ? '' : 's'} · Page {page + 1} of {Math.max(pageInfo.totalPages, 1)}
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="secondary" size="sm" disabled={page === 0 || loadingReceipts} onClick={() => setPage((p) => Math.max(0, p - 1))}>Previous</Button>
            <Button variant="secondary" size="sm" disabled={page + 1 >= pageInfo.totalPages || loadingReceipts} onClick={() => setPage((p) => p + 1)}>Next</Button>
          </div>
        </div>
      </Panel>
    </FormShell>
  )
}