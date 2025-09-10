import { Button } from "@/components/ui/button";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router";

const OrganizersLandingPage = () => {
  const { isAuthenticated, isLoading, signinRedirect, signoutRedirect } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return <p className="text-white">Loading...</p>;
  }

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Navbar */}
      <div className="flex justify-end p-4 container mx-auto">
        {isAuthenticated ? (
          <div className="flex gap-4">
            <Button
              onClick={() => navigate("/dashboard/events")}
              className="cursor-pointer"
            >
              Dashboard
            </Button>
            <Button
              className="cursor-pointer"
              onClick={() => signoutRedirect()}
            >
              Log out
            </Button>
          </div>
        ) : (
          <div className="flex gap-4">
            <Button className="cursor-pointer" onClick={() => signinRedirect()}>
              Log in
            </Button>
          </div>
        )}
      </div>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
          {/* Left Column */}
          <div className="space-y-6">
            <h1 className="text-5xl font-extrabold leading-tight">
              Create, Manage, and Sell Tickets with Ease
            </h1>
            <p className="text-xl text-gray-300">
              A complete platform for event organizers to create events, sell
              tickets, and validate attendees with QR Codes.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                className="cursor-pointer bg-purple-700 hover:bg-purple-500"
                onClick={() => navigate("/dashboard/events")}
              >
                Create an Event
              </Button>
              <Button className="bg-gray-700 hover:bg-gray-600 cursor-pointer">
                Browse Events
              </Button>
            </div>
          </div>

          {/* Right Column */}
          <div className="bg-gray-800 rounded-3xl shadow-xl overflow-hidden max-w-md mx-auto">
            <img
              src="organizers-landing-hero.png"
              alt="Event concert crowd"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrganizersLandingPage;
