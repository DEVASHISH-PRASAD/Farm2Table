import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../Helpers/axiosInstance";

// Fetch all users
export const fetchUsers = createAsyncThunk("users/fetchUsers", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get("/admin/users");
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Error fetching users");
  }
});

// Update user details
export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ userId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/admin/update-role/${userId}`, updatedData);
      return { userId, updatedData };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error updating user");
    }
  }
);

// Delete user
export const deleteUser = createAsyncThunk("users/deleteUser", async (userId, { rejectWithValue }) => {
  try {
    await axios.delete(`/admin/delete-user/${userId}`);
    return userId;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Error deleting user");
  }
});

const AdminUserSlice = createSlice({
  name: "user",
  initialState: { users: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const { userId, updatedData } = action.payload;
        state.users = state.users.map((user) =>
          user._id === userId ? { ...user, ...updatedData } : user
        );
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user._id !== action.payload);
      });
  },
});

export default AdminUserSlice.reducer;
