// import { useEffect, useState } from 'react'
// import { Badge } from '../../ds/components/core/Badge.jsx'
// import { Button } from '../../ds/components/core/Button.jsx'
// import { Icon } from '../../ds/components/core/Icon.jsx'
// import { Input } from '../../ds/components/forms/Input.jsx'
// import { Select } from '../../ds/components/forms/Select.jsx'
// import { Switch } from '../../ds/components/forms/Switch.jsx'
// import { Dialog } from '../../ds/components/feedback/Dialog.jsx'
// import { RegisterShell } from '../shells/RegisterShell.jsx'
// import { FormShell } from '../shells/FormShell.jsx'
// import { Panel, FieldSet, MetaRow } from '../shells/Page.jsx'
// import { factories as sampleFactories, registeredProducts, registeredMaterials } from '../sample.js'
// import { unitOptions } from '../unitOptions.js'
// import { categoryOptions } from '../categoryOptions.js'
// import { useStore } from '../store.jsx'
// import AccountApi from '../../api/AccountApi.js'
// import InventoryApi from '../../api/InventoryApi.js'
// import Loader from '../../ds/components/core/Loader.jsx'
// // const inventoryApi = new InventoryApi()
// const accountApi = new AccountApi()
// const inventoryApi = new InventoryApi()
// const TABS = [
//   { value: 'finished', label: 'Finished products', icon: 'package' },
//   { value: 'raw', label: 'Raw materials', icon: 'box' },
// ]

// const columns = [
//   { key: 'code', label: 'Code', width: 100, mono: true },
//   { key: 'name', label: 'Name', width: 220 },
//   { key: 'category', label: 'Category', width: 140 },
//   { key: 'factory', label: 'Assigned factory', width: 150 },
//   { key: 'unit', label: 'Unit', width: 110 },
//   { key: 'reorder', label: 'Re-order level', width: 130, align: 'right', mono: true },
//   { key: 'barcode', label: 'Barcode', width: 150, mono: true },
//   {
//     key: 'status', label: 'Status', width: 110,
//     render: (r) => <Badge tone={r.status === 'Active' ? 'success' : 'neutral'}>{r.status}</Badge>,
//   },
// ]

// function RegisterForm({ kind, onBack, crumbs, onDone, onGoToFactories, onGoToCategories }) {
//   const isRaw = kind === 'raw'
//   console.log("THis is the king you picked: ", kind)
//   const { factories, products, units, categories, addUnit, registerProduct, showToast,overrideProducts } = useStore()
//   const unitList = unitOptions(units)
//   const categoryList = categoryOptions(categories)
//   // No unit of their own yet — the picker is showing the fallback set.
//   const usingDefaultUnits = units.length === 0
//   const [loading, setLoading] = useState(false)
//   const [code, setCode] = useState('')
//   const [name, setName] = useState('')
//   const [category, setCategory] = useState('')
//   const [factoryId, setFactoryId] = useState('')
//   const [unit, setUnit] = useState('')
//   const [reorder, setReorder] = useState('')
//   const [leadTime, setLeadTime] = useState('')
//   const [extraA, setExtraA] = useState('')
//   const [extraB, setExtraB] = useState('')
  
//   const [extraC, setExtraC] = useState('')
//   const [barcode, setBarcode] = useState('')
//   const [vat, setVat] = useState('')
//   const [isic, setIsic] = useState('')
//   const [hsn, setHsn] = useState('')



//   const [notes, setNotes] = useState('')
//   const [active, setActive] = useState(true)
//   const [trackCost, setTrackCost] = useState(false)
//   const [errors, setErrors] = useState({})
//   const [vatCategories, setVatCategories] = useState([])
//   const [isicSections, setIsicSections] = useState([])
//   const [hsnSections, setHsnSections] = useState([])
//   const [unitDialog, setUnitDialog] = useState(false)
//   const [newUnitName, setNewUnitName] = useState('')
//   const [newUnitSymbol, setNewUnitSymbol] = useState('')

//   const closeUnitDialog = () => { setUnitDialog(false); setNewUnitName(''); setNewUnitSymbol('') }

//   const confirmNewUnit = () => {
//     const clean = newUnitName.trim()
//     if (!clean) return
//     if (units.some((u) => u.name.toLowerCase() === clean.toLowerCase())) {
//       showToast('That unit is already defined', clean, true)
//       return
//     }
//     const created = addUnit({ name: clean, symbol: newUnitSymbol })
//     setUnit(created.id)
//     showToast(`Unit added — ${created.name}${created.symbol ? ` (${created.symbol})` : ''}`, 'Available everywhere a quantity is entered')
//     closeUnitDialog()
//   }

//   useEffect(() => {
//      accountApi.getVatCategories().then(setVatCategories)
//      accountApi.getIsicSections().then(setIsicSections)
//      accountApi.getHsnSections().then(setHsnSections)

//     //  inventoryApi.
//   }, [])
//   const taken = [
//     ...products.map((p) => (p.code || '').toLowerCase()),
//     ...registeredProducts.map((p) => p.code.toLowerCase()),
//     ...registeredMaterials.map((m) => m.code.toLowerCase()),
//   ].filter(Boolean)

//   const submit = async () => {
    
