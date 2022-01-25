const router = require("express").Router();
const { MongoClient } = require("mongodb");
const { getTimeLog } = require("../utils/dateProvide");
const jwt = require("jsonwebtoken");
const {
  getAllRestaurants,
  getAllSwiggyAndZomatoRestaurants,
} = require("../utils/getAllRestaurants");

// Todo: when Use it, jst change the name!
const {
  checkAuthenticationByGoogle: checkGoogleLogin,
} = require("../controller/googleAuth");
const { checkAuthentication } = require("../controller/checkAuth");

const { getAllSwiggyData } = require("../DataProviders/getAllSwiggyData");
const { getAllZomatoData } = require("../DataProviders/getAllZomatoData");

const VooshDB =
  "mongodb://analyst:gRn8uXH4tZ1wv@35.244.52.196:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";

const documentName = "operationsdb";
const secret = "secret";

// !Login old
router.post("/login", async (req, res) => {
  const { phoneNumber, password } = req.body;
  console.log("---------- <login> ----------------");
  const colleactionName = "non_voosh_dashboard_products";

  try {
    const client = await MongoClient.connect(VooshDB, {
      useNewUrlParser: true,
    });
    const userPresent = await client
      .db(documentName)
      .collection(colleactionName)
      .findOne({
        swiggy_register_phone: Number(phoneNumber),
      });
    const userRes_IdPresent = await client
      .db(documentName)
      .collection(colleactionName)
      .findOne({
        swiggy_res_id: Number(phoneNumber),
      });

    console.log("swiggy_register_phone or swiggy_res_id:", phoneNumber);
    console.log("userRes_IdPresent:", userRes_IdPresent);
    console.log("userPresent:", userPresent);

    if (userPresent === null && userRes_IdPresent === null) {
      console.log("---------- <login End> ----------------");

      return res.json({
        error:
          "Phone Number or Restaurant Id is not Present, Provide A Valid Phone Number or Restaurant Id!",
        status: "error",
        isAuth: false,
      });
    }
    // ! if Phone Number is present, check for password
    else {
      let verifyUser = null;

      if (userPresent) {
        verifyUser = await client
          .db(documentName)
          .collection(colleactionName)
          .findOne({
            swiggy_register_phone: Number(phoneNumber),
            swiggy_password: password,
          });
      } else {
        verifyUser = await client
          .db(documentName)
          .collection(colleactionName)
          .findOne({
            swiggy_res_id: Number(phoneNumber),
            swiggy_password: password,
          });
      }

      //! Both Email and Password are valid
      if (verifyUser) {
        console.log("verifyUser", verifyUser);

        // ? multriple res id will be present in the database
        const id = verifyUser["_id"];
        const res_id = verifyUser["swiggy_res_id"];
        const phone = verifyUser["swiggy_register_phone"];
        const res_name = verifyUser["restaurant_name"];
        console.log(
          "Current User:\n",
          "Id:",
          id,
          "Res_Id:",
          res_id,
          "Phone:",
          phone,
          "Res_Name:",
          res_name
        );
        const token = jwt.sign({ id, res_id, phone, res_name }, secret, {
          expiresIn: 3000 * 3, //50min->3000
        });

        console.log("---------- <login End on Success> ----------------");

        return res.json({
          status: "success",
          token: token,
        });
      }
      // ! Password miss match
      else {
        console.log("---------- <login End on Error> ----------------");
        return res.json({
          status: "error",
          error: `Password was incorrect, Please try again!`,
          isAuth: false,
        });
      }
    }
  } catch (err) {
    // !if request failed
    res.json({
      status: "error",
      message: `Error while login :${err}`,
      isAuth: false,
    });
  }
});

