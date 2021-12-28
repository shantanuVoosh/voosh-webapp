import React from "react";
import Card from "../../components/loginAftermath/Card";
import { BsBagCheckFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import ReactPlayer from "react-player";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const DashBoradWithNoData = () => {
  return (
    <>
      <Header
        isErrorPage={false}
        restaurantName="Voosh VGN"
        isHomePage={true}
        headerSize={"big"}
        fakeData={true}
      />
      <div className="dashboard-cards">
        {/* //? Revenue */}
        <Card
          iconName={"bar"}
          name={"Revenue"}
          info={"Get your Revenue and Deduction Details!"}
          cardStatistics={{
            value: 0,
            benchmark: 0,
            type: "percentage",
            changeTypeDirection: "up",
            change: 0,
            isDataPresent: false,
          }}
        />
        {/* //? Operation Health */}
        <Card
          iconName={"bar"}
          name={"Operation Health"}
          info={"Understand your Operation Health and Metrics!"}
          cardStatistics={{
            value: 0,
            benchmark: 0,
            type: "percentage",
            changeTypeDirection: "up",
            change: 0,
            isDataPresent: false,
          }}
        />
        {/* //?List Score */}
        <Card
          iconName={"bar"}
          name={"Listing Score"}
          info={"Understand how your online Swiggy listing is performing!"}
          cardStatistics={{
            value: 0,
            benchmark: 0,
            type: "percentage",
            changeTypeDirection: "up",
            change: 0,
            isDataPresent: false,
          }}
        />
      </div>
      <div className="dashboard-bottom">
        <div className="dashboard-bottom__heading">
          Some tutorials for your business
        </div>
        <div className="dashboard-bottom__videos">
          <div className="single-video">
            <ReactPlayer
              // className="single-video"
              url="https://www.youtube.com/watch?v=MIsi4vdzjgk"
              controls
              playbackRate={1}
              width="100%"
              height="240px"
            />
          </div>
          <div className="single-video">
            <ReactPlayer
              // className="single-video"
              url="https://www.youtube.com/watch?v=QN1GGCNMOY4"
              controls
              playbackRate={1}
              width="310px"
              height="240px"
            />
          </div>
          <div className="single-video">
            <ReactPlayer
              // className="single-video"
              url="https://www.youtube.com/watch?v=w3RqWoQa19M"
              controls
              playbackRate={1}
              width="310px"
              height="240px"
            />
          </div>
          {/* <div className="single-video">
            <ReactPlayer
              // className="single-video"
              url="https://www.youtube.com/watch?v=QN1GGCNMOY4"
              controls
              playbackRate={1}
              width="310px"
              height="240px"
            />
          </div> */}
        </div>
        <div className="recomendation">
          <div className="recomendation__heading">
            <span className="icon">
              <BsBagCheckFill />
            </span>
            <span className="text">Top Suggestion</span>
          </div>
          <div className="no">
          No Suggestions avialabe for you, we will come back soon!
          </div>
          {/* <div className="recomendation__list">
            No Suggestions avialabe for you!
          </div> */}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DashBoradWithNoData;