//     const e = {}
//     if (!code.trim()) e.code = `${isRaw ? 'Material' : 'Product'} code is required`
//     else if (taken.includes(code.trim().toLowerCase())) e.code = 'That code is already registered'
//     if (!name.trim()) e.name = `${isRaw ? 'Material' : 'Product'} name is required`
//     if (!factoryId) e.factory = 'Select the factory this item belongs to'
//     if (!unit) e.unit = 'Unit of measure is required'
//     setErrors(e)
//     if (Object.keys(e).length) return

//     const factory = factories.find((f) => f.id === factoryId)
//     let resulted_barcode = barcode.trim() || `615110${String(Math.floor(Math.random() * 10_000_000)).padStart(7, '0')}`
//     try{

//     let result=await inventoryApi.createInventory(
//       {
        
//         locationId:factory.id,
//         itemType: isRaw ? 'RAW_MATERIAL' : 'FINISHED_PRODUCT',
//         code: code.trim().toUpperCase(),
//         name:name,
        
//         category: category,
//         brand:"brand",
//         unitOfMeasureId:unit,
//         reorderLevel:reorder,
//         barcode:resulted_barcode,
//         landingCost:extraC,
//         markupCost:extraB,
//         vatCategoryId:vat,
//         isicSectionId:isic,
//         hsnSectionId:hsn,
//         status:active?"ACTIVE":"INACTIVE",
       
//       }
//     )
//     setLoading(false)
//     showToast(`${isRaw ? 'Material' : 'Product'} registered — ${result.code}`, `${result.name} · ${result.factoryName}`)
//     onDone?.()}
//     catch(err){
//       setLoading(false)
//       showToast("Product Creation Failed", err.message,true)
//     }
    
//     // const record = registerProduct({
//     //   kind,
//     //   factoryId: factory.id,
//     //   factoryName: factory.name,
//     //   code: code.trim().toUpperCase(),
//     //   name,
//     //   category: categoryList.find((c) => c.value === category)?.label || '',
//     //   unit: unitList.find((u) => u.value === unit)?.label || '',
//     //   reorder,
//     //   // A barcode is issued on save when one was not supplied.
//     //   barcode: barcode.trim() || `615110${String(Math.floor(Math.random() * 10_000_000)).padStart(7, '0')}`,
//     //   active,
//     //   details: isRaw
//     //     ? { leadTime, shelfLife: extraA, standardCost: extraB, safetyStock: extraC, vat, notes }
//     //     : { leadTime, packSize: extraA, sellingPrice: extraB, landingCap: extraC, vat, notes, trackCost },
//     // })
//     // showToast(`${isRaw ? 'Material' : 'Product'} registered — ${record.code}`, `${record.name} · ${record.factoryName}`)
//     // onDone?.()
//   }

//   return (
//     <FormShell
//       crumbs={crumbs}
//       title={isRaw ? 'Register raw material' : 'Register finished product'}
//       icon="package-plus"
//       description={
//         isRaw
//           ? 'Raw materials must be registered before they can be received or consumed in production.'
//           : 'All finished products must be registered before they can be produced. Each product is assigned to the factory that produces it.'
//       }
//       headerActions={<Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>Back to register</Button>}
//       submitLabel={isRaw ? 'Register material' : 'Register product'}
//       loading={loading}
//       onSubmit={submit}
//       onCancel={onBack}
//       note="Codes must be unique. Once registered, the item is immediately selectable across every dependent module."
//       aside={
//         <>
//           <Panel title="Availability">
//             <MetaRow label="Stock Refill" value="Immediate" />
//             <MetaRow label="Stock Transfer" value="Immediate" />
//             <MetaRow label={isRaw ? 'Recipe composition' : 'Production Cost Calculator'} value="Immediate" />
//             <MetaRow label="POS" value={isRaw ? 'Not applicable' : 'After price is set'} />
//           </Panel>
//           <Panel title="Label preview">
//             <div style={{ display: 'grid', placeItems: 'center', gap: 10, padding: '18px 12px', border: '1px dashed var(--border-strong)', borderRadius: 'var(--radius-md)', background: 'var(--surface-sunken)' }}>
//               <Icon name="qr-code" size={44} color="var(--text-subtle)" />
//               <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', textAlign: 'center', lineHeight: 1.5 }}>
//                 A barcode is generated on registration and can be printed as a product label.
//               </div>
//               <Button variant="secondary" size="sm" iconLeft="printer" disabled>Print label</Button>
//             </div>
//           </Panel>
//         </>
//       }
//     >
//       <Panel title="Identity" description="How this item is named and coded across the system.">
//         <FieldSet columns={2}>
//           <Input
//             label={isRaw ? 'Material code' : 'Product code'}
//             value={code}
//             onChange={(e) => setCode(e.target.value)}
//             placeholder={isRaw ? 'e.g. RM-07' : 'e.g. ZF-520'}
//             hint="Must be unique across the register."
//             error={errors.code}
//           />
//           <Input
//             label={isRaw ? 'Material name' : 'Product name'}
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             placeholder={isRaw ? 'e.g. Sodium Benzoate' : 'e.g. Citrus Drink 75cl'}
//             error={errors.name}
//           />
//           <div>
//             <Select label="Category" options={categoryList} value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Select category…" />
//             <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 5 }}>
//               {categories.length ? 'The type/group this item is filed under.' : 'Showing the default set.'}{' '}
//               <span onClick={onGoToCategories} style={{ color: 'var(--text-link)', fontWeight: 600, cursor: 'pointer' }}>
//                 {categories.length ? 'Manage categories' : 'Define your own'}
//               </span>
//             </div>
//           </div>
//           <div>
//             <Select
//               label="Assigned factory"
//               options={factories.map((f) => ({ value: f.id, label: f.name }))}
//               value={factoryId}
//               onChange={(e) => setFactoryId(e.target.value)}
//               placeholder={factories.length ? 'Select factory…' : 'No factories registered'}
//               disabled={!factories.length}
//             />
//             <div style={{ font: 'var(--type-caption)', color: errors.factory ? 'var(--text-danger)' : 'var(--text-muted)', marginTop: 5 }}>
//               {factories.length
//                 ? (errors.factory || 'The factory that produces or stores this item.')
//                 : (
//                   <>
//                     Create a factory first —{' '}
//                     <span onClick={onGoToFactories} style={{ color: 'var(--text-link)', fontWeight: 600, cursor: 'pointer' }}>Factory › Factories</span>.
//                   </>
//                 )}
//             </div>
//           </div>
//         </FieldSet>
//       </Panel>

