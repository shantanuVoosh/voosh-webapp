import React from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { IoChevronDownSharp } from "react-icons/io5";
import { GoogleLogout } from "react-google-login";
import { useDispatch, useSelector } from "react-redux";
import { signoutSuccess } from "../redux/Auth/actions/authAction";
import { clearData } from "../redux/Data/actions/actions";
import cookie from "react-cookies";
import { Spin as Hamburger } from "hamburger-react";

// TODO: remove the hardcoded clientId
const APP_TOKEN = "voosh-token";
const clientId =
  "383868004224-r359p669am3jbghshp42l4h7c7ab62s7.apps.googleusercontent.com";



const Header = ({
  heading,
  restaurantName,
  isHomePage,
  isErrorPage = false,
  headerSize,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setOpen] = React.useState(false);
  const [isRestaurantListOpen, setRestaurantListOpen] = React.useState(false);
  const restaurant_list = useSelector((state) => state.data.restaurantList);
  console.log("restaurant list", restaurant_list);
  // *change the state of the auth to false
  // * and remove the token from the cookie
  // * and redirect to the login page
  const onSignoutSuccess = () => {
    console.log("You have been logged out successfully");
    dispatch(signoutSuccess());
    dispatch(clearData());
    cookie.remove(APP_TOKEN, { path: "/" });
    navigate("/");
  };

  const openRestaurantList = () => {
    console.log("open restaurant list");
    setRestaurantListOpen((prevState) => !prevState);
  };

  const showrestaurantList = () => {
    // !Wont work if he click other Heading than the Home page
    if (!isHomePage) return null;
  };

  // !Header for All Pages Except Error Page
  const HeaderComponent = () => {
    return (
      <>
        {/*//? small , mid , big */}
        <header className={`header header-${headerSize}`}>
          <Hamburger
            toggled={isOpen}
            toggle={setOpen}
            direction="right"
            size={22}
            color="#F5F5F9"
            rounded
            duration={1}
            easing="ease-in"
            className="Hamburger"
          />
          <div className="header-wrapper">
            <div className="header__text" onClick={showrestaurantList}>
              {!isHomePage ? (
                // ? Then show the back button and the heading
                <>
                  <span
                    className="header__text--icon"
                    onClick={() => navigate(-1)}
                  >
                    <MdOutlineArrowBackIosNew />
                  </span>
                  <h1
                    className="header__text--heading"
                    // onClick={isHomePage && openRestaurantList}
                  >
                    {heading}
                  </h1>
                </>
              ) : (
                // ? iif Home Page then show the Restaurant Name~
                <>
                  <h1
                    className="header__text--heading"
                    // onClick={isHomePage && openRestaurantList}
                  >
                    {restaurantName}
                    {/* {heading} */}
                  </h1>
                  <div className="rest_list">
                  <div className={isRestaurantListOpen?"dropdown":"hide-dropdown"}>
                    {restaurant_list.map((restaurant, index) => {
                      const {res_id, res_name} = restaurant;
                      return (
                        <div className="item" key={index}>
                          <span className="item--name">
                            {res_name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  </div>
                  <span className="header__text--icon">
                    <IoChevronDownSharp onClick={openRestaurantList} />
                  </span>
                </>
              )}
            </div>

            <div className="header__btn btn">
              <span className="header__btn--text">This Week</span>
              <span className="header__btn--icon">
                <IoChevronDownSharp />
              </span>
            </div>
          </div>
        </header>
      </>
    );
  };

  // ? check if the error page then render the error page header
  return (
    <>
      {isErrorPage ? (
        <header className="header error-header"></header>
      ) : (
        <HeaderComponent />
      )}
    </>
  );
};

export default Header;
