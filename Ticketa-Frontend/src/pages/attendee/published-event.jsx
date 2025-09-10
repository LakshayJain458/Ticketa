import RandomEventImage from "@/components/RandomEventImage";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getPublishedEvent } from "@/lib/api";
import { AlertCircle, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { Link, useNavigate, useParams } from "react-router";

const PublishedEventsPage = () => {
  const { isAuthenticated, isLoading, signinRedirect, signoutRedirect } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const [error, setError] = useState();
  const [publishedEvent, setPublishedEvent] = useState();
  const [selectedTicketType, setSelectedTicketType] = useState();

  useEffect(() => {
    if (!id) {
      setError("ID must be provided!");
      return;
    }

    const doUseEffect = async () => {
      try {
        const eventData = await getPublishedEvent(id);
        // Map backend DTO fields to frontend-friendly names
        const mapped = {
          id: eventData.id,
          name: eventData.eventName || eventData.name,
          venue: eventData.venue,
          start: eventData.startDateTime || eventData.start,
          end: eventData.endDateTime || eventData.end,
          ticketTypes: (eventData.ticketTypes || []).map((t) => ({
            id: t.id,
            name: t.name,
            description: t.description,
            price: t.price,
          })),
        };
        setPublishedEvent(mapped);
        if (mapped.ticketTypes.length > 0) setSelectedTicketType(mapped.ticketTypes[0]);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else if (typeof err === "string") {
          setError(err);
        } else {
          setError("An unknown error has occurred");
        }
      }
    };
    doUseEffect();
  }, [id]);

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
    return <p className="text-white text-center">Loading...</p>;
  }

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Nav */}
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

      {/* Main */}
      <main className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
          {/* Left Column */}
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold">{publishedEvent?.name}</h1>
            <p className="text-lg flex gap-2 items-center text-gray-300">
              <MapPin className="w-5" />
              {publishedEvent?.venue}
            </p>
          </div>
          {/* Right Column */}
          <div className="bg-gray-700 rounded-2xl shadow-lg w-full max-w-sm overflow-hidden">
            <RandomEventImage />
          </div>
        </div>

        {/* Ticket Selection */}
        <h2 className="text-2xl font-bold mb-6">Available Tickets</h2>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Ticket Types */}
          <div className="md:w-1/2 space-y-3">
            {publishedEvent?.ticketTypes?.map((ticketType) => (
              <Card
                key={ticketType.id}
                className={`bg-gray-800 border ${
                  selectedTicketType?.id === ticketType.id
                    ? "border-purple-500"
                    : "border-gray-600"
                } hover:bg-gray-700 text-white cursor-pointer`}
                onClick={() => setSelectedTicketType(ticketType)}
              >
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{ticketType.name}</h3>
                    <span className="text-xl font-bold">${ticketType.price}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-sm">
                    {ticketType.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Selected Ticket */}
          <div className="md:w-1/2">
            {selectedTicketType ? (
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-600">
                <h2 className="text-2xl font-bold mb-4">{selectedTicketType.name}</h2>
                <p className="text-3xl font-bold mb-4">${selectedTicketType.price}</p>
                <p className="text-gray-300 mb-6">{selectedTicketType.description}</p>
                <Link
                  to={`/events/${publishedEvent?.id}/purchase/${selectedTicketType.id}`}
                >
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 cursor-pointer">
                    Purchase Ticket
                  </Button>
                </Link>
              </div>
            ) : (
              <p className="text-gray-400">Select a ticket type to view details</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PublishedEventsPage;
