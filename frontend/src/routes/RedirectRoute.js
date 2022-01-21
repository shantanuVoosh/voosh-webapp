import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// // ! only for redirecting to the login page
// function RedirectRoute({ children }) {
//   const { isAuthenticated } = useSelector((state) => state.auth);
//   const location = useLocation();

//   return !isAuthenticated ? (
//     children
//   ) : (
//     <Navigate
//       to="/dashboard"
//       replace
//       state={{ path: location.pathname }}
//     ></Navigate>
//   );
// }

// ! only for redirecting to the login page
function RedirectRoute({ children }) {
  const { isAuthenticated, isTemporaryAuthenticated } = useSelector(
    (state) => state.auth
  );
  const location = useLocation();
  //? isauth false so-> either isTempAuth true or false
  // ?if tempAuth true, then redirect to onboard Dashboard... or login page
  // ?isauth true, then redirect to dashboard
  // * childern is just a login page

  return !isAuthenticated ? (
    isTemporaryAuthenticated ? (
      <Navigate
        to="/onboarding-dashboard"
        replace
        state={{ path: location.pathname }}
      ></Navigate>
    ) : (
      children
    )
  ) : (
    <Navigate
      to="/dashboard"
      replace
      state={{ path: location.pathname }}
    ></Navigate>
  );
}

export default RedirectRoute;
