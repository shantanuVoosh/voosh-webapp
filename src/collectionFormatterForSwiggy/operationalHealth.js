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
  // ? key is different in collection
  let query = {};
  let ratingQuery = {};

  // ? Query for Collection
  if (resultType === "week") {
    query = {
      swiggy_res_id: parseInt(res_id),
      week_no: parseInt(number),
    };
    ratingQuery = {
      res_id: parseInt(res_id),
      week_no: parseInt(number),
    };
  } else if (resultType === "month") {
    query = {
      swiggy_res_id: parseInt(res_id),
      month_no: parseInt(number),
    };
    ratingQuery = {
      res_id: parseInt(res_id),
      month_no: parseInt(number),
    };
  }
  // ? Custom date range
  else if (resultType === "Custom Range") {
    query = {
      swiggy_res_id: parseInt(res_id),
      date: { $gte: startDate, $lte: endDate },
    };
    ratingQuery = {
      res_id: parseInt(res_id),
      date: { $gte: startDate, $lte: endDate },
    };
  }
  //! if resultType is not week or month!
  else {
    return {
      dataPresent: false,
    };
  }

  try {
    const client = await MongoClient.connect(VooshDB, {
      useNewUrlParser: true,
    });
    const db = client.db(documentName);

    // ! Operational Health Score
    const oh_score = await db
      .collection("weekly_oprational_health_score")
      .aggregate([
        {
          $match: query,
        },
        {
          $group: {
            _id: "$swiggy_res_id",
            oh_score: { $avg: "$weekly_oprational_health_score" },
            // ? can be useful!
            mfr: { $avg: "$swiggy_mfr" },
            rdc: { $avg: "$swiggy_rdc" },
            acceptance: { $avg: "$swiggy_acceptance" },
            serviceability: { $avg: "$swiggy_servicebility_rate" },
            igcc: { $avg: "$swiggy_igcc" },
          },
        },
      ])
      .toArray();

    // ! Operational Health Serviceability
    const serviceability = await db
      .collection("swiggy_kitchen_servicibility_products")
      .aggregate([
        {
          $match: query,
        },
        {
          $group: {
            _id: "$swiggy_res_id",
            oh_serviceability: { $avg: "$kicthen_servicibility" },
          },
        },
      ])
      .toArray();

    // ! Operational Health RDC
    const rdc = await db
      .collection("swiggy_rdc_products")
      .aggregate([
        {
          $match: query,
        },
        {
          $group: {
            _id: "$swiggy_res_id",
            rdc_score: { $avg: "$rdc" },
          },
        },
      ])
      .toArray();

    // ! Operational Health Rating
    const rating = await db
      .collection("swiggy_static_rating_products")
      .aggregate([
        {
          $match: ratingQuery,
        },
        {
          $group: {
            _id: "$res_id",
            rating_score: { $avg: "$customer_rating" },
          },
        },
      ])
      .toArray();

    // ! Operational Health MFR
    const mfr = await db
      .collection("swiggy_mfr_products")
      .aggregate([
        {
          $match: query,
        },
        {
          $group: {
            _id: "$swiggy_res_id",
            mfr_score: { $avg: "$mfr" },
          },
        },
      ])
      .toArray();

    // ! Operational Health IGCC
    const igcc = await db
      .collection("swiggy_igcc_products")
      .aggregate([
        {
          $match: query,
        },
        {
          $group: {
            _id: "$swiggy_res_id",
            igcc_score: {
              $avg: {
                $avg: "$wrong_item_complaints_order",
                $avg: "$missing_item_complaints_order",
              },
            },
          },
        },
      ])
      .toArray();

    // ! Operational Health Acceptance--> String Propblem
    const acceptance = await db
      .collection("swiggy_acceptance_products")
      .aggregate([
        {
          $match: query,
        },
        {
          $group: {
            _id: "$swiggy_res_id",
            acceptance_score: { $avg: "$accept_order" },
          },
        },
      ])
      .toArray();

    // ? close connection
    client.close();

    // console.log("----------*****----------");
    // console.log("oh_score: ", oh_score);
    // console.log("----------*****----------");
    // console.log("serviceability: ", serviceability);
    // console.log("----------*****----------");
    // console.log("rdc:", rdc);
    // console.log("----------*****----------");
    // console.log("rating:", rating);
    // console.log("----------*****----------");
    // console.log("mfr:", mfr);
    // console.log("----------*****----------");
    // console.log("igcc:", igcc);
    // console.log("----------*****----------");
    console.log("acceptance:", acceptance);
    // console.log("----------*****----------");

    // ? Error Handling Better krna hai, right now if value is not present in DB,
    // ? it will return empty result { }
    // ? {oh_score:"false",....}

    return {
      oh_score: oh_score[0]?.oh_score,
      serviceability_score: serviceability[0]?.oh_serviceability,
      rdc_score: rdc[0]?.rdc_score,
      rating_score: rating[0]?.rating_score,
      mfr_score: mfr[0]?.mfr_score,
      acceptance_score: acceptance[0]?.acceptance_score,
      igcc_score: igcc[0]?.igcc_score,
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
    // console.log("operationHealthDataFormatter res_id, num, resultType", res_id, number, resultType);
    // console.log("operationHealthDataFormatter data", data);
    const {
      oh_score,
      serviceability_score,
      rdc_score,
      igcc_score,
      rating_score,
      mfr_score,
      acceptance_score,
    } = data;

    // Todo: test this
    const ohManually = calculateOHScoreManually({
      serviceability_score,
      rdc_score,
      igcc_score,
      rating_score,
      mfr_score,
      acceptance_score,
    });

    // !If the values inside data is not present, then it will return undefined
    const operationalHealth = {
      // Todo: is this needed? dataPresent
      dataPresent: true,
      // ? Operational Health Score
      operationHealthMain: {
        name: "Operation Health",
        type: "percentage",
        info: "Operation Health >= 95% Gets more orders",
        benchmark: 95,
        value:
          oh_score === undefined
            ? ohManually != 0 && ohManually === ohManually
              ? ohManually
              : 0
            : oh_score * 16.67,
        isDataPresent:
          oh_score === undefined
            ? ohManually != 0 && ohManually === ohManually
              ? true
              : false
            : true,
      },
      operationHealthData: [
        // ?Swiggy_Kitchen_Servicibility
        {
          name: "Rest. Serviceability",
          type: "percentage",
          // info: "if your restaurent serviceability score is greater than 99% then it will get more orders",
          info: "Operation Health >= 99% Gets more orders",
          benchmark: 99,
          compareThen: "grater",
          videoLink: Serviceability_video,
          recommendations: ["Get the serviceability notification service"],
          value:
            serviceability_score === undefined
              ? "Please wait! We are working on It."
              : parseInt(serviceability_score),
          isDataPresent: serviceability_score === undefined ? false : true,
        },
        // ?Swiggy_RDC
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
            "Ensure stock of best seller items always ready.",
            // "Ensure stock of best seller items always ready. Click <<here>> for list of items that are getting cancelled often because of stock outs",
          ],
          value:
            rdc_score === undefined
              ? "Please wait! We are working on It."
              : parseInt(rdc_score * 100),
          isDataPresent: rdc_score === undefined ? false : true,
        },

        // ?Swiggy_Static_ratings
        {
          name: "Rating",
          type: "average",
          // info: "get more then 4.5 star rating to get more orders",
          info: "Rating > 4.5 Gets better orders",
          benchmark: 4.5,
          compareThen: "grater",
          videoLink: Ratings_video,
          recommendations: [
            "Improve reviews by understanding the problem areas",
            "Contact Voosh for Rating Booster service",
          ],
          value:
            rating_score === undefined
              ? "Please wait! We are working on It."
              : parseFloat(rating_score.toFixed(1)),
          isDataPresent: rating_score === undefined ? false : true,
        },
        // ?Swiggy_MFR
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
        // ? IGCC
        {
          name: "Customer Complaints",
          type: "percentage",
          // info: "if your customer complaints score is less than 1 then it will get more orders",
          info: "Complains <=1 Gets more orders",
          benchmark: 1,
          compareThen: "less",
          recommendations: [
            "Paste a menu + item poster at the packaging area",
            "Retrain packagers on high order days",
          ],
          value:
            igcc_score === undefined
              ? "Please wait! We are working on It."
              : parseInt(igcc_score * 100),
          isDataPresent: igcc_score === undefined ? false : true,
        },
        // ?Swiggy_Acceptance
        {
          name: "Acceptance",
          type: "percentage",
          // info: "if your acceptance score is grater than 99% then it will get more orders",
          info: "Acceptance = 100% Gets more orders",
          benchmark: 99,
          compareThen: "grater",
          recommendations: ["Enable Auto acceptance"],
          value:
            acceptance_score === undefined
              ? "Please wait! We are working on It."
              : parseInt(acceptance_score),
          isDataPresent: acceptance_score === undefined ? false : true,
        },
      ],
    };
    return operationalHealth;
  } catch (err) {
    console.log(err);
    return {
      error: err,
      Error_: "Error in operationHealthDataFormatter",
    };
  }
};

