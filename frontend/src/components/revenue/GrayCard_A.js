import React from "react";
import { AiOutlineRight } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { AiOutlineRise, AiOutlineFall } from "react-icons/ai";

const GrayCard = (props) => {
  const resultType = useSelector((state) => state.resultType);
  const { name, type, value, info, color, isDataPresent } = props;

  if (!isDataPresent) {
    return (
      <div className="card">
        <div className="card__text">
          <h5 className="card__text--heading">{name}</h5>

          <div className="value error-value green">Working on it..</div>

          <div className="card__text--info">
            <p>{info}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card__text">
        <h5 className="card__text--heading">{name}</h5>

        <div className="value" style={{ color: `${color}` }}>
          {type === "money" &&
            value.toLocaleString("en-IN", {
              maximumFractionDigits: 2,
              style: "currency",
              currency: "INR",
            })}
          {type === "number" && value.toLocaleString("en-IN")}
        </div>

        <div className="card__text--info">
          <p>{info}</p>
        </div>
      </div>
    </div>
  );
};

export default GrayCard;
