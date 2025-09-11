import NavBar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/AlertDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";
import { format } from "date-fns";
import {
  AlertCircle,
  CalendarIcon,
  Edit,
  Plus,
  Ticket,
  Trash,
  Clock,
  MapPin,
  DollarSign,
  Hash,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate, useParams } from "react-router";
import { createEvent, getEvent, updateEvent } from "@/lib/api";

export const EventStatusEnum = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  CANCELLED: "CANCELLED",
  COMPLETED: "COMPLETED",
};

// ------------------ DateTimePicker (MUI) ------------------
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker as MUIDateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import TextField from "@mui/material/TextField";

// Wrap MUI DateTimePicker to keep the existing state shape: separate date (JS Date) and time ("HH:mm" string).
const DateTimePicker = ({ label, date, setDate, time, setTime }) => {
  const toDayjs = (d, t) => {
    if (!d) return null;
    const base = dayjs(d);
    if (t) {
      const [hh, mm] = t.split(":");
      return base.hour(Number(hh || 0)).minute(Number(mm || 0));
    }
    return base;
  };

  const value = toDayjs(date, time);

  return (
    <div className="w-full">
      <Label className="text-sm font-semibold text-cyan-400 tracking-wide mb-2">
        {label}
      </Label>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <MUIDateTimePicker
          value={value}
          onChange={(newVal) => {
            if (!newVal) {
              setDate(undefined);
              setTime(undefined);
              return;
            }
            const jsDate = newVal.toDate ? newVal.toDate() : dayjs(newVal).toDate();
            setDate(jsDate);
            setTime(dayjs(newVal).format("HH:mm"));
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              variant="outlined"
              sx={{
                width: "100%",
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#e5e7eb',
                },
                '& .MuiInputLabel-root': {
                  color: '#6b7280',
                },
                '& .MuiSvgIcon-root': { color: '#6b7280' },
              }}
              // force inline styles on the input root and input element to override any global dark rules
              InputProps={{
                ...params.InputProps,
                style: { backgroundColor: '#ffffff', borderRadius: 8, color: '#111827' },
                inputProps: {
                  ...(params.InputProps?.inputProps || {}),
                  style: { color: '#111827' },
                },
              }}
              inputProps={{
                ...(params.inputProps || {}),
                style: { color: '#111827' },
              }}
              InputLabelProps={{ shrink: Boolean(value), sx: { color: '#6b7280' } }}
            />
          )}
          label={label}
        />
      </LocalizationProvider>
    </div>
  );
};

