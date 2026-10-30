// import { useState } from 'react'
// import { Button } from '../../ds/components/core/Button.jsx'
// import { Input } from '../../ds/components/forms/Input.jsx'
// import { Select } from '../../ds/components/forms/Select.jsx'
// import { ReportTable } from '../../ds/components/data/ReportTable.jsx'
// import { FormShell } from '../shells/FormShell.jsx'
// import { Panel, FieldSet, MetaRow, Callout } from '../shells/Page.jsx'
// import { LineItems } from '../shells/LineItems.jsx'
// import { showrooms, externalSuppliers, directEntries, CURRENT_SHOWROOM } from '../sampleShowroom.js'
// import { fmt, money } from '../utils.js'

// const blank = () => ({ id: Math.random().toString(36).slice(2), product: '', qty: '', unit: '', unitCost: '', price: '' })

// export default function StockEntryDirect({ leaf, moduleLabel, parentLabel }) {
//   const [rows, setRows] = useState([blank()])

//   function update(i, key, value) {
//     setRows((rs) => rs.map((r, ri) => (ri === i ? { ...r, [key]: value } : r)))
//   }

//   const decorated = rows.map((r) => {
//     const total = (Number(r.qty) || 0) * (Number(r.unitCost) || 0)
//     return { ...r, lineTotal: total ? money(total) : undefined }
//   })

//   const columns = [
//     // Free text, not a select — these products are not in the company catalogue.
//     { key: 'product', label: 'Product description', type: 'text', width: 280, placeholder: 'e.g. Chivita 100% Orange 1L' },
//     { key: 'qty', label: 'Quantity', type: 'number', width: 130, placeholder: '0' },
//     { key: 'unit', label: 'Unit', type: 'select', options: [{ value: 'ctn', label: 'Cartons' }, { value: 'pcs', label: 'Pieces' }, { value: 'pack', label: 'Packs' }], width: 130, placeholder: 'Unit…' },
//     { key: 'unitCost', label: 'Unit cost (₦)', type: 'number', width: 150, placeholder: '0.00' },
//     { key: 'price', label: 'Selling price (₦)', type: 'number', width: 160, placeholder: '0.00' },
//     { key: 'lineTotal', label: 'Line total', type: 'static', align: 'right', width: 160 },
//   ]

//   const active = rows.filter((r) => r.product)
//   const value = rows.reduce((n, r) => n + (Number(r.qty) || 0) * (Number(r.unitCost) || 0), 0)

//   const historyColumns = [
//     { key: 'date', label: 'Date', width: 130 },
//     { key: 'ref', label: 'Reference', width: 110, mono: true },
//     { key: 'product', label: 'Product', width: 250 },
//     { key: 'supplier', label: 'External supplier', width: 200 },
//     { key: 'invoice', label: 'Supplier invoice', width: 150, mono: true },
//     { key: 'qty', label: 'Quantity', width: 120, align: 'right', mono: true, render: (r) => fmt(r.qty) },
//     { key: 'unit', label: 'Unit', width: 110 },
//     { key: 'unitCost', label: 'Unit cost', width: 150, align: 'right', mono: true, render: (r) => money(r.unitCost) },
//     { key: 'enteredBy', label: 'Entered by', width: 140 },
//   ]

//   return (
//     <FormShell
//       wide
//       crumbs={[moduleLabel, parentLabel]}
//       title={leaf?.label || 'Stock Entry (Direct)'}
//       icon={leaf?.icon}
//       description="Record products supplied directly by external bodies or third-party companies, entering them into showroom stock without passing through factory production or internal transfer."
//       submitLabel="Enter into stock"
//       onCancel={() => {}}
//       note="Directly entered products are held against this showroom only and are not added to the company product register."
//       secondaryAction={<Button variant="secondary" iconLeft="save">Save draft</Button>}
//       aside={
//         <>
//           <Panel title="Entry summary">
//             <MetaRow label="Product lines" value={active.length || '—'} mono />
//             <MetaRow label="Total value" value={value ? money(value) : '—'} mono />
//             <MetaRow label="Entering into" value={CURRENT_SHOWROOM} />
//           </Panel>

