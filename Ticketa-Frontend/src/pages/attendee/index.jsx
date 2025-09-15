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
  const [isSearching, setIsSearching] = useState(false);

  // Debounce timer ref (implicit with closure)
  useEffect(() => {
    // When query changes, reset to first page
    setPage(0);
  }, [query]);

  useEffect(() => {
    let active = true;
    const run = async () => {
      try {
        if (query && query.trim().length > 0) {
          setIsSearching(true);
          const data = await searchPublishedEvents(query.trim(), page);
          if (active) setPublishedEvents(data);
        } else {
          setIsSearching(true);
          const data = await listPublishedEvents(page);
          if (active) setPublishedEvents(data);
        }
      } catch (err) {
        if (active) setError(err?.message || "An unknown error occurred");
      } finally {
        if (active) setIsSearching(false);
      }
    };

    // debounce (250ms)
    const handle = setTimeout(run, 250);
    return () => {
      active = false;
      clearTimeout(handle);
    };
  }, [query, page]);

  // old query/refresh helpers removed in favor of unified effect

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
              <div className="relative flex-1">
                <Search className="h-4 w-4 text-gray-600 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  className="w-full pl-9 bg-white/90 text-black placeholder-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500"
                  placeholder="Search events by name, location, or type..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                {isSearching && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 animate-pulse">Searching...</span>
                )}
              </div>
              <Button
                // disabled
                className="rounded-xl bg-blue-500 opacity-60 flex items-center gap-2"
                title="Type to search"
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
