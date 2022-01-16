import React from "react";
import axios from "axios";
import logo_img from "../../styles/images/logo-img.png";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Loading from "../../components/Loading";
import { ToastContainer, toast } from "react-toastify";
import ReactGA from "react-ga4";
import { Backdrop, Box, Modal, Fade, Button, Typography } from "@mui/material";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { VscChromeClose } from "react-icons/vsc";
import { ImQuotesLeft, ImQuotesRight } from "react-icons/im";
import { CgQuoteO, CgQuote } from "react-icons/cg";

import "react-toastify/dist/ReactToastify.css";

const Modelstyle = {
  position: "absolute",
  height: "400px",
  display: "block",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  overflow: "scroll",
};

const SignupA = () => {
  const navigate = useNavigate();
  const [stepNumber, setStepNumber] = React.useState(0);
  const [showApkButton, setShowApkButton] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [modelOpen, setModelOpen] = React.useState(false);
  const [tnc, setTnc] = React.useState(false);
  const tncRef = React.useRef(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue,
  } = useForm();
  const notify = (msg) => toast.error(msg);
  const notifySuccess = (msg) => toast.success(msg);
  const handelModelOpen = () => setModelOpen(true);
  const handelModelClose = () => setModelOpen(false);

  React.useEffect(() => {
    setShowApkButton(false);
    setIsLoading(false);
    setStepNumber(0);
  }, []);

  // !On sumiting the 1st form
  const onSubmitFormOne = async (data) => {
    console.log("data", data);
    console.log(tnc);

    ReactGA.event({
      category: "Continue Button Clicked",
      action: "Signup Step 1",
      label: "Step 1",
    });

    // ? we are changing the tnc(State) but form tnc check box is not working,
    // ? so we check both, if tnc is true then we proceed
    // ! Temporary Removed Terms and Conditions
    // if (data.tnc === false && tnc === false) {
    //   notify("Please accept the terms and conditions to continue");
    //   return;
    // }

    if (data.checkbox_1 === true) {
      setValue("Swiggy Number", data["Phone Number"]);
    }
    if (data.checkbox_2 === true) {
      setValue("Zomato Number", data["Phone Number"]);
    }
    setIsLoading(true);
    setStepNumber(1);

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
  const onSubmitFormTwo = async (data) => {
    ReactGA.event({
      category: "Continue Button Clicked",
      action: "Signup Step 2",
      label: "Step 2",
    });

    if (
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
    } else if (data["Swiggy Number"] !== "" && data["Swiggy Password"] !== "") {
      // ? check if the number is already registered
      try {
        // setIsLoading(true);
        const { data: response } = await axios.post("/check-swiggy-number", {
          swiggy_register_phone: data["Swiggy Number"],
        });
        if (response.status === "error") {
          ReactGA.event({
            category: "Number Check",
            action: "Wrong Swiggy Number Provided",
            label: "Wrong Swiggy Number",
          });
          // setIsLoading(false);
          notify(response.message);
          return;
        } else {
          // setIsLoading(false);
          // ? if the number is not registered then we proceed
          setStepNumber(2);
        }
      } catch (err) {
        // setIsLoading(false);
        console.log(err);
        notify("Server Error, Please try again later");
        return;
      }
    }
    // ? cuz skip button is clicked
    setStepNumber(2);
  };

  // !On sumiting the 3rd form
  const onSubmitFormThree = async (data) => {
    // ? if i use is loading then notify wont work

    console.log(data);
    ReactGA.event({
      category: "Button Click",
      action: "Signup Step 3",
      label: "Step 3",
    });

    if (
      `${data["Swiggy Number"]}`.length === 0 &&
      `${data["Zomato Number"]}`.length === 0
    ) {
      notify("Please enter atleast one phone number, either Swiggy or Zomato");
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
        console.log("Signup Success, response:", response.message);
        notifySuccess("Form Submitted Successfully!");
      } else {
        setStepNumber(1);
        console.log("Signup Failed, response:", response.message);
        notify(response.message);
      }
    } catch (error) {
      console.log(error);
      setStepNumber(0);
      reset();
      notify("Something went wrong, please try again later");
      // setIsLoading(false);
    }
  };

  const onSuccessfullFormSubmit = () => {
    ReactGA.event({
      category: "Button Click",
      action: "Download Apk Button Clicked",
      label: "Download button",
    });
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
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={modelOpen}
            onClose={handelModelClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Fade in={modelOpen}>
              <Box sx={Modelstyle}>
                <Typography
                  id="transition-modal-title"
                  variant="h6"
                  component="h2"
                >
                  Terms & Conditions
                </Typography>
                <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Distinctio aspernatur, ea nesciunt nostrum iure perferendis
                  blanditiis facilis corrupti, laborum, adipisci consectetur
                  quisquam magni corporis optio rerum maxime quae quibusdam
                  magnam. Lorem ipsum dolor sit amet consectetur, adipisicing
                  elit. Distinctio aspernatur, ea nesciunt nostrum iure
                  perferendis blanditiis facilis corrupti, laborum, adipisci
                  consectetur quisquam magni corporis optio rerum maxime quae
                  quibusdam Lorem ipsum dolor sit amet consectetur, adipisicing
                  elit. Distinctio aspernatur, ea nesciunt nostrum iure
                  perferendis blanditiis facilis corrupti, laborum, adipisci
                  consectetur quisquam magni corporis optio rerum maxime quae
                  quibusdam magnam. Lorem ipsum dolor sit amet consectetur,
                  adipisicing elit. Distinctio aspernatur, ea nesciunt nostrum
                  iure perferendis blanditiis facilis corrupti, laborum,
                  adipisci consectetur quisquam magni corporis optio rerum
                  maxime quae quibusdam Lorem ipsum dolor sit amet consectetur,
                  adipisicing elit. Distinctio aspernatur, ea nesciunt nostrum
                  iure perferendis blanditiis facilis corrupti, laborum,
                  adipisci consectetur quisquam magni corporis optio rerum
                  maxime quae quibusdam magnam. Lorem ipsum dolor sit amet
                  consectetur, adipisicing elit. Distinctio aspernatur, ea
                  nesciunt nostrum iure perferendis blanditiis facilis corrupti,
                  laborum, adipisci consectetur quisquam magni corporis optio
                  rerum maxime quae quibusdam Lorem ipsum dolor sit amet
                  consectetur, adipisicing elit. Distinctio aspernatur, ea
                  nesciunt nostrum iure perferendis blanditiis facilis corrupti,
                  laborum, adipisci consectetur quisquam magni corporis optio
                  rerum maxime quae quibusdam magnam. Lorem ipsum dolor sit amet
                  consectetur, adipisicing elit. Distinctio aspernatur, ea
                  nesciunt nostrum iure perferendis blanditiis facilis corrupti,
                  laborum, adipisci consectetur quisquam magni corporis optio
                  rerum maxime quae quibusdam Lorem ipsum dolor sit amet
                  consectetur, adipisicing elit. Distinctio aspernatur, ea
                  nesciunt nostrum iure perferendis blanditiis facilis corrupti,
                  laborum, adipisci consectetur quisquam magni corporis optio
                  rerum maxime quae quibusdam magnam. Lorem ipsum dolor sit amet
                  consectetur, adipisicing elit. Distinctio aspernatur, ea
                  nesciunt nostrum iure perferendis blanditiis facilis corrupti,
                  laborum, adipisci consectetur quisquam magni corporis optio
                  rerum maxime quae quibusdam Lorem ipsum dolor sit amet
                  consectetur, adipisicing elit. Distinctio aspernatur, ea
                  nesciunt nostrum iure perferendis blanditiis facilis corrupti,
                  laborum, adipisci consectetur quisquam magni corporis optio
                  rerum maxime quae quibusdam magnam. Lorem ipsum dolor sit amet
                  consectetur, adipisicing elit. Distinctio aspernatur, ea
                  nesciunt nostrum iure perferendis blanditiis facilis corrupti,
                  laborum, adipisci consectetur quisquam magni corporis optio
                  rerum maxime quae quibusdam magnam.
                </Typography>
                <div
                  className="model-checkbox"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <input
                    type="checkbox"
                    name="tnc-checkbox"
                    value={tnc}
                    checked={tnc}
                    ref={tncRef}
                    onChange={(e) => {
                      setTnc((prevState) => !prevState);
                    }}
                  />
                  <Button
                    onClick={() => {
                      setTnc((prevState) => !prevState);
                      handelModelClose();
                    }}
                  >
                    Accept And Continue
                  </Button>
                </div>
                <Button
                  onClick={() => {
                    console.log(tnc);
                    handelModelClose();
                    console.log(tnc);
                  }}
                >
                  Close
                </Button>
              </Box>
            </Fade>
          </Modal>

          <div className="signup_a-header">
            <img
              src={logo_img}
              alt="logo"
              className="signup_a-header__logo"
              onClick={() => navigate("/")}
            />
          </div>

          {/* //? Step 1 Page  */}
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
                <div className="form-heading">{"Step 1/3: Basic Details"}</div>

                <div className="form-group__container">
                  <div className="form-group">
                    {/* //! Name*/}
                    <input
                      className="form--input"
                      type="text"
                      placeholder="Your Name"
                      {...register("Your Name", {
                        required: true,
                        minLength: 3,
                      })}
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
                          onChange={(e) => {
                            console.log(e.target.checked);
                            ReactGA.event({
                              category: "Same number for Swiggy checkbox",
                              action: `
                              Same number is 
                              ${
                                e.target.checked ? " Checked" : " Unchecked"
                              } for Swiggy`,
                              label: "Same number for Swiggy checkbox",
                            });
                          }}
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
                          onChange={(e) => {
                            console.log(e.target.checked);
                            ReactGA.event({
                              category: "Same number for Zomato checkbox",
                              action: `
                              Same number is 
                              ${
                                e.target.checked ? " Checked" : " Unchecked"
                              } for Zomato`,
                              label: "Same number for Zomato checkbox",
                            });
                          }}
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
                  {/* //? Terms and Conditions! */}
                  {/* // ! Temporary Removed Terms and Conditions */}
                  {/* <div className="form-group">
                    <div className="same_as_btn">
                      <span
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <input
                          className="form--input_checkbox"
                          type="checkbox"
                          value={tnc}
                          checked={tnc}
                          {...register("tnc")}
                          onClick={(e) => {
                            setTnc((prevState) => !prevState);
                          }}
                        />
                        <span
                          className="patner-name tnc"
                          onClick={handelModelOpen}
                        >
                          Read all Terms & Conditions
                        </span>
                      </span>
                    </div>
                  </div> */}
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

          {/* //? Step 2 Page   */}
          {stepNumber === 1 && (
            <>
              <div className="signup_a-header__heading">
                Your data is secure
              </div>
              <div className="signup_a-header__sub-heading--small">
                "We do not share your data with
                <br />
                anyone"
              </div>
              <form
                className="signup_a__form"
                onSubmit={handleSubmit(onSubmitFormTwo)}
              >
                <div className="form-heading">{"Step 2/3: Swiggy"}</div>
                <div className="form-group__container jc--sb">
                  <div className="form-group">
                    {/* //!Swiggy Rest. Phone */}

                    <input
                      className="form--input"
                      type="tel"
                      name="Swiggy Number"
                      placeholder="Swiggy Number"
                      {...register("Swiggy Number", {
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

                  <div className="customer-review-card">
                    <div className="customer-review-card__body">
                      <span className="quote-icon_open">
                        <CgQuote />
                      </span>
                      <span className="text">
                        I have been using this app for a long time and it is
                        really great.
                      </span>
                      <span className="quote-icon_close">
                        <CgQuote />
                      </span>
                    </div>
                    <div className="customer-review-card__heading">
                      Chettinad Food House
                    </div>
                  </div>
                </div>

                {/* //! 0-next(if all thing are filled) , 1(same as 0) , 
            //! 2(here will show the signup) */}
                <div className="form--btn_container jc--sb">
                  <button
                    className="btn-previous"
                    onClick={() => {
                      ReactGA.event({
                        category: "Go Back Button",
                        action: "Go Back to Basic details",
                        label: "bO BACK BUTTON",
                      });

                      setStepNumber(0);
                    }}
                  >
                    <span> Go Back </span>
                  </button>

                  <button className="btn-continue">
                    <span> Continue </span>
                  </button>
                </div>
                <div className="form--btn_container jc--end">
                  <button
                    className="btn-previous"
                    onClick={() => {
                      console.log("here---->");
                      setValue("Swiggy Number", "");
                      setValue("Swiggy Password", "");
                      setStepNumber(1);
                      ReactGA.event({
                        category: "Button Click",
                        action: "Not on Swiggy Button Clicked",
                        label: "not on Swiggy Button Click",
                      });
                    }}
                  >
                    <span>not on Swiggy</span>
                  </button>
                </div>
              </form>
            </>
          )}

          {/* //? Step 3 Page   */}
          {stepNumber === 2 && (
            <>
              <div className="signup_a-header__heading">Grow with Voosh</div>
              <div className="signup_a-header__sub-heading--small">
                Personalized suggestions to make right
                <br />
                tweaks for growth
              </div>
              <form
                className="signup_a__form"
                onSubmit={handleSubmit(onSubmitFormThree)}
              >
                <div className="form-heading">{"Step 3/3: Zomato"}</div>
                <div className="form-group__container jc--sb">
                  <div className="form-group ">
                    {/* //!Swiggy Rest. Phone */}
                    <input
                      className="form--input"
                      type="tel"
                      name="Zomato Number"
                      placeholder="Zomato Number"
                      {...register("Zomato Number", {
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
                  <div className="customer-review-card">
                    <div className="customer-review-card__body">
                      <span className="quote-icon_open">
                        <CgQuote />
                      </span>
                      <span className="text">
                        I have been using this app for a long time and it is
                        really great.
                      </span>
                      <span className="quote-icon_close">
                        <CgQuote />
                      </span>
                    </div>
                    <div className="customer-review-card__heading">
                      Chettinad Food House
                    </div>
                  </div>
                </div>

                {/* //! 0-next(if all thing are filled) , 1(same as 0) , 
           //! 2(here will show the signup) */}
                <div className="form--btn_container jc--sb">
                  <button
                    disabled={showApkButton}
                    className={
                      "btn-previous " + `${showApkButton ? "disabled" : ""}`
                    }
                    onClick={() => {
                      ReactGA.event({
                        category: "Go Back Button",
                        action: "Go back to Swiggy Details",
                        label: "Go back from Zomato",
                      });
                      setStepNumber(1);
                    }}
                  >
                    <span> Go Back </span>
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
          {stepNumber === 2 && (
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
                onClick={() => {
                  navigate("/");
                  ReactGA.event({
                    category: "Redirect To Login",
                    action: "Redirect To Login",
                    label: "Already have an account? Redirect To Login",
                  });
                }}
              >
                Log in
              </span>
            </div>
          )}
          {/* //! Show this on every Page */}
          <div
            className="signup_a__contact_us-btn"
            style={{ marginTop: stepNumber !== 0 ? "4rem" : "" }}
          >
            <span className="signup_a__contact_us-btn--heading">
              Having problem?
            </span>
            <a
              href="tel:9015317006"
              className="signup_a__contact_us-btn--link"
              onClick={() => {
                ReactGA.event({
                  category: "Contact Us",
                  action: "Contact Us Button Click",
                  label: "Contact Us",
                });
              }}
            >
              Contact Us!
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignupA;
