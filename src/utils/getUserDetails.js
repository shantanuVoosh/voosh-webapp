const VooshDB =
  "mongodb://analyst:gRn8uXH4tZ1wv@35.244.52.196:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";
const { MongoClient } = require("mongodb");
const documentName = "operationsdb";

async function getUserDetails({phone}) {
  const nvdpColleaction = "non_voosh_dashboard_products";

  console.log("*****************--------------------********************");
  console.log("inside getUserDetails");
  console.log("phone", phone);

  try {
    const client = await MongoClient.connect(VooshDB, {
      useNewUrlParser: true,
    });
    const db = client.db(documentName);
    const userData = await db
      .collection(nvdpColleaction)
      .findOne({ owner_number: phone });

    console.log("userData", userData);

    if (userData) {
      const {
        owner_name,
        owner_number,
        kitchen_id,
        swiggy_password,
        swiggy_register_phone,
        zomato_register_phone,
      } = userData;

      console.log("*****************--------------------********************");

      return {
        owner_name,
        owner_number,
        kitchen_id,
        swiggy_password,
        swiggy_register_phone,
        zomato_register_phone,
      };
    } else {
      console.log("*****************--------------------********************");
      return {
        owner_name: null,
        owner_number: null,
        kitchen_id: null,
        swiggy_password: null,
        swiggy_register_phone: null,
        zomato_register_phone: null,
      };
    }
  } catch (err) {
    console.log(err);
    return err;
  }
}

module.exports = { getUserDetails };
