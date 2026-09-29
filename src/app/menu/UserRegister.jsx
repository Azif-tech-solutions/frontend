import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Icon } from '../../ds/components/core/Icon.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import { Switch } from '../../ds/components/forms/Switch.jsx'
import { RegisterShell } from '../shells/RegisterShell.jsx'
import { FormShell } from '../shells/FormShell.jsx'
import { Panel, FieldSet, MetaRow, Callout } from '../shells/Page.jsx'
import { showrooms } from '../sampleShowroom.js'
import { systemRoles, systemUsers } from '../sampleMenu.js'
import { useStore } from '../store.jsx'
import { fmtDate } from '../utils.js'

const ROLE_TONE = { Administrator: 'danger', Management: 'brand', 'Accounts Personnel': 'info', Cashier: 'neutral', 'Stock Keeper': 'neutral', 'Quality Control': 'neutral' }
const MAX_PASSWORD = 6

/** Renders a permission as a tick or dash, matching the PRD's §7 matrix. */
function Perm({ on }) {
  return on
    ? <Icon name="check" size={14} color="var(--success)" />
    : <span style={{ color: 'var(--text-subtle)' }}>—</span>
}

const columns = [
  { key: 'username', label: 'Username', width: 150, mono: true },
  { key: 'name', label: 'Name', width: 180 },
  {
    key: 'role', label: 'Role', width: 200,
    render: (u) => <Badge tone={ROLE_TONE[u.role] || 'neutral'}>{u.role}</Badge>,
  },
  { key: 'showroom', label: 'Assigned location', width: 190 },
  { key: 'phone', label: 'Phone', width: 175, mono: true },
  { key: 'lastSignIn', label: 'Last sign-in', width: 190 },
  { key: 'created', label: 'Created', width: 150 },
  {
    key: 'status', label: 'Status', width: 130,
    render: (u) => <Badge tone={u.status === 'Active' ? 'success' : 'warning'}>{u.status}</Badge>,
  },
  {
    key: 'action', label: 'Action', width: 200, sortable: false,
    render: (u) => (
      <div style={{ display: 'flex', gap: 6 }}>
        <Button size="sm" variant="secondary">Edit</Button>
        <Button size="sm" variant="secondary" disabled={u.owner} onClick={u.onToggle}>
          {u.status === 'Active' ? 'Suspend' : 'Restore'}
        </Button>
      </div>
    ),
  },
]

