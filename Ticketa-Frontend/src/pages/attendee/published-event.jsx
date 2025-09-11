import RandomEventImage from "@/components/RandomEventImage";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getPublishedEvent } from "@/lib/api";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { Link, useParams } from "react-router-dom";
import NavBar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { motion } from "framer-motion";
import { AlertCircle, MapPin, Clock, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

const PublishedEventsPage = () => {
  const { isLoading } = useAuth();
  const { id } = useParams();

  const [error, setError] = useState();
  const [publishedEvent, setPublishedEvent] = useState();
  const [selectedTicketType, setSelectedTicketType] = useState();
  const [countdown, setCountdown] = useState("");

  // fetch event
  useEffect(() => {
    if (!id) {
      setError("ID must be provided!");
      return;
    }
    const doUseEffect = async () => {
      try {
        const eventData = await getPublishedEvent(id);
        const mapped = {
          id: eventData.id,
          name: eventData.eventName || eventData.name,
          venue: eventData.venue,
          start: new Date(eventData.startDateTime || eventData.start),
          end: new Date(eventData.endDateTime || eventData.end),
          ticketTypes: (eventData.ticketTypes || []).map((t) => ({
            id: t.id,
            name: t.name,
            description: t.description,
            price: t.price,
          })),
        };
        setPublishedEvent(mapped);
        if (mapped.ticketTypes.length > 0)
          setSelectedTicketType(mapped.ticketTypes[0]);
      } catch (err) {
        setError(err?.message || "An unknown error has occurred");
      }
    };
    doUseEffect();
  }, [id]);

  // countdown
  useEffect(() => {
    if (!publishedEvent?.start) return;
    const interval = setInterval(() => {
      const diff = publishedEvent.start - new Date();
      if (diff <= 0) {
        setCountdown("Event Started!");
        clearInterval(interval);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        setCountdown(`${days}d ${hours}h ${minutes}m left`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [publishedEvent]);

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
  const navigate = useNavigate();
  return (
    <div className="bg-gradient-to-br from-black via-gray-900 to-purple-950 min-h-screen text-white">
      <NavBar />

      {/* Back Button */}
      <div className="container mx-auto px-6 mt-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/60 
               backdrop-blur-md border border-gray-700 text-gray-300 
               hover:text-white hover:border-purple-500 hover:bg-gray-800 
               transition-all shadow-md shadow-black/20"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
      </div>

      <main className="container mx-auto px-6 py-16">
        {/* Event Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto mb-16">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-5"
          >
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {publishedEvent?.name}
            </h1>
            <p className="flex gap-2 items-center text-gray-300 text-lg">
              <MapPin className="w-5 text-purple-400" />
              {publishedEvent?.venue}
            </p>
            <p className="flex gap-2 items-center text-gray-400">
              <Clock className="w-5 text-cyan-400" />
              {countdown}
            </p>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl overflow-hidden shadow-2xl border border-purple-600/40"
          >
            <RandomEventImage />
          </motion.div>
        </div>

        {/* Tickets */}
        <h2 className="text-3xl font-bold mb-8">🎟 Available Tickets</h2>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Ticket List */}
          <div className="md:w-1/2 space-y-5">
            {publishedEvent?.ticketTypes?.map((ticketType) => (
              <motion.div
                key={ticketType.id}
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Card
                  className={`bg-gray-800/60 backdrop-blur-md border ${
                    selectedTicketType?.id === ticketType.id
                      ? "border-purple-500 shadow-purple-500/40 shadow-lg"
                      : "border-gray-700"
                  } text-white cursor-pointer transition-all`}
                  onClick={() => setSelectedTicketType(ticketType)}
                >
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-semibold">
                        {ticketType.name}
                      </h3>
                      <span className="text-2xl font-bold text-purple-400">
                        ${ticketType.price}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">{ticketType.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Selected Ticket */}
          <div className="md:w-1/2">
            {selectedTicketType ? (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-900/70 backdrop-blur-md rounded-2xl p-8 border border-purple-600/40 shadow-lg shadow-purple-800/30"
              >
                <h2 className="text-3xl font-bold mb-4">
                  {selectedTicketType.name}
                </h2>
                <p className="text-4xl font-extrabold text-purple-400 mb-6">
                  ${selectedTicketType.price}
                </p>
                <p className="text-gray-300 mb-8">
                  {selectedTicketType.description}
                </p>
                <Link
                  to={`/events/${publishedEvent?.id}/purchase/${selectedTicketType.id}`}
                >
                  <Button className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 transition-all shadow-md shadow-purple-500/40">
                    🚀 Purchase Ticket
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <p className="text-gray-400 italic">
                Select a ticket type to view details
              </p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PublishedEventsPage;
