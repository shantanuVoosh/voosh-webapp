import React from "react";
import logo_img from "../../styles/images/logo-img.png";
import { FaPhoneAlt } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { RiCloseCircleFill } from "react-icons/ri";
import { signoutSuccess } from "../../redux/Auth/actions/authAction";
import { clearData } from "../../redux/Data/actions/actions";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import cookie from "react-cookies";
import ReactGA from "react-ga4";
import ReactPixel from "react-facebook-pixel";
import { MdOutlineNotificationsActive } from "react-icons/md";
const APP_TOKEN = "voosh-token";
const TEMP_APP_TOKEN = "temp-voosh-token";

const Header = ({
  changePage,
  pageName,
  userAllNotifications,
  setUserAllNotifications,
  numberOfNotifications,
  setNumberOfNotifications,
}) => {
  const [openSlider, setOpenSlider] = React.useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (userAllNotifications) {
      const count_unseen_notifications = userAllNotifications.filter(
        (notification) => {
          return notification.seen === false;
        }
      ).length;

      setNumberOfNotifications(count_unseen_notifications);
    }
  }, [pageName]);

  const handelSlider = () => {
    console.log("handelSlider");
    setOpenSlider((prevState) => !prevState);
    console.log(openSlider);
  };
  console.log(numberOfNotifications, "numberOfNotifications");

  const handleLogout = () => {
    console.log("handleLogout");
    console.log("You have been logged out successfully");
    dispatch(signoutSuccess());
    dispatch(clearData());
    cookie.remove(APP_TOKEN, { path: "/" });
    cookie.remove(TEMP_APP_TOKEN);
    navigate("/");

    ReactPixel.trackCustom("Logout", {
      value: "logout from Onboarding dashboard",
    });

    ReactGA.event({
      category: "Button Click",
      action: "Logout from Onboarding Dashboard",
      label: "Logout from voosh",
    });
  };

  return (
    <>
      <div className="onboard-header">
        <Drawer
          // anchor={anchor}
          open={openSlider}
          onClose={() => setOpenSlider(false)}
        >
          <Box sx={{ width: 250 }}>
            <div className="sidebar-list">
              <div className="close-btn">
                <RiCloseCircleFill
                  size={25}
                  onClick={() => setOpenSlider(false)}
                />
              </div>
              <Divider />

              <div className="list" onClick={() => changePage("find-more")}>
                Find More
              </div>
              <Divider />
              <div className="list" onClick={handleLogout}>
                Logout
              </div>
              <Divider />
              <div className="list" onClick={() => changePage("user-profile")}>
                Profile
              </div>
              <Divider />
              <div className="list" onClick={() => changePage("swiggy-form")}>
                Swiggy Form
              </div>
              <Divider />
              <div className="list" onClick={() => changePage("faq")}>
                FAQ
              </div>
              {/* <Divider />
              <div className="list is-disabled">Settings</div> */}
              {/* <Divider /> */}
              {/* <div className="list" onClick={() => changePage("notification")}>
                Notification
              </div>
              <Divider /> */}
            </div>
            {/* <div>Close</div> */}
            {/* <List>
              <ListItem button>
                <ListItemText primary={"Logout"} />
              </ListItem>
            </List> */}
          </Box>
        </Drawer>
        <div className="onboard-header__hamberger">
          <div className="icon" onClick={() => handelSlider()}>
            <GiHamburgerMenu size={32} />
          </div>
        </div>
        <div className="onboard-header__logo">
          <img
            src={logo_img}
            alt="logo"
            className="onboard-header__logo--image"
          />
        </div>
        <div
          className="onboard-header__notification-btn"
          // style={{ display: "none" }}

          onClick={() => {
            // window.open("tel:+917008237257");
            // ReactGA.event({
            //   category: `Button Clicked`,
            //   action: "Call Us Button Clicked",
            //   label: "Call Us Icon Clicked",
            // });
            changePage("notification");
          }}
        >
          <div className="onboard-header__notification-btn--icon">
            <MdOutlineNotificationsActive size={20} className="icon" />
            {numberOfNotifications > 0 && (
              <span className={"icon-number"}>
                {/* <span>{numberOfNotifications}</span> */}
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