//           <Callout tone="info" icon="circle-alert" title="Unregistered products">
//             Products entered here are <strong>not</strong> company-registered. Use Outsource Stock instead when
//             receiving an outsourced product the company has formally registered.
//           </Callout>
//         </>
//       }
//     >
//       <Panel title="Supplier & document" description="Who supplied the goods and against which document.">
//         <FieldSet columns={3}>
//           <Select label="Receiving showroom" options={showrooms} value="sr-ikeja" onChange={() => {}} />
//           <Select label="External supplier" options={externalSuppliers} placeholder="Select supplier…" />
//           <Input label="Date received" type="date" />
//           <Input label="Supplier invoice no." placeholder="e.g. CHI-88214" />
//           <Input label="Payment terms" placeholder="e.g. 30 days credit" />
//           <Input label="Reference no." placeholder="Auto-generated" disabled value="DE-0334" />
//         </FieldSet>
//       </Panel>

//       <Panel
//         title="Products received"
//         description="Type each product description directly — these items are not in the company catalogue and have no product code."
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

//       <Panel title="Recent direct entries" padding={0}>
//         <ReportTable
//           columns={historyColumns}
//           rows={directEntries}
//           rowKey={(r) => r.ref}
//           stickyHeader={false}
//           style={{ border: 'none', borderRadius: 0 }}
//         />
//       </Panel>
//     </FormShell>
//   )
// }


// import { useEffect, useState } from 'react'
// import { Button } from '../../ds/components/core/Button.jsx'
// import { Input } from '../../ds/components/forms/Input.jsx'
// import { Select } from '../../ds/components/forms/Select.jsx'
// import { ReportTable } from '../../ds/components/data/ReportTable.jsx'
// import Loader from '../../ds/components/core/Loader.jsx'
// import { FormShell } from '../shells/FormShell.jsx'
// import { Panel, FieldSet, MetaRow, Callout } from '../shells/Page.jsx'
// import { LineItems } from '../shells/LineItems.jsx'
// import { useStore } from '../store.jsx'
// import { fmt, money } from '../utils.js'
// import ShowroomApi from '../../api/ShowroomApi.js'
// import FactoryApi from '../../api/FactoryApi.js'
// import InventoryApi from '../../api/InventoryApi.js'
// // Default export of the file you shared is `AccountApi`.
// import AccountApi from '../../api/AccountApi.js'

// const showroomApi  = new ShowroomApi()
// const factoryApi   = new FactoryApi()
// const inventoryApi = new InventoryApi()
// const accountApi   = new AccountApi()

// const blank = () => ({
//   id: Math.random().toString(36).slice(2),
//   product: '',
//   code: '',
//   categoryId: '',
//   vatCategoryId: '',
//   hsnSectionId: '',
//   isicSectionId: '',
//   qty: '',
//   unitId: '',
//   unitCost: '',
//   price: '',
// })

// export default function StockEntryDirect({ leaf, moduleLabel, parentLabel }) {
//   const { showToast } = useStore()

//   // header
//   const [locationId, setLocationId] = useState('')
//   const [supplierId, setSupplierId] = useState('')
//   const [dateReceived, setDateReceived] = useState('')
//   const [invoiceNo, setInvoiceNo] = useState('')
//   const [paymentTerms, setPaymentTerms] = useState('')
//   const [note, setNote] = useState('')

//   // lines
//   const [rows, setRows] = useState([blank()])

//   // lookups
//   const [showrooms, setShowrooms] = useState([])
//   const [suppliers, setSuppliers] = useState([])
//   const [units, setUnits] = useState([])
//   const [categories, setCategories] = useState([])
//   const [vatCategories, setVatCategories] = useState([])
//   const [hsnSections, setHsnSections] = useState([])
//   const [isicSections, setIsicSections] = useState([])
//   const [loadingLookups, setLoadingLookups] = useState(true)

//   // history
//   const [history, setHistory] = useState([])
//   const [loadingHistory, setLoadingHistory] = useState(false)

//   const [saving, setSaving] = useState(false)

//   // ---------- load lookups ----------
//   useEffect(() => {
//     let cancelled = false
//     setLoadingLookups(true)

//     Promise.all([
//       showroomApi.lookupPickerWithAreas({ status: ['ACTIVE'] }),
//       factoryApi.listSuppliers(),
//       factoryApi.listUnits(),
//       factoryApi.listCategories(),
//       accountApi.getVatCategories(),
//       accountApi.getHsnSections(),
//       accountApi.getIsicSections(),
//     ])
//       .then(([srRes, supRes, unitRes, catRes, vatArr, hsnArr, isicArr]) => {
//         if (cancelled) return

//         setShowrooms(
//           (srRes.data || []).map((s) => ({
//             value: s.id,
//             label: s.label || s.name || s.code,
//           }))
//         )

//         setSuppliers(
//           (supRes.data || []).map((s) => ({
//             value: s.id || s.supplierCode,
//             label: s.companyName || s.name || s.supplierCode,
//           }))
//         )

