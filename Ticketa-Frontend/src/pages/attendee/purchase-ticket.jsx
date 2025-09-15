import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { purchaseTicket } from "@/lib/api";
import { CheckCircle, CreditCard } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate, useParams } from "react-router";

const PurchaseTicketPage = () => {
  const { eventId, ticketTypeId } = useParams();
  const { isLoading, user } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState();
  const [isPurchaseSuccess, setIsPurchaseSuccess] = useState(false);

  useEffect(() => {
    if (!isPurchaseSuccess) return;
    const timer = setTimeout(() => {
      navigate("/dashboard/tickets");
    }, 2500);
    return () => clearTimeout(timer);
  }, [isPurchaseSuccess, navigate]);

  const handlePurchase = async () => {
    if (isLoading || !user?.access_token || !eventId || !ticketTypeId) return;

    try {
      await purchaseTicket(user.access_token, eventId, ticketTypeId);
      setIsPurchaseSuccess(true);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === "string") {
        setError(err);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  // ✅ Success state
  if (isPurchaseSuccess) {
    return (
      <div className="bg-black min-h-screen text-white flex items-center justify-center">
        <div className="max-w-md mx-auto p-8 text-center">
          <div className="bg-white p-8 rounded-xl shadow-2xl text-black space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-2" />
            <h2 className="text-2xl font-bold text-green-600">Purchase Successful</h2>
            <p className="text-gray-700">Your ticket has been issued.</p>
            <div className="text-gray-500 text-sm">Redirecting to your tickets...</div>
            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={() => navigate("/dashboard/tickets")}
            >
              View My Tickets Now
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Form state
  return (
    <div className="bg-black min-h-screen text-white flex items-center justify-center">
      <div className="max-w-md w-full py-12">
        <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-lg p-8 space-y-6">
          {/* Error */}
          {error && (
            <div className="border border-red-500 rounded-lg p-4 bg-red-900/40">
              <div className="text-red-400 text-sm">
                <strong>Error:</strong> {error}
              </div>
            </div>
          )}

          {/* Credit Card Number */}
          <div className="space-y-2">
            <Label className="text-gray-300">Credit Card Number</Label>
            <div className="relative">
              <Input
                type="text"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                className="bg-gray-800 text-white pl-10"
              />
              <CreditCard className="absolute h-4 w-4 text-gray-400 top-3 left-3" />
            </div>
          </div>

          {/* Cardholder Name */}
          <div className="space-y-2">
            <Label className="text-gray-300">Cardholder Name</Label>
            <div className="relative">
              <Input
                type="text"
                placeholder="John Smith"
                className="bg-gray-800 text-white pl-10"
              />
              <CreditCard className="absolute h-4 w-4 text-gray-400 top-3 left-3" />
            </div>
          </div>

          {/* Purchase Button */}
          <Button
            className="w-full bg-purple-600 hover:bg-purple-700 h-12 text-lg cursor-pointer"
            onClick={handlePurchase}
          >
            Purchase Ticket
          </Button>

          <div className="text-gray-500 text-xs text-center">
            ⚠️ This is a mock page, no payment details should be entered.
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseTicketPage;
