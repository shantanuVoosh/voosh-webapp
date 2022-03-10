const {
  operationHealthDataFormatter,
} = require("../collectionFormatterForSwiggy/operationalHealth");
const {
  listingScoreDataFormatter,
} = require("../collectionFormatterForSwiggy/listingScore");

const {
  customerReviewsDataFormatter,
  customerReviewsStaticRating,
} = require("../collectionFormatterForSwiggy/customerReviews");
const {
  revenuDataOfPreviousMonth,
  revenueScoreFromMongoDB,
} = require("../collectionFormatterForSwiggy/revenue");

async function getAllSwiggyData({
  res_id,
  number,
  resultType,
  startDate,
  endDate,
  year,
}) {
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
  const { customerRatings: crStaticRating } = await customerReviewsStaticRating(
    res_id
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

  console.log("-----------------");
  console.log(crStaticRating, "crStaticRating");
  console.log("-----------------");

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
      revenue_score: revenue_score !== undefined ? rv_score : 0,
      isDataPresent: revenue_score !== undefined ? true : false,
    },
    previousMonthRevenue: revenue_previous_month,
    customerReviewsRating: {
      value: crStaticRating === undefined ? 0 : crStaticRating,
      benchmark: 4,
      isDataPresent: crStaticRating !== undefined ? true : false,
    },

    customerReviews: customerReviews,
  };
}

module.exports = {
  getAllSwiggyData,
};
