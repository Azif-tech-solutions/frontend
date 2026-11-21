// import { useState } from 'react'
// import { Badge } from '../../ds/components/core/Badge.jsx'
// import { Button } from '../../ds/components/core/Button.jsx'
// import { Input } from '../../ds/components/forms/Input.jsx'
// import { Select } from '../../ds/components/forms/Select.jsx'
// import { ReportTable } from '../../ds/components/data/ReportTable.jsx'
// import { FormShell } from '../shells/FormShell.jsx'
// import { Page, Panel, FieldSet, MetaRow } from '../shells/Page.jsx'
// import { PageHeader } from '../shells/PageHeader.jsx'
// import { LineItems } from '../shells/LineItems.jsx'
// import { DocumentSheet } from '../shells/DocumentView.jsx'
// import { VAT_RATE } from '../sample.js'
// import { sellableProducts, quoteCustomers, proformaHistory } from '../sampleCashier.js'
// import { fmt, money, moneyShort } from '../utils.js'

// const PRICES = Object.fromEntries(sellableProducts.map((p) => [p.value, p.price]))
// const STATUS_TONE = { Sent: 'info', Converted: 'success', Expired: 'neutral', Declined: 'danger' }

// const blank = () => ({ id: Math.random().toString(36).slice(2), product: '', qty: '', discount: '' })

// function ProformaDocument({ crumbs, onBack, customer, lines, subtotal, discount, vat, total }) {
//   return (
//     <Page>
//       <PageHeader
//         crumbs={crumbs}
//         title="Pro-forma invoice"
//         icon="file-text"
//         description="A preliminary quotation for the customer to review before payment or confirmation. It does not record a sale and no stock is committed."
//         meta={<Badge tone="info">Quotation · not a tax invoice</Badge>}
//         actions={
//           <>
//             <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>New quotation</Button>
//             <Button variant="secondary" iconLeft="send">Email to customer</Button>
//             <Button iconLeft="printer">Print</Button>
//           </>
//         }
//       />
//       <div style={{ display: 'flex', justifyContent: 'center' }}>
//         <DocumentSheet
//           docType="Pro-Forma Invoice"
//           docNumber="PF-2215"
//           issuer={{
//             name: 'ZifIQ Manufacturing Ltd',
//             address: 'Showroom Ikeja — 14 Awolowo Way, Ikeja, Lagos',
//             contact: 'sales@zifiq.com · +234 802 000 0000',
//             vatId: 'NG-VAT-4471029',
//           }}
//           party={{ name: customer.label, address: customer.address, contact: customer.contact }}
//           meta={[
//             { label: 'Issue date', value: '24 Aug 2026' },
//             { label: 'Valid until', value: '31 Aug 2026' },
//             { label: 'Prepared by', value: 'F. Adeniyi' },
//           ]}
//           columns={[
//             { key: 'product', label: 'Description' },
//             { key: 'qty', label: 'Qty', align: 'right', mono: true },
//             { key: 'unit', label: 'Unit' },
//             { key: 'price', label: 'Unit price', align: 'right', mono: true },
//             { key: 'amount', label: 'Amount', align: 'right', mono: true },
//           ]}
//           lines={lines}
//           totals={[
//             { label: 'Subtotal', value: money(subtotal) },
//             ...(discount ? [{ label: 'Discount', value: `− ${money(discount)}` }] : []),
//             { label: `VAT at ${(VAT_RATE * 100).toFixed(1)}%`, value: money(vat) },
//             { label: 'Total payable', value: money(total), emphasis: true },
//           ]}
//           stamp={<Badge tone="warning" uppercase>Quotation</Badge>}
//           footer="This pro-forma invoice is an estimate of the proposed transaction and is not a demand for payment. Prices hold until the validity date shown above, subject to stock availability at the time of confirmation."
//         />
//       </div>
//     </Page>
//   )
// }

// export default function ProFormaInvoice({ leaf, moduleLabel, parentLabel }) {
//   const [step, setStep] = useState('compose')
//   const [customerId, setCustomerId] = useState('cu-1')
//   const [rows, setRows] = useState([blank()])

//   const customer = quoteCustomers.find((c) => c.value === customerId) || quoteCustomers[0]

//   function update(i, key, value) {
//     setRows((rs) => rs.map((r, ri) => (ri === i ? { ...r, [key]: value } : r)))
//   }

//   const decorated = rows.map((r) => {
//     const price = PRICES[r.product]
//     const qty = Number(r.qty) || 0
//     const disc = Number(r.discount) || 0
//     const amount = price ? price * qty - disc : undefined
//     return {
//       ...r,
//       unit: r.product ? 'Cartons' : undefined,
//       price: price ? money(price) : undefined,
//       amount: amount != null ? money(amount) : undefined,
//     }
//   })

//   // A line discount may not exceed the line's own value.
//   const errors = rows.map((r) => {
//     const price = PRICES[r.product]
//     const qty = Number(r.qty) || 0
//     const disc = Number(r.discount) || 0
//     if (!price || !qty || !disc) return null
//     if (disc > price * qty) return { field: 'discount', message: `Discount exceeds the line value of ${money(price * qty)}.` }
//     return null
//   })

//   const columns = [
//     { key: 'product', label: 'Product', type: 'select', options: sellableProducts, width: 270, placeholder: 'Select product…' },
//     { key: 'qty', label: 'Quantity', type: 'number', width: 130, placeholder: '0' },
//     { key: 'unit', label: 'Unit', type: 'static', width: 110 },
//     { key: 'price', label: 'Unit price', type: 'static', align: 'right', width: 150 },
//     { key: 'discount', label: 'Line discount (₦)', type: 'number', width: 170, placeholder: '0.00' },
//     { key: 'amount', label: 'Amount', type: 'static', align: 'right', width: 160 },
//   ]

//   const active = rows.filter((r) => r.product)
//   const subtotal = rows.reduce((n, r) => n + (PRICES[r.product] || 0) * (Number(r.qty) || 0), 0)
//   const discount = rows.reduce((n, r) => n + (Number(r.discount) || 0), 0)
//   const netAmount = subtotal - discount
//   const vat = netAmount * VAT_RATE
//   const total = netAmount + vat
//   const blocked = errors.some(Boolean)

//   const crumbs = [moduleLabel, parentLabel, leaf?.label].filter(Boolean)

//   if (step === 'document') {
//     return (
//       <ProformaDocument
//         crumbs={crumbs}
//         customer={customer}
//         subtotal={subtotal}
//         discount={discount}
//         vat={vat}
//         total={total}
//         lines={decorated.filter((r) => r.product).map((r) => ({
//           product: sellableProducts.find((p) => p.value === r.product)?.label || r.product,
//           qty: fmt(Number(r.qty) || 0),
//           unit: 'Cartons',
//           price: money(PRICES[r.product]),
//           amount: money(PRICES[r.product] * (Number(r.qty) || 0) - (Number(r.discount) || 0)),
//         }))}
//         onBack={() => { setStep('compose'); setRows([blank()]) }}
//       />
//     )
//   }

//   const historyColumns = [
//     { key: 'ref', label: 'Reference', width: 115, mono: true },
//     { key: 'date', label: 'Issued', width: 130 },
//     { key: 'customer', label: 'Customer', width: 250 },
//     { key: 'items', label: 'Items', width: 100, align: 'right', mono: true },
//     { key: 'value', label: 'Value', width: 165, align: 'right', mono: true, render: (r) => money(r.value) },
//     { key: 'validUntil', label: 'Valid until', width: 140 },
//     {
//       key: 'status', label: 'Status', width: 130,
//       render: (r) => <Badge tone={STATUS_TONE[r.status] || 'neutral'}>{r.status}</Badge>,
//     },
//   ]

