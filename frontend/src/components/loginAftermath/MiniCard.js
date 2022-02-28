import React from "react";
import { AiOutlineRise, AiOutlineFall } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { VscPreview } from "react-icons/vsc";

import {
  setLSProductIndex,
  setCustomerReviewsProductIndex,
  setOhProductIndex,
} from "../../redux/Data/actions/actions";

const MiniCard = ({ name, info, sectionName }) => {
  const navigate = useNavigate();
  const {
    data,
    oh_currentProductIndex,
    ls_currentProductIndex,

    swiggy_res_id: swiggy_res_id_inside_state,
    zomato_res_id: zomato_res_id_inside_state,
  } = useSelector((state) => state.data);

  const dispatch = useDispatch();
  const buttons = data.map((item) => item.name);
  const navBtnRef = data.map((_, index) => React.createRef(null));

  // ! Defaults index is 0
  const [Navindex, setNavindex] = React.useState(0);
  const currentProductData = data[Navindex];

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
  }, [sectionName, oh_currentProductIndex, ls_currentProductIndex]);

  const {
    listingScore: {
      listingScoreMain: {
        value: listingScoreValue,
        benchmark: listingScoreBenchmark,
        isDataPresent: listingScoreIsDataPresent,
      },
    },
    operationHealth: {
      operationHealthMain: {
        value: operationHealthValue,
        benchmark: operationHealthBenchmark,
        isDataPresent: isOperationHealthDataPresent,
      },
    },
  } = currentProductData;

  const handelClick = () => {
    let pageName;
    pageName = name.replaceAll(" ", "");
    pageName = pageName.charAt(0).toLowerCase() + pageName.slice(1);
    navigate(`/${pageName}`);
  };

  const handelChange = (index) => {
    // ! "Operation Health"
    if (sectionName === "Operation Health") {
      dispatch(setOhProductIndex(index));
    }
    // ! LS
    else if (sectionName === "Listing Score") {
      dispatch(setLSProductIndex(index));
    }
  };

  // Todo: not used
  const ValueContainer = ({ value, benchmark, isDataPresent }) => {
    if (!isDataPresent) {
      return (
        <div className="mini-card__body">
          <div className="mini-card__body--score">
            <div className="green">Working on it..</div>
          </div>
        </div>
      );
    }

    return (
      <div className="mini-card__body">
        <div className="mini-card__body--score">
          {value > benchmark ? (
            <div className="green">
              <span>
                <AiOutlineRise />
              </span>
              <span> {value.toFixed(2)}%</span>
            </div>
          ) : (
            <div className="red">
              <span>
                <AiOutlineFall />
              </span>
              <span> {value.toFixed(2)}%</span>
            </div>
          )}
        </div>
      </div>
    );
  };

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
            {isOperationHealthDataPresent && name === "Operation Health" && (
              <>
                {operationHealthValue > operationHealthBenchmark ? (
                  <div className="green">
                    <span>
                      <AiOutlineRise />
                    </span>
                    <span> {operationHealthValue.toFixed(1)}%</span>
                  </div>
                ) : (
                  <div className="red">
                    <span>
                      <AiOutlineFall />
                    </span>
                    <span> {operationHealthValue.toFixed(1)}%</span>
                  </div>
                )}
              </>
            )}
            {!isOperationHealthDataPresent && name === "Operation Health" && (
              <div className="mini-card__body--score">
                <div className="green">Working on it..</div>
              </div>
            )}
            {listingScoreIsDataPresent && name === "Listing Score" && (
              <>
                {listingScoreValue > listingScoreBenchmark ? (
                  <div className="green">
                    <span>
                      <AiOutlineRise />
                    </span>
                    <span> {listingScoreValue.toFixed(1)}%</span>
                  </div>
                ) : (
                  <div className="red">
                    <span>
                      <AiOutlineFall />
                    </span>
                    <span> {listingScoreValue.toFixed(1)}%</span>
                  </div>
                )}
              </>
            )}
            {!listingScoreIsDataPresent && name === "Listing Score" && (
              <div className="mini-card__body--score">
                <div className="green">Working on it..</div>
              </div>
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
