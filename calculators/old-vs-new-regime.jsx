'use client'
// ─── OLD VS NEW REGIME ───────────────────────────────────────────
import { useState, useMemo } from 'react'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts'
import { SliderInput, StatCard, SectionHead, ContentInsert, DetailTable, FAQ, RelatedCalcs, RecommendationBox } from '../components/shared'
import { computeIncomeTax, inrCompact, inr } from '../lib/utils'

export default function OldVsNewRegime({ related }) {
  const [income, setIncome]   = useState(1200000)
  const [sec80C, setSec80C]   = useState(150000)
  const [sec80D, setSec80D]   = useState(25000)
  const [nps, setNps]         = useState(50000)
  const [hra, setHra]         = useState(180000)
  const [homeLoan, setHomeLoan]= useState(200000)

  const deductions = { sec80C, sec80DSelf: sec80D, nps, hra, homeLoan }
  const newT = useMemo(() => computeIncomeTax(income, 'new', {}), [income])
  const oldT = useMemo(() => computeIncomeTax(income, 'old', deductions), [income, deductions])

  const saving = oldT.totalTax - newT.totalTax
  const breakEvenDeductions = useMemo(() => {
    // find total deductions where both are equal
    for (let d = 0; d <= 500000; d += 5000) {
      const deds = { sec80C: Math.min(d, 150000), sec80DSelf: Math.min(Math.max(0,d-150000), 25000) }
      const o = computeIncomeTax(income, 'old', deds)
      const n = computeIncomeTax(income, 'new', {})
      if (o.totalTax <= n.totalTax) return d
    }
    return null
  }, [income])

  const rows = [
    { label: 'Standard Deduction',     cols: ['₹75,000', '₹50,000'] },
    { label: 'Taxable Income',          cols: [inr(newT.taxableIncome), inr(oldT.taxableIncome)], bold: true },
    { label: 'Income Tax (base)',       cols: [inr(newT.baseTax), inr(oldT.baseTax)] },
    { label: 'Section 87A Rebate',      cols: [inr(newT.rebate), inr(oldT.rebate)], color: 'text-brand' },
    { label: 'Cess (4%)',               cols: [inr(newT.cess), inr(oldT.cess)] },
    { label: 'Total Tax',               cols: [inr(newT.totalTax), inr(oldT.totalTax)], bold: true },
    { label: 'Effective Tax Rate',      cols: [`${newT.effectiveRate}%`, `${oldT.effectiveRate}%`] },
    { label: 'Monthly Tax',             cols: [inr(newT.monthlyTax), inr(oldT.monthlyTax)] },
  ]

  const faq = [
    { q: 'What deductions are NOT allowed in the new regime?',
      a: 'Section 80C, 80D, 80E, HRA exemption, LTA, home loan interest (Sec 24B), 80G donations, standard deduction for business — none of these are allowed in the new regime. Only the ₹75,000 standard deduction for salaried applies.' },
    { q: 'At what income level does old regime become better?',
      a: `Generally, if your total eligible deductions exceed ₹${inrCompact(breakEvenDeductions || 375000)}, the old regime gives lower tax for your income of ${inrCompact(income)}. Use this calculator to find your exact breakeven.` },
    { q: 'Is the new regime mandatory from FY 2025-26?',
      a: 'The new regime is the DEFAULT regime from FY 2023-24 onwards. You must explicitly opt out to use the old regime by filing Form 10-IEA (for business income holders) or choosing it while filing ITR.' },
  ]

  return (
    <div>
      <SectionHead title="Your Income" />
      <div className="card p-5 mb-5">
        <SliderInput label="Annual Income" value={income} min={300000} max={10000000} step={50000}
          onChange={setIncome} format={inrCompact} />
      </div>

      <SectionHead title="Old Regime Deductions" />
      <div className="card p-5 mb-5">
        <SliderInput label="Section 80C" value={sec80C} min={0} max={200000} step={5000} onChange={setSec80C} format={inrCompact} hint="Max ₹1.5L" />
        <SliderInput label="Section 80D" value={sec80D} min={0} max={100000} step={5000} onChange={setSec80D} format={inrCompact} />
        <SliderInput label="NPS 80CCD(1B)" value={nps} min={0} max={50000} step={5000} onChange={setNps} format={inrCompact} />
        <SliderInput label="HRA Exemption" value={hra} min={0} max={600000} step={10000} onChange={setHra} format={inrCompact} />
        <SliderInput label="Home Loan Interest" value={homeLoan} min={0} max={200000} step={10000} onChange={setHomeLoan} format={inrCompact} hint="Max ₹2L (Sec 24B)" />
      </div>

      <RecommendationBox
        title={saving >= 0 ? `New Regime saves ₹${Math.abs(saving).toLocaleString('en-IN')} this year` : `Old Regime saves ₹${Math.abs(saving).toLocaleString('en-IN')} this year`}
        body={breakEvenDeductions ? `For your income, old regime wins when total deductions exceed ${inrCompact(breakEvenDeductions)}` : ''}
        type={saving >= 0 ? 'success' : 'warning'}
      />

      <div className="grid grid-cols-2 gap-3 mb-5">
        <StatCard label="Tax — New Regime" value={inr(newT.totalTax)} sub={`${newT.effectiveRate}% effective`} color="green" />
        <StatCard label="Tax — Old Regime" value={inr(oldT.totalTax)} sub={`${oldT.effectiveRate}% effective`} color="amber" />
        <StatCard label="You Save"         value={inrCompact(Math.abs(saving))} sub={saving >= 0 ? 'with new regime' : 'with old regime'} color={saving>=0?'green':'amber'} />
        <StatCard label="Break-even Deductions" value={breakEvenDeductions ? inrCompact(breakEvenDeductions) : 'N/A'} sub="Old regime wins above this" />
      </div>

      <DetailTable title="Side-by-Side Comparison"
        rows={[{ label: '', cols: ['New Regime', 'Old Regime'], bold: true }, ...rows]} />

      <ContentInsert icon="⚖️" title="Confused? Use the Income Tax calculator"
        body="Enter your full details including all deductions in the Income Tax Calculator for a complete picture including surcharge and cess." />

      <RelatedCalcs items={related} />
      <FAQ items={faq} />
    </div>
  )
}
