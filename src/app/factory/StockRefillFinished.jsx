// import { useState, useEffect } from 'react'
// import { Badge } from '../../ds/components/core/Badge.jsx'
// import { Icon } from '../../ds/components/core/Icon.jsx'
// import { Button } from '../../ds/components/core/Button.jsx'
// import { IconButton } from '../../ds/components/core/IconButton.jsx'
// import { Input } from '../../ds/components/forms/Input.jsx'
// import { Select } from '../../ds/components/forms/Select.jsx'
// import { FormShell } from '../shells/FormShell.jsx'
// import { Panel, FieldSet, MetaRow } from '../shells/Page.jsx'
// import { LineItems } from '../shells/LineItems.jsx'
// import {recentRefills } from '../sample.js'
// import { useStore } from '../store.jsx'
// import { fmtDate } from '../utils.js'
// import InventoryApi from '../../api/InventoryApi.js'

// const inventoryApi=new InventoryApi()
// const ON_HAND = { 'zf-101': '1,420', 'zf-102': '860', 'zf-210': '2,105', 'zf-315': '540', 'zf-420': '7,900' }//quantty the have on hand dummy data . there is now a quantity field for products



// const blank = () => ({ id: Math.random().toString(36).slice(2), product: '', qty: '', batch: '' })

// export default function StockRefillFinished({ leaf, moduleLabel, parentLabel, onNavigate, draftId }) {
//   const { peekRef, issueRef, showToast, user, company, refillDrafts, saveDraft, deleteDraft, refills, postRefill } = useStore()
//   const { factories } = useStore()
//   const [finishedProducts, setFinishedProducts] = useState([])
//   const [factoryId,setFactoryId]=useState(0)
//   const columns = [
//   { key: 'product', label: 'Finished product', type: 'select', options: finishedProducts, width: 260, placeholder: 'Select product…' },
//   { key: 'onHand', label: 'On hand', type: 'static', align: 'right', width: 110 },
//   { key: 'qty', label: 'Quantity added', type: 'number', width: 150, placeholder: '0' },
//   { key: 'unit', label: 'Unit', type: 'static', width: 100 },
//   { key: 'batch', label: 'Batch / lot no.', type: 'text', width: 160, placeholder: 'e.g. B-2481' },
//   { key: 'newBalance', label: 'New balance', type: 'static', align: 'right', width: 130 },
// ]
//   // Arriving from Saved Drafts with a draft to resume — load its lines instead of a blank form.
//   const [rows, setRows] = useState(() => {
//     const opened = draftId && refillDrafts.find((d) => d.id === draftId)
//     return opened ? opened.rows.map((r) => ({ ...r, id: Math.random().toString(36).slice(2) })) : [blank()]
//   })
//   // Consume the draft once, on mount, so the resumed lines are not left duplicated in the list.
//   useEffect(() => {
//     if (draftId && refillDrafts.some((d) => d.id === draftId)) deleteDraft(draftId)
//     // eslint-disable-next-line react-hooks/exhaustive-deps -- runs once for the draft this screen was opened with
//   }, [])

//   useEffect(()=>{
//     if(!factoryId) return
//     inventoryApi.listStockItems({
//       locationId: factoryId,
//       itemType: "FINISHED_PRODUCT",
//     }).then((data)=>{
//       setFinishedProducts(data.map((i)=>({value:i.id,label:i.name})))
//     })

//   },[factoryId])

//   // Refills posted on this account, newest first — persisted in the store, each carries the reference it consumed.
//   const posted = refills
//     .filter((r) => r.kind === 'finished')
//     .map((r) => ({ ref: r.ref, product: r.title, qty: r.qty, when: fmtDate(new Date(r.at).toISOString()), by: r.by }))

//   function update(i, key, value) {
//     setRows((rs) => rs.map((r, ri) => (ri === i ? { ...r, [key]: value } : r)))
//   }

//   // Derived display values only — no business logic, just so the design reads correctly.
//   const decorated = rows.map((r) => {
//     const onHand = ON_HAND[r.product]
//     const added = Number(r.qty)
//     const balance = onHand && added ? (Number(onHand.replace(/,/g, '')) + added).toLocaleString() : undefined
//     return { ...r, onHand, unit: r.product ? 'Cartons' : undefined, newBalance: balance }
//   })

