import { useAuth } from "react-oidc-context";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const { isLoading, isAuthenticated, error, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyan-400"></div>
        <span className="ml-4 text-lg">Authenticating...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 text-red-400">
        <p>Authentication Error: {error.message}</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // save redirect path for after login
    localStorage.setItem(
      "redirectPath",
      globalThis.location.pathname + globalThis.location.search
    );
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 🔑 Role check
  const roles = user?.profile?.realm_access?.roles || [];
  if (role && !roles.includes(role)) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 text-red-400">
        <p>Access Denied: You don’t have permission to view this page.</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
