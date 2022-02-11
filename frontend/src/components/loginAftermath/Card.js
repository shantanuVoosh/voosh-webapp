import React from "react";
import { BsBagCheck, BsBarChartLine } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import SectionButtons from "../SectionButtons";
import { useSelector, useDispatch } from "react-redux";
import CardStatistics from "./CardStatistics";
import moment from "moment";

const Card = ({ iconName, name, info, cardStatistics }) => {
  const navigate = useNavigate();
  const { data, resultType, startDate, endDate } = useSelector(
    (state) => state.data
  );
  const buttons = data.map((item) => item.name);
  const navBtnRef = data.map((_, index) => React.createRef(null));

  // ! Defaults index is 0
  const [Navindex, setNavindex] = React.useState(0);
  const currentProductData = data[Navindex];

  console.log(
    currentProductData,
    "currentProductData-----------------------------"
  );

  const {
    operationHealth: { operationHealthMain, operationHealthData },
    listingScore: { listingScoreMain, listingScoreData },
    revenue_score: { revenue_score },
    previousMonthRevenue: {
      previousDayRevenue,
      financicalData: { totalSales },
    },
  } = currentProductData;

  // Todo: testing

  const startOfMonth = moment()
    .clone()
    .subtract(1, "months")
    .startOf("month")
    .format("YYYY-MM-DD");
  const endOfMonth = moment()
    .clone()
    .subtract(1, "months")
    .endOf("month")
    .format("YYYY-MM-DD");

  const handelClick = () => {
    // Removing white space, and first letter in smaller case
    // Operation Metrics --> operationMetrics
    let pageName;
    pageName = name.replaceAll(" ", "");
    pageName = pageName.charAt(0).toLowerCase() + pageName.slice(1);
    navigate(`/${pageName}`);
  };

  const handelChange = (index) => {
    console.log("handelChange Pending");
    setNavindex(index);
  };

  return (
    <>
      <div className="home-card">
        <div className="home-card-left">
          {iconName === "bag" ? (
            <BsBagCheck className="home-card-left__icon" size={25} />
          ) : null}
          {iconName === "bar" ? (
            <BsBarChartLine className="home-card-left__icon" size={25} />
          ) : null}
          <div className="home-card-left__text">
            <h4 className="home-card-left__text--heading">
              {name === "Revenue" ? "Sales" : name}
            </h4>
            <p className="home-card-left__text--info">{info}</p>
          </div>
          <span
            onClick={handelClick}
            className="home-card-left--btn screen-btn"
          >
            See Details
          </span>
        </div>
        {/* //? right side */}
        <div className="home-card-right">
          <div className="nav-btns">
            {buttons.map((button, index) => (
              <span
                key={index}
                ref={navBtnRef[index]}
                className={"btn" + (index === Navindex ? " active" : "")}
                onClick={(e) => handelChange(index)}
                disabled={index !== 0}
              >
                {button}
              </span>
            ))}
          </div>
          {/* //! Revenue */}
          {name === "Revenue" && (
            <CardStatistics
              cardStatistics={{
                // Todo: temp solution for Prev Month Revenue
                // ! if prev month is null then show 0
                value:
                  resultType === "Custom Range"
                    ? startOfMonth === startDate && endOfMonth === endDate
                      ? totalSales
                      : revenue_score
                    : resultType === "Previous Month"
                    ? totalSales
                    : revenue_score,
                change: null,
                benchmark: null,
                changeTypeDirection: "up",
                type: "money",
                isDataPresent:
                  (resultType === "Custom Range"
                    ? startOfMonth === startDate && endOfMonth === endDate
                      ? totalSales
                      : revenue_score
                    : resultType === "Previous Month"
                    ? totalSales
                    : revenue_score) !== undefined,
              }}
            />
          )}
          {/* //! Operation Health */}
          {name === "Operation Health" && (
            <CardStatistics
              cardStatistics={{
                value: operationHealthMain.value,
                benchmark: operationHealthMain.benchmark,
                type: operationHealthMain.type,
                changeTypeDirection: !operationHealthMain.isDataPresent
                  ? "up"
                  : operationHealthMain.value >= operationHealthMain.benchmark
                  ? "up"
                  : "down",
                change: operationHealthMain.benchmark,
                isDataPresent: operationHealthMain.isDataPresent,
              }}
            />
          )}
          {/* //! Listing Score */}
          {name === "Listing Score" && (
            <CardStatistics
              cardStatistics={{
                value: listingScoreMain.value,
                benchmark: listingScoreMain.benchmark,
                type: listingScoreMain.type,
                changeTypeDirection: !listingScoreMain.isDataPresent
                  ? "up"
                  : listingScoreMain.value >= listingScoreMain.benchmark
                  ? "up"
                  : "down",
                // changeTypeDirection: listingScoreMain - 90 > 0 ? "up" : "down",
                change: listingScoreMain.benchmark,
                isDataPresent: listingScoreMain.isDataPresent,
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Card;
