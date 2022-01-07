import React from "react";
import { BsArrowUp } from "react-icons/bs";

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
  return (
    <>
      <div
        className="back-to-top"
        style={{ display: visible ? "flex" : "none" }}
        onClick={scrollToTop}
      >
        <p className="text">Back To Top</p>
        <BsArrowUp size={12} />
      </div>
    </>
  );
};

export default ScrollButton;
