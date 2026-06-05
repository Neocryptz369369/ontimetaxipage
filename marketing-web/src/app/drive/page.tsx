export default function Drive() {
  return (
    <>
      <section className="bg-gradient-to-b from-blue-600 to-[#1a4d8f] text-white">
        <div className="max-w-5xl mx-auto px-6 py-24 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">Drive with On-Time Taxi</h1>
          <p className="mt-6 text-xl text-white/90 max-w-2xl mx-auto">
            Keep more of what you earn. Cash out weekly. Drive when you want.
          </p>
          <div className="mt-10 flex flex-wrap gap-3 justify-center">
            <a href="https://apps.apple.com/app/id000" className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg">Download (iOS)</a>
            <a href="https://play.google.com/store/apps/details?id=com.ontimetaxi.driver" className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-semibold px-6 py-3 rounded-lg">Download (Android)</a>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="bg-gradient-to-r from-blue-600 to-[#1a4d8f] text-white rounded-2xl p-8 mb-12 shadow-lg">
            <div className="text-3xl font-bold mb-2">80% + 100% tips</div>
            <p className="text-white/90">You keep 80 cents of every dollar fare, plus every penny of every tip. Industry-best split.</p>
          </div>

          <h2 className="text-3xl font-bold mb-6 text-blue-700">Requirements</h2>
          <ul className="space-y-3 text-lg mb-12 text-gray-800">
            <li>✓ Valid US driver&apos;s license (1+ year)</li>
            <li>✓ Vehicle 2010 or newer, 4 doors</li>
            <li>✓ Current insurance + registration in your name</li>
            <li>✓ Pass background check (we run it, free)</li>
            <li>✓ Smartphone with GPS</li>
          </ul>

          <h2 className="text-3xl font-bold mb-6 text-blue-700">How to apply</h2>
          <ol className="space-y-3 text-lg mb-12 list-decimal pl-6 text-gray-800">
            <li>Download the <b>On-Time Taxi Driver</b> app.</li>
            <li>Sign up with your phone number.</li>
            <li>Upload your license, insurance, and vehicle photos.</li>
            <li>Set up direct deposit via Stripe.</li>
            <li>Get approved (most drivers within 48 hours).</li>
            <li>Go online and start earning.</li>
          </ol>

          <div className="flex flex-wrap gap-3">
            <a href="https://apps.apple.com/app/id000" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg">Download (iOS)</a>
            <a href="https://play.google.com/store/apps/details?id=com.ontimetaxi.driver" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg">Download (Android)</a>
          </div>
        </div>
      </section>
    </>
  );
}
