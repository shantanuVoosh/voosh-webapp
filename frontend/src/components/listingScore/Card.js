import React from "react";
import { AiOutlineRight } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Card = ({
  name,
  value,
  benchmark,
  info,
  compareThen,
  type,
  isDataPresent,
}) => {
  const { resultType } = useSelector((state) => state.data);

  console.log(resultType);

  let showColor = "";
  let resultValue = value;
  let resultBenchmark = benchmark;

  if (compareThen === "less") {
    showColor = resultValue < resultBenchmark ? "green" : "red";
  } else {
    showColor = resultValue >= resultBenchmark ? "green" : "red";
  }

  return (
    <div className="listing_score_card">
      <div className="listing_score_card__text">
        <h5 className="listing_score_card__text--heading">{name}</h5>

        <div className="listing_score_card__text--info">
          <p>{info.length > 55 ? info.substring(0, 55) + "..." : info}</p>
        </div>

        <div className={`value ${showColor}`}>
          {value}
          {type === "percentage" &&
          name !== "Number of Rating" &&
          name !== "Number of Reviews" &&
          name !== "Images"
            ? "%"
            : ""}
        </div>
      </div>
      {/*Safety Tag  Offer 1  Offer 2  Beverages Category  Desserts*/}
      {(name === "Images" ||
        // name === "Number of Rating" ||
        name === "Rating" ||
        name === "Best Seller Score" ||
        name === "Review(star)" ||
        name === "Number of Reviews" ||
        name === "Item Description") && (
        <Link
          to={`${name.replace(/\s/g, "")}`}
          className="listing_score_card__btn"
        >
          <span className="listing_score_card__btn--text">Know more</span>
          <AiOutlineRight className="listing_score_card__btn--icon" />
        </Link>
      )}
    </div>
  );
};

export default Card;
