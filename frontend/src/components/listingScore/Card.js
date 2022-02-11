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
  const resultType = useSelector((state) => state.data.resultType);

  let showColor = "";
  let resultValue = 0;
  let resultBenchmark = 0;

  // console.log(name, value, benchmark, compareThen, type);

  // Todo: String Working
  if (type === "string") {
    // ? Possible String Compariso
    // ! Yes No
    if (compareThen === "yes or no") {
      resultValue = value === benchmark ? 100 : 0;
      resultBenchmark = 100;
    }
    // ! String Number
    else if (benchmark === "4.0") {
      if (value.includes("<")) {
        value = value.replace("<", "");
        resultValue = parseFloat(value);
        resultBenchmark = parseFloat(benchmark);
      } else if (value.includes(">")) {
        value = value.replace(">", "");
        resultValue = parseFloat(value);
        resultBenchmark = parseFloat(benchmark);
      } else if (value.includes("=")) {
        value = value.replace("=", "");
        value = parseFloat(value);
        resultValue = parseFloat(value);
        resultBenchmark = parseFloat(benchmark);
      } else if (value.includes("to")) {
        value = value.split("to")[1];
        value = parseFloat(value);
        resultValue = parseFloat(value);
        resultBenchmark = parseFloat(benchmark);
      }
    } else if (value === "Not Applicable" || value === "Applicable") {
      resultValue = value === "Not Applicable" ? 0 : 100;
      resultBenchmark = 100;
    }
  } else if (type === "percentage") {
    if (compareThen === "High Medium Low") {
      resultBenchmark = benchmark;
      if (value === "High") {
        resultValue = 90;
      } else if (value === "Medium") {
        console.log("here", name, value, benchmark, compareThen, type);
        resultValue = 70;
      } else if (value === "Low") {
        resultValue = 50;
      }
    } else {
      resultValue = value;
      resultBenchmark = benchmark;
    }
  }
  // Todo: Dont Touch this

  showColor = resultValue >= resultBenchmark ? "green" : "red";

  // console.log(resultValue, resultBenchmark, "resultValue", "resultBenchmark");

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
          name !== "Number of Reviews"
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