//   return (
//     <FormShell
//       wide
//       crumbs={[moduleLabel, parentLabel]}
//       title={leaf?.label || 'Pro-Forma Invoice'}
//       icon={leaf?.icon}
//       description="Prepare a quotation for a customer before the sale — products, quantities, prices and terms — so they can review the proposed transaction before paying or confirming."
//       submitLabel="Generate pro-forma"
//       onCancel={() => {}}
//       onSubmit={() => { if (!blocked && active.length) setStep('document') }}
//       note="A pro-forma is an estimate only. No sale is recorded and no stock is committed until the customer confirms and payment is taken."
//       secondaryAction={<Button variant="secondary" iconLeft="save">Save draft</Button>}
//       aside={
//         <>
//           <Panel title="Quotation summary">
//             <MetaRow label="Customer" value={customer.label} />
//             <MetaRow label="Line items" value={active.length || '—'} mono />
//             <MetaRow label="Subtotal" value={subtotal ? money(subtotal) : '—'} mono />
//             <MetaRow label="Discount" value={discount ? `− ${money(discount)}` : '—'} mono tone={discount ? 'negative' : undefined} />
//             <MetaRow label={`VAT at ${(VAT_RATE * 100).toFixed(1)}%`} value={vat ? money(vat) : '—'} mono />
//             <div style={{ marginTop: 14, padding: '14px 16px', background: 'var(--brand-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
//               <div style={{ font: 'var(--type-eyebrow)', letterSpacing: 'var(--ls-widest)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Total payable</div>
//               <div style={{ marginTop: 8, font: 'var(--fw-bold) var(--text-2xl)/1 var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: 'var(--text-strong)' }}>
//                 {money(total)}
//               </div>
//             </div>
//           </Panel>

//           <Panel title="Quotations this period">
//             <MetaRow label="Issued" value={proformaHistory.length} mono />
//             <MetaRow label="Converted to sale" value={proformaHistory.filter((p) => p.status === 'Converted').length} mono tone="positive" />
//             <MetaRow label="Value quoted" value={moneyShort(proformaHistory.reduce((n, p) => n + p.value, 0))} mono />
//           </Panel>
//         </>
//       }
//     >
//       <Panel title="Customer" description="Who the quotation is addressed to.">
//         <FieldSet columns={3}>
//           <Select label="Customer" options={quoteCustomers} value={customerId} onChange={(e) => setCustomerId(e.target.value)} />
//           <Input label="Issue date" type="date" />
//           <Input label="Valid until" type="date" hint="Prices hold until this date." />
//           <Input label="Payment terms" placeholder="e.g. 50% deposit, balance on delivery" />
//           <Input label="Delivery terms" placeholder="e.g. Delivered to customer warehouse" />
//           <Input label="Reference no." placeholder="Auto-generated" disabled value="PF-2215" />
//         </FieldSet>
//         <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
//           <Badge tone={customer.type === 'Dealer' ? 'brand' : 'neutral'}>{customer.type}</Badge>
//           <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>{customer.address}</span>
//         </div>
//       </Panel>

//       <Panel
//         title="Quoted items"
//         description="Prices default to the current selling price. Apply a line discount where terms have been agreed."
//         actions={<Button variant="secondary" size="sm" iconLeft="qr-code">Scan</Button>}
//       >
//         <LineItems
//           columns={columns}
//           rows={decorated}
//           errors={errors}
//           onChange={update}
//           onAdd={() => setRows((rs) => [...rs, blank()])}
//           onRemove={(i) => setRows((rs) => (rs.length === 1 ? rs : rs.filter((_, ri) => ri !== i)))}
//           addLabel="Add product"
//           emptyLabel="No products quoted yet."
//           summary={[
//             { label: 'Lines', value: active.length },
//             { label: 'Total', value: money(total) },
//           ]}
//         />
//       </Panel>

//       <Panel title="Recent quotations" padding={0}>
//         <ReportTable
//           columns={historyColumns}
//           rows={proformaHistory}
//           rowKey={(r) => r.ref}
//           stickyHeader={false}
//           style={{ border: 'none', borderRadius: 0 }}
//         />
//       </Panel>
//     </FormShell>
//   )
// }
import { useEffect, useState, useCallback, useRef } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import Loader from '../../ds/components/core/Loader.jsx'
import { RegisterShell } from '../shells/RegisterShell.jsx'
import { FormShell } from '../shells/FormShell.jsx'
import { Page, Panel, FieldSet, MetaRow, Callout } from '../shells/Page.jsx'
import { PageHeader } from '../shells/PageHeader.jsx'
import { LineItems } from '../shells/LineItems.jsx'
import { DocumentSheet } from '../shells/DocumentView.jsx'
import { useStore } from '../store.jsx'
import { fmt, money, moneyShort, fmtDate } from '../utils.js'
import CashierApi from '../../api/CashierApi.js'
import CustomerApi from '../../api/CustomerApi.js'
import ShowroomApi from '../../api/ShowroomApi.js'
import InventoryApi from '../../api/InventoryApi.js'

const cashierApi = new CashierApi()
const customerApi = new CustomerApi()
const showroomApi = new ShowroomApi()
const inventoryApi = new InventoryApi()

const PAGE_SIZE = 20

/* ------------------------------------------------------------------ */
/*  Status / action maps                                               */
/* ------------------------------------------------------------------ */
// Action list drives which buttons appear on the detail view for a given
// status. All actions are available as methods on CashierApi.
const STATUS_CONFIG = {
  DRAFT: {
    label: 'Draft',
    tone: 'neutral',
    actions: ['edit', 'send', 'cancel'],
  },
  PENDING_DISCOUNT_APPROVAL: {
    label: 'Discount pending',
    tone: 'warning',
    actions: ['approve-discount', 'reject-discount'],
  },
  PENDING: {
    label: 'Pending discount',
    tone: 'warning',
    actions: ['approve-discount', 'reject-discount'],
  },
  SENT: {
    label: 'Sent',
    tone: 'info',
    actions: ['convert', 'decline', 'cancel'],
  },
  CONVERTED: {
    label: 'Converted',
    tone: 'success',
    actions: ['reissue'],
  },
  DECLINED: {
    label: 'Declined',
    tone: 'danger',
    actions: ['reissue'],
  },
  EXPIRED: {
    label: 'Expired',
    tone: 'neutral',
    actions: ['reissue'],
  },
  CANCELLED: {
    label: 'Cancelled',
    tone: 'neutral',
    actions: [],
  },
}

const CONVERT_OPTIONS = [
  { value: 'INVOICE', label: 'Invoice' },
  { value: 'CASH_SALE', label: 'Cash sale' },
  { value: 'CREDIT_SALE', label: 'Credit sale' },
]

const STATUS_FILTER_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'PENDING_DISCOUNT_APPROVAL', label: 'Discount pending' },
  { value: 'SENT', label: 'Sent' },
  { value: 'CONVERTED', label: 'Converted' },
  { value: 'DECLINED', label: 'Declined' },
  { value: 'EXPIRED', label: 'Expired' },
  { value: 'CANCELLED', label: 'Cancelled' },
]

const normStatus = (s) => String(s || 'DRAFT').toUpperCase()
const statusOf = (s) =>
  STATUS_CONFIG[normStatus(s)] || {
    label: s || '—',
    tone: 'neutral',
    actions: [],
  }

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
const today = () => new Date().toISOString().slice(0, 10)
const plusDays = (iso, days) => {
  const d = new Date(iso)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}
