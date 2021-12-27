const { MongoClient } = require("mongodb");
const { video_urls } = require("./traning_video_urls");
const {
  getCurrentDate,
  getYesterdayDate,
  getTomorrowDate,
  getCurrentDateBefore12HoursAgo,
  getYesterdayDateBefore12HoursAgo,
  getPreviousWeek,
} = require("./dateProvide");
const VooshDB =
  "mongodb://analyst:gRn8uXH4tZ1wv@35.244.52.196:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";

// ! removed the default values for res_id
// ?red_id casesensitive hai! cuz query krna hai
async function getRequiredCollectionDataFromMongodb(res_id = 256302) {
  console.log(
    "---------- <getRequiredCollectionDataFromMongodb Start> ----------------"
  );
  console.log("Current res_id:", res_id);

  documentName = "operationsdb";
  const todaysDate = getCurrentDate();
  const yesterdayDate = getYesterdayDate();
  const tomorrowDate = getTomorrowDate();
  const previousWeek = getPreviousWeek();
  const currentDateBefore12HoursAgo = getCurrentDateBefore12HoursAgo();
  const yesterdayDateBefore12HoursAgo = getYesterdayDateBefore12HoursAgo();
  console.log("Yesterday Date:", yesterdayDate);
  console.log("Todays Date:", todaysDate);
  console.log("Tomorrow Date:", tomorrowDate);
  console.log("Current Date Before 12 Hours Ago:", currentDateBefore12HoursAgo);
  console.log(
    "Yesterday Date Before 12 Hours Ago:",
    yesterdayDateBefore12HoursAgo
  );
  console.log("Previous Week:", previousWeek);

  const collectionRequired = [
    {
      name: "Non_Voosh_Orderwise2",
      query: {
        "Res Id": res_id,
        Rating: { $ne: null },
        Feedback: { $ne: null },
      },
    },
    {
      name: "Swiggy_Acceptance_v1",
      query: {
        swiggy_res_id: res_id,
        run_date: yesterdayDateBefore12HoursAgo,
      },
    },
    {
      name: "Swiggy_IGCC",
      query: {
        "Res Id": res_id,
        Start_Date: { $lt: yesterdayDateBefore12HoursAgo },
        End_Date: { $gt: yesterdayDateBefore12HoursAgo },
      },
    },
    {
      name: "Swiggy_Kitchen_Servicibility",
      query: {
        res_id: res_id,
        Date: yesterdayDateBefore12HoursAgo,
      },
    },
    {
      name: "Swiggy_MFR",
      query: {
        Res_Id: res_id,
        Date: yesterdayDateBefore12HoursAgo,
      },
    },
    {
      name: "Swiggy_RDC",
      query: {
        "Res Id": res_id,
        Date: yesterdayDateBefore12HoursAgo,
      },
    },
    {
      name: "Swiggy_Revenue",
      query: {
        Res_Id: res_id,
        Date: yesterdayDateBefore12HoursAgo,
      },
    },
    {
      name: "Swiggy_Static_ratings",
      query: {
        "Res ID": res_id,
        // ?this present for today's date
        // Date: currentDateBefore12HoursAgo,
        Date: yesterdayDateBefore12HoursAgo,
      },
    },
    {
      name: "Swiggy_ratings",
      query: {
        "Res Id": res_id,
        Date: yesterdayDateBefore12HoursAgo,
      },
    },
    {
      name: "Listing_Audit_Score",
      query: {
        "Res Id": res_id,
        // ?this present for 15 dec Previous week
        // Date: yesterdayDateBefore12HoursAgo,
        // Date: yesterdayDateBefore12HoursAgo,
      },
    },
    {
      name: "swiggy_weekly_listing_score_products",
      query: {
        swiggy_res_id: `${res_id}`,
        // ?this present for 15 dec Previous week
      },
    },
    // {
    //   name: "Monthy_OH_Score",
    //   query: {
    //     "Res Id": res_id,
    // "Date": yesterdayDate,
    // Date: { $gte: yesterdayDate, $lte: tomorrowDate },
    // Date: { $gte: yesterdayDate, $lte: currentDateBefore12HoursAgo },
    //   },
    // },
    {
      name: "Weekly_OH_Score",
      query: {
        "Res Id": res_id,
        // "Date": yesterdayDate,
        // Date: { $gte: yesterdayDate, $lte: tomorrowDate },
        // Date: { $gte: yesterdayDate, $lte: currentDateBefore12HoursAgo },
      },
    },
    {
      name: "NON_Voosh_swiggy_reconsilation",
      query: {
        Swiggy_id: res_id,
        // "Date": yesterdayDate,
        // Date: { $gte: yesterdayDate, $lte: tomorrowDate },
        // Date: { $gte: yesterdayDate, $lte: currentDateBefore12HoursAgo },
      },
    },
    {
      name: "Weekly_review_analytics",
      query: {
        swiggy_res_id: res_id,
        sum: { $gt: 0 },
        // "Date": yesterdayDate,
        // Date: { $gte: yesterdayDate, $lte: tomorrowDate },
        // Date: { $gte: yesterdayDate, $lte: currentDateBefore12HoursAgo },
      },
    },
  ];

  // ! Collecting all Provided Collection Data
  try {
    const client = await MongoClient.connect(VooshDB, {
      useNewUrlParser: true,
    });
    const db = client.db(documentName);
    const promiseArray = collectionRequired.map(async (collection) => {
      const { name, query } = collection;
      return await db.collection(name).find(query).toArray();
    });

    const resolveData = await Promise.all(promiseArray);

    const apiResult = collectionRequired.reduce((prevObj, currName, index) => {
      const { name } = currName;
      prevObj[name] = resolveData[index];
      return { ...prevObj };
    }, {});

    console.log(
      "---------- <getRequiredCollectionDataFromMongodb Success End> ----------------"
    );

    return apiResult;
  } catch (err) {
    console.log("Error while getting data from DB: ", err);
    console.log(
      "---------- <getRequiredCollectionDataFromMongodb Error End> ----------------"
    );
    return {};
  }
}
// console.log("Revenue " ,apiResponse["Swiggy_Revenue"]);
// console.log("rest_Serviceability: ", rest_Serviceability);
// console.log("Rest_Acceptance: ", Object.keys(rest_Acceptance));
// console.log("rest_igcc: ", Object.keys(rest_igcc));
// console.log("rest_Serviceability: ", Object.keys(rest_Serviceability));
// console.log("rest_MFR: ", Object.keys(rest_MFR));
// console.log("rest_RDC: ", Object.keys(rest_RDC));
// console.log("avrage_ratings: ", Object.keys(avrage_ratings));
// console.log("listing_audit_score: ", Object.keys(listing_audit_score));
// console.log("customer_ratings: ", Object.keys(customer_ratings));
// console.log("rest_oders: ", Object.keys(rest_oders));
// console.log("revenue: ", Object.keys(revenue));

