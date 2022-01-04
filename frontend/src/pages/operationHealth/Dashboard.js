import React from "react";
import { useSelector } from "react-redux";
import Card from "../../components/operationHealth/Card";
import CardWithNoData from "../../components/operationHealth/CardWithNoData";
import ScrollButton from "../../components/ScrollButton";

const Dashborad = () => {
  const { data, currentProductIndex } = useSelector((state) => state.data);

  const operationHealthItems = data[currentProductIndex]["operationHealth"];
  const { operationHealthData } = operationHealthItems;

  const customerReviews = data[currentProductIndex]["customerReviews"];
  return (
    <>
      <div className="op_cards">
        <Card
          name={"Customer Reviews"}
          type={"average"}
          info={"Customer Reviews are good or bad"}
          value={customerReviews.value}
          benchmark={4}
          compareThen={"grater"}
          redirection={"/customerReviews"}
          isDataPresent={true}
        />
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
          return isDataPresent ? (
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
          ) : (
            <CardWithNoData key={index} name={name} info={info} />
          );
        })}
      </div>
      <div className="">
        <ScrollButton />
      </div>
    </>
  );
};

export default Dashborad;
