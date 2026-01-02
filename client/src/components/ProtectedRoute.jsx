import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem("token");

  // Already on login page → do nothing
  if (!token && location.pathname === "/login") {
    return children;
  }

  // Not logged in → redirect once
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Logged in → allow access
  return children;
};

export default ProtectedRoute;
