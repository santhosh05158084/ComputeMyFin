export const metadata = { title: 'About — ComputeMyFin', description: 'About ComputeMyFin — India\'s most complete free finance calculator platform.' }
export default function About() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">About ComputeMyFin</h1>
      <p className="text-sm text-gray-400 mb-6">India's most complete free finance calculator platform</p>
      <div className="prose prose-sm text-gray-600 space-y-4">
        <p>ComputeMyFin was built with one mission: give every Indian access to accurate, free, and instant financial calculators — without signup, without data collection, without confusion.</p>
        <h3 className="text-base font-bold text-gray-800 mt-6">What We Offer</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>219+ calculators covering every aspect of Indian personal finance</li>
          <li>100% accurate formulas from IT Act, RBI guidelines, EPFO rules</li>
          <li>Updated after every Union Budget and quarterly rate revision</li>
          <li>Zero signup — your data never leaves your device</li>
          <li>Mobile and desktop friendly</li>
        </ul>
        <h3 className="text-base font-bold text-gray-800 mt-6">Contact Us</h3>
        <p>Have a suggestion or found an error?</p>
        <p className="font-semibold text-brand">📧 computemyfin@gmail.com</p>
        <p className="text-xs text-gray-400 mt-6">ComputeMyFin is a free educational tool. All calculations are for informational purposes only. Consult a qualified professional for personal financial advice.</p>
      </div>
    </div>
  )
}
