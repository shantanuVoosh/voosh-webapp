import React from "react";
import StaticHeader from "../../components/StaticHeader";
import Footer from "../../components/Footer";
import { BsPersonCircle } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";


const UserProfile = () => {
  const [userDeatils, setUserDeatils] = React.useState({
    email: "test@gamil.com",
    restaurantName: "xyz Restaurant",
    phoneNumber: "7008237257",
    zomatoNumber: "7008237257",
    swiggyNumber: "7008237257",
    swiggyPassword: "donotshare",
    userName: "test",
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
                      // setProfilePage("edit-basic-details");
                    }}
                  >
                    <FiEdit />
                  </span>
                </div>
                <div className="item-content">
                  <div className="info">
                    <span className="label">Restaurant Name:</span>
                    <span className="value">
                      {restaurantName === "" ? "Not Provided" : restaurantName}
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
                  <div className="m-user-profile__body--item">
                    <div className="item-heading">
                      <div className="text"> Swiggy Details</div>
                      <span
                        onClick={() => {
                          // setProfilePage("edit-swiggy-details");
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
                      <span
                        onClick={() => {
                          // setProfilePage("edit-zomato-details");
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

export default UserProfile;