//   const lines = rows.filter((r) => r.product).length
//   const totalUnits = rows.reduce((n, r) => n + (Number(r.qty) || 0), 0)

//   // Whoever is signed in — this is the name the posting is recorded against.
//   const recordedBy = user.name || user.email || 'Administrator'
//   const recordedRole = user.role || 'Administrator'
//   const drafts = refillDrafts.filter((d) => d.kind === 'finished')
//   const goToDrafts = () => onNavigate?.({ id: 'f.refill.drafts', view: 'f.refill.drafts', label: 'Saved Drafts' })

//   // Reserved for display only. The number is consumed when the refill is posted,
//   // so an abandoned form never leaves a gap in the series.
//   const nextRef = peekRef('RF')

//   const stash = () => {
//     const filled = rows.filter((r) => r.product || r.qty || r.batch)
//     if (!filled.length) {
//       showToast('Nothing to save', 'Add at least one line before saving a draft.', true)
//       return
//     }
//     const units = filled.reduce((n, r) => n + (Number(r.qty) || 0), 0)
//     const label = finishedProducts.find((p) => p.value === filled[0].product)?.label || 'Unnamed product'
//     saveDraft('finished', {
//       rows: filled,
//       title: filled.length === 1 ? label : `${label} +${filled.length - 1} more`,
//       lines: filled.length,
//       units,
//       by: recordedBy,
//     })
//     showToast('Draft saved', 'Find it under "Saved drafts" on this screen.')
//     setRows([blank()])
//   }

//   const resume = (draft) => {
//     setRows(draft.rows.map((r) => ({ ...r, id: Math.random().toString(36).slice(2) })))
//     deleteDraft(draft.id)
//     showToast('Draft reopened', `${draft.lines} line${draft.lines === 1 ? '' : 's'} restored — no reference is issued until you post.`)
//   }

//   const post = () => {
//     const valid = rows.filter((r) => r.product && Number(r.qty) > 0)
//     if (!valid.length) {
//       showToast('Nothing to post', 'Add at least one product line with a quantity.', true)
//       return
//     }
//     const ref = issueRef('RF')
//     const units = valid.reduce((n, r) => n + Number(r.qty), 0)
//     const label = finishedProducts.find((p) => p.value === valid[0].product)?.label || 'Finished product'
//     ill('finished', {
//       ref,
//       postReftitle: valid.length === 1 ? label : `${label} +${valid.length - 1} more`,
//       qty: `+${units.toLocaleString()} ctn`,
//       lines: valid.map(({ product, qty, batch }) => ({ product, qty, batch })),
//       by: recordedBy,
//     })
//     showToast(`Refill posted — ${ref}`, `${valid.length} line${valid.length === 1 ? '' : 's'} · ${units.toLocaleString()} units added`)
//     setRows([blank()])
//   }

//   return (
//     <FormShell
//       crumbs={[moduleLabel, parentLabel]}
//       title={leaf?.label || 'Stock Refill — Finished Product'}
//       icon={leaf?.icon}
//       description="Manually record quantities of finished products whose production cycle cannot be determined. Entries post directly to the selected factory's stock."
//       submitLabel="Post refill"
//       onSubmit={post}
//       onCancel={() => setRows([blank()])}
//       note="Posting updates the factory Bin Card immediately and cannot be reversed without a Quantity Adjustment."
//       secondaryAction={<Button variant="secondary" iconLeft="save" onClick={stash}>Save draft</Button>}
//       aside={
//         <>
//           <Panel title="Refill summary">
//             <MetaRow label="Product lines" value={lines || '—'} mono />
//             <MetaRow label="Total units added" value={totalUnits ? totalUnits.toLocaleString() : '—'} mono />
//             <MetaRow label="Posts to" value="Factory bin card" />
//           </Panel>

