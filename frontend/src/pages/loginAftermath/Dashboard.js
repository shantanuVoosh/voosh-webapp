import React from "react";
import Card from "../../components/loginAftermath/Card";
import { BsBagCheckFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import ReactPlayer from "react-player";
import { getTopSuggestionsProvider } from "../../utils/getTopSuggestionsProvider";
import ScrollButton from "../../components/ScrollButton";

const Dashboard = () => {
  const { data, currentProductIndex } = useSelector((state) => state.data);
  const { resultType } = useSelector((state) => state.data);

  const { operationHealth } = data[currentProductIndex];
  const { operationHealthData } = operationHealth;
  const { listingScore } = data[currentProductIndex];
  const { listingScoreData } = listingScore;

  // ! get top 5 suggestions
  let getTopSuggestions = getTopSuggestionsProvider(
    operationHealthData,
    listingScoreData
  );
  getTopSuggestions =
    getTopSuggestions.length > 5
      ? getTopSuggestions.slice(0, 5)
      : getTopSuggestions;
  const topSuggestions = [...getTopSuggestions];

  return (
    <>
      <div className="dashboard-cards">
        {/* //? Revenue */}
        <Card
          // Todo: Card name is changed Revenue to Sales, but cant change or pass name here
          // Todo: other thing are getting effected,
          iconName={"bar"}
          name={"Revenue"}
          info={"Dive into sales, deduction, commissions, etc."}
        />
        {/* //? Operation Health */}
        <Card
          iconName={"bar"}
          name={"Operation Health"}
          info={"Analyse and improve your Operational Metrics."}
        />
        {/* //?List Score */}
        <Card
          iconName={"bar"}
          name={"Listing Score"}
          info={"Visibility performance on Swiggy and Zomato"}
        />
      </div>
      <div className="dashboard-bottom">
        <div className="dashboard-bottom__heading">
          Learn more about Online Business
        </div>
        <div className="dashboard-bottom__videos">
          <div className="single-video">
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
          </div>
          <div className="single-video">
            <ReactPlayer
              // className="single-video"
              url="https://www.youtube.com/watch?v=w3RqWoQa19M"
              controls
              playbackRate={1}
              width="310px"
              height="240px"
            />
          </div>
        </div>
        <div className="recomendation">
          <div className="recomendation__heading">
            <span className="icon">
              <BsBagCheckFill />
            </span>
            <span className="text">Recommendation For You</span>
          </div>
          {topSuggestions.length > 0 &&
            topSuggestions.map((item, index) => {
              return (
                <div key={index} className="recomendation__list">
                  {item}
                </div>
              );
            })}
          {topSuggestions.length === 0 && (
            <div className="no_recomendation">
              <div className="">
                <span className="text_1">Your business is doing great!</span>
                <br />
                <span className="text_2">
                  No Recommendation for you in this{" "}
                  {resultType !== "Custom Range" ? resultType : "In this Range"}
                  .
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="">
          <ScrollButton />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
