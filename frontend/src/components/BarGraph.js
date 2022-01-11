import React from "react";
import { useSelector } from "react-redux";
import { Line, Bar } from "react-chartjs-2";
const BarGraph = ({ compareThen, value, benchmark }) => {
  const resultType = useSelector((state) => state.data.resultType);

  const compare =
    compareThen === "grater" ? value >= benchmark : value <= benchmark;
  const colorOfBar = compare ? "#27AE60" : "#f05a48";

  const options = {
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        display: true,
        color: "black",
        align: "end",
        padding: {
          right: 2
        },
        labels: {
          padding: { top: 10 },
          title: {
            font: {
              weight: "bold"
            }
          },
          value: {
            color: "green"
          }
        },
        formatter: function (value) {
          return "\n" + value;
        }
      }
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
        data: [value, benchmark],
        // label: "",
        backgroundColor: [`${colorOfBar}`, "#2A327D"],
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

export default BarGraph;
