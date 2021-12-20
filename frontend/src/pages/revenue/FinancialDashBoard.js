import React from "react";
import GrayCard from "../../components/revenue/GrayCard";
import WhiteCard from "../../components/revenue/WhiteCard";
import SectionButtons from "../../components/SectionButtons";
import { Doughnut } from "react-chartjs-2";
import { useSelector } from "react-redux";
import ColorList from "../../components/revenue/ColorList";

const FinancialDashBoard = () => {
  const { data, currentProductIndex } = useSelector((state) => state.data);
  const revenue = data[currentProductIndex]["revenue"];
  const financicalData = revenue["financicalData"];
  console.log("financicalData", financicalData);
  const totalSales = financicalData["totalSales"];
  const cancelledOrders = financicalData["cancelledOrders"];
  const netPayout = financicalData["netPayout"];
  const deleveries = financicalData["deleveries"];
  const deductions = financicalData["deductions"];

  const deductionTitles = Object.keys(deductions);
  const deductionValues = deductionTitles.map((item) => deductions[item]);
  console.log("deductionTitles", deductionTitles);
  console.log("deductionValues", deductionValues);

  const pieColors = [
    "#2A327D",
    "#FE645A",
    "#00C689",
    "#FFB039",
    "#FFCA00",
    "#FFA20F",
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
        
        data: [...deductionValues],
        borderColor: ["rgba(255,206,86,0.2)"],
        backgroundColor: [...pieColors],
        pointBackgroundColor: "rgba(255,206,86,0.2)",
      },
    ],
  };
  return (
    <>
      <div className="financial">
        {/* //? Orange, White cards */}
        <div className="cards financial-cards">
          <WhiteCard
            //   key={index}
            name={"Total Sales"}
            type={"Pecentage"}
            value={"coming soon"}
            info={"Total Sales includes all taxes"}
            //   monthlyResult={monthlyResult}
            //   weeklyResult={weeklyResult}
            benchmark={"103847.68"}
            //   compareThen={"less"}
            color={"#27AE60"}
          />
          <WhiteCard
            //   key={index}
            name={"Deduction"}
            type={"Pecentage"}
            value={"coming soon"}
            info={"Total Sales includes all taxes"}
            //   monthlyResult={monthlyResult}
            //   weeklyResult={weeklyResult}
            benchmark={"103847.68"}
            //   compareThen={"less"}
            color={"#f05a48"}
          />
          <WhiteCard
            //   key={index}
            name={"Total Payout"}
            type={"Pecentage"}
            value={"coming soon"}
            info={"Total Sales includes all taxes"}
            //   monthlyResult={monthlyResult}
            //   weeklyResult={weeklyResult}
            benchmark={"103847.68"}
            //   compareThen={"less"}
            color={"#27AE60"}
          />
        </div>
        <div className="financial-breakdown">
          <div className="financial-breakdown__heading">
            Channel Financial Breakdown
          </div>
          <SectionButtons />
          {/* //? Swiggy or Zomato, Cards */}
          <div className="financial-breakdown__cards">
            <GrayCard
              name={"Delivery Order(s)"}
              type={"money"}
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
          <div className="financial-breakdown__graph">
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
