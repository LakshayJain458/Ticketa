import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import { useRoles } from "@/roles/useRoles";

const CallbackPage = () => {
  const { isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const { isLoading: rolesLoading, isOrganizer } = useRoles();

  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated) {
      const redirectPath = localStorage.getItem("redirectPath");
      if (redirectPath) {
        localStorage.removeItem("redirectPath");
        navigate(redirectPath);
        return;
      }

      // If roles are still loading, wait until roles are available
      if (rolesLoading) return;

      // Send organisers to the public organiser landing page instead of dashboard
      if (isOrganizer) {
        navigate("/organizers", { replace: true });
      } else {
        // default fallback (attendees/staff) — keep previous behavior
        navigate("/", { replace: true });
      }
    }
  }, [isLoading, isAuthenticated, rolesLoading, isOrganizer, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p className="animate-pulse text-lg">Processing login...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <p className="text-lg">Completing login...</p>
      <Footer />
    </div>
  );
};

export default CallbackPage;
