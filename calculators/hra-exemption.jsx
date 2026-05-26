'use client'
import { useState, useMemo } from 'react'
import { SliderInput, StatCard, SectionHead, ContentInsert, DetailTable, FAQ, RelatedCalcs, RecommendationBox } from '../components/shared'
import { calcHRAExemption, inrCompact, inr } from '../lib/utils'

export default function HRAExemption({ related }) {
  const [basic, setBasic]       = useState(600000)
  const [da, setDa]             = useState(0)
  const [hraRecd, setHraRecd]   = useState(300000)
  const [rentPaid, setRentPaid] = useState(240000)
  const [isMetro, setIsMetro]   = useState(true)

  const result = useMemo(() => calcHRAExemption(basic, da, hraRecd, rentPaid, isMetro), [basic, da, hraRecd, rentPaid, isMetro])

  const rows = [
    { label: 'Condition 1 — Actual HRA Received',                     value: inr(result.conditions.actualHRA) },
    { label: `Condition 2 — Rent Paid minus 10% of (Basic + DA)`,     value: inr(result.conditions.rentMinusTen) },
    { label: `Condition 3 — ${isMetro?50:40}% of (Basic + DA)`,       value: inr(result.conditions.pctOfBasic) },
    { label: 'HRA Exemption (Least of 3)',                             value: inr(result.exemption), bold: true, color: 'text-brand' },
    { label: 'Taxable HRA',                                            value: inr(result.taxable), bold: true, color: 'text-red-500' },
  ]

  const faq = [
    { q: 'How is HRA exemption calculated?',
      a: 'HRA exemption is the MINIMUM of: (1) Actual HRA received, (2) Rent paid minus 10% of basic+DA, (3) 50% of basic+DA for metro cities or 40% for non-metro. This is defined under Section 10(13A) of the Income Tax Act.' },
    { q: 'Which cities are considered metro for HRA?',
      a: 'Only 4 cities are "metro" for HRA purposes under the IT Act: Mumbai, Delhi, Kolkata, and Chennai. All other cities — including Bengaluru, Hyderabad, Pune, Ahmedabad — are non-metro (40% of basic).' },
    { q: 'Can I claim HRA if I pay rent to parents?',
      a: 'Yes, you can pay rent to parents and claim HRA exemption. However, your parents must declare that rental income in their ITR. The arrangement must be genuine with a rent agreement and bank transfer proof.' },
    { q: 'Is HRA available in the new tax regime?',
      a: 'No. HRA exemption is NOT available under the new regime. You get a flat ₹75,000 standard deduction instead. If your HRA exemption exceeds ₹75K, the old regime may be beneficial.' },
    { q: 'What if I don\'t get HRA in salary?',
      a: 'If you pay rent but don\'t receive HRA, you can claim deduction under Section 80GG — up to ₹5,000/month or 25% of total income or rent paid minus 10% of income, whichever is lower.' },
  ]

  return (
    <div>
      <div className="bg-brand-light border border-brand/20 border-l-4 border-l-brand rounded-xl p-3.5 mb-5 text-sm text-brand-dark">
        <strong>How it works:</strong> HRA exemption = Minimum of 3 conditions defined in Sec 10(13A). Only applicable in Old Tax Regime.
      </div>

      <SectionHead title="Salary Components" />
      <div className="card p-5 mb-5">
        <SliderInput label="Basic Salary (Annual)" value={basic} min={120000} max={5000000} step={12000}
          onChange={setBasic} format={inrCompact} />
        <SliderInput label="Dearness Allowance (DA)" value={da} min={0} max={1000000} step={12000}
          onChange={setDa} format={inrCompact} hint="Mostly 0 for private sector" />
        <SliderInput label="HRA Received (Annual)" value={hraRecd} min={0} max={2000000} step={12000}
          onChange={setHraRecd} format={inrCompact} />
        <SliderInput label="Rent Paid (Annual)" value={rentPaid} min={0} max={2000000} step={12000}
          onChange={setRentPaid} format={inrCompact} />
      </div>

      <SectionHead title="City Type" />
      <div className="flex gap-2 mb-5">
        {[['true','Metro (Mumbai/Delhi/Kolkata/Chennai)'],['false','Non-Metro (All Other Cities)']].map(([v,l]) => (
          <button key={v} onClick={() => setIsMetro(v==='true')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-colors text-center ${String(isMetro)===v?'bg-brand text-white border-brand':'bg-white border-gray-200 text-gray-600'}`}>
            {l}
          </button>
        ))}
      </div>

      <RecommendationBox
        title={`HRA Exemption: ${inr(result.exemption)} per year`}
        body={`Taxable HRA: ${inr(result.taxable)} — this gets added to your income`}
        type={result.taxable === 0 ? 'success' : 'info'}
      />

      <div className="grid grid-cols-2 gap-3 mb-5">
        <StatCard label="HRA Exemption"  value={inr(result.exemption)}              sub="Tax-free amount"    color="green" />
        <StatCard label="Taxable HRA"    value={inr(result.taxable)}                sub="Added to income"   color={result.taxable>0?'red':'default'} />
        <StatCard label="Monthly Exempt" value={inr(Math.round(result.exemption/12))} sub="Per month"        color="green" />
        <StatCard label="% Exempt"       value={hraRecd>0?`${Math.round(result.exemption/hraRecd*100)}%`:'0%'} sub="Of HRA received" />
      </div>

      <DetailTable title="3-Condition Check (Least of these 3 is exempt)" rows={rows} />

      <ContentInsert icon="🏠" title="Paying high rent? Metro cities allow 50% of basic"
        body="In Mumbai, Delhi, Kolkata, Chennai — 50% of your basic salary is considered for HRA. In Bengaluru, Hyderabad, Pune — it's only 40%. Many employees lose exemption by not knowing this." />

      <RelatedCalcs items={related} />
      <FAQ items={faq} />
    </div>
  )
}
