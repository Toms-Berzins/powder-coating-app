import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Ruler, Package, Palette, Clock, Check, ArrowRight, ArrowLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Badge } from '@/components/ui/badge'
import {
  quoteSchema,
  defaultQuoteValues,
  materialInfo,
  prepLevelInfo,
  type QuoteInput,
  type QuoteOutput,
} from '@/lib/quote-schema'
import { calculateQuote } from '@/lib/quote-calculator'
import QuotePriceDisplay from './QuotePriceDisplay'

export default function QuoteForm() {
  const { t } = useTranslation()
  const [quote, setQuote] = useState<QuoteOutput | null>(null)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [currentStep, setCurrentStep] = useState(1)

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<QuoteInput>({
    resolver: zodResolver(quoteSchema),
    defaultValues: defaultQuoteValues,
    mode: 'onChange',
  })

  // Watch specific form fields for live calculation
  const length_mm = watch('length_mm')
  const width_mm = watch('width_mm')
  const height_mm = watch('height_mm')
  const material = watch('material')
  const prep_level = watch('prep_level')
  const color = watch('color')
  const turnaround_days = watch('turnaround_days')
  const quantity = watch('quantity')
  const is_rush = watch('is_rush')

  // Calculate quote in real-time and track completed steps
  useEffect(() => {
    try {
      const formData = {
        length_mm,
        width_mm,
        height_mm,
        material,
        prep_level,
        color,
        turnaround_days,
        quantity,
        is_rush,
      }
      const result = quoteSchema.safeParse(formData)
      if (result.success) {
        const calculatedQuote = calculateQuote(result.data)
        setQuote(calculatedQuote)

        // Track completed steps
        const newCompleted = new Set<number>()
        if (length_mm && width_mm && height_mm) newCompleted.add(1)
        if (material) newCompleted.add(2)
        if (prep_level) newCompleted.add(3)
        if (color && turnaround_days && quantity) newCompleted.add(4)
        setCompletedSteps(newCompleted)
      }
    } catch (error) {
      console.error('Quote calculation error:', error)
    }
  }, [length_mm, width_mm, height_mm, material, prep_level, color, turnaround_days, quantity, is_rush])

  const onSubmit = (data: QuoteInput) => {
    console.log('Quote submitted:', data, quote)
    if (quote) {
      // Trigger checkout flow
      const event = new CustomEvent('navigateToCheckout', { detail: quote })
      window.dispatchEvent(event)
    }
  }

  const steps = [
    { id: 1, name: t('quote.form.steps.dimensions'), icon: Ruler },
    { id: 2, name: t('quote.form.steps.material'), icon: Package },
    { id: 3, name: t('quote.form.steps.prep'), icon: Palette },
    { id: 4, name: t('quote.form.steps.details'), icon: Clock },
  ]

  // Step validation logic
  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(length_mm && width_mm && height_mm &&
                  !errors.length_mm && !errors.width_mm && !errors.height_mm)
      case 2:
        return !!material
      case 3:
        return !!prep_level
      case 4:
        return !!(color && turnaround_days && quantity &&
                  !errors.color && !errors.turnaround_days && !errors.quantity)
      default:
        return false
    }
  }

  // Navigation handlers
  const goToNextStep = () => {
    if (currentStep < 4 && isStepValid(currentStep)) {
      setCurrentStep(currentStep + 1)
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const goToStep = (step: number) => {
    // Allow going back to any step, or forward if all previous steps are valid
    if (step < currentStep) {
      setCurrentStep(step)
    } else if (step === currentStep + 1 && isStepValid(currentStep)) {
      setCurrentStep(step)
    } else if (step <= currentStep) {
      setCurrentStep(step)
    }
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Form Section - 2/3 width */}
      <div className="lg:col-span-2 space-y-6">
        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
        >
          <div className="flex items-center justify-between gap-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <motion.div
                  className="flex items-center gap-2 flex-1"
                  initial={false}
                  animate={{
                    opacity: step.id <= currentStep ? 1 : 0.4,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <button
                    type="button"
                    onClick={() => goToStep(step.id)}
                    disabled={step.id > currentStep && !completedSteps.has(step.id - 1)}
                    className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
                      completedSteps.has(step.id)
                        ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30 cursor-pointer hover:scale-110'
                        : step.id === currentStep
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 ring-4 ring-blue-100'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    } disabled:cursor-not-allowed`}
                  >
                    <AnimatePresence mode="wait">
                      {completedSteps.has(step.id) ? (
                        <motion.div
                          key="check"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 180 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Check className="h-5 w-5" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="icon"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <step.icon className="h-5 w-5" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                  <span className="hidden sm:inline text-xs font-medium text-gray-700">
                    {step.name}
                  </span>
                </motion.div>
                {index < steps.length - 1 && (
                  <div className="h-[2px] flex-1 mx-2 bg-gray-200 relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600"
                      initial={{ scaleX: 0 }}
                      animate={{
                        scaleX: completedSteps.has(step.id) && completedSteps.has(step.id + 1) ? 1 : 0,
                      }}
                      transition={{ duration: 0.4 }}
                      style={{ transformOrigin: 'left' }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <AnimatePresence mode="wait">
            {/* Step 1: Dimensions */}
            {currentStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-2 hover:border-blue-200 transition-all duration-300 hover:shadow-lg group">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                    <Ruler className="h-5 w-5" />
                  </div>
                  {t('quote.form.step1.title')}
                  {completedSteps.has(1) && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto"
                    >
                      <Check className="h-5 w-5 text-green-500" />
                    </motion.div>
                  )}
                </CardTitle>
                <CardDescription>{t('quote.form.step1.description')}</CardDescription>
              </CardHeader>
            <CardContent className="grid sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="length_mm">{t('quote.form.step1.length')}</Label>
                <Input
                  id="length_mm"
                  type="number"
                  placeholder={t('quote.form.step1.lengthPlaceholder')}
                  {...register('length_mm', { valueAsNumber: true })}
                  className={errors.length_mm ? 'border-red-500' : ''}
                />
                {errors.length_mm && (
                  <p className="text-xs text-red-600 mt-1">{errors.length_mm.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="width_mm">{t('quote.form.step1.width')}</Label>
                <Input
                  id="width_mm"
                  type="number"
                  placeholder={t('quote.form.step1.widthPlaceholder')}
                  {...register('width_mm', { valueAsNumber: true })}
                  className={errors.width_mm ? 'border-red-500' : ''}
                />
                {errors.width_mm && (
                  <p className="text-xs text-red-600 mt-1">{errors.width_mm.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="height_mm">{t('quote.form.step1.height')}</Label>
                <Input
                  id="height_mm"
                  type="number"
                  placeholder={t('quote.form.step1.heightPlaceholder')}
                  {...register('height_mm', { valueAsNumber: true })}
                  className={errors.height_mm ? 'border-red-500' : ''}
                />
                {errors.height_mm && (
                  <p className="text-xs text-red-600 mt-1">{errors.height_mm.message}</p>
                )}
              </div>
            </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 2: Material Selection */}
            {currentStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-2 hover:border-blue-200 transition-all duration-300 hover:shadow-lg group">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                    <Package className="h-5 w-5" />
                  </div>
                  {t('quote.form.step2.title')}
                  {completedSteps.has(2) && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto"
                    >
                      <Check className="h-5 w-5 text-green-500" />
                    </motion.div>
                  )}
                </CardTitle>
                <CardDescription>{t('quote.form.step2.description')}</CardDescription>
              </CardHeader>
            <CardContent>
              <RadioGroup
                value={material}
                onValueChange={(value) => setValue('material', value as any)}
              >
                {Object.entries(materialInfo).map(([key, info]) => (
                  <RadioGroupItem key={key} value={key}>
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-2xl">{info.icon}</span>
                      <div className="flex-1">
                        <div className="font-semibold">{info.label}</div>
                        <div className="text-sm text-gray-500">{info.description}</div>
                      </div>
                    </div>
                  </RadioGroupItem>
                ))}
              </RadioGroup>
            </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 3: Surface Prep */}
            {currentStep === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-2 hover:border-blue-200 transition-all duration-300 hover:shadow-lg group">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                    <Palette className="h-5 w-5" />
                  </div>
                  {t('quote.form.step3.title')}
                  {completedSteps.has(3) && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto"
                    >
                      <Check className="h-5 w-5 text-green-500" />
                    </motion.div>
                  )}
                </CardTitle>
                <CardDescription>{t('quote.form.step3.description')}</CardDescription>
              </CardHeader>
            <CardContent>
              <RadioGroup
                value={prep_level}
                onValueChange={(value) => setValue('prep_level', value as any)}
              >
                {Object.entries(prepLevelInfo).map(([key, info]) => (
                  <RadioGroupItem key={key} value={key}>
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-2xl">{info.icon}</span>
                      <div className="flex-1">
                        <div className="font-semibold">{info.label}</div>
                        <div className="text-sm text-gray-500">{info.description}</div>
                      </div>
                    </div>
                  </RadioGroupItem>
                ))}
              </RadioGroup>
            </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 4: Color & Details */}
            {currentStep === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-2 hover:border-blue-200 transition-all duration-300 hover:shadow-lg group">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                    <Clock className="h-5 w-5" />
                  </div>
                  {t('quote.form.step4.title')}
                  {completedSteps.has(4) && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto"
                    >
                      <Check className="h-5 w-5 text-green-500" />
                    </motion.div>
                  )}
                </CardTitle>
                <CardDescription>{t('quote.form.step4.description')}</CardDescription>
              </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="color">{t('quote.form.step4.color')}</Label>
                <Input
                  id="color"
                  type="text"
                  placeholder={t('quote.form.step4.colorPlaceholder')}
                  {...register('color')}
                  className={errors.color ? 'border-red-500' : ''}
                />
                {errors.color && <p className="text-xs text-red-600 mt-1">{errors.color.message}</p>}
              </div>
              <div>
                <Label htmlFor="quantity">{t('quote.form.step4.quantity')}</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder={t('quote.form.step4.quantityPlaceholder')}
                  {...register('quantity', { valueAsNumber: true })}
                  className={errors.quantity ? 'border-red-500' : ''}
                />
                {errors.quantity && (
                  <p className="text-xs text-red-600 mt-1">{errors.quantity.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="turnaround_days">{t('quote.form.step4.turnaround')}</Label>
                <Input
                  id="turnaround_days"
                  type="number"
                  placeholder={t('quote.form.step4.turnaroundPlaceholder')}
                  {...register('turnaround_days', { valueAsNumber: true })}
                  className={errors.turnaround_days ? 'border-red-500' : ''}
                />
                {errors.turnaround_days && (
                  <p className="text-xs text-red-600 mt-1">{errors.turnaround_days.message}</p>
                )}
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('is_rush')}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                  />
                  <span className="text-sm font-medium">Rush Order</span>
                  <Badge variant="warning" className="ml-1">
                    +50%
                  </Badge>
                </label>
              </div>
            </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex gap-4"
          >
            {currentStep > 1 && (
              <Button
                type="button"
                onClick={goToPreviousStep}
                variant="outline"
                size="lg"
                className="flex-1 border-2 hover:border-blue-400 hover:bg-blue-50"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                {t('quote.form.buttons.previous')}
              </Button>
            )}

            {currentStep < 4 ? (
              <Button
                type="button"
                onClick={goToNextStep}
                disabled={!isStepValid(currentStep)}
                size="lg"
                className={`flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 ${
                  !isStepValid(currentStep) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {t('quote.form.buttons.next')}
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={!isStepValid(currentStep)}
                size="lg"
                className={`flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 ${
                  !isStepValid(currentStep) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {t('quote.price.continueToCheckout')}
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            )}
          </motion.div>
        </form>
      </div>

      {/* Price Display - 1/3 width */}
      <div className="lg:col-span-1">
        <QuotePriceDisplay quote={quote} />
      </div>
    </div>
  )
}
