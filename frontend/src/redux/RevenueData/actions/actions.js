import { ActionTypes } from "../actionTypes/actionTypes";

export const fetchRevenueData = (revenueValue, financialData) => {
  return {
    type: ActionTypes.FETCH_REVENUE_DATA,
    payload: {
      revenueValue,
      financialData,
    },
  };
};

export const clearRevenueData = () => {
  return {
    type: ActionTypes.CLEAR_REVENUE_DATA,
  };
};

export const updateRevenueData = (revenueValue) => {
  return {
    type: ActionTypes.UPDATE_REVENUE_DATA,
    payload: {
      revenueValue,
    },
  };
};
