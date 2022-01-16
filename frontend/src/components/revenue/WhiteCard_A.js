import React from "react";
import { AiOutlineRight } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { AiOutlineRise, AiOutlineFall } from "react-icons/ai";
import moment from "moment";

const WhiteCard = (props) => {
  const customDate = moment(new Date())
    .add(-1, "months")
    .add(-10, "days")
    .format("MMMM'YY");
  const {
    name,
    type,
    value,
    info,
    benchmark,
    monthlyResult,
    weeklyResult,
    color,
    isDataPresent,
  } = props;

  if (!isDataPresent) {
    return (
      <div className="financial_a-card error-card">
        <div className="financial_a-card__text">
          <h5 className="financial_a-card__text--heading">{name}</h5>
          <div className="value error-value">
            {/* {"No successful order yesterday"} */}
            {"Working on it..."}
          </div>
          <div className="financial_a-card__text--info">
            <p>{info}</p>
          </div>
        </div>
        {/* <div className="financial_a-card__btn">
          <span className="financial_a-card__btn--text">Know more</span>
          <AiOutlineRight className="financial_a-card__btn--icon" />
        </div> */}
      </div>
    );
  }

  return (
    <div className="financial_a-card">
      <div className="financial_a-card__text">
        <div className="financial_a-card__text--heading">
          <h5 className="text">{name}</h5>
          {name !== "Total Sales" && <span className="date">{customDate}</span>}
        </div>
        <div className="value" style={{ color: `${color}` }}>
          {value.toLocaleString("en-IN", {
            maximumFractionDigits: 2,
            style: "currency",
            currency: "INR",
          })}
        </div>
        <div className="financial_a-card__text--info">
          <p>{info}</p>
        </div>
      </div>
      {/* //! sending data from this page */}
      {/* <div className="financial_a-card__btn">
        <span className="financial_a-card__btn--text">Know more</span>
        <AiOutlineRight className="financial_a-card__btn--icon" />
      </div> */}
    </div>
  );
};

export default WhiteCard;
