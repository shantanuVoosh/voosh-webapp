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

// ! only month wise data is available
async function revenuDataOfPreviousMonth(res_id) {
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
    const zomatoReconsilation = await db
      .collection("zomato_revenue_reconsilation")
      .findOne({
        res_id: parseInt(res_id),
        month_no: parseInt(customMonthNumber),
        year_no: parseInt(customYearNumber),
      });

    // ? RDC or total Cancellation for previous month
    const rdc = await db
      .collection("zomato_rdc_products")
      .aggregate([
        {
          $match: {
            zomato_res_id: parseInt(res_id),
            month_no: parseInt(customMonthNumber),
          },
        },
        {
          $group: {
            _id: "$zomato_res_id",
            rdc_score: { $sum: "$reject_count" },
          },
        },
      ])
      .toArray();

    const revenue_deliver = await db
      .collection("zomato_revenue_products")
      .aggregate([
        {
          $match: {
            zomato_res_id: parseInt(res_id),
            month_no: parseInt(customMonthNumber),
          },
        },
        {
          $count: "zomato_delivery_orders",
        },
      ])
      .toArray();


    // ? If data is not available send this
    if (zomatoReconsilation === null || zomatoReconsilation === undefined) {
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
            "Piggy Bank": 0,
            "logistics Charge": 0,
            "Penalty Amount": 0,
            "Credits Charge": 0,
            Miscellaneous: 0,
            TCS: 0,
            TDS: 0,
          },
        },
      };
    }

    // ? If data is available send this
    // Todo: totalCancellation is undefined the zero cancelled orders
    const totalCancellation = rdc[0]?.rdc_score;

    const totalSales = zomatoReconsilation["gross_revenue_(INR)"];
    // ? maybe this this is net payout Net Payout E=A-B-C-D   +Cancellation Refund (INR) (net payout)
    const commissionable_amount =
      zomatoReconsilation["commissionable_amount_(INR)"] -
      zomatoReconsilation["pro_discount_share_(INR)"] -
      zomatoReconsilation["customer_compensation_(INR)"] -
      zomatoReconsilation["customer_discount_amount_(INR)"] +
      zomatoReconsilation["cancellation_refund_(INR)"];

    const netPayout = zomatoReconsilation["net_receivable_(INR)"];

    // const deleveries = zomatoReconsilation["number_of_orders"];
    // ! temp use this
    const deleveries = revenue_deliver[0]?.zomato_delivery_orders;

    const cancelledOrders = totalCancellation ? totalCancellation : 0;

    const deductions = {
      "Piggy Bank": zomatoReconsilation["piggybank_(INR)"],
      "logistics Charge": zomatoReconsilation["logistics_charge_(INR)"],
      "Penalty Amount": zomatoReconsilation["penalty_amount_(INR)"],
      "Credits Charge": zomatoReconsilation["credits_charge_(INR)"],

      Miscellaneous:
        zomatoReconsilation["amount_received_in_cash_(INR)"] +
        zomatoReconsilation["credit_note_adjustment_(INR)"] +
        zomatoReconsilation["promo_recovery_adjustment_(INR)"] +
        zomatoReconsilation["ice_cream_deductions_-_hyperpure_(INR)"] +
        zomatoReconsilation["ice_cream_handling_charge_(INR)"] +
        zomatoReconsilation["support_cost_adjustment_(INR)"],

      TCS: zomatoReconsilation["tax_collected_at_source_(INR)"],
      TAX: zomatoReconsilation["taxes_on_zomato_fees_(INR)"],

      TDS:
        zomatoReconsilation["tds_194O_amount_(INR)"] +
        zomatoReconsilation["tds_194h_amount_(INR)"],
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
        commissionable_amount,
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
  getPreviousDaySales,
  revenuDataOfPreviousMonth,
};
