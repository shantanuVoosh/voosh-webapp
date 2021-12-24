import React from "react";
import Card from "../../components/loginAftermath/Card";
import { BsBagCheckFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import ReactPlayer from "react-player";

const Dashboard = () => {
  const { data, currentProductIndex } = useSelector((state) => state.data);
  const resultType = useSelector((state) => state.data.resultType);

  // ?Listing Score
  const { listingScoreMain, listScoreData } =
    data[currentProductIndex]["listingScore"];

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
            changeTypeDirection: operationHealthResult - 95 > 0 ? "up" : "down",
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
            changeTypeDirection: listingScoreMain - 90 > 0 ? "up" : "down",
            type: "percentage",
          }}
        />
      </div>
      <div className="dashboard-bottom">
        <div className="dashboard-bottom__heading">
          Some tutorials for your business
        </div>
        <div className="dashboard-bottom__videos">
         <div className="single-video">
         {/* <ReactPlayer
            // className="single-video"
            url="https://www.youtube.com/watch?v=MIsi4vdzjgk"
            controls
            playbackRate={1}
            width="310px"
            height="240px"
          />
         </div>
         <div className="single-video"> */}
         <ReactPlayer
            // className="single-video"
            url="https://www.youtube.com/watch?v=MIsi4vdzjgk"
            controls
            playbackRate={1}
            width="100%"
            height="240px"
          />
         </div>
         <div className="single-video">
         <ReactPlayer
            // className="single-video"
            url="https://www.youtube.com/watch?v=QN1GGCNMOY4"
            controls
            playbackRate={1}
            width="310px"
            height="240px"
          />
         {/* <ReactPlayer
            // className="single-video"
            url="https://www.youtube.com/watch?v=MIsi4vdzjgk"
            controls
            playbackRate={1}
            width="310px"
            height="240px"
          /> */}
         </div>
         
        
        </div>
        <div className="recomendation">
          <div className="recomendation__heading">
            <span className="icon">
              <BsBagCheckFill />
            </span>
            <span className="text">Top Suggestion</span>
          </div>
          <div className="recomendation__list">
            Running an offer increases your visibility ranking
          </div>
          <div className="recomendation__list">
            More ratings helps you improve visibility
          </div>
          <div className="recomendation__list">
            Make sure that all your menu items have different images! Swiggy
            increases your visibility!
          </div>
          <div className="recomendation__list">
            Having a desert category improves listing score
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
