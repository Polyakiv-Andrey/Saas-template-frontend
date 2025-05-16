import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authService } from '../../api/auth';
interface AuthState {
  isAuthenticated: boolean;
  user: CurrentUser | null;
}
const initialState: AuthState = {
  isAuthenticated: !!localStorage.getItem('access_token'),
  user: null,
};
interface CurrentUser {
  id: number;
  email: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
}

export const fetchCurrentUser = createAsyncThunk<CurrentUser>(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const data = await authService.getCurrentUser();
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Failed to fetch user');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state) {
      state.isAuthenticated = true;
    },
    logout(state) {
      state.isAuthenticated = false;
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    },
    setUser(state, action: PayloadAction<CurrentUser>) {
      state.user = action.payload;
      console.log(state.user)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.user = null;
      });
  }
});

export const { login, logout, setUser } = authSlice.actions;
export default authSlice.reducer; 