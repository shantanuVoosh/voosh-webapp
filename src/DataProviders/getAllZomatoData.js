const {
  operationHealthDataFormatter,
} = require("../collectionFormatterForZomato/operationalHealth");

const {
  customerReviewsDataFormatter,
} = require("../collectionFormatterForZomato/customerReviews");

const {
  revenueScoreFromMongoDB,
  getPreviousDaySales,
  revenuDataOfPreviousMonth,
} = require("../collectionFormatterForZomato/revenue");

const {
  listingScoreDataFormatter,
} = require("../collectionFormatterForZomato/listingScore");

async function getAllZomatoData(
  res_id,
  number,
  resultType,
  startDate = "2021-12-01",
  endDate = "2022-01-06",
  year = 2022
) {
  console.log("-----------------");
  console.log("inside---> Set All Zomato Data");
  console.log(res_id, "res_id");
  console.log(number, "number");
  console.log(resultType, "resultType");
  console.log(startDate, "startDate");
  console.log(endDate, "endDate");
  console.log("-----------------");

  const oh = await operationHealthDataFormatter(
    res_id,
    number,
    resultType,
    startDate,
    endDate,
    year
  );

  const customerReviews = await customerReviewsDataFormatter(
    res_id,
    number,
    resultType,
    startDate,
    endDate,
    year
  );
  const ls = await listingScoreDataFormatter(
    res_id,
    number,
    resultType,
    startDate,
    endDate
  );

  const { revenue_score } = await revenueScoreFromMongoDB(
    res_id,
    number,
    resultType,
    startDate,
    endDate,
    year
  );

  const { previousDayRevenue } = await getPreviousDaySales(res_id);
  console.log(previousDayRevenue);
  const revenue_previous_month = await revenuDataOfPreviousMonth(res_id);

  // ?Temp Data Ls
  return {
    name: "Zomato",
    operationHealth: oh,
    listingScore: ls,
    customerReviews,

    revenue_score: {
      revenue_score,
      isDataPresent: revenue_score !== undefined ? true : false,
    },
    previousMonthRevenue: revenue_previous_month,

    // previousMonthRevenue: {
    //   previousDayRevenue: {
    //     isDataPresent: previousDayRevenue === undefined ? false : true,
    //     previousDayRevenue:
    //       previousDayRevenue === undefined ? null : previousDayRevenue,
    //   },
    //   financialData: {
    //     isDataPresent: false,
    //     totalCancellation: 0,
    //     totalSales: 0,
    //     netPayout: 0,
    //     deleveries: 0,
    //     cancelledOrders: 0,
    //     deductions: {
    //       "Platform Services Charges": 0,
    //       "Cancellation Deduction": 0,
    //       "Other OFD deduction": 0,
    //       Promotions: 0,
    //       "Previous Week Outstanding": 0,
    //       Miscellaneous: 0,
    //       TCS: 0,
    //       TDS: 0,
    //     },
    //   },
    // },
  };
}

module.exports = {
  getAllZomatoData,
};
