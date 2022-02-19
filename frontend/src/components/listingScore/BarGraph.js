import React from "react";
import { useSelector } from "react-redux";
import { Line, Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

const BarGraph = ({ name, compareThen, value, benchmark, type }) => {
  const { resultType, currentProductIndex } = useSelector(
    (state) => state.data
  );

  let partner_name = "";
  partner_name = currentProductIndex === 0 ? "swiggy" : "zomato";
  const { showColor, resultValue, resultBenchmark } = listingScoreBenchmarks(
    name,
    partner_name,
    value
  );

  const colorOfBar = showColor === "green" ? "#27AE60" : "#f05a48";

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

  console.log("name", name, resultValue, resultBenchmark, "------------->");
  const barData = {
    labels: [`${resultType === "week" ? "7 Days" : "Month"}`, "Target"],
    datasets: [
      {
        // ! value and benchmark will be change according to the data
        // label: name,
        data: [resultValue, resultBenchmark],
        backgroundColor: [`${colorOfBar}`, "#2A327D"],
        barThickness: 60,
        // fill: false,
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

function listingScoreBenchmarks(name, partner_name, value) {
  let showColor = "";
  let isKnowMorePresent = false;
  let resultValue = 0;
  let resultBenchmark = 0;

  // ?for Swiggy ls Items
  if (partner_name === "swiggy") {
    // *1 this will not have know more btn(Time Graph)
    if (name === "Safety Tag") {
      resultValue = value === "Yes" ? 1 : 0;
      resultBenchmark = 1;
      showColor = resultValue === resultBenchmark ? "green" : "red";
      console.log("Safety Tag", resultValue, resultBenchmark, showColor);
    }
    // *2 (Time Graph)
    else if (name === "Images") {
      resultValue = value;
      resultBenchmark = 200;
      isKnowMorePresent = true;
      showColor = resultValue >= resultBenchmark ? "green" : "red";
    }
    // *3 (Time Graph)
    else if (name === "Number of Rating") {
      resultValue =
        value === "High"
          ? 100
          : value === "Medium"
          ? 50
          : value === "Low"
          ? 0
          : 0;
      resultBenchmark = 100;
      isKnowMorePresent = true;
      showColor = resultValue >= resultBenchmark ? "green" : "red";
    }
    // *4 (Time Graph)
    else if (name === "Rating") {
      resultValue = value;
      resultBenchmark = 4.5;
      isKnowMorePresent = true;
      showColor = resultValue >= resultBenchmark ? "green" : "red";
    }
    // *5 this will not have know more btn(Time Graph)
    else if (name === "Offer 1") {
      resultValue = value === "Applicable" ? 1 : 0;
      resultBenchmark = 1;
      showColor = resultValue === resultBenchmark ? "green" : "red";
    }
    // *6 this will not have know more btn(Time Graph)
    else if (name === "Offer 2") {
      resultValue = value === "Applicable" ? 1 : 0;
      resultBenchmark = 1;
      showColor = resultValue === resultBenchmark ? "green" : "red";
    }
    // *7 (Time Graph)
    else if (name === "Item Description") {
      resultValue = value;
      resultBenchmark = 70;
      isKnowMorePresent = true;
      showColor = resultValue >= resultBenchmark ? "green" : "red";
    }
    // *8 No Know More Button (Time Graph)
    else if (name === "Beverages Category") {
      resultValue = value === "Yes" ? 1 : 0;
      resultBenchmark = 1;
      showColor = resultValue === resultBenchmark ? "green" : "red";
    }
    // *9 (Time Graph)
    else if (name === "Best Seller Score") {
      resultValue = value;
      resultBenchmark = 80;
      // isKnowMorePresent = true;
      showColor = resultValue >= resultBenchmark ? "green" : "red";
    }
    // *10 No Know More Button (Time Graph)
    else if (name === "Desserts") {
      resultValue = value === "Yes" ? 1 : 0;
      resultBenchmark = 1;
      showColor = resultValue === resultBenchmark ? "green" : "red";
    }

    return {
      resultValue,
      resultBenchmark,
      isKnowMorePresent,
      showColor,
    };
  }
  // ?for Zomato ls Items
  else if (partner_name === "zomato") {
    // *1 this will not have know more btn(Time Graph)
    if (name === "Safety Tag") {
      resultValue = value === "Yes" ? 1 : 0;
      resultBenchmark = 1;
      showColor = resultValue === resultBenchmark ? "green" : "red";
    }
    // *2 (Time Graph)
    else if (name === "Images") {
      resultValue = value;
      resultBenchmark = 100;
      // isKnowMorePresent = true;
      showColor = resultValue >= resultBenchmark ? "green" : "red";
    }
    // *3 (Time Graph)
    // ! this is not in Swiggy
    else if (name === "Number of Review") {
      resultValue = value;
      resultBenchmark = 5000;
      // isKnowMorePresent = true;
      showColor = resultValue >= resultBenchmark ? "green" : "red";
    }
    // Todo:delivery_review
    // *4 (Time Graph)
    // ! this is not in Swiggy
    else if (name === "Delivery Review") {
      resultValue = value;
      resultBenchmark = 3.7;
      // isKnowMorePresent = true;
      showColor = resultValue >= resultBenchmark ? "green" : "red";
    }

    // *5 (Time Graph)
    // ! this is not in Swiggy
    else if (name === "Vote Score") {
      resultValue = value;
      resultBenchmark = 5;
      // isKnowMorePresent = true;
      showColor = resultValue < resultBenchmark ? "green" : "red";
    }
    // *6 (Time Graph)
    else if (name === "Rating") {
      resultValue = value;
      resultBenchmark = 4.5;
      isKnowMorePresent = true;
      showColor = resultValue >= resultBenchmark ? "green" : "red";
    }
    // *7-10 this will not have know more btn(Time Graph)
    else if (
      name === "Offer 1" ||
      name === "Offer 2" ||
      name === "Offer 3" ||
      name === "Offer 4"
    ) {
      resultValue = value === " Applicable" ? 0 : 1;
      resultBenchmark = 1;
      showColor = resultValue === resultBenchmark ? "green" : "red";
    }
    // *11 (Time Graph)
    else if (name === "Item Description") {
      resultValue = value;
      resultBenchmark = 85;
      isKnowMorePresent = true;
      showColor = resultValue >= resultBenchmark ? "green" : "red";
    }
    // *12 No Know More Button (Time Graph)
    else if (name === "Beverages Category") {
      resultValue = value === "Yes" ? 1 : 0;
      resultBenchmark = 1;
      showColor = resultValue === resultBenchmark ? "green" : "red";
    }
    // *13 No Know More Button (Time Graph)
    else if (name === "Desserts") {
      resultValue = value === "Yes" ? 1 : 0;
      resultBenchmark = 1;
      showColor = resultValue === resultBenchmark ? "green" : "red";
    }

    return {
      resultValue,
      resultBenchmark,
      isKnowMorePresent,
      showColor,
    };
  }
}
