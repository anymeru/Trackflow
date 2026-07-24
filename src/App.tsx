import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ServicesPage from "./pages/ServicesPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import TrackShipmentPage from "./pages/TrackShipmentPage";
import ClientDashboard from "./pages/ClientDashboard";
import TrackingDetailPage from "./pages/TrackingDetailPage";
import MessagingPage from "./pages/MessagingPage";
import OperatorDashboard from "./pages/OperatorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminTrackingDetail from "./pages/AdminTrackingDetail";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminSettingsPage from "./pages/AdminSettingsPage";
import AdminMessagesPage from "./pages/AdminMessagesPage";
import ClientTrackingsPage from "./pages/ClientTrackingsPage";
import ProfilePage from "./pages/ProfilePage";
import PublicTrackingPage from "./pages/PublicTrackingPage";
import EmailPreviewPage from "./pages/EmailPreviewPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/track" element={<TrackShipmentPage />} />
              <Route path="/track/:id" element={<PublicTrackingPage />} />
              <Route path="/email-preview" element={<EmailPreviewPage />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <ClientDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/trackings"
                element={
                  <ProtectedRoute>
                    <ClientTrackingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/tracking/:id"
                element={
                  <ProtectedRoute>
                    <TrackingDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/messages"
                element={
                  <ProtectedRoute>
                    <MessagingPage role="client" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/operator"
                element={
                  <ProtectedRoute requiredRole="operator">
                    <OperatorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/operator/trackings"
                element={
                  <ProtectedRoute requiredRole="operator">
                    <OperatorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/operator/messages"
                element={
                  <ProtectedRoute requiredRole="operator">
                    <MessagingPage role="operator" />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/trackings"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/trackings/:id"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminTrackingDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/notifications"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard initialTab="notifications" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminUsersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminSettingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/messages"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminMessagesPage />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
