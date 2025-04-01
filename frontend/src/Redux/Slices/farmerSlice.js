import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../Helpers/axiosInstance";


export const addProduct = createAsyncThunk(
  "farmer/addProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `/farmer/product`,
        productData,
        { withCredentials: true }
      );
      return response.data.data.product;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error adding product"
      );
    }
  }
);

export const updateStock = createAsyncThunk(
  "farmer/updateStock",
  async ({ productId, stock }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `/farmer/product/stock`,
        { productId, stock },
        { withCredentials: true }
      );
      return response.data.data.product;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error updating stock"
      );
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "farmer/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      await axios.delete(`/farmer/product/${productId}`, {
        withCredentials: true,
      });
      return productId; // Return productId to remove from state if needed
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error deleting product"
      );
    }
  }
);

export const getFarmerProducts = createAsyncThunk(
  "farmer/getFarmerProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/farmer/products`, {
        withCredentials: true,
      });
      return response.data.data.products;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching products"
      );
    }
  }
);

export const getOrdersReceived = createAsyncThunk(
  "farmer/getOrdersReceived",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/farmer/orders`, {
        withCredentials: true,
      });
      return response.data.data.orders;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching orders"
      );
    }
  }
);

export const updateProfileFarmer = createAsyncThunk(
  "farmer/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `/farmer/profile`,
        profileData,
        { withCredentials: true }
      );
      return response.data.data.farmer;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error updating profile"
      );
    }
  }
);

const farmerSlice = createSlice({
  name: "farmer",
  initialState: {
    products: [],
    orders: [],
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
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateStock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStock.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) state.products[index] = action.payload;
      })
      .addCase(updateStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter((p) => p._id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getFarmerProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFarmerProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(getFarmerProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getOrdersReceived.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrdersReceived.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getOrdersReceived.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProfileFarmer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfileFarmer.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateProfileFarmer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = farmerSlice.actions;
export default farmerSlice.reducer;
