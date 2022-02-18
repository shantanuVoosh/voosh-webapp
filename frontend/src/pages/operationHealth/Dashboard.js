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
          name={"Reviews"}
          type={"average"}
          info={"Click Know More to understand better"}
          value={customerReviews.value}
          benchmark={4}
          compareThen={"grater"}
          redirection={"/customerReviews"}
          isDataPresent={true}
        />
        {operationHealthData.map((item, index) => {
          return item.isDataPresent ? (
            <Card
              key={index}
              name={item.name}
              type={item.type}
              value={item.value}
              info={item.info}
              monthlyResult={item.monthlyResult}
              weeklyResult={item.weeklyResult}
              benchmark={item.benchmark}
              compareThen={item.compareThen}
              videoLink={item.videoLink}
              recommendations={item.recommendations}
              isDataPresent={item.isDataPresent}
            />
          ) : (
            <CardWithNoData
              key={item.index}
              name={item.name}
              info={item.info}
            />
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
