const {
  operationHealthDataFormatter,
} = require("../collectionFormatterForZomato/operationalHealth");

const {
  customerReviewsDataFormatter,
} = require("../collectionFormatterForZomato/customerReviews");

const {revenueMongoDBData} = require("../collectionFormatterForZomato/revenue");


async function getAllZomatoData(
  res_id,
  number,
  resultType,
  startDate = "2021-12-01",
  endDate = "2022-01-06",
  year=2022
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

  const revenue_score = await revenueMongoDBData(
    res_id,
    number,
    resultType,
    startDate,
    endDate,
    year,
  );

  return {
    name: "Zomato",
    operationHealth: oh,
    customerReviews,
    revenue_score,
  };
}

module.exports = {
  getAllZomatoData,
};
