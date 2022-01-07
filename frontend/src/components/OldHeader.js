import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { IoChevronDownSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import {
  setResultType,
  setRestaurantNameAndId,
} from "../redux/Data/actions/actions";
import {
  currentWeekStartAndEndDate,
  PreviousWeekStartAndEndDate,
  MonthStringProvider,
} from "../utils/dateProvider";

import { GoogleLogout } from "react-google-login";
import { signoutSuccess } from "../redux/Auth/actions/authAction";
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
  isDropdownNeeded,
}) => {
  const {
    resultType,
    res_name: selected_res_name,
    restaurantList: restaurant_list,
    date: dateInsideState,
  } = useSelector((state) => state.data);

  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  
  // ! Stying the date below the dropdown
  const customDateString = (date) => {
    let result = "";
    if (resultType === "This Week") {
      const { startDate, endDate } = currentWeekStartAndEndDate();
      console.log(currentWeekStartAndEndDate());
      result = `${startDate} - ${endDate}`;
    } else if (resultType === "Previous Week") {
      const { startDate, endDate } = PreviousWeekStartAndEndDate();
      console.log(PreviousWeekStartAndEndDate());
      result = `${startDate} - ${endDate}`;
    } else if (resultType === "This Month" || resultType === "Previous Month") {
      const stringDate = MonthStringProvider(date);
      result = stringDate;
    }
    console.log("result:", result);
    return result;
  };

  // ! Only for fake Dashboard
  let cStyles = {};
  if (fakeData) {
    cStyles = {
      zIndex: "-1",
    };
  }

  //! Help's to Close the dropdown menu
  const handleOnClickAnywhere = (e) => {
    if (
      e.target.classList.contains("item") ||
      e.target.classList.contains("item--name") ||
      e.target.classList.contains("result-type_list") ||
      e.target.classList.contains("rest_list")
    ) {
      return;
    }

    setRestaurantListOpen(false);
    setResultTypeOpen(false);
  };

  //! Help's to Close the dropdown menu
  const handleOnScroll = () => {
    setRestaurantListOpen(false);
    setResultTypeOpen(false);
  };

  React.useEffect(() => {
    document.addEventListener("mousedown", handleOnClickAnywhere);
    document.addEventListener("scroll", handleOnScroll);
    return () => {
      document.removeEventListener("mousedown", handleOnClickAnywhere);
      document.removeEventListener("scroll", handleOnScroll);
    };
  });

  // ! When we visit the revenue page, set the result type to "Prev Day Only"
  React.useEffect(() => {
    console.log(location.pathname, "path name from header");
    const pathnam = location.pathname;
    console.log(pathnam === "/revenue");

    // !On Revenue page
    if (pathnam === "/revenue") {
      dispatch(setResultType("Previous Day"));
      setAllResultType(["Previous Day"]);
    }
    // ! go back old dropdown
    else if (pathnam !== "/revenue" || resultType === "Previous Day") {
      dispatch(setResultType("This Week"));
      setAllResultType([
        "This Week",
        "This Month",
        "Previous Month",
        "Previous Week",
      ]);
    }
  }, [location.pathname]);

  // ! Restaurant List Dropdown
  const openRestaurantList = () => {
    console.log("open restaurant list");
    setRestaurantListOpen((prevState) => !prevState);
  };

  // ! Result Type Dropdown
  const onOpenResultType = () => {
    setResultTypeOpen((prevState) => !prevState);
  };

  // Todo : dont know why im using this!
  const setResultTypeClicked = (type) => {
    dispatch(setResultType(type));
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
                                "item--name" +
                                ` ${
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
                    onClick={openRestaurantList}
                    ref={restaurantListRef}
                  >
                    <IoChevronDownSharp />
                  </span>
                </>
              )}
            </div>

            <div
              className="header__btn btn"
              onClick={onOpenResultType}
              style={{ display: isDropdownNeeded ? "" : "none" }}
            >
              <div className="result-type_list">
                <div
                  className={isResultTypeOpne ? "dropdown" : "hide-dropdown"}
                >
                  {allResultType.map((type, index) => {
                    return (
                      <div className="item" key={index}>
                        {/* //! inside drop down */}
                        {/* <span>
                          {dateInsideState}
                        </span> */}
                        <span
                          className={
                            "item--name" +
                            ` ${type === resultType ? "selected" : ""}`
                          }
                          onClick={() => {
                            setResultTypeOpen(false);
                            setResultTypeClicked(type);
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
              <span className="header__btn--text">
                {resultType}
                <br />
                <span className="date">
                  {customDateString(dateInsideState)}
                </span>
              </span>
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
