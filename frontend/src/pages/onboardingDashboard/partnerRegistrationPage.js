import React, { Component } from "react";
import Voosh_logo from "../../styles/images/logo-img.png";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { TextField } from "@mui/material";
export class partnerRegistrationPage extends Component {
  render() {
    return (
      <div className="container sect">
        <div className="headerSection" />
        <div className="headerContent">
          <div>
            <p className="title">
              <b>Voosh </b>Partner
            </p>
            <p className="subtitle">manage your restaurant on Voosh</p>
          </div>
          <img src={Voosh_logo} width="120px" height={"70px"} />
        </div>
        <div className="bodyform">
          <div className="logintext">Login</div>
          <div className="textinfo">
            <div>
              Enter a registered mobile number of restaurant ID to login
            </div>
            <AiOutlineInfoCircle size={25} />
          </div>
          <div className="inputnumberdiv">
            <TextField
              id="filled-basic"
              label="Restaurant ID / Mobile Number"
              variant="filled"
              className="inputnumber"
              color={"grey"}
            />
          </div>
          <div className="page-body__form--btn">
            <button className="btn">Continue</button>
          </div>
          <div className="invitedText">
            Invited? <p> Register here</p>
          </div>
          <div className="divborder">
            <div className="listedtext">
              Want to get your restaurant listed on Voosh?
              <p> Partner with us</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default partnerRegistrationPage;
