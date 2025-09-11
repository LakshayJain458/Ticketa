import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import NavBar from "@/components/Navbar";
import { useNavigate } from "react-router";

const OrganizersLandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-black min-h-screen text-white">
      <NavBar />

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
                onClick={() => navigate("/dashboard/events/create")}
              >
                Create an Event
              </Button>
              <Button
                className="bg-gray-700 hover:bg-gray-600 cursor-pointer"
                onClick={() => navigate("/dashboard/events")}
              >
                Your Events
              </Button>
            </div>
          </div>

          {/* Right Column */}
          <div className="bg-gray-800 rounded-3xl shadow-xl overflow-hidden max-w-md mx-auto">
            <img
              src="https://plus.unsplash.com/premium_photo-1661306437817-8ab34be91e0c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y29uY2VydHxlbnwwfHwwfHx8MA%3D%3D"
              alt="Event concert crowd"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrganizersLandingPage;
