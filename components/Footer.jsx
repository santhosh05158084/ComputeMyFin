import Link from 'next/link'
import { CATEGORIES, getByCategory } from '../lib/registry'

export default function Footer() {
  const mainCats = ['tax','loans','invest','insurance','realty','business']
  return (
    <footer className="bg-white border-t border-gray-100 mt-12">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-brand rounded-lg flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 64 64" fill="none">
                  <rect x="8" y="36" width="10" height="18" rx="2" fill="white" opacity=".45"/>
                  <rect x="22" y="24" width="10" height="30" rx="2" fill="white" opacity=".65"/>
                  <rect x="36" y="12" width="10" height="42" rx="2" fill="white"/>
                  <circle cx="41" cy="12" r="4" fill="white"/>
                </svg>
              </div>
              <span className="font-bold text-gray-900 text-sm">Compute<span className="text-brand">My</span>Fin</span>
            </Link>
            <p className="text-xs text-gray-500 leading-relaxed mb-3">India's most complete free finance calculator. 219+ calculators · FY 2026-27 · Zero signup.</p>
            <div className="inline-flex items-center gap-1.5 bg-brand-light text-brand text-xs font-semibold px-3 py-1.5 rounded-full border border-brand/20">
              <span className="w-1.5 h-1.5 bg-brand rounded-full"/>Your data never leaves your device
            </div>
          </div>
          {/* Tax + Loans */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Tax</p>
              {getByCategory('tax').slice(0,6).map(c => (
                <Link key={c.slug} href={`/${c.slug}`} className="block text-xs text-gray-500 hover:text-brand py-0.5">{c.name}</Link>
              ))}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Loans</p>
              {getByCategory('loans').slice(0,6).map(c => (
                <Link key={c.slug} href={`/${c.slug}`} className="block text-xs text-gray-500 hover:text-brand py-0.5">{c.name}</Link>
              ))}
            </div>
          </div>
          {/* Invest + Insurance */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Investments</p>
              {getByCategory('invest').slice(0,6).map(c => (
                <Link key={c.slug} href={`/${c.slug}`} className="block text-xs text-gray-500 hover:text-brand py-0.5">{c.name}</Link>
              ))}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">More</p>
              {['insurance','realty','business','utility','nri'].map(cat => {
                const c = CATEGORIES.find(x => x.id === cat)
                return c ? <Link key={cat} href={`/?cat=${cat}`} className="block text-xs text-gray-500 hover:text-brand py-0.5">{c.emoji} {c.label}</Link> : null
              })}
            </div>
          </div>
          {/* Contact */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Contact & Info</p>
            <a href="mailto:computemyfin@gmail.com" className="text-xs text-brand font-semibold block mb-3">📧 computemyfin@gmail.com</a>
            <Link href="/about" className="block text-xs text-gray-500 hover:text-brand py-0.5">About Us</Link>
            <Link href="/privacy" className="block text-xs text-gray-500 hover:text-brand py-0.5">Privacy Policy</Link>
            <Link href="/disclaimer" className="block text-xs text-gray-500 hover:text-brand py-0.5">Disclaimer</Link>
            <p className="text-xs text-gray-400 mt-3 leading-relaxed">For informational purposes only. Consult a CA for professional advice.</p>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400">© 2026 ComputeMyFin · All Rights Reserved · Made with ❤️ in India</p>
          <p className="text-xs text-gray-400">FY 2026-27 · Zero Data Stored · Always Free</p>
        </div>
      </div>
    </footer>
  )
}
