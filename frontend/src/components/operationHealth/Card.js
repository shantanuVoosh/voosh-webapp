import React from "react";
import { AiOutlineRight } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { AiOutlineRise, AiOutlineFall } from "react-icons/ai";
import CardWithNoData from "./CardWithNoData";
import { VscPreview } from "react-icons/vsc";

const Card = (props) => {
  const resultType = useSelector((state) => state.resultType);
  const {
    name,
    value,
    info,
    type,
    benchmark,
    compareThen,
    redirection,
    videoLink,
    recommendations,
    isDataPresent,
  } = props;

 

  // !temp change Customer Reviews
  if (name === "Reviews") {
    return (
      <>
        <div className="op_card">
          <div className="op_card__text">
            <h5 className="op_card__text--heading">{name}</h5>

            <div
              className={`green`}
              style={{
                marginTop: ".56rem",
              }}
            >
              <VscPreview size={30} />
            </div>

            <div className="op_card__text--info">
              <p
                style={
                  {
                    // fontSize: "14px",
                  }
                }
              >
                {info}
              </p>
            </div>
          </div>
          {/* //! sending data from this page */}
          {/* //? redirect for special op_card */}
          {redirection ? (
            <>
              <Link to={redirection} className="op_card__btn">
                <span className="op_card__btn--text">Know more</span>
                <AiOutlineRight className="op_card__btn--icon " />
              </Link>
            </>
          ) : (
            <>
              <Link
                to={`${name.replace(/\s/g, "")}`}
                state={{
                  name,
                  value,
                  benchmark,
                  compareThen,
                  videoLink,
                  recommendations,
                  type,
                }}
                className="op_card__btn"
              >
                <span className="op_card__btn--text">Know more</span>
                <AiOutlineRight className="op_card__btn--icon" />
              </Link>
            </>
          )}
        </div>
      </>
    );
  }

  // !temp change
  if (name === "Rating") {
    return (
      <>
        <div className="op_card">
          <div className="op_card__text">
            <h5 className="op_card__text--heading">{name}</h5>

            {value === 0 && (
              <div
                className={`green`}
                style={{
                  fontSize: "15px",
                  // marginBottom: "1rem",
                  padding: "0.5rem 0",
                  fontWeight: "700",
                }}
              >
                Rating not available
              </div>
            )}
            {value !== 0 && compareThen === "grater" && (
              <div
                className={
                  value >= benchmark ? "green-value value" : "red-value value"
                }
              >
                {/* //? rise and fall and avg or percentange  */}
                {value >= benchmark ? (
                  <AiOutlineRise className="rise-fall_icon" />
                ) : (
                  <AiOutlineFall className="rise-fall_icon" />
                )}
                {value}
                {type === "average" ? "" : "%"}
              </div>
            )}
            {value !== 0 && compareThen === "less" && (
              <div
                className={
                  value <= benchmark ? "green-value value" : "red-value value"
                }
              >
                {/* { value <= benchmark && <AiOutlineRise/>} */}
                {value <= benchmark ? (
                  <AiOutlineRise className="rise-fall_icon" />
                ) : (
                  <AiOutlineFall className="rise-fall_icon" />
                )}
                {value}%
              </div>
            )}

            <div className="op_card__text--info">
              <p
                style={
                  {
                    // fontSize: "14px",
                  }
                }
              >
                {info}
              </p>
            </div>
          </div>

          <Link
            to={`${name.replace(/\s/g, "")}`}
            state={{
              name,
              value,
              benchmark,
              compareThen,
              videoLink,
              recommendations,
              type,
            }}
            className="op_card__btn"
          >
            <span className="op_card__btn--text">Know more</span>
            <AiOutlineRight className="op_card__btn--icon" />
          </Link>
        </div>
      </>
    );
  }

  return (
    <div className="op_card">
      <div className="op_card__text">
        <h5 className="op_card__text--heading">{name}</h5>
        {compareThen === "grater" && (
          <div
            className={
              value >= benchmark ? "green-value value" : "red-value value"
            }
          >
            {/* //? rise and fall and avg or percentange  */}
            {value >= benchmark ? (
              <AiOutlineRise className="rise-fall_icon" />
            ) : (
              <AiOutlineFall className="rise-fall_icon" />
            )}
            {value}
            {type === "average" ? "" : "%"}
          </div>
        )}
        {compareThen === "less" && (
          <div
            className={
              value <= benchmark ? "green-value value" : "red-value value"
            }
          >
            {/* { value <= benchmark && <AiOutlineRise/>} */}
            {value <= benchmark ? (
              <AiOutlineRise className="rise-fall_icon" />
            ) : (
              <AiOutlineFall className="rise-fall_icon" />
            )}
            {value}%
          </div>
        )}

        <div className="op_card__text--info">
          <p>{info}</p>
        </div>
      </div>
      {/* //! sending data from this page */}
      {/* //? redirect for special op_card */}
      {redirection ? (
        <>
          <Link to={redirection} className="op_card__btn">
            <span className="op_card__btn--text">Know more</span>
            <AiOutlineRight className="op_card__btn--icon " />
          </Link>
        </>
      ) : (
        <>
          <Link
            to={`${name.replace(/\s/g, "")}`}
            state={{
              name,
              value,
              benchmark,
              compareThen,
              videoLink,
              recommendations,
              type,
            }}
            className="op_card__btn"
          >
            <span className="op_card__btn--text">Know more</span>
            <AiOutlineRight className="op_card__btn--icon" />
          </Link>
        </>
      )}
    </div>
  );
};

export default Card;
