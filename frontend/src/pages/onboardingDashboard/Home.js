import React from "react";
import { IoHomeOutline } from "react-icons/io5";
import { MdAnchor } from "react-icons/md";
import { CgLoadbarSound } from "react-icons/cg";
import { GiCommercialAirplane } from "react-icons/gi";
import logo_img from "../../styles/images/logo-img.png";
import ReactPlayer from "react-player";
import { useForm } from "react-hook-form";
import ScrollButton from "../../components/ScrollButton"; // Todo: scroll to top
import vooshCardSvg from "../../styles/assets/voosh_card.svg";
import { GrFormPreviousLink } from "react-icons/gr";
import { RiCloseCircleLine } from "react-icons/ri";
import { ToastContainer, toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { loginFailure } from "../../redux/Auth/actions/authAction";
import cookie from "react-cookies";
import Loading from "../../components/Loading";
import { BsShieldFillCheck } from "react-icons/bs";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { RiDoubleQuotesL, RiDoubleQuotesR } from "react-icons/ri";
import Footer from "../../components/onboardingDashboard/Footer";
import Header from "../../components/onboardingDashboard/Header";
import { BottomSheet } from "react-spring-bottom-sheet";
import { FaPhoneAlt } from "react-icons/fa";
import { ImArrowRight2 } from "react-icons/im";
import { Line, Bar } from "react-chartjs-2";
import "react-spring-bottom-sheet/dist/style.css";
import "./bottomSheet.css";
import BannerArray from "../../utils/bannerArray";
import PersonArray from "../../utils/customerReviewArray";
import ReactGA from "react-ga4";
import MetaTags from "react-meta-tags";
import ReactPixel from "react-facebook-pixel";
const TEMP_APP_TOKEN = "temp-voosh-token";

const options = {
  // title: {
  //   display: true,
  //   text: "Voosh",
  // },
  plugins: {
    legend: {
      display: true,
    },
  },

  scales: {
    y: {
      beginAtZero: true,
      grid: {
        // drawBorder: false,
        // display: false,
      },
      ticks: {
        min: 3.5,
        max: 4,
        stepSize: 0.5,
      },
    },
    x: {
      beginAtZero: true,
      grid: {
        // display: false,
      },
    },
  },
};
const options2 = {
  plugins: {
    legend: {
      // show title written in data
      display: false,
    },
  },
  scales: {
    y: {
      ticks: {
        stepSize: 10,
        color: "#969BB0",
      },
      beginAtZero: true,
      grid: {
        // drawBorder: false,
        // display: false,
        color: "#f5f5f9",
      },
    },
    x: {
      ticks: {
        stepSize: 10,
        color: "#969BB0",
      },
      beginAtZero: true,
      grid: {
        // display: false,
        color: "#f5f5f9",
      },
    },
  },
};
const LineGraphData = {
  labels: [0, 20, 40, 60, 80, 100, 120, 140],

  datasets: [
    {
      label: "Order V/S Rating Growth",
      data: [null, null, 3.6, 3.73, 3.91, 3.98, null],
      // fill: true,
      backgroundColor: "rgba(75,192,192,0.2)",
      borderColor: "rgba(75,192,192,1)",
      llineTension: 0,
      tension: 0.4,
    },
  ],
};
const LineGraphData2 = {
  labels: [0, 10, 20, 30, 40, 50, 60],
  datasets: [
    {
      label: "Customer Attraction %",
      data: [0, 10, 30, 45, 65, 85, 95],
      fill: true,
      backgroundColor: "rgba(75,192,192,0.2)",
      borderColor: "rgba(75,192,192,1)",
      tension: 0.5,
      borderWidth: 1,
    },
  ],
};

const Home = ({
  currentUserDetails,
  setCurrentUserDetails,
  dataSubmitted,
  setDataSubmitted,
  isLoading,
  changePage,
  pageName,
}) => {
  const { isTemporaryAuthenticated, temporaryToken } = useSelector(
    (state) => state.auth
  );
  const [displayPageNumber, setDisplayPageNumber] = React.useState(0);
  const [openBottomSheet, setOpenBottomSheet] = React.useState(false);
  const [bottomSheetData, setBottomSheetData] = React.useState({
    bannerName: "",
    title: "",
    subTitle: "",
    content: "",
    image: "",
    points: [],
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue,
  } = useForm();

  const notifyError = (msg) => toast.error(msg);
  const notifySuccess = (msg) => toast.success(msg);

  React.useEffect(() => {
    setBottomSheetData({
      bannerName: "",
      title: "",
      subTitle: "",
      content: "",
      image: "",
      points: [],
    });
    setDisplayPageNumber(0);
    window.scrollTo(0, 0);
  }, []);

  //? call Request, when btn clicked
  const sendResponse = async (bannerData) => {
    const { title } = bannerData;

    try {
      const { data: response } = await axios.post(
        "/user/call-request",
        {
          token: temporaryToken,
          phoneNumber: currentUserDetails.phoneNumber,
          flagName: title,
        }
        // {
        //   headers: {
        //     Authorization: `Bearer ${temporaryToken}`,
        //   },
        // }
      );

      console.log("data", response);
      if (response.status === "success") {
        // setDataSubmitted(true);
        setOpenBottomSheet(false);

        // Todo
        ReactPixel.track("Request a call back", {
          value: `Request a call back, ${title}`,
        });

        ReactGA.event({
          category: "Request a call back",
          action: "Request a call back Submitted",
          label: "Request a call back Submitted",
        });

        notifySuccess(response.message);
      } else {
        notifyError(response.message);
      }
    } catch (error) {
      notifyError(error.message);
    }
  };

  //? Bottom popup on banner click
  const onBannerClick = ({
    bannerName,
    title,
    subTitle,
    content,
    image,
    points,
  }) => {
    ReactPixel.track("Banner Click", {
      value: `Banner ${title} Clicked`,
    });

    ReactGA.event({
      category: `Banner Clicked`,
      action: `Open Banner ${title}`,
      label: `Open Banner`,
    });
    setBottomSheetData({
      bannerName: bannerName,
      title: title,
      subTitle: subTitle,
      content: content,
      image: image,
      points: points,
    });
    setOpenBottomSheet(true);
  };

  // ? handel form basic details
  const onSubmitFormOne = (data) => {
    // Todo data will be empty cuz we not changing the any field(Disabled)
    // ? Use User Details to update the data or to continue...
    console.log(data);

    if (data.checkbox_1 === true) {
      setValue("swiggy-number", currentUserDetails.phoneNumber);
    } else if (data.checkbox_1 === false) {
      setValue("swiggy-number", "");
    }
    if (data.checkbox_2 === true) {
      setValue("zomato-number", currentUserDetails.phoneNumber);
    }

    if (data["restaurant-name"] !== currentUserDetails.restaurantName) {
      setCurrentUserDetails((prevState) => {
        return {
          ...prevState,
          restaurantName: data["restaurant-name"],
        };
      });
      console.log("sup");
      // * Events
      ReactPixel.track("Form-1 Basic Details", {
        value: "Basic Details Form Filled",
      });

      ReactGA.event({
        category: "Form Fillup",
        action: "Basic Details Form Filled",
        label: "Basic Details Form Filled",
      });
    }

    // Todo prev page se if u are coming back !
    setValue("checkbox_not-in-swiggy", false);
    setValue("checkbox_not-in-zomato", false);
    setDisplayPageNumber(2);
  };

  // ? handel form swiggy details
  const onSubmitFormTwo = async (data) => {
    console.log("data:", data);

    const swiggyNumber = data["swiggy-number"];
    const swiggyPassword = data["swiggy-password"];
    const isNotInSwiggyChecked = data["checkbox_not-in-swiggy"];
    // ! cuz we are skipping the form two
    if (isNotInSwiggyChecked) {
      setValue("swiggy-number", "");
      setValue("swiggy-password", "");
      setDisplayPageNumber(3);
      return;
    }
    // ! if we are here the checkbox is not checked
    // ? check the swiggy number and password
    if (swiggyNumber === "" && swiggyPassword === "") {
      notifyError(
        "Please fill all the fields, or select the checkbox if you are not in Swiggy!"
      );
      return;
    }
    // ? length of swiggy number is not 10
    if (swiggyNumber.length < 10) {
      notifyError("Please a 10 digit Swiggy number!");
      return;
    }
    // ? check the swiggy password presnt but not the swiggy number
    if (swiggyPassword.length !== 0 && swiggyNumber.length === 0) {
      notifyError("Please enter your Swiggy number!");
      return;
    }

    // ?check the swiggy password more then 3 characters
    if (swiggyPassword.length === 0) {
      notifyError("Please enter Swiggy password!");
      return;
    }
    // ?check the swiggy password more then 3 characters
    if (swiggyPassword.length < 3) {
      notifyError("Please enter a real Swiggy password!");
      return;
    }
    // ! Now let check if the swiggy number is valid or not
    try {
      const { data: response } = await axios.post("/check-swiggy-number", {
        swiggy_register_phone: swiggyNumber,
        swiggy_password: swiggyPassword,
      });
      console.log(response);

      if (response.status === "error") {
        // Todo: test
        ReactPixel.track("Provided Swiggy Number is not valid", {
          value: "Provided Swiggy Number is not valid",
        });
        ReactGA.event({
          category: "Form Fillup",
          action: "Provided Swiggy Number is not valid",
          label: "Swiggy Number Check Failed",
        });
        notifyError(response.message);
        return;
      }
      // ? if the response is success then we can continue
      else {
        // Todo: test
        ReactPixel.track("Form-2 Swiggy Details", {
          value: "Swiggy Details Form Filled",
        });

        ReactGA.event({
          category: "Form Fillup",
          action: "Swiggy Details Form Filled",
          label: "Swiggy Details Form Filled",
        });
        console.log("response:", response);
        setDisplayPageNumber(3);
      }
    } catch (err) {
      // ? if the response is error then we can continue
      console.log(err);
      notifyError("Server Error or Internet Problem, Please try again later");
    }
  };

  // ? handel form zomato details
  const onSubmitFormThree = async (data) => {
    console.log("data:", data);
    const isNotInSwiggyChecked = data["checkbox_not-in-swiggy"];
    const isNotInZomatoChecked = data["checkbox_not-in-zomato"];
    const swiggyNumber = data["swiggy-number"];
    const zomatoNumber = data["zomato-number"];

    if (isNotInSwiggyChecked && isNotInZomatoChecked) {
      notifyError(
        "Provide atleast one phone number either in Swiggy or Zomato!"
      );
      return;
    }
    if (swiggyNumber === "" && zomatoNumber === "") {
      notifyError(
        "Provide atleast one phone number either in Swiggy or Zomato!"
      );
      return;
    }
    // ? length of swiggy number is not 10
    if (!isNotInZomatoChecked && zomatoNumber.length < 10) {
      console.log(
        isNotInSwiggyChecked,
        isNotInZomatoChecked,
        zomatoNumber,
        zomatoNumber.length
      );
      notifyError("Please enter 10 digit Zomato number!");
      return;
    }

    //! Todo save or udate the current user
    try {
      // checkbox_1: true
      // checkbox_2: true
      // checkbox_not-in-swiggy: true
      // checkbox_not-in-zomato: false
      // email: "shanu09.sm@gmail.com"
      // phone-number: undefined
      // restaurant-name: "dummy"
      // swiggy-number: ""
      // swiggy-password: ""
      // user-name: "555"
      // zomato-number: 7008237257

      const { data: response } = await axios.post("/user/update/onboard-data", {
        token: temporaryToken,
        // name: data["user-name"],
        // email: data["email"],
        restaurant_name: data["restaurant-name"],
        phone: currentUserDetails.phoneNumber,
        swiggy_register_phone: swiggyNumber,
        swiggy_password: data["swiggy-password"],
        zomato_register_phone: zomatoNumber,
      });
      console.log(response);
      if (response.status === "success") {
        console.log("response success", response);
        notifySuccess(response.message);

        // Todo: test
        ReactPixel.track("Form-3 Zomato Details", {
          value: "Zomato Details Form Filled",
        });

        ReactGA.event({
          category: "Zomato Fillup",
          action: "Zomato Details Form Filled",
          label: "Zomato Details Form Filled",
        });
        setDisplayPageNumber(0);
        setDataSubmitted(true);
      } else {
        console.log("response error", response);
        notifyError(response.message);
      }
    } catch (err) {
      console.log(err);
      notifyError("Server Error or Internet Problem, Please try again later");
      displayPageNumber(0);
    }
  };

  // ? onboarded Dashboard
  const DashboardPage = () => {
    return (
      <>
        <MetaTags>
          <title>Voosh | Home-Onboarding-Dashboard</title>
          <meta
            name="voosh web app, Home-Onboarding-Dashboard page"
            content="voosh Home-Onboarding-Dashboard page"
          />
          <meta property="og:title" content="web-app" />
        </MetaTags>
        <div
          className="container onboard-container onboard-home"
          // Todo: temp use
          style={{ marginBottom: "0rem" }}
        >
          <Header />
          {/* //! dashboard */}
          {!dataSubmitted && (
            <div className="onboard-preview-dashboard">
              <div className="onboard-preview-dashboard__top">
                <div className="onboard-preview-dashboard__top--icon">
                  <IoHomeOutline size={30} />
                </div>
                <div className="onboard-preview-dashboard__top--rest-name">
                  Onboard With Us!
                </div>
                <div className="onboard-preview-dashboard__top--info">
                  Sync your <span>Swiggy</span> and <span>Zomato</span> accounts
                  for a wholesome experience
                </div>
              </div>
              <div className="onboard-preview-dashboard__mid">
                <span className="onboard-preview-dashboard__mid--left-bar"></span>
                <span className="onboard-preview-dashboard__mid--text">
                  {" "}
                  Get{" "}
                </span>
                <span className="onboard-preview-dashboard__mid--right-bar"></span>
              </div>
              <div className="onboard-preview-dashboard__bottom">
                {/* //? all bottom menu btns */}
                <div className="onboard-preview-dashboard__bottom--menu-btns">
                  <div className="menu-btn">
                    <div className="icon">
                      <CgLoadbarSound size={32} />
                    </div>
                    <div className="text">Performance insights</div>
                  </div>
                  <div className="menu-btn">
                    <div className="icon">
                      <MdAnchor size={32} />
                    </div>
                    <div className="text">Expert help and insights</div>
                  </div>
                  <div className="menu-btn">
                    <div className="icon">
                      <GiCommercialAirplane size={32} />
                    </div>
                    <div className="text">Maximum results</div>
                  </div>
                </div>
                <div
                  className="onboard-preview-dashboard__bottom--btn add-now-btn"
                  onClick={() => {
                    // Todo: test
                    ReactPixel.track("Add Now", {
                      value: "Add Now Button Clicked",
                    });

                    ReactGA.event({
                      category: "Button Clicked",
                      action: "Add Now",
                      label: "Add Now Button Clicked",
                    });
                    setDisplayPageNumber(1);
                  }}
                >
                  Click to Grow !
                </div>
              </div>
            </div>
          )}

          {/* //! if get the data the show we are analysing yor data */}
          {dataSubmitted && (
            <div className="onboard-alalysing">
              <div className="icon">
                <CgLoadbarSound size={40} />
              </div>
              <div className="text">Our bots are analysing your data!</div>
            </div>
          )}

          {/* //! Banners */}
          <div className="onboard-banners">
            <h1 className="onboard-banners__title">
              <span className="text">FREE call with </span>
              <span className="orange name"> Voosh</span>
            </h1>

            <div className="onboard-banners__banners">
              {BannerArray.map((banner, index) => {
                const { bannerName, title, subTitle, image, content, points } =
                  banner;

                return (
                  <div
                    key={index}
                    className="onboard-banners__banners--card"
                    //   ! onclick it will change bottom sheet data dynamically
                    onClick={() => {
                      onBannerClick({
                        bannerName,
                        title,
                        subTitle,
                        image,
                        content,
                        points,
                      });
                    }}
                  >
                    <div className="head">
                      <img src={image} alt="banner-article" className="image" />
                    </div>
                    <div className="body">
                      <div className="heading">{subTitle}</div>
                      {/* <div className="sub-heading">{subTitle}</div> */}
                      <div className="icon know-more">
                        Know More
                        {/* <HiArrowSmRight /> */}
                      </div>
                    </div>
                  </div>
                );
              })}
              {/* <div className="onboard-banners__banners--card">
              <div className="head">
                <img
                  src={random_food_image1}
                  alt="banner-article"
                  className="image"
                />
              </div>
              <div className="body">
                <div className="heading">Get free counselling</div>
                <div className="sub-heading">while we analyse your data</div>
                <div
                  className="icon"
                 
                  onClick={() => {
                    onBannerClick({
                      bannerName: "Get free counselling",
                      title: "Get free counselling",
                      subTitle: "while we analyse your data",
                      content:
                        "Gain edge by using our technology solutions for POS, inventory, procurement and auditing. Gain edge by using our technology solutions for POS, inventory, procurement and auditing.",
                      image: random_food_image1,
                    });
                  }}
                >
                  <HiArrowSmRight />
                   <HiArrowRight />
                  <HiArrowNarrowRight />
                  <ImArrowRight2 />
                  <FaArrowRight /> 
                </div>
              </div>
            </div> */}
            </div>
          </div>

          {/* //! Blue Cards */}
          {/* <div className="onboard-city-card">
          <div className="onboard-city-card__title">
            Check out the average cost for two in the top metros of India
          </div>
          <div className="blue-cards">
            <div className="card">
              <div className="card__head">
                <div className="card__head--name">Kolkata</div>
                <div className="card__head--price">&#8377; 120</div>
              </div>
            </div>
            <div className="card">
              <div className="card__head">
                <div className="card__head--name">Banglore</div>
                <div className="card__head--price">&#8377; 180</div>
              </div>
            </div>
            <div className="card">
              <div className="card__head">
                <div className="card__head--name">Mumbai</div>
                <div className="card__head--price">&#8377; 240</div>
              </div>
            </div>
          </div>
        </div> */}

          {/* //! Line Graph */}
          <div
            className="onboard-graphs"
            style={{ marginTop: "3rem", marginBottom: "3rem" }}
          >
            {/* <div className="linegraph-1" style={{ marginBottom: "2.5rem" }}>
              <div
                className=""
                style={{
                  textAlign: "center",
                  fontSize: "25px",
                }}
              >
                Order V/S Rating Growth
              </div>
              <Line options={options} data={LineGraphData} />
            </div> */}
            <div
              className="linegraph-2"
              style={
                {
                  // color:"#efefef",
                }
              }
            >
              <div className="label-head">
                <div className="label-head__text">
                  Checkout Bangaluru customer
                  <br />
                  attrction percentage
                </div>
              </div>
              <div className="graph">
                <Line options={options2} data={LineGraphData2} height={220} />
              </div>
              <div className="label-bottom">DISCOUNT PERCENTAGE</div>
            </div>
          </div>

          {/* //! score bars */}
          {/* <div className="onboard-area-score">
          <div className="onboard-area-score__bars">
            <div className="bar">
              <div className="name">Indiranagar</div>
              <div className="rating-bar">
                <div
                  className="rating-bar--fill"
                  style={{ width: `${Math.floor(Math.random() * 101)}%` }}
                ></div>
              </div>
              <div className="info">
                <span>582</span>
                <span>restaurants</span>
              </div>
            </div>
            <div className="bar">
              <div className="name">BTM</div>
              <div className="rating-bar">
                <div
                  className="rating-bar--fill"
                  style={{ width: `${Math.floor(Math.random() * 101)}%` }}
                ></div>
              </div>
              <div className="info">
                <span>582</span>
                <span>restaurants</span>
              </div>
            </div>
            <div className="bar">
              <div className="name">HSR</div>
              <div className="rating-bar">
                <div
                  className="rating-bar--fill"
                  style={{ width: `${Math.floor(Math.random() * 101)}%` }}
                ></div>
              </div>
              <div className="info">
                <span>582</span>
                <span>restaurants</span>
              </div>
            </div>
            <div className="bar">
              <div className="name">Kormangla</div>
              <div className="rating-bar">
                <div
                  className="rating-bar--fill"
                  style={{ width: `${Math.floor(Math.random() * 101)}%` }}
                ></div>
              </div>
              <div className="info">
                <span>582</span>
                <span>restaurants</span>
              </div>
            </div>
            <div className="bar">
              <div className="name">Indiranagar</div>
              <div className="rating-bar">
                <div
                  className="rating-bar--fill"
                  style={{ width: `${Math.floor(Math.random() * 101)}%` }}
                ></div>
              </div>
              <div className="info">
                <span>582</span>
                <span>restaurants</span>
              </div>
            </div>
            <div className="bar">
              <div className="name">BTM</div>
              <div className="rating-bar">
                <div
                  className="rating-bar--fill"
                  style={{ width: `${Math.floor(Math.random() * 101)}%` }}
                ></div>
              </div>
              <div className="info">
                <span>582</span>
                <span>restaurants</span>
              </div>
            </div>
          </div>
        </div> */}

          {/* //! Review Cards */}
          <div
            className="onborad-customer-reviews"
            // Todo: temp use
            style={{ paddingBottom: "6rem", marginBottom: "0rem" }}
          >
            <span className="quote-right">
              <RiDoubleQuotesR size={180} />
            </span>
            <span className="quote-left">
              <RiDoubleQuotesL size={180} />
            </span>
            <h1 className="onborad-customer-reviews__title">
              What our partners think of us
            </h1>
            <div className="onborad-customer-reviews__all-reviews">
              {PersonArray.map((person, index) => {
                const { image, review, name, restaurantName } = person;
                return (
                  <div className="single-review-card">
                    <div className="head">
                      <img src={image} alt="user" />
                    </div>
                    <div className="body">
                      <div className="review">
                        {review.length > 50
                          ? review.slice(0, 50) + "..."
                          : review}
                      </div>

                      <div className="user-name">
                        -{name}
                        {`(${restaurantName})`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* <ScrollButton /> */}
        </div>
      </>
    );
  };

  // ? basic details form-1
  const RenderPageOne = () => {
    return (
      <>
        <MetaTags>
          <title>Voosh | Form-1 Basic Details</title>
          <meta
            name="voosh web app, Form-1 Basic Details"
            content="voosh Form-1 Basic Details page"
          />
          <meta property="og:title" content="web-app" />
        </MetaTags>
        <div className="container onboard-form">
          <div className="page-btns">
            <span
              className="previous"
              onClick={() => {
                // Todo
                ReactPixel.track("Go Back Click", {
                  value: "Go Back to Onboard Dashboard",
                });
                ReactGA.event({
                  category: "Button Clicked",
                  action: "Go Back to Onboard Dashboard",
                  label: "Go Back to Onboard Dashboard",
                });
                setDisplayPageNumber(0);
              }}
            >
              <GrFormPreviousLink size={30} />
            </span>
            <span className="text">
              STEP {displayPageNumber} / {3}
            </span>
            <span className="close">
              <RiCloseCircleLine
                size={30}
                onClick={() => {
                  // Todo
                  ReactPixel.track("Close Form, in Step-1", {
                    value: "Go Back to Onboard Dashboard",
                  });
                  ReactGA.event({
                    category: "Button Clicked",
                    action: "Close Form 1",
                    label: "Close Form 1, Go Back to Onboard Dashboard",
                  });
                  setDisplayPageNumber(0);
                }}
              />
            </span>
          </div>
          <div className="page-body">
            <div className="page-body__title">
              <div className="page-body__title--text">
                Confirm restaurant details
              </div>
            </div>
            <form
              className="page-body__form"
              onSubmit={handleSubmit(onSubmitFormOne)}
            >
              {/* //! Restaurant Name */}
              <div className="page-body__form--input-feild">
                <input
                  className="form-input"
                  type="text"
                  placeholder="Restaurant Name"
                  {...register("restaurant-name", {
                    required: true,
                    minLength: 1,
                  })}
                />
              </div>
              <div className="page-body__form--error">
                {errors["restaurant-name"] && (
                  <p className="error red">
                    Name should be atleast 1 characters long
                  </p>
                )}
              </div>

              {/* //! Phone Number */}
              <div className="page-body__form--input-feild">
                <input
                  className="form-input in-number"
                  defaultValue={"+91"}
                  disabled={true}
                />
                <input
                  className="form-input phone-number"
                  type="tel"
                  name="phone-number"
                  placeholder="Phone Number"
                  defaultValue={currentUserDetails.phoneNumber}
                  disabled={true}
                  {...register("phone-number", {
                    // required: true,
                    maxLength: 10,
                    minLength: 10,
                  })}
                />
              </div>
              <div className="page-body__form--error">
                {errors["phone-number"] && (
                  <p className="error red">Enter your 10 digit mobile number</p>
                )}
              </div>
              {/* //! Checkbox */}
              <div className="page-body__form--check-box">
                <span className="text">Same Number:</span>
                <span className="box-feild">
                  <span className="checkbox-container">
                    <input
                      className="checkbox-input"
                      {...register("checkbox_1")}
                      type="checkbox"
                      defaultChecked={true}
                      onChange={(e) => {
                        console.log(e.target.checked);
                      }}
                    />
                    <span className="checkbox-checkmark"></span>
                  </span>

                  <span style={{ marginLeft: ".3rem", fontWeight: "700" }}>
                    {" "}
                    Swiggy
                  </span>
                </span>
                <span className="box-feild">
                  <input
                    className="checkbox-input"
                    {...register("checkbox_2")}
                    type="checkbox"
                    defaultChecked={true}
                    onChange={(e) => {
                      console.log(e.target.checked);
                    }}
                  />
                  <span style={{ marginLeft: ".3rem", fontWeight: "700" }}>
                    {" "}
                    Zomato
                  </span>
                </span>
              </div>
              {/* //! Name */}
              {/* <div className="page-body__form--input-feild">
                <input
                  className="form-input"
                  type="text"
                  placeholder="Your Name"
                  {...register("user-name", {
                    required: true,
                    minLength: 3,
                  })}
                />
              </div>
              <div className="page-body__form--error">
                {errors["user-name"] && (
                  <p className="error red">
                    Name should be atleast 1 characters long
                  </p>
                )}
              </div> */}
              {/* //! Email */}
              {/* <div className="page-body__form--input-feild ">
                <input
                  className="form-input"
                  type="email"
                  // required
                  placeholder="Email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value:
                        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                      message: "Please enter a valid email",
                    },
                  })}
                />
              </div>
              <div
                className="page-body__form--error"
                style={{ marginBottom: "4rem" }}
              >
                {errors["email"] && (
                  <p className="error red">Provide a valid email address</p>
                )}
              </div> */}

              {/*// ?Proceed Button */}
              <div className="page-body__form--btn">
                <button className="btn">Proceed</button>
                <div className="contact-us">
                  {/*//!temp call us */}
                  <span className="text">Need help?</span>
                  <span
                    className="orange text-bold"
                    onClick={() => {
                      ReactPixel.track("Contact Us Clicked", {
                        value: "Contact Us Clicked, in Step-1",
                      });

                      ReactGA.event({
                        category: "Button Click",
                        action: "Call Us text clicked",
                        label: "Call Us text clicked",
                      });
                      // notifySuccess(
                      //   "Your Call Request is Submitted Successfully, We will get back to you soon"
                      // );
                    }}
                  >
                    Call Us @ +91-9015317006
                  </span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  };

  // ? swiggy details form-2
  const RenderPageTwo = () => {
    return (
      <>
        <MetaTags>
          <title>Voosh | Form-2 Swiggy Details</title>
          <meta
            name="voosh web app, Form-2 Swiggy Details"
            content="voosh Form-2 Swiggy Details page"
          />
          <meta property="og:title" content="web-app" />
        </MetaTags>
        <div className="container onboard-form">
          <div className="page-btns">
            <span
              className="previous"
              onClick={() => {
                // Todo
                ReactPixel.track("Go Back Click", {
                  value: "Go Back to Step-1",
                });
                ReactGA.event({
                  category: "Button Clicked",
                  action: "Go Back to Step-1",
                  label: "Go Back to Step-1",
                });

                setDisplayPageNumber(1);
              }}
            >
              <GrFormPreviousLink size={30} />
            </span>
            <span className="text">
              STEP {displayPageNumber} / {3}
            </span>
            <span className="close">
              <RiCloseCircleLine
                size={30}
                onClick={() => {
                  // Todo
                  ReactPixel.track("Close Form, in Step-2", {
                    value: "Go Back to Onboard Dashboard",
                  });
                  ReactGA.event({
                    category: "Button Clicked",
                    action: "Close Form 2",
                    label: "Close Form 2, Go Back to Onboard Dashboard",
                  });

                  setDisplayPageNumber(0);
                }}
              />
            </span>
          </div>
          <div className="page-body">
            <div className="page-body__title">
              <div className="page-body__title--text">
                Please link your Swiggy ID
              </div>
            </div>
            <form
              className="page-body__form"
              onSubmit={handleSubmit(onSubmitFormTwo)}
            >
              <div className="page-body__form--secure-text">
                <BsShieldFillCheck size={20} className="icon" />
                <span className="text"> Your data is secure with us</span>
                {/* <BsShieldFillCheck size={20} className="icon" /> */}
                <IoIosInformationCircleOutline size={25} className="icon" />
              </div>
              {/* //!Swiggy Rest. Phone */}

              <div className="page-body__form--input-feild">
                <input
                  className="form-input"
                  type="tel"
                  name="swiggy-number"
                  placeholder="Swiggy Number"
                  {...register("swiggy-number", {
                    // required: true,
                    maxLength: 10,
                    // minLength: 10,
                  })}
                />
              </div>
              <div className="page-body__form--error">
                {errors["swiggy-number"] && (
                  <p className="error red">
                    Provide a valid number, your Swiggy Registered Phone Number
                  </p>
                )}
              </div>

              {/* //!Swiggy Password */}
              <div className="page-body__form--input-feild">
                <input
                  className="form-input"
                  type="password"
                  name="swiggy-password"
                  placeholder="Swiggy Password"
                  {...register("swiggy-password", {
                    // required: true,
                    // minLength: 3,
                  })}
                />
              </div>
              <div className="page-body__form--error">
                {errors["swiggy-password"] && (
                  <p className="error red">
                    Your Swiggy password should be atleast 3 characters long
                  </p>
                )}
              </div>
              <div
                className="page-body__form--skip-btn"
                onClick={() => {
                  const data = getValues();
                  const isCheckboxChecked = data["checkbox_not-in-swiggy"];

                  if (!isCheckboxChecked) {
                    setValue("checkbox_not-in-swiggy", true);
                    setValue("swiggy-number", "");
                    setValue("swiggy-password", "");
                  } else {
                    setValue("checkbox_not-in-swiggy", false);
                    setValue("swiggy-number", "");
                    setValue("swiggy-password", "");
                  }

                  console.log(data, "data insde skip");

                  // setDisplayPageNumber(3);
                }}
              >
                <input
                  {...register("checkbox_not-in-swiggy")}
                  type="checkbox"
                  className="checkbox-not-in-swiggy"
                  style={{
                    marginRight: ".3rem",
                  }}
                />
                <span>
                  I don't have a{" "}
                  <span
                    style={{
                      fontWeight: "600",
                    }}
                  >
                    Swiggy
                  </span>{" "}
                  account
                </span>
              </div>

              {/*// ?Proceed Button */}
              <div className="page-body__form--btn">
                <button className="btn">Proceed</button>
                <div className="contact-us">
                  {/*//!temp call us */}
                  <span className="text">Need help?</span>
                  <span
                    className="orange text-bold"
                    onClick={() => {
                      ReactPixel.track("Contact Us Clicked", {
                        value: "Contact Us Clicked, in Step-2",
                      });

                      ReactGA.event({
                        category: "Button Click",
                        action: "Call Us text clicked",
                        label: "Call Us text clicked",
                      });
                      // notifySuccess(
                      //   "Your Call Request is Submitted Successfully, We will get back to you soon"
                      // );
                    }}
                  >
                    Call Us +91-9015317006
                  </span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  };

  // ? zomato  details form-3
  const RenderPageThree = () => {
    return (
      <>
        <MetaTags>
          <title>Voosh | Form-3 Zomato Details</title>
          <meta
            name="voosh web app, Form-3 Zomato Details"
            content="voosh Form-3 Zomato Details page"
          />
          <meta property="og:title" content="web-app" />
        </MetaTags>
        <div className="container onboard-form">
          <div className="page-btns">
            <span
              className="previous"
              onClick={() => {
                // Todo
                ReactPixel.track("Go Back Click", {
                  value: "Go Back to Step-2",
                });
                ReactGA.event({
                  category: "Button Clicked",
                  action: "Go Back to Step-2",
                  label: "Go Back to Step-2",
                });

                setDisplayPageNumber(2);
              }}
            >
              <GrFormPreviousLink size={30} />
            </span>
            <span className="text">
              STEP {displayPageNumber} / {3}
            </span>
            <span className="close">
              <RiCloseCircleLine
                size={30}
                onClick={() => {
                  // Todo
                  ReactPixel.track("Close Form, in Step-3", {
                    value: "Go Back to Onboard Dashboard",
                  });
                  ReactGA.event({
                    category: "Button Clicked",
                    action: "Close Form 3",
                    label: "Close Form 3, Go Back to Onboard Dashboard",
                  });
                  setDisplayPageNumber(0);
                }}
              />
            </span>
          </div>
          <div className="page-body">
            <div className="page-body__title">
              <div className="page-body__title--text">
                Please link your Zomato ID
              </div>
            </div>
            <form
              className="page-body__form"
              onSubmit={handleSubmit(onSubmitFormThree)}
            >
              <div className="page-body__form--secure-text">
                <BsShieldFillCheck size={20} className="icon" />
                <span className="text"> Your data is secure with us</span>
                <IoIosInformationCircleOutline size={25} className="icon" />
              </div>
              {/* //!Zomato Rest. Phone */}
              <div className="page-body__form--input-feild">
                <input
                  className="form-input"
                  type="tel"
                  name="zomato-number"
                  placeholder="Zomato Number"
                  {...register("zomato-number", {
                    // required: true,
                    maxLength: 10,
                    // minLength: 10,
                  })}
                />
              </div>
              <div className="page-body__form--error">
                {errors["zomato-number"] && (
                  <p className="error red">
                    Provide a valid number, your Zomato Registered Phone Number
                  </p>
                )}
              </div>

              <div
                className="page-body__form--skip-btn"
                onClick={() => {
                  const data = getValues();
                  // console.log(data);
                  const isCheckboxChecked = data["checkbox_not-in-zomato"];
                  console.log(isCheckboxChecked, "isCheckboxChecked");
                  if (!isCheckboxChecked) {
                    setValue("checkbox_not-in-zomato", true);
                    setValue("zomato-number", "");
                  } else {
                    setValue("checkbox_not-in-zomato", false);
                    setValue("zomato-number", "");
                  }
                }}
              >
                <input
                  {...register("checkbox_not-in-zomato")}
                  type="checkbox"
                  className="checkbox-not-in-swiggy"
                  style={{
                    marginRight: ".3rem",
                  }}
                />
                <span>
                  I don't have a{" "}
                  <span
                    style={{
                      fontWeight: "600",
                    }}
                  >
                    Zomato
                  </span>{" "}
                  account
                </span>
              </div>

              {/*// ?Proceed Button */}
              <div className="page-body__form--btn">
                <button className="btn">Proceed</button>
                <div className="contact-us">
                  {/*//!temp call us */}
                  <span className="text">Need help?</span>
                  <span
                    className="orange text-bold"
                    onClick={() => {
                      // notifySuccess(
                      //   "Your Call Request is Submitted Successfully, We will get back to you soon"
                      // );
                      ReactPixel.track("Contact Us Clicked", {
                        value: "Contact Us Clicked, in Step-3",
                      });

                      ReactGA.event({
                        category: "Button Click",
                        action: "Call Us text clicked",
                        label: "Call Us text clicked",
                      });
                    }}
                  >
                    Call Us @+91-9015317006
                  </span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {/* //! onboarding Dashboard */}
      {displayPageNumber === 0 && <DashboardPage />}
      {displayPageNumber === 1 && <RenderPageOne />}
      {displayPageNumber === 2 && <RenderPageTwo />}
      {displayPageNumber === 3 && <RenderPageThree />}
      {displayPageNumber === 0 && (
        <Footer changePage={changePage} pageName={pageName} />
      )}
      <BottomSheet
        open={openBottomSheet}
        onDismiss={() => {
          setBottomSheetData({
            bannerName: "",
            title: "",
            subTitle: "",
            content: "",
            image: "",
            points: [],
          });
          setOpenBottomSheet(false);
        }}
        snapPoints={({ maxHeight }) => 0.8 * maxHeight}
        // header={<div className="onboard-bottom-sheet__header">SHEET HEADER</div>}
        footer={
          <div className="onboard-bottom-sheet__footer">
            <div
              className="btn"
              onClick={() => {
                console.log("clicked", bottomSheetData);
                sendResponse(bottomSheetData);
              }}
            >
              <span className="btn--icon">
                <FaPhoneAlt />
              </span>
              <span className="btn--text">Request a call back</span>
            </div>
          </div>
        }
      >
        <div className="onboard-bottom-sheet__body">
          <div className="head">
            <div className="head__title">
              <div className="head__title--heading">
                {bottomSheetData.title}
              </div>
              {/* <div className="head__title--sub-heading">
                {bottomSheetData.subTitle}
              </div> */}
            </div>
            <div className="body">
              <div className="body__image">
                <img src={bottomSheetData.image} alt="banner" />
              </div>
              <div className="body__content">
                <div
                  className="main-pont"
                  style={{
                    fontSize: "15px",
                    marginBottom: "1rem",
                    color: "black",
                  }}
                >
                  {bottomSheetData.content}
                </div>
                <div className="all-points">
                  {bottomSheetData.points.map((point, index) => {
                    return (
                      <div
                        key={index}
                        className="point"
                        style={{
                          fontSize: "15px",
                          color: "black",
                        }}
                      >
                        {"-  "}
                        {point}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </BottomSheet>
    </>
  );
};

export default Home;
