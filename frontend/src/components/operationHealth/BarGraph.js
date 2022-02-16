import React from "react";
import { useSelector } from "react-redux";
import { Line, Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
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
    },

    scales: {
      min: 3.5,
      max: 5,
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false,
          display: false,
        },
        tick: {},
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
        datalabels: {
          color: "black",
          anchor: "end",
          align: "top",
          offset: -2.6,
        },
      },
    ],
  };

  return (
    <div className="bar-graph">
      <Bar
        className="bar"
        plugins={[ChartDataLabels]}
        data={barData}
        options={options}
      />
    </div>
  );
};

export default BarGraph;
