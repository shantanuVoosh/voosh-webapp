import React from "react";
import ReactPlayer from "react-player";
import vooshCardSvg from "../../styles/assets/voosh_card.svg";
import { RiDoubleQuotesL, RiDoubleQuotesR } from "react-icons/ri";
import { BsChevronDoubleRight } from "react-icons/bs";
import random_food_image1 from "../../styles/images/food-1.jpg";
import random_food_image2 from "../../styles/images/food-2.jpg";
import random_food_image3 from "../../styles/images/food-3.jpg";

const Explore = () => {
    // Todo :temp use
  const numberOfVideoWatch = 1;

  return (
    <>
      {/* //! Gray Card */}
      <div className="onboard-certified-card">
        <div className="part-one">
          {/*//? left 70% */}
          <div className="text">
            <div className="head">
              Get <span className="orange">Voosh</span> certified
            </div>
            <div className="sub-head">
              while we prepare your data, have a look at the below knowledge
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
      <div className="dashboard-bottom">
        <div className="dashboard-bottom__videos">
          <div className="single-video">
            <ReactPlayer
              className="single-video"
              url="https://www.youtube.com/watch?v=MIsi4vdzjgk"
              controls
              playbackRate={1}
              width="100%"
              height="200px"
            />
            <div className="text">What is serviciabilty? </div>
          </div>
          <div className="single-video">
            <ReactPlayer
              className="single-video"
              url="https://www.youtube.com/watch?v=QN1GGCNMOY4"
              controls
              playbackRate={1}
              width="310px"
              height="200px"
            />
            <div className="text">What is Rating? </div>
          </div>
          <div className="single-video">
            <ReactPlayer
              className="single-video"
              url="https://www.youtube.com/watch?v=w3RqWoQa19M"
              controls
              playbackRate={1}
              width="100%"
              height="200px"
            />
            <div className="text">What is RDC? </div>
          </div>
          <div className="single-video">
            <ReactPlayer
              className="single-video"
              url="https://www.youtube.com/watch?v=RD6PiwwMRRg"
              controls
              playbackRate={1}
              width="310px"
              height="200px"
            />
            <div className="text">What is MFR? </div>
          </div>
        </div>
        {/* <div className="">
        <ScrollButton />
      </div> */}
      </div>

      {/* //! Quick reads */}
      <div className="onboard-quick-reads">
        {/* //? article */}
        <h1>Quick Reads</h1>
        <div className="onboard-quick-reads__article">
          {/* //? text */}
          <div className="left">
            <div className="head">Voosh is trusted by millions</div>
            <div className="sub-head">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Quibusdam...
            </div>
            <div className="info-tab">
              <span className="name">name</span>
              <span className="date">15 Jan 2022</span>
              <span className="time">5mins</span>
            </div>
            <div className="article-read-more red">
              Read More <BsChevronDoubleRight size={10} />
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
            <div className="head">Voosh is trusted by millions</div>
            <div className="sub-head">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Quibusdam...
            </div>
            <div className="info-tab">
              <span className="name">name</span>
              <span className="date">15 Jan 2022</span>
              <span className="time">5mins</span>
            </div>
            <div className="article-read-more red">
              Read More <BsChevronDoubleRight size={10} />
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
            <div className="head">Voosh is trusted by millions</div>
            <div className="sub-head">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Quibusdam...
            </div>
            <div className="info-tab">
              <span className="name">name</span>
              <span className="date">15 Jan 2022</span>
              <span className="time">5mins</span>
            </div>
            <div className="article-read-more red">
              Read More <BsChevronDoubleRight size={12} />
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

      {/* //! Review Cards */}
      <div className="onborad-customer-reviews">
        <span className="quote-right">
          <RiDoubleQuotesR size={180} />
        </span>
        <span className="quote-left">
          <RiDoubleQuotesL size={180} />
        </span>
        <h1 className="onborad-customer-reviews__title">
          Our Customer Love Us
        </h1>
        <div className="onborad-customer-reviews__all-reviews">
          <div className="single-review-card">
            <div className="head">
              <img
                src="https://randomuser.me/api/portraits/med/men/15.jpg"
                alt="user"
              />
            </div>
            <div className="body">
              <div className="review">
                {" "}
                "Voosh has completely changed the way i lived"
              </div>
              <div className="user-name">-Gaurav Rukhana</div>
            </div>
          </div>
          <div className="single-review-card">
            <div className="head">
              <img
                src="https://randomuser.me/api/portraits/med/men/1.jpg"
                alt="user"
              />
            </div>
            <div className="body">
              <div className="review">
                {" "}
                "Voosh has completely changed the way i lived"
              </div>
              <div className="user-name">-Gaurav Rukhana</div>
            </div>
          </div>
          <div className="single-review-card">
            <div className="head">
              <img
                src="https://randomuser.me/api/portraits/med/men/12.jpg"
                alt="user"
              />
            </div>
            <div className="body">
              <div className="review">
                {" "}
                "Voosh has completely changed the way i lived"
              </div>
              <div className="user-name">-Gaurav Rukhana</div>
            </div>
          </div>
          <div className="single-review-card">
            <div className="head">
              <img
                src="https://randomuser.me/api/portraits/med/men/5.jpg"
                alt="user"
              />
            </div>
            <div className="body">
              <div className="review">
                {" "}
                Voosh has completely changed the way i lived
              </div>
              <div className="user-name">-Gaurav Rukhana</div>
            </div>
          </div>
          <div className="single-review-card">
            <div className="head">
              <img
                src="https://randomuser.me/api/portraits/med/men/13.jpg"
                alt="user"
              />
            </div>
            <div className="body">
              <div className="review">
                {" "}
                Voosh has completely changed the way i lived
              </div>
              <div className="user-name">-Gaurav Rukhana</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Explore;
