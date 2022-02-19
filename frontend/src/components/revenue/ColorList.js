import React from "react";
import { useSelector } from "react-redux";

const ColorList = ({ name, value, color, isDataPresent }) => {
  const { resultType, currentProductIndex } = useSelector(
    (state) => state.data
  );

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
        {isDataPresent && (
          <span className="value" style={{ fontWeight: "700" }}>
            {valueWrapper}
          </span>
        )}
        {!isDataPresent && currentProductIndex === 0 ? (
          <span
            className="value green"
            style={{
              fontWeight: "700",
              marginLeft: "10px",
              fontSize: "10px",
            }}
          >
            From Next Month
          </span>
        ) : (
          <span
            className="value green"
            style={{
              fontWeight: "700",
              marginLeft: "10px",
              fontSize: "10px",
            }}
          >
            Working on it...
          </span>
        )}
      </div>
    </div>
  );
};

export default ColorList;
