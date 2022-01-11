const { MongoClient } = require("mongodb");
const moment = require("moment");
const { video_urls } = require("../utils/traning_video_urls");
const { RDC_video, Serviceability_video, MFR_video, Ratings_video } =
  video_urls;
const VooshDB =
  "mongodb://analyst:gRn8uXH4tZ1wv@35.244.52.196:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";
const documentName = "operationsdb";

const previousDay12HoursAgo = () => {
  const m = moment();
  const result = m.add(-12, "hours").add(-1, "days").format("YYYY-MM-DD");
  console.log(result, "result");
  return result;
};

function getPrevMonth() {
  let d = new Date();
  let month = d.getMonth() === 0 ? 12 : d.getMonth();
  return month;
}

const revenueMongoDBData = async (
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
      swiggy_res_id: parseInt(res_id),
      week_no: parseInt(number),
    };
  }
  // ? Query for month
  else if (resultType === "month") {
    query = {
      swiggy_res_id: parseInt(res_id),
      month_no: parseInt(number),
    };
  }
  // ? Custom date range
  else if (resultType === "Custom Range") {
    query = {
      swiggy_res_id: parseInt(res_id),
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
  console.log("for prev day sale/revenue: yyyy-mm-dd", previousDay12HoursAgo());
  try {
    const client = await MongoClient.connect(VooshDB, {
      useNewUrlParser: true,
    });
    const db = client.db(documentName);
    const previousDayRevenue = await db
      .collection("swiggy_revenue_products")
      .aggregate([
        {
          $match: {
            date: `${previousDay12HoursAgo()}`,
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
            // month_no: 11,
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

const revenuDataFormatter = async (
  res_id,
  number,
  resultType,
  startDate,
  endDate
) => {
  const { revenue_score } = await revenueMongoDBData(
    res_id,
    number,
    resultType,
    startDate,
    endDate
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
    // ? suppose this this 1st day oft the month so the revenue is 0
    value: revenue_score ? revenue_score : 0,
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

// ! only month wise data is available
async function getBlaBla(res_id = 256302, number = 12, resultType = "month") {
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
        month_no: getPrevMonth(),
      });

    // ? RDC or total Cancellation for previous month
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
    const totalCancellation = rdc[0]?.rdc_score;
    const totalSales = swiggyReconsilation["total_customer_payable "];
    const netPayout = swiggyReconsilation["net_payout_(E_-_F_-_G)"];
    const deleveries = swiggyReconsilation["number_of_orders"];
    const cancelledOrders = totalCancellation ? totalCancellation : 0;
    const deductions = {
      // ?latform Services Charges
      "Platform Services Charges":
        swiggyReconsilation?.["swiggy_platform_service_fee"] * 1.18 -
        swiggyReconsilation?.["discount_on_swiggy_service_fee"] * 1.18,
      // ? Cancellation Deduction
      "Canellation Deduction":
        swiggyReconsilation?.["merchant_cancellation_charges"] * 1.18 +
        swiggyReconsilation?.["merchant_sare_of_cancelled_orders"],
      // ? Other OFD deduction
      "Other OFD deduction":
        swiggyReconsilation?.["collection_charges"] * 1.18 +
        swiggyReconsilation?.["access_charges"] * 1.18 +
        swiggyReconsilation?.["call_center_service_fee"] * 1.18,

      // ? Promotions
      Promotions:
        swiggyReconsilation?.["high_priority"] +
        swiggyReconsilation?.["homepage_banner"],

      // ? Previous Week Outstanding
      "Previous Week Outstanding":
        swiggyReconsilation?.["outstanding_for_previous_weeks"] +
        swiggyReconsilation?.["excess_payout"],
      
      // ? Miscellaneous
      Miscellaneous:
        swiggyReconsilation?.["cash_pre-payment_to_merchant"] +
        swiggyReconsilation?.["delivery_fee_sponsored_by_merchant"] +
        swiggyReconsilation?.["refund_for_disputed_orders"] +
        swiggyReconsilation?.["refund"] +
        swiggyReconsilation?.["onboarding_fees"] +
        Math.abs(swiggyReconsilation?.["long_distance_pack_fee"]),

      // ? TCS
      TCS: swiggyReconsilation?.["tcs"],
      // ? TDS
      TDS: swiggyReconsilation?.["tds"],

    };

    return {
      totalSales,
      netPayout,
      deleveries,
      cancelledOrders,
      deductions,
    };
  } catch (err) {
    console.log(err);
  }
}
