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

export const getPreviousOrders = createAsyncThunk(
  "orders/getPreviousOrders",
  async (id, { rejectWithValue }) => {
    try {
      // Validate userId before making the request
      if (!id) {
        return rejectWithValue("User ID is required");
      }

      // Fetch orders from API
      const response = await axios.get(`/orders/previous/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message || "Failed to fetch orders"
      );
    }
  }
);

export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/cart/${userId}`);
      const backendItems = response.data.items || [];
      // Sync with localStorage
      const localItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      const mergedItems = [...backendItems, ...localItems.filter(
        (localItem) => !backendItems.some((backendItem) => backendItem.name === localItem.name)
      )];
      localStorage.setItem("cartItems", JSON.stringify(mergedItems));
      return mergedItems;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch cart");
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
      localStorage.setItem("cartItems", JSON.stringify(state.items));  
    },
    removeItem: (state, action) => {
      // Immutably update the items array
      state.items = state.items.filter((item) => item.name !== action.payload);
      localStorage.setItem("cartItems", JSON.stringify(state.items));  // Update localStorage
    },
    updateItemQuantity: (state, action) => {
      const { name, weight } = action.payload;
      const updatedItems = state.items.map((item) =>
        item.name === name ? { ...item, weight } : item
      );
      state.items = updatedItems;
      localStorage.setItem("cartItems", JSON.stringify(state.items));  // Update localStorage
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem("cartItems"); // Clear cart in localStorage
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle createOrder states
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

      // Handle verifyPayment states
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

      // Handle getPreviousOrders states
      .addCase(getPreviousOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPreviousOrders.fulfilled, (state, action) => {
        state.loading = false;
        
        // Ensure `previousOrders` is always an array
        state.previousOrders = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getPreviousOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }).addCase(fetchCartItems.pending, (state) => {
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
    });
  },
});

export const { addItem, removeItem, updateItemQuantity, clearCart } = CartSlice.actions;
export default CartSlice.reducer;
