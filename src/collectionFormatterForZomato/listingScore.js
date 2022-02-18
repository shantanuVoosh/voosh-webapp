const { MongoClient } = require("mongodb");
const VooshDB =
  "mongodb://analyst:gRn8uXH4tZ1wv@35.244.52.196:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";
const documentName = "operationsdb";

// ! new Listing Score data with most recent data
// ? Only res_id is required, we are sorting most recent year, month, week
const listingScoreMostRecentMongoDBData = async (res_id) => {
  try {
    const client = await MongoClient.connect(VooshDB, {
      useNewUrlParser: true,
    });
    const db = client.db(documentName);

    listingScoreData = await db
      .collection("zomato_audit_score")
      .aggregate([
        {
          $match: {
            zomto_res_id: res_id,
          },
        },
        { $sort: { year_no: -1, month_no: -1, week_no: -1 } },
        { $limit: 1 },
      ])
      .toArray();

    const static_rating = await db
      .collection("zomato_static_rating_products")
      .aggregate([
        {
          $match: { zomato_res_id: parseInt(res_id) },
        },
        { $sort: { year_no: -1, month_no: -1, week_no: -1 } },
        { $limit: 1 },
      ])
      .toArray();

    //! if resultType is not week or month!

    console.log("------******------");
    console.log(
      "listingScoreData--------------------------.................:",
      listingScoreData
    );
    console.log("------******------");
    const listingScore = listingScoreData[0];

    client.close();

    return {
      score: listingScore?.Score,
      delivery_no_review: listingScore?.delivery_no_review,
      offer_1: listingScore?.offer1,
      offer_2: listingScore?.offer2,
      offer_3: listingScore?.offer3,
      offer_4: listingScore?.offer4,

      beverages_category: listingScore?.beverages,
      desserts: listingScore?.dessert,
      safety_tag: listingScore?.safety,
      //?  .30701754385964913 --> 30%
      Image: listingScore?.images,
      //?  1 -> 100%
      description: listingScore?.description,
      listingScoreDate: listingScore?.run_date,
      VoteScore: listingScore?.No_Add_items_in_rec,

      // Todo: in place of delivery_review will use static rating
      delivery_review: listingScore?.delivery_review,
      static_rating: static_rating[0]?.delivery_ratings,
    };
  } catch (err) {
    console.log(err);
    return {
      error: err,
    };
  }
};

