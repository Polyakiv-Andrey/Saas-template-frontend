import { api } from './config';

export interface CreateSubscriptionResponse {
  subscription_id: string;
  status: string;
}

interface Plan {
  id: number;
  name: string;
  price: string;
  currency: string;
  interval: string;
  features: {
    feature_1: string;
    feature_2: string;
  };
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

export const subscriptionService = {
  getPlans: async () => {
    const response = await api.get<[Plan]>('/subscription/plans/');
    return response.data;
  },
  getCurrentSubscription: async () => {
    const responce = await api.get<CurrentSubscription>('/subscription/subscription')
    return responce.data
  },
  createSubscription: async (
    planId: number,
    paymentMethodId: string
  ): Promise<CreateSubscriptionResponse> => {
    const { data } = await api.post<CreateSubscriptionResponse>('/subscription/subscription/', {
      plan_id: planId,
      payment_method_id: paymentMethodId,
    });
    return data;
  },
  cancelSubscription: async (subscriptionId: number): Promise<void> => {
    await api.delete(`/subscription/subscription/`);
  },
}; 

