import axios from "axios";

const BASE_URL =import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api"
const api=axios.create({
    baseURL:BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // get JWT from localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // attach in header
  }
  return config;
});

export default api;
