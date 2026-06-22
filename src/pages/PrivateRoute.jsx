import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, role }) {
  const token = sessionStorage.getItem("authToken");
  const userRole = (sessionStorage.getItem("role") || "").trim();

  if (!token) return <Navigate to="/" />;

  // if (role && userRole !== role) return <Navigate to="/unauthorized" />;

  return children;
}
