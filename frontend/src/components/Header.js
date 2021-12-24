import React from "react";
import { useNavigate } from "react-router-dom";
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
}) => {
  const resultType = useSelector((state) => state.data.resultType);
  const restaurant_list = useSelector((state) => state.data.restaurantList);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setOpen] = React.useState(false);
  const [isRestaurantListOpen, setRestaurantListOpen] = React.useState(false);
  const [isResultTypeOpne, setResultTypeOpen] = React.useState(false);

  const resultTypeRef = React.useRef(null);
  const restaurantListRef = React.useRef(null);

  const handleOnClickAnywhere = (e) => {
    if (
      e.target.classList.contains("item--name") ||
      e.target.classList.contains("item") ||
      e.target.classList.contains("rest_list") ||
      e.target.classList.contains("result-type_list")
    ) {

      // if(isRestaurantListOpen) {
      //   setRestaurantListOpen(false);
      //   // setResultType(true)
      // }
      // if(isResultTypeOpne) {
      //   setResultTypeOpen(false);
      // }

      return;
    }
    // console.log(e.target.classList.contains("item--name"), resultTypeRef.current.classList.contains("item--name"));
    // console.log(e.target, resultTypeRef.current.classList.contains("item"));
    setOpen(false);
    setRestaurantListOpen(false);
    setResultTypeOpen(false);
  };

  React.useEffect(() => {
    document.addEventListener("mousedown", handleOnClickAnywhere);
    return () => {
      document.removeEventListener("mousedown", handleOnClickAnywhere);
    };
  });

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
      t = "week";
    } else if (type === "This Month") {
      t = "month";
    } else if (type === "Prv. Month") {
      t = "prev_month";
    } else if (type === "Prv. Week") {
      t = "prev_week";
    }
    dispatch(setResultType(t));
    setResultTypeOpen((prevState) => !prevState);
  };

  const setRestaurantClicked = (res_name, res_id) => {
    dispatch(setRestaurantNameAndId(res_name, res_id));
    setRestaurantListOpen((prevState) => !prevState);
  };

  React.useEffect(() => {}, []);

  const allResultType = ["This Week", "This Month", "Prv. Month", "Prv. Week"];

  const allResultTypeMap = {
    week: "This Week",
    month: "This Month",
    prev_month: "Prv. Month",
    prev_week: "Prv. Week",
  };

  // !Header for All Pages Except Error Page
  const HeaderComponent = () => {
    return (
      <>
        {/*//? small , mid , big */}
        <header className={`header header-${headerSize}`}>
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
                              className="item--name"
                              onClick={() =>
                                setRestaurantClicked(res_name, res_id)
                              }
                            >
                              {res_name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <span
                    className="header__text--icon btn"
                    ref={restaurantListRef}
                    onClick={openRestaurantList}
                  >
                    <IoChevronDownSharp />
                  </span>
                </>
              )}
            </div>

            <div className="header__btn btn">
              <div className="result-type_list">
                <div
                  className={isResultTypeOpne ? "dropdown" : "hide-dropdown"}
                >
                  {allResultType.map((type, index) => {
                    return (
                      <div className="item" key={index}>
                        <span
                          className="item--name"
                          onClick={() => setResultTypeOfData(type)}
                        >
                          {type}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <span className="header__btn--text">
                {allResultTypeMap[resultType]}
              </span>
              <span className="header__btn--icon" ref={resultTypeRef}>
                <IoChevronDownSharp onClick={onOpenResultType} />
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
