import React from "react";
import ReactPlayer from "react-player";
import vooshCardSvg from "../../styles/assets/voosh_card.svg";
import { BsChevronDoubleRight } from "react-icons/bs";
import random_food_image1 from "../../styles/images/food-1.jpg";
import random_food_image2 from "../../styles/images/food-2.jpg";
import random_food_image3 from "../../styles/images/food-3.jpg";
import logo_img from "../../styles/images/logo-img.png";
import Footer from "../../components/onboardingDashboard/Footer";

const Explore = ({ changePage }) => {
  // Todo :temp use
  const numberOfVideoWatch = 1;

  return (
    <>
      <div className="container onboard-container onboard-explore">
        <div className="onboard-logo">
          <img src={logo_img} alt="logo" className="onboard-logo--image" />
        </div>
        {/* //! Gray Card */}
        <div className="onboard-certified-card">
          <div className="part-one">
            {/*//? left 70% */}
            <div className="text">
              <div className="head">
                Get <span className="orange">Voosh</span> certified
              </div>
              <div className="sub-head">
                While we prepare your data, have a look at the below knowledge
                goldmine!
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
            <div className="text">1/4 videos watched!</div>
          </div>
        </div>
        {/* //! Samll mein col xsmall other row */}
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
          <h1>Articles</h1>
          <div className="onboard-quick-reads__article">
            {/* //? text */}
            <div className="left">
              <div className="head">GST to increase by 5%</div>
              <div className="sub-head">
                GST This april will become 5% and now you have to wear masks...
              </div>
              <div className="info-tab">
                <span className="name">name</span>
                <span className="date">15 Jan 2022</span>
                <span className="time">5mins</span>
              </div>
              <div className="article-read-more red">
                <span>Read More</span>
                <span>
                  <BsChevronDoubleRight size={10} />
                </span>
              </div>
            </div>
            <div className="right">
              <img
                className="article--img"
                src={random_food_image1}
                alt={"food"}
              />
            </div>
          </div>
          <div className="onboard-quick-reads__article">
            {/* //? text */}
            <div className="left">
              <div className="head">How VFH rose by 26% in 2021</div>
              <div className="sub-head">
                GST This april will become 5% and now you have to wear masks...
              </div>
              <div className="info-tab">
                <span className="name">name</span>
                <span className="date">15 Jan 2022</span>
                <span className="time">5mins</span>
              </div>
              <div className="article-read-more red">
                <span>Read More</span>
                <span>
                  <BsChevronDoubleRight size={10} />
                </span>
              </div>
            </div>
            <div className="right">
              <img
                className="article--img"
                src={random_food_image2}
                alt={"food"}
              />
            </div>
          </div>
          <div className="onboard-quick-reads__article">
            {/* //? text */}
            <div className="left">
              <div className="head">GST to increase by 5%</div>
              <div className="sub-head">
                GST This april will become 5% and now you have to wear masks...
              </div>
              <div className="info-tab">
                <span className="name">name</span>
                <span className="date">15 Jan 2022</span>
                <span className="time">5mins</span>
              </div>
              <div className="article-read-more red">
                <span>Read More</span>
                <span>
                  <BsChevronDoubleRight size={10} />
                </span>
              </div>
            </div>
            <div className="right">
              <img
                className="article--img"
                src={random_food_image3}
                alt={"food-1"}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer changePage={changePage} />
    </>
  );
};

export default Explore;
