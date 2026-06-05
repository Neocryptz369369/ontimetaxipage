'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
  { name: 'Dashboard', href: '/' },
  { name: 'Rides', href: '/rides' },
  { name: 'Drivers', href: '/drivers' },
  { name: 'Riders', href: '/riders' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Payouts', href: '/payouts' },
  { name: 'Zones', href: '/zones' },
  { name: 'Settings', href: '/settings' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold">🚖 On Time Taxi</h1>
        <p className="text-xs text-gray-400 mt-1">Admin Console</p>
      </div>
      
      <nav className="p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="absolute bottom-4 left-4 right-4 p-3 bg-gray-800 rounded-lg text-xs">
        <p className="text-gray-400">Status: <span className="text-green-400">Online</span></p>
      </div>
    </aside>
  )
}
