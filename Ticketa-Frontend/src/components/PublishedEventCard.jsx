import { Card } from "./ui/card";
import { Calendar, Heart, MapPin, Share2 } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import RandomEventImage from "./RandomEventImage";
import { motion } from "framer-motion";

const PublishedEventCard = ({ publishedEvent }) => {
  // defensive rendering: ensure we always show a sensible title/venue/dates
  const title = publishedEvent?.eventName || publishedEvent?.name || "Untitled event";
  const venue = publishedEvent?.venue || "Venue TBD";

  const rawStart = publishedEvent?.startDateTime || publishedEvent?.start || null;
  const rawEnd = publishedEvent?.endDateTime || publishedEvent?.end || null;

  const formatDate = (raw) => {
    if (!raw) return null;
    try {
      const d = new Date(raw);
      if (isNaN(d.getTime())) return null;
      return format(d, "PP");
    } catch (e) {
      return null;
    }
  };

  const startText = formatDate(rawStart);
  const endText = formatDate(rawEnd);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ scale: 1.03 }}
    >
      <Link to={`/events/${publishedEvent.id}`}>
        <Card className="group overflow-hidden max-w-[260px] rounded-2xl shadow-lg shadow-cyan-500/10 border border-gray-800 bg-gray-900 hover:border-cyan-500/50 transition-all duration-300">
          {/* Card Image */}
          <div className="h-[160px] overflow-hidden relative">
            <RandomEventImage />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Card Content */}
          <div className="p-3 space-y-2">
            <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors">
              {title}
            </h3>

            {/* Venue */}
            <div className="flex gap-2 text-sm text-gray-400 items-center">
              <MapPin className="w-4 h-4 text-cyan-300" />
              <span>{venue}</span>
            </div>

            {/* Date */}
            <div className="flex gap-2 text-sm text-gray-400 items-center">
              <Calendar className="w-4 h-4 text-green-300" />
              {startText && endText ? (
                <span>
                  {startText} – {endText}
                </span>
              ) : (
                <span>Dates TBD</span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center p-3 border-t border-gray-800 text-gray-400">
            <motion.button
              whileHover={{ scale: 1.2 }}
              className="hover:text-pink-500 transition-colors"
            >
              <Heart className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.2 }}
              className="hover:text-cyan-400 transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </motion.button>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
};

export default PublishedEventCard;
