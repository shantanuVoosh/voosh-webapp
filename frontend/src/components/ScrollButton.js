import React from "react";

const ScrollButton = () => {
  const [visible, setVisible] = React.useState(false);


  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 300) {
      setVisible(true);
    } else if (scrolled <= 300) {
      setVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  window.addEventListener("scroll", toggleVisible);

  return <p  onClick={scrollToTop} className="back_to_top-btn" style={{ display: visible ? "inline" : "none" }}>Back To Top</p>;
};

export default ScrollButton;
