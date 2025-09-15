import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { listPublishedEvents } from "@/lib/api";
import PublishedEventCard from "@/components/PublishedEventCard";
import { SimplePagination } from "@/components/SimplePagination";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/Navbar";
import Footer from "../../components/Footer";
import EventConfirmModal from "@/components/ui/EventConfirmModal";

const StaffLandingPage = () => {
  const { isLoading, user } = useAuth();
  const [publishedEvents, setPublishedEvents] = useState(undefined);
  const [page, setPage] = useState(0);
  const [error, setError] = useState(undefined);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    if (isLoading || !user?.access_token) return;

    let active = true;
    const run = async () => {
      try {
        setIsLoadingEvents(true);
        setError(undefined);
        const data = await listPublishedEvents(page, 12);
        if (!active) return;
        setPublishedEvents(data);
      } catch (err) {
        if (!active) return;
        console.error("API Error:", err);
        setError(err?.message || String(err));
        setPublishedEvents(undefined);
      } finally {
        if (active) setIsLoadingEvents(false);
      }
    };

    const timer = setTimeout(run, 100);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [isLoading, user?.access_token, page]);

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black text-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin"></div>
          <p className="text-lg font-semibold text-purple-300">Loading dashboard...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white relative overflow-hidden">
      {/* background glow effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>
      </div>

      <NavBar />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Staff — Event Scanner
            </h1>
            <p className="text-gray-400 mt-2 text-sm sm:text-base">
              Select an event to begin scanning tickets or validate manually.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-400/30 rounded-lg text-red-300">
            {error}
          </div>
        )}

        <section>
          {isLoadingEvents ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-400"></div>
              <span className="mt-4 text-gray-300">Fetching events...</span>
            </div>
          ) : publishedEvents?.content?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
              {publishedEvents.content.map((ev) => (
                <PublishedEventCard
                  key={ev.id}
                  publishedEvent={ev}
                  onCardClick={(evt) => {
                    setSelectedEvent(evt);
                    setConfirmOpen(true);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500 text-lg">
              🚫 No events found
            </div>
          )}
        </section>

        {publishedEvents && (
          <div className="w-full flex justify-center py-12">
            <SimplePagination
              pagination={publishedEvents}
              onPageChange={setPage}
            />
          </div>
        )}
        <EventConfirmModal
          open={confirmOpen}
          eventTitle={selectedEvent?.eventName || selectedEvent?.name}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={() => {
            setConfirmOpen(false);
            if (selectedEvent) navigate(`/dashboard/validate-qr?eventId=${selectedEvent.id}`);
          }}
        />
      </div>

      <Footer />
    </div>
  );
};

export default StaffLandingPage;
