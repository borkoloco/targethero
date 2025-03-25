import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchMissions = createAsyncThunk(
  "missions/fetchMissions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/api/missions"
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchMissionDetail = createAsyncThunk(
  "missions/fetchMissionDetail",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + `/api/missions/${id}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const completeMission = createAsyncThunk(
  "missions/completeMission",
  async (missionId, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { token },
      } = getState();
      const response = await axios.post(
        import.meta.env.VITE_API_URL + `/api/missions/complete/${missionId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const missionsSlice = createSlice({
  name: "missions",
  initialState: {
    missions: [],
    status: "idle",
    error: null,
    missionDetail: null,
    detailStatus: "idle",
    detailError: null,
  },
  reducers: {
    updateMission(state, action) {
      const updatedMission = action.payload;
      const index = state.missions.findIndex((m) => m.id === updatedMission.id);
      if (index !== -1) {
        state.missions[index] = updatedMission;
      }
      if (state.missionDetail && state.missionDetail.id === updatedMission.id) {
        state.missionDetail = updatedMission;
      }
    },
    clearMissionDetail(state) {
      state.missionDetail = null;
      state.detailStatus = "idle";
      state.detailError = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchMissions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMissions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.missions = action.payload;
      })
      .addCase(fetchMissions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.error || action.error.message;
      })

      .addCase(fetchMissionDetail.pending, (state) => {
        state.detailStatus = "loading";
      })
      .addCase(fetchMissionDetail.fulfilled, (state, action) => {
        state.detailStatus = "succeeded";
        state.missionDetail = action.payload;
      })
      .addCase(fetchMissionDetail.rejected, (state, action) => {
        state.detailStatus = "failed";
        state.detailError = action.payload?.error || action.error.message;
      })

      .addCase(completeMission.fulfilled, (state, action) => {
        const updatedMission = action.payload.mission;
        if (updatedMission) {
          const index = state.missions.findIndex(
            (m) => m.id === updatedMission.id
          );
          if (index !== -1) {
            state.missions[index] = updatedMission;
          }

          if (
            state.missionDetail &&
            state.missionDetail.id === updatedMission.id
          ) {
            state.missionDetail = updatedMission;
          }
        }
      });
  },
});

export const { updateMission, clearMissionDetail } = missionsSlice.actions;
export default missionsSlice.reducer;
