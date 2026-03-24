import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_URL as string,
  withCredentials: true,
});
