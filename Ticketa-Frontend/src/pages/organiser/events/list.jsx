import NavBar from "@/components/Navbar";
import { SimplePagination } from "@/components/SimplePagination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/AlertDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { deleteEvent, listEvents } from "@/lib/api";
import {
  AlertCircle,
  Calendar,
  Clock,
  Edit,
  MapPin,
  Tag,
  Trash,
  Search,
  Filter,
  Plus,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";

const DashboardListEventsPage = () => {
  const { isLoading, user } = useAuth();
  const [events, setEvents] = useState({ content: [], totalPages: 0 });
  const [error, setError] = useState();
  const [deleteEventError, setDeleteEventError] = useState();
  const [page, setPage] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!isLoading && user?.access_token) {
      refreshEvents(user.access_token);
    }
  }, [isLoading, user, page]);

  // Debounced client-side search over the currently fetched page of events
  useEffect(() => {
    // if no query, clear filtered results
    if (!searchQuery || searchQuery.trim().length === 0) {
      setFilteredEvents([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const handle = setTimeout(() => {
      const q = searchQuery.trim().toLowerCase();
      const matches = (events.content || []).filter((ev) => {
        const name = (ev.eventName || ev.name || "").toString().toLowerCase();
        const venue = (ev.venue || "").toString().toLowerCase();
        const ticketTypes = (ev.ticketTypes || [])
          .map((t) => (t.name || "").toString().toLowerCase())
          .join(" ");
        return (
          name.includes(q) ||
          venue.includes(q) ||
          ticketTypes.includes(q)
        );
      });
      setFilteredEvents(matches);
      setIsSearching(false);
    }, 350);

    return () => clearTimeout(handle);
  }, [searchQuery, events.content]);

  const refreshEvents = async (accessToken) => {
    try {
      const data = await listEvents(accessToken, page);
      setEvents(data || { content: [], totalPages: 0 });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    }
  };

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "TBD";

  const formatTime = (date) =>
    date
      ? new Date(date).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

  const formatStatusBadge = (status) => {
    const styles = {
      DRAFT: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      PUBLISHED: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      CANCELLED: "bg-rose-500/20 text-rose-300 border-rose-500/30",
      COMPLETED: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    };
    return `${styles[status] || "bg-gray-700 text-gray-200"} px-2 py-1 rounded-full text-xs font-medium`;
  };

  const displayedEvents = searchQuery ? filteredEvents : events.content;

  const handleOpenDeleteEventDialog = (event) => {
    setEventToDelete(event);
    setDialogOpen(true);
  };

  const handleCancelDeleteEventDialog = () => {
    setEventToDelete(undefined);
    setDialogOpen(false);
  };

  const handleDeleteEvent = async () => {
    if (!eventToDelete || isLoading || !user?.access_token) return;

    try {
      setDeleteEventError(undefined);
      await deleteEvent(user.access_token, eventToDelete.id);
      setEventToDelete(undefined);
      setDialogOpen(false);
      refreshEvents(user.access_token);
    } catch (err) {
      setDeleteEventError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
        <Alert variant="destructive" className="bg-gray-900 border-red-700">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black min-h-screen text-white">
      <NavBar />

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Your Events
            </h1>
            <p className="text-gray-400 mt-2">
              Manage and organize all your events in one place
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800/50 border-gray-700 text-white w-full md:w-64"
              />
            </div>
            <Link to="/dashboard/events/create" className="w-full sm:w-auto">
              <Button className="w-full bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 transition-all duration-300 py-2 px-6">
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </Link>
          </div>
        </div>

        {/* Event Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchQuery && isSearching ? (
            <div className="col-span-full text-center py-16">
              <p className="text-gray-400">Searching...</p>
            </div>
          ) : displayedEvents.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <div className="bg-gray-800/30 rounded-2xl p-8 max-w-md mx-auto border border-gray-700/50">
                <Calendar className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">No events found</h3>
                <p className="text-gray-500 mb-6">Try a different search or create a new event</p>
                <Link to="/dashboard/events/create">
                  <Button className="bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500">
                    Create Your First Event
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            displayedEvents.map((eventItem) => (
              <Card
                key={eventItem.id}
                className="bg-gradient-to-b from-gray-800/40 to-gray-900/60 border border-gray-700/30 rounded-xl overflow-hidden transition-all duration-300 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/10"
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg truncate text-white">
                      {eventItem.eventName ?? eventItem.name ?? "Untitled Event"}
                    </h3>
                    <span className={formatStatusBadge(eventItem.status)}>
                      {eventItem.status}
                    </span>
                  </div>
                  <div className="h-1 w-12 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full"></div>
                </CardHeader>

                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 p-2 bg-gray-800/30 rounded-lg">
                    <Calendar className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                    <span className="text-gray-300">
                      {formatDate(eventItem.startDateTime)} - {formatDate(eventItem.endDateTime)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 p-2 bg-gray-800/30 rounded-lg">
                    <Clock className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                    <span className="text-gray-300">
                      {formatTime(eventItem.startDateTime)} - {formatTime(eventItem.endDateTime)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 p-2 bg-gray-800/30 rounded-lg">
                    <MapPin className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                    <span className="text-gray-300 truncate">{eventItem.venue || "Venue TBD"}</span>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Tag className="h-4 w-4 text-emerald-400" />
                      <span className="text-sm font-medium text-gray-300">Ticket Types</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(eventItem.ticketTypes || []).slice(0, 3).map((ticketType) => (
                        <span
                          key={ticketType.id}
                          className="text-xs bg-gray-800/60 border border-gray-700/50 px-2 py-1 rounded-md text-cyan-200"
                        >
                          {ticketType.name} — ${ticketType.price}
                        </span>
                      ))}
                      {(eventItem.ticketTypes || []).length > 3 && (
                        <span className="text-xs bg-gray-800/60 border border-gray-700/50 px-2 py-1 rounded-md text-gray-400">
                          +{(eventItem.ticketTypes || []).length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex justify-end gap-2 pt-4 border-t border-gray-700/30">
                  <Link to={`/dashboard/events/update/${eventItem.id}`}>
                    <Button
                      size="sm"
                      className="bg-gray-700 hover:bg-gray-600 transition-colors"
                    >
                      <Edit className="h-3.5 w-3.5 mr-1" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    className="bg-rose-700/80 hover:bg-rose-600 transition-colors"
                    onClick={() => handleOpenDeleteEventDialog(eventItem)}
                  >
                    <Trash className="h-3.5 w-3.5 mr-1" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>

        {/* Pagination */}
        {/* Hide pagination when a search is active (client-side filtered results) */}
        {!searchQuery && events.totalPages > 1 && (
          <div className="flex justify-center mt-10">
            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/30">
              <SimplePagination pagination={events} onPageChange={setPage} />
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={dialogOpen}>
        <AlertDialogContent className="bg-gray-800 border border-gray-700 max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Event?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This will permanently delete <b>{eventToDelete?.name}</b> and all associated data.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteEventError && (
            <Alert variant="destructive" className="border-red-700 mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{deleteEventError}</AlertDescription>
            </Alert>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={handleCancelDeleteEventDialog}
              className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteEvent}
              className="bg-rose-600 text-white hover:bg-rose-500"
            >
              Delete Event
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
};

export default DashboardListEventsPage;