import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../Helpers/axiosInstance";



// Purchase a product
export const purchaseProduct = createAsyncThunk(
  "wholesaler/purchaseProduct",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `/wholesaler/purchase`,
        orderData,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error purchasing product"
      );
    }
  }
);

// Get wholesaler order history
export const getOrderHistory = createAsyncThunk(
  "wholesaler/getOrderHistory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/wholesaler/orders`, {
        withCredentials: true,
      });
      return response.data.orders;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching order history"
      );
    }
  }
);

// Get available products
export const getAvailableProducts = createAsyncThunk(
  "wholesaler/getAvailableProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/wholesaler/products`, {
        withCredentials: true,
      });
      return response.data.products;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching available products"
      );
    }
  }
);

// Update wholesaler profile
export const updateProfileWholesaler = createAsyncThunk(
  "wholesaler/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `/wholesaler/profile`,
        profileData,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error updating profile"
      );
    }
  }
);

const wholesalerSlice = createSlice({
  name: "wholesaler",
  initialState: {
    orders: [],
    products: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Purchase Product
      .addCase(purchaseProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(purchaseProduct.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(purchaseProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Order History
      .addCase(getOrderHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getOrderHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Available Products
      .addCase(getAvailableProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAvailableProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(getAvailableProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Profile
      .addCase(updateProfileWholesaler.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfileWholesaler.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateProfileWholesaler.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = wholesalerSlice.actions;
export default wholesalerSlice.reducer;
