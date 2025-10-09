import { useState, useEffect } from 'react'
import HeroSection from './components/HeroSection'
import QuoteSection from './components/QuoteSection'
import CheckoutSection from './components/CheckoutSection'
import type { QuoteOutput } from './lib/quote-schema'

function App() {
  const [view, setView] = useState<'quote' | 'checkout'>('quote')
  const [checkoutQuote, setCheckoutQuote] = useState<QuoteOutput | null>(null)

  useEffect(() => {
    const handleCheckoutNav = (event: Event) => {
      const customEvent = event as CustomEvent<QuoteOutput>
      setCheckoutQuote(customEvent.detail)
      setView('checkout')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    window.addEventListener('navigateToCheckout', handleCheckoutNav)
    return () => window.removeEventListener('navigateToCheckout', handleCheckoutNav)
  }, [])

  const handleBackToQuote = () => {
    setView('quote')
    setCheckoutQuote(null)
    // Scroll to quote section
    setTimeout(() => {
      const quoteSection = document.getElementById('quote')
      quoteSection?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  return (
    <main className="min-h-screen">
      {view === 'quote' && (
        <>
          <HeroSection />
          <QuoteSection />
        </>
      )}
      {view === 'checkout' && checkoutQuote && (
        <CheckoutSection quote={checkoutQuote} onBack={handleBackToQuote} />
      )}
    </main>
  )
}

export default App
