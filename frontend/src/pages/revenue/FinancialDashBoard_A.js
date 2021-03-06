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
          totalSales !== "working on it"
            ? [...deductionValues]
            : [1, 2, 3, 2, 1, 1.5],
        // borderColor: ["rgba(255,21,86,0.2)"],
        backgroundColor: [...pieColors],
        pointBackgroundColor: "rgba(255,26,86,0.2)",
      },
    ],
  };
  return (
    <>
    {/* //! use for only prev month */}
      <div className="financial_a">
        {/* //? Orange, White cards */}
        <div className="financial_a-cards">
          <WhiteCard
            name={"Total Sales"}
            type={"Pecentage"}
            value={resultType === "Previous Month" ? totalSales : finalRevenue}
            info={"Total Sales includes all taxes"}
            color={"#27AE60"}
            // color={"#262D30"}
            isDataPresent={
             ( resultType === "Previous Month"
                ? totalSales
                : finalRevenue) === undefined
                ? false
                : true
            }
          />
          <WhiteCard
            name={"Total Payout"}
            type={"Pecentage"}
            value={netPayout}
            info={"Total Sales includes all taxes"}
            color={"#27AE60"}
            isDataPresent={true}
          />
          <WhiteCard
            name={"Net Deduction"}
            type={"Pecentage"}
            value={totalSales - netPayout}
            info={"Total Sales includes all taxes"}
            color={"#f05a48"}
            isDataPresent={true}
          />
        </div>
        <div className="financial_a-breakdown">
          <div className="financial_a-breakdown__heading">
            <h5 className="text">Channel Breakdown</h5>
            <div className="date">{customDate}</div>
          </div>
          <SectionButtons />
          {/* //? Swiggy or Zomato, Cards */}
          <div className="financial_a-breakdown__cards">
            <GrayCard
              name={"Delivery Order(s)"}
              type={"number"}
              value={deleveries}
              info={"Total Order successfuly delivered by Swiggy"}
              color={"#27AE60"}
              isDataPresent={
                deleveries !== "Please wait! We are working on It."
                  ? true
                  : false
              }
            />
            <GrayCard
              name={"Cancelled Orders"}
              type={"number"}
              value={cancelledOrders}
              info={"Total Order cancelled by Merchant"}
              color={"#f05a48"}
              isDataPresent={
                cancelledOrders !== "Please wait! We are working on It."
                  ? true
                  : false
              }
            />
            <GrayCard
              name={"Total Sales"}
              type={"money"}
              value={totalSales}
              info={"Including of GST lability of Merchant"}
              color={"#262D30"}
              isDataPresent={
                totalSales !== "Please wait! We are working on It."
                  ? true
                  : false
              }
            />
            <GrayCard
              name={"Net Payout"}
              type={"money"}
              value={netPayout}
              info={
                "Inclusive of TDS TCS Platform Charges & deductions from breakdown"
              }
              color={"#27AE60"}
              isDataPresent={
                netPayout !== "Please wait! We are working on It."
                  ? true
                  : false
              }
            />
          </div>
          <div className="financial_a-breakdown__graph">
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
                    value={Math.abs(value)}
                    color={pieColors[index]}
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
