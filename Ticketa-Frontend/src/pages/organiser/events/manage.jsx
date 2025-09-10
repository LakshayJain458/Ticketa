import NavBar from "@/components/Navbar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/AlertDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import Switch from "@/components/ui/switch";
import Textarea from "@/components/ui/textarea";
import { createEvent, getEvent, updateEvent } from "@/lib/api";
import { format } from "date-fns";
import {
  AlertCircle,
  CalendarIcon,
  Edit,
  Plus,
  Ticket,
  Trash,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate, useParams } from "react-router";

// ------------------ ENUM replacement ------------------
export const EventStatusEnum = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  CANCELLED: "CANCELLED",
  COMPLETED: "COMPLETED",
};

function buildEventPayload(form) {
  return {
    eventName: form.name,
    startDateTime: form.start ? new Date(form.start).toISOString() : null,
    endDateTime: form.end ? new Date(form.end).toISOString() : null,
    venue: form.venue || "",
    salesStartDateTime: form.salesStart
      ? new Date(form.salesStart).toISOString()
      : null,
    salesEndDateTime: form.salesEnd
      ? new Date(form.salesEnd).toISOString()
      : null,
    status: form.status || "DRAFT",
    ticketTypes: (form.ticketTypes || []).map((t) => ({
      name: t.name,
      price: Number(t.price || 0),
      quantity: Number(t.quantity || 0),
    })),
  };
}

// ------------------ DateTimeSelect ------------------
const DateTimeSelect = ({
  date,
  setDate,
  time,
  setTime,
  enabled,
  setEnabled,
}) => (
  <div className="flex gap-2 items-center">
    <Switch checked={enabled} onCheckedChange={setEnabled} />
    {enabled && (
      <div className="w-full flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button className="bg-gray-900 border-gray-700 border">
              <CalendarIcon />
              {date ? format(date, "PPP") : "Pick a Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => {
                if (!d) return;
                const correctedDate = new Date(
                  Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())
                );
                setDate(correctedDate);
              }}
              className="rounded-md border shadow"
            />
          </PopoverContent>
        </Popover>
        <Input
          type="time"
          className="w-[90px] bg-gray-900 text-white border-gray-700 border [&::-webkit-calendar-picker-indicator]:invert"
          value={time ?? ""}
          onChange={(e) => setTime(e.target.value)}
        />
      </div>
    )}
  </div>
);

// ------------------ Helpers ------------------
const generateTempId = () => `temp_${crypto.randomUUID()}`;
const isTempId = (id) => id && id.startsWith("temp_");

