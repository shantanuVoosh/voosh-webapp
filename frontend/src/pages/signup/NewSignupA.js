import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Loading from "../../components/Loading";
import { ToastContainer, toast } from "react-toastify";
import OTPInput, { ResendOTP } from "otp-input-react";
import { GrFormPreviousLink } from "react-icons/gr";
import logo_img from "../../styles/images/logo-img.png";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import axios from "axios";
import firebase from "../../utils/firebase";
import { useDispatch } from "react-redux";
import {
  loginFailure,
  loginSuccess,
  tempLoginSuccess,
} from "../../redux/Auth/actions/authAction";
import { setListingIdWithRestaurantDetails } from "../../redux/Data/actions/actions";
import cookie from "react-cookies";
import ReactPixel from "react-facebook-pixel";
import ReactGA from "react-ga4";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineBars, AiOutlineFundProjectionScreen } from "react-icons/ai";
import PersonArray from "../../utils/customerReviewArray";
import { RiDoubleQuotesL, RiDoubleQuotesR } from "react-icons/ri";
import { BsBarChartLine, BsClipboard } from "react-icons/bs";
import ReactPlayer from "react-player";
import circleSvg from "../../styles/assets/circle-bg-orange.svg";
import hollowSvg from "../../styles/assets/hollow-bg-orange.svg";
import triangleSvg from "../../styles/assets/triangle-bg-orange.svg";

const APP_TOKEN = "voosh-token";
const TEMP_APP_TOKEN = "temp-voosh-token";
const VOOSH_APP_PHONE = "voosh-phone";

