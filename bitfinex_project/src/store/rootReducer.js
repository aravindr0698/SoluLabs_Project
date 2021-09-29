import  { tickerReducer }  from "./tickerReducer";
import  { orderBookReducer }  from "./orderBookReducer";
import { combineReducers } from "redux";

export const rootReducers = combineReducers({
  ticker: tickerReducer,
  orderBook : orderBookReducer,
});