import React from "react";

function getRandomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const infoCardWithNoData = ({ name }) => {
  let showColor = ["red", "green"];
  return (
    <div className="info-card">
      <div className="name">
        {" "}
        {name.length > 15 ? name.substring(0, 15) + "..." : name}
      </div>

      <div className={`${showColor[getRandomNumberBetween(0, 1)]} value`}>
        Working on it
      </div>
    </div>
  );
};

export default infoCardWithNoData;
