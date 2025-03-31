import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

export const fetchMarketItems = createAsyncThunk(
  "marketItems/fetchMarketItems",
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const response = await axios.get(`${API_BASE}/api/market`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const createMarketItem = createAsyncThunk(
  "marketItems/createMarketItem",
  async (itemData, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const response = await axios.post(`${API_BASE}/api/market`, itemData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const marketItemsSlice = createSlice({
  name: "marketItems",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {
    itemAdded: (state, action) => {
      state.items.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMarketItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMarketItems.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchMarketItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createMarketItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
  },
});

export const { itemAdded } = marketItemsSlice.actions;
export default marketItemsSlice.reducer;
