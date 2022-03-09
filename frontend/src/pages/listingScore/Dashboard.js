import React from "react";
import { useSelector } from "react-redux";
import Card from "../../components/listingScore/Card";
import CardWithNoData from "../../components/listingScore/CardWithNoData";
import ScrollButton from "../../components/ScrollButton";
import MultiCard from "../../components/listingScore/MultiCard";

const Dashboard = () => {
  const { data, ls_currentProductIndex } = useSelector((state) => state.data);
  const listingScoreItems = data[ls_currentProductIndex]["listingScore"];
  const listingScoreData = listingScoreItems["listingScoreData"];
  const productIndex = ls_currentProductIndex;
  // ? for single cards
  const [listingCardsData, setListingCardsData] = React.useState([]);

  // ? for multiple cards
  const [listingMultiCard, setListingMultiCard] = React.useState([]);

  React.useEffect(() => {
    // ?remove offer card and item and description
    const singleCards = listingScoreData.filter((item) => {
      return (
        item.contentType !== "offer" && item.contentType !== "image/description"
      );
    });
    setListingCardsData(singleCards);

    // ? for multi card
    const offerCard = listingScoreData.filter((item) => {
      return item.contentType === "offer";
    });
    const imageAndDescriptionCard = listingScoreData.filter((item) => {
      return item.contentType === "image/description";
    });

    if (offerCard.length > 0 || imageAndDescriptionCard.length > 0) {
      setListingMultiCard([offerCard, imageAndDescriptionCard]);
    }
    else if(offerCard.length === 0 && imageAndDescriptionCard.length === 0){
      setListingMultiCard([])
    }
    // ? zomato pe we dont have multi card  for now
    // if (ls_currentProductIndex === 1) {
    //   setListingMultiCard([]);
    // }
  }, [ls_currentProductIndex]);

  console.log(listingMultiCard, "multicards");

  return (
    <>
      <div className="listing_score_cards">
        {listingCardsData.map((item, index) => {
          const {
            name,
            value,
            benchmark,
            info,
            compareThen,
            type,
            isDataPresent,
          } = item;

          return isDataPresent ? (
            <Card
              key={index}
              name={name}
              value={value}
              benchmark={benchmark}
              info={info}
              compareThen={compareThen}
              type={type}
              productIndex={productIndex}
              isDataPresent={isDataPresent}
            />
          ) : (
            <CardWithNoData key={index} name={name} info={info} />
          );
        })}
      </div>
      <div className="listing_score_cards">
        {listingMultiCard.length > 0 &&
          listingMultiCard.map((item, index) => {
            return (
              <div className="listing_score_m-card" key={index}>
                <MultiCard data={item}
                productIndex={productIndex}
                />
              </div>
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
