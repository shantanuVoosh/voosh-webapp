import React from "react";
import { AiOutlineRight } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { AiOutlineRise, AiOutlineFall } from "react-icons/ai";

const Card = (props) => {
  const resultType = useSelector((state) => state.resultType);
  const {
    name,
    value: currentValue,
    info,
    benchmark,
    monthlyResult,
    weeklyResult,
    compareThen,
    redirection,
    videoLink,
    recommendations
  } = props;

  let value;

  if (currentValue === undefined) {
    value = resultType === "month" ? monthlyResult : weeklyResult;
  }
  // !fix result no weekly or monthly
  else {
    value = currentValue;
  }
  console.log(name, value, benchmark, compareThen, recommendations);

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
            {value >= benchmark ? <AiOutlineRise className="rise-fall_icon" /> : <AiOutlineFall className="rise-fall_icon" />}
            {value}%
          </div>
        )}
        {compareThen === "less" && (
          <div
            className={
              value <= benchmark ? "green-value value" : "red-value value"
            }
          >
            {/* { value <= benchmark && <AiOutlineRise/>} */}
            {value <= benchmark ? <AiOutlineRise className="rise-fall_icon" /> : <AiOutlineFall className="rise-fall_icon" />}
            {value}%
          </div>
        )}

        <div className="card__text--info">
          <p>{info}</p>
        </div>
      </div>
      {/* //! sending data from this page */}
      {/* //? redirect for special card */}
      {redirection ? (
        <>
          <Link to={redirection} className="card__btn">
            <span className="card__btn--text">Know more</span>
            <AiOutlineRight className="card__btn--icon " />
          </Link>
        </>
      ) : (
        <>
        <Link
          to={`${name.replace(/\s/g, "")}`}
          state={{ name, value, benchmark, compareThen, videoLink, recommendations }}
          className="card__btn"
        >
          <span className="card__btn--text">Know more</span>
          <AiOutlineRight className="card__btn--icon" />
        </Link>
        </>
      )}
    </div>
  );
};

export default Card;
