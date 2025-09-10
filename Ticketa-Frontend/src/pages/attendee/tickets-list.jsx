import NavBar from "@/components/Navbar";
import { SimplePagination } from "@/components/SimplePagination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SpringBootPagination, TicketSummary } from "@/domain/domain";
import { listTickets } from "@/lib/api";
import { AlertCircle, DollarSign, Tag, Ticket } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { Link } from "react-router-dom";
// ...existing code...

const DashboardListTicketsPage = () => {
  const { isLoading, user } = useAuth();

  const [tickets, setTickets] = useState({ content: [], number: 0, totalPages: 0, first: true, last: true });
  const [error, setError] = useState(undefined);
  const [page, setPage] = useState(0);

  // No unauthenticated fetch here — tickets are loaded via `listTickets` when user is available.

  useEffect(() => {
    if (isLoading || !user?.access_token) {
      return;
    }

    const doUseEffect = async () => {
      try {
        setTickets(await listTickets(user.access_token, page));
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else if (typeof err === "string") {
          setError(err);
        } else {
          setError("An unknown error occurred");
        }
      }
    };

    doUseEffect();
  }, [isLoading, user?.access_token, page]);

  const formatStatusBadge = (status) => {
    switch (status) {
      case "PURCHASED":
        return "bg-green-700 text-green-100";
      case "CANCELLED":
        return "bg-red-700 text-red-100";
      default:
        return "bg-gray-700 text-gray-200";
    }
  };

  if (isLoading) {
    return (
      <div className="bg-black min-h-screen text-white flex items-center justify-center">
        <p>Loading tickets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black min-h-screen text-white">
        <NavBar />
        <Alert variant="destructive" className="bg-gray-900 border-red-700">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white">
      <NavBar />

      {/* Title */}
      <div className="py-8 px-4">
        <h1 className="text-2xl font-bold">Your Tickets</h1>
        <p>Tickets you have purchased</p>
      </div>

      <div className="max-w-lg mx-auto space-y-4">
        {tickets?.content.map((ticketItem) => (
          <Link key={ticketItem.id} to={`/dashboard/tickets/${ticketItem.id}`}>
            <Card className="bg-gray-900 border-gray-700 text-white hover:bg-gray-800 transition">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Ticket className="h-5 w-5 text-gray-400" />
                    <h3 className="font-bold text-xl">
                      {ticketItem.ticketType.name}
                    </h3>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-lg text-xs font-medium ${formatStatusBadge(
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
                  <DollarSign className="h-5 w-5 text-gray-400" />
                  <p className="font-medium">${ticketItem.ticketType.price}</p>
                </div>

                {/* Ticket ID */}
                <div className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-gray-400" />
                  <div>
                    <h4 className="font-medium">Ticket ID</h4>
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

      <div className="flex justify-center py-8">
        {tickets && (
          <SimplePagination pagination={tickets} onPageChange={setPage} />
        )}
      </div>
    </div>
  );
};

export default DashboardListTicketsPage;
