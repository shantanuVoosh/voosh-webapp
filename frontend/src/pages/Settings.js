import React from "react";
import { useDispatch } from "react-redux";
import { signoutSuccess } from "../redux/Auth/actions/authAction";
import { clearData } from "../redux/Data/actions/actions";
import cookie from "react-cookies";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import StaticHeader from "../components/StaticHeader";
const APP_TOKEN = "voosh-token";

const Settings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSignoutSuccess = () => {
    console.log("You have been logged out successfully");
    dispatch(signoutSuccess());
    dispatch(clearData());
    cookie.remove(APP_TOKEN, { path: "/" });
    navigate("/");
  };
  // Authorize Again
  const retryLogin = () => {
    console.log("retryLogin");
    // ?Open model to authorize again
  };
  const LogOut = () => {
    signoutSuccess();
    // ?Open model to authorize again
  };

  return (
    <>
      <StaticHeader name={"Settings"} addBtn={true} />
      <div className="container">
        <div className="setting">
          {/* <div className="setting-container "> */}

          <a href="tel:9015317006" className="long-btn screen-btn btn">
            Call us at +91-9015317006
          </a>
          {/* </div> */}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Settings;
