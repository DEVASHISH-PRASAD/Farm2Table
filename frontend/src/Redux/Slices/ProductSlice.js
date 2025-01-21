import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../Helpers/axiosInstance.js";

export const createItem = createAsyncThunk('/admin/createItem', async (data) => {
    try {
        let res = await toast.promise(
            axiosInstance.post('/product/createitem', data), {
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
            });
    }
});

export default productSlice.reducer;
