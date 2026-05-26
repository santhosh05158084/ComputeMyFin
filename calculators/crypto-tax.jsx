'use client'
import { useState, useMemo } from 'react'
import { SliderInput, StatCard, SectionHead, ContentInsert, DetailTable, FAQ, RelatedCalcs, RecommendationBox } from '../components/shared'
import { inr, inrCompact, round } from '../lib/utils'
import { CONFIG } from '../lib/config'

export default function CryptoTax({ related }) {
  const [buyPrice, setBuyPrice]   = useState(100000)
  const [sellPrice, setSellPrice] = useState(250000)
  const [txnAmount, setTxnAmount] = useState(250000) // for TDS

  const result = useMemo(() => {
    const gain       = sellPrice - buyPrice
    const cfg        = CONFIG.CAPITAL_GAINS.CRYPTO
    const taxOnGain  = gain > 0 ? round(gain * cfg.flatRate) : 0
    const cess       = round(taxOnGain * CONFIG.INCOME_TAX.CESS)
    const totalTax   = round(taxOnGain + cess)
    const tds194S    = round(txnAmount * cfg.tds)
    const netGain    = round(gain - totalTax)

    // No loss offset — crypto losses can't be set off against any income
    return { gain, taxOnGain, cess, totalTax, netGain, tds194S, rate: cfg.flatRate, tdsRate: cfg.tds }
  }, [buyPrice, sellPrice, txnAmount])

  const faq = [
    { q: 'What is the tax rate on crypto in India?', a: 'Under Section 115BBH (Budget 2022), all Virtual Digital Assets (VDA) including crypto, NFTs are taxed at a FLAT 30% on gains. No deduction is allowed except the cost of acquisition. Plus 4% cess = 31.2% effective rate.' },
    { q: 'Can I offset crypto losses against other income?', a: 'No. Crypto losses cannot be set off against any other income — not against salary, FD interest, stock gains, or even other crypto gains. This is the strictest loss treatment in income tax.' },
    { q: 'What is TDS under Section 194S?', a: '1% TDS is deducted on crypto transfers exceeding ₹50,000/year (₹10,000 for specified persons). The exchange deducts this automatically. You can claim it while filing ITR.' },
    { q: 'Is crypto received as gift taxable?', a: 'Yes. Crypto received as a gift (except from specified relatives) exceeding ₹50,000 in value is fully taxable as "income from other sources" at your slab rate — not the 30% rate.' },
    { q: 'Do I need to report crypto even if I made a loss?', a: 'Yes. Crypto transactions must be reported in your ITR under Schedule VDA. Even losses must be reported, though they cannot be offset against other income.' },
  ]

  return (
    <div>
      <div className="bg-amber-50 border border-amber-200 border-l-4 border-l-amber-400 rounded-xl p-3.5 mb-5 text-sm text-amber-800">
        <strong>Flat 30% tax</strong> on all crypto/VDA gains regardless of holding period. No deductions allowed except cost. Plus 4% cess = <strong>31.2% effective rate</strong>.
      </div>

      <SectionHead title="Transaction Details" />
      <div className="card p-5 mb-5">
        <SliderInput label="Purchase Price (Cost of Acquisition)" value={buyPrice} min={1000} max={10000000} step={5000}
          onChange={setBuyPrice} format={inrCompact} hint="Total amount spent buying crypto" />
        <SliderInput label="Selling Price (Sale Value)" value={sellPrice} min={1000} max={10000000} step={5000}
          onChange={setSellPrice} format={inrCompact} />
        <SliderInput label="Transaction Value (for TDS 194S)" value={txnAmount} min={0} max={10000000} step={10000}
          onChange={setTxnAmount} format={inrCompact} hint="Annual crypto transfers on exchange" />
      </div>

      {result.gain <= 0 ? (
        <RecommendationBox
          title={`Loss of ${inr(Math.abs(result.gain))} — No tax, but must still be reported in ITR`}
          body="Crypto losses CANNOT be set off against any other income. Report under Schedule VDA anyway."
          type="warning"
        />
      ) : (
        <RecommendationBox
          title={`Tax payable: ${inr(result.totalTax)} on gain of ${inr(result.gain)}`}
          body={`31.2% effective rate (30% tax + 4% cess). Net gain after tax: ${inr(result.netGain)}`}
          type={result.totalTax > 0 ? 'warning' : 'success'}
        />
      )}

      <div className="grid grid-cols-2 gap-3 mb-5">
        <StatCard label="Capital Gain"   value={inr(result.gain)}     sub={result.gain >= 0 ? 'Profit' : 'Loss'} color={result.gain>=0?'green':'red'} />
        <StatCard label="Tax @ 30%"      value={inr(result.taxOnGain)} sub="Flat rate, no slab"  color="red" />
        <StatCard label="Cess @ 4%"      value={inr(result.cess)}      sub="On tax amount"       />
        <StatCard label="Total Tax"      value={inr(result.totalTax)}  sub="31.2% effective"     color="red" />
        <StatCard label="Net Gain"       value={inr(result.netGain)}   sub="After all taxes"     color="green" />
        <StatCard label="TDS 194S"       value={inr(result.tds194S)}   sub="1% on transaction"  color="blue" />
      </div>

      <DetailTable title="Crypto Tax Computation" rows={[
        { label: 'Purchase Price',      value: inr(buyPrice) },
        { label: 'Sale Price',          value: inr(sellPrice) },
        { label: 'Capital Gain / Loss', value: inr(result.gain), bold: true, color: result.gain >= 0 ? 'text-brand' : 'text-red-500' },
        { label: 'Tax @ 30% (Sec 115BBH)', value: inr(result.taxOnGain), color: 'text-red-500' },
        { label: 'Cess @ 4%',           value: inr(result.cess) },
        { label: 'Total Tax',           value: inr(result.totalTax), bold: true, color: 'text-red-500' },
        { label: 'TDS Deducted (194S)', value: inr(result.tds194S), color: 'text-blue-600' },
        { label: 'Balance Tax to Pay',  value: inr(Math.max(0, result.totalTax - result.tds194S)), bold: true },
        { label: 'Net Gain After Tax',  value: inr(result.netGain), bold: true, color: 'text-brand' },
      ]} />

      <ContentInsert icon="⚠️" title="Crypto losses cannot offset anything — plan ahead"
        body="Unlike stocks (where STCL can offset STCG/LTCG), crypto losses are permanent for that year. Consider booking gains strategically and track every transaction for ITR filing." />

      <RelatedCalcs items={related} />
      <FAQ items={faq} />
    </div>
  )
}
