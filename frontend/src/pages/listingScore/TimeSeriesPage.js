import React from "react";
import { Bar } from "react-chartjs-2";
import { useLocation } from "react-router-dom";
import Header from "../../components/Header";
import InfoCard from "../../components/listingScore/InfoCard";
import Footer from "../../components/Footer";
import { useSelector } from "react-redux";
import SectionButtons from "../../components/SectionButtons";
import Error from "../../components/Error";
import { BsBagCheckFill } from "react-icons/bs";
import ReactPlayer from "react-player";
import BarGrap from "../../components/listingScore/BarGraph";
import ScrollButton from "../../components/ScrollButton";
import MetaTags from "react-meta-tags";
import Loading from "../../components/Loading";

const TimeSeriesPages = ({ sectionName }) => {
  const { data, ls_currentProductIndex } = useSelector((state) => state.data);
  const { resultType, isLoading } = useSelector((state) => state.data);
  const location = useLocation();

  if (data.length <= 0) return <Loading />;

  // ?Listing Score
  const listingScoreItems = data[ls_currentProductIndex]["listingScore"];

  const listScoreDataItems = ls_currentProductIndex < 0 ? [] : listingScoreItems;
  const { listingScoreData } = listScoreDataItems;





  const pageName =
    location.pathname.split("/")[location.pathname.split("/").length - 1];

  console.log(
    pageName,
    "page name----",
    ls_currentProductIndex,
    "ls_currentProductIndex"
  );

  const allSwiggyListingCardsName = [
    "Safety Tag",
    "Images",
    "Number of Rating",
    "Rating",
    "Offer 1",
    "Offer 2",
    "Item Description",
    "Beverages Category",
    "Best Seller Score",
    "Desserts",
  ];
  const allZomatoListingCardsName = [
    "Safety Tag",
    "Images",
    "Number of Rating",
    "Rating",
    "Vote Score",
    "Offer 1",
    "Offer 2",
    "Offer 3",
    "Offer 4",
    "Item Description",
    "Beverages Category",
    "Desserts",
  ];

  // ? check whether the page is in the listScoreDataItems or not
  // ? user using navigating from url
  // const pageData = listingScoreData.find((item) => {
  //   let { name: itemName } = item;
  //   itemName = itemName.replace(/\s+/g, "").toLowerCase();
  //   let searchName = pageName.replace(/\s+/g, "").toLowerCase();
  //   return itemName === searchName;
  // });
  const pageData = [
    ...allSwiggyListingCardsName,
    ...allZomatoListingCardsName,
  ].find((item) => {
    const itemName = item.replace(/\s+/g, "").toLowerCase();
    let searchName = pageName.replace(/\s+/g, "").toLowerCase();
    return itemName === searchName;
  });

  if (pageData === undefined) return <Error />;

  // ? we use here cuz, if we change the current index, the ls of zomato and swiggy will be different
  const {
    listingScore: { listingScoreData: lsData },
  } = data[ls_currentProductIndex];

  console.log(listingScoreData, "listingScoreData");
  console.log(lsData, "lsData");
  console.log(pageData, "pageData");

  const timeSeriesData = lsData.find((item) => item.name === pageData);

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

  if (isLoading) {
    return (
      <>
        <MetaTags>
          <title>Voosh | Listing-Score | {name}</title>
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
        <title>Voosh | Listing-Score | {name}</title>
        <meta name={`voosh web app, ${name}`} content={`voosh ${name}`} />
        <meta property="og:title" content="web app" />
      </MetaTags>
      <Header heading={name} isHomePage={false} onlyShowDate={true} />
      <div className="container">
        <SectionButtons sectionName={sectionName} />
        {/* <InfoCardWithNoData name={name} /> */}
        <InfoCard name={name} value={value} info={info} type={type} />
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
