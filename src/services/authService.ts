import { api } from "./api";
import {
  type LoginRequest,
  type RegisterRequest,
  type AuthResponse,
} from "../types/auth";

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
  window.location.href = "https://localhost:7117/api/auth/google";
};

export const facebookLogin = () => {
  window.location.href = "https://localhost:7117/api/auth/facebook";
};
