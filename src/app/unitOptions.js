import { units as sampleUnits } from './sample.js'

/**
 * Unit-of-measure options for any quantity field. The company's own units win
 * as soon as one is defined; until then the default set stands in.
 */
export function unitOptions(units) {
  return units.length
    ? units.map((u) => ({ value: u.id, label: u.symbol ? `${u.name} (${u.symbol})` : u.name }))
    : sampleUnits
}
