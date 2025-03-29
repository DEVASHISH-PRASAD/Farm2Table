import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from './Slices/AuthSlice'
import ProductSliceReducer from "./Slices/ProductSlice";
import CartSliceReducer from "./Slices/CartSlice";
import AdminUserSliceReducer from "./Slices/AdminUserSlice"
import AnalyticsSliceReducer from "./Slices/AnalyticsSlice"
import farmerSliceReducer from "./Slices/farmerSlice";
import wholesalerSliceReducer from "./Slices/wholesalerSlice";
const store = configureStore({
  reducer: {
    auth: authSliceReducer,
    products: ProductSliceReducer,
    cart: CartSliceReducer,
    admin: AdminUserSliceReducer,
    analytics: AnalyticsSliceReducer,
    farmer: farmerSliceReducer,
    wholesaler: wholesalerSliceReducer,
  },
});

export default store;
