import React from "react";
import ReactPlayer from "react-player";
import vooshCardSvg from "../../styles/assets/voosh_card.svg";
import { BsChevronDoubleRight } from "react-icons/bs";
import random_food_image1 from "../../styles/images/food-1.jpg";
import random_food_image2 from "../../styles/images/food-2.jpg";
import random_food_image3 from "../../styles/images/food-3.jpg";
import logo_img from "../../styles/images/logo-img.png";
import Footer from "../../components/onboardingDashboard/Footer";
import Header from "../../components/onboardingDashboard/Header";
import ArticleArray from "../../utils/articleArray";
import ReactGA from "react-ga4";
import MetaTags from "react-meta-tags";
import ReactPixel from "react-facebook-pixel";
import EmbeddedBrowser from "react-embedded-browser";

const Explore = ({ changePage, pageName }) => {
  // Todo :temp use
  const numberOfVideoWatch = 1;

  const [showArticleModel, setShowArticleModel] = React.useState(false);
  const [articleLink, setArticleLink] = React.useState("");

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pageName]);

  const onVideoClick = (name, videoNumber) => {
    console.log("video click");
    ReactPixel.track("Video Clicked", {
      value: `${name}, video number-${videoNumber}`,
    });
    ReactGA.event({
      category: "Video Clicked",
      action: `${name}, video number-${videoNumber}`,
      label: "Video View",
    });
  };

  const openNewWindow = (url) => {
    // window.open(url, "_blank", "toolbar=0,location=0,menubar=0");
    setShowArticleModel((prev) => !prev);
    setArticleLink(url);
  };

  if (showArticleModel) {
    return (
      <>
        <div className="article-model">
          <div className="article-model__head">
            <div onClick={() => setShowArticleModel((prev) => !prev)}>
              Go Back
            </div>
          </div>
          <div className="article-model__body">
            <iframe
              src={articleLink}
              width="100%"
              height="100%"
              title="random"
            ></iframe>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <MetaTags>
        <title>Voosh | Explore</title>
        <meta name="voosh web app, Explore page" content="voosh Explore page" />
        <meta property="og:title" content="web-app" />
      </MetaTags>
      <div className="container onboard-container onboard-explore">
        <Header changePage={changePage} />
        {/* //! Gray Card */}
        <div className="onboard-certified-card">
          <div className="part-one">
            {/*//? left 70% */}
            <div className="text">
              <div className="head">
                Grow with <span className="orange">Voosh</span> Verified
              </div>
              <div className="sub-head">
                We're working on your data, Below is some food for thought!
              </div>
            </div>
            {/*//? right 30% */}
            <div className="sample-image">
              <img src={vooshCardSvg} alt="voosh-card" />
            </div>
          </div>
          <div className="part-two">
            <div
              className="bar"
              style={{ width: `${(numberOfVideoWatch / 4) * 100}%` }}
            ></div>
            {/*<div className="text">1/4 videos watched!</div>*/}
          </div>
        </div>
        {/* //! Small mein col xsmall other row */}
        <div className="onboard-bottom">
          <div className="onboard-bottom__videos">
            <div className="single-video">
              <ReactPlayer
                className="single-video"
                url="https://www.youtube.com/watch?v=_tnnZYeFYYo"
                controls
                playbackRate={1}
                width="100%"
                height="200px"
                onStart={() => {
                  console.log("video start");
                  onVideoClick("Food-Delivery Apps vs. Restaurants", 1);
                }}
              />
              <div className="text">Food-Delivery Apps vs. Restaurants</div>
            </div>
            <div className="single-video">
              <ReactPlayer
                className="single-video"
                url="https://www.youtube.com/watch?v=v7_ZTzErBDs"
                controls
                playbackRate={1}
                width="310px"
                height="200px"
                onStart={() => {
                  console.log("video start");
                  onVideoClick(
                    "Where does your food delivery really come from?",
                    2
                  );
                }}
              />
              <div className="text">
                Where does your food delivery really come from?
              </div>
            </div>
            <div className="single-video">
              <ReactPlayer
                className="single-video"
                url="https://www.youtube.com/watch?v=lqtAeEbEyMg"
                controls
                playbackRate={1}
                width="100%"
                height="200px"
                onStart={() => {
                  console.log("video start");
                  onVideoClick("CloudKitchens: How it Works", 3);
                }}
              />
              <div className="text">CloudKitchens: How it Works</div>
            </div>
            <div className="single-video">
              <ReactPlayer
                className="single-video"
                url="https://www.youtube.com/watch?v=PAM8k6EF0as"
                controls
                playbackRate={1}
                width="310px"
                height="200px"
                onStart={() => {
                  console.log("video start");
                  onVideoClick(
                    "The cloud kitchen hoping to go fully autonomous",
                    4
                  );
                }}
              />
              <div className="text">
                The cloud kitchen hoping to go fully autonomous
              </div>
            </div>
          </div>
          {/* <div className="">
        <ScrollButton />
      </div> */}
        </div>

        {/* //! Quick reads */}
        <div className="onboard-quick-reads">
          {/* //? article */}
          <h1>Trending stories</h1>
          {ArticleArray.map((article, index) => {
            const { title, subTitle, name, date, readTime, link, image } =
              article;
            return (
              <div
                className="onboard-quick-reads__article"
                key={index}
                onClick={() => {
                  // ! experiment
                  // Todo: tezt
                  ReactPixel.trackCustom("Article  Clicked", {
                    value: `Article-${index + 1} clicked`,
                  });

                  ReactGA.event({
                    category: `Article-${index + 1} Read More Clicked`,
                    action: `Article-${index + 1} Read More Clicked`,
                    label: `Article-${index + 1} Clicked`,
                  });
                  openNewWindow(link);
                }}
              >
                {/* //? text */}
                <div className="left">
                  {/* <a
                    className="head"
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {title.length > 45 ? title.slice(0, 45) + "..." : title}
                  </a> */}
                  <div
                    className="head"
                    onClick={() => {
                      openNewWindow(link);
                    }}
                  >
                    {title.length > 45 ? title.slice(0, 45) + "..." : title}
                  </div>
                  <div className="sub-head">
                    {subTitle.length > 55
                      ? subTitle.slice(0, 55) + "..."
                      : subTitle}
                  </div>
                  <div className="info-tab">
                    {/*<span className="name">{name}</span>*/}
                    <span className="date">{date}</span>
                    {/* <span className="time">5mins</span> */}
                  </div>
                  <div className="article-read-more red">
                    {/* <a
                      href={link}
                      target="_blank"
                      rel="noreferrer"
                      className="orange"
                      onClick={() => {
                        // ! experiment
                        // Todo: tezt
                        ReactPixel.trackCustom("Article  Clicked", {
                          value: `Article-${index + 1} clicked`,
                        });

                        ReactGA.event({
                          category: `Article-${index + 1} Read More Clicked`,
                          action: `Article-${index + 1} Read More Clicked`,
                          label: `Article-${index + 1} Clicked`,
                        });
                      }}
                    >
                      Read More
                    </a> */}
                    <div
                      className="orange"
                      // onClick={() => {
                      //   // ! experiment
                      //   // Todo: tezt
                      //   ReactPixel.trackCustom("Article  Clicked", {
                      //     value: `Article-${index + 1} clicked`,
                      //   });

                      //   ReactGA.event({
                      //     category: `Article-${index + 1} Read More Clicked`,
                      //     action: `Article-${index + 1} Read More Clicked`,
                      //     label: `Article-${index + 1} Clicked`,
                      //   });
                      //   openNewWindow(link);
                      // }}
                    >
                      Read More
                    </div>
                    <span style={{ display: "flex", alignItems: "center" }}>
                      <BsChevronDoubleRight size={10} />
                    </span>
                  </div>
                </div>
                <div className="right">
                  <img className="article--img" src={image} alt={"food-1"} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Footer changePage={changePage} pageName={pageName} />
    </>
  );
};

export default Explore;
