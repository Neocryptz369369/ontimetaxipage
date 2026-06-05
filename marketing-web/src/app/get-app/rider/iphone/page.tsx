import Link from "next/link";

export const metadata = { title: "On-Time Taxi · Rider app · iPhone" };

export default function Page() {
  return (
    <section className="max-w-3xl mx-auto px-6 py-20">
      <Link href="/" className="text-sm text-blue-600">← Home</Link>
      <h1 className="text-4xl font-extrabold mt-4 text-brand">Rider app · iPhone</h1>
      <p className="mt-3 text-gray-600">Install the On-Time Taxi rider app on your device.</p>
      <div className="mt-8 bg-white border rounded-2xl p-6 shadow-sm">
          <ol className="list-decimal pl-6 space-y-3 text-gray-700">
            <li>Open this page in <b>Safari</b> on your iPhone.</li>
            <li>Tap the <b>Share</b> icon at the bottom of the screen.</li>
            <li>Scroll down and tap <b>Add to Home Screen</b>.</li>
            <li>Tap <b>Add</b> in the upper-right corner.</li>
            <li>Launch On-Time Taxi from your home screen.</li>
          </ol>
      </div>
    </section>
  );
}