//           <div style={{
//             border: '1px solid var(--accent-amber)', borderLeft: '4px solid var(--accent-amber)',
//             borderRadius: 'var(--radius-card)', background: 'var(--warning-bg)', padding: '14px 16px',
//             boxShadow: 'var(--shadow-xs)',
//           }}>
//             <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
//               <Icon name="shield-alert" size={16} color="var(--accent-amber-fg)" />
//               <span style={{ font: 'var(--fw-bold) var(--text-sm)/1 var(--font-ui)', letterSpacing: 'var(--ls-tight)', color: 'var(--accent-amber-fg)' }}>
//                 This posting is permanent
//               </span>
//             </div>
//             <div style={{ font: 'var(--type-caption)', color: 'var(--accent-amber-fg)', lineHeight: 1.6 }}>
//               Only a Stock Keeper or Quality Control officer may post a refill. Once posted, the quantities go
//               straight onto the factory bin card and can only be corrected with a Quantity Adjustment — so check
//               every line before you post.
//             </div>
//             <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--accent-amber)', font: 'var(--type-caption)', color: 'var(--accent-amber-fg)' }}>
//               Posting as <b>{recordedBy}</b> · {recordedRole}
//             </div>
//           </div>

//           {drafts.length > 0 && (
//             <Panel
//               title="Saved drafts"
//               description="Held here until you post or discard them. No reference is issued to a draft."
//               padding={0}
//               actions={<Button variant="ghost" size="sm" iconLeft="external-link" onClick={goToDrafts}>View all</Button>}
//             >
//               <div style={{ padding: '4px 16px 12px' }}>
//                 {drafts.map((d) => (
//                   <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}>
//                     <div style={{ flex: 1, minWidth: 0 }}>
//                       <div style={{ font: 'var(--fw-semibold) var(--text-sm)/1.3 var(--font-ui)', color: 'var(--text-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.title}</div>
//                       <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', marginTop: 2 }}>
//                         {d.lines} line{d.lines === 1 ? '' : 's'} · {d.units.toLocaleString()} units · {fmtDate(new Date(d.savedAt).toISOString())}
//                       </div>
//                     </div>
//                     <Button size="sm" variant="secondary" onClick={() => resume(d)}>Resume</Button>
//                     <IconButton icon="trash-2" label="Discard draft" size="sm" onClick={() => deleteDraft(d.id)} />
//                   </div>
//                 ))}
//               </div>
//             </Panel>
//           )}

//           <Panel title="Recent refills" padding={0}>
//             <div style={{ padding: '4px 16px 12px' }}>
//               {[...posted, ...recentRefills].map((r) => (
//                 <div key={r.ref} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}>
//                   <div style={{ flex: 1, minWidth: 0 }}>
//                     <div style={{ font: 'var(--fw-semibold) var(--text-sm)/1.3 var(--font-ui)', color: 'var(--text-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.product}</div>
//                     <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', marginTop: 2 }}>{r.ref} · {r.when} · {r.by}</div>
//                   </div>
//                   <span style={{ font: 'var(--fw-bold) var(--text-xs)/1 var(--font-mono)', color: 'var(--success)', flexShrink: 0 }}>{r.qty}</span>
//                 </div>
//               ))}
//             </div>
//           </Panel>
//         </>
//       }
//     >
//       <Panel title="Refill details" description="Where the stock is being added and when it arrived.">
//         <FieldSet columns={3}>
//           <Select label="Factory" value={factoryId} onChange={setFactoryId} options={factories.map((f) => ({ value: f.id, label: f.name }))} placeholder="Select factory…" />
//           <Input label="Refill date" type="date" />
//           <Input label="Reference no." hint="Issued automatically when the refill is posted." disabled value={nextRef} />
//         </FieldSet>
//       </Panel>

//       <Panel
//         title="Products"
//         description="Add one line per product."
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
//             { label: 'Lines', value: lines },
//             { label: 'Units added', value: totalUnits.toLocaleString() },
//           ]}
//         />
//       </Panel>

