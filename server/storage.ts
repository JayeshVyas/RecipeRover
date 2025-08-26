import { 
  type User, 
  type InsertUser, 
  type Campaign, 
  type InsertCampaign,
  type Alert,
  type InsertAlert,
  type AiInteraction,
  type InsertAiInteraction,
  type ConnectedAccount,
  type InsertConnectedAccount
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Campaigns
  getCampaigns(userId: string): Promise<Campaign[]>;
  getCampaign(id: string): Promise<Campaign | undefined>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  updateCampaign(id: string, updates: Partial<Campaign>): Promise<Campaign | undefined>;
  updateCampaignStatus(id: string, status: string): Promise<Campaign | undefined>;
  
  // Alerts
  getAlerts(userId: string): Promise<Alert[]>;
  getUnreadAlerts(userId: string): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  markAlertAsRead(id: string): Promise<Alert | undefined>;
  
  // AI Interactions
  getAiInteractions(userId: string, limit?: number): Promise<AiInteraction[]>;
  createAiInteraction(interaction: InsertAiInteraction): Promise<AiInteraction>;
  
  // Connected Accounts
  getConnectedAccounts(userId: string): Promise<ConnectedAccount[]>;
  createConnectedAccount(account: InsertConnectedAccount): Promise<ConnectedAccount>;
  getConnectedAccount(userId: string, platform: string): Promise<ConnectedAccount | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private campaigns: Map<string, Campaign> = new Map();
  private alerts: Map<string, Alert> = new Map();
  private aiInteractions: Map<string, AiInteraction> = new Map();
  private connectedAccounts: Map<string, ConnectedAccount> = new Map();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Create a demo user
    const userId = randomUUID();
    const user: User = {
      id: userId,
      username: "john.martinez",
      password: "hashedpassword",
      firstName: "John",
      lastName: "Martinez",
      email: "john.martinez@example.com",
      role: "user",
      createdAt: new Date(),
    };
    this.users.set(userId, user);

    // Create sample campaigns
    const campaigns = [
      {
        id: randomUUID(),
        userId,
        name: "Black Friday Sale",
        platform: "google_ads",
        accountId: "123456789",
        campaignId: "campaign_1",
        status: "active" as const,
        budget: "5000.00",
        spend: "4250.00",
        revenue: "18420.00",
        clicks: 1247,
        impressions: 45230,
        conversions: 89,
        cpc: "3.41",
        ctr: "2.76",
        roas: "4.33",
        lastUpdated: new Date(),
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        userId,
        name: "Holiday Retargeting",
        platform: "meta_ads",
        accountId: "987654321",
        campaignId: "campaign_2",
        status: "active" as const,
        budget: "3000.00",
        spend: "2850.00",
        revenue: "13680.00",
        clicks: 892,
        impressions: 32450,
        conversions: 67,
        cpc: "3.19",
        ctr: "2.75",
        roas: "4.80",
        lastUpdated: new Date(),
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        userId,
        name: "LinkedIn B2B",
        platform: "linkedin_ads",
        accountId: "456789123",
        campaignId: "campaign_3",
        status: "active" as const,
        budget: "2000.00",
        spend: "1890.00",
        revenue: "7371.00",
        clicks: 423,
        impressions: 15670,
        conversions: 34,
        cpc: "4.47",
        ctr: "2.70",
        roas: "3.90",
        lastUpdated: new Date(),
        createdAt: new Date(),
      },
    ];

    campaigns.forEach(campaign => {
      this.campaigns.set(campaign.id, campaign);
    });

    // Create sample alerts
    const alerts = [
      {
        id: randomUUID(),
        userId,
        type: "cpc_threshold",
        title: "High CPC Alert",
        message: "Google Ads CPC exceeded $8.50 threshold",
        severity: "high" as const,
        isRead: false,
        triggerValue: "8.50",
        campaignId: campaigns[0].id,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
      {
        id: randomUUID(),
        userId,
        type: "budget_warning",
        title: "Budget Warning",
        message: "Holiday campaign at 85% of daily budget",
        severity: "medium" as const,
        isRead: false,
        triggerValue: "85.00",
        campaignId: campaigns[1].id,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      },
    ];

    alerts.forEach(alert => {
      this.alerts.set(alert.id, alert);
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  // Campaign methods
  async getCampaigns(userId: string): Promise<Campaign[]> {
    return Array.from(this.campaigns.values()).filter(campaign => campaign.userId === userId);
  }

  async getCampaign(id: string): Promise<Campaign | undefined> {
    return this.campaigns.get(id);
  }

  async createCampaign(insertCampaign: InsertCampaign): Promise<Campaign> {
    const id = randomUUID();
    const campaign: Campaign = {
      ...insertCampaign,
      id,
      createdAt: new Date(),
      lastUpdated: new Date(),
    };
    this.campaigns.set(id, campaign);
    return campaign;
  }

  async updateCampaign(id: string, updates: Partial<Campaign>): Promise<Campaign | undefined> {
    const campaign = this.campaigns.get(id);
    if (!campaign) return undefined;
    
    const updatedCampaign = { ...campaign, ...updates, lastUpdated: new Date() };
    this.campaigns.set(id, updatedCampaign);
    return updatedCampaign;
  }

  async updateCampaignStatus(id: string, status: string): Promise<Campaign | undefined> {
    const campaign = this.campaigns.get(id);
    if (!campaign) return undefined;
    
    const updatedCampaign = { ...campaign, status, lastUpdated: new Date() };
    this.campaigns.set(id, updatedCampaign);
    return updatedCampaign;
  }

  // Alert methods
  async getAlerts(userId: string): Promise<Alert[]> {
    return Array.from(this.alerts.values())
      .filter(alert => alert.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getUnreadAlerts(userId: string): Promise<Alert[]> {
    return Array.from(this.alerts.values())
      .filter(alert => alert.userId === userId && !alert.isRead)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createAlert(insertAlert: InsertAlert): Promise<Alert> {
    const id = randomUUID();
    const alert: Alert = {
      ...insertAlert,
      id,
      createdAt: new Date(),
    };
    this.alerts.set(id, alert);
    return alert;
  }

  async markAlertAsRead(id: string): Promise<Alert | undefined> {
    const alert = this.alerts.get(id);
    if (!alert) return undefined;
    
    const updatedAlert = { ...alert, isRead: true };
    this.alerts.set(id, updatedAlert);
    return updatedAlert;
  }

  // AI Interaction methods
  async getAiInteractions(userId: string, limit = 50): Promise<AiInteraction[]> {
    return Array.from(this.aiInteractions.values())
      .filter(interaction => interaction.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async createAiInteraction(insertInteraction: InsertAiInteraction): Promise<AiInteraction> {
    const id = randomUUID();
    const interaction: AiInteraction = {
      ...insertInteraction,
      id,
      createdAt: new Date(),
    };
    this.aiInteractions.set(id, interaction);
    return interaction;
  }

  // Connected Account methods
  async getConnectedAccounts(userId: string): Promise<ConnectedAccount[]> {
    return Array.from(this.connectedAccounts.values())
      .filter(account => account.userId === userId);
  }

  async createConnectedAccount(insertAccount: InsertConnectedAccount): Promise<ConnectedAccount> {
    const id = randomUUID();
    const account: ConnectedAccount = {
      ...insertAccount,
      id,
      createdAt: new Date(),
    };
    this.connectedAccounts.set(id, account);
    return account;
  }

  async getConnectedAccount(userId: string, platform: string): Promise<ConnectedAccount | undefined> {
    return Array.from(this.connectedAccounts.values())
      .find(account => account.userId === userId && account.platform === platform);
  }
}

export const storage = new MemStorage();
