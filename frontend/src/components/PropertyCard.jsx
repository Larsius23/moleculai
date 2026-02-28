export default function PropertyCard({ label, value, unit, pass, description, threshold }) {
  const hasRule = pass !== undefined;
  return (
    <div className={`bg-slate-700 rounded-xl p-4 border ${hasRule ? (pass ? 'border-emerald-600' : 'border-red-500') : 'border-slate-600'}`}>
      <div className="flex justify-between items-start mb-1">
        <span className="text-xs text-slate-400 uppercase tracking-widest">{label}</span>
        {hasRule && (
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${pass ? 'bg-emerald-900 text-emerald-400' : 'bg-red-900 text-red-400'}`}>
            {pass ? 'PASS' : 'FAIL'}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-white">{value} <span className="text-sm font-normal text-slate-400">{unit}</span></div>
      {description && <p className="text-xs text-slate-400 mt-1">{description}</p>}
      {threshold && <p className="text-xs text-slate-500 mt-1">Threshold: {threshold}</p>}
    </div>
  );
}