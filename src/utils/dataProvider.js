const { MongoClient } = require("mongodb");
const { video_urls } = require("./traning_video_urls");
const {
  getCurrentDate,
  getYesterdayDate,
  getTomorrowDate,
  getCurrentDateBefore12HoursAgo,
  getYesterdayDateBefore12HoursAgo,
  getPreviousWeek,
  getCurrentMonth,
  getPreviousMonth,
} = require("./dateProvide");
const VooshDB =
  "mongodb://analyst:gRn8uXH4tZ1wv@35.244.52.196:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";

// ! removed the default values for res_id
// ?red_id casesensitive hai! cuz query krna hai
async function apiCall(res_id, date) {
  console.log(
    "---------- <getRequiredCollectionDataFromMongodb Start> ----------------"
  );

  console.log("Current res_id:", res_id, "and", "Current date:", date);
  documentName = "operationsdb";

  const collectionRequired = [
    //? This is reviews collection
    // ! all reviews are fetched
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
        run_date: date,
      },
    },
    {
      name: "Swiggy_IGCC",
      query: {
        "Res Id": res_id,
        Start_Date: { $lt: date },
        End_Date: { $gt: date },
      },
    },
    {
      name: "Swiggy_Kitchen_Servicibility",
      query: {
        res_id: res_id,
        Date: date,
      },
    },
    {
      name: "Swiggy_MFR",
      query: {
        Res_Id: res_id,
        Date: date,
      },
    },
    {
      name: "Swiggy_RDC",
      query: {
        "Res Id": res_id,
        Date: date,
      },
    },
    {
      name: "Swiggy_Revenue",
      query: {
        Res_Id: res_id,
        Date: date,
      },
    },
    {
      name: "Swiggy_Static_ratings",
      query: {
        "Res ID": res_id,
        // ?this present for today's date
        Date: date,
      },
    },
    {
      name: "Swiggy_ratings",
      query: {
        "Res Id": res_id,
        Date: date,
      },
    },
    {
      name: "swiggy_weekly_listing_score_products",
      query: {
        swiggy_res_id:res_id+"",
      },
    },

    // ? only week wise data
    {
      name: "Weekly_OH_Score",
      query: {
        "Res Id": res_id,
      },
    },
    {
      name: "NON_Voosh_swiggy_reconsilation",
      query: {
        Swiggy_id: res_id,
      },
    },
    {
      name: "Weekly_review_analytics",
      query: {
        swiggy_res_id: res_id,
        sum: { $gt: 0 },
      },
    },
  ];

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

function isObjectEmpty(obj) {
  if (obj === undefined || obj === null) return true;
  return Object.keys(obj).length === 0;
}

