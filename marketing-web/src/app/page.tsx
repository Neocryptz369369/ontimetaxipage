import Link from "next/link";
export default function Home() {
  return (
    <>
      <section className="bg-gradient-to-b from-brand to-[#1a4d8f] text-white">
        <div className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">Get there.<br/>On time. Every time.</h1>
            <p className="mt-6 text-xl text-white/90">Real upfront pricing. Trusted local drivers. No surge surprises hidden in fine print.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="https://apps.apple.com/app/id000" className="bg-white text-brand font-semibold px-6 py-3 rounded-lg">Download for iPhone</a>
              <a href="https://play.google.com/store/apps/details?id=com.ontimetaxi.rider" className="bg-white text-brand font-semibold px-6 py-3 rounded-lg">Get on Google Play</a>
            </div>
            <p className="mt-4 text-sm text-white/70">No app? <Link href="/book" className="underline">Book on the web →</Link></p>
          </div>
          <div className="bg-white text-brand rounded-2xl p-6 shadow-2xl">
            <div className="font-bold text-lg mb-4">Estimate your fare</div>
            <input className="w-full border rounded-lg px-3 py-2 mb-3" placeholder="Pickup address" />
            <input className="w-full border rounded-lg px-3 py-2 mb-3" placeholder="Where to?" />
            <button className="w-full bg-brand text-white font-semibold py-3 rounded-lg">See price</button>
            <p className="text-xs text-gray-500 mt-3">No signup required for estimate.</p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Why riders pick us</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[["⏱️","Always on time","Drivers within 5 minutes in most cities, 24/7."],["💰","Upfront pricing","See the exact price before you book. No hidden fees."],["🛡️","Safer rides","Background-checked drivers, in-app emergency, share-trip with friends."]].map(([e,t,d])=>(
            <div key={t} className="bg-gray-50 rounded-2xl p-6"><div className="text-4xl mb-3">{e}</div><div className="font-bold text-lg mb-2">{t}</div><p className="text-gray-600">{d}</p></div>
          ))}
        </div>
      </section>

      <section className="bg-brand text-white">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl font-bold mb-4">Earn more behind the wheel</h2>
          <p className="text-lg text-white/90 mb-8">Keep 80% of every fare + 100% of tips. Weekly direct deposit.</p>
          <Link href="/drive" className="bg-white text-brand font-semibold px-8 py-3 rounded-lg inline-block">Apply to drive →</Link>
        </div>
      </section>
    </>
  );
}
