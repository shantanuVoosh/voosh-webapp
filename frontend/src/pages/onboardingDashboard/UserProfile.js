import React from "react";
import ReactGA from "react-ga4";
import MetaTags from "react-meta-tags";
import ReactPixel from "react-facebook-pixel";
import { IoIosPerson } from "react-icons/io";
import Footer from "../../components/onboardingDashboard/Footer";
import Header from "../../components/onboardingDashboard/Header";

const UserProfile = ({
  changePage,
  pageName,
  currentUserDetails,
  userAllNotifications,
  setUserAllNotifications,
  numberOfNotifications,
  setNumberOfNotifications,
}) => {
  const { name, email, restaurantName, phoneNumber } = currentUserDetails;
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
        <div className="user-profile__head">
          {/* <img src="" alt="" /> */}
          <div className="user-profile__head--top"></div>
          <div className="user-profile__head--user-icon">
            <IoIosPerson size={250} />
          </div>
          <div className="user-profile__head--bottom"></div>
        </div>
        <div className="user-profile__body"></div>
        <div className="user-profile__bottom"></div>
        <Footer changePage={changePage} pageName={pageName} />
      </div>
    </>
  );
};

export default UserProfile;
