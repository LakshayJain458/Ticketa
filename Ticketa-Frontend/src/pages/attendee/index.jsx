import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { AlertCircle, Search } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import NavBar from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import PublishedEventCard from "@/components/PublishedEventCard";
import { SimplePagination } from "@/components/SimplePagination";
import Footer from "@/components/Footer";

import { listPublishedEvents, searchPublishedEvents } from "@/lib/api";

const AttendeeLandingPage = () => {
  const { isAuthenticated, isLoading, signinRedirect, signoutRedirect } =
    useAuth();
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [publishedEvents, setPublishedEvents] = useState(undefined);
  const [error, setError] = useState(undefined);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (query && query.length > 0) {
      queryPublishedEvents();
    } else {
      refreshPublishedEvents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const refreshPublishedEvents = async () => {
    try {
      setPublishedEvents(await listPublishedEvents(page));
    } catch (err) {
      setError(err?.message || "An unknown error occurred");
    }
  };

  const queryPublishedEvents = async () => {
    if (!query) {
      await refreshPublishedEvents();
      return;
    }
    try {
      setPublishedEvents(await searchPublishedEvents(query, page));
    } catch (err) {
      setError(err?.message || "An unknown error occurred");
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Alert variant="destructive" className="bg-gray-900 border-red-700">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="animate-pulse text-xl">Loading events...</p>
      </div>
    );
  }

  return (
    <div className="relative bg-black min-h-screen text-white overflow-hidden">
      {/* glowing background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-40 left-20 w-72 h-72 bg-cyan-600/20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-violet-600/20 blur-3xl rounded-full"></div>
      </div>

      {/* --- Navbar --- */}
      <NavBar />

      {/* --- Hero Section --- */}
      {/* --- Hero Section --- */}
      <section className="container mx-auto px-4 mb-16">
        <div className="relative bg-[url('/organizers-landing-hero.png')] bg-cover rounded-2xl bg-center overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
          <div className="relative z-10 p-10 md:p-16 flex flex-col items-center text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-3xl md:text-5xl font-extrabold mb-6"
            >
              Find <span className="text-cyan-400">Tickets</span> to Your Next{" "}
              <span className="text-violet-400">Event</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="flex gap-2 w-full max-w-xl"
            >
              <Input
                className="flex-1 bg-white/90 text-black placeholder-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500"
                placeholder="Search events by name, location, or type..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Button
                onClick={queryPublishedEvents}
                className="rounded-xl bg-cyan-600 hover:bg-cyan-500 transition flex items-center gap-2"
              >
                <Search className="h-4 w-4" /> Search
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- Events Grid --- */}
      <section className="container mx-auto px-4">
        {publishedEvents?.content?.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {publishedEvents?.content?.map((publishedEvent, i) => (
              <motion.div
                key={publishedEvent.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <PublishedEventCard publishedEvent={publishedEvent} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <p>No events found. Try a different search.</p>
          </div>
        )}
      </section>

      {/* --- Pagination --- */}
      {publishedEvents && (
        <div className="w-full flex justify-center py-12">
          <SimplePagination
            pagination={publishedEvents}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* --- Footer --- */}
      <Footer />
    </div>
  );
};

export default AttendeeLandingPage;
