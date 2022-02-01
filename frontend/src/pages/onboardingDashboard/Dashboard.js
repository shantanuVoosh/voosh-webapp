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
    phoneNumber: 7008237257,
  });

  // ? Check if user is authenticated
  const getUserOnboardData = async () => {
    setIsLoading(true);
    try {
      const { data: response } = await axios.post("/user/onboard-data", {
        token: temporaryToken,
      });
      console.log(response);
      if (response.status === "success") {
        const { userDetails } = response;
        setCurrentUserDetails({
          name: userDetails.name,
          email: userDetails.email,
          restaurantName: userDetails.restaurant_name,
          phoneNumber: userDetails.phone,
        });
        console.log("response success", response);
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
          dataSubmitted={dataSubmitted}
          setDataSubmitted={setDataSubmitted}
          isLoading={isLoading}
          changePage={changePage}
          pageName={pageName}
        />
      )}
      {pageName === "explore" && (
        <Explore changePage={changePage} pageName={pageName} />
      )}
    </>
  );
};

export default Dashboard;
