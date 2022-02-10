import React from "react";
import { RiCloseCircleLine } from "react-icons/ri";
import ReactGA from "react-ga4";
import MetaTags from "react-meta-tags";
import ReactPixel from "react-facebook-pixel";
import { RiBarChart2Line } from "react-icons/ri";
import { AiOutlinePlus } from "react-icons/ai";
import congratulation_logo from "../../styles/assets/congratulation-logo-voosh.svg";
import { TiTickOutline } from "react-icons/ti";
import { GrUserExpert } from "react-icons/gr";

import { TiTick } from "react-icons/ti";
import { GoVerified } from "react-icons/go";

// ? Congratulations page
const CongratulationsPage = ({ changePage, pageName }) => {
  return (
    <>
      <MetaTags>
        <title>Voosh | Congratulations page</title>
        <meta
          name="voosh web app, Form-3 Zomato Details"
          content="voosh Form-3 Zomato Details page"
        />
        <meta property="og:title" content="web-app" />
      </MetaTags>
      <div className="container">
        <div className="closeicon">
          <div
            className="icon"
            onClick={() => {
              changePage("home");
            }}
          >
            <RiCloseCircleLine size={35} />
          </div>
        </div>

        <div className="voosh-logo">
          <span className="left"></span>
          <img
            src={congratulation_logo}
            width="100px"
            height={"100px"}
            alt="555"
          />
          <span className="right"></span>
        </div>

        <div className="congText">CONGRATULATIONS</div>
        <div className="congTextOrange">Registration successful</div>
        <div className="barroundback">
          <GoVerified size={230} />
        </div>
        <div className="textpara">
          We have started analysis and our experts will be back with valuable
          insights
        </div>
        <p className="textpara">
          This might take upto<b> 3 days</b>
        </p>
        <div className="page-body__form--btn congratulations-btn">
          <button
            className="btn"
            onClick={() => {
              changePage("home");
            }}
          >
            Go to dashboard
          </button>
        </div>
        {/* //! not needed right now*/}
        {/* <div className="page-body__form--secure-text">
            <span className="text">
              <AiOutlinePlus />
              Add another restaurant
            </span>
          </div> */}
      </div>
    </>
  );
};

export default CongratulationsPage;
