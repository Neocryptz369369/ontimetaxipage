const cities = ["Austin, TX","Dallas, TX","Houston, TX","Phoenix, AZ","Las Vegas, NV","Orlando, FL","Tampa, FL","Nashville, TN","Charlotte, NC"];
export default function Cities() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-5xl font-extrabold mb-4">Cities we serve</h1>
      <p className="text-xl text-gray-700 mb-10">Available 24/7 in:</p>
      <div className="grid md:grid-cols-3 gap-4 mb-12">
        {cities.map(c => <div key={c} className="bg-gray-50 rounded-lg p-4 font-medium">{c}</div>)}
      </div>
      <p className="text-gray-600">Don't see your city? Email <a href="mailto:expansion@ontimetaxi.com" className="underline">expansion@ontimetaxi.com</a> — we add new markets monthly.</p>
    </div>
  );
}
