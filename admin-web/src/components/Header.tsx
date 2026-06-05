'use client'

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 ml-64 sticky top-0 z-40">
      <div className="px-6 py-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Operations Dashboard</h2>
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
            Profile
          </button>
          <button className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700">
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
