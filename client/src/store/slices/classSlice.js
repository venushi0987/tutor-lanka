import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchClasses = createAsyncThunk('classes/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const res = await api.get('/classes', { params });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchClassById = createAsyncThunk('classes/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/classes/${id}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const createClass = createAsyncThunk('classes/create', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/classes', data, { headers: { 'Content-Type': 'multipart/form-data' } });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const updateClass = createAsyncThunk('classes/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/classes/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const deleteClass = createAsyncThunk('classes/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/classes/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchMyClasses = createAsyncThunk('classes/fetchMy', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/classes/my');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const classSlice = createSlice({
  name: 'classes',
  initialState: {
    classes: [],
    myClasses: [],
    currentClass: null,
    total: 0,
    pages: 1,
    loading: false,
    error: null,
    filters: {},
  },
  reducers: {
    setFilters: (state, action) => { state.filters = action.payload; },
    clearCurrentClass: (state) => { state.currentClass = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClasses.pending, (state) => { state.loading = true; })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = action.payload.classes;
        state.total = action.payload.total;
        state.pages = action.payload.pages;
      })
      .addCase(fetchClasses.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchClassById.pending, (state) => { state.loading = true; })
      .addCase(fetchClassById.fulfilled, (state, action) => { state.loading = false; state.currentClass = action.payload; })
      .addCase(fetchClassById.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchMyClasses.fulfilled, (state, action) => { state.myClasses = action.payload.classes; })
      .addCase(createClass.fulfilled, (state, action) => { state.myClasses.unshift(action.payload.class); })
      .addCase(deleteClass.fulfilled, (state, action) => {
        state.myClasses = state.myClasses.filter(c => c._id !== action.payload);
      });
  },
});

export const { setFilters, clearCurrentClass } = classSlice.actions;
export default classSlice.reducer;
