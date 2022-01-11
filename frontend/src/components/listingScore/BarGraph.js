import React from "react";
import { useSelector } from "react-redux";
import { Line, Bar } from "react-chartjs-2";
const BarGraph = ({ name, compareThen, value, benchmark, type }) => {
  const resultType = useSelector((state) => state.data.resultType);
  console.log(
    "value:",
    value,
    "benchmark:",
    benchmark,
    "compareThen:",
    compareThen,
    "----------?"
  );
  // console.log((compareThen === "4.0"))
  let resultValue = 0;
  let resultBenchmark = 0;
  
  // ! String Working
  if (type === "string") {
    // ? Possible String Compariso
    // ! Yes No
    if (compareThen === "yes or no") {
      resultValue = value === benchmark ? 100 : 0;
      resultBenchmark = 100;
    }
    // ! String Number
    else if (benchmark === "4.0") {
      console.log("here");
      // resultValue=value===benchmark?100:0;
      // compare="equal";
      if (value.includes("<")) {
        value = value.replace("<", "");
        resultValue = parseFloat(value);
        resultBenchmark = parseFloat(benchmark);
      } else if (value.includes(">")) {
        value = value.replace(">", "");
        resultValue = parseFloat(value);
        resultBenchmark = parseFloat(benchmark);
      } else if (value.includes("=")) {
        value = value.replace("=", "");
        value = parseFloat(value);
        resultValue = parseFloat(value);
        resultBenchmark = parseFloat(benchmark);
      } else if (value.includes("to")) {
        value = value.split("to")[1];
        value = parseFloat(value);
        resultValue = parseFloat(value);
        resultBenchmark = parseFloat(benchmark);
      }
    } else if (value === "Not Applicable" || value === "Applicable") {
      resultValue = value === "Not Applicable" ? 0 : 100;
      resultBenchmark = 100;
    }
  }

  // Todo:
 else if (type === "percentage") {
    if (compareThen === "High Medium Low") {
      resultBenchmark = benchmark;
      if(name==="Number of Rating"){
        if (value === "High") {
          resultValue = 90;
        } else if (value === "Medium") {
          resultValue = 70;
        } else if (value === "Low") {
          resultValue = 50;
        }
      }else if(name==="Images"){
        resultValue = value;
        resultBenchmark = benchmark;
      }
      
    } else {
      resultValue = value;
      resultBenchmark = benchmark;
    }
  }

  const colorOfBar = resultValue >= resultBenchmark ? "#27AE60" : "#f05a48";

  const options = {
    plugins: {
      legend: {
        display: true,
        position: 'top',
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
  
  console.log("name", name, resultValue, resultBenchmark, "------------->");
  const barData = {
    labels: [`${resultType === "week" ? "7 Days" : "Month"}`, "Target"],
    datasets: [
      {
        // ! value and benchmark will be change according to the data
        label: name,
        data: [resultValue, resultBenchmark,],
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
