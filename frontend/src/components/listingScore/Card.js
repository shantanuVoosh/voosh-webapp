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
    comapreThen,
  } = props;

  let value;

  if (currentValue === undefined) {
    value = resultType === "month" ? monthlyResult : weeklyResult;
  }
  // !fix result no weekly or monthly
  else {
    value = currentValue;
  }

  console.log(value);

  return (
    <div className="card">
      <div className="card__text">
        <h5 className="card__text--heading">{name}</h5>
        {/* {(comapreThen!==null && comapreThen === "grater") && (
          <div
            className={
              parseInt(value) >= benchmark ? "green-value value" : "red-value value"
            }
          >
            { (benchmark!==null && parseInt(value) >= benchmark )&& <AiOutlineRise/>}
            { (benchmark!==null && parseInt(value) >= benchmark ) && <AiOutlineFall/>}
            {value}%
          </div>
        )}
        {( comapreThen!==null &&comapreThen === "less") && (
          <div
            className={
              parseInt(value) <= benchmark ? "green-value value" : "red-value value"
            }
          >
            {parseInt(value)}%
          </div>
        )}
        {value} */}
        <div className={"green-value value"}>{value}</div>

        <div className="card__text--info">
          <p>{info}</p>
        </div>
      </div>
      {/* //! sending data from this page */}
      {/* <Link
        to={`${name.replace(/\s/g, "")}`}
        state={{ name, type, value }}
        className="card__btn"
      >
        <span className="card__btn--text">Know more</span>
        <AiOutlineRight className="card__btn--icon" />
      </Link> */}
    </div>
  );
};

export default Card;
