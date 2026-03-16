import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Props {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({
  children,
  requireAdmin = false,
}: Props) {
  const { auth } = useAuth();

  if (!auth?.user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !auth.user.roles?.includes("Admin")) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
