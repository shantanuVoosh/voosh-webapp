const router = require("express").Router();
const { MongoClient } = require("mongodb");
const { getTimeLog } = require("../utils/dateProvide");
const jwt = require("jsonwebtoken");
const { getAllRestaurants } = require("../utils/getAllRestaurants");

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

// !Login By Phone Number
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
    const { res_id, id, res_name, phone } = req.payload;
    const date = req.body.date;

    const { number, resultType, client_res_id, startDate, endDate } = req.body;

    console.log(
      "Current User:\n",
      "id:",
      id,
      "res_id:",
      res_id,
      "phone:",
      phone,
      "Restaurant Name:",
      res_name
    );
    console.log("Number:", number, "ResultType:", resultType, "Date:", date);

    let restaurantList = [];
    //? then it is a res_id so it will only have one restaurant
    if (`${phone}`.length < 10 || phone === null || phone === undefined) {
      restaurantList = [{ res_name, res_id }];
    }

    //? then it is a phone number so multiple restaurants
    else {
      const getAllRestaurantsData = await getAllRestaurants(phone);
      restaurantList = [...getAllRestaurantsData];
    }
    // console.log("Restaurant List:", restaurantList);
    console.log(client_res_id, "client_res_id");
    let swiggyData;

    // ?if client is set, then we are selection new restaurant
    // ?if not then it is running
    if (client_res_id !== "" && client_res_id !== res_id) {
      console.log(
        "client_res_id(new res_id from the res_id list)----------------->>:",
        client_res_id
      );

      swiggyData = await getAllSwiggyData(
        parseInt(client_res_id),
        number,
        resultType,
        startDate,
        endDate
      );
    } else {
      swiggyData = await getAllSwiggyData(
        parseInt(res_id),
        number,
        resultType,
        startDate,
        endDate
      );

      console.log(
        "res_id(old res_id or static one! )-----------------?:",
        res_id
      );
    }

    console.log("---------- <Get All Data Success End> ----------------");
    res.json({
      data: {
        res_name: res_name,
        restaurantList: restaurantList,
        res_id: res_id,
        api_data2: [swiggyData, { name: "Zomato" }],
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

// !Log User Activity
router.post("/update/user-log", checkAuthentication, async (req, res) => {
  const { email } = req.payload;
  const { location } = req.body;
  try {
    const client = await MongoClient.connect(VooshDB, {
      useNewUrlParser: true,
    });
    const db = client.db(documentName).collection("users");
    await db.updateOne(
      { email },
      { $push: { logs: { page: location, inTime: getTimeLog() } } }
    );

    res.json({ status: "success", message: "Log updated" });
  } catch (err) {
    res.json({ status: "error", message: "Error while saving log: " + err });
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

// ! Test Route

router.get("/api/swiggy-rev", async (req, res) => {
  const res_id = 256302;
  const number = 12;
  const moment = require("moment");
  // ! provide a date which is 1 month 10 days ago
  // ! then get month number from that date
  const prevMonthPlus10Days = moment(new Date())
    .add(-1, "months")
    .add(-10, "days")
    .format("DD-MM-YYYY");
  //in* 11-10-2022
  //op- 01-12-2021

  const customYearNumber = moment(new Date())
    .add(-1, "months")
    .add(-10, "days")
    .year();
  //? Dec -11(month starts from 0-11)
  const customMonthNumber =
    moment(new Date()).add(-1, "months").add(-10, "days").month() + 1;

  console.log("customYearNumber", customYearNumber);
  console.log("customMonthNumber", customMonthNumber);

  try {
    const client = await MongoClient.connect(VooshDB, {
      useNewUrlParser: true,
    });
    const db = client.db(documentName);

    // ? Previous month Swiggy Revenue
    const swiggyReconsilation = await db
      .collection("swiggy_revenue_reconsilation")
      .findOne({
        swiggy_res_id: res_id,
        month_no: customMonthNumber,
        year_no: customYearNumber,
      });

    // ? RDC or total Cancellation for previous month
    const rdc = await db
      .collection("swiggy_rdc_products")
      .aggregate([
        {
          $match: {
            swiggy_res_id: parseInt(res_id),
            month_no: customMonthNumber,
          },
        },
        {
          $group: {
            _id: "$swiggy_res_id",
            rdc_score: { $sum: "$total_cancellation" },
          },
        },
      ])
      .toArray();
    // ? If data is not available send this
    if (swiggyReconsilation === null || swiggyReconsilation === undefined) {
      res.json({
        isDataPresent: false,
        totalCancellation: 0,
        totalSales: 0,
        netPayout: 0,
        deleveries: 0,
        cancelledOrders: 0,
        deductions: {},
      });
      return;
    }

    // ? If data is available send this

    const totalCancellation = rdc[0]?.rdc_score;
    const totalSales = swiggyReconsilation["total_customer_payable "];
    const netPayout = swiggyReconsilation["net_payout_(E_-_F_-_G)"];
    const deleveries = swiggyReconsilation["number_of_orders"];
    const cancelledOrders = totalCancellation ? totalCancellation : 0;
    const deductions = {
      // ?latform Services Charges
      "Platform Services Charges": parseFloat(
        (
          swiggyReconsilation?.["swiggy_platform_service_fee"] * 1.18 -
          swiggyReconsilation?.["discount_on_swiggy_service_fee"] * 1.18
        ).toFixed(2)
      ),
      // ? Cancellation Deduction
      "Canellation Deduction": parseFloat(
        (
          swiggyReconsilation?.["merchant_cancellation_charges"] * 1.18 +
          swiggyReconsilation?.["merchant_sare_of_cancelled_orders"]
        ).toFixed(2)
      ),
      // ? Other OFD deduction
      "Other OFD deduction": parseFloat(
        (
          swiggyReconsilation?.["collection_charges"] * 1.18 +
          swiggyReconsilation?.["access_charges"] * 1.18 +
          swiggyReconsilation?.["call_center_service_fee"] * 1.18
        ).toFixed(2)
      ),

      // ? Promotions
      Promotions: parseFloat(
        (
          swiggyReconsilation?.["high_priority"] +
          swiggyReconsilation?.["homepage_banner"]
        ).toFixed(2)
      ),

      // ? Previous Week Outstanding
      "Previous Week Outstanding": parseFloat(
        (
          swiggyReconsilation?.["outstanding_for_previous_weeks"] +
          swiggyReconsilation?.["excess_payout"]
        ).toFixed(2)
      ),

      // ? Miscellaneous
      Miscellaneous: parseFloat(
        (
          swiggyReconsilation?.["cash_pre-payment_to_merchant"] +
          swiggyReconsilation?.["delivery_fee_sponsored_by_merchant"] +
          swiggyReconsilation?.["refund_for_disputed_orders"] +
          swiggyReconsilation?.["refund"] +
          swiggyReconsilation?.["onboarding_fees"] +
          Math.abs(swiggyReconsilation?.["long_distance_pack_fee"])
        ).toFixed(2)
      ),

      // ? TCS
      TCS: parseFloat((swiggyReconsilation?.["tcs"]).toFixed(2)),
      // ? TDS
      TDS: parseFloat((swiggyReconsilation?.["tds"]).toFixed(2)),
    };

    res.json({
      swiggyReconsilation,
      totalSales,
      netPayout,
      deleveries,
      cancelledOrders,
      deductions,
    });
  } catch (err) {
    console.log(err);
    res.json({
      status: "error",
      message: "Error while getting data: " + err,
    });
  }
});
router.get("/api/zomato", async (req, res) => {
  const res_id = 56834;
  const number = 1;
  const resultType = "week";
  const startDate = "2021-12-01";
  const endDate = "2022-01-06";

  try {
    const ZomatoData = await getAllZomatoData(res_id, number, resultType);

    res.json({
      ZomatoData,
    });
  } catch (err) {
    console.log(err);
    res.json({
      status: "error",
      message: "Error while getting data: " + err,
    });
  }
});

router.get("/api/ls-test", async (req, res) => {
  const documentName = "operationsdb";
  const VooshDB =
    "mongodb://analyst:gRn8uXH4tZ1wv@35.244.52.196:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";

  // ! Get the most recent data
  // ? year->current year, sort month descending, and sort week descending
  const client = await MongoClient.connect(VooshDB, {
    useNewUrlParser: true,
  });
  const db = client.db(documentName);

  const lss = await db
    .collection("swiggy_weekly_listing_score_products")
    .aggregate([
      {
        $match: {
          swiggy_res_id: `256302`,
        },
      },
      { $sort: { year_no: -1, month_no: -1, week_no: -1 } },
      { $limit: 1 },
    ])
    .toArray();

  res.json({
    lss,
  });

  try {
  } catch (err) {
    console.log(err);
    res.json({
      status: "error",
      message: "Error while getting data: " + err,
    });
  }
});

module.exports = router;
