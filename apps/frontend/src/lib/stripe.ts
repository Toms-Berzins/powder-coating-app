/**
 * Stripe Integration Module
 *
 * This module handles Stripe payment integration following 2025 best practices:
 * - TypeScript-first with full type safety
 * - Secure client-side tokenization
 * - PCI-compliant payment forms
 * - Optimized for conversion with Stripe Checkout
 */

import { loadStripe, Stripe } from '@stripe/stripe-js'

// Load Stripe.js asynchronously
// Using environment variable for publishable key
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ''
)

/**
 * Get initialized Stripe instance
 */
export const getStripe = async (): Promise<Stripe | null> => {
  return await stripePromise
}

/**
 * Create a Stripe Checkout session
 * This should be called from the backend to ensure security
 */
export interface CheckoutSessionParams {
  quoteId: string
  totalAmount: number
  currency: string
  customerEmail?: string
  successUrl?: string
  cancelUrl?: string
}

/**
 * Redirect to Stripe Checkout
 *
 * @param sessionId - Checkout session ID from backend
 */
export const redirectToCheckout = async (sessionId: string): Promise<void> => {
  const stripe = await getStripe()
  if (!stripe) {
    throw new Error('Stripe failed to load')
  }

  const { error } = await stripe.redirectToCheckout({
    sessionId,
  })

  if (error) {
    console.error('Stripe checkout error:', error)
    throw error
  }
}

/**
 * Create checkout session via backend API
 *
 * @param params - Checkout parameters
 * @returns Session ID for Stripe Checkout
 */
export const createCheckoutSession = async (
  params: CheckoutSessionParams
): Promise<string> => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'

  const response = await fetch(`${apiUrl}/api/checkout/create-session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to create checkout session')
  }

  const data = await response.json()
  return data.sessionId
}

/**
 * Format currency for display
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount / 100) // Stripe uses cents
}