module.exports = {
  operationHealthDataFormatter,
};

function calculateOHScoreManually({
  serviceability_score,
  rdc_score,
  igcc_score,
  rating_score,
  mfr_score,
  acceptance_score,
}) {
  console.log("*****************--------------------********************");
  console.log("serviceability_score", serviceability_score);
  console.log("rdc_score", rdc_score);
  console.log("igcc_score", igcc_score);
  console.log("rating_score", rating_score);
  console.log("mfr_score", mfr_score);
  console.log("acceptance_score", acceptance_score);
  console.log("****************-------------------------*********************");
  let score = 0;
  let count = 0;
  if (serviceability_score !== undefined) {
    count += 1;
    if (serviceability_score >= 95) {
      score += 0.5;
    } else {
      score += 0;
    }
  }

  if (rdc_score !== undefined) {
    count += 1;
    if (rdc_score < 5) {
      score += 0.5;
    } else {
      score += 0;
    }
  }

  if (rating_score !== undefined) {
    count += 1;
    if (rating_score >= 4.5) {
      score += 0.5;
    } else {
      score += 0;
    }
  }

  if (mfr_score !== undefined) {
    count += 1;
    if (mfr_score >= 95) {
      score += 0.5;
    } else {
      score += 0;
    }
  }

  if (igcc_score !== undefined) {
    count += 1;
    if (igcc_score <= 1) {
      score += 0.5;
    } else {
      score += 0;
    }
  }

  if (acceptance_score !== undefined) {
    count += 1;
    if (acceptance_score >= 99) {
      score += 0.5;
    } else {
      score += 0;
    }
  }
  console.log("score", score);
  console.log("count", count);
  if (count === 0) return 0;
  // ! if Nan then no data is present
  console.log(score * (200 / count));

  return score * (200 / count);
}
