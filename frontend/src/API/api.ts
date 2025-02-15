// src/api.ts
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8001/api'; // Adjust if needed

export const fetchGroceries = async () => {
  const response = await axios.get(`${API_BASE_URL}/groceries/`);
  return response.data;
};
