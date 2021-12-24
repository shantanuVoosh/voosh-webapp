import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { loginFailure } from "../redux/Auth/actions/authAction";
import {
  fetchData,
  isLoading,
  setRestaurantNameAndId,
  fetchAllData,
} from "../redux/Data/actions/actions";
import cookie from "react-cookies";
import {
  getPreviousMonth,
  getCurrentMonth,
  getPreviousWeek,
  getYesterdayDateBefore12HoursAgo,
} from "../utils/dateProvider";
const APP_TOKEN_BY_GOOGLE = "voosh-token-by-google";
const APP_TOKEN = "voosh-token";
const allResultTypeMap = {
  week: getYesterdayDateBefore12HoursAgo(),
  month: getCurrentMonth(),
  prev_week: getPreviousWeek(),
  prev_month: getPreviousMonth(),
};

// !Protecting routes
function RequiredAuth({ children }) {
  const { isAuthenticated, token } = useSelector((state) => state.auth);
  const resultType = useSelector((state) => state.data.resultType);
  const res_name = useSelector((state) => state.data.res_name);
  const res_id = useSelector((state) => state.data.res_id);
  const dispatch = useDispatch();
  const location = useLocation();

  // !Checking if user is authenticated, Phone Number
  const getDataFromApi = React.useCallback(async () => {
    const date = allResultTypeMap[resultType];
    if (resultType === "month") {
      return;
    }
    try {
      dispatch(isLoading(true));
      // const client_res_id = restaurantList.find((item) => item.name === res_name).id;
      const { data: response } = await axios.post("/voosh-data", {
        //? 1st time token will be null or undefined
        token: token,
        date: date,
        client_res_id: res_id,
      });
      console.log("voosh data", response);

      // *dispatch the data if token not expired
      if (response.status === "success") {
        const {
          api_data,
          res_name: name,
          restaurantList,
          res_id: id,
        } = response.data;
        if (res_name === "" && res_id === "") {
          console.log("call data with res_name and res_id");
          dispatch(fetchAllData(api_data, name, restaurantList, id));
        } else {
          console.log("only data");
          dispatch(fetchData(api_data));
        }
        dispatch(isLoading(false));
      }
      // *if token expired, login will fail, will redirect to login page and relogin
      else {
        dispatch(loginFailure());
        cookie.remove(APP_TOKEN);
        Navigate("/");
        dispatch(isLoading(false));
      }
    } catch (err) {
      // *Error while fetching data
      console.log("err", err);
      dispatch(loginFailure(err));
      dispatch(isLoading(false));
    }
  }, [token, dispatch, resultType, res_id]);

  React.useEffect(() => {
    if (isAuthenticated && token) {
      getDataFromApi();
    }
  }, [isAuthenticated, token, getDataFromApi, resultType, res_id]);

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/" replace state={{ path: location.pathname }}></Navigate>
  );
}

export default RequiredAuth;
