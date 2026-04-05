import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${getToken()}` }
});

export const registerUser  = (data) => axios.post(`${BASE}/auth/register`, data);
export const loginUser     = (data) => axios.post(`${BASE}/auth/login`, data);
export const fetchAllWords = () => axios.get(`${BASE}/words`, authHeaders());
export const searchWord    = (word) => axios.get(`${BASE}/words/search/${word}`, authHeaders());
export const addWord       = (data) => axios.post(`${BASE}/words`, data, authHeaders());
export const deleteWord    = (id) => axios.delete(`${BASE}/words/${id}`, authHeaders());