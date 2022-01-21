import React from "react";

const InfoCard = ({ name, value, type, benchmark, compareThen }) => {
  let showColor;
  if (compareThen === "grater") {
    showColor = value >= benchmark ? "green-value" : "red-value";
  } else {
    showColor = value <= benchmark ? "green-value" : "red-value";
  }
  console.log(name, value, benchmark, compareThen, "info card");

  if (value === "Please wait! We are working on It.") {
    return (
      <div className="info-card  ">
        <div
          className={
            "name " +
            `${name === "Current Rating" ? "customer_review_ratings" : ""}`
          }
        >
          {name.length > 15 ? name.substring(0, 15) + "..." : name}
        </div>

        <div className={`${showColor} value`}>Working on it!</div>
      </div>
    );
  }

  return (
    <div className="info-card  ">
      <div
        className={
          "name " +
          `${name === "Current Rating" ? "customer_review_ratings" : ""}`
        }
      >
        {name.length > 15 ? name.substring(0, 15) + "..." : name}
      </div>
      {type === "average" ? (
        <div className={`${showColor} value`}>{`${value}`}</div>
      ) : (
        <div className={`${showColor} value`}>{`${value}%`}</div>
      )}
    </div>
  );
};

export default InfoCard;