function UserForm({ crumbs, onBack, onDone }) {
  const { users, factories, branches, addUser, showToast } = useStore()
  const [roleValue, setRoleValue] = useState('')
  const [active, setActive] = useState(true)
  const [forceReset, setForceReset] = useState(true)

  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [location, setLocation] = useState('')
  const [errors, setErrors] = useState({})

  const role = systemRoles.find((r) => r.value === roleValue)

  // Real locations first — the company's own factories and branches — then the
  // sample showrooms the rest of the prototype refers to.
  const locationOptions = [
    { value: 'all', label: 'All locations' },
    ...factories.map((f) => ({ value: `fac:${f.id}`, label: `${f.name} (factory)` })),
    ...branches.map((b) => ({ value: `br:${b.id}`, label: `${b.name} (branch)` })),
    ...showrooms,
  ]

  const submit = () => {
    const e = {}
    const uname = username.trim().toLowerCase()
    if (!name.trim()) e.name = 'Full name is required'
    if (!uname) e.username = 'Username is required'
    else if ([...users.map((u) => u.username), ...systemUsers.map((u) => u.username)].includes(uname)) e.username = 'That username is already taken'
    if (!roleValue) e.role = 'Select the role this user will hold'
    if (!password) e.password = 'A temporary password is required'
    if (confirm !== password) e.confirm = "Passwords don't match"
    setErrors(e)
    if (Object.keys(e).length) return

    const created = addUser({
      name, username: uname, email, phone,
      role: role.label,
      location: locationOptions.find((o) => o.value === location)?.label || 'All locations',
      active, forceReset,
    })
    showToast(`User registered — ${created.name}`, `${created.role} · ${created.location}`)
    onDone?.()
  }

  return (
    <FormShell
      crumbs={crumbs}
      title="Register user"
      icon="user-round-cog"
      description="Create a system user and assign the role that governs what they can see and do. Access rights follow the role, so choosing it correctly is the whole of the permission decision."
      headerActions={<Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>Back to users</Button>}
      submitLabel="Register user"
      onSubmit={submit}
      onCancel={onBack}
      note="Usernames must be unique. The user receives their temporary password directly from you and must change it at first sign-in."
      aside={
        <>
          <Panel title="Permissions granted">
            {role ? (
              <>
                <MetaRow label="View" value={role.view} />
                <MetaRow label="Create" value={role.create ? 'Permitted' : 'Not permitted'} tone={role.create ? 'positive' : undefined} />
                <MetaRow label="Edit" value={role.edit ? 'Permitted' : 'Not permitted'} tone={role.edit ? 'positive' : undefined} />
                <MetaRow label="Approve" value={role.approve ? 'Permitted' : 'Not permitted'} tone={role.approve ? 'positive' : undefined} />
                <MetaRow label="Delete" value={role.del ? 'Permitted' : 'Not permitted'} tone={role.del ? 'negative' : undefined} />
                <div style={{ marginTop: 12, font: 'var(--type-caption)', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  {role.note}
                </div>
              </>
            ) : (
              <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)' }}>
                Select a role to see the access it grants.
              </div>
            )}
          </Panel>

          {role?.value === 'admin' && (
            <Callout tone="danger" icon="shield-alert" title="Unrestricted access">
              Administrators can view, create, edit, approve and delete across every module, including cost data
              and wallet operations. Grant this role sparingly.
            </Callout>
          )}
          {role && role.view.includes('no cost') && (
            <Callout tone="info" icon="lock" title="Cost data withheld">
              This role completes production and costing work without ever seeing landing cost values.
            </Callout>
          )}
        </>
      }
    >
      <Panel title="User details">
        <FieldSet columns={2}>
          <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. C. Eze" error={errors.name} />
          <Input label="Username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="e.g. c.eze" hint="Must be unique across the system." error={errors.username} />
          <Input label="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+234 …" />
          <Input label="Email address" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@zifiq.com" />
          <Input
            label="Temporary password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={`Up to ${MAX_PASSWORD} characters`}
            maxLength={MAX_PASSWORD}
            hint={`Passwords are limited to ${MAX_PASSWORD} characters.`}
            error={errors.password}
          />
          <Input label="Confirm password" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} maxLength={MAX_PASSWORD} error={errors.confirm} />
        </FieldSet>
      </Panel>

      <Panel title="Role & assignment" description="The role decides what this user can do; the location decides what they can see.">
        <FieldSet columns={2}>
          <div>
            <Select label="Role" options={systemRoles} value={roleValue} onChange={(e) => setRoleValue(e.target.value)} placeholder="Select role…" />
            {errors.role && <div style={{ font: 'var(--type-caption)', color: 'var(--text-danger)', marginTop: 5 }}>{errors.role}</div>}
          </div>
          <Select
            label="Assigned location"
            options={locationOptions}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Select location…"
          />
        </FieldSet>
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Switch checked={forceReset} onChange={setForceReset} />
            <div>
              <div style={{ font: 'var(--fw-semibold) var(--text-sm)/1.3 var(--font-ui)', color: 'var(--text-strong)' }}>Require password change at first sign-in</div>
              <div style={{ font: 'var(--fw-regular) var(--text-xs)/1.4 var(--font-ui)', color: 'var(--text-muted)', marginTop: 2 }}>
                The user sets their own password through Change My Password.
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Switch checked={active} onChange={setActive} />
            <div>
              <div style={{ font: 'var(--fw-semibold) var(--text-sm)/1.3 var(--font-ui)', color: 'var(--text-strong)' }}>Active on creation</div>
              <div style={{ font: 'var(--fw-regular) var(--text-xs)/1.4 var(--font-ui)', color: 'var(--text-muted)', marginTop: 2 }}>
                Suspended users keep their records but cannot sign in.
              </div>
            </div>
          </div>
        </div>
      </Panel>
    </FormShell>
  )
}

