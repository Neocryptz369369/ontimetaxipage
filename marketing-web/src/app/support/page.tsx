export default function Support() {
  return (
    <>
      <section className="bg-gradient-to-b from-blue-600 to-[#1a4d8f] text-white">
        <div className="max-w-5xl mx-auto px-6 py-24 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">Support</h1>
          <p className="mt-6 text-xl text-white/90">We&apos;re here 24/7.</p>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
              <div className="font-bold text-lg text-blue-700">Riders</div>
              <p className="text-gray-700 mt-1">Email <a href="mailto:support@ontimetaxi.com" className="underline text-blue-600">support@ontimetaxi.com</a> — average reply 2 hours.</p>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
              <div className="font-bold text-lg text-blue-700">Drivers</div>
              <p className="text-gray-700 mt-1">Email <a href="mailto:drivers@ontimetaxi.com" className="underline text-blue-600">drivers@ontimetaxi.com</a> or use Profile → Help in the driver app.</p>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
              <div className="font-bold text-lg text-blue-700">Lost something?</div>
              <p className="text-gray-700 mt-1">Open the app → Trip history → tap the ride → Report lost item.</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="font-bold text-lg text-red-700">Safety emergency</div>
              <p className="text-gray-700 mt-1">Always call 911 first. Then email <a href="mailto:safety@ontimetaxi.com" className="underline text-red-700">safety@ontimetaxi.com</a>.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
