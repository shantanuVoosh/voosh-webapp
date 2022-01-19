import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { seetCurrentProductIndex } from "../redux/Data/actions/actions";

const SectionButtons = () => {
  const dispatch = useDispatch();
  const { data, currentProductIndex } = useSelector((state) => state.data);
  const buttons = data.map((item) => item.name);
  const navBtnRef = data.map((_, index) => React.createRef(null));

  const handelChange = (index) => {
    // if(index !== 0) {
    //   return null
    // }
    dispatch(seetCurrentProductIndex(index));
  };

  //   * if data is empty we can't render buttons
  if (data.length <= 0) return null;

  return (
    <div className="section-btns">
      {buttons.map((button, index) => (
        <span
          key={index}
          ref={navBtnRef[index]}
          className={
            "nav-btn" 
            + 
            (index === currentProductIndex ? " active" : "")
          }
          
          onClick={(e) => handelChange(index)}
          disabled={index !== 0}
        >
          {button}
        </span>
      ))}
    </div>
  );
};

export default SectionButtons;
