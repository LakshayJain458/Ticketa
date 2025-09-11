import NavBar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "react-oidc-context";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Sparkles, Ticket, Calendar } from "lucide-react";

const MainLandingPage = () => {
  const { isLoading, isAuthenticated, signinRedirect } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black text-white">
        <p className="animate-pulse text-xl">Loading Ticketa...</p>
      </div>
    );
  }

  return (
    <div className="relative bg-black min-h-screen text-white overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-40 left-20 w-72 h-72 bg-cyan-600/20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-violet-600/20 blur-3xl rounded-full"></div>
      </div>

      <NavBar />

      <main className="container mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
              Discover <span className="text-cyan-400">Events</span> & Manage{" "}
              <span className="text-violet-400">Shows</span> Effortlessly
            </h1>
            <p className="text-gray-400 max-w-lg text-lg">
              Ticketa helps <span className="text-cyan-300">attendees</span> find tickets and{" "}
              <span className="text-violet-300">organisers</span> create, sell & validate them — all in one sleek platform.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => navigate("/events")}
                className="bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/30"
              >
                <Ticket className="mr-2 h-5 w-5" /> Browse Events
              </Button>
              <Button
                onClick={() => navigate("/organizers")}
                className="bg-gray-800 hover:bg-gray-700"
              >
                <Calendar className="mr-2 h-5 w-5" /> For Organizers
              </Button>
              <Button
                onClick={() => signinRedirect()}
                className="bg-transparent border border-white/20 hover:bg-white/10"
              >
                <Sparkles className="mr-2 h-5 w-5" /> Log in
              </Button>
            </div>
          </motion.div>

          {/* Right Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-cyan-700/60 to-violet-700/60 backdrop-blur-xl border border-white/10">
              <img
                src="https://images.unsplash.com/photo-1507404684477-09c7f690976a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODJ8fGNvbmNlcnR8ZW58MHx8MHx8fDA%3D"
                alt="Concert Event"
                className="w-full h-[400px] object-cover opacity-90 hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <h3 className="text-2xl font-bold">🔥 Featured</h3>
                <p className="text-gray-300">
                  Explore trending concerts, comedy shows & cultural events near you.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    <Footer />
    </div>
  );
};

export default MainLandingPage;
