import { notFound } from 'next/navigation'
import { getCalc, getRelated } from '../../lib/registry'

const calculatorMap = {
  'income-tax':        () => import('../../calculators/income-tax'),
  'take-home-salary':  () => import('../../calculators/take-home-salary'),
  'old-vs-new-regime': () => import('../../calculators/old-vs-new-regime'),
  'hra-exemption':     () => import('../../calculators/hra-exemption'),
  'capital-gains-tax': () => import('../../calculators/capital-gains-tax'),
  'tds-calculator':    () => import('../../calculators/tds-calculator'),
  'advance-tax':       () => import('../../calculators/advance-tax'),
  'professional-tax':  () => import('../../calculators/professional-tax'),
  'freelancer-tax':    () => import('../../calculators/freelancer-tax'),
  'crypto-tax':        () => import('../../calculators/crypto-tax'),
  'sip-calculator':    () => import('../../calculators/sip'),
  'home-loan-emi':     () => import('../../calculators/home-loan-emi'),
}

export async function generateMetadata({ params }) {
  const calc = getCalc(params.slug)
  if (!calc) return {}
  return {
    title: `${calc.name} FY 2026-27 — ComputeMyFin`,
    description: `Free ${calc.name} — ${calc.desc}. 100% accurate, FY 2026-27 updated. Zero signup required. Your data never leaves your device.`,
  }
}

export default async function CalculatorPage({ params }) {
  const { slug } = params
  const calc = getCalc(slug)
  if (!calc) notFound()

  const loader = calculatorMap[slug]
  if (!loader) {
    return (
      <div>
        <nav className="text-xs text-gray-400 mb-4 flex items-center gap-1.5">
          <a href="/" className="text-brand font-semibold hover:underline">Home</a>
          <span>›</span>
          <span className="text-gray-600 font-medium">{calc.name}</span>
        </nav>
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <p className="text-4xl mb-3">🔧</p>
          <h1 className="text-xl font-bold text-gray-800 mb-2">{calc.name}</h1>
          <p className="text-gray-500 text-sm">Coming soon — being built in the next session!</p>
          <a href="/" className="mt-4 inline-block text-brand font-semibold text-sm hover:underline">← Back to all calculators</a>
        </div>
      </div>
    )
  }

  const mod = await loader()
  const Calculator = mod.default
  const related = getRelated(slug)

  return (
    <div>
      <nav className="text-xs text-gray-400 mb-4 flex items-center gap-1.5">
        <a href="/" className="text-brand font-semibold hover:underline">Home</a>
        <span>›</span>
        <span className="text-gray-600 font-medium">{calc.name}</span>
      </nav>
      <div className="flex items-start justify-between mb-2">
        <h1 className="text-2xl font-extrabold text-gray-900 leading-tight tracking-tight pr-4">
          {calc.name} <span className="text-brand">FY 2026-27</span>
        </h1>
      </div>
      <p className="text-sm text-gray-500 mb-5">{calc.desc} · Accurate · Instant · Your data stays on your device</p>
      <Calculator related={related} />
    </div>
  )
}
