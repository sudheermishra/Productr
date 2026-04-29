import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5100/api",
});

// Add auth token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("productr_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
