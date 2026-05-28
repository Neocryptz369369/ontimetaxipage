export default function Dashboard() {
  const stats = [
    { label:'Active rides',  v:'24',   sub:'live' },
    { label:'Online drivers',v:'47',   sub:'of 89' },
    { label:'Today revenue', v:'$3,240', sub:'+12% vs yest' },
    { label:'Avg ETA',       v:'5.2m', sub:'Clark County' },
  ];
  return (
    <main className="p-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold"><span className="text-ottYellow">On Time</span> Taxi</h1>
          <p className="text-gray-400 text-sm">Operations dashboard · Clark County, IN</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-ottYellow text-ottBlack px-4 py-2 rounded-lg font-semibold">+ New driver</button>
        </div>
      </header>

      <section className="grid grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-ottSlate rounded-2xl p-5">
            <div className="text-gray-400 text-xs uppercase">{s.label}</div>
            <div className="text-ottYellow text-3xl font-extrabold mt-1">{s.v}</div>
            <div className="text-gray-500 text-xs mt-1">{s.sub}</div>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-ottSlate rounded-2xl p-6">
          <h2 className="font-bold mb-4">Live rides</h2>
          <table className="w-full text-sm">
            <thead className="text-gray-400 text-left text-xs"><tr><th className="py-2">Rider</th><th>Driver</th><th>Tier</th><th>Status</th><th>Fare</th></tr></thead>
            <tbody>
              {[
                ['Jordan T.','Mike R.','Standard','In progress','$18.50'],
                ['Sarah K.','Lisa D.','XL','Arriving','$26.00'],
                ['Tom B.','Carl P.','Country Run','Accepted','$24.00'],
                ['Maria L.','—','Long Haul','Dispatching','$185.00'],
              ].map((r,i)=>(<tr key={i} className="border-t border-gray-800"><td className="py-3">{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td><span className="bg-ottGreen/20 text-ottGreen px-2 py-1 rounded text-xs">{r[3]}</span></td><td className="text-ottYellow font-bold">{r[4]}</td></tr>))}
            </tbody>
          </table>
        </div>
        <div className="bg-ottSlate rounded-2xl p-6">
          <h2 className="font-bold mb-4">Driver leaderboard</h2>
          {[
            ['Mike R.', 142, 4.9],
            ['Lisa D.', 128, 4.95],
            ['Carl P.', 98, 4.8],
            ['Dana M.', 87, 4.85],
          ].map((d,i)=>(
            <div key={i} className="flex justify-between py-2 border-t border-gray-800 first:border-0">
              <div className="font-semibold">{d[0]}</div>
              <div className="text-gray-400 text-sm">${d[1]} · ⭐{d[2]}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
