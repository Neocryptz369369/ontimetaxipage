export default function Ride() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-5xl font-extrabold mb-4">Ride with On-Time Taxi</h1>
      <p className="text-xl text-gray-700 mb-10">
        Book a safe, simple ride when you need to go anywhere in the city.
      </p>

      <div className="bg-brand text-white rounded-2xl p-8 mb-12">
        <div className="text-3xl font-bold mb-2">Need a ride now or later?</div>
        <p>
          We offer local rides, airport trips, scheduled pickups, and simple booking from your phone.
        </p>
      </div>

      <h2 className="text-3xl font-bold mb-6">Why riders choose us</h2><ul className="space-y-3 text-lg mb-12">
        <li>Fast local rides</li>
        <li>Airport pickup and drop-off</li>
        <li>Simple booking</li>
        <li>Friendly drivers</li>
      </ul>

      <h2 className="text-3xl font-bold mb-6">Need help booking?</h2>
      <p className="text-lg mb-12">
        Contact support and we’ll help you get your ride set up.
      </p>

      <div className="flex gap-3">
        <a href="/book" className="bg-brand text-white font-semibold px-6 py-3 rounded-lg">
          Book a ride
        </a>
        <a href="/get-app" className="bg-brand text-white font-semibold px-6 py-3 rounded-lg">
          Get the app
        </a>
      </div>
    </div>
  );
}
