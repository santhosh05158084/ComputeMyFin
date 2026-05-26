'use client'
import { useState, useMemo } from 'react'
import { computeIncomeTax, inrCompact, inr } from '../lib/utils'
import {
  SliderInput, SelectInput, StatCard, SectionHead,
  CalcToolbar, ContentInsert, ContentInsertWide, RecommendationBox,
  DetailTable, FAQ, RelatedCalcs, Tabs
} from '../components/shared'

// Simple clean bar — no external chart lib needed for this
function SimpleCompareBar({ newTax, oldTax, income }) {
  const max = Math.max(newTax, oldTax, 1)
  const newPct = Math.round((newTax / max) * 100)
  const oldPct = Math.round((oldTax / max) * 100)
  return (
    <div className="card p-5 mb-5">
      <p className="text-sm font-bold text-gray-800 mb-4">Your Tax — New vs Old Regime</p>
      {/* New Regime Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-semibold text-gray-500">New Regime</span>
          <span className="text-sm font-bold text-brand">{inr(newTax)}</span>
        </div>
        <div className="h-7 bg-gray-100 rounded-lg overflow-hidden">
          <div className="h-full bg-brand rounded-lg flex items-center justify-end pr-2 transition-all duration-500"
            style={{ width: `${Math.max(newPct, newTax === 0 ? 0 : 8)}%` }}>
            {newTax > 0 && <span className="text-xs font-bold text-white">{inrCompact(newTax)}</span>}
          </div>
          {newTax === 0 && <span className="text-xs font-bold text-brand ml-2 absolute" style={{marginTop:'-1.5rem'}}>₹0 — Zero Tax ✓</span>}
        </div>
        {newTax === 0 && <p className="text-xs text-brand font-semibold mt-1">✓ Zero tax — 87A rebate applies</p>}
      </div>
      {/* Old Regime Bar */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-semibold text-gray-500">Old Regime</span>
          <span className="text-sm font-bold text-amber-600">{inr(oldTax)}</span>
        </div>
        <div className="h-7 bg-gray-100 rounded-lg overflow-hidden">
          <div className="h-full bg-amber-400 rounded-lg flex items-center justify-end pr-2 transition-all duration-500"
            style={{ width: `${Math.max(oldPct, oldTax === 0 ? 0 : 8)}%` }}>
            {oldTax > 0 && <span className="text-xs font-bold text-white">{inrCompact(oldTax)}</span>}
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-3 text-center">For your annual income of {inrCompact(income)}</p>
    </div>
  )
}

export default function IncomeTaxCalculator({ related }) {
  const [income, setIncome]     = useState(1200000)
  const [sec80C, setSec80C]     = useState(150000)
  const [sec80D, setSec80D]     = useState(25000)
  const [nps, setNps]           = useState(50000)
  const [hra, setHra]           = useState(180000)
  const [homeLoan, setHomeLoan] = useState(0)
  const [age, setAge]           = useState('normal')

  const deductions = { sec80C, sec80DSelf: sec80D, nps, hra, homeLoan }

  const newTax = useMemo(() => computeIncomeTax(income, 'new', {}, age), [income, age])
  const oldTax = useMemo(() => computeIncomeTax(income, 'old', deductions, age), [income, JSON.stringify(deductions), age])

  const saving = oldTax.totalTax - newTax.totalTax

  const tableRows = [
    { label: 'Gross Income',       cols: [inr(income), inr(income)] },
    { label: 'Standard Deduction', cols: ['₹75,000', '₹50,000'] },
    { label: 'Other Deductions',   cols: ['₹0', inrCompact(income - oldTax.taxableIncome - 50000)] },
    { label: 'Taxable Income',     cols: [inr(newTax.taxableIncome), inr(oldTax.taxableIncome)], bold: true },
    { label: 'Income Tax',         cols: [inr(newTax.baseTax), inr(oldTax.baseTax)] },
    { label: 'Rebate u/s 87A',     cols: [inr(newTax.rebate), inr(oldTax.rebate)], color: 'text-brand' },
    { label: 'Surcharge',          cols: [inr(newTax.surcharge), inr(oldTax.surcharge)] },
    { label: 'Cess (4%)',          cols: [inr(newTax.cess), inr(oldTax.cess)] },
    { label: 'Total Tax',          cols: [inr(newTax.totalTax), inr(oldTax.totalTax)], bold: true },
    { label: 'Effective Rate',     cols: [`${newTax.effectiveRate}%`, `${oldTax.effectiveRate}%`] },
    { label: 'Monthly Tax',        cols: [inr(newTax.monthlyTax), inr(oldTax.monthlyTax)] },
  ]

  const faq = [
    { q: 'Which regime is better for me?',
      a: 'If your total deductions (80C + HRA + 80D + home loan interest) exceed roughly ₹3.75L for a ₹12L income, the old regime may win. Otherwise, the new regime\'s zero tax up to ₹12.75L is hard to beat. This calculator shows exactly which is better for you.' },
    { q: 'What is Section 87A rebate in FY 2026-27?',
      a: 'Under new regime: taxable income ≤ ₹12L = zero tax via ₹60,000 rebate. For salaried with ₹75K standard deduction, gross salary up to ₹12.75L = zero tax. Under old regime: taxable income ≤ ₹5L = zero tax via ₹12,500 rebate.' },
    { q: 'Can I switch regimes every year?',
      a: 'Salaried employees can switch every year by informing their employer at the start of FY. Business income holders can switch to old regime only once.' },
    { q: 'Is HRA exemption available in new regime?',
      a: 'No. New regime does not allow HRA, 80C, 80D, home loan interest (Sec 24B), or most other deductions. Only ₹75,000 standard deduction applies for salaried.' },
    { q: 'How is surcharge calculated?',
      a: 'Surcharge on income above ₹50L: 10%. Above ₹1Cr: 15%. Above ₹2Cr: 25% (new regime capped at 25%). Above ₹5Cr (old regime only): 37%. Cess of 4% applies on tax + surcharge. Marginal relief prevents cliff-edge jumps at thresholds.' },
  ]

  return (
    <div>
      <ContentInsertWide
        title="New regime: zero tax up to ₹12.75L for salaried"
        body="Budget 2025 made new regime default. ₹75K standard deduction + ₹60K rebate u/s 87A = zero tax for gross salary up to ₹12,75,000."
      />

      {/* Age */}
      <SectionHead title="Your Age Category" />
      <div className="flex gap-2 mb-5">
        {[['normal','Below 60'],['senior','Senior (60–79)'],['superSenior','Super Senior (80+)']].map(([v,l]) => (
          <button key={v} onClick={() => setAge(v)}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-colors ${age===v?'bg-brand text-white border-brand':'bg-white border-gray-200 text-gray-600'}`}>
            {l}
          </button>
        ))}
      </div>

      {/* Income */}
      <SectionHead title="Income" />
      <div className="card p-5 mb-5">
        <SliderInput label="Annual Income" value={income} min={0} max={50000000} step={50000}
          onChange={setIncome} format={inrCompact}
          hint="Type any amount — no limits. Surcharge applies above ₹50L." />
      </div>

      {/* Old regime deductions */}
      <SectionHead title="Old Regime Deductions" />
      <div className="card p-5 mb-5">
        <SliderInput label="Section 80C (PF, ELSS, LIC)" value={sec80C} min={0} max={150000} step={5000}
          onChange={setSec80C} format={inrCompact} hint="Max ₹1,50,000" />
        <SliderInput label="Section 80D (Health Insurance)" value={sec80D} min={0} max={100000} step={5000}
          onChange={setSec80D} format={inrCompact} hint="Self: ₹25K · Senior parents: ₹50K" />
        <SliderInput label="NPS 80CCD(1B)" value={nps} min={0} max={50000} step={5000}
          onChange={setNps} format={inrCompact} hint="Extra ₹50K over and above 80C" />
        <SliderInput label="HRA Exemption" value={hra} min={0} max={2000000} step={10000}
          onChange={setHra} format={inrCompact} hint="Use HRA Calculator for exact amount" />
        <SliderInput label="Home Loan Interest (Sec 24B)" value={homeLoan} min={0} max={200000} step={10000}
          onChange={setHomeLoan} format={inrCompact} hint="Max ₹2L for self-occupied property" />
      </div>

      {/* Recommendation */}
      <RecommendationBox
        title={`${saving >= 0 ? 'New' : 'Old'} Regime saves you ${inrCompact(Math.abs(saving))} this year`}
        body={saving === 0 ? 'Both regimes result in the same tax.' : `Switch to ${saving >= 0 ? 'New' : 'Old'} Regime and keep ${inr(Math.abs(saving))} more in your pocket.`}
        type={saving >= 0 ? 'success' : 'warning'}
      />

      {/* Stats */}
      <SectionHead title="Tax Summary" />
      <div className="grid grid-cols-2 gap-3 mb-5">
        <StatCard label="Tax — New Regime"  value={inr(newTax.totalTax)}   sub={`${newTax.effectiveRate}% effective`}  color="green" large />
        <StatCard label="Tax — Old Regime"  value={inr(oldTax.totalTax)}   sub={`${oldTax.effectiveRate}% effective`}  color="amber" large />
        <StatCard label="Monthly Tax (New)" value={inr(newTax.monthlyTax)} sub="Your monthly TDS amount" />
        <StatCard label="You Save"          value={inrCompact(Math.abs(saving))} sub={saving >= 0 ? 'choosing new regime' : 'choosing old regime'} color={saving >= 0 ? 'green' : 'amber'} />
      </div>

      {/* SIMPLE CHART */}
      <SimpleCompareBar newTax={newTax.totalTax} oldTax={oldTax.totalTax} income={income} />

      {/* Detail table */}
      <DetailTable title="Full Breakdown"
        rows={[{ label: 'Component', cols: ['New Regime', 'Old Regime'], bold: true }, ...tableRows]} />

      <ContentInsert icon="📋"
        title="87A rebate is automatically applied when filing ITR"
        body="Just select your regime in the ITR portal. The rebate is computed automatically — no separate claim needed." />

      <RelatedCalcs items={related} />
      <FAQ items={faq} />
    </div>
  )
}
