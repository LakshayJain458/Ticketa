import { useState, useEffect, useRef } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useAuth } from "react-oidc-context";
import { useNavigate, useSearchParams } from "react-router-dom";
import NavBar from "../../components/Navbar";
import Footer from "../../components/Footer";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";

import {
  TicketValidationMethod,
  TicketValidationStatus,
} from "../../domain/domain";

import { validateTicket, getEvent } from "../../lib/api";

import { AlertCircle, Check, X } from "lucide-react";

const ValidateQrPage = () => {
  const { isLoading, user } = useAuth();
  const [searchParams] = useSearchParams();
  const eventIdParam = searchParams.get("eventId");
  const manualParam = searchParams.get("manual");
  const navigate = useNavigate();


  const [isManual, setIsManual] = useState(!!manualParam);
  const [mode, setMode] = useState(!!manualParam ? "manual" : "choice"); // 'choice' | 'camera' | 'manual'
  const [data, setData] = useState(undefined);
  const [error, setError] = useState(undefined);
  const [validationStatus, setValidationStatus] = useState(undefined);
  const [validationMessage, setValidationMessage] = useState(undefined);
  const [validatedTicketId, setValidatedTicketId] = useState(undefined);
  const [validatedBuyerName, setValidatedBuyerName] = useState(undefined);
  const [isValidating, setIsValidating] = useState(false);
  const [eventInfo, setEventInfo] = useState(undefined);
  const manualInputRef = useRef(null);

  const handleReset = () => {
    setIsManual(false);
    setData(undefined);
    setError(undefined);
    setValidationStatus(undefined);
  };

  const handleError = (err) => {
    if (err instanceof Error) {
      setError(err.message);
    } else if (typeof err === "string") {
      setError(err);
    } else {
      setError("An unknown error occurred");
    }
  };

  const handleValidate = async (id, method) => {
    if (!user?.access_token) return;

    try {
  if (isValidating) return;
  setError(undefined);
  setValidationMessage(undefined);
  setValidationStatus(undefined);
  setValidatedTicketId(undefined);
  setIsValidating(true);
  // include eventId so backend can scope validation if supported
  const response = await validateTicket(user.access_token, { id, method, eventId: eventIdParam });
  console.debug("validateTicket response:", response);
  // backend returns { ticketId, validationStatus }
  let status = (response?.validationStatus ?? response?.status ?? null);
  // normalize enums like { validationStatus: 'VALID' } or objects
  if (typeof status === "object" && status?.name) status = status.name;
  if (typeof status === "string") status = status.toUpperCase();
  const ticketId = response?.ticketId ?? null;
  if (!status) throw new Error("No validation status returned from server");
  setValidationStatus(status);
  setValidatedTicketId(ticketId ? String(ticketId) : undefined);
  // try to get buyer name from response; if not present, try fetching ticket details
  const buyerName = response?.buyerName ?? null;
  if (buyerName) {
    setValidatedBuyerName(String(buyerName));
  } else if (ticketId) {
    try {
      const ticketDetails = await getTicket(user.access_token, ticketId);
      setValidatedBuyerName(ticketDetails?.ticketBuyer?.username || ticketDetails?.ticketBuyer || ticketDetails?.ticketBuyerName || ticketDetails?.ticketBuyer?.name || null);
    } catch (e) {
      // ignore
    }
  }
  // clear any scanned data so scanner becomes ready for next scan
  setData(undefined);
      // human-friendly message
      if (status === TicketValidationStatus.VALID) {
        setValidationMessage("Ticket validated — entry granted.");
        playTone(true);
      } else if (status === TicketValidationStatus.INVALID) {
        setValidationMessage("Ticket invalid or already used.");
        playTone(false);
      } else if (status === TicketValidationStatus.EXPIRED) {
        setValidationMessage("Ticket expired — cannot be used.");
        playTone(false);
      } else {
        setValidationMessage("Unknown validation result.");
        playTone(false);
      }
    } catch (err) {
      console.error("Validation error:", err);
      handleError(err);
    }
    finally {
      setIsValidating(false);
    }
  };

  // small audio feedback for validation
  const playTone = (success = true) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = success ? 880 : 220;
      g.gain.value = 0.0001;
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      g.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.45);
      o.stop(ctx.currentTime + 0.5);
    } catch (e) {
      // ignore audio errors
    }
  };

  if (isLoading || !user?.access_token) {
    return <p>Loading...</p>;
  }

  // Load event info when eventId is present so staff can confirm which event they're validating for
  useEffect(() => {
    if (!eventIdParam || !user?.access_token) return;
    let mounted = true;
    const load = async () => {
      try {
        const ev = await getEvent(user.access_token, eventIdParam);
        if (mounted) setEventInfo(ev);
      } catch (e) {
        // ignore non-fatal
      }
    };
    load();
    return () => (mounted = false);
  }, [eventIdParam, user?.access_token]);

  // focus manual input when manual mode is toggled
  useEffect(() => {
    if (isManual) {
      const t = setTimeout(() => manualInputRef.current?.focus?.(), 120);
      return () => clearTimeout(t);
    }
  }, [isManual]);

  // auto-clear validation result after a short delay so staff can continue scanning
  useEffect(() => {
    if (!validationStatus) return;
    const t = setTimeout(() => {
      setValidationStatus(undefined);
      setValidationMessage(undefined);
      setValidatedTicketId(undefined);
      setData(undefined);
    }, 2500);
    return () => clearTimeout(t);
  }, [validationStatus]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <NavBar />
      <div className="flex-1 flex justify-center items-center p-6">
      {/* Large result overlay: click to dismiss */}
      {validationStatus && validationMessage && (
        <div
          onClick={() => {
            setValidationStatus(undefined);
            setValidationMessage(undefined);
            setValidatedTicketId(undefined);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 cursor-pointer"
        >
          <div className="bg-white/5 border border-gray-700 rounded-2xl p-6 w-full max-w-md text-center">
            {validationStatus === TicketValidationStatus.VALID ? (
              <div className="text-green-400">
                <Check className="mx-auto w-16 h-16" />
                <h3 className="text-2xl font-bold mt-2">Validated</h3>
                <p className="mt-2 text-gray-300">{validationMessage}</p>
                {validatedBuyerName && (
                  <p className="mt-2 text-lg text-white">Attendee: {validatedBuyerName}</p>
                )}
                {validatedTicketId && (
                  <p className="mt-3 text-sm text-gray-300">Ticket: {validatedTicketId}</p>
                )}
                <div className="mt-4 flex justify-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setValidationStatus(undefined);
                      setValidationMessage(undefined);
                      setValidatedTicketId(undefined);
                      setValidatedBuyerName(undefined);
                      // navigate back to staff landing
                      navigate('/dashboard/staff');
                    }}
                    className="px-4 py-2 bg-cyan-600 text-black rounded-md font-semibold"
                  >
                    Back to staff
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-rose-400">
                <X className="mx-auto w-16 h-16" />
                <h3 className="text-2xl font-bold mt-2">Validation Failed</h3>
                <p className="mt-2 text-gray-300">{validationMessage}</p>
              </div>
            )}
            <p className="mt-4 text-xs text-gray-500">Tap anywhere to continue</p>
          </div>
        </div>
      )}
        <div className="border border-gray-400 max-w-sm w-full p-4 rounded-xl">
        <div className="mb-4 text-center">
          <h2 className="text-lg font-semibold">{eventInfo?.name || eventInfo?.eventName || "Ticket Scanner"}</h2>
          {eventInfo?.venue && <p className="text-xs text-gray-400">{eventInfo.venue || eventInfo.eventVenue}</p>}
        </div>
        {error && (
          <Alert variant="destructive" className="bg-gray-900 border-red-700 mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {validationStatus && validationMessage && (
          <div className="mb-4">
            {validationStatus === TicketValidationStatus.VALID ? (
              <Alert className="bg-green-800 border-green-500">
                <Check className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>{validationMessage}</AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive" className="bg-gray-900 border-red-700">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Invalid</AlertTitle>
                <AlertDescription>{validationMessage}</AlertDescription>
              </Alert>
            )}
            {validatedTicketId && (
              <p className="text-sm text-gray-300 mt-2">Ticket: {validatedTicketId}</p>
            )}
          </div>
        )}

        {/* Mode choice: ask staff whether to use camera or manual first */}
        {mode === "choice" && (
          <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              className="p-6 rounded-xl bg-gray-900 border border-gray-700 hover:bg-gray-800"
              onClick={() => {
                setMode("camera");
                setIsManual(false);
              }}
            >
              <div className="text-lg font-semibold">Use Camera</div>
              <div className="text-sm text-gray-400 mt-2">Scan QR codes using the device camera</div>
            </button>
            <button
              className="p-6 rounded-xl bg-gray-900 border border-gray-700 hover:bg-gray-800"
              onClick={() => {
                setMode("manual");
                setIsManual(true);
              }}
            >
              <div className="text-lg font-semibold">Manual</div>
              <div className="text-sm text-gray-400 mt-2">Enter ticket ID manually</div>
            </button>
          </div>
        )}

        {mode === "camera" && (
          <div className="rounded-lg overflow-hidden mx-auto mb-8 relative">
            <Scanner
              key={`scanner-${data}-${validationStatus}`}
              onScan={(result) => {
                if (validationStatus || isValidating) return; // ignore while processing

                // normalize result to a string id
                const normalize = (r) => {
                  if (!r) return null;
                  if (typeof r === "string") return r;
                  if (Array.isArray(r) && r.length > 0) {
                    const first = r[0];
                    return first?.rawValue ?? first?.text ?? null;
                  }
                  return r?.rawValue ?? r?.text ?? null;
                };

                try {
                  const qrCodeId = normalize(result);
                  if (!qrCodeId) return;
                  setData(qrCodeId);
                  handleValidate(qrCodeId, TicketValidationMethod.QR_SCAN);
                } catch (e) {
                  handleError(e);
                }
              }}
              onError={handleError}
            />

            {validationStatus && (
              <div className="absolute inset-0 flex items-center justify-center">
                {validationStatus === TicketValidationStatus.VALID ? (
                  <div className="bg-green-500 rounded-full p-4">
                    <Check className="w-20 h-20" />
                  </div>
                ) : (
                  <div className="bg-red-500 rounded-full p-4">
                    <X className="w-20 h-20" />
                  </div>
                )}
              </div>
            )}
            {/* disable input while validating */}
            {isValidating && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <div className="flex flex-col items-center">
                  <div className="h-10 w-10 border-t-2 border-b-2 border-white rounded-full animate-spin" />
                  <div className="mt-2 text-sm text-white">Validating...</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Manual Validation */}
        {mode === "manual" ? (
          <div className="pb-8">
            <Input
              ref={manualInputRef}
              className="w-full text-white text-lg mb-6 bg-gray-900 border-gray-700"
              placeholder="Enter Ticket ID"
              value={data || ""}
              onChange={(e) => setData(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const trimmed = (data || "").trim();
                  if (trimmed) handleValidate(trimmed, TicketValidationMethod.MANUAL);
                }
              }}
            />
            <Button
              className="bg-purple-500 w-full h-[60px] hover:bg-purple-800"
              onClick={() => {
                const trimmed = (data || "").trim();
                if (!trimmed) return setError("Please enter a ticket ID");
                handleValidate(trimmed, TicketValidationMethod.MANUAL);
              }}
              disabled={isValidating}
            >
              {isValidating ? "Validating..." : "Submit"}
            </Button>
          </div>
        ) : (
          <div>
            <div className="border-white border-2 h-12 rounded-md font-mono flex justify-center items-center">
              <span>{data || "Scan for Result"}</span>
            </div>
            {/* <div className="flex gap-3 mt-6">
              <Button
                className="flex-1 bg-gray-900 hover:bg-gray-600 border-gray-500 border-2 h-[60px] text-lg"
                onClick={() => setMode("choice")}
              >
                Choose Mode
              </Button>
              <Button
                className="w-28 bg-gray-700 hover:bg-gray-600 border-gray-500 border-2 h-[60px] text-lg"
                onClick={() => setMode("manual")}
              >
                Manual
              </Button>
            </div> */}
          </div>
        )}

        <Button
          className="bg-gray-500 mt-4 hover:bg-gray-800 w-full h-[60px] text-lg"
          onClick={handleReset}
        >
          Reset
        </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ValidateQrPage;
