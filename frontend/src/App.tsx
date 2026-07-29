import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { lazy, Suspense } from "react";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const ServicesPage = lazy(() => import("./pages/ServicesPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const TrackShipmentPage = lazy(() => import("./pages/TrackShipmentPage"));
const ClientDashboard = lazy(() => import("./pages/ClientDashboard"));
const TrackingDetailPage = lazy(() => import("./pages/TrackingDetailPage"));
const MessagingPage = lazy(() => import("./pages/MessagingPage"));
const OperatorDashboard = lazy(() => import("./pages/OperatorDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminTrackingDetail = lazy(() => import("./pages/AdminTrackingDetail"));
const AdminUsersPage = lazy(() => import("./pages/AdminUsersPage"));
const AdminSettingsPage = lazy(() => import("./pages/AdminSettingsPage"));
const AdminMessagesPage = lazy(() => import("./pages/AdminMessagesPage"));
const ClientTrackingsPage = lazy(() => import("./pages/ClientTrackingsPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const PublicTrackingPage = lazy(() => import("./pages/PublicTrackingPage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

function PageLoader() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-6 h-6 rounded-full border-2 border-black/10 border-t-black/60 animate-spin" />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/track" element={<TrackShipmentPage />} />
            <Route path="/track/:id" element={<PublicTrackingPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

            <Route path="/dashboard" element={<ProtectedRoute><ClientDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/trackings" element={<ProtectedRoute><ClientTrackingsPage /></ProtectedRoute>} />
            <Route path="/dashboard/tracking/:id" element={<ProtectedRoute><TrackingDetailPage /></ProtectedRoute>} />
            <Route path="/dashboard/messages" element={<ProtectedRoute><MessagingPage role="client" /></ProtectedRoute>} />
            <Route path="/dashboard/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

            <Route path="/operator" element={<ProtectedRoute requiredRole="operator"><OperatorDashboard /></ProtectedRoute>} />
            <Route path="/operator/trackings" element={<ProtectedRoute requiredRole="operator"><OperatorDashboard /></ProtectedRoute>} />
            <Route path="/operator/messages" element={<ProtectedRoute requiredRole="operator"><MessagingPage role="operator" /></ProtectedRoute>} />

            <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/trackings" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/trackings/:id" element={<ProtectedRoute requiredRole="admin"><AdminTrackingDetail /></ProtectedRoute>} />
            <Route path="/admin/notifications" element={<ProtectedRoute requiredRole="admin"><AdminDashboard initialTab="notifications" /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute requiredRole="admin"><AdminUsersPage /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute requiredRole="admin"><AdminSettingsPage /></ProtectedRoute>} />
            <Route path="/admin/messages" element={<ProtectedRoute requiredRole="admin"><AdminMessagesPage /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
