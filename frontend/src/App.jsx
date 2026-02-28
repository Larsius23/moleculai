import { useState } from "react";
import MoleculeInput from "./components/MoleculeInput";
import MoleculeViewer from "./components/MoleculeViewer";
import LipinskiPanel from "./components/LipinskiPanel";
import PropertiesPanel from "./components/PropertiesPanel";
import SolubilityCard from "./components/SolubilityCard";
import { predictMolecule } from "./utils/api";

export default function App() {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (smiles) => {
    setIsLoading(true); setError(null);
    try { const data = await predictMolecule(smiles); setResult(data); }
    catch (err) { setError(err.response?.data?.detail || "Something went wrong. Check your SMILES string."); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      <header className="border-b border-slate-700 px-8 py-4 flex items-center gap-3">
        <span className="text-2xl">🧪</span>
        <div>
          <h1 className="text-xl font-bold text-white">MoleculeAI</h1>
          <p className="text-xs text-slate-400">AI-Powered Molecular Property Prediction</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <MoleculeInput onSubmit={handleSubmit} isLoading={isLoading} />

        {error && (
          <div className="bg-red-900 border border-red-600 text-red-300 rounded-xl px-5 py-4 text-sm">{error}</div>
        )}
        {isLoading && (
          <div className="text-center py-16 text-slate-400 text-sm animate-pulse">Analyzing molecule...</div>
        )}

        {result && !isLoading && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <MoleculeViewer imageBase64={result.image_base64} formula={result.formula} smiles={result.smiles} />
              </div>
              <div className="md:col-span-2">
                <LipinskiPanel analysis={result.lipinski_analysis} lipinskiPass={result.lipinski_pass} qedScore={result.qed_score} />
              </div>
            </div>
            <SolubilityCard data={result.solubility_prediction} />
            <PropertiesPanel data={result} />
          </>
        )}

        {!result && !isLoading && !error && (
          <div className="text-center py-20 text-slate-500 text-sm">
            Enter a SMILES string or pick an example molecule to get started.
          </div>
        )}
      </main>
    </div>
  );
}
