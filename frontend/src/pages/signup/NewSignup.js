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
import "react-toastify/dist/ReactToastify.css";
const APP_TOKEN = "voosh-token";
const TEMP_APP_TOKEN = "temp-voosh-token";
const VOOSH_APP_PHONE = "voosh-phone";

const NewSignup = () => {
  const auth = getAuth();
  const [showPage, setShowPage] = React.useState(0);
  const [otp, setOtp] = React.useState("");
  const [otpError, setOtpError] = React.useState(false);
  const [otpErrorMessage, setOtpErrorMessage] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [phoneInCookie, setPhoneInCookie] = React.useState("");
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
    console.log(cookie.load(VOOSH_APP_PHONE));
    setShowPage(0);
    setOtp("");
    setOtpError(false);
    setOtpErrorMessage("");
    setIsLoading(false);
    setPhoneInCookie(
      cookie.load(VOOSH_APP_PHONE) ? cookie.load(VOOSH_APP_PHONE) : ""
    );
  }, []);

  // ? Alerts for the user
  const notifyError = (msg) => toast.error(msg);
  const notifySuccess = (msg) => toast.success(msg);

  const configureRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "sign-in-button",
      {
        size: "invisible",
        callback: (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          onSubmitPhone();
          console.log("Recaptcha success");
        },
        defaultCountry: "IN",
      },
      auth
    );
  };

  const onSubmitPhone = (data) => {
    // setShowPage(1);
    // return

    const phoneNumber = data["phone-number"];
    if (phoneNumber.length < 10) {
      notifyError("Please enter a valid phone number");
      return;
    }

    // ! testing purpose
    if (
      data["phone-number"] === "9448467130" ||
      data["phone-number"] === "1234554321" ||
      data["phone-number"] === "1234567890" ||
      data["phone-number"] === "0123401234"
    ) {
      cookie.save(VOOSH_APP_PHONE, data["phone-number"], { path: "/" });
      setShowPage(1);
      return;
    }

    console.log(data);
    configureRecaptcha();
    const phone = "+91" + data["phone-number"];
    console.log("phone:", phone);
    setIsLoading(true);

    const appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, phone, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        console.log("otp sent");
        setShowPage(1);
        setIsLoading(false);
        notifySuccess("OTP sent");
        // Todo Remove this
        ReactPixel.track("Get OTP", {
          eventName: "OTP Sent",
          eventValue: "OTP Sent",
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
            eventName: "OTP Sent",
            eventValue: "OTP Sent",
          });
        }

        // notifyError("OTP not sent, Please refresh the page and try again!");
      });
  };
  const onSubmitOTP = async (data) => {
    // return;
    // ! testing purpose CFH DATA
    if (otp === "123456") {
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
        value: "Otp Feild Empty",
        eventValue: "OTP Error",
      });
    } else if (`${otp}`.length < 6) {
      ReactPixel.trackCustom("OTP Error", {
        value: "Otp not valid",
        eventValue: "OTP Error",
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
          // ?temp usewhile testing
          try {
            // *send user number to backend
            const { data: response } = await axios.post("/login-voosh", {
              phoneNumber: data["phone-number"],
            });
            console.log("response:", response);
            if (response.status === "success") {
              console.log(response);

              // Todo: test
              ReactPixel.trackCustom("OTP Verified", {
                value: "OTP Verified",
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
                // ? error while recivind data
                else {
                  console.log("loginFailure: error while recivinG data");
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
      {/* {showPage === 0 && <PageOne displayComponent={showPage === 0} />} */}
      {/* <PageOne displayComponent={showPage === 0} /> */}
      {/*// ! Page One */}
      <>
        <div
          className="s-bg"
          style={{ display: `${showPage === 0 && !isLoading ? "" : "none"}` }}
        >
          <div className="s-logo">
            <img src={logo_img} alt="logo" className="onboard-logo--image" />
          </div>
          <form className="s-form" onSubmit={handleSubmit(onSubmitPhone)}>
            <div className="s-form__grey-top"></div>
            <div className="s-form__title">
              <div className="s-form__title--text">Get Started</div>
              <div className="s-form__title--sub-text">
                Enter your phone number
              </div>
            </div>
            <div className="s-form__input-feilds">
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
                defaultValue={phoneInCookie}
                placeholder="Phone Number"
                {...register("phone-number", {
                  required: true,
                  maxLength: 10,
                  // minLength: 10,
                })}
              />
            </div>
            {/* <div className="s-form__error-msg">
              {errors["phone-number"] && (
                <p className="error red">Enter your 10 digit mobile number</p>
              )}
            </div> */}
            <div className="s-form__btn">
              {/* //Todo: id="sign-in-button" */}
              <button className="btn btn-verify">GET OTP</button>
            </div>
          </form>
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
              {/* //! Otp Error msg if mis match  */}
              <div className="s2-form__error-msg">
                <p className="error red">
                  {otpError && <>{otpErrorMessage}</>}
                </p>
              </div>
              <div className="btn-try-again">
                didnt receive otp? <span>Try Again</span>
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

export default NewSignup;
