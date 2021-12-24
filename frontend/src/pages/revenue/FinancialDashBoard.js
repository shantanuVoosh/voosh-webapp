import React from "react";
import GrayCard from "../../components/revenue/GrayCard";
import WhiteCard from "../../components/revenue/WhiteCard";
import SectionButtons from "../../components/SectionButtons";
import { Doughnut } from "react-chartjs-2";
import { useSelector } from "react-redux";
import ColorList from "../../components/revenue/ColorList";
const thisPageResulyType = "prev month";

const FinancialDashBoard = () => {
  const { data, currentProductIndex } = useSelector((state) => state.data);
  const resultType = useSelector((state) => state.data.resultType);
  const revenue = data[currentProductIndex]["revenue"];
  const [showModal, setShowModal] = React.useState(false);
  const {
    monthlyResult: revenueMonthlyResult,
    weeklyResult: revenueWeeklyResult,
  } = revenue;


  const financicalData = revenue["financicalData"];
  const { totalSales, cancelledOrders, netPayout, deleveries, deductions } =
    financicalData;

  const deductionTitles = Object.keys(deductions);
  const deductionValues = deductionTitles.map((item) => deductions[item]);

  console.log("deductionTitles =>", deductionTitles);

  let revenueResult="Coming Soon!!!";

  if (resultType === "week") {
    revenueResult = revenueWeeklyResult;

  } else {
    revenueResult = revenueMonthlyResult;
    
  }

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
        data: totalSales!=="working on it"? [...deductionValues]:[1,2,3,2,1,1.5],
        // borderColor: ["rgba(255,21,86,0.2)"],
        backgroundColor: [...pieColors],
        pointBackgroundColor: "rgba(255,26,86,0.2)",
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
            // value={resultType===thisPageResulyType?listingScoreMain:"Coming soon!!"}
            value={revenueResult}
            info={"Total Sales includes all taxes"}
            //   monthlyResult={monthlyResult}
            //   weeklyResult={weeklyResult}
            benchmark={"103847.68"}
            //   compareThen={"less"}
            color={"#27AE60"}
            // color={"#262D30"}
          />
          <WhiteCard
            //   key={index}
            name={"Net Deduction"}
            type={"Pecentage"}
            value={"working on it"}
            info={"Total Sales includes all taxes"}
            //   monthlyResult={monthlyResult}
            //   weeklyResult={weeklyResult}
            benchmark={"103847.68"}
            //   compareThen={"less"}
            color={"#f05a48"}
            // color={"#262D30"}
          />
          <WhiteCard
            //   key={index}
            name={"Total Payout"}
            type={"Pecentage"}
            value={"working on it"}
            info={"Total Sales includes all taxes"}
            //   monthlyResult={monthlyResult}
            //   weeklyResult={weeklyResult}
            benchmark={"103847.68"}
            //   compareThen={"less"}
            color={"#27AE60"}
            // color={"#262D30"}
          />
        </div>
        <div className="financial-breakdown">
          <div className="financial-breakdown__heading">Channel Breakdown</div>
          <SectionButtons />
          {/* //? Swiggy or Zomato, Cards */}
          <div className="financial-breakdown__cards">
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
