import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { useParams, useNavigate } from "react-router-dom"; // ⬅️ added useNavigate
import { format, isValid } from "date-fns";
import { Calendar, DollarSign, MapPin, Tag, ArrowLeft } from "lucide-react"; // ⬅️ ArrowLeft icon

import { getTicket, getTicketQr } from "@/lib/api";

const ViewTicketPage = () => {
  const [ticket, setTicket] = useState(undefined);
  const [qrCodeUrl, setQrCodeUrl] = useState(undefined);
  const [isQrLoading, setIsQrCodeLoading] = useState(true);
  const [error, setError] = useState(undefined);

  const { id } = useParams();
  const { isLoading, user } = useAuth();
  const navigate = useNavigate(); // ⬅️ init navigate

  const parseDate = (value) => {
    if (!value) return null;
    const d = new Date(value);
    return isValid(d) ? d : null;
  };

  useEffect(() => {
    if (isLoading || !user?.access_token || !id) return;

    const fetchTicket = async () => {
      try {
        setIsQrCodeLoading(true);
        setError(undefined);

        const ticketData = await getTicket(user.access_token, id);
        setTicket(ticketData);

        const qrBlob = await getTicketQr(user.access_token, id);
        setQrCodeUrl(URL.createObjectURL(qrBlob));
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else if (typeof err === "string") setError(err);
        else setError("An unknown error has occurred");
      } finally {
        setIsQrCodeLoading(false);
      }
    };

    fetchTicket();

    return () => {
      if (qrCodeUrl) {
        URL.revokeObjectURL(qrCodeUrl);
      }
    };
  }, [user?.access_token, isLoading, id]);

  const getStatusColor = (status) => {
    switch (status) {
      case "PURCHASED":
        return "text-green-400";
      case "CANCELLED":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  if (!ticket) {
    return <p className="text-white">Loading..</p>;
  }

  return (
    <div className="bg-black min-h-screen text-white flex items-start justify-center p-6">
      <div className="w-full max-w-4xl">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/dashboard/tickets")}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Tickets
          </button>
        </div>

        {/* 🎟️ Two-column Ticket Card */}
        <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-gradient-to-br from-[#0f1724] via-[#120b2f] to-[#0b1220]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {/* Left: Hero image / event poster (md: 2/3 width) */}
            <div
              className="md:col-span-2 p-6 flex items-center justify-center bg-gradient-to-br from-purple-900/40 via-indigo-900/30 to-transparent"
              style={{ minHeight: 300 }}
            >
              {/* Event image fallback: gradient with event initials */}
              <div className="w-full h-full rounded-2xl overflow-hidden relative flex items-center justify-center">
                {ticket.imageUrl ? (
                  <img
                    src={ticket.imageUrl}
                    alt={ticket.eventName}
                    className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-700 to-indigo-700 flex items-center justify-center">
                    <div className="text-4xl font-extrabold tracking-tight text-white/90 drop-shadow-md">
                      {ticket.eventName?.split(" ").slice(0,2).map(s=>s[0]).join("")}
                    </div>
                  </div>
                )}

                {/* subtle animated accent */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/5 to-transparent mix-blend-overlay opacity-40 animate-pulse"></div>
              </div>
            </div>

            {/* Right: Details + QR */}
            <div className="md:col-span-1 p-6 flex flex-col justify-between bg-gradient-to-t from-black/40 to-transparent">
              <div>
                <div className="bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full inline-block mb-4">
                  <span className={`text-sm font-medium ${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </div>

                <h1 className="text-2xl md:text-xl font-bold mb-1 leading-tight">{ticket.eventName}</h1>
                <div className="flex items-center gap-2 text-purple-200 mb-4">
                  <MapPin className="w-4" />
                  <span className="text-sm">{ticket.eventVenue}</span>
                </div>

                <div className="flex items-center gap-2 text-purple-300 mb-4">
                  <Calendar className="w-4 text-purple-200" />
                  <div className="text-sm">
                    {(() => {
                      const start = parseDate(ticket.eventStart ?? ticket.startDateTime ?? ticket.start);
                      const end = parseDate(ticket.eventEnd ?? ticket.endDateTime ?? ticket.end);
                      const startText = start ? format(start, "Pp") : "TBD";
                      const endText = end ? format(end, "Pp") : "TBD";
                      return (
                        <>
                          {startText} - {endText}
                        </>
                      );
                    })()}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-purple-100">
                    <Tag className="w-4 text-purple-200" />
                    <span className="font-medium">{ticket.description}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-purple-100">
                    <DollarSign className="w-4 text-purple-200" />
                    <span className="font-medium">{ticket.price}</span>
                  </div>
                </div>
              </div>

              {/* QR + ID area at bottom */}
              <div className="mt-4">
                <div className="bg-white p-3 rounded-2xl shadow-lg w-40 mx-auto">
                  <div className="w-32 h-32 flex items-center justify-center">
                    {isQrLoading && (
                      <div className="text-xs text-center p-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 mb-2 mx-auto"></div>
                        <div className="text-gray-800">Loading QR...</div>
                      </div>
                    )}
                    {error && (
                      <div className="text-red-400 text-sm text-center p-2">
                        <div className="mb-1">⚠️</div>
                        {error}
                      </div>
                    )}
                    {qrCodeUrl && !isQrLoading && !error && (
                      <img
                        src={qrCodeUrl}
                        alt="QR Code for event"
                        className="w-full h-full object-contain rounded-lg"
                      />
                    )}
                  </div>
                </div>

                <p className="text-center text-purple-200 text-xs mt-2">Present this QR code at the venue</p>

                <div className="text-center mt-4">
                  <h4 className="text-xs font-semibold font-mono">Ticket ID</h4>
                  <p className="text-purple-200 text-sm font-mono break-words">{ticket.id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTicketPage;
