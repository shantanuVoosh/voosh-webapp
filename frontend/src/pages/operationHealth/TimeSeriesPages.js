import React from "react";
import { Line, Bar } from "react-chartjs-2";
import { useLocation } from "react-router-dom";
import Header from "../../components/Header";
import InfoCard from "../../components/InfoCard";
import Footer from "../../components/Footer";
import { useSelector } from "react-redux";
import SectionButtons from "../../components/SectionButtons";
import Error from "../../components/Error";
import { BsBagCheckFill } from "react-icons/bs";

// const Linedata = {
//   labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
//   datasets: [
//     {
//       lineTension: 0.3,
//       label: "",
//       data: [33, 53, 85, 41, 44, 65],
//       pointRadius: 0,
//       fill: true,
//       backgroundColor: "rgb(60, 200, 196)",
//       borderColor: "rgba(75,192,192,1)",
//     },
//   ],
// };
// TODO: fix the issue of the data not being loaded
// TODO: cant visit the page directly (state is empty but path i can use)
// TODO: daynamic data change!
// TODO: aager path ka name match nhi hua, then show the Error page

const TimeSeriesPages = ({}) => {
  const resultType = useSelector((state) => state.data.resultType);
  const location = useLocation();

  // ?can be usefull to grab data for this Graph
  const { data, currentProductIndex } = useSelector((state) => state.data);

  // * manually handeling the data, cuz this not present in the LayoutWrapper
  if (data.length <= 0) return null;

  const operationHealth = data[currentProductIndex]["operationHealth"];
  const { operationHealthMain, operationHealthData } = operationHealth;
  const operationHealthItems =
    currentProductIndex < 0 ? [] : operationHealthData;



  let name;
  let type;
  // ? user using navigation from links
  if (location.state) {
    name = location.state.name;
    type = location.state.type;
  }
  // ? user using nvigating from url
  else {
    const pathName = location.pathname.split("/");
    const d = operationHealthItems.find((item) => {
      let { name: itemName } = item;
      itemName = itemName.replace(/\s+/g, "").toLowerCase();
      let serachName = pathName[pathName.length - 1]
        .replace(/\s+/g, "")
        .toLowerCase();
      return itemName === serachName;
    });
    // console.log(d)
    if (d === undefined) return <Error />;

    name = d.name;
    type = d.type;
  }

  // ? buttons se change hua to it handel the or update the data
  const timeSeriesData = operationHealthItems.find(
    (item) => item.name === name
  );
  // console.log(timeSeriesData)
  const {
    name: currentName,
    value: currentValue,
    monthlyResult,
    weeklyResult,
    benchmark,
    compareThen,
  } = timeSeriesData;

  let value;
  // ? use value month Wise or week Wise
  if (currentValue === undefined) {
    value = resultType === "month" ? monthlyResult : weeklyResult;
  } else {
    value = currentValue;
  }
  // ? compare the value with benchmark ---> bar color will change accordingly
  const compare = compareThen === "grater" ? value >= benchmark : value <= benchmark;
  // console.log(compare, "compare value", resultType)
  const colorOfBar = compare ? "#27AE60" : "#f05a48";


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
    labels: [`${resultType==="week"?"7 Days":"Month"}`, "Target"],
    datasets: [
      {
        // ! value and benchmark will be change according to the data
        // data: [value, benchmark],
        data: [value, benchmark],
        label: "vbbfb",
        backgroundColor: [`${colorOfBar}`, "#2A327D"],
        // backgroundColor: ["#f05a48", "#2A327D"],
        barThickness: 60,
        // fill: false,
      },
    ],
  };

  return (
    <>
      <Header heading={currentName} isHomePage={false} />
      <div className="container">
        <SectionButtons />
        <InfoCard name={name} value={value} type={type} />
        <div className="bar-graph">
          <Bar className="bar" data={barData} options={options} />
        </div>
        {/* <div className="line-graph">
          <Line data={Linedata} options={options} />
        </div> */}
        <div className="dashboard-bottom">
          <div className="dashboard-bottom__heading">
            what does {currentName} mean?
          </div>
          <div className="dashboard-bottom__videos--single-video">
            <iframe
              title="video"
              width="100%"
              height="240px"
              src="https://www.youtube.com/embed/zpOULjyy-n8?rel=0"
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="recomendation">
            <div className="recomendation__heading">
              <span className="icon">
                <BsBagCheckFill />
              </span>
              <span className="text">Top Recommendations</span>
            </div>
            <div className="recomendation__list">Remove Banner Ads</div>
            <div className="recomendation__list">ncrease CPC ₹5000</div>
            <div className="recomendation__list">
              Add 'Dal Makhni' to "Recommendation
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TimeSeriesPages;
