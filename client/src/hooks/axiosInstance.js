import axios from "axios";

export const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL ?? "http://localhost:8080",
  withCredentials: true,
});

export const instanceWithAuth = (token) =>
  axios.create({
    baseURL: import.meta.env.VITE_BASE_URL ?? "http://localhost:8080",
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
