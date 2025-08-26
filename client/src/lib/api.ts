import { apiRequest } from "./queryClient";

export interface DashboardData {
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  metrics: {
    totalRevenue: number;
    totalSpend: number;
    averageRoas: number;
    averageCtr: number;
    totalLeads: number;
    growthRate: number;
  };
  campaigns: Array<{
    id: string;
    name: string;
    platform: string;
    spend: number;
    revenue: number;
    roas: number;
    status: string;
  }>;
  alerts: Array<{
    id: string;
    type: string;
    title: string;
    message: string;
    severity: string;
    createdAt: string;
  }>;
  revenueChartData: Array<{
    month: string;
    revenue: number;
  }>;
  recentActivity: Array<{
    id: string;
    type: string;
    message: string;
    platform: string;
    timestamp: string;
  }>;
}

export interface AiChatResponse {
  response: string;
  insights?: any;
}

export interface AiInsight {
  type: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
}

export const api = {
  dashboard: {
    get: async (): Promise<DashboardData> => {
      const res = await apiRequest("GET", "/api/dashboard");
      return res.json();
    },
  },
  
  ai: {
    chat: async (query: string, context?: any): Promise<AiChatResponse> => {
      const res = await apiRequest("POST", "/api/ai/chat", { query, context });
      return res.json();
    },
    
    insights: async (): Promise<{ insights: AiInsight[] }> => {
      const res = await apiRequest("GET", "/api/ai/insights");
      return res.json();
    },
  },
  
  alerts: {
    list: async () => {
      const res = await apiRequest("GET", "/api/alerts");
      return res.json();
    },
    
    markRead: async (id: string) => {
      const res = await apiRequest("PATCH", `/api/alerts/${id}/read`);
      return res.json();
    },
  },
  
  googleAds: {
    accounts: async () => {
      const res = await apiRequest("GET", "/api/google-ads/accounts");
      return res.json();
    },
    
    campaigns: async (accountId: string) => {
      const res = await apiRequest("GET", `/api/google-ads/campaigns/${accountId}`);
      return res.json();
    },
  },
};
