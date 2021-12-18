import React from "react";
import { useSelector } from "react-redux";
import ReviewCard from "../../components/customerReviews/ReviewCard";

const AllReviews = () => {
  const { data, currentProductIndex } = useSelector((state) => state.data);

  const customerReviews = data[currentProductIndex]["customerReviews"];
  const { positive } = customerReviews;

  return (
    <>
      <div className="review-container">
        {positive !== undefined &&
          positive.length > 0 &&
          positive.map((review, index) => (
            <ReviewCard
              key={review.id}
              id={review.id}
              rating={review.rating}
              review={review.review}
              date={review.date}
            />
          ))}
      </div>
    </>
  );
};

export default AllReviews;
