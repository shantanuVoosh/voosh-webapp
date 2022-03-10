const router = require("express").Router();
const { MongoClient } = require("mongodb");
const jwt = require("jsonwebtoken");
const {
  getAllSwiggyAndZomatoRestaurants,
} = require("../utils/getAllRestaurants");

const { getUserDetails } = require("../utils/getUserDetails");

const { checkAuthentication } = require("../controller/checkAuth");

const { getAllSwiggyData } = require("../DataProviders/getAllSwiggyData");
const { getAllZomatoData } = require("../DataProviders/getAllZomatoData");

const VooshDB =
  "mongodb://analyst:gRn8uXH4tZ1wv@35.244.52.196:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";

const documentName = "operationsdb";
const secret = "secret";

// Todo: Notification collection sample
const BANNER_REQUEST = "Banner Request Sent";
const SIGNUP_SUCCESS = "Signup Successful";
const REGISTRATION_SUCCESS = "Registration Successful";
const NotificationModel = {
  "Banner Request Sent": `Banner Service "Review" requested. You'll receive a callback shortly!`,
  "Signup Successful": `Welcome to "Grow" by Voosh. We'll be there on your growth Journey!`,
  "Registration Successful": `You have now successfully entered all details! Sit tight and Relax and we'll analyze and provide you restaurant recommendations!`,
};

router.post(
  "/user/check/user-in-nvdp",
  checkAuthentication,
  async (req, res) => {
    const { phone } = req.payload;
    const client = await MongoClient.connect(VooshDB, {
      useNewUrlParser: true,
    });
    const db = client.db(documentName);
    const nvdpColleaction = "non_voosh_dashboard_products_UAT";

    try {
      const isUserPresentInNVDP = await db.collection(nvdpColleaction).findOne({
        owner_number: parseInt(phone),
      });

      if (isUserPresentInNVDP === null) {
        return res.json({
          status: "fail",
          user: isUserPresentInNVDP,
        });
      }
      // ! If user is present in nvdp
      else {
        return res.json({
          status: "success",
          message: "user present in nvdp",
          phone,
        });
      }
    } catch (error) {
      console.log("Error in checking user in NVDP:", error);
      res.json({
        status: "error",
        message: "Error in checking user in NVDP",
      });
    }
  }
);

// !Get All Data
router.post("/voosh-data", checkAuthentication, async (req, res) => {
  console.log("---------- <Get All Data Start> ----------------");
  try {
    // TODO get all data from mongodb specified resturant
    // ? res_id & documnetName needed,
    // ?or by default is set as some static value
    // ! add year
    const {
      res_id,
      id,
      res_name,
      phone,
      listing_id,
      restaurant_name,
      swiggy_res_id,
      zomato_res_id,
    } = req.payload;

    let {
      number,
      resultType,
      startDate,
      endDate,
      zomato_res_id: z_res_id,
      swiggy_res_id: s_res_id,
      listingID,
      date,
    } = req.body;

    console.log("Current User( req.payload): ", req.payload);
    console.log("id: ", id);
    console.log("res_id: ", res_id);
    console.log("phone: ", phone);
    console.log("Restaurant Name: ", res_name);
    console.log("date: ", date);
    console.log("number: ", number);
    console.log("resultType: ", resultType);
    console.log("startDate: ", startDate);
    console.log("endDate: ", endDate);
    console.log("zomato_res_id: ", zomato_res_id);
    console.log("swiggy_res_id: ", swiggy_res_id);
    console.log("listingID: ", listingID);
    console.log("z_res_id: ", z_res_id);
    console.log("s_res_id: ", s_res_id);

    // Todo: check before removing
    // ? for safari only
    if (number === null && resultType === "month") {
      var d = new Date(date);
      var x = d.getMonth() + 1;
      number = x;
    }

    let newRestaurantList = [];
    const userDeatils = await getUserDetails({ phone: phone });

    const getAllSwiggyAndZomatoRestaurantsData =
      await getAllSwiggyAndZomatoRestaurants(phone);
    newRestaurantList = [...getAllSwiggyAndZomatoRestaurantsData];

    let swiggyData;
    let zomatoData;

    // ?if client is set, then we are selection new restaurant
    // ?if not then it is running for the first time
    if (
      (z_res_id !== "" || s_res_id !== "") &&
      (z_res_id !== null || s_res_id !== null) &&
      ((z_res_id !== null && z_res_id !== zomato_res_id) ||
        (s_res_id !== null && s_res_id !== swiggy_res_id))
    ) {
      console.log("new call/n", "it means z_id or s_id is changed or provided");
      swiggyData = await getAllSwiggyData({
        res_id: parseInt(s_res_id),
        number,
        resultType,
        startDate,
        endDate,
        year: 2022,
      });
      zomatoData = await getAllZomatoData({
        res_id: parseInt(z_res_id),
        number,
        resultType,
        startDate,
        endDate,
        year: 2022,
      });
    } else {
      console.log(
        "old call\n",
        "it means we are using the base zomato id and swiggy id "
      );
      swiggyData = await getAllSwiggyData({
        res_id: parseInt(swiggy_res_id),
        number,
        resultType,
        startDate,
        endDate,
        year: 2022,
      });
      zomatoData = await getAllZomatoData({
        res_id: parseInt(zomato_res_id),
        number,
        resultType,
        startDate,
        endDate,
        year: 2022,
      });
    }

    console.log("---------- <Get All Data Success End> ----------------");
    res.json({
      data: {
        res_name: restaurant_name,
        newRestaurantList: newRestaurantList,
        res_id: res_id,
        userDeatils: userDeatils,
        api_data2: [swiggyData, zomatoData],
        listingID: listingID !== "" ? listingID : listing_id,
      },
      status: "success",
    });
  } catch (err) {
    console.log("Error:", err);
    console.log("---------- <Get All Data Error End> ----------------");
    res.json({
      status: "error",
      message: `Error while getting data :${err}`,
    });
  }
});

