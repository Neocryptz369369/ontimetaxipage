import Link from "next/link";

export const metadata = { title: "On-Time Taxi · Driver app · Android" };

export default function Page() {
  return (
    <section className="max-w-3xl mx-auto px-6 py-20">
      <Link href="/" className="text-sm text-blue-600">← Home</Link>
      <h1 className="text-4xl font-extrabold mt-4 text-brand">Driver app · Android</h1>
      <p className="mt-3 text-gray-600">Install the On-Time Taxi driver app on your device.</p>
      <div className="mt-8 bg-white border rounded-2xl p-6 shadow-sm">
          <ol className="list-decimal pl-6 space-y-3 text-gray-700">
            <li>Tap the button below to download the latest On-Time Taxi APK.</li>
            <li>If prompted, allow installs from unknown sources for your browser.</li>
            <li>Open the downloaded APK and tap <b>Install</b>.</li>
            <li>Launch On-Time Taxi from your app drawer.</li>
          </ol>
          <a href="/downloads/ontimetaxi-driver.apk" className="mt-6 inline-block bg-brand text-white font-semibold px-6 py-3 rounded-lg">Download APK</a>
      </div>
    </section>
  );
}
