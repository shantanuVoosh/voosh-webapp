import React from "react";
import { useSelector } from "react-redux";
import { Line, Bar } from "react-chartjs-2";

function getRandomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const BarGrapWithNodata = ({}) => {
  const resultType = useSelector((state) => state.data.resultType);
  const colorOfBar = ["#27AE60", "#f05a48"];

  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },

    scales: {
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false,
          display: false,
        },
      },
      x: {
        beginAtZero: true,
        grid: {
          display: false,
        },
      },
    },
  };
  //
  const barData = {
    labels: [`${resultType === "week" ? "7 Days" : "Month"}`, "Target"],
    datasets: [
      {
        // ! value and benchmark will be change according to the data
        data: [100, 100],
        // label: "",
        backgroundColor: [`${colorOfBar[getRandomNumberBetween(0, 1)]}`, "#2A327D"],
        barThickness: 60,
        // fill: false,
      },
    ],
  };

  return (
    <div className="bar-graph">
      <Bar className="bar" data={barData} options={options} />
    </div>
  );
};

export default BarGrapWithNodata;
