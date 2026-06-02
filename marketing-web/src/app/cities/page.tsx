const cities = [
  { name: "Austin, TX", description: "Local taxi rides, airport trips, and scheduled pickups in Austin.", href: "/book" },
  { name: "Charlotte, NC", description: "Local taxi rides, airport trips, and scheduled pickups in Charlotte.", href: "/book" },
  { name: "Dallas, TX", description: "Local taxi rides, airport trips, and scheduled pickups in Dallas.", href: "/book" },
  { name: "Houston, TX", description: "Local taxi rides, airport trips, and scheduled pickups in Houston.", href: "/book" },
  { name: "Las Vegas, NV", description: "Local taxi rides, airport trips, and scheduled pickups in Las Vegas.", href: "/book" },
  { name: "Nashville, TN", description: "Local taxi rides, airport trips, and scheduled pickups in Nashville.", href: "/book" },
  { name: "Orlando, FL", description: "Local taxi rides, airport trips, and scheduled pickups in Orlando.", href: "/book" },
  { name: "Phoenix, AZ", description: "Local taxi rides, airport trips, and scheduled pickups in Phoenix.", href: "/book" },
  { name: "Tampa, FL", description: "Local taxi rides, airport trips, and scheduled pickups in Tampa.", href: "/book" },
];

import Link from "next/link";

export default function CitiesPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-5xl font-extrabold text-brand mb-4">Cities We Serve</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cities.map((city) => (
          <div key={city.name} className="border rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-brand">{city.name}</h2>
            <p className="mt-2 text-gray-600">{city.description}</p>
            <Link
              href={city.href}
              className="inline-block mt-4 bg-brand text-white px-5 py-3 rounded-lg font-semibold"
            >
              Ride in {city.name.split(",")[0]}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}