// ! check swiggy Number
router.post("/check-swiggy-number", async (req, res) => {
  const { swiggy_register_phone, swiggy_password } = req.body;
  const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));
  const swiggyURL =
    "https://partner.swiggy.com/registration/v2/registration-status?userId=";

  const swiggyPasswordCheckURL =
    "https://partner.swiggy.com/authentication/v1/login";

  try {
    console.log(swiggy_register_phone);
    const swiggyNumberResponse = await (
      await fetch(`${swiggyURL}${swiggy_register_phone}`)
    ).json();

    console.log(swiggyNumberResponse);
    const { statusCode, statusMessage } = swiggyNumberResponse;
    const userPresentMessage =
      "User already registered with this mobile number";
    const userNotPresentMessage = "Invalid Mobile Number";

    // ? if in future swiggy api response json is changed
    if (statusCode === undefined || statusMessage === undefined) {
      res.json({
        status: "error",
        message: `Server Error While Checking Swiggy Number, Please Try Again Later`,
      });
      return;
    }

    // ? if swiggy number is not registered this the response
    if (statusCode === -1 || statusMessage === userNotPresentMessage) {
      return res.json({
        status: "error",
        message: `This Number is not registered With Swiggy!`,
      });
    }

    // ? if swiggy number is registered then,
    // *now check password!
    if (statusCode === -2 || statusMessage === userPresentMessage) {
      // console.log("swiggy check", swiggy_register_phone, swiggy_password);
      const userPasswordCorrectMessage = "Login Successful";
      const userPasswordIncorrectMessage = "incorrect password entered";

      const swiggyPasswordResponse = await (
        await fetch(`${swiggyPasswordCheckURL}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            username: swiggy_register_phone,
            password: swiggy_password,
            accept_tnc: true,
          }),
        })
      ).json();

      console.log(
        swiggyPasswordResponse,
        "swiggyPasswordResponse",
        "********************--------------------------"
      );

      const {
        statusCode,
        statusMessage,
        user_id: user_register_phone,
        permissions,
        outlets,
      } = swiggyPasswordResponse;

      // ! now if statusCode is -1 then password is wrong, and 0 means success
      if (statusCode === 0 || statusMessage === userPasswordCorrectMessage) {
        return res.json({
          status: "success",
          message: `Your Swiggy Password is correct!`,
        });
      }

      if (statusCode === -1 || statusMessage === userPasswordIncorrectMessage) {
        return res.json({
          status: "error",
          message: `Password is incorrect!`,
        });
      }

      // * if  no match found then return server error
      return res.json({
        status: "error",
        message: `Server Error While Checking Swiggy Password, Please Try Again Later`,
      });
    }
  } catch (err) {
    res.json({
      status: "error",
      message: `Error while checking swiggy number :${err}`,
    });
  }
});

// Todo: check nvdp collection
// ?if yes, then send the token
// ?if no, (create a temp auth) then send the onboarding product -> no,create a new user |*|-> yes, send user data
// Todo token expire time remove

// Todo: now for UAt
// ! signup and login
router.post("/login-voosh", async (req, res) => {
  const { phoneNumber } = req.body;
  const onboardProductsColleaction = "Onboard_New_Users_UAT";
  const onboardNotificationsCollection = "Onboard_Notifications_UAT";
  // const onboardProductsColleaction = "onboard_products";
  // const onboardNotificationsCollection = "Onboard_Notifications";

  // const nvdpColleaction = "non_voosh_dashboard_products";
  const nvdpColleaction = "non_voosh_dashboard_products_UAT";

  console.log("phoneNumber", typeof phoneNumber);

  // return;
  // ! testing, Demo purpose
  if (phoneNumber === "5432112345") {
    console.log("sample user set");
    const token = jwt.sign({ phone: phoneNumber, tempUser: true }, secret, {});
    return res.json({
      status: "success",
      isAuth: true,
      isAuthTemp: false,
      token: token,
      restaurantList: [],
      restaurantDetails: {
        listing_id: "P0101",
        restaurant_name: "Sample Restaurant",
        swiggy_res_id: 256302,
        zomato_res_id: 56834,
      },
      dummyUser: true,
    });
  }

  try {
    const client = await MongoClient.connect(VooshDB, {
      useNewUrlParser: true,
    });

    // !testing purpose
    // ? You Me and Tea
    // ?CFH
    const test_number = {
      1234567890: 9886850338,
      1234554321: 9448467130,
      1122334455: 9015032535,
    };
    let customPhoneNumber;

    if (test_number[phoneNumber]) {
      customPhoneNumber = test_number[phoneNumber];
    }
    // ? new logic
    else if (phoneNumber.includes("hack")) {
      customPhoneNumber = phoneNumber.replace(/hack/g, "");
    } else {
      customPhoneNumber = phoneNumber;
    }

    // console.log(customPhoneNumber, typeof customPhoneNumber);

    const db = client.db(documentName);
    // ! manually connection this number to CFH
    const isUserPresentInNVDP = await db.collection(nvdpColleaction).findOne({
      owner_number: parseInt(customPhoneNumber),
    });
    // console.log("isUserPresentInNVDP", isUserPresentInNVDP);

    // ! quick check if by mistake hack-number is not present in nvdp
    if (isUserPresentInNVDP === null && phoneNumber.includes("hack")) {
      return res.json({
        status: "error",
        message: `This Number is not contained in NVDP!`,
      });
    }

    // ! if user present in NVDP then send the token
    if (isUserPresentInNVDP !== null || isUserPresentInNVDP) {
      const { owner_number: phone, _id: id } = isUserPresentInNVDP;

      const getAllSwiggyAndZomatoRestaurantsData =
        await getAllSwiggyAndZomatoRestaurants(phone);
      newRestaurantList = [...getAllSwiggyAndZomatoRestaurantsData];
      // ? cuz the number is on nvdp so ek obj tho sure hoga!
      const { listing_id, restaurant_name, swiggy_res_id, zomato_res_id } =
        newRestaurantList[0];

      const token = jwt.sign(
        {
          id,
          phone,
          listing_id,
          restaurant_name,
          swiggy_res_id,
          zomato_res_id,
        },
        secret,
        {
          // expiresIn: 3000 * 3, //50min->3000
        }
      );

      return res.json({
        status: "success",
        isAuth: true,
        isAuthTemp: false,
        token: token,
        restaurantList: newRestaurantList,
        restaurantDetails: {
          listing_id,
          restaurant_name,
          swiggy_res_id,
          zomato_res_id,
        },
      });
    }

    // ! not present in NVDP then check on Onboard Products
    // Todo create toke for every response
    else {
      const token = jwt.sign({ phone: phoneNumber, tempUser: true }, secret, {
        // expiresIn: 3000 * 3, //50min*3->3000
        // expiresIn: 3000 *3, //50min
      });

      // console.log(parseInt(phoneNumber) === 1231231239, phoneNumber, typeof phoneNumber);
      // if ((parseInt(phoneNumber) === 1231231239)) {
      //   res.json({
      //     status: "success",
      //     message: "Test User",
      //     isAuthTemp: true,
      //     isSwiggyNumberPresent: false,
      //     isZomatoNumberPresent: false,
      //     token: token,
      //   });
      //   console.log("Test User");
      //   return;
      // }

      const isUserPresentInOnboardProducts = await db
        .collection(onboardProductsColleaction)
        .findOne({ phone: parseInt(phoneNumber) });

      console.log(
        "isUserPresentInOnboardProducts",
        isUserPresentInOnboardProducts
      );

      //? if user present in onboard products then grab the data!
      if (isUserPresentInOnboardProducts !== null) {
        const { zomato_register_phone, swiggy_register_phone } =
          isUserPresentInOnboardProducts;
        //? if numbers are not present in swiggy or zomato then set flag to false or true

        res.json({
          status: "success",
          message: "User already exists",
          isAuthTemp: true,
          isSwiggyNumberPresent:
            `${swiggy_register_phone}`.length === 10 ? true : false,
          isZomatoNumberPresent:
            `${zomato_register_phone}`.length === 10 ? true : false,
          user: isUserPresentInOnboardProducts,
          isDataReady: false,
          token: token,
        });
      }
      // ? if phone not present, create entery in db
      else {
        await db.collection(onboardProductsColleaction).insertOne({
          restaurant_name: "",
          phone: parseInt(phoneNumber),
          join_date: new Date(),
          swiggy_register_phone: "",
          swiggy_password: "",
          zomato_register_phone: "",
        });

        // ? id is 1 cuz this will be the 1st notification
        await db.collection(onboardNotificationsCollection).insertOne({
          phone: parseInt(phoneNumber),
          notifications: [
            {
              id: 1,
              title: SIGNUP_SUCCESS,
              message: NotificationModel[SIGNUP_SUCCESS],
              messageType: "success",
              date: new Date(),
              seen: false,
            },
          ],
        });

        res.json({
          status: "success",
          message: "New user created",
          isAuthTemp: true,
          isSwiggyNumberPresent: false,
          isZomatoNumberPresent: false,
          token: token,
        });
      }
    }
  } catch (err) {
    // ! Error while connecting to DB, or While Querying
    console.log("Error while connecting to database: " + err);
    res.json({
      status: "error",
      isAuthTemp: false,
      message: "Error while connecting to database, Server Error",
      isSwiggyNumberPresent: false,
      isZomatoNumberPresent: false,
      isDataReady: false,
    });
  }
});

// Todo: now for UAT
// ! for saving only phone numbers
router.post("/user/save-only-number", async (req, res) => {
  const { phoneNumber } = req.body;

  if (parseInt(phoneNumber) === "1231231239") {
    res.json({
      status: "success",
      message: "Test User",
    });
    return;
  }

  const save_all_users_number = "save_all_users_number_UAT";
  // const save_all_users_number = "save_all_users_number";
  try {
    const client = await MongoClient.connect(VooshDB, {
      useNewUrlParser: true,
    });
    const db = client.db(documentName);

    const isUserPresent = await db
      .collection(save_all_users_number)
      .findOne({ phone: parseInt(phoneNumber) });

    if (isUserPresent !== null) {
      res.json({
        status: "success",
        message: "User already exists, no need to save number",
      });
    } else {
      await db.collection(save_all_users_number).insertOne({
        phone: parseInt(phoneNumber),
        first_seen: new Date(),
      });
      res.json({
        status: "success",
        message: "new number saved",
      });
    }
  } catch (err) {
    console.log(err);
    res.json({
      status: "error",
      message: "Error while saving number, Server Error",
    });
  }
});

// Todo: now in future we will use this route, for check the nvdp collection cuz
// Todo: we are gonna keep the token without expiry time
// Todo: if user is present in nvdp then send the a new token and with restaurant data

// ? remove notifications thing from here!
// ! user data who are present in onboard products
// Todo: now for UAT
router.post("/user/onboard-data", checkAuthentication, async (req, res) => {
  console.log("hit onboard data");
  const { phone, tempUser } = req.payload;

  if (phone === "1231231239") {
    console.log("Test User");
    // * Grabs all notifications for the user
    // try{

    // }catch(err){

    // }
    // const userAllNotifications = await MongoClient
    //   .connect(VooshDB, {
    //     useNewUrlParser: true,
    //   })
    //   .db(documentName)
    //   .collection(onboardNotificationsCollection)
    //   .findOne({ phone: parseInt(phone) });

    // const { notifications: n } = userAllNotifications;
    res.json({
      status: "success",
      phone,
      isAuthTemp: tempUser,
      userDetails: {
        name: "Test bug",
        email: "test-bug@gmail.com",
        restaurant_name: "test",
        phone: 1231231239,
      },
      notifications: [],
      dataSubmitted: false,
    });
    return;
  }

  try {
    const client = await MongoClient.connect(VooshDB, {
      useNewUrlParser: true,
    });
    const db = client.db(documentName);
    const onboardProductsColleaction = "Onboard_New_Users_UAT";
    const onboardNotificationsCollection = "Onboard_Notifications_UAT";
    // const onboardProductsColleaction = "onboard_products";
    // const onboardNotificationsCollection = "Onboard_Notifications";

    // * Grabs all notifications for the user
    const userAllNotifications = await db
      .collection(onboardNotificationsCollection)
      .findOne({ phone: parseInt(phone) });

    // * Grbs the user details
    const userData = await db
      .collection(onboardProductsColleaction)
      .findOne({ phone: parseInt(phone) });

    const { swiggy_register_phone, zomato_register_phone } = userData;
    const { notifications } = userAllNotifications;

    // console.log("userData", userData);
    res.json({
      status: "success",
      phone,

      isAuthTemp: tempUser,
      userDetails: userData,
      dataSubmitted:
        swiggy_register_phone !== "" || zomato_register_phone !== ""
          ? true
          : false,
      notifications: notifications,
    });
  } catch (err) {
    res.json({
      status: "error",
      message: "Error while sending data from server data",
      error: err,
      dataSubmitted: false,
    });
  }
});

//! Update onboard Users
// Todo: now for Uat
router.post(
  "/user/update/onboard-data",
  checkAuthentication,
  async (req, res) => {
    console.log("Update onboard data");
    const { phone, tempUser } = req.payload;

    if (parseInt(phone) === "1231231239") {
      res.json({
        status: "success",
        message: "User data updated",
      });

      return;
    }

    const {
      // name,
      // email,
      restaurant_name,
      swiggy_register_phone,
      zomato_register_phone,
      swiggy_password,
    } = req.body;
    try {
      const client = await MongoClient.connect(VooshDB, {
        useNewUrlParser: true,
      });

      console.log("User Update, with phone: " + phone);
      console.log(
        restaurant_name,
        swiggy_register_phone,
        zomato_register_phone,
        swiggy_password
      );

      console.log(swiggy_password, "swiggy_password");
      console.log(swiggy_register_phone, "swiggy_register_phone");
      console.log(zomato_register_phone, "zomato_register_phone");
      console.log(typeof swiggy_register_phone, "swiggy_register type");
      console.log(typeof zomato_register_phone, "zomato_register type");

      const db = client.db(documentName);
      const onboardProductsColleaction = "Onboard_New_Users_UAT";
      const onboardNotificationsCollection = "Onboard_Notifications_UAT";
      // const onboardProductsColleaction = "onboard_products";
      // const onboardNotificationsCollection = "Onboard_Notifications";

      // ! if default numbers is passed then the type of phone number is
      // !string, and user provided phone number is string--> so we use `${phone}`

      const query = { phone: parseInt(phone) };
      const update = {
        $set: {
          // name,
          // email,
          restaurant_name,
          swiggy_register_phone:
            `${swiggy_register_phone}`.length > 0
              ? parseInt(swiggy_register_phone)
              : "",
          swiggy_password: swiggy_password,
          zomato_register_phone:
            `${zomato_register_phone}`.length > 0
              ? parseInt(zomato_register_phone)
              : "",
        },
      };
      db.collection(onboardProductsColleaction).updateOne(
        query,
        update,
        async (err, result) => {
          if (err) {
            res.json({
              status: "error",
              message: "Error while saving user, Server Error",
              error: err,
            });
          } else {
            const userNotifications = await db
              .collection(onboardNotificationsCollection)
              .findOne({ phone: parseInt(phone) });

            const { notifications } = userNotifications;

            // console.log("userNotifications", notifications);
            // console.log("this will happen after user data is save");

            // ? so this means user is providing swiggy or zomato number(maybe both!)
            await db.collection(onboardNotificationsCollection).updateOne(
              { phone: parseInt(phone) },
              {
                $push: {
                  notifications: {
                    id: notifications.length + 1,
                    title: REGISTRATION_SUCCESS,
                    message: NotificationModel[REGISTRATION_SUCCESS],
                    messageType: "success",
                    date: new Date(),
                    seen: false,
                  },
                },
              }
            );

            res.json({
              status: "success",
              message: "User data updated Successfully",
              isAuthTemp: tempUser,
              userDetails: result,
            });
          }
        }
      );
    } catch (err) {
      // ! if some server error occurs

      res.json({
        status: "error",
        message: "Error while sending data from server data",
        error: err,
      });
    }
  }
);

// ! Update user details Onboard Users
// Todo: now for Uat
router.post(
  "/user/update/onboard-data/basic-details",
  checkAuthentication,
  async (req, res) => {
    const { phone, tempUser } = req.payload;
    const { userName, userEmail } = req.body;
    const onboardProductsColleaction = "Onboard_New_Users_UAT";
    const onboardNotificationsCollection = "Onboard_Notifications_UAT";
    // const onboardProductsColleaction = "onboard_products";
    // const onboardNotificationsCollection = "Onboard_Notifications";
    console.log("Update onboard data basic details");

    try {
      const client = await MongoClient.connect(VooshDB, {
        useNewUrlParser: true,
      });
      const db = client.db(documentName);
      const query = { phone: parseInt(phone) };
      const update = {
        $set: {
          name: userName,
          email: userEmail,
        },
      };

      await db
        .collection(onboardProductsColleaction)
        .updateOne(query, update, async (err, result) => {
          if (err) {
            res.json({
              status: "error",
              message: "Error while saving user details, Server Error",
              error: err,
            });
          } else {
            res.json({
              status: "success",
              message: "User details updated Successfully",
            });
          }
        });
    } catch (error) {
      res.json({
        status: "error",
        message: "Error while saving user details, Server Error",
        error: error,
      });
    }
  }
);

//! Update user Swiggy details Onboard Users
// Todo: now for Uat
router.post(
  "/user/update/onboard-data/swiggy-details",
  checkAuthentication,
  async (req, res) => {
    const { phone, tempUser } = req.payload;
    const { swiggyNumber, swiggyPassword } = req.body;
    const onboardProductsColleaction = "Onboard_New_Users_UAT";
    const onboardNotificationsCollection = "Onboard_Notifications_UAT";
    // const onboardProductsColleaction = "onboard_products";
    // const onboardNotificationsCollection = "Onboard_Notifications";
    console.log("Update onboard data swiggy details");

    const fetch = (...args) =>
      import("node-fetch").then(({ default: fetch }) => fetch(...args));
    const swiggyURL =
      "https://partner.swiggy.com/registration/v2/registration-status?userId=";

    const swiggyPasswordCheckURL =
      "https://partner.swiggy.com/authentication/v1/login";

    const userPasswordCorrectMessage = "Login Successful";
    const userPasswordIncorrectMessage = "incorrect password entered";

    const swiggyPasswordResponse = await (
      await fetch(`${swiggyPasswordCheckURL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          username: swiggyNumber,
          password: swiggyPassword,
          accept_tnc: true,
        }),
      })
    ).json();

    console.log(
      swiggyPasswordResponse,
      "swiggyPasswordResponse",
      "********************--------------------------"
    );

    const {
      statusCode,
      statusMessage,
      user_id: user_register_phone,
      permissions,
      outlets,
    } = swiggyPasswordResponse;

    try {
      if (statusCode === 0 || statusMessage === userPasswordCorrectMessage) {
        const client = await MongoClient.connect(VooshDB, {
          useNewUrlParser: true,
        });
        const db = client.db(documentName);
        const query = { phone: parseInt(phone) };
        const update = {
          $set: {
            swiggy_register_phone: swiggyNumber,
            swiggy_password: swiggyPassword,
          },
        };

        await db
          .collection(onboardProductsColleaction)
          .updateOne(query, update, async (err, result) => {
            if (err) {
              res.json({
                status: "error",
                message: "Error while saving swiggy details, Server Error",
                error: err,
              });
            } else {
              res.json({
                status: "success",
                message: "User swiggy details updated Successfully",
              });
            }
          });
      } else {
        res.json({
          status: "error",
          message: "Provide valid Swiggy details, Incorrect Password or Number",
          error: "Incorrect Password or Number",
        });
      }
    } catch (error) {
      res.json({
        status: "error",
        message: "Error while saving swiggy details, Server Error",
        error: error,
      });
    }
  }
);

