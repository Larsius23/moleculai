import PropertyCard from './PropertyCard';
export default function LipinskiPanel({ analysis, lipinskiPass, qedScore }) {
  const rules = Object.entries(analysis).map(([key, data]) => ({ key, label: key.replace(/_/g, ' '), ...data }));
  const passCount = rules.filter((r) => r.pass).length;
  return (
    <div className="bg-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-cyan-400">Lipinski Rule of Five</h2>
        <span className={`text-sm font-bold px-3 py-1 rounded-full ${lipinskiPass ? 'bg-emerald-900 text-emerald-400' : 'bg-red-900 text-red-400'}`}>
          {passCount}/4 Rules Passed
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {rules.map((rule) => (
          <PropertyCard key={rule.key} label={rule.label} value={rule.value} pass={rule.pass} description={rule.description} />
        ))}
      </div>
      <div className="bg-slate-700 rounded-xl p-4 border border-slate-600">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-slate-400 uppercase tracking-widest">QED Drug-likeness Score</span>
          <span className="text-xs text-slate-400">0 = less drug-like · 1 = more drug-like</span>
        </div>
        <div className="text-2xl font-bold text-white mb-2">{qedScore}</div>
        <div className="w-full bg-slate-600 rounded-full h-2.5">
          <div className="h-2.5 rounded-full bg-gradient-to-r from-red-500 via-yellow-400 to-emerald-500" style={{ width: `${qedScore * 100}%` }} />
        </div>
      </div>
    </div>
  );
}