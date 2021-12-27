const { MongoClient } = require("mongodb");
const { video_urls } = require("../utils/traning_video_urls");
const { RDC_video, Serviceability_video, MFR_video, Ratings_video } =
  video_urls;
const VooshDB =
  "mongodb://analyst:gRn8uXH4tZ1wv@35.244.52.196:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";
const documentName = "operationsdb";

const customerReviewsMongoDBData = async (res_id, number, resultType) => {
  let feedbackQuery = {};
  let allFeedbacksQuery = {};
  let OrdersPerRatingQuery = {};
  let customerRatingsQuery = {};

  // ? Query for week
  if (resultType === "week") {
    feedbackQuery = {
      swiggy_res_id: parseInt(res_id),
      week_no: parseInt(number),
      sum: { $gt: 0 },
    };
    allFeedbacksQuery = {
      swiggy_res_id: parseInt(res_id),
      week: parseInt(number),
      feedback: { $ne: null, $ne: NaN },
      rating: { $ne: null, $ne: NaN },
    };
    OrdersPerRatingQuery = {
      swiggy_res_id: parseInt(res_id),
      week_no: parseInt(number),
    };
    customerRatingsQuery = {
      res_id: parseInt(res_id),
      week_no: parseInt(number),
    };
  }
  // ? Query for month
  else if (resultType === "month") {
    feedbackQuery = {
      swiggy_res_id: parseInt(res_id),
      month_no: parseInt(number),
      sum: { $gt: 0 },
    };
    allFeedbacksQuery = {
      swiggy_res_id: parseInt(res_id),
      month_no: parseInt(number),
      feedback:{$ne:NaN},
      rating:{$lt:5},
    };
    OrdersPerRatingQuery = {
      swiggy_res_id: parseInt(res_id),
      month_no: parseInt(number),
    };
    customerRatingsQuery = {
      res_id: parseInt(res_id),
      month_no: parseInt(number),
    };
  } else {
    return {
      dataPresent: false,
    };
  }

  try {
    const client = await MongoClient.connect(VooshDB, {
      useNewUrlParser: true,
    });
    const db = client.db(documentName);

    // ? For Feedback Comments
    const reviewOfProducts = await db
      .collection("swiggy_weekly_review_products")
      .aggregate([
        {
          $match: feedbackQuery,
        },
      ])
      .toArray();

    // ? For All Feedbacks
    const allFeedbacks = await db
      .collection("swiggy_feedback_products")
      .aggregate([
        {
          $match: allFeedbacksQuery,
        },
        {
          $group: {
            _id: {
              order_id: "$order_id",
              feedback: "$feedback",
              rating: "$rating",
              order_date: "$order_date",
            },
          },
        },
      ])
      .toArray();

    // ? Customer Ratings
    const customerRatings = await db
      .collection("swiggy_static_rating_products")
      .aggregate([
        {
          $match: customerRatingsQuery,
        },
        {
          $group: {
            _id: "customer_ratings",
            customer_rating: {
              $avg: "$customer_rating",
            },
          },
        },
      ])
      .toArray();

    // ? Rating Split
    const OrdersPerRating = await db
      .collection("swiggy_rating_products")
      .aggregate([
        {
          $match: OrdersPerRatingQuery,
        },
        {
          $group: {
            _id: "rating_by_orders",
            "5_star": {
              $sum: "$5_rating",
            },
            "4_star": {
              $sum: "$4_rating",
            },
            "3_star": {
              $sum: "$3_rating",
            },
            "2_star": {
              $sum: "$2_rating",
            },
            "1_star": {
              $sum: "$1_rating",
            },
            total_ratings: {
              $sum: "$total_rating",
            },
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
    // console.log("OrdersPerRating:", OrdersPerRating);
    // console.log("------******------");

    client.close();
    return {
      reviewOfProducts,
      allFeedbacks,
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
              total_rating: 0,
            },
    };
  } catch (err) {
    console.log(err);
  }
};

const customerReviewsDataFormatter = async (res_id, number, resultType) => {
  try {
    const data = await customerReviewsMongoDBData(res_id, number, resultType);
    const { reviewOfProducts, allFeedbacks, OrdersPerRating, customerRatings } =
      data;
      console.log(reviewOfProducts, "line no. 188");
    //? Grabbing the all negative reviews in {name: "item_name", Value: "value"} format
    const negative_review_items = reviewOfProducts.map((item) => {
      const { item_name } = item;
      const {
        quality,
        taste,
        cooking,
        freshness_stale,
        foreignobject,
        oily,
        spice,
        hard,
        temperature,
        quantity,
        missing,
        wrong,
        packaging,
        price,
        delivery_n_time,
      } = item;
      const food_negative_review_items = [
        {
          name: "quality",
          value: parseFloat(quality),
        },
        {
          name: "taste",
          value: parseFloat(taste),
        },
        {
          name: "cooking",
          value: parseFloat(cooking),
        },
        {
          name: "freshness_stale",
          value: parseFloat(freshness_stale),
        },
        {
          name: "foreignobject",
          value: parseFloat(foreignobject),
        },
        {
          name: "oily",
          value: parseFloat(oily),
        },
        {
          name: "spice",
          value: parseFloat(spice),
        },
        {
          name: "hard",
          value: parseFloat(hard),
        },
        {
          name: "temperature",
          value: parseFloat(temperature),
        },
        {
          name: "quantity",
          value: parseFloat(quantity),
        },
        {
          name: "missing",
          value: parseFloat(missing),
        },
        {
          name: "wrong",
          value: parseFloat(wrong),
        },
        {
          name: "packaging",
          value: parseFloat(packaging),
        },
        {
          name: "price",
          value: parseFloat(price),
        },
        {
          name: "delivery_n_time",
          value: parseFloat(delivery_n_time),
        },
      ].sort((a, b) => (a.value > b.value ? -1 : 1));

      return {
        item_name: item_name,
        issues: [...food_negative_review_items.slice(0, 3)],
      };
    });

    const all_reviews =
      allFeedbacks === undefined
        ? []
        : allFeedbacks.map((item) => {
            const { _id } = item;
            const { feedback, rating, order_id, order_date } = _id;
            return {
                 // !Somehow this wont crash if the feedback is null
                 feedback: `${feedback}`.replace(/(\r\n|\n|\r)/gm, " ").substring(2),
              rating,
              order_id,
              order_date: order_date.split("-").join(""),
            };
          });

    const customerReviews = {
      value:
        customerRatings === undefined
          ? "data not available"
          : parseFloat(customerRatings.toFixed(1)),
      type: "average",
      compareType: "grater",
      benchmark: 4,
      totalRatings: parseFloat(OrdersPerRating.total_ratings.toFixed(1)),
      OrdersPerRating: {
        "5_star": OrdersPerRating["5_star"],
        "4_star": OrdersPerRating["4_star"],
        "3_star": OrdersPerRating["3_star"],
        "2_star": OrdersPerRating["2_star"],
        "1_star": OrdersPerRating["1_star"],
      },
      all_reviews: [...all_reviews],
      negative: [...negative_review_items],
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
  customerReviewsMongoDBData,
};
