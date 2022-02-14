import React from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { loginFailure } from "../../redux/Auth/actions/authAction";
import cookie from "react-cookies";
import Loading from "../../components/Loading";
import Explore from "./Explore";
import Home from "./Home";
import Notification from "./Notification";
import CongratulationsPage from "./CongratulationsPage";
import FindMore from "./FindMore";
import SwiggyForm from "./SwiggyForm";
import UserProfile from "./UserProfile";

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
    name: "",
    email: "",
    restaurantName: "",
    phoneNumber: parseInt("6008237257"),
  });
  const [userAllNotifications, setUserAllNotifications] = React.useState([]);
  // const [unSeenNotifications, setUnSeenNotifications] = React.useState(0);
  const [numberOfNotifications, setNumberOfNotifications] = React.useState(0);

  // ? Check if user is authenticated
  const getUserOnboardData = async () => {
    setIsLoading(true);
    try {
      const { data: response } = await axios.post("/user/onboard-data", {
        token: temporaryToken,
      });
      console.log(response);
      if (response.status === "success") {
        const { userDetails, notifications } = response;
        setCurrentUserDetails({
          name: userDetails.name,
          email: userDetails.email,
          restaurantName: userDetails.restaurant_name,
          phoneNumber: userDetails.phone,
        });
        console.log("response success---user details", userDetails);
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

  const changePage = (pageName) => {
    console.log(pageName);
    setPageName(pageName);
  };

  React.useEffect(() => {
    getUserOnboardData();
    setPageName("home");
  }, [temporaryToken]);

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
    </>
  );
};

export default Dashboard;
