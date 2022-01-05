import React from "react";
import axios from "axios";
import logo_img from "../../styles/images/logo-img.png";
import { useNavigate } from "react-router-dom";
import { useForm, ErrorMessage } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignupA = () => {
  const navigate = useNavigate();
  const [stepNumber, setStepNumber] = React.useState(0);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue,
    getData,
  } = useForm();
  const notify = (msg) => toast.error(msg);

  //   ?On sumiting the form
  const onSubmitFormOne = async (data) => {
    setStepNumber(1);
    if (data.checkbox_1 === true) {
      setValue("Swiggy Number", data["Phone Number"], { shouldValidate: true });
    }
    if (data.checkbox_2 === true) {
      setValue("Zomato Number", data["Phone Number"], { shouldValidate: true });
    }
  };
  const onSubmitFormTwo = async (data) => {
    setStepNumber(2);
  };
  const onSubmitFormThree = async (data) => {
    // console.log(data);

    try {
      const { data: response } = await axios.post("/signup", {
        name: data["Your Name"],
        phone: data["Phone Number"],
        email: data["Email"],
        restaurant_name: data["Restaurant Name"],
        swiggy_register_phone: data["Swiggy Number"],
        swiggy_password: data["Swiggy Password"],
        zomato_register_phone: data["Zomato Number"],
      });
      console.log("Signup Success, response:", response);
      if (response.status === "success") {
        // navigate("/greeting");
        // ! show popup that u signed up successfully
        // ! apk btn to download
      }else{
        setStepNumber(0);
        reset();
        notify(response.message);
      }

    } catch (error) {
      console.log(error);
      setStepNumber(0);
      reset();
      notify("Something went wrong, please try again later");
    }
  };

  return (
    <>
      <div className="container">
        <div className="signup_a-container">
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
          <div className="signup-header">
            <img
              src={logo_img}
              alt="logo"
              className="signup_a-header__logo"
              onClick={() => navigate("/")}
            />
          </div>

          {stepNumber === 0 && (
            <>
              <div className="signup_a-header__heading">
                Register with Voosh
              </div>
              <div className="signup_a-header__sub-heading--small">
                Grow your online business like never before. <br />
                inside secrets of Online delivery
                <div className="signup_a-header--login_btn">
                  <span className="login--heading">
                    Already have an account?
                  </span>
                  <span className="login--link" onClick={() => navigate("/")}>
                    Log in
                  </span>
                </div>
              </div>
              <form
                className="signup_a__form"
                onSubmit={handleSubmit(onSubmitFormOne)}
              >
                <div className="form-heading">{"Step 1/3: Basic Details"}</div>
                <div className="form-group">
                  {/* //! Name*/}
                  <input
                    className="form--input"
                    type="text"
                    placeholder="Your Name"
                    {...register("Your Name", { required: true, minLength: 3 })}
                  />
                  {errors["Your Name"] && (
                    <p className="form_error red">
                      Name should be atleast 3 characters long
                    </p>
                  )}

                  {/* //! Phone Num */}
                  <input
                    className="form--input"
                    type="tel"
                    placeholder="Phone Number"
                    {...register("Phone Number", {
                      required: true,
                      maxLength: 10,
                      minLength: 10,
                    })}
                  />
                  {errors["Phone Number"] && (
                    <p className="form_error red">
                      Enter your 10 digit mobile number
                    </p>
                  )}

                  <div className="same_as_btn">
                    <span className="text">Same For:</span>
                    <span
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <input
                        className="form--input_checkbox"
                        {...register("checkbox_1")}
                        type="checkbox"
                        defaultChecked={true}
                        // onClick={(e) => {

                        // }}
                      />
                      <span className="patner-name"> Swiggy</span>
                    </span>
                    <span
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <input
                        className="form--input_checkbox"
                        {...register("checkbox_2")}
                        type="checkbox"
                        defaultChecked={true}
                      />
                      <span className="patner-name"> Zomato</span>
                    </span>
                  </div>
                </div>
                <div className="form-group">
                  {/* //! Email */}
                  <input
                    className="form--input"
                    type="email"
                    // required
                    placeholder="Email"
                    form--btn
                    {...register("Email", {
                      required: "Email is required",
                      pattern: {
                        value:
                          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                        message: "Please enter a valid email",
                      },
                    })}
                  />
                  {errors["Email"] && (
                    <p className="form_error red">
                      Provide a valid email address
                    </p>
                  )}

                  {/*//! Restaurant Name */}
                  <input
                    className="form--input"
                    type="text"
                    placeholder="Restaurant Name"
                    {...register("Restaurant Name", {
                      required: true,
                      minLength: 1,
                    })}
                  />
                  {errors["Restaurant Name"] && (
                    <p className="form_error red">
                      Name should be atleast 1 characters long
                    </p>
                  )}
                </div>

                {/* //! 0-next(if all thing are filled) , 1(same as 0) , 
            //! 2(here will show the signup) */}
                <div className="form--btn_container jc--end">
                  {/* <button className="form--btn screen-btn">
                <span>Sign Up</span>
              </button> */}
                  <button className="btn-continue">
                    <span> Continue </span>
                  </button>
                </div>
              </form>
            </>
          )}
          {stepNumber === 1 && (
            <>
              <div className="signup_a-header__heading">Learn with Voosh</div>
              <div className="signup_a-header__sub-heading--small">
                Educate Yourself and improve your online business
                <div className="signup_a-header--login_btn">
                  <span className="login--heading">
                    Already have an account?
                  </span>
                  <span className="login--link" onClick={() => navigate("/")}>
                    Log in
                  </span>
                </div>
              </div>
              <form
                className="signup_a__form"
                onSubmit={handleSubmit(onSubmitFormTwo)}
              >
                <div className="form-heading">{"Step 2/3: Swiggy"}</div>
                <div className="form-group">
                  {/* //!Swiggy Rest. Phone */}

                  <input
                    className="form--input"
                    type="tel"
                    name="Swiggy Number"
                    placeholder="Swiggy Number"
                    {...register("Swiggy Number", {
                      required: true,
                      maxLength: 10,
                      minLength: 10,
                    })}
                  />
                  {errors["Swiggy Number"] && (
                    <p className="form_error red">
                      Provide a valid number, your Swiggy Registered Phone
                      Number
                    </p>
                  )}
                  {/* //!Swiggy Password */}

                  <input
                    className="form--input"
                    type="password"
                    placeholder="Swiggy Password"
                    {...register("Swiggy Password", {
                      required: true,
                      minLength: 3,
                    })}
                  />
                  {errors["Swiggy Password"] && (
                    <p className="form_error red">
                      Your Swiggy password should be atleast 3 characters long
                    </p>
                  )}
                </div>

                {/* //! 0-next(if all thing are filled) , 1(same as 0) , 
            //! 2(here will show the signup) */}
                <div className="form--btn_container jc--sb">
                  <button
                    className="btn-previous"
                    onClick={() => setStepNumber(0)}
                  >
                    <span> Go Back </span>
                  </button>
                  <button className="btn-continue">
                    <span> Continue </span>
                  </button>
                </div>
              </form>
            </>
          )}
          {stepNumber === 2 && (
            <>
              <div className="signup_a-header__heading">Grow with Voosh</div>
              <div className="signup_a-header__sub-heading--small">
                Personalized suggestions to make right tweaks for growth
                <div className="signup_a-header--login_btn">
                  <span className="login--heading">
                    Already have an account?
                  </span>
                  <span className="login--link" onClick={() => navigate("/")}>
                    Log in
                  </span>
                </div>
              </div>
              <form
                className="signup_a__form"
                onSubmit={handleSubmit(onSubmitFormThree)}
              >
                <div className="form-heading">{"Step 3/3: Zomato"}</div>
                <div className="form-group">
                  {/* //!Swiggy Rest. Phone */}
                  <input
                    className="form--input"
                    type="tel"
                    name="Zomato Number"
                    placeholder="Zomato Number"
                    {...register("Zomato Number", {
                      required: true,
                      maxLength: 10,
                      minLength: 10,
                    })}
                  />
                  {errors["Zomato Number"] && (
                    <p className="form_error red">
                      Provide a valid number, your Swiggy Registered Phone
                      Number
                    </p>
                  )}
                </div>

                {/* //! 0-next(if all thing are filled) , 1(same as 0) , 
           //! 2(here will show the signup) */}
                <div className="form--btn_container jc--sb">
                  <button
                    className="btn-previous"
                    onClick={() => setStepNumber(1)}
                  >
                    <span> Go Back </span>
                  </button>

                  <button className="btn-signup">
                    <span>Submit</span>
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SignupA;
