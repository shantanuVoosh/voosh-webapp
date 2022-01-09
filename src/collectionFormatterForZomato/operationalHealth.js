const { MongoClient } = require("mongodb");
const { video_urls } = require("../utils/traning_video_urls");
const { RDC_video, Serviceability_video, MFR_video, Ratings_video } =
  video_urls;
const VooshDB =
  "mongodb://analyst:gRn8uXH4tZ1wv@35.244.52.196:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";
const documentName = "operationsdb";

const operationalHealthMongoDBData = async (
  res_id,
  number,
  resultType,
  startDate,
  endDate
) => {
  let query = {};
  let mfr_query = {};

  if (resultType === "week") {
    query = {
      zomato_res_id: `${res_id}`,
      week_no: parseInt(number),
    };
    mfr_query = {
      zomato_res_Id: `${res_id}`,
      week_no: parseInt(number),
    };
  } else if (resultType === "month") {
    query = {
      zomato_res_id: `${res_id}`,
      month_no: parseInt(number),
    };
    mfr_query = {
      zomato_res_Id: `${res_id}`,
      week_no: parseInt(number),
    };
  } else if (resultType === "Cumstom Range") {
    query = {
      zomato_res_id: `${res_id}`,
      date: { $gte: startDate, $lte: endDate },
    };
    mfr_query = {
      zomato_res_Id: `${res_id}`,
      date: { $gte: startDate, $lte: endDate },
    };
  } else {
    query = {
      dataPresent: false,
    };
  }

  try {
    const client = await MongoClient.connect(VooshDB, {
      useNewUrlParser: true,
    });
    const db = client.db(documentName);
    console.log(query);
    console.log(mfr_query);

    // !Operational Health RDC
    const rdc_score = await db
      .collection("zomato_rdc_products_test")
      .aggregate([
        {
          $match: query,
        },
        {
          $group: {
            _id: "$zomato_res_id",
            rdc_score: { $avg: "$rdc" },
          },
        },
      ])
      .toArray();

    // !Operational Health MFR
    const mfr_score = await db
      .collection("zomato_mfr_products_test")
      .aggregate([
        {
          $match: mfr_query,
        },
        {
          $group: {
            _id: "$zomato_res_Id",
            mfr_score: { $avg: "$mfr" },
          },
        },
      ])
      .toArray();

    console.log("*****************--------------------********************");
    console.log("rdc_score", rdc_score);
    console.log("mfr_score", mfr_score);
    console.log(
      "****************-------------------------*********************"
    );

    client.close();

    return {
      rdc_score: rdc_score[0]?.rdc_score,
      mfr_score: mfr_score[0]?.mfr_score,
    };
  } catch (err) {
    console.log(err);
    return {
      error: err,
    };
  }
};

const operationHealthDataFormatter = async (
  res_id,
  number,
  resultType,
  startDate,
  endDate
) => {
  try {
    const data = await operationalHealthMongoDBData(
      res_id,
      number,
      resultType,
      startDate,
      endDate
    );
    const { rdc_score, mfr_score } = data;

    const operationHealth = {
      operationHealthData: [
        {
          name: "Rest. Cancellations",
          type: "percentage",
          // info: "if your restaurent cancellation score is less than 5% then it will get more orders",
          info: "Cancellation Charges <= 5% Gets more orders",
          benchmark: 5,
          compareThen: "less",
          videoLink: RDC_video,
          recommendations: [
            "Ensure Restaurant open at the given timings to swiggy and zomato",
            "Ensure stock of best seller items always ready. Click <<here>> for list of items that are getting cancelled often because of stock outs",
          ],
          value:
            rdc_score === undefined
              ? "Please wait! We are working on It."
              : parseInt(rdc_score * 100),
          isDataPresent: rdc_score === undefined ? false : true,
        },
        {
          name: "MFR Accuracy",
          type: "percentage",
          // info: "MFR Accuracy grate than 95% to get more orders",
          info: "MFR Accuracy >=95 Gets more orders",
          benchmark: 95,
          compareThen: "grater",
          videoLink: MFR_video,
          recommendations: [
            "Press food ready button only when food prepared, not before",
            "If you forget to mark food ready, take the MFR calling service. Tap here!",
          ],
          value:
            mfr_score === undefined
              ? "Please wait! We are working on It."
              : parseInt(mfr_score),
          isDataPresent: mfr_score === undefined ? false : true,
        },
      ],
    };
    return operationHealth;
  } catch (err) {
    return {
      error: err,
      Error_: "Error in operationHealthDataFormatter",
    };
  }
};

module.exports = {
  operationHealthDataFormatter,
};
