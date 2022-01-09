const {
  operationHealthDataFormatter,
} = require("../collectionFormatterForZomato/operationalHealth");

async function getAllZomatoData(
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
  return {
    name: "Zomato",
    operationHealth: oh,
  };
}

module.exports = {
  getAllZomatoData,
};
