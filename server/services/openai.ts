import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key" 
});

export interface AiQueryContext {
  campaigns: Array<{
    name: string;
    platform: string;
    spend: number;
    revenue: number;
    roas: number;
    clicks: number;
    conversions: number;
  }>;
  alerts: Array<{
    type: string;
    message: string;
    severity: string;
  }>;
  timeframe?: string;
}

export async function processMarketingQuery(
  query: string,
  context: AiQueryContext
): Promise<{
  response: string;
  insights?: any;
}> {
  // Check if OpenAI API key is properly configured
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "default_key") {
    return {
      response: "AI features are currently disabled. To enable AI-powered insights and chat, please configure your OpenAI API key in the environment variables. The AI assistant would analyze your campaign data and provide personalized recommendations based on your marketing performance.",
      insights: null,
    };
  }

  try {
    const systemPrompt = `You are a marketing AI assistant specialized in analyzing advertising performance data. 
    You help marketers understand their campaign performance, identify optimization opportunities, and provide actionable insights.
    
    Respond in a friendly, professional tone with specific data points when available.
    If asked about comparisons, calculations, or specific metrics, provide detailed breakdowns.
    Always format monetary values with proper currency symbols and percentages with % signs.
    
    When providing analysis, structure your response with:
    1. Direct answer to the question
    2. Key insights or recommendations
    3. Specific action items if applicable
    
    Respond with JSON in this format: { "response": string, "insights": object }`;

    const userPrompt = `User Query: "${query}"
    
    Available Campaign Data:
    ${context.campaigns.map(campaign => 
      `- ${campaign.name} (${campaign.platform}): Spend: $${campaign.spend}, Revenue: $${campaign.revenue}, ROAS: ${campaign.roas}x, Clicks: ${campaign.clicks}, Conversions: ${campaign.conversions}`
    ).join('\n')}
    
    Active Alerts:
    ${context.alerts.map(alert => `- ${alert.type}: ${alert.message} (${alert.severity})`).join('\n')}
    
    Please analyze this data and respond to the user's query with actionable insights.`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 1000,
    });

    const result = JSON.parse(response.choices[0].message.content || '{"response": "I apologize, but I encountered an error processing your request."}');
    
    return {
      response: result.response,
      insights: result.insights || null,
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    return {
      response: "I'm having trouble connecting to the AI service right now. Please check your API key configuration or try again later. In the meantime, you can still view your campaign performance in the dashboard.",
      insights: null,
    };
  }
}

export async function generateMarketingInsights(
  campaigns: AiQueryContext['campaigns']
): Promise<{
  insights: Array<{
    type: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
  }>;
}> {
  // Check if OpenAI API key is properly configured
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "default_key") {
    return {
      insights: [
        {
          type: "setup",
          title: "AI Insights Disabled",
          description: "Configure OpenAI API key to enable AI-powered marketing insights and automated recommendations based on your campaign performance.",
          priority: "medium"
        },
        {
          type: "manual",
          title: "Manual Analysis Available",
          description: "While AI insights are disabled, you can still analyze your campaign performance using the dashboard metrics and charts above.",
          priority: "low"
        }
      ],
    };
  }

  try {
    const systemPrompt = `You are a marketing AI that generates actionable insights from campaign performance data.
    Analyze the provided campaign data and identify opportunities for optimization, budget reallocation, and performance improvements.
    
    Focus on:
    - ROAS optimization opportunities
    - Budget allocation recommendations
    - Performance trend analysis
    - Platform comparison insights
    
    Respond with JSON in this format: { "insights": [{"type": string, "title": string, "description": string, "priority": string}] }`;

    const userPrompt = `Analyze these campaigns and provide insights:
    ${campaigns.map(campaign => 
      `${campaign.name} (${campaign.platform}): ROAS ${campaign.roas}x, Spend $${campaign.spend}, Revenue $${campaign.revenue}`
    ).join('\n')}`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
      max_tokens: 800,
    });

    const result = JSON.parse(response.choices[0].message.content || '{"insights": []}');
    
    return {
      insights: result.insights || [],
    };
  } catch (error) {
    console.error("Failed to generate insights:", error);
    return {
      insights: [
        {
          type: "error",
          title: "AI Service Temporarily Unavailable",
          description: "Unable to generate insights right now. Please check your API configuration or try again later.",
          priority: "medium"
        }
      ],
    };
  }
}