// ------------------ TicketEditorDialog ------------------
const TicketEditorDialog = ({ 
  open, 
  onOpenChange, 
  ticket, 
  onSave 
}) => {
  const [formData, setFormData] = useState({
    name: "",
  price: 0,
  totalAvailable: 1,
    description: "",
  });

  useEffect(() => {
    if (ticket) {
      setFormData({
        name: ticket.name || "",
        price: ticket.price || 0,
        totalAvailable: ticket.totalAvailable || 0,
        description: ticket.description || "",
      });
    }
  }, [ticket, open]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave({
      ...ticket,
      ...formData,
      id: ticket?.id || `temp_${crypto.randomUUID()}`,
    });
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-gray-800 border-gray-700 max-w-md mx-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white text-xl font-bold">
            {ticket?.id ? "Edit Ticket Type" : "Add Ticket Type"}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-400">
            Configure details for this ticket type.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-gray-300">Ticket Name</Label>
            <div className="relative">
              <Ticket className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="General Admission"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="bg-gray-900 border-gray-700 text-white pl-10 focus:border-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Price ($)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="number"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) => handleChange("price", parseFloat(e.target.value) || 0)}
                  className="bg-gray-900 border-gray-700 text-white pl-10 focus:border-purple-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Quantity</Label>
              <div className="relative">
                <Hash className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="number"
                  placeholder="100"
                  min={1}
                  value={formData.totalAvailable}
                  onChange={(e) => handleChange("totalAvailable", parseInt(e.target.value) || 0)}
                  className="bg-gray-900 border-gray-700 text-white pl-10 focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">Description (Optional)</Label>
            <Textarea
              placeholder="Describe this ticket type..."
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="bg-gray-900 border-gray-700 text-white focus:border-purple-500 min-h-[100px]"
            />
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600 transition-colors">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSave}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all"
            disabled={!formData.name || formData.price < 0 || formData.totalAvailable <= 0}
          >
            Save Ticket
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

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
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [error, setError] = useState(undefined);
  const [saving, setSaving] = useState(false);

  const updateField = (field, value) =>
    setEventData((prev) => ({ ...prev, [field]: value }));

  // Load event when in edit mode and user token is available
  useEffect(() => {
    const loadEvent = async () => {
      if (!isEditMode || !user?.access_token || !id) return;
      try {
        const evt = await getEvent(user.access_token, id);
        if (!evt) return;

        const toDate = (val) => (val ? new Date(val) : undefined);
        const toTime = (val) => (val ? dayjs(val).format("HH:mm") : undefined);

        setEventData({
          id: evt.id,
          name: evt.eventName || evt.name || "",
          startDate: toDate(evt.startDateTime),
          startTime: toTime(evt.startDateTime),
          endDate: toDate(evt.endDateTime),
          endTime: toTime(evt.endDateTime),
          venueDetails: evt.venue || "",
          salesStartDate: toDate(evt.salesStartDateTime),
          salesStartTime: toTime(evt.salesStartDateTime),
          salesEndDate: toDate(evt.salesEndDateTime),
          salesEndTime: toTime(evt.salesEndDateTime),
          ticketTypes: (evt.ticketTypes || []).map((t) => ({
            id: t.id,
            name: t.name,
            price: t.price,
            description: t.description,
            totalAvailable: t.availableTickets ?? t.totalAvailable ?? 0,
            availableTickets: t.availableTickets ?? t.totalAvailable ?? 0,
          })),
          status: evt.status || EventStatusEnum.DRAFT,
        });
      } catch (e) {
        console.error(e);
        setError(e.message || "Unable to load event details");
      }
    };

    loadEvent();
    // only run when id/user changes or edit mode toggles
  }, [isEditMode, user?.access_token, id]);

  const combineDateTime = (date, time) => {
    if (!date) return undefined;
    try {
      const d = new Date(date);
      if (!time) return d;
      const [hh, mm] = (time || "").split(":");
      d.setHours(Number(hh || 0));
      d.setMinutes(Number(mm || 0));
      d.setSeconds(0);
      d.setMilliseconds(0);
      return d;
    } catch (e) {
      return undefined;
    }
  };

  const buildRequestPayload = () => {
    // Use backend DTO field names: eventName, startDateTime, endDateTime, salesStartDateTime, salesEndDateTime
    return {
      ...(isEditMode ? { id: eventData.id || id } : {}),
      eventName: eventData.name,
      startDateTime: combineDateTime(eventData.startDate, eventData.startTime),
      endDateTime: combineDateTime(eventData.endDate, eventData.endTime),
      venue: eventData.venueDetails,
      salesStartDateTime: combineDateTime(eventData.salesStartDate, eventData.salesStartTime),
      salesEndDateTime: combineDateTime(eventData.salesEndDate, eventData.salesEndTime),
      status: eventData.status,
      ticketTypes: (eventData.ticketTypes || []).map((t) => {
        // For creation the backend expects TicketTypeCreationRequestDto with { name, description, price, availableTickets }
        // For updates the mapper may accept similar fields; include id only when present to help backend map existing types.
        const base = {
          name: t.name,
          description: t.description || "",
          price: Number(t.price || 0),
          availableTickets: Number(t.availableTickets ?? t.totalAvailable ?? 0),
        };
        return isEditMode && t.id ? { id: t.id, ...base } : base;
      }),
    };
  };

  const handleSubmit = async () => {
    setError(undefined);
    setSaving(true);
    try {
      // client-side validation: ensure each ticket type has at least 1 available ticket
      const invalid = (eventData.ticketTypes || []).some(
        (t) => Number(t.availableTickets ?? t.totalAvailable ?? 0) < 1
      );
      if (invalid) {
        setError("Each ticket type must have at least 1 available ticket.");
        setSaving(false);
        return;
      }
      const payload = buildRequestPayload();
      const token = user?.access_token;
      if (isEditMode) {
        await updateEvent(token, id, payload);
        navigate(`/dashboard/events`);
      } else {
        await createEvent(token, payload);
        navigate(`/dashboard/events`);
      }
    } catch (e) {
      console.error(e);
      setError(e.message || "Unable to save event");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveTicket = (ticketData) => {
    const newTickets = [...eventData.ticketTypes];
    
    if (ticketData.id && eventData.ticketTypes.some(t => t.id === ticketData.id)) {
      // Update existing ticket
      const idx = newTickets.findIndex((t) => t.id === ticketData.id);
      if (idx !== -1) newTickets[idx] = ticketData;
    } else {
      // Add new ticket
      newTickets.push(ticketData);
    }
    
    updateField("ticketTypes", newTickets);
  };

  const openTicketDialog = (ticket = null) => {
    setEditingTicket(ticket);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white">
      <NavBar />
      
      <main className="container mx-auto px-4 py-8 space-y-8 max-w-4xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-2">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              {isEditMode ? "Edit Event" : "Create New Event"}
            </h1>
            <p className="text-gray-400 mt-1">
              {isEditMode ? "Update your event details" : "Set up your event and start selling tickets"}
            </p>
          </div>
          
          <Badge
            variant="outline"
            className={
              eventData.status === EventStatusEnum.DRAFT
                ? "bg-yellow-900/30 text-yellow-400 border-yellow-700 px-3 py-1 text-sm"
                : eventData.status === EventStatusEnum.PUBLISHED
                ? "bg-green-900/30 text-green-400 border-green-700 px-3 py-1 text-sm"
                : eventData.status === EventStatusEnum.CANCELLED
                ? "bg-red-900/30 text-red-400 border-red-700 px-3 py-1 text-sm"
                : "bg-blue-900/30 text-blue-400 border-blue-700 px-3 py-1 text-sm"
            }
          >
            {eventData.status}
          </Badge>
        </div>

        {/* Event Info */}
        <Card className="bg-gray-800/40 border-gray-700 backdrop-blur-sm rounded-xl overflow-hidden transition-all hover:bg-gray-800/60">
          <CardHeader className="px-6 py-5 border-b border-gray-700">
            <CardTitle className="text-xl flex items-center gap-3 text-white">
              <div className="p-2 rounded-lg bg-purple-900/20">
                <CalendarIcon className="h-5 w-5 text-purple-400" />
              </div>
              Event Details
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 py-5 space-y-6">
            <div>
              <Label className="text-gray-300 pb-1 flex items-center gap-2">
                Event Name <span className="text-red-400">*</span>
              </Label>
              <Input
                placeholder="e.g. AI Conference 2025"
                value={eventData.name}
                onChange={(e) => updateField("name", e.target.value)}
                className="bg-gray-900 border-gray-700 text-white focus:border-purple-500 mt-1 py-6 text-lg"
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <DateTimePicker
                label="Event Start"
                date={eventData.startDate}
                setDate={(d) => updateField("startDate", d)}
                time={eventData.startTime}
                setTime={(t) => updateField("startTime", t)}
              />
              <DateTimePicker
                label="Event End"
                date={eventData.endDate}
                setDate={(d) => updateField("endDate", d)}
                time={eventData.endTime}
                setTime={(t) => updateField("endTime", t)}
              />
            </div>
            
            <div>
              <Label className="text-gray-300 pb-1 flex items-center gap-2">
                Venue Details <span className="text-red-400">*</span>
              </Label>
              <div className="relative mt-1">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Textarea
                  placeholder="Enter venue address and details"
                  value={eventData.venueDetails}
                  onChange={(e) => updateField("venueDetails", e.target.value)}
                  className="bg-gray-900 border-gray-700 text-white focus:border-purple-500 pl-10 min-h-[100px]"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sales Info */}
        <Card className="bg-gray-800/40 border-gray-700 backdrop-blur-sm rounded-xl overflow-hidden transition-all hover:bg-gray-800/60">
          <CardHeader className="px-6 py-5 border-b border-gray-700">
            <CardTitle className="text-xl flex items-center gap-3 text-white">
              <div className="p-2 rounded-lg bg-blue-900/20">
                <Clock className="h-5 w-5 text-blue-400" />
              </div>
              Sales Period
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 py-5 grid md:grid-cols-2 gap-6">
            <DateTimePicker
              label="Sales Start"
              date={eventData.salesStartDate}
              setDate={(d) => updateField("salesStartDate", d)}
              time={eventData.salesStartTime}
              setTime={(t) => updateField("salesStartTime", t)}
            />
            <DateTimePicker
              label="Sales End"
              date={eventData.salesEndDate}
              setDate={(d) => updateField("salesEndDate", d)}
              time={eventData.salesEndTime}
              setTime={(t) => updateField("salesEndTime", t)}
            />
          </CardContent>
        </Card>

        {/* Tickets */}
        <Card className="bg-gray-800/40 border-gray-700 backdrop-blur-sm rounded-xl overflow-hidden transition-all hover:bg-gray-800/60">
          <CardHeader className="px-6 py-5 border-b border-gray-700 flex flex-row justify-between items-center">
            <CardTitle className="text-xl flex items-center gap-3 text-white">
              <div className="p-2 rounded-lg bg-green-900/20">
                <Ticket className="h-5 w-5 text-green-400" />
              </div>
              Ticket Types
            </CardTitle>
            <Button
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-4 py-2 rounded-md shadow-md transition-all"
              onClick={() => openTicketDialog()}
            >
              <Plus size={16} className="mr-2" /> Add Ticket
            </Button>
          </CardHeader>
          
          <CardContent className="p-6">
            {eventData.ticketTypes.length === 0 ? (
              <div className="text-center py-8 text-gray-400 border border-dashed border-gray-700 rounded-lg">
                <Ticket className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No tickets added yet.</p>
                <p className="text-sm mt-1">
                  Add your first ticket type to get started.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4 border-gray-600 text-purple-400 hover:bg-gray-700"
                  onClick={() => openTicketDialog()}
                >
                  <Plus size={16} className="mr-2" /> Create Ticket
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {eventData.ticketTypes.map((t) => (
                  <div
                    key={t.id}
                    className="flex justify-between items-start bg-gray-900/60 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-all"
                  >
                    <div className="space-y-2 flex-1">
                      <p className="font-semibold text-white text-lg">{t.name}</p>
                      <div className="flex flex-wrap gap-2 items-center">
                        <Badge
                          variant="outline"
                          className="bg-blue-900/20 text-blue-300 border-blue-700"
                        >
                          ${t.price.toFixed(2)}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="bg-gray-800 text-gray-300 border-gray-700"
                        >
                          {t.totalAvailable} available
                        </Badge>
                      </div>
                      {t.description && (
                        <p className="text-sm text-gray-400 mt-2 max-w-prose">
                          {t.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-purple-400 hover:bg-purple-900/20 transition-colors"
                        onClick={() => openTicketDialog(t)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-red-400 hover:bg-red-900/20 transition-colors"
                        onClick={() =>
                          updateField(
                            "ticketTypes",
                            eventData.ticketTypes.filter((x) => x.id !== t.id)
                          )
                        }
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status */}
        <Card className="bg-gray-800/40 border-gray-700 backdrop-blur-sm rounded-xl overflow-hidden transition-all hover:bg-gray-800/60">
          <CardHeader className="px-6 py-5 border-b border-gray-700">
            <CardTitle className="text-xl text-white">Event Status</CardTitle>
          </CardHeader>
          <CardContent className="px-6 py-5">
            <Label className="text-gray-300 pb-1">Current Status</Label>
            <Select
              value={eventData.status}
              onValueChange={(v) => updateField("status", v)}
            >
              <SelectTrigger className="bg-gray-900 border-gray-700 text-white mt-1 focus:ring-purple-500 py-6">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                {Object.entries(EventStatusEnum).map(([key, value]) => (
                  <SelectItem
                    key={value}
                    value={value}
                    className="focus:bg-gray-700 focus:text-white"
                  >
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Error */}
        {error && (
          <Alert
            variant="destructive"
            className="bg-red-900/40 border border-red-700"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Submit */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4 sticky bottom-4 z-10">
          <Button
            variant="outline"
            className="flex-1 bg-transparent border-gray-600 text-white hover:bg-gray-700 py-6 text-lg transition-all"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-6 text-lg shadow-lg transition-all"
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? (isEditMode ? "Updating..." : "Creating...") : isEditMode ? "Update Event" : "Create Event"}
          </Button>
        </div>
      </main>
      
      <TicketEditorDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        ticket={editingTicket}
        onSave={handleSaveTicket}
      />
      
      <Footer />
    </div>
  );
};

export default DashboardManageEventPage;