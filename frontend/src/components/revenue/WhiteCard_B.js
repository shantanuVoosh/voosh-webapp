import React from "react";
import { AiOutlineRight } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { AiOutlineRise, AiOutlineFall } from "react-icons/ai";

const WhiteCard = (props) => {
  const resultType = useSelector((state) => state.resultType);
  const {
    name,
    type,
    value: currentValue,
    info,
    benchmark,
    monthlyResult,
    weeklyResult,
    color,
    showMoreContent
  } = props;

  if(!showMoreContent){
    return null
  }

  if (currentValue === "working on it") {
    return (
      <div className="financial_b-card error-card">
        <div className="financial_b-card__text">
          <h5 className="financial_b-card__text--heading">{name}</h5>
          <div className="value error-value">{currentValue}</div>
          <div className="financial_b-card__text--info">
            <p>{info}</p>
          </div>
        </div>
        <div className="financial_b-card__btn">
          <span className="financial_b-card__btn--text">Know more</span>
          <AiOutlineRight className="financial_b-card__btn--icon" />
        </div>
      </div>
    );
  }

  let value;

  if (currentValue === undefined) {
    value = resultType === "month" ? monthlyResult : weeklyResult;
  }
  // ! for fix result no weekly or monthly
  else {
    value = currentValue;
  }
  console.log(name, value, benchmark);

  return (
    <div className="financial_b-card">
      <div className="financial_b-card__text">
        <h5 className="financial_b-card__text--heading">{name}</h5>
        <div className="value" style={{ color: `${color}` }}>
          {value.toLocaleString("en-IN", {
            maximumFractionDigits: 2,
            style: "currency",
            currency: "INR",
          })}
        </div>
        <div className="financial_b-card__text--info">
          <p>{info}</p>
        </div>
      </div>
      {/* //! sending data from this page */}
      <div className="financial_b-card__btn">
        <span className="financial_b-card__btn--text">Know more</span>
        <AiOutlineRight className="financial_b-card__btn--icon" />
      </div>
    </div>
  );
};

export default WhiteCard;
