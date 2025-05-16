import { api } from './config';

export interface SupportTicketPayload {
  title: string;
  description: string;
  image?: File | null;
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
    const formData = new FormData();
    formData.append('title', payload.title);
    formData.append('description', payload.description);
    if (payload.image) {
      formData.append('image', payload.image);
    }
  
    const { data } = await api.post<SupportTicketResponse>('/support/create_ticket/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },
  
};