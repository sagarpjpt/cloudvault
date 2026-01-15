import axios from "axios";

// central axios instance for the app
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL + '/api',
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

// later we will add interceptors here (auth, errors)

export default api;
