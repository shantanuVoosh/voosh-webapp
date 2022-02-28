import React from "react";
import NegativeReviewCard from "../../components/customerReviews/NegativeReviewCard";
import InfoCard from "../../components/InfoCard";
import { AiFillStar } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Switch from "@mui/material/Switch";
// const resultType = "month";

const CustomerReviews = () => {
  const { data, oh_currentProductIndex } = useSelector((state) => state.data);
  const { resultType } = useSelector((state) => state.data);
  const navigate = useNavigate();

  const { customerReviews } = data[oh_currentProductIndex];
  const { negative, ordersPerRating, value, totalRatings } = customerReviews;

  const [negativeItemList, setNegativeItemList] = React.useState([]);
  const [toggleButtonChecked, setToggleButtonChecked] = React.useState(false);

  const handleToggleButtonChange = (event) => {
    if (!toggleButtonChecked) sortByTotalOrders();
    else setNegativeItemList([...negative]);

    setToggleButtonChecked(event.target.checked);
  };

  React.useEffect(() => {
    setNegativeItemList([...negative]);
  }, []);

  const sortByTotalOrders = () => {

    console.log("sortByTotalOrders before", negativeItemList);
    const sorted = negativeItemList.sort((a, b) => {
      return b.item_sales - a.item_sales;
    });
    setNegativeItemList(sorted);
    console.log("sortByTotalOrders after", sorted);
  };

  const ratings = Object.keys(ordersPerRating).map((key) => {
    let rating = key.split("_")[0];
    let obj = {};
    obj[rating] = ordersPerRating[key];
    return obj;
  });
  console.log(
    negative,
    ordersPerRating,
    value,
    totalRatings,
    "-----------------"
  );
  // console.log(ratings, "ratings");
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
          {negativeItemList.length > 0 && (
            <div
              className="customer_review__sub-heading--text"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>
                Major Complains By Customer In
                <br />
                {resultType}
              </span>
              <span className="">
                {" "}
                <Switch
                  checked={toggleButtonChecked}
                  onChange={handleToggleButtonChange}
                  inputProps={{ "aria-label": "controlled" }}
                />
                <br />
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: "500",
                  }}
                >
                  Sort By Sales
                </span>
              </span>
            </div>
          )}
        </div>
        <div className="negative-reviews">
          {negativeItemList.length > 0
            ? negative.map((item, index) => {
                const {
                  item_name,
                  issues,
                  item_total_order,
                  item_total_reviewed,
                  item_total_rated,
                  item_sales,
                } = item;
                return (
                  <NegativeReviewCard
                    key={index}
                    name={item_name}
                    issues={issues}
                    totalOrders={item_total_order}
                    totalReviewed={item_total_reviewed}
                    totalRated={item_total_rated}
                    sales={item_sales}
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
