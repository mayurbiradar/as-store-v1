

import axios from "axios";
import { API_BASE_URL } from "../constants";

export const API = axios.create({
  baseURL: `${API_BASE_URL}/api/auth`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Axios interceptor for handling expired JWT and refreshing token
let refreshAttempts = 0;
API.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403) &&
      refreshAttempts < 5 &&
      localStorage.getItem('refreshToken')
    ) {
      refreshAttempts++;
      originalRequest._retry = true;
      const refresh = localStorage.getItem('refreshToken');
      try {
        // Wait for 10 seconds before refreshing
        await new Promise(resolve => setTimeout(resolve, 10000));
        const res = await API.post('/refresh', refresh);
        localStorage.setItem('accessToken', res.data.accessToken);
        API.defaults.headers.common['Authorization'] = `Bearer ${res.data.accessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${res.data.accessToken}`;
        return API(originalRequest);
      } catch (refreshError) {
        // If refresh token is expired/invalid, call logout API
        try {
          await API.post('/logout', refresh);
        } catch (logoutError) {
          // Ignore logout errors
        }
        window.location.href = '/login';
        refreshAttempts = 0;
        return Promise.reject(refreshError);
      }
    } else if (refreshAttempts >= 3) {
      // Do not clear localStorage, just redirect
      window.location.href = '/login';
      refreshAttempts = 0;
    }
    return Promise.reject(error);
  }
);

export const registerUser = (data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
}) => {
  return API.post("/register", data);
};

export const loginUser = (data: { email: string; password: string }) => {
  return API.post("/login", data);
};

export const refreshToken = (refreshToken: string) => {
  return API.post("/refresh", refreshToken);
};

export const logoutUser = (refreshToken: string) => {
  return API.post("/logout", refreshToken );
};

// Get current user info
export const getMe = (token?: string) => {
  return API.get('/me', token ? { headers: { Authorization: `Bearer ${token}` } } : {});
}