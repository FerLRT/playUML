import axios from "axios";

export const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL ?? "http://localhost:3000",
  withCredentials: true,
});

export const instanceWithAuth = (token) =>
  axios.create({
    baseURL: import.meta.env.VITE_BASE_URL ?? "http://localhost:3000",
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
