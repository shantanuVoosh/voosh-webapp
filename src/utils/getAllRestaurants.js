const VooshDB =
  "mongodb://analyst:gRn8uXH4tZ1wv@35.244.52.196:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";
const { MongoClient } = require("mongodb");

async function getAllRestaurants(phoneNumber = 9886850338) {
  const documentName = "operationsdb";
  const collectionName = "Non_Voosh_Listing_Dashboard_Products";
  console.log("---------- <getAllRestaurants> ----------------");
  try {
    const client = await MongoClient.connect(VooshDB, {
      useNewUrlParser: true,
    });
    const db = await client.db(documentName);
    const data = await db
      .collection(collectionName)
      .find({
        "Swiggy Login Ph No": `${phoneNumber}`,
      })
      .toArray();

    console.log(
      "Hard coded phone number: 9886850338\n",
      `current user number: ${phoneNumber}`
    );

    const restaurantList = data.map((item, index) => {
      const res_id = item["Swiggy Res Id"];
      const res_name = item["Partner Restaurant Name "];
      console.log(` res_id: ${res_id} - res_name: ${res_name}`);

      return { res_id, res_name };
    });
    console.log("restaurantList:", restaurantList);
    console.log("---------- END-----------------");

    return restaurantList;
  } catch (err) {
    console.log(err);
    console.log("---------- END-----------------");

    return err;
  }
}

module.exports = { getAllRestaurants };
