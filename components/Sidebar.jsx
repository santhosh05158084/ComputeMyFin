'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CATEGORIES, getByCategory } from '../lib/registry'

export default function Sidebar() {
  const pathname = usePathname()
  const currentSlug = pathname?.replace('/', '') || ''
  const [openCat, setOpenCat] = useState(() => {
    // Auto-open category of current calculator
    for (const cat of CATEGORIES) {
      if (getByCategory(cat.id).some(c => c.slug === currentSlug)) return cat.id
    }
    return 'tax' // default open
  })
  const [search, setSearch] = useState('')

  return (
    <div className="sticky top-20 bg-white border border-gray-100 rounded-2xl overflow-hidden" style={{maxHeight:'calc(100vh - 90px)', overflowY:'auto'}}>
      {/* Sidebar header */}
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">219 Calculators</p>
      </div>

      {/* Search */}
      <div className="px-3 py-2 border-b border-gray-100">
        <div className="relative">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input type="text" placeholder="Search..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-7 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand"
          />
        </div>
      </div>

      {/* Category list */}
      <div className="py-1">
        {CATEGORIES.map(cat => {
          const calcs = getByCategory(cat.id).filter(c =>
            !search || c.name.toLowerCase().includes(search.toLowerCase())
          )
          if (calcs.length === 0) return null
          const isOpen = openCat === cat.id || search.length > 0

          return (
            <div key={cat.id}>
              {/* Category header */}
              <button
                onClick={() => setOpenCat(isOpen && !search ? null : cat.id)}
                className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-50 text-left"
              >
                <span className="text-xs font-bold text-gray-600 flex items-center gap-2">
                  <span>{cat.emoji}</span>{cat.label}
                  <span className="text-gray-400 font-normal">({calcs.length})</span>
                </span>
                {!search && <span className="text-gray-400 text-xs">{isOpen ? '↑' : '↓'}</span>}
              </button>

              {/* Calculator items */}
              {isOpen && (
                <div className="bg-gray-50/50">
                  {calcs.map(c => {
                    const isActive = c.slug === currentSlug
                    return (
                      <Link key={c.slug} href={`/${c.slug}`}
                        className={`flex items-center gap-2 px-4 py-2 text-xs border-l-2 transition-colors ${
                          isActive
                            ? 'border-brand bg-brand-light text-brand font-semibold'
                            : 'border-transparent hover:border-brand/30 hover:bg-brand-light text-gray-600 hover:text-brand'
                        }`}
                      >
                        <span className="truncate">{c.name}</span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Sidebar footer */}
      <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
        <p className="text-xs text-gray-400">FY 2026-27 · Updated</p>
        <p className="text-xs text-gray-400">computemyfin@gmail.com</p>
      </div>
    </div>
  )
}
