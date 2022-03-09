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
  productIndex,
  isDataPresent,
}) => {
  const {
    resultType,
    currentProductIndex,
    oh_currentProductIndex,
    ls_currentProductIndex,
  } = useSelector((state) => state.data);

  // console.log(resultType);

  let partner_name = "";
  partner_name = productIndex === 0 ? "swiggy" : "zomato";
  const { showColor, isKnowMorePresent, resultValue, resultBenchmark } =
    listingScoreBenchmarks(name, partner_name, value);

  // console.log({
  //   showColor,
  //   isKnowMorePresent,
  //   resultValue,
  //   resultBenchmark,
  //   name,
  // });

  if (name === "Rating" && (value === 0 || value === null)) {
    return (
      <>
        <div className="listing_score_card">
          <div className="listing_score_card__text">
            <h5 className="listing_score_card__text--heading">{name}</h5>

            <div className="listing_score_card__text--info">
              <p>{info.length > 55 ? info.substring(0, 55) + "..." : info}</p>
            </div>
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
          </div>
          {/*Safety Tag  Offer 1  Offer 2  Beverages Category  Desserts*/}
          {name === "Rating" && value !== 0 && value !== null && (
            <Link
              to={`${name.replace(/\s/g, "")}`}
              className="listing_score_card__btn"
            >
              <span className="listing_score_card__btn--text">Know more</span>
              <AiOutlineRight className="listing_score_card__btn--icon" />
            </Link>
          )}
        </div>
      </>
    );
  }
  if (name === "Number of Rating") {
    return (
      <>
        <div className="listing_score_card">
          <div className="listing_score_card__text">
            <h5 className="listing_score_card__text--heading">{name}</h5>

            <div className="listing_score_card__text--info">
              <p>{info.length > 55 ? info.substring(0, 55) + "..." : info}</p>
            </div>

            <div className={`value ${showColor}`}>
              {resultValue}
              <span
                style={{
                  fontSize: "20px",
                }}
              >{`+`}</span>
            </div>
          </div>

          {isKnowMorePresent && (
            <Link
              to={`${name.replace(/\s/g, "")}`}
              className="listing_score_card__btn"
            >
              <span className="listing_score_card__btn--text">Know more</span>
              <AiOutlineRight className="listing_score_card__btn--icon" />
            </Link>
          )}
        </div>
      </>
    );
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
      {isKnowMorePresent && (
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

function listingScoreBenchmarks(name, partner_name, value) {
  let showColor = "";
  let isKnowMorePresent = false;
  let resultValue = 0;
  let resultBenchmark = 0;

  // ?for Swiggy ls Items
  if (partner_name === "swiggy") {
    // *1 this will not have know more btn(Time Graph)
    if (name === "Safety Tag") {
      resultValue = value === "Yes" ? 1 : 0;
      resultBenchmark = 1;
      showColor = resultValue === resultBenchmark ? "green" : "red";
      console.log("Safety Tag", resultValue, resultBenchmark, showColor);
    }
    // *2 (Time Graph)
    else if (name === "Images") {
      resultValue = value;
      resultBenchmark = 60;
      isKnowMorePresent = true;
      showColor = resultValue >= resultBenchmark ? "green" : "red";
    }
    // *3 (Time Graph)
    else if (name === "Number of Rating") {
      resultValue =
        value === "High"
          ? 100
          : value === "Medium"
          ? 50
          : value === "Low"
          ? 0
          : 0;
      resultBenchmark = 90;
      isKnowMorePresent = true;
      showColor = resultValue >= resultBenchmark ? "green" : "red";
    }
    // *4 (Time Graph)
    else if (name === "Rating") {
      resultValue = value;
      resultBenchmark = 4.5;
      isKnowMorePresent = true;
      showColor = resultValue >= resultBenchmark ? "green" : "red";
    }
    // *5 this will not have know more btn(Time Graph)
    else if (name === "Offer 1") {
      resultValue = value === "Applicable" ? 1 : 0;
      resultBenchmark = 1;
      showColor = resultValue === resultBenchmark ? "green" : "red";
    }
    // *6 this will not have know more btn(Time Graph)
    else if (name === "Offer 2") {
      resultValue = value === "Applicable" ? 1 : 0;
      resultBenchmark = 1;
      showColor = resultValue === resultBenchmark ? "green" : "red";
    }
    // *7 (Time Graph)
    else if (name === "Item Description") {
      resultValue = value;
      resultBenchmark = 70;
      isKnowMorePresent = true;
      showColor = resultValue >= resultBenchmark ? "green" : "red";
    }
    // *8 No Know More Button (Time Graph)
    else if (name === "Beverages Category") {
      resultValue = value === "Yes" ? 1 : 0;
      resultBenchmark = 1;
      showColor = resultValue === resultBenchmark ? "green" : "red";
    }
    // *9 (Time Graph)
    else if (name === "Best Seller Score") {
      resultValue = value;
      resultBenchmark = 80;
      // isKnowMorePresent = true;
      showColor = resultValue >= resultBenchmark ? "green" : "red";
    }
    // *10 No Know More Button (Time Graph)
    else if (name === "Desserts") {
      resultValue = value === "Yes" ? 1 : 0;
      resultBenchmark = 1;
      showColor = resultValue === resultBenchmark ? "green" : "red";
    }

    return {
      resultValue,
      resultBenchmark,
      isKnowMorePresent,
      showColor,
    };
  }
  // ?for Zomato ls Items
  else if (partner_name === "zomato") {
    // *1 this will not have know more btn(Time Graph)
    if (name === "Safety Tag") {
      resultValue = value === "Yes" ? 1 : 0;
      resultBenchmark = 1;
      showColor = resultValue === resultBenchmark ? "green" : "red";
    }
    // *2 (Time Graph)
    else if (name === "Images") {
      resultValue = value;
      resultBenchmark = 100;
      // isKnowMorePresent = true;
      showColor = resultValue >= resultBenchmark ? "green" : "red";
    }
    // *3 (Time Graph)
    // ! this is not in Swiggy
    else if (name === "Number of Review") {
      resultValue = value;
      resultBenchmark = 5000;
      // isKnowMorePresent = true;
      showColor = resultValue >= resultBenchmark ? "green" : "red";
    }
    // Todo:delivery_review
    // *4 (Time Graph)
    // ! this is not in Swiggy
    else if (name === "Delivery Review") {
      resultValue = value;
      resultBenchmark = 3.7;
      // isKnowMorePresent = true;
      showColor = resultValue >= resultBenchmark ? "green" : "red";
    }

    // *5 (Time Graph)
    // ! this is not in Swiggy
    else if (name === "Vote Score") {
      resultValue = value;
      resultBenchmark = 5;
      // isKnowMorePresent = true;
      showColor = resultValue < resultBenchmark ? "green" : "red";
    }
    // *6 (Time Graph)
    else if (name === "Rating") {
      resultValue = value;
      resultBenchmark = 4.5;
      isKnowMorePresent = true;
      showColor = resultValue >= resultBenchmark ? "green" : "red";
    }
    // *7-10 this will not have know more btn(Time Graph)
    else if (
      name === "Offer 1" ||
      name === "Offer 2" ||
      name === "Offer 3" ||
      name === "Offer 4"
    ) {
      resultValue = value === " Applicable" ? 0 : 1;
      resultBenchmark = 1;
      showColor = resultValue === resultBenchmark ? "green" : "red";
    }
    // *11 (Time Graph)
    else if (name === "Item Description") {
      resultValue = value;
      resultBenchmark = 85;
      isKnowMorePresent = true;
      showColor = resultValue >= resultBenchmark ? "green" : "red";
    }
    // *12 No Know More Button (Time Graph)
    else if (name === "Beverages Category") {
      resultValue = value === "Yes" ? 1 : 0;
      resultBenchmark = 1;
      showColor = resultValue === resultBenchmark ? "green" : "red";
    }
    // *13 No Know More Button (Time Graph)
    else if (name === "Desserts") {
      resultValue = value === "Yes" ? 1 : 0;
      resultBenchmark = 1;
      showColor = resultValue === resultBenchmark ? "green" : "red";
    }

    return {
      resultValue,
      resultBenchmark,
      isKnowMorePresent,
      showColor,
    };
  }
}
