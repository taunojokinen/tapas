import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../components/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[]; // Optional
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { token, role } = useAuth();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  console.log("Token:", token); // Debug token
  console.log("Role:", role); // Debug role

  console.log("Allowed Roles:", allowedRoles);
  console.log("User Role:", role);

  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    if (!allowedRoles.includes(role || "")) {
      return <Navigate to="/not-authorized" replace />;
    }
  }
  return <>{children}</>;
};

export default ProtectedRoute;
