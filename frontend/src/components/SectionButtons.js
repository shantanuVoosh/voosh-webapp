import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setCurrentProductIndex,
  setOhProductIndex,
  setLSProductIndex,
  setSalesProductIndex,
} from "../redux/Data/actions/actions";

const SectionButtons = ({ sectionName, isSalesPage }) => {
  const dispatch = useDispatch();
  const {
    data,
    oh_currentProductIndex,
    ls_currentProductIndex,
    sales_currentProductIndex,
  } = useSelector((state) => state.data);

  const [productIndex, setProductIndex] = React.useState(-1);

  const buttons = data.map((item) => item.name);
  const navBtnRef = data.map((_, index) => React.createRef(null));

  React.useEffect(() => {
    console.log(sectionName, "sectionName");
    // ?for the first time
    // ! OH
    if (sectionName === "Operation Health") {
      setProductIndex(oh_currentProductIndex);
    }
    // ! LS
    else if (sectionName === "Listing Score") {
      setProductIndex(ls_currentProductIndex);
    }
    // ! Sales
    else if (sectionName === "Sales") {
      setProductIndex(sales_currentProductIndex);
    }
  }, [
    sectionName,
    oh_currentProductIndex,
    ls_currentProductIndex,
    sales_currentProductIndex,
  ]);

  const handelChange = (index) => {
    // if(index !== 0) {
    //   return null
    // }
    console.log(sectionName, "sectionName");

    if (sectionName === "Operation Health") {
      dispatch(setOhProductIndex(index));
    }
    // ! LS
    else if (sectionName === "Listing Score") {
      dispatch(setLSProductIndex(index));
    }
    // ! Sales
    else if (sectionName === "Sales") {
      dispatch(setSalesProductIndex(index));
    }

    // dispatch(setCurrentProductIndex(index));
  };

  //   * if data is empty we can't render buttons
  if (data.length <= 0) return null;
  console.log(productIndex, "productIndex");
  return (
    <div className="section-btns">
      {buttons.map((button, index) => (
        <span
          key={index}
          ref={navBtnRef[index]}
          className={
            isSalesPage === true
              ? "nav-btn-white" +
                (index === productIndex ? " active-white" : "")
              : "nav-btn" + (index === productIndex ? " active" : "")
          }
          onClick={(e) => handelChange(index)}
          // disabled={index !== 0}
        >
          {button}
        </span>
      ))}
    </div>
  );
};

export default SectionButtons;
