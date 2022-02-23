import React from "react";
import { IoAlertCircleSharp } from "react-icons/io5";

const NegativeReviewCard = (props) => {
  const { name, issues, totalOrders, totalReviewed, totalRated, sales } = props;

  console.log(issues);
  return (
    <div className="review-card__negative">
      <div className="review-card__text">
        <span className="review-card__text--title">Issue Item Name: </span>
        <span>{name}</span>
      </div>
      <div className="review-card__issues">
        {issues.map((issue, index) => {
          return (
            <>
              {" "}
              {issue.value === 0 ? null : (
                <div key={index} className="issue">
                  <span>
                    <IoAlertCircleSharp className="alert-icon" />
                  </span>
                  <span>
                    <span className="text">
                      <span className="name">{issue.value}</span>% of the
                      customer say's <span className="name">{issue.name}</span>{" "}
                      is an issue
                    </span>
                  </span>
                </div>
              )}
            </>
          );
        })}
      </div>
    </div>
  );
};

export default NegativeReviewCard;
