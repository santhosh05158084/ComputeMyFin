import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <p className="text-5xl mb-4">🧮</p>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Calculator Not Found
      </h1>
      <p className="text-gray-500 mb-6">
        This calculator might be coming soon or the URL is incorrect.
      </p>
      <Link href="/"
        className="bg-brand text-white font-semibold px-6 py-3 rounded-xl hover:bg-brand-dark transition-colors">
        Browse All 219 Calculators →
      </Link>
    </div>
  )
}
