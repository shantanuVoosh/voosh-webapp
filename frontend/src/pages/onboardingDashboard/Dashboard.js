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
import {
  MdDashboard,
  MdSettings,
  MdOutlineNotifications,
} from "react-icons/md";
import { Link } from "react-router-dom";
import { RiDoubleQuotesL, RiDoubleQuotesR } from "react-icons/ri";
import { BsChevronDoubleRight } from "react-icons/bs";
import random_food_image1 from "../../styles/images/food-1.jpg";
import random_food_image2 from "../../styles/images/food-2.jpg";
import random_food_image3 from "../../styles/images/food-3.jpg";
import Explore from "./Explore";
// import Footer from "../../components/onboardingDashboard/Footer";
import Footer from "../../components/Footer";

const APP_TOKEN = "voosh-token";
const TEMP_APP_TOKEN = "temp-voosh-token";

const Dashboard = () => {
  const { isTemporaryAuthenticated, temporaryToken } = useSelector(
    (state) => state.auth
  );
  const [numberOfVideoWatch, setNumberOfVideoWatch] = React.useState(1);
  const [displayPageNumber, setDisplayPageNumber] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [dataSubmitted, setDataSubmitted] = React.useState(false);
  const [currentUserDetails, setCurrentUserDetails] = React.useState({
    name: "",
    email: "",
    restaurantName: "",
    phoneNumber: 7008237257,
  });

  // Todo if form is submitted,
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
    const getUserOnboardData = async () => {
      setIsLoading(true);
      try {
        const { data: response } = await axios.post("/user/onboard-data", {
          token: temporaryToken,
        });
        console.log(response);
        if (response.status === "success") {
          const { userDetails } = response;
          setCurrentUserDetails({
            name: userDetails.name,
            email: userDetails.email,
            restaurantName: userDetails.restaurant_name,
            phoneNumber: userDetails.phone,
          });
          console.log("response success", response);
          setDataSubmitted(response.dataSubmitted);
        } else {
          navigate("/");
          cookie.remove(TEMP_APP_TOKEN);
          dispatch(loginFailure());
        }
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        navigate("/");
        cookie.remove(TEMP_APP_TOKEN);
        dispatch(loginFailure());
        setIsLoading(false);
      }
    };
    getUserOnboardData();
    setDisplayPageNumber(0);
    // setNumberOfVideoWatch(1);
  }, [temporaryToken]);

  // Todo from the state we or DB we can know the Name Email and Rest Name
  const userDetails = {
    name: "Shnatnau Mahato",
    email: "xyz@gmail.com",
    restaurantName: "ABC Restaurant",
    phoneNumber: "0123456789",
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

    // Todo prev page se !
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
      });
      console.log(response);

      if (response.status === "error") {
        notifyError(response.message);
        return;
      }
      // ? if the response is success then we can continue
      else {
        console.log("response:", response);
        setDisplayPageNumber(3);
      }
    } 
    // ? if the response is error then we can continue
    catch (err) {
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
    if (zomatoNumber.length < 10) {
      notifyError("Please a 10 digit Zomato number!");
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
        name: data["user-name"],
        email: data["email"],
        restaurant_name: data["restaurant-name"],
        phone: currentUserDetails.phoneNumber,
        swiggy_register_phone: swiggyNumber,
        zomato_register_phone: zomatoNumber,
      });
      console.log(response);
      if (response.status === "success") {
        console.log("response success", response);
        notifySuccess(response.message);
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
      <div className="container onboard-container">
        <div className="onboard-logo">
          <img src={logo_img} alt="logo" className="onboard-logo--image" />
        </div>
        {/* //! dashboard */}
        {!dataSubmitted && (
          <div className="onboard-preview-dashboard">
            <div className="onboard-preview-dashboard__top">
              <div className="onboard-preview-dashboard__top--icon">
                <IoHomeOutline size={30} />
              </div>
              <div className="onboard-preview-dashboard__top--rest-name">
                Register your restaurant
              </div>
              <div className="onboard-preview-dashboard__top--info">
                Linik your <span>Swiggy</span> and <span>Zomato</span> Id's
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
                  <div className="text">Get all round analysis</div>
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
                onClick={() => setDisplayPageNumber(1)}
              >
                Add Now
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
            <div className="text">We are analysing your Restaurant data</div>
          </div>
        )}

        <Explore />

        <ScrollButton />
      </div>
    );
  };

  // ? basic details form-1
  const RenderPageOne = () => {
    return (
      <div className="container onboard-form">
        <div className="page-btns">
          <span className="previous" onClick={() => setDisplayPageNumber(0)}>
            <GrFormPreviousLink size={30} />
          </span>
          <span className="text">
            STEP {displayPageNumber} / {3}
          </span>
          <span className="close">
            <RiCloseCircleLine
              size={30}
              onClick={() => setDisplayPageNumber(0)}
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
                <span className="text">Need help?</span>
                <a href="tel:9015317006" className="orange text-bold">
                  Call Us
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // ? swiggy details form-2
  const RenderPageTwo = () => {
    return (
      <div className="container onboard-form">
        <div className="page-btns">
          <span className="previous" onClick={() => setDisplayPageNumber(1)}>
            <GrFormPreviousLink size={30} />
          </span>
          <span className="text">
            STEP {displayPageNumber} / {3}
          </span>
          <span className="close">
            <RiCloseCircleLine
              size={30}
              onClick={() => setDisplayPageNumber(0)}
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
                <span className="text">Need help?</span>
                <a href="tel:9015317006" className="orange text-bold">
                  Call Us
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // ? zomato  details form-3
  const RenderPageThree = () => {
    return (
      <div className="container onboard-form">
        <div className="page-btns">
          <span className="previous" onClick={() => setDisplayPageNumber(2)}>
            <GrFormPreviousLink size={30} />
          </span>
          <span className="text">
            STEP {displayPageNumber} / {3}
          </span>
          <span className="close">
            <RiCloseCircleLine
              size={30}
              onClick={() => setDisplayPageNumber(0)}
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
                <span className="text">Need help?</span>
                <a href="tel:9015317006" className="orange text-bold">
                  Call Us
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
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
      {displayPageNumber === 0 && <Footer />}
    </>
  );
};

export default Dashboard;
