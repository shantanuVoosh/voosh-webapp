import React from "react";
import { BsBagCheck, BsBarChartLine } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import SectionButtons from "../SectionButtons";
import { useSelector, useDispatch } from "react-redux";
import CardStatistics from "./CardStatistics";

const Card = ({ iconName, name, info, cardStatistics }) => {
  const navigate = useNavigate();
  const { data, currentProductIndex } = useSelector((state) => state.data);
  const buttons = data.map((item) => item.name);
  const navBtnRef = data.map((_, index) => React.createRef(null));

  // ! Defaults index is 0
  const [index, setIndex] = React.useState(0);

  const handelClick = () => {
    // Removing white space, and first letter in smaller case
    // Operation Metrics --> operationMetrics
    let pageName;
    pageName = name.replaceAll(" ", "");
    pageName = pageName.charAt(0).toLowerCase() + pageName.slice(1);
    navigate(`/${pageName}`);
  };

  const handelChange = (index) => {
    console.log("handelChange Pending");
    if (index !== 0) {
      return null;
    }
    setIndex(index);
  };

  return (
    <>
      <div className="home-card">
        <div className="home-card-left">
          {iconName === "bag" ? (
            <BsBagCheck className="home-card-left__icon" size={25} />
          ) : null}
          {iconName === "bar" ? (
            <BsBarChartLine className="home-card-left__icon" size={25} />
          ) : null}
          <div className="home-card-left__text">
            <h4 className="home-card-left__text--heading">{name}</h4>
            <p className="home-card-left__text--info">{info}</p>
          </div>
          <span
            onClick={handelClick}
            className="home-card-left--btn screen-btn"
          >
            See Details
          </span>
        </div>
        {/* //? right side */}
        <div className="home-card-right">
          <div className="section-btns section-btns-dashboard">
            {buttons.map((button, index) => (
              <span
                key={index}
                ref={navBtnRef[index]}
                className={
                  "nav-btn" + (index === currentProductIndex ? " active" : "")
                }
                onClick={(e) => handelChange(index)}
                disabled={index !== 0}
              >
                {button}
              </span>
            ))}
          </div>
            <CardStatistics cardStatistics={cardStatistics} />
        </div>
      </div>
    </>
  );
};

export default Card;
