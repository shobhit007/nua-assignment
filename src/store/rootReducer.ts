import { combineReducers } from "@reduxjs/toolkit";

import analyticsReducer from "./slices/analyticsSlice";
import cartReducer from "./slices/cartSlice";

export const rootReducer = combineReducers({
  cart: cartReducer,
  analytics: analyticsReducer,
});
