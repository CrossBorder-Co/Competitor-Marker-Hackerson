"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Bot, User, RefreshCw, Calendar, Building } from "lucide-react"
import { format } from "@/lib/date-utils"

interface ChatInterfaceProps {
  company: string
  prompt: { id: string; title: string; description: string; category: string } | undefined
  startDate: Date | undefined
  endDate: Date | undefined
  onReset: () => void
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function ChatInterface({ company, prompt, startDate, endDate, onReset }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: `I'll analyze ${company} using the "${prompt?.title}" template for the period from ${startDate ? format(startDate, "MMM dd, yyyy") : "N/A"} to ${endDate ? format(endDate, "MMM dd, yyyy") : "N/A"}.

Based on my analysis of ${company}'s competitive landscape, here are the key findings:

## Competitive Position
${company} maintains a strong position in their primary markets, with several key competitive advantages:
- Strong brand recognition and customer loyalty
- Robust product portfolio and innovation pipeline
- Established distribution channels and partnerships

## Key Competitors
1. **Direct Competitors**: Companies offering similar products/services in the same market segments
2. **Indirect Competitors**: Alternative solutions that address similar customer needs
3. **Emerging Threats**: New entrants and disruptive technologies

## Market Opportunities
- Expansion into adjacent markets
- Strategic partnerships and acquisitions
- Technology integration and digital transformation
- Geographic expansion opportunities

## Recommended Actions
1. **Strengthen Core Competencies**: Focus on areas where ${company} has sustainable competitive advantages
2. **Monitor Emerging Threats**: Implement early warning systems for disruptive competitors
3. **Explore Strategic Partnerships**: Identify potential collaboration opportunities
4. **Invest in Innovation**: Maintain competitive edge through R&D and technology adoption

Would you like me to dive deeper into any specific aspect of this analysis?`,
      timestamp: new Date(),
    },
  ])

  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleFollowUpQuestion = (question: string) => {
    setIsAnalyzing(true)

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: question,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateFollowUpResponse(question, company),
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiResponse])
      setIsAnalyzing(false)
    }, 2000)
  }

  const followUpQuestions = [
    "What are the biggest threats to this company?",
    "Which Sales Marker products would be most beneficial?",
    "How has the competitive landscape changed recently?",
    "What marketing strategies should we prioritize?",
    "Which partnerships should we consider?",
    "What are the emerging market opportunities?",
  ]

  return (
    <div className="space-y-6">
      {/* Analysis Context */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Analysis Context</CardTitle>
            <Button variant="outline" size="sm" onClick={onReset}>
              <RefreshCw className="h-4 w-4 mr-2" />
              New Analysis
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-slate-500" />
              <span className="font-medium">{company}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-500" />
              <span>
                {startDate && endDate
                  ? `${format(startDate, "MMM dd")} - ${format(endDate, "MMM dd, yyyy")}`
                  : "Date range not specified"}
              </span>
            </div>
            <Badge variant="secondary">{prompt?.category}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Chat Messages */}
      <Card className="min-h-[500px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={message.id}>
                  <div className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <div className={`p-2 rounded-full ${message.role === "user" ? "bg-blue-100" : "bg-slate-100"}`}>
                        {message.role === "user" ? (
                          <User className="h-4 w-4 text-blue-600" />
                        ) : (
                          <Bot className="h-4 w-4 text-slate-600" />
                        )}
                      </div>
                      <div
                        className={`p-4 rounded-lg ${message.role === "user" ? "bg-blue-600 text-white" : "bg-slate-50"}`}
                      >
                        <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                        <div className={`text-xs mt-2 ${message.role === "user" ? "text-blue-100" : "text-slate-500"}`}>
                          {format(message.timestamp, "HH:mm")}
                        </div>
                      </div>
                    </div>
                  </div>
                  {index < messages.length - 1 && <Separator className="my-4" />}
                </div>
              ))}

              {isAnalyzing && (
                <div className="flex gap-3 justify-start">
                  <div className="p-2 rounded-full bg-slate-100">
                    <Bot className="h-4 w-4 text-slate-600 animate-pulse" />
                  </div>
                  <div className="p-4 rounded-lg bg-slate-50">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-600"></div>
                      Analyzing...
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Follow-up Questions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Follow-up Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {followUpQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                className="text-left h-auto p-3 justify-start bg-transparent"
                onClick={() => handleFollowUpQuestion(question)}
                disabled={isAnalyzing}
              >
                <span className="text-sm">{question}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function generateFollowUpResponse(question: string, company: string): string {
  const responses: Record<string, string> = {
    "What are the biggest threats to this company?": `Based on my analysis of ${company}, here are the primary threats:

## Immediate Threats
1. **Market Disruption**: New technologies and business models that could obsolete current offerings
2. **Competitive Pressure**: Aggressive pricing and feature competition from established rivals
3. **Regulatory Changes**: Potential policy shifts that could impact operations

## Emerging Threats
1. **New Entrants**: Well-funded startups with innovative approaches
2. **Platform Shifts**: Changes in customer behavior and platform preferences
3. **Supply Chain Vulnerabilities**: Dependencies that could be exploited by competitors

## Mitigation Strategies
- Invest in continuous innovation and R&D
- Diversify revenue streams and market presence
- Build stronger customer relationships and loyalty programs
- Develop strategic partnerships for competitive advantage`,

    "Which Sales Marker products would be most beneficial?": `For ${company}, I recommend these Sales Marker products:

## Primary Recommendations
1. **Sales Intelligence Pro**: Track competitor sales activities and win/loss patterns
2. **Market Opportunity Scanner**: Identify untapped market segments and customer needs
3. **Competitive Pricing Analytics**: Optimize pricing strategies based on market dynamics

## Secondary Products
1. **Customer Journey Mapper**: Understand how customers evaluate alternatives
2. **Sales Enablement Suite**: Equip sales teams with competitive battle cards
3. **Pipeline Forecasting**: Predict market share changes and revenue impact

## Expected ROI
- 15-25% improvement in win rates against key competitors
- 20-30% reduction in sales cycle length
- 10-15% increase in average deal size through better positioning`,

    "How has the competitive landscape changed recently?": `Recent changes in ${company}'s competitive landscape:

## Market Consolidation
- Several mid-tier competitors have merged, creating stronger rivals
- Private equity investments have increased competitive intensity
- New strategic alliances are reshaping market dynamics

## Technology Disruption
- AI and automation are changing customer expectations
- Cloud-first solutions are becoming table stakes
- Mobile-first approaches are gaining traction

## Customer Behavior Shifts
- Increased focus on ROI and measurable outcomes
- Preference for integrated solutions over point products
- Growing importance of sustainability and social responsibility

## Strategic Implications
- Need for accelerated digital transformation
- Importance of ecosystem partnerships
- Focus on customer success and retention`,

    "What marketing strategies should we prioritize?": `Priority marketing strategies for ${company}:

## Content Marketing
1. **Thought Leadership**: Position as industry expert through insights and analysis
2. **Case Studies**: Showcase successful customer outcomes and ROI
3. **Competitive Comparisons**: Highlight unique value propositions

## Digital Marketing
1. **SEO Optimization**: Capture high-intent search traffic
2. **Social Selling**: Enable sales teams with social media tools
3. **Account-Based Marketing**: Target high-value prospects with personalized campaigns

## Partnership Marketing
1. **Co-marketing**: Leverage partner networks for broader reach
2. **Channel Enablement**: Support partner sales efforts
3. **Industry Events**: Increase visibility at key conferences and trade shows

## Measurement & Optimization
- Track competitor share of voice and sentiment
- Monitor customer acquisition costs by channel
- Analyze win/loss patterns for messaging optimization`,

    "Which partnerships should we consider?": `Strategic partnership opportunities for ${company}:

## Technology Partnerships
1. **Integration Partners**: Companies with complementary solutions
2. **Platform Partners**: Major cloud and software platforms
3. **Innovation Partners**: Startups with emerging technologies

## Channel Partnerships
1. **Reseller Networks**: Expand geographic and market reach
2. **System Integrators**: Access enterprise implementation expertise
3. **Consultancies**: Leverage advisory relationships

## Strategic Alliances
1. **Industry Leaders**: Joint go-to-market with established players
2. **Vertical Specialists**: Access domain expertise in key industries
3. **Global Partners**: International expansion opportunities

## Partnership Evaluation Criteria
- Market reach and customer overlap
- Technical compatibility and integration ease
- Cultural fit and shared values
- Competitive positioning and differentiation`,

    "What are the emerging market opportunities?": `Emerging opportunities for ${company}:

## Market Segments
1. **SMB Market**: Underserved small and medium businesses
2. **Vertical Industries**: Healthcare, fintech, and manufacturing
3. **International Markets**: Asia-Pacific and European expansion

## Technology Trends
1. **AI Integration**: Embed intelligence into core products
2. **Mobile-First**: Develop native mobile experiences
3. **API Economy**: Enable third-party integrations and ecosystems

## Business Model Innovation
1. **Subscription Services**: Recurring revenue opportunities
2. **Marketplace Models**: Platform-based revenue streams
3. **Outcome-Based Pricing**: Value-based pricing models

## Investment Priorities
- R&D for emerging technologies
- Sales and marketing for new segments
- Strategic acquisitions for capabilities
- International expansion infrastructure`,
  }

  return (
    responses[question] ||
    `Thank you for your question about "${question}". Based on my analysis of ${company}, I'll provide detailed insights on this topic. This would include specific recommendations, data-driven insights, and actionable next steps tailored to your competitive situation.`
  )
}