export default function UserRegister({ leaf, moduleLabel, parentLabel }) {
  const { users, user, setUserStatus } = useStore()
  const [mode, setMode] = useState('list')
  const crumbs = [moduleLabel, parentLabel, leaf?.label].filter(Boolean)

  if (mode === 'create') {
    return <UserForm crumbs={crumbs} onBack={() => setMode('list')} onDone={() => setMode('list')} />
  }

  // This company's own users first — the account owner included — then the
  // sample roster the rest of the prototype refers to.
  // Accounts created before the owner record existed still show their owner.
  const roster = users.length ? users : [{
    id: 'owner', name: user.name || 'Administrator', username: (user.email || '').split('@')[0] || 'admin',
    role: user.role || 'Administrator', location: 'All locations', phone: '', status: 'Active',
    owner: true, createdAt: null,
  }]

  const own = roster.map((u) => ({
    ...u,
    showroom: u.location || '—',
    phone: u.phone || '—',
    lastSignIn: u.owner ? 'This session' : 'Never signed in',
    created: u.createdAt ? fmtDate(new Date(u.createdAt).toISOString()).split(',')[0] : 'Account owner',
    onToggle: () => setUserStatus(u.id, u.status === 'Active' ? 'Suspended' : 'Active'),
  })).reverse()

  const rows = [...own, ...systemUsers]
  const active = rows.filter((u) => u.status === 'Active')

  return (
    <RegisterShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'User Register'}
      icon={leaf?.icon}
      description="Create and manage the people who use the system. Each user is assigned a role, and that role determines the access rights and permissions they hold across every module."
      createLabel="Register user"
      onCreate={() => setMode('create')}
      searchPlaceholder="Search by name, username or role…"
      filters={
        <>
          <Select options={systemRoles} placeholder="All roles" style={{ width: 210 }} />
          <Select options={showrooms} placeholder="All locations" style={{ width: 190 }} />
        </>
      }
      stats={[
        { label: 'Users registered', value: String(rows.length) },
        { label: 'Active', value: String(active.length) },
        { label: 'Suspended', value: String(rows.length - active.length), tone: rows.length - active.length ? 'warning' : undefined },
        { label: 'Roles in use', value: String(new Set(rows.map((u) => u.role)).size) },
      ]}
      columns={columns}
      rows={rows}
      onRowClick={() => {}}
      emptyTitle="No users registered"
      emptyDescription="Register a user and assign them a role to grant system access."
      footnote="Where a user lacks the permission for an action, the system blocks it and shows a clear permission-denied message rather than a generic error."
    >
      <Panel title="Roles and permissions" description="What each role can do at system level. Feature-specific restrictions apply on top of this.">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 760 }}>
            <thead>
              <tr style={{ background: 'var(--surface-sunken)' }}>
                {['Role', 'View', 'Create', 'Edit', 'Approve', 'Delete'].map((h, i) => (
                  <th key={h} style={{
                    height: 34, padding: '0 12px', textAlign: i > 1 ? 'center' : 'left',
                    font: 'var(--type-eyebrow)', letterSpacing: 'var(--ls-wide)', textTransform: 'uppercase',
                    color: 'var(--text-muted)', borderBottom: '1px solid var(--border-default)', whiteSpace: 'nowrap',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {systemRoles.map((r) => (
                <tr key={r.value} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ height: 40, padding: '0 12px' }}>
                    <div style={{ font: 'var(--fw-semibold) var(--text-sm)/1.3 var(--font-ui)', color: 'var(--text-strong)', whiteSpace: 'nowrap' }}>{r.label}</div>
                    <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)' }}>{r.note}</div>
                  </td>
                  <td style={{ padding: '0 12px', font: 'var(--fw-regular) var(--text-sm)/1.4 var(--font-ui)', color: 'var(--text-body)', whiteSpace: 'nowrap' }}>{r.view}</td>
                  {[r.create, r.edit, r.approve, r.del].map((on, i) => (
                    <td key={i} style={{ padding: '0 12px', textAlign: 'center' }}><Perm on={on} /></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </RegisterShell>
  )
}
