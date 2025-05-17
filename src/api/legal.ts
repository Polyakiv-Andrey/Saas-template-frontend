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

export interface TermsOfServiceSection {
  heading: string;
  text?: string;
  items?: string[];
}

export interface TermsOfServiceResponse {
  title: string;
  effective_date: string;
  content: TermsOfServiceSection[];
}

export const legalApi = {
  getPrivacyPolicy: async (): Promise<PrivacyPolicyResponse> => {
    const responce = await api.get('/legal/privacy');
    return responce.data;
  },
  getTermsOfService: async (): Promise<TermsOfServiceResponse> => {
    const responce = await api.get('/legal/terms/');
    return responce.data;
  }
};

export default legalApi;