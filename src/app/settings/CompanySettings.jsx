import { useState } from 'react'
import { Button } from '../../ds/components/core/Button.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Page, Panel, FieldSet, MetaRow, Callout } from '../shells/Page.jsx'
import { PageHeader } from '../shells/PageHeader.jsx'
import { useStore } from '../store.jsx'

/**
 * Company details — captured at onboarding and edited here rather than on the
 * Overview screen, which is reserved for the day-to-day quick actions.
 */
export default function CompanySettings({ leaf, moduleLabel }) {
  const { company, branches, updateCompany, showToast } = useStore()

  const [name, setName] = useState(company.name || '')
  const [address, setAddress] = useState(company.address || '')
  const [phone, setPhone] = useState(company.phone || '')
  const [errors, setErrors] = useState({})

  const dirty = name !== (company.name || '') || address !== (company.address || '') || phone !== (company.phone || '')

  const reset = () => {
    setName(company.name || ''); setAddress(company.address || ''); setPhone(company.phone || ''); setErrors({})
  }

  const save = () => {
    const e = {}
    if (!name.trim()) e.name = 'Company name is required'
    if (!address.trim()) e.address = 'Company address is required'
    if (!phone.trim()) e.phone = 'Company phone number is required'
    setErrors(e)
    if (Object.keys(e).length) return
    updateCompany({ name: name.trim(), address: address.trim(), phone: phone.trim() })
    showToast('Company details saved', name.trim())
  }

  return (
    <Page>
      <PageHeader
        crumbs={[moduleLabel]}
        icon={leaf?.icon || 'building-2'}
        title={leaf?.label || 'Company Settings'}
        description="The company record used across every document, report, and invoice — the name on your masthead, the address on your waybills, and the number buyers call."
        actions={
          <>
            <Button variant="secondary" onClick={reset} disabled={!dirty}>Discard</Button>
            <Button iconLeft="save" onClick={save} disabled={!dirty}>Save changes</Button>
          </>
        }
      />

      <Panel title="Company details" description="Changes apply immediately across the console.">
        <FieldSet columns={2}>
          <Input label="Company name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Zif Manufacturing Ltd" error={errors.name} />
          <Input label="Company phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. +1 555 010 2200" error={errors.phone} />
        </FieldSet>
        <div style={{ marginTop: 14 }}>
          <Input label="Company address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street, city, state" error={errors.address} />
        </div>
      </Panel>

      <Panel title="Current record" description="What the rest of the console reads today.">
        <MetaRow label="Name" value={company.name || '—'} />
        <MetaRow label="Address" value={company.address || '—'} />
        <MetaRow label="Phone" value={company.phone || '—'} />
        <MetaRow label="Branches" value={String(branches.length)} mono />
        <Callout tone="info" style={{ marginTop: 16 }}>
          {branches.length
            ? 'Branch addresses are managed separately under Settings › Branches.'
            : 'No branches added yet — the company address is used as the primary location on every document.'}
        </Callout>
      </Panel>
    </Page>
  )
}
