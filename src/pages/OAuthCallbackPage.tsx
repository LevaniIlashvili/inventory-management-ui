import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { AuthResponse } from "../types/auth";

export default function OAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setExternalAuth } = useAuth();

  useEffect(() => {
    const encodedData = searchParams.get("data");

    if (encodedData) {
      try {
        let base64 = encodedData.replace(/-/g, "+").replace(/_/g, "/");

        const pad = base64.length % 4;
        if (pad) {
          base64 += new Array(5 - pad).join("=");
        }

        const decodedString = atob(base64);
        const authData: AuthResponse = JSON.parse(decodedString);

        setExternalAuth(authData);

        navigate("/", { replace: true });
      } catch (error) {
        console.error("Failed to parse OAuth data:", error);
        navigate("/login?error=parse_failed", { replace: true });
      }
    } else {
      navigate("/login?error=auth_failed", { replace: true });
    }
  }, [searchParams, navigate, setExternalAuth]);

  return (
    <div className="container mt-5 text-center">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <h3 className="mt-3">Completing login...</h3>
    </div>
  );
}
