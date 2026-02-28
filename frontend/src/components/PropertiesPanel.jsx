import PropertyCard from './PropertyCard';
export default function PropertiesPanel({ data }) {
  const props = [
    { label: 'Molecular Weight', value: data.molecular_weight, unit: 'Da' },
    { label: 'Exact MW', value: data.exact_molecular_weight, unit: 'Da' },
    { label: 'LogP', value: data.logp, unit: '' },
    { label: 'TPSA', value: data.tpsa, unit: 'Å²' },
    { label: 'H-Bond Donors', value: data.h_bond_donors, unit: '' },
    { label: 'H-Bond Acceptors', value: data.h_bond_acceptors, unit: '' },
    { label: 'Rotatable Bonds', value: data.rotatable_bonds, unit: '' },
    { label: 'Aromatic Rings', value: data.aromatic_rings, unit: '' },
    { label: 'Heavy Atoms', value: data.heavy_atoms, unit: '' },
    { label: 'Total Rings', value: data.num_rings, unit: '' },
  ];
  return (
    <div className="bg-slate-800 rounded-2xl p-6 shadow-xl">
      <h2 className="text-xl font-semibold text-cyan-400 mb-4">Molecular Properties</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {props.map((p) => (
          <PropertyCard key={p.label} label={p.label} value={p.value} unit={p.unit} />
        ))}
      </div>
    </div>
  );
}