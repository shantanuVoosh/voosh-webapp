import cookie from "react-cookies";
import { ActionTypes } from "../actionTypes/actionType";

// TODO: remove the hardcoded values
const APP_TOKEN_BY_GOOGLE = "voosh-token-by-google";
const APP_TOKEN = "voosh-token";
const TEMP_APP_TOKEN = "temp-voosh-token";

const initialAuthState = {
  isAuthenticated: cookie.load(APP_TOKEN) ? true : false,
  token: cookie.load(APP_TOKEN) || null,
  isTemporaryAuthenticated: cookie.load(TEMP_APP_TOKEN) ? true : false,
  temporaryToken: cookie.load(TEMP_APP_TOKEN) || null,
  dummyUser: false,
  isDummyUserAuthenticated: cookie.load(APP_TOKEN) ? true : false,
};

export const authReducer = (state = initialAuthState, action) => {
  const {
    LOGIN_FAILURE,
    LOGIN_SUCCESS,
    SIGNOUT_SUCCESS,
    TEMP_LOGIN_SUCCESS,
    TEMP_LOGIN_FAILURE,
    DUMMY_LOGIN_SUCCESS,
    TEMP_LOGOUT,
  } = ActionTypes;
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
        token: null,
        isTemporaryAuthenticated: false,
        temporaryToken: null,
        dummyUser: false,
        isDummyUserAuthenticated: false,
      };
    case TEMP_LOGIN_SUCCESS:
      return {
        ...state,
        isTemporaryAuthenticated: true,
        temporaryToken: payload.token,
      };
    case TEMP_LOGOUT:
      return {
        ...state,
        isTemporaryAuthenticated: false,
        temporaryToken: null,
      };
    case TEMP_LOGIN_FAILURE:
      return {
        ...state,
        isTemporaryAuthenticated: false,
        temporaryToken: null,
        dummyUser: false,
        isDummyUserAuthenticated: false,
      };

    case SIGNOUT_SUCCESS:
      return {
        ...state,
        isAuthenticated: false,
        token: null,
        isTemporaryAuthenticated: false,
        temporaryToken: null,
        dummyUser: false,
        isDummyUserAuthenticated: false,
      };
    // ? only for showing static data, im doing it!
    case DUMMY_LOGIN_SUCCESS:
      return {
        ...state,
        token: payload.token,
        dummyUser: true,
        isDummyUserAuthenticated: true,
      };

    default:
      return state;
  }
};
