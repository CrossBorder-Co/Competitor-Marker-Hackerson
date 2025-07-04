"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, Minus, Users, DollarSign, Target, Zap } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface CompetitorAnalysisProps {
  company: string
  startDate: Date | undefined
  endDate: Date | undefined
}

const marketShareData = [
  { month: "Jan", company: 35, competitor1: 25, competitor2: 20, others: 20 },
  { month: "Feb", company: 37, competitor1: 24, competitor2: 19, others: 20 },
  { month: "Mar", company: 36, competitor1: 26, competitor2: 18, others: 20 },
  { month: "Apr", company: 38, competitor1: 25, competitor2: 17, others: 20 },
  { month: "May", company: 40, competitor1: 24, competitor2: 16, others: 20 },
  { month: "Jun", company: 39, competitor1: 25, competitor2: 16, others: 20 },
]

const competitorMetrics = [
  { name: "Market Share", value: 39, change: 4, trend: "up" },
  { name: "Brand Sentiment", value: 78, change: -2, trend: "down" },
  { name: "Innovation Index", value: 85, change: 8, trend: "up" },
  { name: "Customer Satisfaction", value: 82, change: 0, trend: "stable" },
]

const threatLevels = [
  { name: "Direct Competitors", value: 75, color: "#ef4444" },
  { name: "New Entrants", value: 45, color: "#f97316" },
  { name: "Substitutes", value: 30, color: "#eab308" },
  { name: "Suppliers", value: 20, color: "#22c55e" },
]

const COLORS = ["#3b82f6", "#ef4444", "#f97316", "#22c55e", "#8b5cf6"]

