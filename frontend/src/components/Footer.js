import React from "react";
import {
  MdDashboard,
  MdSettings,
  MdOutlineNotifications,
} from "react-icons/md";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <Link to={'/dashboard'} className="footer__item">
        <span className="icon">
          <MdDashboard />
        </span>
        <span className="text">Dashboard</span>
      </Link>
      
      <Link to={'/notification'} className="footer__item">
        <span className="icon">
          <MdOutlineNotifications />
        </span>
        <span className="text">Notification</span>
      </Link>
      
       <Link to={'/settings'} className="footer__item">
        <span className="icon">
          <MdSettings />
        </span>
        <span className="text">Settings</span>
      </Link>
    </footer>
  );
};

export default Footer;
