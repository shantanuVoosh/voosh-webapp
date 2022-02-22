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
  setResultType,
} from "../redux/Data/actions/actions";
import cookie from "react-cookies";
import {
  //? if today is 2022-1-1, then 2021-12-31 after 12 hours or 2021-12-30
  getPreviousDay12HoursAgoDate,
  getCurrentMonthDate,
  getPreviousWeekDate,
  getPreviousMonthDate,

  //? Only to get week or month number
  getWeekNumberFromDate,
  getMonthNumberFromDate,
} from "../utils/dateProvider";
const APP_TOKEN_BY_GOOGLE = "voosh-token-by-google";
const APP_TOKEN = "voosh-token";
const TEMP_APP_TOKEN = "temp-voosh-token";
const allResultTypeMap = {
  "Previous Day": getPreviousDay12HoursAgoDate(),
  "This Week": getPreviousDay12HoursAgoDate(),
  "Previous Week": getPreviousWeekDate(),
  "This Month": getCurrentMonthDate(),
  "Previous Month": getPreviousMonthDate(),
};

// !Protecting routes
function RequiredAuth({ children }) {
  const { isAuthenticated, token, isTemporaryAuthenticated, temporaryToken } =
    useSelector((state) => state.auth);
  const resultType = useSelector((state) => state.data.resultType);
  const res_name = useSelector((state) => state.data.res_name);
  const res_id = useSelector((state) => state.data.res_id);
  const {
    startDate,
    endDate,
    zomato_res_id,
    swiggy_res_id,
    listingID,
    currentProductIndex,
  } = useSelector((state) => state.data);
  const dispatch = useDispatch();
  const location = useLocation();

  // !Checking if user is authenticated, Phone Number
  const getDataFromApi = React.useCallback(async () => {
    const date = allResultTypeMap[resultType];
    // !for testing purpose
    console.log("Date inside state:", date);
    // if (resultType === "Custom Range") {

    //   console.log("working so far............");
    //   console.log("startDate:", startDate);
    //   console.log("endDate:", endDate);
    //   return;
    // }
    try {
      dispatch(isLoading(true));
      // ? To identify if the slected option is week or month
      const tempMonthMap = {
        // ? we have prev day sales in all collection but, if revenue page is
        // ? reloaded then we have to fetch data from api again
        "Previous Day": "week",
        "This Week": "week",
        "Previous Week": "week",
        "This Month": "month",
        "Previous Month": "month",
        "Custom Range": "Custom Range",
      };
      //? date is already modified, just calculating the week number or month number
      const tempNumberMap = {
        "Previous Day": getWeekNumberFromDate(date),
        "This Week": getWeekNumberFromDate(date),
        "Previous Week": getWeekNumberFromDate(date),
        // "This Month": getMonthNumberFromDate(date),
        "This Month": ((date)=>{
          console.log(date)
          var d = new Date(date);
          var month = d.getMonth() + 1;
          return month;
        })(date),
        "Previous Month": getMonthNumberFromDate(date),
        "Custom Range": null,
      };

      console.log(
        "test-1:",
        tempNumberMap["This Month"],
        resultType,
        tempNumberMap[resultType]
      );
      console.log("tempNumberMap:", tempNumberMap[resultType]);
      console.log("tempMonthMap:", tempMonthMap[resultType]);

      // const client_res_id = restaurantList.find((item) => item.name === res_name).id;
      const { data: response } = await axios.post("/voosh-data", {
        //? 1st time token will be null or undefined
        token: token,
        date: date,
        client_res_id: res_id,
        number: tempNumberMap[resultType],
        resultType: tempMonthMap[resultType],
        startDate: startDate ? startDate : "",
        endDate: endDate ? endDate : "",
        zomato_res_id,
        swiggy_res_id,
        listingID,
      });
      console.log("voosh data", response);

      // *dispatch the data if token not expired
      if (response.status === "success") {
        const {
          api_data,
          res_name: name,
          restaurantList,
          res_id: id,
          api_data2,
          newRestaurantList,
        } = response.data;
        // ! call of the first time
        console.log(newRestaurantList, "new list");
        if (currentProductIndex === -1) {
          console.log("call data with res_name and res_id");
          dispatch(
            fetchAllData({
              data: api_data2,
              res_name: name,
              restaurantList: restaurantList,
              allRestaurants: newRestaurantList,
              res_id: id,
              date: date,
            })
          );
        }
        // ! only restaurant data will change or dispatch
        else {
          console.log("only data");
          dispatch(fetchData({ data: api_data2, date }));
          // dispatch(
          //   fetchAllData({
          //     data: api_data2,
          //     res_name: name,
          //     restaurantList: restaurantList,
          //     allRestaurants: newRestaurantList,
          //     res_id: id,
          //     date: date,
          //   })
          // );
        }
        dispatch(isLoading(false));
      }
      // *if token expired, login will fail, will redirect to login page and relogin
      else {
        dispatch(loginFailure());
        cookie.remove(APP_TOKEN);
        cookie.remove(TEMP_APP_TOKEN);
        Navigate("/");
        dispatch(isLoading(false));
      }
    } catch (err) {
      // *Error while fetching data
      console.log("err", err);
      dispatch(loginFailure(err));
      cookie.remove(APP_TOKEN);
      cookie.remove(TEMP_APP_TOKEN);
      dispatch(isLoading(false));
    }
  }, [
    token,
    dispatch,
    resultType,
    zomato_res_id,
    swiggy_res_id,
    listingID,
    startDate,
    endDate,
    res_name,
  ]);

  React.useEffect(() => {
    if (isAuthenticated && token) {
      getDataFromApi();
    }
  }, [isAuthenticated, token, getDataFromApi, resultType, res_id]);

  // return isAuthenticated ? (
  //   children
  // ) : (
  //   <Navigate to="/" replace state={{ path: location.pathname }}></Navigate>
  // );
  // isTemporaryAuthenticated, temporaryToken
  return isAuthenticated ? (
    children
  ) : isTemporaryAuthenticated ? (
    <Navigate
      to="/onboarding-dashboard"
      replace
      state={{ path: location.pathname }}
    ></Navigate>
  ) : (
    <Navigate to="/" replace state={{ path: location.pathname }}></Navigate>
  );
}

export default RequiredAuth;
