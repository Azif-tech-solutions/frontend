// import { useState } from 'react'
// import { ReportShell } from '../shells/ReportShell.jsx'
// import { showrooms } from '../sampleShowroom.js'
// import { cashiers } from '../sampleAccount.js'
// import { VAT_RATE } from '../sample.js'
// import { dailySales } from '../sampleCashier.js'
// import { fmt, money, moneyShort } from '../utils.js'
// import TenantApi from '../../api/TenantApi.js'

// import AccountApi from '../../api/AccountApi.js'
// import ShowroomApi from '../../api/ShowroomApi.js'
// import FactoryApi from '../../api/FactoryApi.js'
// import { useEffect } from 'react'

// let tenantApi=new TenantApi()
// export default function SalesReport({ leaf, moduleLabel, parentLabel }) {
//   const [cashierOptions,setCashierOptions]=useState([])

//   const rows = dailySales.map((d) => {
//     const net = d.gross - d.discount
//     return { ...d, net, vat: net * VAT_RATE, avgSale: net / d.transactions }
//   })

//   const gross = rows.reduce((n, r) => n + r.gross, 0)
//   const discount = rows.reduce((n, r) => n + r.discount, 0)
//   const net = rows.reduce((n, r) => n + r.net, 0)
//   const vat = rows.reduce((n, r) => n + r.vat, 0)
//   const units = rows.reduce((n, r) => n + r.units, 0)
//   const transactions = rows.reduce((n, r) => n + r.transactions, 0)
//   const best = rows.reduce((m, r) => (r.net > m.net ? r : m), rows[0])
//   // let cashierOptions=[]
//   const columns = [
//     { key: 'date', label: 'Date', width: 140 },
//     { key: 'showroom', label: 'Showroom', width: 180 },
//     { key: 'transactions', label: 'Transactions', width: 140, align: 'right', mono: true, render: (r) => fmt(r.transactions) },
//     { key: 'units', label: 'Units sold', width: 130, align: 'right', mono: true, render: (r) => fmt(r.units) },
//     { key: 'gross', label: 'Gross sales', width: 165, align: 'right', mono: true, render: (r) => money(r.gross) },
//     {
//       key: 'discount', label: 'Discount', width: 150, align: 'right', mono: true,
//       render: (r) => (r.discount ? <span style={{ color: 'var(--danger)' }}>{money(r.discount)}</span> : '—'),
//     },
//     { key: 'net', label: 'Net sales', width: 175, align: 'right', mono: true, render: (r) => money(r.net) },
//     { key: 'vat', label: 'VAT', width: 155, align: 'right', mono: true, render: (r) => money(r.vat) },
//     { key: 'avgSale', label: 'Avg. transaction', width: 165, align: 'right', mono: true, render: (r) => money(r.avgSale) },
//   ]


//   useEffect(() => {
//     tenantApi.getTenantMemberList({page:0,size:200}).then((res)=>{
//       console.log(res)
//       setCashierOptions(res.data.items.filter((item)=>item.role.name==="CASHIER").map((item)=>({label:item.displayName,value:item.id})))
//       console.log(cashierOptions)
//     })
//   }, [])


//   return (
//     <ReportShell
//       wide
//       crumbs={[moduleLabel, parentLabel]}
//       title={leaf?.label || 'Sales Report'}
//       icon={leaf?.icon}
//       description="Daily summary of sales activity — transactions, units moved and revenue generated per day, for monitoring performance over a chosen period."
//       filters={[
//         { key: 'showroom', label: 'Showroom', type: 'select', options: showrooms },
//         { key: 'cashier', label: 'Cashier', type: 'select', options: cashierOptions },
//         { key: 'from', label: 'Date from', type: 'date' },
//         { key: 'to', label: 'Date to', type: 'date' },
//       ]}
//       stats={[
//         { label: 'Net sales', value: moneyShort(net), delta: `${fmt(transactions)} transactions` },
//         { label: 'Units sold', value: fmt(units) },
//         { label: 'Average transaction', value: money(net / transactions) },
//         { label: 'Best day', value: best.date.split(' ').slice(0, 2).join(' '), hint: moneyShort(best.net) },
//       ]}
//       columns={columns}
//       rows={rows}
//       totals={{
//         date: 'Total',
//         transactions: fmt(transactions),
//         units: fmt(units),
//         gross: money(gross),
//         discount: money(discount),
//         net: money(net),
//         vat: money(vat),
//       }}
//       tableTitle="Daily sales summary"
//       emptyTitle="No sales in this period"
//       emptyDescription="Widen the date range or change the showroom, then generate again."
//       footnote="Net sales are gross less discounts. VAT is calculated on net at the rate configured for the showroom, and reconciles to the Showroom VAT Report for the same period."
//     />
//   )
// }


