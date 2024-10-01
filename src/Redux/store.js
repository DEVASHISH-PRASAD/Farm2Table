import { configureStore } from "@reduxjs/toolkit";

import authSliceReducer from './Slices/AuthSlice'
import ProductSliceReducer from "./Slices/ProductSlice";
const store = configureStore({
  reducer: {
    auth: authSliceReducer,
    products:ProductSliceReducer
  },
});

export default store;
