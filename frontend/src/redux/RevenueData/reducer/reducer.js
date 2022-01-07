import { ActionTypes } from "../actionTypes/actionTypes";

const initialState = {
  revenueValue: "",
  financialData: {},
};

export const revenueDataReducer = (state = initialState, action) => {
  const { FETCH_REVENUE_DATA, CLEAR_REVENUE_DATA, UPDATE_REVENUE_DATA } =
    ActionTypes;

  const { type, payload } = action;

  switch (type) {
    case FETCH_REVENUE_DATA:
      return {
        revenueValue: payload.revenueValue,
        financialData: payload.financialData,
      };
    case CLEAR_REVENUE_DATA:
      return {
        revenueValue: "",
        financialData: {},
      };

    case UPDATE_REVENUE_DATA:
      return {
        ...state,
        revenueValue: payload.revenueValue,
      };

    default:
      return state;
  }
};
