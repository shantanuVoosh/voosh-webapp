import React from "react";
import axios from "axios";
import logo_img from "../styles/images/logo-img.png";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const notify = (msg) => toast.error(msg);

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const { data: response } = await axios.post("/signup", {
        name: data["Your Name"],
        phone: data["Phone Number"],
        email: data["Email"],
        restaurant_name: data["Restaurant Name"],
        swiggy_Id: data["Swiggy Id"],
        swiggy_register_phone: data["Swiggy Reg"][" Phone"],
        swiggy_password: data["Swiggy Password"],
        zomato_register_phone: data["Zomato Reg"][" Phone"],
      });
      console.log("Signup Success, response:", response);
      if (response.status === "success") {
        navigate("/greeting");
      } else {
        console.log("Failure response:", response.error);
        notify(response.error)
        // navigate("/");

      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="container">
        <div className="signup-container">
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
            <img src={logo_img} alt="logo" className="signup-header__logo" />
            <div className="signup-header__heading">
              Register to get started!
            </div>
            <div className="signup-header__sub-heading--small">
              Grow your online business like never before with Voosh: Insider
              secrets, competiton analysis, and more, all in one place!
              <div className="login">
                <span className="login--heading">Already have an account?</span>
                <span className="login--link" onClick={() => navigate("/")}>
                  Log in
                </span>
              </div>
            </div>
          </div>
          {/* //! accept when all the feil verified! */}
          <form className="signup__form" onSubmit={handleSubmit(onSubmit)}>
            {/* //? For User Deails */}
            <div className="form-group">
              <div className="form--heading">Basic Details</div>
              {/* //! Name*/}
              {errors["Your Name"] && (
                <p className="form_error red">
                  Name should be atleast 3 characters long
                </p>
              )}
              <input
                className="form--input"
                type="text"
                placeholder="Your Name"
                {...register("Your Name", { required: true, minLength: 3 })}
              />
              {/* //! Phone Num */}
              {errors["Phone Number"] && (
                <p className="form_error red">
                  Enter your 10 digit mobile number
                </p>
              )}
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
              {/* //! Email */}
              {errors["Email"] && (
                <p className="form_error red">Provide a valid email address</p>
              )}
              <input
                className="form--input"
                type="email"
                required
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
              {/*//! Restaurant Name */}
              {errors["Restaurant Name"] && (
                <p className="form_error red">
                  Name should be atleast 1 characters long
                </p>
              )}
              <input
                className="form--input"
                type="text"
                placeholder="Restaurant Name"
                {...register("Restaurant Name", {
                  required: true,
                  minLength: 1,
                })}
              />
            </div>
            <div className="form-group">
              {/* <select {...register("category")}>
                <option value="">Select...</option>
                <option value="A">Category A</option>
                <option value="B">Category B</option>
              </select> */}
              {/* 
              <input {...register("checkbox")} type="checkbox" value="A" />
              <input {...register("checkbox")} type="checkbox" value="B" />
              <input {...register("checkbox")} type="checkbox" value="C" /> */}
              {/* 
              <input {...register("radio")} type="radio" value="yes" />
              <input {...register("radio")} type="radio" value="no" /> */}
            </div>

            {/* //? Food Services */}
            <div className="form-group">
              <div className="form--heading">Partner Details</div>
              {/* //!Swiggy Id */}
              {errors["Swiggy Id"] && (
                <p className="form_error red">Provide a valid your Swiggy Id</p>
              )}
              <input
                className="form--input"
                type="text"
                placeholder="Swiggy Id"
                {...register("Swiggy Id", {
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Please enter numbers only",
                  },
                  required: true,
                  minLength: 3,
                })}
              />
              {/* //!Swiggy Rest. Id */}
              {errors["Swiggy Reg. Phone"] && (
                <p className="form_error red">
                  Provide a valid number, your Swiggy Registered Phone Number
                </p>
              )}
              <input
                className="form--input"
                type="tel"
                placeholder="Swiggy Reg. Phone"
                {...register("Swiggy Reg. Phone", {
                  required: true,
                  maxLength: 10,
                  minLength: 10,
                })}
              />
              {/* //!Swiggy Password */}
              {errors["Swiggy Password"] && (
                <p className="form_error red">
                  Your Swiggy password should be atleast 3 characters long
                </p>
              )}
              <input
                className="form--input"
                type="password"
                placeholder="Swiggy Password"
                {...register("Swiggy Password", {
                  required: true,
                  minLength: 3,
                })}
              />
              {/* //!Zomato Phone Number */}
              {errors["Zomato Reg. Phone"] && (
                <p className="form_error red">
                  Provide a valid number, your Zomato Registered Phone Number{" "}
                </p>
              )}
              <input
                className="form--input"
                type="tel"
                placeholder="Zomato Reg. Phone"
                {...register("Zomato Reg. Phone", {
                  required: true,
                  maxLength: 10,
                  minLength: 10,
                })}
              />
            </div>
            <button className="form--btn screen-btn">
              <span>Sign Up</span>
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
