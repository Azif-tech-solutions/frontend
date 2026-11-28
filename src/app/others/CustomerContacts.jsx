// import { useState } from 'react'
// import { Badge } from '../../ds/components/core/Badge.jsx'
// import { Button } from '../../ds/components/core/Button.jsx'
// import { Input } from '../../ds/components/forms/Input.jsx'
// import { Select } from '../../ds/components/forms/Select.jsx'
// import { RegisterShell } from '../shells/RegisterShell.jsx'
// import { FormShell } from '../shells/FormShell.jsx'
// import { Panel, FieldSet, MetaRow } from '../shells/Page.jsx'
// import { showrooms } from '../sampleShowroom.js'
// import { nigerianStates } from '../sampleProcess.js'
// import { customers, customerTypes } from '../sampleOthers.js'

// const TYPE_TONE = { 'Authorised Dealer': 'brand', 'Special Customer': 'info', 'Ordinary Customer': 'neutral', 'No Credit / Walk-in': 'neutral' }

// const columns = [
//   { key: 'code', label: 'Code', width: 110, mono: true },
//   { key: 'name', label: 'Name', width: 240 },
//   { key: 'phone', label: 'Phone number', width: 180, mono: true },
//   { key: 'address', label: 'Address', width: 340 },
//   { key: 'state', label: 'State', width: 120 },
//   {
//     key: 'type', label: 'Customer type', width: 190,
//     render: (c) => <Badge tone={TYPE_TONE[c.type] || 'neutral'}>{c.type}</Badge>,
//   },
//   { key: 'showroom', label: 'Home showroom', width: 190 },
//   { key: 'rep', label: 'Sales rep', width: 180 },
//   { key: 'since', label: 'Customer since', width: 160 },
// ]

// function ContactForm({ crumbs, onBack }) {
//   return (
//     <FormShell
//       crumbs={crumbs}
//       title="Add customer contact"
//       icon="contact-round"
//       description="Store a customer's contact details so they can be reached and linked to transactions, invoices and deliveries."
//       headerActions={<Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>Back to contacts</Button>}
//       submitLabel="Save contact"
//       onCancel={onBack}
//       note="Contacts added here become selectable when raising invoices, pro-formas and waybills."
//       aside={
//         <Panel title="Where contacts are used">
//           <MetaRow label="Invoices" value="Buyer details" />
//           <MetaRow label="Waybills" value="Delivery address" />
//           <MetaRow label="Pro-forma invoices" value="Addressee" />
//           <MetaRow label="Customer History" value="Record lookup" />
//         </Panel>
//       }
//     >
//       <Panel title="Contact details">
//         <FieldSet columns={2}>
//           <Input label="Full name / business name" placeholder="e.g. Ibadan Beverage Traders" />
//           <Input label="Customer code" placeholder="Auto-generated" disabled value="CU-0095" />
//           <Input label="Phone number" placeholder="+234 …" />
//           <Input label="Alternate phone" placeholder="Optional" />
//           <Input label="Email address" placeholder="Optional" />
//           <Select label="Customer type" options={customerTypes} placeholder="Select type…" />
//         </FieldSet>
//       </Panel>

//       <Panel title="Address & assignment">
//         <FieldSet columns={2}>
//           <Input label="Street address" placeholder="e.g. 12 Ring Road" />
//           <Input label="City / town" placeholder="e.g. Ibadan" />
//           <Select label="State" options={nigerianStates} placeholder="Select state…" />
//           <Select label="Home showroom" options={showrooms} placeholder="Select showroom…" />
//         </FieldSet>
//       </Panel>
//     </FormShell>
//   )
// }

// export default function CustomerContacts({ leaf, moduleLabel, parentLabel }) {
//   const [mode, setMode] = useState('list')
//   const crumbs = [moduleLabel, parentLabel, leaf?.label].filter(Boolean)

//   if (mode === 'create') return <ContactForm crumbs={crumbs} onBack={() => setMode('list')} />

//   const contactable = customers.filter((c) => c.phone !== '—')

//   return (
//     <RegisterShell
//       wide
//       crumbs={[moduleLabel, parentLabel]}
//       title={leaf?.label || 'Customer Contacts'}
//       icon={leaf?.icon}
//       description="Directory of customer contact details — names, phone numbers and addresses — used across invoices, waybills and customer records."
//       createLabel="Add contact"
//       onCreate={() => setMode('create')}
//       searchPlaceholder="Search by name, phone number or address…"
//       filters={
//         <>
//           <Select options={customerTypes} placeholder="All types" style={{ width: 190 }} />
//           <Select options={nigerianStates} placeholder="All states" style={{ width: 170 }} />
//         </>
//       }
//       stats={[
//         { label: 'Contacts on file', value: String(customers.length) },
//         { label: 'With phone number', value: String(contactable.length) },
//         { label: 'States covered', value: String(new Set(customers.map((c) => c.state).filter((s) => s !== '—')).size) },
//         { label: 'Assigned to a rep', value: String(customers.filter((c) => c.rep !== '—').length) },
//       ]}
//       columns={columns}
//       rows={customers}
//       onRowClick={() => {}}
//       emptyTitle="No contacts on file"
//       emptyDescription="Add a customer contact so they can be selected on invoices and deliveries."
//       footnote="Walk-in counter sales carry no contact details. A temporary record is created automatically when a walk-in customer returns goods, and removed once the resulting wallet balance is spent."
//     />
//   )
// }

// import { useEffect, useState, useCallback } from 'react'
// import { Badge } from '../../ds/components/core/Badge.jsx'
// import { Button } from '../../ds/components/core/Button.jsx'
// import { Input } from '../../ds/components/forms/Input.jsx'
// import { Select } from '../../ds/components/forms/Select.jsx'
// import Loader from '../../ds/components/core/Loader.jsx'
// import { RegisterShell } from '../shells/RegisterShell.jsx'
// import { FormShell } from '../shells/FormShell.jsx'
// import { Panel, FieldSet, MetaRow, Callout } from '../shells/Page.jsx'
// import { useStore } from '../store.jsx'
// import { money, moneyShort, fmtDate } from '../utils.js'
// import CustomerApi from '../../api/CustomerApi.js'
// import InvoiceApi from '../../api/InvoiceApi.js'
// import ShowroomApi from '../../api/ShowroomApi.js'

// const customerApi = new CustomerApi()
// const invoiceApi = new InvoiceApi()
// const showroomApi = new ShowroomApi()
// const PAGE_SIZE = 20

// // Backend enum from CustomerTypes.ts
// const CUSTOMER_TYPES = [
//   { value: 'NO_CREDIT_WALKIN', label: 'No Credit / Walk-in' },
//   { value: 'ORDINARY_CUSTOMER', label: 'Ordinary Customer' },
//   { value: 'SPECIAL_CUSTOMER', label: 'Special Customer' },
//   { value: 'AUTHORISED_DEALER', label: 'Authorised Dealer' },
// ]
// const TYPE_LABEL = Object.fromEntries(
//   CUSTOMER_TYPES.map((t) => [t.value, t.label])
// )
// const TYPE_TONE = {
//   NO_CREDIT_WALKIN: 'neutral',
//   ORDINARY_CUSTOMER: 'neutral',
//   SPECIAL_CUSTOMER: 'info',
//   AUTHORISED_DEALER: 'brand',
// }

// const STATUS_OPTIONS = [
//   { value: 'ACTIVE', label: 'Active' },
//   { value: 'WATCH', label: 'Watch' },
//   { value: 'SUSPENDED', label: 'Suspended' },
// ]
// const STATUS_LABEL = Object.fromEntries(
//   STATUS_OPTIONS.map((s) => [s.value, s.label])
// )
// const STATUS_TONE = {
//   ACTIVE: 'success',
//   WATCH: 'warning',
//   SUSPENDED: 'danger',
// }

// const today = () => new Date().toISOString().slice(0, 10)

// function val(payload) {
//   if (payload == null) return payload
//   if (typeof payload === 'object') {
//     if (payload.target && 'value' in payload.target) return payload.target.value
//     if ('value' in payload) return payload.value
//   }
//   return payload
// }

// // ── Customer form (create + edit) ─────────────────────────
// function CustomerForm({
//   mode,
//   customer,
//   crumbs,
//   states,
//   lgas,
//   loadingLgas,
//   showrooms,
//   correspondents,
//   categories,
//   onStateChange,
//   onBack,
//   onDone,
// }) {
//   const { showToast } = useStore()
//   const isEdit = mode === 'edit'

