import React from "react";
import { Line, Bar } from "react-chartjs-2";
import { useLocation } from "react-router-dom";
import Header from "../../components/Header";
import InfoCard from "../../components/operationHealth/InfoCard";
import Footer from "../../components/Footer";
import { useSelector } from "react-redux";
import SectionButtons from "../../components/SectionButtons";
import Error from "../../components/Error";
import { BsBagCheckFill } from "react-icons/bs";
import ReactPlayer from "react-player";
import BarGraph from "../../components/operationHealth/BarGraph";
import ScrollButton from "../../components/ScrollButton";
import Loading from "../../components/Loading";

import MetaTags from "react-meta-tags";

// TODO: fix the issue of the data not being loaded
// TODO: cant visit the page directly (state is empty but path i can use)
// TODO: daynamic data change!
// TODO: aager path ka name match nhi hua, then show the Error page

const TimeSeriesPages = ({ sectionName }) => {
  const { resultType, isLoading } = useSelector((state) => state.data);
  const location = useLocation();

  // ?can be usefull to grab data for this Graph
  const { data, oh_currentProductIndex } = useSelector((state) => state.data);

  // * manually handeling the data, cuz this not present in the LayoutWrapper
  if (data.length <= 0) return null;

  const operationHealth = data[oh_currentProductIndex]["operationHealth"];
  const { operationHealthData } = operationHealth;
  const operationHealthItems =
    oh_currentProductIndex < 0 ? [] : operationHealthData;

  let pageNameFromURl =
    location.pathname.split("/")[location.pathname.split("/").length - 1];
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

  // ? buttons se change hua tho it handel the or update the data
  const timeSeriesData = operationHealthItems.find(
    (item) => item.name === name
  );
  // console.log(timeSeriesData)
  console.log(timeSeriesData, "tables=====================");

  if (timeSeriesData === undefined) {
    return (
      <>
        <MetaTags>
          <title>Voosh | Operation-Health | {name}</title>
          <meta name={`voosh web app, ${name}`} content={`voosh ${name}`} />
          <meta property="og:title" content="web app" />
        </MetaTags>
        <Header
          heading={pageNameFromURl}
          isHomePage={false}
          isDropdownNeeded={true}
        />

        <div className="container">
          <SectionButtons sectionName={sectionName} />
          <div
            style={{
              // display: "flex",
              width: "100%",
              textAlign: "center",
              paddingTop: "50%",
            }}
          >
            <span style={{
              fontSize: "20px",
              color: "#000",
              fontWeight: "bold",

            }}>
              Not present of{" "}
              {oh_currentProductIndex === 0 ? "Swiggy" : "Zomato"}
            </span>
          </div>
          
        </div>
        <Footer />
      </>
    );
  }

  const {
    name: currentName,
    value,
    type: valueType,
    benchmark,
    compareThen,
    videoLink,
    recommendations,
  } = timeSeriesData;

  if (isLoading) {
    return (
      <>
        <MetaTags>
          <title>Voosh | Operation-Health | {name}</title>
          <meta name={`voosh web app, ${name}`} content={`voosh ${name}`} />
          <meta property="og:title" content="web app" />
        </MetaTags>
        <Header isErrorPage={true} />
        <Loading />
        <Footer />
      </>
    );
  }

  return (
    <>
      <MetaTags>
        <title>Voosh | Operation-Health | {name}</title>
        <meta name={`voosh web app, ${name}`} content={`voosh ${name}`} />
        <meta property="og:title" content="web app" />
      </MetaTags>
      <Header
        heading={currentName}
        isHomePage={false}
        isDropdownNeeded={true}
      />
      <div className="container">
        <SectionButtons sectionName={sectionName} />
        <InfoCard
          name={name}
          value={value}
          type={valueType}
          benchmark={benchmark}
          compareThen={compareThen}
        />
        <BarGraph
          compareThen={compareThen}
          value={value}
          benchmark={benchmark}
        />
        <div className="time_series__bottom">
          <div className="time_series__bottom--heading">
            What does {currentName} mean?
          </div>
          {videoLink !== undefined && (
            <div className="video-preview">
              <ReactPlayer
                className="single-video"
                url={videoLink}
                controls
                playbackRate={1}
                width="100%"
                height="240px"
              />
            </div>
          )}
          {/* //! if Video not Presnt */}
          {videoLink === undefined && (
            <div className="video-preview">
              <ReactPlayer
                className="video-upcoming"
                url={videoLink}
                controls
                playbackRate={1}
                width="100%"
                height="240px"
              />
            </div>
          )}

          {recommendations !== undefined && (
            <>
              <div className="time_series__bottom--heading">
                <span className="icon">
                  <BsBagCheckFill />
                </span>
                <span className="text">Recommendation For You</span>
              </div>
              <div>
                {recommendations.map((item, index) => {
                  return (
                    <div className="time_series__bottom--list" key={index}>
                      {item}
                    </div>
                  );
                })}
              </div>
            </>
          )}
          {recommendations === undefined && (
            <div className="recomendation">
              <div className="recomendation__heading">
                <span className="icon">
                  <BsBagCheckFill />
                </span>
                <span className="text">Recommendation For You</span>
              </div>

              <div className="time_series__bottom--list">Working on it!!</div>
            </div>
          )}
        </div>
      </div>
      <div className="">
        <ScrollButton />
      </div>
      <Footer />
    </>
  );
};

export default TimeSeriesPages;
