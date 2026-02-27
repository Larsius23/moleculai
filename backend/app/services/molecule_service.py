from rdkit import Chem
from rdkit.Chem import Descriptors, rdMolDescriptors, Draw, AllChem
from rdkit.Chem.FilterCatalog import FilterCatalog, FilterCatalogParams
import base64
from io import BytesIO

def parse_smiles(smiles: str):
    """Parse SMILES string and return RDKit mol object."""
    mol = Chem.MolFromSmiles(smiles)
    if mol is None:
        raise valueError(f"Invalid SMILES string: {smiles}")
    return mol

def get_basic_properties(smiles: str) -> dict:
    """
    Compute core molecular properties from a SMILES string.
    Returns a dict of properties relevant to drug discovery.
    """
    mol = parse_smiles(smiles)

    # --- Core Descriptors ---
    mw = Descriptors.MolWt(mol)
    exact_mw = Descriptors.ExactMolWt(mol)
    logp = Descriptors.MolLogP(mol)
    hbd = rdMolDescriptors.CalcNumHBD(mol)    # H-bond donors
    hba = rdMolDescriptors.CalcNumHBA(mol)    # H-bond acceptors
    tpsa = Descriptors.TPSA(mol)              # Topological Polar Surface Area
    rotatable_bonds = rdMolDescriptors.CalcNumRotatableBonds(mol)
    aromatic_rings = rdMolDescriptors.CalcNumAromaticRings(mol)
    heavy_atoms = mol.GetNumHeavyAtoms()
    rings = rdMolDescriptors.CalcNumRings(mol)

    # --- Lipinski's Rule of Five ---
    lipinski_pass = (
        mw <= 500 and
        logp <= 5 and
        hbd <= 5 and
        hba <= 10
    )

    # --- Drug-likeness Score (QED) ---
    from rdkit.Chem import QED
    qed_score = QED.qed(mol)

    # --- Molecular Formula ---
    formula = rdMolDescriptors.CalcMolFormula(mol)

    return {
        "smiles": smiles,
        "formula": formula,
        "molecular_weight": round(mw, 3),
        "exact_molecular_weight": round(exact_mw, 3),
        "logp": round(logp, 3),
        "h_bond_donors": hbd,
        "h_bond_acceptors": hba,
        "tpsa": round(tpsa, 3),
        "rotatable_bonds": rotatable_bonds,
        "aromatic_rings": aromatic_rings,
        "heavy_atoms": heavy_atoms,
        "num_rings": rings,
        "lipinski_pass": lipinski_pass,
        "qed_score": round(qed_score, 4),
    }

def get_molecule_image(smiles: str, size: tuple = (400, 300)) -> str:
    """
    Generate a 2D depiction of the molecule.
    Returns a base64-encoded PNG string for the frontend.
    """
    mol = parse_smiles(smiles)
    AllChem.Compute2DCoords(mol)

    img = Draw.MolToImage(mol, size=size)
    buffer = BytesIO()
    img.save(buffer, format="PNG")
    encoded = base64.b64encode(buffer.getvalue()).decode("utf-8")
    return f"data:image/png;base64,{encoded}"

def get_lipinski_analysis(properties: dict) -> dict:
    """
    Detailed Lipinski Rule of Five analysis with per-rule pass/fail.
    """
    return {
        "molecular_weight": {
            "value": properties["molecular_weight"],
            "threshold": 500,
            "pass": properties["molecular_weight"] <= 500,
            "description": "MW ≤ 500 Da"
        },
        "logp": {
            "value": properties["logp"],
            "threshold": 5,
            "pass": properties["logp"] <= 5,
            "description": "LogP ≤ 5 (lipophilicity)"
        },
        "h_bond_donors": {
            "value": properties["h_bond_donors"],
            "threshold": 5,
            "pass": properties["h_bond_donors"] <= 5,
            "description": "H-bond donors ≤ 5"
        },
        "h_bond_acceptors": {
            "value": properties["h_bond_acceptors"],
            "threshold": 10,
            "pass": properties["h_bond_acceptors"] <= 10,
            "description": "H-bond acceptors ≤ 10"
        },
    }