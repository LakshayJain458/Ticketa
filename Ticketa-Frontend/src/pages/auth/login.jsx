import { useEffect } from "react";
import { useAuth } from "react-oidc-context";

const LoginPage = () => {
  const { isLoading, isAuthenticated, signinRedirect } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      signinRedirect(); // send user to Keycloak login
    }
  }, [isLoading, isAuthenticated, signinRedirect]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <p className="animate-pulse text-lg">Redirecting to login...</p>
    </div>
  );
};

export default LoginPage;
