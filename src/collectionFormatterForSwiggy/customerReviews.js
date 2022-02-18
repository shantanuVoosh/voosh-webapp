const { MongoClient } = require("mongodb");
const VooshDB =
  "mongodb://analyst:gRn8uXH4tZ1wv@35.244.52.196:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";
const documentName = "operationsdb";

const customerReviewsMongoDBData = async (
  res_id,
  number,
  resultType
  // ! startDate and endDate are not needed in this function
  // startDate,
  // endDate
) => {
  let feedbackQuery = {};
  let allFeedbacksQuery = {};
  let ordersPerRatingQuery = {};
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
    ordersPerRatingQuery = {
      swiggy_res_id: parseInt(res_id),
      week_no: parseInt(number),
    };
    customerRatingsQuery = {
      res_id: parseInt(res_id),
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
      // feedback: { $ne: NaN },
      // rating: { $lt: 5 },
      feedback: { $ne: null },
      rating: { $lte: "5" },
    };
    ordersPerRatingQuery = {
      swiggy_res_id: parseInt(res_id),
      month_no: parseInt(number),
    };
    customerRatingsQuery = {
      res_id: parseInt(res_id),
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
    // * sort by problem i.e. sum
    const reviewOfProducts = await db
      .collection("swiggy_weekly_review_products")
      .aggregate([
        {
          $match: feedbackQuery,
        },
        { $sort: { sum: -1 } },
      ])
      .toArray();

    // * sort by sales
    const reviewOfProductsSales = await db
      .collection("swiggy_weekly_review_products")
      .aggregate([
        {
          $match: feedbackQuery,
        },
        {
          $lookup: {
            from: "swiggy_item_sales_products",
            pipeline: [
              // ? $match: { swiggy_res_id: 256302, week_no: 52 }
              { $match: ordersPerRatingQuery },
              {
                $group: {
                  _id: "item_sales",
                  item_sales: { $sum: "$item_income" },
                },
              },
            ],
            localField: "item_name",
            foreignField: "item_name",
            as: "itemwise_sales",
          },
        },
        {
          $unwind: {
            path: "$itemwise_sales",
          },
        },
        {
          $sort: {
            "itemwise_sales.item_sales": -1,
          },
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
        { $sort: { year_no: -1, month_no: -1, week_no: -1 } },
        { $limit: 1 },
      ])
      .toArray();

    // ? Rating Split
    const ordersPerRating = await db
      .collection("swiggy_rating_products")
      .aggregate([
        {
          $match: ordersPerRatingQuery,
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
    // console.log("reviewOfProducts:", reviewOfProducts[0]);
    // console.log("------******------");
    // console.log("allFeedbacks:", allFeedbacks);
    // console.log("------******------");
    // console.log("customerRatings:", customerRatings);
    // console.log("------******------");
    // console.log("ordersPerRating:", ordersPerRating);
    // console.log("------******------");
    // console.log("reviewOfProductsSales:", reviewOfProductsSales[0]);
    // console.log("------******------");

    client.close();
    return {
      reviewOfProducts,
      reviewOfProductsSales,
      allFeedbacks,
      customerRatings: customerRatings[0]?.customer_rating,
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
      "Error on customerReviewsMongoDBData, inside collectionFormatterSwiggy"
    );
    console.log(err);
  }
};

const customerReviewsDataFormatter = async (
  res_id,
  number,
  resultType,
  startDate,
  endDate
) => {
  try {
    const data = await customerReviewsMongoDBData(
      res_id,
      number,
      resultType,
      startDate,
      endDate
    );
    const {
      reviewOfProducts,
      allFeedbacks,
      ordersPerRating,
      customerRatings,
      reviewOfProductsSales,
      dataPresent,
    } = data;

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

    //? Grabbing the all negative reviews in {name: "item_name", Value: "value"} format

    const negative_review_items =
      reviewOfProducts === undefined
        ? []
        : reviewOfProducts.map((item) => {
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
              feedback: `${feedback}`
                .replace(/(\r\n|\n|\r)/gm, " ")
                .substring(2),
              rating,
              order_id,
              order_date: order_date.split("-").join(""),
            };
          });

    const customerReviews = {
      value:
        customerRatings === undefined
          ? null
          : parseFloat(customerRatings.toFixed(1)),
      type: "average",
      compareType: "grater",
      benchmark: 4,
      totalRatings:
        ordersPerRating.total_ratings !== undefined
          ? parseFloat(ordersPerRating.total_ratings.toFixed(1))
          : 0,
      ordersPerRating: {
        "5_star": ordersPerRating["5_star"],
        "4_star": ordersPerRating["4_star"],
        "3_star": ordersPerRating["3_star"],
        "2_star": ordersPerRating["2_star"],
        "1_star": ordersPerRating["1_star"],
      },
      all_reviews: [...all_reviews],
      negative: [...negative_review_items],
      reviewOfProductsSales:
        reviewOfProductsSales === undefined ? [] : [...reviewOfProductsSales],
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
