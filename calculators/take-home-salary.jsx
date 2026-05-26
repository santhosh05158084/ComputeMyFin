'use client'
import { useState, useMemo } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { SliderInput, StatCard, SectionHead, ContentInsert, DetailTable, FAQ, RelatedCalcs, RecommendationBox } from '../components/shared'
import { computeIncomeTax, inrCompact, inr } from '../lib/utils'
import { CONFIG } from '../lib/config'

export default function TakeHomeSalary({ related }) {
  const [ctc, setCtc]           = useState(1200000)
  const [basicPct, setBasicPct] = useState(40)
  const [hraRecd, setHraRecd]   = useState(0)  // auto-filled
  const [rentPaid, setRentPaid] = useState(180000)
  const [isMetro, setIsMetro]   = useState(true)
  const [sec80C, setSec80C]     = useState(150000)
  const [regime, setRegime]     = useState('new')

  const result = useMemo(() => {
    const basic       = Math.round(ctc * basicPct / 100)
    const hra         = Math.round(basic * 0.50)   // typical HRA = 50% basic
    const special     = ctc - basic - hra - 21600   // special allowance
    const employerPF  = Math.min(basic, CONFIG.RATES.EPF.wageFloor) * CONFIG.RATES.EPF.employeeRate * 12
    const employeePF  = employerPF
    const gross       = ctc - employerPF            // gross taxable salary

    // HRA exemption (old regime)
    const hraExempt = Math.min(hra, Math.max(0, rentPaid - 0.10 * basic), (isMetro ? 0.50 : 0.40) * basic)

    const deductions = { sec80C: sec80C + employeePF, hra: hraExempt, sec80DSelf: 0, nps: 0, homeLoan: 0 }
    const tax        = computeIncomeTax(gross, regime, regime === 'old' ? deductions : {})
    const professionalTax = 2400  // approximate annual PT
    const monthlyTakeHome = Math.round((gross - tax.totalTax - employeePF - professionalTax) / 12)

    return {
      ctc, gross, basic, hra, special,
      employerPF: Math.round(employerPF),
      employeePF: Math.round(employeePF),
      incomeTax: tax.totalTax,
      effectiveRate: tax.effectiveRate,
      professionalTax,
      monthlyTakeHome,
      annualTakeHome: monthlyTakeHome * 12,
      hraExempt: Math.round(hraExempt),
    }
  }, [ctc, basicPct, rentPaid, isMetro, sec80C, regime])

  const pie = [
    { name: 'Take Home', value: result.annualTakeHome, color: '#0F9B6E' },
    { name: 'Income Tax', value: result.incomeTax,    color: '#EF4444' },
    { name: 'Employee PF', value: result.employeePF,   color: '#3B82F6' },
    { name: 'Prof. Tax',   value: result.professionalTax, color: '#F59E0B' },
  ].filter(d => d.value > 0)

  const rows = [
    { label: 'CTC',                value: inr(result.ctc) },
    { label: '(-) Employer PF',    value: `-${inr(result.employerPF)}` },
    { label: 'Gross Salary',       value: inr(result.gross), bold: true },
    { label: '(-) Income Tax',     value: `-${inr(result.incomeTax)}`, color: 'text-red-500' },
    { label: '(-) Employee PF',    value: `-${inr(result.employeePF)}`, color: 'text-blue-600' },
    { label: '(-) Professional Tax', value: `-${inr(result.professionalTax)}` },
    { label: 'Annual Take-Home',   value: inr(result.annualTakeHome), bold: true, color: 'text-brand' },
    { label: 'Monthly Take-Home',  value: inr(result.monthlyTakeHome), bold: true, color: 'text-brand' },
  ]

  const faq = [
    { q: 'What is the difference between CTC and take-home salary?',
      a: 'CTC (Cost to Company) is the total annual expenditure a company makes for an employee. Take-home salary is what you actually receive after deducting income tax, employee PF, professional tax, and other deductions. CTC includes employer contributions (PF, gratuity, insurance) which you don\'t get directly.' },
    { q: 'How is PF calculated on salary?',
      a: 'Both employee and employer contribute 12% of basic salary (capped at ₹15,000 wage ceiling). So max PF contribution per side is ₹1,800/month. Employer\'s share: 8.33% goes to EPS (pension scheme) and 3.67% to EPF. Employee\'s full 12% goes to EPF.' },
    { q: 'Why does basic salary percentage matter?',
      a: 'Higher basic = higher PF deduction but also higher HRA exemption and gratuity. Lower basic = lower PF, more special allowance, higher take-home. Most companies offer 40-50% basic of CTC.' },
  ]

  return (
    <div>
      <SectionHead title="Salary Details" />
      <div className="card p-5 mb-5">
        <SliderInput label="Annual CTC" value={ctc} min={300000} max={10000000} step={50000}
          onChange={setCtc} format={inrCompact} />
        <div className="mb-5">
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-600">Basic Salary %</label>
            <span className="text-sm font-bold text-gray-900">{basicPct}% = {inrCompact(Math.round(ctc * basicPct / 100))}/yr</span>
          </div>
          <input type="range" min={30} max={60} step={5} value={basicPct}
            onChange={e => setBasicPct(Number(e.target.value))}
            style={{ '--val': `${((basicPct-30)/30)*100}%` }} className="w-full accent-brand" />
          <div className="flex justify-between mt-1 text-xs text-gray-400"><span>30%</span><span>60%</span></div>
        </div>
        <SliderInput label="Annual Rent Paid" value={rentPaid} min={0} max={600000} step={12000}
          onChange={setRentPaid} format={inrCompact} hint="For HRA exemption (old regime)" />
      </div>

      <SectionHead title="Tax Regime" />
      <div className="flex gap-2 mb-5">
        {[['new','New Regime (Default)'],['old','Old Regime']].map(([v,l]) => (
          <button key={v} onClick={() => setRegime(v)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${regime===v?'bg-brand text-white border-brand':'bg-white border-gray-200 text-gray-600'}`}>
            {l}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mb-5">
        {[['true','Metro City (50% HRA)'],['false','Non-Metro (40% HRA)']].map(([v,l]) => (
          <button key={v} onClick={() => setIsMetro(v==='true')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-colors ${String(isMetro)===v?'bg-gray-800 text-white border-gray-800':'bg-white border-gray-200 text-gray-600'}`}>
            {l}
          </button>
        ))}
      </div>

      {/* Result headline */}
      <div className="bg-brand rounded-2xl p-5 mb-5 text-center">
        <p className="text-brand-muted text-sm font-medium mb-1">Monthly Take-Home Salary</p>
        <p className="text-4xl font-extrabold text-white">{inr(result.monthlyTakeHome)}</p>
        <p className="text-brand-muted text-xs mt-1">{inr(result.annualTakeHome)} per year · Effective tax {result.effectiveRate}%</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <StatCard label="Gross Salary"   value={inrCompact(result.gross)}        sub="CTC minus employer PF" />
        <StatCard label="Income Tax"     value={inr(result.incomeTax)}            sub={`${result.effectiveRate}% effective`} color="red" />
        <StatCard label="Employee PF"    value={inr(result.employeePF)}           sub="12% of basic" color="blue" />
        <StatCard label="HRA Exempt"     value={regime==='old' ? inr(result.hraExempt) : 'N/A'}  sub={regime==='old'?'Old regime only':'New regime: no HRA'} />
      </div>

      {/* Pie */}
      <div className="card p-5 mb-5">
        <p className="text-sm font-bold text-gray-800 mb-4">CTC Breakdown</p>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={pie} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value">
              {pie.map((e, i) => <Cell key={i} fill={e.color} />)}
            </Pie>
            <Tooltip formatter={v => inr(v)} />
            <Legend formatter={(v, e) => `${v}: ${inrCompact(e.payload.value)}`} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <DetailTable title="Salary Breakup" rows={rows} />

      <ContentInsert icon="💡" title="Negotiate non-monetary benefits to lower tax"
        body="Meal vouchers (₹2,200/month tax-free), LTA (2 trips in 4 years), NPS contribution by employer (12% of basic tax-free) — these can significantly boost your take-home." />

      <RelatedCalcs items={related} />
      <FAQ items={faq} />
    </div>
  )
}
