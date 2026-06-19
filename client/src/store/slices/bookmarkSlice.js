import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchBookmarks = createAsyncThunk('bookmarks/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/students/bookmarks');
    return res.data.bookmarks;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const addBookmark = createAsyncThunk('bookmarks/add', async (classId, { rejectWithValue }) => {
  try {
    await api.post('/students/bookmarks', { classId });
    return classId;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const removeBookmark = createAsyncThunk('bookmarks/remove', async (classId, { rejectWithValue }) => {
  try {
    await api.delete(`/students/bookmarks/${classId}`);
    return classId;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const bookmarkSlice = createSlice({
  name: 'bookmarks',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookmarks.pending, (state) => { state.loading = true; })
      .addCase(fetchBookmarks.fulfilled, (state, action) => { state.items = action.payload || []; state.loading = false; })
      .addCase(fetchBookmarks.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(addBookmark.fulfilled, (state, action) => { if (!state.items.includes(action.payload)) state.items.push(action.payload); })
      .addCase(removeBookmark.fulfilled, (state, action) => { state.items = state.items.filter(id => id !== action.payload); });
  }
});

export default bookmarkSlice.reducer;
