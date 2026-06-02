import Link from "next/link";

export default function GetAppPage() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-24 text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold text-brand">
        Get the On-Time Taxi app
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        Choose your phone type to continue.
      </p>

      <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/get-app/iphone"
          className="bg-brand text-white px-6 py-3 rounded-lg font-semibold"
        >
          I have an iPhone
        </Link>
        <Link
          href="/get-app/android"
          className="border border-brand text-brand px-6 py-3 rounded-lg font-semibold"
        >
          I have an Android phone
        </Link>
      </div>

      <p className="mt-6 text-sm text-gray-500">
        No app store needed for the main install path.
      </p>
    </section>
  );
}