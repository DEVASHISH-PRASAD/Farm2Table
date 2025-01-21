import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from './Slices/AuthSlice'
import ProductSliceReducer from "./Slices/ProductSlice";
import CartSliceReducer from "./Slices/CartSlice";
import AdminUserSliceReducer from "./Slices/AdminUserSlice"
const store = configureStore({
  reducer: {
    auth: authSliceReducer,
    products: ProductSliceReducer,
    cart: CartSliceReducer,
    admin:AdminUserSliceReducer,
  },
});

export default store;