//       <Panel title="Measurement & stock control" description="Units and thresholds that drive stock reports and re-order alerts.">
//         <FieldSet columns={3}>
//           <div>
//             <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8, alignItems: 'end' }}>
//               <Select label="Unit of measure" options={unitList} value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="Select unit…" />
//               <Button variant="secondary" iconLeft="plus" onClick={() => setUnitDialog(true)}>Unit</Button>
//             </div>
//             <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 5 }}>
//               {usingDefaultUnits
//                 ? <>Showing the default set — <span onClick={() => setUnitDialog(true)} style={{ color: 'var(--text-link)', fontWeight: 600, cursor: 'pointer' }}>define your own unit</span> if none of these fit.</>
//                 : <>Measured in. <span onClick={() => setUnitDialog(true)} style={{ color: 'var(--text-link)', fontWeight: 600, cursor: 'pointer' }}>Add a unit</span> if the one you need is missing.</>}
//             </div>
//           </div>
//           <Input label="Re-order level" type="number" value={reorder} onChange={(e) => setReorder(e.target.value)} placeholder="0" hint={errors.unit || 'Triggers the Re-Order Report.'} error={errors.unit} />
//           <Input label="Lead time (days)" type="number" value={leadTime} onChange={(e) => setLeadTime(e.target.value)} placeholder="0" />
//           {isRaw ? (
//             <>
//               <Input label="Shelf life (days)" type="number" value={extraA} onChange={(e) => setExtraA(e.target.value)} placeholder="0" />
//               <Input label="Standard unit cost (₦)" type="number" value={extraB} onChange={(e) => setExtraB(e.target.value)} placeholder="0.00" />
//               <Input label="Safety stock buffer" type="number" value={extraC} onChange={(e) => setExtraC(e.target.value)} placeholder="0" />
//             </>
//           ) : (
//             <>
//               <Input label="Pack size" value={extraA} onChange={(e) => setExtraA(e.target.value)} placeholder="e.g. 12 × 50cl" />
//               <Input label="Standard selling price (₦)" type="number" value={extraB} onChange={(e) => setExtraB(e.target.value)} placeholder="0.00" />
//               <Input label="Landing cost cap (₦)" type="number" value={extraC} onChange={(e) => setExtraC(e.target.value)} placeholder="0.00" />
//             </>
//           )}
//         </FieldSet>
//       </Panel>

//       <Panel title="Identification & tax" description="Scanning and VAT treatment for this item.">
//         <FieldSet columns={2}>
//           <Input label="Barcode / QR value" value={barcode} onChange={(e) => setBarcode(e.target.value)} placeholder="Auto-generate on save" iconLeft="qr-code" />
//           <Select label="VAT treatment" value={vat} onChange={(e) => setVat(e.target.value)} options={vatCategories} placeholder="Select treatment…" />
//         </FieldSet>

//         <FieldSet columns={2} style={{ marginTop: 30}}>
//           <Select label="HSN code" value={hsn} onChange={(e) => setHsn(e.target.value)} options={hsnSections} placeholder="Select code…" />
//           <Select label="ISIC section" value={isic} onChange={(e) => setIsic(e.target.value)} options={isicSections} placeholder="Select section…" />
//         </FieldSet>
//         <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
//           <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//             <Switch checked={active} onChange={setActive} />
//             <div>
//               <div style={{ font: 'var(--fw-semibold) var(--text-sm)/1.3 var(--font-ui)', color: 'var(--text-strong)' }}>Active</div>
//               <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 2 }}>Inactive items stay in reports but cannot be selected in new transactions.</div>
//             </div>
//           </div>
//           {!isRaw && (
//             <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//               <Switch checked={trackCost} onChange={setTrackCost} />
//               <div>
//                 <div style={{ font: 'var(--fw-semibold) var(--text-sm)/1.3 var(--font-ui)', color: 'var(--text-strong)' }}>Track landing cost</div>
//                 <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 2 }}>Landing cost remains visible only to Management and Administration.</div>
//               </div>
//             </div>
//           )}
//         </div>
//       </Panel>

