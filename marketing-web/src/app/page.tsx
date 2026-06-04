import Link from "next/link";

export default function Home() {
  const benefits = [
    {
      icon: "⏰",
      title: "Always on time",
      description: "Drivers within 5 minutes in most cities, 24/7."
    },
    {
      icon: "💵",
      title: "Upfront pricing",
      description: "See the exact price before you book. No hidden fees."
    },
    {
      icon: "🛡️",
      title: "Safer rides",
      description: "Background-checked drivers, in-app emergency, and share-trip options."
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-600 to-[#1a4d8f] text-white">
        <div className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
              Get there.<br />On time. Every time.
            </h1>
            <p className="mt-6 text-xl text-white/90">
              Real upfront pricing. Trusted local drivers. No surge surprises hidden in fine print.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link 
                href="/get-app/iphone" 
                className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition"
              >
                Get app for iPhone
              </Link>
              <Link 
                href="/get-app/android" 
                className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition"
              >
                Get app for Android
              </Link>
            </div>
            <p className="mt-4 text-sm text-white/70">
              Need the app?{" "}
              <Link href="/get-app" className="underline hover:text-white">
                Choose your device →
              </Link>
            </p>
          </div>

          {/* Fare Estimator Card */}
          <div className="bg-white text-gray-900 rounded-2xl p-6 shadow-2xl">
            <div className="font-bold text-lg mb-4 text-blue-600">Estimate your fare</div>
            <form onSubmit={(e) => e.preventDefault()}>
              <input 
                type="text" 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-600" 
                placeholder="Pickup address" 
              />
              <input 
                type="text" 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-600" 
                placeholder="Where to?" 
              />
              <button 
                type="submit"
                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
              >
                See price
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-3">No signup required for estimate.</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Why riders pick us</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="text-4xl mb-3">{benefit.icon}</div>
              <div className="font-bold text-lg mb-2 text-gray-900">{benefit.title}</div>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Driver CTA Section */}
      <section className="bg-blue-600 text-white">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl font-bold mb-4">Earn more behind the wheel</h2>
          <p className="text-lg text-white/90 mb-8">
            Keep 80% of every fare + 100% of tips. Weekly direct deposit.
          </p>
          <Link 
            href="/drive" 
            className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg inline-block hover:bg-gray-100 transition"
          >
            Apply to drive →
          </Link>
        </div>
      </section>
    </>
  );
}
