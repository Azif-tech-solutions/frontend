// import { useState } from 'react'
// import { Badge } from '../../ds/components/core/Badge.jsx'
// import { Button } from '../../ds/components/core/Button.jsx'
// import { Icon } from '../../ds/components/core/Icon.jsx'
// import { Input } from '../../ds/components/forms/Input.jsx'
// import { ReportTable } from '../../ds/components/data/ReportTable.jsx'
// import { FormShell } from '../shells/FormShell.jsx'
// import { Panel, FieldSet, MetaRow, Callout } from '../shells/Page.jsx'
// import { branchFunds } from '../sampleAccount.js'
// import { money, moneyShort } from '../utils.js'

// const TONE = { Awaiting: 'warning', Confirmed: 'success', 'Partially confirmed': 'warning', Rejected: 'danger' }

// export default function FundsAwaitingBranch({ leaf, moduleLabel, parentLabel }) {
//   const awaiting = branchFunds.filter((f) => f.status === 'Awaiting')
//   const [selectedRef, setSelectedRef] = useState(awaiting[0]?.ref)
//   const [received, setReceived] = useState('')

//   const selected = branchFunds.find((f) => f.ref === selectedRef) || awaiting[0]
//   const receivedAmount = received === '' ? null : Number(received) || 0
//   const rejected = receivedAmount == null ? null : selected.sent - receivedAmount
//   const overReceived = rejected != null && rejected < 0
//   const partial = rejected != null && rejected > 0

//   const awaitingTotal = awaiting.reduce((n, f) => n + f.sent, 0)
//   const settled = branchFunds.filter((f) => f.status !== 'Awaiting')
//   const shortfall = settled.reduce((n, f) => n + (f.rejected || 0), 0)

//   const columns = [
//     { key: 'ref', label: 'Reference', width: 110, mono: true },
//     { key: 'date', label: 'Sent on', width: 130 },
//     { key: 'branch', label: 'Branch', width: 180 },
//     { key: 'purpose', label: 'Purpose', width: 280 },
//     { key: 'channel', label: 'Channel', width: 140 },
//     { key: 'sentBy', label: 'Sent by', width: 170 },
//     { key: 'sent', label: 'Amount sent', width: 165, align: 'right', mono: true, render: (f) => money(f.sent) },
//     {
//       key: 'received', label: 'Received', width: 165, align: 'right', mono: true,
//       render: (f) => (f.received == null ? <span style={{ color: 'var(--text-subtle)' }}>—</span> : money(f.received)),
//     },
//     {
//       key: 'rejected', label: 'Rejected', width: 155, align: 'right', mono: true,
//       render: (f) => (f.rejected ? <span style={{ color: 'var(--danger)' }}>{money(f.rejected)}</span> : f.rejected === 0 ? money(0) : '—'),
//     },
//     {
//       key: 'status', label: 'Status', width: 170,
//       render: (f) => <Badge tone={TONE[f.status] || 'neutral'}>{f.status}</Badge>,
//     },
//     { key: 'confirmedBy', label: 'Confirmed by', width: 160, render: (f) => f.confirmedBy || '—' },
//   ]

//   return (
//     <FormShell
//       wide
//       crumbs={[moduleLabel, parentLabel]}
//       title={leaf?.label || 'Funds Awaiting'}
//       icon={leaf?.icon}
//       description="Confirm and acknowledge funds sent from the central account to a showroom or outlet. The receiving account officer records the exact amount received and any portion not acknowledged."
//       submitLabel="Confirm receipt"
//       onCancel={() => {}}
//       note="Funds are not credited to the branch account until confirmed here. Any shortfall is raised automatically with the disbursing officer."
//       secondaryAction={<Button variant="secondary" iconLeft="flag">Reject in full</Button>}
//       aside={
//         <>
//           <Panel title="Confirmation">
//             <MetaRow label="Reference" value={selected.ref} mono />
//             <MetaRow label="Branch" value={selected.branch} />
//             <MetaRow label="Amount sent" value={money(selected.sent)} mono />
//             <MetaRow label="Amount received" value={receivedAmount == null ? '—' : money(receivedAmount)} mono tone={receivedAmount ? 'positive' : undefined} />
//             <MetaRow
//               label="Rejected / not acknowledged"
//               value={rejected == null ? '—' : money(Math.max(0, rejected))}
//               mono
//               tone={partial ? 'negative' : undefined}
//             />
//             {overReceived && (
//               <Callout tone="danger" icon="circle-alert" title="Received exceeds amount sent" style={{ marginTop: 14 }}>
//                 You have recorded {money(receivedAmount)} against {money(selected.sent)} disbursed. The received
//                 amount cannot exceed what was sent.
//               </Callout>
//             )}
//             {partial && (
//               <Callout tone="warning" icon="triangle-alert" title="Shortfall will be flagged" style={{ marginTop: 14 }}>
//                 {money(rejected)} of this disbursement will be recorded as not acknowledged and raised with
//                 {' '}{selected.sentBy} for correction.
//               </Callout>
//             )}
//           </Panel>

