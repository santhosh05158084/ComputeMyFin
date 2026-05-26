'use client'
import { useState, useMemo } from 'react'
import { SelectInput, SliderInput, StatCard, SectionHead, ContentInsert, DetailTable, FAQ, RelatedCalcs, RecommendationBox } from '../components/shared'
import { computeIncomeTax, inr, inrCompact } from '../lib/utils'
import { CONFIG } from '../lib/config'

// ══════════════════════════════════════════════
// PROFESSIONAL TAX
// ══════════════════════════════════════════════
export default function ProfessionalTax({ related }) {
  const states = Object.keys(CONFIG.PROFESSIONAL_TAX)
  const [state, setState]   = useState('Maharashtra')
  const [salary, setSalary] = useState(50000)

  const result = useMemo(() => {
    const slabs = CONFIG.PROFESSIONAL_TAX[state] || CONFIG.PROFESSIONAL_TAX['Others']
    let monthlyPT = 0
    for (const slab of slabs) {
      if (salary <= slab.to) { monthlyPT = slab.tax; break }
    }
    const annualPT = state === 'Maharashtra'
      ? monthlyPT * 11 + 300  // Maharashtra: Feb month is ₹300, rest ₹200
      : monthlyPT * 12
    return { monthlyPT, annualPT }
  }, [state, salary])

  const faq = [
    { q: 'Is professional tax the same across all states?', a: 'No. Professional tax is a state subject and varies by state. Some states like Delhi and Haryana do not levy professional tax at all. Maximum PT in any state is capped at ₹2,500/year by the Constitution.' },
    { q: 'Can professional tax be deducted from income tax?', a: 'Yes! Professional tax paid is fully deductible under Section 16(iii) of the Income Tax Act. It reduces your gross salary before computing income tax.' },
    { q: 'Who is responsible for paying professional tax?', a: 'For salaried employees, the employer deducts it monthly and pays to the state government. Self-employed individuals must register and pay it themselves.' },
  ]

  return (
    <div>
      <SectionHead title="Your Details" />
      <div className="card p-5 mb-5">
        <SelectInput label="State" value={state} onChange={setState}
          options={states.map(s => ({ value: s, label: s }))} />
        <SliderInput label="Monthly Gross Salary" value={salary} min={5000} max={200000} step={1000}
          onChange={setSalary} format={v => `₹${v.toLocaleString('en-IN')}`} />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <StatCard label="Monthly PT"  value={inr(result.monthlyPT)}  sub={state} color="amber" large />
        <StatCard label="Annual PT"   value={inr(result.annualPT)}   sub="Tax deductible from income" color="amber" large />
      </div>

      <ContentInsert icon="💡" title="Professional tax reduces your taxable income"
        body={`Your annual PT of ${inr(result.annualPT)} is deducted from gross salary under Sec 16(iii), saving you income tax on that amount.`} />

      <RelatedCalcs items={related} />
      <FAQ items={faq} />
    </div>
  )
}
