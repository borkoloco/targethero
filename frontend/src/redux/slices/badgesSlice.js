import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

export const fetchBadges = createAsyncThunk("badges/fetchAll", async () => {
  const res = await axios.get(`${API_BASE}/api/badges`);
  return res.data;
});

export const createBadge = createAsyncThunk(
  "badges/create",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_BASE}/api/badges`, formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateBadge = createAsyncThunk(
  "badges/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${API_BASE}/api/badges/${id}`, formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const deleteBadge = createAsyncThunk(
  "badges/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE}/api/badges/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const badgesSlice = createSlice({
  name: "badges",
  initialState: {
    list: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBadges.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBadges.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchBadges.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(createBadge.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateBadge.fulfilled, (state, action) => {
        const index = state.list.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(deleteBadge.fulfilled, (state, action) => {
        state.list = state.list.filter((b) => b.id !== action.payload);
      });
  },
});

export default badgesSlice.reducer;
