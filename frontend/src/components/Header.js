import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { IoChevronDownSharp } from "react-icons/io5";
import { GoogleLogout } from "react-google-login";
import { useDispatch, useSelector } from "react-redux";
import { signoutSuccess } from "../redux/Auth/actions/authAction";
import {
  clearData,
  setResultType,
  setRestaurantNameAndId,
} from "../redux/Data/actions/actions";
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
  fakeData,
}) => {
  const { resultType, res_name: selected_res_name } = useSelector(
    (state) => state.data
  );
  const restaurant_list = useSelector((state) => state.data.restaurantList);
  const location = useLocation();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setOpen] = React.useState(false);
  const [isRestaurantListOpen, setRestaurantListOpen] = React.useState(false);
  const [isResultTypeOpne, setResultTypeOpen] = React.useState(false);
  const [allResultType, setAllResultType] = React.useState([
    "This Week",
    "Previous Week",
    "This Month",
    "Previous Month",
  ]);

  const resultTypeRef = React.useRef(null);
  const restaurantListRef = React.useRef(null);


  let cStyles = {};
if (fakeData) {
  cStyles = {
    zIndex: "-1",
  };
}


  // ? Help's to Close the dropdown menu
  const handleOnClickAnywhere = (e) => {
    if (
      e.target.classList.contains("item") ||
      e.target.classList.contains("item--name") ||
      e.target.classList.contains("result-type_list") ||
      e.target.classList.contains("rest_list")
    ) {
      return;
    }

    setOpen(false);
    setRestaurantListOpen(false);
    setResultTypeOpen(false);
  };

  // ? Help's to Close the dropdown menu
  const handleOnScroll = () => {
    setOpen(false);
    setRestaurantListOpen(false);
    setResultTypeOpen(false);
  };

  React.useEffect(() => {
    document.addEventListener("mousedown", handleOnClickAnywhere);
    document.addEventListener("scroll", handleOnScroll);
    return () => {
      document.addEventListener("scroll", handleOnScroll);
      document.removeEventListener("mousedown", handleOnClickAnywhere);
    };
  });

  // ! When we visit the revenue page, set the result type to "Prev Day Only"
  React.useEffect(() => {
    console.log(location.pathname, "path name from header");
    const pathnam = location.pathname;
    console.log(pathnam === "/revenue");
    if (pathnam === "/revenue") {
      dispatch(setResultType("Previous Day"));
      setAllResultType(["Previous Day"]);
    } else if (resultType === "Previous Day") {
      dispatch(setResultType("This Week"));
      setAllResultType([
        "This Week",
        "This Month",
        "Previous Month",
        "Previous Week",
      ]);
    }
  }, [location.pathname]);

  React.useEffect(() => {}, []);

  // ! Restaurant List Dropdown
  const openRestaurantList = () => {
    console.log("open restaurant list");
    setRestaurantListOpen((prevState) => !prevState);
  };

  // ! Result Type Dropdown
  const onOpenResultType = () => {
    setResultTypeOpen((prevState) => !prevState);
  };
  const setResultTypeOfData = (type) => {
    let t = "";
    console.log("type", type);
    if (type === "This Week") {
      t = "This Week";
    } else if (type === "This Month") {
      t = "This Month";
    } else if (type === "Previous Month") {
      t = "Previous Month";
    } else if (type === "Previous Week") {
      t = "Previous Week";
    } else if (type === "Previous Day") {
      t = "Previous Day";
    }
    dispatch(setResultType(t));
    setResultTypeOpen((prevState) => !prevState);
  };

  const setRestaurantClicked = (res_name, res_id) => {
    dispatch(setRestaurantNameAndId(res_name, res_id));
    setRestaurantListOpen((prevState) => !prevState);
  };


  // !Header for All Pages Except Error Page
  const HeaderComponent = () => {
    return (
      <>
        {/*//? small , mid , big */}
        {/* <div className="header_bg"></div> */}
        <header className={`header header-${headerSize}`} style={cStyles}>
          {/* <Hamburger
            toggled={isOpen}
            toggle={setOpen}
            direction="right"
            size={22}
            color="#F5F5F9"
            rounded
            duration={1}
            easing="ease-in"
            className="Hamburger"
          /> */}
          <div className="header-wrapper">
            <div className="header__text">
              {!isHomePage ? (
                // ? Then show the back button and the heading
                <>
                  <span
                    className="header__text--icon"
                    onClick={() => navigate(-1)}
                  >
                    <MdOutlineArrowBackIosNew size={20} />
                  </span>
                  <h1
                    className="header__text--heading"
                    // onClick={isHomePage && openRestaurantList}
                  >
                    {heading.length > 20
                      ? heading.substring(0, 20) + "..."
                      : heading}
                  </h1>
                </>
              ) : (
                // ? iif Home Page then show the Restaurant Name~
                <>
                  <div className="rest_list">
                    <div
                      className={
                        isRestaurantListOpen ? "dropdown" : "hide-dropdown"
                      }
                    >
                      {restaurant_list.map((restaurant, index) => {
                        const { res_id, res_name } = restaurant;

                        return (
                          <div className="item" key={index}>
                            <span
                              className={
                                "item--name " +
                                `${
                                  selected_res_name === res_name
                                    ? "selected"
                                    : ""
                                }`
                              }
                              onClick={() => {
                                setRestaurantListOpen(false);
                                setRestaurantClicked(res_name, res_id);
                              }}
                            >
                              {res_name.length > 20
                                ? res_name.substring(0, 20) + "..."
                                : res_name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <h1
                    className="header__text--heading"
                    onClick={openRestaurantList}
                    // onClick={isHomePage && openRestaurantList}
                  >
                    {restaurantName.length > 18
                      ? restaurantName.substring(0, 15) + "..."
                      : restaurantName}

                    {/* {heading} */}
                  </h1>

                  <span
                    className="header__text--icon btn"
                    ref={restaurantListRef}
                  >
                    <IoChevronDownSharp />
                  </span>
                </>
              )}
            </div>

            <div className="header__btn btn" onClick={onOpenResultType}>
              <div className="result-type_list">
                <div
                  className={isResultTypeOpne ? "dropdown" : "hide-dropdown"}
                >
                  {allResultType.map((type, index) => {
                    return (
                      <div className="item" key={index}>
                        <span
                          className={
                            "item--name" +
                            ` ${type === resultType ? "selected" : ""}`
                          }
                          onClick={() => {
                            setResultTypeOpen(false);
                            setResultTypeOfData(type);
                          }}
                        >
                          {type}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* {console.log("allResultType",allResultType, resultType)} */}
              {/* {console.log("allResultType",allResultType, resultType)} */}
              <span className="header__btn--text">{resultType}</span>
              <span
                className="header__btn--icon"
                // ! No use till now
                ref={resultTypeRef}
              >
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
