import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Helpers/axiosInstance";
import toast from "react-hot-toast";

const initialState = {
  isLoggedIn: JSON.parse(localStorage.getItem("isLoggedIn") || "false"),
  role: localStorage.getItem("role") || "",
  data: JSON.parse(localStorage.getItem("data") || "{}"),
};

export const createAccount = createAsyncThunk("/auth/signup", async (data) => {
  try {
    const res = await toast.promise(
      axiosInstance.post("user/register", data),
      {
        loading: "Wait! Creating your account",
        success: (data) => data?.data?.message,
        error: "Failed to create an account!",
      }
    );
    return res.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    throw error;
  }
});

export const login = createAsyncThunk("/auth/login", async (data) => {
  try {
    const res = await toast.promise(
      axiosInstance.post("user/login", data),
      {
        loading: "Wait! Authentication in progress..",
        success: (data) => data?.data?.message,
        error: (data) => data?.data?.message,
      }
    );
    return res.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    throw error;
  }
});

export const getUserData = createAsyncThunk("/user/details", async () => {
  try {
    const res = await toast.promise(
      axiosInstance.get("/user/me"),
      {
        loading: "Fetching user details...",
        success: "User details fetched successfully!",
        error: (error) => error.message,
      }
    );
    return res.data;
  } catch (error) {
    throw error;
  }
});

export const logout = createAsyncThunk("/auth/logout", async () => {
  try {
    const res = await toast.promise(
      axiosInstance.get("user/logout"),
      {
        loading: "Wait! Log out in progress...",
        success: "User logged out successfully",
        error: "Failed to logout!!",
      }
    );
    return res.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    throw error;
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        localStorage.setItem("data", JSON.stringify(action.payload.user));
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("role", action.payload.user.role);
        state.isLoggedIn = true;
        state.data = action.payload.user;
        state.role = action.payload.user.role;
      })
      .addCase(login.rejected, (state) => {
        localStorage.setItem("isLoggedIn", "false");
        localStorage.removeItem("role");
        localStorage.removeItem("data");
        state.isLoggedIn = false;
        state.data = {};
        state.role = "";
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        if (action.payload.user) {
          localStorage.setItem("data", JSON.stringify(action.payload.user));
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("role", action.payload.user.role);
          state.isLoggedIn = true;
          state.data = action.payload.user;
          state.role = action.payload.user.role;
        } else {
          localStorage.clear();
          state.data = {};
          state.isLoggedIn = false;
          state.role = "";
        }
      })
      .addCase(logout.fulfilled, (state) => {
        localStorage.clear();
        state.data = {};
        state.isLoggedIn = false;
        state.role = "";
      });
  },
});

export default authSlice.reducer;
