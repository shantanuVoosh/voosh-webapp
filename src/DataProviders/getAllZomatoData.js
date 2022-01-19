const {
  operationHealthDataFormatter,
} = require("../collectionFormatterForZomato/operationalHealth");

const {
  customerReviewsDataFormatter,
} = require("../collectionFormatterForZomato/customerReviews");

const {
  revenueMongoDBData,
} = require("../collectionFormatterForZomato/revenue");

async function getAllZomatoData(
  res_id,
  number,
  resultType,
  startDate = "2021-12-01",
  endDate = "2022-01-06",
  year = 2022
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
    year
  );

  // ?Temp Data Ls
  return {
    name: "Zomato",
    operationHealth: oh,
    revenue_score: revenue_score === undefined ? 0 : revenue_score,

    // Todo : temp data
    listingScore: {
      listingScoreDate: "",
      listingScoreMain: {
        value: "Please wait! We are working on It.",
        type: "percentage",
        compareThen: "grater",
        benchmark: 90,
        isDataPresent: false,
      },
      listingScoreData: [
        // ?Safety Tag
        {
          name: "Safety Tag",
          type: "string",
          benchmark: "Yes",
          compareThen: "yes or no",
          info: "Ensure that you have the Safety Tag! This draws in customers and boosts orders!",
          suggestions: [
            "Get safety tag for your restaurant",
            "Reach out to us or 3rd parties who help in getting the tag",
          ],
          value: "Please wait! We are working on It.",
          isDataPresent: false,
        },

        // ?Image %
        // !Benchmark is not present
        {
          name: "No. of Images",
          type: "percentage",
          benchmark: 200,
          compareThen: "High Medium Low",
          info: "Make sure that all your menu items have different images! Swiggy increases your visibility!",
          suggestions: [
            "Add images to minimum 30 items",
            "Contact Voosh photoshoot service for quality images",
          ],
          value: "Please wait! We are working on It.",
          isDataPresent: false,
        },
        // !Number of Ratings
        // ?Number of Rating
        {
          name: "Number of Rating",
          type: "percentage",
          benchmark: 90,
          compareThen: "High Medium Low",
          info: "More ratings helps you improve visibility",
          suggestions: [
            "Increase number of reviews through personalized notes",
            -"Improve customer service",
            "Provide complimentory dishes",
          ],
          value: "Please wait! We are working on It.",
          isDataPresent: false,
        },

        // ! Rating
        // ?Ratings
        {
          name: "Rating",
          type: "string",
          benchmark: "4.0",
          compareThen: "string",
          info: "Ratings is very directly related to sales",
          suggestions: [
            "Improve reviews by understanding the problem areas",
            "Contact Voosh for Rating Booster service",
          ],
          value: "Please wait! We are working on It.",
          isDataPresent: false,
        },

        // ?Offer1
        {
          name: "Offer 1",
          // ? cuz data mein spelling wrong hai
          type: "string",
          benchmark: "Applicable",
          compareThen: "applicable or not applicable",
          info: "Running an offer increases your visibility ranking",
          suggestions: [
            "Running an offer increases your visibility ranking",
            "Running multiple offer have much more impact",
          ],
          value: "Please wait! We are working on It.",
          isDataPresent: false,
        },
        // ?Offer2
        {
          name: "Offer 2",
          // ? cuz data mein spelling wrong hai
          type: "string",
          benchmark: "Applicable",
          compareThen: "applicable or not applicable",
          info: "Running multiple offer have much more impact",
          suggestions: [
            "Running an offer increases your visibility ranking",
            "Running multiple offer have much more impact",
          ],
          value: `Please wait! We are working on It.`,
          isDataPresent: false,
        },

        // ?Description %
        {
          name: "Item Description",
          type: "percentage",
          compareThen: "grater",
          benchmark: 70,
          info: "Make sure that all your menu items have descriptions! Swiggy increases your visibility!",
          suggestions: [
            "Add descriptions into more items",
            "Use good keywords in item descriptons",
          ],
          value: "Please wait! We are working on It.",
          isDataPresent: false,
        },
        // ?Beverage Category
        {
          name: "Beverages Category",
          type: "string",
          benchmark: "Yes",
          compareThen: "yes or no",
          info: "Beverages Category = yes Gets more orders",
          suggestions: ["Add breverage category and corrosponding item"],
          value: "Please wait! We are working on It.",
          isDataPresent: false,
        },
        // ?"bestseller_%_in_recommended_vs_without_recommended_data"
        {
          name: "Best Seller Score",
          type: "percentage",
          benchmark: 80,
          compareThen: "grater",
          info: "Target to have more than 80% of non recommended as bestsellers for better growth",
          suggestions: [],
          value: "Please wait! We are working on It.",

          isDataPresent: false,
        },
        // ?Desserts/Sweet category
        {
          name: "Desserts",
          type: "string",
          benchmark: "Yes",
          compareThen: "yes or no",
          info: "Having a desert category improves listing score",
          suggestions: ["Add Desserts category and corrosponding item"],
          value: `Please wait! We are working on It.`,
          isDataPresent: false,
        },
      ],
    },
    customerReviews: {
      value: "working on It.",
      type: "average",
      compareType: "grater",
    },

    previousMonthRevenue: {
      previousDayRevenue: 0,
      isDataPresent: false,
      financicalData: {
        totalCancellation: 0,
        totalSales: 0,
        netPayout: 0,
        deleveries: 0,
        cancelledOrders: 0,
        deductions: {},
      },
    },
  };
}

module.exports = {
  getAllZomatoData,
};
