import React from "react";
import { AiOutlineRise, AiOutlineFall } from "react-icons/ai";

const CardStatistics = ({ cardStatistics }) => {
  const {
    value: currentValue,
    change,
    benchmark,
    changeTypeDirection,
    type,
  } = cardStatistics;

  const value = parseInt(currentValue);
  const diff = value - change;
  console.log(diff, "diff");

  return (
    <>
      <div className="card-statistics__value">
        {/* //?top value */}
        <span className="icon-box">
          {changeTypeDirection === "up" ? (
            <AiOutlineRise className="icon-green" size={25} />
          ) : (
            <AiOutlineFall className="icon-red" size={25} />
          )}
        </span>
        {type === "money" && <span className="value"> &#8377; {value}</span>}
        {type === "percentage" && <span className="value">{value}%</span>}
      </div>
      {/* //?bottom value */}
      {change !== null ? (
        <div className="card-statistics__info">
          {diff >= 0 ? (
            // ? Positive value
            <span className="change change-green">+{diff}%</span>
          ) : (
            // ? Negative value
            <span className="change change-red">{diff}%</span>
          )}{" "}
          over target
        </div>
      ):
      (<div className="card-statistics__info">
        {/* //! for not present data */}
        comming soon
      </div>)
      }
    </>
  );
};

export default CardStatistics;
