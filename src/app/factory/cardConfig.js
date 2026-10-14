import { factories, brands, stockGroups, stockKinds } from '../sample.js'

/** Shared filter set for the group-level Stock/Bin Cards (PRD §5.1.4–5.1.5). */
export const cardFilters = [
  { key: 'factory', label: 'Factory', type: 'select', options: factories },
  { key: 'kind', label: 'Stock type', type: 'select', options: stockKinds.map(({ value, label }) => ({ value, label })) },
  // { key: 'brand', label: 'Brand', type: 'select', options: brands },
  { key: 'group', label: 'Stock name (group)', type: 'select', options: stockGroups },
  { key: 'from', label: 'Date from', type: 'date' },
  { key: 'to', label: 'Date to', type: 'date' },
]
