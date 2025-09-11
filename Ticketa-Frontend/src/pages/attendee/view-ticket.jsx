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
    <div className="bg-black min-h-screen text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        
        {/* 🔙 Back Button */}
        <button
          onClick={() => navigate("/dashboard/tickets")}
          className="flex items-center gap-2 text-gray-300 hover:text-white 
                     transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tickets
        </button>

        {/* 🎟️ Ticket Card */}
        <div className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 rounded-3xl p-8 shadow-2xl">
          {/* Status */}
          <div className="bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full mb-8 text-center">
            <span className={`text-sm font-medium ${getStatusColor(ticket.status)}`}>
              {ticket.status}
            </span>
          </div>

          {/* Event Info */}
          <div className="mb-2">
            <h1 className="text-2xl font-bold mb-2">{ticket.eventName}</h1>
            <div className="flex items-center gap-2 text-purple-200">
              <MapPin className="w-4" />
              <span>{ticket.eventVenue}</span>
            </div>
          </div>

          {/* Date/Time */}
          <div className="flex items-center gap-2 text-purple-300 mb-8">
            <Calendar className="w-4 text-purple-200" />
            <div>
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

          {/* QR Code */}
          <div className="flex justify-center mb-8">
            <div className="bg-white p-4 rounded-2xl shadow-lg">
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
          </div>

          <div className="text-center mb-8">
            <p className="text-purple-200 text-sm">
              Present this QR code at the venue for entry
            </p>
          </div>

          {/* Ticket Details */}
          <div className="space-y-2 mb-8">
            <div className="flex items-center gap-2">
              <Tag className="w-5 text-purple-200" />
              <span className="font-semibold">{ticket.description}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 text-purple-200" />
              <span className="font-semibold">{ticket.price}</span>
            </div>
          </div>

          {/* Ticket ID */}
          <div className="text-center mb-2">
            <h4 className="text-sm font-semibold font-mono">Ticket ID</h4>
            <p className="text-purple-200 text-sm font-mono">{ticket.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTicketPage;
