import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api",
  headers: { Accept: "application/json" },
  withCredentials: true,
});

// Automatically attach token if present
API.interceptors.request.use((req) => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // fail silently
  }
  return req;
});

export default API;
