import { z } from 'zod'

// Material types matching quote_core
export const MaterialEnum = z.enum(['Aluminium', 'Steel', 'Stainless'])
export type Material = z.infer<typeof MaterialEnum>

// Prep level types matching quote_core
export const PrepLevelEnum = z.enum(['Clean', 'BlastClean', 'BlastPrime'])
export type PrepLevel = z.infer<typeof PrepLevelEnum>

// Quote input schema with validation
export const quoteSchema = z.object({
  // Dimensions in millimeters
  length_mm: z
    .number()
    .min(10, 'Length must be at least 10mm')
    .max(5000, 'Length cannot exceed 5000mm'),
  width_mm: z
    .number()
    .min(10, 'Width must be at least 10mm')
    .max(5000, 'Width cannot exceed 5000mm'),
  height_mm: z
    .number()
    .min(10, 'Height must be at least 10mm')
    .max(5000, 'Height cannot exceed 5000mm'),

  // Material selection
  material: MaterialEnum,

  // Surface preparation level
  prep_level: PrepLevelEnum,

  // RAL color code (basic validation)
  color: z
    .string()
    .min(4, 'Please enter a valid RAL code')
    .regex(/^\d{4}$/, 'RAL code must be 4 digits (e.g., 9005)'),

  // Turnaround time
  turnaround_days: z
    .number()
    .int()
    .min(1, 'Minimum turnaround is 1 day')
    .max(30, 'Maximum turnaround is 30 days'),

  // Quantity
  quantity: z
    .number()
    .int()
    .min(1, 'Quantity must be at least 1')
    .max(1000, 'Please contact us for quantities over 1000'),

  // Rush order flag
  is_rush: z.boolean(),
})

export type QuoteInput = z.infer<typeof quoteSchema>

// Quote output types matching quote_core
export interface QuoteOutput {
  base_price: number
  prep_surcharge: number
  rush_surcharge: number
  total_price: number
  currency: string
}

// Default form values
export const defaultQuoteValues: QuoteInput = {
  length_mm: 1000,
  width_mm: 500,
  height_mm: 300,
  material: 'Aluminium',
  prep_level: 'Clean',
  color: '9005',
  turnaround_days: 7,
  quantity: 1,
  is_rush: false,
}

// Material display names and descriptions
export const materialInfo: Record<Material, { label: string; description: string; icon: string }> = {
  Aluminium: {
    label: 'Aluminium',
    description: 'Lightweight, corrosion-resistant',
    icon: '✨',
  },
  Steel: {
    label: 'Steel',
    description: 'Strong, cost-effective',
    icon: '⚙️',
  },
  Stainless: {
    label: 'Stainless Steel',
    description: 'Premium, highly durable',
    icon: '💎',
  },
}

// Prep level display names and descriptions
export const prepLevelInfo: Record<
  PrepLevel,
  { label: string; description: string; icon: string }
> = {
  Clean: {
    label: 'Basic Clean',
    description: 'Standard cleaning only',
    icon: '🧹',
  },
  BlastClean: {
    label: 'Blast + Clean',
    description: 'Media blasting for better adhesion',
    icon: '💨',
  },
  BlastPrime: {
    label: 'Blast + Prime',
    description: 'Full prep with primer coat',
    icon: '🎨',
  },
}
