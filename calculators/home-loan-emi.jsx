'use client'
import { useState, useMemo } from 'react'
import { calcEMI, calcAmortisation, inrCompact, inr } from '../lib/utils'
import {
  SliderInput, SliderPlain, StatCard, SectionHead,
  ContentInsert, FAQ, RelatedCalcs
} from '../components/shared'

// Simple donut chart showing principal vs interest
function DonutChart({ principal, interest }) {
  const total = principal + interest
  const pPct = total > 0 ? Math.round((principal / total) * 100) : 50
  const iPct = 100 - pPct
  const r = 54, cx = 70, cy = 70
  const circ = 2 * Math.PI * r
  const pDash = (pPct / 100) * circ
  const iDash = (iPct / 100) * circ

  return (
    <div className="card p-5 mb-5">
      <p className="text-sm font-bold text-gray-800 mb-4">Total Payment Breakdown</p>
      <div className="flex items-center gap-6">
        <svg width="140" height="140" viewBox="0 0 140 140">
          {/* Background circle */}
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F3F4F6" strokeWidth="18"/>
          {/* Interest arc (amber) */}
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#FCD34D" strokeWidth="18"
            strokeDasharray={`${iDash} ${circ}`}
            strokeDashoffset={-pDash}
            strokeLinecap="round"
            transform={`rotate(-90 ${cx} ${cy})`}/>
          {/* Principal arc (green) */}
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#0F9B6E" strokeWidth="18"
            strokeDasharray={`${pDash} ${circ}`}
            strokeLinecap="round"
            transform={`rotate(-90 ${cx} ${cy})`}/>
          {/* Center text */}
          <text x={cx} y={cy-6} textAnchor="middle" fontSize="12" fill="#6B7280" fontFamily="system-ui">Principal</text>
          <text x={cx} y={cy+10} textAnchor="middle" fontSize="14" fontWeight="700" fill="#0F9B6E" fontFamily="system-ui">{pPct}%</text>
        </svg>
        <div className="flex-1">
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-brand flex-shrink-0"/>
              <span className="text-xs text-gray-500 font-medium">Principal</span>
            </div>
            <p className="text-base font-bold text-gray-900">{inrCompact(principal)}</p>
            <p className="text-xs text-gray-400">{pPct}% of total</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-amber-300 flex-shrink-0"/>
              <span className="text-xs text-gray-500 font-medium">Total Interest</span>
            </div>
            <p className="text-base font-bold text-amber-600">{inrCompact(interest)}</p>
            <p className="text-xs text-gray-400">{iPct}% of total</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Simple yearly bar chart
function EMIYearlyChart({ schedule, years }) {
  const yearly = []
  for (let y = 1; y <= years; y++) {
    const slice = schedule.filter(row => Math.ceil(row.month / 12) === y)
    yearly.push({
      year: y,
      principal: Math.round(slice.reduce((s, r) => s + r.principal, 0)),
      interest: Math.round(slice.reduce((s, r) => s + r.interest, 0)),
    })
  }
  const step = Math.max(1, Math.floor(years / 6))
  const display = yearly.filter((_, i) => (i + 1) % step === 0 || i === years - 1)
  const maxV = Math.max(...display.map(d => d.principal + d.interest), 1)

  return (
    <div className="card p-5 mb-5">
      <p className="text-sm font-bold text-gray-800 mb-1">Principal vs Interest — Year by Year</p>
      <p className="text-xs text-gray-400 mb-4">In early years, most EMI goes to interest. It shifts over time.</p>
      <div className="flex items-end gap-2 h-32 mb-2">
        {display.map((d, i) => {
          const totalH = Math.round(((d.principal + d.interest) / maxV) * 100)
          const intH = Math.round((d.interest / maxV) * 100)
          const prH = totalH - intH
          return (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div className="w-full flex flex-col justify-end" style={{height:'100px'}}>
                <div className="w-full bg-brand rounded-t" style={{height:`${prH}%`,minHeight:'2px'}}/>
                <div className="w-full bg-red-200" style={{height:`${intH}%`,minHeight:'2px'}}/>
              </div>
              <span className="text-xs text-gray-400 mt-1" style={{fontSize:'9px'}}>Y{d.year}</span>
            </div>
          )
        })}
      </div>
      <div className="flex gap-4 mt-1">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <div className="w-3 h-3 rounded-sm bg-brand"/>Principal
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <div className="w-3 h-3 rounded-sm bg-red-200"/>Interest
        </div>
      </div>
    </div>
  )
}

export default function HomeLoanEMI({ related }) {
  const [principal, setPrincipal] = useState(5000000)
  const [rate, setRate]           = useState(8.5)
  const [years, setYears]         = useState(20)

  const result   = useMemo(() => calcEMI(principal, rate, years * 12), [principal, rate, years])
  const schedule = useMemo(() => calcAmortisation(principal, rate, years * 12), [principal, rate, years])

  const faq = [
    { q: 'What is the reducing balance method?',
      a: 'Interest is calculated on the remaining principal balance each month. As your principal reduces with each EMI, the interest also reduces. All bank home loans use this RBI-mandated method. Do not confuse with flat rate loans which charge interest on original principal throughout.' },
    { q: 'Should I choose a shorter or longer tenure?',
      a: 'Shorter tenure = higher EMI but much lower total interest. Longer tenure = manageable EMI but you pay much more interest overall. Rule of thumb: keep EMI below 40% of monthly take-home. Then prepay aggressively with any bonus or windfall.' },
    { q: 'Can I get tax deduction on home loan?',
      a: 'Old regime only. Section 24B: up to ₹2L interest deduction per year (self-occupied). Section 80C: up to ₹1.5L principal repayment. New regime does not allow these deductions. Use our Income Tax Calculator to compare regimes after including home loan benefit.' },
    { q: 'What happens if RBI changes interest rates?',
      a: 'Most home loans are on floating rates linked to REPO or MCLR. If rates rise, your EMI increases or tenure extends. If rates fall, EMI decreases. Fixed rate loans are immune to this but typically cost 0.5–1% more initially.' },
  ]

  return (
    <div>
      <div className="bg-brand-light border border-brand/20 border-l-4 border-l-brand rounded-xl p-3.5 mb-5 text-sm text-brand-dark">
        <strong>Reducing balance method (RBI standard):</strong> Interest computed on outstanding principal. Same formula used by all banks in India.
      </div>

      <SectionHead title="Loan Details" />
      <div className="card p-5 mb-5">
        <SliderInput label="Loan Amount" value={principal} min={100000} max={100000000} step={100000}
          onChange={setPrincipal} format={inrCompact} hint="Type any amount — no limits" />
        <SliderPlain label="Annual Interest Rate" value={rate} min={5} max={20} step={0.05}
          onChange={setRate} suffix="% p.a." hint="Current home loan rates: 8.5–9.5%" />
        <SliderPlain label="Loan Tenure" value={years} min={1} max={30}
          onChange={setYears} suffix=" years" />
      </div>

      {/* EMI Result */}
      <div className="bg-brand rounded-2xl p-5 mb-5 text-center">
        <p className="text-brand-muted text-sm font-medium mb-1">Monthly EMI</p>
        <p className="text-4xl font-extrabold text-white tracking-tight">{inr(result.emi)}</p>
        <p className="text-brand-muted text-xs mt-2">
          Total payment: {inrCompact(result.totalPayment)} · Interest: {inrCompact(result.totalInterest)}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <StatCard label="Principal"       value={inrCompact(principal)}           sub="Loan amount borrowed" />
        <StatCard label="Total Interest"  value={inrCompact(result.totalInterest)} sub={`Over ${years} years`} color="amber" />
        <StatCard label="Total Payment"   value={inrCompact(result.totalPayment)}  sub="Principal + all interest" color="red" />
        <StatCard label="Interest %"      value={`${result.totalPayment > 0 ? Math.round(result.totalInterest / result.totalPayment * 100) : 0}%`} sub="Of your total payments" color="amber" />
      </div>

      {/* Donut chart */}
      <DonutChart principal={principal} interest={result.totalInterest} />

      {/* Yearly chart */}
      <EMIYearlyChart schedule={schedule} years={years} />

      <ContentInsert icon="💡"
        title="Prepay even ₹50K/year — save lakhs"
        body={`Prepaying ₹50,000 in Year 1 at ${rate}% for ${years} years saves ~₹${Math.round(50000 * years * 0.3).toLocaleString('en-IN')} in interest and reduces tenure by ~14 months.`} />

      <RelatedCalcs items={related} />
      <FAQ items={faq} />
    </div>
  )
}
