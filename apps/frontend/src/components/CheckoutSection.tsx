import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, Lock, CreditCard, Check, ArrowLeft, Truck, Mail, User, MapPin } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { QuoteOutput } from '@/lib/quote-schema'
import { formatPrice } from '@/lib/quote-calculator'

interface CheckoutSectionProps {
  quote: QuoteOutput
  onBack: () => void
}

export default function CheckoutSection({ quote, onBack }: CheckoutSectionProps) {
  const [step, setStep] = useState<'contact' | 'payment'>('contact')
  const [isProcessing, setIsProcessing] = useState(false)

  const [contactInfo, setContactInfo] = useState({
    email: '',
    name: '',
    phone: '',
    company: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'United States',
  })

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep('payment')
  }

  const handlePayment = async () => {
    setIsProcessing(true)
    // TODO: Integrate with Stripe Checkout
    setTimeout(() => {
      setIsProcessing(false)
      console.log('Payment processed')
    }, 2000)
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-blue-50/30 to-orange-50/20 min-h-screen">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <Button
            onClick={onBack}
            variant="outline"
            className="mb-6 border-2 hover:border-blue-400 hover:bg-blue-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Quote
          </Button>

          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent mb-4">
            Secure Checkout
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Complete your order securely with our encrypted checkout process
          </p>

          {/* Trust Badges */}
          <div className="flex items-center justify-center gap-4 mt-6 flex-wrap">
            <Badge variant="outline" className="px-4 py-2 bg-white">
              <Shield className="h-4 w-4 mr-2 text-green-600" />
              SSL Secured
            </Badge>
            <Badge variant="outline" className="px-4 py-2 bg-white">
              <Lock className="h-4 w-4 mr-2 text-blue-600" />
              256-bit Encryption
            </Badge>
            <Badge variant="outline" className="px-4 py-2 bg-white">
              <CreditCard className="h-4 w-4 mr-2 text-purple-600" />
              PCI Compliant
            </Badge>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Checkout Form - 2/3 width */}
          <div className="lg:col-span-2">
            {/* Progress Steps */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
                      step === 'contact'
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 ring-4 ring-blue-100'
                        : 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30'
                    }`}
                  >
                    {step === 'payment' ? <Check className="h-5 w-5" /> : <User className="h-5 w-5" />}
                  </div>
                  <span className="text-sm font-medium text-gray-700">Contact Info</span>
                </div>

                <div className="h-[2px] flex-1 bg-gray-200 relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: step === 'payment' ? 1 : 0 }}
                    transition={{ duration: 0.4 }}
                    style={{ transformOrigin: 'left' }}
                  />
                </div>

                <div className="flex items-center gap-3 flex-1">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
                      step === 'payment'
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 ring-4 ring-blue-100'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Payment</span>
                </div>
              </div>
            </motion.div>

            {/* Contact Information Form */}
            {step === 'contact' && (
              <motion.div
                key="contact"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-2 border-blue-100 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                        <Mail className="h-5 w-5" />
                      </div>
                      Contact Information
                    </CardTitle>
                    <CardDescription>We'll use this to send you order updates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleContactSubmit} className="space-y-6">
                      {/* Email */}
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          placeholder="you@company.com"
                          value={contactInfo.email}
                          onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                          className="border-2 focus:border-blue-400"
                        />
                      </div>

                      {/* Name & Phone */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            type="text"
                            required
                            placeholder="John Doe"
                            value={contactInfo.name}
                            onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                            className="border-2 focus:border-blue-400"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+1 (555) 000-0000"
                            value={contactInfo.phone}
                            onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                            className="border-2 focus:border-blue-400"
                          />
                        </div>
                      </div>

                      {/* Company */}
                      <div>
                        <Label htmlFor="company">Company Name (Optional)</Label>
                        <Input
                          id="company"
                          type="text"
                          placeholder="Your Company Inc."
                          value={contactInfo.company}
                          onChange={(e) => setContactInfo({ ...contactInfo, company: e.target.value })}
                          className="border-2 focus:border-blue-400"
                        />
                      </div>

                      {/* Shipping Address */}
                      <div className="space-y-4 pt-4 border-t">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Truck className="h-5 w-5 text-blue-600" />
                          <h3 className="font-semibold">Shipping Address</h3>
                        </div>

                        <div>
                          <Label htmlFor="address">Street Address *</Label>
                          <Input
                            id="address"
                            type="text"
                            required
                            placeholder="123 Main Street"
                            value={contactInfo.address}
                            onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                            className="border-2 focus:border-blue-400"
                          />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="city">City *</Label>
                            <Input
                              id="city"
                              type="text"
                              required
                              placeholder="New York"
                              value={contactInfo.city}
                              onChange={(e) => setContactInfo({ ...contactInfo, city: e.target.value })}
                              className="border-2 focus:border-blue-400"
                            />
                          </div>
                          <div>
                            <Label htmlFor="postalCode">Postal Code *</Label>
                            <Input
                              id="postalCode"
                              type="text"
                              required
                              placeholder="10001"
                              value={contactInfo.postalCode}
                              onChange={(e) =>
                                setContactInfo({ ...contactInfo, postalCode: e.target.value })
                              }
                              className="border-2 focus:border-blue-400"
                            />
                          </div>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
                      >
                        Continue to Payment
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Payment Form */}
            {step === 'payment' && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-2 border-blue-100 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      Payment Information
                    </CardTitle>
                    <CardDescription>
                      Your payment is secured with 256-bit SSL encryption
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Stripe Payment Element would go here */}
                    <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center bg-gray-50">
                      <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">Stripe Payment Form</p>
                      <p className="text-sm text-gray-500">
                        Stripe Checkout integration will be loaded here
                      </p>
                    </div>

                    {/* Payment Logos */}
                    <div className="flex items-center justify-center gap-4 py-4 border-t">
                      <span className="text-sm text-gray-500">We accept:</span>
                      <div className="flex gap-3">
                        {['Visa', 'Mastercard', 'Amex', 'Discover'].map((card) => (
                          <div
                            key={card}
                            className="px-3 py-1 bg-white border rounded text-xs font-medium text-gray-600"
                          >
                            {card}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        type="button"
                        onClick={() => setStep('contact')}
                        variant="outline"
                        size="lg"
                        className="flex-1 border-2"
                      >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Back
                      </Button>
                      <Button
                        type="button"
                        onClick={handlePayment}
                        disabled={isProcessing}
                        size="lg"
                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
                      >
                        {isProcessing ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Lock className="h-5 w-5 mr-2" />
                            Complete Payment
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Order Summary - 1/3 width */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="sticky top-4 shadow-xl border-2 border-blue-100 bg-gradient-to-br from-white to-blue-50/30">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Price Breakdown */}
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-gray-600 p-2 rounded-lg bg-gray-50">
                      <span>Base Price</span>
                      <span className="font-medium">{formatPrice(quote.base_price, quote.currency)}</span>
                    </div>

                    {quote.prep_surcharge > 0 && (
                      <div className="flex justify-between text-gray-600 p-2 rounded-lg bg-gray-50">
                        <span>Prep Surcharge</span>
                        <span className="font-medium">
                          +{formatPrice(quote.prep_surcharge, quote.currency)}
                        </span>
                      </div>
                    )}

                    {quote.rush_surcharge > 0 && (
                      <div className="flex justify-between text-orange-600 p-2 rounded-lg bg-orange-50">
                        <span className="font-medium">Rush Surcharge</span>
                        <span className="font-semibold">
                          +{formatPrice(quote.rush_surcharge, quote.currency)}
                        </span>
                      </div>
                    )}

                    <div className="border-t-2 border-gray-200 pt-3 mt-3"></div>

                    {/* Total */}
                    <div className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-orange-50 border-2 border-blue-100">
                      <span className="font-bold text-lg text-gray-900">Total</span>
                      <span className="font-bold text-3xl bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                        {formatPrice(quote.total_price, quote.currency)}
                      </span>
                    </div>
                  </div>

                  {/* Security Assurance */}
                  <div className="pt-4 border-t space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Shield className="h-4 w-4 text-green-600" />
                      <span>Secure 256-bit SSL encryption</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Lock className="h-4 w-4 text-blue-600" />
                      <span>Your data is safe and protected</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 text-purple-600" />
                      <span>Ships within 5-7 business days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