//           <Panel title="Position">
//             <MetaRow label="Awaiting confirmation" value={money(awaitingTotal)} mono tone="negative" />
//             <MetaRow label="Disbursements pending" value={awaiting.length} mono />
//             <MetaRow label="Shortfalls recorded" value={money(shortfall)} mono tone={shortfall ? 'negative' : undefined} />
//           </Panel>
//         </>
//       }
//     >
//       <Panel title="Select a disbursement" description="Funds sent to your branch that have not yet been acknowledged.">
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 10 }}>
//           {awaiting.map((f) => {
//             const on = f.ref === selectedRef
//             return (
//               <div
//                 key={f.ref}
//                 onClick={() => { setSelectedRef(f.ref); setReceived('') }}
//                 style={{
//                   display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', cursor: 'pointer',
//                   background: on ? 'var(--brand-subtle)' : 'var(--surface-card)',
//                   border: `1px solid ${on ? 'var(--brand-border)' : 'var(--border-default)'}`,
//                   borderRadius: 'var(--radius-md)', transition: 'var(--transition-control)',
//                 }}
//               >
//                 <Icon name="banknote-arrow-down" size={16} color={on ? 'var(--brand)' : 'var(--text-subtle)'} />
//                 <div style={{ minWidth: 0, flex: 1 }}>
//                   <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//                     <span style={{ font: 'var(--fw-bold) var(--text-sm)/1.3 var(--font-mono)', color: 'var(--text-strong)' }}>{money(f.sent)}</span>
//                     <Badge tone="warning">{f.status}</Badge>
//                   </div>
//                   <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 3 }}>{f.purpose}</div>
//                   <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', marginTop: 2 }}>
//                     {f.ref} · {f.branch} · {f.date} · {f.channel}
//                   </div>
//                 </div>
//               </div>
//             )
//           })}
//         </div>
//       </Panel>

//       <Panel title="Record what was received" description="Enter the exact amount received. Anything short of the amount sent is recorded as rejected.">
//         <FieldSet columns={3}>
//           <Input label="Amount sent (₦)" value={money(selected.sent)} onChange={() => {}} disabled />
//           <Input
//             label="Amount received (₦)"
//             type="number"
//             placeholder="0.00"
//             value={received}
//             onChange={(e) => setReceived(e.target.value)}
//             error={overReceived ? 'Cannot exceed the amount sent' : undefined}
//             hint={partial ? `${money(rejected)} will be recorded as rejected` : undefined}
//           />
//           <Input
//             label="Rejected / not acknowledged (₦)"
//             value={rejected == null ? '' : money(Math.max(0, rejected))}
//             onChange={() => {}}
//             disabled
//           />
//           <Input label="Date received" type="date" />
//           <Input label="Confirmed by" value="R. Danladi" onChange={() => {}} />
//           <Input label="Bank credit reference" placeholder="Optional" />
//         </FieldSet>
//         {partial && (
//           <div style={{ marginTop: 14 }}>
//             <label style={{ display: 'block' }}>
//               <div style={{ font: 'var(--type-label)', color: 'var(--text-strong)', marginBottom: 6 }}>Reason for shortfall *</div>
//               <textarea
//                 rows={2}
//                 placeholder="Explain why part of the disbursement was not acknowledged."
//                 style={{
//                   width: '100%', padding: '10px 12px', resize: 'vertical',
//                   background: 'var(--surface-card)', border: '1px solid var(--border-default)',
//                   borderRadius: 'var(--radius-control)', boxShadow: 'var(--shadow-xs)',
//                   font: 'var(--fw-regular) var(--text-sm)/1.5 var(--font-ui)', color: 'var(--text-strong)', outline: 'none',
//                 }}
//               />
//             </label>
//           </div>
//         )}
//       </Panel>

//       <Panel title="Disbursement history" description="Funds sent to branches and how each was acknowledged." padding={0}>
//         <ReportTable
//           columns={columns}
//           rows={branchFunds}
//           rowKey={(f) => f.ref}
//           totals={{ ref: 'Total', sent: money(branchFunds.reduce((n, f) => n + f.sent, 0)), rejected: money(shortfall) }}
//           stickyHeader={false}
//           style={{ border: 'none', borderRadius: 0 }}
//         />
//       </Panel>

//       <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', maxWidth: '80ch' }}>
//         {moneyShort(awaitingTotal)} across {awaiting.length} disbursements is currently awaiting acknowledgement.
//       </div>
//     </FormShell>
//   )
// }
import { useEffect, useState, useCallback, useMemo } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Icon } from '../../ds/components/core/Icon.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import Loader from '../../ds/components/core/Loader.jsx'
import { ReportTable } from '../../ds/components/data/ReportTable.jsx'
import { FormShell } from '../shells/FormShell.jsx'
import { Panel, FieldSet, MetaRow, Callout } from '../shells/Page.jsx'
import { useStore } from '../store.jsx'
import { money, moneyShort, fmtDate } from '../utils.js'
import AccountApi from '../../api/AccountApi.js'
import ShowroomApi from '../../api/ShowroomApi.js'
import FactoryApi from '../../api/FactoryApi.js'

const accountApi = new AccountApi()
const showroomApi = new ShowroomApi()
const factoryApi = new FactoryApi()

const LIST_PAGE_SIZE = 100

const today = () => new Date().toISOString().slice(0, 10)