router.post("/user-save-details", async (req, res) => {
  // ?Main Collection
  // const newCollectionName = "onboard_products";
  // ? Test Collection
  const newCollectionName = "Onboard_New_Users_UAT";

  const { name, phone, email, restaurant_name } = req.body;

  try {
    const client = await MongoClient.connect(VooshDB, {
      useNewUrlParser: true,
    });

    const user = await client
      .db(documentName)
      .collection(newCollectionName)
      .insertOne({
        name,
        phone,
        email,
        restaurant_name,
        form_submit_date: new Date(),
      });

    return res.json({
      status: "success",
      message: `User Basic Details Saved Successfully!`,
    });
  } catch (err) {
    res.json({
      status: "error",
      message: `Error while signup :${err}`,
    });
  }
});

// !Signup, if already registered ?
router.post("/signup", async (req, res) => {
  // * only for this Route
  const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));
  // ?Main Collection
  const newCollectionName = "onboard_products";
  // ? Test Collection
  // const newCollectionName = "Onboard_New_Users_UAT";
  const swiggyURL =
    "https://partner.swiggy.com/registration/v2/registration-status?userId=";
  const {
    name,
    phone,
    email,
    restaurant_name,
    swiggy_register_phone,
    swiggy_password,
    zomato_register_phone,
  } = req.body;

  // ? Check if the number is already registered

  try {
    console.log(swiggy_register_phone.length, "swiggy_register_phone");
    console.log(swiggy_register_phone !== "");
    // ? if we have the swiggy_register_phone, then check for the user
    if (swiggy_register_phone !== "") {
      const swiggyResponse = await (
        await fetch(`${swiggyURL}${swiggy_register_phone}`)
      ).json();

      if (
        swiggyResponse.statusCode === -1 ||
        swiggyResponse.statusMessage === "Invalid Mobile Number"
      ) {
        return res.json({
          status: "error",
          message: `This number is not registered with Swiggy!`,
        });
      }
    }

    const client = await MongoClient.connect(VooshDB, {
      useNewUrlParser: true,
    });

    const newUser = await client
      .db(documentName)
      .collection(newCollectionName)
      .insertOne({
        name,
        phone,
        email,
        restaurant_name,
        swiggy_register_phone: parseInt(swiggy_register_phone),
        swiggy_password,
        zomato_register_phone: parseInt(zomato_register_phone),
        join_date: new Date(),
      });
    console.log("newUser", newUser);
    return res.json({
      status: "success",
      message: `User Created Successfully!`,
      // isAuth: false,
    });
  } catch (err) {
    res.json({
      status: "error",
      message: `Error while signup :${err}`,
    });
  }

  // ! removed!
  // try {
  //   const client = await MongoClient.connect(VooshDB, {
  //     useNewUrlParser: true,
  //   });

  //   const db = client.db(documentName).collection(newCollectionName);
  //   const user = await client
  //     .db(documentName)
  //     .collection(newCollectionName)
  //     .findOne({ phone: swiggy_register_phone });

  //   if (user) {
  //     return res.json({
  //       status: "error",
  //       message: `User Already Exists!`,
  //       // isAuth: false,
  //     });
  //   } else {
  //     const newUser = await db.insertOne({
  //       name,
  //       phone,
  //       email,
  //       restaurant_name,
  //       swiggy_register_phone: parseInt(swiggy_register_phone),
  //       swiggy_password,
  //       zomato_register_phone: parseInt(zomato_register_phone),
  //     });
  //     console.log("newUser", newUser);
  //     return res.json({
  //       status: "success",
  //       message: `User Created Successfully!`,
  //       // isAuth: false,
  //     });
  //   }
  // } catch (err) {
  //   res.json({
  //     status: "error",
  //     message: `Error while signup :${err}`,
  //   });
  // }
});

