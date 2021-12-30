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

const VooshDB =
  "mongodb://analyst:gRn8uXH4tZ1wv@35.244.52.196:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";

const documentName = "operationsdb";
const secret = "secret";

// !Login By Phone Number
router.post("/login", async (req, res) => {
  const { phoneNumber, password } = req.body;
  console.log("---------- <login> ----------------");
  const cooleactionName = "Non_Voosh_Listing_Dashboard_Products";

  try {
    const client = await MongoClient.connect(VooshDB, {
      useNewUrlParser: true,
    });
    const userPresent = await client
      .db(documentName)
      .collection(cooleactionName)
      .findOne({
        "Swiggy Login Ph No": phoneNumber,
      });
    const userRes_IdPresent = await client
      .db(documentName)
      .collection(cooleactionName)
      .findOne({
        "Swiggy Res Id": phoneNumber,
      });

    console.log("phoneNumber or res_id:", phoneNumber);
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
          .collection(cooleactionName)
          .findOne({
            "Swiggy Login Ph No": phoneNumber,
            "Swiggy Password": password,
          });
      } else {
        verifyUser = await client
          .db(documentName)
          .collection(cooleactionName)
          .findOne({
            "Swiggy Res Id": phoneNumber,
            "Swiggy Password": password,
          });
      }

      //! Both Email and Password are valid
      if (verifyUser) {
        console.log("verifyUser", verifyUser);

        // ? multriple res id will be present in the database
        const id = verifyUser["_id"];
        const res_id = verifyUser["Swiggy Res Id"];
        const phone = verifyUser["Swiggy Login Ph No"];
        const res_name = verifyUser["Partner Restaurant Name "];
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

// !Signup, if already registered ?
router.post("/signup", async (req, res) => {
  const newCollectionName = "onboard_products";
  const {
    name,
    phone,
    email,
    restaurant_name,
    swiggy_register_phone,
    swiggy_password,
    zomato_register_phone,
  } = req.body;
  console.log("inside api!");
  console.log("name", name);
  console.log("phone", phone);
  console.log("email", email);
  console.log("restaurant_name", restaurant_name);
  console.log("swiggy_register_phone", swiggy_register_phone);
  console.log("swiggy_password", swiggy_password);
  console.log("zomato_register_phone", zomato_register_phone);

  try {
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

    const number = req.body.number;
    const resultType = req.body.resultType;

    const client_res_id = req.body.client_res_id;
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
    //? then it is a res_id soit will only have one restaurant
    if (`${phone}`.length < 10 || phone === null || phone === undefined) {
      restaurantList = [{ res_name, res_id }];
    }

    //? then it is a phone number so multiple restaurants
    else {
      const getAllRestaurantsData = await getAllRestaurants(phone);
      restaurantList = [...getAllRestaurantsData];
    }
    console.log("Restaurant List:", restaurantList);
    console.log(client_res_id, "client_res_id");
    let api_data2;

    if (client_res_id.length) {
      console.log("client_res_id-----------------??:", client_res_id);

      api_data2 = await getAllDataFromApi(
        parseInt(client_res_id),
        number,
        resultType
      );
    } else {
      api_data2 = await getAllDataFromApi(parseInt(res_id), number, resultType);

      console.log("res_id-----------------?:", res_id);
    }

    console.log("---------- <Get All Data Success End> ----------------");
    res.json({
      data: {
        res_name: res_name,
        restaurantList: restaurantList,
        res_id: res_id,
        api_data2: [api_data2, { name: "Zomato" }],
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

const {
  operationHealthDataFormatter,
} = require("../collectionFormatter/operationalHealth");
const {
  listingScoreDataFormatter,
} = require("../collectionFormatter/listingScore");
const { revenueMongoDBData } = require("../collectionFormatter/revenue");

const {
  customerReviewsDataFormatter,
} = require("../collectionFormatter/customerReviews");
const { revenuDataFormatter } = require("../collectionFormatter/revenue");

// ! Test Route
router.get("/api/data", async (req, res) => {
  // const {res_id, number, resultType} = req.body;

  // const res_id = 256302;
  // const number = 52;
  // const resultType = "week";
  // const res_id = 272065;
  // const number = 51;
  // const resultType = "week";
  // const res_id = 272065;
  // const number = 12;
  // const resultType = "month";

  const oh = await operationHealthDataFormatter(res_id, number, resultType);
  const ls = await listingScoreDataFormatter(res_id, number, resultType);
  const customerReviews = await customerReviewsDataFormatter(
    res_id,
    number,
    resultType
  );
  const revenue = await revenueMongoDBData(res_id, number, resultType);
  const f_revenue = await revenuDataFormatter(res_id, number, resultType);

  res.json({
    operationHealth: oh,
    listingScore: ls,
    revenue,
    f_revenue,
    customerReviews,
  });
});

module.exports = router;

async function getAllDataFromApi(res_id, number, resultType) {
  const oh = await operationHealthDataFormatter(res_id, number, resultType);
  const ls = await listingScoreDataFormatter(res_id, number, resultType);
  const customerReviews = await customerReviewsDataFormatter(
    res_id,
    number,
    resultType
  );
  const revenue_score = await revenueMongoDBData(res_id, number, resultType);
  const revenue = await revenuDataFormatter(res_id, number, resultType);
  return {
    name: "Swiggy",
    operationHealth: oh,
    listingScore: ls,
    revenue_score,
    revenue,
    customerReviews,
  };
}
