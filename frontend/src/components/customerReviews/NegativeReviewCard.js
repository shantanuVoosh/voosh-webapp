import React from "react";
import { IoAlertCircleSharp } from "react-icons/io5";

const NegativeReviewCard = ({ name, issues }) => {
  // console.log(issues);
  return (
    <div className="review-card__negative">
      <div className="review-card__text">
        <span className="review-card__text--title">Issue Item Name: </span>
        <span>{name}</span>
      </div>
      <div className="review-card__issues">
        {issues.map((issue, index) => (
          <span key={index} className="issue">
            <span><IoAlertCircleSharp className="alert-icon" /></span>
            <span>
                <span className="name">{issue.name}</span>: 
                <span className="name">{issue.percentage}</span>
            </span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default NegativeReviewCard;
