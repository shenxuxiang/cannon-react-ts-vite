import { createStore, applyMiddleware, combineReducers } from "redux";
import { reducer } from "@/models/index";
import reduxThunk from "redux-thunk";

export default applyMiddleware(reduxThunk)(createStore)(
  combineReducers({ main: reducer })
);
