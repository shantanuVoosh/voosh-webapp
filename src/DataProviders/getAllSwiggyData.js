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
  const {
    revenue_score,
    daily_sub_total,
    daily_package_charge,
    daily_total_tax,
    swiggy_service_tax,
    swiggy_tds,
    swiggy_tcs,
  } = await revenueScoreFromMongoDB(
    res_id,
    number,
    resultType,
    startDate,
    endDate
  );

  const rv_score =
    daily_sub_total +
    daily_package_charge +
    daily_total_tax +
    swiggy_service_tax +
    swiggy_tds +
    swiggy_tcs;

  const revenue_previous_month = await revenuDataOfPreviousMonth(res_id);
  return {
    name: "Swiggy",
    operationHealth: oh,
    listingScore: ls,
    revenue_score: {
      revenue_score: revenue_score !== undefined?rv_score:0,
      isDataPresent: revenue_score !== undefined ? true : false,
    },
    previousMonthRevenue: revenue_previous_month,
    customerReviews: customerReviews,
  };
}

module.exports = {
  getAllSwiggyData,
};
