import React from "react";
// ! value null means no data
const InfoCard = ({ name, value, type, benchmark, compareThen }) => {
  let showColor = "";
  let resultValue = value;
  let resultBenchmark = benchmark;

  if (compareThen === "grater") {
    showColor = value >= benchmark ? "green-value" : "red-value";
  } else {
    showColor = value <= benchmark ? "green-value" : "red-value";
  }

  if (name === "Rating" && (value === 0 || value === null)) {
    return (
      <div className="info-card">
        <div className="name">{name}</div>
        <div
          className={`${showColor} value green`}
          style={{
            fontSize: "15px",

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
    <div className="info-card">
      <div className="name">{name}</div>
      <div className={`${showColor} value`}>
        {`${value}`}
        {type === "percentage" &&
        name !== "Number of Rating" &&
        name !== "Number of Reviews" &&
        name !== "Images"
          ? "%"
          : ""}
      </div>
    </div>
  );
};

export default InfoCard;
