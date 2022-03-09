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
      .collection("swiggy_weekly_listing_score_products")
      .aggregate([
        {
          $match: {
            swiggy_res_id: parseInt(res_id),
          },
        },
        { $sort: { year_no: -1, month_no: -1, week_no: -1 } },
        { $limit: 1 },
      ])
      .toArray();
    const rating = await db
      .collection("swiggy_static_rating_products")
      .aggregate([
        {
          $match: { res_id: parseInt(res_id) },
        },
        { $sort: { year_no: -1, month_no: -1, week_no: -1 } },
        { $limit: 1 },
      ])
      .toArray();

    //! if resultType is not week or month!

    // console.log("*****************--------------------********************");
    // console.log("listingScoreData", listingScoreData);
    // console.log("*****************--------------------********************");
    const listingScore = listingScoreData[0];
    
    console.log("*****************--------------------********************");
    console.log("Swiggy Listing Score Data - (Swiggy LS Values)");
    console.log("score: ", listingScore?.score);
    console.log("safety_tag: ", listingScore?.safety_tag);
    console.log("rating:", rating[0]?.customer_rating);
    console.log("rating: ", listingScore?.customer_rating);
    console.log("number_of_rating: ", listingScore?.number_of_rating);
    console.log("offer_1: ", listingScore?.offer_1);
    console.log("offer_2: ", listingScore?.offer_2);
    console.log("desserts: ", listingScore?.["desserts/sweet_category"]);
    console.log("image: ", listingScore?.["image_%"]);
    console.log(
      "bestsellers_score: ",
      listingScore?.["bestseller_%_in_recommended_vs_without_recommended_data"]
    );
    console.log("description: ", listingScore?.["description_%"]);
    console.log("listingScoreDate: ", listingScore?.start_date);

    console.log("*****************--------------------********************");

    client.close();
    return {
      score: listingScore?.score,
      safety_tag: listingScore?.safety_tag,
      // rating: listingScore?.rating,
      rating: rating[0]?.customer_rating,
      number_of_rating: listingScore?.number_of_rating,
      offer_1: listingScore?.offer_1,
      offer_2: listingScore?.offer_2,
      beverages_category: listingScore?.beverages_category,
      desserts: listingScore?.["desserts/sweet_category"],
      image: listingScore?.["number_of_images"],
      bestsellers_score_in_recommended:
        listingScore?.[
          "bestseller_%_in_recommended_vs_without_recommended_data"
        ],
      description: listingScore?.["description_%"],
      listingScoreDate: listingScore?.start_date,
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
    // const data = await listingScoreMongoDBData(res_id, number, resultType);

    const data = await listingScoreMostRecentMongoDBData(res_id);
    const {
      score,
      safety_tag,
      rating,
      number_of_rating,
      offer_1,
      offer_2,
      beverages_category,
      desserts,
      image,
      bestsellers_score_in_recommended,
      description,
      listingScoreDate,
    } = data;
    // console.log("lsitingscore data:", data);
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
          value: safety_tag === undefined ? null : safety_tag,
          isDataPresent: safety_tag === undefined ? false : true,
          contentType: "safetyTag",
        },

        // ?Image %
        // !Benchmark is not present
        {
          name: "Images",
          type: "percentage",
          benchmark: 60,
          compareThen: "High Medium Low",
          info: "Make sure that all your menu items have different images! Swiggy increases your visibility!",
          suggestions: [
            "Add images to minimum 30 items",
            "Contact Voosh photoshoot service for quality images",
          ],
          value: image === undefined ? null : image,
          isDataPresent: image === undefined ? false : true,
          contentType: "image",
          contentType: "image/description",
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
          value: number_of_rating === undefined ? null : number_of_rating,
          isDataPresent: number_of_rating === undefined ? false : true,
          contentType: "number of rating",
        },

        // ! Rating
        // ?Ratings
        {
          name: "Rating",
          type: "number",
          benchmark: 4.5,
          compareThen: "grater",
          info: "Ratings is very directly related to sales",
          suggestions: [
            "Improve reviews by understanding the problem areas",
            "Contact Voosh for Rating Booster service",
          ],
          value: rating === undefined ? null : rating,
          isDataPresent: rating === undefined ? false : true,
          contentType: "rating",
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
              : offer_1 === "Not aplicable"
              ? "Not Applicable"
              : "Applicable",
          isDataPresent: offer_1 === undefined ? false : true,
          contentType: "offer",
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
              : offer_2 === "Not aplicable"
              ? "Not Applicable"
              : "Applicable",
          isDataPresent: offer_2 === undefined ? false : true,
          contentType: "offer",
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
          value: description === undefined ? null : parseInt(description * 100),
          isDataPresent: description === undefined ? false : true,
          contentType: "image/description",
        },
        // ?Beverage Category
        {
          name: "Beverages Category",
          type: "string",
          benchmark: "Yes",
          compareThen: "yes or no",
          info: "Beverages Category = yes Gets more orders",
          suggestions: ["Add breverage category and corrosponding item"],
          value: beverages_category === undefined ? null : beverages_category,
          isDataPresent: beverages_category === undefined ? false : true,
          contentType: "beverage",
        },
        // ?"bestseller_%_in_recommended_vs_without_recommended_data"
        {
          name: "Best Seller Score",
          type: "percentage",
          benchmark: 80,
          compareThen: "grater",
          info: "Target to have more than 80% of non recommended as bestsellers for better growth",
          suggestions: [],
          value:
            bestsellers_score_in_recommended === undefined
              ? null
              : parseInt(bestsellers_score_in_recommended * 100),
          isDataPresent:
            bestsellers_score_in_recommended === undefined ? false : true,
            contentType: "bestseller",
        },
        // ?Desserts/Sweet category
        {
          name: "Desserts",
          type: "string",
          benchmark: "Yes",
          compareThen: "yes or no",
          info: "Having a desert category improves listing score",
          suggestions: ["Add Desserts category and corrosponding item"],
          value: desserts === undefined ? null : desserts,
          isDataPresent: desserts === undefined ? false : true,
          contentType: "dessert",
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