//       <Panel title="Reason & notes" description="Explain why this stock is being entered manually.">
//         <FieldSet columns={1}>
//           <label style={{ display: 'block' }}>
//             <div style={{ font: 'var(--type-label)', color: 'var(--text-strong)', marginBottom: 6 }}>Notes</div>
//             <textarea
//               rows={3}
//               placeholder="e.g. Production cycle for this SKU is continuous; quantity counted at shift close."
//               style={{
//                 width: '100%', padding: '10px 12px', resize: 'vertical',
//                 background: 'var(--surface-card)', border: '1px solid var(--border-default)',
//                 borderRadius: 'var(--radius-control)', boxShadow: 'var(--shadow-xs)',
//                 font: 'var(--fw-regular) var(--text-sm)/1.5 var(--font-ui)', color: 'var(--text-strong)', outline: 'none',
//               }}
//             />
//           </label>
//         </FieldSet>
//         <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
//           <Badge tone="neutral" uppercase>Recorded by</Badge>
//           <span style={{ font: 'var(--type-ui)', color: 'var(--text-muted)' }}>
//             {recordedBy} · {recordedRole}{company.name ? ` · ${company.name}` : ''}
//           </span>
//         </div>
//       </Panel>
//     </FormShell>
//   )
// }
import { useState, useEffect, useRef } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Icon } from '../../ds/components/core/Icon.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { IconButton } from '../../ds/components/core/IconButton.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import { FormShell } from '../shells/FormShell.jsx'
import { Panel, FieldSet, MetaRow } from '../shells/Page.jsx'
import { LineItems } from '../shells/LineItems.jsx'
// import { recentRefills } from '../sample.js'
import { useStore } from '../store.jsx'
import { fmtDate } from '../utils.js'
import { unitOptions } from '../unitOptions.js'
import { categoryOptions } from '../categoryOptions.js'
import InventoryApi from '../../api/InventoryApi.js'

const inventoryApi = new InventoryApi()

const blank = () => ({ id: Math.random().toString(36).slice(2), product: '', qty: '', batch: '' })