//   // In edit mode, `customer` is the full Customer object from getCustomerDetail
//   const [type, setType] = useState(
//     customer?.type || 'ORDINARY_CUSTOMER'
//   )
//   const [name, setName] = useState(customer?.name || '')
//   const [contactPerson, setContactPerson] = useState(
//     customer?.contactPerson || ''
//   )
//   const [phone, setPhone] = useState(customer?.phone || '')
//   const [alternatePhone, setAlternatePhone] = useState(
//     customer?.alternatePhone || ''
//   )
//   const [email, setEmail] = useState(customer?.email || '')
//   const [tin, setTin] = useState(customer?.tin || '')
//   const [businessDescription, setBusinessDescription] = useState(
//     customer?.businessDescription || ''
//   )
//   const [streetAddress, setStreetAddress] = useState(
//     customer?.streetAddress || ''
//   )
//   const [city, setCity] = useState(customer?.city || '')
//   const [stateCode, setStateCode] = useState(customer?.stateCode || '')
//   const [lgaCode, setLgaCode] = useState(customer?.lgaCode || '')
//   const [locationId, setLocationId] = useState(
//     customer?.location?.id || ''
//   )
//   const [correspondentId, setCorrespondentId] = useState(
//     customer?.correspondent?.id || ''
//   )
//   const [dealerCategoryId, setDealerCategoryId] = useState(
//     customer?.dealerCategory?.id || ''
//   )
//   const [creditLimit, setCreditLimit] = useState(
//     customer?.creditLimit != null ? String(customer.creditLimit) : ''
//   )
//   const [customerSince, setCustomerSince] = useState(
//     customer?.customerSince || today()
//   )
//   const [submitting, setSubmitting] = useState(false)

//   const isDealer = type === 'AUTHORISED_DEALER'

//   // trigger LGA load when the state changes; edit mode also fires this on mount
//   useEffect(() => {
//     if (stateCode) onStateChange(stateCode)
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [stateCode])

//   const missingFields = []
//   if (!name.trim()) missingFields.push('Name')
//   if (!phone.trim()) missingFields.push('Phone')
//   if (!alternatePhone.trim()) missingFields.push('Alternate phone')
//   if (!tin.trim()) missingFields.push('Tax identification no.')
//   if (!streetAddress.trim()) missingFields.push('Street address')
//   if (!stateCode) missingFields.push('State')
//   if (!lgaCode) missingFields.push('LGA')
//   if (!locationId) missingFields.push('Home showroom')
//   if (isDealer && !dealerCategoryId)
//     missingFields.push('Dealer category')

//   const canSubmit = missingFields.length === 0 && !submitting