// !Get All Data
router.post("/voosh-data", checkAuthentication, async (req, res) => {
  console.log("---------- <Get All Data Start> ----------------");
  try {
    // TODO get all data from mongodb specified resturant
    // ? res_id & documnetName needed,
    // ?or by default is set as some static value
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
    const date = req.body.date;

    const {
      number,
      resultType,
      startDate,
      endDate,
      zomato_res_id: z_res_id,
      swiggy_res_id: s_res_id,
      listingID,
    } = req.body;

    console.log(
      "Current User:\n",
      "id:",
      id,
      "res_id:",
      res_id,
      "phone:",
      phone,
      "Restaurant Name:",
      res_name,
      "date:",
      date,
      "number:",
      number,
      "resultType:",
      resultType,
      "startDate:",
      startDate,
      "endDate:",
      endDate,
      "zomato_res_id:",
      zomato_res_id,
      "swiggy_res_id:",
      swiggy_res_id,
      "listingID:",
      listingID
    );

    console.log("************************************************");
    console.log(z_res_id, s_res_id, "z_res_id, s_res_id");
    console.log(zomato_res_id, swiggy_res_id, "zomato_res_id, swiggy_res_id");
    console.log("************************************************");

    let newRestaurantList = [];

    const getAllSwiggyAndZomatoRestaurantsData =
      await getAllSwiggyAndZomatoRestaurants(phone);
    newRestaurantList = [...getAllSwiggyAndZomatoRestaurantsData];

    let swiggyData;
    let zomatoData;

    // ?if client is set, then we are selection new restaurant
    // ?if not then it is running for the first time
    if (
      s_res_id !== "" &&
      z_res_id !== "" &&
      zomato_res_id !== z_res_id &&
      swiggy_res_id !== s_res_id
    ) {
      console.log("new call");
      swiggyData = await getAllSwiggyData(
        parseInt(s_res_id),
        number,
        resultType,
        startDate,
        endDate
      );
      zomatoData = await getAllZomatoData(
        parseInt(z_res_id),
        number,
        resultType,
        startDate,
        endDate
      );
    } else {
      console.log("old call");
      swiggyData = await getAllSwiggyData(
        parseInt(swiggy_res_id),
        number,
        resultType,
        startDate,
        endDate
      );
      zomatoData = await getAllZomatoData(
        parseInt(zomato_res_id),
        number,
        resultType,
        startDate,
        endDate
      );
    }

    console.log("---------- <Get All Data Success End> ----------------");
    res.json({
      data: {
        res_name: restaurant_name,
        newRestaurantList: newRestaurantList,
        res_id: res_id,
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
  const { swiggy_register_phone } = req.body;
  const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));
  const swiggyURL =
    "https://partner.swiggy.com/registration/v2/registration-status?userId=";
  try {
    console.log(swiggy_register_phone);
    const swiggyResponse = await (
      await fetch(`${swiggyURL}${swiggy_register_phone}`)
    ).json();

    console.log(swiggyResponse);

    if (
      swiggyResponse.statusCode === -1 ||
      swiggyResponse.statusMessage === "Invalid Mobile Number"
    ) {
      return res.json({
        status: "error",
        message: `This Number is not registered With Swiggy!`,
      });
    } else {
      return res.json({
        status: "success",
        message: swiggyResponse.statusMessage,
      });
    }
  } catch (err) {
    res.json({
      status: "error",
      message: `Error while checking swiggy number :${err}`,
    });
  }
});

router.post("/loginByGoogle", checkGoogleLogin, async (req, res) => {
  const { name, email } = req.payload;
  try {
    const client = await MongoClient.connect(VooshDB, {
      useNewUrlParser: true,
    });
    const db = client.db(documentName).collection(collection);
    const user = await client
      .db(documentName)
      .collection(collection)
      .findOne({ email });

    // ?if user does not exists, create user in DB
    if (user === null) {
      await db.insertOne({ email: email, logs: [] });
      const newUser = await db.findOne({ email });
      // console.log("response", newUser);
      res.json({
        status: "success",
        name,
        email,
        message: "User created",
        isAuth: true,
        user: newUser,
      });
    }
    // ?if user exists, send user info to client
    else {
      const timeLog = getTimeLog();
      await db.updateOne({ email }, { $push: { logs: timeLog } });
      // console.log("login response", user.email);
      res.json({
        status: "success",
        name,
        email,
        message: "User already exists",
        isAuth: true,
        user: user,
      });
    }
  } catch (err) {
    console.log("Error while saving user: " + err);

    res.json({
      status: "error",
      isAuth: false,
      message: "Error while saving log: " + err,
    });
  }
});

// Todo: check nvdp collection
// ?if yes, then send the token
// ?if no, then send the onboarding product -> no,create a new user |*|-> yes, send user data

// ! signup and login
router.post("/login-voosh", async (req, res) => {
  const { phoneNumber } = req.body;
  // const onboardProductsColleaction = "onboard_products";
  // const onboardProductsColleaction = "Onboard_New_Users_UAT";
  const onboardProductsColleaction = "test_users";
  const nvdpColleaction = "non_voosh_dashboard_products";

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
    };
    let customPhoneNumber;

    if (test_number[phoneNumber]) {
      customPhoneNumber = test_number[phoneNumber];
    } else {
      customPhoneNumber = phoneNumber;
    }

    console.log(customPhoneNumber, typeof customPhoneNumber);

    const db = client.db(documentName);
    // ! manually connection this number to CFH
    const isUserPresentInNVDP = await db.collection(nvdpColleaction).findOne({
      owner_number: parseInt(customPhoneNumber),
    });
    console.log("isUserPresentInNVDP", isUserPresentInNVDP);

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
          expiresIn: 3000 * 3, //50min->3000
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
        expiresIn: 3000, //50min
      });

      // // ! Temp Use
      // // Todo : defferd dashboard
      // console.log(parseInt(phoneNumber) === 0123401234, phoneNumber, typeof phoneNumber);
      // if (parseInt(phoneNumber) === 0123401234) {
      //   res.json({
      //     status: "success",
      //     message: "Test User",
      //     isAuthTemp: true,
      //     isSwiggyNumberPresent: false,
      //     isZomatoNumberPresent: false,
      //     token: token,
      //   });
      //   console.log("Test User");
      //   return
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
          name: "",
          email: "",
          restaurant_name: "",
          phone: parseInt(phoneNumber),
          join_date: new Date(),
          swiggy_register_phone: "",
          swiggy_number_resistered_date: "",
          zomato_register_phone: "",
          zomato_number_resistered_date: "",
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
    console.log("Error while saving user: " + err);
    res.json({
      status: "error",
      isAuthTemp: false,
      message: "Error while saving user, Server Error",
      isSwiggyNumberPresent: false,
      isZomatoNumberPresent: false,
      isDataReady: false,
    });
  }
});

