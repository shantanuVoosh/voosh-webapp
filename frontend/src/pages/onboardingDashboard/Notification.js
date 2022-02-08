import React from "react";
import Footer from "../../components/onboardingDashboard/Footer";
import Header from "../../components/onboardingDashboard/Header";
import { RiErrorWarningFill } from "react-icons/ri";
import { IoIosCheckmarkCircle } from "react-icons/io";

const notification_from_api = [
  // {
  //   message: "Authorization failed",
  //   info: "Details about the notification something like we were not being able to scan your mail etc.",
  //   messageType: "error",
  // },
  // {
  //   message: "Authorization Success",
  //   info: "Details about the notification something like we were not being able to scan your mail etc.",
  //   messageType: "success",
  // },
  {
    message: "Registration Success",
    info: "You have successfully registered your restaurant details with us. We will reach out to you soon.",
    messageType: "success",
  },
];
const test_data = [
  {
    message: "Authorization failed",
    info: "Details about the notification something like we were not being able to scan your mail etc.",
    messageType: "error",
  },
  {
    message: "Authorization Success",
    info: "Details about the notification something like we were not being able to scan your mail etc.",
    messageType: "success",
  },
];

const NotificationItem = ({ message, info, messageType }) => {
  return (
    <div className="notification-item">
      <div className="notification-item__head">
        <div className="notification-item__head--icon">
          {/* //!messageType */}
          {messageType === "error" && (
            <RiErrorWarningFill className="icon-warning" />
          )}
          {messageType === "success" && (
            <IoIosCheckmarkCircle className="icon-success" />
          )}
        </div>
        <div className="notification-item__head--title">
          {/* //!message */}
          {message}
        </div>
      </div>
      <div className="notification-item__body">
        {/* //?!nfo */}
        {info}
      </div>
    </div>
  );
};

const Notification = ({ changePage, pageName }) => {
  return (
    <div className="onboard-notification">
      <Header changePage={changePage} pageName={pageName}/>
      <div className="onboard-notification-container">
        {/* //? for now only no notification wala dummy */}
        {/* <div className="onboard-n__no-notification">
          <div className="onboard-n__no-notification--text">
            No Notification Found.
          </div>
          <div className="onboard-n__no-notification--sub-text">
            We will reach out as soon as we get something interesting for you
          </div>
        </div> */}
        {notification_from_api.length === 0 ? (
          <>
            <div className="onboard-n__no-notification">
              <div className="onboard-n__no-notification--text">
                No Notification Found.
              </div>
              <div className="onboard-n__no-notification--sub-text">
                We will reach out as soon as we get something interesting for
                you
              </div>
            </div>
          </>
        ) : (
          <div className="onboard-n-notification">
            {notification_from_api.map((item, index) => {
              const { message, info, messageType } = item;
              return (
                <NotificationItem
                  key={index}
                  message={message}
                  info={info}
                  messageType={messageType}
                />
              );
            })}
          </div>
        )}
      </div>
      <Footer changePage={changePage} pageName={pageName} />
    </div>
  );
};

export default Notification;
