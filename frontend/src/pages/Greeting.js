import React from "react";
import { useNavigate } from "react-router-dom";
import logo_img from "../styles/images/logo-img.png";
import { FaHandshake } from "react-icons/fa";

const Greeting = () => {
  const navigate = useNavigate();
  return (
    <div className="container">
      <div className="signup-container">
        <div className="signup-header">
          <img
            src={logo_img}
            alt="logo"
            className="signup-header__logo"
            onClick={() => navigate("/")}
          />
        </div>
        <div
          className="greeting-container"
          style={{
            width: "80%",
            height: "80vh",
            display: "flex",
            flexDirection: "column",
            // justifyContent:"center"
          }}
        >
          <div className="text" style={{ "margin-top": "50px" }}>
            <p style={{ marginBottom: "10px", fontSize: "1.3rem" }}>
              Congratulations on your successful registration, you have taken
              the first step towards growing your online business.
            </p>{" "}
            <br />
            <p style={{ marginBottom: "10px", fontSize: "1.3rem" }}>
              Sit back and relax, while we crunch your data and start your
              analysis. This might take a maximum of three days
            </p>{" "}
            <br />
            <p style={{ marginBottom: "10px", fontSize: "1.3rem" }}>
              In the meantime, we'll be sending you intresting facts and tips on
              how to grow your online business.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Greeting;
