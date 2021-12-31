import React from "react";
import { AiOutlineRight } from "react-icons/ai";

const CardWithNoData = ({ name, info }) => {
  return (
    <div className="op_card">
      <div className="op_card__text">
        <h5 className="op_card__text--heading">{name}</h5>

        <div className={"value green error-value"}>working on it...</div>

        <div className="op_card__text--info">
          <p>{info}</p>
        </div>
      </div>
      {/* //! disable know more */}
      <div className="op_card__btn">
        <span className="op_card__btn--text unavailable">Know more</span>
        <AiOutlineRight className="op_card__btn--icon " />
      </div>
    </div>
  );
};

export default CardWithNoData;
