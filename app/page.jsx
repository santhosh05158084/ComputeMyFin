'use client'
import { useState } from 'react'
import Link from 'next/link'
import { CALCULATORS, CATEGORIES, getPopular, getByCategory } from '../lib/registry'

export default function HomePage() {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  const popular = getPopular()

  const filtered = CALCULATORS.filter(c => {
    const q = search.toLowerCase()
    const matchSearch = !search || c.name.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q)
    const matchTab = activeTab === 'all' || c.cat === activeTab
    return matchSearch && matchTab
  })

  return (
    <div>
      {/* Hero */}
      <div className="text-center py-8 mb-4">
        <div className="inline-flex items-center gap-2 bg-brand-light text-brand text-xs font-semibold px-4 py-1.5 rounded-full border border-brand/20 mb-4">
          <span className="w-1.5 h-1.5 bg-brand rounded-full animate-pulse"/>
          FY 2026-27 updated · 219 calculators
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 leading-tight tracking-tight mb-3">
          India's Most Complete<br/>
          <span className="text-brand">Free Finance Calculator</span>
        </h1>
        <p className="text-gray-500 text-sm max-w-md mx-auto">
          219 calculators · Zero signup · FY 2026-27 · Your data never leaves your device
        </p>
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {['✓ 219 Calculators','✓ ₹0 Cost','✓ FY 2026-27','✓ Zero Data Stored'].map(b => (
            <span key={b} className="text-xs border border-gray-200 rounded-full px-3 py-1 text-gray-500 bg-white">{b}</span>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
        <input type="text" placeholder="Search calculators — try 'EMI', 'SIP', 'capital gains'..."
          value={search} onChange={e => { setSearch(e.target.value); setActiveTab('all') }}
          className="w-full bg-white border border-gray-200 rounded-2xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-brand shadow-sm"
        />
      </div>

      {/* Most Popular — only when no search */}
      {!search && (
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xl font-bold text-gray-900">Most Popular</h2>
            <span className="text-xs bg-brand-light text-brand font-semibold px-3 py-1 rounded-full border border-brand/20">
              Used by 10L+ professionals
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {popular.map(c => (
              <Link key={c.slug} href={`/${c.slug}`}
                className="bg-white border border-gray-100 rounded-2xl p-4 hover:border-brand hover:shadow-md transition-all group">
                <p className="text-2xl mb-2">{CATEGORIES.find(cat => cat.id === c.cat)?.emoji}</p>
                <p className="text-sm font-bold text-gray-900 group-hover:text-brand transition-colors leading-tight">{c.name}</p>
                <p className="text-xs text-gray-400 mt-1 mb-2">{c.desc}</p>
                <p className="text-xs text-brand font-semibold">Calculate now →</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* All Calculators Section */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">All Calculators</h2>

        {/* Category Tabs — horizontal scroll like screenshot */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1" style={{scrollbarWidth:'none'}}>
          <button onClick={() => setActiveTab('all')}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold border transition-colors ${
              activeTab === 'all' ? 'bg-brand text-white border-brand' : 'bg-white border-gray-200 text-gray-600'
            }`}>
            All ({CALCULATORS.length})
          </button>
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setActiveTab(cat.id)}
              className={`flex-shrink-0 px-3 py-2 rounded-full text-xs font-semibold border transition-colors whitespace-nowrap ${
                activeTab === cat.id ? 'bg-brand text-white border-brand' : 'bg-white border-gray-200 text-gray-600'
              }`}>
              {cat.emoji} {cat.label} ({getByCategory(cat.id).length})
            </button>
          ))}
        </div>

        {/* Flat list — matches screenshot style */}
        {activeTab === 'all' && !search ? (
          // Grouped by category when showing all
          <div className="space-y-4">
            {CATEGORIES.map(cat => {
              const calcs = getByCategory(cat.id)
              return (
                <div key={cat.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-3.5 bg-gray-50 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{cat.emoji}</span>
                      <span className="font-bold text-gray-800 text-sm">{cat.label}</span>
                    </div>
                    <span className="text-xs text-gray-400">{calcs.length} calculators</span>
                  </div>
                  {calcs.slice(0, 6).map((c, i) => (
                    <Link key={c.slug} href={`/${c.slug}`}
                      className={`flex items-center justify-between px-5 py-3.5 hover:bg-brand-light group transition-colors ${i < Math.min(calcs.length,6) - 1 ? 'border-b border-gray-50' : ''}`}>
                      <div>
                        <p className="text-sm font-semibold text-gray-800 group-hover:text-brand transition-colors">{c.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{c.desc}</p>
                      </div>
                      <span className="text-gray-300 group-hover:text-brand transition-colors ml-3 flex-shrink-0">→</span>
                    </Link>
                  ))}
                  {calcs.length > 6 && (
                    <button onClick={() => setActiveTab(cat.id)}
                      className="w-full px-5 py-3 text-xs font-bold text-brand text-left hover:bg-brand-light transition-colors border-t border-gray-50">
                      +{calcs.length - 6} more {cat.label} calculators →
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          // Flat list when category selected or searching — matches screenshot exactly
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p className="text-3xl mb-2">🔍</p>
                <p className="font-medium">No calculators found</p>
                <p className="text-sm mt-1">Try a different search term</p>
              </div>
            ) : (
              filtered.map((c, i) => (
                <Link key={c.slug} href={`/${c.slug}`}
                  className={`flex items-center gap-4 px-5 py-4 hover:bg-brand-light group transition-colors ${i < filtered.length - 1 ? 'border-b border-gray-50' : ''}`}>
                  {/* Icon */}
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-lg flex-shrink-0 border border-gray-100">
                    {CATEGORIES.find(cat => cat.id === c.cat)?.emoji}
                  </div>
                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 group-hover:text-brand transition-colors">{c.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">{c.desc}</p>
                  </div>
                  {/* Arrow */}
                  <span className="text-gray-300 group-hover:text-brand transition-colors flex-shrink-0 font-bold">→</span>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