//       <Panel title="Description">
//         <label style={{ display: 'block' }}>
//           <div style={{ font: 'var(--type-label)', color: 'var(--text-strong)', marginBottom: 6 }}>Notes</div>
//           <textarea
//             rows={3}
//             value={notes}
//             onChange={(e) => setNotes(e.target.value)}
//             placeholder="Specification, quality tolerances, or handling instructions."
//             style={{
//               width: '100%', padding: '10px 12px', resize: 'vertical',
//               background: 'var(--surface-card)', border: '1px solid var(--border-default)',
//               borderRadius: 'var(--radius-control)', boxShadow: 'var(--shadow-xs)',
//               font: 'var(--fw-regular) var(--text-sm)/1.5 var(--font-ui)', color: 'var(--text-strong)', outline: 'none',
//             }}
//           />
//         </label>
//       </Panel>

//       <Dialog
//         open={unitDialog}
//         title="Add a unit of measure"
//         onClose={closeUnitDialog}
//         footer={
//           <>
//             <Button variant="secondary" onClick={closeUnitDialog}>Cancel</Button>
//             <Button iconLeft="check" onClick={confirmNewUnit}>Add unit</Button>
//           </>
//         }
//       >
//         <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
//           <Input
//             label="Unit name"
//             autoFocus
//             value={newUnitName}
//             onChange={(e) => setNewUnitName(e.target.value)}
//             placeholder="e.g. Kilograms"
//             onKeyDown={(e) => e.key === 'Enter' && confirmNewUnit()}
//           />
//           <Input
//             label="Symbol"
//             hint="Optional — what prints on documents."
//             value={newUnitSymbol}
//             onChange={(e) => setNewUnitSymbol(e.target.value)}
//             placeholder="e.g. kg"
//             onKeyDown={(e) => e.key === 'Enter' && confirmNewUnit()}
//           />
//           <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', lineHeight: 1.55 }}>
//             It is added to the company's unit register and selected here straight away. Manage the full list under
//             Factory › Setup › Units of Measure.
//           </div>
//         </div>
//       </Dialog>
//     </FormShell>
//   )
// }

// export default function StockRegister({ leaf, moduleLabel, parentLabel, onNavigate }) {
//   const { products, categories,factories } = useStore()
//   const [tab, setTab] = useState('finished')
//   const [mode, setMode] = useState('list')

//   const crumbs = [moduleLabel, parentLabel, leaf?.label].filter(Boolean)
//   const goToFactories = () => onNavigate?.({ id: 'f.factories', view: 'factories', label: 'Factories' })
//   const goToCategories = () => onNavigate?.({ id: 'f.categories', view: 'categories', label: 'Categories' })
//   if (mode === 'create') {
//     return (
//       <RegisterForm
//         kind={tab}
//         crumbs={crumbs}
//         onBack={() => setMode('list')}
//         onDone={() => setMode('list')}
//         onGoToFactories={goToFactories}
//         onGoToCategories={goToCategories}
//       />
//     )
//   }

//   // Items registered on this account first, then the reference catalogue.
//   const own = products
//     .filter((p) => (tab === 'finished' ? p.kind !== 'raw' : p.kind === 'raw'))
//     .map((p) => ({
//       code: p.code || '—',
//       name: p.name,
//       category: p.category || '—',
//       factory: p.factoryName || '—',
//       unit: p.unit || '—',
//       reorder: p.reorder || '—',
//       barcode: p.barcode || '—',
//       status: p.status || 'Active',
//     }))
//     .reverse()

//   const rows = [...own, ...(tab === 'finished' ? registeredProducts : registeredMaterials)]
//   const label = tab === 'finished' ? 'product' : 'material'

//   return (
//     <RegisterShell
//       wide
//       crumbs={[moduleLabel, parentLabel]}
//       title={leaf?.label || 'Stock Register'}
//       icon={leaf?.icon}
//       description="All finished products must be registered before they can be produced. Every factory carries its own range of products and materials."
//       createLabel={`Register ${label}`}
//       onCreate={() => setMode('create')}
//       tabs={TABS}
//       tab={tab}
//       onTabChange={setTab}
//       searchPlaceholder={`Search ${label}s by code, name or barcode…`}
//       filters={
//         <>
//           <Select options={factories.map((f) => ({ label: f.name, value: f.id }))} placeholder="All factories" style={{ width: 190 }} />
//           <Select options={categories.map((c) => ({ label: c.name, value: c.id }))} placeholder="All categories" style={{ width: 170 }} />
//         </>
//       }
//       stats={[
//         { label: `${tab === 'finished' ? 'Products' : 'Materials'} registered`, value: String(rows.length) },
//         { label: 'Active', value: String(rows.filter((r) => r.status === 'Active').length) },
//         { label: 'Factories covered', value: String(new Set(rows.map((r) => r.factory)).size) },
//         { label: 'Barcoded', value: `${rows.filter((r) => r.barcode).length}/${rows.length}` },
//       ]}
//       columns={columns}
//       rows={rows}
//       onRowClick={() => {}}
//       emptyTitle={`No ${label}s registered`}
//       emptyDescription={`Register a ${label} to make it selectable in Stock Refill, Transfers and production.`}
//       footnote="A record cannot be created with missing required fields or a code that duplicates an existing entry."
//     />
//   )
// }
import { useEffect, useRef, useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Icon } from '../../ds/components/core/Icon.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import { Switch } from '../../ds/components/forms/Switch.jsx'
import { Dialog } from '../../ds/components/feedback/Dialog.jsx'
import { RegisterShell } from '../shells/RegisterShell.jsx'
import { FormShell } from '../shells/FormShell.jsx'
import { Panel, FieldSet, MetaRow } from '../shells/Page.jsx'
import { registeredProducts, registeredMaterials } from '../sample.js'
import { unitOptions } from '../unitOptions.js'
import { categoryOptions } from '../categoryOptions.js'
import { useStore } from '../store.jsx'
import AccountApi from '../../api/AccountApi.js'
import InventoryApi from '../../api/InventoryApi.js'
import Loader from '../../ds/components/core/Loader.jsx'
import FactoryApi from '../../api/FactoryApi.js'