router.post("/user/onboard-data", checkAuthentication, async (req, res) => {
  console.log("hit onboard data");
  const { phone, tempUser } = req.payload;
  try {
    const client = await MongoClient.connect(VooshDB, {
      useNewUrlParser: true,
    });
    const db = client.db(documentName);
    // const onboardProductsColleaction = "onboard_products";
    const onboardProductsColleaction = "test_users";

    const userData = await db
      .collection(onboardProductsColleaction)
      .findOne({ phone: parseInt(phone) });

    const { swiggy_register_phone, zomato_register_phone } = userData;

    console.log("userData", userData);
    res.json({
      status: "success",
      phone,
      isAuthTemp: tempUser,
      userDetails: userData,
      dataSubmitted:
        swiggy_register_phone !== "" || zomato_register_phone !== ""
          ? true
          : false,
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

//! Udate onbord Users
router.post(
  "/user/update/onboard-data",
  checkAuthentication,
  async (req, res) => {
    console.log("hit onboard data");
    const { phone, tempUser } = req.payload;
    const {
      name,
      email,
      restaurant_name,
      swiggy_register_phone,
      zomato_register_phone,
    } = req.body;
    try {
      const client = await MongoClient.connect(VooshDB, {
        useNewUrlParser: true,
      });
      const db = client.db(documentName);
      // const onboardProductsColleaction = "onboard_products";
      const onboardProductsColleaction = "test_users";

      const query = { phone: parseInt(phone) };
      const update = {
        $set: {
          name,
          email,
          restaurant_name,
          swiggy_register_phone: parseInt(swiggy_register_phone),
          zomato_register_phone: parseInt(zomato_register_phone),
        },
      };
      db.collection(onboardProductsColleaction).updateOne(
        query,
        update,
        (err, result) => {
          if (err) {
            res.json({
              status: "error",
              message: "Error while saving user, Server Error",
              error: err,
            });
          } else {
            res.json({
              status: "success",
              message: "User data updated",
              isAuthTemp: tempUser,
              userDetails: result,
            });
          }
        }
      );
    } catch (err) {
      res.json({
        status: "error",
        message: "Error while sending data from server data",
        error: err,
      });
    }
  }
);

//! test route
router.post("/test-101", async (req, res) => {
  // const { phone } = req.body;
  // const nvdpColleaction = "non_voosh_dashboard_products";
  // const zomatoNvdpColleaction = "zomato_nvdp";
  // try {
  //   const client = await MongoClient.connect(VooshDB, {
  //     useNewUrlParser: true,
  //   });
  //   const db = client.db(documentName);
  //   const userData = await db.collection(nvdpColleaction).findOne({ phone });
  //   if (userData) {
  //     const { kitchen_id } = userData;
  //     const swiggyData = await db
  //       .collection(nvdpColleaction)
  //       .find({ kitchen_id: kitchen_id })
  //       .toArray();
  //     const zomatoData = await db
  //       .collection(zomatoNvdpColleaction)
  //       .find({ kitchen_id: kitchen_id })
  //       .toArray();
  //     const sLid = swiggyData.map((i) => i.listing_id);
  //     const zLid = zomatoData.map((i) => i.listing_id);
  //     const allIds = [...new Set([...sLid, ...zLid])];
  //     const finalData = allIds.map((Lid, i) => {
  //       const s_data = swiggyData.find((item) => item.listing_id === Lid);
  //       const z_data = zomatoData.find((item) => item.listing_id === Lid);
  //       const swiggy_res_id = s_data?.swiggy_res_id;
  //       const zomato_res_id = z_data?.zomato_res_id;
  //       const restaurant_name =
  //         s_data !== undefined
  //           ? s_data.restaurant_name
  //           : z_data.zomato_nomenclature;
  //       return {
  //         restaurant_name,
  //         listing_id: Lid,
  //         swiggy_res_id: swiggy_res_id === undefined ? null : swiggy_res_id,
  //         zomato_res_id: zomato_res_id === undefined ? null : zomato_res_id,
  //         // swiggy: {
  //         //   ...s_data,
  //         // },
  //         // zomato: {
  //         //   ...z_data,
  //         // },
  //       };
  //     });
  //     res.json({
  //       // swiggy: swiggyData,
  //       // zomato: zomatoData,
  //       // sLid,
  //       // zLid,
  //       // allIds,
  //       finalData,
  //     });
  //   } else {
  //     res.json({
  //       user: userData,
  //     });
  //   }
  // } catch (err) {
  //   // ? if error happens
  //   res.json({
  //     Error: err,
  //   });
  // }
});

router.post("/test-listing", async (req, res) => {
  const { res_id } = req.body;
  const collectionName = "zomato_audit_score";
  try {
    const client = await MongoClient.connect(VooshDB, {
      useNewUrlParser: true,
    });
    const db = client.db(documentName);
    const userData = await db
      .collection(collectionName)
      .findOne({ zomto_res_id: res_id });

    const result = {
      delivery_no_review: userData?.delivery_no_review,
      delivery_review: userData?.delivery_review,
      offer_1: userData?.offer_1,
      offer_2: userData?.offer_2,
      offer_3: userData?.offer_3,
      offer_4: userData?.offer_4,

      beverages_category: userData?.beverages,
      desserts: userData?.dessert,
      safety_tag: userData?.safety,
      //?  .30701754385964913 --> 30%
      Image: userData?.images,
      //?  1 -> 100%
      description: userData?.description,
    };

    res.json({
      user: userData,
    });
  } catch (err) {
    res.json({
      Error: err,
    });
  }
});

module.exports = router;