const NewSignupA = () => {
  const auth = getAuth();
  const [showPage, setShowPage] = React.useState(0);
  const [otp, setOtp] = React.useState("");
  const [otpError, setOtpError] = React.useState(false);
  const [otpErrorMessage, setOtpErrorMessage] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [phoneInCookie, setPhoneInCookie] = React.useState("");
  const [timeLeft, setTimeLeft] = React.useState(0);
  const [isTimerOn, setIsTimerOn] = React.useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue,
  } = useForm();

  React.useEffect(() => {
    const phone = cookie.load(VOOSH_APP_PHONE);
    if (phone !== undefined && phone.length === 10) {
      setValue("phone-number", phone);
    }

    setShowPage(0);
    setOtp("");
    setOtpError(false);
    setOtpErrorMessage("");
    setIsLoading(false);
    setPhoneInCookie(
      cookie.load(VOOSH_APP_PHONE) ? cookie.load(VOOSH_APP_PHONE) : ""
    );
  }, []);

  // ? for timer only
  React.useEffect(() => {
    const countInterval =
      timeLeft > 0 &&
      setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);

    return () => {
      clearInterval(countInterval);
    };
  }, [timeLeft]);

  // ? for try again button, cuz re refreshing the page, recaptcha will be reset this way
  React.useEffect(() => {
    const isPageRefreshed = cookie.load("voosh-page-refresh");
    if (isPageRefreshed) {
      const phone = cookie.load(VOOSH_APP_PHONE)
        ? cookie.load(VOOSH_APP_PHONE)
        : "";
      cookie.remove("voosh-page-refresh");
      console.log("yes bro");
      onSubmitPhone({
        "phone-number": phone,
      });
    }
  }, []);

  // ?Auto utp Submit
  React.useEffect(() => {
    if (otp.length === 6) {
      // const phone = cookie.load(VOOSH_APP_PHONE)
      const data = getValues();
      onSubmitOTP(data);
    }
  }, [otp]);

  // Todo Testing
  React.useEffect(() => {
    if ("OTPCredential" in window) {
      const ac = new AbortController();

      navigator.credentials
        .get({
          otp: { transport: ["sms"] },
          signal: ac.signal,
        })
        .then((otp) => {
          this.setState({ otp: otp.code });
          ac.abort();
        })
        .catch((err) => {
          ac.abort();
          console.log(err);
        });
    }
  }, []);

  // ? Alerts for the user
  const notifyError = (msg) => toast.error(msg);
  const notifySuccess = (msg) => toast.success(msg);

  const handelTryAgainClick = () => {
    // console.log("phoneInCookie", typeof phoneInCookie);
    window.location.reload();
    cookie.save("voosh-page-refresh", true, { path: "/" });
  };

  const savePhoneNumber = async (phoneNumber) => {
    if (phoneNumber.length < 10) {
      return;
    }
    if (
      phoneNumber === "1234554321" ||
      phoneNumber === "1234567890" ||
      phoneNumber === "1231231239"
    ) {
      return;
    }

    const { data: response } = await axios.post(`/user/save-only-number`, {
      phoneNumber,
    });
    console.log(response, "response on save phone number");
  };

  const configureRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "sign-in-button",
      {
        size: "invisible",
        callback: (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          // onSubmitPhone();
          console.log("Recaptcha success");
        },
        defaultCountry: "IN",
      },
      auth
    );
  };

  const onSubmitPhone = (data) => {
    // setShowPage(1);
    // return;
    // if (data["phone-number"].length === 0 && phoneInCookie.length === 10) {
    //   data["phone-number"] = phoneInCookie;
    // }

    const phoneNumber = data["phone-number"];
    console.log(phoneNumber, "phoneNumber");
    if (phoneNumber.length < 10) {
      console.log(phoneNumber, data);
      notifyError("Please enter a valid phone number");
      return;
    }
    if (phoneNumber.length === 0 && phoneInCookie.length === 0) {
      console.log(phoneNumber, data);
      notifyError("Please enter a valid phone number");
      return;
    }

    if (phoneNumber.length > 10) {
      notifyError("Please enter a valid phone number");
      return;
    }

    // ! testing purpose
    if (
      data["phone-number"] === "9448467130" ||
      data["phone-number"] === "1234554321" ||
      data["phone-number"] === "1234567890" ||
      data["phone-number"] === "1231231239"
    ) {
      cookie.save(VOOSH_APP_PHONE, data["phone-number"], { path: "/" });
      setPhoneInCookie(data["phone-number"]);
      setShowPage(1);
      setTimeLeft(10);
      return;
    }

    console.log(data);
    configureRecaptcha();
    const phone = "+91" + data["phone-number"];
    console.log("phone:", phone);
    setIsLoading(true);

    const appVerifier = window.recaptchaVerifier;

    // Todo saving phone number in db
    savePhoneNumber(data["phone-number"]);

    signInWithPhoneNumber(auth, phone, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        console.log("otp sent");

        notifySuccess("OTP sent");
        setShowPage(1);
        setIsLoading(false);
        setPhoneInCookie(data["phone-number"]);
        setTimeLeft(100);

        // Todo Remove this
        ReactPixel.track("Get OTP", {
          value: "OTP Sent",
        });
        ReactGA.event({
          category: "Button Clicked",
          action: "Get OTP",
          label: "Request for OTP",
        });

        cookie.save(VOOSH_APP_PHONE, data["phone-number"], { path: "/" });
      })
      .catch((error) => {
        console.log(error);
        console.log(typeof error);
        setIsLoading(false);
        if (
          `${error}`.indexOf(
            "reCAPTCHA has already been rendered in this element"
          ) !== -1
        ) {
          window.location.reload();
          notifyError("Please reload the page");
        }
        if (`${error}`.indexOf("auth/too-many-requests") !== -1) {
          notifyError("Please wait for a while and try again after 15mins");
          ReactPixel.track("OTP Fail", {
            value: "OTP Fail, due to too many requests",
          });
          ReactGA.event({
            category: "OTP Request Fail",
            action: "OTP Fail",
            label: "OTP Fail, due to too many requests",
          });
        }
        if (`${error}`.indexOf("auth/invalid-phone-number") !== -1) {
          notifyError("Please enter a valid phone number");
          ReactGA.event({
            category: "OTP Request Fail, invalid-phone-number",
            action: "OTP Fail",
            label: "OTP Fail, invalid-phone-number",
          });
        }

        // notifyError("OTP not sent, Please refresh the page and try again!");
      });
  };
  const onSubmitOTP = async (data) => {
    // return;
    // ! testing purpose CFH DATA
    if (
      otp === "123456" &&
      (data["phone-number"] === "1234554321" ||
        data["phone-number"] === "1234567890" ||
        data["phone-number"] === "1231231239")
    ) {
      try {
        const { data: response } = await axios.post("/login-voosh", {
          phoneNumber: data["phone-number"],
        });
        console.log("response:", response);
        if (response.status === "success") {
          if (response.isAuth) {
            // ?set token
            cookie.save(APP_TOKEN, response.token, { path: "/" });
            cookie.remove(VOOSH_APP_PHONE);
            dispatch(loginSuccess(response.token));
            const restaurant = response.restaurantDetails;
            // listing_id: "P0081"
            // restaurant_name: "Chettinad Food House"
            // swiggy_res_id: 256302
            // zomato_res_id: 56834
            dispatch(
              setListingIdWithRestaurantDetails({
                listingID: restaurant.listing_id,
                swiggy_res_id: restaurant.swiggy_res_id,
                zomato_res_id: restaurant.zomato_res_id,
                restaurant_name: restaurant.restaurant_name,
              })
            );
            navigate("/dashboard");
          }

          if (response.isAuthTemp) {
            cookie.remove(VOOSH_APP_PHONE);
            cookie.save(TEMP_APP_TOKEN, response.token, { path: "/" });
            dispatch(tempLoginSuccess(response.token));
            navigate("/onboarding-dashboard");
          }
        } else {
          console.log("loginFailure", response.error);
          dispatch(loginFailure());
          dispatch(loginFailure());
          cookie.remove(APP_TOKEN);
          cookie.remove(TEMP_APP_TOKEN);
        }
      } catch (e) {
        // !Db error, or Network error etc
        console.log(e);
      }

      return;
    }

    console.log(data);
    console.log(otp);
    if (`${otp}`.length === 0) {
      setOtpError(true);
      setOtpErrorMessage("Please enter your OTP");
      ReactPixel.trackCustom("OTP Error", {
        value: "Otp Field Empty",
      });
      ReactGA.event({
        category: "OTP Error",
        action: "Otp Field Empty",
        label: "Otp Field Empty",
      });
    }
    //? if otp is not equal to otp
    else if (`${otp}`.length < 6) {
      ReactPixel.trackCustom("OTP Error", {
        value: "Otp not valid",
      });
      ReactGA.event({
        category: "OTP Error",
        action: "Otp not valid",
        label: "Otp not valid",
      });

      setOtpError(true);
      setOtpErrorMessage("Please enter a valid OTP");
    }
    // ! if every thing are ok, magic will happen :)
    else {
      setIsLoading(true);
      window.confirmationResult
        .confirm(`${otp}`)
        .then(async (result) => {
          console.log("otp verified");
          console.log(result, "result");
          setOtpError(false);
          setOtpErrorMessage("");
          // Todo register user number
          // ?temp use while testing
          try {
            // *send user number to backend
            const { data: response } = await axios.post("/login-voosh", {
              phoneNumber: data["phone-number"],
            });
            console.log("response:", response);
            if (response.status === "success") {
              console.log(response);

              // Todo: test
              ReactPixel.track("OTP Verified", {
                value: "OTP Verified",
              });

              ReactGA.event({
                category: "OTP Verified",
                action: "OTP Verified",
                label: "OTP Verified",
              });

              // ! NvDP User
              if (response.isAuth) {
                cookie.save(APP_TOKEN, response.token, { path: "/" });
                dispatch(loginSuccess(response.token));
                const restaurant = response.restaurantDetails;
                dispatch(
                  setListingIdWithRestaurantDetails({
                    ...restaurant,
                    listingID: restaurant.listing_id,
                  })
                );
                navigate("/dashboard");
              }
              // ! Non NvDP User
              else {
                if (response.isAuthTemp) {
                  cookie.save(TEMP_APP_TOKEN, response.token, { path: "/" });
                  dispatch(tempLoginSuccess(response.token));
                  navigate("/onboarding-dashboard");
                }
                // ? error while fetching data
                else {
                  console.log("loginFailure: error while fetching data");
                  dispatch(loginFailure());
                  cookie.remove(APP_TOKEN);
                  cookie.remove(TEMP_APP_TOKEN);
                }
              }
            } else {
              console.log("loginFailure", response.error);
              dispatch(loginFailure());
              cookie.remove(APP_TOKEN);
              cookie.remove(TEMP_APP_TOKEN);
            }
          } catch (e) {
            // !Db error, or Network error etc
            console.log(e);
            setIsLoading(false);
          }

          setIsLoading(false);
        })
        .catch((error) => {
          // Todo: test
          ReactPixel.trackCustom("OTP Error", {
            value: "Otp not valid",
            eventValue: "OTP Error",
          });

          ReactGA.event({
            category: "OTP Error",
            action: "Otp not valid",
            label: "Otp not valid",
          });

          console.log("otp not verified", error);
          setOtpError(true);
          setOtpErrorMessage("Otp didn't match");
          setIsLoading(false);
        });
    }
  };

  return (
    <div>
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

      {/*// ! Page One */}
      <>
        <div
          className="s-a-bg"
          style={{ display: `${showPage === 0 && !isLoading ? "" : "none"}` }}
        >
          <div className="all-svg" style={{ paddingTop: "3rem" }}>
            <div className="svg-1 svg">
              <img src={circleSvg} alt="svg1" />
            </div>
            <div className="svg-5 svg">
              <img src={circleSvg} alt="svg1" />
            </div>
            <div className="svg-2 svg">
              <img src={triangleSvg} alt="svg2" />
            </div>
            <div className="svg-3 svg">
              <img src={hollowSvg} alt="svg3" />
            </div>
            <div className="svg-4 svg">
              <img src={hollowSvg} alt="svg4" />
            </div>
          </div>
          <div className="s-a-logo">
            <img src={logo_img} alt="logo" className="onboard-logo--image" />
          </div>
          <div className="s-a-heading">
            <div className="text">
              Your One stop shop to grow your sales on Swiggy and Zomato
            </div>
          </div>
          {/* //? number feild */}
          <form className="s-a-form" onSubmit={handleSubmit(onSubmitPhone)}>
            <div className="s-a-form__input-feilds">
              {/* //! Phone Number */}
              <input
                className="in-number"
                defaultValue={"+91"}
                disabled={true}
              />

              {/* //Todo: Temp */}
              <div id="sign-in-button"></div>
              <input
                className="form-input"
                type="tel"
                name="phone-number"
                // defaultValue={phoneInCookie}
                // autoComplete="one-time-code"
                // inputmode="numeric"
                placeholder="Phone Number"
                {...register("phone-number", {
                  // required: true,
                  // maxLength: 10,
                  // minLength: 10,
                })}
              />
            </div>
            {/* <div className="s-a-form__error-msg">
        {errors["phone-number"] && (
          <p className="error red">Enter your 10 digit mobile number</p>
        )}
      </div> */}
            <div className="s-a-form__btn">
              {/* //Todo: id="sign-in-button" */}
              <button className="btn btn-verify">Join Now</button>
            </div>
          </form>
          {/* //? video */}
          <div className="s-a-video-container">
            <div className="video-preview s-a-video">
              <ReactPlayer
                className="single-video"
                url={"https://www.youtube.com/watch?v=QZs2SpNzeD4"}
                controls
                playbackRate={1}
                width="100%"
                height="220px"
                muted={true}
                playing={true}
              />
            </div>
          </div>
          {/* //? percentage */}
          <div className="s-a-percentages">
            <div className="s-a-percentages__item">
              <div className="s-a-percentages__item--number">30%</div>
              <div className="s-a-percentages__item--text">
                more
                {/* <br /> */}
                more orders
              </div>
            </div>
            <div className="s-a-percentages__item">
              <div className="s-a-percentages__item--number">5000+</div>
              <div className="s-a-percentages__item--text">
              restaurants 
              </div>
            </div>
            <div className="s-a-percentages__item">
              <div className="s-a-percentages__item--number">50%</div>
              <div className="s-a-percentages__item--text">
                Saving time
              </div>
            </div>
          </div>
          {/* //?offer */}
          <div className="s-a-offers">
            <div className="s-a-offers__heading">
              <span className="s-a-offers__heading--left-line"></span>
              <span className="s-a-offers__heading--text">
                What Voosh Offers
              </span>
              <span className="s-a-offers__heading--right-line"></span>
            </div>
            {/* //* item 1*/}
            <div className="s-a-offers__item">
              <div className="s-a-offers__item--icon">
                <AiOutlineBars size={20} />
              </div>
              <div className="s-a-offers__item--text">
                <div className="title">Menu Analytics</div>
                <div className="sub-title">
                  Daily analysis of your menu’s efficiency
                </div>
              </div>
            </div>
            {/* //* item 2*/}
            <div className="s-a-offers__item">
              <div className="s-a-offers__item--icon">
                <BsBarChartLine size={20} />
              </div>
              <div className="s-a-offers__item--text">
                <div className="title">Competition analysis</div>
                <div className="sub-title">
                  How to position your business strongly
                </div>
              </div>
            </div>
            {/* //* item 3*/}
            <div className="s-a-offers__item">
              <div className="s-a-offers__item--icon">
                <BsClipboard size={20} />
              </div>
              <div className="s-a-offers__item--text">
                <div className="title">Item wise review analysis</div>
                <div className="sub-title">
                  All your problems solved on a single dashboard
                </div>
              </div>
            </div>
            {/* //* item 4*/}
            <div className="s-a-offers__item">
              <div className="s-a-offers__item--icon">
                <AiOutlineFundProjectionScreen size={20} />
              </div>
              <div className="s-a-offers__item--text">
                <div className="title">Get targeted solutions</div>
                <div className="sub-title">Appropriate market positioning</div>
              </div>
            </div>
          </div>

          {/* //! Review Cards */}
          <div
            className="s-a-customer-reviews"
            // Todo: temp use
            // style={{ paddingBottom: "6rem", marginBottom: "0rem" }}
          >
            {/* <span className="quote-left">
              <RiDoubleQuotesL size={180} />
            </span> */}
            <h1 className="s-a-customer-reviews__title">
              Our customers love us
            </h1>
            <div className="s-a-customer-reviews__all-reviews">
              {PersonArray.map((person, index) => {
                const { image, review, name, restaurantName } = person;
                return (
                  <div className="single-review-card" key={index}>
                    <div className="head">
                      <div className="image">
                        <img src={image} alt="user" />
                      </div>
                      <span className="quote">
                        <RiDoubleQuotesR size={30} />
                      </span>
                    </div>
                    <div className="body">
                      <div className="review">
                        {review.length > 85
                          ? review.slice(0, 85) + "..."
                          : review}
                      </div>

                      <div className="user-name">
                        -{name}
                        <br />
                        {`(${restaurantName})`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="s-a-customer-reviews__btn">
              <div
                className="btn"
                onClick={() => {
                  console.log("clicked");
                  window.scrollTo(0, 0);
                }}
              >
                Join Now
              </div>
            </div>
          </div>
          <div className="s-a-footer">
            <div className="logo">
              <img src={logo_img} alt="footer logo" />
            </div>
            <div className="text">products@voosh.in</div>
          </div>
        </div>
      </>

      {isLoading && <Loading />}
      {/* //! Page Two */}
      <>
        <div
          className="s2"
          style={{ display: `${showPage === 1 ? "" : "none"}` }}
        >
          <div
            className="previous-page"
            onClick={() => {
              // Todo: go to previous page
              window.location.reload();
              // setShowPage(0);

              // setOtpError("");
            }}
          >
            <GrFormPreviousLink size={30} />
          </div>
          <form className="s2-form" onSubmit={handleSubmit(onSubmitOTP)}>
            <div className="s2-form__title">
              <div className="s2-form__title--text">Enter 6 digit OTP</div>
              <div className="s2-form__title--sub-text">
                otp send to your mobile number
              </div>
            </div>
            <div className="s2-form__otp-input">
              <OTPInput
                value={otp}
                onChange={setOtp}
                autoFocus={true}
                OTPLength={6}
                otpType="number"
                disabled={false}
                // secure
                required
                className="react-otp-input"
                inputStyles={{
                  width: "2.2rem",
                  height: "2.2rem",
                  fontSize: "1.3rem",
                  marginRight: "12px",
                  borderRadius: 4,
                  border: "1px solid rgba(0,0,0,0.3)",
                }}
              />
              {/* <ResendOTP onResendClick={() => console.log("Resend clicked")} /> */}
              {/* //! Otp Error msg if mis match  */}
              <div className="s2-form__error-msg">
                <p className="error red">
                  {otpError && <>{otpErrorMessage}</>}
                </p>
              </div>
              <div className="btn-try-again">
                {timeLeft === 0 && (
                  <div className="try-aging">
                    did'nt receive otp?
                    <span onClick={() => handelTryAgainClick()}>Try Again</span>
                  </div>
                )}
                <div className="timer">
                  {timeLeft > 0 ? (
                    <span>{`Try again in ${timeLeft} sec`}</span>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="s-form__btn">
              <button className="btn btn-verify">Verify</button>
            </div>
          </form>
        </div>
      </>
    </div>
  );
};

export default NewSignupA;
