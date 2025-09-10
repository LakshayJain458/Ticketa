import { AuthProvider } from "react-oidc-context";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AttendeeLandingPage from "./pages/attendee/index";
import OrganizersLandingPage from "./pages/organiser/landing";
import DashboardManageEventPage from "./pages/organiser/events/manage";
import DashboardListEventsPage from "./pages/organiser/events/list";
import DashboardListTicketsPage from "./pages/attendee/tickets-list";
import DashboardViewTicketPage from "./pages/attendee/view-ticket";
import PublishedEventsPage from "./pages/attendee/published-event";
import PurchaseTicketPage from "./pages/attendee/purchase-ticket";
import DashboardValidateQrPage from "./pages/staff/validate-qr";
import DashboardPage from "./pages/Dashboard/index";
import LoginPage from "./pages/auth/login";
import CallbackPage from "./pages/auth/callback";
import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
  { path: "/", Component: AttendeeLandingPage },
  { path: "/callback", Component: CallbackPage },
  { path: "/login", Component: LoginPage },
  { path: "/events/:id", Component: PublishedEventsPage },
  {
    path: "/events/:eventId/purchase/:ticketTypeId",
    element: (
      <ProtectedRoute>
        <PurchaseTicketPage />
      </ProtectedRoute>
    ),
  },
  { path: "/organizers", Component: OrganizersLandingPage },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/events",
    element: (
      <ProtectedRoute>
        <DashboardListEventsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/events/create",
    element: (
      <ProtectedRoute>
        <DashboardManageEventPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/events/update/:id",
    element: (
      <ProtectedRoute>
        <DashboardManageEventPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/tickets",
    element: (
      <ProtectedRoute>
        <DashboardListTicketsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/tickets/:id",
    element: (
      <ProtectedRoute>
        <DashboardViewTicketPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/validate-qr",
    element: (
      <ProtectedRoute>
        <DashboardValidateQrPage />
      </ProtectedRoute>
    ),
  },
]);

const oidcConfig = {
  authority: "http://localhost:9090/realms/Ticketa",
  client_id: "ticketa-app",
  redirect_uri: "http://localhost:5173/callback",
};

const App = () => {
  return (
    <AuthProvider {...oidcConfig}>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
