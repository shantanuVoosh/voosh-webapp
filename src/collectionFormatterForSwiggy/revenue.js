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

  // console.log(res_id, "revenue res_id---------->");

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
              $sum: "$daily_total_revenue",
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

const getPreviousDaySales = async (res_id) => {
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

    console.log("*****************--------------------********************");
    console.log("Swiggy Previous Day Revenue - (Swiggy  Previous Day)");
    console.log("Previous Date: ", previousDay12HoursAgo());
    console.log("PreviousDayRevenue: ", previousDayRevenue[0]?.final_revenue);
    console.log("*****************--------------------********************");

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

// ! only month wise data is available
async function revenuDataOfPreviousMonth(res_id) {
  // ? Previous Day sales
  const { previousDayRevenue } = await getPreviousDaySales(res_id);

  // ? provide a date which is 1 month 10 days ago
  // ? then get month number from that date
  const customYearNumber = moment(new Date())
    .add(-1, "months")
    .add(-10, "days")
    .year();
  //? Dec -11(month starts from 0-11)
  const customMonthNumber =
    moment(new Date()).add(-1, "months").add(-10, "days").month() + 1;

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
            rdc_score: { $sum: "$res_cancellation" },
          },
        },
      ])
      .toArray();
    // ? If data is not available send this
    if (swiggyReconsilation === null || swiggyReconsilation === undefined) {
      return {
        previousDayRevenue: {
          isDataPresent: previousDayRevenue === undefined ? false : true,
          previousDayRevenue:
            previousDayRevenue === undefined ? null : previousDayRevenue,
        },
        financialData: {
          isDataPresent: false,
          totalCancellation: 0,
          totalSales: 0,
          netPayout: 0,
          deleveries: 0,
          cancelledOrders: 0,
          deductions: {
            "Platform Services Charges": 0,
            "Cancellation Deduction": 0,
            "Other OFD deduction": 0,
            Promotions: 0,
            "Previous Week Outstanding": 0,
            Miscellaneous: 0,
            TCS: 0,
            TDS: 0,
          },
        },
      };
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
      "Cancellation Deduction": parseFloat(
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

    console.log("*****************--------------------********************");
    console.log("Swiggy Reconsilation Data - (Swiggy  Reconsilation)");
    console.log("customYearNumber: ", customYearNumber);
    console.log("customMonthNumber: ", customMonthNumber);
    console.log("Revenue: ", {
      previousDayRevenue: {
        isDataPresent: previousDayRevenue === undefined ? false : true,
        previousDayRevenue:
          previousDayRevenue === undefined ? null : previousDayRevenue,
      },
      financialData: {
        isDataPresent: true,
        totalSales,
        netPayout,
        deleveries,
        cancelledOrders,
        deductions,
      },
    });
    console.log("*****************--------------------********************");
    return {
      previousDayRevenue: {
        isDataPresent: previousDayRevenue === undefined ? false : true,
        previousDayRevenue:
          previousDayRevenue === undefined ? null : previousDayRevenue,
      },
      financialData: {
        isDataPresent: true,
        totalSales,
        netPayout,
        deleveries,
        cancelledOrders,
        deductions,
      },
    };
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  revenueScoreFromMongoDB,
  revenuDataOfPreviousMonth,
};
