import React from "react";
import Card from "../../components/loginAftermath/Card";
import { BsBagCheckFill } from "react-icons/bs";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const { data, currentProductIndex } = useSelector((state) => state.data);
  const resultType = useSelector((state) => state.resultType);

  // ?Listing Score
  const {listingScoreMain, listScoreData} = data[currentProductIndex]["listingScore"];

  // ?Revenue
  // *Not month or week wise score!
  const revenue = data[currentProductIndex]["revenue"];
  const {
    monthlyResult: revenueMonthlyResult,
    weeklyResult: revenueWeeklyResult,
  } = revenue;

  // ?Operation Health
  const operationHealth = data[currentProductIndex]["operationHealth"];
  const { operationHealthMain } = operationHealth;
  const {
    monthlyResult: operationHealthMonthlyResult,
    weeklyResult: operationHealthWeeklyResult,
  } = operationHealthMain;

  let revenueResult;
  let operationHealthResult;

  if (resultType === "week") {
    revenueResult = revenueWeeklyResult;
    operationHealthResult = operationHealthWeeklyResult;
  } else {
    revenueResult = revenueMonthlyResult;
    operationHealthResult = operationHealthMonthlyResult;
  }

  // ! Benchmark Manually Added

  return (
    <>
      <div className="dashboard-cards">
        {/* //? Revenue */}
        <Card
          iconName={"bar"}
          name={"Revenue"}
          info={"Get your Revenue and Deduction Details!"}
          cardStatistics={{
            // ! if prev month is null then show 0
            value: revenueResult,
            change: null,
            benchmark: null,
            changeTypeDirection: "up",
            type: "money",
          }}
        />
        {/* //? Operation Health */}
        <Card
          iconName={"bar"}
          name={"Operation Health"}
          info={"Understand your Operation Health and Metrics!"}
          cardStatistics={{
            value: operationHealthResult,
            change: 95,
            benchmark: 95,
            changeTypeDirection: (operationHealthResult-95>0)?"up":"down",  
            type: "percentage",
          }}
        />
        {/* //?List Score */}
        <Card
          iconName={"bar"}
          name={"Listing Score"}
          info={"Understand how your online Swiggy listing is performing!"}
          cardStatistics={{
            value: listingScoreMain,
            change: 90,
            changeTypeDirection: (listingScoreMain-90>0)?"up":"down",
            type: "percentage",
          }}
        />
        {/* <Card
          iconName={"bag"}
          name={"Ads & Analytics"}
          info={"Get details of your orders and metrics of orders"}
        /> */}
        {/* <Card
          iconName={"bag"}
          name={"Customer Review"}
          info={"Get details of your orders and metrics of orders"}
        /> */}
      </div>
      <div className="dashboard-bottom">
        <div className="dashboard-bottom__heading">
          Some tutorials for your business
        </div>
        <div className="dashboard-bottom__videos">
          <iframe
            title="video"
            width="310px"
            height="240px"
            src="https://www.youtube.com/embed?v=MIsi4vdzjgk"
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          <iframe
            title="video"
            width="310px"
            height="240px"
            src="https://www.youtube.com/embed/zpOULjyy-n8?rel=0"
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>

          <iframe
            title="video"
            width="310px"
            height="240px"
            src="https://www.youtube.com/embed/zpOULjyy-n8?rel=0"
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <div className="recomendation">
          <div className="recomendation__heading">
            <span className="icon">
              <BsBagCheckFill />
            </span>
            <span className="text">Top Recommendations</span>
          </div>
          <div className="recomendation__list">Remove Banner Ads</div>
          <div className="recomendation__list">ncrease CPC ₹5000</div>
          <div className="recomendation__list">
            Add 'Dal Makhni' to "Recommendation
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