const accountApi = new AccountApi()
const inventoryApi = new InventoryApi()
const factoryApi = new FactoryApi()

const TABS = [
  { value: 'finished', label: 'Finished products', icon: 'package' },
  { value: 'raw', label: 'Raw materials', icon: 'box' },
]

// The list endpoint takes a location and an item type. Each tab asks for its own
// item type; the tab value also doubles as the store's product `kind`.
const TAB_ITEM_TYPE = { finished: 'FINISHED_PRODUCT', raw: 'RAW_MATERIAL' }

// The lists toStoreProduct uses to turn ids into names.
const stockLookups = (factories, categories, units) => ({
  factories,
  categories: categoryOptions(categories),
  units: unitOptions(units),
})

const columns = [
  { key: 'code', label: 'Code', width: 100, mono: true },
  { key: 'name', label: 'Name', width: 220 },
  { key: 'category', label: 'Category', width: 140 },
  { key: 'factory', label: 'Assigned factory', width: 150 },
  { key: 'unit', label: 'Unit', width: 110 },
  { key: 'reorder', label: 'Re-order level', width: 130, align: 'right', mono: true },
  { key: 'barcode', label: 'Barcode', width: 150, mono: true },
  {
    key: 'status', label: 'Status', width: 110,
    render: (r) => <Badge tone={r.status === 'Active' ? 'success' : 'neutral'}>{r.status}</Badge>,
  },
]

