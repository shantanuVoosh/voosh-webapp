const VooshDB =
  "mongodb://analyst:gRn8uXH4tZ1wv@35.244.52.196:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";
const { MongoClient } = require("mongodb");
const documentName = "operationsdb";

async function getAllRestaurants(phoneNumber = 9886850338) {
  const collectionName = "non_voosh_dashboard_products";
  console.log("---------- <getAllRestaurants> ----------------");
  try {
    const client = await MongoClient.connect(VooshDB, {
      useNewUrlParser: true,
    });
    const db = await client.db(documentName);
    const data = await db
      .collection(collectionName)
      .find({
        swiggy_register_phone: Number(phoneNumber),
      })
      .toArray();

    console.log(
      "Hard coded phone number: 9886850338\n",
      `current user number: ${phoneNumber}`
    );

    const restaurantList = data.map((item, index) => {
      const res_id = item["swiggy_res_id"];
      const res_name = item["nomenclature"];
      // console.log(` res_id: ${res_id} - res_name: ${res_name}`);

      return { res_id, res_name };
    });
    // console.log("restaurantList:", restaurantList);
    console.log("---------- END-----------------");

    return restaurantList;
  } catch (err) {
    console.log(err);
    console.log("---------- END-----------------");

    return err;
  }
}

async function getAllSwiggyAndZomatoRestaurants(phone) {
  const nvdpColleaction = "non_voosh_dashboard_products";
  const swiggyNvdpColleaction = "swiggy_nvdp";
  const zomatoNvdpColleaction = "zomato_nvdp";
  try {
    const client = await MongoClient.connect(VooshDB, {
      useNewUrlParser: true,
    });
    const db = client.db(documentName);
    const userData = await db.collection(nvdpColleaction).findOne({ owner_number:phone });

    if (userData) {
      const { kitchen_id } = userData;

      const swiggyData = await db
        .collection(swiggyNvdpColleaction)
        .find({ kitchen_id: kitchen_id })
        .toArray();

      const zomatoData = await db
        .collection(zomatoNvdpColleaction)
        .find({ kitchen_id: kitchen_id })
        .toArray();

      const sLid = swiggyData.map((i) => i.listing_id);
      const zLid = zomatoData.map((i) => i.listing_id);
      const allIds = [...new Set([...sLid, ...zLid])];
      // ? array of objects [{listing_id: 123, restaurant_name: "abc", swiggy_res_id:256302, zomato_res_id:56834}, ...]
      // * if swiggy_res_id or zomato_res_id is not present, then it will be null
      const finalData = allIds.map((Lid, i) => {
        const s_data = swiggyData.find((item) => item.listing_id === Lid);
        const z_data = zomatoData.find((item) => item.listing_id === Lid);
        const swiggy_res_id = s_data?.swiggy_res_id;
        const zomato_res_id = z_data?.zomato_res_id;
        const restaurant_name =
          s_data !== undefined
            ? s_data.nomenclature
            : z_data.zomato_nomenclature;

        return {
          restaurant_name,
          listing_id: Lid,
          swiggy_res_id: swiggy_res_id === undefined ? null : swiggy_res_id,
          zomato_res_id: zomato_res_id === undefined ? null : zomato_res_id,
          // swiggy: {
          //   ...s_data,
          // },
          // zomato: {
          //   ...z_data,
          // },
        };
      });

      console.log("finalData:", finalData);

      return finalData;
    }
  } catch (err) {
    console.log(err);
    return err;
  }
}

module.exports = { getAllRestaurants, getAllSwiggyAndZomatoRestaurants };
