import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: 'On Time Taxi — Admin Console',
  description: 'Operations dashboard for On Time Taxi',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <Sidebar />
        <Header />
        <main className="ml-64 pt-20 pb-12">
          <div className="px-6 py-6">{children}</div>
        </main>
      </body>
    </html>
  )
}
