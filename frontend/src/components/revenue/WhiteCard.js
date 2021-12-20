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
    color
  } = props;

  let value;

  if (currentValue === undefined) {
    value = resultType === "month" ? monthlyResult : weeklyResult;
  }
  // ! for fix result no weekly or monthly
  else {
    value = currentValue;
  }
  console.log(name, value, benchmark,)

  return (
    <div className="card">
      <div className="card__text">
        <h5 className="card__text--heading">{name}</h5>
        <div className="value" style={{"color":`${color}`}}>{value}</div>
        <div className="card__text--info">
          <p>{info}</p>
        </div>
      </div>
      {/* //! sending data from this page */}
      <Link
        to={`${name.replace(/\s/g, "")}`}
        state={{ name, type, value, benchmark,  }}
        className="card__btn"
      >
        <span className="card__btn--text">Know more</span>
        <AiOutlineRight className="card__btn--icon" />
      </Link>
    </div>
  );
}

export default WhiteCard