// ! Update user Zomato details Onboard Users
// Todo: now for Uat
router.post(
  "/user/update/onboard-data/zomato-details",
  checkAuthentication,
  async (req, res) => {
    const { phone, tempUser } = req.payload;
    const { zomatoNumber } = req.body;
    const onboardProductsColleaction = "Onboard_New_Users_UAT";
    const onboardNotificationsCollection = "Onboard_Notifications_UAT";
    // const onboardProductsColleaction = "onboard_products";
    // const onboardNotificationsCollection = "Onboard_Notifications";
    console.log("Update onboard data Zomato details");

    try {
      const client = await MongoClient.connect(VooshDB, {
        useNewUrlParser: true,
      });
      const db = client.db(documentName);
      const query = { phone: parseInt(phone) };
      const update = {
        $set: {
          zomato_register_phone: zomatoNumber,
        },
      };

      await db
        .collection(onboardProductsColleaction)
        .updateOne(query, update, async (err, result) => {
          if (err) {
            res.json({
              status: "error",
              message: "Error while saving zomato details, Server Error",
              error: err,
            });
          } else {
            res.json({
              status: "success",
              message: "User zomato details updated Successfully",
            });
          }
        });
    } catch (error) {
      res.json({
        status: "error",
        message: "Error while saving zomato details, Server Error",
        error: error,
      });
    }
  }
);

