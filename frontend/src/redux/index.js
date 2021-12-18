import { combineReducers } from "redux";
import { authReducer } from "./Auth/reducer/authReducer";
import { dataReducer } from "./Data/reducer/reducer";
// Add all the reducers here
const reducers = combineReducers({auth:authReducer, data:dataReducer});

export default reducers;