import { api } from './config';

export interface SupportTicketPayload {
  title: string;
  description: string;
  image?: File | null;
}

export interface SupportTicketResponse {
  id: number;
  title: string;
  description: string;
  image_url?: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string | null;
  reported_by_email: string;
}

export interface SupportTicketListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: SupportTicketResponse[];
}

export interface SupportTicketListParams {
  status?: boolean;
  limit?: number;
  offset?: number;
}

export interface SupportTicketStatus {
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
  getTickets: async (params?: SupportTicketListParams): Promise<SupportTicketListResponse> => {
    const { data } = await api.get<SupportTicketListResponse>('/support/tickets/', {
      params,
    });
    return data;
  },
  updateTicketStatus: async (
    ticketId: number,
    payload: SupportTicketStatus
  ): Promise<SupportTicketStatus> => {
    const { data } = await api.patch<SupportTicketStatus>(
      `/support/tickets-status/${ticketId}/`,
      payload
    );
    return data;
  },
};