import React from "react";
const CardWithNoData = ({ name, info }) => {
  return (
    <div className="op_card">
      <div className="op_card__text">
        <h5 className="op_card__text--heading">{name}</h5>

        {/* //! For rating only */}
        {(name === "Rating") && (
          <div
            className={`green`}
            style={{
              fontSize: "15px",
              padding: "0.5rem 0",
              fontWeight: "700",
            }}
          >
            Rating not available
          </div>
        )}

        {name !== "Rating" && (
          <div className="value error-value green">Working on it...</div>
        )}

        <div className="op_card__text--info">
          <p>{info}</p>
        </div>
      </div>
    </div>
  );
};

export default CardWithNoData;
