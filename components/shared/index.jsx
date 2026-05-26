'use client'
import { useState } from 'react'

// ── SLIDER INPUT (for rupee amounts) ─────────────────────────────
export function SliderInput({ label, value, min, max, step = 1, onChange, format, hint }) {
  const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-gray-600">{label}</label>
        <input
          type="number"
          value={value}
          onChange={e => { const n = parseFloat(e.target.value); if (!isNaN(n) && n >= 0) onChange(n) }}
          className="w-28 text-right text-sm font-bold text-gray-900 border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:border-brand bg-white"
        />
      </div>
      <input type="range" min={min} max={max} step={step} value={Math.min(value, max)}
        onChange={e => onChange(Number(e.target.value))}
        style={{ '--val': `${pct}%` }} className="w-full accent-brand h-1" />
      <div className="flex justify-between mt-1">
        <span className="text-xs text-gray-400">{format ? format(min) : `₹${min.toLocaleString('en-IN')}`}</span>
        <span className="text-xs text-gray-400">{format ? format(max) : `₹${max.toLocaleString('en-IN')}`}</span>
      </div>
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  )
}

// ── SLIDER PLAIN (for %, years, counts) ──────────────────────────
export function SliderPlain({ label, value, min, max, step = 1, onChange, suffix = '', hint }) {
  const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-gray-600">{label}</label>
        <div className="flex items-center gap-1">
          <input type="number" value={value} min={min} max={max} step={step}
            onChange={e => { const n = parseFloat(e.target.value); if (!isNaN(n)) onChange(Math.min(max, Math.max(min, n))) }}
            className="w-16 text-right text-sm font-bold text-gray-900 border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:border-brand bg-white"
          />
          {suffix && <span className="text-xs text-gray-500 font-medium whitespace-nowrap">{suffix}</span>}
        </div>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ '--val': `${pct}%` }} className="w-full accent-brand h-1" />
      <div className="flex justify-between mt-1">
        <span className="text-xs text-gray-400">{min}{suffix}</span>
        <span className="text-xs text-gray-400">{max}{suffix}</span>
      </div>
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  )
}

