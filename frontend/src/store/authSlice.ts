import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../config/config';

const TOKEN_STORAGE_KEY = 'auth_token';
const USERNAME_STORAGE_KEY = 'auth_username';

interface LoginError {
  message: string;
  retryAfterSeconds?: number;
}

interface AuthState {
  token: string | null;
  username: string | null;
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
  retryAfterSeconds: number | null;
  sessionChecked: boolean;
}

const initialState: AuthState = {
  token: localStorage.getItem(TOKEN_STORAGE_KEY),
  username: localStorage.getItem(USERNAME_STORAGE_KEY),
  status: 'idle',
  error: null,
  retryAfterSeconds: null,
  sessionChecked: false,
};

export const login = createAsyncThunk<
  { token: string; username: string },
  { username: string; password: string },
  { rejectValue: LoginError }
>('auth/login', async (payload, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, payload);
    return response.data as { token: string; username: string };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const retryAfter = error.response.headers['retry-after'];
      return rejectWithValue({
        message: error.response.data?.error || 'Login failed',
        retryAfterSeconds: retryAfter ? Number(retryAfter) : undefined,
      });
    }
    return rejectWithValue({ message: 'Login failed' });
  }
});

export const verifySession = createAsyncThunk('auth/verifySession', async () => {
  if (!localStorage.getItem(TOKEN_STORAGE_KEY)) return;
  try {
    await axios.get(`${API_URL}/api/auth/me`);
  } catch {
    // a 401 here is already handled globally by the response interceptor (logs the user out)
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.username = null;
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USERNAME_STORAGE_KEY);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.retryAfterSeconds = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ token: string; username: string }>) => {
        state.status = 'idle';
        state.token = action.payload.token;
        state.username = action.payload.username;
        localStorage.setItem(TOKEN_STORAGE_KEY, action.payload.token);
        localStorage.setItem(USERNAME_STORAGE_KEY, action.payload.username);
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Login failed';
        state.retryAfterSeconds = action.payload?.retryAfterSeconds ?? null;
      })
      .addCase(verifySession.fulfilled, (state) => {
        state.sessionChecked = true;
      })
      .addCase(verifySession.rejected, (state) => {
        state.sessionChecked = true;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
