import React from "react";
import MetaTags from "react-meta-tags";
import FAQArray from "../../utils/faqArray";
import { FiArrowUpCircle, FiArrowDownCircle } from "react-icons/fi";
import StaticHeader from "../../components/StaticHeader"
import Footer from "../../components/Footer";

const FAQ = (props) => {
  const [userDeatils, setUserDeatils] = React.useState({
    email: "test@gamil.com",
    restaurantName: "xyz Restaurant",
    phoneNumber: "7008237257",
    zomatoNumber: "7008237257",
    swiggyNumber: "7008237257",
    swiggyPassword: "donotshare",
    userName: "test",
  });

  const [isListOpenArray, setIsListOpenArray] = React.useState([]);

  const { name, email, restaurantName, phoneNumber } = userDeatils;

  React.useEffect(() => {
    setIsListOpenArray(Array(FAQArray.length).fill(false));
  }, []);

  return (
    <>
     
      <div className="onboard-faq ">
      <StaticHeader name={"FAQ"} addBtn={false} />
        <div className="onboard-faq-container">
          <div className="onboard-faq__head">
            <h1 className="title">FAQ</h1>
          </div>
          <div className="onboard-faq__body">
            {FAQArray.map((faq, index) => {
              const { question, answer, points } = faq;
              return (
                <div className="onboard-faq__body--item" key={index}>
                  <div
                    className="question"
                    onClick={() => {
                      // ? if user again clicks on the same question, it will close
                      if (isListOpenArray[index]) {
                        setIsListOpenArray(Array(FAQArray.length).fill(false));
                        return;
                      }

                      // ? if user clicks on a different question, it will close all the other questions
                      setIsListOpenArray((prevState) => {
                        // let newState = [...prevState];
                        let newState = Array(FAQArray.length).fill(false);
                        newState[index] = !newState[index];
                        return newState;
                      });
                    }}
                  >
                    <h3>{question}</h3>
                    {/* <div className="icon">
                      <FiArrowDownCircle />
                    </div> */}
                  </div>
                  <div
                    className="answer"
                    style={{
                      display: isListOpenArray[index] ? "block" : "none",
                    }}
                  >
                    <div className="answer--text">
                      <p>{answer}</p>
                    </div>
                    {points.length !== 0 && (
                      <div className="answer--points">
                        {points.map((point, point_index) => {
                          return (
                            <div className="point" key={point_index}>
                              {"- "}
                              {point}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default FAQ;
