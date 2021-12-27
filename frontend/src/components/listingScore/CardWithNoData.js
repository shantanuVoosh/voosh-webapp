import React from "react";
import { AiOutlineRight } from "react-icons/ai";

const CardWithNoData = ({ name, info }) => {
  return (
    <div className="listing_score_card">
      <div className="listing_score_card__text">
        <h5 className="listing_score_card__text--heading">{name}</h5>

        <div className="listing_score_card__text--info">
          <p>{info.length > 60 ? info.substring(0, 60) + "..." : info}</p>
        </div>
        <div className="value green error-value">working on it...</div>
      </div>

      <div className="card__btn">
        <span className="card__btn--text">Know more</span>
        <AiOutlineRight className="card__btn--icon " />
      </div>
    </div>
  );
};

export default CardWithNoData;
