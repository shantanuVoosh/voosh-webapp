import React from "react";
import { useDispatch } from "react-redux";
import { signoutSuccess } from "../redux/Auth/actions/authAction";
import cookie from "react-cookies";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
const APP_TOKEN = "voosh-token";

const Settings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSignoutSuccess = () => {
    console.log("You have been logged out successfully");
    dispatch(signoutSuccess());
    cookie.remove(APP_TOKEN, { path: "/" });
    navigate("/");
  };
  // Authorize Again
  const retryLogin = () => {
    console.log("retryLogin");
    // ?Open model to authorize again
  };
  const LogOut = () => {
    signoutSuccess()
    // ?Open model to authorize again
  };
 

  return (
    <>
      <div className="container">
        <div className="setting">
          <div className="setting__header">
            <h1 className="setting__header--title">Settings</h1>
            <span className="setting__header--btn screen-btn" onClick={onSignoutSuccess}>
              Log Out
            </span>
          </div>
          {/* <div className="setting-container items__container">
            <div className="item">
              <div className="item__head">
                <div className="item__head--icon"> $</div>
                <div className="item__head--text">abc@123.Gmail.com</div>
              </div>
              <div className="item__body">Email Auth</div>
            </div>
            <div onClick={()=>retryLogin} className="long-btn screen-btn">
              Authorize your mail again
            </div>
          </div> */}
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Settings;
