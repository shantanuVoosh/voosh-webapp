import React from "react";
import GrayCard from "../../components/revenue/GrayCard";
import WhiteCard from "../../components/revenue/WhiteCard";
import SectionButtons from "../../components/SectionButtons";
import { Doughnut } from "react-chartjs-2";

const FinancialDashBoard = () => {
  const pieColors = ["#FE645A", "#2A327D", "#00C689", "#FFB039", "#FFCA00"];
  const options = {
    plugins: {
      legend: {
        display: false,
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
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thurs", "Fri"],
    datasets: [
      {
        label: "",
        data: [25, 24, 25, 14, 5],
        borderColor: ["rgba(255,206,86,0.2)"],
        backgroundColor: [...pieColors],
        pointBackgroundColor: "rgba(255,206,86,0.2)",
      },
    ],
  };
  return (
    <>
      <div className="financial">
        <div className="cards financial-cards">
          <WhiteCard
            //   key={index}
            name={"Total Sales"}
            type={"Pecentage"}
            value={"103847.68"}
            info={"Total Sales includes all taxes"}
            //   monthlyResult={monthlyResult}
            //   weeklyResult={weeklyResult}
            benchmark={"103847.68"}
            //   compareThen={"less"}
          />
          <WhiteCard
            //   key={index}
            name={"Total Sales"}
            type={"Pecentage"}
            value={"103847.68"}
            info={"Total Sales includes all taxes"}
            //   monthlyResult={monthlyResult}
            //   weeklyResult={weeklyResult}
            benchmark={"103847.68"}
            //   compareThen={"less"}
          />
          <WhiteCard
            //   key={index}
            name={"Total Sales"}
            type={"Pecentage"}
            value={"103847.68"}
            info={"Total Sales includes all taxes"}
            //   monthlyResult={monthlyResult}
            //   weeklyResult={weeklyResult}
            benchmark={"103847.68"}
            //   compareThen={"less"}
          />
        </div>
        <div className="financial-breakdown">
          <div className="financial-breakdown__heading">
            Channel Financial Breakdown
          </div>
          <SectionButtons />
          <div className="financial-breakdown__cards">
            <GrayCard
              name={"Delivery Orders"}
              type={"Pecentage"}
              value={463}
              info={"Total Order successfuly delivered by Swiggy"}
            />
            <GrayCard
              name={"Cancelled Orders"}
              type={"Pecentage"}
              value={1}
              info={"Total Order cancelled by Merchant"}
            />
            <GrayCard
              name={"Total Sales"}
              type={"Pecentage"}
              value={95984.75}
              info={"Including of GST lability of Merchant"}
            />
            <GrayCard
              name={"TNey Pay"}
              type={"Pecentage"}
              value={103847.68}
              info={
                "Inclusive of  TDS TCS Platform Charges & deductions from breakdwn"
              }
            />
          </div>
          <div className="financial-breakdown__graph">
            <div className="graph-pie">
              <Doughnut data={data} options={options} />
            </div>
            <div className="graph-list">
              <div className="graph-list__item">
                <span className="graph-list__item--name">
                  Total commission inc taxs
                </span>
                <span className="graph-list__item--value">23456985</span>
              </div>
              <div className="graph-list__item">
                <span className="graph-list__item--name">
                  Total ad expenses
                </span>
                <span className="graph-list__item--value">4000</span>
              </div>
              <div className="graph-list__item">
                <span className="graph-list__item--name">
                  Text deduction
                </span>
                <span className="graph-list__item--value">921</span>
              </div>
              <div className="graph-list__item">
                <span className="graph-list__item--name">
                  Total commisiion incl taxes
                </span>
                <span className="graph-list__item--value">23456985</span>
              </div>
              <div className="graph-list__item">
                <span className="graph-list__item--name">
                  Total commisiion incl taxes
                </span>
                <span className="graph-list__item--value">23456985</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FinancialDashBoard;
