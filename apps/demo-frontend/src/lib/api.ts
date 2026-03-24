import axios from "axios";

export const authApi = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_URL as string,
  withCredentials: true,
});

export const demoApi = axios.create({
  baseURL: import.meta.env.VITE_DEMO_API_URL as string,
  withCredentials: true,
});
