import React from "react";
import { useNavigate } from "react-router-dom";
import logo_img from "../styles/images/logo-img.png";
import { FaHandshake } from "react-icons/fa";
import ReactGA from "react-ga4";

const Greeting = () => {
  const navigate = useNavigate();
  return (
    <div className="container">
      <div className="greeting-container">
        <div className="greeting-header">
          <img
            src={logo_img}
            alt="logo"
            className="greeting-header__logo"
            onClick={() => navigate("/")}
          />
        </div>
        <FaHandshake size={80}  className="greeting-header__logo-2" />
        <div className="greeting-header__heading">Congratulations!!</div>
        <div className="greeting-body">
          <div className="greeting-body__text">
            <p className="greeting-body__text--paragraph">
              "Thank you for successfully taking the first step towards growing
              your online business. Sit back and relax, while we crunch data for
              you and competition.
            </p>
            <br />
            <p className="greeting-body__text--paragraph">
              We expect to have everything ready in 3 days. Keep exploring and
              we will reach out with much more soon!"
            </p>
            <br />
            <p className="greeting-body__text--paragraph-bold">
              <span className="red">Warning!!</span> please don not remove the app!
            </p>
          </div>
        </div>
        <div
          className="greeting-btn"
          onClick={() => {
            navigate("/dashboard-sample")
            ReactGA.event({
              category: "Let me Explore Button",
              action: "Let me Explore Button Clicked",
              label: "Let me Explore",
            });
          }}
        >
          Let me Explore!!
        </div>
        <a href="tel:9015317006" className="greeting-btn"
        onClick={() => {
          ReactGA.event({
            category: "Reach out to us Button",
            action: "Reach out to us Button Clicked",
            label: "Reach out to us",
          });
        }}
        >
          Reach out to us!
        </a>
        <div
          className="handshake-icon"
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        ></div>
      </div>
    </div>
  );
};

export default Greeting;
