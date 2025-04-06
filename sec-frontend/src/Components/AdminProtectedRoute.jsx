import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function AdminRoute({ children }) {
  const location = useLocation();
  const { isAuthenticated, isAdmin } = useAuth();

  console.log(isAdmin);
  if (!isAuthenticated) {
    // If user is not logged in, redirect to login
    return <Navigate to="/login" state={{ from: location }} />;
  } else if (!isAdmin) {
    // If user is not an admin, redirect to home/dashboard or any other page
    return <Navigate to="/" />;
  } else {
    // If user is logged in and is an admin, render the children
    return children;
  }
}

export default AdminRoute;