import axios from 'axios';
const BASE_URL = 'http://localhost:8000/api/v1';
export const predictMolecule = async (smiles) => {
  const response = await axios.post(`${BASE_URL}/predict`, { smiles });
  return response.data;
};
export const getExamples = async () => {
  const response = await axios.get(`${BASE_URL}/molecule/examples`);
  return response.data.examples;
};