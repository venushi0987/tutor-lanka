import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const storedUser = (() => {
  try { return JSON.parse(localStorage.getItem('educonnect_user')); } catch { return null; }
})();
const storedToken = localStorage.getItem('educonnect_token');

// ─── Async Thunks ──────────────────────────────────────────────────────────────

export const register = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/register', data);
    const { token, accessToken, user } = res.data;
    const authToken = token || accessToken;
    localStorage.setItem('educonnect_token', authToken);
    localStorage.setItem('educonnect_user', JSON.stringify(user));
    return { token: authToken, user };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

export const login = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/login', data);
    const { token, accessToken, user } = res.data;
    const authToken = token || accessToken;
    localStorage.setItem('educonnect_token', authToken);
    localStorage.setItem('educonnect_user', JSON.stringify(user));
    return { token: authToken, user };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await api.post('/auth/logout');
  } catch {
    // ignore server errors on logout
  } finally {
    localStorage.removeItem('educonnect_token');
    localStorage.removeItem('educonnect_user');
  }
});

export const getMe = createAsyncThunk('auth/getMe', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/auth/me');
    const user = res.data.user || res.data;
    localStorage.setItem('educonnect_user', JSON.stringify(user));
    return { user };
  } catch (err) {
    localStorage.removeItem('educonnect_token');
    localStorage.removeItem('educonnect_user');
    return rejectWithValue(err.response?.data?.message || 'Session expired');
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (data, { rejectWithValue }) => {
  try {
    const res = await api.put('/auth/profile', data);
    const user = res.data.user || res.data;
    localStorage.setItem('educonnect_user', JSON.stringify(user));
    return { user };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Update failed');
  }
});

export const refreshToken = createAsyncThunk('auth/refreshToken', async (_, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/refresh-token');
    const { token, accessToken } = res.data;
    const authToken = token || accessToken;
    localStorage.setItem('educonnect_token', authToken);
    return { token: authToken };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Token refresh failed');
  }
});

// ─── Slice ────────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: storedUser || null,
    token: storedToken || null,
    isAuthenticated: !!storedToken && !!storedUser,
    loading: false,
    error: null,
    isInitialized: false,
  },
  reducers: {
    logoutLocal: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isInitialized = true;
      localStorage.removeItem('educonnect_token');
      localStorage.removeItem('educonnect_user');
    },
    clearError: (state) => { state.error = null; },
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    initialize: (state) => { state.isInitialized = true; },
  },
  extraReducers: (builder) => {
    builder
      // register
      .addCase(register.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.isInitialized = true;
      })
      .addCase(register.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      // login
      .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.isInitialized = true;
      })
      .addCase(login.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      // logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isInitialized = true;
      })
      // getMe
      .addCase(getMe.pending, (state) => { state.loading = true; })
      .addCase(getMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isInitialized = true;
      })
      .addCase(getMe.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isInitialized = true;
      })
      // updateProfile
      .addCase(updateProfile.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(updateProfile.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      // refreshToken
      .addCase(refreshToken.fulfilled, (state, action) => { state.token = action.payload.token; });
  },
});

export const { logoutLocal, clearError, setCredentials, initialize } = authSlice.actions;
export default authSlice.reducer;

// ─── Selectors ────────────────────────────────────────────────────────────────
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsAdmin = (state) => state.auth.user?.role === 'admin';
export const selectIsTutor = (state) => state.auth.user?.role === 'tutor';
export const selectIsStudent = (state) => state.auth.user?.role === 'student';
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
