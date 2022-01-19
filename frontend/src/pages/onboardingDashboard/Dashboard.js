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
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
  const [numberOfVideoWatch, setNumberOfVideoWatch] = React.useState(1);
  const [displayPageNumber, setDisplayPageNumber] = React.useState(0);
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
    // setDisplayPageNumber(0);
    // setNumberOfVideoWatch(1);
  }, []);

  // Todo from the state we or DB we can know the Name Email and Rest Name
  const userDetails = {
    name: "Shnatnau Mahato",
    email: "xyz@gmail.com",
    restaurantName: "ABC Restaurant",
    phoneNumber: "0123456789",
  };

  const onSubmitFormOne = (data) => {
    // Todo data will be empty cuz we not changing the any field(Disabled)
    // ? Use User Details to update the data or to continue...
    console.log(data);
    console.log(userDetails, "1st form submit");
    if (data.checkbox_1 === true) {
      setValue("swiggy-number", userDetails.phoneNumber);
    } else if (data.checkbox_1 === false) {
      setValue("swiggy-number", "");
    }
    // if (data.checkbox_2 === true) {
    //   setValue("Zomato Number", data["Phone Number"]);
    // }
    setDisplayPageNumber(2);
  };
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
    // ? check the swiggy password presnt but not the swiggy number
    if (swiggyPassword.length !== 0 && swiggyNumber.length === 0) {
      notifyError("Please enter your Swiggy number!");
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

      if (response.status === "error") {
        notifyError(response.message);
        return;
      }
      // ? if the response is success then we can continue
      else {
        console.log("response:", response);
        displayPageNumber(3);
      }
    } catch (err) {
      console.log(err);
      notifyError("Server Error or Internet Problem, Please try again later");
    }
  };

  const DashboardPage = () => {
    return (
      <div className="container onboard-container">
        <div className="onboard-logo">
          <img src={logo_img} alt="logo" className="onboard-logo--image" />
        </div>
        {/* //! dashboard */}
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
            <span className="onboard-preview-dashboard__mid--text"> Get </span>
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

        {/* //! if get the data the show we are analysing yor data */}
        <div className="onboard-alalysing">
          <div className="icon">
            <CgLoadbarSound size={40} />
          </div>
          <div className="text">We are analysing your Restaurant data</div>
        </div>

        {/* //! Gray Card */}
        <div className="onboard-certified-card">
          <div className="part-one">
            {/*//? left 70% */}
            <div className="text">
              <div className="head">
                Get <span className="orange">Voosh</span> certified
              </div>
              <div className="sub-head">
                while we prepare your data, have a look at the below knowledge
                goldmine!
              </div>
            </div>
            {/*//? right 30% */}
            <div className="sample-image">
              <img src={vooshCardSvg} alt="voosh-card" />
            </div>
          </div>
          <div className="part-two">
            <div
              className="bar"
              style={{ width: `${(numberOfVideoWatch / 5) * 100}%` }}
            ></div>
            <div className="text">1/5 videos watched!</div>
          </div>
        </div>
        {/* //! Samll mein col xsmall other row */}
        <div className="dashboard-bottom">
          <div className="dashboard-bottom__videos">
            <div className="single-video">
              <ReactPlayer
                // className="single-video"
                url="https://www.youtube.com/watch?v=MIsi4vdzjgk"
                controls
                playbackRate={1}
                width="100%"
                height="200px"
              />
              <div className="text">What is serviciabilty </div>
            </div>
            <div className="single-video">
              <ReactPlayer
                // className="single-video"
                url="https://www.youtube.com/watch?v=QN1GGCNMOY4"
                controls
                playbackRate={1}
                width="310px"
                height="200px"
              />
              <div className="text">What is Rating </div>
            </div>
          </div>
          {/* <div className="">
        <ScrollButton />
      </div> */}
        </div>

        {/* //! Quick Reads */}
        <div className="onboard-quick-reads">
          {/* //? article */}
          <h1>Quick Reads</h1>
          <div className="onboard-quick-reads__article">
            {/* //? text */}
            <div className="left">
              <div className="head">Voosh is trusted by Millions</div>
              <div className="sub-head">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum
                eius consectetur molestiae vero reprehenderit rem.
              </div>
              <div className="info-tab">
                <span className="name">name</span>
                <span className="date">15 Jan 2022</span>
                <span className="time">5mins</span>
              </div>
              <div className="onboard-quick-reads__article--read-more">
                Read More
              </div>
            </div>
            <div className="right">
              <div className="onboard-quick-reads__article--img">Image</div>
            </div>
          </div>
          <div className="onboard-quick-reads__article">
            {/* //? text */}
            <div className="left">
              <div className="head">Voosh is trusted by Millions</div>
              <div className="sub-head">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum
                eius consectetur molestiae vero reprehenderit rem.
              </div>
              <div className="info-tab">
                <span className="name">name</span>
                <span className="date">15 Jan 2022</span>
                <span className="time">5mins</span>
              </div>
              <div className="onboard-quick-reads__article--read-more">
                Read More
              </div>
            </div>
            <div className="right">
              <div className="onboard-quick-reads__article--img">Image</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
                defaultValue={userDetails.phoneNumber}
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
                <input
                  className="checkbox-input"
                  {...register("checkbox_1")}
                  type="checkbox"
                  defaultChecked={true}
                  onChange={(e) => {
                    console.log(e.target.checked);
                  }}
                />
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
                  minLength: 10,
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
                I dont have a{" "}
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
      {displayPageNumber === 3 && (
        <>
          <div className="container onboard-form">
            <div className="page-btns">
              <span
                className="previous"
                onClick={() => setDisplayPageNumber(1)}
              >
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
                onSubmit={handleSubmit(onSubmitFormTwo)}
              >
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
                      minLength: 10,
                    })}
                  />
                </div>
                <div className="page-body__form--error">
                  {errors["zomato-number"] && (
                    <p className="error red">
                      Provide a valid number, your Zomato Registered Phone
                      Number
                    </p>
                  )}
                </div>

                <div
                  className="page-body__form--skip-btn"
                  onClick={() => {

                    // Todo: check is swiggy is also skipped or not, 
                    // ? if yes the alter him atlest five one number
                    // ? if no clear zomato feild
                    // const data = getValues();
                    // const isCheckboxChecked = data["checkbox_not-in-zomato"];

                    // if (!isCheckboxChecked) {
                    //   setValue("checkbox_not-in-swiggy", true);
                    //   setValue("swiggy-number", "");
                    //   setValue("swiggy-password", "");
                    // } else {
                    //   setValue("checkbox_not-in-swiggy", false);
                    //   setValue("swiggy-number", "");
                    //   setValue("swiggy-password", "");
                    // }

                    // console.log(data, "data insde skip");

                    // setDisplayPageNumber(3);
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
                    I dont have a{" "}
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
        </>
      )}
    </>
  );
};

export default Dashboard;
