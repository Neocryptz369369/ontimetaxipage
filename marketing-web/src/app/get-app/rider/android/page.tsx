import Link from "next/link";

export const metadata = { title: "On-Time Taxi · Rider app for Android" };

export default function Page() {
  return (
    <>
      <section className="bg-gradient-to-b from-blue-600 to-[#1a4d8f] text-white">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <Link href="/" className="text-sm text-white/80 hover:text-white">← Home</Link>
          <h1 className="text-5xl md:text-6xl font-extrabold mt-4">Rider app<br/>for Android</h1>
          <p className="mt-4 text-xl text-white/90">Install On-Time Taxi for riders on your Android.</p>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-blue-600 mb-6">How to install</h2>
            <ol className="list-decimal pl-6 space-y-3 text-gray-800">
              <li>Tap the <b>Download APK</b> button below.</li>
              <li>If prompted, allow installs from your browser.</li>
              <li>Open the downloaded file and tap <b>Install</b>.</li>
              <li>Launch On-Time Taxi from your app drawer.</li>
            </ol>
            <a href="/downloads/ontimetaxi-rider.apk" className="mt-6 inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition shadow">Download APK</a>
          </div>
          <div className="mt-6 text-sm text-gray-600">
            Wrong device? <Link href="/" className="text-blue-600 underline">Back to home</Link>
          </div>
        </div>
      </section>
    </>
  );
}
