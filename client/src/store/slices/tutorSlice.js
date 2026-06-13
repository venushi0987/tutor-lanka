import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchTutors = createAsyncThunk('tutors/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const res = await api.get('/tutors', { params });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchTutorById = createAsyncThunk('tutors/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/tutors/${id}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const updateTutorProfile = createAsyncThunk('tutors/updateProfile', async (data, { rejectWithValue }) => {
  try {
    const res = await api.put('/tutors/profile', data, { headers: { 'Content-Type': 'multipart/form-data' } });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchAnalytics = createAsyncThunk('tutors/analytics', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/tutors/analytics');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const tutorSlice = createSlice({
  name: 'tutors',
  initialState: {
    tutors: [],
    currentTutor: null,
    profile: null,
    analytics: null,
    total: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentTutor: (state) => { state.currentTutor = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTutors.pending, (state) => { state.loading = true; })
      .addCase(fetchTutors.fulfilled, (state, action) => {
        state.loading = false;
        state.tutors = action.payload.tutors;
        state.total = action.payload.total;
      })
      .addCase(fetchTutors.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchTutorById.fulfilled, (state, action) => { state.currentTutor = action.payload; })
      .addCase(updateTutorProfile.fulfilled, (state, action) => { state.profile = action.payload.profile; })
      .addCase(fetchAnalytics.fulfilled, (state, action) => { state.analytics = action.payload.analytics; });
  },
});

export const { clearCurrentTutor } = tutorSlice.actions;
export default tutorSlice.reducer;