const FALLBACK_STATUSES = [
  { value: 'AWAITING', label: 'Awaiting' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'PARTIALLY_CONFIRMED', label: 'Partially confirmed' },
  { value: 'REJECTED', label: 'Rejected' },
]
const FALLBACK_CHANNELS = [
  { value: 'BANK_TRANSFER', label: 'Bank transfer' },
  { value: 'CASH', label: 'Cash' },
]

const STATUS_LABEL = {
  AWAITING: 'Awaiting',
  CONFIRMED: 'Confirmed',
  PARTIALLY_CONFIRMED: 'Partially confirmed',
  REJECTED: 'Rejected',
}
const STATUS_TONE = {
  AWAITING: 'warning',
  CONFIRMED: 'success',
  PARTIALLY_CONFIRMED: 'warning',
  REJECTED: 'danger',
}
const CHANNEL_LABEL = { BANK_TRANSFER: 'Bank transfer', CASH: 'Cash' }

const HAS_SHORTFALL_OPTIONS = [
  { value: '', label: 'Any' },
  { value: 'yes', label: 'Has shortfall' },
  { value: 'no', label: 'No shortfall' },
]

function isPendingStatus(status) {
  return String(status || '').toUpperCase() === 'AWAITING'
}

function val(payload) {
  if (payload == null) return payload
  if (typeof payload === 'object') {
    if (payload.target && 'value' in payload.target) return payload.target.value
    if ('value' in payload) return payload.value
  }
  return payload
}

// BankAccount → { value, label, locationId }. Keep locationId so the
// Send form can filter destination options by the chosen location.
function bankOption(b) {
  if (!b?.id) return null
  const label =
    [b.bankName, b.accountNumber].filter(Boolean).join(' · ') ||
    b.accountName ||
    b.code ||
    b.id
  return {
    value: b.id,
    label,
    locationId: b.location?.id || '',
    locationName: b.location?.name || '',
  }
}

// CashAccount → { value, label, locationId }
function cashOption(a) {
  if (!a?.id) return null
  return {
    value: a.id,
    label: `${a.code} · ${a.name}${
      a.location?.name ? ` (${a.location.name})` : ''
    }`,
    locationId: a.location?.id || '',
    locationName: a.location?.name || '',
  }
}