const toDateOnly = (iso) =>
  iso ? String(iso).slice(0, 10) : ''

function val(payload) {
  if (payload == null) return payload
  if (typeof payload === 'object') {
    if (payload.target && 'value' in payload.target) return payload.target.value
    if ('value' in payload) return payload.value
  }
  return payload
}

const blankLine = () => ({
  id: Math.random().toString(36).slice(2),
  product: '',
  qty: '',
  discount: '',
})

/* ------------------------------------------------------------------ */
/*  Prompt for products that have never been price-listed              */
/* ------------------------------------------------------------------ */
function UnlistedProductCallout({ product, onPublished }) {
  const { showToast } = useStore()
  const [open, setOpen] = useState(false)
  const [retail, setRetail] = useState('')
  const [dealer, setDealer] = useState('')
  const [effectiveFrom, setEffectiveFrom] = useState(today())
  const [saving, setSaving] = useState(false)

  const canSave =
    Number(retail) > 0 && Number(dealer) > 0 && effectiveFrom && !saving

  async function publish() {
    if (!canSave) return
    setSaving(true)
    try {
      const res = await inventoryApi.publishPriceList({
        effectiveFrom,
        note: 'Initial price listing (created from pro-forma)',
        entries: [
          {
            stockItemId: product.id,
            retailPrice: Number(retail),
            dealerPrice: Number(dealer),
          },
        ],
      })
      showToast(
        'Price listing created',
        res?.data?.belowCostCount > 0
          ? `${product.name} is now listed, but a price is below cost.`
          : `${product.name} is now listed.`
      )
      onPublished(product.id)
    } catch (e) {
      showToast('Could not create price listing', e.message, true)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Callout
      tone="warning"
      icon="circle-alert"
      title={`${product.name}${
        product.code ? ` (${product.code})` : ''
      } has no price listing`}
      style={{ marginBottom: 14 }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          This product has never been price-listed, so a quotation can't be
          priced reliably. Create a price listing for it, or remove it from the
          quote.
        </div>

        {!open ? (
          <div>
            <Button
              variant="secondary"
              iconLeft="plus"
              onClick={() => setOpen(true)}
            >
              Create price listing
            </Button>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              gap: 12,
              alignItems: 'flex-end',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ width: 160 }}>
              <Input
                label="Retail price (₦) *"
                type="number"
                placeholder="0.00"
                value={retail}
                onChange={(e) => setRetail(val(e))}
              />
            </div>
            <div style={{ width: 160 }}>
              <Input
                label="Dealer price (₦) *"
                type="number"
                placeholder="0.00"
                value={dealer}
                onChange={(e) => setDealer(val(e))}
              />
            </div>
            <div style={{ width: 170 }}>
              <Input
                label="Effective from *"
                type="date"
                value={effectiveFrom}
                onChange={(e) => setEffectiveFrom(val(e))}
              />
            </div>
            <Button iconLeft="check" onClick={publish} disabled={!canSave}>
              {saving ? 'Publishing…' : 'Publish'}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    </Callout>
  )
}

/* ------------------------------------------------------------------ */
/*  Create / Edit form                                                 */
/* ------------------------------------------------------------------ */
function ProformaForm({
  mode,
  proforma,
  crumbs,
  showrooms,
  customers,
  onBack,
  onDone,
}) {
  const { showToast } = useStore()
  const isEdit = mode === 'edit'
  const [sendOnCreate, setSendOnCreate] = useState(true)
  const [locationId, setLocationId] = useState(
    proforma?.location?.id || ''
  )
  const [customerId, setCustomerId] = useState(
    proforma?.customer?.id || ''
  )
  const [issueDate, setIssueDate] = useState(
    toDateOnly(proforma?.issueDate) || today()
  )
  const [validUntil, setValidUntil] = useState(
    toDateOnly(proforma?.validUntil) || plusDays(today(), 7)
  )
  const [paymentTerms, setPaymentTerms] = useState(
    proforma?.paymentTerms || ''
  )
  const [deliveryTerms, setDeliveryTerms] = useState(
    proforma?.deliveryTerms || ''
  )
  const [note, setNote] = useState(proforma?.note || '')

  const [rows, setRows] = useState(
    proforma?.lines?.length
      ? proforma.lines.map((l) => ({
          id: Math.random().toString(36).slice(2),
          product: l.stockItem?.id || '',
          qty: String(l.quantity ?? ''),
          discount: String(l.lineDiscount ?? ''),
        }))
      : [blankLine()]
  )

  const [products, setProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Price-list check state: id -> 'checking' | 'listed' | 'unlisted' | 'error'
  const [priceStatus, setPriceStatus] = useState({})
  const [productsReloadKey, setProductsReloadKey] = useState(0)
  const checkedIds = useRef(new Set())

  const checkListing = useCallback(
    async (stockItemId, force = false) => {
      if (!force && checkedIds.current.has(stockItemId)) return
      checkedIds.current.add(stockItemId)
      setPriceStatus((s) => ({ ...s, [stockItemId]: 'checking' }))
      try {
        const res = await inventoryApi.listPriceListProductHistory({
          stockItemId,
          page: 0,
          size: 1,
        })
        const d = res?.data
        const list = Array.isArray(d) ? d : d?.items ?? d?.content ?? []
        setPriceStatus((s) => ({
          ...s,
          [stockItemId]: list.length ? 'listed' : 'unlisted',
        }))
      } catch (e) {
        checkedIds.current.delete(stockItemId)
        setPriceStatus((s) => ({ ...s, [stockItemId]: 'error' }))
        showToast('Could not check price list', e.message, true)
      }
    },
    [showToast]
  )

  // Check every product that appears on a line (new picks and edit-mode lines)
  const productKey = [
    ...new Set(rows.map((r) => r.product).filter(Boolean)),
  ].join(',')
  useEffect(() => {
    if (!productKey) return
    productKey.split(',').forEach((id) => checkListing(id))
  }, [productKey, checkListing])

  function handlePriceListed(stockItemId) {
    checkListing(stockItemId, true)
    setProductsReloadKey((k) => k + 1) // refresh products so the unit price updates
  }

  // Load finished products for the selected showroom
  useEffect(() => {
    if (!locationId) {
      setProducts([])
      return
    }
    let cancelled = false
    setLoadingProducts(true)
    inventoryApi
      .listStockItems(locationId, 'OUTSOURCED', { size: 200 })
      .then((res) => {
        if (cancelled) return
        const list = res.data?.items || []
        setProducts(list)
      })
      .catch(() => !cancelled && setProducts([]))
      .finally(() => !cancelled && setLoadingProducts(false))
    return () => {
      cancelled = true
    }
  }, [locationId, productsReloadKey])

  const productByValue = Object.fromEntries(
    products.map((p) => [p.id, p])
  )
  const customer = customers.find((c) => c.value === customerId)

  const productOptions = products.map((p) => ({
    value: p.id,
    label: `${p.name} · ${p.code}${
      p.markupCost ? ` — ${money(p.markupCost)}` : ''
    }`,
  }))

  function unitPriceOf(productId) {
    const p = productByValue[productId]
    if (!p) return 0
    return Number(p.markupCost) || Number(p.landingCost) || 0
  }

  function update(i, key, value) {
    setRows((rs) =>
      rs.map((r, ri) => (ri === i ? { ...r, [key]: value } : r))
    )
  }

  const decorated = rows.map((r) => {
    const unitPrice = unitPriceOf(r.product)
    const qty = Number(r.qty) || 0
    const disc = Number(r.discount) || 0
    const amount = unitPrice ? unitPrice * qty - disc : undefined
    return {
      ...r,
      unit: r.product ? productByValue[r.product]?.unitOfMeasure?.name || '' : '',
      price: unitPrice ? money(unitPrice) : undefined,
      amount: amount != null ? money(amount) : undefined,
    }
  })

  // Line-level validation — same idea as the sample
  const errors = rows.map((r) => {
    const unitPrice = unitPriceOf(r.product)
    const qty = Number(r.qty) || 0
    const disc = Number(r.discount) || 0
    if (!unitPrice || !qty || !disc) return null
    if (disc > unitPrice * qty) {
      return {
        field: 'discount',
        message: `Discount exceeds the line value of ${money(
          unitPrice * qty
        )}.`,
      }
    }
    return null
  })

  const columns = [
    {
      key: 'product',
      label: 'Product',
      type: 'select',
      options: productOptions,
      width: 200,
      placeholder: loadingProducts ? 'Loading…' : 'Select product…',
    },
    { key: 'qty', label: 'Quantity', type: 'number', width: 130, placeholder: '0' },
    { key: 'unit', label: 'Unit', type: 'static', width: 110 },
    { key: 'price', label: 'Unit price', type: 'static', align: 'right', width: 150 },
    {
      key: 'discount',
      label: 'Line discount (₦)',
      type: 'number',
      width: 170,
      placeholder: '0.00',
    },
    {
      key: 'amount',
      label: 'Amount',
      type: 'static',
      align: 'right',
      width: 160,
    },
  ]

  const active = rows.filter((r) => r.product)

  // Price-listing status for products currently on the quote
  const activeIds = [...new Set(active.map((r) => r.product))]
  const checkingListing = activeIds.some((id) => priceStatus[id] === 'checking')
  const unlistedProducts = activeIds
    .filter((id) => priceStatus[id] === 'unlisted')
    .map(
      (id) =>
        productByValue[id] || { id, name: 'Selected product', code: '' }
    )

  const subtotal = rows.reduce(
    (n, r) => n + unitPriceOf(r.product) * (Number(r.qty) || 0),
    0
  )
  const discount = rows.reduce(
    (n, r) => n + (Number(r.discount) || 0),
    0
  )
  const total = subtotal - discount
  const blocked = errors.some(Boolean)

  const missingFields = []
  if (!locationId) missingFields.push('Showroom')
  if (!customerId) missingFields.push('Customer')
  if (!issueDate) missingFields.push('Issue date')
  if (!validUntil) missingFields.push('Valid until')
  if (active.length === 0) missingFields.push('At least one line item')
  if (checkingListing) missingFields.push('Checking price listings…')
  unlistedProducts.forEach((p) =>
    missingFields.push(`Price listing for ${p.name}`)
  )

  const canSubmit = missingFields.length === 0 && !blocked && !submitting

  async function submit(send) {
    if (!canSubmit) return
    setSubmitting(true)
    try {
      const body = {
        locationId,
        customerId,
        prospect: {
          name: customer?.label?.split(' · ')[1] || '',
          address: '',
          contact: customer?.phone || '',
          email: customer?.email || '',
        },
        issueDate,
        validUntil,
        paymentTerms: paymentTerms.trim(),
        deliveryTerms: deliveryTerms.trim(),
        note: note.trim(),
        lines: rows
          .filter((r) => r.product)
          .map((r) => ({
            stockItemId: r.product,
            quantity: Number(r.qty) || 0,
            lineDiscount: Number(r.discount) || 0,
          })),
      }

      if (isEdit) {
        await cashierApi.editProformasQuotation(proforma.id, body)
        showToast('Pro-forma updated', `${proforma.ref} saved.`)
      } else {
        await cashierApi.createProformasQuotation(send, body)
        showToast(
          send ? 'Pro-forma sent' : 'Pro-forma saved',
          send
            ? 'The quotation has been created and sent to the customer.'
            : 'Draft saved. You can send it from the detail view when ready.'
        )
      }
      onDone()
    } catch (e) {
      showToast(
        isEdit ? 'Could not update pro-forma' : 'Could not create pro-forma',
        e.message,
        true
      )
    } finally {
      setSubmitting(false)
    }
  }

  const showroomOptions = [
    { value: '', label: 'Select showroom…' },
    ...showrooms,
  ]
  const customerOptions = [
    { value: '', label: 'Select customer…' },
    ...customers,
  ]

  return (
    <>
      {submitting && (
        <Loader
          overlay
          label={isEdit ? 'Saving changes…' : 'Creating pro-forma…'}
        />
      )}
      <FormShell
        wide
        crumbs={crumbs}
        title={
          isEdit
            ? `Edit ${proforma?.ref || 'pro-forma'}`
            : 'New pro-forma invoice'
        }
        icon={isEdit ? 'edit' : 'file-text'}
        description={
          isEdit
            ? 'Update this draft pro-forma. Changes are saved without re-sending — use Send when ready.'
            : 'Prepare a quotation for a customer before the sale — products, quantities, prices and terms — so they can review the proposed transaction before paying or confirming.'
        }
        headerActions={
          <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>
            Back
          </Button>
        }
        submitLabel={isEdit ? 'Save changes' : sendOnCreate ? 'Create & send' : 'Save draft'}
onSubmit={() => submit(sendOnCreate)}
onCancel={onBack}
submitDisabled={!canSubmit}
secondaryAction={null}
        note={
          isEdit
            ? 'Editing a draft keeps it as a draft. Send it to the customer from the detail view when ready.'
            : 'A pro-forma is an estimate only. No sale is recorded and no stock is committed until the customer confirms and payment is taken.'
        }
        aside={
          <Panel title="Quotation summary">
            <MetaRow
              label="Customer"
              value={customer?.label || '—'}
            />
            <MetaRow label="Line items" value={active.length || '—'} mono />
            <MetaRow
              label="Subtotal"
              value={subtotal ? money(subtotal) : '—'}
              mono
            />
            <MetaRow
              label="Discount"
              value={discount ? `− ${money(discount)}` : '—'}
              mono
              tone={discount ? 'negative' : undefined}
            />
            <div
              style={{
                marginTop: 14,
                padding: '14px 16px',
                background: 'var(--brand-subtle)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <div
                style={{
                  font: 'var(--type-eyebrow)',
                  letterSpacing: 'var(--ls-widest)',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                }}
              >
                Total (VAT applied on save)
              </div>
              <div
                style={{
                  marginTop: 8,
                  font: 'var(--fw-bold) var(--text-2xl)/1 var(--font-mono)',
                  fontVariantNumeric: 'tabular-nums',
                  color: 'var(--text-strong)',
                }}
              >
                {money(total)}
              </div>
            </div>
          </Panel>
        }
      >
        {missingFields.length > 0 && (
          <Callout
            tone="warning"
            icon="circle-alert"
            title="Complete these fields to enable submit"
            style={{ marginBottom: 14 }}
          >
            {missingFields.join(' · ')}
          </Callout>
        )}

        {unlistedProducts.map((p) => (
          <UnlistedProductCallout
            key={p.id}
            product={p}
            onPublished={handlePriceListed}
          />
        ))}

        <Panel
          title="Customer"
          description="Who the quotation is addressed to."
        >
          <FieldSet columns={2}>
            <Select
              label="Showroom *"
              options={showroomOptions}
              value={locationId}
              onChange={(v) => setLocationId(val(v))}
            />
            <Select
              label="Customer *"
              options={customerOptions}
              value={customerId}
              onChange={(v) => setCustomerId(val(v))}
            />
            <Input
              label="Issue date *"
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(val(e))}
            />
            <Input
              label="Valid until *"
              type="date"
              value={validUntil}
              onChange={(e) => setValidUntil(val(e))}
              hint="Prices hold until this date."
            />
            <Input
              label="Payment terms"
              placeholder="e.g. 50% deposit, balance on delivery"
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(val(e))}
            />
            <Input
              label="Delivery terms"
              placeholder="e.g. Delivered to customer warehouse"
              value={deliveryTerms}
              onChange={(e) => setDeliveryTerms(val(e))}
            />
          </FieldSet>
        </Panel>

        <Panel
          title="Quoted items"
          description="Prices come from the product's current markup. Apply a line discount where terms have been agreed."
        >
          <LineItems
            columns={columns}
            rows={decorated}
            errors={errors}
            onChange={update}
            onAdd={() => setRows((rs) => [...rs, blankLine()])}
            onRemove={(i) =>
              setRows((rs) =>
                rs.length === 1 ? rs : rs.filter((_, ri) => ri !== i)
              )
            }
            addLabel="Add product"
            emptyLabel="No products quoted yet."
            summary={[
              { label: 'Lines', value: active.length },
              { label: 'Total', value: money(total) },
            ]}
          />
        </Panel>
            {!isEdit && (
  <Panel title="Delivery">
    <label
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        cursor: 'pointer',
        font: 'var(--type-body)',
        color: 'var(--text-strong)',
      }}
    >
      <input
        type="checkbox"
        checked={sendOnCreate}
        onChange={(e) => setSendOnCreate(e.target.checked)}
        style={{ marginTop: 3, width: 16, height: 16, cursor: 'pointer' }}
      />
      <span>
        Send to customer on creation
        <span
          style={{
            display: 'block',
            font: 'var(--type-caption)',
            color: 'var(--text-muted)',
            marginTop: 2,
          }}
        >
          Untick to save as a draft. You can send it later from the detail view.
        </span>
      </span>
    </label>
  </Panel>
)}
        <Panel title="Note">
          <textarea
            rows={3}
            placeholder="Any additional terms or remarks to include on the quotation."
            value={note}
            onChange={(e) => setNote(val(e))}
            style={{
              width: '100%',
              padding: '10px 12px',
              resize: 'vertical',
              background: 'var(--surface-card)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-control)',
              font: 'var(--fw-regular) var(--text-sm)/1.5 var(--font-ui)',
              color: 'var(--text-strong)',
              outline: 'none',
            }}
          />
        </Panel>
      </FormShell>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Document preview                                                   */
/* ------------------------------------------------------------------ */
function ProformaDocument({ proforma, crumbs, onBack, onPrint }) {
  if (!proforma) return null

  const lines = (proforma.lines || []).map((l) => ({
    product: l.name || l.stockItem?.name || '—',
    qty: fmt(l.quantity || 0),
    unit: l.unit || '—',
    price: money(l.unitPrice || 0),
    amount: money((l.unitPrice || 0) * (l.quantity || 0)),
  }))

  return (
    <Page>
      <PageHeader
        crumbs={crumbs}
        title="Pro-forma invoice"
        icon="file-text"
        description="A preliminary quotation for the customer to review before payment or confirmation. It does not record a sale and no stock is committed."
        meta={<Badge tone="info">{proforma.ref} · Quotation</Badge>}
        actions={
          <>
            <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>
              Back
            </Button>
            <Button iconLeft="printer" onClick={onPrint}>
              Print
            </Button>
          </>
        }
      />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <DocumentSheet
          docType="Pro-Forma Invoice"
          docNumber={proforma.ref}
          issuer={{
            name: proforma.location?.name || 'Company',
            address: proforma.location?.name || '',
            contact: '',
            vatId: '',
          }}
          party={{
            name:
              proforma.customerName ||
              proforma.customer?.name ||
              proforma.prospect?.name ||
              '—',
            address: proforma.prospect?.address || '',
            contact:
              proforma.prospect?.contact ||
              proforma.prospect?.email ||
              '',
          }}
          meta={[
            {
              label: 'Issue date',
              value: toDateOnly(proforma.issueDate)
                ? fmtDate(proforma.issueDate)
                : '—',
            },
            {
              label: 'Valid until',
              value: toDateOnly(proforma.validUntil)
                ? fmtDate(proforma.validUntil)
                : '—',
            },
            {
              label: 'Prepared by',
              value: proforma.preparedBy?.name || '—',
            },
          ]}
          columns={[
            { key: 'product', label: 'Description' },
            { key: 'qty', label: 'Qty', align: 'right', mono: true },
            { key: 'unit', label: 'Unit' },
            { key: 'price', label: 'Unit price', align: 'right', mono: true },
            { key: 'amount', label: 'Amount', align: 'right', mono: true },
          ]}
          lines={lines}
          totals={[
            { label: 'Subtotal', value: money(proforma.totals?.gross || 0) },
            ...((proforma.totals?.discount || 0) > 0
              ? [
                  {
                    label: 'Discount',
                    value: `− ${money(proforma.totals.discount)}`,
                  },
                ]
              : []),
            ...(proforma.totals?.vatEnabled !== false
              ? [
                  {
                    label: `VAT at ${(
                      (proforma.totals?.vatRate || 0) * 100
                    ).toFixed(1)}%`,
                    value: money(proforma.totals?.vat || 0),
                  },
                ]
              : []),
            {
              label: 'Total payable',
              value: money(proforma.totals?.total || 0),
              emphasis: true,
            },
          ]}
          stamp={<Badge tone="warning" uppercase>Quotation</Badge>}
          footer="This pro-forma invoice is an estimate of the proposed transaction and is not a demand for payment. Prices hold until the validity date shown above, subject to stock availability at the time of confirmation."
        />
      </div>
    </Page>
  )
}

/* ------------------------------------------------------------------ */
/*  Detail view                                                        */
/* ------------------------------------------------------------------ */
function ProformaDetail({
  proforma,
  loading,
  crumbs,
  onBack,
  onAction,
  onEdit,
  onViewDocument,
  onRefresh,
}) {
  if (loading || !proforma) {
    return (
      <>
        {loading && <Loader overlay label="Loading pro-forma…" />}
        <FormShell
          crumbs={crumbs}
          title="Loading…"
          icon="file-text"
          submitLabel={null}
          onCancel={onBack}
          headerActions={
            <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>
              Back to list
            </Button>
          }
        >
          <Panel title="Details">
            <div style={{ color: 'var(--text-muted)', padding: 12 }}>
              Loading…
            </div>
          </Panel>
        </FormShell>
      </>
    )
  }

  const config = statusOf(proforma.status)
  const actions = config.actions || []

  const actionButtons = (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Button
        variant="secondary"
        iconLeft="rotate-cw"
        onClick={onRefresh}
      >
        Refresh
      </Button>
      <Button
        variant="secondary"
        iconLeft="printer"
        onClick={onViewDocument}
      >
        Preview
      </Button>
      {actions.includes('edit') && (
        <Button variant="secondary" iconLeft="pencil" onClick={onEdit}>
          Edit
        </Button>
      )}
      {actions.includes('send') && (
        <Button onClick={() => onAction('send')}>Send</Button>
      )}
      {actions.includes('approve-discount') && (
        <Button onClick={() => onAction('approve-discount')}>
          Approve discount
        </Button>
      )}
      {actions.includes('reject-discount') && (
        <Button
          variant="secondary"
          onClick={() => onAction('reject-discount')}
        >
          Reject discount
        </Button>
      )}
      {actions.includes('convert') && (
        <Button onClick={() => onAction('convert')}>Convert to sale</Button>
      )}
      {actions.includes('decline') && (
        <Button
          variant="secondary"
          onClick={() => onAction('decline')}
        >
          Decline
        </Button>
      )}
      {actions.includes('cancel') && (
        <Button
          variant="secondary"
          onClick={() => onAction('cancel')}
        >
          Cancel
        </Button>
      )}
      {actions.includes('reissue') && (
        <Button onClick={() => onAction('reissue')}>Reissue</Button>
      )}
      <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>
        Back to list
      </Button>
    </div>
  )

  return (
    <FormShell
      wide
      crumbs={crumbs}
      title={`${proforma.ref} — ${
        proforma.customerName || proforma.customer?.name || '—'
      }`}
      icon="file-text"
      description={`Issued ${fmtDate(proforma.issueDate)} · Valid until ${fmtDate(
        proforma.validUntil
      )}`}
      submitLabel={null}
      onCancel={onBack}
      headerActions={actionButtons}
      aside={
        <Panel title="Status & totals">
          <MetaRow
            label="Status"
            value={<Badge tone={config.tone}>{config.label}</Badge>}
          />
          <MetaRow
            label="Customer type"
            value={proforma.customerType || '—'}
          />
          <MetaRow
            label="Price basis"
            value={proforma.priceBasis || '—'}
          />
          <MetaRow
            label="Subtotal"
            value={money(proforma.totals?.gross || 0)}
            mono
          />
          <MetaRow
            label="Discount"
            value={
              (proforma.totals?.discount || 0) > 0
                ? `− ${money(proforma.totals.discount)}`
                : '—'
            }
            mono
          />
          <MetaRow
            label="Net"
            value={money(proforma.totals?.net || 0)}
            mono
          />
          <MetaRow
            label={`VAT (${(
              (proforma.totals?.vatRate || 0) * 100
            ).toFixed(1)}%)`}
            value={money(proforma.totals?.vat || 0)}
            mono
          />
          <MetaRow
            label="Total"
            value={money(proforma.totals?.total || 0)}
            mono
          />
          {proforma.convertedSale && (
            <MetaRow
              label="Converted to"
              value={`${proforma.convertedSale.code} · ${proforma.convertedSale.name}`}
            />
          )}
        </Panel>
      }
    >
      <Panel title="Customer">
        <FieldSet columns={2}>
          <MetaRow
            label="Customer"
            value={proforma.customerName || proforma.customer?.name || '—'}
          />
          <MetaRow
            label="Customer code"
            value={proforma.customer?.code || '—'}
            mono
          />
          <MetaRow
            label="Prepared by"
            value={proforma.preparedBy?.name || '—'}
          />
          <MetaRow
            label="Location"
            value={proforma.location?.name || '—'}
          />
        </FieldSet>
      </Panel>

      {proforma.prospect && (proforma.prospect.name || proforma.prospect.address) && (
        <Panel title="Deliver to">
          <FieldSet columns={2}>
            <MetaRow label="Name" value={proforma.prospect.name || '—'} />
            <MetaRow
              label="Contact"
              value={proforma.prospect.contact || '—'}
            />
            <MetaRow label="Email" value={proforma.prospect.email || '—'} />
            <MetaRow
              label="Address"
              value={proforma.prospect.address || '—'}
            />
          </FieldSet>
        </Panel>
      )}

      <Panel title="Terms">
        <FieldSet columns={2}>
          <MetaRow
            label="Payment terms"
            value={proforma.paymentTerms || '—'}
          />
          <MetaRow
            label="Delivery terms"
            value={proforma.deliveryTerms || '—'}
          />
          <MetaRow
            label="Issue date"
            value={fmtDate(proforma.issueDate)}
          />
          <MetaRow
            label="Valid until"
            value={fmtDate(proforma.validUntil)}
          />
        </FieldSet>
        {proforma.note && (
          <div style={{ marginTop: 14 }}>
            <div
              style={{
                font: 'var(--type-label)',
                color: 'var(--text-strong)',
                marginBottom: 6,
              }}
            >
              Note
            </div>
            <div
              style={{
                font: 'var(--type-body)',
                color: 'var(--text-strong)',
                lineHeight: 1.6,
              }}
            >
              {proforma.note}
            </div>
          </div>
        )}
      </Panel>

      <Panel title="Line items" padding={0}>
        <div style={{ padding: '8px 16px 16px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'minmax(200px, 2fr) 90px 90px 130px 130px 130px 140px',
              gap: 10,
              padding: '10px 0',
              borderBottom: '1px solid var(--border-default)',
              font: 'var(--type-eyebrow)',
              letterSpacing: 'var(--ls-widest)',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
            }}
          >
            <div>Product</div>
            <div style={{ textAlign: 'right' }}>Qty</div>
            <div>Unit</div>
            <div style={{ textAlign: 'right' }}>Unit price</div>
            <div style={{ textAlign: 'right' }}>Discount</div>
            <div style={{ textAlign: 'right' }}>VAT</div>
            <div style={{ textAlign: 'right' }}>Line total</div>
          </div>
          {(proforma.lines || []).map((l, i) => (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'minmax(200px, 2fr) 90px 90px 130px 130px 130px 140px',
                gap: 10,
                padding: '10px 0',
                borderBottom: '1px solid var(--border-subtle)',
                font: 'var(--type-body)',
                color: 'var(--text-strong)',
              }}
            >
              <div>
                {l.name || l.stockItem?.name || '—'}
                {l.availabilityWarning && (
                  <Badge tone="warning" style={{ marginLeft: 8 }}>
                    Low stock
                  </Badge>
                )}
              </div>
              <div
                style={{
                  textAlign: 'right',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {fmt(l.quantity || 0)}
              </div>
              <div>{l.unit || '—'}</div>
              <div
                style={{
                  textAlign: 'right',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {money(l.unitPrice || 0)}
              </div>
              <div
                style={{
                  textAlign: 'right',
                  fontFamily: 'var(--font-mono)',
                  color: l.lineDiscount
                    ? 'var(--danger)'
                    : 'inherit',
                }}
              >
                {l.lineDiscount ? `− ${money(l.lineDiscount)}` : '—'}
              </div>
              <div
                style={{
                  textAlign: 'right',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {money(l.vatAmount || 0)}
              </div>
              <div
                style={{
                  textAlign: 'right',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                }}
              >
                {money(l.lineTotal || 0)}
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {proforma.declineReason && (
        <Callout tone="danger" icon="circle-alert" title="Decline reason">
          {proforma.declineReason}
        </Callout>
      )}

      {proforma.convertedSale && (
        <Callout
          tone="success"
          icon="check-check"
          title="Converted to sale"
        >
          This pro-forma has been converted into{' '}
          <strong>
            {proforma.convertedSale.code} · {proforma.convertedSale.name}
          </strong>
          . Reissue to create a fresh draft at today's prices if needed.
        </Callout>
      )}
    </FormShell>
  )
}

/* ------------------------------------------------------------------ */
/*  Action dialog (decline / cancel / reject-discount / convert)       */
/* ------------------------------------------------------------------ */
function ActionDialog({
  action,
  proforma,
  crumbs,
  onBack,
  onDone,
}) {
  const { showToast } = useStore()

  const [reason, setReason] = useState('')
  const [issueAs, setIssueAs] = useState('INVOICE')
  const [paymentTermsDays, setPaymentTermsDays] = useState('30')
  const [paymentTermsNote, setPaymentTermsNote] = useState('')
  const [creditOverrideReason, setCreditOverrideReason] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const CONFIG = {
    decline: {
      title: `Decline ${proforma.ref}`,
      icon: 'x',
      submitLabel: 'Decline',
      description:
        'Mark this pro-forma as declined by the customer. It will no longer be convertible to a sale, but can be reissued as a fresh draft.',
      needsReason: true,
    },
    cancel: {
      title: `Cancel ${proforma.ref}`,
      icon: 'ban',
      submitLabel: 'Cancel pro-forma',
      description:
        'Withdraw this pro-forma. The customer will no longer be able to convert it to a sale.',
      needsReason: true,
    },
    'reject-discount': {
      title: `Reject discount on ${proforma.ref}`,
      icon: 'x',
      submitLabel: 'Reject discount',
      description:
        'Send this pro-forma back to draft so the submitter can reduce the line discounts.',
      needsReason: true,
    },
    convert: {
      title: `Convert ${proforma.ref} to a sale`,
      icon: 'check-check',
      submitLabel: 'Convert to sale',
      description:
        'Convert this pro-forma into a sale. The customer must be within their credit limit unless an override reason is provided.',
      needsReason: false,
    },
  }[action]

  if (!CONFIG) return null

  const missing = []
  if (CONFIG.needsReason && !reason.trim()) missing.push('Reason')
  if (action === 'convert') {
    if (!issueAs) missing.push('Issue as')
    if (!paymentTermsDays) missing.push('Payment terms (days)')
  }

  const canSubmit = missing.length === 0 && !submitting

  async function submit() {
    if (!canSubmit) return
    setSubmitting(true)
    try {
      if (action === 'decline') {
        await cashierApi.declineProformasQuotation(proforma.id, {
          reason: reason.trim(),
        })
      } else if (action === 'cancel') {
        await cashierApi.cancelProformasQuotation(
          proforma.id,
          reason.trim()
        )
      } else if (action === 'reject-discount') {
        await cashierApi.rejectDiscountProformasQuotation(proforma.id, {
          reason: reason.trim(),
        })
      } else if (action === 'convert') {
        await cashierApi.convertProformasQuotation(proforma.id, {
          issueAs,
          paymentTermsDays: Number(paymentTermsDays) || 0,
          paymentTermsNote: paymentTermsNote.trim(),
          creditOverrideReason: creditOverrideReason.trim(),
        })
      }
      showToast('Action complete', `${proforma.ref} has been updated.`)
      onDone()
    } catch (e) {
      showToast(`Could not ${action.replace('-', ' ')}`, e.message, true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {submitting && <Loader overlay label="Processing…" />}
      <FormShell
        wide
        crumbs={crumbs}
        title={CONFIG.title}
        icon={CONFIG.icon}
        description={CONFIG.description}
        headerActions={
          <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>
            Back
          </Button>
        }
        submitLabel={CONFIG.submitLabel}
        onSubmit={submit}
        onCancel={onBack}
        submitDisabled={!canSubmit}
        aside={
          <Panel title="Pro-forma">
            <MetaRow label="Ref" value={proforma.ref} mono />
            <MetaRow
              label="Customer"
              value={proforma.customerName || proforma.customer?.name || '—'}
            />
            <MetaRow
              label="Total"
              value={money(proforma.totals?.total || 0)}
              mono
            />
            <MetaRow
              label="Status"
              value={
                <Badge tone={statusOf(proforma.status).tone}>
                  {statusOf(proforma.status).label}
                </Badge>
              }
            />
          </Panel>
        }
      >
        {missing.length > 0 && (
          <Callout
            tone="warning"
            icon="circle-alert"
            title="Complete these fields to enable submit"
            style={{ marginBottom: 14 }}
          >
            {missing.join(' · ')}
          </Callout>
        )}

        {action === 'convert' && (
          <Panel title="Conversion details">
            <FieldSet columns={2}>
              <Select
                label="Issue as *"
                options={CONVERT_OPTIONS}
                value={issueAs}
                onChange={(v) => setIssueAs(val(v))}
              />
              <Input
                label="Payment terms (days) *"
                type="number"
                placeholder="30"
                value={paymentTermsDays}
                onChange={(e) => setPaymentTermsDays(val(e))}
              />
              <Input
                label="Payment terms note"
                placeholder="Optional note shown on the resulting document"
                value={paymentTermsNote}
                onChange={(e) => setPaymentTermsNote(val(e))}
              />
              <Input
                label="Credit override reason"
                placeholder="Required only if the customer is over their credit limit"
                value={creditOverrideReason}
                onChange={(e) => setCreditOverrideReason(val(e))}
              />
            </FieldSet>
          </Panel>
        )}

        {CONFIG.needsReason && (
          <Panel
            title="Reason"
            description="Recorded against the pro-forma and visible to the customer and staff."
          >
            <textarea
              rows={4}
              placeholder={
                action === 'decline'
                  ? 'Why did the customer decline?'
                  : action === 'cancel'
                    ? 'Why is this pro-forma being cancelled?'
                    : 'Why is the line discount being rejected?'
              }
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                resize: 'vertical',
                background: 'var(--surface-card)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-control)',
                font: 'var(--fw-regular) var(--text-sm)/1.5 var(--font-ui)',
                color: 'var(--text-strong)',
                outline: 'none',
              }}
            />
          </Panel>
        )}
      </FormShell>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */
export default function ProFormaInvoice({ leaf, moduleLabel, parentLabel }) {
  const { showToast } = useStore()
  const crumbs = [moduleLabel, parentLabel, leaf?.label].filter(Boolean)

  const [mode, setMode] = useState('list')
  const [active, setActive] = useState(null)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [actionType, setActionType] = useState(null)

  // List state
  const [rows, setRows] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)

  // Filters
  const [statusFilter, setStatusFilter] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')

  // Lookups
  const [showrooms, setShowrooms] = useState([])
  const [customers, setCustomers] = useState([])
  const [loadingLookups, setLoadingLookups] = useState(true)

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 200)
    return () => clearTimeout(t)
  }, [searchInput])

  // Load lookups once
  useEffect(() => {
    let cancelled = false
    setLoadingLookups(true)
    Promise.all([
      showroomApi
        .lookupPickerWithAreas({ status: ['ACTIVE'] })
        .catch(() => ({ data: [] })),
      customerApi
        .listCustomers({ page: 0, size: 200 })
        .catch(() => ({ data: { items: [] } })),
    ])
      .then(([showroomRes, customerRes]) => {
        if (cancelled) return
        setShowrooms(
          (showroomRes.data || []).map((s) => ({
            value: s.id,
            label: s.label || s.name || s.code,
          }))
        )
        setCustomers(
          (customerRes.data?.items || []).map((c) => ({
            value: c.id,
            label: `${c.code} · ${c.name}`,
            phone: c.phone,
            email: '',
            type: c.type,
          }))
        )
      })
      .catch((e) => {
        if (!cancelled) showToast('Could not load lookups', e.message, true)
      })
      .finally(() => {
        if (!cancelled) setLoadingLookups(false)
      })
    return () => {
      cancelled = true
    }
  }, [showToast])

  // Reset page when filters change
  useEffect(() => {
    setPage(0)
  }, [statusFilter, locationFilter, search])

  // Load list
  const load = useCallback(async () => {
    setLoading(true)
    try {
      const q = { page, size: PAGE_SIZE }
      if (statusFilter) q.status = statusFilter
      if (locationFilter) q.locationId = locationFilter
      if (search) q.ref = search

      const res = await cashierApi.listProformasQuotations(q)
      const paged = res.data
      setRows(paged.items || [])
      setTotalPages(paged.totalPages || 0)
      setTotalItems(paged.totalItems || 0)
    } catch (e) {
      showToast('Could not load pro-formas', e.message, true)
    } finally {
      setLoading(false)
    }
  }, [page, statusFilter, locationFilter, search, showToast])

  useEffect(() => {
    load()
  }, [load])

  // Detail loader
  const loadDetail = useCallback(
    async (id) => {
      setLoadingDetail(true)
      try {
        const res = await cashierApi.getProformasQuotation(id)
        setActive(res.data)
      } catch (e) {
        showToast('Could not load pro-forma', e.message, true)
      } finally {
        setLoadingDetail(false)
      }
    },
    [showToast]
  )

  async function openDetail(row) {
    setActive(null)
    setMode('detail')
    await loadDetail(row.id)
  }

  function afterMutation() {
    setMode('list')
    setActive(null)
    setActionType(null)
    load()
  }

  // Simple action handlers (no dialog needed)
  async function handleSend() {
    if (!active) return
    try {
      await cashierApi.sendProformasQuotation(active.id)
      showToast('Sent', `${active.ref} sent to the customer.`)
      await loadDetail(active.id)
      load()
    } catch (e) {
      showToast('Could not send', e.message, true)
    }
  }

  async function handleApproveDiscount() {
    if (!active) return
    try {
      await cashierApi.approveProformasDiscountQuotation(active.id)
      showToast('Discount approved', `${active.ref} is ready to send.`)
      await loadDetail(active.id)
      load()
    } catch (e) {
      showToast('Could not approve discount', e.message, true)
    }
  }

  async function handleReissue() {
    if (!active) return
    try {
      const res = await cashierApi.reissueProformasQuotation(active.id)
      showToast(
        'Reissued',
        'A fresh draft has been created at today\u2019s prices.'
      )
      const newId = res?.data?.id
      if (newId) {
        await loadDetail(newId)
      } else {
        setMode('list')
        load()
      }
    } catch (e) {
      showToast('Could not reissue', e.message, true)
    }
  }

  function onAction(action) {
    if (action === 'send') return handleSend()
    if (action === 'approve-discount') return handleApproveDiscount()
    if (action === 'reissue') return handleReissue()
    // Actions requiring a dialog
    if (
      ['decline', 'cancel', 'reject-discount', 'convert'].includes(action)
    ) {
      setActionType(action)
    }
  }

  // ── Render branches ───────────────────────────────────
  if (mode === 'create') {
    return (
      <ProformaForm
        mode="create"
        crumbs={crumbs}
        showrooms={showrooms}
        customers={customers}
        onBack={() => setMode('list')}
        onDone={afterMutation}
      />
    )
  }

  if (mode === 'edit' && active) {
    return (
      <ProformaForm
        mode="edit"
        proforma={active}
        crumbs={crumbs}
        showrooms={showrooms}
        customers={customers}
        onBack={() => setMode('detail')}
        onDone={async () => {
          setMode('detail')
          await loadDetail(active.id)
          load()
        }}
      />
    )
  }

  if (mode === 'document' && active) {
    return (
      <ProformaDocument
        proforma={active}
        crumbs={crumbs}
        onBack={() => setMode('detail')}
        onPrint={() => window.print()}
      />
    )
  }

  if (mode === 'detail') {
    if (actionType && active) {
      return (
        <ActionDialog
          action={actionType}
          proforma={active}
          crumbs={crumbs}
          onBack={() => setActionType(null)}
          onDone={async () => {
            setActionType(null)
            await loadDetail(active.id)
            load()
          }}
        />
      )
    }
    return (
      <ProformaDetail
        proforma={active}
        loading={loadingDetail}
        crumbs={crumbs}
        onBack={() => setMode('list')}
        onEdit={() => setMode('edit')}
        onViewDocument={() => setMode('document')}
        onAction={onAction}
        onRefresh={() => active && loadDetail(active.id)}
      />
    )
  }

  // ── List view ─────────────────────────────────────────
  const columns = [
    { key: 'ref', label: 'Reference', width: 120, mono: true },
    {
      key: 'date',
      label: 'Issued',
      width: 130,
      render: (r) => (r.date ? fmtDate(r.date) : '—'),
    },
    {
      key: 'customerName',
      label: 'Customer',
      width: 240,
      render: (r) => r.customerName || r.customer?.name || '—',
    },
    {
      key: 'items',
      label: 'Items',
      width: 90,
      align: 'right',
      mono: true,
      render: (r) => fmt(r.items || 0),
    },
    {
      key: 'value',
      label: 'Value',
      width: 170,
      align: 'right',
      mono: true,
      render: (r) => money(r.value || 0),
    },
    {
      key: 'validUntil',
      label: 'Valid until',
      width: 140,
      render: (r) => (r.validUntil ? fmtDate(r.validUntil) : '—'),
    },
    {
      key: 'status',
      label: 'Status',
      width: 150,
      render: (r) => {
        const c = statusOf(r.status)
        return <Badge tone={c.tone}>{c.label}</Badge>
      },
    },
  ]

  const statusFilterOptions = [{ value: '', label: 'All statuses' }, ...STATUS_FILTER_OPTIONS.slice(1)]
  const locationFilterOptions = [
    { value: '', label: 'All showrooms' },
    ...showrooms,
  ]

  const totalValue = rows.reduce((n, r) => n + (r.value || 0), 0)
  const convertedCount = rows.filter(
    (r) => normStatus(r.status) === 'CONVERTED'
  ).length

  return (
    <>
      {(loading || loadingLookups) && (
        <Loader
          overlay
          label={
            loadingLookups ? 'Loading lookups…' : 'Loading pro-formas…'
          }
        />
      )}
      <RegisterShell
        wide
        crumbs={[moduleLabel, parentLabel]}
        title={leaf?.label || 'Pro-Forma Invoice'}
        icon={leaf?.icon}
        description="Prepare quotations for customers before the sale — products, quantities, prices and terms — so they can review the proposed transaction before paying or confirming."
        createLabel="New pro-forma"
        onCreate={() => setMode('create')}
        search={searchInput}
        onSearch={setSearchInput}
        searchPlaceholder="Search by reference or customer…"
        pagination={{
          page,
          pageCount: totalPages,
          pageSize: PAGE_SIZE,
          total: totalItems,
          onPage: setPage,
        }}
        filters={
          <>
            <Select
              options={statusFilterOptions}
              value={statusFilter}
              onChange={(v) => setStatusFilter(val(v))}
              style={{ width: 190 }}
            />
            <Select
              options={locationFilterOptions}
              value={locationFilter}
              onChange={(v) => setLocationFilter(val(v))}
              style={{ width: 200 }}
            />
          </>
        }
        stats={[
          { label: 'Pro-formas', value: String(totalItems) },
          {
            label: 'Value (this page)',
            value: moneyShort(totalValue),
          },
          {
            label: 'Converted (this page)',
            value: String(convertedCount),
            hint: convertedCount ? 'Already sales' : undefined,
          },
          {
            label: 'Latest',
            value: rows[0]?.date ? fmtDate(rows[0].date) : '—',
          },
        ]}
        columns={columns}
        rows={rows}
        onRowClick={openDetail}
        emptyTitle="No pro-formas yet"
        emptyDescription="Create a pro-forma to quote a customer before the sale."
        footnote="A pro-forma is an estimate only. No sale is recorded and no stock is committed until the customer confirms and payment is taken."
      />
    </>
  )
}