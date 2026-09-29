import { categories as sampleCategories } from './sample.js'

/**
 * Category options for the Stock Register. The company's own categories win as
 * soon as one is defined; until then the default set stands in — the same rule
 * units of measure follow.
 */
export function categoryOptions(categories) {
  return categories.length
    ? categories.map((c) => ({ value: c.id, label: c.brand ? `${c.name} · ${c.brand}` : c.name }))
    : sampleCategories
}
