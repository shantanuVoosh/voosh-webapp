import React from "react";
import NegativeReviewCard from "../../components/customerReviews/NegativeReviewCard";
import InfoCard from "../../components/InfoCard";
import { AiFillStar } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
// const resultType = "month";

const CustomerReviews = () => {
  const { data, currentProductIndex } = useSelector((state) => state.data);
  const resultType = useSelector((state) => state.data.resultType);
  const navigate = useNavigate();

  const { customerReviews } = data[currentProductIndex];
  const { negative, OrdersPerRating, value, totalRatings } = customerReviews;

  const ratings = Object.keys(OrdersPerRating).map((key) => {
    let rating = key.split("_")[0];
    let obj = {};
    obj[rating] = OrdersPerRating[key];
    return obj;
  });
  console.log(
    negative,
    OrdersPerRating,
    value,
    totalRatings,
    "-----------------"
  );
  console.log(ratings, "ratings");
  // console.log(ratings, "ratings", value, "value");
  const colors = ["#2A327D", "#00C689", "#FFCA00", "#FFB039", "#FE645A"];

  return (
    <>
      <div className="customer_review-container  customer_review">
        <InfoCard name={"Current Rating"} value={value} type={"average"} />
        {/* Rating bars */}
        <div className="customer_review__sub-heading">
          <div className="customer_review__sub-heading--text">
            Ratings Split For {resultType}
          </div>
        </div>
        <div className="rating-bar">
          {ratings.map((rating, index) => {
            return (
              <div className="rating-bar__item" key={index}>
                <div className="rating-bar__item--rating">
                  <span className="rating">{Object.keys(rating)[0]}</span>
                  <AiFillStar className="icon" />
                </div>
                <div className="rating-bar__item--bar">
                  <div
                    className="bar-fill"
                    style={{
                      width: `${
                        totalRatings === 0 || totalRatings === undefined
                          ? 0
                          : Math.floor(
                              (Object.values(rating)[0] / totalRatings) * 100
                            )
                      }%`,
                      backgroundColor: `${colors[index]}`,
                    }}
                  ></div>
                </div>
                <div className="rating-bar__item--orders">
                  <span>{Object.values(rating)[0]} Orders</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="customer_review__sub-heading">
          {negative.length > 0 && (
            <div className="customer_review__sub-heading--text">
              Major Complains By Customer In{" "}
              {resultType !== "Custom Range" ? resultType : "In this Range"}
            </div>
          )}
        </div>
        <div className="negative-reviews">
          {negative.length > 0
            ? negative.map((item, index) => {
                const { item_name, issues } = item;
                return (
                  <NegativeReviewCard
                    key={index}
                    name={item_name}
                    issues={issues}
                  />
                );
              })
            : // <div className="no_reviews">
              //   <div className="text">No Complains Found In {resultType}</div>
              // </div>
              null}
        </div>
        <div
          onClick={() => navigate("/allReviews")}
          className="review-btn__btn screen-btn"
        >
          See All Reviews
        </div>
      </div>
    </>
  );
};

export default CustomerReviews;
