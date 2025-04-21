import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../Helpers/axiosInstance";

// Get farmer profile
export const getFarmerProfile = createAsyncThunk(
  "farmer/getFarmerProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/farmer/profile", {
        withCredentials: true,
      });
      return response.data.data.farmer;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching profile"
      );
    }
  }
);

// Update farmer profile
export const updateProfileFarmer = createAsyncThunk(
  "farmer/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await axios.patch("/farmer/profile", profileData, {
        withCredentials: true,
      });
      return response.data.data.farmer;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error updating profile"
      );
    }
  }
);

// Add a new product
export const addProduct = createAsyncThunk(
  "farmer/addProduct",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/farmer/products/add", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.data.product;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error adding product"
      );
    }
  }
);

// Delete a product
export const deleteProduct = createAsyncThunk(
  "farmer/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      await axios.delete(`/farmer/products/${productId}`, {
        withCredentials: true,
      });
      return productId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error deleting product"
      );
    }
  }
);

// Get farmer's products
export const getFarmerProducts = createAsyncThunk(
  "/farmer/getFarmerProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/farmer/products/my-products", {
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

// Update product stock
export const updateStock = createAsyncThunk(
  "farmer/updateStock",
  async ({ productId, stock }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        "/farmer/products/update-stock",
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

// Get orders received
export const getOrdersReceived = createAsyncThunk(
  "farmer/getOrdersReceived",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/farmer/orders", {
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

// Update order delivery status
export const updateOrderDeliveryStatus = createAsyncThunk(
  "farmer/updateOrderDeliveryStatus",
  async ({ orderId, deliveryStatus }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        "/farmer/orders/delivery-status",
        { orderId, deliveryStatus },
        { withCredentials: true }
      );
      return response.data.data.order;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error updating delivery status"
      );
    }
  }
);

// Get all farmer products (admin)
export const getAllFarmerProducts = createAsyncThunk(
  "farmer/getAllFarmerProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/farmer/products/all", {
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

// Create admin order
export const createAdminOrder = createAsyncThunk(
  "farmer/createAdminOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/farmer/orders/admin", orderData, {
        withCredentials: true,
      });
      return response.data.data.order;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error creating order"
      );
    }
  }
);

// Get all users (for admin order form)
export const getAllUsers = createAsyncThunk(
  "farmer/getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/farmer/users", {
        withCredentials: true,
      });
      return response.data.data.users;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching users"
      );
    }
  }
);

const farmerSlice = createSlice({
  name: "farmer",
  initialState: {
    products: [],
    allProducts: [],
    orders: [],
    users: [],
    profile: null,
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
      // Get Farmer Profile
      .addCase(getFarmerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFarmerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(getFarmerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Profile
      .addCase(updateProfileFarmer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfileFarmer.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateProfileFarmer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Product
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
      // Delete Product
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
      // Update Stock
      .addCase(updateStock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStock.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateStock.rejected, (state, action) => {
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
      // Update Order Delivery Status
      .addCase(updateOrderDeliveryStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderDeliveryStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.orders.findIndex(
          (o) => o.orderId === action.payload.orderId
        );
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(updateOrderDeliveryStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get All Farmer Products
      .addCase(getAllFarmerProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllFarmerProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.allProducts = action.payload;
      })
      .addCase(getAllFarmerProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Admin Order
      .addCase(createAdminOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAdminOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload);
        const product = state.allProducts.find(
          (p) => p._id === action.payload.items[0].productId
        );
        if (product) {
          product.quantity -= action.payload.items[0].weight;
        }
      })
      .addCase(createAdminOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get All Users
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = farmerSlice.actions;
export default farmerSlice.reducer;
