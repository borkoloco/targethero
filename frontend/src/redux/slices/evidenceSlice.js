import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchPendingEvidence = createAsyncThunk(
  "evidence/fetchPendingEvidence",
  async (userId, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { token },
      } = getState();
      const response = await axios.get(
        import.meta.env.VITE_API_URL + `/api/evidence/pending/${userId}`,
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

const evidenceSlice = createSlice({
  name: "evidence",
  initialState: {
    pending: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPendingEvidence.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPendingEvidence.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.pending = action.payload;
      })
      .addCase(fetchPendingEvidence.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.error || action.error.message;
      });
  },
});

export default evidenceSlice.reducer;
