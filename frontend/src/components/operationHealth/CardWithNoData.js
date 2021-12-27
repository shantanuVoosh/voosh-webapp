import React from "react";
import { AiOutlineRight } from "react-icons/ai";

const CardWithNoData = ({ name, info }) => {
  return (
    <div className="card">
      <div className="card__text">
        <h5 className="card__text--heading">{name}</h5>

        <div className={"value green error-value"}>working on it...</div>

        <div className="card__text--info">
          <p>{info}</p>
        </div>
      </div>
      {/* //! disable know more */}
      <div className="card__btn">
        <span className="card__btn--text unavailable">Know more</span>
        <AiOutlineRight className="card__btn--icon " />
      </div>
    </div>
  );
};

export default CardWithNoData;
