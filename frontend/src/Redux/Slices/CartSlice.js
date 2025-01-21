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
  async ({ paymentId, orderId, signature }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/orders/verify-payment", { paymentId, orderId, signature });
      return response.data; // Return verification result
    } catch (error) {
      return rejectWithValue(error.response?.data || "Payment verification failed");
    }
  }
);

const CartSlice = createSlice({
  name: "cart",
  initialState: {
    items: JSON.parse(localStorage.getItem("cartItems")) || [],  // Get items from localStorage or default to empty array
    loading: false,
    error: null,
    paymentLoading: false,
    paymentError: null,
  },
  reducers: {
    addItem: (state, action) => {
      const existingItem = state.items.find((item) => item.name === action.payload.name);
      if (existingItem) {
        // Update the weight immutably
        existingItem.weight = existingItem.weight + action.payload.weight;
      } else {
        state.items = [...state.items, action.payload];
      }
      // Log the updated state for debugging purposes
      console.log("Updated cart (addItem):", state.items);
      localStorage.setItem("cartItems", JSON.stringify(state.items));  // Update localStorage after state change
    },
    removeItem: (state, action) => {
      // Immutably update the items array
      state.items = state.items.filter((item) => item.name !== action.payload);
      // Log the updated state for debugging purposes
      console.log("Updated cart (removeItem):", state.items);
      localStorage.setItem("cartItems", JSON.stringify(state.items));  // Update localStorage
    },
    updateItemQuantity: (state, action) => {
      const { name, weight } = action.payload;
      const updatedItems = state.items.map((item) =>
        item.name === name ? { ...item, weight } : item
      );
      state.items = updatedItems;
      // Log the updated state for debugging purposes
      console.log("Updated cart (updateItemQuantity):", state.items);
      localStorage.setItem("cartItems", JSON.stringify(state.items));  // Update localStorage
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem("cartItems"); // Clear cart in localStorage
      // Log the action for debugging purposes
      console.log("Cart cleared");
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