// ── SELECT INPUT ─────────────────────────────────────────────────
export function SelectInput({ label, value, options, onChange }) {
  return (
    <div className="mb-5">
      <label className="text-sm font-medium text-gray-600 block mb-2">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-brand bg-white">
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

// ── STAT CARD ─────────────────────────────────────────────────────
export function StatCard({ label, value, sub, color = 'default', large = false }) {
  const colors = { default:'text-gray-900', green:'text-brand', blue:'text-blue-600', amber:'text-amber-600', red:'text-red-500' }
  return (
    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">{label}</p>
      <p className={`font-bold ${large ? 'text-2xl' : 'text-xl'} ${colors[color]} leading-tight`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}

// ── SECTION HEAD ─────────────────────────────────────────────────
export function SectionHead({ title }) {
  return <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 mt-6">{title}</p>
}

// ── INFO BOX ─────────────────────────────────────────────────────
export function InfoBox({ children }) {
  return (
    <div className="bg-brand-light border border-brand/20 border-l-4 border-l-brand rounded-xl p-3.5 mb-5 text-sm text-brand-dark leading-relaxed">
      {children}
    </div>
  )
}

// ── CONTENT INSERT (ad space disguised as useful content) ─────────
export function ContentInsert({ icon = '💡', title, body }) {
  return (
    <div className="flex gap-3 bg-gray-50 border border-gray-100 rounded-2xl p-4 my-5">
      <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center text-lg flex-shrink-0">{icon}</div>
      <div>
        <p className="text-sm font-semibold text-gray-800">{title}</p>
        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{body}</p>
      </div>
    </div>
  )
}

// ── CONTENT INSERT WIDE (leaderboard ad slot) ─────────────────────
export function ContentInsertWide({ title, body }) {
  return (
    <div className="bg-gradient-to-r from-brand-light to-white border border-brand/15 rounded-2xl p-4 my-5">
      <p className="text-xs font-bold uppercase tracking-widest text-brand mb-1">Financial Insight</p>
      <p className="text-sm font-semibold text-gray-800">{title}</p>
      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{body}</p>
    </div>
  )
}

// ── FAQ ACCORDION ─────────────────────────────────────────────────
export function FAQ({ items }) {
  const [open, setOpen] = useState(null)
  return (
    <div className="mt-8 mb-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden">
            <button onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left">
              <span className="text-sm font-semibold text-gray-800 pr-4">{item.q}</span>
              <span className={`text-gray-400 text-base flex-shrink-0 transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`}>↓</span>
            </button>
            {open === i && (
              <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-3">{item.a}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── RELATED CALCULATORS ───────────────────────────────────────────
export function RelatedCalcs({ items }) {
  if (!items || items.length === 0) return null
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Related Calculators</h2>
      <div className="space-y-2">
        {items.map((c, i) => (
          <a key={i} href={`/${c.slug}`}
            className="flex items-center justify-between bg-white border border-gray-100 rounded-2xl px-5 py-3.5 hover:border-brand transition-colors group">
            <div>
              <p className="text-sm font-semibold text-gray-800 group-hover:text-brand transition-colors">{c.name}</p>
              <p className="text-xs text-gray-400">{c.desc}</p>
            </div>
            <span className="text-gray-300 group-hover:text-brand transition-colors ml-3">→</span>
          </a>
        ))}
      </div>
    </div>
  )
}

// ── RECOMMENDATION BOX ────────────────────────────────────────────
export function RecommendationBox({ title, body, type = 'success' }) {
  const styles = {
    success: 'bg-brand-light border-brand text-brand-dark',
    warning: 'bg-amber-50 border-amber-400 text-amber-800',
    info:    'bg-blue-50 border-blue-400 text-blue-800',
  }
  return (
    <div className={`border-2 rounded-2xl p-4 my-5 ${styles[type]}`}>
      <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-1">Recommendation</p>
      <p className="text-base font-bold">{title}</p>
      {body && <p className="text-sm mt-1 opacity-80">{body}</p>}
    </div>
  )
}

// ── DETAIL TABLE ──────────────────────────────────────────────────
export function DetailTable({ title, rows }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mt-5">
      {title && <div className="px-5 py-3 border-b border-gray-50"><p className="text-sm font-bold text-gray-800">{title}</p></div>}
      <table className="w-full text-sm">
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={`border-b border-gray-50 last:border-0 ${row.bold ? 'bg-gray-50' : ''}`}>
              <td className="px-5 py-3 text-gray-500">{row.label}</td>
              {row.cols ? row.cols.map((c, j) => (
                <td key={j} className={`px-4 py-3 text-right font-${row.bold ? 'bold' : 'medium'} text-gray-900`}>{c}</td>
              )) : (
                <td className={`px-5 py-3 text-right font-${row.bold ? 'bold' : 'medium'} ${row.color || 'text-gray-900'}`}>{row.value}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── TABS ──────────────────────────────────────────────────────────
export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-2 mb-5 flex-wrap">
      {tabs.map(t => (
        <button key={t.value} onClick={() => onChange(t.value)}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
            active === t.value ? 'bg-brand text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}>
          {t.label}
        </button>
      ))}
    </div>
  )
}

// ── PDF EXPORT BUTTON ─────────────────────────────────────────────
export function ExportPDFButton({ calcName, data }) {
  const handleExport = () => {
    // Build a clean print-friendly HTML
    const rows = data.map(r =>
      `<tr style="border-bottom:1px solid #eee">
        <td style="padding:8px 12px;color:#666;font-size:13px">${r.label}</td>
        <td style="padding:8px 12px;text-align:right;font-weight:${r.bold?'700':'500'};font-size:13px;color:${r.color||'#111'}">${r.value || (r.cols ? r.cols.join(' / ') : '')}</td>
      </tr>`
    ).join('')

    const html = `<!DOCTYPE html><html><head>
      <title>${calcName} — ComputeMyFin</title>
      <style>
        body{font-family:-apple-system,sans-serif;max-width:600px;margin:40px auto;color:#111;padding:20px}
        .header{border-bottom:3px solid #0F9B6E;padding-bottom:16px;margin-bottom:24px}
        .logo{font-size:20px;font-weight:800;color:#111}.logo span{color:#0F9B6E}
        .title{font-size:22px;font-weight:700;margin:8px 0 4px}
        .meta{font-size:12px;color:#888}
        table{width:100%;border-collapse:collapse;margin-bottom:24px}
        th{background:#0F9B6E;color:white;padding:10px 12px;text-align:left;font-size:13px}
        .footer{border-top:1px solid #eee;padding-top:16px;font-size:11px;color:#999;text-align:center}
        @media print{body{margin:0;padding:20px}}
      </style>
    </head><body>
      <div class="header">
        <div class="logo">Compute<span>My</span>Fin</div>
        <div class="title">${calcName}</div>
        <div class="meta">Generated on ${new Date().toLocaleDateString('en-IN', {day:'numeric',month:'long',year:'numeric'})} · FY 2026-27 · computemyfin.in</div>
      </div>
      <table><thead><tr><th>Component</th><th style="text-align:right">Value</th></tr></thead>
      <tbody>${rows}</tbody></table>
      <div class="footer">ComputeMyFin · computemyfin@gmail.com · For informational purposes only. Consult a professional for financial advice.</div>
    </body></html>`

    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const win = window.open(url, '_blank')
    if (win) {
      win.onload = () => {
        win.print()
        URL.revokeObjectURL(url)
      }
    }
  }

  return (
    <button onClick={handleExport}
      className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:border-brand hover:text-brand transition-colors">
      <span>⬇</span> Export PDF
    </button>
  )
}

// ── SHARE BUTTONS ─────────────────────────────────────────────────
export function ShareButtons({ calcName }) {
  const url = typeof window !== 'undefined' ? window.location.href : ''
  const text = `Check out ${calcName} on ComputeMyFin — India's free finance calculator`

  const handleNativeShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: calcName, text, url })
    } else {
      await navigator.clipboard.writeText(url)
      alert('Link copied to clipboard!')
    }
  }

  const shareWhatsApp = () => window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank')
  const shareTwitter = () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')

  return (
    <div className="flex items-center gap-2">
      <button onClick={handleNativeShare}
        className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:border-brand hover:text-brand transition-colors">
        ↗ Share
      </button>
      <button onClick={shareWhatsApp}
        className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:border-green-500 hover:text-green-600 transition-colors">
        WhatsApp
      </button>
      <button onClick={shareTwitter}
        className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:border-blue-400 hover:text-blue-500 transition-colors">
        Twitter
      </button>
    </div>
  )
}

// ── CALCULATOR WRAPPER (share + export row) ───────────────────────
export function CalcToolbar({ calcName, exportData }) {
  return (
    <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
      <ShareButtons calcName={calcName} />
      {exportData && <ExportPDFButton calcName={calcName} data={exportData} />}
    </div>
  )
}
