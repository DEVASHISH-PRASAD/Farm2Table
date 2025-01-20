import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../Helpers/axiosInstance.js";

// Async thunk for creating an order
export const createOrder = createAsyncThunk(
  "cart/createOrder",
  async ({ userId, items, totalAmount }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/orders/create-order", { userId, items, totalAmount });
      return response.data; // Return order details
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Async thunk for verifying payment
export const verifyPayment = createAsyncThunk(
  "cart/verify-payment",
  async ({ paymentId,orderId,signature}, { rejectWithValue }) => {
    try {
      const response = await axios.post("/orders/verify-payment", { paymentId,orderId,signature});
      return response.data; // Return verification result
    } catch (error) {
      return rejectWithValue(error.response?.data || "Payment verification failed");
    }
  }
);

const CartSlice = createSlice({
  name: "cart",
  initialState: {
    items: JSON.parse(localStorage.getItem("cartItems")) || [],
    loading: false,
    error: null,
    paymentLoading: false,
    paymentError: null,
  },
  reducers: {
    addItem: (state, action) => {
      const existingItem = state.items.find((item) => item.name === action.payload.name);
      if (existingItem) {
        existingItem.weight += action.payload.weight;
      } else {
        state.items.push(action.payload);
      }
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((item) => item.name !== action.payload);
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },
    updateItemQuantity: (state, action) => {
      const { name, weight } = action.payload;
      const existingItem = state.items.find((item) => item.name === name);
      if (existingItem) {
        existingItem.weight = weight;
      }
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem("cartItems");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyPayment.pending, (state) => {
        state.paymentLoading = true;
        state.paymentError = null;
      })
      .addCase(verifyPayment.fulfilled, (state) => {
        state.paymentLoading = false;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.paymentLoading = false;
        state.paymentError = action.payload;
      });
  },
});

export const { addItem, removeItem, updateItemQuantity, clearCart } = CartSlice.actions;
export default CartSlice.reducer;
