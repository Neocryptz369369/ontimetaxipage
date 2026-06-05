import Link from "next/link";

export const metadata = { title: "On-Time Taxi · Rider app for iPhone" };

export default function Page() {
  return (
    <>
      <section className="bg-gradient-to-b from-blue-600 to-[#1a4d8f] text-white">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <Link href="/" className="text-sm text-white/80 hover:text-white">← Home</Link>
          <h1 className="text-5xl md:text-6xl font-extrabold mt-4">Rider app<br/>for iPhone</h1>
          <p className="mt-4 text-xl text-white/90">Install On-Time Taxi for riders on your iPhone.</p>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-blue-600 mb-6">How to install</h2>
            <ol className="list-decimal pl-6 space-y-3 text-gray-800">
              <li>Open this page in <b>Safari</b> on your iPhone.</li>
              <li>Tap the <b>Share</b> icon at the bottom of the screen.</li>
              <li>Scroll down and tap <b>Add to Home Screen</b>.</li>
              <li>Tap <b>Add</b> in the upper-right corner.</li>
              <li>Launch On-Time Taxi from your home screen.</li>
            </ol>
            
          </div>
          <div className="mt-6 text-sm text-gray-600">
            Wrong device? <Link href="/" className="text-blue-600 underline">Back to home</Link>
          </div>
        </div>
      </section>
    </>
  );
}
