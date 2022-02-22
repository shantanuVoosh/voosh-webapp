import React from "react";
import GrayCard from "../../components/revenue/GrayCard_A";
import WhiteCard from "../../components/revenue/WhiteCard_A";
import SectionButtons from "../../components/SectionButtons";
import { Doughnut } from "react-chartjs-2";
import { useSelector } from "react-redux";
import ColorList from "../../components/revenue/ColorList";
import ScrollButton from "../../components/ScrollButton";

import moment from "moment";

const FinancialDashBoard = () => {
  const { data, sales_currentProductIndex, startDate, endDate } = useSelector(
    (state) => state.data
  );
  const { resultType } = useSelector((state) => state.data);
  const revenue = data[sales_currentProductIndex]["revenue"];
  const customDate = moment(new Date())
    .add(-1, "months")
    .add(-10, "days")
    .format("MMMM'YY");
  // ? this value is not constant
  const { revenue_score, isDataPresent: isRevenueScorePresent } =
    data[sales_currentProductIndex]["revenue_score"];
  const {
    previousDayRevenue: {
      previousDayRevenue,
      isDataPresent: isPreviousDayRevenuePresent,
    },
    financialData: {
      isDataPresent,
      totalSales,
      cancelledOrders,
      netPayout,
      deleveries,
      deductions,
    },
  } = data[sales_currentProductIndex]["previousMonthRevenue"];

  console.log(
    `index ${sales_currentProductIndex} data: `,
    data[sales_currentProductIndex]["previousMonthRevenue"]
  );

  const deductionTitles = Object.keys(deductions);
  const deductionValues = deductionTitles.map((item) => deductions[item]);

  console.log("deductionTitles =>", deductionTitles);

  console.log("prev day revenue =>", previousDayRevenue);

  let finalRevenue =
    resultType !== "Previous Day" ? revenue_score : previousDayRevenue;

  finalRevenue =
    finalRevenue === undefined || finalRevenue === null ? 0 : finalRevenue;

  const pieColors = [
    "#370665",
    "#FE645A",
    "#C84B31",
    "#2A327D",
    "#00C689",
    "#FC9918",
    "#F14A16",
    "#35589A",
    "#9145B6",
    "#FABB51",
    "#FFBD35",
  ];
  const options = {
    plugins: {
      legend: {
        display: true,
        position: "top",
        // position: 'bottom',
      },
      title: {
        display: true,
        text: "Deductions",
        color: "black",
        font: {
          size: 14,
        },
        padding: {
          top: 30,
          bottom: 30,
        },
        responsive: true,
        animation: {
          animateScale: true,
        },
      },
    },
  };
  const pie_data = {
    labels: [...deductionTitles],
    datasets: [
      {
        data:
          isDataPresent === true ? [...deductionValues] : [1, 2, 3, 2, 1, 1.5],
        // borderColor: ["rgba(255,21,86,0.2)"],
        backgroundColor: [...pieColors],
        pointBackgroundColor: "rgba(255,26,86,0.2)",
      },
    ],
  };

  // Todo: Test Again
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

  return (
    <>
      {/* //! use for only prev month */}
      <div className="financial_a">
        <SectionButtons sectionName={"Sales"} isSalesPage={true} />
        {/* //? Orange, White cards */}
        <div className="financial_a-cards">
          <WhiteCard
            // name={"Total Sales"}
            name={`${
              sales_currentProductIndex === 0 ? "Swiggy Sales" : "Zomato Sales"
            }`}
            type={"Pecentage"}
            // value={resultType === "Previous Month" ? totalSales : finalRevenue}
            value={
              resultType === "Custom Range"
                ? startOfMonth === startDate && endOfMonth === endDate
                  ? totalSales
                  : finalRevenue
                : resultType === "Previous Month"
                ? totalSales
                : finalRevenue
            }
            info={"Total Sales includes all taxes"}
            color={"#27AE60"}
            // Todo: this should be use, if we dont use any break fix 😎
            // isDataPresent={isRevenueScorePresent}
            // ! Temp Fix cuz data is not present 😞
            isDataPresent={
              resultType === "Previous Day"
                ? isPreviousDayRevenuePresent
                : resultType !== "Previous Month" &&
                  resultType !== "Custom Range" &&
                  resultType !== "Previous Day"
                ? isRevenueScorePresent
                : (resultType === "Custom Range"
                    ? startOfMonth === startDate && endOfMonth === endDate
                      ? totalSales
                      : finalRevenue
                    : resultType === "Previous Month"
                    ? totalSales
                    : finalRevenue) !== undefined &&
                  (resultType === "Custom Range"
                    ? startOfMonth === startDate && endOfMonth === endDate
                      ? totalSales
                      : finalRevenue
                    : resultType === "Previous Month"
                    ? totalSales
                    : finalRevenue) !== 0
                ? true
                : false
            }
          />
          <WhiteCard
            name={"Total Payout"}
            type={"Pecentage"}
            value={netPayout}
            info={"Total Sales includes all taxes"}
            color={"#27AE60"}
            isDataPresent={isDataPresent}
          />
          <WhiteCard
            name={"Net Deduction"}
            type={"Pecentage"}
            value={totalSales - netPayout}
            info={"Total Sales includes all taxes"}
            color={"#f05a48"}
            isDataPresent={isDataPresent}
          />
        </div>
        <div
          className="show-more-btn"
          style={{
            display:
              !isDataPresent && sales_currentProductIndex === 0 ? "" : "none",
            height: "160px",
            gridColumn: "span 2",
            flexDirection: "row",
            marginTop: "10px",
            textAlign: "center",
            color: !isDataPresent ? "#FFF" : "",
          }}
          // onClick={() => showDetails()}
        >
          <b
            style={{
              fontWeight: "700",
            }}
          >
            Your detailed financial deductions will be calculated on 10th Next
            month. In the meantime, feel free to use our manual service.
          </b>
          <div className="">
            In the meantime, explore our free financial
            <span> consultation service</span>
          </div>
        </div>

        <div
          className="financial_a-breakdown"
          style={
            {
              // display: isDataPresent ? "" : "none",
            }
          }
        >
          <div className="financial_a-breakdown__heading">
            <h5 className="text">Channel Breakdown</h5>
            <div className="date">{customDate}</div>
          </div>
          {/* <SectionButtons sectionName={"Sales"} /> */}
          {/* //? Swiggy or Zomato, Cards */}
          <div className="financial_a-breakdown__cards">
            <GrayCard
              name={"Delivery Order(s)"}
              type={"number"}
              value={deleveries}
              info={"Total Order successfuly delivered by Swiggy"}
              color={"#27AE60"}
              isDataPresent={
                sales_currentProductIndex !== 1 ? isDataPresent : false
              }
            />
            <GrayCard
              name={"Cancelled Orders"}
              type={"number"}
              value={cancelledOrders}
              info={"Total Order cancelled by Merchant"}
              color={"#f05a48"}
              isDataPresent={isDataPresent}
            />
            <GrayCard
              name={"Total Sales"}
              type={"money"}
              value={totalSales}
              info={"Including of GST lability of Merchant"}
              color={"#262D30"}
              isDataPresent={isDataPresent}
            />
            <GrayCard
              name={"Net Payout"}
              type={"money"}
              value={netPayout}
              info={
                "Inclusive of TDS TCS Platform Charges & deductions from breakdown"
              }
              color={"#27AE60"}
              isDataPresent={isDataPresent}
            />
          </div>
          <div className="financial_a-breakdown__graph">
            {console.log(
              isDataPresent,
              isDataPresent === false,
              "isDataPresent"
            )}
            <div
              className={`graph-pie ${
                isDataPresent === false ? "no-graph" : ""
              }`}
            >
              <Doughnut data={pie_data} options={options} />
            </div>
            <div className="graph-list">
              {/* //! All deduction */}
              {deductionTitles.map((item, index) => {
                const name = item;
                const value = deductionValues[index];
                return (
                  <ColorList
                    key={index}
                    name={name}
                    value={Math.abs(value)}
                    color={pieColors[index]}
                    isDataPresent={isDataPresent}
                  />
                );
              })}
            </div>
          </div>
        </div>
        <div className="">
          <ScrollButton />
        </div>
      </div>
    </>
  );
};

export default FinancialDashBoard;
