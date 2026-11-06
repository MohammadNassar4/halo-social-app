import { Navigate, Outlet } from "react-router";
import { useAuth } from "../contexts/authContext/useAuth";

// Only for logged-in users (e.g. /home)
export function ProtectedRoute() {
  const { token } = useAuth();
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

// Only for logged-out users (/login, /register)
export function GuestRoute() {
  const { token } = useAuth();
  return token ? <Navigate to="/home" replace /> : <Outlet />;
}