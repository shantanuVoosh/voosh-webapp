import { ActionTypes } from "../actionTypes/actionTypes";

const initialState = {
  res_name: "",
  data: [],
  // cuz no at first we don't have any data
  currentProductIndex: -1,
  resultType: "This Week",
  restaurantList: [],
  isLoading: false,
  res_id: "",
  date:"",
};

export const dataReducer = (state = initialState, action) => {
  const {
    FETCH_ALL_DATA,
    FETCH_DATA,
    SET_CURRENT_PRODUCT_INDEX,
    CLEAR_DATA,
    SET_RESULT_TYPE,
    IS_LOADING,
    SET_RESTAURANT_NAME_AND_ID,
  } = ActionTypes;
  const { type, payload } = action;

  switch (type) {
    case FETCH_ALL_DATA:
      return {
        ...state,
        data: payload.data,
        res_name: payload.res_name,
        currentProductIndex: 0,
        restaurantList: payload.restaurantList,
        res_id: payload.res_id,
        date:payload.date,
      };
    case SET_CURRENT_PRODUCT_INDEX:
      return {
        ...state,
        currentProductIndex: payload.currentProductIndex,
      };
    // ? Bring back to initial state
    case CLEAR_DATA:
      return {
        ...state,
        data: [],
        res_name: "",
        currentProductIndex: -1,
        restaurantList: [],
        resultType: "This Week",
        isLoading: false,
        res_id: "",
      };
    case SET_RESULT_TYPE:
      return {
        ...state,
        resultType: payload.resultType,
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
        date:payload.date,
      };

    default:
      return state;
  }
};
