import React from "react";
import { AiOutlineRight } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { AiOutlineRise, AiOutlineFall } from "react-icons/ai";


const GrayCard = (props) => {
  const resultType = useSelector((state) => state.resultType);
  const {
    name,
    type,
    value: currentValue,
    info,
    monthlyResult,
    weeklyResult,
    color,
  } = props;

  let value;

  if (currentValue === undefined) {
    value = resultType === "month" ? monthlyResult : weeklyResult;
  }
  // !fix result no weekly or monthly
  else {
    value = currentValue;
  }

  if(type === "money"){
    value = value.toLocaleString('en-IN', {
      maximumFractionDigits: 2,
      style: 'currency',
      currency: 'INR'
  });
  }
  else if(type === "number"){
    value = value.toLocaleString('en-IN');
  }

  // console.log(name, value,"new value");

  
  return (
    <div className="card">
      <div className="card__text">
        <h5 className="card__text--heading">{name}</h5>
        
        <div className="value" style={{"color":`${color}`}}>{value}</div>

        <div className="card__text--info">
          <p>{info}</p>
        </div>
      </div>
    </div>
  );
};

export default GrayCard;
