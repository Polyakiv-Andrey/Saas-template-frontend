import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { subscriptionService } from '../../api/subscription';

interface Plan {
  id: number;
  name: string;
  price: string;
  currency: string;
  interval: string;
  features: { [key: string]: string };
  is_active: boolean;
}

interface CurrentSubscription {
  cancel_at_period_end: boolean;
  created_at: string;
  current_period_end: string;
  current_period_start: string;
  id: number;
  plan: Plan;
  status: string;
  stripe_subscription_id: string;
}

interface SubscriptionState {
  currentSubscription: CurrentSubscription | null;
  loading: boolean;
  error: string | null;
}

const initialState: SubscriptionState = {
  currentSubscription: null,
  loading: false,
  error: null,
};

export const fetchCurrentSubscription = createAsyncThunk(
  'subscription/fetchCurrent',
  async () => {
    const response = await subscriptionService.getCurrentSubscription();
    return response;
  }
);

export const cancelSubscription = createAsyncThunk(
  'subscription/cancel',
  async (subscriptionId: number) => {
    await subscriptionService.cancelSubscription(subscriptionId);
    const response = await subscriptionService.getCurrentSubscription();
    return response;
  }
);


const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    clearSubscription: (state) => {
      state.currentSubscription = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSubscription = action.payload;
      })
      .addCase(fetchCurrentSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch subscription';
      })
      .addCase(cancelSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSubscription = null;
      })
      .addCase(cancelSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to cancel subscription';
      })
  },
});

export const { clearSubscription } = subscriptionSlice.actions;
export default subscriptionSlice.reducer; 