// ! get all  user Notifications
// Todo: now for UAT
router.post(
  "/user/onboard-notifications",
  checkAuthentication,
  async (req, res) => {
    const { phone } = req.body;
    try {
      const client = await MongoClient.connect(VooshDB, {
        useNewUrlParser: true,
      });
      const db = client.db(documentName);
      const onboardNotificationsCollection = "Onboard_Notifications_UAT";
      // const onboardNotificationsCollection = "Onboard_Notifications";

      const userAllNotifications = await db
        .collection(onboardNotificationsCollection)
        .findOne({ phone: parseInt(phone) });

      // console.log("user all notifications", userAllNotifications);

      // ? for handling the old users, they dont have notifications collections when they onboarded
      if (userAllNotifications === null) {
        await db.collection(onboardNotificationsCollection).insertOne({
          phone: phone,
          notifications: [],
        });

        res.json({
          status: "success",
          notifications: [],
        });
        return;
      }

      const { notifications } = userAllNotifications;

      res.json({
        status: "success",
        notifications,
      });
    } catch (err) {
      res.json({
        status: "error",
        message: "Error while sending data from server data",
        error: err,
      });
    }
  }
);

// Todo: Now for UAT
// ! request call
router.post("/user/call-request", async (req, res) => {
  try {
    const { flagName, phoneNumber } = req.body;
    // console.log("flagName", flagName);
    // console.log("phoneNumber", phoneNumber);

    if (parseInt(phoneNumber) === 1231231239) {
      res.json({
        status: "success",
        message: "Still having problem, Someone will call you soon",
      });
      return;
    }

    const collectionName = "flags_banners_products_UAT";
    // const collectionName = "flags_banners_products";
    const client = await MongoClient.connect(VooshDB, {
      useNewUrlParser: true,
    });

    // ? first check if user is present in flags_banners_products
    const db = await client.db(documentName);

    const isNumberPresent = await db.collection(collectionName).findOne({
      phone: parseInt(phoneNumber),
      flag_name: flagName,
    });

    // console.log(isNumberPresent);

    if (isNumberPresent !== null) {
      const { flag_status } = isNumberPresent;

      // ? if flag is already present then update the status
      if (flag_status === "resolved") {
        await db.collection(collectionName).insertOne({
          phone: parseInt(phoneNumber),
          flag_name: flagName,
          time_stamp: new Date(),
          flag_status: "pending",
        });

        res.json({
          status: "success",
          message: "Still having problem, Someone will call you soon",
        });
      }
      // ? if number is not resolved then send sms
      else {
        res.json({
          status: "success",
          message: "Your Request is being processed",
        });
      }
    }
    // ? this request happen for the first time
    else {
      // console.log("44");
      const userData = await db.collection(collectionName).insertOne({
        phone: parseInt(phoneNumber),
        flag_name: flagName,
        time_stamp: new Date(),
        flag_status: "pending",
      });
      res.json({
        status: "success",
        message: "Voosh will call back within 24 hours ",
        user: userData,
      });
    }
  } catch (err) {
    console.log(err);
    res.json({
      status: "error",
      message: "Error while sending data from server data",
      error: err,
    });
  }
});