//   async function submit() {
//     if (!canSubmit) return
//     setSubmitting(true)
//     try {
//       if (isEdit) {
//         // EditCustomerCredentials — no type / dealerCategory / customerSince
//         await customerApi.editCustomer(customer.id, {
//           name: name.trim(),
//           contactPerson: contactPerson.trim(),
//           phone: phone.trim(),
//           alternatePhone: alternatePhone.trim(),
//           email: email.trim(),
//           tin: tin.trim(),
//           businessDescription: businessDescription.trim(),
//           streetAddress: streetAddress.trim(),
//           city: city.trim(),
//           stateCode,
//           lgaCode,
//           locationId,
//           correspondentId: correspondentId || '',
//           creditLimit: Number(creditLimit) || 0,
//           customAttributes: customer?.customAttributes || {},
//         })
//         showToast('Customer updated', `${name.trim()} saved.`)
//       } else {
//         // CreateCustomerDealerCredentials — full payload with type
//         await customerApi.createCustomer({
//           type,
//           name: name.trim(),
//           contactPerson: contactPerson.trim(),
//           phone: phone.trim(),
//           alternatePhone: alternatePhone.trim(),
//           email: email.trim(),
//           tin: tin.trim(),
//           businessDescription: businessDescription.trim(),
//           streetAddress: streetAddress.trim(),
//           city: city.trim(),
//           stateCode,
//           lgaCode,
//           locationId,
//           correspondentId: correspondentId || '',
//           dealerCategoryId: isDealer ? dealerCategoryId : '',
//           creditLimit: Number(creditLimit) || 0,
//           customerSince,
//           customAttributes: {},
//         })
//         showToast(
//           'Customer created',
//           `${name.trim()} added to the register.`
//         )
//       }
//       onDone()
//     } catch (e) {
//       showToast(
//         isEdit ? 'Could not update customer' : 'Could not create customer',
//         e.message,
//         true
//       )
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   return (
//     <>
//       {submitting && (
//         <Loader
//           overlay
//           label={isEdit ? 'Saving changes…' : 'Creating customer…'}
//         />
//       )}
//       <FormShell
//         wide
//         crumbs={crumbs}
//         title={
//           isEdit
//             ? `Edit ${customer?.name || 'customer'}`
//             : 'Add customer'
//         }
//         icon={isEdit ? 'edit' : 'user-round-plus'}
//         description={
//           isEdit
//             ? 'Update this customer\u2019s contact and assignment details. Type and dealer category are set at creation and cannot be changed here.'
//             : 'Register a walk-in, ordinary, special customer, or authorised dealer. Dealers require a dealer category and can be linked to a correspondent.'
//         }
//         headerActions={
//           <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>
//             Back to list
//           </Button>
//         }
//         submitLabel={isEdit ? 'Save changes' : 'Add customer'}
//         onSubmit={submit}
//         onCancel={onBack}
//         submitDisabled={!canSubmit}
//         note={
//           isEdit
//             ? 'Changes to contact details are reflected immediately on new invoices, waybills and delivery notes.'
//             : 'A customer record created here is available across invoicing, deliveries and reporting immediately.'
//         }
//         aside={
//           <Panel title="Customer type">
//             {isEdit ? (
//               <MetaRow
//                 label="Type"
//                 value={TYPE_LABEL[customer?.type] || customer?.type || '—'}
//               />
//             ) : (
//               <>
//                 <MetaRow label="Type" value={TYPE_LABEL[type] || type} />
//                 <MetaRow
//                   label="Dealer category"
//                   value={
//                     isDealer
//                       ? categories.find((c) => c.value === dealerCategoryId)
//                           ?.label || 'Not set'
//                       : 'Not applicable'
//                   }
//                 />
//               </>
//             )}
//             <MetaRow
//               label="Customer since"
//               value={fmtDate(customerSince)}
//             />
//           </Panel>
//         }
//       >
//         {missingFields.length > 0 && (
//           <Callout
//             tone="warning"
//             icon="circle-alert"
//             title="Complete these fields to enable submit"
//             style={{ marginBottom: 14 }}
//           >
//             {missingFields.join(' · ')}
//           </Callout>
//         )}

//         <Panel title="Contact details">
//           <FieldSet columns={2}>
//             {!isEdit && (
//               <Select
//                 label="Customer type *"
//                 options={CUSTOMER_TYPES}
//                 value={type}
//                 onChange={(v) => setType(val(v))}
//               />
//             )}
//             <Input
//               label="Full name / business name *"
//               placeholder="e.g. Ibadan Beverage Traders"
//               value={name}
//               onChange={(e) => setName(val(e))}
//             />
//             <Input label="Customer code" value="Auto-generated" disabled />
//             <Input
//               label="Phone number *"
//               placeholder="+234 …"
//               value={phone}
//               onChange={(e) => setPhone(val(e))}
//             />
//             <Input
//               label="Alternate phone *"
//               placeholder="+234 …"
//               value={alternatePhone}
//               onChange={(e) => setAlternatePhone(val(e))}
//             />
//             <Input
//               label="Contact person"
//               placeholder="e.g. Femi Adeyinka"
//               value={contactPerson}
//               onChange={(e) => setContactPerson(val(e))}
//             />
//             <Input
//               label="Email address"
//               placeholder="Optional"
//               value={email}
//               onChange={(e) => setEmail(val(e))}
//             />
//             <Input
//               label="Tax identification no. *"
//               placeholder="e.g. 12345678-0001"
//               value={tin}
//               onChange={(e) => setTin(val(e))}
//             />
//             {!isEdit && (
//               <Input
//                 label="Customer since"
//                 type="date"
//                 value={customerSince}
//                 onChange={(e) => setCustomerSince(val(e))}
//               />
//             )}
//           </FieldSet>
//         </Panel>

//         <Panel title="Address & assignment">
//           <FieldSet columns={2}>
//             <Input
//               label="Street address *"
//               placeholder="e.g. 12 Ring Road"
//               value={streetAddress}
//               onChange={(e) => setStreetAddress(val(e))}
//             />
//             <Input
//               label="City / town"
//               placeholder="e.g. Ibadan"
//               value={city}
//               onChange={(e) => setCity(val(e))}
//             />
//             <Select
//               label="State *"
//               options={states}
//               placeholder="Select state…"
//               value={stateCode}
//               onChange={(v) => setStateCode(val(v))}
//             />
//             <Select
//               label="LGA *"
//               options={lgas}
//               placeholder={
//                 !stateCode
//                   ? 'Select a state first'
//                   : loadingLgas
//                     ? 'Loading LGAs…'
//                     : 'Select LGA…'
//               }
//               value={lgaCode}
//               onChange={(v) => setLgaCode(val(v))}
//               disabled={!stateCode || loadingLgas}
//             />
//             <Select
//               label="Home showroom *"
//               options={showrooms}
//               placeholder="Select showroom…"
//               value={locationId}
//               onChange={(v) => setLocationId(val(v))}
//             />
//             <Select
//               label="Sales correspondent"
//               options={[
//                 { value: '', label: 'Not linked' },
//                 ...correspondents,
//               ]}
//               placeholder="Optional"
//               value={correspondentId}
//               onChange={(v) => setCorrespondentId(val(v))}
//             />
//             {!isEdit && isDealer && (
//               <Select
//                 label="Dealer category *"
//                 options={categories}
//                 placeholder="Select category…"
//                 value={dealerCategoryId}
//                 onChange={(v) => setDealerCategoryId(val(v))}
//               />
//             )}
//             <Input
//               label="Credit limit (₦)"
//               type="number"
//               placeholder="0.00"
//               value={creditLimit}
//               onChange={(e) => setCreditLimit(val(e))}
//             />
//           </FieldSet>
//         </Panel>

//         <Panel
//           title="Business description"
//           description="What the customer does — useful for categorisation and reporting."
//         >
//           <textarea
//             rows={2}
//             placeholder="e.g. Wholesale beverage distributor covering Oyo and Osun."
//             value={businessDescription}
//             onChange={(e) => setBusinessDescription(val(e))}
//             style={{
//               width: '100%',
//               padding: '10px 12px',
//               resize: 'vertical',
//               background: 'var(--surface-card)',
//               border: '1px solid var(--border-default)',
//               borderRadius: 'var(--radius-control)',
//               font: 'var(--fw-regular) var(--text-sm)/1.5 var(--font-ui)',
//               color: 'var(--text-strong)',
//               outline: 'none',
//             }}
//           />
//         </Panel>
//       </FormShell>
//     </>
//   )
// }

// // ── Detail view ───────────────────────────────────────────
// function CustomerDetail({ customer, crumbs, onBack, onEdit, onStatus }) {
//   if (!customer) return null

//   return (
//     <FormShell
//       wide
//       crumbs={crumbs}
//       title={customer.name}
//       icon="user-round"
//       headerActions={
//         <div style={{ display: 'flex', gap: 8 }}>
//           <Button variant="secondary" onClick={onEdit}>
//             Edit
//           </Button>
//           <Button variant="secondary" onClick={onStatus}>
//             Change status
//           </Button>
//           <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>
//             Back
//           </Button>
//         </div>
//       }
//       submitLabel={null}
//       onCancel={onBack}
//       aside={
//         <Panel title="Financials">
//           <MetaRow
//             label="Wallet balance"
//             value={money(customer.walletBalance || 0)}
//             mono
//           />
//           <MetaRow
//             label="Deposit balance"
//             value={money(customer.depositBalance || 0)}
//             mono
//           />
//           <MetaRow
//             label="Credit limit"
//             value={money(customer.creditLimit || 0)}
//             mono
//           />
//           <MetaRow
//             label="Lifetime value"
//             value={money(customer.lifetimeValue || 0)}
//             mono
//           />
//           <MetaRow
//             label="Last purchase"
//             value={
//               customer.lastPurchaseAt
//                 ? fmtDate(customer.lastPurchaseAt)
//                 : '—'
//             }
//           />
//         </Panel>
//       }
//     >
//       <Panel title="Identity">
//         <FieldSet columns={2}>
//           <MetaRow label="Code" value={customer.code} mono />
//           <MetaRow
//             label="Type"
//             value={
//               <Badge tone={TYPE_TONE[customer.type] || 'neutral'}>
//                 {TYPE_LABEL[customer.type] || customer.type || '—'}
//               </Badge>
//             }
//           />
//           <MetaRow
//             label="Status"
//             value={
//               <Badge tone={STATUS_TONE[customer.status] || 'neutral'}>
//                 {STATUS_LABEL[customer.status] || customer.status || '—'}
//               </Badge>
//             }
//           />
//           <MetaRow
//             label="Temporary"
//             value={customer.isTemporary ? 'Yes' : 'No'}
//           />
//           <MetaRow
//             label="Customer since"
//             value={
//               customer.customerSince
//                 ? fmtDate(customer.customerSince)
//                 : '—'
//             }
//           />
//           {customer.statusReason && (
//             <MetaRow label="Status reason" value={customer.statusReason} />
//           )}
//         </FieldSet>
//       </Panel>

//       <Panel title="Contact">
//         <FieldSet columns={2}>
//           <MetaRow
//             label="Contact person"
//             value={customer.contactPerson || '—'}
//           />
//           <MetaRow label="Phone" value={customer.phone || '—'} mono />
//           <MetaRow
//             label="Alternate phone"
//             value={customer.alternatePhone || '—'}
//             mono
//           />
//           <MetaRow label="Email" value={customer.email || '—'} />
//           <MetaRow label="TIN" value={customer.tin || '—'} mono />
//         </FieldSet>
//       </Panel>

//       <Panel title="Address">
//         <FieldSet columns={2}>
//           <MetaRow label="Street" value={customer.streetAddress || '—'} />
//           <MetaRow label="City" value={customer.city || '—'} />
//           <MetaRow label="State" value={customer.stateName || '—'} />
//           <MetaRow label="LGA" value={customer.lgaName || '—'} />
//         </FieldSet>
//       </Panel>

//       <Panel title="Assignment">
//         <FieldSet columns={2}>
//           <MetaRow
//             label="Home showroom"
//             value={customer.location?.name || '—'}
//           />
//           <MetaRow
//             label="Correspondent"
//             value={customer.correspondent?.name || '—'}
//           />
//           {customer.dealerCategory && (
//             <MetaRow
//               label="Dealer category"
//               value={customer.dealerCategory?.name || '—'}
//             />
//           )}
//         </FieldSet>
//       </Panel>

//       {customer.businessDescription && (
//         <Panel title="Business description">
//           <div
//             style={{
//               font: 'var(--type-body)',
//               color: 'var(--text-strong)',
//               lineHeight: 1.6,
//             }}
//           >
//             {customer.businessDescription}
//           </div>
//         </Panel>
//       )}
//     </FormShell>
//   )
// }

// // ── Status change form ────────────────────────────────────
// function StatusChangeForm({ customer, crumbs, onBack, onDone }) {
//   const { showToast } = useStore()
//   const [status, setStatus] = useState(customer.status || 'ACTIVE')
//   const [reason, setReason] = useState('')
//   const [submitting, setSubmitting] = useState(false)

//   const changed = status !== customer.status
//   const canSubmit =
//     changed && (status === 'ACTIVE' || reason.trim()) && !submitting

//   async function submit() {
//     if (!canSubmit) return
//     setSubmitting(true)
//     try {
//       await customerApi.updateCustomerStatus(customer.id, {
//         status,
//         reason: reason.trim(),
//       })
//       showToast(
//         'Status updated',
//         `${customer.name} is now ${STATUS_LABEL[status].toLowerCase()}.`
//       )
//       onDone()
//     } catch (e) {
//       showToast('Could not change status', e.message, true)
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   return (
//     <>
//       {submitting && <Loader overlay label="Updating status…" />}
//       <FormShell
//         wide
//         crumbs={crumbs}
//         title={`Change status — ${customer.name}`}
//         icon="shield-alert"
//         description="Change how this customer can transact. A reason is required for any status other than Active."
//         headerActions={
//           <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>
//             Back
//           </Button>
//         }
//         submitLabel="Update status"
//         onSubmit={submit}
//         onCancel={onBack}
//         submitDisabled={!canSubmit}
//         aside={
//           <Panel title="Customer">
//             <MetaRow label="Code" value={customer.code} mono />
//             <MetaRow label="Name" value={customer.name} />
//             <MetaRow
//               label="Type"
//               value={TYPE_LABEL[customer.type] || customer.type}
//             />
//             <MetaRow
//               label="Current status"
//               value={
//                 <Badge tone={STATUS_TONE[customer.status] || 'neutral'}>
//                   {STATUS_LABEL[customer.status] || customer.status}
//                 </Badge>
//               }
//             />
//           </Panel>
//         }
//       >
//         <Panel title="New status">
//           <FieldSet columns={1}>
//             <Select
//               label="Status *"
//               options={STATUS_OPTIONS}
//               value={status}
//               onChange={(v) => setStatus(val(v))}
//             />
//           </FieldSet>
//           <div style={{ marginTop: 14 }}>
//             <label style={{ display: 'block' }}>
//               <div
//                 style={{
//                   font: 'var(--type-label)',
//                   color: 'var(--text-strong)',
//                   marginBottom: 6,
//                 }}
//               >
//                 Reason {status !== 'ACTIVE' ? '*' : '(optional)'}
//               </div>
//               <textarea
//                 rows={3}
//                 placeholder={
//                   status === 'WATCH'
//                     ? 'Why is this customer being placed on watch?'
//                     : status === 'SUSPENDED'
//                       ? 'Why is this customer being suspended?'
//                       : 'Any note to accompany the reinstatement.'
//                 }
//                 value={reason}
//                 onChange={(e) => setReason(val(e))}
//                 style={{
//                   width: '100%',
//                   padding: '10px 12px',
//                   resize: 'vertical',
//                   background: 'var(--surface-card)',
//                   border: '1px solid var(--border-default)',
//                   borderRadius: 'var(--radius-control)',
//                   font: 'var(--fw-regular) var(--text-sm)/1.5 var(--font-ui)',
//                   color: 'var(--text-strong)',
//                   outline: 'none',
//                 }}
//               />
//             </label>
//           </div>
//           {status === 'SUSPENDED' && (
//             <Callout
//               tone="danger"
//               icon="circle-alert"
//               title="Suspension blocks new transactions"
//               style={{ marginTop: 14 }}
//             >
//               A suspended customer cannot make purchases on credit. Any
//               existing credit or wallet balance remains on record.
//             </Callout>
//           )}
//         </Panel>
//       </FormShell>
//     </>
//   )
// }

// // ── Main page ─────────────────────────────────────────────
// export default function CustomerContacts({
//   leaf,
//   moduleLabel,
//   parentLabel,
// }) {
//   const { showToast } = useStore()
//   const crumbs = [moduleLabel, parentLabel, leaf?.label].filter(Boolean)

//   const [mode, setMode] = useState('list') // list | create | edit | detail | status
//   const [active, setActive] = useState(null)
//   const [loadingDetail, setLoadingDetail] = useState(false)

//   // filters
//   const [searchInput, setSearchInput] = useState('')
//   const [search, setSearch] = useState('')
//   const [typeFilter, setTypeFilter] = useState('')
//   const [statusFilter, setStatusFilter] = useState('')
//   const [stateFilter, setStateFilter] = useState('')
//   const [locationFilter, setLocationFilter] = useState('')

//   // pagination
//   const [page, setPage] = useState(0)
//   const [totalPages, setTotalPages] = useState(0)
//   const [totalItems, setTotalItems] = useState(0)

//   // data
//   const [rows, setRows] = useState([])
//   const [loading, setLoading] = useState(false)

//   // lookups
//   const [states, setStates] = useState([])
//   const [lgas, setLgas] = useState([])
//   const [loadingLgas, setLoadingLgas] = useState(false)
//   const [showrooms, setShowrooms] = useState([])
//   const [correspondents, setCorrespondents] = useState([])
//   const [categories, setCategories] = useState([])

//   // ── debounce search ─────────────────────────────────────
//   useEffect(() => {
//     const t = setTimeout(() => setSearch(searchInput), 300)
//     return () => clearTimeout(t)
//   }, [searchInput])

//   // ── static lookups ──────────────────────────────────────
//   useEffect(() => {
//     let cancelled = false
//     Promise.all([
//       invoiceApi.getStateList().catch(() => ({ data: [] })),
//       showroomApi
//         .lookupPickerWithAreas({ status: ['ACTIVE'] })
//         .catch(() => ({ data: [] })),
//       customerApi
//         .listCorrespondents({
//           status: ['ASSIGNED'],
//           page: 0,
//           size: 200,
//         })
//         .catch(() => ({ data: { items: [] } })),
//       customerApi.listDealerCategories().catch(() => ({ data: [] })),
//     ]).then(([stateRes, showroomRes, corrRes, catRes]) => {
//       if (cancelled) return
//       setStates(
//         (stateRes.data || []).map((s) => ({
//           value: s.code || s.stateCode,
//           label: s.name,
//         }))
//       )
//       setShowrooms(
//         (showroomRes.data || []).map((s) => ({
//           value: s.id,
//           label: s.label || s.name || s.code,
//         }))
//       )
//       setCorrespondents(
//         (corrRes.data?.items || []).map((c) => ({
//           value: c.id,
//           label: c.name,
//         }))
//       )
//       setCategories(
//         (catRes.data || [])
//           .filter((c) => c.status === 'ACTIVE')
//           .map((c) => ({ value: c.id, label: c.name }))
//       )
//     })
//     return () => {
//       cancelled = true
//     }
//   }, [])

//   // ── LGA lookup (triggered by forms) ─────────────────────
//   const loadLgas = useCallback(async (stateCode) => {
//     if (!stateCode) {
//       setLgas([])
//       return
//     }
//     setLoadingLgas(true)
//     try {
//       const res = await invoiceApi.getLGAList(stateCode)
//       setLgas(
//         (res.data || []).map((l) => ({
//           value: l.code || l.stateCode,
//           label: l.name,
//         }))
//       )
//     } catch (e) {
//       setLgas([])
//     } finally {
//       setLoadingLgas(false)
//     }
//   }, [])

//   // ── reset page on filter change ─────────────────────────
//   useEffect(() => {
//     setPage(0)
//   }, [search, typeFilter, statusFilter, stateFilter, locationFilter])

//   // ── load list ───────────────────────────────────────────
//   const load = useCallback(async () => {
//     setLoading(true)
//     try {
//       const q = { page, size: PAGE_SIZE }
//       if (search) q.q = search
//       if (typeFilter) q.type = [typeFilter]
//       if (statusFilter) q.status = [statusFilter]
//       if (stateFilter) q.stateCode = stateFilter
//       if (locationFilter) q.locationId = locationFilter

//       const res = await customerApi.listCustomers(q)
//       const paged = res.data
//       setRows(paged.items || [])
//       setTotalPages(paged.totalPages || 0)
//       setTotalItems(paged.totalItems || 0)
//     } catch (e) {
//       showToast('Could not load customers', e.message, true)
//     } finally {
//       setLoading(false)
//     }
//   }, [
//     page,
//     search,
//     typeFilter,
//     statusFilter,
//     stateFilter,
//     locationFilter,
//     showToast,
//   ])

//   useEffect(() => {
//     load()
//   }, [load])

//   // ── open detail (fetch the full Customer record) ────────
//   async function openDetail(row) {
//     setLoadingDetail(true)
//     try {
//       const res = await customerApi.getCustomerDetail(row.id)
//       setActive(res.data)
//       setMode('detail')
//     } catch (e) {
//       showToast('Could not load customer detail', e.message, true)
//     } finally {
//       setLoadingDetail(false)
//     }
//   }

//   const afterMutation = () => {
//     setMode('list')
//     setActive(null)
//     load()
//   }

//   // ── mode guards ─────────────────────────────────────────
//   if (mode === 'create') {
//     return (
//       <CustomerForm
//         mode="create"
//         crumbs={crumbs}
//         states={states}
//         lgas={lgas}
//         loadingLgas={loadingLgas}
//         showrooms={showrooms}
//         correspondents={correspondents}
//         categories={categories}
//         onStateChange={loadLgas}
//         onBack={() => setMode('list')}
//         onDone={afterMutation}
//       />
//     )
//   }

//   if (mode === 'edit' && active) {
//     return (
//       <CustomerForm
//         mode="edit"
//         customer={active}
//         crumbs={crumbs}
//         states={states}
//         lgas={lgas}
//         loadingLgas={loadingLgas}
//         showrooms={showrooms}
//         correspondents={correspondents}
//         categories={categories}
//         onStateChange={loadLgas}
//         onBack={() => setMode('detail')}
//         onDone={afterMutation}
//       />
//     )
//   }

//   if (mode === 'detail' && active) {
//     return (
//       <CustomerDetail
//         customer={active}
//         crumbs={crumbs}
//         onBack={() => setMode('list')}
//         onEdit={() => setMode('edit')}
//         onStatus={() => setMode('status')}
//       />
//     )
//   }

//   if (mode === 'status' && active) {
//     return (
//       <StatusChangeForm
//         customer={active}
//         crumbs={crumbs}
//         onBack={() => setMode('detail')}
//         onDone={async () => {
//           // refresh the detail after status change
//           try {
//             const res = await customerApi.getCustomerDetail(active.id)
//             setActive(res.data)
//             setMode('detail')
//             load()
//           } catch {
//             afterMutation()
//           }
//         }}
//       />
//     )
//   }

//   // ── columns ─────────────────────────────────────────────
//   const columns = [
//     { key: 'code', label: 'Code', width: 110, mono: true },
//     { key: 'name', label: 'Name', width: 220 },
//     {
//       key: 'phone',
//       label: 'Phone number',
//       width: 170,
//       mono: true,
//       render: (r) => r.phone || '—',
//     },
//     {
//       key: 'state',
//       label: 'State',
//       width: 140,
//       render: (r) => r.stateName || r.stateCode || '—',
//     },
//     {
//       key: 'type',
//       label: 'Customer type',
//       width: 180,
//       render: (r) => (
//         <Badge tone={TYPE_TONE[r.type] || 'neutral'}>
//           {TYPE_LABEL[r.type] || r.type || '—'}
//         </Badge>
//       ),
//     },
//     {
//       key: 'showroom',
//       label: 'Home showroom',
//       width: 190,
//       render: (r) => r.location?.name || '—',
//     },
//     {
//       key: 'rep',
//       label: 'Correspondent',
//       width: 180,
//       render: (r) => r.correspondent?.name || '—',
//     },
//     {
//       key: 'wallet',
//       label: 'Wallet',
//       width: 140,
//       align: 'right',
//       mono: true,
//       render: (r) => money(r.walletBalance || 0),
//     },
//     {
//       key: 'creditLimit',
//       label: 'Credit limit',
//       width: 150,
//       align: 'right',
//       mono: true,
//       render: (r) => money(r.creditLimit || 0),
//     },
//     {
//       key: 'status',
//       label: 'Status',
//       width: 120,
//       render: (r) => (
//         <Badge tone={STATUS_TONE[r.status] || 'neutral'}>
//           {STATUS_LABEL[r.status] || r.status || '—'}
//         </Badge>
//       ),
//     },
//   ]

//   // ── filter options ──────────────────────────────────────
//   const typeFilterOptions = [
//     { value: '', label: 'All types' },
//     ...CUSTOMER_TYPES,
//   ]
//   const statusFilterOptions = [
//     { value: '', label: 'All statuses' },
//     ...STATUS_OPTIONS,
//   ]
//   const stateFilterOptions = [{ value: '', label: 'All states' }, ...states]
//   const locationFilterOptions = [
//     { value: '', label: 'All showrooms' },
//     ...showrooms,
//   ]

//   // ── stats ───────────────────────────────────────────────
//   const dealerCount = rows.filter(
//     (r) => r.type === 'AUTHORISED_DEALER'
//   ).length
//   const activeCount = rows.filter((r) => r.status === 'ACTIVE').length
//   const totalWallet = rows.reduce((n, r) => n + (r.walletBalance || 0), 0)

//   return (
//     <>
//       {(loading || loadingDetail) && (
//         <Loader
//           overlay
//           label={
//             loadingDetail ? 'Loading customer…' : 'Loading customers…'
//           }
//         />
//       )}
//       <RegisterShell
//         wide
//         crumbs={[moduleLabel, parentLabel]}
//         title={leaf?.label || 'Customer Contacts'}
//         icon={leaf?.icon}
//         description="Directory of customer contact details — names, phone numbers and addresses — used across invoices, waybills and customer records."
//         createLabel="Add customer"
//         onCreate={() => setMode('create')}
//         search={searchInput}
//         onSearch={setSearchInput}
//         searchPlaceholder="Search by name, phone number or address…"
//         pagination={{
//           page,
//           pageCount: totalPages,
//           pageSize: PAGE_SIZE,
//           total: totalItems,
//           onPage: setPage,
//         }}
//         filters={
//           <>
//             <Select
//               options={typeFilterOptions}
//               value={typeFilter}
//               onChange={(v) => setTypeFilter(val(v))}
//               style={{ width: 190 }}
//             />
//             <Select
//               options={statusFilterOptions}
//               value={statusFilter}
//               onChange={(v) => setStatusFilter(val(v))}
//               style={{ width: 160 }}
//             />
//             <Select
//               options={stateFilterOptions}
//               value={stateFilter}
//               onChange={(v) => setStateFilter(val(v))}
//               style={{ width: 170 }}
//             />
//             <Select
//               options={locationFilterOptions}
//               value={locationFilter}
//               onChange={(v) => setLocationFilter(val(v))}
//               style={{ width: 200 }}
//             />
//           </>
//         }
//         stats={[
//           { label: 'Contacts on file', value: String(totalItems) },
//           { label: 'Active (this page)', value: String(activeCount) },
//           { label: 'Dealers (this page)', value: String(dealerCount) },
//           { label: 'Wallet (this page)', value: moneyShort(totalWallet) },
//         ]}
//         columns={columns}
//         rows={rows}
//         onRowClick={openDetail}
//         emptyTitle="No customers on file"
//         emptyDescription="Add a customer so they can be selected on invoices and deliveries."
//         footnote="Walk-in counter sales carry no contact details. A temporary record is created automatically when a walk-in customer returns goods, and removed once the resulting wallet balance is spent."
//       />
//     </>
//   )
// }








import { useEffect, useState, useCallback } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import Loader from '../../ds/components/core/Loader.jsx'
import { RegisterShell } from '../shells/RegisterShell.jsx'
import { FormShell } from '../shells/FormShell.jsx'
import { Panel, FieldSet, MetaRow, Callout } from '../shells/Page.jsx'
import { useStore } from '../store.jsx'
import { money, moneyShort, fmtDate } from '../utils.js'
import CustomerApi from '../../api/CustomerApi.js'
import InvoiceApi from '../../api/InvoiceApi.js'
import ShowroomApi from '../../api/ShowroomApi.js'

const customerApi = new CustomerApi()
const invoiceApi = new InvoiceApi()
const showroomApi = new ShowroomApi()
const PAGE_SIZE = 20

// Backend enum from CustomerTypes.ts
const CUSTOMER_TYPES = [
  { value: 'NO_CREDIT_WALKIN', label: 'No Credit / Walk-in' },
  { value: 'ORDINARY_CUSTOMER', label: 'Ordinary Customer' },
  { value: 'SPECIAL_CUSTOMER', label: 'Special Customer' },
  { value: 'AUTHORISED_DEALER', label: 'Authorised Dealer' },
]
const TYPE_LABEL = Object.fromEntries(
  CUSTOMER_TYPES.map((t) => [t.value, t.label])
)
const TYPE_TONE = {
  NO_CREDIT_WALKIN: 'neutral',
  ORDINARY_CUSTOMER: 'neutral',
  SPECIAL_CUSTOMER: 'info',
  AUTHORISED_DEALER: 'brand',
}

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'WATCH', label: 'Watch' },
  { value: 'SUSPENDED', label: 'Suspended' },
]
const STATUS_LABEL = Object.fromEntries(
  STATUS_OPTIONS.map((s) => [s.value, s.label])
)
const STATUS_TONE = {
  ACTIVE: 'success',
  WATCH: 'warning',
  SUSPENDED: 'danger',
}

