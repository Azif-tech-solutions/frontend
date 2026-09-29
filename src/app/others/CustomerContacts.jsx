import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import { RegisterShell } from '../shells/RegisterShell.jsx'
import { FormShell } from '../shells/FormShell.jsx'
import { Panel, FieldSet, MetaRow } from '../shells/Page.jsx'
import { showrooms } from '../sampleShowroom.js'
import { nigerianStates } from '../sampleProcess.js'
import { customers, customerTypes } from '../sampleOthers.js'

const TYPE_TONE = { 'Authorised Dealer': 'brand', 'Special Customer': 'info', 'Ordinary Customer': 'neutral', 'No Credit / Walk-in': 'neutral' }

const columns = [
  { key: 'code', label: 'Code', width: 110, mono: true },
  { key: 'name', label: 'Name', width: 240 },
  { key: 'phone', label: 'Phone number', width: 180, mono: true },
  { key: 'address', label: 'Address', width: 340 },
  { key: 'state', label: 'State', width: 120 },
  {
    key: 'type', label: 'Customer type', width: 190,
    render: (c) => <Badge tone={TYPE_TONE[c.type] || 'neutral'}>{c.type}</Badge>,
  },
  { key: 'showroom', label: 'Home showroom', width: 190 },
  { key: 'rep', label: 'Sales rep', width: 180 },
  { key: 'since', label: 'Customer since', width: 160 },
]

function ContactForm({ crumbs, onBack }) {
  return (
    <FormShell
      crumbs={crumbs}
      title="Add customer contact"
      icon="contact-round"
      description="Store a customer's contact details so they can be reached and linked to transactions, invoices and deliveries."
      headerActions={<Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>Back to contacts</Button>}
      submitLabel="Save contact"
      onCancel={onBack}
      note="Contacts added here become selectable when raising invoices, pro-formas and waybills."
      aside={
        <Panel title="Where contacts are used">
          <MetaRow label="Invoices" value="Buyer details" />
          <MetaRow label="Waybills" value="Delivery address" />
          <MetaRow label="Pro-forma invoices" value="Addressee" />
          <MetaRow label="Customer History" value="Record lookup" />
        </Panel>
      }
    >
      <Panel title="Contact details">
        <FieldSet columns={2}>
          <Input label="Full name / business name" placeholder="e.g. Ibadan Beverage Traders" />
          <Input label="Customer code" placeholder="Auto-generated" disabled value="CU-0095" />
          <Input label="Phone number" placeholder="+234 …" />
          <Input label="Alternate phone" placeholder="Optional" />
          <Input label="Email address" placeholder="Optional" />
          <Select label="Customer type" options={customerTypes} placeholder="Select type…" />
        </FieldSet>
      </Panel>

      <Panel title="Address & assignment">
        <FieldSet columns={2}>
          <Input label="Street address" placeholder="e.g. 12 Ring Road" />
          <Input label="City / town" placeholder="e.g. Ibadan" />
          <Select label="State" options={nigerianStates} placeholder="Select state…" />
          <Select label="Home showroom" options={showrooms} placeholder="Select showroom…" />
        </FieldSet>
      </Panel>
    </FormShell>
  )
}

export default function CustomerContacts({ leaf, moduleLabel, parentLabel }) {
  const [mode, setMode] = useState('list')
  const crumbs = [moduleLabel, parentLabel, leaf?.label].filter(Boolean)

  if (mode === 'create') return <ContactForm crumbs={crumbs} onBack={() => setMode('list')} />

  const contactable = customers.filter((c) => c.phone !== '—')

  return (
    <RegisterShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Customer Contacts'}
      icon={leaf?.icon}
      description="Directory of customer contact details — names, phone numbers and addresses — used across invoices, waybills and customer records."
      createLabel="Add contact"
      onCreate={() => setMode('create')}
      searchPlaceholder="Search by name, phone number or address…"
      filters={
        <>
          <Select options={customerTypes} placeholder="All types" style={{ width: 190 }} />
          <Select options={nigerianStates} placeholder="All states" style={{ width: 170 }} />
        </>
      }
      stats={[
        { label: 'Contacts on file', value: String(customers.length) },
        { label: 'With phone number', value: String(contactable.length) },
        { label: 'States covered', value: String(new Set(customers.map((c) => c.state).filter((s) => s !== '—')).size) },
        { label: 'Assigned to a rep', value: String(customers.filter((c) => c.rep !== '—').length) },
      ]}
      columns={columns}
      rows={customers}
      onRowClick={() => {}}
      emptyTitle="No contacts on file"
      emptyDescription="Add a customer contact so they can be selected on invoices and deliveries."
      footnote="Walk-in counter sales carry no contact details. A temporary record is created automatically when a walk-in customer returns goods, and removed once the resulting wallet balance is spent."
    />
  )
}
