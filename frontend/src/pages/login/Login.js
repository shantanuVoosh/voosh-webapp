import React from "react";
import { GoogleLogin } from "react-google-login";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import logo_img from "../../styles/images/logo-img.png";
import { useDispatch } from "react-redux";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactPlayer from "react-player";
import MetaTags from "react-meta-tags";
import ReactGA from "react-ga4";
import {
  loginFailure,
  loginSuccess,
} from "../../redux/Auth/actions/authAction";
import cookie from "react-cookies";

// TODO: remove the hardcoded values
const APP_TOKEN = "voosh-token";
const clientId =
  "780953688776-s0jujjc4hmro0jth97edb3o82qis73eq.apps.googleusercontent.com";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onLoginSuccessByGoogle = async (res) => {
    // try {
    //   const { tokenId: token } = res;
    //   const { data: response } = await axios.post("/login", {
    //     token,
    //   });
    //   if (response.isAuth === true) {
    //     console.log("Login Success, response:", response);
    //     dispatch(loginSuccess(token));
    //     cookie.save(APP_TOKEN, token, { path: "/" });
    //     navigate("/dashboard");
    //   } else {
    //     console.log("Login Failure, response:", response);
    //   }
    // } catch (err) {
    //   console.log("Login Error:", err);
    //   dispatch(loginFailure({ error: err }));
    // }
  };

  const onLoginFailureByGoogle = (res) => {
    // dispatch(loginFailure(res));
    // navigate("/");
    // console.log("Login Failed:", res);
  };

  //? Work on Form Submition
  const handleLoginByPhoneNumber = async (data) => {
    console.log("On Login Submit!");
    console.log(data);
    try {
      const { data: response } = await axios.post("/login", {
        phoneNumber: data["Mobile number"],
        password: data["Password"],
      });
      console.log("voosh data", response);
      if (response.status === "success") {
        // * if success,set token to cookie
        cookie.save(APP_TOKEN, response.token, { path: "/" });
        dispatch(loginSuccess(response.token));
        navigate("/dashboard");
        ReactGA.event({
          category: "Login Success",
          action: "Clicked on Login",
          label: "Login",
        });
      } else {
        console.log("Failure response:", response.error);
        notify(response.error);
        dispatch(loginFailure());
        cookie.remove(APP_TOKEN);
        navigate("/");
        ReactGA.event({
          category: "Login failed",
          action: "Clicked on Login",
          label: "Login",
        });
      }
    } catch (err) {
      // !if request failed
      dispatch(loginFailure({ error: err }));
      console.log("Login Failed:", err);
      navigate("/");
      ReactGA.event({
        category: "Login failed",
        action: "Clicked on Login",
        label: "due to server error",
      });
    }
  };

  const redirectToSignUp = () => {
    ReactGA.event({
      category: "Go To Sign Up",
      action: "Clicked on Sign Up",
      label: "Sign Up",
    });
    navigate("/signup");
  };

  const notify = (msg) => toast.error(msg);

  return (
    <>
      <div className="container">
        <div className="login-container">
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
          {/* Same as */}
          <ToastContainer />
          <div className="login-header">
            <img src={logo_img} alt="logo" className="login-header__logo" />
            <div className="login-header__heading">Welcome!</div>
            <div className="login-header__sub-heading--small">
              Learn about your competitors and improve your sales on Swiggy and
              Zomato
            </div>
          </div>
          {/* <div className="google-btn">
            <GoogleLogin
              clientId={clientId}
              buttonText="CONTINUE WITH GOOGLE"
              onSuccess={onLoginSuccessByGoogle}
              onFailure={onLoginFailureByGoogle}
              cookiePolicy={"single_host_origin"}
              isSignedIn={true}
            />
          </div> */}

          <div className="login__video">
            <ReactPlayer
              className="single-video"
              url={"https://www.youtube.com/watch?v=LlgUIHoiQyY"}
              controls
              muted={true}
              playing={true}
              playbackRate={1}
              width="100%"
              height="240px"
            />
          </div>

          <div className="login-header__heading">Log In</div>

          <form
            className="login__form"
            onSubmit={handleSubmit(handleLoginByPhoneNumber)}
          >
            <div className="form--heading">
              {/* Please enter your phone number which has payment mails from swiggy and
              zomato */}
              {/* Dont have Gmail? Enter Your Mail Id And Contact Support */}
              {/* Enter your registered phone number And password */}
            </div>
            {/* <input
              className="form--input"
              type="text"
              placeholder="Email"
              {...register("Email", { required: true, pattern: /^\S+@\S+$/i })}
            /> */}

            {errors["Mobile number"] && (
              <p className="form_error red">
                Number or Restaurant Id Not Correct
              </p>
            )}
            <input
              className="form--input"
              type="tel"
              placeholder="Mobile no. or Restaurant Id"
              {...register("Mobile number", { required: true, minLength: 3 })}
            />
            {errors["Password"] && (
              <p className="form_error red">Please enter your password</p>
            )}
            <input
              className="form--input"
              type="password"
              // autoComplete="on"
              placeholder="Password"
              {...register("Password", { required: true, minLength: 1 })}
            />

            <button className="form--btn screen-btn">
              <span>LogIn</span>
            </button>
            {/* <button className="form--btn screen-btn">
              <span>SignUp</span>
            </button> */}
          </form>
          <div className="sign-up">
            <span className="sign-up--heading">Don't have an account?</span>
            <span className="sign-up--link" onClick={redirectToSignUp}>
              Sign Up
            </span>
          </div>
          <div className="signup__bottom">
            <div className="signup__bottom--heading">
              {" "}
              Grow your sales & revenue on{" "}
              <span className="orange">Swiggy</span> &{" "}
              <span className="red">Zomato</span> with Voosh!
            </div>
            <div className="signup__bottom--list">
              <div className="list">
                - Learn Insider secrets of Online Food Business
              </div>
              <div className="list">- Understand your competition</div>
              <div className="list">
                - High-impact and personalized Recommendations for your online
                listing!
              </div>
            </div>
          </div>
        </div>

        {/* <div className="sign-up">
          <span className="sign-up--heading">or watch a video?</span>
          <span
            className="sign-up--link"
            onClick={() => navigate("/pre-signup")}
          >
            Video
          </span>
        </div> */}
      </div>
    </>
  );
};

export default Login;
