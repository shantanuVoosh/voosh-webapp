import { ActionTypes } from "../actionTypes/actionTypes";

const initialState = {
  res_name: "",
  data: [],
  // cuz no at first we don't have any data
  currentProductIndex: -1,
  resultType: "week",
  restaurantList: [],
};

export const dataReducer = (state = initialState, action) => {
  const { FETCH_DATA, SET_CURRENT_PRODUCT_INDEX, CLEAR_DATA } = ActionTypes;
  const { type, payload } = action;

  switch (type) {
    case FETCH_DATA:
      return {
        ...state,
        data: payload.data,
        res_name: payload.res_name,
        currentProductIndex: 0,
        restaurantList: payload.restaurantList,
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
      };
    default:
      return state;
  }
};