export function CompetitorAnalysis({ company, startDate, endDate }: CompetitorAnalysisProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Competitive Intelligence Dashboard
          </CardTitle>
          <CardDescription>Comprehensive analysis of {company}'s competitive position</CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="market-share">Market Share</TabsTrigger>
          <TabsTrigger value="threats">Threat Analysis</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {competitorMetrics.map((metric) => (
              <Card key={metric.name}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">{metric.name}</p>
                      <p className="text-2xl font-bold">{metric.value}%</p>
                    </div>
                    <div
                      className={`p-2 rounded-full ${
                        metric.trend === "up" ? "bg-green-100" : metric.trend === "down" ? "bg-red-100" : "bg-slate-100"
                      }`}
                    >
                      {metric.trend === "up" ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : metric.trend === "down" ? (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      ) : (
                        <Minus className="h-4 w-4 text-slate-600" />
                      )}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge
                      variant={
                        metric.trend === "up" ? "default" : metric.trend === "down" ? "destructive" : "secondary"
                      }
                    >
                      {metric.change > 0 ? "+" : ""}
                      {metric.change}%
                    </Badge>
                    <span className="text-xs text-slate-500">vs last period</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Competitive Positioning */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Competitive Strengths</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Brand Recognition</span>
                      <span>92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Product Quality</span>
                      <span>88%</span>
                    </div>
                    <Progress value={88} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Customer Service</span>
                      <span>85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Innovation</span>
                      <span>79%</span>
                    </div>
                    <Progress value={79} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Areas for Improvement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Pricing Competitiveness</span>
                      <span>65%</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Market Agility</span>
                      <span>58%</span>
                    </div>
                    <Progress value={58} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Digital Presence</span>
                      <span>72%</span>
                    </div>
                    <Progress value={72} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Partnership Network</span>
                      <span>61%</span>
                    </div>
                    <Progress value={61} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="market-share" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Market Share Trends</CardTitle>
              <CardDescription>6-month market share evolution</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={marketShareData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="company" stroke="#3b82f6" strokeWidth={3} name={company} />
                  <Line type="monotone" dataKey="competitor1" stroke="#ef4444" strokeWidth={2} name="Competitor A" />
                  <Line type="monotone" dataKey="competitor2" stroke="#f97316" strokeWidth={2} name="Competitor B" />
                  <Line type="monotone" dataKey="others" stroke="#6b7280" strokeWidth={2} name="Others" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Market Position</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: company, value: 39 },
                        { name: "Competitor A", value: 25 },
                        { name: "Competitor B", value: 16 },
                        { name: "Others", value: 20 },
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {[0, 1, 2, 3].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Competitive Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Market Leader</span>
                  </div>
                  <Badge className="bg-blue-600">{company}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Growth Rate</span>
                  </div>
                  <span className="font-semibold text-green-600">+12.5%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-slate-600" />
                    <span className="font-medium">Revenue Share</span>
                  </div>
                  <span className="font-semibold">$2.1B</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="threats" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Threat Assessment Matrix</CardTitle>
              <CardDescription>Analysis of competitive threats by category</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={threatLevels} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" width={120} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">High Priority Threats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <h4 className="font-semibold text-red-800">Competitor A - Aggressive Pricing</h4>
                  <p className="text-sm text-red-700 mt-1">
                    20% price reduction across core products, targeting our key accounts
                  </p>
                  <Badge variant="destructive" className="mt-2">
                    Critical
                  </Badge>
                </div>
                <div className="p-4 border border-orange-200 rounded-lg bg-orange-50">
                  <h4 className="font-semibold text-orange-800">New Entrant - TechCorp</h4>
                  <p className="text-sm text-orange-700 mt-1">
                    Well-funded startup with innovative AI-powered solution
                  </p>
                  <Badge variant="secondary" className="mt-2 bg-orange-200">
                    High
                  </Badge>
                </div>
                <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                  <h4 className="font-semibold text-yellow-800">Platform Shift Risk</h4>
                  <p className="text-sm text-yellow-700 mt-1">Industry moving towards cloud-native solutions</p>
                  <Badge variant="secondary" className="mt-2 bg-yellow-200">
                    Medium
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mitigation Strategies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                  <h4 className="font-semibold text-green-800">Strengthen Value Proposition</h4>
                  <p className="text-sm text-green-700 mt-1">Focus on unique features and superior customer service</p>
                </div>
                <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                  <h4 className="font-semibold text-blue-800">Innovation Investment</h4>
                  <p className="text-sm text-blue-700 mt-1">Accelerate R&D and product development initiatives</p>
                </div>
                <div className="p-4 border border-purple-200 rounded-lg bg-purple-50">
                  <h4 className="font-semibold text-purple-800">Strategic Partnerships</h4>
                  <p className="text-sm text-purple-700 mt-1">Form alliances to strengthen market position</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Market Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                  <h4 className="font-semibold text-green-800">SMB Market Expansion</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Underserved small business segment with 40% growth potential
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className="bg-green-600">High Impact</Badge>
                    <span className="text-xs text-green-600">Est. $500M opportunity</span>
                  </div>
                </div>
                <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                  <h4 className="font-semibold text-blue-800">International Markets</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Asia-Pacific region showing strong demand for our solutions
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className="bg-blue-600">Medium Impact</Badge>
                    <span className="text-xs text-blue-600">Est. $300M opportunity</span>
                  </div>
                </div>
                <div className="p-4 border border-purple-200 rounded-lg bg-purple-50">
                  <h4 className="font-semibold text-purple-800">AI Integration</h4>
                  <p className="text-sm text-purple-700 mt-1">
                    Embed AI capabilities to differentiate from competitors
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className="bg-purple-600">High Impact</Badge>
                    <span className="text-xs text-purple-600">Est. $200M opportunity</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Strategic Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      1
                    </div>
                    <div>
                      <h5 className="font-semibold">Accelerate SMB Go-to-Market</h5>
                      <p className="text-sm text-slate-600">Launch simplified product tier for small businesses</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      2
                    </div>
                    <div>
                      <h5 className="font-semibold">Invest in AI Capabilities</h5>
                      <p className="text-sm text-slate-600">Develop AI-powered features to stay competitive</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      3
                    </div>
                    <div>
                      <h5 className="font-semibold">Strategic Acquisitions</h5>
                      <p className="text-sm text-slate-600">Acquire complementary technologies and talent</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      4
                    </div>
                    <div>
                      <h5 className="font-semibold">Partnership Ecosystem</h5>
                      <p className="text-sm text-slate-600">Build strategic alliances for market expansion</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Implementation Roadmap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Q1 2024</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Launch SMB product tier</li>
                      <li>• Begin AI capability development</li>
                      <li>• Identify acquisition targets</li>
                    </ul>
                  </div>
                  <div className="p-4 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Q2 2024</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Scale SMB sales efforts</li>
                      <li>• Beta test AI features</li>
                      <li>• Establish key partnerships</li>
                    </ul>
                  </div>
                  <div className="p-4 border border-purple-200 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2">Q3-Q4 2024</h4>
                    <ul className="text-sm space-y-1">
                      <li>• International market entry</li>
                      <li>• Full AI feature rollout</li>
                      <li>• Complete strategic acquisition</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
