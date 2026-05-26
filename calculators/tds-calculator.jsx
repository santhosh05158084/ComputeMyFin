'use client'
// TDS CALCULATOR
import { useState, useMemo } from 'react'
import { SelectInput, SliderInput, StatCard, SectionHead, ContentInsert, DetailTable, FAQ, RelatedCalcs, RecommendationBox } from '../components/shared'
import { inr, inrCompact } from '../lib/utils'
import { CONFIG } from '../lib/config'

export function TDSCalculator({ related }) {
  const sections = Object.entries(CONFIG.TDS)
  const [section, setSection]   = useState('194A')
  const [payment, setPayment]   = useState(100000)
  const [isSenior, setIsSenior] = useState(false)
  const [isCompany, setIsCompany]= useState(false)

  const cfg = CONFIG.TDS[section]

  const result = useMemo(() => {
    if (!cfg) return null
    const threshold = isSenior && cfg.seniorThreshold ? cfg.seniorThreshold : cfg.threshold
    if (payment < threshold) return { tds: 0, net: payment, belowThreshold: true, threshold }
    const rate = isCompany && cfg.companyRate ? cfg.companyRate : cfg.rate
    if (!rate) return { tds: null, net: null, slabBased: true }
    const tds = Math.round(payment * rate)
    return { tds, net: payment - tds, rate, threshold, belowThreshold: false }
  }, [section, payment, isSenior, isCompany, cfg])

  const faq = [
    { q: 'What happens if TDS is deducted at a higher rate?', a: 'If TDS is deducted more than your actual tax liability, you can claim a refund while filing your ITR. The excess TDS shows in your Form 26AS and gets refunded to your bank account.' },
    { q: 'What is Form 15G / 15H?', a: 'Form 15G (non-seniors) and 15H (seniors) are self-declarations submitted to banks to avoid TDS deduction on interest income if your total income is below the taxable limit. Valid only if your tax liability is zero.' },
    { q: 'Who deposits TDS to the government?', a: 'The deductor (bank, employer, company making payment) is responsible for depositing TDS to the government by the 7th of the next month (for most cases) via challan 281.' },
  ]

  return (
    <div>
      <SectionHead title="TDS Details" />
      <div className="card p-5 mb-5">
        <SelectInput label="TDS Section" value={section} onChange={setSection}
          options={sections.map(([k, v]) => ({ value: k, label: `Section ${k} — ${v.name}` }))} />
        <SliderInput label="Payment Amount" value={payment} min={1000} max={5000000} step={5000}
          onChange={setPayment} format={inrCompact} />
        <div className="flex gap-2">
          <button onClick={() => setIsSenior(!isSenior)}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold border ${isSenior?'bg-brand text-white border-brand':'bg-white border-gray-200 text-gray-600'}`}>
            Senior Citizen (60+)
          </button>
          <button onClick={() => setIsCompany(!isCompany)}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold border ${isCompany?'bg-brand text-white border-brand':'bg-white border-gray-200 text-gray-600'}`}>
            Company / Firm
          </button>
        </div>
      </div>

      {result?.belowThreshold ? (
        <RecommendationBox title={`No TDS — Payment below threshold of ${inr(result.threshold)}`} type="success" />
      ) : result?.slabBased ? (
        <RecommendationBox title="TDS at slab rate — use Income Tax Calculator" type="info" />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 mb-5">
            <StatCard label="TDS Amount"    value={inr(result?.tds)} sub={`@ ${(result?.rate*100).toFixed(1)}%`} color="red" />
            <StatCard label="Net Payment"   value={inr(result?.net)} sub="You receive this" color="green" />
            <StatCard label="TDS Rate"      value={`${((result?.rate||0)*100).toFixed(1)}%`} sub={`Section ${section}`} />
            <StatCard label="Threshold"     value={inr(result?.threshold)} sub="TDS applies above this" />
          </div>
          <DetailTable title="TDS Computation" rows={[
            { label: 'Gross Payment',  value: inr(payment) },
            { label: `TDS @ ${((result?.rate||0)*100).toFixed(1)}%`, value: `-${inr(result?.tds)}`, color: 'text-red-500' },
            { label: 'Net Received',   value: inr(result?.net), bold: true, color: 'text-brand' },
          ]} />
        </>
      )}
      <ContentInsert icon="📋" title="Check Form 26AS after each TDS deduction"
        body="Form 26AS shows all TDS deducted against your PAN. Check it quarterly on the income tax portal to ensure TDS is correctly credited." />
      <RelatedCalcs items={related} />
      <FAQ items={faq} />
    </div>
  )
}

// Default export for dynamic routing
export default TDSCalculator