//         setUnits(
//           (unitRes.data || []).map((u) => ({
//             value: u.id || u.unitCode,
//             label: u.unitName || u.name || u.symbol || u.unitCode,
//           }))
//         )

//         setCategories(
//           (catRes?.data || []).map((c) => ({ value: c.id, label: c.name }))
//         )

//         // Already { value, label, ... } via AccountApi.convertVat()
//         setVatCategories(vatArr || [])
//         setHsnSections(hsnArr || [])
//         setIsicSections(isicArr || [])
//       })
//       .catch((e) => {
//         if (!cancelled) showToast('Could not load lookups', e.message, true)
//       })
//       .finally(() => {
//         if (!cancelled) setLoadingLookups(false)
//       })

//     return () => {
//       cancelled = true
//     }
//   }, [showToast])

//   // ---------- load recent outsourced items when location changes ----------
//   useEffect(() => {
//     if (!locationId) {
//       setHistory([])
//       return
//     }

//     let cancelled = false
//     setLoadingHistory(true)

//     inventoryApi
//       .listStockItems(locationId, 'OUTSOURCED', { page: 0, size: 30 })
//       .then((res) => {
//         if (cancelled) return
//         const items = res.data?.items || res.data?.content || []
//         setHistory(
//           items.map((item) => ({
//             id: item.id,
//             date: item.createdAt
//               ? new Date(item.createdAt).toLocaleDateString('en-GB', {
//                   day: '2-digit',
//                   month: 'short',
//                   year: 'numeric',
//                 })
//               : '—',
//             ref: item.code,
//             product: item.name,
//             qty: item.quantityOnHand ?? 0,
//             unit: item.unitOfMeasure?.symbol || item.unitOfMeasure?.name || '—',
//             unitCost: item.landingCost ?? 0,
//           }))
//         )
//       })
//       .catch(() => {
//         if (!cancelled) setHistory([])
//       })
//       .finally(() => {
//         if (!cancelled) setLoadingHistory(false)
//       })

//     return () => {
//       cancelled = true
//     }
//   }, [locationId])

//   function update(i, key, value) {
//     setRows((rs) => rs.map((r, ri) => (ri === i ? { ...r, [key]: value } : r)))
//   }

//   const decorated = rows.map((r) => {
//     const total = (Number(r.qty) || 0) * (Number(r.unitCost) || 0)
//     return { ...r, lineTotal: total ? money(total) : undefined }
//   })

//   const columns = [
//     {
//       key: 'product',
//       label: 'Product description',
//       type: 'text',
//       width: 200,
//       placeholder: 'e.g. Chivita 100% Orange 1L',
//     },
//     {
//       key: 'code',
//       label: 'Product code',
//       type: 'text',
//       width: 140,
//       placeholder: 'e.g. ZFF-CHV-01',
//     },
//     {
//       key: 'categoryId',
//       label: 'Category',
//       type: 'select',
//       options: categories,
//       width: 150,
//       placeholder: 'Category…',
//     },
//     {
//       key: 'vatCategoryId',
//       label: 'VAT',
//       type: 'select',
//       options: vatCategories,
//       width: 140,
//       placeholder: 'VAT…',
//     },
//     {
//       key: 'hsnSectionId',
//       label: 'HSN',
//       type: 'select',
//       options: hsnSections,
//       width: 150,
//       placeholder: 'HSN…',
//     },
//     {
//       key: 'isicSectionId',
//       label: 'ISIC',
//       type: 'select',
//       options: isicSections,
//       width: 150,
//       placeholder: 'ISIC…',
//     },
//     {
//       key: 'qty',
//       label: 'Qty',
//       type: 'number',
//       width: 100,
//       placeholder: '0',
//     },
//     {
//       key: 'unitId',
//       label: 'Unit',
//       type: 'select',
//       options: units,
//       width: 110,
//       placeholder: 'Unit…',
//     },
//     {
//       key: 'unitCost',
//       label: 'Unit cost (₦)',
//       type: 'number',
//       width: 130,
//       placeholder: '0.00',
//     },
//     {
//       key: 'price',
//       label: 'Selling price (₦)',
//       type: 'number',
//       width: 140,
//       placeholder: '0.00',
//     },
//     {
//       key: 'lineTotal',
//       label: 'Line total',
//       type: 'static',
//       align: 'right',
//       width: 130,
//     },
//   ]

//   const active = rows.filter((r) => r.product.trim())
//   const value = rows.reduce(
//     (n, r) => n + (Number(r.qty) || 0) * (Number(r.unitCost) || 0),
//     0
//   )

