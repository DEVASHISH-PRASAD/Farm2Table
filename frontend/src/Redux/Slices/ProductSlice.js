import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../Helpers/axiosInstance.js";

// Create Item
export const createItem = createAsyncThunk('/admin/createItem', async (data) => {
    try {
        let res = await toast.promise(
            axiosInstance.post('/admin/createitem', data), {
                loading: "Wait! Adding Product",
                success: (data) => data?.data?.message,
                error: "Failed to add Item!"
            }
        );
        return res.data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
        throw error;
    }
});

// 🔹 Get All Items (By Category)
export const getAllItems = createAsyncThunk('/product/getAllItems', async (category) => {
    try {
        const response = await axiosInstance.get('/product', {
            params: { category }
        });
        return response.data;
    } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to fetch items.");
        throw error;
    }
});

// 🔹 Update Product Quantity (Admin Only)
export const updateProductQuantity = createAsyncThunk('/admin/updateQuantity', async ({ id, quantity }) => {
    try {
        let res = await toast.promise(
            axiosInstance.put(`/admin/update-quantity/${id}`, { quantity }), {
                loading: "Updating quantity...",
                success: "Quantity updated successfully!",
                error: "Failed to update quantity!"
            }
        );
        return { id, quantity };
    } catch (error) {
        toast.error(error?.response?.data?.message);
        throw error;
    }
});

export const updateProductPrice = createAsyncThunk('/admin/updatePrice', async ({ id, price }) => {
    try {
        let res = await toast.promise(
            axiosInstance.put(`/admin/update-price/${id}`, { price }), {
                loading: "Updating price...",
                success: "Price updated successfully!",
                error: "Failed to update price!"
            }
        );
        return { id, price }; // Returning product ID and new price
    } catch (error) {
        toast.error(error?.response?.data?.message);
        throw error;
    }
});

// 🔹 Deduct Stock After Purchase
export const updateStockAfterPurchase = createAsyncThunk(
  "/product/updateStock",
  async (items) => {
    try {
        
      let res = await toast.promise(
        axiosInstance.patch("/product/update-stock", { items }),
        {
          loading: "Updating stock...",
          success: "Stock updated successfully!",
          error: "Failed to update stock!",
        }
      );
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Stock update failed!");
      throw error;
    }
  }
);


// 🔹 Product Slice
const productSlice = createSlice({
    name: "product",
    initialState: {
        loading: false,
        error: null,
        successMessage: null,
        items: [],
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
          .addCase(createItem.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.successMessage = null;
          })
          .addCase(createItem.fulfilled, (state, action) => {
            state.loading = false;
            state.successMessage = action.payload.message;
          })
          .addCase(createItem.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
          })
          .addCase(getAllItems.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(getAllItems.fulfilled, (state, action) => {
            state.loading = false;
            state.items = action.payload.items;
          })
          .addCase(getAllItems.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
          })
          // 🔹 Handle Quantity Update
          .addCase(updateProductQuantity.pending, (state) => {
            state.loading = true;
          })
          .addCase(updateProductQuantity.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.items.findIndex(
              (item) => item.id === action.payload.id
            );
            if (index !== -1) {
              state.items[index].quantity = action.payload.quantity;
            }
          })
          .addCase(updateProductQuantity.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
          })
          .addCase(updateStockAfterPurchase.pending, (state) => {
            state.loading = true;
          })
          .addCase(updateStockAfterPurchase.fulfilled, (state, action) => {
            state.loading = false;
            action.payload.updatedItems.forEach((updatedItem) => {
              const index = state.items.findIndex(
                (item) => item.id === updatedItem.id
              );
              if (index !== -1) {
                state.items[index].quantity = updatedItem.newQuantity;
              }
            });
          })
          .addCase(updateStockAfterPurchase.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
          });
    }
});

export default productSlice.reducer;
