import React from "react";
import { useDispatch } from "react-redux";
import { signoutSuccess } from "../redux/Auth/actions/authAction";
import { clearData } from "../redux/Data/actions/actions";
import cookie from "react-cookies";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import StaticHeader from "../components/StaticHeader";
import { RiCloseCircleFill } from "react-icons/ri";
import { Box, Drawer, Button, List, Divider, ListItem } from "@mui/material";
const APP_TOKEN = "voosh-token";
const TEMP_APP_TOKEN = "temp-voosh-token";

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
        <Box sx={{ width: "100%" }}>
          <div className="sidebar-list">
            {/* <Divider /> */}

            <div className="list" onClick={() => navigate("/userProfile")}>
              Profile
            </div>
            <Divider />

            <div className="list" onClick={() => navigate("/faq")}>
              FAQ
            </div>
            <Divider />
          </div>
        </Box>
      </div>
      <Footer />
    </>
  );
};

export default Settings;
