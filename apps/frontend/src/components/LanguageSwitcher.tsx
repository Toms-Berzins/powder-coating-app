import { useTranslation } from 'react-i18next'
import { Languages } from 'lucide-react'
import { motion } from 'framer-motion'

export function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'lv' : 'en'
    i18n.changeLanguage(newLang)
  }

  const currentLang = i18n.language === 'lv' ? 'LV' : 'EN'
  const nextLang = i18n.language === 'lv' ? 'EN' : 'LV'

  return (
    <motion.button
      onClick={toggleLanguage}
      className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Languages className="h-4 w-4 text-blue-600 group-hover:rotate-12 transition-transform duration-300" />
      <span className="text-sm font-medium text-gray-700">
        {currentLang}
      </span>
      <span className="text-xs text-gray-400">→</span>
      <span className="text-sm font-medium text-blue-600">
        {nextLang}
      </span>
    </motion.button>
  )
}
