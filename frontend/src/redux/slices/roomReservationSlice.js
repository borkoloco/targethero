import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';



const API = import.meta.env.VITE_API_URL;

// Trae las reservas del usuario actual
export const fetchReservations = createAsyncThunk(
  "room-reservation/fetchMyRequests",
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token;  // Obtiene el token desde el estado de Redux
    if (!token) {
      return rejectWithValue("No token provided");
    }
    
    try {
      const res = await axios.get(`${API}/api/room-reservation/my-reservations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;  // Retorna los datos de las reservas
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Error al obtener reservas");
    }
  }
);


// Crea una nueva reserva
export const createReservation = createAsyncThunk(
  'roomReservations/create',
  async (newReservation, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await axios.post(`${API}/api/reservations/request`, newReservation, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Error al crear reserva');
    }
  }
);

// Confirma una reserva (HR)
export const confirmReservation = createAsyncThunk(
  'roomReservations/confirm',
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await axios.put(`${API}/api/reservations/${id}/confirm`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Error al confirmar reserva');
    }
  }
);

// Cancela una reserva (HR)
export const cancelReservation = createAsyncThunk(
  'roomReservations/cancel',
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await axios.put(`${API}/api/reservations/${id}/cancel`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Error al cancelar reserva');
    }
  }
);

const roomReservationSlice = createSlice({
  name: 'roomReservations',
  initialState: {
    reservations: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReservations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReservations.fulfilled, (state, action) => {
        state.loading = false;
        state.reservations = action.payload;
      })
      .addCase(fetchReservations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(createReservation.fulfilled, (state, action) => {
        state.reservations.push(action.payload);
      })

      .addCase(confirmReservation.fulfilled, (state, action) => {
        const index = state.reservations.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.reservations[index] = action.payload;
        }
      })

      .addCase(cancelReservation.fulfilled, (state, action) => {
        const index = state.reservations.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.reservations[index] = action.payload;
        }
      });
  }
});

export default roomReservationSlice.reducer;
