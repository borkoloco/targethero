import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API}/api/users`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createUser = createAsyncThunk(
  "users/createUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API}/api/users`, userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, userData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API}/api/users/${id}`, userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API}/api/users/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  "users/fetchUserProfile",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.get(`${API}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchUserStats = createAsyncThunk(
  "users/fetchUserStats",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.get(`${API}/api/users/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const assignBadgeToUser = createAsyncThunk(
  "users/assignBadgeToUser",
  async ({ userId, badgeId }, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getState().auth.token;
      await axios.post(
        `${API}/api/badges/assign`,
        { userId, badgeId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      dispatch(fetchUserStats());
      dispatch(fetchBadgesByUserId(userId));
      dispatch(
        setNotification({
          type: "success",
          message: "Badge assigned successfully",
        })
      );
    } catch (err) {
      dispatch(
        setNotification({ type: "error", message: "Failed to assign badge" })
      );
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchBadgesByUserId = createAsyncThunk(
  "users/fetchBadgesByUserId",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API}/api/badges/user?userId=${userId}`);
      return { userId, badges: res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteBadgeFromUser = createAsyncThunk(
  "users/deleteBadgeFromUser",
  async ({ userId, badgeId }, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getState().auth.token;
      await axios.delete(`${API}/api/badges/user/${userId}/${badgeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(fetchBadgesByUserId(userId));
      dispatch(fetchUserStats());
      dispatch(
        setNotification({
          type: "success",
          message: "Badge deleted successfully",
        })
      );
    } catch (err) {
      dispatch(
        setNotification({ type: "error", message: "Failed to delete badge" })
      );
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    status: "idle",
    error: null,
    profile: null,
    profileStatus: "idle",
    profileError: null,
    userStats: [],
    statsStatus: "idle",
    statsError: null,
    userBadgesMap: {},
    notification: null,
  },
  reducers: {
    setNotification: (state, action) => {
      state.notification = action.payload;
    },
    clearNotification: (state) => {
      state.notification = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.error || action.error.message;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(
          (user) => user.id === action.payload.id
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user.id !== action.payload);
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.profileStatus = "loading";
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.profileStatus = "succeeded";
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.profileStatus = "failed";
        state.profileError = action.payload?.error || action.error.message;
      })
      .addCase(fetchUserStats.pending, (state) => {
        state.statsStatus = "loading";
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.statsStatus = "succeeded";
        state.userStats = action.payload;
      })
      .addCase(fetchUserStats.rejected, (state, action) => {
        state.statsStatus = "failed";
        state.statsError = action.payload;
      })
      .addCase(fetchBadgesByUserId.fulfilled, (state, action) => {
        state.userBadgesMap[action.payload.userId] = action.payload.badges;
      });
  },
});

export const { setNotification, clearNotification } = usersSlice.actions;

export default usersSlice.reducer;
