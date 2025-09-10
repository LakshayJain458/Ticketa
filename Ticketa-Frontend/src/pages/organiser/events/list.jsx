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
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { deleteEvent, listEvents } from "@/lib/api";
import {
  AlertCircle,
  Calendar,
  Clock,
  Edit,
  MapPin,
  Tag,
  Trash,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { Link } from "react-router-dom";

const DashboardListEventsPage = () => {
  const { isLoading, user } = useAuth();

  const [events, setEvents] = useState({ content: [], totalPages: 0 });
  const [error, setError] = useState();
  const [deleteEventError, setDeleteEventError] = useState();

  const [page, setPage] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState();

  useEffect(() => {
    if (!isLoading && user?.access_token) {
      refreshEvents(user.access_token);
    }
  }, [isLoading, user, page]);

  const refreshEvents = async (accessToken) => {
    try {
      const data = await listEvents(accessToken, page); // <-- FIX: actually fetch
      setEvents(data || { content: [], totalPages: 0 });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
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
      DRAFT: "bg-gray-700 text-gray-200",
      PUBLISHED: "bg-green-700 text-green-100",
      CANCELLED: "bg-red-700 text-red-100",
      COMPLETED: "bg-blue-700 text-blue-100",
    };
    return styles[status] || "bg-gray-700 text-gray-200";
  };

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
      <div className="min-h-screen bg-black text-white">
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

  <div className="container-max mx-auto px-4">
        {/* Title */}
        <div className="py-8 flex justify-between">
          <div>
            <h1 className="text-2xl font-bold">Your Events</h1>
            <p className="text-gray-400">Manage the events you have created</p>
          </div>
          <Link to="/dashboard/events/create">
            <Button className="accent-cyan hover:scale-105 transition transform cursor-pointer">
              Create Event
            </Button>
          </Link>
        </div>

        {/* Event Cards */}
        <div className="space-y-4">
          {events.content.length === 0 ? (
            <p className="text-gray-500">No events found.</p>
          ) : (
            events.content.map((eventItem) => (
              <Card
                  key={eventItem.id}
                  className="glass-card glow-ring transform transition-all duration-300 hover:scale-105 text-white overflow-hidden"
                >
                <CardHeader>
                  <div className="flex justify-between items-center">
                    {/* prefer backend field names, fall back to older names */}
                    <h3 className="font-bold text-xl">
                      {eventItem.eventName ?? eventItem.name ?? "Untitled Event"}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-lg text-xs ${formatStatusBadge(
                        eventItem.status
                      )}`}
                    >
                      {eventItem.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Event Start & End */}
                  <div className="flex space-x-2">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      {(() => {
                        const start =
                          eventItem.startDateTime ?? eventItem.start ?? eventItem.startDate;
                        const end = eventItem.endDateTime ?? eventItem.end ?? eventItem.endDate;
                        return (
                          <>
                            <p className="font-medium">
                              {formatDate(start)} → {formatDate(end)}
                            </p>
                            <p className="text-gray-400">
                              {formatTime(start)} - {formatTime(end)}
                            </p>
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Sales Period */}
                  <div className="flex space-x-2">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <div>
                      <h4 className="font-medium">Sales Period</h4>
                      <p className="text-gray-400">
                        {formatDate(eventItem.salesStartDateTime ?? eventItem.salesStart)} → {formatDate(eventItem.salesEndDateTime ?? eventItem.salesEnd)}
                      </p>
                    </div>
                  </div>

                  {/* Venue */}
                  <div className="flex space-x-2">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <p className="font-medium">{eventItem.venue}</p>
                  </div>

                  {/* Ticket Types */}
                  <div className="flex space-x-2">
                    <Tag className="h-5 w-5 text-gray-400" />
                    <div>
                      <h4 className="font-medium">Ticket Types</h4>
                      <ul className="flex flex-wrap gap-2 mt-1">
                        {(eventItem.ticketTypes || []).map((ticketType) => (
                          <li
                            key={ticketType.id}
                            className="text-xs text-gray-300 bg-black/20 px-2 py-1 rounded-md border border-white/5"
                          >
                            <span className="font-medium">{ticketType.name}</span>
                            <span className="ml-2 text-gray-400">${ticketType.price}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex justify-end gap-2">
                  <Link to={`/dashboard/events/update/${eventItem.id}`}>
                    <Button className="bg-gray-700 hover:bg-gray-500">
                      <Edit />
                    </Button>
                  </Link>
                  <Button
                    className="bg-red-700/80 hover:bg-red-500"
                    onClick={() => handleOpenDeleteEventDialog(eventItem)}
                  >
                    <Trash />
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center py-8">
        {events.totalPages > 1 && (
          <SimplePagination pagination={events} onPageChange={setPage} />
        )}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={dialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <b>{eventToDelete?.name}</b>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteEventError && (
            <Alert variant="destructive" className="border-red-700">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{deleteEventError}</AlertDescription>
            </Alert>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDeleteEventDialog}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteEvent}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DashboardListEventsPage;
