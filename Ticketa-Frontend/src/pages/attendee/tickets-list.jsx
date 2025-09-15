import NavBar from "@/components/Navbar";
import { SimplePagination } from "@/components/SimplePagination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { listTickets } from "@/lib/api";
import { AlertCircle, DollarSign, Tag, Ticket } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { useRoles } from "@/roles/useRoles";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";

const DashboardListTicketsPage = () => {
  const { isLoading, user } = useAuth();

  const [tickets, setTickets] = useState({
    content: [],
    number: 0,
    totalPages: 0,
    first: true,
    last: true,
  });
  const [error, setError] = useState(undefined);
  const [page, setPage] = useState(0);
  const { isAttendee, isOrganizer, isLoading: rolesLoading } = useRoles();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading || !user?.access_token) return;
    // allow access for attendees or organisers (organisers see tickets for their events)
    if (!rolesLoading && !isAttendee && !isOrganizer) {
      navigate("/");
      return;
    }

    const fetchTickets = async () => {
      try {
        setTickets(await listTickets(user.access_token, page));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      }
    };

    fetchTickets();
  }, [isLoading, user?.access_token, page]);

  const formatStatusBadge = (status) => {
    switch (status) {
      case "PURCHASED":
        return "bg-green-600/80 text-green-100";
      case "CANCELLED":
        return "bg-red-600/80 text-red-100";
      default:
        return "bg-gray-700 text-gray-200";
    }
  };

  if (isLoading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center text-white">
        <p className="animate-pulse">Loading tickets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black min-h-screen text-white">
        <NavBar />
        <div className="max-w-xl mx-auto mt-12">
          <Alert variant="destructive" className="bg-gray-900 border-red-700">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white flex flex-col">
      <NavBar />

      {/* --- Hero Section --- */}
      <div className="text-center py-12 bg-gradient-to-b from-gray-900/50 to-transparent">
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
          Your Tickets
        </h1>
        <p className="text-gray-400 mt-4">
          All the tickets you’ve purchased — securely stored in one place.
        </p>
      </div>

      {/* --- Tickets Grid --- */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        {tickets?.content.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Ticket className="h-12 w-12 mb-4 text-gray-600" />
            <p className="text-lg">No tickets purchased yet.</p>
            <Link
              to="/events"
              className="mt-6 px-6 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 transition"
            >
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tickets.content.map((ticketItem) => (
              <Link
                key={ticketItem.id}
                to={`/dashboard/tickets/${ticketItem.id}`}
              >
                <Card
                  className="bg-gray-900/80 text-white 
             border border-white/10 
             rounded-xl shadow-md 
             hover:shadow-cyan-500/20 hover:scale-[1.02] 
             transition-all duration-300 cursor-pointer"
                >
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      {/* Ticket Name */}
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <Ticket className="h-5 w-5 text-cyan-400" />
                          <h3 className="font-bold text-lg text-white">
                            {ticketItem.ticketType.name}
                          </h3>
                        </div>
                        {/* Show event name for context if available */}
                        {ticketItem.eventName || ticketItem.event?.name ? (
                          <p className="text-sm text-gray-400 mt-1">
                            {ticketItem.eventName || ticketItem.event?.name}
                          </p>
                        ) : null}
                      </div>

                      {/* Status */}
                      <span
                        className={`px-2 py-1 rounded-lg text-xs font-semibold tracking-wide ${formatStatusBadge(
                          ticketItem.status
                        )}`}
                      >
                        {ticketItem.status}
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Price */}
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-green-400" />
                      <p className="font-semibold text-white">
                        ${ticketItem.ticketType.price}
                      </p>
                    </div>

                    {/* Ticket ID */}
                    <div className="flex items-center gap-2">
                      <Tag className="h-5 w-5 text-violet-400" />
                      <div>
                        <h4 className="font-medium text-white">Ticket ID</h4>
                        <p className="text-gray-400 font-mono text-sm">
                          {ticketItem.id}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* --- Pagination --- */}
      <div className="flex justify-center pb-12 mt-auto">
        {tickets && (
          <SimplePagination pagination={tickets} onPageChange={setPage} />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default DashboardListTicketsPage;
