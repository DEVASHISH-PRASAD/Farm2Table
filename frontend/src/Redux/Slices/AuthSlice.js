import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Helpers/axiosInstance";
import toast from "react-hot-toast";

const initialState = {
  isLoggedIn: JSON.parse(localStorage.getItem("isLoggedIn") || "false"),
  role: localStorage.getItem("role") || "",
  data: JSON.parse(localStorage.getItem("data") || "{}"),
};


export const requestResetPassword = createAsyncThunk(
  "/auth/request-reset-password",
  async (email, { rejectWithValue }) => {
    try {
      const res = await toast.promise(
        axiosInstance.post("user/request-password-reset", { email }),
        {
          loading: "Sending password reset email...",
          success: "Password reset email sent!",
          error: "Failed to send password reset email!",
        },
        { toastId: "requestReset" }
      );
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

// Reset Password
export const resetPassword = createAsyncThunk(
  "/auth/reset-password",
  async ({ resetToken, newPassword }, { rejectWithValue }) => {
    try {
      const res = await toast.promise(
        axiosInstance.post(`user/reset-password?resetToken=${resetToken}`, { newPassword }),
        {
          loading: "Resetting your password...",
          success: "Password reset successful!",
          error: "Failed to reset password!",
        },
        { toastId: "resetSuccess" }
      );
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);


export const createAccount = createAsyncThunk("/auth/signup", async (data) => {
  try {
    const res = await toast.promise(axiosInstance.post("user/register", data), {
      loading: "Wait! Creating your account",
      success: (data) => data?.data?.message,
      error: "Failed to create an account!",
    });
    return res.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    throw error;
  }
});

export const login = createAsyncThunk("/auth/login", async (data) => {
  try {
    const res = await toast.promise(axiosInstance.post("user/login", data), {
      loading: "Wait! Authentication in progress..",
      success: (data) => data?.data?.message,
      error: (data) => data?.data?.message,
    });
    return res.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    throw error;
  }
});

export const getUserData = createAsyncThunk("/user/details", async () => {
  try {
    const res = await toast.promise(axiosInstance.get("/user/me"), {
      loading: "Fetching user details...",
      success: "User details fetched successfully!",
      error: (error) => error.message,
    });
    return res.data;
  } catch (error) {
    throw error;
  }
});

export const logout = createAsyncThunk("/auth/logout", async () => {
  try {
    const res = await toast.promise(axiosInstance.get("/user/logout"), {
      loading: "Wait! Log out in progress...",
      success: "User logged out successfully",
      error: "Failed to logout!!",
    });
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
        const { user } = action.payload;
        localStorage.setItem("data", JSON.stringify(user));
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
        const { user } = action.payload;
        if (user) {
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
      })
      // Handle the requestResetPassword action
      .addCase(requestResetPassword.fulfilled, (state, action) => {
      
      })
      .addCase(requestResetPassword.rejected, (state, action) => {
        
      })
      // Handle the resetPassword action
      .addCase(resetPassword.fulfilled, (state, action) => {
       
      })
      .addCase(resetPassword.rejected, (state, action) => {
      
      });
  },
});

export default authSlice.reducer;
