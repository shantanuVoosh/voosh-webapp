import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { VscClose } from "react-icons/vsc";
import { IoChevronDownSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import {
  setResultType,
  setRestaurantNameAndId,
  setResultTypeWithStartDateAndEndDate,
  setListingIdWithRestaurantDetails,
} from "../redux/Data/actions/actions";
import {
  currentWeekStartAndEndDate,
  PreviousWeekStartAndEndDate,
  MonthStringProvider,
  getCustomDateInFormat,
  getPreviousDay12HoursAgoDate,
} from "../utils/dateProvider";
import moment from "moment";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import MobileDateRangePicker from "@mui/lab/MobileDateRangePicker";
import DesktopDateRangePicker from "@mui/lab/DesktopDateRangePicker";

import { GoogleLogout } from "react-google-login";
import { signoutSuccess } from "../redux/Auth/actions/authAction";
import cookie from "react-cookies";

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
  onlyShowDate,
}) => {
  const {
    resultType,
    res_name: selected_res_name,
    // restaurantList: restaurant_list,
    allRestaurants: restaurant_list,
    date: dateInsideState,
    startDate,
    endDate,
    // res_id: selected_res_id,
    listingId: selected_listing_id,
  } = useSelector((state) => state.data);

  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [isRestaurantListOpen, setRestaurantListOpen] = React.useState(false);
  const [isResultTypeOpen, setResultTypeOpen] = React.useState(false);
  const [allResultType, setAllResultType] = React.useState([
    "This Week",
    "Previous Week",
    "This Month",
    "Previous Month",
    // Todo: testing purpose
    "Custom Range",
  ]);
  const resultTypeRef = React.useRef(null);
  const restaurantListRef = React.useRef(null);

  // Todo: testing purpose
  const [value, setValue] = React.useState([null, null]);

  // ! Stying the date below the dropdown
  const customDateString = (date) => {
    let result = "";
    if (resultType === "This Week") {
      const { startDate, endDate } = currentWeekStartAndEndDate();
      // console.log(currentWeekStartAndEndDate());
      result = `${startDate} - ${endDate}`;
    } else if (resultType === "Previous Week") {
      const { startDate, endDate } = PreviousWeekStartAndEndDate();
      // console.log(PreviousWeekStartAndEndDate());
      result = `${startDate} - ${endDate}`;
    } else if (resultType === "This Month" || resultType === "Previous Month") {
      const stringDate = MonthStringProvider(date);
      result = stringDate;
    } else if (resultType === "Custom Range") {
      result = `${moment(new Date(startDate)).format("D MMM'YY")} - ${moment(
        new Date(endDate)
      ).format("D MMM'YY")}`;
      console.log("***************");
      console.log(startDate, endDate);
      console.log(result);
      console.log("***************");
    }

    // console.log("result:", result);
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
    console.log(e.target.classList);
    // if (
    //   e.target.classList.contains("item") ||
    //   e.target.classList.contains("item--name") ||
    //   e.target.classList.contains("result-type_list") ||
    //   e.target.classList.contains("MuiOutlinedInput-input") ||
    //   e.target.classList.contains("rest_list")
    // ) {
    //   return;
    // }
    // setRestaurantListOpen(false);
    // setResultTypeOpen(false);
  };

  console.log(isResultTypeOpen, "isResultTypeOpen");

  //! Help's to Close the dropdown menu
  const handleOnScroll = () => {
    setRestaurantListOpen(false);
    setResultTypeOpen(false);
    setShowDatePicker(false);
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
    const pathname = location.pathname;
    setResultTypeOpen(false);
    console.log(pathname === "/revenue");

    if (pathname === "/customerReviews") {
      setAllResultType([
        "This Week",
        "Previous Week",
        "This Month",
        "Previous Month",
      ]);
      return;
    }
    // !On Revenue page
    if (pathname === "/revenue") {
      if (resultType !== "This Month") {
        dispatch(setResultType("This Month"));
      }

      setAllResultType([
        "Previous Day",
        "This Week",
        "Previous Week",
        "This Month",
        "Previous Month",
        "Custom Range",
      ]);
    }
    // ! go back old dropdown
    else if (pathname !== "/revenue") {
      // ?
      if (resultType !== "Previous Day") {
        // ? seting week cuz by default it is "Previous Month"
        dispatch(setResultType("This Month"));
        setAllResultType([
          "This Week",
          "Previous Week",
          "This Month",
          "Previous Month",
          "Custom Range",
        ]);
      }
      // ? if prv day is selected,change to old dropdown and set result type Week
      else {
        dispatch(setResultType("This Month"));
        setAllResultType([
          "This Week",
          "Previous Week",
          "This Month",
          "Previous Month",
          "Custom Range",
        ]);
      }
    }
  }, [location.pathname]);

  const setResultTypeClicked = (type) => {
    dispatch(setResultType(type));
    setValue([null, null]);
    setShowDatePicker(false);
    setResultTypeOpen(false);
  };

  const setNewRestaurantByListingID = (restaurant) => {
    // dispatch(setRestaurantNameAndId(res_name, res_id));
    dispatch(
      setListingIdWithRestaurantDetails({
        ...restaurant,
        listingID: restaurant.listing_id,
      })
    );
    setValue([null, null]);
    setShowDatePicker(false);
    setRestaurantListOpen(false);
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
                // ! left side
                // ? iif Home Page then show the Restaurant Name~
                <>
                  <div className="rest_list">
                    <div
                      className={
                        isRestaurantListOpen ? "dropdown" : "hide-dropdown"
                      }
                    >
                      {restaurant_list.map((restaurant, index) => {
                        const {
                          listing_id,
                          restaurant_name,
                          swiggy_res_id,
                          zomato_res_id,
                        } = restaurant;

                        return (
                          <div className="item" key={index}>
                            <span
                              className={
                                "item--name" +
                                ` ${
                                  selected_listing_id === listing_id
                                    ? "selected"
                                    : ""
                                }`
                              }
                              onClick={() => {
                                // setRestaurantListOpen(false);
                                // setNewRestaurantByListingID(res_id, res_name);
                                setNewRestaurantByListingID(restaurant);
                              }}
                            >
                              {restaurant_name.length > 8
                                ? restaurant_name.substring(0, 5) +
                                  "..." +
                                  listing_id
                                : restaurant_name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* //? This the the heading */}
                  <h1
                    className="header__text--heading"
                    onClick={() =>
                      setRestaurantListOpen((prevState) => !prevState)
                    }
                    // onClick={isHomePage && openRestaurantList}
                  >
                    {restaurantName.length > 18
                      ? restaurantName.substring(0, 15) + "..."
                      : restaurantName}

                    {/* {heading} */}
                  </h1>

                  <span
                    className="header__text--icon btn"
                    onClick={() =>
                      setRestaurantListOpen((prevState) => !prevState)
                    }
                  >
                    <IoChevronDownSharp />
                  </span>
                </>
              )}
            </div>
            <>
              {onlyShowDate ? (
                <div className="header__date">
                  <span className="date">
                    {resultType !== "This Month" &&
                      resultType !== "Previous Month" &&
                      customDateString(dateInsideState).split("-")[1]}
                    {(resultType === "This Month" ||
                      resultType === "Previous Month") &&
                      customDateString(dateInsideState)}
                    
                  </span>
                </div>
              ) : (
                <>
                  {/* //! btn */}
                  <div
                    className="header__btn btn"
                    onClick={() => setResultTypeOpen((prevState) => !prevState)}
                    style={{ display: isDropdownNeeded ? "" : "none" }}
                  >
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
                  {/* //! drop-down */}
                  <div
                    className="result-type_list"
                    style={{ display: isDropdownNeeded ? "" : "none" }}
                  >
                    <div
                      className={
                        isResultTypeOpen ? "dropdown" : "hide-dropdown"
                      }
                    >
                      <div className="close-dropdown">
                        <div
                          className=""
                          onClick={() => setResultTypeOpen(false)}
                        >
                          <VscClose />
                        </div>
                      </div>
                      <div className="items">
                        {allResultType.map((type, index) => {
                          return (
                            <div
                              className="item"
                              key={index}
                              onClick={() => {
                                if (type !== "Custom Range") {
                                  setResultTypeClicked(type);
                                }
                              }}
                            >
                              <span
                                className={
                                  "item--name" +
                                  ` ${type === resultType ? "selected" : ""}`
                                }
                                onClick={(e) => {
                                  // Todo: testing purpose
                                  if (type === "Custom Range") {
                                    setShowDatePicker(
                                      (prevState) => !prevState
                                    );
                                  }
                                  // ! this not Custom Range(this week, Prev week ..etc etc)
                                  else {
                                    setResultTypeClicked(type);
                                  }
                                }}
                              >
                                {type}
                              </span>
                              {/*  // Todo: testing purpose  */}
                              {showDatePicker && type === "Custom Range" && (
                                <div className="">
                                  <LocalizationProvider
                                    dateAdapter={AdapterDateFns}
                                  >
                                    <MobileDateRangePicker
                                      maxDate={
                                        new Date(getPreviousDay12HoursAgoDate())
                                      }
                                      inputFormat={"dd/MM/yyyy"}
                                      minDate={new Date("2021-01-01")}
                                      startText="start"
                                      value={value}
                                      endText="end"
                                      onChange={(newValue) => {
                                        // ! newValue is an array of start and end date
                                        setValue(newValue);
                                        const startDate = newValue[0];
                                        const endDate = newValue[1];
                                        // ! now set the result type to custom range
                                        // !and in redux state set the start and end date
                                        if (
                                          startDate !== null &&
                                          endDate !== null
                                        ) {
                                          setResultTypeOpen(false);
                                          dispatch(
                                            setResultTypeWithStartDateAndEndDate(
                                              type,
                                              getCustomDateInFormat(startDate),
                                              getCustomDateInFormat(endDate)
                                            )
                                          );
                                          // setValue([null, null]);
                                        }
                                      }}
                                      renderInput={(startProps, endProps) => (
                                        <React.Fragment>
                                          <TextField {...startProps} />
                                          <Box sx={{ mx: 0 }}> to </Box>
                                          <TextField {...endProps} />
                                        </React.Fragment>
                                      )}
                                    />
                                  </LocalizationProvider>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
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
