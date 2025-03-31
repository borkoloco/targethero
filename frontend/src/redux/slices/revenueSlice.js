import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const fetchMyRevenue = createAsyncThunk(
  "revenue/fetchMyRevenue",
  async (_, { rejectWithValue, getState }) => {
    const token = getState().auth.token;
    try {
      const res = await axios.get(`${API}/api/revenue/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchAllRevenue = createAsyncThunk(
  "revenue/fetchAllRevenue",
  async (_, { rejectWithValue, getState }) => {
    const token = getState().auth.token;
    try {
      const res = await axios.get(`${API}/api/revenue`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const createRevenue = createAsyncThunk(
  "revenue/createRevenue",
  async (revenueData, { rejectWithValue, getState }) => {
    const token = getState().auth.token;
    try {
      const res = await axios.post(`${API}/api/revenue/my`, revenueData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateRevenue = createAsyncThunk(
  "revenue/updateRevenue",
  async ({ id, revenueData }, { rejectWithValue, getState }) => {
    const token = getState().auth.token;
    try {
      const res = await axios.put(`${API}/api/revenue/${id}`, revenueData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteRevenue = createAsyncThunk(
  "revenue/deleteRevenue",
  async (id, { rejectWithValue, getState }) => {
    const token = getState().auth.token;
    try {
      await axios.delete(`${API}/api/revenue/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const revenueSlice = createSlice({
  name: "revenue",
  initialState: {
    all: [],
    my: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyRevenue.fulfilled, (state, action) => {
        state.my = action.payload;
      })
      .addCase(fetchAllRevenue.fulfilled, (state, action) => {
        state.all = action.payload;
      })
      .addCase(createRevenue.fulfilled, (state, action) => {
        state.my.push(action.payload);
      })
      .addCase(updateRevenue.fulfilled, (state, action) => {
        const indexMy = state.my.findIndex((r) => r.id === action.payload.id);
        if (indexMy !== -1) state.my[indexMy] = action.payload;

        const indexAll = state.all.findIndex((r) => r.id === action.payload.id);
        if (indexAll !== -1) state.all[indexAll] = action.payload;
      })
      .addCase(deleteRevenue.fulfilled, (state, action) => {
        state.my = state.my.filter((r) => r.id !== action.payload);
        state.all = state.all.filter((r) => r.id !== action.payload);
      });
  },
});

export default revenueSlice.reducer;
