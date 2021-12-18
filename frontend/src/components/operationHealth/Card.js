import React from "react";
import { AiOutlineRight } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { AiOutlineRise, AiOutlineFall } from "react-icons/ai";

const Card = (props) => {
  const resultType = useSelector((state) => state.resultType);
  const {
    name,
    type,
    value: currentValue,
    info,
    benchmark,
    monthlyResult,
    weeklyResult,
    compareThen,
  } = props;

  let value;

  if (currentValue === undefined) {
    value = resultType === "month" ? monthlyResult : weeklyResult;
  }
  // !fix result no weekly or monthly
  else {
    value = currentValue;
  }
  console.log(name, value, benchmark, compareThen)

  return (
    <div className="card">
      <div className="card__text">
        <h5 className="card__text--heading">{name}</h5>
        {compareThen === "grater" && (
          <div
            className={
              value >= benchmark ? "green-value value" : "red-value value"
            }
          >
            { value >= benchmark ? <AiOutlineRise/>:<AiOutlineFall/>}
             {value}%
          </div>
        )}
        {compareThen === "less" &&  (
          <div
            className={
              value <= benchmark ? "green-value value" : "red-value value"
            }
          >
            {/* { value <= benchmark && <AiOutlineRise/>} */}
            { value <= benchmark ? <AiOutlineRise/>:<AiOutlineFall/>}
            {value}%
          </div>
        )}

        <div className="card__text--info">
          <p>{info}</p>
        </div>
      </div>
      {/* //! sending data from this page */}
      <Link
        to={`${name.replace(/\s/g, "")}`}
        state={{ name, type, value, benchmark, compareThen }}
        className="card__btn"
      >
        <span className="card__btn--text">Know more</span>
        <AiOutlineRight className="card__btn--icon" />
      </Link>
    </div>
  );
};

export default Card;
