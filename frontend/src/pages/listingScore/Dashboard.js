import React from "react";
import { useSelector } from "react-redux";
import Card from "../../components/listingScore/Card";
import CardWithNoData from "../../components/listingScore/CardWithNoData";
import ScrollButton from "../../components/ScrollButton";

const Dashboard = () => {
  const { data, currentProductIndex } = useSelector((state) => state.data);
  const listingScoreItems = data[currentProductIndex]["listingScore"];
  const listingScoreData = listingScoreItems["listingScoreData"];
  // console.log(listingScoreData);

  return (
    <>
      <div className="listing_score_cards">
        {listingScoreData.map((item, index) => {
          const {
            name,
            value,
            benchmark,
            info,
            compareThen,
            type,
            isDataPresent,
          } = item;
          // console.log( name, value, benchmark, compareThen, type)
          return isDataPresent ? (
            <Card
              key={index}
              name={name}
              value={value}
              benchmark={benchmark}
              info={info}
              compareThen={compareThen}
              type={type}
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

export default Dashboard;
