import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  console.log("Token:", token); // Debug token
  console.log("Role:", role); // Debug role

  console.log("Allowed Roles:", allowedRoles);
    console.log("User Role:", role);

  if (!token || !allowedRoles.includes(role || "")) {
    return <Navigate to="/not-authorized" replace />; // Redirect to "Access Denied" page
  }

  return <>{children}</>;
};

export default ProtectedRoute;