const today = () => new Date().toISOString().slice(0, 10)

function val(payload) {
  if (payload == null) return payload
  if (typeof payload === 'object') {
    if (payload.target && 'value' in payload.target) return payload.target.value
    if ('value' in payload) return payload.value
  }
  return payload
}

// ── Customer form (create + edit) ─────────────────────────
function CustomerForm({
  mode,
  customer,
  crumbs,
  states,
  lgas,
  loadingLgas,
  showrooms,
  correspondents,
  categories,
  onStateChange,
  onBack,
  onDone,
}) {
  const { showToast } = useStore()
  const isEdit = mode === 'edit'

  // In edit mode, `customer` is the full Customer object from getCustomerDetail
  const [type, setType] = useState(
    customer?.type || 'ORDINARY_CUSTOMER'
  )
  const [name, setName] = useState(customer?.name || '')
  const [contactPerson, setContactPerson] = useState(
    customer?.contactPerson || ''
  )
  const [phone, setPhone] = useState(customer?.phone || '')
  const [alternatePhone, setAlternatePhone] = useState(
    customer?.alternatePhone || ''
  )
  const [email, setEmail] = useState(customer?.email || '')
  const [tin, setTin] = useState(customer?.tin || '')
  const [businessDescription, setBusinessDescription] = useState(
    customer?.businessDescription || ''
  )
  const [streetAddress, setStreetAddress] = useState(
    customer?.streetAddress || ''
  )
  const [city, setCity] = useState(customer?.city || '')
  const [stateCode, setStateCode] = useState(customer?.stateCode || '')
  const [lgaCode, setLgaCode] = useState(customer?.lgaCode || '')
  const [locationId, setLocationId] = useState(
    customer?.location?.id || ''
  )
  const [correspondentId, setCorrespondentId] = useState(
    customer?.correspondent?.id || ''
  )
  const [dealerCategoryId, setDealerCategoryId] = useState(
    customer?.dealerCategory?.id || ''
  )
  const [creditLimit, setCreditLimit] = useState(
    customer?.creditLimit != null ? String(customer.creditLimit) : ''
  )
  const [customerSince, setCustomerSince] = useState(
    customer?.customerSince || today()
  )
  const [submitting, setSubmitting] = useState(false)

  const isDealer = type === 'AUTHORISED_DEALER'

  // trigger LGA load when the state changes; edit mode also fires this on mount
  useEffect(() => {
    if (stateCode) onStateChange(stateCode)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateCode])

  const missingFields = []
  if (!name.trim()) missingFields.push('Name')
  if (!phone.trim()) missingFields.push('Phone')
  if (!alternatePhone.trim()) missingFields.push('Alternate phone')
  if (!tin.trim()) missingFields.push('Tax identification no.')
  if (!streetAddress.trim()) missingFields.push('Street address')
  if (!stateCode) missingFields.push('State')
  if (!lgaCode) missingFields.push('LGA')
  if (!locationId) missingFields.push('Home showroom')
  if (isDealer && !dealerCategoryId)
    missingFields.push('Dealer category')

  const canSubmit = missingFields.length === 0 && !submitting

  async function submit() {
    if (!canSubmit) return
    setSubmitting(true)
    try {
      if (isEdit) {
        // EditCustomerCredentials — no type / dealerCategory / customerSince
        await customerApi.editCustomer(customer.id, {
          name: name.trim(),
          contactPerson: contactPerson.trim(),
          phone: phone.trim(),
          alternatePhone: alternatePhone.trim(),
          email: email.trim(),
          tin: tin.trim(),
          businessDescription: businessDescription.trim(),
          streetAddress: streetAddress.trim(),
          city: city.trim(),
          stateCode,
          lgaCode,
          locationId,
          correspondentId: correspondentId || '',
          creditLimit: Number(creditLimit) || 0,
          customAttributes: customer?.customAttributes || {},
        })
        showToast('Customer updated', `${name.trim()} saved.`)
      } else {
        // CreateCustomerDealerCredentials — full payload with type
        await customerApi.createCustomer({
          type,
          name: name.trim(),
          contactPerson: contactPerson.trim(),
          phone: phone.trim(),
          alternatePhone: alternatePhone.trim(),
          email: email.trim(),
          tin: tin.trim(),
          businessDescription: businessDescription.trim(),
          streetAddress: streetAddress.trim(),
          city: city.trim(),
          stateCode,
          lgaCode,
          locationId,
          correspondentId: correspondentId || '',
          dealerCategoryId: isDealer ? dealerCategoryId : '',
          creditLimit: Number(creditLimit) || 0,
          customerSince,
          customAttributes: {},
        })
        showToast(
          'Customer created',
          `${name.trim()} added to the register.`
        )
      }
      onDone()
    } catch (e) {
      showToast(
        isEdit ? 'Could not update customer' : 'Could not create customer',
        e.message,
        true
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {submitting && (
        <Loader
          overlay
          label={isEdit ? 'Saving changes…' : 'Creating customer…'}
        />
      )}
      <FormShell
        wide
        crumbs={crumbs}
        title={
          isEdit
            ? `Edit ${customer?.name || 'customer'}`
            : 'Add customer'
        }
        icon={isEdit ? 'edit' : 'user-round-plus'}
        description={
          isEdit
            ? 'Update this customer\u2019s contact and assignment details. Type and dealer category are set at creation and cannot be changed here.'
            : 'Register a walk-in, ordinary, special customer, or authorised dealer. Dealers require a dealer category and can be linked to a correspondent.'
        }
        headerActions={
          <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>
            Back to list
          </Button>
        }
        submitLabel={isEdit ? 'Save changes' : 'Add customer'}
        onSubmit={submit}
        onCancel={onBack}
        submitDisabled={!canSubmit}
        note={
          isEdit
            ? 'Changes to contact details are reflected immediately on new invoices, waybills and delivery notes.'
            : 'A customer record created here is available across invoicing, deliveries and reporting immediately.'
        }
        aside={
          <Panel title="Customer type">
            {isEdit ? (
              <MetaRow
                label="Type"
                value={TYPE_LABEL[customer?.type] || customer?.type || '—'}
              />
            ) : (
              <>
                <MetaRow label="Type" value={TYPE_LABEL[type] || type} />
                <MetaRow
                  label="Dealer category"
                  value={
                    isDealer
                      ? categories.find((c) => c.value === dealerCategoryId)
                          ?.label || 'Not set'
                      : 'Not applicable'
                  }
                />
              </>
            )}
            <MetaRow
              label="Customer since"
              value={fmtDate(customerSince)}
            />
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

        <Panel title="Contact details">
          <FieldSet columns={2}>
            {!isEdit && (
              <Select
                label="Customer type *"
                options={CUSTOMER_TYPES}
                value={type}
                onChange={(v) => setType(val(v))}
              />
            )}
            <Input
              label="Full name / business name *"
              placeholder="e.g. Ibadan Beverage Traders"
              value={name}
              onChange={(e) => setName(val(e))}
            />
            <Input label="Customer code" value="Auto-generated" disabled />
            <Input
              label="Phone number *"
              placeholder="+234 …"
              value={phone}
              onChange={(e) => setPhone(val(e))}
            />
            <Input
              label="Alternate phone *"
              placeholder="+234 …"
              value={alternatePhone}
              onChange={(e) => setAlternatePhone(val(e))}
            />
            <Input
              label="Contact person"
              placeholder="e.g. Femi Adeyinka"
              value={contactPerson}
              onChange={(e) => setContactPerson(val(e))}
            />
            <Input
              label="Email address"
              placeholder="Optional"
              value={email}
              onChange={(e) => setEmail(val(e))}
            />
            <Input
              label="Tax identification no. *"
              placeholder="e.g. 12345678-0001"
              value={tin}
              onChange={(e) => setTin(val(e))}
            />
            {!isEdit && (
              <Input
                label="Customer since"
                type="date"
                value={customerSince}
                onChange={(e) => setCustomerSince(val(e))}
              />
            )}
          </FieldSet>
        </Panel>

        <Panel title="Address & assignment">
          <FieldSet columns={2}>
            <Input
              label="Street address *"
              placeholder="e.g. 12 Ring Road"
              value={streetAddress}
              onChange={(e) => setStreetAddress(val(e))}
            />
            <Input
              label="City / town"
              placeholder="e.g. Ibadan"
              value={city}
              onChange={(e) => setCity(val(e))}
            />
            <Select
              label="State *"
              options={states}
              placeholder="Select state…"
              value={stateCode}
              onChange={(v) => setStateCode(val(v))}
            />
            <Select
              label="LGA *"
              options={lgas}
              placeholder={
                !stateCode
                  ? 'Select a state first'
                  : loadingLgas
                    ? 'Loading LGAs…'
                    : 'Select LGA…'
              }
              value={lgaCode}
              onChange={(v) => setLgaCode(val(v))}
              disabled={!stateCode || loadingLgas}
            />
            <Select
              label="Home showroom *"
              options={showrooms}
              placeholder="Select showroom…"
              value={locationId}
              onChange={(v) => setLocationId(val(v))}
            />
            <Select
              label="Sales correspondent"
              options={[
                { value: '', label: 'Not linked' },
                ...correspondents,
              ]}
              placeholder="Optional"
              value={correspondentId}
              onChange={(v) => setCorrespondentId(val(v))}
            />
            {!isEdit && isDealer && (
              <Select
                label="Dealer category *"
                options={categories}
                placeholder="Select category…"
                value={dealerCategoryId}
                onChange={(v) => setDealerCategoryId(val(v))}
              />
            )}
            <Input
              label="Credit limit (₦)"
              type="number"
              placeholder="0.00"
              value={creditLimit}
              onChange={(e) => setCreditLimit(val(e))}
            />
          </FieldSet>
        </Panel>

        <Panel
          title="Business description"
          description="What the customer does — useful for categorisation and reporting."
        >
          <textarea
            rows={2}
            placeholder="e.g. Wholesale beverage distributor covering Oyo and Osun."
            value={businessDescription}
            onChange={(e) => setBusinessDescription(val(e))}
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

// ── Detail view ───────────────────────────────────────────
function CustomerDetail({ customer, crumbs, onBack, onEdit, onStatus, onHistory }) {
  if (!customer) return null

  return (
    <FormShell
      wide
      crumbs={crumbs}
      title={customer.name}
      icon="user-round"
      headerActions={
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Button variant="secondary" iconLeft="history" onClick={onHistory}>
            Payment history
          </Button>
          <Button variant="secondary" onClick={onEdit}>
            Edit
          </Button>
          <Button variant="secondary" onClick={onStatus}>
            Change status
          </Button>
          <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>
            Back
          </Button>
        </div>
      }
      submitLabel={null}
      onCancel={onBack}
      aside={
        <Panel title="Financials">
          <MetaRow
            label="Wallet balance"
            value={money(customer.walletBalance || 0)}
            mono
          />
          <MetaRow
            label="Deposit balance"
            value={money(customer.depositBalance || 0)}
            mono
          />
          <MetaRow
            label="Credit limit"
            value={money(customer.creditLimit || 0)}
            mono
          />
          <MetaRow
            label="Lifetime value"
            value={money(customer.lifetimeValue || 0)}
            mono
          />
          <MetaRow
            label="Last purchase"
            value={
              customer.lastPurchaseAt
                ? fmtDate(customer.lastPurchaseAt)
                : '—'
            }
          />
        </Panel>
      }
    >
      <Panel title="Identity">
        <FieldSet columns={2}>
          <MetaRow label="Code" value={customer.code} mono />
          <MetaRow
            label="Type"
            value={
              <Badge tone={TYPE_TONE[customer.type] || 'neutral'}>
                {TYPE_LABEL[customer.type] || customer.type || '—'}
              </Badge>
            }
          />
          <MetaRow
            label="Status"
            value={
              <Badge tone={STATUS_TONE[customer.status] || 'neutral'}>
                {STATUS_LABEL[customer.status] || customer.status || '—'}
              </Badge>
            }
          />
          <MetaRow
            label="Temporary"
            value={customer.isTemporary ? 'Yes' : 'No'}
          />
          <MetaRow
            label="Customer since"
            value={
              customer.customerSince
                ? fmtDate(customer.customerSince)
                : '—'
            }
          />
          {customer.statusReason && (
            <MetaRow label="Status reason" value={customer.statusReason} />
          )}
        </FieldSet>
      </Panel>

      <Panel title="Contact">
        <FieldSet columns={2}>
          <MetaRow
            label="Contact person"
            value={customer.contactPerson || '—'}
          />
          <MetaRow label="Phone" value={customer.phone || '—'} mono />
          <MetaRow
            label="Alternate phone"
            value={customer.alternatePhone || '—'}
            mono
          />
          <MetaRow label="Email" value={customer.email || '—'} />
          <MetaRow label="TIN" value={customer.tin || '—'} mono />
        </FieldSet>
      </Panel>

      <Panel title="Address">
        <FieldSet columns={2}>
          <MetaRow label="Street" value={customer.streetAddress || '—'} />
          <MetaRow label="City" value={customer.city || '—'} />
          <MetaRow label="State" value={customer.stateName || '—'} />
          <MetaRow label="LGA" value={customer.lgaName || '—'} />
        </FieldSet>
      </Panel>

      <Panel title="Assignment">
        <FieldSet columns={2}>
          <MetaRow
            label="Home showroom"
            value={customer.location?.name || '—'}
          />
          <MetaRow
            label="Correspondent"
            value={customer.correspondent?.name || '—'}
          />
          {customer.dealerCategory && (
            <MetaRow
              label="Dealer category"
              value={customer.dealerCategory?.name || '—'}
            />
          )}
        </FieldSet>
      </Panel>

      {customer.businessDescription && (
        <Panel title="Business description">
          <div
            style={{
              font: 'var(--type-body)',
              color: 'var(--text-strong)',
              lineHeight: 1.6,
            }}
          >
            {customer.businessDescription}
          </div>
        </Panel>
      )}
    </FormShell>
  )
}

// ── Status change form ────────────────────────────────────
function StatusChangeForm({ customer, crumbs, onBack, onDone }) {
  const { showToast } = useStore()
  const [status, setStatus] = useState(customer.status || 'ACTIVE')
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const changed = status !== customer.status
  const canSubmit =
    changed && (status === 'ACTIVE' || reason.trim()) && !submitting

  async function submit() {
    if (!canSubmit) return
    setSubmitting(true)
    try {
      await customerApi.updateCustomerStatus(customer.id, {
        status,
        reason: reason.trim(),
      })
      showToast(
        'Status updated',
        `${customer.name} is now ${STATUS_LABEL[status].toLowerCase()}.`
      )
      onDone()
    } catch (e) {
      showToast('Could not change status', e.message, true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {submitting && <Loader overlay label="Updating status…" />}
      <FormShell
        wide
        crumbs={crumbs}
        title={`Change status — ${customer.name}`}
        icon="shield-alert"
        description="Change how this customer can transact. A reason is required for any status other than Active."
        headerActions={
          <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>
            Back
          </Button>
        }
        submitLabel="Update status"
        onSubmit={submit}
        onCancel={onBack}
        submitDisabled={!canSubmit}
        aside={
          <Panel title="Customer">
            <MetaRow label="Code" value={customer.code} mono />
            <MetaRow label="Name" value={customer.name} />
            <MetaRow
              label="Type"
              value={TYPE_LABEL[customer.type] || customer.type}
            />
            <MetaRow
              label="Current status"
              value={
                <Badge tone={STATUS_TONE[customer.status] || 'neutral'}>
                  {STATUS_LABEL[customer.status] || customer.status}
                </Badge>
              }
            />
          </Panel>
        }
      >
        <Panel title="New status">
          <FieldSet columns={1}>
            <Select
              label="Status *"
              options={STATUS_OPTIONS}
              value={status}
              onChange={(v) => setStatus(val(v))}
            />
          </FieldSet>
          <div style={{ marginTop: 14 }}>
            <label style={{ display: 'block' }}>
              <div
                style={{
                  font: 'var(--type-label)',
                  color: 'var(--text-strong)',
                  marginBottom: 6,
                }}
              >
                Reason {status !== 'ACTIVE' ? '*' : '(optional)'}
              </div>
              <textarea
                rows={3}
                placeholder={
                  status === 'WATCH'
                    ? 'Why is this customer being placed on watch?'
                    : status === 'SUSPENDED'
                      ? 'Why is this customer being suspended?'
                      : 'Any note to accompany the reinstatement.'
                }
                value={reason}
                onChange={(e) => setReason(val(e))}
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
            </label>
          </div>
          {status === 'SUSPENDED' && (
            <Callout
              tone="danger"
              icon="circle-alert"
              title="Suspension blocks new transactions"
              style={{ marginTop: 14 }}
            >
              A suspended customer cannot make purchases on credit. Any
              existing credit or wallet balance remains on record.
            </Callout>
          )}
        </Panel>
      </FormShell>
    </>
  )
}

// ── Main page ─────────────────────────────────────────────
export default function CustomerContacts({
  leaf,
  moduleLabel,
  parentLabel,
  onNavigate,
}) {
  const { showToast } = useStore()
  const crumbs = [moduleLabel, parentLabel, leaf?.label].filter(Boolean)

  const [mode, setMode] = useState('list') // list | create | edit | detail | status
  const [active, setActive] = useState(null)
  const [loadingDetail, setLoadingDetail] = useState(false)

  // filters
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [stateFilter, setStateFilter] = useState('')
  const [locationFilter, setLocationFilter] = useState('')

  // pagination
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)

  // data
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)

  // lookups
  const [states, setStates] = useState([])
  const [lgas, setLgas] = useState([])
  const [loadingLgas, setLoadingLgas] = useState(false)
  const [showrooms, setShowrooms] = useState([])
  const [correspondents, setCorrespondents] = useState([])
  const [categories, setCategories] = useState([])

  // ── debounce search ─────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 300)
    return () => clearTimeout(t)
  }, [searchInput])

  // ── static lookups ──────────────────────────────────────
  useEffect(() => {
    let cancelled = false
    Promise.all([
      invoiceApi.getStateList().catch(() => ({ data: [] })),
      showroomApi
        .lookupPickerWithAreas({ status: ['ACTIVE'] })
        .catch(() => ({ data: [] })),
      customerApi
        .listCorrespondents({
          status: ['ASSIGNED'],
          page: 0,
          size: 200,
        })
        .catch(() => ({ data: { items: [] } })),
      customerApi.listDealerCategories().catch(() => ({ data: [] })),
    ]).then(([stateRes, showroomRes, corrRes, catRes]) => {
      if (cancelled) return
      setStates(
        (stateRes.data || []).map((s) => ({
          value: s.code || s.stateCode,
          label: s.name,
        }))
      )
      setShowrooms(
        (showroomRes.data || []).map((s) => ({
          value: s.id,
          label: s.label || s.name || s.code,
        }))
      )
      setCorrespondents(
        (corrRes.data?.items || []).map((c) => ({
          value: c.id,
          label: c.name,
        }))
      )
      setCategories(
        (catRes.data || [])
          .filter((c) => c.status === 'ACTIVE')
          .map((c) => ({ value: c.id, label: c.name }))
      )
    })
    return () => {
      cancelled = true
    }
  }, [])

  // ── LGA lookup (triggered by forms) ─────────────────────
  const loadLgas = useCallback(async (stateCode) => {
    if (!stateCode) {
      setLgas([])
      return
    }
    setLoadingLgas(true)
    try {
      const res = await invoiceApi.getLGAList(stateCode)
      setLgas(
        (res.data || []).map((l) => ({
          value: l.code || l.stateCode,
          label: l.name,
        }))
      )
    } catch (e) {
      setLgas([])
    } finally {
      setLoadingLgas(false)
    }
  }, [])

  // ── reset page on filter change ─────────────────────────
  useEffect(() => {
    setPage(0)
  }, [search, typeFilter, statusFilter, stateFilter, locationFilter])

  // ── load list ───────────────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true)
    try {
      const q = { page, size: PAGE_SIZE }
      if (search) q.q = search
      if (typeFilter) q.type = [typeFilter]
      if (statusFilter) q.status = [statusFilter]
      if (stateFilter) q.stateCode = stateFilter
      if (locationFilter) q.locationId = locationFilter

      const res = await customerApi.listCustomers(q)
      const paged = res.data
      setRows(paged.items || [])
      setTotalPages(paged.totalPages || 0)
      setTotalItems(paged.totalItems || 0)
    } catch (e) {
      showToast('Could not load customers', e.message, true)
    } finally {
      setLoading(false)
    }
  }, [
    page,
    search,
    typeFilter,
    statusFilter,
    stateFilter,
    locationFilter,
    showToast,
  ])

  useEffect(() => {
    load()
  }, [load])

  // ── open detail (fetch the full Customer record) ────────
  async function openDetail(row) {
    setLoadingDetail(true)
    try {
      const res = await customerApi.getCustomerDetail(row.id)
      setActive(res.data)
      setMode('detail')
    } catch (e) {
      showToast('Could not load customer detail', e.message, true)
    } finally {
      setLoadingDetail(false)
    }
  }

  // ── jump to the customer history / payment report ───────
  function openHistory(customer) {
    console.log("opening history",customer)
    if (!customer?.id) return
    if (!onNavigate) {
      showToast('Navigation unavailable', 'This page was not given an onNavigate handler.', true)
      return
    }
    onNavigate({
      id: 'customerproducthistory',
      view: 'customerproducthistory',
      label: 'Customer Payment History',
      params: { customerId: customer.id },
    })
  }

  const afterMutation = () => {
    setMode('list')
    setActive(null)
    load()
  }

  // ── mode guards ─────────────────────────────────────────
  if (mode === 'create') {
    return (
      <CustomerForm
        mode="create"
        crumbs={crumbs}
        states={states}
        lgas={lgas}
        loadingLgas={loadingLgas}
        showrooms={showrooms}
        correspondents={correspondents}
        categories={categories}
        onStateChange={loadLgas}
        onBack={() => setMode('list')}
        onDone={afterMutation}
      />
    )
  }

  if (mode === 'edit' && active) {
    return (
      <CustomerForm
        mode="edit"
        customer={active}
        crumbs={crumbs}
        states={states}
        lgas={lgas}
        loadingLgas={loadingLgas}
        showrooms={showrooms}
        correspondents={correspondents}
        categories={categories}
        onStateChange={loadLgas}
        onBack={() => setMode('detail')}
        onDone={afterMutation}
      />
    )
  }

  if (mode === 'detail' && active) {
    return (
      <CustomerDetail
        customer={active}
        crumbs={crumbs}
        onBack={() => setMode('list')}
        onEdit={() => setMode('edit')}
        onStatus={() => setMode('status')}
        onHistory={() => openHistory(active)}
      />
    )
  }

  if (mode === 'status' && active) {
    return (
      <StatusChangeForm
        customer={active}
        crumbs={crumbs}
        onBack={() => setMode('detail')}
        onDone={async () => {
          // refresh the detail after status change
          try {
            const res = await customerApi.getCustomerDetail(active.id)
            setActive(res.data)
            setMode('detail')
            load()
          } catch {
            afterMutation()
          }
        }}
      />
    )
  }

  // ── columns ─────────────────────────────────────────────
  const columns = [
    { key: 'code', label: 'Code', width: 110, mono: true },
    { key: 'name', label: 'Name', width: 220 },
    {
      key: 'phone',
      label: 'Phone number',
      width: 170,
      mono: true,
      render: (r) => r.phone || '—',
    },
    {
      key: 'state',
      label: 'State',
      width: 140,
      render: (r) => r.stateName || r.stateCode || '—',
    },
    {
      key: 'type',
      label: 'Customer type',
      width: 180,
      render: (r) => (
        <Badge tone={TYPE_TONE[r.type] || 'neutral'}>
          {TYPE_LABEL[r.type] || r.type || '—'}
        </Badge>
      ),
    },
    {
      key: 'showroom',
      label: 'Home showroom',
      width: 190,
      render: (r) => r.location?.name || '—',
    },
    {
      key: 'rep',
      label: 'Correspondent',
      width: 180,
      render: (r) => r.correspondent?.name || '—',
    },
    {
      key: 'wallet',
      label: 'Wallet',
      width: 140,
      align: 'right',
      mono: true,
      render: (r) => money(r.walletBalance || 0),
    },
    {
      key: 'creditLimit',
      label: 'Credit limit',
      width: 150,
      align: 'right',
      mono: true,
      render: (r) => money(r.creditLimit || 0),
    },
    {
      key: 'status',
      label: 'Status',
      width: 120,
      render: (r) => (
        <Badge tone={STATUS_TONE[r.status] || 'neutral'}>
          {STATUS_LABEL[r.status] || r.status || '—'}
        </Badge>
      ),
    },
    {
      key: 'history',
      label: '',
      width: 130,
      render: (r) => (
        <span onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            iconLeft="history"
            onClick={(e) => {
              e.stopPropagation()
              openHistory(r)
            }}
          >
            History
          </Button>
        </span>
      ),
    },
  ]

  // ── filter options ──────────────────────────────────────
  const typeFilterOptions = [
    { value: '', label: 'All types' },
    ...CUSTOMER_TYPES,
  ]
  const statusFilterOptions = [
    { value: '', label: 'All statuses' },
    ...STATUS_OPTIONS,
  ]
  const stateFilterOptions = [{ value: '', label: 'All states' }, ...states]
  const locationFilterOptions = [
    { value: '', label: 'All showrooms' },
    ...showrooms,
  ]

  // ── stats ───────────────────────────────────────────────
  const dealerCount = rows.filter(
    (r) => r.type === 'AUTHORISED_DEALER'
  ).length
  const activeCount = rows.filter((r) => r.status === 'ACTIVE').length
  const totalWallet = rows.reduce((n, r) => n + (r.walletBalance || 0), 0)

  return (
    <>
      {(loading || loadingDetail) && (
        <Loader
          overlay
          label={
            loadingDetail ? 'Loading customer…' : 'Loading customers…'
          }
        />
      )}
      <RegisterShell
        wide
        crumbs={[moduleLabel, parentLabel]}
        title={leaf?.label || 'Customer Contacts'}
        icon={leaf?.icon}
        description="Directory of customer contact details — names, phone numbers and addresses — used across invoices, waybills and customer records."
        createLabel="Add customer"
        onCreate={() => setMode('create')}
        search={searchInput}
        onSearch={setSearchInput}
        searchPlaceholder="Search by name, phone number or address…"
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
              options={typeFilterOptions}
              value={typeFilter}
              onChange={(v) => setTypeFilter(val(v))}
              style={{ width: 190 }}
            />
            <Select
              options={statusFilterOptions}
              value={statusFilter}
              onChange={(v) => setStatusFilter(val(v))}
              style={{ width: 160 }}
            />
            <Select
              options={stateFilterOptions}
              value={stateFilter}
              onChange={(v) => setStateFilter(val(v))}
              style={{ width: 170 }}
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
          { label: 'Contacts on file', value: String(totalItems) },
          { label: 'Active (this page)', value: String(activeCount) },
          { label: 'Dealers (this page)', value: String(dealerCount) },
          { label: 'Wallet (this page)', value: moneyShort(totalWallet) },
        ]}
        columns={columns}
        rows={rows}
        onRowClick={openDetail}
        emptyTitle="No customers on file"
        emptyDescription="Add a customer so they can be selected on invoices and deliveries."
        footnote="Walk-in counter sales carry no contact details. A temporary record is created automatically when a walk-in customer returns goods, and removed once the resulting wallet balance is spent."
      />
    </>
  )
}