import axios from "axios";

import { API_URL } from "@/constants";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 5 * 60 * 1000,
  headers: {
    accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const refreshApi = axios.create({
  baseURL: "/api/backend",
  withCredentials: true,
});

let isRefreshing = false;
let queue: (() => void)[] = [];

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    original._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push(() => api(original).then(resolve).catch(reject));
      });
    }

    isRefreshing = true;

    try {
      // 🔥 use refreshApi instead of api
      await refreshApi.post("/user/refresh-cookie");

      queue.forEach((cb) => cb());
      queue = [];

      return api(original);
    } catch (refreshError) {
      queue = [];

      // 🔥 Next.js API route
      await axios.get("/api/auth/logout", { withCredentials: true });

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
