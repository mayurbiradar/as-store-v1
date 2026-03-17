export const getUserCount = (token?: string) =>
  USER_API.get("/users/count", token ? { headers: { Authorization: `Bearer ${token}` } } : {});
import axios from "axios";
import { API_BASE_URL } from "../constants";

const USER_API = axios.create({
  baseURL: `${API_BASE_URL}/api/auth`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getUsers = async (token?: string) => {
  let accessToken = token || localStorage.getItem('accessToken');
  let refreshTokenValue = localStorage.getItem('refreshToken');
  let attempts = 0;
  while (attempts < 2) {
    try {
      const response = await USER_API.get("/users", accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : {});
      return response;
    } catch (error: any) {
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403) &&
        refreshTokenValue &&
        attempts === 0
      ) {
        // Try to refresh token
        try {
          const { data } = await import('./authApi').then(mod => mod.refreshToken(refreshTokenValue!));
          accessToken = data.accessToken;
          if (accessToken) {
            localStorage.setItem('accessToken', accessToken);
          }
          attempts++;
          continue;
        } catch (refreshError) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
          throw refreshError;
        }
      } else {
        if (error.response) {
          console.error("/users error response:", error.response.status, error.response.data);
        } else {
          console.error("/users error:", error.message);
        }
        throw error;
      }
    }
  }
  // If we get here, refresh failed
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  window.location.href = '/login';
  throw new Error('Unable to refresh token');
};
export const getUser = (id: string, token?: string) => USER_API.get(`/users/${id}`, token ? { headers: { Authorization: `Bearer ${token}` } } : {});
export const createUser = (data: any, token?: string) => USER_API.post("/register", data, token ? { headers: { Authorization: `Bearer ${token}` } } : {});
export const updateUser = (id: string, data: any, token?: string) => USER_API.put(`/users/${id}`, data, token ? { headers: { Authorization: `Bearer ${token}` } } : {});
export const deleteUser = (id: string, token?: string) => USER_API.delete(`/users/${id}`, token ? { headers: { Authorization: `Bearer ${token}` } } : {});
export const changeUserRole = (id: string, role: string, token?: string) => USER_API.patch(`/users/${id}/role`, { role }, token ? { headers: { Authorization: `Bearer ${token}` } } : {});
