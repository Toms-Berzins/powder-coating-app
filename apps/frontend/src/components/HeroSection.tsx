import { motion, useScroll, useTransform } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Check, ArrowRight, Shield, Zap, Award, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function HeroSection() {
  const { t } = useTranslation()
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 150])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  const scrollToQuote = () => {
    document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/40 overflow-hidden">
      {/* Enhanced background with depth and layers */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient mesh layer 1 - Main blobs */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 -left-20 w-[500px] h-[500px] bg-gradient-to-br from-purple-400 to-purple-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
          <div className="absolute top-0 -right-20 w-[500px] h-[500px] bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob" style={{ animationDelay: '2s' }} />
          <div className="absolute -bottom-20 left-1/3 w-[500px] h-[500px] bg-gradient-to-br from-pink-400 to-rose-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob" style={{ animationDelay: '4s' }} />
        </div>

        {/* Gradient mesh layer 2 - Accent blobs */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-br from-orange-300 to-yellow-400 rounded-full mix-blend-multiply filter blur-2xl animate-blob" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-gradient-to-br from-teal-300 to-green-400 rounded-full mix-blend-multiply filter blur-2xl animate-blob" style={{ animationDelay: '3s' }} />
        </div>

        {/* Grid pattern overlay for depth */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-12 items-center min-h-screen py-16 lg:py-20">

          {/* Left Panel - 60% */}
          <motion.div
            className="lg:col-span-3 space-y-8 z-10"
            style={{ y, opacity }}
          >
            {/* Floating badge with pulse animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md border border-blue-200/50 rounded-full shadow-lg"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 bg-green-500 rounded-full"
              />
              <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t('hero.badge')}
              </span>
              <Zap className="w-4 h-4 text-yellow-500" />
            </motion.div>

            {/* Enhanced title with staggered animation */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-[1.1] tracking-tight"
            >
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="block"
              >
                {t('hero.main.title1')}
              </motion.span>
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent relative"
              >
                {t('hero.main.title2')}
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                  animate={{ x: ['-200%', '200%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                />
              </motion.span>
            </motion.h1>

            {/* Subtitle with better typography */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-xl sm:text-2xl text-gray-600 max-w-2xl leading-relaxed"
            >
              {t('hero.main.description')}
            </motion.p>

            {/* Enhanced CTAs with modern button design */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  size="lg"
                  onClick={scrollToQuote}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    {t('hero.main.ctaPrimary')}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                  {/* Animated gradient overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                  />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 hover:border-blue-700 font-semibold transition-all duration-300 backdrop-blur-sm bg-white/50"
                >
                  {t('hero.main.ctaSecondary')}
                </Button>
              </motion.div>
            </motion.div>

            {/* Reassurance line with icon */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="flex items-center gap-2 text-sm text-gray-500"
            >
              <Shield className="w-4 h-4 text-green-600" />
              <p>{t('hero.main.reassurance')}</p>
            </motion.div>

            {/* Enhanced trust signals with icons and modern design */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4"
            >
              {[
                { icon: Check, text: t('hero.main.trust1'), color: 'green' },
                { icon: Award, text: t('hero.main.trust2'), color: 'blue' },
                { icon: Star, text: t('hero.main.trust3'), color: 'purple' },
              ].map((item, index) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="flex items-start gap-3 p-3 rounded-xl bg-white/50 backdrop-blur-sm border border-gray-200/50 hover:border-gray-300/50 hover:shadow-md transition-all duration-300 cursor-default"
                  >
                    <div className={`flex-shrink-0 w-8 h-8 rounded-lg bg-${item.color}-100 flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 text-${item.color}-600`} />
                    </div>
                    <span className="text-gray-700 text-sm font-medium leading-relaxed">{item.text}</span>
                  </motion.div>
                )
              })}
            </motion.div>
          </motion.div>

          {/* Right Panel - 40% with enhanced visual showcase */}
          <div className="lg:col-span-2 relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              {/* Enhanced product showcase with depth */}
              <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl shadow-2xl aspect-square flex items-center justify-center overflow-hidden border border-white/20">
                {/* Gradient overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10" />

                {/* Animated glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-3xl"
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(59, 130, 246, 0.3)',
                      '0 0 60px rgba(168, 85, 247, 0.4)',
                      '0 0 20px rgba(59, 130, 246, 0.3)',
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* Color swatches grid with enhanced animations */}
                <div className="relative grid grid-cols-3 gap-4 p-8">
                  {[
                    { color: 'bg-slate-900', label: 'RAL 9005' },
                    { color: 'bg-white', label: 'RAL 9016' },
                    { color: 'bg-red-500', label: 'RAL 3020' },
                    { color: 'bg-blue-600', label: 'RAL 5015' },
                    { color: 'bg-yellow-400', label: 'RAL 1021' },
                    { color: 'bg-green-500', label: 'RAL 6018' },
                  ].map((swatch, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0, rotate: -180 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      transition={{
                        duration: 0.6,
                        delay: 0.5 + i * 0.1,
                        type: 'spring',
                        stiffness: 200,
                        damping: 15,
                      }}
                      whileHover={{ scale: 1.15, rotate: 5, zIndex: 10 }}
                      className="group relative"
                    >
                      <div
                        className={`w-20 h-20 rounded-xl ${swatch.color} shadow-lg ring-2 ring-white transition-all duration-300 cursor-pointer group-hover:shadow-2xl`}
                      />
                      {/* Tooltip on hover */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileHover={{ opacity: 1, y: 0 }}
                        className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none"
                      >
                        {swatch.label}
                      </motion.div>
                    </motion.div>
                  ))}
                </div>

                {/* Floating stats badge with enhanced design */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute right-4 top-4 bg-white rounded-2xl shadow-2xl p-5 border border-gray-200/50 backdrop-blur-md"
                >
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1, type: 'spring', stiffness: 200 }}
                      className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                    >
                      1000+
                    </motion.div>
                    <div className="text-xs text-gray-600 font-medium mt-1">{t('hero.main.ralColors')}</div>
                  </div>
                </motion.div>

                {/* Quality badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2, type: 'spring' }}
                  className="absolute left-4 bottom-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl shadow-xl p-3 flex items-center gap-2"
                >
                  <Award className="w-5 h-5" />
                  <span className="text-sm font-semibold">Premium Quality</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
