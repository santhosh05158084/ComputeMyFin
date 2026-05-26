'use client'
import { useState, useMemo } from 'react'
import { SliderInput, SliderPlain, SelectInput, StatCard, SectionHead, ContentInsert, DetailTable, FAQ, RelatedCalcs, RecommendationBox, Tabs } from '../components/shared'
import { calcCapitalGains, computeIncomeTax, inrCompact, inr } from '../lib/utils'
import { CONFIG } from '../lib/config'

// ══════════════════════════════════════════════
// CAPITAL GAINS TAX CALCULATOR
// ══════════════════════════════════════════════
export default function CapitalGainsTax({ related }) {
  const [assetType, setAssetType] = useState('equity')
  const [buyPrice, setBuyPrice]   = useState(100000)
  const [sellPrice, setSellPrice] = useState(200000)
  const [holding, setHolding]     = useState(18)
  const [income, setIncome]       = useState(1000000)

  const result = useMemo(() => calcCapitalGains(assetType, buyPrice, sellPrice, holding, income), [assetType, buyPrice, sellPrice, holding, income])

  const cgCfg = CONFIG.CAPITAL_GAINS
  const assetOptions = [
    { value: 'equity',   label: 'Equity / Stocks' },
    { value: 'mf_equity',label: 'Equity Mutual Fund' },
    { value: 'property', label: 'Property / Real Estate' },
    { value: 'gold',     label: 'Gold (Physical)' },
    { value: 'crypto',   label: 'Crypto / VDA' },
  ]

  const holdingOptions = assetType === 'property' || assetType === 'gold'
    ? { stcgMonths: 24, label: '24 months' }
    : { stcgMonths: 12, label: '12 months' }

  const isLTCG = holding >= holdingOptions.stcgMonths

  const faq = [
    { q: 'How did Budget 2024 change capital gains tax?',
      a: 'Budget 2024 (July 23, 2024) made major changes: (1) STCG on equity raised from 15% to 20%, (2) LTCG on equity raised from 10% to 12.5%, (3) LTCG exemption raised from ₹1L to ₹1.25L, (4) Property LTCG rate changed to 12.5% without indexation (or 20% with indexation for pre-Jul 23, 2024 property).' },
    { q: 'What is grandfathering for equity LTCG?',
      a: 'For equity purchased before Jan 31, 2018, the cost is deemed to be the higher of actual cost or Jan 31, 2018 market price. This means gains up to Jan 31, 2018 are grandfathered (exempt). This calculator does not compute grandfathering — use it separately for pre-2018 stocks.' },
    { q: 'Is LTCG on property without indexation always better?',
      a: 'Not always. For property purchased before July 23, 2024, you can choose: 12.5% without indexation OR 20% with indexation — whichever results in lower tax. For property bought after July 23, 2024, only 12.5% without indexation applies.' },
  ]

  return (
    <div>
      <div className="bg-amber-50 border border-amber-200 border-l-4 border-l-amber-400 rounded-xl p-3.5 mb-5 text-sm text-amber-800">
        <strong>Budget 2024 update:</strong> STCG 20%, LTCG 12.5%, ₹1.25L exemption for equity. These rates apply from July 23, 2024.
      </div>

      <SectionHead title="Asset Details" />
      <div className="card p-5 mb-5">
        <SelectInput label="Asset Type" value={assetType} onChange={setAssetType} options={assetOptions} />
        <SliderInput label="Purchase Price (Cost of Acquisition)" value={buyPrice} min={1000} max={10000000} step={5000}
          onChange={setBuyPrice} format={inrCompact} />
        <SliderInput label="Selling Price (Sale Consideration)" value={sellPrice} min={1000} max={10000000} step={5000}
          onChange={setSellPrice} format={inrCompact} />
        <div className="mb-5">
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-600">Holding Period</label>
            <span className="text-sm font-bold text-gray-900">{holding} months {isLTCG ? '(LTCG)' : '(STCG)'}</span>
          </div>
          <input type="range" min={1} max={120} value={holding} onChange={e => setHolding(Number(e.target.value))}
            style={{ '--val': `${(holding/120)*100}%` }} className="w-full accent-brand" />
          <div className="flex justify-between mt-1 text-xs">
            <span className="text-gray-400">1 month</span>
            <span className={`font-semibold ${isLTCG ? 'text-brand' : 'text-amber-500'}`}>
              {holdingOptions.stcgMonths}m threshold: {isLTCG ? 'You qualify for LTCG ✓' : `Need ${holdingOptions.stcgMonths - holding}m more`}
            </span>
            <span className="text-gray-400">10 years</span>
          </div>
        </div>
        {assetType === 'property' && (
          <SliderInput label="Your Annual Income (for STCG slab calc)" value={income} min={300000} max={10000000} step={50000}
            onChange={setIncome} format={inrCompact} />
        )}
      </div>

      <RecommendationBox
        title={result.gain >= 0 ? `Gain: ${inr(result.gain)} — Tax: ${inr(result.totalTax)}` : `Loss: ${inr(Math.abs(result.gain))} — Can offset against other gains`}
        body={`${result.taxType} @ ${result.rate}% | Net gain after tax: ${inr(result.netGain)}`}
        type={result.gain >= 0 ? 'success' : 'warning'}
      />

      <div className="grid grid-cols-2 gap-3 mb-5">
        <StatCard label="Capital Gain"    value={inr(result.gain)}             sub={result.gain >= 0 ? 'Profit' : 'Loss'} color={result.gain>=0?'green':'red'} />
        <StatCard label="Tax Type"        value={result.taxType}               sub={`@ ${result.rate}%`} />
        <StatCard label="Tax Amount"      value={inr(result.totalTax)}         sub="Including 4% cess" color="red" />
        <StatCard label="Net Gain"        value={inr(result.netGain)}          sub="After tax" color="green" />
      </div>

      <DetailTable title="Tax Computation" rows={[
        { label: 'Purchase Price',    value: inr(buyPrice) },
        { label: 'Sale Price',        value: inr(sellPrice) },
        { label: 'Capital Gain',      value: inr(result.gain), bold: true },
        { label: `Tax (${result.taxType})`, value: inr(result.taxBeforeCess) },
        { label: 'Cess (4%)',         value: inr(result.cess) },
        { label: 'Total Tax',         value: inr(result.totalTax), bold: true, color: 'text-red-500' },
        { label: 'Net Gain',          value: inr(result.netGain), bold: true, color: 'text-brand' },
      ]} />

      <ContentInsert icon="📅" title="Hold equity for 12+ months — save 7.5% tax"
        body="STCG on equity is 20%, LTCG is only 12.5%. Simply holding an equity investment for 12 months instead of 11 saves you 7.5% of your gain. On ₹1L gain, that's ₹7,500 saved." />

      <RelatedCalcs items={related} />
      <FAQ items={faq} />
    </div>
  )
}
