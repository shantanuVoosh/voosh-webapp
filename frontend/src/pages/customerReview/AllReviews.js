import React from "react";
import { useSelector } from "react-redux";
import ReviewCard from "../../components/customerReviews/ReviewCard";

const AllReviews = () => {
  const { data, customer_reviews_currentProductIndex, resultType } =
    useSelector((state) => state.data);

  const customerReviews =
    data[customer_reviews_currentProductIndex]["customerReviews"];
  const { all_reviews } = customerReviews;
  console.log("all_reviews", all_reviews);

  return (
    <>
      <div className="review-container">
        {(all_reviews === undefined || all_reviews.length <= 0) && (
          <div className="no-reviews">
            No Reviews{" "}
            {resultType !== "Custom Range" ? resultType : "In this Range"}
          </div>
        )}
        {/* //? If feedback or comments are present! */}
        {all_reviews !== undefined &&
          all_reviews.length > 0 &&
          all_reviews.map((review, index) => {
            const { order_id, feedback, rating, order_date } = review;
            return (
              <ReviewCard
                key={index}
                id={order_id}
                rating={rating}
                review={feedback}
                date={order_date}
              />
            );
          })}
      </div>
    </>
  );
};

export default AllReviews;