// ── Send form ─────────────────────────────────────────────
function SendFundsForm({
  crumbs,
  locations,
  bankAccounts,
  cashAccounts,
  onBack,
  onDone,
}) {
  const { showToast } = useStore()

  const [channel, setChannel] = useState('BANK_TRANSFER')
  const [sourceBankAccountId, setSourceBankAccountId] = useState('')
  const [sourceCashAccountId, setSourceCashAccountId] = useState('')
  const [destinationLocationId, setDestinationLocationId] = useState('')
  const [destinationBankAccountId, setDestinationBankAccountId] = useState('')
  const [destinationCashAccountId, setDestinationCashAccountId] = useState('')
  const [purpose, setPurpose] = useState('')
  const [sentAmount, setSentAmount] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const isBank = channel === 'BANK_TRANSFER'

  // Source accounts: unfiltered — the source is the central account
  // which can live anywhere.
  const sourceAccountOptions = isBank ? bankAccounts : cashAccounts

  // Destination accounts: filter to the selected destination location.
  // If no location is selected yet, show no options and prompt the user
  // to pick the location first.
  const destinationAccountOptions = useMemo(() => {
    if (!destinationLocationId) return []
    const pool = isBank ? bankAccounts : cashAccounts
    return pool.filter((a) => a.locationId === destinationLocationId)
  }, [isBank, bankAccounts, cashAccounts, destinationLocationId])

  // Reset the wrong-channel destination when the channel flips
  useEffect(() => {
    if (isBank) {
      setDestinationCashAccountId('')
    } else {
      setDestinationBankAccountId('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel])

  // Clear the destination account when the location changes or when the
  // previously-selected account doesn't belong to the new location
  useEffect(() => {
    if (!destinationLocationId) {
      setDestinationBankAccountId('')
      setDestinationCashAccountId('')
      return
    }
    const pool = isBank ? bankAccounts : cashAccounts
    const current = isBank
      ? destinationBankAccountId
      : destinationCashAccountId
    if (!current) return
    const stillValid = pool.some(
      (a) => a.value === current && a.locationId === destinationLocationId
    )
    if (!stillValid) {
      if (isBank) setDestinationBankAccountId('')
      else setDestinationCashAccountId('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destinationLocationId])

  const amount = Number(sentAmount) || 0

  const missingFields = []
  if (!channel) missingFields.push('Channel')
  if (!destinationLocationId) missingFields.push('Destination location')
  if (!purpose.trim()) missingFields.push('Purpose')
  if (amount <= 0) missingFields.push('Sent amount')
  if (isBank) {
    if (!sourceBankAccountId) missingFields.push('Source bank account')
    if (!destinationBankAccountId)
      missingFields.push('Destination bank account')
  } else {
    if (!sourceCashAccountId) missingFields.push('Source cash account')
    if (!destinationCashAccountId)
      missingFields.push('Destination cash account')
  }

  const canSubmit = missingFields.length === 0 && !submitting

  async function submit() {
    if (!canSubmit) return
    setSubmitting(true)
    try {
      await accountApi.sendFundsDisbursement({
        channel,
        sourceBankAccountId: isBank ? sourceBankAccountId : '',
        sourceCashAccountId: isBank ? '' : sourceCashAccountId,
        destinationLocationId,
        destinationBankAccountId: isBank ? destinationBankAccountId : '',
        destinationCashAccountId: isBank ? '' : destinationCashAccountId,
        purpose: purpose.trim(),
        sentAmount: amount,
      })
      showToast(
        'Funds sent',
        `${money(amount)} dispatched via ${CHANNEL_LABEL[channel].toLowerCase()}.`
      )
      onDone()
    } catch (e) {
      showToast('Could not send funds', e.message, true)
    } finally {
      setSubmitting(false)
    }
  }

  const destinationHasAccounts = destinationAccountOptions.length > 0
  const destinationPoolHasAny = (isBank ? bankAccounts : cashAccounts).length > 0
  const destinationLocationLabel =
    locations.find((l) => l.value === destinationLocationId)?.label || ''

  return (
    <>
      {submitting && <Loader overlay label="Sending funds…" />}
      <FormShell
        wide
        crumbs={crumbs}
        title="Send funds"
        icon="banknote-arrow-up"
        description="Disburse funds from the central account to a showroom or outlet. The receiving account officer confirms the amount received before the branch balance is credited."
        headerActions={
          <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>
            Back to awaiting
          </Button>
        }
        submitLabel="Send funds"
        onSubmit={submit}
        onCancel={onBack}
        submitDisabled={!canSubmit}
        note="Funds remain pending until the receiving branch confirms receipt. Any shortfall reported at confirmation is recorded against this disbursement."
        aside={
          <Panel title="Dispatch summary">
            <MetaRow label="Channel" value={CHANNEL_LABEL[channel] || '—'} />
            <MetaRow
              label="Amount"
              value={amount ? money(amount) : '—'}
              mono
            />
            <MetaRow
              label="Destination"
              value={destinationLocationLabel || '—'}
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

        <Panel
          title="Source"
          description="Where the funds are coming from."
        >
          <FieldSet columns={2}>
            <Select
              label="Channel *"
              options={FALLBACK_CHANNELS}
              value={channel}
              onChange={(v) => setChannel(val(v))}
            />
            {isBank ? (
              <Select
                label="Source bank account *"
                options={sourceAccountOptions}
                placeholder={
                  sourceAccountOptions.length
                    ? 'Select bank account…'
                    : 'No bank accounts registered'
                }
                value={sourceBankAccountId}
                onChange={(v) => setSourceBankAccountId(val(v))}
                disabled={!sourceAccountOptions.length}
              />
            ) : (
              <Select
                label="Source cash account *"
                options={sourceAccountOptions}
                placeholder={
                  sourceAccountOptions.length
                    ? 'Select cash account…'
                    : 'No cash accounts registered'
                }
                value={sourceCashAccountId}
                onChange={(v) => setSourceCashAccountId(val(v))}
                disabled={!sourceAccountOptions.length}
              />
            )}
          </FieldSet>
        </Panel>

        <Panel
          title="Destination"
          description="Which branch receives the funds and into which account."
        >
          <FieldSet columns={2}>
            <Select
              label="Destination location *"
              options={locations}
              placeholder="Select location…"
              value={destinationLocationId}
              onChange={(v) => setDestinationLocationId(val(v))}
            />
            {isBank ? (
              <Select
                label="Destination bank account *"
                options={destinationAccountOptions}
                placeholder={
                  !destinationLocationId
                    ? 'Select a destination location first'
                    : !destinationPoolHasAny
                      ? 'No bank accounts registered'
                      : !destinationHasAccounts
                        ? 'No bank accounts at this location'
                        : 'Select bank account…'
                }
                value={destinationBankAccountId}
                onChange={(v) => setDestinationBankAccountId(val(v))}
                disabled={!destinationHasAccounts}
              />
            ) : (
              <Select
                label="Destination cash account *"
                options={destinationAccountOptions}
                placeholder={
                  !destinationLocationId
                    ? 'Select a destination location first'
                    : !destinationPoolHasAny
                      ? 'No cash accounts registered'
                      : !destinationHasAccounts
                        ? 'No cash accounts at this location'
                        : 'Select cash account…'
                }
                value={destinationCashAccountId}
                onChange={(v) => setDestinationCashAccountId(val(v))}
                disabled={!destinationHasAccounts}
              />
            )}
            <Input
              label="Amount to send (₦) *"
              type="number"
              placeholder="0.00"
              value={sentAmount}
              onChange={(e) => setSentAmount(val(e))}
            />
          </FieldSet>

          {destinationLocationId && !destinationHasAccounts && destinationPoolHasAny && (
            <Callout
              tone="warning"
              icon="building-2"
              title={`No ${isBank ? 'bank' : 'cash'} accounts at ${destinationLocationName(locations, destinationLocationId)}`}
              style={{ marginTop: 14 }}
            >
              {isBank
                ? 'Register a bank account for this location under Banking → Bank Register before sending funds here.'
                : 'Create a cash account (petty cash, till or vault) for this location under Cash Accounts before sending funds here.'}
            </Callout>
          )}

          <div style={{ marginTop: 14 }}>
            <label style={{ display: 'block' }}>
              <div
                style={{
                  font: 'var(--type-label)',
                  color: 'var(--text-strong)',
                  marginBottom: 6,
                }}
              >
                Purpose *
              </div>
              <textarea
                rows={2}
                placeholder="What this disbursement covers."
                value={purpose}
                onChange={(e) => setPurpose(val(e))}
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
        </Panel>
      </FormShell>
    </>
  )
}

function destinationLocationName(locations, id) {
  return locations.find((l) => l.value === id)?.label || 'this location'
}

// ── Reject form ───────────────────────────────────────────
function RejectForm({ disbursement, crumbs, onBack, onDone }) {
  const { showToast } = useStore()
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const canSubmit = reason.trim() && !submitting

  async function submit() {
    if (!canSubmit) return
    setSubmitting(true)
    try {
      await accountApi.rejectFundsDisbursement(disbursement.id, {
        reason: reason.trim(),
      })
      showToast(
        'Disbursement rejected',
        `${disbursement.ref} has been sent back to the disbursing officer.`
      )
      onDone()
    } catch (e) {
      showToast('Could not reject', e.message, true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {submitting && <Loader overlay label="Rejecting…" />}
      <FormShell
        crumbs={crumbs}
        title={`Reject ${disbursement.ref}`}
        icon="x"
        description="Reject this disbursement in full. It will be sent back to the disbursing officer with your reason."
        headerActions={
          <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>
            Back
          </Button>
        }
        submitLabel="Reject disbursement"
        onSubmit={submit}
        onCancel={onBack}
        submitDisabled={!canSubmit}
        aside={
          <Panel title="Disbursement">
            <MetaRow label="Ref" value={disbursement.ref} mono />
            <MetaRow
              label="Purpose"
              value={disbursement.purpose || '—'}
            />
            <MetaRow
              label="Amount"
              value={money(disbursement.sent || 0)}
              mono
            />
            <MetaRow
              label="From"
              value={disbursement.sentBy?.name || '—'}
            />
            <MetaRow
              label="Channel"
              value={
                CHANNEL_LABEL[disbursement.channel] ||
                disbursement.channel ||
                '—'
              }
            />
          </Panel>
        }
      >
        <Panel
          title="Reason"
          description="This is recorded against the disbursement."
        >
          <textarea
            rows={3}
            placeholder="Why are you rejecting this disbursement?"
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
      </FormShell>
    </>
  )
}

// ── Main page ─────────────────────────────────────────────
export default function FundsAwaitingBranch({
  leaf,
  moduleLabel,
  parentLabel,
}) {
  const store = useStore()
  const showToast = store.showToast
  const crumbs = [moduleLabel, parentLabel, leaf?.label].filter(Boolean)
  const userName = store.user?.name || '—'

  const [mode, setMode] = useState('list')
  const [rejecting, setRejecting] = useState(null)

  const [destinationFilter, setDestinationFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [channelFilter, setChannelFilter] = useState('')
  const [hasShortfallFilter, setHasShortfallFilter] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  const [filterMeta, setFilterMeta] = useState(null)

  const [locations, setLocations] = useState([])
  const [bankAccounts, setBankAccounts] = useState([])
  const [cashAccounts, setCashAccounts] = useState([])

  const [disbursements, setDisbursements] = useState([])
  const [loading, setLoading] = useState(false)

  const [selectedId, setSelectedId] = useState(null)
  const [receivedAmount, setReceivedAmount] = useState('')
  const [dateReceived, setDateReceived] = useState(today())
  const [bankCreditReference, setBankCreditReference] = useState('')
  const [shortfallReason, setShortfallReason] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // ── filter metadata ─────────────────────────────────────
  useEffect(() => {
    let cancelled = false
    accountApi
      .getFundsDisbursementFiltersss()
      .then((res) => {
        if (!cancelled) setFilterMeta(res.data)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  // ── locations ───────────────────────────────────────────
  useEffect(() => {
    let cancelled = false
    Promise.all([
      factoryApi.listFactories().catch(() => ({ data: [] })),
      showroomApi
        .lookupPickerWithAreas({ status: ['ACTIVE'] })
        .catch(() => ({ data: [] })),
    ]).then(([factoriesRes, showroomsRes]) => {
      if (cancelled) return
      const factoryOptions = (factoriesRes.data || []).map((f) => ({
        value: f.id,
        label: `${f.name} (factory)`,
      }))
      const showroomOptions = (showroomsRes.data || []).map((s) => ({
        value: s.id,
        label: `${s.label || s.name || s.code} (showroom)`,
      }))
      setLocations([...factoryOptions, ...showroomOptions])
    })
    return () => {
      cancelled = true
    }
  }, [])

  // ── bank accounts (with location) ───────────────────────
  useEffect(() => {
    let cancelled = false
    accountApi
      .listBankAccounts({ status: 'ACTIVE' })
      .then((res) => {
        if (cancelled) return
        const list = Array.isArray(res.data) ? res.data : []
        setBankAccounts(list.map(bankOption).filter(Boolean))
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  // ── cash accounts (with location) ───────────────────────
  useEffect(() => {
    let cancelled = false
    accountApi
      .listCashAccounts({})
      .then((res) => {
        if (cancelled) return
        const list = Array.isArray(res.data) ? res.data : []
        setCashAccounts(list.map(cashOption).filter(Boolean))
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  // ── load list ───────────────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true)
    try {
      const q = { page: 0, size: LIST_PAGE_SIZE }
      if (destinationFilter) q.locationId = destinationFilter
      if (statusFilter) q.status = statusFilter
      if (channelFilter) q.channel = channelFilter
      if (hasShortfallFilter === 'yes') q.hasShortfall = true
      if (hasShortfallFilter === 'no') q.hasShortfall = false
      if (from) q.from = from
      if (to) q.to = to

      const res = await accountApi.listFundsDisbursements(q)
      setDisbursements(res.data?.items || [])
    } catch (e) {
      showToast('Could not load funds disbursements', e.message, true)
    } finally {
      setLoading(false)
    }
  }, [
    destinationFilter,
    statusFilter,
    channelFilter,
    hasShortfallFilter,
    from,
    to,
    showToast,
  ])

  useEffect(() => {
    load()
  }, [load])

  const awaiting = disbursements.filter((d) => isPendingStatus(d.status))
  const settled = disbursements.filter((d) => !isPendingStatus(d.status))

  useEffect(() => {
    if (!awaiting.some((d) => d.id === selectedId)) {
      setSelectedId(awaiting[0]?.id ?? null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disbursements, selectedId])

  useEffect(() => {
    setReceivedAmount('')
    setBankCreditReference('')
    setShortfallReason('')
    setDateReceived(today())
  }, [selectedId])

  const selected = awaiting.find((d) => d.id === selectedId) || null

  const sent = selected?.sent || 0
  const received = receivedAmount === '' ? null : Number(receivedAmount) || 0
  const shortfall = received != null ? sent - received : null
  const overReceived = shortfall != null && shortfall < 0
  const partial = shortfall != null && shortfall > 0

  const canConfirm =
    !!selected &&
    received != null &&
    received >= 0 &&
    !overReceived &&
    !!dateReceived &&
    !submitting &&
    (!partial || shortfallReason.trim())

  async function handleConfirm() {
    if (!canConfirm) return
    setSubmitting(true)
    try {
      await accountApi.confirmFundsDisbursement(selected.id, {
        receivedAmount: received,
        dateReceived,
        bankCreditReference: bankCreditReference.trim(),
        shortfallReason: shortfallReason.trim(),
      })
      showToast(
        'Receipt confirmed',
        `${selected.ref} recorded${
          partial ? ` with a ${money(shortfall)} shortfall` : ''
        }.`
      )
      await load()
    } catch (e) {
      showToast('Could not confirm receipt', e.message, true)
    } finally {
      setSubmitting(false)
    }
  }

  const awaitingTotal = awaiting.reduce((n, d) => n + (d.sent || 0), 0)
  const settledShortfall = settled.reduce(
    (n, d) => n + (d.shortfall || 0),
    0
  )

  const statusOptions = useMemo(() => {
    const f = filterMeta?.fields?.find((x) => x.key === 'status')
    return f?.options?.length ? f.options : FALLBACK_STATUSES
  }, [filterMeta])

  const channelOptions = useMemo(() => {
    const f = filterMeta?.fields?.find((x) => x.key === 'channel')
    return f?.options?.length ? f.options : FALLBACK_CHANNELS
  }, [filterMeta])

  const destinationOptions = useMemo(
    () => [{ value: '', label: 'All destinations' }, ...locations],
    [locations]
  )

  const historyColumns = [
    { key: 'ref', label: 'Reference', width: 110, mono: true },
    {
      key: 'date',
      label: 'Sent on',
      width: 130,
      render: (d) => (d.date ? fmtDate(d.date) : '—'),
    },
    {
      key: 'destinationLocation',
      label: 'Branch',
      width: 180,
      render: (d) => d.destinationLocation?.name || '—',
    },
    {
      key: 'purpose',
      label: 'Purpose',
      width: 260,
      render: (d) => d.purpose || '—',
    },
    {
      key: 'channel',
      label: 'Channel',
      width: 140,
      render: (d) => CHANNEL_LABEL[d.channel] || d.channel || '—',
    },
    {
      key: 'sentBy',
      label: 'Sent by',
      width: 160,
      render: (d) => d.sentBy?.name || '—',
    },
    {
      key: 'sent',
      label: 'Amount sent',
      width: 150,
      align: 'right',
      mono: true,
      render: (d) => money(d.sent || 0),
    },
    {
      key: 'received',
      label: 'Received',
      width: 150,
      align: 'right',
      mono: true,
      render: (d) =>
        d.received == null ? (
          <span style={{ color: 'var(--text-subtle)' }}>—</span>
        ) : (
          money(d.received)
        ),
    },
    {
      key: 'shortfall',
      label: 'Shortfall',
      width: 150,
      align: 'right',
      mono: true,
      render: (d) =>
        d.shortfall ? (
          <span style={{ color: 'var(--danger)' }}>
            {money(d.shortfall)}
          </span>
        ) : (
          '—'
        ),
    },
    {
      key: 'status',
      label: 'Status',
      width: 170,
      render: (d) => (
        <Badge tone={STATUS_TONE[d.status] || 'neutral'}>
          {STATUS_LABEL[d.status] || d.status || '—'}
        </Badge>
      ),
    },
    {
      key: 'confirmedBy',
      label: 'Confirmed by',
      width: 160,
      render: (d) => d.confirmedBy?.name || '—',
    },
  ]

  if (mode === 'create') {
    return (
      <SendFundsForm
        crumbs={crumbs}
        locations={locations}
        bankAccounts={bankAccounts}
        cashAccounts={cashAccounts}
        onBack={() => setMode('list')}
        onDone={async () => {
          setMode('list')
          await load()
        }}
      />
    )
  }

  if (mode === 'reject' && rejecting) {
    return (
      <RejectForm
        disbursement={rejecting}
        crumbs={crumbs}
        onBack={() => {
          setMode('list')
          setRejecting(null)
        }}
        onDone={async () => {
          setMode('list')
          setRejecting(null)
          await load()
        }}
      />
    )
  }

  return (
    <>
      {(loading || submitting) && (
        <Loader
          overlay
          label={
            submitting ? 'Confirming receipt…' : 'Loading disbursements…'
          }
        />
      )}
      <FormShell
        wide
        crumbs={[moduleLabel, parentLabel]}
        title={leaf?.label || 'Funds Awaiting'}
        icon={leaf?.icon}
        description="Confirm and acknowledge funds sent from the central account to a showroom or outlet, and initiate new disbursements to branches."
        submitLabel="Confirm receipt"
        onSubmit={handleConfirm}
        onCancel={() => {}}
        submitDisabled={!canConfirm}
        note="Funds are not credited to the branch account until confirmed here. Any shortfall is raised automatically with the disbursing officer."
        headerActions={
          <Button iconLeft="banknote-arrow-up" onClick={() => setMode('create')}>
            Send funds
          </Button>
        }
        secondaryAction={
          selected ? (
            <Button
              variant="secondary"
              iconLeft="flag"
              onClick={() => {
                setRejecting(selected)
                setMode('reject')
              }}
            >
              Reject in full
            </Button>
          ) : null
        }
        aside={
          selected ? (
            <>
              <Panel title="Confirmation">
                <MetaRow label="Reference" value={selected.ref} mono />
                <MetaRow
                  label="Branch"
                  value={selected.destinationLocation?.name || '—'}
                />
                <MetaRow
                  label="Amount sent"
                  value={money(sent)}
                  mono
                />
                <MetaRow
                  label="Amount received"
                  value={received == null ? '—' : money(received)}
                  mono
                  tone={received ? 'positive' : undefined}
                />
                <MetaRow
                  label="Rejected / not acknowledged"
                  value={
                    shortfall == null
                      ? '—'
                      : money(Math.max(0, shortfall))
                  }
                  mono
                  tone={partial ? 'negative' : undefined}
                />
                {overReceived && (
                  <Callout
                    tone="danger"
                    icon="circle-alert"
                    title="Received exceeds amount sent"
                    style={{ marginTop: 14 }}
                  >
                    You have recorded {money(received)} against {money(sent)}{' '}
                    disbursed. The received amount cannot exceed what was
                    sent.
                  </Callout>
                )}
                {partial && (
                  <Callout
                    tone="warning"
                    icon="triangle-alert"
                    title="Shortfall will be flagged"
                    style={{ marginTop: 14 }}
                  >
                    {money(shortfall)} of this disbursement will be recorded
                    as not acknowledged and raised with{' '}
                    {selected.sentBy?.name || 'the disbursing officer'} for
                    correction.
                  </Callout>
                )}
              </Panel>

              <Panel title="Position">
                <MetaRow
                  label="Awaiting confirmation"
                  value={money(awaitingTotal)}
                  mono
                  tone="negative"
                />
                <MetaRow
                  label="Disbursements pending"
                  value={awaiting.length}
                  mono
                />
                <MetaRow
                  label="Shortfalls recorded"
                  value={money(settledShortfall)}
                  mono
                  tone={settledShortfall ? 'negative' : undefined}
                />
              </Panel>
            </>
          ) : (
            <Panel title="Confirmation">
              <div
                style={{
                  color: 'var(--text-muted)',
                  font: 'var(--type-caption)',
                }}
              >
                Select a disbursement to review.
              </div>
            </Panel>
          )
        }
      >
        <Panel
          title="Filters"
          description="Narrow the disbursements shown below. Awaiting items are always listed regardless of the status filter."
        >
          <FieldSet columns={3}>
            <Select
              label="Destination"
              options={destinationOptions}
              value={destinationFilter}
              onChange={(v) => setDestinationFilter(val(v))}
            />
            <Select
              label="Channel"
              options={[{ value: '', label: 'All channels' }, ...channelOptions]}
              value={channelFilter}
              onChange={(v) => setChannelFilter(val(v))}
            />
            <Select
              label="Has shortfall"
              options={HAS_SHORTFALL_OPTIONS}
              value={hasShortfallFilter}
              onChange={(v) => setHasShortfallFilter(val(v))}
            />
            <Input
              label="Sent from"
              type="date"
              value={from}
              onChange={(e) => setFrom(val(e))}
            />
            <Input
              label="Sent to"
              type="date"
              value={to}
              onChange={(e) => setTo(val(e))}
            />
            <Select
              label="Status"
              options={[
                { value: '', label: 'All statuses' },
                ...statusOptions,
              ]}
              value={statusFilter}
              onChange={(v) => setStatusFilter(val(v))}
            />
          </FieldSet>
        </Panel>

        {awaiting.length === 0 && !loading ? (
          <Panel title="Awaiting receipt">
            <div style={{ color: 'var(--text-muted)', padding: '12px 0' }}>
              No funds are currently awaiting confirmation.
            </div>
          </Panel>
        ) : (
          <Panel
            title="Select a disbursement"
            description="Funds sent that have not yet been acknowledged."
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fill, minmax(300px, 1fr))',
                gap: 10,
              }}
            >
              {awaiting.map((d) => {
                const on = d.id === selectedId
                return (
                  <div
                    key={d.id}
                    onClick={() => setSelectedId(d.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                      padding: '12px 14px',
                      cursor: 'pointer',
                      background: on
                        ? 'var(--brand-subtle)'
                        : 'var(--surface-card)',
                      border: `1px solid ${
                        on
                          ? 'var(--brand-border)'
                          : 'var(--border-default)'
                      }`,
                      borderRadius: 'var(--radius-md)',
                      transition: 'var(--transition-control)',
                    }}
                  >
                    <Icon
                      name="banknote-arrow-down"
                      size={16}
                      color={on ? 'var(--brand)' : 'var(--text-subtle)'}
                    />
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                        }}
                      >
                        <span
                          style={{
                            font: 'var(--fw-bold) var(--text-sm)/1.3 var(--font-mono)',
                            color: 'var(--text-strong)',
                          }}
                        >
                          {money(d.sent || 0)}
                        </span>
                        <Badge tone={STATUS_TONE[d.status] || 'warning'}>
                          {STATUS_LABEL[d.status] || d.status}
                        </Badge>
                      </div>
                      <div
                        style={{
                          font: 'var(--type-caption)',
                          color: 'var(--text-muted)',
                          marginTop: 3,
                        }}
                      >
                        {d.purpose || '—'}
                      </div>
                      <div
                        style={{
                          font: 'var(--type-caption)',
                          color: 'var(--text-subtle)',
                          marginTop: 2,
                        }}
                      >
                        {d.ref} · {d.sentBy?.name || '—'} ·{' '}
                        {d.date ? fmtDate(d.date) : '—'} ·{' '}
                        {CHANNEL_LABEL[d.channel] || d.channel || '—'}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Panel>
        )}

        {selected && (
          <Panel
            title="Record what was received"
            description="Enter the exact amount received. Anything short of the amount sent is recorded as rejected."
          >
            <FieldSet columns={3}>
              <Input label="Amount sent (₦)" value={money(sent)} disabled />
              <Input
                label="Amount received (₦) *"
                type="number"
                placeholder="0.00"
                value={receivedAmount}
                onChange={(e) => setReceivedAmount(val(e))}
                error={
                  overReceived
                    ? 'Cannot exceed the amount sent'
                    : undefined
                }
                hint={
                  partial
                    ? `${money(shortfall)} will be recorded as rejected`
                    : undefined
                }
              />
              <Input
                label="Rejected / not acknowledged (₦)"
                value={
                  shortfall == null ? '' : money(Math.max(0, shortfall))
                }
                disabled
              />
              <Input
                label="Date received *"
                type="date"
                value={dateReceived}
                onChange={(e) => setDateReceived(val(e))}
              />
              <Input label="Confirmed by" value={userName} disabled />
              <Input
                label="Bank credit reference"
                placeholder="Optional"
                value={bankCreditReference}
                onChange={(e) => setBankCreditReference(val(e))}
              />
            </FieldSet>
            {partial && (
              <div style={{ marginTop: 14 }}>
                <label style={{ display: 'block' }}>
                  <div
                    style={{
                      font: 'var(--type-label)',
                      color: 'var(--text-strong)',
                      marginBottom: 6,
                    }}
                  >
                    Reason for shortfall *
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Explain why part of the disbursement was not acknowledged."
                    value={shortfallReason}
                    onChange={(e) => setShortfallReason(val(e))}
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
            )}
          </Panel>
        )}

        {settled.length > 0 && (
          <Panel
            title="Disbursement history"
            description="Disbursements that have been confirmed, partially confirmed or rejected."
            padding={0}
          >
            <ReportTable
              columns={historyColumns}
              rows={settled}
              rowKey={(d) => d.id}
              totals={{
                ref: 'Total',
                sent: money(
                  settled.reduce((n, d) => n + (d.sent || 0), 0)
                ),
                shortfall: money(settledShortfall),
              }}
              stickyHeader={false}
              style={{ border: 'none', borderRadius: 0 }}
              emptyTitle="No settled disbursements"
              emptyDescription="Confirmed, partially confirmed and rejected funds appear here."
            />
          </Panel>
        )}

        <div
          style={{
            font: 'var(--type-caption)',
            color: 'var(--text-subtle)',
            maxWidth: '80ch',
          }}
        >
          {moneyShort(awaitingTotal)} across {awaiting.length}{' '}
          disbursement{awaiting.length === 1 ? '' : 's'} is currently awaiting
          acknowledgement.
        </div>
      </FormShell>
    </>
  )
}