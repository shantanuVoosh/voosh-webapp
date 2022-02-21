import React from "react";
import { AiOutlineRight } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { AiOutlineRise, AiOutlineFall } from "react-icons/ai";
import moment from "moment";

const WhiteCard = (props) => {
  const { sales_currentProductIndex } = useSelector((state) => state.data);

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
      <div
        className="financial_a-card"
        style={{
          display:
            (name === "Total Payout" && sales_currentProductIndex === 0) ||
            (name === "Net Deduction" && sales_currentProductIndex === 0)
              ? "none"
              : "",
        }}
      >
        <div className="financial_a-card__text">
          <div className="financial_a-card__text--heading">
            <h5 className="text">{name}</h5>
          </div>
          <div className="value green">Working on it...</div>
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
          {name !== "Swiggy Sales" && name !== "Zomato Sales" && (
            <span className="date">{customDate}</span>
          )}
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
