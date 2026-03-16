import { createContext, useContext, useEffect, useState } from "react";
import { login } from "../services/authService";
import type { LoginRequest, AuthResponse } from "../types/auth";

interface AuthContextType {
  auth: AuthResponse | null;
  loginUser: (data: LoginRequest) => Promise<void>;
  logout: () => void;
  setExternalAuth: (data: AuthResponse) => void;
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

  const setExternalAuth = (data: AuthResponse) => {
    localStorage.setItem("auth", JSON.stringify(data));
    setAuth(data);
  };

  useEffect(() => {
    if (auth?.expiration) {
      const expTime = new Date(auth.expiration).getTime();
      const currentTime = new Date().getTime();
      const timeLeft = expTime - currentTime;

      if (timeLeft <= 0) {
        logout();
      } else {
        const timer = setTimeout(() => {
          logout();
          window.location.href = "/login?session_expired=true";
        }, timeLeft);

        return () => clearTimeout(timer);
      }
    }
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, loginUser, logout, setExternalAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("AuthContext missing");
  return context;
};
