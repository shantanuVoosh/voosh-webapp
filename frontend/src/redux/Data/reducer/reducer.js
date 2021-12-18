import { ActionTypes } from "../actionTypes/actionTypes";

const initialState = {
  res_name: "",
  data: [],
  // cuz no at first we don't have any data
  currentProductIndex: -1,
  resultType:"week",

};

export const dataReducer = (state = initialState, action) => {
  const { FETCH_DATA } = ActionTypes;
  const { type, payload } = action;

  switch (type) {
    case FETCH_DATA:
      return {
        ...state,
        data: payload.data,
        res_name: payload.res_name,
        currentProductIndex: 0,
      };
      case "SET_CURRENT_PRODUCT_INDEX":
        return {
          ...state,
          currentProductIndex: payload.currentProductIndex,
        }
    default:
      return state;
  }
};
