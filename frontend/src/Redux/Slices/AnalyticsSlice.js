import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../Helpers/axiosInstance"; // import axiosInstance

export const fetchUserSignups = createAsyncThunk(
  "analytics/fetchUserSignups",
  async ({ year, month }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/analytics/user-signups", {
        params: { year, month },
      });
      return response.data; // Assuming data is under `data` key
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message); // For better error handling
    }
  }
);

export const fetchOrderSales = createAsyncThunk(
  "analytics/fetchOrderSales",
  async ({ year, month }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/analytics/order-sales", {
        params: { year, month },
      });
      return response.data; // Assuming data is under `data` key
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchItemSales = createAsyncThunk(
  "analytics/fetchItemSales",
  async ({ year, month }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/analytics/item-sales", {
        params: { year, month },
      });
      return response.data; // Assuming data is under `data` key
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchMonthlySales = createAsyncThunk(
  "analytics/fetchMonthlySales",
  async ({ year, month }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/analytics/monthly-sales", {
        params: { year, month },
      });
      return response.data; // Assuming data is under `data` key
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Create slice
const analyticsSlice = createSlice({
  name: "analytics",
  initialState: {
    userSignups: [],
    orderSales: [],
    itemSales: [],
    monthlySales: [],
    status: "idle", // to track loading state
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserSignups.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserSignups.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userSignups = action.payload.data; // Assuming data is under `data` key
      })
      .addCase(fetchUserSignups.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchOrderSales.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOrderSales.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orderSales = action.payload.data;
      })
      .addCase(fetchOrderSales.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchItemSales.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchItemSales.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.itemSales = action.payload.data;
      })
      .addCase(fetchItemSales.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchMonthlySales.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMonthlySales.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.monthlySales = action.payload.data;
      })
      .addCase(fetchMonthlySales.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default analyticsSlice.reducer;
