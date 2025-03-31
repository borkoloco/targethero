import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const fetchClients = createAsyncThunk(
  "clients/fetchClients",
  async (_, { rejectWithValue, getState }) => {
    const token = getState().auth.token;
    try {
      const res = await axios.get(`${API}/api/clients`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchMyClients = createAsyncThunk(
  "clients/fetchMyClients",
  async (_, { rejectWithValue, getState }) => {
    const token = getState().auth.token;
    try {
      const res = await axios.get(`${API}/api/clients/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const createClient = createAsyncThunk(
  "clients/createClient",
  async (clientData, { rejectWithValue, getState }) => {
    const token = getState().auth.token;
    try {
      const res = await axios.post(`${API}/api/clients`, clientData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateClient = createAsyncThunk(
  "clients/updateClient",
  async ({ id, clientData }, { rejectWithValue, getState }) => {
    const token = getState().auth.token;
    try {
      const res = await axios.put(`${API}/api/clients/${id}`, clientData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteClient = createAsyncThunk(
  "clients/deleteClient",
  async (id, { rejectWithValue, getState }) => {
    const token = getState().auth.token;
    try {
      await axios.delete(`${API}/api/clients/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const clientsSlice = createSlice({
  name: "clients",
  initialState: {
    list: [],
    myList: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClients.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchMyClients.fulfilled, (state, action) => {
        state.myList = action.payload;
      })
      .addCase(createClient.fulfilled, (state, action) => {
        state.myList.push(action.payload);
      })
      .addCase(updateClient.fulfilled, (state, action) => {
        const index = state.myList.findIndex(
          (client) => client.id === action.payload.id
        );
        if (index !== -1) {
          state.myList[index] = action.payload;
        }
      })
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.myList = state.myList.filter((c) => c.id !== action.payload);
      });
  },
});

export default clientsSlice.reducer;
