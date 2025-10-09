import type { QuoteInput, QuoteOutput } from './quote-schema'

/**
 * Calculate quote using WASM module
 * For now, using a TypeScript fallback until WASM is built
 */
export function calculateQuote(input: QuoteInput): QuoteOutput {
  // Calculate surface area (treating as a box)
  const surfaceArea =
    (2 *
      (input.length_mm * input.width_mm +
        input.length_mm * input.height_mm +
        input.width_mm * input.height_mm)) /
    1_000_000 // Convert mm² to m²

  // Base price per m² (EUR)
  const baseRate = 25.0
  let basePrice = surfaceArea * baseRate * input.quantity

  // Material multiplier
  const materialMultiplier =
    input.material === 'Aluminium' ? 1.0 : input.material === 'Steel' ? 0.9 : 1.2

  basePrice *= materialMultiplier

  // Prep surcharge
  const prepSurcharge =
    input.prep_level === 'Clean'
      ? 0.0
      : input.prep_level === 'BlastClean'
        ? surfaceArea * 15.0 * input.quantity
        : surfaceArea * 25.0 * input.quantity

  // Rush surcharge (50% if rush and < 5 days)
  const rushSurcharge = input.is_rush && input.turnaround_days < 5 ? basePrice * 0.5 : 0.0

  const totalPrice = basePrice + prepSurcharge + rushSurcharge

  return {
    base_price: Math.round(basePrice * 100) / 100,
    prep_surcharge: Math.round(prepSurcharge * 100) / 100,
    rush_surcharge: Math.round(rushSurcharge * 100) / 100,
    total_price: Math.round(totalPrice * 100) / 100,
    currency: 'EUR',
  }
}

/**
 * Format price for display
 */
export function formatPrice(amount: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('en-LV', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

// TODO: Replace with actual WASM integration
// import init, { calculate_quote_wasm } from 'quote_core'
//
// let wasmInitialized = false
//
// export async function initWasm() {
//   if (!wasmInitialized) {
//     await init()
//     wasmInitialized = true
//   }
// }
//
// export function calculateQuote(input: QuoteInput): QuoteOutput {
//   const inputJson = JSON.stringify(input)
//   const outputJson = calculate_quote_wasm(inputJson)
//   return JSON.parse(outputJson)
// }
