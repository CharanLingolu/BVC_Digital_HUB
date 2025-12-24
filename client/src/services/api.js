import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// 🔐 Attach token EVERY request
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token"); // ✅ ONLY THIS

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
  },
  (error) => Promise.reject(error)
);

export default API;
