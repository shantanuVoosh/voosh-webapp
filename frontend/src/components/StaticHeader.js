import React from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { useDispatch } from "react-redux";
import { signoutSuccess } from "../redux/Auth/actions/authAction";
import { clearData } from "../redux/Data/actions/actions";
import cookie from "react-cookies";
import ReactGA from "react-ga4";
const APP_TOKEN = "voosh-token";

// ? name-> name of the page , addBtn-> add button to add logout button or not
const StaticHeader = ({ name, addBtn }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSignoutSuccess = () => {
    console.log("You have been logged out successfully");
    dispatch(signoutSuccess());
    dispatch(clearData());
    cookie.remove(APP_TOKEN, { path: "/" });
    navigate("/");
    ReactGA.event({
      category: "Button Click",
      action: "Clicked for Logout",
      label: "Signout from voosh",
    });
  };

  return (
    <>
      <div className="header_bg"></div>
      <div className={`static_header-wrapper ${addBtn ? "add_btn" : ""}`}>
        <div className="static_header__text">
          <span
            className="static_header__text--icon"
            onClick={() => navigate(-1)}
          >
            <MdOutlineArrowBackIosNew size={20} />
          </span>
          <h1 className="static_header__text--heading">{name}</h1>
        </div>
        {addBtn && (
          <div className={"static_header__btn btn "} onClick={onSignoutSuccess}>
            <div className="static_header__btn--text">LogOut</div>
          </div>
        )}
      </div>
    </>
  );
};

export default StaticHeader;
