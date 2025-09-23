import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://www.thesportsdb.com/api/v1/json/3',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
