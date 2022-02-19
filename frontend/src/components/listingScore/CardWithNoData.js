import React from "react";
import { AiOutlineRight } from "react-icons/ai";
import { useSelector } from "react-redux";

const CardWithNoData = ({ name, info }) => {
  const { resultType } = useSelector((state) => state.data);

  return (
    <div className="listing_score_card">
      <div className="listing_score_card__text">
        <h5 className="listing_score_card__text--heading">{name}</h5>

        <div className="listing_score_card__text--info">
          <p>{info.length > 60 ? info.substring(0, 60) + "..." : info}</p>
        </div>
        {name !== "Rating" && (
          <div className="value error-value green">Working on it...</div>
        )}
        {name === "Rating" && (
          <div
            className={`green`}
            style={{
              fontSize: "15px",
              // marginBottom: "1rem",
              padding: "0.5rem 0",
              fontWeight: "700",
            }}
          >
            Rating not available
          </div>
        )}
      </div>

      {/* <div className="card__btn">
        <span className="card__btn--text unavailable">Know more</span>
        <AiOutlineRight className="card__btn--icon " />
      </div> */}
    </div>
  );
};

export default CardWithNoData;
