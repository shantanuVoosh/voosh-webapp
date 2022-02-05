import React from "react";
import { GoRepo } from "react-icons/go";
import { AiOutlineEye } from "react-icons/ai";
import { GiNetworkBars } from "react-icons/gi";
import { BsPeople, BsCardChecklist } from "react-icons/bs";
import { AiOutlineRight } from "react-icons/ai";
import { FaNetworkWired } from "react-icons/fa";
import { BiComment } from "react-icons/bi";
import logo_img from "../../styles/images/logo-img.png";
import { useForm } from "react-hook-form";
import BannerArray from "../../utils/bannerArray";
import image_1 from "../../styles/images/banners/banner1.jpg";
import image_2 from "../../styles/images/banners/banner2.jpg";
import image_3 from "../../styles/images/banners/banner3.jpg";
import image_4 from "../../styles/images/banners/banner1.jpg";
import { SiSwiggy, SiZomato } from "react-icons/si";

const images = [image_1, image_1, image_1, image_1];

// FaNetworkWired

const Amplitude = () => {
  const [optionCardNumber, setOptionCardNumber] = React.useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue,
  } = useForm();

  const changeOptionCardNumber = (number) => {
    setOptionCardNumber(number);
  };

  return (
    <div className="amplitude">
      <div className="amplitude__header">
        <div className="head">
          {/* <div className="name">Voosh</div> */}
          <img
            className="logo"
            src={logo_img}
            alt="hi"
            style={{ height: "50px" }}
          />
        </div>
      </div>
      {/* //? 1st blue section */}
      <div className="amplitude__hero">
        <div className="amplitude__hero--section-1">
          <div className="heading">
            Take the Next step
            <br />
            for Growth
          </div>
          <div className="sub-heading">
            First automated system that brings together the power of data
            analytics and experts in restaurant business to show you the best
            path forward
          </div>
          <div className="buttons">
            <div className="btn-watch btn">Watch the Video</div>
            <div className="btn-vision btn">Our Vision</div>
          </div>
        </div>
        <div className="amplitude__hero--section-2"></div>
        <div className="amplitude__hero--section-3">
          <div className="icon_items">
            <div className="icon-item-1 item">
              <div className="icon">
                <AiOutlineEye size={100} />
              </div>
              <div className="text">Analyse</div>
              <div className="sub-text">
                and understand your
                <br />
                restaurant
              </div>
            </div>
            <div className="icon-item-2 item">
              <div className="icon">
                <GiNetworkBars size={100} />
              </div>
              <div className="text">Learn</div>
              <div className="sub-text">
                what matters and what
                <br />
                doesn't
              </div>
            </div>
            <div className="icon-item-3 item">
              <div className="icon">
                <GoRepo size={100} />
              </div>
              <div className="text">Grow</div>
              <div className="sub-text">
                your sales with each
                <br />
                action
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* //? 2nd Section image dash-board */}
      <div className="amplitude__insight">
        <div className="amplitude__insight--head">
          <div className="heading">
            Move forward with data, recommendation and action
          </div>
          <div className="sub-heading">
            See Grow by Voosh in action, from capturing the right data to
            understanding and improving strategy for restaurants
          </div>
        </div>
        <div className="amplitude__insight--body">
          {/* //? nav buttons */}
          <div className="navigation-buttons">
            {/* //Todo: btn-1, below div is for image */}
            <div
              className="btn-1 btn"
              onClick={() => changeOptionCardNumber(0)}
            >
              <div className="text">Sales and Finance</div>
            </div>
            {/* <div
              className={
                "image-1 image" +
                ` ${0 === optionCardNumber ? "show-image" : ""}`
              }
            >
              <div className="image--container">
                <img src={image_1} alt="sup" />
              </div>
              <div className="image--link-btn">
                <div className="text">Explore Sales and Finance</div>
                <div className="orange icon">
                  <AiOutlineRight size={15} />
                </div>
              </div>
            </div> */}
            {/* //Todo: btn-2,  below div is for image */}
            <div
              className="btn-2 btn"
              onClick={() => changeOptionCardNumber(1)}
            >
              <div className="text">Review Analytics</div>
            </div>
            {/* <div
              className={
                "image-2 image" +
                ` ${1 === optionCardNumber ? "show-image" : ""}`
              }
            >
              <div className="image--container">
                <img src={image_2} alt="sup" />
              </div>
              <div className="image--link-btn">
                <div className="text">Explore Review Analytics</div>
                <div className="orange icon">
                  <AiOutlineRight size={15} />
                </div>
              </div>
            </div> */}
            {/* //Todo: btn-3,  below div is for image */}
            <div
              className="btn-3 btn"
              onClick={() => changeOptionCardNumber(2)}
            >
              <div className="text">Visibility assesment</div>
            </div>
            {/* <div
              className={
                "image-3 image" +
                ` ${2 === optionCardNumber ? "show-image" : ""}`
              }
            >
              <div className="image--container">
                <img src={image_3} alt="sup" />
              </div>
              <div className="image--link-btn">
                <div className="text">Explore Visibility assesment</div>
                <div className="orange icon">
                  <AiOutlineRight size={15} />
                </div>
              </div>
            </div> */}
            {/* //Todo: btn-4,  below div is for image */}
            <div
              className="btn-4 btn"
              onClick={() => changeOptionCardNumber(3)}
            >
              <div className="text">Simplified UX</div>
            </div>
            {/* <div
              className={
                "image-4 image" +
                ` ${3 === optionCardNumber ? "show-image" : ""}`
              }
            >
              <div className="image--container">
                <img src={image_3} alt="sup" />
              </div>
              <div className="image--link-btn">
                <div className="text">Explore Simplified UX</div>
                <div className="orange icon">
                  <AiOutlineRight size={15} />
                </div>
              </div>
            </div> */}
          </div>
          {/* //? image */}
          {/* <div className="dashboard-image-preview"></div> */}
        </div>
      </div>

      {/* //? 3rd grey section */}
      <div className="amplitude__number-section">
        <div className="amplitude__number-section--head">
          <div className="text">Data, insight and action</div>
        </div>
        <div className="amplitude__number-section--body">
          <div className="item-1 item">
            <div className="score">~1L</div>
            <div className="text">data rows analysed every week</div>
          </div>
          <div className="item-2 item">
            <div className="score">{">100+"}</div>
            <div className="text">data points /customer analysed</div>
          </div>
          <div className="item-3 item">
            <div className="score">2000+</div>
            <div className="text">restaurants onboard</div>
          </div>
        </div>
      </div>

      {/* //? 4th services */}
      {/* //Todo: just put a IAMGE BELOW APP */}
      <div className="amplitude__services">
        <div className="amplitude__services--head">
          <div className="heading">
            Growth is a wholistic
            <br />
            effort
          </div>
          <div className="sub-heading">
            Understand every metric and get them to work in your favour
          </div>
        </div>
        <div className="amplitude__services--body">
          <div className="logo"></div>
          <div className="service-items">
            <div className="item item-1">
              <span className="icon"></span>
              <span className="text">Product</span>
            </div>
            <div className="item item-2">
              <span className="icon"></span>
              <span className="text">Product</span>
            </div>
            <div className="item item-3">
              <span className="icon"></span>
              <span className="text">Product</span>
            </div>
            <div className="item item-4">
              <span className="icon"></span>
              <span className="text">Product</span>
            </div>
            <div className="item item-5">
              <span className="icon"></span>
              <span className="text">Product</span>
            </div>
          </div>
        </div>
      </div>

      {/* //? 5th grey section */}
      <div className="amplitude__outcomes">
        <div className="amplitude__outcomes--head">
          <div className="heading">
            How do we know,
            <br />
            it's working?
          </div>
          <div className="sub-heading">
            Grow takes every opportunity possible to convert the data from your
            past to make a better future
          </div>
        </div>
        <div className="amplitude__outcomes--body outcome-items">
          <div className="item item-1">
            <div className="score-box">
              <div className="score">
                <span className="text">30</span>{" "}
                <span className="percentage">{"%"}</span>
              </div>
              <div className="score-text">Increase in number of orders</div>
            </div>
            {/* <div className="description-text">
              <div className="text">Maximize digital product revenues.</div>
              <div className="sub-text">
                Improve key metrics like activations, retention, order size &
                frequency, subscribers and lifetime value.
              </div>
            </div> */}
          </div>
          <div className="item item-2">
            <div className="score-box">
              <div className="score">
                <span className="text">5000</span>{" "}
                <span className="percentage">{"+"}</span>
              </div>
              <div className="score-text">
                restaurants onboarded across India
              </div>
            </div>
            {/* <div className="description-text">
              <div className="text">Maximize digital product revenues.</div>
              <div className="sub-text">
                Improve key metrics like activations, retention, order size &
                frequency, subscribers and lifetime value.
              </div>
            </div> */}
          </div>
          <div className="item item-3">
            <div className="score-box">
              <div className="score">
                <span className="text">2.3</span>{" "}
                <span className="percentage">{"X"}</span>
              </div>
              <div className="score-text">
                avg. growth in revenue in 3 months
              </div>
            </div>
            {/* <div className="description-text">
              <div className="text">Maximize digital product revenues.</div>
              <div className="sub-text">
                Improve key metrics like activations, retention, order size &
                frequency, subscribers and lifetime value.
              </div>
            </div> */}
          </div>
        </div>
        {/* <div className="amplitude__outcomes--explore-link">
          <div className="link-btn">Read the ROI Report</div>
        </div> */}
      </div>

      {/* //? 6th white section */}
      <div className="amplitude__ecosystem">
        <div className="amplitude__ecosystem--head">
          <div className="heading">
            Your One Stop Growth
            <br />
            Engine
          </div>
          <div className="sub-heading">
            Our system extends beyond data. You can analyse the data, see
            recommendation, learn tactics and build an advantage
          </div>
        </div>
        <div className="amplitude__ecosystem--body ecosystem-items">
          <div className="item item-1">
            <div className="icon">
              <SiSwiggy size={50} />
            </div>
            <div className="text">Swiggy Integration</div>
            <div className="sub-text">
              Swiggy's data, algorithms and our team of expert help you in your
              swiggy journey
            </div>
            {/* <div className="link-btn">
              <div className="link-btn--text">Meet Partners</div>
              <div className="orange link-btn--icon">
                <AiOutlineRight size={15} />
              </div>
            </div> */}
          </div>
          <div className="item item-2">
            <div className="icon" style={{color:"#f05a48", margin:"-25px 0px"}}>
              <SiZomato size={100} />
            </div>
            <div className="text">Zomato Integration</div>
            <div className="sub-text">
              Make you Food delivery with Zomato a perfect experience
            </div>
            {/* <div className="link-btn">
              <div className="link-btn--text">See Integration</div>
              <div className="orange link-btn--icon">
                <AiOutlineRight size={15} />
              </div>
            </div> */}
          </div>
          <div className="item item-3">
            <div className="icon">
              <BiComment size={50} />
            </div>
            <div className="text">Be Informed</div>
            <div className="sub-text">
              Read latest content and watch videos that teach you what matters
            </div>
            {/* <div className="link-btn">
              <div className="link-btn--text">Visit Community</div>
              <div className="orange link-btn--icon">
                <AiOutlineRight size={15} />
              </div>
            </div> */}
          </div>
        </div>
      </div>

      {/* //? 7th cards */}
      <div className="amplitude__banners">
        <div className="banners">
          {BannerArray.map((banner, index) => {
            const { bannerName, title, subTitle, image, content, points } =
              banner;
            return (
              <div className="banner-card" key={index}>
                <div className="head">
                  <img className="image" src={image} alt={bannerName} />
                </div>
                <div className="body">
                  <div className="heading">{subTitle}</div>
                  {/* <div className="card-sub-title"></div> */}
                  <div className="link-btn">
                    <div className="link-btn--text">Know More</div>
                    <div className="orange link-btn--icon">
                      <AiOutlineRight size={15} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* //? 8th bottom section */}
      <div className="amplitude__bottom-section">
        <div className="amplitude__bottom-section--head">
          <div className="heading">Signup and be informed</div>
          <div className="sub-heading">
            Sign up to receive the latest best practices, news, and product
            updates.
          </div>
        </div>
        <div className="amplitude__bottom-section--body">
          {/* //! email lena hai yaha se */}
          <div className="form">
            <div className="form--input-field ">
              <input
                className="form-input"
                type="email"
                // required
                placeholder="Email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value:
                      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    message: "Please enter a valid email",
                  },
                })}
              />
            </div>
            <div className="form--error red">
              {errors["email"] && (
                <p className="error red">Provide a valid email address</p>
              )}
            </div>
            <div className="form--btn">
              <button>Signup</button>
            </div>
          </div>
        </div>
        <div className="amplitude__bottom-section--bottom">
          <div className="text">
            By submitting this form, you agree I’d like to receive emails about
            news & updates from Amplitude, to our Terms of Use and acknowledge
            our Privacy Statement.
          </div>
          {/* <div className="privacy-text">
            ©2022 Amplitude, Inc. All rights reserved. Amplitude is a registered
            trademark of Amplitude, Inc.
          </div> */}
          {/* <div className="links">
            <span className="link">Terms of Service</span>
            <span className="link">Privacy Notice</span>
            <span className="link">Cookie Settings</span>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Amplitude;
