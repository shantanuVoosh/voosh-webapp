import React from "react";
import ReactGA from "react-ga4";
import MetaTags from "react-meta-tags";
import ReactPixel from "react-facebook-pixel";
import { IoIosPerson } from "react-icons/io";
import Footer from "../../components/onboardingDashboard/Footer";
import Header from "../../components/onboardingDashboard/Header";
import { BsPersonCircle } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { GrFormPreviousLink } from "react-icons/gr";
import { RiCloseCircleLine } from "react-icons/ri";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";

const UserProfile = ({
  changePage,
  pageName,
  currentUserDetails,
  userAllNotifications,
  setUserAllNotifications,
  numberOfNotifications,
  setNumberOfNotifications,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue,
  } = useForm();

  const [profilePage, setProfilePage] = React.useState("user-profile");
  const { temporaryToken } = useSelector((state) => state.auth);
  const notifyError = (msg) => toast.error(msg);
  const notifySuccess = (msg) => toast.success(msg);
  const notiftAlert = (msg) => toast.warn(msg);

  const [userDeatils, setUserDeatils] = React.useState({
    email: currentUserDetails.email,
    restaurantName: currentUserDetails.restaurantName,
    phoneNumber: currentUserDetails.phoneNumber,
    zomatoNumber: currentUserDetails.zomatoNumber,
    swiggyNumber: currentUserDetails.swiggyNumber,
    swiggyPassword: currentUserDetails.swiggyPassword,
    userName: currentUserDetails.userName,
  });

  const {
    email,
    restaurantName,
    phoneNumber,
    zomatoNumber,
    swiggyNumber,
    swiggyPassword,
    userName,
  } = userDeatils;

  React.useEffect(() => {
    // const Formdata = getValues();
    // console.log("Formdata", Formdata);
    // console.log("userDeatils", userDeatils);

    reset({});
  }, [profilePage]);

  // ! Update user  basic details
  const handelEditBasicDetails = async (data) => {
    console.log("handelEditBasicDetails Data: ****", data);
    // {user-name: 'hi', email: 'shanu@gmail.com'}

    // ? no changes so no need to update
    if (
      data["user-name"] === currentUserDetails.userName &&
      data.email === currentUserDetails.email
    ) {
      console.log("No changes so no need to update");
      notiftAlert("No changes so no need to update");
      return;
    }

    const { data: response } = await axios.post(
      "/user/update/onboard-data/basic-details",
      {
        token: temporaryToken,
        userName: data["user-name"],
        userEmail: data.email,
      }
    );
    console.log("handelEditBasicDetails Response: ****", response);
    if (response.status === "success") {
      setUserDeatils((prevState) => {
        return {
          ...prevState,
          userName: data["user-name"],
          email: data.email,
        };
      });

      notifySuccess("Basic details updated successfully");
      setProfilePage("user-profile");
    } else {
      notifyError("Something went wrong");
    }
  };

  // ! Update user Swiggy details
  const handelEditSwiggyDeatils = async (data) => {
    console.log("handelSwiggyDeatils");
    console.log("handelEditSwiggyDeatils Data: ****", data);

    if (
      data["swiggy-password"] === currentUserDetails.swiggyPassword &&
      data["swiggy-number"] === currentUserDetails.swiggyNumber
    ) {
      console.log("No changes so no need to update");
      notiftAlert("No changes so no need to update");

      return;
    }

    const { data: response } = await axios.post(
      "/user/update/onboard-data/swiggy-details",
      {
        token: temporaryToken,
        swiggyNumber: data["swiggy-number"],
        swiggyPassword: data["swiggy-password"],
      }
    );
    console.log("handelEditBasicDetails Response: ****", response);
    if (response.status === "success") {
      setUserDeatils((prevState) => {
        return {
          ...prevState,
          swiggyNumber: data["swiggy-number"],
          swiggyPassword: data["swiggy-password"],
        };
      });

      notifySuccess("Zomato details updated successfully");
      setProfilePage("user-profile");
    } else {
      notifyError("Something went wrong");
    }
  };

  // ! Update user Zomato details
  const handelEditZomatoDeatils = async (data) => {
    console.log("handelZonatoDeatilsData ****", data);

    if (data["zomato-number"] === zomatoNumber) {
      console.log("No changes so no need to update");
      notiftAlert("No changes so no need to update");
      return;
    }

    const { data: response } = await axios.post(
      "/user/update/onboard-data/zomato-details",
      {
        token: temporaryToken,
        zomatoNumber: data["zomato-number"],
      }
    );
    console.log("handelEditBasicDetails Response: ****", response);
    if (response.status === "success") {
      setUserDeatils((prevState) => {
        return {
          ...prevState,
          zomatoNumber: data["zomato-number"],
        };
      });

      notifySuccess("Zomato details updated successfully");
      setProfilePage("user-profile");
    } else {
      notifyError("Something went wrong");
    }
  };

  const UserProfilePage = () => {
    return (
      <>
        <MetaTags>
          <title>Voosh | User-Profile</title>
          <meta
            name="voosh web app,  User-Profile page"
            content="voosh User-Profile page"
          />
          <meta property="og:title" content="web-app" />
        </MetaTags>
        <div className="user-profile">
          <Header
            changePage={changePage}
            pageName={pageName}
            userAllNotifications={userAllNotifications}
            setUserAllNotifications={setUserAllNotifications}
            numberOfNotifications={numberOfNotifications}
            setNumberOfNotifications={setNumberOfNotifications}
          />
          <>
            <div className="user-profile-container">
              <div className="user-profile__head">
                {/* <img src="" alt="" /> */}
                <div className="user-profile__head--top"></div>
                <div className="user-profile__head--user-icon">
                  <BsPersonCircle size={150} />
                </div>
                <div className="user-profile__head--bottom"></div>
              </div>
              <div className="user-profile__body">
                <div className="user-profile__body--item">
                  <div className="item-heading">
                    <div className="text">User Details</div>
                    <span
                      onClick={() => {
                        setProfilePage("edit-basic-details");
                      }}
                    >
                      <FiEdit />
                    </span>
                  </div>
                  <div className="item-content">
                    <div className="info">
                      <span className="label">Restaurant Name:</span>
                      <span className="value">
                        {restaurantName === ""
                          ? "Not Provided"
                          : restaurantName}
                      </span>
                    </div>
                    <div className="info">
                      <span className="label">Name:</span>
                      <span className="value">
                        {userName === "" ? "Not Provided" : userName}
                      </span>
                    </div>
                    <div className="info">
                      <span className="label">Phone Number:</span>
                      <span className="value">{phoneNumber}</span>
                    </div>
                    <div className="info">
                      <span className="label">Email:</span>
                      <span className="value">
                        {email === "" || email === undefined
                          ? "Not Provided"
                          : email}
                      </span>
                    </div>
                  </div>
                </div>

                {swiggyNumber === "" ? null : (
                  <>
                    <div className="user-profile__body--item">
                      <div className="item-heading">
                        <div className="text"> Swiggy Details</div>
                        <span
                          onClick={() => {
                            setProfilePage("edit-swiggy-details");
                          }}
                        >
                          <FiEdit />
                        </span>
                      </div>

                      <div className="item-content">
                        <div className="info">
                          <span className="label">Phone Number:</span>
                          <span className="value">{swiggyNumber}</span>
                        </div>
                        <div className="info">
                          <span className="label">Password:</span>
                          <span className="value">{swiggyPassword}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {zomatoNumber === "" ? null : (
                  <>
                    <div className="user-profile__body--item">
                      <div className="item-heading">
                        <div className="text">Zomato Details</div>
                        <span
                          onClick={() => {
                            setProfilePage("edit-zomato-details");
                          }}
                        >
                          <FiEdit />
                        </span>
                      </div>

                      <div className="item-content">
                        <div className="info">
                          <span className="label">Phone Number:</span>
                          <span className="value">{zomatoNumber}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
              {/* <div className="user-profile__bottom">
            <button>Update</button>
          </div> */}
            </div>
          </>
          <Footer changePage={changePage} pageName={pageName} />
        </div>
      </>
    );
  };

  // ? basic details Edit
  const EditBasicDetails = () => {
    return (
      <>
        <MetaTags>
          <title>Voosh | Edit Basic Details</title>
          <meta
            name="voosh web app,  Edit Basic Details"
            content="voosh Edit Basic Details page"
          />
          <meta property="og:title" content="web-app" />
        </MetaTags>
        <div className="container onboard-form">
          <div className="page-btns">
            <span
              className="previous"
              style={{
                visibility: "hidden",
              }}
            >
              <GrFormPreviousLink size={30} />
            </span>
            <span className="text">EDIT BASIC DETAILS</span>
            <span className="close">
              <RiCloseCircleLine
                size={30}
                onClick={() => {
                  setProfilePage("user-profile");
                }}
              />
            </span>
          </div>
          <div className="page-body">
            <div className="page-body__title">
              <div className="page-body__title--text">
                Update Your Basic Details
              </div>
            </div>
            <form
              className="page-body__form"
              onSubmit={handleSubmit(handelEditBasicDetails)}
            >
              {/* //! Restaurant Name */}
              <div className="page-body__form--input-feild">
                <input
                  className="form-input"
                  type="text"
                  placeholder="Restaurant Name"
                  disabled={true}
                  defaultValue={restaurantName}
                />
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
                  defaultValue={phoneNumber}
                  disabled={true}
                />
              </div>
              {/* //! Name */}
              <div className="page-body__form--input-feild">
                <input
                  className="form-input"
                  type="text"
                  placeholder="Your Name"
                  defaultValue={userName}
                  {...register("user-name", {
                    required: true,
                    minLength: 2,
                  })}
                />
              </div>
              <div className="page-body__form--error">
                {errors["user-name"] && (
                  <p className="error red">
                    Name should be atleast 2 characters long
                  </p>
                )}
              </div>
              {/* //! Email */}
              <div className="page-body__form--input-feild ">
                <input
                  className="form-input"
                  type="email"
                  // required
                  defaultValue={email}
                  placeholder="Email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value:
                        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                      message: "Please enter a valid email",
                    },
                  })}
                />
              </div>
              <div
                className="page-body__form--error"
                style={{ marginBottom: "4rem" }}
              >
                {errors["email"] && (
                  <p className="error red">Provide a valid email address</p>
                )}
              </div>

              {/*// ?Update Button */}
              <div className="page-body__form--btn">
                <button className="btn">Update</button>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  };

  // ? swiggy details Edit
  const EditSwiggyDetails = () => {
    return (
      <>
        <MetaTags>
          <title>Voosh | Edit Swiggy Details</title>
          <meta
            name="voosh web app, Edit Swiggy Details"
            content="voosh Edit Swiggy Details page"
          />
          <meta property="og:title" content="web-app" />
        </MetaTags>
        <div className="container onboard-form">
          <div className="page-btns">
            <span
              className="previous"
              style={{
                visibility: "hidden",
              }}
            >
              <GrFormPreviousLink size={30} />
            </span>
            <span className="text">EDIT SWIGGY DETAILS</span>
            <span className="close">
              <RiCloseCircleLine
                size={30}
                onClick={() => {
                  setProfilePage("user-profile");
                }}
              />
            </span>
          </div>
          <div className="page-body">
            <div className="page-body__title">
              <div className="page-body__title--text">
                Update Your Swiggy Number
                {/* Connect with Swiggy */}
              </div>
            </div>
            <form
              className="page-body__form"
              onSubmit={handleSubmit(handelEditSwiggyDeatils)}
            >
              {/* //!Swiggy Rest. Phone */}
              <div className="page-body__form--input-feild">
                <input
                  className="form-input"
                  type="tel"
                  name="swiggy-number"
                  placeholder="Swiggy Number"
                  defaultValue={swiggyNumber}
                  {...register("swiggy-number", {
                    // required: true,
                    maxLength: 10,
                    // minLength: 10,
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
                  defaultValue={swiggyPassword}
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

              {/*// ?Proceed Button */}
              <div className={"page-body__form--btn"}>
                <button>Update</button>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  };

  // ? zomato  details Edit
  const EditZomatoDetails = () => {
    return (
      <>
        <MetaTags>
          <title>Voosh | Edit Zomato Details</title>
          <meta
            name="voosh web app, Edit Zomato Details"
            content="voosh Edit Zomato Details page"
          />
          <meta property="og:title" content="web-app" />
        </MetaTags>
        <div className="container onboard-form">
          <div className="page-btns">
            <span
              className="previous"
              style={{
                visibility: "hidden",
              }}
            >
              <GrFormPreviousLink size={30} />
            </span>
            <span className="text">EDIT ZOMATO DETAILS</span>
            <span className="close">
              <RiCloseCircleLine
                size={30}
                onClick={() => {
                  setProfilePage("user-profile");
                }}
              />
            </span>
          </div>
          <div className="page-body">
            <div className="page-body__title">
              <div className="page-body__title--text">
                Update Your Zomato Number
              </div>
            </div>
            <form
              className="page-body__form"
              onSubmit={handleSubmit(handelEditZomatoDeatils)}
            >
              {/* //!Zomato Rest. Phone */}
              <div className="page-body__form--input-feild">
                <input
                  className="form-input"
                  type="tel"
                  name="zomato-number"
                  placeholder="Zomato Number"
                  // defaultValue={zomatoNumber}
                  {...register("zomato-number", {
                    // required: true,
                    maxLength: 10,
                    // minLength: 10,
                  })}
                />
              </div>
              <div className="page-body__form--error">
                {errors["zomato-number"] && (
                  <p className="error red">
                    Provide a valid number, your Zomato Registered Phone Number
                  </p>
                )}
              </div>

              {/*// ?Proceed Button */}
              <div className="page-body__form--btn">
                <button className="btn">Update</button>
              </div>
            </form>
          </div>
        </div>
      </>
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
      {/* //? Profile Page */}
      {profilePage === "user-profile" && <UserProfilePage />}
      {profilePage === "edit-basic-details" && <EditBasicDetails />}
      {profilePage === "edit-swiggy-details" && <EditSwiggyDetails />}
      {profilePage === "edit-zomato-details" && <EditZomatoDetails />}
    </>
  );
};

export default UserProfile;
