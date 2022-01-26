import React from "react";
import { IoHomeOutline } from "react-icons/io5";
import { MdAnchor } from "react-icons/md";
import { CgLoadbarSound } from "react-icons/cg";
import { GiCommercialAirplane } from "react-icons/gi";
import logo_img from "../../styles/images/logo-img.png";
import ReactPlayer from "react-player";
import { useForm } from "react-hook-form";
import ScrollButton from "../../components/ScrollButton"; // Todo: scroll to top
import vooshCardSvg from "../../styles/assets/voosh_card.svg";
import { GrFormPreviousLink } from "react-icons/gr";
import { RiCloseCircleLine } from "react-icons/ri";
import { ToastContainer, toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { loginFailure } from "../../redux/Auth/actions/authAction";
import cookie from "react-cookies";
import Loading from "../../components/Loading";
import { BsShieldFillCheck } from "react-icons/bs";
import { IoIosInformationCircleOutline } from "react-icons/io";
import {
  MdDashboard,
  MdSettings,
  MdOutlineNotifications,
} from "react-icons/md";
import { Link } from "react-router-dom";
import { RiDoubleQuotesL, RiDoubleQuotesR } from "react-icons/ri";
import { BsChevronDoubleRight } from "react-icons/bs";
import random_food_image1 from "../../styles/images/food-1.jpg";
import random_food_image2 from "../../styles/images/food-2.jpg";
import random_food_image3 from "../../styles/images/food-3.jpg";
import Explore from "./Explore";
import Home from "./Home";

import Footer from "../../components/onboardingDashboard/Footer";
// import Footer from "../../components/Footer";

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
        />
      )}
      {pageName === "explore" && <Explore changePage={changePage} />}
    </>
  );
};

export default Dashboard;
