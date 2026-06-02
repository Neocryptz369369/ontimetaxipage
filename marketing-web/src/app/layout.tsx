import "./globals.css";
import Link from "next/link";

export const metadata = { 
  title: "On-Time Taxi -- Fast, fair rides on demand", 
  description: "Book a ride in seconds. Real upfront pricing. Trusted local drivers." 
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-brand">
        <header className="border-b bg-white sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="font-extrabold text-xl">🚕 On-Time Taxi</Link>
            <nav className="hidden md:flex gap-6 text-sm font-medium">
              <Link href="/ride">Ride</Link>
              <Link href="/drive">Drive</Link>
              <Link href="/cities">Cities</Link>
              <Link href="/support">Support</Link>
            </nav>
            <Link
              href="/get-app"
              className="bg-brand text-white text-sm px-4 py-2 rounded-lg font-semibold"
            >
              Get app
            </Link>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t mt-20">
          <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-8 text-sm">
            <div>
              <div className="font-bold mb-3">On-Time Taxi</div>
              <p className="text-gray-600">Fast, fair rides on demand.</p>
            </div>
            <div>
              <div className="font-bold mb-3">Company</div>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/about">About</Link></li>
                <li><Link href="/cities">Cities</Link></li>
                <li><Link href="/drive">Drive with us</Link></li>
              </ul>
            </div>
            <div>
              <div className="font-bold mb-3">Help</div>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/support">Support</Link></li>
                <li><Link href="/safety">Safety</Link></li>
                <li><Link href="/lost-found">Lost & found</Link></li>
                <li><Link href="/admin">Admin @</Link></li>
              </ul>
            </div>
            <div>
              <div className="font-bold mb-3">Legal</div>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/terms">Terms</Link></li>
                <li><Link href="/privacy">Privacy</Link></li>
                <li><Link href="/accessibility">Accessibility</Link></li>
              </ul>
            </div>
          </div>
          <div className="text-center text-xs text-gray-500 pb-6">
            <div>© 2026</div>
            <div>Neocryptz LLC</div>
            <div>all rights reserved.</div>
          </div>
        </footer>
      </body>
    </html>
  );
}
