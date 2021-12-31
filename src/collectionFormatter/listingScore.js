const { MongoClient } = require("mongodb");
const VooshDB =
  "mongodb://analyst:gRn8uXH4tZ1wv@35.244.52.196:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";
const documentName = "operationsdb";

const listingScoreMongoDBData = async (res_id, number, resultType) => {
  // ? key is different in collection

  // console.log("listingScoreMongoDBData:", res_id, number, resultType);

  try {
    const client = await MongoClient.connect(VooshDB, {
      useNewUrlParser: true,
    });
    const db = client.db(documentName);

    let listingScore;

    // ! Cuz this upadated on Weekly basis
    if (resultType === "week") {
      // console.log("week-------------->")
      const query = {
        swiggy_res_id: `${res_id}`,
        week_no: `${number}`,
      };
      listingScore = await db
        .collection("swiggy_weekly_listing_score_products")
        .findOne(query);
    }

    // ! Last  Week of that Month, In case of Monthly result
    else if (resultType === "month") {
      // console.log("month------------->")
      query = {
        swiggy_res_id: `${res_id}`,
        month_no: `${number}`,
      };

      listingScore = await db
        .collection("swiggy_weekly_listing_score_products")
        .aggregate([
          { $match: query },
          { $sort: { week_no: -1 } },
          { $limit: 1 },
        ])
        .toArray();

      listingScore = listingScore[0];
    }

    //! if resultType is not week or month!
    else {
      listingScore = {
        dataPresent: false,
      };
    }

    // console.log("------******------");
    // console.log("listingScore--------------------------.................:", listingScore);
    // console.log("------******------");

    client.close();
    return {
      score: listingScore?.score,
      safety_tag: listingScore?.safety_tag,
      rating: listingScore?.rating,
      number_of_rating: listingScore?.number_of_rating,
      offer_1: listingScore?.offer_1,
      offer_2: listingScore?.offer_2,
      beverages_category: listingScore?.beverages_category,
      desserts: listingScore?.["desserts/sweet_category"],
      image: listingScore?.["image_%"],
      bestsellers_score_in_recommended:
        listingScore?.[
          "bestseller_%_in_recommended_vs_without_recommended_data"
        ],
      description: listingScore?.["description_%"],
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
    const data = await listingScoreMongoDBData(res_id, number, resultType);
    // console.log("listingScoreDataFormatter res_id, number, resultType", res_id, number, resultType);
    // console.log("listingScoreMongoDBData:", data);
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
    } = data;
    // console.log("lsitingscore data:", data);
    // !If the values inside data is not present, then it will return undefined
    const listing = {
      listingScoreMain: {
        value:
          score === undefined
            ? "Please wait! We are working on It."
            : score * 10,
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
              ? "Please wait! We are working on It."
              : safety_tag,
          isDataPresent: safety_tag === undefined ? false : true,
        },

        // ?Image %
        // !Benchmark is not present
        {
          name: "Images",
          type: "percentage",
          benchmark: 200,
          compareThen: "High Medium Low",
          info: "Make sure that all your menu items have different images! Swiggy increases your visibility!",
          suggestions: [
            "Add images to minimum 30 items",
            "Contact Voosh photoshoot service for quality images",
          ],
          value:
            image === undefined
              ? "Please wait! We are working on It."
              : image * 100,
          isDataPresent: image === undefined ? false : true,
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
          value:
            number_of_rating === undefined
              ? "Please wait! We are working on It."
              : number_of_rating,
          isDataPresent: number_of_rating === undefined ? false : true,
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
          value:
            rating === undefined
              ? "Please wait! We are working on It."
              : rating,
          isDataPresent: rating === undefined ? false : true,
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
              ? "Please wait! We are working on It."
              : offer_1 === "Not aplicable"
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
              ? "Please wait! We are working on It."
              : offer_2 === "Not aplicable"
              ? "Not Applicable"
              : "Applicable",
          isDataPresent: offer_2 === undefined ? false : true,
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
          value:
            description === undefined
              ? "Please wait! We are working on It."
              : parseInt(description * 100),
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
              ? "Please wait! We are working on It."
              : beverages_category,
          isDataPresent: beverages_category === undefined ? false : true,
        },
        // ?"bestseller_%_in_recommended_vs_without_recommended_data"
        {
          name: "Bestseller Without Recommended",
          type: "percentage",
          benchmark: 80,
          compareThen: "grater",
          info: "Target to have more than 80% of non recommended as bestsellers for better growth",
          suggestions: [],
          value:
            bestsellers_score_in_recommended === undefined
              ? "Please wait! We are working on It."
              : parseInt(bestsellers_score_in_recommended * 100),
          isDataPresent:
            bestsellers_score_in_recommended === undefined ? false : true,
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
            desserts === undefined
              ? "Please wait! We are working on It."
              : desserts,
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
  listingScoreMongoDBData,
};
