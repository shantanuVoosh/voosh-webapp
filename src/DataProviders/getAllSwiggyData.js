const {
  operationHealthDataFormatter,
} = require("../collectionFormatterForSwiggy/operationalHealth");
const {
  listingScoreDataFormatter,
} = require("../collectionFormatterForSwiggy/listingScore");
const {
  revenueMongoDBData,
} = require("../collectionFormatterForSwiggy/revenue");

const {
  customerReviewsDataFormatter,
} = require("../collectionFormatterForSwiggy/customerReviews");
const {
  revenuDataFormatter,
  revenuDataOfPreviousMonth,
} = require("../collectionFormatterForSwiggy/revenue");

async function getAllSwiggyData(
  res_id,
  number,
  resultType,
  startDate = "2021-12-01",
  endDate = "2022-01-06"
) {
  console.log("-----------------");
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
  const revenue_score = await revenueMongoDBData(
    res_id,
    number,
    resultType,
    startDate,
    endDate
  );
  const revenue = await revenuDataFormatter(
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
    revenue_score,
    previousMonthRevenue: revenue_previous_month,
    // ! customerReviews wont work in this case
    customerReviews:
      resultType === "Custom Range"
        ? { value: "working on It.", type: "average", compareType: "grater" }
        : customerReviews,
  };
}

module.exports = {
  getAllSwiggyData,
};
