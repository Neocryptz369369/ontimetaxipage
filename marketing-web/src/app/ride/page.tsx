export default function Drive() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-5xl font-extrabold mb-4">Drive with On-Time Taxi</h1>
      <p className="text-xl text-gray-700 mb-10">Keep more of what you earn. Cash out weekly. Drive when you want.</p>
      <div className="bg-brand text-white rounded-2xl p-8 mb-12">
        <div className="text-3xl font-bold mb-2">80% + 100% tips</div>
        <p>You keep 80 cents of every dollar fare, plus every penny of every tip. Industry-best split.</p>
      </div>
      <h2 className="text-3xl font-bold mb-6">Requirements</h2>
      <ul className="space-y-3 text-lg mb-12">
        <li>✓ Valid US driver's license (1+ year)</li>
        <li>✓ Vehicle 2010 or newer, 4 doors</li>
        <li>✓ Current insurance + registration in your name</li>
        <li>✓ Pass background check (we run it, free)</li>
        <li>✓ Smartphone with GPS</li>
      </ul>
      <h2 className="text-3xl font-bold mb-6">How to apply</h2>
      <ol className="space-y-3 text-lg mb-12 list-decimal pl-6">
        <li>Download the <b>On-Time Taxi Driver</b> app.</li>
        <li>Sign up with your phone number.</li>
        <li>Upload your license, insurance, and vehicle photos.</li>
        <li>Set up direct deposit via Stripe.</li>
        <li>Get approved (most drivers within 48 hours).</li>
        <li>Go online and start earning.</li>
      </ol>
      <div className="flex gap-3">
        <a href="https://apps.apple.com/app/id000" className="bg-brand text-white font-semibold px-6 py-3 rounded-lg">Download (iOS)</a>
        <a href="https://play.google.com/store/apps/details?id=com.ontimetaxi.driver" className="bg-brand text-white font-semibold px-6 py-3 rounded-lg">Download (Android)</a>
      </div>
    </div>
  );
}
