import { api } from "./api";
import {
  type LoginRequest,
  type RegisterRequest,
  type AuthResponse,
} from "../types/auth";

const API_URL = import.meta.env.VITE_API_URL;

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

export const register = async (
  data: RegisterRequest,
): Promise<AuthResponse> => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

export const googleLogin = () => {
  window.location.href = `${API_URL}/api/auth/google`;
};

export const facebookLogin = () => {
  window.location.href = `${API_URL}/api/auth/facebook`;
};
