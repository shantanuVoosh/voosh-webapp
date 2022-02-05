import React from "react";
import Footer from "../../components/onboardingDashboard/Footer";
import Header from "../../components/onboardingDashboard/Header";

const notification_from_api = [];

const Notification = ({ changePage, pageName }) => {
  return (
    <div className="onboard-notification">
      <Header />
      <div className="onboard-notification-container">
        {/* //? for now only no notification wala dummy */}
        <div className="onboard-n__no-notification">
          <div className="onboard-n__no-notification--text">
            No Notification Found.
          </div>
          <div className="onboard-n__no-notification--sub-text">
            We will reach out as soon as we get something interesting for you
          </div>
        </div>
      </div>
      <Footer changePage={changePage} pageName={pageName} />
    </div>
  );
};

export default Notification;
