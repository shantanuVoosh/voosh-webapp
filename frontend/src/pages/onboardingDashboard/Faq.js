import React from "react";
import MetaTags from "react-meta-tags";
import Footer from "../../components/onboardingDashboard/Footer";
import Header from "../../components/onboardingDashboard/Header";
import FAQArray from "../../utils/faqArray";
import { FiArrowUpCircle, FiArrowDownCircle } from "react-icons/fi";

const FAQ = (props) => {
  const {
    changePage,
    pageName,
    currentUserDetails,
    userAllNotifications,
    setUserAllNotifications,
    numberOfNotifications,
    setNumberOfNotifications,
  } = props;

  const [isListOpenArray, setIsListOpenArray] = React.useState([]);

  const { name, email, restaurantName, phoneNumber } = currentUserDetails;

  React.useEffect(() => {
    setIsListOpenArray(Array(FAQArray.length).fill(false));
  }, []);

  return (
    <>
      <MetaTags>
        <title>Voosh | User-Profile</title>
        <meta
          name="voosh web app,  User-Profile page"
          content="voosh User-Profile page"
        />
        <meta property="og:title" content="web-app" />
      </MetaTags>
      <div className="onboard-faq ">
        <Header
          changePage={changePage}
          pageName={pageName}
          userAllNotifications={userAllNotifications}
          setUserAllNotifications={setUserAllNotifications}
          numberOfNotifications={numberOfNotifications}
          setNumberOfNotifications={setNumberOfNotifications}
        />
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
                              {"- "}{point}
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

        <Footer changePage={changePage} pageName={pageName} />
      </div>
    </>
  );
};

export default FAQ;
