import React from "react";

const InfoCard = ({ name, value, type, benchmark, compareThen }) => {
  let showColor;
  if (compareThen === "grater") {
    showColor = value >= benchmark ? "green-value" : "red-value";
  } else {
    showColor = value <= benchmark ? "green-value" : "red-value";
  }

  return (
    <div className="info-card">
      <div className="name">{name}</div>
      {type === "average" ? (
        <div className={`${showColor} value`}>{`${value}`}</div>
      ) : (
        <div className={`${showColor} value`}>{`${value}%`}</div>
      )}
    </div>
  );
};

export default InfoCard;
