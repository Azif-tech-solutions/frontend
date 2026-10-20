//store.jsx
import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { BaseApi } from '../api/config'
// Company / branches / factories / stock data layer.
// Persisted to localStorage so state survives a refresh. No backend yet.

export const KEY = 'biz_console_v1'

// Document reference series. One running sequence per document type; a number is
// consumed only when a document is actually posted, so a reference is never
// burned by opening a form and walking away. Seeds continue the demo history.
const REF_SEED = { RF: 2482, DL: 1141 }
const refLabel = (prefix, n) => `${prefix}-${String(n).padStart(4, '0')}`

const emptyState = {
  loggedIn: false,
  user: { name: '', email: '', role: 'Administrator',userId:'',tenantId:'' },
  company: { name: '', address: '', phone: '',email:'',taxRegistrationNumber:'',onboarded: false },
  branches: [],
  factories: [],
  finishedFieldTemplate: [],
  products: [],
  stockEntries: [],
  users: [],
  suppliers: [],
  manufacturers: [],
  units: [],
  categories: [],
  refillDrafts: [],
  refills: [],
  specialRecentProductionRuns: [],
  sequences: {},
  
}

function loadState() {
  try {
    const s = localStorage.getItem(KEY)
    if (s) return { ...emptyState, ...JSON.parse(s) }
  } catch { /* ignore */ }
  return emptyState
}

const Ctx = createContext(null)
// eslint-disable-next-line react-refresh/only-export-components -- context hook lives alongside its Provider
export function useStore() { return useContext(Ctx) }

