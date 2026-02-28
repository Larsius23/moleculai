export default function SolubilityCard({ data }) {
  const { predicted_logs, interpretation, model_rmse, units } = data;

  const getColor = () => {
    if (predicted_logs > -1) return { bar: "bg-emerald-500", text: "text-emerald-400", border: "border-emerald-600" };
    if (predicted_logs > -3) return { bar: "bg-cyan-500", text: "text-cyan-400", border: "border-cyan-600" };
    if (predicted_logs > -5) return { bar: "bg-yellow-500", text: "text-yellow-400", border: "border-yellow-600" };
    return { bar: "bg-red-500", text: "text-red-400", border: "border-red-600" };
  };

  const color = getColor();

  // Map LogS (-8 to 2) to a percentage for the bar
  const pct = Math.min(100, Math.max(0, ((predicted_logs + 8) / 10) * 100));

  return (
    <div className={`bg-slate-800 rounded-2xl p-6 shadow-xl border ${color.border}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-cyan-400">GNN Solubility Prediction</h2>
        <span className={`text-xs px-3 py-1 rounded-full font-bold bg-slate-700 ${color.text}`}>
          {interpretation}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="bg-slate-700 rounded-xl p-4">
          <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Predicted LogS</p>
          <p className={`text-3xl font-bold ${color.text}`}>{predicted_logs}</p>
          <p className="text-xs text-slate-400 mt-1">{units}</p>
        </div>
        <div className="bg-slate-700 rounded-xl p-4">
          <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Model RMSE</p>
          <p className="text-3xl font-bold text-white">±{model_rmse}</p>
          <p className="text-xs text-slate-400 mt-1">log(mol/L)</p>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>Insoluble (-8)</span>
          <span>Highly Soluble (+2)</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${color.bar}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-500 mt-2">
          <span>Poorly soluble &lt; -5</span>
          <span>Soluble &gt; -3</span>
        </div>
      </div>

      <p className="text-xs text-slate-500 mt-4 italic">
        Predicted by a Graph Neural Network trained on the ESOL dataset (Delaney, 1128 molecules)
      </p>
    </div>
  );
}
