"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, Search, TrendingUp, Users, Target, Zap, BarChart3, MessageSquare } from "lucide-react"
import { format } from "@/lib/date-utils"
import { cn } from "@/lib/utils"
import { ChatInterface } from "@/components/chat-interface"
import { CompetitorAnalysis } from "@/components/competitor-analysis"
import { ProductRecommendations } from "@/components/product-recommendations"

const TEMPLATE_PROMPTS = [
  {
    id: "competitive-landscape",
    title: "Competitive Landscape Analysis",
    description: "Analyze the competitive landscape and identify key players",
    category: "Analysis",
  },
  {
    id: "market-opportunities",
    title: "Market Opportunities",
    description: "Identify emerging opportunities and market gaps",
    category: "Strategy",
  },
  {
    id: "threat-assessment",
    title: "Threat Assessment",
    description: "Evaluate potential threats and competitive risks",
    category: "Risk",
  },
  {
    id: "strategic-recommendations",
    title: "Strategic Recommendations",
    description: "Get actionable recommendations for next steps",
    category: "Action",
  },
  {
    id: "sales-strategy",
    title: "Sales Strategy Optimization",
    description: "Optimize sales approach based on competitor analysis",
    category: "Sales",
  },
  {
    id: "marketing-insights",
    title: "Marketing Insights",
    description: "Discover marketing opportunities and positioning strategies",
    category: "Marketing",
  },
]

export default function CompetitorMarkerApp() {
  const [selectedCompany, setSelectedCompany] = useState("")
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [selectedPrompt, setSelectedPrompt] = useState("")
  const [analysisStarted, setAnalysisStarted] = useState(false)
  const [activeTab, setActiveTab] = useState("setup")

  const handleStartAnalysis = () => {
    if (selectedCompany && selectedPrompt && startDate && endDate) {
      setAnalysisStarted(true)
      setActiveTab("analysis")
    }
  }

  const resetAnalysis = () => {
    setAnalysisStarted(false)
    setActiveTab("setup")
    setSelectedCompany("")
    setSelectedPrompt("")
    setStartDate(undefined)
    setEndDate(undefined)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Target className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Competitor Marker</h1>
              <p className="text-slate-600">AI-powered competitive intelligence platform</p>
            </div>
          </div>

          <div className="flex gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span>Market Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Competitor Tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span>AI Recommendations</span>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="setup" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Setup
            </TabsTrigger>
            <TabsTrigger value="analysis" disabled={!analysisStarted} className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Analysis
            </TabsTrigger>
            <TabsTrigger value="insights" disabled={!analysisStarted} className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Insights
            </TabsTrigger>
            <TabsTrigger value="recommendations" disabled={!analysisStarted} className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Products
            </TabsTrigger>
          </TabsList>

          <TabsContent value="setup" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analysis Configuration</CardTitle>
                <CardDescription>Set up your competitive analysis parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Company Selection */}
                <div className="space-y-2">
                  <Label htmlFor="company">Target Company</Label>
                  <Input
                    id="company"
                    placeholder="Enter company name (e.g., Apple, Microsoft, Tesla)"
                    value={selectedCompany}
                    onChange={(e) => setSelectedCompany(e.target.value)}
                  />
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !startDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !endDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Template Prompts */}
                <div className="space-y-4">
                  <Label>Analysis Template</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {TEMPLATE_PROMPTS.map((prompt) => (
                      <Card
                        key={prompt.id}
                        className={cn(
                          "cursor-pointer transition-all hover:shadow-md",
                          selectedPrompt === prompt.id && "ring-2 ring-blue-500 bg-blue-50",
                        )}
                        onClick={() => setSelectedPrompt(prompt.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-sm">{prompt.title}</h3>
                            <Badge variant="secondary" className="text-xs">
                              {prompt.category}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-600">{prompt.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleStartAnalysis}
                  disabled={!selectedCompany || !selectedPrompt || !startDate || !endDate}
                  className="w-full"
                  size="lg"
                >
                  Start AI Analysis
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis">
            <ChatInterface
              company={selectedCompany}
              prompt={TEMPLATE_PROMPTS.find((p) => p.id === selectedPrompt)}
              startDate={startDate}
              endDate={endDate}
              onReset={resetAnalysis}
            />
          </TabsContent>

          <TabsContent value="insights">
            <CompetitorAnalysis company={selectedCompany} startDate={startDate} endDate={endDate} />
          </TabsContent>

          <TabsContent value="recommendations">
            <ProductRecommendations company={selectedCompany} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
