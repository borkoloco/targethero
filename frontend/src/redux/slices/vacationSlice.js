import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const fetchMyVacationRequests = createAsyncThunk(
  "vacation/fetchMyRequests",
  async (token) => {
    const res = await axios.get(`${API}/api/vacations/my-requests`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }
);

export const fetchApprovedVacationRequests = createAsyncThunk(
  "vacation/fetchApprovedRequests",
  async (token) => {
    const res = await axios.get(`${API}/api/vacations/approved`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }
);

export const fetchAllVacationRequests = createAsyncThunk(
  "vacation/fetchAllRequests",
  async (token) => {
    const res = await axios.get(`${API}/api/vacations/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }
);

export const updateVacationStatus = createAsyncThunk(
  "vacation/updateStatus",
  async ({ id, action, token }, { dispatch }) => {
    await axios.put(
      `${API}/api/vacations/${id}/${action}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    dispatch(fetchMyVacationRequests(token));
    dispatch(fetchApprovedVacationRequests(token));
    dispatch(fetchAllVacationRequests(token));
    return id;
  }
);

const vacationSlice = createSlice({
  name: "vacation",
  initialState: {
    myRequests: [],
    approvedRequests: [],
    allRequests: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchMyVacationRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyVacationRequests.fulfilled, (state, action) => {
        state.myRequests = action.payload;
        state.loading = false;
      })
      .addCase(fetchMyVacationRequests.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })

      .addCase(fetchApprovedVacationRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApprovedVacationRequests.fulfilled, (state, action) => {
        state.approvedRequests = action.payload;
        state.loading = false;
      })
      .addCase(fetchApprovedVacationRequests.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })

      .addCase(fetchAllVacationRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllVacationRequests.fulfilled, (state, action) => {
        state.allRequests = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllVacationRequests.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export default vacationSlice.reducer;
