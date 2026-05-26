'use client'
import { useState, useMemo } from 'react'
import { SliderInput, StatCard, SectionHead, ContentInsert, DetailTable, FAQ, RelatedCalcs, RecommendationBox } from '../components/shared'
import { computeIncomeTax, inr, inrCompact } from '../lib/utils'

export default function FreelancerTax({ related }) {
  const [grossReceipts, setGross] = useState(1500000)
  const [actualExpenses, setExp]  = useState(200000)
  const [regime, setRegime]       = useState('new')

  const result44ADA = useMemo(() => {
    // Presumptive: 50% of gross receipts is deemed profit
    const presumptiveProfit = Math.round(grossReceipts * 0.50)
    const tax = computeIncomeTax(presumptiveProfit, regime, {})
    return { presumptiveProfit, tax, method: '44ADA (Presumptive)' }
  }, [grossReceipts, regime])

  const resultActual = useMemo(() => {
    // Actual: Gross - Actual Expenses = Net Profit
    const netProfit = Math.max(0, grossReceipts - actualExpenses)
    const tax = computeIncomeTax(netProfit, regime, {})
    return { netProfit, tax, method: 'Regular (Actual Expenses)' }
  }, [grossReceipts, actualExpenses, regime])

  const betterMethod = result44ADA.tax.totalTax <= resultActual.tax.totalTax ? '44ADA' : 'Regular'
  const saving = Math.abs(result44ADA.tax.totalTax - resultActual.tax.totalTax)

  const faq = [
    { q: 'Who can use Section 44ADA?', a: 'Professionals like doctors, lawyers, CAs, architects, engineers, consultants, technical consultants, interior decorators — those specified in Section 44AA. Their gross receipts must not exceed ₹50 lakh (₹75L if not cash transactions > 5%).' },
    { q: 'What does 50% presumptive profit mean?', a: 'Under 44ADA, you declare 50% of your gross receipts as profit, regardless of actual expenses. You don\'t need to maintain books of accounts. The remaining 50% is considered expenses automatically — no bills needed.' },
    { q: 'Can I claim deductions under 44ADA?', a: 'No business expenses or depreciation can be claimed separately. However, personal deductions like 80C, 80D, NPS are available in the old regime. Under new regime, only standard deduction of ₹75K applies.' },
    { q: 'Do I need to pay advance tax under 44ADA?', a: 'Yes, if your tax liability exceeds ₹10,000. But 44ADA assessees can pay entire advance tax in one installment by 15th March instead of 4 installments.' },
  ]

  return (
    <div>
      <div className="bg-brand-light border border-brand/20 border-l-4 border-l-brand rounded-xl p-3.5 mb-5 text-sm text-brand-dark">
        <strong>Section 44ADA:</strong> Declare 50% of gross receipts as profit. No books, no expense bills needed. For professionals earning up to ₹75L.
      </div>

      <SectionHead title="Your Income" />
      <div className="card p-5 mb-5">
        <SliderInput label="Gross Professional Receipts" value={grossReceipts} min={100000} max={7500000} step={50000}
          onChange={setGross} format={inrCompact} hint="Total fees/income received before expenses" />
        <SliderInput label="Actual Business Expenses" value={actualExpenses} min={0} max={grossReceipts} step={10000}
          onChange={setExp} format={inrCompact} hint="For comparison with regular method" />
      </div>

      <div className="flex gap-2 mb-5">
        {[['new','New Regime'],['old','Old Regime']].map(([v,l]) => (
          <button key={v} onClick={() => setRegime(v)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${regime===v?'bg-brand text-white border-brand':'bg-white border-gray-200 text-gray-600'}`}>
            {l}
          </button>
        ))}
      </div>

      <RecommendationBox
        title={`${betterMethod === '44ADA' ? 'Presumptive (44ADA)' : 'Regular method'} saves you ${inr(saving)}`}
        body={`44ADA profit: ${inr(result44ADA.presumptiveProfit)} | Actual profit: ${inr(resultActual.netProfit)}`}
        type="success"
      />

      <div className="grid grid-cols-2 gap-3 mb-5">
        <StatCard label="44ADA Tax"       value={inr(result44ADA.tax.totalTax)}   sub={`Profit: ${inrCompact(result44ADA.presumptiveProfit)}`} color="green" />
        <StatCard label="Regular Tax"     value={inr(resultActual.tax.totalTax)}  sub={`Profit: ${inrCompact(resultActual.netProfit)}`}        color="amber" />
        <StatCard label="44ADA Eff. Rate" value={`${result44ADA.tax.effectiveRate}%`} sub="On gross receipts" />
        <StatCard label="You Save"        value={inr(saving)}                     sub={`Using ${betterMethod}`} color="green" />
      </div>

      <DetailTable title="44ADA vs Regular — Comparison" rows={[
        { label: 'Gross Receipts',  cols: [inr(grossReceipts), inr(grossReceipts)] },
        { label: 'Expenses',        cols: [`${inr(grossReceipts/2)} (50% auto)`, inr(actualExpenses)] },
        { label: 'Net Profit',      cols: [inr(result44ADA.presumptiveProfit), inr(resultActual.netProfit)], bold: true },
        { label: 'Income Tax',      cols: [inr(result44ADA.tax.totalTax), inr(resultActual.tax.totalTax)], bold: true },
        { label: 'Effective Rate',  cols: [`${result44ADA.tax.effectiveRate}%`, `${resultActual.tax.effectiveRate}%`] },
        { label: 'Books required?', cols: ['No ✓', 'Yes — full accounts'] },
      ]} />

      <ContentInsert icon="📁" title="No books needed under 44ADA"
        body="Under presumptive taxation, you're exempt from maintaining books of accounts (Sec 44AA) and audit requirements (Sec 44AB) — saving significant compliance costs." />

      <RelatedCalcs items={related} />
      <FAQ items={faq} />
    </div>
  )
}
