import React from "react";
import { useSelector } from "react-redux";
import ReviewCard from "../../components/customerReviews/ReviewCard";

const AllReviews = () => {
  const { data, currentProductIndex } = useSelector((state) => state.data);

  const customerReviews = data[currentProductIndex]["customerReviews"];
  const { all_reviews } = customerReviews;
  console.log("all_reviews", all_reviews);

  return (
    <>
      <div className="review-container">
        {all_reviews !== undefined &&
          all_reviews.length > 0 &&
          all_reviews.map((review, index) => {
            const {order_id, feedback, rating, date} = review;
            return (
              <ReviewCard
                key={index}
                id={order_id}
                rating={rating}
                review={feedback}
                date={date}
              />
            );
          })}
      </div>
    </>
  );
};

export default AllReviews;
