import React from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import {
  loginFailure,
  signoutSuccess,
  loginSuccess,
} from "../../redux/Auth/actions/authAction";
import cookie from "react-cookies";
import Loading from "../../components/Loading";
import Explore from "./Explore";
import Home from "./Home";
import Notification from "./Notification";
import CongratulationsPage from "./CongratulationsPage";
import FindMore from "./FindMore";
import SwiggyForm from "./SwiggyForm";
import UserProfile from "./UserProfile";
import FAQ from "./Faq";
const APP_TOKEN = "voosh-token";
const TEMP_APP_TOKEN = "temp-voosh-token";

const Dashboard = () => {
  const { isTemporaryAuthenticated, temporaryToken } = useSelector(
    (state) => state.auth
  );

  const [pageName, setPageName] = React.useState("home");
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [dataSubmitted, setDataSubmitted] = React.useState(false);
  const [currentUserDetails, setCurrentUserDetails] = React.useState({
    email: "",
    restaurantName: "",
    phoneNumber: parseInt("6008237257"),
    email: "",
    zomatoNumber: "",
    swiggyNumber: "",
    swiggyPassword: "",
    userName: "",
  });

  const [userAllNotifications, setUserAllNotifications] = React.useState([]);
  // const [unSeenNotifications, setUnSeenNotifications] = React.useState(0);
  const [numberOfNotifications, setNumberOfNotifications] = React.useState(0);
  const [isUserPresentInNvdp, setIsUserPresentInNvdp] = React.useState(false);

  // ? Check if user is authenticated
  const getUserOnboardData = async () => {
    setIsLoading(true);
    try {
      const { data: response } = await axios.post("/user/onboard-data", {
        token: temporaryToken,
      });
      console.log(response);
      //   userDetails:
      // email: "shanu@gmail.com"
      // join_date: "2022-02-10T13:50:11.317Z"
      // phone: 7008237257
      // restaurant_name: "Test Bug"
      // swiggy_password: ""
      // swiggy_register_phone: ""
      // zomato_register_phone: 7008237257

      if (response.status === "success") {
        const {
          userDetails: {
            email,
            join_date,
            phone,
            restaurant_name,
            zomato_register_phone: z_reg_num,
            swiggy_register_phone: s_reg_num,
            swiggy_password: s_pass,
            name: user_name,
          },
          notifications,
        } = response;

        let zomatoNumberFromApi =
          z_reg_num === undefined || z_reg_num === "" ? "" : z_reg_num;
        let swiggyNumberFromApi =
          s_reg_num === undefined || s_reg_num === "" ? "" : s_reg_num;

        let swiggyPassword =
          s_pass === undefined || s_pass === "" ? "" : s_pass;

        let userName =
          user_name !== undefined && user_name !== "" ? user_name : "";

        setCurrentUserDetails({
          email: email === undefined || email === "" ? "" : email,
          restaurantName: restaurant_name,
          phoneNumber: phone,
          zomatoNumber: zomatoNumberFromApi,
          swiggyNumber: swiggyNumberFromApi,
          swiggyPassword: swiggyPassword,
          userName: userName,
        });
        console.log("response success---user details", {
          email,
          join_date,
          phone,
          restaurant_name,
          zomatoNumber: zomatoNumberFromApi,
          swiggyNumber: swiggyNumberFromApi,
          swiggyPassword: swiggyPassword,
          z_reg_num,
          s_reg_num,
          s_pass,
          user_name,
        });
        setUserAllNotifications(notifications);
        console.log("response success---notifications", notifications);
        setDataSubmitted(response.dataSubmitted);
      } else {
        navigate("/");
        cookie.remove(TEMP_APP_TOKEN);
        dispatch(loginFailure());
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      navigate("/");
      cookie.remove(TEMP_APP_TOKEN);
      dispatch(loginFailure());
      setIsLoading(false);
    }
  };

  // Todo: if the response is success then remove the
  // temp token and make a login call cuz nvdp wala token mein more data h

  const checkUserInNvdp = async () => {
    setIsLoading(true);
    try {
      const { data: response } = await axios.post("/user/check/user-in-nvdp", {
        token: temporaryToken,
      });
      console.log(response, "check user response");
      if (response.status === "success") {
        dispatch(signoutSuccess());
        const { phone: phoneNumberInToken } = response;

        const { data: loginResponse } = await axios.post("/login-voosh", {
          phoneNumber: phoneNumberInToken,
        });

        console.log(loginResponse, "login response");
        if (loginResponse.isAuth) {
          // ?set token
          setIsUserPresentInNvdp(true);
          cookie.save(APP_TOKEN, loginResponse.token, { path: "/" });
          cookie.remove(TEMP_APP_TOKEN);
          dispatch(loginSuccess(loginResponse.token));
        }

        //  !now get response and do as login does

        setIsLoading(false);
        return true;
      } else {
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      return false;
    }
  };

  const changePage = (pageName) => {
    console.log(pageName);
    setPageName(pageName);
  };

  React.useEffect(() => {
    checkUserInNvdp();
  }, []);

  React.useEffect(() => {
    // ? if it not present then get the user details
    if (!isUserPresentInNvdp) {
      console.log("not super user");
      getUserOnboardData();
      setPageName("home");
    }
  }, [temporaryToken, isUserPresentInNvdp]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      {pageName === "home" && (
        <Home
          currentUserDetails={currentUserDetails}
          setCurrentUserDetails={setCurrentUserDetails}
          dataSubmitted={dataSubmitted}
          setDataSubmitted={setDataSubmitted}
          isLoading={isLoading}
          changePage={changePage}
          pageName={pageName}
          userAllNotifications={userAllNotifications}
          setUserAllNotifications={setUserAllNotifications}
          numberOfNotifications={numberOfNotifications}
          setNumberOfNotifications={setNumberOfNotifications}
        />
      )}
      {pageName === "explore" && (
        <Explore
          changePage={changePage}
          pageName={pageName}
          currentUserDetails={currentUserDetails}
          userAllNotifications={userAllNotifications}
          setUserAllNotifications={setUserAllNotifications}
          numberOfNotifications={numberOfNotifications}
          setNumberOfNotifications={setNumberOfNotifications}
        />
      )}
      {pageName === "notification" && (
        <Notification
          changePage={changePage}
          pageName={pageName}
          currentUserDetails={currentUserDetails}
          userAllNotifications={userAllNotifications}
          setUserAllNotifications={setUserAllNotifications}
          numberOfNotifications={numberOfNotifications}
          setNumberOfNotifications={setNumberOfNotifications}
        />
      )}
      {pageName === "congratulations" && (
        <CongratulationsPage changePage={changePage} pageName={pageName} />
      )}
      {pageName === "find-more" && (
        <FindMore changePage={changePage} pageName={pageName} />
      )}
      {pageName === "swiggy-form" && (
        <SwiggyForm changePage={changePage} pageName={pageName} />
      )}
      {pageName === "user-profile" && (
        <UserProfile
          currentUserDetails={currentUserDetails}
          setCurrentUserDetails={setCurrentUserDetails}
          dataSubmitted={dataSubmitted}
          setDataSubmitted={setDataSubmitted}
          isLoading={isLoading}
          changePage={changePage}
          pageName={pageName}
          userAllNotifications={userAllNotifications}
          setUserAllNotifications={setUserAllNotifications}
          numberOfNotifications={numberOfNotifications}
          setNumberOfNotifications={setNumberOfNotifications}
        />
      )}
      {pageName === "faq" && (
        <FAQ
          currentUserDetails={currentUserDetails}
          setCurrentUserDetails={setCurrentUserDetails}
          dataSubmitted={dataSubmitted}
          setDataSubmitted={setDataSubmitted}
          isLoading={isLoading}
          changePage={changePage}
          pageName={pageName}
          userAllNotifications={userAllNotifications}
          setUserAllNotifications={setUserAllNotifications}
          numberOfNotifications={numberOfNotifications}
          setNumberOfNotifications={setNumberOfNotifications}
        />
      )}
    </>
  );
};

export default Dashboard;
