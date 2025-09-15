import { Card } from "./ui/card";
import { Calendar, Heart, MapPin, Share2, Check } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import RandomEventImage from "./RandomEventImage";
import { motion } from "framer-motion";

import { useState } from "react";

const PublishedEventCard = ({ publishedEvent, onCardClick }) => {
  const [liked, setLiked] = useState(false);
  const [shared, setShared] = useState(false);

  const handleLike = (e) => {
    e?.preventDefault?.();
    setLiked((v) => !v);
  };

  const title = publishedEvent?.eventName || publishedEvent?.name || "Untitled event";
  const venue = publishedEvent?.venue || publishedEvent?.eventVenue || "Venue TBD";

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

  const handleShare = async (e) => {
    e?.preventDefault?.();
    const url = `${window.location.origin}/events/${publishedEvent.id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      }
      setShared(true);
      setTimeout(() => setShared(false), 1800);
    } catch (_) {
      // ignore
    }
  };

  const CardInner = (
    <>
      <div className="h-[160px] overflow-hidden relative">
        <RandomEventImage />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-2 left-2 bg-cyan-600/80 backdrop-blur px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wide text-white shadow shadow-black/40">
          Details
        </div>
      </div>

      <div className="p-3 space-y-2">
        <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors">
          {title}
        </h3>

        <div className="flex gap-2 text-sm text-gray-400 items-center">
          <MapPin className="w-4 h-4 text-cyan-300" />
          <span>{venue}</span>
        </div>

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

      <div className="flex justify-between items-center p-3 border-t border-gray-800 text-gray-400">
        <motion.button
          whileHover={{ scale: 1.2 }}
          onClick={(e) => {
            e.stopPropagation();
            handleLike(e);
          }}
          aria-label={liked ? "Unlike event" : "Like event"}
          className={`transition-colors ${liked ? "text-pink-500" : "hover:text-pink-500"}`}
        >
          <Heart className={`w-5 h-5 ${liked ? "fill-pink-500" : ""}`} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.2 }}
          onClick={(e) => {
            e.stopPropagation();
            handleShare(e);
          }}
          aria-label="Share event"
          className={`transition-colors ${shared ? "text-green-400" : "hover:text-cyan-400"}`}
        >
          {shared ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
        </motion.button>
      </div>
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ scale: 1.03 }}
    >
      {onCardClick ? (
        <div onClick={() => onCardClick(publishedEvent)}>
          <Card className="group cursor-pointer overflow-hidden max-w-[260px] rounded-2xl shadow-lg shadow-cyan-500/10 border border-gray-800 bg-gray-900 hover:border-cyan-500/50 transition-all duration-300">
            {CardInner}
          </Card>
        </div>
      ) : (
        <Link to={`/events/${publishedEvent.id}`}>
          <Card className="group overflow-hidden max-w-[260px] rounded-2xl shadow-lg shadow-cyan-500/10 border border-gray-800 bg-gray-900 hover:border-cyan-500/50 transition-all duration-300">
            {CardInner}
          </Card>
        </Link>
      )}
    </motion.div>
  );
};

export default PublishedEventCard;
