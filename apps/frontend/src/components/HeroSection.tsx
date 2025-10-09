import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Check, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function HeroSection() {
  const { t } = useTranslation()

  const scrollToQuote = () => {
    document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-white via-blue-50 to-purple-50 overflow-hidden">
      {/* Background gradient mesh */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-12 items-center min-h-screen py-16 lg:py-20">

          {/* Left Panel - 60% */}
          <div className="lg:col-span-3 space-y-8 z-10">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight"
            >
              {t('hero.main.title1')}{' '}
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                {t('hero.main.title2')}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl sm:text-2xl text-gray-600 max-w-2xl"
            >
              {t('hero.main.description')}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                size="lg"
                onClick={scrollToQuote}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 group"
              >
                {t('hero.main.ctaPrimary')}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold"
              >
                {t('hero.main.ctaSecondary')}
              </Button>
            </motion.div>

            {/* Reassurance line */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-sm text-gray-500"
            >
              {t('hero.main.reassurance')}
            </motion.p>

            {/* Trust Signals */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                  <Check className="w-3 h-3 text-green-600" />
                </div>
                <span className="text-gray-700 text-sm">{t('hero.main.trust1')}</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                  <Check className="w-3 h-3 text-green-600" />
                </div>
                <span className="text-gray-700 text-sm">{t('hero.main.trust2')}</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                  <Check className="w-3 h-3 text-green-600" />
                </div>
                <span className="text-gray-700 text-sm">{t('hero.main.trust3')}</span>
              </div>
            </motion.div>
          </div>

          {/* Right Panel - 40% */}
          <div className="lg:col-span-2 relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              {/* Placeholder for product showcase */}
              <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl shadow-2xl aspect-square flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10" />

                {/* Color swatches demo */}
                <div className="relative grid grid-cols-3 gap-4 p-8">
                  {['bg-slate-900', 'bg-white', 'bg-red-500', 'bg-blue-600', 'bg-yellow-400', 'bg-green-500'].map((color, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                      className={`w-20 h-20 rounded-lg ${color} shadow-lg ring-2 ring-white hover:scale-110 transition-transform cursor-pointer`}
                    />
                  ))}
                </div>

                {/* Floating badge */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute right-4 top-4 bg-white rounded-xl shadow-xl p-4"
                >
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">1000+</div>
                    <div className="text-xs text-gray-600">{t('hero.main.ralColors')}</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
