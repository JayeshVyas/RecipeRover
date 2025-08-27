
import { Router } from 'express';
import { db } from './storage';
import { users } from '../shared/schema';
import jwt from 'jsonwebtoken';
import { sql } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { authMiddleware, errorHandler, AuthenticatedRequest } from './middleware/auth';
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key';


const router = Router();

// Register
router.post('/api/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) return res.status(400).json({ error: 'Missing fields' });
  // Check if email already exists
  const existing = await db.select().from(users).where(sql`${users.email} = ${email}`);
  if (existing.length > 0) {
    return res.status(400).json({ error: 'Email already exists' });
  }
  const hashed = await bcrypt.hash(password, 10);
  const username = email.split('@')[0];
  const [user] = await db.insert(users).values({ firstName, lastName, email, password: hashed, username, role: 'user', createdAt: new Date() }).returning();
  // Create JWT token
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  res.cookie('token', token, { httpOnly: true });
  res.json({ id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email });
});

// Login
router.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
  const usersResult = await db.select().from(users).where(sql`${users.email} = ${email}`);
  const user = usersResult[0];
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
  // TODO: Set session/cookie here
  // Create JWT token
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  res.cookie('token', token, { httpOnly: true });
  res.json({ id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email });
});

// Logout
router.post('/api/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

import { storage } from "./storage";
import { processMarketingQuery, generateMarketingInsights } from "./services/openai";
import { googleAdsService } from "./services/google-ads";
import { z } from "zod";

// Dashboard data endpoint
router.get("/api/dashboard", authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const [campaigns, alerts, aiInteractions] = await Promise.all([
      storage.getCampaigns(user.id),
      storage.getUnreadAlerts(user.id),
      storage.getAiInteractions(user.id, 5)
    ]);

    // Calculate aggregate metrics
    const totalRevenue = campaigns.reduce((sum, c) => sum + parseFloat(c.revenue || "0"), 0);
    const totalSpend = campaigns.reduce((sum, c) => sum + parseFloat(c.spend || "0"), 0);
    const totalClicks = campaigns.reduce((sum, c) => sum + (c.clicks || 0), 0);
    const totalConversions = campaigns.reduce((sum, c) => sum + (c.conversions || 0), 0);
    const averageRoas = totalSpend > 0 ? totalRevenue / totalSpend : 0;
    const averageCtr = campaigns.length > 0 
      ? campaigns.reduce((sum, c) => sum + parseFloat(c.ctr || "0"), 0) / campaigns.length 
      : 0;

    // Generate revenue chart data (last 6 months)
    const revenueChartData = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      const monthRevenue = totalRevenue * (0.7 + Math.random() * 0.6); // Simulate historical data
      return {
        month: date.toLocaleString('default', { month: 'short' }),
        revenue: Math.round(monthRevenue)
      };
    });

    res.json({
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      },
      metrics: {
        totalRevenue,
        totalSpend,
        averageRoas,
        averageCtr,
        totalLeads: totalConversions,
        growthRate: 12.5 // Simulated
      },
      campaigns: campaigns.map(c => ({
        id: c.id,
        name: c.name,
        platform: c.platform,
        spend: parseFloat(c.spend || "0"),
        revenue: parseFloat(c.revenue || "0"),
        roas: parseFloat(c.roas || "0"),
        status: c.status
      })),
      alerts: alerts.slice(0, 5),
      revenueChartData,
      recentActivity: campaigns.slice(0, 3).map(c => ({
        id: c.id,
        type: "campaign_update",
        message: `Campaign "${c.name}" performance updated`,
        platform: c.platform,
        timestamp: c.lastUpdated
      }))
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
});

  // Dashboard data endpoint
  router.get("/api/dashboard", authMiddleware, async (req: AuthenticatedRequest, res) => {
    // Dashboard data endpoint
    try {
      const user = req.user;

      const [campaigns, alerts, aiInteractions] = await Promise.all([
        storage.getCampaigns(user.id),
        storage.getUnreadAlerts(user.id),
        storage.getAiInteractions(user.id, 5)
      ]);

      // Calculate aggregate metrics
      const totalRevenue = campaigns.reduce((sum, c) => sum + parseFloat(c.revenue || "0"), 0);
      const totalSpend = campaigns.reduce((sum, c) => sum + parseFloat(c.spend || "0"), 0);
      const totalClicks = campaigns.reduce((sum, c) => sum + (c.clicks || 0), 0);
      const totalConversions = campaigns.reduce((sum, c) => sum + (c.conversions || 0), 0);
      const averageRoas = totalSpend > 0 ? totalRevenue / totalSpend : 0;
      const averageCtr = campaigns.length > 0 
        ? campaigns.reduce((sum, c) => sum + parseFloat(c.ctr || "0"), 0) / campaigns.length 
        : 0;

      // Generate revenue chart data (last 6 months)
      const revenueChartData = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (5 - i));
        const monthRevenue = totalRevenue * (0.7 + Math.random() * 0.6); // Simulate historical data
        return {
          month: date.toLocaleString('default', { month: 'short' }),
          revenue: Math.round(monthRevenue)
        };
      });

      res.json({
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        },
        metrics: {
          totalRevenue,
          totalSpend,
          averageRoas,
          averageCtr,
          totalLeads: totalConversions,
          growthRate: 12.5 // Simulated
        },
        campaigns: campaigns.map(c => ({
          id: c.id,
          name: c.name,
          platform: c.platform,
          spend: parseFloat(c.spend || "0"),
          revenue: parseFloat(c.revenue || "0"),
          roas: parseFloat(c.roas || "0"),
          status: c.status
        })),
        alerts: alerts.slice(0, 5),
        revenueChartData,
        recentActivity: campaigns.slice(0, 3).map(c => ({
          id: c.id,
          type: "campaign_update",
          message: `Campaign "${c.name}" performance updated`,
          platform: c.platform,
          timestamp: c.lastUpdated
        }))
      });
    } catch (error) {
      console.error("Dashboard error:", error);
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  // Campaign Routes
  router.get('/api/campaigns', authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const user = req.user;
      const campaigns = await storage.getCampaigns(user.id);
      res.json(campaigns);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      res.status(500).json({ message: 'Failed to fetch campaigns' });
    }
  });

  const createCampaignSchema = z.object({
    name: z.string().min(1, "Campaign name is required"),
    platform: z.enum(['google-ads', 'meta', 'linkedin', 'tiktok']),
    budget: z.number().min(0, "Budget must be non-negative"),
    objective: z.string().min(1, "Objective is required"),
    targetAudience: z.string().optional()
  });

  router.post('/api/campaigns', authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const user = req.user;
      
      const validatedData = createCampaignSchema.parse(req.body);
      const campaignData = {
        ...validatedData,
        budget: String(validatedData.budget),
        userId: user.id,
        accountId: 'demo',
        campaignId: 'demo-' + Date.now(),
        status: 'draft',
        impressions: 0,
        clicks: 0,
        conversions: 0,
        spend: '0',
        revenue: '0',
        roas: '0'
      };
      const campaign = await storage.createCampaign(campaignData);
      res.json(campaign);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid campaign data", errors: error.errors });
      }
      console.error('Error creating campaign:', error);
      res.status(500).json({ message: 'Failed to create campaign' });
    }
  });

  router.patch('/api/campaigns/:id/status', authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
  const user = req.user;
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const { id } = req.params;
      const { status } = req.body;
      
      if (!['active', 'paused', 'draft'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }
      
      const campaign = await storage.updateCampaignStatus(id, status);
      res.json(campaign);
    } catch (error) {
      console.error('Error updating campaign status:', error);
      res.status(500).json({ message: 'Failed to update campaign status' });
    }
  });

  // AI Chat endpoint
  const aiChatSchema = z.object({
    query: z.string().min(1, "Query is required"),
    context: z.object({
      timeframe: z.string().optional()
    }).optional()
  });

  router.post("/api/ai/chat", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
  const user = req.user;
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { query, context } = aiChatSchema.parse(req.body);

      // Get user's campaigns and alerts for context
      const [campaigns, alerts] = await Promise.all([
        storage.getCampaigns(user.id),
        storage.getAlerts(user.id)
      ]);

      const aiContext = {
        campaigns: campaigns.map(c => ({
          name: c.name,
          platform: c.platform,
          spend: parseFloat(c.spend || "0"),
          revenue: parseFloat(c.revenue || "0"),
          roas: parseFloat(c.roas || "0"),
          clicks: c.clicks || 0,
          conversions: c.conversions || 0
        })),
        alerts: alerts.slice(0, 5).map(a => ({
          type: a.type,
          message: a.message,
          severity: a.severity
        })),
        timeframe: context?.timeframe || "last 30 days"
      };

      const aiResponse = await processMarketingQuery(query, aiContext);

      // Store the interaction
      await storage.createAiInteraction({
        userId: user.id,
        query,
        response: aiResponse.response,
        context: aiContext
      });

      res.json({
        response: aiResponse.response,
        insights: aiResponse.insights
      });
    } catch (error) {
      console.error("AI chat error:", error);
      res.status(500).json({ message: "Failed to process AI query" });
    }
  });

  // AI Insights endpoint
  router.get("/api/ai/insights", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
  const user = req.user;
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const campaigns = await storage.getCampaigns(user.id);
      
      const campaignData = campaigns.map(c => ({
        name: c.name,
        platform: c.platform,
        spend: parseFloat(c.spend || "0"),
        revenue: parseFloat(c.revenue || "0"),
        roas: parseFloat(c.roas || "0"),
        clicks: c.clicks || 0,
        conversions: c.conversions || 0
      }));

      const insights = await generateMarketingInsights(campaignData);

      res.json(insights);
    } catch (error) {
      console.error("AI insights error:", error);
      res.status(500).json({ message: "Failed to generate insights" });
    }
  });

  // Google Ads integration endpoints
  router.get("/api/google-ads/accounts", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
  const user = req.user;
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const accounts = await googleAdsService.getAccounts();
      res.json(accounts);
    } catch (error) {
      console.error("Google Ads accounts error:", error);
      res.status(500).json({ message: "Failed to fetch Google Ads accounts" });
    }
  });

  router.get("/api/google-ads/campaigns/:accountId", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
  const user = req.user;
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { accountId } = req.params;
      const metrics = await googleAdsService.getCampaignMetrics(accountId);
      
      res.json(metrics);
    } catch (error) {
      console.error("Google Ads campaigns error:", error);
      res.status(500).json({ message: "Failed to fetch campaign metrics" });
    }
  });

  // Alerts endpoints
  router.get("/api/alerts", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
  const user = req.user;
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const alerts = await storage.getAlerts(user.id);
      res.json(alerts);
    } catch (error) {
      console.error("Alerts error:", error);
      res.status(500).json({ message: "Failed to fetch alerts" });
    }
  });

  router.patch("/api/alerts/:id/read", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
  const user = req.user;
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { id } = req.params;
      const alert = await storage.markAlertAsRead(id);
      
      if (!alert) {
        return res.status(404).json({ message: "Alert not found" });
      }

      res.json(alert);
    } catch (error) {
      console.error("Mark alert read error:", error);
      res.status(500).json({ message: "Failed to mark alert as read" });
    }
  });

  // Add error handling middleware at the end
  router.use(errorHandler);

// Export router for use in server entry
export default router;
