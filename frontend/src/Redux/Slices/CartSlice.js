import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../Helpers/axiosInstance.js";

// Async thunk for fetching cart items (from localStorage or backend)
export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (_, { rejectWithValue }) => {
    try {
      const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      return cartItems;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch cart items");
    }
  }
);

// Async thunk for creating an order
export const createOrder = createAsyncThunk(
  "cart/createOrder",
  async ({ userId, items, totalAmount }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/orders/create-order", {
        userId,
        items,
        totalAmount,
      });
      return response.data;
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
      const response = await axios.post("/orders/verify-payment", {
        paymentId,
        orderId,
        signature,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Payment verification failed");
    }
  }
);

export const getPreviousOrders = createAsyncThunk(
  "orders/getPreviousOrders",
  async (id, { rejectWithValue }) => {
    try {
      if (!id) {
        return rejectWithValue("User ID is required");
      }
      const response = await axios.get(`/orders/previous/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message || "Failed to fetch orders");
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
    previousOrders: [],
  },
  reducers: {
    addItem: (state, action) => {
      const existingItem = state.items.find((item) => item.name === action.payload.name);
      if (existingItem) {
        existingItem.weight = existingItem.weight + action.payload.weight;
        existingItem.totalCost = existingItem.weight * existingItem.price;
      } else {
        state.items = [...state.items, action.payload];
      }
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((item) => item.name !== action.payload);
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },
    updateItemQuantity: (state, action) => {
      const { name, weight } = action.payload;
      const updatedItems = state.items.map((item) =>
        item.name === name ? { ...item, weight, totalCost: weight * item.price } : item
      );
      state.items = updatedItems;
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem("cartItems");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
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
      })
      .addCase(getPreviousOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPreviousOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.previousOrders = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getPreviousOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addItem, removeItem, updateItemQuantity, clearCart } = CartSlice.actions;
export default CartSlice.reducer;