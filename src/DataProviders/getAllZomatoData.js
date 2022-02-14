const {
  operationHealthDataFormatter,
} = require("../collectionFormatterForZomato/operationalHealth");

const {
  customerReviewsDataFormatter,
} = require("../collectionFormatterForZomato/customerReviews");

const {
  revenueMongoDBData,
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
  console.log("inside--->get all zomato data");
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

  const revenue_score = await revenueMongoDBData(
    res_id,
    number,
    resultType,
    startDate,
    endDate,
    year
  );

  console.log(ls);

  // ?Temp Data Ls
  return {
    name: "Zomato",
    operationHealth: oh,
    revenue_score: revenue_score === undefined ? 0 : revenue_score,

    listingScore: ls,

    customerReviews:
      resultType === "Custom Range"
        ? { value: "working on It.", type: "average", compareType: "grater" }
        : customerReviews,

    previousMonthRevenue: {
      previousDayRevenue: 0,
      isDataPresent: false,
      financicalData: {
        totalCancellation: 0,
        totalSales: 0,
        netPayout: 0,
        deleveries: 0,
        cancelledOrders: 0,
        deductions: {},
      },
    },
  };
}

module.exports = {
  getAllZomatoData,
};
