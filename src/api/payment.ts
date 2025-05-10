import { api } from './config';

interface CreateSubscriptionResponse {
  client_secret: string;
}

export const paymentApi = {
  createSubscription: async (planId: number, paymentMethodId: string): Promise<CreateSubscriptionResponse> => {
    const { data } = await api.post<CreateSubscriptionResponse>('/subscription/subscription/', {
      plan_id: planId,
      payment_method_id: paymentMethodId,
    });
    return data;
  },
}; 