export default function StockRefillFinished({ leaf, moduleLabel, parentLabel, onNavigate, draftId }) {
  const { showToast, user, company, refillDrafts, saveDraft, deleteDraft, refills, postRefill, factories, categories, units } = useStore()
  let recentRefills=[]
  // Opened from Saved Drafts: start on the factory the draft was saved against.
  const [factoryId, setFactoryId] = useState(() => (draftId && refillDrafts.find((d) => d.id === draftId)?.factoryId) || '')
  const [items, setItems] = useState([]) // this factory's finished products, in the store's product shape
  const [reloadKey, setReloadKey] = useState(0) // bump to re-request the items (refreshes "On hand")
  const [notes, setNotes] = useState('')
  const [posting, setPosting] = useState(false)

  // Product options for the line-item dropdown.
  const finishedProducts = items.map((p) => ({ value: p.id, label: p.name }))

  const columns = [
    { key: 'product', label: 'Finished product', type: 'select', options: finishedProducts, width: 260, placeholder: 'Select product…' },
    { key: 'onHand', label: 'On hand', type: 'static', align: 'right', width: 110 },
    { key: 'qty', label: 'Quantity added', type: 'number', width: 150, placeholder: '0' },
    { key: 'unit', label: 'Unit', type: 'static', width: 100 },
    { key: 'batch', label: 'Batch / lot no.', type: 'text', width: 160, placeholder: 'e.g. B-2481' },
    { key: 'newBalance', label: 'New balance', type: 'static', align: 'right', width: 130 },
  ]

  // Arriving from Saved Drafts with a draft to resume — load its lines instead of a blank form.
  const [rows, setRows] = useState(() => {
    const opened = draftId && refillDrafts.find((d) => d.id === draftId)
    return opened ? opened.rows.map((r) => ({ ...r, id: Math.random().toString(36).slice(2) })) : [blank()]
  })
  // Consume the draft once, on mount, so the resumed lines are not left duplicated in the list.
  useEffect(() => {
    if (draftId && refillDrafts.some((d) => d.id === draftId)) deleteDraft(draftId)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs once for the draft this screen was opened with
  }, [])

  // Name lookups for toStoreProduct, read through a ref so a change to the unit
  // or category lists doesn't trigger a new request.
  const lookupsRef = useRef(null)
  lookupsRef.current = { factories, categories: categoryOptions(categories), units: unitOptions(units) }

  // Load the finished products of the chosen factory.
  // Load the finished products of the chosen factory (paginated under the hood).
useEffect(() => {
  if (!factoryId) {
    setItems([])
    return
  }

  let cancelled = false

  const loadAllProducts = async () => {
    let page = 0
    let all = []
    let hasMore = true

    while (hasMore && !cancelled) {
      const { data } = await inventoryApi.listStockItems(factoryId, 'FINISHED_PRODUCT', {
        page,
        size: 60,
      })

      const pageItems = data?.items ?? data ?? []
      const mapped = pageItems.map((i) =>
        inventoryApi.toStoreProduct(i, lookupsRef.current)
      )

      all = [...all, ...mapped]
      hasMore = data?.totalPages != null
        ? (data.page + 1) < data.totalPages
        : pageItems.length === 50

      page++
    }

    if (!cancelled) setItems(all)
  }

  loadAllProducts().catch((error) => {
    if (!cancelled) showToast('Could not load products', error.message, true)
  })

  return () => { cancelled = true }
}, [factoryId, reloadKey, showToast])

  // The product list belongs to one factory, so a new factory clears the old
  // list and any product already picked on the lines.
  const changeFactory = (id) => {
    setFactoryId(id)
    setItems([])
    setRows((rs) => rs.map((r) => ({ ...r, product: '' })))
  }

  // Refills posted on this account, newest first — persisted in the store, each carries the reference it consumed.
  const posted = refills
    .filter((r) => r.kind === 'finished')
    .map((r) => ({ ref: r.ref, product: r.title, qty: r.qty, when: fmtDate(new Date(r.at).toISOString()), by: r.by }))

  function update(i, key, value) {
    setRows((rs) => rs.map((r, ri) => (ri === i ? { ...r, [key]: value } : r)))
  }

  // Derived display values from the chosen product. A missing quantity counts as 0.
  const itemById = Object.fromEntries(items.map((p) => [p.id, p]))
  const decorated = rows.map((r) => {
    const item = itemById[r.product]
    const onHand = item ? Number(item.quantity ?? 0) : undefined
    const added = Number(r.qty) || 0
    return {
      ...r,
      onHand: onHand === undefined ? undefined : onHand.toLocaleString(),
      unit: item ? (item.unit || '—') : undefined,
      newBalance: onHand !== undefined && added ? (onHand + added).toLocaleString() : undefined,
    }
  })

  const lines = rows.filter((r) => r.product).length
  const totalUnits = rows.reduce((n, r) => n + (Number(r.qty) || 0), 0)

  // Whoever is signed in — this is the name the posting is recorded against.
  const recordedBy = user.name || user.email || 'Administrator'
  const recordedRole = user.role || 'Administrator'
  const drafts = refillDrafts.filter((d) => d.kind === 'finished')
  const goToDrafts = () => onNavigate?.({ id: 'f.refill.drafts', view: 'f.refill.drafts', label: 'Saved Drafts' })

  const stash = () => {
    const filled = rows.filter((r) => r.product || r.qty || r.batch)
    if (!filled.length) {
      showToast('Nothing to save', 'Add at least one line before saving a draft.', true)
      return
    }
    const units = filled.reduce((n, r) => n + (Number(r.qty) || 0), 0)
    const label = finishedProducts.find((p) => p.value === filled[0].product)?.label || 'Unnamed product'
    saveDraft('finished', {
      rows: filled,
      factoryId, // so resuming brings back this factory's product list
      title: filled.length === 1 ? label : `${label} +${filled.length - 1} more`,
      lines: filled.length,
      units,
      by: recordedBy,
    })
    showToast('Draft saved', 'Find it under "Saved drafts" on this screen.')
    setRows([blank()])
  }

  const resume = (draft) => {
    setRows(draft.rows.map((r) => ({ ...r, id: Math.random().toString(36).slice(2) })))
    if (draft.factoryId) setFactoryId(draft.factoryId)
    deleteDraft(draft.id)
    showToast('Draft reopened', `${draft.lines} line${draft.lines === 1 ? '' : 's'} restored — no reference is issued until you post.`)
  }

  const post = async () => {
    if (!factoryId) {
      showToast('Select a factory', 'Choose the factory this stock is going into.', true)
      return
    }
    const valid = rows.filter((r) => r.product && Number(r.qty) > 0)
    if (!valid.length) {
      showToast('Nothing to post', 'Add at least one product line with a quantity.', true)
      return
    }

    setPosting(true)
    const refs = []
    const failed = []
    let units = 0

    // The endpoint takes one product per request, so every line is its own refill
    // with its own reference. Only locationId, stockItemId, quantity and note are
    // sent; the batch number and refill date stay on the form for the user.
    for (const line of valid) {
      const item = itemById[line.product]
      try {
        const res = await inventoryApi.refillFinishedProducts({
          locationId: factoryId,
          stockItemId: line.product,
          quantity: Number(line.qty),
          note: notes.trim(),
        })
        const done = res.data
        const qty = Number(done?.quantity ?? line.qty)

        // Save the server's result into the store, keyed by the reference it issued.
        // Save the server's result into the store, keyed by the reference it issued.
        postRefill('finished', {
          ref: done.ref,
          title: item?.name || 'Finished product',
          qty: `+${qty.toLocaleString()}${item?.unit ? ` ${item.unit}` : ''}`,
          lines: [{ product: line.product, qty, batch: line.batch }],
          by: done.performedBy?.name || done.performedBy?.email || recordedBy,
        })
        refs.push(done.ref)
        units += qty
      } catch (error) {
        failed.push({ line, name: item?.name || 'A line', reason: error.message })
      }
    }
    setPosting(false)

    if (refs.length) setReloadKey((k) => k + 1) // refresh the "On hand" figures

    if (!failed.length) {
      showToast(
        refs.length === 1 ? `Refill posted — ${refs[0]}` : `${refs.length} refills posted`,
        refs.length === 1
          ? `${units.toLocaleString()} units added`
          : `${refs[0]} … ${refs[refs.length - 1]} · ${units.toLocaleString()} units added`
      )
      setRows([blank()])
      setNotes('')
      return
    }

    // Some or all lines failed. The ones that posted are already saved, so only
    // the failed lines stay on the form, ready to retry without duplicating.
    showToast(
      refs.length ? `${refs.length} posted, ${failed.length} failed` : 'Refill failed',
      `${failed[0].name}: ${failed[0].reason}${failed.length > 1 ? ` (+${failed.length - 1} more)` : ''}`,
      true
    )
    setRows(failed.map((f) => f.line))
  }

  return (
    <FormShell
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Stock Refill — Finished Product'}
      icon={leaf?.icon}
      description="Manually record quantities of finished products whose production cycle cannot be determined. Entries post directly to the selected factory's stock."
      submitLabel="Post refill"
      loading={posting}
      onSubmit={post}
      onCancel={() => setRows([blank()])}
      note="Posting updates the factory Bin Card immediately and cannot be reversed without a Quantity Adjustment."
      secondaryAction={<Button variant="secondary" iconLeft="save" onClick={stash}>Save draft</Button>}
      aside={
        <>
          <Panel title="Refill summary">
            <MetaRow label="Product lines" value={lines || '—'} mono />
            <MetaRow label="Total units added" value={totalUnits ? totalUnits.toLocaleString() : '—'} mono />
            <MetaRow label="Posts to" value="Factory bin card" />
          </Panel>

          <div style={{
            border: '1px solid var(--accent-amber)', borderLeft: '4px solid var(--accent-amber)',
            borderRadius: 'var(--radius-card)', background: 'var(--warning-bg)', padding: '14px 16px',
            boxShadow: 'var(--shadow-xs)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Icon name="shield-alert" size={16} color="var(--accent-amber-fg)" />
              <span style={{ font: 'var(--fw-bold) var(--text-sm)/1 var(--font-ui)', letterSpacing: 'var(--ls-tight)', color: 'var(--accent-amber-fg)' }}>
                This posting is permanent
              </span>
            </div>
            <div style={{ font: 'var(--type-caption)', color: 'var(--accent-amber-fg)', lineHeight: 1.6 }}>
              Only a Stock Keeper or Quality Control officer may post a refill. Once posted, the quantities go
              straight onto the factory bin card and can only be corrected with a Quantity Adjustment — so check
              every line before you post.
            </div>
            <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--accent-amber)', font: 'var(--type-caption)', color: 'var(--accent-amber-fg)' }}>
              Posting as <b>{recordedBy}</b> · {recordedRole}
            </div>
          </div>

          {drafts.length > 0 && (
            <Panel
              title="Saved drafts"
              description="Held here until you post or discard them. No reference is issued to a draft."
              padding={0}
              actions={<Button variant="ghost" size="sm" iconLeft="external-link" onClick={goToDrafts}>View all</Button>}
            >
              <div style={{ padding: '4px 16px 12px' }}>
                {drafts.map((d) => (
                  <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ font: 'var(--fw-semibold) var(--text-sm)/1.3 var(--font-ui)', color: 'var(--text-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.title}</div>
                      <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', marginTop: 2 }}>
                        {d.lines} line{d.lines === 1 ? '' : 's'} · {d.units.toLocaleString()} units · {fmtDate(new Date(d.savedAt).toISOString())}
                      </div>
                    </div>
                    <Button size="sm" variant="secondary" onClick={() => resume(d)}>Resume</Button>
                    <IconButton icon="trash-2" label="Discard draft" size="sm" onClick={() => deleteDraft(d.id)} />
                  </div>
                ))}
              </div>
            </Panel>
          )}

          <Panel title="Recent refills" padding={0}>
            <div style={{ padding: '4px 16px 12px' }}>
              {[...posted, ...recentRefills].map((r) => (
                <div key={r.ref} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ font: 'var(--fw-semibold) var(--text-sm)/1.3 var(--font-ui)', color: 'var(--text-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.product}</div>
                    <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', marginTop: 2 }}>{r.ref} · {r.when} · {r.by}</div>
                  </div>
                  <span style={{ font: 'var(--fw-bold) var(--text-xs)/1 var(--font-mono)', color: 'var(--success)', flexShrink: 0 }}>{r.qty}</span>
                </div>
              ))}
            </div>
          </Panel>
        </>
      }
    >
      <Panel title="Refill details" description="Where the stock is being added and when it arrived.">
        <FieldSet columns={3}>
          <Select
            label="Factory"
            value={factoryId}
            onChange={(e) => changeFactory(e.target.value)}
            options={factories.map((f) => ({ value: f.id, label: f.name }))}
            placeholder="Select factory…"
          />
          <Input label="Refill date" type="date" />
          <Input label="Reference no." hint="Issued automatically when the refill is posted." disabled value="" placeholder="Assigned when posted" />
        </FieldSet>
      </Panel>

      <Panel
        title="Products"
        description="Add one line per product."
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
            { label: 'Lines', value: lines },
            { label: 'Units added', value: totalUnits.toLocaleString() },
          ]}
        />
      </Panel>

      <Panel title="Reason & notes" description="Explain why this stock is being entered manually.">
        <FieldSet columns={1}>
          <label style={{ display: 'block' }}>
            <div style={{ font: 'var(--type-label)', color: 'var(--text-strong)', marginBottom: 6 }}>Notes</div>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Production cycle for this SKU is continuous; quantity counted at shift close."
              style={{
                width: '100%', padding: '10px 12px', resize: 'vertical',
                background: 'var(--surface-card)', border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-control)', boxShadow: 'var(--shadow-xs)',
                font: 'var(--fw-regular) var(--text-sm)/1.5 var(--font-ui)', color: 'var(--text-strong)', outline: 'none',
              }}
            />
          </label>
        </FieldSet>
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Badge tone="neutral" uppercase>Recorded by</Badge>
          <span style={{ font: 'var(--type-ui)', color: 'var(--text-muted)' }}>
            {recordedBy} · {recordedRole}{company.name ? ` · ${company.name}` : ''}
          </span>
        </div>
      </Panel>
    </FormShell>
  )
}