import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { QuoteOutput } from '@/lib/quote-schema'
import { formatPrice } from '@/lib/quote-calculator'
import { TrendingUp, Zap, ShieldCheck } from 'lucide-react'

interface QuotePriceDisplayProps {
  quote: QuoteOutput | null
  isCalculating?: boolean
}

export default function QuotePriceDisplay({ quote, isCalculating }: QuotePriceDisplayProps) {
  const { t } = useTranslation()
  if (!quote && !isCalculating) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="sticky top-4 border-2 border-dashed border-gray-200 bg-gray-50/50">
          <CardContent className="py-12 text-center">
            <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-blue-100 to-orange-100 flex items-center justify-center">
              <Zap className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-700 mb-2">{t('quote.price.emptyTitle')}</h3>
            <p className="text-sm text-gray-500">
              {t('quote.price.emptyDescription')}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="sticky top-4 shadow-xl border-2 border-blue-100 bg-gradient-to-br from-white to-blue-50/30 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-orange-500/5 pointer-events-none" />

        <CardHeader className="pb-4 relative">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold">{t('quote.price.title')}</CardTitle>
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            >
              <Badge variant="success" className="shadow-lg shadow-green-500/20">
                <motion.span
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"
                />
                {t('quote.price.trustBadges.live')}
              </Badge>
            </motion.div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 relative">
          {isCalculating ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : quote ? (
            <>
              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-center p-2 rounded-lg bg-blue-50/50"
                >
                  <Zap className="h-4 w-4 text-blue-600 mx-auto mb-1" />
                  <p className="text-xs font-medium text-gray-700">{t('quote.price.trustBadges.instant')}</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center p-2 rounded-lg bg-green-50/50"
                >
                  <ShieldCheck className="h-4 w-4 text-green-600 mx-auto mb-1" />
                  <p className="text-xs font-medium text-gray-700">{t('quote.price.trustBadges.accurate')}</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-center p-2 rounded-lg bg-orange-50/50"
                >
                  <TrendingUp className="h-4 w-4 text-orange-600 mx-auto mb-1" />
                  <p className="text-xs font-medium text-gray-700">{t('quote.price.trustBadges.live')}</p>
                </motion.div>
              </div>

              {/* Price Breakdown */}
              <AnimatePresence mode="wait">
                <motion.div
                  key="breakdown"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3 text-sm"
                >
                  <motion.div
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex justify-between text-gray-600 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span>{t('quote.price.basePrice')}</span>
                    <span className="font-medium">{formatPrice(quote.base_price, quote.currency)}</span>
                  </motion.div>

                  {quote.prep_surcharge > 0 && (
                    <motion.div
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="flex justify-between text-gray-600 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <span>{t('quote.price.prepSurcharge')}</span>
                      <span className="font-medium">+{formatPrice(quote.prep_surcharge, quote.currency)}</span>
                    </motion.div>
                  )}

                  {quote.rush_surcharge > 0 && (
                    <motion.div
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="flex justify-between text-orange-600 p-2 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors"
                    >
                      <span className="font-medium">{t('quote.price.rushSurcharge')}</span>
                      <span className="font-semibold">+{formatPrice(quote.rush_surcharge, quote.currency)}</span>
                    </motion.div>
                  )}

                  <div className="border-t-2 border-gray-200 pt-3 mt-3"></div>

                  {/* Total */}
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-orange-50 border-2 border-blue-100"
                  >
                    <span className="font-bold text-lg text-gray-900">{t('quote.price.total')}</span>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={quote.total_price}
                        initial={{ scale: 1.2, y: -5 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{
                          type: 'spring',
                          stiffness: 300,
                          damping: 20,
                        }}
                        className="font-bold text-3xl bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent"
                      >
                        {formatPrice(quote.total_price, quote.currency)}
                      </motion.span>
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              {/* Disclaimer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xs text-gray-500 pt-3 mt-3 border-t border-gray-200 flex items-start gap-2"
              >
                <ShieldCheck className="h-3 w-3 mt-0.5 flex-shrink-0 text-gray-400" />
                <p>
                  Final price may vary based on actual part complexity. This is an instant
                  estimate powered by our pricing engine.
                </p>
              </motion.div>
            </>
          ) : null}
        </CardContent>
      </Card>
    </motion.div>
  )
}
