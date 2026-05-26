export const metadata = { title: 'Disclaimer — ComputeMyFin' }
export default function Disclaimer() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">Disclaimer</h1>
      <p className="text-sm text-gray-400 mb-6">Please read carefully before using ComputeMyFin</p>
      <div className="space-y-4 text-sm text-gray-600">
        <div><h3 className="font-bold text-gray-800 mb-1">For Informational Purposes Only</h3><p>All calculators are provided for educational purposes only. Results are estimates and should not be treated as professional financial, tax, or legal advice.</p></div>
        <div><h3 className="font-bold text-gray-800 mb-1">Accuracy</h3><p>We strive for 100% accuracy and update all rates after every Budget. However, tax laws are complex — always verify with a CA or qualified professional for important decisions.</p></div>
        <div><h3 className="font-bold text-gray-800 mb-1">No Liability</h3><p>ComputeMyFin shall not be liable for any financial decisions made based on calculations on this platform.</p></div>
        <div><h3 className="font-bold text-gray-800 mb-1">Found an Error?</h3><p className="font-semibold text-brand">📧 computemyfin@gmail.com</p><p>We fix reported errors within 24 hours.</p></div>
      </div>
    </div>
  )
}
