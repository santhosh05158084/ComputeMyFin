'use client'
import { useState } from 'react'
import Link from 'next/link'
import { CATEGORIES, getByCategory } from '../lib/registry'
import { CONFIG } from '../lib/config'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [openCat, setOpenCat] = useState('tax')

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-brand rounded-xl flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 64 64" fill="none">
                <rect x="8" y="36" width="10" height="18" rx="2" fill="white" opacity="0.45"/>
                <rect x="22" y="24" width="10" height="30" rx="2" fill="white" opacity="0.65"/>
                <rect x="36" y="12" width="10" height="42" rx="2" fill="white"/>
                <circle cx="41" cy="12" r="4" fill="white"/>
                <path d="M13 36 L27 24 L41 12" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5"/>
              </svg>
            </div>
            <span className="text-base font-bold text-gray-900 tracking-tight">
              Compute<span className="text-brand">My</span>Fin
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="hidden sm:flex text-xs font-semibold bg-brand-light text-brand px-3 py-1 rounded-full border border-brand/20">
              FY {CONFIG.FY}
            </span>
            <button onClick={() => setMenuOpen(true)}
              className="w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-xl hover:bg-gray-50">
              <span className="w-5 h-0.5 bg-gray-600 rounded"/>
              <span className="w-5 h-0.5 bg-gray-600 rounded"/>
              <span className="w-5 h-0.5 bg-gray-600 rounded"/>
            </button>
          </div>
        </div>
      </header>

      {/* Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)}/>
          <div className="relative ml-auto w-80 bg-white h-full overflow-y-auto shadow-2xl">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-brand rounded-lg flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 64 64" fill="none">
                    <rect x="8" y="36" width="10" height="18" rx="2" fill="white" opacity="0.45"/>
                    <rect x="22" y="24" width="10" height="30" rx="2" fill="white" opacity="0.65"/>
                    <rect x="36" y="12" width="10" height="42" rx="2" fill="white"/>
                    <circle cx="41" cy="12" r="4" fill="white"/>
                  </svg>
                </div>
                <span className="font-bold text-gray-900">Compute<span className="text-brand">My</span>Fin</span>
              </div>
              <button onClick={() => setMenuOpen(false)} className="text-gray-400 text-xl font-light">✕</button>
            </div>

            {/* Category tabs */}
            <div className="px-5 pt-4">
              {CATEGORIES.map(cat => {
                const calcs = getByCategory(cat.id)
                const isOpen = openCat === cat.id
                return (
                  <div key={cat.id}>
                    <button
                      onClick={() => setOpenCat(isOpen ? null : cat.id)}
                      className="w-full flex items-center justify-between py-3 border-b border-gray-50"
                    >
                      <span className="font-semibold text-sm text-gray-800">{cat.emoji} {cat.label}</span>
                      <span className="text-gray-400 text-sm">{isOpen ? '↑' : '↓'}</span>
                    </button>
                    {isOpen && (
                      <div className="py-2 pl-2">
                        {calcs.map(c => (
                          <Link key={c.slug} href={`/${c.slug}`}
                            onClick={() => setMenuOpen(false)}
                            className="block py-2 px-3 rounded-xl hover:bg-brand-light group">
                            <p className="text-sm font-medium text-gray-700 group-hover:text-brand">{c.name}</p>
                            <p className="text-xs text-gray-400">{c.desc}</p>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="px-5 py-4 mt-2 border-t border-gray-100">
              <p className="text-xs text-gray-400">© 2026 ComputeMyFin · Made with ❤️ in India</p>
              <p className="text-xs text-gray-300 mt-1">Your data never leaves your device</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
