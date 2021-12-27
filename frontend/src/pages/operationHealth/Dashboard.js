import React from "react";
import { useSelector } from "react-redux";
import Card from "../../components/operationHealth/Card";

const Dashborad = () => {
  const { data, currentProductIndex } = useSelector((state) => state.data);

  const operationHealthItems = data[currentProductIndex]["operationHealth"];
  const {operationHealthData} = operationHealthItems;

  const customerReviews = data[currentProductIndex]["customerReviews"];
  return (
    <>
      <div className="cards">
        {operationHealthData.map((item, index) => {
          const {
            name,
            type,
            value,
            info,
            benchmark,
            compareThen,
            monthlyResult,
            weeklyResult,
            videoLink,
            recommendations,
            isDataPresent,
          } = item;
          return (
            <Card
              key={index}
              name={name}
              type={type}
              value={value}
              info={info}
              monthlyResult={monthlyResult}
              weeklyResult={weeklyResult}
              benchmark={benchmark}
              compareThen={compareThen}
              videoLink={videoLink}
              recommendations={recommendations}
              isDataPresent={isDataPresent}
            />
          );
        })}
        <Card name={"Customer Reviews"} 
        type={"average"}
        info={"Customer Reviews are good or bad"}
        value={customerReviews.value}
        benchmark={4}
        compareThen={"grater"}
        redirection={"/customerReviews"}
        isDataPresent={true}
        />

      </div>
    </>
  );
};

export default Dashborad;
