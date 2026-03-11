import { createContext, useContext, useState } from "react";
import { login } from "../services/authService";
import type { LoginRequest, AuthResponse } from "../types/auth";

interface AuthContextType {
  auth: AuthResponse | null;
  loginUser: (data: LoginRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<AuthResponse | null>(() => {
    const stored = localStorage.getItem("auth");
    return stored ? JSON.parse(stored) : null;
  });

  const loginUser = async (data: LoginRequest) => {
    const res = await login(data);

    localStorage.setItem("auth", JSON.stringify(res));
    setAuth(res);
  };

  const logout = () => {
    localStorage.removeItem("auth");
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("AuthContext missing");
  return context;
};
