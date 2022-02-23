import React from "react";
import { BsBagCheck, BsBarChartLine } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import SectionButtons from "../SectionButtons";
import { useSelector, useDispatch } from "react-redux";
import CardStatistics from "./CardStatistics";
import moment from "moment";
import {
  setCurrentProductIndex,
  setOhProductIndex,
  setLSProductIndex,
  setSalesProductIndex,
} from "../../redux/Data/actions/actions";

const Card = ({ iconName, name, info, sectionName }) => {
  const navigate = useNavigate();
  const {
    data,
    resultType,
    oh_currentProductIndex,
    ls_currentProductIndex,
    sales_currentProductIndex,
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
  }, [
    sectionName,
    oh_currentProductIndex,
    ls_currentProductIndex,
    sales_currentProductIndex,
  ]);

  const {
    operationHealth: { operationHealthMain },
    listingScore: { listingScoreMain },
    revenue_score: { revenue_score, isDataPresent: isRevenueScorePresent },
    previousMonthRevenue: {
      financialData: { totalSales },
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
    let pageName;
    pageName = name.replaceAll(" ", "");
    pageName = pageName.charAt(0).toLowerCase() + pageName.slice(1);
    navigate(`/${pageName}`);
  };

  const handelChange = (index) => {
    console.log("handelChange Pending");
    console.log(sectionName, "sectionName");

    if (sectionName === "Operation Health") {
      dispatch(setOhProductIndex(index));
    }
    // ! LS
    else if (sectionName === "Listing Score") {
      dispatch(setLSProductIndex(index));
    }
    // ! Sales
    else if (sectionName === "Sales") {
      dispatch(setSalesProductIndex(index));
    }
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
          <div
            className="nav-btns"
            style={{
              padding: 0,
              marginTop: 0,
              // margin: 0,
            }}
          >
            {buttons.map((button, index) => (
              <span
                key={index}
                ref={navBtnRef[index]}
                className={
                  index === 0 && swiggy_res_id_inside_state === null
                    ? "nav-btn nav-btn-disable"
                    : index === 1 && zomato_res_id_inside_state === null
                    ? "nav-btn nav-btn-disable"
                    : (index === Navindex ? " active" : "") + " nav-btn"
                }
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
                // Todo: this should be use, if we dont use any break fix 😎
                // isDataPresent: isRevenueScorePresent,

                // ! Temp Fix cuz data is not present 😞
                isDataPresent:
                  resultType !== "Previous Month" &&
                  resultType !== "Custom Range"
                    ? isRevenueScorePresent
                    : (resultType === "Custom Range"
                        ? startOfMonth === startDate && endOfMonth === endDate
                          ? totalSales
                          : revenue_score
                        : resultType === "Previous Month"
                        ? totalSales
                        : revenue_score) !== undefined &&
                      (resultType === "Custom Range"
                        ? startOfMonth === startDate && endOfMonth === endDate
                          ? totalSales
                          : revenue_score
                        : resultType === "Previous Month"
                        ? totalSales
                        : revenue_score) !== 0
                    ? true
                    : false,
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
