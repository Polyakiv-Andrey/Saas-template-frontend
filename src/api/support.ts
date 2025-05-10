import { api } from './config';

export interface SupportTicketPayload {
  title: string;
  description: string;
}

export interface SupportTicketResponse {
  id: number;
  subject: string;
  message: string;
  created_at: string;
  status: string;
}

export const supportApi = {
  createTicket: async (payload: SupportTicketPayload): Promise<SupportTicketResponse> => {
    const { data } = await api.post<SupportTicketResponse>('/support/create_ticket/', payload);
    return data;
  },
};