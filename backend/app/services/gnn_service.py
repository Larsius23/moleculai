import torch
import torch.nn.functional as F
from torch.nn import Linear, BatchNorm1d
from torch_geometric.nn import GCNConv, global_mean_pool
from torch_geometric.data import Data
from rdkit import Chem
import json
import os

# ── Model Architecture (must match training exactly) ──────────────────────────
class SolubilityGNN(torch.nn.Module):
    def __init__(self, in_channels, hidden_channels=64, out_channels=1):
        super(SolubilityGNN, self).__init__()
        self.conv1 = GCNConv(in_channels, hidden_channels)
        self.conv2 = GCNConv(hidden_channels, hidden_channels)
        self.conv3 = GCNConv(hidden_channels, hidden_channels)
        self.bn1 = BatchNorm1d(hidden_channels)
        self.bn2 = BatchNorm1d(hidden_channels)
        self.bn3 = BatchNorm1d(hidden_channels)
        self.fc1 = Linear(hidden_channels, 32)
        self.fc2 = Linear(32, out_channels)

    def forward(self, x, edge_index, batch):
        x = self.conv1(x, edge_index)
        x = self.bn1(x)
        x = F.relu(x)
        x = F.dropout(x, p=0.1, training=self.training)
        x = self.conv2(x, edge_index)
        x = self.bn2(x)
        x = F.relu(x)
        x = self.conv3(x, edge_index)
        x = self.bn3(x)
        x = F.relu(x)
        x = global_mean_pool(x, batch)
        x = self.fc1(x)
        x = F.relu(x)
        x = self.fc2(x)
        return x.squeeze()

# ── Featurization (must match training exactly) ───────────────────────────────
def atom_features(atom):
    return [
        atom.GetAtomicNum(),
        atom.GetDegree(),
        atom.GetFormalCharge(),
        int(atom.GetHybridization()),
        int(atom.GetIsAromatic()),
        atom.GetTotalNumHs(),
        int(atom.IsInRing()),
    ]

def smiles_to_graph(smiles: str):
    mol = Chem.MolFromSmiles(smiles)
    if mol is None:
        raise ValueError(f"Invalid SMILES: {smiles}")
    x = torch.tensor([atom_features(a) for a in mol.GetAtoms()], dtype=torch.float)
    edges = []
    for bond in mol.GetBonds():
        i, j = bond.GetBeginAtomIdx(), bond.GetEndAtomIdx()
        edges += [[i, j], [j, i]]
    if not edges:
        raise ValueError("Molecule has no bonds")
    edge_index = torch.tensor(edges, dtype=torch.long).t().contiguous()
    batch = torch.zeros(x.shape[0], dtype=torch.long)
    return x, edge_index, batch

# ── Model Loader ──────────────────────────────────────────────────────────────
_model = None
_metadata = None

def get_model():
    global _model, _metadata
    if _model is None:
        model_path = os.path.join(os.path.dirname(__file__), "../models/solubility_gnn.pt")
        meta_path  = os.path.join(os.path.dirname(__file__), "../models/solubility_gnn_metadata.json")
        with open(meta_path) as f:
            _metadata = json.load(f)
        _model = SolubilityGNN(
            in_channels=_metadata["in_channels"],
            hidden_channels=_metadata["hidden_channels"]
        )
        _model.load_state_dict(torch.load(model_path, map_location="cpu"))
        _model.eval()
    return _model, _metadata

# ── Public Prediction Function ────────────────────────────────────────────────
def predict_solubility(smiles: str) -> dict:
    model, metadata = get_model()
    x, edge_index, batch = smiles_to_graph(smiles)
    with torch.no_grad():
        log_s = model(x, edge_index, batch).item()

    # Interpret the LogS value
    if log_s > -1:
        interpretation = "Highly soluble"
    elif log_s > -3:
        interpretation = "Soluble"
    elif log_s > -5:
        interpretation = "Moderately soluble"
    else:
        interpretation = "Poorly soluble"

    return {
        "predicted_logs": round(log_s, 4),
        "units": "log(mol/L)",
        "interpretation": interpretation,
        "model_rmse": metadata["test_rmse"],
        "model": metadata["model"],
    }
