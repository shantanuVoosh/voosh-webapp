import React from "react";
import swiggy_logo_svg from "../../styles/assets/swiggy-bag.svg";
import { useSelector } from "react-redux";
import ReactGA from "react-ga4";
import MetaTags from "react-meta-tags";
import ReactPixel from "react-facebook-pixel";
import { useForm } from "react-hook-form";
import { GrFormPreviousLink } from "react-icons/gr";
import { RiCloseCircleLine } from "react-icons/ri";
import { BsShieldFillCheck } from "react-icons/bs";
import { IoIosInformationCircleOutline } from "react-icons/io";

const SwiggyForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue,
  } = useForm();
  const [isButtonDisable, setIsButtonDisable] = React.useState(false);
  const onSubmitForm = (data) => {
    console.log(data);
  };

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
      <div className="swiggy-form">
        <div className="swiggy-form__header">
          <div className="swiggy-form__header--text">
            <h2 className="">
              <span>Swiggy</span> Partner
            </h2>
            <p>Manage your restaurant on Swiggy</p>
          </div>
          <div
            className="swiggy-form__header--logo"
            // style={{ height: "90px", position: "relative" }}
          >
            <img
              src={swiggy_logo_svg}
              alt="swiggy_logo_svg"
              // style={{ height: "100%" }}
            />
          </div>
        </div>
        <form
          className="swiggy-form__body"
          onSubmit={handleSubmit(onSubmitForm)}
        >
          {/* //!Swiggy Rest. Phone */}

          <div className="swiggy-form__body--heading">Login</div>
          <div className="swiggy-form__body--sub-heading">
            <div className="text">
              Enter a registered mobile number or restaurant ID to login
            </div>
            <div className="icon">
              <IoIosInformationCircleOutline size={25} />
            </div>
          </div>

          <div className="swiggy-form__body--input-feild">
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
          <div className="swiggy-form__body--error">
            {errors["swiggy-number"] && (
              <p className="error red">
                Provide a valid number, your Swiggy Registered Phone Number
              </p>
            )}
          </div>

          {/* //!Swiggy Password */}
          <div className="swiggy-form__body--input-feild">
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
          <div className="swiggy-form__body--error">
            {errors["swiggy-password"] && (
              <p className="error red">
                Your Swiggy password should be atleast 3 characters long
              </p>
            )}
          </div>
          <div
            className="swiggy-form__body--skip-btn"
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
              <span
                style={{
                  fontWeight: "600",
                }}
              >
                Skip
              </span>{" "}
              {"(not on swiggy)"}
            </span>
          </div>

          {/*// ?Proceed Button */}
          <div className={"swiggy-form__body--btn"}>
            <button
              className={
                "btn" + ` ${isButtonDisable ? "btn-disabled" : ""}` + `{}`
              }
            >
              {isButtonDisable ? "Wait..." : "Continue"}
              {/* Proceed */}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default SwiggyForm;