import { useEffect, useState, useCallback } from 'react'
import Loader from '../../ds/components/core/Loader.jsx'
import { ReportShell } from '../shells/ReportShell.jsx'
import { Callout } from '../shells/Page.jsx'
import { useStore } from '../store.jsx'
import { fmt, money, moneyShort, fmtDate } from '../utils.js'
import TenantApi from '../../api/TenantApi.js'
import CashierApi from '../../api/CashierApi.js'
import ShowroomApi from '../../api/ShowroomApi.js'

const tenantApi = new TenantApi()
const cashierApi = new CashierApi()
const showroomApi = new ShowroomApi()

const today = () => new Date().toISOString().slice(0, 10)
const startOfMonth = () => {
  const d = new Date()
  return new Date(d.getFullYear(), d.getMonth(), 1)
    .toISOString()
    .slice(0, 10)
}

// Permissive — matches "Cashier", "CASHIER", "Sales Cashier", etc.
function isCashierRole(role) {
  const name = String(role?.name || '').toLowerCase()
  return name.includes('cash')
}

export default function SalesReport({ leaf, moduleLabel, parentLabel }) {
  const { showToast } = useStore()
  const crumbs = [moduleLabel, parentLabel, leaf?.label].filter(Boolean)

  // lookups
  const [showrooms, setShowrooms] = useState([])
  const [cashiers, setCashiers] = useState([])
  const [loadingLookups, setLoadingLookups] = useState(true)
  const [lookupErrors, setLookupErrors] = useState([])

  // applied filters — cashierUserId intentionally empty by default
  // so the report loads "all cashiers" for the auto-selected showroom
  const [applied, setApplied] = useState({
    locationId: '',
    cashierUserId: '',
    from: startOfMonth(),
    to: today(),
  })

  // report data
  const [rows, setRows] = useState([])
  const [totals, setTotals] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [lastReason, setLastReason] = useState('')

  // ── lookups: showrooms + cashier members only ───────────
  useEffect(() => {
    let cancelled = false
    setLoadingLookups(true)

    const errors = []

    Promise.all([
      showroomApi
        .lookupPickerWithAreas({ status: ['ACTIVE'] })
        .catch((e) => {
          errors.push(`Showrooms: ${e.message}`)
          return { data: [] }
        }),
      tenantApi
        .getTenantMemberList({ page: 0, size: 200 })
        .catch((e) => {
          errors.push(`Members: ${e.message}`)
          return { data: { items: [] } }
        }),
    ])
      .then(([sRes, mRes]) => {
        if (cancelled) return

        const showroomOptions = (sRes.data || []).map((s) => ({
          value: s.id,
          label: s.label || s.name || s.code,
        }))

        const members = mRes.data?.items || []
        const cashierList = members
          .filter((m) => isCashierRole(m.role))
          .map((m) => ({
            value: m.userId || m.id,
            label: m.displayName || m.email,
          }))

        // eslint-disable-next-line no-console
        console.log('[SalesReport] lookups', {
          showrooms: showroomOptions.length,
          cashiers: cashierList.length,
          errors,
        })

        setShowrooms(showroomOptions)
        setCashiers(cashierList)
        setLookupErrors(errors)
      })
      .catch((e) => {
        if (!cancelled) {
          setLookupErrors([e.message])
          showToast('Could not load lookups', e.message, true)
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingLookups(false)
      })

    return () => {
      cancelled = true
    }
  }, [showToast])

  // ── auto-select first showroom once loaded; cashier stays blank ──
  useEffect(() => {
    if (!showrooms.length) return
    setApplied((prev) =>
      prev.locationId && showrooms.some((s) => s.value === prev.locationId)
        ? prev
        : { ...prev, locationId: showrooms[0].value }
    )
  }, [showrooms])

  // ── load report ─────────────────────────────────────────
  // Only locationId + dates are required; cashierUserId is optional.
  const load = useCallback(async () => {
    const missing = []
    if (!applied.locationId) missing.push('showroom')
    if (!applied.from) missing.push('from date')
    if (!applied.to) missing.push('to date')

    if (missing.length > 0) {
      // eslint-disable-next-line no-console
      console.log('[SalesReport] not firing — missing', missing)
      setRows([])
      setTotals(null)
      setStats(null)
      setLastReason(`Waiting for: ${missing.join(', ')}`)
      return
    }

    // eslint-disable-next-line no-console
    console.log('[SalesReport] firing with', applied)

    setLoading(true)
    setLastReason('')
    try {
      const res = await cashierApi.getCashierReportsSalesDaily({
        locationId: applied.locationId,
        // backend treats '' as "all cashiers" — the type still requires
        // a string, so we send the empty string rather than omitting.
        cashierUserId: applied.cashierUserId || '',
        from: applied.from,
        to: applied.to,
      })
      setRows(res.data?.rows || [])
      setTotals(res.data?.totals || null)
      setStats(res.data?.stats || null)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('[SalesReport] request failed', e)
      setLastReason(`Request failed: ${e.message}`)
      showToast('Could not load sales report', e.message, true)
    } finally {
      setLoading(false)
    }
  }, [applied, showToast])

  useEffect(() => {
    load()
  }, [load])

  // ── "Generate report" handler ───────────────────────────
  const handleGenerate = useCallback((values) => {
    // eslint-disable-next-line no-console
    console.log('[SalesReport] onGenerate', values)
    setApplied({
      locationId: values?.locationId || '',
      cashierUserId: values?.cashierUserId || '',
      from: values?.from || '',
      to: values?.to || '',
    })
  }, [])

  // ── columns ─────────────────────────────────────────────
  const columns = [
    {
      key: 'date',
      label: 'Date',
      width: 130,
      render: (r) => (r.date ? fmtDate(r.date) : '—'),
    },
    {
      key: 'showroom',
      label: 'Showroom',
      width: 190,
      render: (r) => r.showroom?.name || '—',
    },
    {
      key: 'transactions',
      label: 'Transactions',
      width: 130,
      align: 'right',
      mono: true,
      render: (r) => fmt(r.transactions || 0),
    },
    {
      key: 'units',
      label: 'Units sold',
      width: 120,
      align: 'right',
      mono: true,
      render: (r) => fmt(r.units || 0),
    },
    {
      key: 'gross',
      label: 'Gross sales',
      width: 160,
      align: 'right',
      mono: true,
      render: (r) => money(r.gross || 0),
    },
    {
      key: 'discount',
      label: 'Discount',
      width: 140,
      align: 'right',
      mono: true,
      render: (r) =>
        r.discount ? (
          <span style={{ color: 'var(--danger)' }}>
            {money(r.discount)}
          </span>
        ) : (
          '—'
        ),
    },
    {
      key: 'net',
      label: 'Net sales',
      width: 160,
      align: 'right',
      mono: true,
      render: (r) => money(r.net || 0),
    },
    {
      key: 'vat',
      label: 'VAT',
      width: 140,
      align: 'right',
      mono: true,
      render: (r) => money(r.vat || 0),
    },
    {
      key: 'avgSale',
      label: 'Avg. transaction',
      width: 160,
      align: 'right',
      mono: true,
      render: (r) => money(r.avgSale || 0),
    },
  ]

  // ── filter options — cashier gets "All cashiers" as the blank option ──
  const showroomOptions = [
    { value: '', label: 'Select showroom…' },
    ...showrooms,
  ]
  const cashierOptions = [
    { value: '', label: 'All cashiers' },
    ...cashiers,
  ]

  // ── server stats with safe fallbacks ────────────────────
  const netSales = stats?.netSales ?? 0
  const txCount = stats?.transactions ?? 0
  const unitsSold = stats?.units ?? 0
  const avgTransaction = stats?.averageTransaction ?? 0
  const bestDay = stats?.bestDay || ''

  // ── diagnostic state ────────────────────────────────────
  const noShowrooms = !loadingLookups && showrooms.length === 0
  const missingShowroom =
    !loadingLookups && !noShowrooms && !applied.locationId

  return (
    <>
      {(loading || loadingLookups) && (
        <Loader
          overlay
          label={
            loadingLookups ? 'Loading filters…' : 'Loading sales report…'
          }
        />
      )}
      <ReportShell
        wide
        crumbs={[moduleLabel, parentLabel]}
        title={leaf?.label || 'Sales Report'}
        icon={leaf?.icon}
        description="Daily summary of sales activity — transactions, units moved and revenue generated per day, for monitoring performance over a chosen period."
        onGenerate={handleGenerate}
        filters={[
          {
            key: 'locationId',
            label: 'Showroom',
            type: 'select',
            options: showroomOptions,
            defaultValue: applied.locationId,
          },
          {
            key: 'cashierUserId',
            label: 'Cashier',
            type: 'select',
            options: cashierOptions,
            defaultValue: applied.cashierUserId,
          },
          {
            key: 'from',
            label: 'Date from',
            type: 'date',
            defaultValue: applied.from,
          },
          {
            key: 'to',
            label: 'Date to',
            type: 'date',
            defaultValue: applied.to,
          },
        ]}
        stats={[
          {
            label: 'Net sales',
            value: moneyShort(netSales),
            delta: `${fmt(txCount)} transactions`,
          },
          { label: 'Units sold', value: fmt(unitsSold) },
          {
            label: 'Average transaction',
            value: money(avgTransaction),
          },
          {
            label: 'Best day',
            value: bestDay ? fmtDate(bestDay) : '—',
          },
        ]}
        columns={columns}
        rows={rows}
        totals={
          totals
            ? {
                date: 'Total',
                transactions: fmt(totals.transactions || 0),
                units: fmt(totals.units || 0),
                gross: money(totals.gross || 0),
                discount: money(totals.discount || 0),
                net: money(totals.net || 0),
                vat: money(totals.vat || 0),
              }
            : undefined
        }
        tableTitle="Daily sales summary"
        emptyTitle={
          noShowrooms
            ? 'No showrooms available'
            : missingShowroom
              ? 'Select a showroom'
              : 'No sales in this period'
        }
        emptyDescription={
          noShowrooms
            ? 'Create a showroom under Setup, or verify the showroom API is reachable.'
            : missingShowroom
              ? 'Pick a showroom in the filters above — the report loads automatically once it is set.'
              : 'Widen the date range or choose a different showroom or cashier, then generate again.'
        }
        footnote="Net sales are gross less discounts. VAT is calculated on net at the rate configured for the showroom, and reconciles to the Showroom VAT Report for the same period."
      >
        {noShowrooms && (
          <Callout
            tone="danger"
            icon="circle-alert"
            title="No showrooms loaded"
          >
            The report needs a showroom to query. Create one under Setup, or
            check the network tab for failed lookup calls.
            {lookupErrors.length > 0 && (
              <div style={{ marginTop: 8, font: 'var(--type-caption)' }}>
                {lookupErrors.map((err, i) => (
                  <div key={i}>· {err}</div>
                ))}
              </div>
            )}
          </Callout>
        )}
        {!noShowrooms && lastReason && rows.length === 0 && (
          <Callout
            tone="warning"
            icon="hourglass"
            title="Report not yet loaded"
          >
            {lastReason}. Use the filters above and click{' '}
            <strong>Generate report</strong> once a showroom is picked.
          </Callout>
        )}
      </ReportShell>
    </>
  )
}