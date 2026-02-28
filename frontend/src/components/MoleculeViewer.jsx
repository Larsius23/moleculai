export default function MoleculeViewer({ imageBase64, formula, smiles }) {
  return (
    <div className="bg-slate-800 rounded-2xl p-6 shadow-xl">
      <h2 className="text-xl font-semibold text-cyan-400 mb-1">Structure</h2>
      <p className="text-slate-400 text-sm mb-4 font-mono">{formula}</p>
      <div className="bg-white rounded-xl flex items-center justify-center p-2">
        <img src={imageBase64} alt={formula} className="max-w-full h-auto" />
      </div>
      <div className="mt-4">
        <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">SMILES</p>
        <p className="text-xs font-mono text-slate-300 break-all bg-slate-700 p-2 rounded-lg">{smiles}</p>
      </div>
    </div>
  );
}