import "./globals.css";
import Link from "next/link";

export const metadata = { title: "On-Time Taxi · Admin", description: "Operations console" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex">
          <aside className="w-60 bg-brand-ink text-white p-5 space-y-1">
            <div className="text-xl font-extrabold mb-6">On-Time<br/>Taxi <span className="text-brand">·</span> Admin</div>
            <NavLink href="/">Dashboard</NavLink>
            <NavLink href="/rides">Rides</NavLink>
            <NavLink href="/drivers">Drivers</NavLink>
            <NavLink href="/riders">Riders</NavLink>
            <NavLink href="/tiers">Tiers &amp; Pricing</NavLink>
            <NavLink href="/payouts">Payouts</NavLink>
          </aside>
          <main className="flex-1 p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link href={href} className="block px-3 py-2 rounded-lg hover:bg-white/10">{children}</Link>;
}
