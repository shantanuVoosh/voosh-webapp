import { ActionTypes } from "../actionTypes/actionTypes";

export const fetchAllData = ({
  data,
  res_name,
  restaurantList = [],
  res_id,
  date,
  allRestaurants,
}) => {
  // console.log("res name", res_name);
  return {
    type: ActionTypes.FETCH_ALL_DATA,
    payload: {
      data,
      res_name,
      restaurantList,
      allRestaurants,
      res_id,
      date,
    },
  };
};

export const fetchData = ({ data, date }) => {
  return {
    type: ActionTypes.FETCH_DATA,
    payload: {
      data,
      date,
    },
  };
};

export const seetCurrentProductIndex = (index) => {
  return {
    type: ActionTypes.SET_CURRENT_PRODUCT_INDEX,
    payload: {
      currentProductIndex: index,
    },
  };
};

export const clearData = () => {
  console.log("clear data");
  return {
    type: ActionTypes.CLEAR_DATA,
  };
};

export const setResultType = (type) => {
  return {
    type: ActionTypes.SET_RESULT_TYPE,
    payload: {
      resultType: type,
    },
  };
};

export const isLoading = (isLoading) => {
  return {
    type: ActionTypes.IS_LOADING,
    payload: {
      isLoading,
    },
  };
};

export const setRestaurantNameAndId = (name, id) => {
  return {
    type: ActionTypes.SET_RESTAURANT_NAME_AND_ID,
    payload: {
      res_name: name,
      res_id: id,
    },
  };
};
export const setListingIdWithRestaurantDetails = ({
  listingID,
  swiggy_res_id,
  zomato_res_id,
  restaurant_name,
}) => {
  return {
    type: ActionTypes.SET_LISTING_ID,
    payload: {
      listingID: listingID,
      swiggy_res_id,
      zomato_res_id,
      res_name: restaurant_name,
    },
  };
};

export const setResultTypeWithStartDateAndEndDate = (
  type,
  startDate,
  endDate
) => {
  return {
    type: ActionTypes.SET_RESULT_TYPE_WITH_START_DATE_AND_END_DATE,
    payload: {
      resultType: type,
      startDate,
      endDate,
    },
  };
};
