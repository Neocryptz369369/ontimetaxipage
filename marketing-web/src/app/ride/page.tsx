import Link from "next/link";

export default function RidePage() {
  return (
    <>
      <section className="bg-gradient-to-b from-brand to-[1a4d8f] text-white">
        <div className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
              Ride with On-Time Taxi
            </h1>
            <p className="mt-6 text-xl text-white/90">
              Book a safe, simple ride when you need to go anywhere in the city.
            </p>

            <div className="mt-8">
              <h2 className="text-2xl font-bold">Need a ride now or later?</h2>
              <p className="mt-3 text-white/90 max-w-2xl">
                We offer local rides, airport trips, scheduled pickups, and simple
                booking from your phone.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/book"
                className="bg-white text-brand font-semibold px-6 py-3 rounded-lg"
              >
                Book a ride
              </Link>
              <Link
                href="/get-app"
                className="border border-white text-white font-semibold px-6 py-3 rounded-lg"
              >
                Get the app
              </Link>
            </div>

            <p className="mt-8 text-sm text-white/80">
              Need help booking? Contact support and we’ll help you get your ride set up.
            </p>
          </div>

          <div className="bg-white text-brand rounded-2xp-6 shadow-2xl">
            <h3 className="text-xl font-bold mb-4">Why riders choose us</h3>
            <ul className="space-y-3 text-base">
              <li>Fast local rides</li>
              <li>Airport pickup and drop-off</li>
              <li>Simple booking</li>
              <li>Friendly drivers</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}