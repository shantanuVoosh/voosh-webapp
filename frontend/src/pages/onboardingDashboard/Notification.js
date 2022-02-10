import React from "react";
import Footer from "../../components/onboardingDashboard/Footer";
import Header from "../../components/onboardingDashboard/Header";
import { RiErrorWarningFill } from "react-icons/ri";
import { IoIosCheckmarkCircle } from "react-icons/io";
import MetaTags from "react-meta-tags";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import Loading from "../../components/Loading";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

const Variants = () => {
  return (
    <Stack spacing={1.5}>
      <Skeleton variant="rectangular" height={118} />
      <Skeleton variant="rectangular" height={118} />
      {/* <Skeleton variant="rectangular" height={118} /> */}
    </Stack>
  );
};

const Notification = ({
  changePage,
  pageName,
  currentUserDetails,
  userAllNotifications,
  setUserAllNotifications,
  numberOfNotifications,
  setNumberOfNotifications,
}) => {
  // const notification_from_api = userAllNotifications;
  // console.log("notification_from_api", notification_from_api);
  const { isTemporaryAuthenticated, temporaryToken } = useSelector(
    (state) => state.auth
  );
  const [isLoading, setIsLoading] = React.useState(false);
  // const [userAllNotifications, setUserAllNotifications] = React.useState([]);
  const [counter, setCounter] = React.useState(0);

  const getAllNotifications = async () => {
    setIsLoading(true);

    try {
      const { data: response } = await axios.post(
        `/user/onboard-notifications`,
        {
          phone: currentUserDetails.phoneNumber,
          token: temporaryToken,
        }
      );

      console.log("response-------->", response);
      if (response.status === "success") {
        const sortedNotifications = response.notifications.sort((a, b) => {
          return new Date(b.date) - new Date(a.date);
        });

        setUserAllNotifications(sortedNotifications);
      } else {
        console.log("error");
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const onClickChangeSeenStatus = async (notificationData) => {
    console.log("notificationData", notificationData);
    setCounter((prev) => prev + 1);
    const { id } = notificationData;
    console.log(id, "id");
    try {
      const { data: response } = await axios.post(
        `/user/onboard-notifications/change-seen-status`,
        {
          notification_id: id,
          phone: currentUserDetails.phoneNumber,
          token: temporaryToken,
        }
      );

      console.log("response-------->", response);
      if (response.status === "success") {
        setUserAllNotifications((prev_notifications) => {
          return prev_notifications.map((notification) => {
            // console.log("notification", notification);
            if (notification.id === id) {
              // console.log("notification.id", "changed", notification.id);

              notification.seen = true;
            }
            return notification;
          });
        });
        // Todo decrease the number of notifications
        setNumberOfNotifications((prev_number) => prev_number - 1);

        setIsLoading(false);
      } else {
        console.log("error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    getAllNotifications();
    console.log("sup");
  }, [pageName, counter]);

  const NotificationItem = ({
    title,
    message,
    messageType,
    seen,
    date,
    id,
  }) => {
    return (
      <div
        className={"notification-item" + ` ${!seen ? "not-seen" : ""}`}
        onClick={() => {
          // if (seen) return;

          onClickChangeSeenStatus({
            title,
            message,
            messageType,
            seen,
            date,
            id,
          });
          if (title !== "Registration Successful") {
            return;
          }
          changePage("congratulations");
        }}
      >
        <div className={"notification-item__head"}>
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
            {title}
          </div>
        </div>
        <div className="notification-item__body">
          {/* //?!nfo */}
          {message}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <>
        <MetaTags>
          <title>Voosh | Onboard-Notification</title>
          <meta
            name="voosh web app, Explore page"
            content="voosh Explore page"
          />
          <meta property="og:title" content="web-app" />
        </MetaTags>

        <div className="onboard-notification">
          <Header
            changePage={changePage}
            pageName={pageName}
            userAllNotifications={userAllNotifications}
            setUserAllNotifications={setUserAllNotifications}
            numberOfNotifications={numberOfNotifications}
            setNumberOfNotifications={setNumberOfNotifications}
          />
          <div className="onboard-notification-container">
            <Variants />
            <Footer changePage={changePage} pageName={pageName} />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <MetaTags>
        <title>Voosh | Onboard-Notification</title>
        <meta name="voosh web app, Explore page" content="voosh Explore page" />
        <meta property="og:title" content="web-app" />
      </MetaTags>
      <div className="onboard-notification">
        <Header
          changePage={changePage}
          pageName={pageName}
          userAllNotifications={userAllNotifications}
          setUserAllNotifications={setUserAllNotifications}
          numberOfNotifications={numberOfNotifications}
          setNumberOfNotifications={setNumberOfNotifications}
        />
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
          {userAllNotifications.length === 0 ? (
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
              {userAllNotifications.map((item, index) => {
                const { message, title, messageType, date, seen, id } = item;
                return (
                  <NotificationItem
                    key={index}
                    id={id}
                    message={message}
                    title={title}
                    messageType={messageType}
                    date={date}
                    seen={seen}
                  />
                );
              })}
            </div>
          )}
        </div>
        <Footer changePage={changePage} pageName={pageName} />
      </div>
    </>
  );
};

export default Notification;

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
