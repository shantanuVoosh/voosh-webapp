import { ActionTypes } from "../actionTypes/actionTypes";
import { getCurrentMonthDate } from "../../../utils/dateProvider";

const initialState = {
  res_name: "",
  data: [],
  // cuz no at first we don't have any data
  currentProductIndex: -1,
  resultType: "This Month",
  restaurantList: [],
  // Todo new value for test
  allRestaurants: [],
  phone: "",
  swiggy_res_id: "",
  zomato_res_id: "",
  listingID: "",
  isLoading: false,
  res_id: "",
  date: getCurrentMonthDate(),
  startDate: "",
  endDate: "",
  oh_currentProductIndex: -1,
  ls_currentProductIndex: -1,
  sales_currentProductIndex: -1,
};

export const dataReducer = (state = initialState, action) => {
  const {
    FETCH_ALL_DATA,
    FETCH_DATA,
    SET_CURRENT_PRODUCT_INDEX,
    CLEAR_DATA,
    SET_RESULT_TYPE,
    SET_RESULT_TYPE_WITH_START_DATE_AND_END_DATE,
    IS_LOADING,
    SET_RESTAURANT_NAME_AND_ID,
    SET_LISTING_ID,
    SET_OH_PRODUCT_INDEX,
    SET_LS_PRODUCT_INDEX,
    SET_SALES_PRODUCT_INDEX,
  } = ActionTypes;
  const { type, payload } = action;

  console.log(payload, "payload");

  switch (type) {
    case FETCH_ALL_DATA:
      return {
        ...state,
        data: payload.data,
        res_name: payload.res_name,
        currentProductIndex: 0,
        restaurantList: payload.restaurantList,
        allRestaurants: payload.allRestaurants,
        res_id: payload.res_id,
        date: payload.date,
        oh_currentProductIndex: 0,
        ls_currentProductIndex: 0,
        sales_currentProductIndex: 0,
      };
    case SET_CURRENT_PRODUCT_INDEX:
      return {
        ...state,
        currentProductIndex: payload.currentProductIndex,
      };

    case SET_OH_PRODUCT_INDEX:
      return {
        ...state,
        oh_currentProductIndex: payload.oh_currentProductIndex,
      };

    case SET_LS_PRODUCT_INDEX:
      return {
        ...state,
        ls_currentProductIndex: payload.ls_currentProductIndex,
      };

    case SET_SALES_PRODUCT_INDEX:
      return {
        ...state,
        sales_currentProductIndex: payload.sales_currentProductIndex,
      };

    // ! Bring back to initial state
    case CLEAR_DATA:
      return {
        ...state,
        data: [],
        res_name: "",
        currentProductIndex: -1,
        restaurantList: [],
        allRestaurants: [],
        phone: "",
        swiggy_res_id: "",
        zomato_res_id: "",
        listingID: "",
        resultType: "This Month",
        isLoading: false,
        res_id: "",
        date: "",
        startDate: "",
        endDate: "",
      };
    case SET_RESULT_TYPE:
      return {
        ...state,
        resultType: payload.resultType,
        startDate: "",
        endDate: "",
      };

    case SET_RESULT_TYPE_WITH_START_DATE_AND_END_DATE:
      return {
        ...state,
        resultType: payload.resultType,
        startDate: payload.startDate,
        endDate: payload.endDate,
      };

    case IS_LOADING:
      return {
        ...state,
        isLoading: payload.isLoading,
      };

    case SET_RESTAURANT_NAME_AND_ID:
      return {
        ...state,
        res_name: payload.res_name,
        res_id: payload.res_id,
      };

    case FETCH_DATA:
      return {
        ...state,
        data: payload.data,
        date: payload.date,
        // currentProductIndex: 0,
      };

    case SET_LISTING_ID:
      return {
        ...state,
        swiggy_res_id: payload.swiggy_res_id,
        zomato_res_id: payload.zomato_res_id,
        listingID: payload.listingID,
        res_name: payload.res_name,
      };

    default:
      return state;
  }
};
