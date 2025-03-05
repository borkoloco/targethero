import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:4000/api/users");
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
      const response = await axios.post(
        "http://localhost:4000/api/users",
        userData
      );
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
      const response = await axios.put(
        `http://localhost:4000/api/users/${id}`,
        userData
      );
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
      await axios.delete(`http://localhost:4000/api/users/${id}`);
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
      const {
        auth: { token },
      } = getState();
      const response = await axios.get(
        "http://localhost:4000/api/users/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  users: [],
  status: "idle",
  error: null,
  profile: null,
  profileStatus: "idle",
  profileError: null,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
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
      });
  },
});

export default usersSlice.reducer;
