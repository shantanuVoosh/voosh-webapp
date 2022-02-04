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

const fetch = (...args) =>
import("node-fetch").then(({ default: fetch }) => fetch(...args));


// ! check swiggy Number
router.post("/check-swiggy-number", async (req, res) => {
    const { swiggy_register_phone } = req.body;
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
  

// Todo: now for UAT
// ! for saving only phone numbers
router.post("/user/save-only-number", async (req, res) => {
    const { phoneNumber } = req.body;
  
    if (parseInt(phoneNumber) === "0123401234") {
      res.json({
        status: "success",
        message: "Test User",
      });
      return;
    }
  
    // const save_all_users_number = "save_all_users_number";
    const save_all_users_number = "save_all_users_number_UAT";
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
  // ! user data who are present in onboard products
  
  // Todo: now for UAT
  router.post("/user/onboard-data", checkAuthentication, async (req, res) => {
    console.log("hit onboard data");
    const { phone, tempUser } = req.payload;
  
    if (phone === "0123401234") {
      res.json({
        status: "success",
        phone,
        isAuthTemp: tempUser,
        userDetails: {
          name: "",
          email: "",
          restaurantName: "test",
          phoneNumber: 0123401234,
        },
        dataSubmitted: false,
      });
      return;
    }
  
    try {
      const client = await MongoClient.connect(VooshDB, {
        useNewUrlParser: true,
      });
      const db = client.db(documentName);
      // const onboardProductsColleaction = "onboard_products";
      const onboardProductsColleaction = "Onboard_New_Users_UAT";
  
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
  
  //! Update onboard Users
  // Todo: now for UAT
  router.post(
    "/user/update/onboard-data",
    checkAuthentication,
    async (req, res) => {
      console.log("hit onboard data");
      const { phone, tempUser } = req.payload;
  
      if (parseInt(phone) === "0123401234") {
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
      } = req.body;
      try {
        const client = await MongoClient.connect(VooshDB, {
          useNewUrlParser: true,
        });
        const db = client.db(documentName);
        // const onboardProductsColleaction = "onboard_products";
        const onboardProductsColleaction = "Onboard_New_Users_UAT";
  
        const query = { phone: parseInt(phone) };
        const update = {
          $set: {
            // name,
            // email,
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
  
  // Todo: Now for UAT
  // ! request call
  router.post("/user/call-request", async (req, res) => {
    try {
      const { flagName, phoneNumber } = req.body;
      console.log("flagName", flagName);
      console.log("phoneNumber", phoneNumber);
      
      if (parseInt(phoneNumber) === 0123401234) {
        res.json({
          status: "success",
          message: "Still having problem, Someone will call you soon",
        });
        return;
      }
  
      // const collectionName = "flags_banners_products";
      const collectionName = "flags_banners_products_UAT";
      const client = await MongoClient.connect(VooshDB, {
        useNewUrlParser: true,
      });
  
      // ? first check if user is present in flags_banners_products
      const db = await client.db(documentName);
  
      const isNumberPresent = await db.collection(collectionName).findOne({
        phone: parseInt(phoneNumber),
        flag_name: flagName,
      });
  
      console.log(isNumberPresent);
  
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
      // ? this request happen for the first timne
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
  