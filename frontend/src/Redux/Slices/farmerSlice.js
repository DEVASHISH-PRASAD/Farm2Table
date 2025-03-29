import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../Helpers/axiosInstance";



// Add a new product
export const addProduct = createAsyncThunk(
  "farmer/addProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `/farmer/product`,
        productData,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error adding product"
      );
    }
  }
);

// Update product stock
export const updateStock = createAsyncThunk(
  "farmer/updateStock",
  async ({ productId, stock }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `/farmer/product/stock`,
        { productId, stock },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error updating stock"
      );
    }
  }
);

// Delete a product
export const deleteProduct = createAsyncThunk(
  "farmer/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `/farmer/product/${productId}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error deleting product"
      );
    }
  }
);

// Get all products added by the farmer
export const getFarmerProducts = createAsyncThunk(
  "farmer/getFarmerProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/farmer/products`, {
        withCredentials: true,
      });
      return response.data.products;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching products"
      );
    }
  }
);

// Get orders placed for farmer's products
export const getOrdersReceived = createAsyncThunk(
  "farmer/getOrdersReceived",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/farmer/orders`, {
        withCredentials: true,
      });
      return response.data.orders;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching orders"
      );
    }
  }
);

// Update farmer profile
export const updateProfileFarmer = createAsyncThunk(
  "farmer/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `/farmer/profile`,
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
      // Add Product
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Stock
      .addCase(updateStock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStock.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Farmer Products
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
      // Get Orders Received
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
      // Update Profile
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
