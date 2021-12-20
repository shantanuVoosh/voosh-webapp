import React from "react";

const ColorList = ({ name, value, color }) => {
  const valueWrapper = value.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
    style: "currency",
    currency: "INR",
  });
  return (
    <div className="graph-list__item">
      <div
        className="graph-list__item--icon"
        style={{ backgroundColor: `${color}` }}
      ></div>
      <div className="graph-list__item--text">
        <span className="name" style={{ fontWeight: "600" }}>
          {name} :
        </span>
        <span className="value" style={{ fontWeight: "700" }}>
          {valueWrapper}
        </span>
      </div>
    </div>
  );
};

export default ColorList;