function structureMongodbData(apiResponse) {
  // ! try catch krna hai
  // !Operation_Health_Data
  let i = 0;
  const rest_Acceptance = apiResponse["Swiggy_Acceptance_v1"][0];
  const operationHealthWeeklyResult = apiResponse["Weekly_OH_Score"][0];
  const rest_igcc = apiResponse["Swiggy_IGCC"][0];
  const rest_Serviceability = apiResponse["Swiggy_Kitchen_Servicibility"][0];
  const rest_MFR = apiResponse["Swiggy_MFR"][0];
  const rest_RDC = apiResponse["Swiggy_RDC"][0];
  const avrage_ratings = apiResponse["Swiggy_Static_ratings"][0];
  // ?review_analytics
  const customer_ratings = apiResponse["Swiggy_ratings"][0];
  const review_analytics = apiResponse["Weekly_review_analytics"];
  const all_oders_review = apiResponse["Non_Voosh_Orderwise2"];

  // !listing_audit_score
  const listing_audit_score = apiResponse["Listing_Audit_Score"][0];

  const rest_oders = apiResponse["Non_Voosh_Orderwise2"][0];
  const Weekly_review_analytics = apiResponse["Weekly_review_analytics"];

  //? Grabbing the all negative reviews in {name: "item_name", Value: "value"} format
  const negative_review_items = review_analytics.map((item) => {
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

    console.log("food_negative_review_items: ", food_negative_review_items);

    return {
      item_name: item_name,
      issues: [...food_negative_review_items.slice(0, 3)],
    };
  });
  console.log("Revenue ", apiResponse["Swiggy_Revenue"]);
  // ? Grabbing the all reviews in {order_id:id...} format

  const all_reviews = all_oders_review.map((item, index) => {
    const months = {
      Jan: "01",
      Feb: "02",
      Mar: "03",
      Apr: "04",
      May: "05",
      Jun: "06",
      Jul: "07",
      Aug: "08",
      Sep: "09",
      Oct: "10",
      Nov: "11",
      Dec: "12",
    };

    let modify_time_format = item["Date"].split(" ")[0].split("-");
    modify_time_format =
      modify_time_format[2] +
      months[modify_time_format[1]] +
      modify_time_format[0];

    return {
      order_id: item["Order Id"],
      // ?for time being date : date: "20201107",
      date: modify_time_format,
      // date: (item["Date"].split(" ")[0]).split("-").join(""),
      rating: item["Rating"],
      feedback: item["Feedback"].replace(/(\r\n|\n|\r)/gm, " ").substring(1),
    };
  });

  console.log("all_review_items: ", all_reviews);

  // ?calculating the data manually
  const wrongItemComplaintsOrders = parseFloat(
    rest_igcc["Wrong Item Complaints Orders"]
  );
  const missingItemComplaintsOrders = parseFloat(
    rest_igcc["Missing Item Complaints Orders"]
  );

  // ? Customer Complains
  const valueForIGCC =
    wrongItemComplaintsOrders + missingItemComplaintsOrders !== 0
      ? (wrongItemComplaintsOrders + missingItemComplaintsOrders) / 2
      : 0;

  // ! Revenue or Financical Data
  const revenue = apiResponse["Swiggy_Revenue"][0];
  const revenue_financical = apiResponse["NON_Voosh_swiggy_reconsilation"][0];

  const totalSales = revenue_financical["Total Customer Payable "];
  const netPayout = revenue_financical["Net Payout  (E - F - G)"];
  const deleveries = revenue_financical["Number of orders"];
  const cancelledOrders = rest_RDC["Res_Cancellation"];

  // Todo: All Deduction Values
  // *1. Platform Services Charges = "Swiggy Platform Service Fee"*(1.18)-"Discount on Swiggy Service Fee"*(1.18)
  // *2. Cancellation Deduction = "Merchant Cancellation Charges"*(1.18)+"Merchant Share Of Cancelled Orders"
  // *3.Other OFD deduction ="Collection Charges"*(1.18)+Access Charges"*(1.18)+"Call Center Service Fee"*(1.18)
  // *4. Promotions = "High Priority"+""Homepage Banner
  // *5. Previous Week Outstanding =  "Outstanding For Previous Weeks"+"Excess payout"
  // *6. Other Adjustments or misc = "Cash Pre-Payment to Merchant"+"Delivery Fee Sponsored By Merchant"+"Refund for Disputed Orders"+"Refund"+"Onboarding Fees"+("Long Distance Pack Fee")abs
  // *7. TCS = "TCD"
  // *8. TDS = "TDS"

  const deductions = {
    " Platform Services Charges":
      revenue_financical["Swiggy Platform Service Fee"] * 1.18 +
      revenue_financical["Discount on Swiggy Service Fee"] * 1.18,

    "Cancellation Deduction":
      revenue_financical["Merchant Cancellation Charges"] * 1.18 +
      revenue_financical["Merchant Share Of Cancelled Orders"],

    "Other OFD deduction":
      revenue_financical["Collection Charges"] * 1.18 +
      revenue_financical["Access Charges"] * 1.18 +
      revenue_financical["Call Center Service Fee"] * 1.18,

    Promotions:
      revenue_financical["High Priority"] +
      revenue_financical["Homepage Banner"],

    "Previous Week Outstanding":
      revenue_financical["Outstanding For Previous Weeks"] +
      revenue_financical["Excess payout"],

    Miscellaneous:
      revenue_financical["Cash Pre-Payment to Merchant"] +
      revenue_financical["Delivery Fee Sponsored By Merchant"] +
      revenue_financical["Refund for Disputed Orders"] +
      revenue_financical["Refund"] +
      revenue_financical["Onboarding Fees"] +
      Math.abs(revenue_financical["Long Distance Pack Fee"]),

    TCS: revenue_financical["TCS"],
    TDS: revenue_financical["TDS"],
  };

  // Todo: Training Videod
  const { RDC_video, Serviceability_video, MFR_video, Ratings_video } =
    video_urls;

  const data = {
    // ?name of the restaurant
    name: "Swiggy",
    // !Operation Health

    operationHealth: {
      operationHealthMain: {
        name: "Operation Health",
        type: "percentage",
        info: "Operation Health >= 95% Gets more orders",
        benchmark: 95,
        monthlyResult: 97,
        weeklyResult: operationHealthWeeklyResult["Weekly_OH_Score"] * 2 * 10,
      },
      operationHealthData: [
        // ?Swiggy_Kitchen_Servicibility
        {
          name: "Rest. Serviceability",
          type: "percentage",
          info: "Servicibility >= 95% Gets more orders",
          // ! ye target mein jayega graph
          benchmark: 100,
          compareThen: "grater",
          videoLink: Serviceability_video,
          monthlyResult: rest_Serviceability["Monthly_Servicibility"],
          weeklyResult: rest_Serviceability["Weekly_Servicibility"],
          recommendations: ["Get the serviceability notification service"],
        },
        // ?Swiggy_RDC
        {
          name: "Rest. Cancellations",
          type: "percentage",
          info: "Cancellation Charges <= 5% Gets more orders",
          benchmark: 5,
          compareThen: "less",
          videoLink: RDC_video,
          monthlyResult: rest_RDC["Monthly_avg_RDC"] * 100,
          weeklyResult: rest_RDC["Weekly_avg_RDC"] * 100,
          recommendations: [
            "Ensure Restaurant open at the given timings to swiggy and zomato",
            "Ensure stock of best seller items always ready. Click <<here>> for list of items that are getting cancelled often because of stock outs",
          ],
        },

        // ?Swiggy_Static_ratings
        {
          name: "Rating",
          type: "rating",
          info: "Rating > 4.5 Gets better orders",
          benchmark: 4.5,
          compareThen: "grater",
          videoLink: Ratings_video,
          monthlyResult: avrage_ratings["Monthly_Rating"],
          weeklyResult: avrage_ratings["Weekly_Rating"],
          recommendations: [
            "Improve reviews by understanding the problem areas",
            "Contact Voosh for Rating Booster service",
          ],
        },
        // ?Swiggy_MFR
        {
          name: "MFR Accuracy",
          type: "percentage",
          info: "MFR Accuracy >=95 Gets more orders",
          benchmark: 95,
          compareThen: "grater",
          videoLink: MFR_video,
          monthlyResult: rest_MFR["Monthly_Mfr"],
          weeklyResult: rest_MFR["Weekly_Mfr"],
          recommendations: [
            "Press food ready button only when food prepared, not before",
            "If you forget to mark food ready, take the MFR calling service. Tap here!",
          ],
        },
        // ? IGCC
        {
          name: "Customer Complaints",
          // name: "Wrong/Missing item",
          type: "percentage",
          info: "Complains <=1 Gets more orders",
          benchmark: 1,
          compareThen: "less",
          wrongItemComplaintsOrders: rest_igcc["Wrong Item Complaints Orders"],
          missingItemComplaintsOrders:
            rest_igcc["Missing Item Complaints Orders"],
          value: valueForIGCC,
          recommendations: [
            "Paste a menu + item poster at the packaging area",
            "Retrain packagers on high order days",
          ],
        },
        // ?Swiggy_Acceptance
        {
          name: "Acceptance",
          type: "percentage",
          info: "Acceptance = 100% Gets more orders",
          benchmark: 99,
          compareThen: "grater",
          value: parseFloat(rest_Acceptance["accept_orders"]),
          recommendations: ["Enable Auto acceptance"],
        },
      ],
    },

    // !listing_audit_score

    listingScore: {
      // ?listingScore in Dashboard
      listingScoreMain: Number(
        listing_audit_score["Listing_Score_pre"]
      ).toFixed(2),

      // ?listingScore Data
      listingScoreData: {
        "Safety Tag": {
          name: "Safety Tag",
          value: listing_audit_score["safety tag"],
          benchmark: "yes",
          compareThen: "yes or no",
          info: "Ensure that you have the Safety Tag! This draws in customers and boosts orders!",
          suggestions: [
            "Get safety tag for your restaurant",
            "Reach out to us or 3rd parties who help in getting the tag",
          ],
        },

        Fssai: {
          name: "Fssai",
          value: listing_audit_score["Fssai"],
          benchmark: "present",
          compareThen: "present or not prensent",
          info: "Having FSSAI builds trust. Swiggy/Zomato reward it",
          suggestions: [],
        },

        "Offer 1": {
          name: "Offer 1",
          // ? cuz data mein spelling wrong hai
          value:
            listing_audit_score["Offer 1"] === "applicable"
              ? "applicable"
              : "not applicable",
          benchmark: "applicable",
          compareThen: "applicable or not applicable",
          info: "Running an offer increases your visibility ranking",
          suggestions: [],
        },
        "Offer 2": {
          name: "Offer 2",
          // ? cuz data mein spelling wrong hai
          value:
            listing_audit_score["Offer 2"] === "applicable"
              ? "applicable"
              : "not applicable",
          benchmark: "applicable",
          compareThen: "applicable or not applicable",
          info: "Running multiple offer have much more impact",
          suggestions: [],
        },

        "Number of Rating": {
          name: "Number of Rating",
          value: listing_audit_score["Number of Rating"],
          benchmark: "medium",
          compareThen: "high medium or low",
          info: "More ratings helps you improve visibility",
          suggestions: [
            "Increase number of reviews through personalized notes",
            -"Improve customer service",
            "Provide complimentory dishes",
          ],
        },
        Rating: {
          name: "Rating",
          value: listing_audit_score["Number of Rating"],
          benchmark: "medium",
          compareThen: "high medium or low",
          info: "Ratings is very directly related to sales",
          suggestions: [
            "Improve reviews by understanding the problem areas",
            "Contact Voosh for Rating Booster service",
          ],
        },
        "Bestseller Without Recommended": {
          name: "Bestseller Without Recommended",
          benchmark: 7,
          compareThen: "grater",
          value: parseFloat(
            (
              listing_audit_score["Bestseller % in without Recommended data"] *
              100
            ).toFixed(2)
          ),
          info: "Target to have more than 7% of non recommended as bestsellers for better growth",
          suggestions: [],
        },
        "Bestseller% in Recommended Data": {
          name: "Bestseller% in Recommended Data",
          benchmark: 30,
          compareThen: "grater",
          value: parseFloat(
            (
              listing_audit_score["Bestseller % in Recommended data"] * 100
            ).toFixed(2)
          ),
          info: "Target to have more than 30% of recommended as bestsellers for better growth",
          suggestions: [],
        },

        // ? Do we need this?
        // "Bestseller% in Recommended vs Without Recommended Data": {
        //   name: "Bestseller % in Recommended vs without Recommended data",

        //   value: parseFloat(
        //     (
        //       listing_audit_score[
        //         "Bestseller % in Recommended vs without Recommended data"
        //       ] * 100
        //     ).toFixed(2)
        //   ),
        //   benchmark: 6,
        //   compareThen: "grater",
        //   info: "Bestseller % in Recommended vs without Recommended data >= 6% Gets more orders",
        // },
        "Recommended %": {
          name: "Recommended %",
          value: parseFloat(
            (listing_audit_score["Recommended %"] * 100).toFixed(2)
          ),
          benchmark: 17,
          compareThen: "grater",
          info: "Ensure to have at least 20% of your total items as 'Recommended'",
        },
        "Image %": {
          name: "Images",
          value: parseFloat((listing_audit_score["Image %"] * 100).toFixed(2)),
          benchmark: 100,
          compareThen: "grater",
          info: "Make sure that all your menu items have different images! Swiggy increases your visibility!",
          suggestions: [
            "Add images to minimum 30 items",
            "Contact Voosh photoshoot service for quality images",
          ],
        },

        "Desserts/Sweet Category": {
          name: "Desserts/Sweet Category Availability ",
          value: listing_audit_score["Desserts/Sweet category"],
          benchmark: "yes",
          compareThen: "yes or no",
          info: "Having a desert category improves listing score",
          suggestions: ["Add Desserts category and corrosponding item"],
        },
        "Beverages Category": {
          name: "Beverages Category",
          value: listing_audit_score["Beverages category"],
          benchmark: "yes",
          compareThen: "yes or no",
          info: "Beverages Category = yes Gets more orders",
          suggestions: ["Add breverage category and corrosponding item"],
        },
        // Score: {
        //   name: "Score",
        //   value: Number(listing_audit_score["Score"]).toFixed(2),
        //   benchmark: 11,
        //   compareThen: "grater",
        //   info: "Score >= 11 Gets more orders",
        // },
        "Description %": {
          name: "Item Description",
          value: parseFloat(
            (listing_audit_score["Description %"] * 100).toFixed(2)
          ),
          benchmark: 95,
          compareThen: "grater",
          info: "Make sure that all your menu items have descriptions! Swiggy increases your visibility!",
          suggestions: [
            "Add descriptions into more items",
            "Use good keywords in item descriptons",
          ],
        },
      },
    },

    // ! Revenue
    revenue: {
      monthlyResult: parseFloat(revenue["Monthly_Revenue"].toFixed(2)),
      weeklyResult: parseFloat(revenue["Weekly_Revenue"].toFixed(2)),

      financicalData: {
        totalSales,
        netPayout,
        deleveries,
        cancelledOrders,
        deductions,
      },
    },
    adsAndAnalytics: {
      //   costPerClick: 500,
      //   sales: 15000,
      //   returnOnInvestment: 5,
      //   possibleReturns: 8,
      //   suggestions: [
      //     "Remove Banner Ads",
      //     "Increase CPC ₹5000",
      //     `Add 'Dal Makhni' to "Recommendation`,
      //   ],
      //   revenue: {
      //     ...Rest_Revenue,
      //   },
    },
    customerReviews: {
      monthlyResult: customer_ratings["Monthly_Rating"],
      weeklyResult: customer_ratings["Weekly_Rating"],
      totalRatings: customer_ratings["Total_Ratings"],
      weeklyReview: Weekly_review_analytics,
      type: "average",
      OrdersPerRating: {
        "5_star": customer_ratings["5_Ratings"],
        "4_star": customer_ratings["4_Ratings"],
        "3_star": customer_ratings["3_Ratings"],
        "2_star": customer_ratings["2_Ratings"],
        "1_star": customer_ratings["1_Ratings"],
      },

      positive: [...all_reviews],
      negative: [...negative_review_items],
    },
  };

  return data;
}

module.exports = { getRequiredCollectionDataFromMongodb, structureMongodbData };
