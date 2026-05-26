import './globals.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Sidebar from '../components/Sidebar'

export const metadata = {
  title: { default: 'ComputeMyFin — India\'s Free Finance Calculator', template: '%s | ComputeMyFin' },
  description: 'Free online finance calculators for India. Income tax, SIP, EMI, FD, PPF, capital gains, HRA and 219+ more. FY 2026-27 updated. Zero signup required.',
  keywords: ['income tax calculator india 2026', 'sip calculator', 'emi calculator', 'fd calculator', 'ppf calculator', 'capital gains tax India 2026'],
  authors: [{ name: 'ComputeMyFin' }],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'ComputeMyFin',
    url: 'https://computemyfin.in',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 font-sans">
        <Header />

        {/* DESKTOP: two-column layout | MOBILE: single column */}
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex gap-6 py-6">

            {/* LEFT SIDEBAR — desktop only */}
            <aside className="hidden lg:block w-64 xl:w-72 flex-shrink-0">
              <Sidebar />
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 min-w-0 max-w-2xl mx-auto lg:mx-0">
              {children}
            </main>

            {/* RIGHT RAIL — desktop only (ad space) */}
            <aside className="hidden xl:block w-60 flex-shrink-0">
              <div className="sticky top-20 space-y-4">
                {/* Right rail ad slot 1 — 300x250 */}
                <div className="bg-white border border-gray-100 rounded-2xl p-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Financial Tip</p>
                  <p className="text-sm font-semibold text-gray-800 mb-1">Start SIP today</p>
                  <p className="text-xs text-gray-500 leading-relaxed">₹5,000/month at 12% for 20 years = ₹49.9L. Time in market beats timing the market.</p>
                </div>
                {/* Right rail ad slot 2 — 300x600 */}
                <div className="bg-white border border-gray-100 rounded-2xl p-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Did You Know</p>
                  <p className="text-sm font-semibold text-gray-800 mb-1">Zero tax up to ₹12.75L</p>
                  <p className="text-xs text-gray-500 leading-relaxed">Under new regime FY 2026-27, salaried employees with income up to ₹12,75,000 pay zero income tax.</p>
                </div>
                <div className="bg-brand-light border border-brand/20 rounded-2xl p-4">
                  <p className="text-xs font-bold text-brand uppercase tracking-widest mb-2">Free Tool</p>
                  <p className="text-sm font-semibold text-gray-800 mb-1">Try all 219 calculators</p>
                  <p className="text-xs text-gray-500">Zero signup · Your data stays on your device · Always free</p>
                </div>
              </div>
            </aside>

          </div>
        </div>

        <Footer />
      </body>
    </html>
  )
}
