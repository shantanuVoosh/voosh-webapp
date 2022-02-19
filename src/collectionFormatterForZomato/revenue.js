const { MongoClient } = require("mongodb");
const moment = require("moment");
const VooshDB =
  "mongodb://analyst:gRn8uXH4tZ1wv@35.244.52.196:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";
const documentName = "operationsdb";

const previousDay12HoursAgo = () => {
  const m = moment();
  const result = m.add(-12, "hours").add(-1, "days").format("YYYY-MM-DD");
  // console.log(result, "result");
  return result;
};

const revenueScoreFromMongoDB = async (
  res_id,
  number,
  resultType,
  startDate,
  endDate
) => {
  let query = {};

  // ? Query for week
  if (resultType === "week") {
    query = {
      zomato_res_id: parseInt(res_id),
      week_no: parseInt(number),
    };
  }
  // ? Query for month
  else if (resultType === "month") {
    query = {
      zomato_res_id: parseInt(res_id),
      month_no: parseInt(number),
    };
  }
  // ? Custom date range
  else if (resultType === "Custom Range") {
    query = {
      zomato_res_id: parseInt(res_id),
      date: { $gte: startDate, $lte: endDate },
    };
  } else {
    return {
      dataPresent: false,
    };
  }

  try {
    const client = await MongoClient.connect(VooshDB, {
      useNewUrlParser: true,
    });
    const db = client.db(documentName);
    const revenue = await db
      .collection("zomato_revenue_products")
      .aggregate([
        {
          $match: query,
        },
        {
          $group: {
            _id: "$zomato_res_id",
            revenue: {
              $sum: "$day_revenue",
            },
          },
        },
      ])
      .toArray();

    console.log("*****************--------------------********************");
    console.log(
      `Swiggy Revenue of ${
        resultType === "Custom Range"
          ? `Custom Range from ${startDate}-${endDate}`
          : `${resultType} - ${number}`
      }`
    );
    console.log("revenue: ", revenue[0]?.revenue);
    console.log("*****************--------------------********************");

    client.close();
    return {
      revenue_score: revenue[0]?.revenue,
    };
  } catch (err) {
    console.log(err);
    return {
      error: err,
    };
  }
};

// ! in swiggy it is called inside revenueDataOfPreviousMonth function
const getPreviousDaySales = async (res_id) => {
  try {
    const client = await MongoClient.connect(VooshDB, {
      useNewUrlParser: true,
    });
    const db = client.db(documentName);
    const previousDayRevenue = await db
      .collection("zomato_revenue_products")
      .aggregate([
        {
          $match: {
            date: `${previousDay12HoursAgo()}`,
            zomato_res_id: parseInt(res_id),
          },
        },
      ])
      .toArray();

    console.log("*****************--------------------********************");
    console.log("Swiggy Previous Day Revenue - (Swiggy  Previous Day)");
    console.log("Previous Date: ", previousDay12HoursAgo());
    console.log("PreviousDayRevenue: ", previousDayRevenue[0]?.day_revenue);
    console.log("*****************--------------------********************");

    return {
      previousDayRevenue: previousDayRevenue[0]?.day_revenue,
    };
  } catch (err) {
    console.log(err);
    return {
      error: err,
    };
  }
};

module.exports = { revenueScoreFromMongoDB, getPreviousDaySales };
