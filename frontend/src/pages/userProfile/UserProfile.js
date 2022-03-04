import React from "react";
import StaticHeader from "../../components/StaticHeader";
import Footer from "../../components/Footer";
import { BsPersonCircle } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { useForm } from "react-hook-form";
import MetaTags from "react-meta-tags";
import { GrFormPreviousLink } from "react-icons/gr";
import { RiCloseCircleLine } from "react-icons/ri";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import Loading from "../../components/Loading";

const UserProfile = () => {
  const {
    owner_name,
    owner_number,
    swiggy_password,
    swiggy_register_phone,
    zomato_register_phone,
    res_name,
    email: userEmailId,
    listingID,
    isLoading,
  } = useSelector((state) => state.data);

  const [userDeatils, setUserDeatils] = React.useState({
    email: userEmailId,
    restaurantName: res_name,
    phoneNumber: owner_number,
    zomatoNumber: zomato_register_phone,
    swiggyNumber: swiggy_register_phone,
    swiggyPassword: swiggy_password,
    userName: owner_name,
  });
  const [profilePage, setProfilePage] = React.useState("user-profile");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue,
  } = useForm();

  console.log("profilePage", profilePage);

  const {
    isAuthenticated,
    token,
    isTemporaryAuthenticated,
    temporaryToken,
    dummyUser,
    isDummyUserAuthenticated,
  } = useSelector((state) => state.auth);

  const {
    email,
    restaurantName,
    phoneNumber,
    zomatoNumber,
    swiggyNumber,
    swiggyPassword,
    userName,
  } = userDeatils;

  const notifyError = (msg) => toast.error(msg);
  const notifySuccess = (msg) => toast.success(msg);
  const notiftAlert = (msg) => toast.warn(msg);

  React.useEffect(() => {
    if (!isLoading) {
      setUserDeatils({
        email: userEmailId,
        restaurantName: res_name,
        phoneNumber: owner_number,
        zomatoNumber: zomato_register_phone,
        swiggyNumber: swiggy_register_phone,
        swiggyPassword: swiggy_password,
        userName: owner_name,
      });
    }
  }, [isLoading]);

  // Todo:
  // ! Update user  basic details
  const handelUpdateEmail = async (data) => {
    console.log("handelUpdateEmail Data: ****", data);
    // {user-name: 'hi', email: 'shanu@gmail.com'}
    // ? no changes so no need to update
    if (data.email === email) {
      console.log("No changes so no need to update");
      notiftAlert("No changes so no need to update");
      return;
    }
    const { data: response } = await axios.post("/user/update/email", {
      token: token,
      email: data.email,
    });
    console.log("handelUpdateEmail Response: ****", response);
    if (response.status === "success") {
      setUserDeatils((prevState) => {
        return {
          ...prevState,
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
  const handelUpdateSwiggyPassword = async (data) => {
    console.log("handelUpdateSwiggyPassword Data: ****", data);
    if (data["swiggy-password"] === swiggyPassword) {
      console.log("No changes so no need to update");
      notiftAlert("No changes so no need to update");
      return;
    }
    const { data: response } = await axios.post(
      "/user/update/swiggy-password",
      {
        token: token,
        swiggy_register_phone: swiggyNumber,
        swiggy_password: data["swiggy-password"],
        listing_id: listingID,
      }
    );
    console.log("handelUpdateEmail Response: ****", response);
    if (response.status === "success") {
      setUserDeatils((prevState) => {
        return {
          ...prevState,
          swiggyPassword: data["swiggy-password"],
        };
      });
      notifySuccess("Password updated successfully");
      setProfilePage("user-profile");
    } else {
      notifyError(response.message);
    }
  };

  const UserProfilePage = () => {
    return (
      <>
        <StaticHeader name={"User profile"} addBtn={false} />
        <div className="m-user-profile container">
          <>
            <div className="m-user-profile-container">
              <div className="m-user-profile__head">
                {/* <img src="" alt="" /> */}
                <div className="m-user-profile__head--top"></div>
                <div className="m-user-profile__head--user-icon">
                  <BsPersonCircle size={150} />
                </div>
                <div className="m-user-profile__head--bottom"></div>
              </div>
              <div className="m-user-profile__body">
                <div className="m-user-profile__body--item">
                  <div className="item-heading">
                    <div className="text">User Details</div>
                    <span
                      onClick={() => {
                        setProfilePage("update-user-email");
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
                        {email === "" || email === undefined || email === null
                          ? "Not Provided"
                          : email}
                      </span>
                    </div>
                  </div>
                </div>

                {swiggyNumber === "" ? null : (
                  <>
                    <div className="m-user-profile__body--item">
                      <div className="item-heading">
                        <div className="text"> Swiggy Details</div>
                        <span
                          onClick={() => {
                            setProfilePage("update-user-swiggy-password");
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
                    <div className="m-user-profile__body--item">
                      <div className="item-heading">
                        <div className="text">Zomato Details</div>
                        {/* <span
                      onClick={() => {
                        setProfilePage("edit-zomato-details");
                      }}
                    >
                      <FiEdit />
                    </span> */}
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
              {/* <div className="m-user-profile__bottom">
          <button>Update</button>
        </div> */}
            </div>
          </>
        </div>
        <Footer />
      </>
    );
  };

  // ? edit swiggy password
  const EditSwiggyPasswordPage = () => {
    return (
      <>
        <MetaTags>
          <title>Voosh | Edit Swiggy Password</title>
          <meta
            name="voosh web app, Edit Swiggy Password"
            content="voosh Edit Swiggy Password page"
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
            <span className="text">EDIT SWIGGY PASSWORD</span>
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
                Update Your Swiggy Password
                {/* Connect with Swiggy */}
              </div>
            </div>
            <form
              className="page-body__form"
              onSubmit={handleSubmit(handelUpdateSwiggyPassword)}
            >
              {/* //!Swiggy Rest. Phone */}
              {/* <div className="page-body__form--input-feild">
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
              </div> */}

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

  // ? basic details Edit
  const EditBasicDetails = () => {
    return (
      <>
        <MetaTags>
          <title>Voosh | Edit User Email</title>
          <meta
            name="voosh web app,  Edit User Email"
            content="voosh Edit User Email page"
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
            <span className="text">EDIT USER EMAIL</span>
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
              <div className="page-body__title--text">Update Your EMAIL ID</div>
            </div>
            <form
              className="page-body__form"
              onSubmit={handleSubmit(handelUpdateEmail)}
            >
              {/* //! Restaurant Name */}
              {/* <div className="page-body__form--input-feild">
                <input
                  className="form-input"
                  type="text"
                  placeholder="Restaurant Name"
                  disabled={true}
                  defaultValue={restaurantName}
                />
              </div> */}

              {/* //! Phone Number */}
              {/* <div className="page-body__form--input-feild">
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
              </div> */}
              {/* //! Name */}
              {/* <div className="page-body__form--input-feild">
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
              </div> */}
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

  if (isLoading) {
    return <Loading />;
  }

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
      {profilePage === "user-profile" && <UserProfilePage />}
      {profilePage === "update-user-email" && <EditBasicDetails />}
      {profilePage === "update-user-swiggy-password" && (
        <EditSwiggyPasswordPage />
      )}
    </>
  );
};

export default UserProfile;