// ------------------ DashboardManageEventPage ------------------
const DashboardManageEventPage = () => {
  const { isLoading, user } = useAuth();
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();

  const [eventData, setEventData] = useState({
    id: undefined,
    name: "",
    startDate: undefined,
    startTime: undefined,
    endDate: undefined,
    endTime: undefined,
    venueDetails: "",
    salesStartDate: undefined,
    salesStartTime: undefined,
    salesEndDate: undefined,
    salesEndTime: undefined,
    ticketTypes: [],
    status: EventStatusEnum.DRAFT,
    createdAt: undefined,
    updatedAt: undefined,
  });

  const [currentTicketType, setCurrentTicketType] = useState(undefined);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [eventDateEnabled, setEventDateEnabled] = useState(false);
  const [eventSalesDateEnabled, setEventSalesDateEnabled] = useState(false);
  const [error, setError] = useState(undefined);

  const updateField = (field, value) =>
    setEventData((prev) => ({ ...prev, [field]: value }));

  // ------------------ Fetch event for edit ------------------
  useEffect(() => {
    if (isEditMode && !isLoading && user?.access_token) {
      (async () => {
        const event = await getEvent(user.access_token, id);
        // backend may use eventName/startDateTime etc.
        const startVal = event.startDateTime || event.start;
        const endVal = event.endDateTime || event.end;
        const salesStartVal = event.salesStartDateTime || event.salesStart;
        const salesEndVal = event.salesEndDateTime || event.salesEnd;
        setEventData({
          id: event.id,
          name: event.eventName || event.name,
          startDate: startVal,
          startTime: startVal ? formatTimeFromDate(new Date(startVal)) : undefined,
          endDate: endVal,
          endTime: endVal ? formatTimeFromDate(new Date(endVal)) : undefined,
          venueDetails: event.venue,
          salesStartDate: salesStartVal,
          salesStartTime: salesStartVal
            ? formatTimeFromDate(new Date(salesStartVal))
            : undefined,
          salesEndDate: salesEndVal,
          salesEndTime: salesEndVal ? formatTimeFromDate(new Date(salesEndVal)) : undefined,
          status: event.status,
          ticketTypes: (event.ticketTypes || []).map((t) => ({
            id: t.id,
            name: t.name,
            price: t.price,
            totalAvailable: t.availableTickets || t.totalAvailable,
            description: t.description,
          })),
          createdAt: event.createdAt,
          updatedAt: event.updatedAt,
        });
        setEventDateEnabled(!!(startVal || endVal));
        setEventSalesDateEnabled(!!(salesStartVal || salesEndVal));
      })();
    }
  }, [id, user]);

  const formatTimeFromDate = (date) => date.toISOString().substr(11, 5);
  const combineDateTime = (date, time) => {
    if (!date || !time) return undefined;
    const [hours, minutes] = time.split(":").map(Number);
    const combined = new Date(date);
    combined.setHours(hours, minutes, 0, 0);
    return combined;
  };

  // ------------------ Submit ------------------
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError(undefined);

    if (isLoading || !user?.access_token) {
      setError("You must be signed in to create or update events.");
      return;
    }

    // Basic validation: backend requires name, start/end and sales start/end
    if (
      !eventData.name ||
      !eventData.startDate ||
      !eventData.startTime ||
      !eventData.endDate ||
      !eventData.endTime ||
      !eventData.salesStartDate ||
      !eventData.salesStartTime ||
      !eventData.salesEndDate ||
      !eventData.salesEndTime
    ) {
      setError("Please provide event name, start/end and sales start/end date and times.");
      return;
    }

    // venue is required by backend
    if (!eventData.venueDetails || eventData.venueDetails.trim().length === 0) {
      setError("Venue is required");
      return;
    }

    // need at least one ticket type
    if (!eventData.ticketTypes || eventData.ticketTypes.length === 0) {
      setError("At least one ticket type is required");
      return;
    }

    const makeLocalDateTimeString = (date, time) => {
      const combined = combineDateTime(date, time);
      if (!combined) return null;
      // LocalDateTime (no timezone) expected by backend: YYYY-MM-DDTHH:mm:ss
      return combined.toISOString().slice(0, 19);
    };

    const ticketTypes = eventData.ticketTypes.map((t) => ({
      name: t.name,
      description: t.description || "",
      price: Number(t.price || 0),
      availableTickets: Number(t.totalAvailable || 0),
    }));

    const payload = {
      eventName: eventData.name,
      startDateTime: makeLocalDateTimeString(eventData.startDate, eventData.startTime),
      endDateTime: makeLocalDateTimeString(eventData.endDate, eventData.endTime),
      venue: eventData.venueDetails || "",
      salesStartDateTime: makeLocalDateTimeString(
        eventData.salesStartDate,
        eventData.salesStartTime
      ),
      salesEndDateTime: makeLocalDateTimeString(
        eventData.salesEndDate,
        eventData.salesEndTime
      ),
      status: eventData.status,
      ticketTypes,
    };

    try {
      // debug: show payload in console so we can verify venue is present
      console.debug("Event payload:", payload);
      console.debug("eventData.venueDetails:", eventData.venueDetails);
      if (isEditMode) {
        // update DTO expects an id too
        payload.id = eventData.id;
        await updateEvent(user.access_token, eventData.id, payload);
      } else {
        await createEvent(user.access_token, payload);
      }
      navigate("/dashboard/events");
    } catch (err) {
      console.error("Event create/update failed", err);
  // If backend sent structured error in body, show it
  const backendMsg = err?.body?.message || err?.body || null;
  setError(backendMsg || err?.message || JSON.stringify(err) || "An unknown error occurred");
    }
  };

  // ------------------ Ticket Handlers ------------------
  const handleAddTicketType = () => {
    setCurrentTicketType({
      id: undefined,
      name: "",
      price: 0,
      totalAvailable: 0,
      description: "",
    });
    setDialogOpen(true);
  };
  const handleSaveTicketType = () => {
    if (!currentTicketType) return;
    const newTickets = [...eventData.ticketTypes];
    if (currentTicketType.id) {
      const idx = newTickets.findIndex((t) => t.id === currentTicketType.id);
      if (idx !== -1) newTickets[idx] = currentTicketType;
    } else newTickets.push({ ...currentTicketType, id: generateTempId() });
    updateField("ticketTypes", newTickets);
    setDialogOpen(false);
  };
  const handleEditTicketType = (ticket) => {
    setCurrentTicketType(ticket);
    setDialogOpen(true);
  };
  const handleDeleteTicketType = (id) => {
    updateField(
      "ticketTypes",
      eventData.ticketTypes.filter((t) => t.id !== id)
    );
  };

  // Ticket editor dialog markup (bound to currentTicketType)
  const TicketEditorDialog = () => (
    <AlertDialog open={dialogOpen} onOpenChange={(v) => setDialogOpen(v)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {currentTicketType?.id ? "Edit Ticket Type" : "Add Ticket Type"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Configure the ticket type details.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-3">
          <div>
            <Label>Name</Label>
            <Input
              value={currentTicketType?.name || ""}
              onChange={(e) =>
                setCurrentTicketType((prev) => ({ ...(prev || {}), name: e.target.value }))
              }
              className="bg-gray-900 border-gray-700"
            />
          </div>
          <div>
            <Label>Price</Label>
            <Input
              type="number"
              value={currentTicketType?.price || 0}
              onChange={(e) =>
                setCurrentTicketType((prev) => ({ ...(prev || {}), price: Number(e.target.value) }))
              }
              className="bg-gray-900 border-gray-700"
            />
          </div>
          <div>
            <Label>Available Tickets</Label>
            <Input
              type="number"
              value={currentTicketType?.totalAvailable || 0}
              onChange={(e) =>
                setCurrentTicketType((prev) => ({ ...(prev || {}), totalAvailable: Number(e.target.value) }))
              }
              className="bg-gray-900 border-gray-700"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={currentTicketType?.description || ""}
              onChange={(e) =>
                setCurrentTicketType((prev) => ({ ...(prev || {}), description: e.target.value }))
              }
              className="bg-gray-900 border-gray-700"
            />
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setDialogOpen(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleSaveTicketType}>
            Save
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
  <div className="container-max mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">
          {isEditMode ? "Edit Event" : "Create a New Event"}
        </h1>

  <form onSubmit={handleFormSubmit} className="space-y-6 mt-4">
          {/* Event Name */}
          <div>
            <Label htmlFor="name">Event Name</Label>
            <Input
              id="name"
              placeholder="Event Name"
              value={eventData.name}
              onChange={(e) => updateField("name", e.target.value)}
              required
              className="bg-gray-900 border border-white/5 focus:border-cyan-400/80 transition"
            />
          </div>

          {/* Event Date/Time */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Event Start</Label>
                <DateTimeSelect
                  date={eventData.startDate}
                  setDate={(d) => updateField("startDate", d)}
                  time={eventData.startTime}
                  setTime={(t) => updateField("startTime", t)}
                  enabled={eventDateEnabled}
                  setEnabled={setEventDateEnabled}
                />
              </div>
              <div>
                <Label>Event End</Label>
                <DateTimeSelect
                  date={eventData.endDate}
                  setDate={(d) => updateField("endDate", d)}
                  time={eventData.endTime}
                  setTime={(t) => updateField("endTime", t)}
                  enabled={eventDateEnabled}
                  setEnabled={setEventDateEnabled}
                />
              </div>
            </div>

          {/* Venue */}
          <Label>Venue</Label>
          <Textarea
            value={eventData.venueDetails}
            onChange={(e) => updateField("venueDetails", e.target.value)}
            className="bg-gray-900 border border-white/5 min-h-[100px]"
          />

          {/* Sales */}
          <Label>Sales Start</Label>
          <DateTimeSelect
            date={eventData.salesStartDate}
            setDate={(d) => updateField("salesStartDate", d)}
            time={eventData.salesStartTime}
            setTime={(t) => updateField("salesStartTime", t)}
            enabled={eventSalesDateEnabled}
            setEnabled={setEventSalesDateEnabled}
          />
          <Label>Sales End</Label>
          <DateTimeSelect
            date={eventData.salesEndDate}
            setDate={(d) => updateField("salesEndDate", d)}
            time={eventData.salesEndTime}
            setTime={(t) => updateField("salesEndTime", t)}
            enabled={eventSalesDateEnabled}
            setEnabled={setEventSalesDateEnabled}
          />

          {/* Ticket Types */}
          <Card className="glass-card border border-white/5">
            <CardHeader className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Ticket /> Ticket Types
              </CardTitle>
              <Button
                type="button"
                onClick={handleAddTicketType}
                className="bg-gray-800 border border-white/5 hover:scale-105 transition"
              >
                <Plus /> Add
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {eventData.ticketTypes.map((t) => (
                <div
                  key={t.id}
                  className="bg-black/20 p-4 rounded-lg flex justify-between items-center border border-white/5"
                >
                  <div>
                    <p className="font-medium">{t.name}</p>
                    <Badge
                      variant="outline"
                      className="border-gray-600 text-white text-xs"
                    >
                      ${t.price}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => handleEditTicketType(t)}
                    >
                      <Edit />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-red-400"
                      onClick={() => handleDeleteTicketType(t.id)}
                    >
                      <Trash />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Status */}
          <Label>Status</Label>
          <Select
            value={eventData.status}
            onValueChange={(v) => updateField("status", v)}
          >
            <SelectTrigger className="bg-gray-900 border-gray-700">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(EventStatusEnum).map((v) => (
                <SelectItem key={v} value={v}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Error */}
          {error && (
            <Alert variant="destructive" className="bg-gray-900 border-red-700">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full bg-purple-700 hover:bg-purple-500"
          >
            {isEditMode ? "Update Event" : "Create Event"}
          </Button>
        </form>
      </div>
  {/* Ticket Editor Dialog */}
  {dialogOpen && <TicketEditorDialog />}
    </div>
  );
};

export default DashboardManageEventPage;