function RegisterForm({ kind, onBack, crumbs, onDone, onGoToFactories, onGoToCategories }) {
  const isRaw = kind === 'raw'
  const { factories, products, units, categories, addUnit, upsertProduct, showToast } = useStore()
  const unitList = unitOptions(units)
  const categoryList = categoryOptions(categories)
  // No unit of their own yet — the picker is showing the fallback set.
  const usingDefaultUnits = units.length === 0
  const [loading, setLoading] = useState(false)
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [factoryId, setFactoryId] = useState('')
  const [unit, setUnit] = useState('')
  const [reorder, setReorder] = useState('')
  const [leadTime, setLeadTime] = useState('')
  const [extraA, setExtraA] = useState('')
  const [extraB, setExtraB] = useState('')

  const [extraC, setExtraC] = useState('')
  const [barcode, setBarcode] = useState('')
  const [vat, setVat] = useState('')
  const [isic, setIsic] = useState('')
  const [hsn, setHsn] = useState('')

  const [notes, setNotes] = useState('')
  const [active, setActive] = useState(true)
  const [trackCost, setTrackCost] = useState(false)
  const [errors, setErrors] = useState({})
  const [vatCategories, setVatCategories] = useState([])
  const [isicSections, setIsicSections] = useState([])
  const [hsnSections, setHsnSections] = useState([])
  const [unitDialog, setUnitDialog] = useState(false)
  const [newUnitName, setNewUnitName] = useState('')
  const [newUnitSymbol, setNewUnitSymbol] = useState('')

  const closeUnitDialog = () => { setUnitDialog(false); setNewUnitName(''); setNewUnitSymbol('') }

  const confirmNewUnit = async () => {
    const clean = newUnitName.trim()
    if (!clean) return
    if (units.some((u) => u.name.toLowerCase() === clean.toLowerCase())) {
      showToast('That unit is already defined', clean, true)
      return
    }
    setLoading(true)
    try {
      let createdUnit= await factoryApi.createUnit({unitCode:newUnitSymbol,unitName:clean,symbol:newUnitSymbol})
      addUnit({name:clean,symbol:newUnitSymbol,code,id:createdUnit.data.id})
      showToast(`Unit added — ${clean}${newUnitSymbol.trim() ? ` (${newUnitSymbol.trim()})` : ''}`, 'Selectable wherever a quantity is entered')
      // setName(''); setSymbol(''); setCode(''); setErr('')
       setUnit(createdUnit.data.id)
    // showToast(`Unit added — ${created.name}${created.symbol ? ` (${created.symbol})` : ''}`, 'Available everywhere a quantity is entered')
    } catch (e) {
      setLoading(false)
      showToast(`Unit ${clean} (${newUnitSymbol.trim() ? ` (${newUnitSymbol.trim()})` : ''}) failed to add`, e.message, true)
    }
    // const created = addUnit({ name: clean, symbol: newUnitSymbol })
   
    closeUnitDialog()
  }

  useEffect(() => {
    accountApi.getVatCategories().then(setVatCategories)
    accountApi.getIsicSections().then(setIsicSections)
    accountApi.getHsnSections().then(setHsnSections)
  }, [])

  const taken = [
    ...products.map((p) => (p.code || '').toLowerCase()),
    ...registeredProducts.map((p) => p.code.toLowerCase()),
    ...registeredMaterials.map((m) => m.code.toLowerCase()),
  ].filter(Boolean)

  const submit = async () => {
    const e = {}
    if (!code.trim()) e.code = `${isRaw ? 'Material' : 'Product'} code is required`
    else if (taken.includes(code.trim().toLowerCase())) e.code = 'That code is already registered'
    if (!name.trim()) e.name = `${isRaw ? 'Material' : 'Product'} name is required`
    if (!factoryId) e.factory = 'Select the factory this item belongs to'
    if (!unit) e.unit = 'Unit of measure is required'
    setErrors(e)
    if (Object.keys(e).length) return

    const factory = factories.find((f) => f.id === factoryId)
    const resultedBarcode = barcode.trim() || `615110${String(Math.floor(Math.random() * 10_000_000)).padStart(7, '0')}`

    setLoading(true)
    try {
      // 1. Create it on the server
      const result = await inventoryApi.createInventory({
        locationId: factory.id,
        itemType: isRaw ? 'RAW_MATERIAL' : 'FINISHED_PRODUCT',
        code: code.trim().toUpperCase(),
        name: name.trim(),
        categoryId: category,
        brand: 'brand',
        unitOfMeasureId: unit,
        reorderLevel: Number(reorder) || 0,
        barcode: resultedBarcode,
        landingCost: Number(extraC) || 0,
        markupCost: Number(extraB) || 0,
        vatCategoryId: vat,
        hsnSectionId: hsn,
        isicSectionId: isic,
        status: active ? 'ACTIVE' : 'INACTIVE',
      })

      // 2. Save what the server returned into the store, in the store's shape.
      const created = result.data
      upsertProduct(inventoryApi.toStoreProduct(created, stockLookups(factories, categories, units)))

      showToast(`${isRaw ? 'Material' : 'Product'} registered — ${created.code}`, `${created.name} · ${factory.name}`)
      onDone?.()
    } catch (err) {
      showToast('Product creation failed', err.message, true)
    } finally {
      setLoading(false) // runs on success AND on failure
    }
  }

  return (
    <FormShell
      crumbs={crumbs}
      title={isRaw ? 'Register raw material' : 'Register finished product'}
      icon="package-plus"
      description={
        isRaw
          ? 'Raw materials must be registered before they can be received or consumed in production.'
          : 'All finished products must be registered before they can be produced. Each product is assigned to the factory that produces it.'
      }
      headerActions={<Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>Back to register</Button>}
      submitLabel={isRaw ? 'Register material' : 'Register product'}
      loading={loading}
      onSubmit={submit}
      onCancel={onBack}
      note="Codes must be unique. Once registered, the item is immediately selectable across every dependent module."
      aside={
        <>
          <Panel title="Availability">
            <MetaRow label="Stock Refill" value="Immediate" />
            <MetaRow label="Stock Transfer" value="Immediate" />
            <MetaRow label={isRaw ? 'Recipe composition' : 'Production Cost Calculator'} value="Immediate" />
            <MetaRow label="POS" value={isRaw ? 'Not applicable' : 'After price is set'} />
          </Panel>
          <Panel title="Label preview">
            <div style={{ display: 'grid', placeItems: 'center', gap: 10, padding: '18px 12px', border: '1px dashed var(--border-strong)', borderRadius: 'var(--radius-md)', background: 'var(--surface-sunken)' }}>
              <Icon name="qr-code" size={44} color="var(--text-subtle)" />
              <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', textAlign: 'center', lineHeight: 1.5 }}>
                A barcode is generated on registration and can be printed as a product label.
              </div>
              <Button variant="secondary" size="sm" iconLeft="printer" disabled>Print label</Button>
            </div>
          </Panel>
        </>
      }
    >
      <Panel title="Identity" description="How this item is named and coded across the system.">
        <FieldSet columns={2}>
          <Input
            label={isRaw ? 'Material code' : 'Product code'}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={isRaw ? 'e.g. RM-07' : 'e.g. ZF-520'}
            hint="Must be unique across the register."
            error={errors.code}
          />
          <Input
            label={isRaw ? 'Material name' : 'Product name'}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={isRaw ? 'e.g. Sodium Benzoate' : 'e.g. Citrus Drink 75cl'}
            error={errors.name}
          />
          <div>
            <Select label="Category" options={categoryList} value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Select category…" />
            <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 5 }}>
              {categories.length ? 'The type/group this item is filed under.' : 'Showing the default set.'}{' '}
              <span onClick={onGoToCategories} style={{ color: 'var(--text-link)', fontWeight: 600, cursor: 'pointer' }}>
                {categories.length ? 'Manage categories' : 'Define your own'}
              </span>
            </div>
          </div>
          <div>
            <Select
              label="Assigned factory"
              options={factories.map((f) => ({ value: f.id, label: f.name }))}
              value={factoryId}
              onChange={(e) => setFactoryId(e.target.value)}
              placeholder={factories.length ? 'Select factory…' : 'No factories registered'}
              disabled={!factories.length}
            />
            <div style={{ font: 'var(--type-caption)', color: errors.factory ? 'var(--text-danger)' : 'var(--text-muted)', marginTop: 5 }}>
              {factories.length
                ? (errors.factory || 'The factory that produces or stores this item.')
                : (
                  <>
                    Create a factory first —{' '}
                    <span onClick={onGoToFactories} style={{ color: 'var(--text-link)', fontWeight: 600, cursor: 'pointer' }}>Factory › Factories</span>.
                  </>
                )}
            </div>
          </div>
        </FieldSet>
      </Panel>

      <Panel title="Measurement & stock control" description="Units and thresholds that drive stock reports and re-order alerts.">
        <FieldSet columns={3}>
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8, alignItems: 'end' }}>
              <Select label="Unit of measure" options={unitList} value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="Select unit…" />
              <Button variant="secondary" iconLeft="plus" onClick={() => setUnitDialog(true)}>Unit</Button>
            </div>
            <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 5 }}>
              {usingDefaultUnits
                ? <>Showing the default set — <span onClick={() => setUnitDialog(true)} style={{ color: 'var(--text-link)', fontWeight: 600, cursor: 'pointer' }}>define your own unit</span> if none of these fit.</>
                : <>Measured in. <span onClick={() => setUnitDialog(true)} style={{ color: 'var(--text-link)', fontWeight: 600, cursor: 'pointer' }}>Add a unit</span> if the one you need is missing.</>}
            </div>
          </div>
          <Input label="Re-order level" type="number" value={reorder} onChange={(e) => setReorder(e.target.value)} placeholder="0" hint={errors.unit || 'Triggers the Re-Order Report.'} error={errors.unit} />
          <Input label="Lead time (days)" type="number" value={leadTime} onChange={(e) => setLeadTime(e.target.value)} placeholder="0" />
          {isRaw ? (
            <>
              <Input label="Shelf life (days)" type="number" value={extraA} onChange={(e) => setExtraA(e.target.value)} placeholder="0" />
              <Input label="Standard unit cost (₦)" type="number" value={extraB} onChange={(e) => setExtraB(e.target.value)} placeholder="0.00" />
              <Input label="Safety stock buffer" type="number" value={extraC} onChange={(e) => setExtraC(e.target.value)} placeholder="0" />
            </>
          ) : (
            <>
              <Input label="Pack size" value={extraA} onChange={(e) => setExtraA(e.target.value)} placeholder="e.g. 12 × 50cl" />
              <Input label="Standard selling price (₦)" type="number" value={extraB} onChange={(e) => setExtraB(e.target.value)} placeholder="0.00" />
              <Input label="Landing cost cap (₦)" type="number" value={extraC} onChange={(e) => setExtraC(e.target.value)} placeholder="0.00" />
            </>
          )}
        </FieldSet>
      </Panel>

      <Panel title="Identification & tax" description="Scanning and VAT treatment for this item.">
        <FieldSet columns={2}>
          <Input label="Barcode / QR value" value={barcode} onChange={(e) => setBarcode(e.target.value)} placeholder="Auto-generate on save" iconLeft="qr-code" />
          <Select label="VAT treatment" value={vat} onChange={(e) => setVat(e.target.value)} options={vatCategories} placeholder="Select treatment…" />
        </FieldSet>

        <FieldSet columns={2} style={{ marginTop: 30 }}>
          <Select label="HSN code" value={hsn} onChange={(e) => setHsn(e.target.value)} options={hsnSections} placeholder="Select code…" />
          <Select label="ISIC section" value={isic} onChange={(e) => setIsic(e.target.value)} options={isicSections} placeholder="Select section…" />
        </FieldSet>
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Switch checked={active} onChange={setActive} />
            <div>
              <div style={{ font: 'var(--fw-semibold) var(--text-sm)/1.3 var(--font-ui)', color: 'var(--text-strong)' }}>Active</div>
              <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 2 }}>Inactive items stay in reports but cannot be selected in new transactions.</div>
            </div>
          </div>
          {!isRaw && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Switch checked={trackCost} onChange={setTrackCost} />
              <div>
                <div style={{ font: 'var(--fw-semibold) var(--text-sm)/1.3 var(--font-ui)', color: 'var(--text-strong)' }}>Track landing cost</div>
                <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 2 }}>Landing cost remains visible only to Management and Administration.</div>
              </div>
            </div>
          )}
        </div>
      </Panel>

      <Panel title="Description">
        <label style={{ display: 'block' }}>
          <div style={{ font: 'var(--type-label)', color: 'var(--text-strong)', marginBottom: 6 }}>Notes</div>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Specification, quality tolerances, or handling instructions."
            style={{
              width: '100%', padding: '10px 12px', resize: 'vertical',
              background: 'var(--surface-card)', border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-control)', boxShadow: 'var(--shadow-xs)',
              font: 'var(--fw-regular) var(--text-sm)/1.5 var(--font-ui)', color: 'var(--text-strong)', outline: 'none',
            }}
          />
        </label>
      </Panel>

      <Dialog
        open={unitDialog}
        title="Add a unit of measure"
        onClose={closeUnitDialog}
        footer={
          <>
            <Button variant="secondary" onClick={closeUnitDialog}>Cancel</Button>
            <Button iconLeft="check" onClick={confirmNewUnit}>Add unit</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input
            label="Unit name"
            autoFocus
            value={newUnitName}
            onChange={(e) => setNewUnitName(e.target.value)}
            placeholder="e.g. Kilograms"
            onKeyDown={(e) => e.key === 'Enter' && confirmNewUnit()}
          />
          <Input
            label="Symbol"
            hint="Optional — what prints on documents."
            value={newUnitSymbol}
            onChange={(e) => setNewUnitSymbol(e.target.value)}
            placeholder="e.g. kg"
            onKeyDown={(e) => e.key === 'Enter' && confirmNewUnit()}
          />
          <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', lineHeight: 1.55 }}>
            It is added to the company's unit register and selected here straight away. Manage the full list under
            Factory › Setup › Units of Measure.
          </div>
        </div>
      </Dialog>
    </FormShell>
  )
}

