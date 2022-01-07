import React from "react";
import axios from "axios";
import logo_img from "../../styles/images/logo-img.png";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Loading from "../../components/Loading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignupB = () => {
  const navigate = useNavigate();
  const [stepNumber, setStepNumber] = React.useState(0);
  const [showApkButton, setShowApkButton] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue,
    // getData,
  } = useForm();
  const notify = (msg) => toast.error(msg);
  const notifySuccess = (msg) => toast.success(msg);

  React.useEffect(() => {
    setShowApkButton(false);
    setIsLoading(false);
    setStepNumber(0);
  }, []);

  // !On sumiting the 1st form
  // !store the Basic info in the database
  const onSubmitFormOne = async (data) => {
    setIsLoading(true);

    if (data.checkbox_1 === true) {
      setValue("Swiggy Number", data["Phone Number"], { shouldValidate: true });
    }
    if (data.checkbox_2 === true) {
      setValue("Zomato Number", data["Phone Number"], { shouldValidate: true });
    }

    try {
      const { data: response } = await axios.post("/user-save-details", {
        name: data["Your Name"],
        phone: data["Phone Number"],
        email: data["Email"],
        restaurant_name: data["Restaurant Name"],
      });

      if (response.status === "success") {
        setStepNumber(1);
        console.log(response.message);
      } else {
        notify(response.message);
      }

      setIsLoading(false);
    } catch (err) {
      notify(`Server Error, Please try again later`);
      setIsLoading(false);
    }
  };

  // !On sumiting the 2nd form
  // ! store the everything in the database
  const onSubmitFormTwo = async (data) => {
    // ? Some Possible errors
    if (
      `${data["Swiggy Number"]}`.length === 0 &&
      `${data["Zomato Number"]}`.length === 0
    ) {
      notify("Please enter atleast one phone number, either Swiggy or Zomato");
      return;
    } else if (
      `${data["Swiggy Number"]}`.length === 0 &&
      `${data["Swiggy Password"]}`.length !== 0
    ) {
      notify("Please enter Swiggy Number");
      return;
    } else if (
      `${data["Swiggy Number"]}`.length !== 0 &&
      `${data["Swiggy Password"]}`.length === 0
    ) {
      notify("Please enter swiggy password");
      return;
    } else if (
      `${data["Swiggy Number"]}`.length !== 0 &&
      `${data["Swiggy Password"]}`.length <= 3
    ) {
      notify("Please enter a real swiggy password");
      return;
    }

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
        setShowApkButton(true);
        reset({
          "Your Name": "",
          "Phone Number": "",
          Email: "",
          "Restaurant Name": "",
          "Swiggy Number": "",
          "Swiggy Password": "",
          "Zomato Number": "",
        });
        notifySuccess("Form Submitted Successfully!");
        console.log("Signup Success, response:", response.message);
      } else {
        // reset({
        //   "Your Name": "",
        //   "Phone Number": "",
        //   Email: "",
        //   "Restaurant Name": "",
        //   "Swiggy Number": "",
        //   "Swiggy Password": "",
        //   "Zomato Number": "",
        // });

        notify(response.message);
      }
    } catch (error) {
      console.log(error);
      setStepNumber(0);
      reset();
      notify("Something went wrong, please try again later");
    }
  };

  const onSuccessfullFormSubmit = () => {
    navigate("/greeting");
  };

  if (isLoading) {
    return <Loading />;
  }

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
          {/* //? Step 1 */}
          {stepNumber === 0 && (
            <>
              <div className="signup_a-header__heading">
                Register with Voosh
              </div>
              <div className="signup_a-header__sub-heading--small">
                Grow your online business like never before. <br />
                inside secrets of Online delivery
              </div>
              <form
                className="signup_a__form"
                onSubmit={handleSubmit(onSubmitFormOne)}
              >
                <div className="form-heading">{"Step 1/2: Basic Details"}</div>
                <div className="form-group">
                  {/* //! Name*/}
                  <input
                    className="form--input"
                    type="text"
                    placeholder="Your Name*"
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
                    placeholder="Phone Number*"
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
                    <span>
                      <input
                        defaultChecked={true}
                        className="form--input_checkbox"
                        {...register("checkbox_1")}
                        type="checkbox"
                        onClick={(e) => {
                          console.log(e);
                        }}
                      />
                      <span className="patner-name"> Swiggy</span>
                    </span>
                    <span>
                      <input
                        defaultChecked={true}
                        {...register("checkbox_2")}
                        type="checkbox"
                        onClick={(e) => {
                          console.log(e);
                        }}
                      />
                      <span className="patner-name"> Zomato</span>
                    </span>
                  </div>

                  {/* //! Email */}
                  <input
                    className="form--input"
                    type="email"
                    // required
                    placeholder="Email*"
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
                    placeholder="Restaurant Name*"
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
          {/* //? Step 2 */}
          {stepNumber === 1 && (
            <>
              <div className="signup_a-header__heading">Learn with Voosh</div>
              <div className="signup_a-header__sub-heading--small">
                Educate Yourself and improve your online business
              </div>
              <div className="signup_a-header--login-text">
                <span className="heading">Already have an account?</span>
                <span className="link" onClick={() => navigate("/")}>
                  Log in
                </span>
              </div>
              <form
                className="signup_a__form"
                onSubmit={handleSubmit(onSubmitFormTwo)}
              >
                <div className="form-heading">
                  {"Step 2/2: Partner Details"}
                </div>
                <div className="form-group">
                  {/* //!Swiggy Rest. Phone */}

                  <input
                    className="form--input"
                    type="tel"
                    name="Swiggy Number"
                    placeholder="Swiggy Number"
                    {...register("Swiggy Number", {
                      // ? if the user dont have swiggy reg phone number
                      // required: true,
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
                      // required: true,
                      // minLength: 3,
                    })}
                  />
                  {errors["Swiggy Password"] && (
                    <p className="form_error red">
                      Your Swiggy password should be atleast 3 characters long
                    </p>
                  )}
                </div>
                <div className="form-group">
                  {/* //!Swiggy Rest. Phone */}
                  <input
                    className="form--input"
                    type="tel"
                    name="Zomato Number"
                    placeholder="Zomato Number"
                    {...register("Zomato Number", {
                      // ? if the user dont have zomato reg phone number
                      // required: true,
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

                {/* 
                //! 0-next(if all thing are filled) , 1(same as 0) , 
                //! 2(here will show the signup) 
                */}
                <div className="form--btn_container jc--sb">
                  <button
                    disabled={showApkButton}
                    className="btn-previous"
                    onClick={() => setStepNumber(0)}
                  >
                    <span> {"Go Back"} </span>
                  </button>
                  <button
                    disabled={showApkButton}
                    className={`btn-continue ${
                      showApkButton ? "disabled" : ""
                    }`}
                  >
                    <span>{showApkButton ? "Submited!" : "Submit"} </span>
                  </button>
                </div>
              </form>
            </>
          )}
           {/* //? Only display in 3rd page + form is submmited! */}
          {stepNumber === 1 && (
            <div className={`apk ${showApkButton ? "show_apk-btn" : ""}`}>
              <a
                href="https://drive.google.com/file/d/1787w-RudEjIppa9h1GKa-3OYiENa2mW4/"
                target={"_blank"}
                onClick={onSuccessfullFormSubmit}
                rel="noreferrer"
              >
                Download APK
              </a>
            </div>
          )}
           {/* //? show on 1st page */}
          {stepNumber === 0 && (
            <div className="signup_a__login-btn">
              <span className="signup_a__login-btn--heading">
                Already have an account?
              </span>
              <span
                className="signup_a__login-btn--link"
                onClick={() => navigate("/")}
              >
                Log in
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SignupB;
