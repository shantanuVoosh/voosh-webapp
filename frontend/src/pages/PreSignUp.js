import React from "react";
import { useNavigate } from "react-router-dom";
import logo_img from "../styles/images/logo-img.png";

import ReactPlayer from "react-player";

const PreSignUp = () => {
  const navigate = useNavigate();
  return (
    <div className="container">
      <div className="pre_signup-container">
        <div className="pre_signup-header">
          <span className="logo">
            {" "}
            <img
              src={logo_img}
              alt="logo"
              className="pre_signup-head_logo"
              onClick={() => navigate("/")}
            />
          </span>
        </div>
        <div className="pre_signup-body">
          <div className="heading">
            "Sign up to grow your sales & revenue on SWIGGY and ZOMATO with
            <span className="orange"> Voosh!"</span>
          </div>
          <div className="pre_signup-body__video video-preview">
            <ReactPlayer
              className="single-video"
              url={"https://www.youtube.com/watch?v=LlgUIHoiQyY"}
              controls
              playbackRate={1}
              width="100%"
              height="240px"
            />
          </div>

          <div className="pre_signup__bottom">
            <div className="pre_signup__bottom--list">
              <div className="list">
                Learn Insider secrets of Online Food Business
              </div>
              <div className="list">Understand your competition</div>
              <div className="list">
                High-impact and personalized Recommendations for your online
                listing!
              </div>
            </div>
          </div>
          <div className="pre_signup-btn" onClick={()=>navigate("/signup") } >Join with us and get started</div>
        </div>
      </div>
    </div>
  );
};

export default PreSignUp;
