const router = require("express").Router();
const { OAuth2Client } = require("google-auth-library");
const data = require("../fakedata/data");
const User = require("../database/models/user");
const { MongoClient } = require("mongodb");
const { getTimeLog } = require("../utils/dateProvide");
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  getRequiredCollectionDataFromMongodb,
  structureMongodbData,
} = require("../utils/clientDataFormat");
const { getAllRestaurants } = require("../utils/getAllRestaurants");
const { dataProvider } = require("../utils/dataProvider");
// const { getTimeLog } = require("../database/db/mongoDB");

// TODO: remove this
const documentName = "operationsdb";
const collection = "users";
const LocalDB = "mongodb://localhost:27017/VooshApp";
const VooshDB =
  "mongodb://analyst:gRn8uXH4tZ1wv@35.244.52.196:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";
// ! dont change the CLIENT_ID to any other name, or it wont work
CLIENT_ID =
  "780953688776-s0jujjc4hmro0jth97edb3o82qis73eq.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);
const secret = "secret";

// !Google Login Middleware
const checkGoogleLogin = async (req, res, next) => {
  // const { token } = req.body;
  // try {
  //   const response = await client.verifyIdToken({
  //     idToken: token,
  //     audience: CLIENT_ID,
  //   });
  //   const { email_verified } = response.payload;
  //   if (email_verified) {
  //     req.payload = response.payload;
  //     next();
  //   } else {
  //     res.json({ status: "error", message: "Token Expired!", isAuth: false });
  //   }
  // } catch (err) {
  //   res.json({
  //     status: "error",
  //     message: `Error while verifyIdToken:${err}`,
  //     isAuth: false,
  //   });
  // }
};

const checkAuthentication = (req, res, next) => {
  const { token } = req.body;
  if (!token) {
    res.json({
      status: "error",
      message: `Please log in no token present!`,
      isAuth: false,
    });
  } else {
    try {
      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          res.json({
            status: "error",
            message: `Error while verifying token:${err}`,
            isAuth: false,
          });
        } else {
          req.payload = decoded;
          // console.log("decoded", decoded);
          // console.log(res_id, id, phone);
          next();
        }
      });
    } catch (err) {
      console.log(err);
    }
  }
};

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
          expiresIn: 3000, //50min->3000
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

// //  Todo: remove this (Helper route! to see the data in the db)
// router.get("/helper", async (req, res) => {
//   const apiResonpse = await getRequiredCollectionDataFromMongodb(256302);
//   const getAllRestaurantsData = await getAllRestaurants();
//   const mycustomFun = await dataProvider(272065, "2021-12-22");
//   const name = Object.keys(apiResonpse);
//   const data = Object.values(apiResonpse).map((item, index) => {
//     const obj = {};
//     obj[name[index]] = item.slice(Math.max(item.length - 3, 0));
//     return obj;
//   });
//   res.json({
//     restaurant_names: getAllRestaurantsData,
//     data,
//     mycustomFun,
//   });
//   // const apiResonpse = await getRequiredCollectionDataFromMongodb();
//   // const results = structureMongodbData(apiResonpse);
//   // res.json(results);
// });


router.get



// !Get All Data
router.post("/voosh-data", checkAuthentication, async (req, res) => {
  console.log("---------- <Get All Data Start> ----------------");
  try {
    // TODO get all data from mongodb specified resturant
    // ? res_id & documnetName needed,
    // ?or by default is set as some static value
    const { res_id, id, res_name, phone } = req.payload;
    const date = req.body.date;
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
      res_name
    );

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
    console.log(client_res_id, "client_res_id");
    if (client_res_id.length) {
      // res_id = client_res_id;
      api_data = await dataProvider(parseInt(client_res_id), date);
      console.log("client_res_id-----------------?", client_res_id);
    } else {
      api_data = await dataProvider(parseInt(res_id), date);
      console.log("res_id-----------------?", res_id);
    }

    // console.log("api_data", api_data[0][]);

    data[0] = api_data;
    console.log("---------- <Get All Data Success End> ----------------");
    res.json({
      data: {
        api_data: data,
        res_name: res_name,
        restaurantList: restaurantList,
        res_id: res_id,
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

// router.post("/api/allreviews", checkAuthentication, async (req, res) => {
//   res.json({
//     status: "success",
//     message: "All Reviews",
//   })
// });

module.exports = router;
