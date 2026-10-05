import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminRoute({ children }) {
  const { user, isLoadingAuth, authChecked } = useAuth();
  const location = useLocation();

  if (!authChecked || isLoadingAuth) {
    return <div className="p-12 text-center" role="status">Checking administrator access…</div>;
  }

  if (!user) {
    return <Navigate to={`/login?returnTo=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (user.role !== "Admin") return <Navigate to="/" replace />;

  return children;
}