//   const selectedShowroomLabel =
//     showrooms.find((s) => s.value === locationId)?.label || '—'

//   // ---------- submit ----------
//   async function handleSubmit() {
//     if (!locationId) {
//       return showToast('Select a receiving showroom', '', true)
//     }
//     if (!active.length) {
//       return showToast('Add at least one product', '', true)
//     }

//     for (const r of active) {
//       if (!r.code.trim()) {
//         return showToast(`Enter a product code for “${r.product}”`, '', true)
//       }
//       if (!r.categoryId) {
//         return showToast(`Select a category for “${r.product}”`, '', true)
//       }
//       if (!r.vatCategoryId) {
//         return showToast(`Select a VAT category for “${r.product}”`, '', true)
//       }
//       if (!r.hsnSectionId) {
//         return showToast(`Select an HSN section for “${r.product}”`, '', true)
//       }
//       if (!r.isicSectionId) {
//         return showToast(`Select an ISIC section for “${r.product}”`, '', true)
//       }
//       if (!r.unitId) {
//         return showToast(`Select a unit for “${r.product}”`, '', true)
//       }
//       if (!Number(r.qty) || Number(r.qty) <= 0) {
//         return showToast(`Enter a valid quantity for “${r.product}”`, '', true)
//       }
//     }

//     setSaving(true)

//     try {
//       const results = []

//       for (const r of active) {
//         const payload = {
//           locationId,
//           itemType: 'OUTSOURCED',
//           code: r.code.trim(),
//           name: r.product.trim(),
//           brand: 'Generic',
//           categoryId: r.categoryId,
//           vatCategoryId: r.vatCategoryId,
//           hsnSectionId: r.hsnSectionId,
//           isicSectionId: r.isicSectionId,
//           unitOfMeasureId: r.unitId,
//           reorderLevel: 1,
//           barcode: '',
//           landingCost: Number(r.unitCost) || 0,
//           markupCost: Number(r.price) || 0,
//           status: 'ACTIVE',
//         }

//         const res = await inventoryApi.createInventory(payload)
//         const created = res.data

//         if (Number(r.qty) > 0 && created?.id) {
//           try {
//             await inventoryApi.refillFinishedProducts({
//               locationId,
//               stockItemId: created.id,
//               quantity: Number(r.qty),
//               note:
//                 note ||
//                 `Direct entry${invoiceNo ? ` · Inv ${invoiceNo}` : ''}${
//                   supplierId ? ` · Supplier ${supplierId}` : ''
//                 }`,
//             })
//           } catch (refillErr) {
//             console.warn('Refill failed for', created.id, refillErr)
//           }
//         }

//         results.push(created)
//       }

//       showToast(
//         `Entered ${results.length} outsourced product${results.length > 1 ? 's' : ''}`,
//         selectedShowroomLabel
//       )

//       setRows([blank()])
//       setInvoiceNo('')
//       setPaymentTerms('')
//       setNote('')
//       setLocationId((id) => id)
//     } catch (e) {
//       showToast('Stock entry failed', e.message, true)
//     } finally {
//       setSaving(false)
//     }
//   }

//   const historyColumns = [
//     { key: 'date', label: 'Date', width: 130 },
//     { key: 'ref', label: 'Code', width: 120, mono: true },
//     { key: 'product', label: 'Product', width: 260 },
//     {
//       key: 'qty',
//       label: 'Qty on hand',
//       width: 130,
//       align: 'right',
//       mono: true,
//       render: (r) => fmt(r.qty),
//     },
//     { key: 'unit', label: 'Unit', width: 110 },
//     {
//       key: 'unitCost',
//       label: 'Landing cost',
//       width: 150,
//       align: 'right',
//       mono: true,
//       render: (r) => money(r.unitCost),
//     },
//   ]

//   return (
//     <FormShell
//       wide
//       crumbs={[moduleLabel, parentLabel]}
//       title={leaf?.label || 'Stock Entry (Direct)'}
//       icon={leaf?.icon}
//       description="Record products supplied directly by external bodies or third-party companies, entering them into showroom stock as OUTSOURCED items without passing through factory production or internal transfer."
//       submitLabel="Enter into stock"
//       loading={saving}
//       onSubmit={handleSubmit}
//       onCancel={() => {}}
//       note="Directly entered products are held against this showroom only and are created as OUTSOURCED stock items."
//       secondaryAction={
//         <Button variant="secondary" iconLeft="save" disabled>
//           Save draft
//         </Button>
//       }
//       aside={
//         <>
//           <Panel title="Entry summary">
//             <MetaRow label="Product lines" value={active.length || '—'} mono />
//             <MetaRow label="Total value" value={value ? money(value) : '—'} mono />
//             <MetaRow label="Entering into" value={selectedShowroomLabel} />
//           </Panel>

