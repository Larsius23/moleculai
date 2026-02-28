import { useState, useEffect } from 'react';
import { getExamples } from '../utils/api';
export default function MoleculeInput({ onSubmit, isLoading }) {
  const [smiles, setSmiles] = useState('');
  const [examples, setExamples] = useState([]);
  useEffect(() => { getExamples().then(setExamples).catch(console.error); }, []);
  const handleSubmit = (e) => { e.preventDefault(); if (smiles.trim()) onSubmit(smiles.trim()); };
  return (
    <div className="bg-slate-800 rounded-2xl p-6 shadow-xl">
      <h2 className="text-xl font-semibold text-cyan-400 mb-4">Input Molecule</h2>
      <form onSubmit={handleSubmit} className="flex gap-3 mb-5">
        <input type="text" value={smiles} onChange={(e) => setSmiles(e.target.value)}
          placeholder="Enter SMILES string... e.g. CC(=O)Oc1ccccc1C(=O)O"
          className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-500" />
        <button type="submit" disabled={isLoading || !smiles.trim()}
          className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold px-5 py-2 rounded-lg transition-colors text-sm">
          {isLoading ? 'Analyzing...' : 'Analyze'}
        </button>
      </form>
      <div>
        <p className="text-xs text-slate-400 mb-2 uppercase tracking-widest">Quick Examples</p>
        <div className="flex flex-wrap gap-2">
          {examples.map((ex) => (
            <button key={ex.name} onClick={() => setSmiles(ex.smiles)}
              className="bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs px-3 py-1.5 rounded-full transition-colors border border-slate-600">
              {ex.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}