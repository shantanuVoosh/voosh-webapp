const router = require("express").Router();
const data = require("../fakedata/data");
const { MongoClient } = require("mongodb");
const { getTimeLog } = require("../utils/dateProvide");
const jwt = require("jsonwebtoken");
const {
  getRequiredCollectionDataFromMongodb,
  structureMongodbData,
} = require("../utils/clientDataFormat");
const { getAllRestaurants } = require("../utils/getAllRestaurants");
const { dataProvider } = require("../utils/dataProvider");
// const { getTimeLog } = require("../database/db/mongoDB");

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
    // const db = client.db(documentName).collection(cooleactionName);
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
  const newCollectionName = "Non_Voosh_Onboard_New_Users_1";
  const {
    name,
    phone,
    email,
    restaurant_name,
    swiggy_register_phone,
    swiggy_password,
    swiggy_Id,
    zomato_register_phone,
  } = req.body;

  console.log("name", name);
  console.log("phone", phone);
  console.log("email", email);
  console.log("restaurant_name", restaurant_name);
  console.log("swiggy_id", swiggy_Id);
  console.log("swiggy_register_phone", swiggy_register_phone);
  console.log("swiggy_password", swiggy_password);
  console.log("zomato_register_phone", zomato_register_phone);

  try {
    const client = await MongoClient.connect(VooshDB, {
      useNewUrlParser: true,
    });

    const db = client.db(documentName).collection(newCollectionName);
    const user = await client
      .db(documentName)
      .collection(newCollectionName)
      .findOne({ phone: swiggy_register_phone });

    if (user) {
      return res.json({
        status: "error",
        message: `User Already Exists!`,
        // isAuth: false,
      });
    } else {
      const newUser = await db.insertOne({
        name,
        phone,
        email,
        restaurant_name,
        swiggy_register_phone,
        swiggy_password,
        swiggy_Id,
        zomato_register_phone,
      });
      console.log("newUser", newUser);
      return res.json({
        status: "success",
        message: `User Created Successfully!`,
        // isAuth: false,
      });
    }
  } catch (err) {
    res.json({
      status: "error",
      message: `Error while signup :${err}`,
    });
  }
});

// ! helper for revenue
router.get("/api/rev", async (req, res) => {
  const colleactionName = "swiggy_revenue_products";

  try {
    const client = await MongoClient.connect(VooshDB, {
      useNewUrlParser: true,
    });
    const db = client.db(documentName);
    // const revenue = await db.find({
    //   name: "swiggy_revenue_products",
    //   query: {
    //       swiggy_res_id: 256302,
    //       week_no:48
    //   }

    // });

    const revenue = await db
      .collection(colleactionName)
      .find({
        swiggy_res_id: 256302,
        week_no: 20,
      })
      .toArray();

    const resx = await db
      .collection(colleactionName)
      .aggregate([
        {
          $match: {
            swiggy_res_id: 256302,
            week_no: 48,
          },
        },
        {
          $group: {
            _id: "$week_no",
            total: { $sum: "$final_revenue" },
          },
        },
      ])
      .toArray();

    return res.json({
      status: "success",
      // revenue:revenue[0],
      resx: resx,
    });
  } catch (err) {
    res.json({
      status: "error",
      message: `Error :${err}`,
    });
  }
});

//  Todo: remove this (Helper route! to see the data in the db)
router.get("/helper", async (req, res) => {
  const apiResonpse = await getRequiredCollectionDataFromMongodb(256302);
  const getAllRestaurantsData = await getAllRestaurants();
  const mycustomFun = await dataProvider(272065, "2021-12-23");
  const name = Object.keys(apiResonpse);
  const data = Object.values(apiResonpse).map((item, index) => {
    const obj = {};
    obj[name[index]] = item.slice(Math.max(item.length - 3, 0));
    return obj;
  });
  res.json({
    restaurant_names: getAllRestaurantsData,
    data,
    mycustomFun,
  });
});

router.get;

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
      "Id:",
      id,
      "Res_Id:",
      res_id,
      "Phone:",
      phone,
      "Res_Name:",
      res_name,
    );
    console.log(number, resultType, date, "////////////");

    let restaurantList = [];
    //? then it is a res_id soi only one restaurant
    if (`${phone}`.length < 10 || phone === null || phone === undefined) {
      restaurantList = [{ res_name, res_id }];
    } else {
      //? then it is a phone number so multiple restaurants
      const getAllRestaurantsData = await getAllRestaurants(phone);
      restaurantList = [...getAllRestaurantsData];
    }
    console.log("restaurantList", restaurantList);
    let apiData;
    let apiData2;

    console.log(client_res_id, "client_res_id");
    if (client_res_id.length) {
      // res_id = client_res_id;
      api_data = await dataProvider(parseInt(client_res_id), date);
      console.log("client_res_id-----------------??:", client_res_id);

      api_data2 = await getAllDataFromApi(parseInt(client_res_id), number, resultType);
    } else {
      api_data = await dataProvider(parseInt(res_id), date);

      api_data2 = await getAllDataFromApi(parseInt(res_id), number, resultType);

      console.log("res_id-----------------?:", res_id);
    }

    data[0] = api_data;
    console.log("---------- <Get All Data Success End> ----------------");
    res.json({
      data: {
        api_data: data,
        res_name: res_name,
        restaurantList: restaurantList,
        res_id: res_id,
        api_data2: [api_data2,{name:"Zomato"}],
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
  // console.log("inside login route");
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
// Todo
const { revenueMongoDBData } = require("../collectionFormatter/revenue");

const {
  customerReviewsDataFormatter,
} = require("../collectionFormatter/customerReviews");
const { revenuDataFormatter } = require("../collectionFormatter/revenue");
// ! Test le liye get hoga ye post
router.get("/api/data", async (req, res) => {
  // const {res_id, number, resultType} = req.body;

  const res_id = 256302;
  const number = 51;
  const resultType = "week";
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
    name:"Swiggy",
    operationHealth: oh,
    listingScore: ls,
    revenue_score,
    revenue,
    customerReviews,
  };
}
