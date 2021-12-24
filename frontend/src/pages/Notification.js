import React from "react";
import Footer from "../components/Footer";
import { RiErrorWarningFill } from "react-icons/ri";
import { IoIosCheckmarkCircle } from "react-icons/io";
// ?abhi for testing
const test_data = [
  {
    message: "Authorization failed",
    info: "Details about the notification somting like we were not being able to scan your mail etc.",
    messageType: "error",
  },
  {
    message: "Authorization Success",
    info: "Details about the notification somting like we were not being able to scan your mail etc.",
    messageType: "success",
  },
];
const notification_from_api = [];

const NotificationItem = ({ message, info, messageType }) => {
  return (
    <div className="item">
      <div className="item__head">
        <div className="item__head--icon">
          {/* //!messageType */}
          {messageType === "error" && (
            <RiErrorWarningFill className="icon-warning" />
          )}
          {messageType === "success" && (
            <IoIosCheckmarkCircle className="icon-success" />
          )}
        </div>
        <div className="item__head--title">
          {/* //!message */}
          {message}
        </div>
      </div>
      <div className="item__body">
        {/* //?!nfo */}
        {info}
      </div>
    </div>
  );
};

const Notification = () => {
  return (
    <>
      <div className="container">
        <div className="notification">
          <div className="notification__header">
            <h1 className="notification__header--title">Notification</h1>
          </div>
          {/* //! list of items */}
          <div className="notification-items-container items__container">
            {notification_from_api.length < 1 ? (
              <div className="no-notification">
                <div className="text">No Notification Found.</div>
                <div className="sub-text">
                  We will reach out as soon as we get something interesting for
                  you
                </div>
              </div>
            ) : (
              notification_from_api.map((item, index) => {
                const { message, info, messageType } = item;
                return (
                  <NotificationItem
                    key={index}
                    message={message}
                    info={info}
                    messageType={messageType}
                  />
                );
              })
            )}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Notification;