export function StoreProvider({ children }) {
  const [data, setData] = useState(loadState)
  const [toast, setToast] = useState(null)
  const seq = useRef(1)
  const nextId = (prefix) => `${prefix}-${Date.now().toString(36)}${(seq.current += 1).toString(36)}`

  // useEffect(() => {
  //   try { localStorage.setItem(KEY, JSON.stringify(data)) } catch { /* ignore */ }
  // }, [data])
  useEffect(() => {
    try {
      const prev = JSON.parse(localStorage.getItem(KEY) ?? '{}')
      localStorage.setItem(KEY, JSON.stringify({
        ...data,
        accessToken: prev.accessToken,
        refreshToken: prev.refreshToken,
      }))
    } catch { /* ignore */ }
  }, [data])
  // Mirrors data.sequences so a reference can be issued and returned synchronously.
  const seqRef = useRef(null)
  if (seqRef.current === null) seqRef.current = { ...REF_SEED, ...(data.sequences || {}) }

  /** The number this document type would take next — display only, consumes nothing. */
  const peekRef = useCallback((prefix) => refLabel(prefix, seqRef.current[prefix] ?? 1), [])

  /** Consume and return the next reference for a document type. */
  const issueRef = useCallback((prefix) => {
    const n = seqRef.current[prefix] ?? 1
    seqRef.current = { ...seqRef.current, [prefix]: n + 1 }
    setData((d) => ({ ...d, sequences: { ...d.sequences, [prefix]: n + 1 } }))
    return refLabel(prefix, n)
  }, [])

  const showToast = useCallback((msg, sub, err) => setToast({ msg, sub, err: !!err, at: Date.now() }), [])
  const clearToast = useCallback(() => setToast(null), [])

  // No real backend — password is only used for the local sign-up/sign-in gesture, never persisted.
  const signUp = useCallback(({ name, email,userId,tenantId }) => {
    setData((d) => ({ ...d, loggedIn: true, user: { name: (name || '').trim(), email: email.trim(), role: 'Administrator', userId, tenantId } }))
  }, [])
  const signIn = useCallback(({ email,userId,tenantId }) => {
    setData((d) => ({ ...d, loggedIn: true, user: { ...d.user, email: email.trim(), userId, tenantId } }))
  }, [])
  const logout = useCallback(() => setData((d) => ({ ...d, loggedIn: false })), [])

  useEffect(() => {
    BaseApi.onSessionExpired = () => {
      logout()
      showToast('Session expired', 'Please sign in again', true)
    }
    return () => { BaseApi.onSessionExpired = null }
  }, [logout, showToast])
  // Onboarding — required company fields, plus an optional first branch and
  // first factory. A factory is a prerequisite for every Factory module screen,
  // so it is offered here as well as in Settings › Factories.
  const completeOnboarding = useCallback((companyInfo, branch, factory) => {
    setData((d) => {
      const company = { ...companyInfo, onboarded: true }
      let branches = d.branches
      if (branch && (branch.name.trim() || branch.number.trim())) {
        branches = [...branches, { id: nextId('br'), name: branch.name.trim(), number: branch.number.trim(), address: '', createdAt: Date.now() }]
      }
      let factories = d.factories
      if (factory && factory.name.trim()) {
        factories = [...factories, { id: factory.id.trim(), name: factory.name.trim(), code: (factory.code || '').trim(), address: (factory.address || '').trim(), createdAt: Date.now() }]
      }
      // The person who created the company becomes the first user — an
      // Administrator — so every record has a real name to attribute to.
      const users = d.users.length ? d.users : [{
        id: nextId('usr'),
        name: d.user.name || 'Administrator',
        username: (d.user.email || '').split('@')[0] || 'admin',
        email: d.user.email || '',
        role: 'Administrator',
        location: 'All locations',
        phone: companyInfo.phone || '',
        status: 'Active',
        owner: true,
        createdAt: Date.now(),
      }]
      return { ...d, company, branches, factories, users }
    })
  }, [])

  /**
   * Units of measure. Every product, material and recipe is quantified in one
   * of these, so the admin defines the company's own set rather than being held
   * to a fixed list.
   */
  const addUnit = useCallback((info) => {
    const unit = {
      id: info.id,
      name: (info.name || '').trim(),
      symbol: (info.symbol || '').trim(),
      note: (info.note || '').trim(),
      createdAt: Date.now(),
    }
    setData((d) => ({ ...d, units: [...d.units, unit] }))
    return unit
  }, [])

  const updateUnit = useCallback((id, patch) => {
    setData((d) => ({ ...d, units: d.units.map((u) => (u.id === id ? { ...u, ...patch } : u)) }))
  }, [])

  const removeUnit = useCallback((id) => {
    setData((d) => ({ ...d, units: d.units.filter((u) => u.id !== id) }))
  }, [])
  const overrideUnits = useCallback((units) => {
    setData((d) => ({ ...d, units: units }))
  }, [])

  const overrideRecentSpecialProductionRuns = useCallback((specialProductionRuns) => {
    setData((d) => ({ ...d, specialProductionRuns: specialProductionRuns }))
  }, [])

  /**
   * Product categories — the Type/Group every finished product and raw material
   * belongs to (PRD 5.1.4: e.g. Emulsion is a type of paint, under a brand).
   * Drives the Category pick on the Stock Register and the grouped stock/bin cards.
   */
  const addCategory = useCallback((info) => {
    const category = {
      id: info.id || nextId('cat'),
      name: (info.name || '').trim(),
      type: (info.type || '').trim(),
      description: (info.description || '').trim(),
      createdAt: Date.now(),
    }
    setData((d) => ({ ...d, categories: [...d.categories, category] }))
    return category
  }, [])

  const updateCategory = useCallback((id, patch) => {
    setData((d) => ({ ...d, categories: d.categories.map((c) => (c.id === id ? { ...c, ...patch } : c)) }))
  }, [])

  const removeCategory = useCallback((id) => {
    setData((d) => ({ ...d, categories: d.categories.filter((c) => c.id !== id) }))
  }, [])
   const overrideCategories = useCallback((categories) => {
    setData((d) => ({ ...d, categories: categories }))
  }, [])

  const overrideProducts = useCallback((products) => {
    setData((d) => ({ ...d, products: products }))
  }, [])
const upsertProduct = useCallback((product) => {
  setData((d) => ({
    ...d,
    products: d.products.some((p) => p.id === product.id)
      ? d.products.map((p) => (p.id === product.id ? { ...p, ...product } : p))
      : [...d.products, product],
  }))
}, [])

const mergeProducts = useCallback(({ factoryIds, kinds }, incoming) => {
  setData((d) => ({
    ...d,
    products: [
      ...d.products.filter((p) => !(factoryIds.includes(p.factoryId) && kinds.includes(p.kind))),
      ...incoming,
    ],
  }))
}, [])
  /** Supplier register — who raw materials are bought from. */
  const addSupplier = useCallback((info) => {
    const supplier = {
      id: info.id || nextId('sup'),
      code: (info.code || '').trim(),
      name: (info.name || '').trim(),
      contact: (info.contact || '').trim(),
      phone: (info.phone || '').trim(),
      email: (info.email || '').trim(),
      address: (info.address || '').trim(),
      supplies: (info.supplies || '').trim(),
      status: info.active === false ? 'Inactive' : 'Active',
      createdAt: Date.now(),
    }
    setData((d) => ({ ...d, suppliers: [...d.suppliers, supplier] }))
    return supplier
  }, [])

   const overrideSuppliers = useCallback((suppliers) => {
    setData((d) => ({ ...d, suppliers: suppliers }))
  }, [])

  const updateSupplier = useCallback((id, patch) => {
    setData((d) => ({ ...d, suppliers: d.suppliers.map((x) => (x.id === id ? { ...x, ...patch } : x)) }))
  }, [])

  const removeSupplier = useCallback((id) => {
    setData((d) => ({ ...d, suppliers: d.suppliers.filter((x) => x.id !== id) }))
  }, [])

  /** Manufacturer register — who actually produced a received material. */
  const addManufacturer = useCallback((info) => {
    const manufacturer = {
      id: info.id,
      name: (info.name || '').trim(),
      country: (info.country || '').trim(),
      contact: (info.contact || '').trim(),
      phone: (info.phone || '').trim(),
      email: (info.email || '').trim(),
      produces: (info.produces || '').trim(),
      createdAt: Date.now(),
    }
    setData((d) => ({ ...d, manufacturers: [...d.manufacturers, manufacturer] }))
    return manufacturer
  }, [])

  const updateManufacturer = useCallback((id, patch) => {
    setData((d) => ({ ...d, manufacturers: d.manufacturers.map((x) => (x.id === id ? { ...x, ...patch } : x)) }))
  }, [])

  const removeManufacturer = useCallback((id) => {
    setData((d) => ({ ...d, manufacturers: d.manufacturers.filter((x) => x.id !== id) }))
  }, [])

     const overrideManufacturers = useCallback((manufacturers) => {
    setData((d) => ({ ...d, manufacturers: manufacturers }))
  }, [])


  /** Menu › User Register — the people who can sign in to this company. */
  const addUser = useCallback((info) => {
    const user = {
      id: nextId('usr'),
      name: (info.name || '').trim(),
      username: (info.username || '').trim(),
      email: (info.email || '').trim(),
      role: info.role || '',
      location: info.location || '',
      phone: (info.phone || '').trim(),
      status: info.active === false ? 'Suspended' : 'Active',
      forceReset: info.forceReset !== false,
      owner: false,
      createdAt: Date.now(),
    }
    setData((d) => ({ ...d, users: [...d.users, user] }))
    return user
  }, [])

  const setUserStatus = useCallback((id, status) => {
    setData((d) => ({ ...d, users: d.users.map((u) => (u.id === id ? { ...u, status } : u)) }))
  }, [])

  /**
   * Refill drafts. A draft is a refill saved before posting — it holds no
   * reference number (one is only issued on posting) and stays here until it is
   * resumed or discarded.
   */
  const saveDraft = useCallback((kind, draft) => {
    const record = { id: nextId('dft'), kind, ...draft, savedAt: Date.now() }
    setData((d) => ({ ...d, refillDrafts: [record, ...d.refillDrafts] }))
    return record
  }, [])

  const deleteDraft = useCallback((id) => {
    setData((d) => ({ ...d, refillDrafts: d.refillDrafts.filter((r) => r.id !== id) }))
  }, [])

  /**
   * Posted refills and deliveries. A posting is permanent — it carries the
   * reference it consumed and survives a refresh, so the "Recent" feeds on the
   * refill screens (and, later, movement reports) read from here.
   */
  const postRefill = useCallback((kind, info) => {
    const record = { kind, ...info, at: Date.now() }
    setData((d) => ({ ...d, refills: [record, ...d.refills] }))
    return record
  }, [])

  // Company settings — edit the company record captured at onboarding.
  const updateCompany = useCallback((patch) => {
    setData((d) => ({ ...d, company: { ...d.company, ...patch } }))
  }, [])

  // Post-onboarding branch add — name required, number/address optional.
  const addBranch = useCallback((branch) => {
    setData((d) => ({ ...d, branches: [...d.branches, { id: nextId('br'), name: branch.name.trim(), number: branch.number.trim(), address: branch.address.trim(), createdAt: Date.now() }] }))
  }, [])

  // Factory register. Accepts a bare name (the inline select-or-add on Stock
  // Registration) or a full record (Settings › Factories).
  const addFactory = useCallback((input) => {
    const info = typeof input === 'string' ? { name: input } : (input || {})
    const factory = {
      ...info,
      createdAt: Date.now(),
    }
    setData((d) => ({ ...d, factories: [...d.factories, factory] }))
    return factory
  }, [])

  const overrideFactories = useCallback((factories) => {
    setData((d) => ({ ...d, factories: factories }))
  }, [])

  const updateFactory = useCallback((id, patch) => {
    setData((d) => ({ ...d, factories: d.factories.map((f) => (f.id === id ? { ...f, ...patch } : f)) }))
  }, [])

  // Only offered for a factory nothing references yet — see Settings › Factories.
  const removeFactory = useCallback((id) => {
    setData((d) => ({ ...d, factories: d.factories.filter((f) => f.id !== id) }))
  }, [])

  // Reusable custom-field template for finished products.
  const addTemplateField = useCallback((label) => {
    const clean = label.trim()
    let field = null
    setData((d) => {
      const exists = d.finishedFieldTemplate.find((f) => f.label.toLowerCase() === clean.toLowerCase())
      if (exists) { field = exists; return d }
      field = { id: nextId('fld'), label: clean }
      return { ...d, finishedFieldTemplate: [...d.finishedFieldTemplate, field] }
    })
    return field
  }, [])

  const removeTemplateField = useCallback((id) => {
    setData((d) => ({ ...d, finishedFieldTemplate: d.finishedFieldTemplate.filter((f) => f.id !== id) }))
  }, [])

  // Base product — created on its own, ahead of any variation. Variations reference it by productId (FK).
  const addProduct = useCallback((factory, name, fixedFields, variantFieldIds) => {
    const product = {
      id: nextId('prd'),
      factoryId: factory.id, factoryName: factory.name,
      name: name.trim(), fixedFields, variantFieldIds,
      createdAt: Date.now(),
    }
    setData((d) => ({ ...d, products: [...d.products, product] }))
    return product
  }, [])

  /**
   * Factory › Stock Register. Creates the product or material record that every
   * downstream module selects from. Shares the `products` collection with the
   * inline select-or-add on Stock Registration, so a product registered here is
   * immediately selectable there (and vice versa).
   */
  const registerProduct = useCallback((info) => {
    const product = {
      id: nextId('prd'),
      kind: info.kind === 'raw' ? 'raw' : 'finished',
      factoryId: info.factoryId, factoryName: info.factoryName,
      code: (info.code || '').trim(),
      name: (info.name || '').trim(),
      category: info.category || '',
      unit: info.unit || '',
      reorder: info.reorder || '',
      barcode: (info.barcode || '').trim(),
      status: info.active === false ? 'Inactive' : 'Active',
      details: info.details || {},
      // Defaults so register-created products work with the variation flow.
      fixedFields: {}, variantFieldIds: [],
      createdAt: Date.now(),
    }
    setData((d) => ({ ...d, products: [...d.products, product] }))
    return product
  }, [])

  // Submit — every listed item gets the same system-generated, non-editable entry date.
  const commitStockEntries = useCallback((items) => {
    const entryDate = new Date().toISOString()
    setData((d) => ({ ...d, stockEntries: [...items.map((it) => ({ ...it, id: nextId('stk'), entryDate })), ...d.stockEntries] }))
    return entryDate
  }, [])

  const value = {
    ...data,
    toast, showToast, clearToast,
    peekRef, issueRef, overrideCategories,
    signUp, signIn, logout,overrideUnits,
    overrideProducts,
    overrideRecentSpecialProductionRuns,
    upsertProduct,mergeProducts,
    overrideFactories,overrideSuppliers,overrideManufacturers,
    completeOnboarding, updateCompany, addUnit, updateUnit, removeUnit, addCategory, updateCategory, removeCategory, addSupplier, updateSupplier, removeSupplier, addManufacturer, updateManufacturer, removeManufacturer, addUser, setUserStatus, saveDraft, deleteDraft, postRefill, addBranch, addFactory, updateFactory, removeFactory, addTemplateField, removeTemplateField, addProduct, registerProduct, commitStockEntries,
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