const listingScoreDataFormatter = async (res_id, number, resultType) => {
  try {
    const data = await listingScoreMostRecentMongoDBData(res_id);
    const {
      score,
      delivery_no_review,
      delivery_review,
      offer_1,
      offer_2,
      offer_3,
      offer_4,
      beverages_category,
      desserts,
      safety_tag,
      Image,
      description,
      listingScoreDate,
      VoteScore,
      static_rating
    } = data;

    // !If the values inside data is not present, then it will return undefined
    const listing = {
      // Todo: can we put like this?
      listingScoreDate: listingScoreDate ? listingScoreDate : "",
      listingScoreMain: {
        value: score === undefined ? null : score * 10,
        type: "percentage",
        compareThen: "grater",
        benchmark: 90,
        isDataPresent: score === undefined ? false : true,
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
          value:
            safety_tag === undefined
              ? null
              : safety_tag === "Not present"
              ? "No"
              : "Yes",
          isDataPresent: safety_tag === undefined ? false : true,
        },

        // ?Image %
        {
          name: "Images",
          type: "percentage",
          benchmark: 100,
          compareThen: "High Medium Low",
          info: "Make sure that all your menu items have different images! Swiggy increases your visibility!",
          suggestions: [
            "Add images to minimum 30 items",
            "Contact Voosh photoshoot service for quality images",
          ],
          value:
            Image === undefined ? null : parseFloat((Image * 100).toFixed(2)),
          isDataPresent: Image === undefined ? false : true,
        },

        // !Number of Review
        {
          name: "Number of Rating",
          type: "number",
          benchmark: 5000,
          compareThen: "High Medium Low",
          info: "More ratings helps you improve visibility",
          suggestions: [
            "Increase number of reviews through personalized notes",
            -"Improve customer service",
            "Provide complimentary dishes",
          ],
          value: delivery_no_review === undefined ? null : delivery_no_review,
          isDataPresent: delivery_no_review === undefined ? false : true,
        },
        // !Vote Score
        {
          name: "Vote Score",
          type: "number",
          benchmark: 5,
          compareThen: "less",
          info: "Items that not present in Recommended",
          suggestions: [],
          value: VoteScore === undefined ? null : VoteScore,
          isDataPresent: VoteScore === undefined ? false : true,
        },

        // // ! "Review(star)"
        // {
        //   name: "Rating",
        //   type: "string",
        //   benchmark: 3.7,
        //   compareThen: "string",
        //   info: "Ratings is very directly related to sales",
        //   suggestions: [
        //     "Improve reviews by understanding the problem areas",
        //     "Contact Voosh for Rating Booster service",
        //   ],
        //   value: delivery_review === undefined ? null : delivery_review,
        //   isDataPresent: delivery_review === undefined ? false : true,
        // },
        // ! "Rating "

        {
          name: "Rating",
          type: "string",
          benchmark: 4.5,
          compareThen: "string",
          info: "Ratings is very directly related to sales",
          suggestions: [
            "Improve reviews by understanding the problem areas",
            "Contact Voosh for Rating Booster service",
          ],
          value: static_rating === undefined ? null : static_rating,
          isDataPresent: static_rating === undefined ? false : true,
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
          value:
            offer_1 === undefined
              ? null
              : offer_1 === null
              ? "Not Applicable"
              : "Applicable",
          isDataPresent: offer_1 === undefined ? false : true,
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
          value:
            offer_2 === undefined
              ? null
              : offer_2 === null
              ? "Not Applicable"
              : "Applicable",
          isDataPresent: offer_2 === undefined ? false : true,
        },
        // ?Offer3
        {
          name: "Offer 3",
          // ? cuz data mein spelling wrong hai
          type: "string",
          benchmark: "Applicable",
          compareThen: "applicable or not applicable",
          info: "Running an offer increases your visibility ranking",
          suggestions: [
            "Running an offer increases your visibility ranking",
            "Running multiple offer have much more impact",
          ],
          value:
            offer_3 === undefined
              ? null
              : offer_3 === null
              ? "Not Applicable"
              : "Applicable",
          isDataPresent: offer_3 === undefined ? false : true,
        },
        // ?Offer4
        {
          name: "Offer 4",
          // ? cuz data mein spelling wrong hai
          type: "string",
          benchmark: "Applicable",
          compareThen: "applicable or not applicable",
          info: "Running multiple offer have much more impact",
          suggestions: [
            "Running an offer increases your visibility ranking",
            "Running multiple offer have much more impact",
          ],
          value:
            offer_4 === undefined
              ? null
              : offer_4 === null
              ? "Not Applicable"
              : "Applicable",
          isDataPresent: offer_4 === undefined ? false : true,
        },

        // ?Description %
        {
          name: "Item Description",
          type: "percentage",
          compareThen: "grater",
          benchmark: 85,
          info: "Make sure that all your menu items have descriptions! Swiggy increases your visibility!",
          suggestions: [
            "Add descriptions into more items",
            "Use good keywords in item descriptions",
          ],
          value: description === undefined ? null : parseInt(description * 100),
          isDataPresent: description === undefined ? false : true,
        },
        // ?Beverage Category
        {
          name: "Beverages Category",
          type: "string",
          benchmark: "Yes",
          compareThen: "yes or no",
          info: "Beverages Category = yes Gets more orders",
          suggestions: ["Add breverage category and corrosponding item"],
          value:
            beverages_category === undefined
              ? null
              : beverages_category === "no"
              ? "No"
              : "Yes",
          isDataPresent: beverages_category === undefined ? false : true,
        },
        // ?Desserts/Sweet category
        {
          name: "Desserts",
          type: "string",
          benchmark: "Yes",
          compareThen: "yes or no",
          info: "Having a desert category improves listing score",
          suggestions: ["Add Desserts category and corrosponding item"],
          value:
            desserts === undefined ? null : desserts === "no" ? "No" : "Yes",
          isDataPresent: desserts === undefined ? false : true,
        },
      ],
    };
    return listing;
  } catch (err) {
    console.log(err);
    return {
      error: err,
    };
  }
};

module.exports = {
  listingScoreDataFormatter,
};
