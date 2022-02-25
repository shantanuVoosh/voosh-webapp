import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  // setCurrentProductIndex,
  setOhProductIndex,
  setLSProductIndex,
  setSalesProductIndex,
  setCustomerReviewsProductIndex,
} from "../redux/Data/actions/actions";

const SectionButtons = ({ sectionName, isSalesPage }) => {
  const dispatch = useDispatch();
  const {
    data,
    oh_currentProductIndex,
    ls_currentProductIndex,
    sales_currentProductIndex,
    customer_reviews_currentProductIndex,
    swiggy_res_id: swiggy_res_id_inside_state,
    zomato_res_id: zomato_res_id_inside_state,
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
    // ! Customer Reviews
    else if (sectionName === "Customer Reviews") {
      setProductIndex(customer_reviews_currentProductIndex);
    }
  }, [
    sectionName,
    oh_currentProductIndex,
    ls_currentProductIndex,
    sales_currentProductIndex,
    customer_reviews_currentProductIndex,
  ]);

  const handelChange = (index) => {
    // if(index !== 0) {
    //   return null
    // }
    console.log(sectionName, "sectionName");

    // ! OH
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
    // ! Customer Reviews
    else if (sectionName === "Customer Reviews") {
      dispatch(setCustomerReviewsProductIndex(index));
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
            // Todo: Old Check
            // isSalesPage === true
            //   ? "nav-btn-white" +
            //     (index === productIndex ? " active-white" : "")
            //   : "nav-btn" + (index === productIndex ? " active" : "")

            // ?new Checking
            isSalesPage === true
              ? // ! Sales
                index === 0 && swiggy_res_id_inside_state === null
                ? "nav-btn-white nav-btn-disable-white"
                : index === 1 && zomato_res_id_inside_state === null
                ? "nav-btn-white nav-btn-disable-white"
                : (index === productIndex ? " active-white" : "") +
                  " nav-btn-white"
              : // ! this for common for all the pages except sales
              index === 0 && swiggy_res_id_inside_state === null
              ? "nav-btn nav-btn-disable"
              : index === 1 && zomato_res_id_inside_state === null
              ? "nav-btn nav-btn-disable"
              : (index === productIndex ? " active" : "") + " nav-btn"
          }
          onClick={(e) => {
            if (
              (index === 0 && swiggy_res_id_inside_state === null) ||
              (index === 1 && zomato_res_id_inside_state === null)
            ) {
              return;
            }
            console.log("click index", index);

            handelChange(index);
          }}
          // disabled={index !== 0}
        >
          {button}
        </span>
      ))}
    </div>
  );
};

export default SectionButtons;
