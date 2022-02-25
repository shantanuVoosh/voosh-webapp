import React from "react";
import ReactGA from "react-ga4";
import MetaTags from "react-meta-tags";
import ReactPixel from "react-facebook-pixel";
import { IoIosPerson } from "react-icons/io";
import Footer from "../../components/onboardingDashboard/Footer";
import Header from "../../components/onboardingDashboard/Header";
import { BsPersonCircle } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";

const UserProfile = ({
  changePage,
  pageName,
  currentUserDetails,
  userAllNotifications,
  setUserAllNotifications,
  numberOfNotifications,
  setNumberOfNotifications,
}) => {
  // const { name, email, restaurantName, phoneNumber } = currentUserDetails;

  const handelOnUdateClick = () => {};

  return (
    <>
      <MetaTags>
        <title>Voosh | User-Profile</title>
        <meta
          name="voosh web app,  User-Profile page"
          content="voosh User-Profile page"
        />
        <meta property="og:title" content="web-app" />
      </MetaTags>
      <div className="user-profile">
        <Header
          changePage={changePage}
          pageName={pageName}
          userAllNotifications={userAllNotifications}
          setUserAllNotifications={setUserAllNotifications}
          numberOfNotifications={numberOfNotifications}
          setNumberOfNotifications={setNumberOfNotifications}
        />
        <>
          <div className="user-profile-container">
            <div className="user-profile__head">
              {/* <img src="" alt="" /> */}
              <div className="user-profile__head--top"></div>
              <div className="user-profile__head--user-icon">
                <BsPersonCircle size={150} />
              </div>
              <div className="user-profile__head--bottom"></div>
            </div>
            <div className="user-profile__body">
              <div className="user-profile__body--item">
                <div className="item-heading">
                  <div className="text">User Details</div>
                  <span>
                    <FiEdit />
                  </span>
                </div>
                <div className="item-content">
                  <div className="info">
                    <span className="label">Restaurant Name:</span>
                    <span className="value">You Me And Tea</span>
                  </div>
                  <div className="info">
                    <span className="label">Phone Number:</span>
                    <span className="value">7008237257</span>
                  </div>
                  <div className="info">
                    <span className="label">Email:</span>
                    <span className="value">Shantanu@gamil.com</span>
                  </div>
                </div>
              </div>
              <div className="user-profile__body--item">
                <div className="item-heading">
                  <div className="text"> Swiggy Details</div>
                  <span>
                    <FiEdit />
                  </span>
                </div>
                <div className="item-content">
                  <div className="info">
                    <span className="label">Phone Number:</span>
                    <span className="value">7008237257</span>
                  </div>
                  <div className="info">
                    <span className="label">Password:</span>
                    <span className="value">shanu@12345</span>
                  </div>
                </div>
              </div>
              <div className="user-profile__body--item">
                <div className="item-heading">
                  <div className="text">Zomato Details</div>
                  <span>
                    <FiEdit />
                  </span>
                </div>
                <div className="item-content">
                  <div className="info">
                    <span className="label">Phone Number:</span>
                    <span className="value">7008237257</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="user-profile__bottom">
              <button>Update</button>
            </div>
          </div>
        </>
        <Footer changePage={changePage} pageName={pageName} />
      </div>
    </>
  );
};

export default UserProfile;
