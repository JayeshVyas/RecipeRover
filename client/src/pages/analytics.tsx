import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Eye, MousePointer, Target, DollarSign, Users, Calendar } from 'lucide-react';

const performanceData = [
  { month: 'Jan', impressions: 45000, clicks: 2250, conversions: 180, revenue: 18000 },
  { month: 'Feb', impressions: 52000, clicks: 2600, conversions: 220, revenue: 22000 },
  { month: 'Mar', impressions: 48000, clicks: 2400, conversions: 190, revenue: 19000 },
  { month: 'Apr', impressions: 61000, clicks: 3050, conversions: 280, revenue: 28000 },
  { month: 'May', impressions: 55000, clicks: 2750, conversions: 250, revenue: 25000 },
  { month: 'Jun', impressions: 68000, clicks: 3400, conversions: 320, revenue: 32000 },
];

const platformData = [
  { name: 'Google Ads', value: 45, color: '#4285F4' },
  { name: 'Meta Ads', value: 30, color: '#1877F2' },
  { name: 'LinkedIn', value: 15, color: '#0A66C2' },
  { name: 'TikTok', value: 10, color: '#FF0050' },
];

const hourlyData = [
  { hour: '00', clicks: 120, conversions: 8 },
  { hour: '06', clicks: 180, conversions: 12 },
  { hour: '12', clicks: 450, conversions: 35 },
  { hour: '18', clicks: 380, conversions: 28 },
];

export default function AnalyticsPage() {
  const { data: campaigns } = useQuery({
    queryKey: ['/api/campaigns'],
  });

  const totalImpressions = performanceData.reduce((sum, item) => sum + item.impressions, 0);
  const totalClicks = performanceData.reduce((sum, item) => sum + item.clicks, 0);
  const totalConversions = performanceData.reduce((sum, item) => sum + item.conversions, 0);
  const totalRevenue = performanceData.reduce((sum, item) => sum + item.revenue, 0);

  const ctr = ((totalClicks / totalImpressions) * 100).toFixed(2);
  const conversionRate = ((totalConversions / totalClicks) * 100).toFixed(2);
  const avgRoas = (totalRevenue / (totalRevenue * 0.3)).toFixed(1); // Assuming 30% ad spend

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              Analytics
            </h1>
            <p className="text-muted-foreground mt-1">Comprehensive performance insights across all platforms</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Select defaultValue="30">
              <SelectTrigger className="w-40" data-testid="select-timeframe">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" data-testid="button-export">
              <Calendar className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card border border-border hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <Eye className="h-6 w-6 text-white" />
                </div>
                <Badge variant="secondary" className="text-green-600 bg-green-100">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12%
                </Badge>
              </div>
              <h3 className="text-2xl font-bold mt-4" data-testid="text-total-impressions">
                {totalImpressions.toLocaleString()}
              </h3>
              <p className="text-sm text-muted-foreground">Total Impressions</p>
            </CardContent>
          </Card>

          <Card className="bg-card border border-border hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                  <MousePointer className="h-6 w-6 text-white" />
                </div>
                <Badge variant="secondary" className="text-green-600 bg-green-100">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +18%
                </Badge>
              </div>
              <h3 className="text-2xl font-bold mt-4" data-testid="text-total-clicks">
                {totalClicks.toLocaleString()}
              </h3>
              <p className="text-sm text-muted-foreground">Total Clicks</p>
              <p className="text-xs text-muted-foreground mt-1">CTR: {ctr}%</p>
            </CardContent>
          </Card>

          <Card className="bg-card border border-border hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <Badge variant="secondary" className="text-green-600 bg-green-100">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +25%
                </Badge>
              </div>
              <h3 className="text-2xl font-bold mt-4" data-testid="text-total-conversions">
                {totalConversions.toLocaleString()}
              </h3>
              <p className="text-sm text-muted-foreground">Total Conversions</p>
              <p className="text-xs text-muted-foreground mt-1">CVR: {conversionRate}%</p>
            </CardContent>
          </Card>

          <Card className="bg-card border border-border hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <Badge variant="secondary" className="text-green-600 bg-green-100">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +15%
                </Badge>
              </div>
              <h3 className="text-2xl font-bold mt-4" data-testid="text-total-revenue">
                ${totalRevenue.toLocaleString()}
              </h3>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-xs text-muted-foreground mt-1">ROAS: {avgRoas}x</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Performance Over Time */}
          <Card className="bg-card border border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Performance Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80" data-testid="chart-performance">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="hsl(var(--primary))"
                      fill="url(#revenueGradient)"
                      strokeWidth={2}
                    />
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Platform Distribution */}
          <Card className="bg-card border border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Platform Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80" data-testid="chart-platform-distribution">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={platformData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {platformData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {platformData.map((platform) => (
                  <div key={platform.name} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: platform.color }}
                    ></div>
                    <span className="text-sm text-muted-foreground">{platform.name}</span>
                    <span className="text-sm font-medium ml-auto">{platform.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Hourly Performance */}
          <Card className="bg-card border border-border">
            <CardHeader>
              <CardTitle className="text-lg">Hourly Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64" data-testid="chart-hourly">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Bar dataKey="clicks" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Top Performing Campaigns */}
          <Card className="bg-card border border-border lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Top Performing Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns?.slice(0, 5).map((campaign: any, index: number) => (
                  <div key={campaign.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                        #{index + 1}
                      </div>
                      <div>
                        <p className="font-medium" data-testid={`text-top-campaign-name-${index}`}>
                          {campaign.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {campaign.platform === 'google-ads' ? '🔍 Google Ads' :
                           campaign.platform === 'meta' ? '📘 Meta' :
                           campaign.platform === 'linkedin' ? '💼 LinkedIn' : '🎵 TikTok'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600" data-testid={`text-campaign-roas-${index}`}>
                        {campaign.roas}x ROAS
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ${campaign.revenue?.toLocaleString() || '0'} revenue
                      </p>
                    </div>
                  </div>
                )) || (
                  <div className="text-center py-8 text-muted-foreground">
                    <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No campaign data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}