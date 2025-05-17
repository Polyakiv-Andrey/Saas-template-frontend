import { api } from './config';

export interface PrivacyPolicySection {
  heading: string;
  text?: string;
  items?: string[];
  subsections?: {
    subheading: string;
    items: string[];
  }[];
}

export interface PrivacyPolicyResponse {
  title: string;
  last_updated: string;
  content: PrivacyPolicySection[];
}

export const legalApi = {
  getPrivacyPolicy: async (): Promise<PrivacyPolicyResponse> => {
    const responce = await api.get('/legal/privacy');
    return responce.data;
  }
};

export default legalApi;