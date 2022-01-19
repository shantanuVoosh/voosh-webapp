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
import "react-toastify/dist/ReactToastify.css";

const NewSignup = () => {
  const auth = getAuth();
  const [showPage, setShowPage] = React.useState(0);
  const [otp, setOtp] = React.useState("");
  const [otpError, setOtpError] = React.useState(false);
  const [otpErrorMessage, setOtpErrorMessage] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue,
  } = useForm();

  React.useEffect(() => {
    setShowPage(0);
    setOtp("");
    setOtpError(false);
    setOtpErrorMessage("");
    setIsLoading(false);
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
    // return;

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
      })
      .catch((error) => {
        console.log("otp not sent", error);
        setIsLoading(false);
      });
  };
  const onSubmitOTP = async (data) => {
    // return;
    console.log(data);
    console.log(otp);
    if (`${otp}`.length === 0) {
      setOtpError(true);
      setOtpErrorMessage("Please enter your OTP");
    } else if (`${otp}`.length < 6) {
      setOtpError(true);
      setOtpErrorMessage("Please enter a valid OTP");
    }
    // ! if every thing is ok, magic happens :)
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
              console.log("user registered");
              console.log(response);
            }
          } catch (e) {
            // !Db error, or Network error etc
            console.log(e);
          }

          navigate("/test");
          setIsLoading(false);
        })
        .catch((error) => {
          console.log("otp not verified", error);
          setOtpError(true);
          setOtpErrorMessage("Otp didn't match");
          setIsLoading(false);
        });
    }
  };

  // *Grabs the Phone Number
  const PageOne = () => {
    return (
      <div
        className="s-bg"
        style={{ display: `${showPage === 0 ? "" : "none"}` }}
      >
        <div className="s-logo">
          <img src={logo_img} alt="logo" className="onboard-logo--image" />
        </div>
        <form className="s-form" onSubmit={handleSubmit(onSubmitPhone)}>
          <div className="s-form__title">
            <div className="s-form__title--text">Get Started</div>
            <div className="s-form__title--sub-text">
              Enter your phone number to get started
            </div>
          </div>
          <div className="s-form__input-feilds">
            {/* //! Phone Number */}
            <input className="in-number" defaultValue={"+91"} disabled={true} />

            {/* //Todo: Temp */}
            <div id="sign-in-button"></div>
            <input
              className="form-input"
              type="tel"
              name="phone-number"
              placeholder="Phone Number"
              {...register("phone-number", {
                required: true,
                maxLength: 10,
                minLength: 10,
              })}
            />
          </div>
          <div className="s-form__error-msg">
            {errors["phone-number"] && (
              <p className="error red">Enter your 10 digit mobile number</p>
            )}
          </div>
          <div className="s-form__btn">
            {/* //Todo: id="sign-in-button" */}
            <button className="btn btn-verify">Verify Number</button>
          </div>
        </form>
      </div>
    );
  };

  // *Grabs the OTP
  const PageTwo = () => {
    return (
      <div className="s-bg">
        <div className="s-logo">
          <img src={logo_img} alt="logo" className="onboard-logo--image" />
        </div>
        <form className="s-form" onSubmit={handleSubmit(onSubmitPhone)}>
          <div className="s-form__title">
            <div className="s-form__title--text">Get Started</div>
            <div className="s-form__title--sub-text">
              Enter your phone number to get started
            </div>
          </div>
          <div className="s-form__input-feilds">
            {/* //! Phone Number */}
            <input className="in-number" defaultValue={"+91"} disabled={true} />
            <input
              className="form-input"
              type="tel"
              name="phone-number"
              placeholder="Phone Number"
              {...register("phone-number", {
                required: true,
                maxLength: 10,
                minLength: 10,
              })}
            />
          </div>
          <div className="s-form__error-msg">
            {errors["phone-number"] && (
              <p className="error red">Enter your 10 digit mobile number</p>
            )}
          </div>
          <div className="s-form__input-feilds">
            {/* //! OTP */}
            <input
              className="form-input"
              type="tel"
              name="otp"
              placeholder="OTP"
              {...register("otp", {
                required: true,
                maxLength: 6,
                minLength: 6,
              })}
            />
          </div>
          <div className="s-form__error-msg"></div>
          <div className="s-form__btn">
            <button className="btn btn-verify">Verify Number</button>
          </div>
        </form>
      </div>
    );
  };

  // if (isLoading) {
  //   return <Loading />;
  // }

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
            <div className="s-form__title">
              <div className="s-form__title--text">Get Started</div>
              <div className="s-form__title--sub-text">
                Enter your phone number to get started
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
                placeholder="Phone Number"
                {...register("phone-number", {
                  required: true,
                  maxLength: 10,
                  minLength: 10,
                })}
              />
            </div>
            <div className="s-form__error-msg">
              {errors["phone-number"] && (
                <p className="error red">Enter your 10 digit mobile number</p>
              )}
            </div>
            <div className="s-form__btn">
              {/* //Todo: id="sign-in-button" */}
              <button className="btn btn-verify">Verify Number</button>
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
          <div className="previous-page" onClick={() => setShowPage(0)}>
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
                  width: "2.1rem",
                  height: "2.1rem",
                  fontSize: "1.3rem",
                  marginRight: "15px",
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