async function dataProvider(res_id, date) {
  console.log(
    "data provider called this is res_id",
    res_id,
    ",this is date",
    date
  );
  const apiResponse = await apiCall(res_id, date);

  //   ?date

  const todayDate = getCurrentDate();
  const prevMonth=getPreviousMonth();

  let rest_acceptance = apiResponse["Swiggy_Acceptance_v1"][0];
  let operationHealthWeeklyResult = apiResponse["Weekly_OH_Score"][0];
  let rest_igcc = apiResponse["Swiggy_IGCC"][0];
  let rest_Serviceability = apiResponse["Swiggy_Kitchen_Servicibility"][0];
  let rest_MFR = apiResponse["Swiggy_MFR"][0];
  let rest_RDC = apiResponse["Swiggy_RDC"][0];
  let avrage_ratings = apiResponse["Swiggy_Static_ratings"][0];
  // ?review_analytics
  let customer_ratings = apiResponse["Swiggy_ratings"][0];
  let review_analytics = apiResponse["Weekly_review_analytics"];
  let all_oders_review = apiResponse["Non_Voosh_Orderwise2"];

  // !listing_audit_score
  let listing_audit_score = apiResponse["swiggy_weekly_listing_score_products"];
  let rest_oders = apiResponse["Non_Voosh_Orderwise2"][0];
  let Weekly_review_analytics = apiResponse["Weekly_review_analytics"];

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

    // console.log("food_negative_review_items: ", food_negative_review_items);

    return {
      item_name: item_name,
      issues: [...food_negative_review_items.slice(0, 3)],
    };
  });

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

  // ?calculating the data manually
  let wrongItemComplaintsOrders = isObjectEmpty(rest_igcc)
    ? 0
    : parseFloat(rest_igcc["Wrong Item Complaints Orders"]);
  let missingItemComplaintsOrders = isObjectEmpty(rest_igcc)
    ? 0
    : parseFloat(rest_igcc["Missing Item Complaints Orders"]);

  // ? Customer Complains
  const valueForIGCC =
    wrongItemComplaintsOrders + missingItemComplaintsOrders !== 0
      ? (wrongItemComplaintsOrders + missingItemComplaintsOrders) / 2
      : 0;

  // ! Revenue or Financical Data
  const revenue = apiResponse["Swiggy_Revenue"][0];
  const revenue_financical = apiResponse["NON_Voosh_swiggy_reconsilation"][0];

  const totalSales = isObjectEmpty(revenue_financical)
    ? "working on it"
    : revenue_financical["Total Customer Payable "];
  const netPayout = isObjectEmpty(revenue_financical)
    ? "working on it"
    : revenue_financical["Net Payout  (E - F - G)"];
  const deleveries = isObjectEmpty(revenue_financical)
    ? "working on it"
    : revenue_financical["Number of orders"];
  const cancelledOrders = isObjectEmpty(rest_RDC)
    ? "working on it"
    : rest_RDC["Res_Cancellation"];

  let deductions = {};

  if (isObjectEmpty(revenue_financical)|| prevMonth!==date) {
    deductions = {
      "Platform Services Charges": "working on it",

      "Cancellation Deduction": "working on it",
      "Other OFD deduction": "working on it",

      Promotions: "working on it",

      "Previous Week Outstanding": "working on it",

      Miscellaneous: "working on it",

      TCS: "working on it",
      TDS: "working on it",
    };
  } else {
    deductions = {
      "Platform Services Charges":
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
  }

  // Todo: Training Videod
  const { RDC_video, Serviceability_video, MFR_video, Ratings_video } =
    video_urls;

  console.log(listing_audit_score["score"], "score----------------");

  const data = {
    // ?name of the restaurant
    name: "Swiggy",

    // !listing_audit_score
    listingScore: {
      listingScoreMain:
        listing_audit_score["score"] === undefined
          ? "working on it"
          : listing_audit_score["score"],
      listingScoreData: {
        "Safety Tag": {
          name: "Safety Tag",
          result_value: listing_audit_score["safety_tag"],
          benchmark: "yes",
          compareThen: "yes or no",
          info: "Ensure that you have the Safety Tag! This draws in customers and boosts orders!",
          suggestions: [
            "Get safety tag for your restaurant",
            "Reach out to us or 3rd parties who help in getting the tag",
          ],
        },

        Rating: {
          name: "Ratings",
          result_value: listing_audit_score["rating"],
          benchmark: "medium",
          compareThen: ">4.0",
          info: "Ratings is very directly related to sales",
          suggestions: [
            "Improve reviews by understanding the problem areas",
            "Contact Voosh for Rating Booster service",
          ],
        },

        "Number of Rating": {
          name: "Number of Rating",
          result_value: listing_audit_score["number_of_rating"],
          benchmark: "",
          compareThen: "",
          info: "More ratings helps you improve visibility",
          suggestions: [
            "Increase number of reviews through personalized notes",
            -"Improve customer service",
            "Provide complimentory dishes",
          ],
        },

        "Offer 1": {
          name: "Offer 1",
          // ? cuz data mein spelling wrong hai
          result_value:
            listing_audit_score["offer_1"] === "applicable"
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
          result_value:
            listing_audit_score["offer_2"] === "applicable"
              ? "applicable"
              : "not applicable",
          benchmark: "applicable",
          compareThen: "applicable or not applicable",
          info: "Running multiple offer have much more impact",
          suggestions: [],
        },

        "Recommended %": {
          name: "Recommended %",
          result_value: parseFloat(
            (listing_audit_score["Recommended %"] * 100).toFixed(2)
          ),
          benchmark: 17,
          compareThen: "grater",
          info: "Ensure to have at least 20% of your total items as 'Recommended'",
        },
        "Image %": {
          name: "Images",
          result_value: parseFloat(listing_audit_score["Image %"]),
          benchmark: 100,
          compareThen: "grater",
          info: "Make sure that all your menu items have different images! Swiggy increases your visibility!",
          suggestions: [
            "Add images to minimum 30 items",
            "Contact Voosh photoshoot service for quality images",
          ],
        },
        // "Description %": {
        //   name: "Item Description",
        //   result_value: parseFloat(
        //     (listing_audit_score["Description %"] * 100).toFixed(2)
        //   ),
        //   benchmark: 95,
        //   compareThen: "grater",
        //   info: "Make sure that all your menu items have descriptions! Swiggy increases your visibility!",
        //   suggestions: [
        //     "Add descriptions into more items",
        //     "Use good keywords in item descriptons",
        //   ],
        // },
      

        "Desserts/Sweet Category": {
          name: "Desserts/Sweet Category Availability ",
          result_value: listing_audit_score["Desserts/Sweet category"],
          benchmark: "yes",
          compareThen: "yes or no",
          info: "Having a desert category improves listing score",
          suggestions: ["Add Desserts category and corrosponding item"],
        },
        "Beverages Category": {
          name: "Beverages Category",
          result_value: listing_audit_score["Beverages category"],
          benchmark: "yes",
          compareThen: "yes or no",
          info: "Beverages Category = yes Gets more orders",
          suggestions: ["Add breverage category and corrosponding item"],
        },
        "Bestseller Score Recommended": {
            name: "Bestseller Without Recommended",
            benchmark: 7,
            compareThen: "grater",
            result_value: parseFloat(
              listing_audit_score[
                "bestseller_%_in_recommended_vs_without_recommended_data"
              ]
            ),
            info: "Target to have more than 7% of non recommended as bestsellers for better growth",
            suggestions: [],
          },
      },
    },
    // !Operation Health
    operationHealth: {
      operationHealthMain: {
        name: "Operation Health",
        type: "percentage",
        info: "Operation Health >= 95% Gets more orders",
        benchmark: 95,
        monthlyResult: "working on it",
        weeklyResult:
          getYesterdayDateBefore12HoursAgo() !== date ||
          isObjectEmpty(operationHealthWeeklyResult)
            ? "working on it"
            : operationHealthWeeklyResult["Weekly_OH_Score"] * 2 * 10,
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
          monthlyResult: isObjectEmpty(rest_Serviceability)
            ? "working on it"
            : rest_Serviceability["Monthly_Servicibility"],
          weeklyResult: isObjectEmpty(rest_Serviceability)
            ? "working on it"
            : rest_Serviceability["Weekly_Servicibility"],
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
          monthlyResult: isObjectEmpty(rest_RDC)
            ? "working on it"
            : rest_RDC["Monthly_avg_RDC"] * 100,
          weeklyResult: isObjectEmpty(rest_RDC)
            ? "working on it"
            : rest_RDC["Weekly_avg_RDC"] * 100,
        },

        // ?Swiggy_Static_ratings
        {
          name: "Rating",
          type: "average",
          info: "Rating > 4.5 Gets better orders",
          benchmark: 4.5,
          compareThen: "grater",
          videoLink: Ratings_video,
          monthlyResult: isObjectEmpty(avrage_ratings)
            ? "working on it"
            : avrage_ratings["Monthly_Rating"],
          weeklyResult: isObjectEmpty(avrage_ratings)
            ? "working on it"
            : avrage_ratings["Weekly_Rating"],
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
          monthlyResult: isObjectEmpty(rest_MFR)
            ? "working on it"
            : rest_MFR["Monthly_Mfr"],
          weeklyResult: isObjectEmpty(rest_MFR)
            ? "working on it"
            : rest_MFR["Weekly_Mfr"],
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
          value: isObjectEmpty(rest_igcc) ? "working on it" : valueForIGCC,
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
          value: isObjectEmpty(rest_acceptance)
            ? "working on it"
            : parseFloat(rest_acceptance["accept_orders"]),
          recommendations: ["Enable Auto acceptance"],
        },
      ],
    },

    // ! Revenue
    revenue: {
      monthlyResult: isObjectEmpty(revenue)
        ? "working on it"
        : parseFloat(revenue["Monthly_Revenue"].toFixed(2)),
      weeklyResult: isObjectEmpty(revenue)
        ? "working on it"
        : parseFloat(revenue["Weekly_Revenue"].toFixed(2)),

      financicalData: {
        totalSales: prevMonth===date?totalSales:"working on it" ,
        netPayout: prevMonth===date?netPayout:"working on it",
        deleveries: prevMonth===date?deleveries:"working on it",
        cancelledOrders: prevMonth===date?cancelledOrders:"working on it",
        deductions:deductions,
      },
    },
    adsAndAnalytics: {},
    customerReviews: {
      monthlyResult: isObjectEmpty(customer_ratings)
        ? "working on it"
        : customer_ratings["Monthly_Rating"],
      weeklyResult: isObjectEmpty(customer_ratings)
        ? "working on it"
        : customer_ratings["Weekly_Rating"],
      totalRatings: isObjectEmpty(customer_ratings)
        ? "working on it"
        : customer_ratings["Total_Ratings"],
      weeklyReview: Weekly_review_analytics,
      type: "average",
      OrdersPerRating: {
        "5_star": isObjectEmpty(customer_ratings)
          ? "working on it"
          : customer_ratings["5_Ratings"],
        "4_star": isObjectEmpty(customer_ratings)
          ? "working on it"
          : customer_ratings["4_Ratings"],
        "3_star": isObjectEmpty(customer_ratings)
          ? "working on it"
          : customer_ratings["3_Ratings"],
        "2_star": isObjectEmpty(customer_ratings)
          ? "working on it"
          : customer_ratings["2_Ratings"],
        "1_star": isObjectEmpty(customer_ratings)
          ? "working on it"
          : customer_ratings["1_Ratings"],
      },
      //? Not used
      all_reviews: [...all_reviews],
      negative: [...negative_review_items],
    },
  };

  return data;
}

module.exports = { dataProvider };
