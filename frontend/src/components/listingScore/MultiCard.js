import React from "react";
import { AiOutlineRight } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

// ?  now we know there are only two cards which will combine to one card
// ! but for zomato there will be 4 offers

const MultiCard = ({ data, productIndex }) => {
  console.log("Data Of Multi Card", data);
  let partner_name = "";
  partner_name = productIndex === 0 ? "swiggy" : "zomato";

  //! break fix for zomato, cause might be on setting multi cards
  if (partner_name === "zomato") {
    return null;
  }

  return (
    <div className="multi-card">
      {data.map((item, index) => {
        const { info, name, value } = item;
        const { showColor, isKnowMorePresent, resultValue, resultBenchmark } =
          benchmarkHelper(name, partner_name, value);

        return (
          <div className="multi-card-one" key={index}>
            <div className="multi-card-one__text">
              <h5 className="multi-card-one__text--heading">{name}</h5>
            </div>
            <div className="multi-card-one__text--info">
              <p>{info.length > 55 ? info.substring(0, 55) + "..." : info}</p>
            </div>
            <div className={`multi-card-one__value ${showColor}`}>{value}</div>
            {isKnowMorePresent && (
              <Link
                to={`${name.replace(/\s/g, "")}`}
                className="multi-card-one__btn"
              >
                <span className="multi-card-one__btn--text">Know more</span>
                <AiOutlineRight className="multi-card-one__btn--icon" />
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
};
//? for the time being this for only swiggy
function benchmarkHelper(name, partner_name, value) {
  let showColor = "";
  let isKnowMorePresent = false;
  let resultValue = 0;
  let resultBenchmark = 0;
  if (partner_name === "swiggy") {
    //* offer 1
    if (name === "Offer 1") {
      resultValue = value === "Applicable" ? 1 : 0;
      resultBenchmark = 1;
      showColor = resultValue === resultBenchmark ? "green" : "red";
    }
    //* offer 2
    else if (name === "Offer 2") {
      resultValue = value === "Applicable" ? 1 : 0;
      resultBenchmark = 1;
      showColor = resultValue === resultBenchmark ? "green" : "red";
    }
    // * Item Description
    else if (name === "Item Description") {
      resultValue = value;
      resultBenchmark = 70;
      isKnowMorePresent = true;
      showColor = resultValue >= resultBenchmark ? "green" : "red";
    }
    // * Images
    else if (name === "Images") {
      resultValue = value;
      resultBenchmark = 60;
      isKnowMorePresent = true;
      showColor = resultValue >= resultBenchmark ? "green" : "red";
    }

    return {
      resultValue,
      resultBenchmark,
      isKnowMorePresent,
      showColor,
    };
  }
}

export default MultiCard;
