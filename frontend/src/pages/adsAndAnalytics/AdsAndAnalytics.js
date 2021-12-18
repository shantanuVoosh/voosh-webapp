import React from "react";
import Card from "../../components/adsAndAnalytics/Card";
import InfoCard from "../../components/InfoCard";
import { IoAlertCircleSharp } from "react-icons/io5";
import { useSelector } from "react-redux";

const AdsAndAnalytics = () => {
  const { data, currentProductIndex } = useSelector((state) => state.data);
  const {
    costPerClick,
    sales,
    returnOnInvestment,
    possibleReturns,
    suggestions,
    revenue,
  } = data[currentProductIndex]["adsAndAnalytics"];


  const {Monthly_Revenue, Weekly_Revenue} = revenue;
  console.log(revenue);

  return (
    <>
      <div className="content">
        <div className="ads__cards">
          <Card name={"CPC"} value={costPerClick} info={"Cost Per Click"} />
          <Card name={"Sales"} value={Monthly_Revenue.toFixed(2)} info={"Info about sales"} />
        </div>
        <InfoCard
          name={"Return on Investment(ROI)"}
          value={returnOnInvestment}
        />
        <div className="ads__text">
          <div className="ads__text--alert">
            <IoAlertCircleSharp className="alert-icon" />
            <span className="message">
              Warning: You can get ROI upto{" "}
              <span className="green-value">{possibleReturns}X</span>
            </span>
          </div>
          <div className="ads__text--suggestion">
            To Improve take LAS suggestions from below
          </div>
          <div className="ads__text--suggestions">
            {suggestions.map((suggestion, index) => (
              <div key={index}>
                <span className="message">{suggestion}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdsAndAnalytics;
