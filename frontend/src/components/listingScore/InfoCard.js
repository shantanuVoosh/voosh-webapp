import React from "react";

const InfoCard = ({ name, value, type, benchmark, compareThen }) => {
  let showColor = "";
  let resultValue = 0;
  let resultBenchmark = 0;
  // Todo: String Working
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
      // console.log("here++++++++++++++++")
      resultValue = value === "Not Applicable" ? 0 : 100;
      resultBenchmark = 100;
    }
  } else if (type === "High Medium Low") {
  } else if (type === "percentage") {
    if (compareThen === "High Medium Low") {
      resultBenchmark = benchmark;
      if (value === "High") {
        resultValue = 90;
      } else if (value === "Medium") {
        resultValue = 70;
      } else if (value === "Low") {
        resultValue = 50;
      }
    } else {
      resultValue = value;
      resultBenchmark = benchmark;
    }
  }
  // Todo: Dont Touch this

  showColor = resultValue > resultBenchmark ? "green" : "red";

  return (
    <div className="info-card">
      <div className="name">{name}</div>
      <div className={`${showColor} value`}>{`${value}`}</div>
    </div>
  );
};

export default InfoCard;