export default function StockRegister({ leaf, moduleLabel, parentLabel, onNavigate }) {
  const { products, categories, factories, units, mergeProducts, showToast } = useStore()
  const [tab, setTab] = useState('finished')
  const [mode, setMode] = useState('list')
  const [loadingItems, setLoadingItems] = useState(false)
  const [factoryFilter, setFactoryFilter] = useState('') // '' = all factories
  const [categoryFilter, setCategoryFilter] = useState('') // '' = all categories

  // Lookups are read through a ref, so a change to the unit or category lists
  // doesn't trigger a new request.
  const lookupsRef = useRef(null)
  lookupsRef.current = stockLookups(factories, categories, units)

  // Ask the server for the items. The endpoint takes a location and an item
  // type, so: the picked factory (or every factory when none is picked) for the
  // current tab's item type. Runs again when the factory filter or tab changes.
  // (This sits above the early return below so the hook order never changes.)
  useEffect(() => {
    const targets = factoryFilter ? factories.filter((f) => f.id === factoryFilter) : factories
    if (!targets.length) {
      setLoadingItems(false)
      return
    }

    let cancelled = false
    setLoadingItems(true)

    Promise.all(targets.map((f) => inventoryApi.listStockItems(f.id, TAB_ITEM_TYPE[tab])))
      .then((responses) => {
        if (cancelled) return
        const items = responses.flatMap((res) => res.data || [])
        // Replace only the slice just requested (these factories, this tab's
        // kind), so the rest of the store isn't wiped by a filtered request.
        mergeProducts(
          { factoryIds: targets.map((f) => f.id), kinds: [tab] },
          items.map((item) => inventoryApi.toStoreProduct(item, lookupsRef.current))
        )
      })
      .catch((error) => {
        // Keep whatever is already in the store if any of the requests failed.
        if (!cancelled) showToast('Could not load stock items', error.message, true)
      })
      .finally(() => { if (!cancelled) setLoadingItems(false) })

    return () => { cancelled = true }
  }, [factories, factoryFilter, tab, mergeProducts, showToast])

  const crumbs = [moduleLabel, parentLabel, leaf?.label].filter(Boolean)
  const goToFactories = () => onNavigate?.({ id: 'f.factories', view: 'factories', label: 'Factories' })
  const goToCategories = () => onNavigate?.({ id: 'f.categories', view: 'categories', label: 'Categories' })
  if (mode === 'create') {
    return (
      <RegisterForm
        kind={tab}
        crumbs={crumbs}
        onBack={() => setMode('list')}
        onDone={() => setMode('list')}
        onGoToFactories={goToFactories}
        onGoToCategories={goToCategories}
      />
    )
  }

  // The factory filter also refreshes from the server (see the effect above), but
  // the store holds other factories' items too, so the view is narrowed here.
  // The endpoint can't filter by category, so that one is purely local.
  const own = products
    .filter((p) => (tab === 'finished' ? p.kind !== 'raw' : p.kind === 'raw'))
    .filter((p) => !factoryFilter || p.factoryId === factoryFilter)
    .filter((p) => !categoryFilter || p.categoryId === categoryFilter)
    .map((p) => ({
      code: p.code || '—',
      name: p.name,
      category: p.category || '—',
      factory: p.factoryName || '—',
      unit: p.unit || '—',
      reorder: p.reorder || '—',
      barcode: p.barcode || '—',
      status: p.status || 'Active',
    }))
    .reverse()

  const rows = [...own]
  const label = tab === 'finished' ? 'product' : 'material'

  return (
    <RegisterShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Stock Register'}
      icon={leaf?.icon}
      description="All finished products must be registered before they can be produced. Every factory carries its own range of products and materials."
      createLabel={`Register ${label}`}
      onCreate={() => setMode('create')}
      tabs={TABS}
      tab={tab}
      onTabChange={setTab}
      searchPlaceholder={`Search ${label}s by code, name or barcode…`}
      searchKeys={['code', 'name', 'barcode']}
      filters={
        <>
          <Select
            options={[{ label: 'All factories', value: '' }, ...factories.map((f) => ({ label: f.name, value: f.id }))]}
            value={factoryFilter}
            onChange={(e) => setFactoryFilter(e.target.value)}
            placeholder="All factories"
            style={{ width: 190 }}
          />
          <Select
            options={[{ label: 'All categories', value: '' }, ...categories.map((c) => ({ label: c.name, value: c.id }))]}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            placeholder="All categories"
            style={{ width: 170 }}
          />
        </>
      }
      stats={[
        { label: `${tab === 'finished' ? 'Products' : 'Materials'} registered`, value: String(rows.length) },
        { label: 'Active', value: String(rows.filter((r) => r.status === 'Active').length) },
        { label: 'Factories covered', value: String(new Set(rows.map((r) => r.factory)).size) },
        { label: 'Barcoded', value: `${rows.filter((r) => r.barcode).length}/${rows.length}` },
      ]}
      columns={columns}
      rows={rows}
      onRowClick={() => {}}
      emptyTitle={`No ${label}s registered`}
      emptyDescription={`Register a ${label} to make it selectable in Stock Refill, Transfers and production.`}
      footnote="A record cannot be created with missing required fields or a code that duplicates an existing entry."
    >
      {loadingItems && <Loader label="Loading stock items…" />}
    </RegisterShell>
  )
}