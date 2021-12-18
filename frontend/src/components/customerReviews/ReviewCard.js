import React from "react";
import { AiFillStar } from "react-icons/ai";
import moment from "moment";

const ReviewCard = ({ id, rating, date, review }) => {
  return (
    <div className="review-card">
      <div className="review-card__info">
        <div className="review-card__info--id">#{id}</div>
        <div className="review-card__info--rating">
          <span className="number">{rating}</span>
          <AiFillStar className="star-icon" />
        </div>
      </div>
      <div className="review-card__message">
        <div className="review-card__message--date">{moment("20201107").format('DD/MM/YYYY')}</div>
        <div className="review-card__message--review">{review}</div>
      </div>
    </div>
  );
};

export default ReviewCard;
