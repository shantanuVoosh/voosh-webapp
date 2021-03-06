import React from "react";
import GrayCard from "../../components/revenue/GrayCard";
import WhiteCard from "../../components/revenue/WhiteCard_B";
import SectionButtons from "../../components/SectionButtons";
import { Doughnut } from "react-chartjs-2";
import { useSelector } from "react-redux";
import ColorList from "../../components/revenue/ColorList";
import axios from "axios";
import moment from "moment";

const FinancialDashBoard = () => {
  const [showMoreContent, setShowMoreContent] = React.useState(false);
  const { data, currentProductIndex } = useSelector((state) => state.data);
  const { resultType } = useSelector((state) => state.data);
  const revenue = data[currentProductIndex]["revenue"];
  const customDate = moment(new Date())
    .add(-1, "months")
    .add(-10, "days")
    .format("MMMM'YY");
  // ? this value is not constant
  const { revenue_score } = data[currentProductIndex]["revenue_score"];
  const {
    previousDayRevenue,
    financicalData: {
      isDataPresent,
      totalSales,
      cancelledOrders,
      netPayout,
      deleveries,
      deductions,
    },
  } = data[currentProductIndex]["previousMonthRevenue"];

  const deductionTitles = Object.keys(deductions);
  const deductionValues = deductionTitles.map((item) => deductions[item]);

  console.log("deductionTitles =>", deductionTitles);

  console.log("revenue =>", previousDayRevenue);

  const finalRevenue =
    resultType !== "Previous Day" ? revenue_score : previousDayRevenue;

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
        // position: 'right',
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
          totalSales !== "working on it"
            ? [...deductionValues]
            : [1, 2, 3, 2, 1, 1.5],
        // borderColor: ["rgba(255,21,86,0.2)"],
        backgroundColor: [...pieColors],
        pointBackgroundColor: "rgba(255,26,86,0.2)",
      },
    ],
  };

  const showDetails = () => {
    setShowMoreContent((prev) => !prev);
  };

  return (
    <>
      <div className="financial_b">
        {/* //? Orange, White cards */}
        <div className="financial_b-cards">
          <WhiteCard
            // ? Always show the total sales
            showMoreContent={true}
            name={"Total Sales"}
            type={"Pecentage"}
            value={finalRevenue}
            info={"Total Sales includes all taxes"}
            benchmark={"103847.68"}
            color={"#27AE60"}
            // color={"#262D30"}
          />
          <WhiteCard
            showMoreContent={showMoreContent}
            name={"Total Payout"}
            type={"Pecentage"}
            value={"working on it"}
            info={"Total Sales includes all taxes"}
            benchmark={"103847.68"}
            color={"#27AE60"}
            // color={"#262D30"}
          />
          <WhiteCard
            showMoreContent={showMoreContent}
            name={"Net Deduction"}
            type={"Pecentage"}
            value={"working on it"}
            info={"Total Sales includes all taxes"}
            benchmark={"103847.68"}
            color={"#f05a48"}
            // color={"#262D30"}
          />
        </div>
        <div
          className="show-more-btn"
          style={{
            gridColumn: "span 2",
            flexDirection: "row",
            textDecoration: "underline",
            fontWeight: "700",
            marginTop: showMoreContent ? "40px" : "10px",
            textAlign: "center",
            color: showMoreContent ? "#FFA20F" : "",
          }}
          onClick={() => showDetails()}
        >
          {`${
            showMoreContent ? "Hide" : "Show"
          } Previous Month Revenue Details`}
        </div>
        <div
          className="financial_b-breakdown"
          style={{ display: showMoreContent ? "" : "none" }}
        >
          <div className="financial_b-breakdown__heading">
            Channel Breakdown
          </div>
          <SectionButtons />
          {/* //? Swiggy or Zomato, Cards */}
          <div className="financial_b-breakdown__cards">
            <GrayCard
              name={"Delivery Order(s)"}
              type={"number"}
              value={deleveries}
              info={"Total Order successfuly delivered by Swiggy"}
              color={"#27AE60"}
            />
            <GrayCard
              name={"Cancelled Orders"}
              type={"number"}
              value={cancelledOrders}
              info={"Total Order cancelled by Merchant"}
              color={"#f05a48"}
            />
            <GrayCard
              name={"Total Sales"}
              type={"money"}
              value={totalSales}
              info={"Including of GST lability of Merchant"}
              color={"#262D30"}
            />
            <GrayCard
              name={"Net Payout"}
              type={"money"}
              value={netPayout}
              info={
                "Inclusive of TDS TCS Platform Charges & deductions from breakdown"
              }
              color={"#27AE60"}
            />
          </div>
          <div className="financial_b-breakdown__graph">
            <div className="graph-pie">
              <Doughnut data={pie_data} options={options} />
            </div>
            <div className="graph-list">
              {/* //? Single Item of deduction */}
              {deductionTitles.map((item, index) => {
                const name = item;
                const value = deductionValues[index];
                return (
                  <ColorList
                    key={index}
                    name={name}
                    value={value}
                    color={pieColors[index]}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FinancialDashBoard;
