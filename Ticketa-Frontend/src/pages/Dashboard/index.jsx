import { useEffect } from "react";
import { useRoles } from "../../roles/useRoles";
import { useNavigate } from "react-router";
import Footer from "@/components/Footer";

const DashboardPage = () => {
  const { isLoading, isOrganizer, isStaff } = useRoles();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;

    if (isOrganizer) {
      navigate("/dashboard/events", { replace: true });
    } else if (isStaff) {
      navigate("/dashboard/validate-qr", { replace: true });
    } else {
      navigate("/dashboard/tickets", { replace: true });
    }
  }, [isLoading, isOrganizer, isStaff, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <p className="text-gray-400">Redirecting to your dashboard...</p>
  <Footer />
    </div>
  );
};

export default DashboardPage;
