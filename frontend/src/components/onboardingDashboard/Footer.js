import React from "react";
import { Link } from "react-router-dom";
import { HiHome } from "react-icons/hi";
import { RiRocketFill } from "react-icons/ri";
import ReactGA from "react-ga4";
import {
  MdDashboard,
  MdOutlineNotifications,
  MdSettings,
} from "react-icons/md";

const Footer = ({ changePage, pageName }) => {
  return (
    <footer className="onboard-footer">
      <div className="onboard-footer__btns">
        <div
          className={`btn  ${pageName === "home" ? "active" : ""}`}
          onClick={() => {
            changePage("home");
            ReactGA.event({
              category: `Button Clicked`,
              action: `Go to Home Page`,
              label: `Go to Home Page`,
            });
          }}
        >
          <HiHome />
          <span className="btn--text">Home</span>
        </div>
        <div
          className={`btn  ${pageName === "explore" ? "active" : ""}`}
          onClick={() => {
            changePage("explore");
            ReactGA.event({
              category: `Button Clicked`,
              action: `Go to Explore Page`,
              label: `Go to Explore Page`,
            });
          }}
        >
          <RiRocketFill />
          <span className="btn--text">Explore</span>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
