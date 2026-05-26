'use client'
import { useState, useMemo } from 'react'
import { calcSIP, inrCompact, inr } from '../lib/utils'
import {
  SliderInput, SliderPlain, StatCard, SectionHead,
  ContentInsert, RecommendationBox, FAQ, RelatedCalcs
} from '../components/shared'

// Clean stacked bar chart — simple to understand
function SIPGrowthChart({ monthly, rate, years }) {
  const points = []
  const mr = rate / 12 / 100
  const steps = Math.min(years, 8)
  const stepSize = Math.max(1, Math.floor(years / steps))
  for (let y = stepSize; y <= years; y += stepSize) {
    const n = y * 12
    const mat = mr === 0 ? monthly * n : monthly * ((Math.pow(1 + mr, n) - 1) / mr) * (1 + mr)
    const inv = monthly * n
    points.push({ year: y, invested: Math.round(inv), returns: Math.round(mat - inv), total: Math.round(mat) })
  }
  const maxV = Math.max(...points.map(p => p.total), 1)

  return (
    <div className="card p-5 mb-5">
      <p className="text-sm font-bold text-gray-800 mb-1">Corpus Growth Over Time</p>
      <p className="text-xs text-gray-400 mb-4">How your wealth builds year by year</p>

      <div className="flex items-end gap-2 h-36 mb-2">
        {points.map((p, i) => {
          const totalH = Math.round((p.total / maxV) * 100)
          const invH = Math.round((p.invested / maxV) * 100)
          const retH = totalH - invH
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-0">
              {/* Value on top */}
              <span className="text-xs text-gray-600 font-semibold mb-1" style={{fontSize:'9px'}}>{inrCompact(p.total)}</span>
              {/* Bar */}
              <div className="w-full flex flex-col justify-end" style={{height:'90px'}}>
                <div className="w-full bg-brand rounded-t" style={{height:`${retH}%`,minHeight: retH > 0 ? '3px':'0'}}/>
                <div className="w-full bg-brand-light border border-brand/30" style={{height:`${invH}%`, minHeight:'3px'}}/>
              </div>
              <span className="text-xs text-gray-400 mt-1" style={{fontSize:'9px'}}>Y{p.year}</span>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-1">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <div className="w-3 h-3 rounded-sm bg-brand"/>Returns
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <div className="w-3 h-3 rounded-sm bg-brand-light border border-brand/30"/>Invested
        </div>
      </div>
    </div>
  )
}

export default function SIPCalculator({ related }) {
  const [monthly, setMonthly] = useState(10000)
  const [rate, setRate]       = useState(12)
  const [years, setYears]     = useState(15)

  const r = useMemo(() => calcSIP(monthly, rate, years), [monthly, rate, years])

  const faq = [
    { q: 'How is SIP return calculated?',
      a: 'SIP uses the formula: M = P × [(1+r)^n – 1]/r × (1+r), where P is monthly amount, r is monthly rate (annual rate ÷ 12), n is total months. Each SIP installment earns compound interest for its remaining period. Earlier installments earn more — that\'s the power of starting early.' },
    { q: 'What is a realistic SIP return rate?',
      a: 'Large-cap equity MFs: 11–13% historically. Flexi/mid-cap: 13–15%. Small-cap: 15–18% (higher risk). Debt funds: 6–8%. These are historical averages — past returns don\'t guarantee future performance. Index funds closely track Nifty 50 returns (~12–13%).' },
    { q: 'Is SIP better than lump sum?',
      a: 'SIP averages your purchase cost (rupee cost averaging) and removes market-timing risk. Lump sum can outperform if markets rise immediately after investment. For most investors, SIP is recommended as it removes the anxiety of timing the market.' },
    { q: 'Can I stop SIP midway?',
      a: 'Yes. SIP can be paused or stopped anytime without penalty. Your existing corpus stays invested and continues to earn returns. You can resume later. However, compounding works best when you stay invested for the full duration.' },
  ]

  return (
    <div>
      <div className="bg-brand-light border border-brand/20 border-l-4 border-l-brand rounded-xl p-3.5 mb-5 text-sm text-brand-dark leading-relaxed">
        <strong>₹10K/month for 15 years at 12%</strong> = ₹50.46L corpus from just ₹18L invested. That's 2.8x your money — purely from compounding.
      </div>

      <SectionHead title="SIP Details" />
      <div className="card p-5 mb-5">
        <SliderInput label="Monthly SIP Amount" value={monthly} min={500} max={500000} step={500}
          onChange={setMonthly} format={inrCompact} hint="Type any amount — no upper limit" />
        <SliderPlain label="Expected Annual Return" value={rate} min={1} max={30} step={0.5}
          onChange={setRate} suffix="% p.a." hint="Equity MF avg: 12–15% | Debt: 6–8%" />
        <SliderPlain label="Investment Duration" value={years} min={1} max={40}
          onChange={setYears} suffix=" years" />
      </div>

      {/* Result hero */}
      <div className="bg-brand rounded-2xl p-5 mb-5 text-center">
        <p className="text-brand-muted text-sm font-medium mb-1">Estimated Maturity Value</p>
        <p className="text-4xl font-extrabold text-white tracking-tight">{inrCompact(r.maturity)}</p>
        <p className="text-brand-muted text-xs mt-2">
          Invested {inrCompact(r.invested)} · Gained {inrCompact(r.returns)}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <StatCard label="Total Invested"   value={inrCompact(r.invested)}  sub={`₹${monthly.toLocaleString('en-IN')}/mo × ${years * 12} months`} />
        <StatCard label="Wealth Gained"    value={inrCompact(r.returns)}   sub={`${r.invested > 0 ? Math.round((r.returns / r.invested) * 100) : 0}% of invested`} color="green" />
        <StatCard label="Return Multiple"  value={`${r.invested > 0 ? (r.maturity / r.invested).toFixed(1) : '0'}x`} sub="Times your invested amount" color="green" />
        <StatCard label="Annual Return"    value={`${rate}% p.a.`}         sub="Expected compounding rate" />
      </div>

      {/* Clean chart */}
      <SIPGrowthChart monthly={monthly} rate={rate} years={years} />

      <ContentInsert icon="🚀"
        title="Step-Up SIP = 3× more wealth"
        body={`₹${monthly.toLocaleString('en-IN')}/mo growing 10%/yr for ${years} yrs at ${rate}% = ${inrCompact(Math.round(calcSIP(monthly, rate, years).maturity * 2.2))} (est.) vs ${inrCompact(r.maturity)} without step-up. Use Step-Up SIP calculator for exact numbers.`} />

      <RelatedCalcs items={related} />
      <FAQ items={faq} />
    </div>
  )
}
