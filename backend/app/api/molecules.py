from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.molecule_service import (
    get_basic_properties,
    get_molecule_image,
    get_lipinski_analysis
)

router = APIRouter()


# --- Request / Response Schemas ---

class SMILESRequest(BaseModel):
    smiles: str

    class Config:
        json_schema_extra = {
            "example": {"smiles": "CC(=O)Oc1ccccc1C(=O)O"} # Aspirin SMILES
        }

class MoleculeResponse(BaseModel):
    smiles: str
    formula: str
    molecular_weight: float
    exact_molecular_weight: float
    logp: float
    h_bond_donors: int
    h_bond_acceptors: int
    tpsa: float
    rotatable_bonds: int
    aromatic_rings: int
    heavy_atoms: int
    num_rings: int
    lipinski_pass: bool
    qed_score: float
    lipinski_analysis: dict
    image_base64: str


# --- Endpoints ---

@router.post("/predict", response_model=MoleculeResponse)
def predict_properties(request: SMILESRequest):
    """
    Accepts a SMILES string and returns computed molecular properties.
    """
    try:
        props = get_basic_properties(request.smiles)
        image = get_molecule_image(request.smiles)
        lipinski = get_lipinski_analysis(props)

        return {
            **props,
            "lipinski_analysis": lipinski,
            "image_base64": image
        }
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Computation error: {str(e)}")


@router.get("/molecule/examples")
def get_example_molecules():
    """Returns example molecules to try in the UI."""
    return {
        "examples": [
            {"name": "Aspirin", "smiles": "CC(=O)Oc1ccccc1C(=O)O"},
            {"name": "Ibuprofen", "smiles": "CC(C)Cc1ccc(cc1)C(C)C(=O)O"},
            {"name": "Caffeine", "smiles": "Cn1cnc2c1c(=O)n(c(=O)n2C)C"},
            {"name": "Paracetamol", "smiles": "CC(=O)Nc1ccc(O)cc1"},
            {"name": "Penicillin G", "smiles": "CC1(C)SC2C(NC(=O)Cc3ccccc3)C(=O)N2C1C(=O)O"},
        ]
    }