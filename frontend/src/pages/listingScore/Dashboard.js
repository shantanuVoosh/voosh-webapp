import React from "react";

import { useSelector } from "react-redux";
import Card from "../../components/listingScore/Card";

const Dashboard = () => {
  const { data, currentProductIndex } = useSelector((state) => state.data);
  const listingScoreItems = data[currentProductIndex]["listingScore"];
  const listingScoreData = listingScoreItems["listingScoreData"];
  console.log(listingScoreData);
  const items = Object.keys(listingScoreData).filter((itemName) => {
    return (
      itemName !== "Date" &&
      itemName !== "Res Id" &&
      itemName !== "URL" &&
      itemName !== "_id"
    );
  });
  console.log(items);

  return (
    <>
      <div className="cards">
        {items.map((itemName, index) => {
          const { name, value, benchmark, compareThen } = listingScoreData[itemName];
          console.log( name, value, benchmark, compareThen )
          return (
            <Card
              key={index}
              name={name}
              value={value}
              compareThen={compareThen}
              benchmark={benchmark}
            />
          );
        })}
      </div>
    </>
  );
};

export default Dashboard;
