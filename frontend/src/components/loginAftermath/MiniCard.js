import React from "react";
import { AiOutlineRise, AiOutlineFall } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { VscPreview } from "react-icons/vsc";

import {
  setLSProductIndex,
  setCustomerReviewsProductIndex,
} from "../../redux/Data/actions/actions";

const MiniCard = ({ name, info, sectionName }) => {
  const navigate = useNavigate();
  const {
    data,
    oh_currentProductIndex,
    ls_currentProductIndex,
    sales_currentProductIndex,
    customer_reviews_currentProductIndex,
    startDate,
    endDate,
    swiggy_res_id: swiggy_res_id_inside_state,
    zomato_res_id: zomato_res_id_inside_state,
  } = useSelector((state) => state.data);

  const dispatch = useDispatch();
  const buttons = data.map((item) => item.name);
  const navBtnRef = data.map((_, index) => React.createRef(null));

  // ! Defaults index is 0
  const [Navindex, setNavindex] = React.useState(0);
  const currentProductData = data[Navindex];

  console.log(
    currentProductData,
    "currentProductData-----------------------------"
  );

  React.useEffect(() => {
    console.log(sectionName, "sectionName");
    // ?for the first time
    // ! OH
    if (sectionName === "Operation Health") {
      setNavindex(oh_currentProductIndex);
    }
    // ! LS
    else if (sectionName === "Listing Score") {
      setNavindex(ls_currentProductIndex);
    }
    // ! Sales
    else if (sectionName === "Sales") {
      setNavindex(sales_currentProductIndex);
    }
    // ! Customer Reviews
    else if (sectionName === "Customer Reviews") {
      setNavindex(customer_reviews_currentProductIndex);
    }
  }, [
    sectionName,
    oh_currentProductIndex,
    ls_currentProductIndex,
    sales_currentProductIndex,
    customer_reviews_currentProductIndex,
  ]);

  const {
    listingScore: {
      listingScoreMain: {
        value: listingScoreValue,
        benchmark: listingScoreBenchmark,
      },
    },
    customerReviews: {
      value: customerReviewsRating,
      benchmark: customerReviewsRatingBenchmark,
    },
  } = currentProductData;

  const handelClick = () => {
    let pageName;
    pageName = name.replaceAll(" ", "");
    pageName = pageName.charAt(0).toLowerCase() + pageName.slice(1);
    navigate(`/${pageName}`);
  };

  const handelChange = (index) => {
    // console.log("handelChange Pending");
    // console.log(sectionName, "sectionName");

    // ! Customer Reviews
    if (sectionName === "Customer Reviews") {
      dispatch(setCustomerReviewsProductIndex(index));
    }
    // ! LS
    else if (sectionName === "Listing Score") {
      dispatch(setLSProductIndex(index));
    }
  };

  const isCustomerReviewsPresent =
    customerReviewsRating !== 0 &&
    customerReviewsRating !== undefined &&
    customerReviewsRating !== null;

  return (
    <>
      <div className="mini-card">
        <div className="mini-card__header">
          <h4 className="mini-card__header--heading">{name}</h4>
        </div>
        <div
          className="nav-toggle-btns"
          style={
            {
              // display: "none",
            }
          }
        >
          <div className="nav-btns">
            {buttons.map((button, index) => (
              <span
                key={index}
                ref={navBtnRef[index]}
                className={
                  index === 0 && swiggy_res_id_inside_state === null
                    ? "nav-btn-small nav-btn-small-disable"
                    : index === 1 && zomato_res_id_inside_state === null
                    ? "nav-btn-small nav-btn-small-disable"
                    : (index === Navindex ? " active" : "") + " nav-btn-small"
                }
                style={{
                  fontSize: "10px",
                }}
                onClick={(e) => {
                  if (
                    (index === 0 && swiggy_res_id_inside_state === null) ||
                    (index === 1 && zomato_res_id_inside_state === null)
                  ) {
                    return;
                  }
                  console.log("click index", index);

                  handelChange(index);
                }}
              >
                {button}
              </span>
            ))}
          </div>
        </div>
        <div className="mini-card__body">
          <div className="mini-card__body--score">
            {name === "Customer Reviews" && isCustomerReviewsPresent && (
              <>
                {customerReviewsRating > customerReviewsRatingBenchmark ? (
                  <div className="green">
                    <span>
                      <AiOutlineRise />
                    </span>
                    <span>{customerReviewsRating}</span>
                  </div>
                ) : (
                  <div className="red">
                    <span>
                      <AiOutlineFall />
                    </span>
                    <span>{customerReviewsRating}</span>
                  </div>
                )}
              </>
            )}
            {/* {name === "Customer Reviews" && (
              <div className="green">
                <VscPreview size={30} />
              </div>
            )} */}
            {name === "Customer Reviews" && !isCustomerReviewsPresent && (
              <div
                className="green"
                style={{
                  fontSize: "10px",
                  padding: "0.5rem 0",
                  fontWeight: "700",
                  "@media (max-width: 360px)": {
                    fontSize: "15px",
                  },
                }}
              >
                {" "}
                Rating not available
              </div>
            )}
            {name === "Listing Score" && (
              <>
                {listingScoreValue > listingScoreBenchmark ? (
                  <div className="green">
                    <span>
                      <AiOutlineRise />
                    </span>
                    <span> {listingScoreValue}%</span>
                  </div>
                ) : (
                  <div className="red">
                    <span>
                      <AiOutlineFall />
                    </span>
                    <span> {listingScoreValue}%</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <div className="mini-card__footer">
          <div onClick={handelClick} className="mini-card__footer--btn">
            See Details
          </div>
        </div>
      </div>
    </>
  );
};

export default MiniCard;
