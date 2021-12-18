import cookie from "react-cookies";
import { ActionTypes } from "../actionTypes/actionType";

// TODO: remove the hardcoded values
const APP_TOKEN_BY_GOOGLE = "voosh-token-by-google";
const APP_TOKEN = "voosh-token";

const initialAuthState = {
  isAuthenticated: cookie.load(APP_TOKEN)? true : false,
  token: cookie.load(APP_TOKEN) || null,
};

export const authReducer = (state = initialAuthState, action) => {
  const { LOGIN_FAILURE, LOGIN_SUCCESS, SIGNOUT_SUCCESS } = ActionTypes;
  const { type, payload } = action;

  switch (type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        token: payload.token,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        token:null,
      };
    case SIGNOUT_SUCCESS:
      return {
        ...state,
        isAuthenticated: false,
        token: null,
      };
    default:
      return state;
  }
};