//           <Callout tone="info" icon="circle-alert" title="Outsourced products">
//             Products entered here are created as <strong>OUTSOURCED</strong> stock items
//             for the selected showroom. They are not part of normal factory production.
//           </Callout>
//         </>
//       }
//     >
//       {(loadingLookups || saving) && (
//         <Loader overlay label={saving ? 'Entering stock…' : 'Loading…'} />
//       )}

//       <Panel
//         title="Supplier & document"
//         description="Who supplied the goods and against which document."
//       >
//         <FieldSet columns={3}>
//           <Select
//             label="Receiving showroom"
//             options={showrooms}
//             value={locationId}
//             onChange={(e) => setLocationId(e.target.value)}
//             placeholder={loadingLookups ? 'Loading…' : 'Select showroom…'}
//           />
//           <Select
//             label="External supplier"
//             options={suppliers}
//             value={supplierId}
//             onChange={(e) => setSupplierId(e.target.value)}
//             placeholder={loadingLookups ? 'Loading…' : 'Select supplier…'}
//           />
//           <Input
//             label="Date received"
//             type="date"
//             value={dateReceived}
//             onChange={(e) => setDateReceived(e.target.value)}
//           />
//           <Input
//             label="Supplier invoice no."
//             placeholder="e.g. CHI-88214"
//             value={invoiceNo}
//             onChange={(e) => setInvoiceNo(e.target.value)}
//           />
//           <Input
//             label="Payment terms"
//             placeholder="e.g. 30 days credit"
//             value={paymentTerms}
//             onChange={(e) => setPaymentTerms(e.target.value)}
//           />
//           <Input
//             label="Notes"
//             placeholder="Optional note"
//             value={note}
//             onChange={(e) => setNote(e.target.value)}
//           />
//         </FieldSet>
//       </Panel>

//       <Panel
//         title="Products received"
//         description="Each line needs a unique product code plus Category, VAT, HSN and ISIC selections — all required by the backend."
//       >
//         <LineItems
//           columns={columns}
//           rows={decorated}
//           onChange={update}
//           onAdd={() => setRows((rs) => [...rs, blank()])}
//           onRemove={(i) =>
//             setRows((rs) =>
//               rs.length === 1 ? rs : rs.filter((_, ri) => ri !== i)
//             )
//           }
//           addLabel="Add product"
//           emptyLabel="No products added yet."
//           summary={[
//             { label: 'Lines', value: active.length },
//             { label: 'Value', value: money(value) },
//           ]}
//         />
//       </Panel>

//       <Panel title="Recent outsourced stock" padding={0}>
//         {loadingHistory ? (
//           <div style={{ padding: 24 }}>
//             <Loader label="Loading recent entries…" />
//           </div>
//         ) : (
//           <ReportTable
//             columns={historyColumns}
//             rows={history}
//             rowKey={(r) => r.id}
//             stickyHeader={false}
//             style={{ border: 'none', borderRadius: 0 }}
//             emptyTitle={
//               locationId ? 'No outsourced items yet' : 'Select a showroom'
//             }
//             emptyDescription={
//               locationId
//                 ? 'Outsourced products entered for this showroom will appear here.'
//                 : 'Choose a receiving showroom to see its recent outsourced stock.'
//             }
//           />
//         )}
//       </Panel>
//     </FormShell>
//   )
// }

import { useEffect, useState } from 'react'
import { Button } from '../../ds/components/core/Button.jsx'
import Loader from '../../ds/components/core/Loader.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import { ReportTable } from '../../ds/components/data/ReportTable.jsx'
import { FormShell } from '../shells/FormShell.jsx'
import { Panel, FieldSet, MetaRow, Callout } from '../shells/Page.jsx'
import { LineItems } from '../shells/LineItems.jsx'
import { fmt, money } from '../utils.js'
import { useStore } from '../store.jsx'
import ShowroomApi from '../../api/ShowroomApi.js'
import FactoryApi from '../../api/FactoryApi.js'
import AccountApi from '../../api/AccountApi.js'

const showroomApi = new ShowroomApi()
const factoryApi = new FactoryApi()
const accountApi = new AccountApi()

const RECENT_PAGE_SIZE = 10

const rid = () => Math.random().toString(36).slice(2)
const blank = () => ({ id: rid(), product: '', qty: '', unit: '', unitCost: '', price: '', dealerPrice: '', batch: '', expiry: '' })

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

