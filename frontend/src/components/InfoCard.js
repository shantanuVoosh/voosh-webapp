import React from "react";

const InfoCard = ({ name, value, type }) => {
  return (
    <div className="info-card">
      {/* //! Info Card Name */}
      <div className="name">{name}</div>

      {/* //! Info Card Value */}
      {/* //* check the type, and show that value */}
      {/* //? For Percentage  */}
      
      {type === "percentage" && (
        <div
          className={value >= 85 ? "green-value value" : "red-value value"}
        >{`${value}%`}</div>
      )}

      {/* //? For Rating */}
      {type === "rating" && (
        <div className={value >= 4 ? "green-value value" : "red-value value"}>
          {value}
        </div>
      )}

      {/* //? For Time */}
      {type === "time" && (
        <div
          className={
            value <= 16 ? "green-value value value" : "red-value value"
          }
        >
          {value}Mins
        </div>
      )}

      {/* //? For Percentage */}
      {type !== "percentage" && type !== "rating" && type !== "time" ? (
        <div className="value green-value">{`${value}X`}</div>
      ) : null}
    </div>
  );
};

export default InfoCard;
