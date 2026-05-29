export default function Support() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-5xl font-extrabold mb-4">Support</h1>
      <p className="text-xl text-gray-700 mb-10">We're here 24/7.</p>
      <div className="space-y-6">
        <div className="bg-gray-50 rounded-xl p-6"><div className="font-bold text-lg">Riders</div><p>Email <a href="mailto:support@ontimetaxi.com" className="underline">support@ontimetaxi.com</a> — average reply 2 hours.</p></div>
        <div className="bg-gray-50 rounded-xl p-6"><div className="font-bold text-lg">Drivers</div><p>Email <a href="mailto:drivers@ontimetaxi.com" className="underline">drivers@ontimetaxi.com</a> or use Profile → Help in the driver app.</p></div>
        <div className="bg-gray-50 rounded-xl p-6"><div className="font-bold text-lg">Lost something?</div><p>Open the app → Trip history → tap the ride → Report lost item.</p></div>
        <div className="bg-red-50 rounded-xl p-6"><div className="font-bold text-lg text-red-700">Safety emergency</div><p>Always call 911 first. Then email <a href="mailto:safety@ontimetaxi.com" className="underline">safety@ontimetaxi.com</a>.</p></div>
      </div>
    </div>
  );
}
