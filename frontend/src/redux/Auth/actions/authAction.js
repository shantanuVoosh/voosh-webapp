import { ActionTypes } from "../actionTypes/actionType";

// ! Phone number login
export const loginSuccess = (token) => {
  return {
    type: ActionTypes.LOGIN_SUCCESS,
    payload: {
      token,
    },
  };
};

// ? error not used
export const loginFailure = (error) => {
  return {
    type: ActionTypes.LOGIN_FAILURE,
    payload: {
      error,
    },
  };
};
// ! TEMP login
export const tempLoginSuccess = (token) => {
  return {
    type: ActionTypes.TEMP_LOGIN_SUCCESS,
    payload: {
      token,
    },
  };
};
// ! TEMP login
export const tempLogout = () => {
  return {
    type: ActionTypes.TEMP_LOGOUT,
  };
};
// ! Dummy login
export const dummyLoginSuccess = (token) => {
  return {
    type: ActionTypes.DUMMY_LOGIN_SUCCESS,
    payload: {
      token,
    },
  };
};

export const signoutSuccess = () => {
  return {
    type: ActionTypes.SIGNOUT_SUCCESS,
  };
};

// ! Google login
// export const loginSuccessByGoogle = (token) => {
//   return {
//     type: ActionTypes.LOGIN_SUCCESS_BY_GOOGLE,
//     payload: {
//       token,
//     },
//   };
// };

// export const loginFailureByGoogle = (error) => {
//   return {
//     type: ActionTypes.LOGIN_FAILURE_BY_GOOGLE,
//     payload: {
//       error,
//     },
//   };
// };

// export const signoutSuccessByGoogle = () => {
//   return {
//     type: ActionTypes.SIGNOUT_SUCCESS_BY_GOOGLE,
//   };
// };
