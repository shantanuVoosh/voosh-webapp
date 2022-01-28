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
  let OrdersPerRatingQuery = {};
  let customerRatingsQuery = {};

  // ? Query for week
  if (resultType === "week") {
    OrdersPerRatingQuery = {
      zomato_res_id: `${res_id}`,
      week_no: parseInt(number),
      year: parseInt(year),
    };
    customerRatingsQuery = {
      zomato_res_id: parseInt(res_id),
      week_no: parseInt(number),
      // week_no:2,
      year_no: parseInt(year),
    };
  }

  // ? Query for month
  else if (resultType === "month") {
    OrdersPerRatingQuery = {
      zomato_res_id: `${res_id}`,
      month_no: parseInt(number),
      year: parseInt(year),
    };
    customerRatingsQuery = {
      zomato_res_id: parseInt(res_id),
      month_no: parseInt(number),
      year_no: parseInt(year),
    };
  } else {
    return {
      dataPresent: false,
    };
  }

  console.log(OrdersPerRatingQuery);

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
        {
          $group: {
            _id: "$zomato_res_id",
            customer_rating: { $avg: "$delivery_ratings" },
          },
        },
      ])
      .toArray();

    // ? Rating Split
    const OrdersPerRating = await db
      .collection("zomato_rating_products")
      .aggregate([
        {
          $match: OrdersPerRatingQuery,
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

    console.log("------******------");
    // console.log("reviewOfProducts:", reviewOfProducts);
    // console.log("------******------");
    // console.log("allFeedbacks:", allFeedbacks);
    // console.log("------******------");
    console.log("customerRatings:", customerRatings);
    // console.log("------******------");
    console.log("OrdersPerRating:", OrdersPerRating);
    console.log("------******------");

    client.close();
    return {
      customerRatings: customerRatings[0]?.customer_rating,
      OrdersPerRating:
        OrdersPerRating.length > 0
          ? OrdersPerRating[0]
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
    const { OrdersPerRating, customerRatings } = data;

    const customerReviews = {
      value:
        customerRatings === undefined
          ? "working on It."
          : parseFloat(customerRatings.toFixed(1)),
      type: "average",
      compareType: "grater",
      benchmark: 4,

      OrdersPerRating: {
        "5_star": OrdersPerRating["5_star"],
        "4_star": OrdersPerRating["4_star"],
        "3_star": OrdersPerRating["3_star"],
        "2_star": OrdersPerRating["2_star"],
        "1_star": OrdersPerRating["1_star"],
      },
      all_reviews: [],
      negative: [],
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
