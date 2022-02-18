import React from "react";

const InfoCard = ({ name, value, type, benchmark, compareThen }) => {
  let showColor;
  if (compareThen === "grater") {
    showColor = value >= benchmark ? "green-value" : "red-value";
  } else {
    showColor = value <= benchmark ? "green-value" : "red-value";
  }
  // console.log(name, value, benchmark, compareThen, "info card");

  // ! for rating only
  if (name === "Current Rating" && (value === 0 || value === null)) {
    return (
      <div className="info-card  ">
        <div
          className={
            "name " +
            `${name === "Current Rating" ? "customer_review_ratings" : ""}`
          }
        >
          {name}
        </div>

        <div
          className={`${showColor} value green`}
          style={{
            fontSize: "15px",
            // marginBottom: "1rem",
            padding: "0.5rem 0",
            fontWeight: "700",
          }}
        >
          {" "}
          Rating not available
        </div>
      </div>
    );
  }

  // ! for no data only
  if (value === null) {
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

        <div
          className={`${showColor} value green`}
          style={{
            fontSize: "20px",
            lineHeight: "2",
          }}
        >
          Working on it!
        </div>
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