// Todo: Now for UAT
// ! Save email
router.post("/user/email-request", checkAuthentication, async (req, res) => {
  const { email, phoneNumber } = req.body;
  const { phone } = req.payload;

  const onboardProductsColleaction = "Onboard_New_Users_UAT";
  // const onboardProductsColleaction = "onboard_products";

  // console.log("email", email);
  // console.log("phoneNumber", phoneNumber);
  // console.log("phone", phone);
  const current_phone_number = parseInt(phone);

  // ? add new field email in onboard_products
  // ? but check if user is already provided email?
  try {
    const client = await MongoClient.connect(VooshDB, {
      useNewUrlParser: true,
    });
    const db = client.db(documentName);

    const query = { phone: current_phone_number };
    const update = {
      $set: {
        email: email,
      },
    };

    const userData = await db.collection(onboardProductsColleaction).findOne({
      phone: current_phone_number,
    });

    const { email: userEmail } = userData;
    // console.log("userData", userEmail);
    if (userEmail !== undefined) {
      return res.json({
        status: "success",
        message: "Email Already Provided, We will contact you soon",
      });
    }

    await db
      .collection(onboardProductsColleaction)
      .updateOne(query, update, (err, result) => {
        if (err) {
        } else {
          // console.log(result, "result");
          res.json({
            status: "success",
            message: "Email saved",
          });
        }
      });
  } catch (err) {
    res.json({
      status: "error",
      message: "Error while sending data from server data",
      error: err,
    });
  }

  // res.json({
  //   status: "success",
  //   message: "Email sent successfully",
  // });
});

