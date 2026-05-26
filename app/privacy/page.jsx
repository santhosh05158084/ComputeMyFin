export const metadata = { title: 'Privacy Policy — ComputeMyFin' }
export default function Privacy() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-400 mb-6">Last updated: January 2026</p>
      <div className="space-y-4 text-sm text-gray-600">
        <div><h3 className="font-bold text-gray-800 mb-1">Your Data Stays on Your Device</h3><p>All calculations happen entirely in your browser. We do not collect, store, or transmit any of your financial data to our servers.</p></div>
        <div><h3 className="font-bold text-gray-800 mb-1">What We Don't Collect</h3><ul className="list-disc pl-5 space-y-1"><li>Your income or salary details</li><li>Investment amounts or portfolio information</li><li>Loan amounts or EMI details</li><li>Any personally identifiable information</li></ul></div>
        <div><h3 className="font-bold text-gray-800 mb-1">Cookies</h3><p>We use minimal cookies only for site functionality. No tracking cookies. No advertising cookies without your consent.</p></div>
        <div><h3 className="font-bold text-gray-800 mb-1">Advertising</h3><p>We display contextual advertisements through Google AdSense. Google may use cookies to show relevant ads. You can opt out via Google's ad settings.</p></div>
        <div><h3 className="font-bold text-gray-800 mb-1">Contact</h3><p className="font-semibold text-brand">📧 computemyfin@gmail.com</p></div>
      </div>
    </div>
  )
}
