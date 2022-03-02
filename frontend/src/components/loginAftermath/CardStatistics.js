import React from "react";
import { AiOutlineRise, AiOutlineFall } from "react-icons/ai";

const CardStatistics = ({ cardStatistics }) => {
  const {
    name,
    value: currentValue,
    change,
    benchmark,
    changeTypeDirection,
    type,
    isDataPresent,
  } = cardStatistics;

  console.log({
    name,
    value: currentValue,
    change,
    benchmark,
    changeTypeDirection,
    type,
    isDataPresent,
  });

  // ? handle Error if no data
  if (!isDataPresent && name !== "Customer Reviews") {
    return (
      <>
        <div className=" error-card green">
          {/* //?top value */}
          <div className="error-value ">Working on it,</div>
          <div className="error-info ">coming soon.</div>
        </div>
      </>
    );
  }
  if (!isDataPresent) {
    return (
      <>
        <div className=" error-card green">
          {/* //?top value */}
          <div className="card-statistics__info">
            <span
              className="green"
              style={{
                fontSize: "15px",
                padding: "0.5rem 0",
                fontWeight: "700",
                // "@media (max-width: 360px)": {
                //   fontSize: "15px",
                // },
              }}
            >
              {" "}
              Rating not
              <br />
              available
            </span>
          </div>
        </div>
      </>
    );
  }

  // ?Else Show the value
  let value = parseFloat(currentValue.toFixed(1));
  const diff = parseFloat((value - change).toFixed(1));

  return (
    <>
      <div className="card-statistics__value">
        {/* //?top value */}
        <span className="icon-box">
          {changeTypeDirection === "up" ? (
            <AiOutlineRise className="green rise-fall_icon" size={25} />
          ) : (
            <AiOutlineFall className="red rise-fall_icon" size={25} />
          )}
        </span>
        {type === "money" && (
          <span
            className={`value ${
              changeTypeDirection === "up" ? "green" : "red"
            }`}
          >
            {value.toLocaleString("en-IN", {
              maximumFractionDigits: 2,
              style: "currency",
              currency: "INR",
            })}
          </span>
        )}

        {type === "number" && (
          <span
            className={`value ${
              changeTypeDirection === "up" ? "green" : "red"
            }`}
          >
            {value}
          </span>
        )}
      </div>

      {/* //! Customer Review */}
      {name === "Revenue" && isDataPresent ? (
        <>
          <div className="card-statistics__info">
            competition comparison
            <br /> coming soon
          </div>
        </>
      ) : null}
      {/* //! Customer Review */}
      {name === "Customer Reviews" && isDataPresent ? (
        <>
          <div className="card-statistics__info">
            <span
              className={
                "change " + `${diff >= 0 ? "change-green" : "change-red"}`
              }
            >
              {diff >= 0 ? `${diff} above target` : `${diff} below target`}
            </span>
          </div>
        </>
      ) : null}

      {/* //? for no rating */}
      {name === "Customer Reviews" && !isDataPresent ? (
        <>
          <div className="card-statistics__info">
            <span
              className="green"
              style={{
                fontSize: "10px",
                padding: "0.5rem 0",
                fontWeight: "700",
                "@media (max-width: 360px)": {
                  fontSize: "15px",
                },
              }}
            >
              {" "}
              Rating not available
            </span>
          </div>
        </>
      ) : null}
    </>
  );
};

export default CardStatistics;
