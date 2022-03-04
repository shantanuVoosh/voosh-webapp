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
  setListingIdWithRestaurantDetails,
  setUserDetails,
  setOhProductIndex,
  setLSProductIndex,
  setSalesProductIndex,
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

// ? Sample Data -- Static data
import {
  sampleName,
  cfhRestaurantList,
  cfh_month_data,
  cfh_prev_month_data,
  cfh_this_week_data,
  cfh_prev_week_data,
  cfh_cr_data,
} from "../miscellaneous/sampleData";

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
  const {
    isAuthenticated,
    token,
    isTemporaryAuthenticated,
    temporaryToken,
    dummyUser,
    isDummyUserAuthenticated,
  } = useSelector((state) => state.auth);
  const resultType = useSelector((state) => state.data.resultType);
  const res_name = useSelector((state) => state.data.res_name);

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
        "This Month": ((date) => {
          console.log(date);
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
      dispatch(isLoading(true));
      // const client_res_id = restaurantList.find((item) => item.name === res_name).id;
      const { data: response } = await axios.post("/voosh-data", {
        //? 1st time token will be null or undefined
        token: token,
        date: date,
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
          api_data2,
          newRestaurantList,
          userDeatils,
        } = response.data;
        // ! call of the first time
        console.log(newRestaurantList, "new list");
        if (currentProductIndex === -1) {
          console.log("call data with res_name and res_id");
          console.log("response form api on 1st call");

          // ? grab the 1st restaurant details from the list
          // ? it will contain atleast one restaurant

          // listing_id: "P0051"
          // restaurant_name: "CHETTINAD FOOD HOUSE"
          // swiggy_res_id: 256302
          // swiggy_run_date: "31-01-2022"
          // zomato_res_id: 56834

          const firstRestaurant = newRestaurantList[0];
          const {
            owner_name,
            owner_number,
            swiggy_password,
            swiggy_register_phone,
            zomato_register_phone,
            email,
          } = userDeatils;

          const {
            listing_id,
            restaurant_name,
            swiggy_res_id: response_swiggy_res_id,
            zomato_res_id: response_zomato_res_id,
          } = firstRestaurant;

          dispatch(
            fetchAllData({
              data: api_data2,
              res_name: name,
              allRestaurants: newRestaurantList,
              date: date,
            })
          );

          // userDeatils:
          // kitchen_id: "P010"
          // owner_name: "Narender Danu"
          // owner_number: 7353932111
          // swiggy_password: "top@1234"
          // swiggy_register_phone: 7353932111
          // zomato_register_phone: 7353932111
          // !temp user details
          dispatch(
            setListingIdWithRestaurantDetails({
              listingID: listing_id,
              restaurant_name,
              swiggy_res_id: response_swiggy_res_id,
              zomato_res_id: response_zomato_res_id,
            })
          );

          dispatch(
            setUserDetails({
              owner_name,
              owner_number,
              swiggy_password,
              swiggy_register_phone,
              zomato_register_phone,
              email,
            })
          );

          // ! which ever is available will be shown first
          // if (response_swiggy_res_id !== null) {
          //   dispatch(setOhProductIndex(0));
          //   dispatch(setLSProductIndex(0));
          //   dispatch(setSalesProductIndex(0));
          // } else {
          //   dispatch(setOhProductIndex(1));
          //   dispatch(setLSProductIndex(1));
          //   dispatch(setSalesProductIndex(1));
          // }
        }
        // ! only restaurant data will change or dispatch
        else {
          console.log("only data");
          console.log(response.data, "response form api on 2nd call");
          dispatch(fetchData({ data: api_data2, date }));
          console.log(zomato_res_id, swiggy_res_id);
          // ! which ever is available will be shown first
          // if (swiggy_res_id !== null) {
          //   dispatch(setOhProductIndex(0));
          //   dispatch(setLSProductIndex(0));
          //   dispatch(setSalesProductIndex(0));
          // } else {
          //   dispatch(setOhProductIndex(1));
          //   dispatch(setLSProductIndex(1));
          //   dispatch(setSalesProductIndex(1));
          // }
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
    resultType,
    zomato_res_id,
    swiggy_res_id,
    listingID,
    startDate,
    endDate,
    res_name,
  ]);

  React.useEffect(() => {
    if (dummyUser === false && isAuthenticated && token) {
      getDataFromApi();
    }
  }, [isAuthenticated, token, getDataFromApi, resultType]);

  React.useEffect(() => {
    if (dummyUser) {
      dispatch(
        setListingIdWithRestaurantDetails({
          listingID: "P0051",
          swiggy_res_id: 256302,
          zomato_res_id: 56834,
          restaurant_name: "Sample Restaurant",
        })
      );
      dispatch(
        fetchAllData({
          data: cfh_month_data,
          res_name: sampleName,
          allRestaurants: cfhRestaurantList,
          date: "2022-02-25",
        })
      );
    }
  }, []);

  React.useEffect(() => {
    console.log("cfhRestaurantList:------------>", cfhRestaurantList);
    if (dummyUser) {
      dispatch(isLoading(true));

      // ? CR data
      if (resultType === "Custom Range") {
        dispatch(fetchData({ data: cfh_cr_data, date: "2022-02-24" }));
      }
      // ? This Month data
      else if (resultType === "This Month") {
        dispatch(fetchData({ data: cfh_month_data, date: "2022-02-25" }));
      }
      // ? Previous Month data
      else if (resultType === "Previous Month") {
        dispatch(fetchData({ data: cfh_prev_month_data, date: "2022-02-24" }));
      }
      // ? This Week data
      else if (resultType === "This Week") {
        dispatch(fetchData({ data: cfh_this_week_data, date: "2022-02-25" }));
      }
      // ? Previous Week data
      else if (resultType === "Previous Week") {
        dispatch(fetchData({ data: cfh_prev_week_data, date: "2022-02-24" }));
      }
      dispatch(isLoading(false));
    }
  }, [resultType]);

  if (dummyUser) {
    return isDummyUserAuthenticated ? (
      children
    ) : (
      <>
        <Navigate to="/" replace state={{ path: location.pathname }}></Navigate>
      </>
    );
  }

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
