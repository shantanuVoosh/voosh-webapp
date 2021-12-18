import React from "react";

const Card = ({ name, value, info }) => {
  return (
    <div className="ads__card">
      <h4 className="ads__card--heading">{name}</h4>
      <span className="ads__card--value">&#8377; {value}</span>
      <p className="ads__card--info">{info}</p>
    </div>
  );
};

export default Card;
