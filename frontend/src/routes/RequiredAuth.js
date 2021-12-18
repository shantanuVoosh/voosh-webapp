import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { loginFailure } from "../redux/Auth/actions/authAction";
import { fetchData } from "../redux/Data/actions/actions";
import cookie from "react-cookies";
const APP_TOKEN_BY_GOOGLE = "voosh-token-by-google";
const APP_TOKEN = "voosh-token";

// !Protecting routes
function RequiredAuth({ children }) {
  const { isAuthenticated, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();

  // !Checking if user is authenticated, Phone Number
  const getDataFromApi = React.useCallback(async () => {
    try {
      const { data: response } = await axios.post("/voosh-data", {
        // 1st time token will be null or undefined
        token: token,
      });
      console.log("voosh data", response);

      // *dispatch the data if token not expired
      if (response.status === "success") {
        const { api_data, res_name } = response.data;
        dispatch(fetchData(api_data, res_name));
      }
      // *if token expired, login will fail, will redirect to login page and relogin
      else {
        dispatch(loginFailure());
        cookie.remove(APP_TOKEN);
        Navigate("/");
      }
    } catch (err) {
      // *Error while fetching data
      dispatch(loginFailure(err));
    }
  }, [token, dispatch]);

  React.useEffect(() => {
    if (isAuthenticated && token) {
      getDataFromApi();
    }
  }, [isAuthenticated, token, getDataFromApi]);

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/" replace state={{ path: location.pathname }}></Navigate>
  );
}

export default RequiredAuth;