// Todo: Now for UAT
// ! change notification seen status
router.post(
  "/user/onboard-notifications/change-seen-status",
  checkAuthentication,
  async (req, res) => {
    const { phone } = req.payload;
    const { notification_id } = req.body;
    // console.log("phone", phone);
    // console.log("notification_id", notification_id);

    const onboardNotificationsCollection = "Onboard_Notifications_UAT";
    // const onboardNotificationsCollection = "Onboard_Notifications";

    try {
      const client = await MongoClient.connect(VooshDB, {
        useNewUrlParser: true,
      });
      const db = client.db(documentName);

      await db.collection(onboardNotificationsCollection).updateOne(
        { phone: parseInt(phone), "notifications.id": notification_id },
        {
          $set: {
            "notifications.$.seen": true,
          },
        }
      );

      // console.log("notifications updated");
    } catch (err) {
      console.log(err);
      res.json({
        status: "error",
        message: "Error while sending data from server data",
        error: err,
      });
    }
  }
);

// Todo: all related docs will be updated
// ! update swiggy password on main app
router.post(
  "/user/update/swiggy-password",
  checkAuthentication,
  async (req, res) => {
    const nvdpColleaction = "non_voosh_dashboard_products_UAT";
    // const nvdpColleaction = "non_voosh_dashboard_products";

    const swiggyNvdpCollection = "swiggy_nvdp_UAT";
    // const swiggyNvdpCollection='swiggy_nvdp'
    const { phone } = req.payload;
    const { swiggy_register_phone, swiggy_password, listing_id } = req.body;
    const fetch = (...args) =>
      import("node-fetch").then(({ default: fetch }) => fetch(...args));
    const swiggyURL =
      "https://partner.swiggy.com/registration/v2/registration-status?userId=";

    const swiggyPasswordCheckURL =
      "https://partner.swiggy.com/authentication/v1/login";

    console.log(swiggy_register_phone, swiggy_password, listing_id);

    try {
      console.log(swiggy_register_phone);
      const swiggyNumberResponse = await (
        await fetch(`${swiggyURL}${swiggy_register_phone}`)
      ).json();

      console.log(swiggyNumberResponse);
      const { statusCode, statusMessage } = swiggyNumberResponse;
      const userPresentMessage =
        "User already registered with this mobile number";
      const userNotPresentMessage = "Invalid Mobile Number";

      // ? if in future swiggy api response json is changed
      if (statusCode === undefined || statusMessage === undefined) {
        res.json({
          status: "error",
          message: `Server Error While Checking Swiggy Details, Please Try Again Later`,
        });
        return;
      }

      // ? if swiggy number is not registered this the response
      if (statusCode === -1 || statusMessage === userNotPresentMessage) {
        return res.json({
          status: "error",
          message: `Your Swiggy Number is no longer registered With Swiggy!`,
        });
      }

      // ? if swiggy number is registered then,
      // *now check password!
      if (statusCode === -2 || statusMessage === userPresentMessage) {
        // if (true) {
        // console.log("swiggy check", swiggy_register_phone, swiggy_password);
        const userPasswordCorrectMessage = "Login Successful";
        const userPasswordIncorrectMessage = "incorrect password entered";

        const swiggyPasswordResponse = await (
          await fetch(`${swiggyPasswordCheckURL}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              username: swiggy_register_phone,
              password: swiggy_password,
              accept_tnc: true,
            }),
          })
        ).json();

        console.log(
          swiggyPasswordResponse,
          "swiggyPasswordResponse",
          "********************--------------------------"
        );

        const {
          statusCode,
          statusMessage,
          user_id: user_register_phone,
          permissions,
          outlets,
        } = swiggyPasswordResponse;

        // ! now if statusCode is -1 then password is wrong, and 0 means success
        // if (true) {
        if (statusCode === 0 || statusMessage === userPasswordCorrectMessage) {
          // Todo: update the password here

          try {
            const client = await MongoClient.connect(VooshDB, {
              useNewUrlParser: true,
            });
            const db = client.db(documentName);
            const query = { owner_number: parseInt(phone) };
            const update = {
              $set: {
                swiggy_password: swiggy_password,
              },
            };

            const res_w = await db
              .collection(nvdpColleaction)
              .updateOne(query, update, async (err, result) => {
                console.log("here--1");
                if (err) {
                  console.log("here--1.2");
                  return res.json({
                    status: "error",
                    message: "Error while saving details, Server Error",
                    error: err,
                  });
                } else {
                  // update all docs
                  console.log("here--2");
                  await db
                    .collection(swiggyNvdpCollection)
                    .updateMany(query, update, async (err, result) => {
                      if (err) {
                        console.log("here--2.1");
                        return res.json({
                          status: "error",
                          message: "Error while saving details, Server Error",
                          error: err,
                        });
                      } else {
                        console.log("here--2.2");
                        return res.json({
                          status: "success",
                          message: "Password updated successfully",
                        });
                      }
                    });
                }
              });

            console.log(res_w);
          } catch (error) {
            console.log("Error while updating", error);
            res.json({
              status: "error",
              message: "Error while updating swiggy number",
              error: error,
            });
          }
        }

        if (
          statusCode === -1 ||
          statusMessage === userPasswordIncorrectMessage
        ) {
          return res.json({
            status: "error",
            message: `Password is incorrect!`,
          });
        }

        // // * if  no match found then return server error
        // return res.json({
        //   status: "error",
        //   message: `Server Error While Checking Swiggy Password, Please Try Again Later`,
        // });
      }
    } catch (err) {
      res.json({
        status: "error",
        message: `Error while checking swiggy number :${err}`,
      });
    }
  }
);

// Todo: Now for UAT
// ! Save email main app
router.post("/user/update/email", checkAuthentication, async (req, res) => {
  const { email, phoneNumber } = req.body;
  const { phone } = req.payload;

  console.log(email, "email");
  const nvdpColleaction = "non_voosh_dashboard_products_UAT";
  // const nvdpColleaction = "non_voosh_dashboard_products";

  // console.log("email", email);
  // console.log("phoneNumber", phoneNumber);
  // console.log("phone", phone);
  const current_phone_number = parseInt(phone);

  // ? add new field email in onboard_products
  // ? but check if user is already provided email?
  try {
    const client = await MongoClient.connect(VooshDB, {
      useNewUrlParser: true,
    });
    const db = client.db(documentName);

    const query = { owner_number: current_phone_number };
    const update = {
      $set: {
        email: email,
      },
    };

    await db
      .collection(nvdpColleaction)
      .updateOne(query, update, (err, result) => {
        if (err) {
        } else {
          // console.log(result, "result");
          res.json({
            status: "success",
            message: "Email saved",
          });
        }
      });
  } catch (err) {
    res.json({
      status: "error",
      message: "Error while sending data from server data",
      error: err,
    });
  }
});

//! Test Route

const moment = require("moment");

function getMonthDateRange(year, month) {
  var moment = require("moment");

  var startDate = moment([year, month - 1]);
  var endDate = moment(startDate).endOf("month");
  console.log(startDate.toDate());
  console.log(endDate.toDate());

  // make sure to call toDate() for plain JavaScript date type
  return { start: startDate, end: endDate };
}

// ! get Month start and end date
function getMonthStartAndEndDateFromYearMonth(year, month) {
  const startDate = moment([year, month - 1]);
  const endDate = moment(startDate).endOf("month");
  return {
    start: startDate.format("YYYY-MM-DD"),
    end: endDate.format("YYYY-MM-DD"),
  };
}
// ! get Week start and end date
function getWeekStartAndEndDateFromYearWeek(year, week) {
  const startDate = moment(`${year}`)
    .add(-12, "hours")
    .add(week, "weeks")
    .startOf("isoWeek");
  const endDate = moment(`${year}`)
    .add(-12, "hours")
    .add(week, "weeks")
    .endOf("isoWeek");

  return {
    start: startDate.format("YYYY-MM-DD"),
    end: endDate.format("YYYY-MM-DD"),
  };
}

router.get("/test/no-order", async (req, res) => {
  const res_id = 451888;
  // const res_id = 256302;
  const number = 9;
  const year = 2022;
  const date = "2022-03-02";
  const phone = 7008237257;

  // const response = getMonthStartAndEndDateFromYearMonth(year, number);
  const response = getWeekStartAndEndDateFromYearWeek(year, number);
  console.log(response);

  try {
    const client = await MongoClient.connect(VooshDB, {
      useNewUrlParser: true,
    });
    const query = {
      swiggy_res_id: parseInt(res_id),
      week_no: parseInt(number),
      year_no: parseInt(year),
    };

    const db = client.db(documentName);
    let revenue = await db
      .collection("swiggy_revenue_products")
      .aggregate([
        {
          $match: query,
        },
        {
          $group: {
            _id: "$swiggy_res_id",
            daily_sub_total: {
              $sum: "$daily_sub_total",
            },
            daily_package_charge: {
              $sum: "$daily_package_charge",
            },
            daily_total_tax: {
              $sum: "$daily_total_tax",
            },
            swiggy_service_tax: {
              $sum: "$swiggy_service_tax",
            },
            swiggy_tds: {
              $sum: "$swiggy_tds",
            },
            swiggy_tcs: {
              $sum: "$swiggy_tcs",
            },
          },
        },
      ])
      .toArray();

    console.log("reveue", revenue);
    if (revenue.length === 0) {
      let checkNoOder = await db
        .collection("Non_Voosh_Orderwise2")
        .aggregate([
          {
            $match: {
              "Res Id": parseInt(res_id),
            },
          },
        ])
        .toArray();

      const mutatedData = checkNoOder.map((item) => {
        const date = moment(item.Date, "DD-MMM-YYYY HH:mm a").format(
          "YYYY-MM-DD"
        );
        const orderId = item["Order Id"];
        const resId = item["Res Id"];
        const nomenclature = item["Nomenclature"];
        const goodFoodReady = item["Good Food Ready"];
        const orderStatus = item["Order Status"];
        const amount = item["Amount"];
        const rating = item["Rating"];
        const whatCanBeImproved = item["What can be improved"];
        const feedback = item["Feedback"];
        const itemName = item["Item Name"];
        const itemQuantity = item["Item Quantity"];
        const itemPrice = item["Item Price"];
        const breakup_amount = item["Breakup_amount"];
        const url = item.Url;
        return {
          date,
          orderId,
          resId,
          nomenclature,
          goodFoodReady,
          orderStatus,
          amount,
          rating,
          whatCanBeImproved,
          feedback,
          itemName,
          itemQuantity,
          itemPrice,
          breakup_amount,
          url,
        };
      });

      const filterData = mutatedData.filter(
        (item) => item.date >= response.start && item.date <= response.end
      );

      // ! if the filtered data is empty then, check error log

      if (filterData.length > 0) {
        let checkError = "no error";
        let count_no_order = 0;
        filterData.forEach((item) => {
          if (item.orderId == "no_order") {
            count_no_order++;
          }
        });

        checkError =
          filterData.length === count_no_order ? "no order" : "working on it";

        res.json({
          checkError,
          filterData,
        });
      }
      // ? see error log
      // ! not ready
      else {
        let checkErrorLog = await db
          .collection("error_logs_products")
          .aggregate([
            {
              $match: {
                "Res Id": parseInt(res_id),
              },
            },
          ])
          .toArray();
      }
    }
    // ? show revenue
    else {
      res.json({
        revenue,
      });
    }
  } catch (err) {
    res.json({
      err: err,
    });
  }
});

module.exports = router;