export default function StockEntryDirect({ leaf, moduleLabel, parentLabel }) {
  const { showToast } = useStore()

  /* ---------------- create form ---------------- */
  const [rows, setRows] = useState([blank()])
  const [showroomId, setShowroomId] = useState('')
  const [areaId, setAreaId] = useState('')
  const [supplierId, setSupplierId] = useState('')
  const [supplierName, setSupplierName] = useState('')
  const [receivedDate, setReceivedDate] = useState('')
  const [invoiceNo, setInvoiceNo] = useState('')
  const [paymentTerms, setPaymentTerms] = useState('')
  const [vatId, setVatId] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // lookups
  const [showrooms, setShowrooms] = useState([]) // [{ id, code, label, areas }]
  const [defaultAreaId, setDefaultAreaId] = useState('')
  const [suppliers, setSuppliers] = useState([])
  const [units, setUnits] = useState([])
  const [vatCategories, setVatCategories] = useState([])
  const [loadingSetup, setLoadingSetup] = useState(false)

  /* ---------------- recent entries ---------------- */
  const [filterDefs, setFilterDefs] = useState([])
  const [filterValues, setFilterValues] = useState({})
  const [applied, setApplied] = useState({})
  const [page, setPage] = useState(0)
  const [entries, setEntries] = useState([])
  const [pageInfo, setPageInfo] = useState({ totalItems: 0, totalPages: 1 })
  const [loadingEntries, setLoadingEntries] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  // One-time lookups for the form.
  useEffect(() => {
    let cancelled = false
    setLoadingSetup(true)
    Promise.all([
      showroomApi.lookupPickerWithAreas({}),
      factoryApi.listSuppliers(),
      factoryApi.listUnits(),
      accountApi.getVatCategories(),
    ])
      .then(([sr, sup, un, vat]) => {
        if (cancelled) return
        const list = sr.data || []
        setShowrooms(list)
        if (list.length === 1) setShowroomId(list[0].id)
        setSuppliers((sup.data || []).map(factoryApi.toStoreSupplier))
        setUnits(
          (un.data || []).map(factoryApi.toStoreUnit).map((u) => ({
            value: u.id,
            label: u.symbol ? `${u.name} (${u.symbol})` : u.name,
          })),
        )
        setVatCategories(vat)
      })
      .catch((e) => !cancelled && showToast('Could not load setup data', e.message, true))
      .finally(() => !cancelled && setLoadingSetup(false))
    return () => { cancelled = true }
  }, [showToast])

  // Picking a showroom selects its default receiving area.
  useEffect(() => {
    setAreaId('')
    setDefaultAreaId('')
    if (!showroomId) return
    let cancelled = false
    showroomApi
      .retrieveShowroom(showroomId)
      .then((res) => {
        if (cancelled) return
        const def = res.data?.defaultReceivingLocation?.id || ''
        setDefaultAreaId(def)
        setAreaId(def || showrooms.find((s) => s.id === showroomId)?.areas?.[0]?.id || '')
      })
      .catch(() => {
        if (cancelled) return
        setAreaId(showrooms.find((s) => s.id === showroomId)?.areas?.[0]?.id || '')
      })
    return () => { cancelled = true }
  }, [showroomId, showrooms])

  // Filters for the recent-entries table come from the backend.
  useEffect(() => {
    let cancelled = false
    showroomApi
      .getDirectStockListFilters()
      .then((res) => { if (!cancelled) setFilterDefs(buildFilterDefs(res.data)) })
      .catch((e) => !cancelled && showToast('Could not load filters', e.message, true))
    return () => { cancelled = true }
  }, [showToast])

  // One page of recent entries.
  useEffect(() => {
    let cancelled = false
    setLoadingEntries(true)
    showroomApi
      .listDirectStockEntries({ ...applied, page, size: RECENT_PAGE_SIZE })
      .then((res) => {
        if (cancelled) return
        const d = res.data
        setEntries(d.items ?? [])
        setPageInfo({ totalItems: d.totalItems ?? 0, totalPages: d.totalPages ?? 1 })
      })
      .catch((e) => !cancelled && showToast('Could not load recent entries', e.message, true))
      .finally(() => !cancelled && setLoadingEntries(false))
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
  const supplierOptions = [{ value: '', label: '— Not a registered supplier —' }, ...suppliers.map((s) => ({ value: s.id, label: s.name }))]
  const vat = vatCategories.find((v) => v.value === vatId)

  function update(i, key, value) {
    setRows((rs) => rs.map((r, ri) => (ri === i ? { ...r, [key]: value } : r)))
  }

  const decorated = rows.map((r) => {
    const total = (Number(r.qty) || 0) * (Number(r.unitCost) || 0)
    return { ...r, lineTotal: total ? money(total) : undefined }
  })

  const columns = [
    // Free text, not a select — these products are not in the company catalogue.
    { key: 'product', label: 'Product description', type: 'text', width: 280, placeholder: 'e.g. Chivita 100% Orange 1L' },
    { key: 'qty', label: 'Quantity', type: 'number', width: 130, placeholder: '0' },
    { key: 'unit', label: 'Unit', type: 'select', options: units, width: 150, placeholder: 'Unit…' },
    { key: 'unitCost', label: 'Unit cost (₦)', type: 'number', width: 150, placeholder: '0.00' },
    { key: 'price', label: 'Selling price (₦)', type: 'number', width: 160, placeholder: '0.00' },
    { key: 'dealerPrice', label: 'Dealer price (₦)', type: 'number', width: 160, placeholder: '0.00' },
    { key: 'batch', label: 'Batch no.', type: 'text', width: 140, placeholder: 'Optional' },
    { key: 'expiry', label: 'Expiry date', type: 'date', width: 160 },
    { key: 'lineTotal', label: 'Line total', type: 'static', align: 'right', width: 160 },
  ]

  const active = rows.filter((r) => r.product)
  const value = rows.reduce((n, r) => n + (Number(r.qty) || 0) * (Number(r.unitCost) || 0), 0)

  function pickSupplier(id) {
    setSupplierId(id)
    const s = suppliers.find((x) => x.id === id)
    if (s) setSupplierName(s.name)
  }

  function reset() {
    setRows([blank()])
    setSupplierId(''); setSupplierName(''); setReceivedDate('')
    setInvoiceNo(''); setPaymentTerms(''); setVatId('')
  }

  async function submit() {
    if (!showroomId) return showToast('Select the receiving showroom', '', true)
    if (!supplierName.trim()) return showToast('Enter or select the external supplier', '', true)
    if (!receivedDate) return showToast('Enter the date received', '', true)

    const started = rows.filter((r) => r.product.trim() || r.qty || r.unitCost)
    const complete = (r) => r.product.trim() && Number(r.qty) > 0 && r.unit
    if (!started.length) return showToast('Add at least one product', '', true)
    if (started.some((r) => !complete(r))) {
      return showToast('Each product needs a description, quantity and unit', '', true)
    }

    const inputVatRate = Number(vat?.rate) || 0
    const lines = started.map((r) => ({
      description: r.product.trim(),
      quantity: Number(r.qty),
      unitOfMeasureId: r.unit,
      unitCost: Number(r.unitCost) || 0,
      inputVatRate,
      sellingPrice: Number(r.price) || 0,
      dealerPrice: Number(r.dealerPrice) || 0,
      batchNo: r.batch.trim(),
      expiryDate: r.expiry || null,
    }))

    setSubmitting(true)
    try {
      const res = await showroomApi.createDirectStockEntry({
        locationId: showroomId,
        intoLocationId: areaId || showroomId,
        supplierId: supplierId || null,
        supplierName: supplierName.trim(),
        supplierInvoiceNo: invoiceNo.trim(),
        paymentTerms: paymentTerms.trim(),
        receivedDate,
        vatCategoryId: vatId || null,
        lines,
      })
      const created = res.data
      const warnings = created.warnings?.length ? created.warnings.join(' · ') : ''
      showToast(`Stock entered — ${created.ref}`, warnings || `${lines.length} line${lines.length === 1 ? '' : 's'} · ${showroom?.label || ''}`)
      reset()
      setPage(0)
      setRefreshKey((k) => k + 1)
    } catch (e) {
      showToast('Could not enter stock', e.message, true)
    } finally {
      setSubmitting(false)
    }
  }

  /* ---------------- recent entries table ---------------- */
  const historyColumns = [
    { key: 'date', label: 'Date', width: 130 },
    { key: 'ref', label: 'Reference', width: 110, mono: true },
    { key: 'product', label: 'Product', width: 250 },
    { key: 'supplier', label: 'External supplier', width: 200 },
    { key: 'invoice', label: 'Supplier invoice', width: 150, mono: true },
    { key: 'qty', label: 'Quantity', width: 120, align: 'right', mono: true, render: (r) => fmt(r.qty) },
    { key: 'unit', label: 'Unit', width: 110 },
    { key: 'unitCost', label: 'Unit cost', width: 150, align: 'right', mono: true, render: (r) => money(r.unitCost) },
    { key: 'enteredBy', label: 'Entered by', width: 140 },
  ]

  const historyRows = entries.map((e) => ({
    key: e.lineId || `${e.entryId}-${e.ref}`,
    date: fmtDate(e.date),
    ref: e.ref,
    product: e.product,
    supplier: e.party || '—',
    invoice: e.partnerReference || '—',
    qty: e.quantity,
    unit: e.unit,
    unitCost: e.unitCost,
    enteredBy: e.enteredBy?.name || '—',
  }))

  const setFilter = (key, v) => setFilterValues((fv) => ({ ...fv, [key]: v }))
  const applyFilters = () => { setApplied(cleanFilters(filterValues)); setPage(0) }
  const clearFilters = () => { setFilterValues({}); setApplied({}); setPage(0) }

  return (
    <FormShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Stock Entry (Direct)'}
      icon={leaf?.icon}
      description="Record products supplied directly by external bodies or third-party companies, entering them into showroom stock without passing through factory production or internal transfer."
      submitLabel="Enter into stock"
      loading={submitting}
      onSubmit={submit}
      onCancel={reset}
      note="Directly entered products are held against this showroom only and are not added to the company product register."
      secondaryAction={<Button variant="secondary" iconLeft="save">Save draft</Button>}
      aside={
        <>
          <Panel title="Entry summary">
            <MetaRow label="Product lines" value={active.length || '—'} mono />
            <MetaRow label="Total value" value={value ? money(value) : '—'} mono />
            <MetaRow label="Entering into" value={showroom?.label || '—'} />
          </Panel>

          <Callout tone="info" icon="circle-alert" title="Unregistered products">
            Products entered here are <strong>not</strong> company-registered. Use Outsource Stock instead when
            receiving an outsourced product the company has formally registered.
          </Callout>
        </>
      }
    >
      {(loadingSetup || submitting) && (
        <Loader overlay label={submitting ? 'Entering stock…' : 'Loading…'} />
      )}

      <Panel title="Supplier & document" description="Who supplied the goods and against which document.">
        <FieldSet columns={3}>
          <Select label="Receiving showroom" options={showroomOptions} value={showroomId} onChange={(e) => setShowroomId(e.target.value)} placeholder="Select showroom…" />
          <Select label="Receiving area" options={areaOptions} value={areaId} onChange={(e) => setAreaId(e.target.value)} placeholder={showroomId ? 'Select area…' : 'Pick a showroom first'} />
          <Input label="Date received" type="date" value={receivedDate} onChange={(e) => setReceivedDate(e.target.value)} />
          <Select label="External supplier" options={supplierOptions} value={supplierId} onChange={(e) => pickSupplier(e.target.value)} placeholder="Select supplier…" />
          <Input label="Supplier name" placeholder="Type a name if not registered" value={supplierName} onChange={(e) => setSupplierName(e.target.value)} />
          <Input label="Supplier invoice no." placeholder="e.g. CHI-88214" value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} />
          <Input label="Payment terms" placeholder="e.g. 30 days credit" value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)} />
          <Select label="VAT treatment" options={vatCategories} value={vatId} onChange={(e) => setVatId(e.target.value)} placeholder="Select treatment…" />
          <Input label="Reference no." placeholder="Assigned on save" disabled value="" />
        </FieldSet>
      </Panel>

      <Panel
        title="Products received"
        description="Type each product description directly — these items are not in the company catalogue and have no product code."
      >
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

      <Panel title="Recent direct entries" padding={0}>
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
                    type={f.kind === 'text' ? 'text' : f.kind}
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

        {loadingEntries && <Loader label="Loading recent entries…" />}

        <ReportTable
          columns={historyColumns}
          rows={historyRows}
          rowKey={(r) => r.key}
          stickyHeader={false}
          style={{ border: 'none', borderRadius: 0 }}
        />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderTop: '1px solid var(--border-subtle)' }}>
          <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
            {pageInfo.totalItems} entr{pageInfo.totalItems === 1 ? 'y' : 'ies'} · Page {page + 1} of {Math.max(pageInfo.totalPages, 1)}
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="secondary" size="sm" disabled={page === 0 || loadingEntries} onClick={() => setPage((p) => Math.max(0, p - 1))}>Previous</Button>
            <Button variant="secondary" size="sm" disabled={page + 1 >= pageInfo.totalPages || loadingEntries} onClick={() => setPage((p) => p + 1)}>Next</Button>
          </div>
        </div>
      </Panel>
    </FormShell>
  )
}