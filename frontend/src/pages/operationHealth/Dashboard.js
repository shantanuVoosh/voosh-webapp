import React from "react";
import { useSelector } from "react-redux";
import Card from "../../components/operationHealth/Card";

const Dashborad = () => {
  const { data, currentProductIndex } = useSelector((state) => state.data);
  const operationHealthItems = data[currentProductIndex]["operationHealth"];
  const operationHealthData = operationHealthItems["operationHealthData"];

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
            />
          );
        })}
      </div>
    </>
  );
};

export default Dashborad;
