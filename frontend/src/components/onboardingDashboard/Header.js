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

const Header = () => {
  const [openSlider, setOpenSlider] = React.useState(false);

  const handelSlider = () => {
    console.log("handelSlider");
    setOpenSlider((prevState) => !prevState);
    console.log(openSlider);
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
              <div className="list">Logout</div>
              <Divider />
              <div className="list">Settings</div>
              <Divider />
              <div className="list">Notification</div>
              <Divider />
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
        <div className="onboard-header__call-us-btn">
          <a className="icon" href="tel:9015317006">
            <FaPhoneAlt size={20} />
          </a>
        </div>
      </div>
    </>
  );
};

export default Header;
