const { MongoClient } = require("mongodb");
const { video_urls } = require("../utils/traning_video_urls");
const { RDC_video, Serviceability_video, MFR_video, Ratings_video } =
  video_urls;
const VooshDB =
  "mongodb://analyst:gRn8uXH4tZ1wv@35.244.52.196:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";
const documentName = "operationsdb";

const getYesterdayDateBefore12HoursAgo = () => {
  // const time = new Date();
  const tenHoursBefore = new Date();
  tenHoursBefore.setHours(tenHoursBefore.getHours() - 12);
  // console.log("Day:", tenHoursBefore.getDate(), "tenHoursBefore");
  const format =
    tenHoursBefore.getFullYear() +
    "-" +
    (tenHoursBefore.getMonth() + 1) +
    "-" +
    (tenHoursBefore.getDate() - 1);
  return format;
};


function getPrevMonth() {
  var d = new Date();
  var month = d.getMonth();
  return month;
}

const revenueMongoDBData = async (res_id, number, resultType) => {
  let query = {};

  // ? Query for week
  if (resultType === "week") {
    query = {
      swiggy_res_id: parseInt(res_id),
      week_no: parseInt(number),
    };
  } else if (resultType === "month") {
    query = {
      swiggy_res_id: parseInt(res_id),
      month_no: parseInt(number),
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
      .collection("swiggy_revenue_products")
      .aggregate([
        {
          $match: query,
        },
        {
          $group: {
            _id: "$swiggy_res_id",
            revenue: {
              $sum: "$final_revenue",
            },
          },
        },
      ])
      .toArray();

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

const getPreviousDaySales = async (res_id) => {
  try {
    const client = await MongoClient.connect(VooshDB, {
      useNewUrlParser: true,
    });
    const db = client.db(documentName);
    console.log("date time yyy", getYesterdayDateBefore12HoursAgo());
    const previousDayRevenue = await db
      .collection("swiggy_revenue_products")
      .aggregate([
        {
          $match: {
            date: getYesterdayDateBefore12HoursAgo(),
            swiggy_res_id: parseInt(res_id),
          },
        },
      ])
      .toArray();

    // console.log(
    //   "previousDaySales:",
    //   previousDayRevenue,
    //   "previousDayDate:",
    //   getPreviousDay12HoursAgo()
    // );
    return {
      previousDayRevenue: previousDayRevenue[0]?.final_revenue,
    };
  } catch (err) {
    console.log(err);
    return {
      error: err,
    };
  }
};

const revenueFinancical = async (res_id, number, resultType) => {
  try {
    const client = await MongoClient.connect(VooshDB, {
      useNewUrlParser: true,
    });
    const db = client.db(documentName);

    // ?Previous month
    const revenue_financical = await db
      .collection("NON_Voosh_swiggy_reconsilation")
      .aggregate([
        {
          $match: {
            Swiggy_id: res_id,
          },
        },
      ])
      .toArray();

    // ? RDC previous month
    const rdc = await db
      .collection("swiggy_rdc_products")
      .aggregate([
        {
          $match: {
            swiggy_res_id: parseInt(res_id),
            month_no: getPrevMonth(),
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

    // console.log("rdc----------------->", rdc);

    client.close();
    return {
      revenue_financical: revenue_financical[0],
      rdc_score: rdc[0]?.rdc_score,
    };
  } catch (err) {
    console.log(err);
    return {
      error: err,
    };
  }
};

const revenuDataFormatter = async (res_id, number, resultType) => {
  const { revenue_score } = await revenueMongoDBData(
    res_id,
    number,
    resultType
  );
  const { revenue_financical, rdc_score } = await revenueFinancical(
    res_id,
    number,
    resultType
  );

  const { previousDayRevenue } = await getPreviousDaySales(res_id);

  // console.log("revenue_score:", revenue_score);
  // console.log("revenue_financical:", revenue_financical);
  // console.log(
  //   "previousDayRevenue:------------------------->",
  //   previousDayRevenue
  // );

  const totalSales = isObjectEmpty(revenue_financical)
    ? "Please wait! We are working on It."
    : revenue_financical["Total Customer Payable "];
  const netPayout = isObjectEmpty(revenue_financical)
    ? "Please wait! We are working on It."
    : revenue_financical["Net Payout  (E - F - G)"];
  const deleveries = isObjectEmpty(revenue_financical)
    ? "Please wait! We are working on It."
    : revenue_financical["Number of orders"];
  const cancelledOrders = rdc_score
    ? parseFloat(rdc_score.toFixed(2))
    : "Please wait! We are working on It.";

  let deductions = {};

  if (isObjectEmpty(revenue_financical)) {
    deductions = {
      "Platform Services Charges": "Please wait! We are working on It.",

      "Cancellation Deduction": "Please wait! We are working on It.",
      "Other OFD deduction": "Please wait! We are working on It.",

      Promotions: "Please wait! We are working on It.",

      "Previous Week Outstanding": "Please wait! We are working on It.",

      Miscellaneous: "Please wait! We are working on It.",

      TCS: "Please wait! We are working on It.",
      TDS: "Please wait! We are working on It.",
    };
  } else {
    deductions = {
      "Platform Services Charges":
        revenue_financical["Swiggy Platform Service Fee"] * 1.18 +
        revenue_financical["Discount on Swiggy Service Fee"] * 1.18,

      "Cancellation Deduction":
        revenue_financical["Merchant Cancellation Charges"] * 1.18 +
        revenue_financical["Merchant Share Of Cancelled Orders"],

      "Other OFD deduction":
        revenue_financical["Collection Charges"] * 1.18 +
        revenue_financical["Access Charges"] * 1.18 +
        revenue_financical["Call Center Service Fee"] * 1.18,

      Promotions:
        revenue_financical["High Priority"] +
        revenue_financical["Homepage Banner"],

      "Previous Week Outstanding":
        revenue_financical["Outstanding For Previous Weeks"] +
        revenue_financical["Excess payout"],

      Miscellaneous:
        revenue_financical["Cash Pre-Payment to Merchant"] +
        revenue_financical["Delivery Fee Sponsored By Merchant"] +
        revenue_financical["Refund for Disputed Orders"] +
        revenue_financical["Refund"] +
        revenue_financical["Onboarding Fees"] +
        Math.abs(revenue_financical["Long Distance Pack Fee"]),

      TCS: revenue_financical["TCS"],
      TDS: revenue_financical["TDS"],
    };
  }

  const revenueFinalResult = {
    value: revenue_score,
    previousDayRevenue: previousDayRevenue,

    financicalData: {
      totalSales: totalSales,
      netPayout: netPayout,
      deleveries: deleveries,
      cancelledOrders: cancelledOrders,
      deductions: deductions,
    },
  };

  return revenueFinalResult;
};

module.exports = {
  revenueMongoDBData,
  revenuDataFormatter,
};

function isObjectEmpty(obj) {
  if (obj === undefined || obj === null) return true;
  return Object.keys(obj).length === 0;
}
