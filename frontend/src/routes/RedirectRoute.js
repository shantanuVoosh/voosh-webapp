import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// ! only for redirecting to the login page
function RedirectRoute({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  return !isAuthenticated ? (
    children
  ) : (
    <Navigate
      to="/dashboard"
      replace
      state={{ path: location.pathname }}
    ></Navigate>
  );
}

export default RedirectRoute;
