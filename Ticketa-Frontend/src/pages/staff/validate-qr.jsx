import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";

import {
  TicketValidationMethod,
  TicketValidationStatus,
} from "../../domain/domain";

import { validateTicket } from "../../lib/api";

import { AlertCircle, Check, X } from "lucide-react";

const ValidateQrPage = () => {
  const { isLoading, user } = useAuth();
  const navigate = useNavigate();

  const [isManual, setIsManual] = useState(false);
  const [data, setData] = useState(undefined);
  const [error, setError] = useState(undefined);
  const [validationStatus, setValidationStatus] = useState(undefined);
  const [validationMessage, setValidationMessage] = useState(undefined);
  const [validatedTicketId, setValidatedTicketId] = useState(undefined);
  const [isValidating, setIsValidating] = useState(false);

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
  setIsValidating(true);
  const response = await validateTicket(user.access_token, { id, method });
  setValidationStatus(response.status);
  setValidatedTicketId(response.ticketId);
      // human-friendly message
      if (response.status === TicketValidationStatus.VALID) {
        setValidationMessage("Ticket validated — entry granted.");
      } else if (response.status === TicketValidationStatus.INVALID) {
        setValidationMessage("Ticket invalid or already used.");
      } else {
        setValidationMessage("Unknown validation result.");
      }
    } catch (err) {
      handleError(err);
    }
    finally {
      setIsValidating(false);
    }
  };

  if (isLoading || !user?.access_token) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-black text-white flex justify-center items-center">
      <div className="border border-gray-400 max-w-sm w-full p-4 rounded-xl">
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

        {/* QR Scanner */}
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
        </div>

        {/* Manual Validation */}
        {isManual ? (
          <div className="pb-8">
            <Input
              className="w-full text-white text-lg mb-6 bg-gray-900 border-gray-700"
              placeholder="Enter Ticket ID"
              onChange={(e) => setData(e.target.value)}
            />
            <Button
              className="bg-purple-500 w-full h-[60px] hover:bg-purple-800"
              onClick={() => handleValidate(data || "", TicketValidationMethod.MANUAL)}
            >
              Submit
            </Button>
          </div>
        ) : (
          <div>
            <div className="border-white border-2 h-12 rounded-md font-mono flex justify-center items-center">
              <span>{data || "Scan for Result"}</span>
            </div>
            <Button
              className="bg-gray-900 hover:bg-gray-600 border-gray-500 border-2 w-full h-[60px] text-lg my-8"
              onClick={() => setIsManual(true)}
            >
              Manual
            </Button>
          </div>
        )}

        <Button
          className="bg-gray-500 hover:bg-gray-800 w-full h-[60px] text-lg"
          onClick={handleReset}
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export default ValidateQrPage;
