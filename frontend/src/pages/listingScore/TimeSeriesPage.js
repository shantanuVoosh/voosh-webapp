import React from "react";
import { Bar } from "react-chartjs-2";
import { useLocation } from "react-router-dom";
import Header from "../../components/Header";
import InfoCardWithNoData from "../../components/InfoCardWithNoData";
import InfoCard from "../../components/listingScore/InfoCard";
import Footer from "../../components/Footer";
import { useSelector } from "react-redux";
import SectionButtons from "../../components/SectionButtons";
import Error from "../../components/Error";
import { BsBagCheckFill } from "react-icons/bs";
import ReactPlayer from "react-player";
import BarGrap from "../../components/listingScore/BarGraph";
import ScrollButton from "../../components/ScrollButton";

const TimeSeriesPages = ({}) => {
  const { data, currentProductIndex } = useSelector((state) => state.data);
  const resultType = useSelector((state) => state.data.resultType);
  const location = useLocation();

  if (data.length <= 0) return null;

  // ?Listing Score
  const listingScoreItems = data[currentProductIndex]["listingScore"];

  const listScoreDataItems = currentProductIndex < 0 ? [] : listingScoreItems;
  const { listingScoreData } = listScoreDataItems;

  const pageName =
    location.pathname.split("/")[location.pathname.split("/").length - 1];

  console.log(pageName);
  // console.log(listingScoreData);

  // ? check whether the page is in the listScoreDataItems or not
  // ? user using nvigating from url
  const pageData = listingScoreData.find((item) => {
    let { name: itemName } = item;
    itemName = itemName.replace(/\s+/g, "").toLowerCase();
    let serachName = pageName.replace(/\s+/g, "").toLowerCase();
    return itemName === serachName;
  });

  if (pageData === undefined) return <Error />;

  const timeSeriesData = listingScoreData.find(
    (item) => item.name === pageData.name
  );

  const {
    name,
    value,
    info,
    type,
    benchmark,
    compareThen,
    videoLink,
    suggestions: recommendations,
  } = timeSeriesData;

  return (
    <>
      <Header heading={name} isHomePage={false} />
      <div className="container">
        <SectionButtons />
        {/* <InfoCardWithNoData name={name} /> */}
        <InfoCard name={name} value={value} info={info} />
        <BarGrap
          name={name}
          value={value}
          info={info}
          type={type}
          benchmark={benchmark}
          compareThen={compareThen}
        />
        <div className="time_series__bottom">
          <div className="time_series__bottom--heading">
            What does {name} mean?
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
