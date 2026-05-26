'use client'
import { useState, useMemo } from 'react'
import { SliderInput, StatCard, SectionHead, ContentInsert, DetailTable, FAQ, RelatedCalcs, RecommendationBox } from '../components/shared'
import { computeIncomeTax, inr, inrCompact } from '../lib/utils'
import { CONFIG } from '../lib/config'

export default function AdvanceTax({ related }) {
  const [income, setIncome]   = useState(1500000)
  const [tdsDeducted, setTds] = useState(50000)
  const [regime, setRegime]   = useState('new')
  const [sec80C, setSec80C]   = useState(150000)

  const result = useMemo(() => {
    const deductions = { sec80C }
    const tax = computeIncomeTax(income, regime, regime === 'old' ? deductions : {})
    const netTax = Math.max(0, tax.totalTax - tdsDeducted)
    const installments = CONFIG.ADVANCE_TAX.installments

    if (netTax <= CONFIG.ADVANCE_TAX.threshold) {
      return { totalTax: tax.totalTax, netTax, noAdvanceTax: true, tdsDeducted }
    }

    const schedule = installments.map(inst => ({
      ...inst,
      cumAmount:   Math.round(netTax * inst.cumPct),
      instAmount:  Math.round(netTax * inst.cumPct) - (installments[installments.indexOf(inst)-1] ? Math.round(netTax * installments[installments.indexOf(inst)-1].cumPct) : 0),
    }))

    return { totalTax: tax.totalTax, netTax, tdsDeducted, schedule, noAdvanceTax: false, effectiveRate: tax.effectiveRate }
  }, [income, tdsDeducted, regime, sec80C])

  const faq = [
    { q: 'Who needs to pay advance tax?', a: 'Anyone whose estimated tax liability for the year exceeds ₹10,000 must pay advance tax. This includes salaried employees with significant other income (FD interest, capital gains, rental income), freelancers, business owners, and anyone with TDS shortfall.' },
    { q: 'What are the due dates for advance tax?', a: '15 June: 15%, 15 September: 45%, 15 December: 75%, 15 March: 100%. Miss a deadline and interest under Section 234C applies at 1% per month on the shortfall.' },
    { q: 'What if I don\'t pay advance tax?', a: 'You\'ll pay interest under Sec 234B (1%/month from April to filing date if total shortfall > 10%) and 234C (1%/month on each installment shortfall). The total can add significantly to your tax bill.' },
  ]

  return (
    <div>
      <div className="bg-blue-50 border border-blue-200 border-l-4 border-l-blue-400 rounded-xl p-3.5 mb-5 text-sm text-blue-800">
        Pay advance tax in 4 installments to avoid interest u/s 234B & 234C. Required if total tax liability &gt; ₹10,000.
      </div>

      <SectionHead title="Income & Tax Details" />
      <div className="card p-5 mb-5">
        <SliderInput label="Estimated Annual Income" value={income} min={500000} max={10000000} step={50000}
          onChange={setIncome} format={inrCompact} />
        <SliderInput label="TDS Already Deducted" value={tdsDeducted} min={0} max={500000} step={5000}
          onChange={setTds} format={inrCompact} hint="Check Form 26AS for this figure" />
        {regime === 'old' && (
          <SliderInput label="Section 80C Deductions" value={sec80C} min={0} max={150000} step={5000}
            onChange={setSec80C} format={inrCompact} />
        )}
      </div>

      <div className="flex gap-2 mb-5">
        {[['new','New Regime'],['old','Old Regime']].map(([v,l]) => (
          <button key={v} onClick={() => setRegime(v)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${regime===v?'bg-brand text-white border-brand':'bg-white border-gray-200 text-gray-600'}`}>
            {l}
          </button>
        ))}
      </div>

      {result.noAdvanceTax ? (
        <RecommendationBox title="No Advance Tax Required" body={`Your net tax (${inr(result.netTax)}) is below ₹10,000 threshold after TDS of ${inr(result.tdsDeducted)}.`} type="success" />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 mb-5">
            <StatCard label="Total Tax Liability" value={inr(result.totalTax)}   sub="FY 2026-27" color="red" />
            <StatCard label="After TDS Credit"    value={inr(result.netTax)}     sub="Balance to pay" color="amber" />
          </div>

          <SectionHead title="Advance Tax Schedule" />
          <div className="card overflow-hidden mb-5">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Installment</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Due Date</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase">% of Tax</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase">Pay</th>
                </tr>
              </thead>
              <tbody>
                {result.schedule?.map((s, i) => (
                  <tr key={i} className="border-t border-gray-50">
                    <td className="px-4 py-3 text-gray-700 font-medium">{s.label}</td>
                    <td className="px-4 py-3 text-gray-500">{s.dueDate}</td>
                    <td className="px-4 py-3 text-right text-gray-500">{(s.cumPct*100).toFixed(0)}%</td>
                    <td className="px-4 py-3 text-right font-bold text-brand">{inr(s.instAmount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <ContentInsert icon="📅" title="Pay advance tax via Challan 280 on income tax portal"
        body="Go to incometax.gov.in → e-Pay Tax → Challan 280 → Select '(100) Advance Tax'. Pay online via net banking or UPI. Keep the receipt for records." />

      <RelatedCalcs items={related} />
      <FAQ items={faq} />
    </div>
  )
}
