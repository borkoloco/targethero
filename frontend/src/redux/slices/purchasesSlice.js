import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const fetchPurchases = createAsyncThunk(
  "purchases/fetchPurchases",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await axios.get(`${API}/api/trades/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const purchasesSlice = createSlice({
  name: "purchases",
  initialState: { list: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPurchases.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPurchases.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchPurchases.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default purchasesSlice.reducer;
