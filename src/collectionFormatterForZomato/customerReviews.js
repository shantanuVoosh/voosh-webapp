const { MongoClient } = require("mongodb");
const VooshDB =
  "mongodb://analyst:gRn8uXH4tZ1wv@35.244.52.196:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";
const documentName = "operationsdb";

const customerReviewsMongoDBData = async (
  res_id,
  number,
  resultType,
  startDate,
  endDate,
  year
) => {
  let feedbackQuery = {};
  let allFeedbacksQuery = {};
  let ordersPerRatingQuery = {};
  let customerRatingsQuery = {};

  // ? Query for week
  if (resultType === "week") {
    ordersPerRatingQuery = {
      zomato_res_id: `${res_id}`,
      week_no: parseInt(number),
      year: parseInt(year),
    };
    customerRatingsQuery = {
      zomato_res_id: parseInt(res_id),
    };
  }

  // ? Query for month
  else if (resultType === "month") {
    ordersPerRatingQuery = {
      zomato_res_id: `${res_id}`,
      month_no: parseInt(number),
      year: parseInt(year),
    };
    customerRatingsQuery = {
      zomato_res_id: parseInt(res_id),
    };
  } else {
    return {
      dataPresent: false,
    };
  }

  console.log(ordersPerRatingQuery);

  try {
    const client = await MongoClient.connect(VooshDB, {
      useNewUrlParser: true,
    });
    const db = client.db(documentName);

    // ? Customer Ratings
    const customerRatings = await db
      .collection("zomato_static_rating_products")
      .aggregate([
        {
          $match: customerRatingsQuery,
        },
        { $sort: { year_no: -1, month_no: -1, week_no: -1 } },
        { $limit: 1 },
      ])
      .toArray();

    // ? Rating Split
    const ordersPerRating = await db
      .collection("zomato_rating_products")
      .aggregate([
        {
          $match: ordersPerRatingQuery,
        },
        {
          $group: {
            _id: "rating_by_orders",
            "5_star": {
              $sum: "$5_star",
            },
            "4_star": {
              $sum: "$4_star",
            },
            "3_star": {
              $sum: "$3_star",
            },
            "2_star": {
              $sum: "$2_star",
            },
            "1_star": {
              $sum: "$1_star",
            },
            // total_ratings: {
            //   $sum: "$total_rating",
            // },
          },
        },
      ])
      .toArray();

    // console.log("------******------");
    // console.log("reviewOfProducts:", reviewOfProducts);
    // console.log("------******------");
    // console.log("allFeedbacks:", allFeedbacks);
    // console.log("------******------");
    // console.log("customerRatings:", customerRatings);
    // console.log("------******------");
    // console.log("ordersPerRating:", ordersPerRating);
    // console.log("------******------");

    client.close();
    return {
      customerRatings: customerRatings[0]?.delivery_ratings,
      ordersPerRating:
        ordersPerRating.length > 0
          ? ordersPerRating[0]
          : {
              "5_star": 0,
              "4_star": 0,
              "3_star": 0,
              "2_star": 0,
              "1_star": 0,
              total_ratings: 0,
            },
    };
  } catch (err) {
    console.log(
      "Error on customerReviewsMongoDBData, inside collectionFormatterZomato"
    );
    console.log(err);
  }
};

const customerReviewsDataFormatter = async (
  res_id,
  number,
  resultType,
  startDate,
  endDate,
  year
) => {
  try {
    const data = await customerReviewsMongoDBData(
      res_id,
      number,
      resultType,
      startDate,
      endDate,
      year
    );
    const { ordersPerRating, customerRatings, dataPresent } = data;

    if (dataPresent === false) {
      return {
        value: null,
        type: "average",
        compareType: "grater",
        benchmark: 4.5,
        totalRatings: 0,
        ordersPerRating: {
          "5_star": 0,
          "4_star": 0,
          "3_star": 0,
          "2_star": 0,
          "1_star": 0,
        },
        all_reviews: [],
        negative: [],
        reviewOfProductsSales: [],
      };
    }

    const customerReviews = {
      value:
        customerRatings === undefined
          ? null
          : parseFloat(customerRatings.toFixed(1)),
      type: "average",
      compareType: "grater",
      benchmark: 4,
      totalRatings:
        ordersPerRating["5_star"] +
        ordersPerRating["4_star"] +
        ordersPerRating["3_star"] +
        ordersPerRating["2_star"] +
        ordersPerRating["1_star"],
      ordersPerRating: {
        "5_star": ordersPerRating["5_star"],
        "4_star": ordersPerRating["4_star"],
        "3_star": ordersPerRating["3_star"],
        "2_star": ordersPerRating["2_star"],
        "1_star": ordersPerRating["1_star"],
      },
      // !we dont have these now
      all_reviews: [],
      negative: [],
      reviewOfProductsSales: [],
    };

    return customerReviews;
  } catch (err) {
    console.log(err);
    return {
      error: err,
    };
  }
};

module.exports = {
  customerReviewsDataFormatter,
};
