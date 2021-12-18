import { ActionTypes } from "../actionTypes/actionTypes";

export const fetchData = (data, res_name) => {
    // console.log("res name", res_name);
    return {
        type: ActionTypes.FETCH_DATA,
        payload: {
            data,
            res_name
        }
    };
}
export const seetCurrentProductIndex = (index) => {
    return {
        type: ActionTypes.SET_CURRENT_PRODUCT_INDEX,
        payload: {
            currentProductIndex:index
        }
    };
}