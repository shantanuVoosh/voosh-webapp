const { MongoClient } = require("mongodb");
const {
  getCurrentDate,
  getYesterdayDate,
  getTomorrowDate,
} = require("./dateProvide");
const VooshDB =
  "mongodb://analyst:gRn8uXH4tZ1wv@35.244.52.196:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";

// ! removed the default values for res_id
// ?red_id casesensitive hai! cuz query krna hai
async function getRequiredCollectionDataFromMongodb(
  res_id = 256302,
  documentName = "operationsdb"
) {
  const todaysDate = new Date().toISOString().slice(0, 10);
  const yesterdayDate = getYesterdayDate();
  const tomorrowDate = getTomorrowDate();
  console.log("Yesterday Date:", yesterdayDate);
  console.log("Todays Date:", todaysDate);
  console.log("Tomorrow Date:", tomorrowDate);

  const collectionRequired = [
    // ! ye format hai {Date:"15-Nov-2021 07:31 pm"}
    {
      name: "Non_Voosh_Orderwise2",
      query: {
        "Res Id": res_id,
        // "Date": yesterdayDate,
        // Date: { $gte: yesterdayDate, $lte: tomorrowDate },
      },
    },
    {
      name: "Swiggy_Acceptance",
      query: {
        "Res Id": res_id,
        // "Date": yesterdayDate,
        // Date: { $gte: yesterdayDate, $lte: tomorrowDate },
      },
    },
    {
      name: "Swiggy_IGCC",
      query: {
        "Res Id": res_id,
        // "Date": yesterdayDate,
        // Date: { $gte: yesterdayDate, $lte: tomorrowDate },
      },
    },
    {
      name: "Swiggy_Kitchen_Servicibility",
      query: {
        res_id: res_id,

        // "Date": yesterdayDate,
        // Date: { $gte: yesterdayDate, $lte: tomorrowDate },
        Date: { $gte: yesterdayDate, $lte: getCurrentDate }, //! y14  c16  1dday piche day h, cuz update problem
      },
    },
    {
      name: "Swiggy_MFR",
      query: {
        Res_Id: res_id,
        // "Date": yesterdayDate,
        // Date: { $gte: yesterdayDate, $lte: tomorrowDate },
        Date: { $gte: yesterdayDate, $lte: getCurrentDate },
      },
    },
    {
      name: "Swiggy_RDC",
      query: {
        "Res Id": res_id,
        // "Date": yesterdayDate,
        // Date: { $gte: yesterdayDate, $lte: tomorrowDate },
        Date: { $gte: yesterdayDate, $lte: getCurrentDate },
      },
    },
    {
      name: "Swiggy_Revenue",
      query: {
        Res_Id: res_id,
        // "Date": yesterdayDate,
        // Date: { $gte: yesterdayDate, $lte: tomorrowDate },
        // Date: { $gte: yesterdayDate, $lte: getCurrentDate },
      },
    },
    {
      name: "Swiggy_Static_ratings",
      query: {
        "Res ID": res_id,
        // "Date": yesterdayDate,
        Date: yesterdayDate,
      },
    },
    {
      name: "Swiggy_ratings",
      query: {
        "Res Id": res_id,
        // "Date": yesterdayDate,
        // Date: { $gte: yesterdayDate, $lte: tomorrowDate },
        // Date: { $gte: yesterdayDate, $lte: getCurrentDate },
      },
    },
    {
      name: "Listing_Audit_Score",
      query: {
        "Res Id": res_id,
        // "Date": yesterdayDate,
        // Date: { $gte: yesterdayDate, $lte: tomorrowDate },
        // Date: { $gte: yesterdayDate, $lte: getCurrentDate },
      },
    },
    // {
    //   name: "Monthy_OH_Score",
    //   query: {
    //     "Res Id": res_id,
    //     // "Date": yesterdayDate,
    //     // Date: { $gte: yesterdayDate, $lte: tomorrowDate },
    //     // Date: { $gte: yesterdayDate, $lte: getCurrentDate },
    //   },
    // },
    {
      name: "Weekly_OH_Score",
      query: {
        "Res Id": res_id,
        // "Date": yesterdayDate,
        // Date: { $gte: yesterdayDate, $lte: tomorrowDate },
        // Date: { $gte: yesterdayDate, $lte: getCurrentDate },
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

    return apiResult;
  } catch (err) {
    console.log("Error while getting data from DB: ", err);
    return {};
  }
}

function structureMongodbData(apiResponse) {

  // ! try catch krna hai
  // ?Operation_Health_Data
  let i = 0;
  const rest_Acceptance = apiResponse["Swiggy_Acceptance"][0];
  const operationHealthWeeklyResult = apiResponse["Weekly_OH_Score"][0];
  const rest_igcc = apiResponse["Swiggy_IGCC"][0];
  const rest_Serviceability = apiResponse["Swiggy_Kitchen_Servicibility"][0];
  const rest_MFR = apiResponse["Swiggy_MFR"][0];
  const rest_RDC = apiResponse["Swiggy_RDC"][0];
  const avrage_ratings = apiResponse["Swiggy_Static_ratings"][0];
  // console.log(rest_Serviceability);
  // ?listing_audit_score
  const listing_audit_score = apiResponse["Listing_Audit_Score"][0];

  const customer_ratings = apiResponse["Swiggy_ratings"][0];
  const rest_oders = apiResponse["Non_Voosh_Orderwise2"][0];
  const revenue = apiResponse["Swiggy_Revenue"][0];

  console.log("operationHealthWeeklyResult: ",operationHealthWeeklyResult)

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
  const data = {
    // ?name of the restaurant
    name: "Swiggy",
    // !Operation Health
  
    operationHealth: {
      operationHealthMain:{
        name: "Operation Health",
        type: "percentage",
        info: "Operation Health >= 95% Gets more orders",
        benchmark: 95,
        monthlyResult:97,
        weeklyResult:operationHealthWeeklyResult["Weekly_OH_Score"]*2*10,
      },
      operationHealthData: [
        // ?Swiggy_Kitchen_Servicibility
        {
          name: "Rest. Serviceability",
          type: "percentage",
          info: "Servicibility >= 95% Gets more orders",
          // ! ye target mein jayega graph
          benchmark: 95,
          compareThen: "grater",
          monthlyResult: rest_Serviceability["Monthly_Servicibility"],
          weeklyResult: rest_Serviceability["Weekly_Servicibility"],
          ...rest_Serviceability,
        },
        // ?Swiggy_RDC
        {
          name: "Rest. Cancellations",
          type: "percentage",
          info: "Cancellation Charges <= 5% Gets more orders",
          benchmark: 5,
          compareThen: "less",
          monthlyResult: rest_RDC["Monthly_avg_RDC"]*100,
          weeklyResult: rest_RDC["Weekly_avg_RDC"]*100,
          ...rest_RDC,
        },
  
        // ?Swiggy_Static_ratings
        {
          name: "Average Rating",
          type: "rating",
          info: "Rating > 4.5 Gets better orders",
          benchmark: 4.5,
          compareThen: "grater",
          monthlyResult: avrage_ratings["Monthly_Rating"],
          weeklyResult: avrage_ratings["Weekly_Rating"],
          ...avrage_ratings,
        },
        // ?Swiggy_MFR
        {
          name: "MFR Accuracy",
          type: "percentage",
          info: "MFR Accuracy >=95 Gets more orders",
          benchmark: 95,
          compareThen: "grater",
          monthlyResult: rest_MFR["Monthly_Mfr"],
          weeklyResult: rest_MFR["Weekly_Mfr"],
          ...rest_MFR,
        },
        // ? IGCC
        {
          name: "Customer Complains",
          // name: "Wrong/Missing item",
          type: "percentage",
          info: "Complains <=1 Gets more orders",
          benchmark: 1,
          compareThen: "less",
          wrongItemComplaintsOrders: rest_igcc["Wrong Item Complaints Orders"],
          missingItemComplaintsOrders:
            rest_igcc["Missing Item Complaints Orders"],
          value: valueForIGCC,
        },
        // ?Swiggy_Acceptance
        {
          name: "Acceptance",
          type: "percentage",
          info: "Acceptance = 100% Gets more orders",
          benchmark: 99,
          compareThen: "grater",
          value: parseFloat(rest_Acceptance["Accept Orders"]),
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
          benchmark: null,
          compareThen: null,
        },

        Fssai: {
          name: "Fssai",
          value: listing_audit_score["Fssai"],
          benchmark: null,
          compareThen: null,
        },

        "Offer 1": {
          name: "Offer 1",
          value: listing_audit_score["Offer 1"],
          benchmark: null,
          compareThen: null,
        },
        "Offer 2": {
          name: "Offer 2",
          value: listing_audit_score["Offer 2"],
          benchmark: null,
          compareThen: null,
        },

        "Number of Rating": {
          name: "Number of Rating",
          value: listing_audit_score["Number of Rating"],
          benchmark: null,
          compareThen: null,
        },
        Rating: {
          name: "Rating",
          benchmark: null,
          compareThen: null,
          value: listing_audit_score["Number of Rating"],
        },
        "Bestseller Without Recommended": {
          name: "Bestseller Without Recommended",
          benchmark: 7,
          compareThen: "grater",
          value: Number(
            listing_audit_score["Bestseller % in without Recommended data"]
          ).toFixed(2),
        },
        "Bestseller% in Recommended Data": {
          name: "Bestseller% in Recommended Data",
          benchmark: 30,
          compareThen: "grater",
          value: listing_audit_score["Bestseller % in Recommended data"],
        },

        "Bestseller% in Recommended vs Without Recommended Data": {
          name: "Bestseller % in Recommended vs without Recommended data",
          benchmark: 6,
          compareThen: "grater",
          value:
            listing_audit_score[
              "Bestseller % in Recommended vs without Recommended data"
            ],
        },
        "Recommended %": {
          name: "Recommended %",
          benchmark: 17,
          compareThen: "grater",
          value: Number(
            listing_audit_score[
              "Recommended %"
            ]
          ).toFixed(2),
        },
        "Image %": {
          name: "Image %",
          benchmark: null,
          compareThen: null,
          value: Number(listing_audit_score["Image %"]).toFixed(2),
        },
        "Description %": {
          name: "Description %",
          benchmark: null,
          compareThen: null,
          value: Number(listing_audit_score["Description %"]).toFixed(2),
        },
        "Desserts/Sweet Category": {
          name: "Desserts/Sweet Category",
          benchmark: null,
          compareThen: null,
          value: listing_audit_score["Desserts/Sweet category"],
        },
        "Beverages Category": {
          name: "Beverages Category",
          benchmark: null,
          compareThen: null,
          value: listing_audit_score["Beverages category"],
        },
        Score: {
          name: "Score",
          benchmark: null,
          compareThen: null,
          value: Number(listing_audit_score["Score"]).toFixed(2),
        },
      },
    },

    // ! Revenue
    revenue: {
      monthlyResult: revenue["Monthly_Revenue"].toFixed(2),
      weeklyResult: revenue["Weekly_Revenue"].toFixed(2),
      ...revenue,
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
      // monthlyResult: customer_ratings["Monthly_Rating"],
      // weeklyResult: customer_ratings["Weekly_Rating"],
      // totalRatings: customer_ratings["Total_Ratings"],
      // OrdersPerRating: {
      //   "5_star": Rest_ratings["5_Ratings"],
      //   "4_star": Rest_ratings["4_Ratings"],
      //   "3_star": Rest_ratings["3_Ratings"],
      //   "2_star": Rest_ratings["2_Ratings"],
      //   "1_star": Rest_ratings["1_Ratings"],
      // },
      // //? Not used
      // positive: [
      //   {
      //     id: 41534354341,
      //     date: "20201107",
      //     rating: 5,
      //     review:
      //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore",
      //   },
      //   {
      //     id: 41534354342,
      //     date: "20201107",
      //     rating: 5,
      //     review:
      //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore",
      //   },
      //   {
      //     id: 41534354343,
      //     date: "20201107",
      //     rating: 5,
      //     review:
      //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore",
      //   },
      //   {
      //     id: 41534354344,
      //     date: "20201107",
      //     rating: 5,
      //     review:
      //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore",
      //   },
      // ],
      // negative: [
      //   {
      //     id: 114153435434,
      //     name: "Dal Makhni",
      //     issues: [
      //       { name: "oil", percentage: 60 },
      //       { name: "spice", percentage: 40 },
      //       { name: "issue 3", percentage: 40 },
      //     ],
      //   },
      //   {
      //     id: 124153435434,
      //     name: "Masala Dosa",
      //     issues: [
      //       { name: "oil", percentage: 60 },
      //       { name: "spice", percentage: 40 },
      //       { name: "issue 3", percentage: 40 },
      //     ],
      //   },
      // ],
    },
  };

  return data;
}

module.exports = { getRequiredCollectionDataFromMongodb, structureMongodbData };
