const {
  operationHealthDataFormatter,
} = require("../collectionFormatterForSwiggy/operationalHealth");
const {
  listingScoreDataFormatter,
} = require("../collectionFormatterForSwiggy/listingScore");

const {
  customerReviewsDataFormatter,
} = require("../collectionFormatterForSwiggy/customerReviews");
const {
  revenuDataOfPreviousMonth,
  revenueScoreFromMongoDB,
} = require("../collectionFormatterForSwiggy/revenue");

async function getAllSwiggyData(
  res_id,
  number,
  resultType,
  startDate = "2021-12-01",
  endDate = "2022-01-06"
) {
  console.log("-----------------");
  console.log("inside---> Get All Swiggy Data");
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
    endDate
  );
  const ls = await listingScoreDataFormatter(
    res_id,
    number,
    resultType,
    startDate,
    endDate
  );
  const customerReviews = await customerReviewsDataFormatter(
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
    endDate
  );

  const revenue_previous_month = await revenuDataOfPreviousMonth(res_id);
  return {
    name: "Swiggy",
    operationHealth: oh,
    listingScore: ls,
    revenue_score: {
      revenue_score,
      isDataPresent: revenue_score !== undefined ? true : false,
    },
    previousMonthRevenue: revenue_previous_month,
    customerReviews: customerReviews,
  };
}

module.exports = {
  getAllSwiggyData,
};
