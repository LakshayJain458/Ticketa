import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { AlertCircle, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import NavBar from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import PublishedEventCard from "@/components/PublishedEventCard";
import { SimplePagination } from "@/components/SimplePagination";

import {
  listPublishedEvents,
  searchPublishedEvents,
} from "@/lib/api";

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
        <p className="animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white">
      {/* --- Navbar --- */}
      <NavBar />

      {/* --- Hero Section --- */}
      <div className="container mx-auto px-4 mb-12">
        <div className="relative bg-[url('/organizers-landing-hero.png')] bg-cover min-h-[280px] rounded-2xl bg-center overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
          <div className="relative z-10 p-10 md:p-16">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">
              Find Tickets to Your Next Event
            </h1>
            <div className="flex gap-2 max-w-xl">
              <Input
                className="bg-white/90 text-black placeholder-gray-600 rounded-xl"
                placeholder="Search events..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Button
                onClick={queryPublishedEvents}
                className="rounded-xl bg-cyan-500 hover:bg-cyan-600 transition"
              >
                <Search />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* --- Events Grid --- */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {publishedEvents?.content?.map((publishedEvent) => (
            <PublishedEventCard
              publishedEvent={publishedEvent}
              key={publishedEvent.id}
            />
          ))}
        </div>
      </div>

      {/* --- Pagination --- */}
      {publishedEvents && (
        <div className="w-full flex justify-center py-12">
          <SimplePagination pagination={publishedEvents} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
};

export default AttendeeLandingPage;
