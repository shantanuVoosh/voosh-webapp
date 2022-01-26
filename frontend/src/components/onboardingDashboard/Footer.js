import React from "react";
import { Link } from "react-router-dom";
import { HiHome } from "react-icons/hi";
import { RiRocketFill } from "react-icons/ri";
// RiRocketFill
import {
  MdDashboard,
  MdOutlineNotifications,
  MdSettings,
} from "react-icons/md";


const Footer = ({changePage}) => {
  return (
    <footer className="onboard-footer">
      <div className="onboard-footer__btns">
        <div className="btn" onClick={()=>changePage("home")}>
          <HiHome />
          <span className="btn--text">Home</span>
        </div>
        <div className="btn" onClick={()=>changePage("explore")}>
          <RiRocketFill />
          <span className="btn--text">Explore</span>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
