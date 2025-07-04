"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Star, TrendingUp, Users, Target, BarChart3, Zap, ArrowRight } from "lucide-react"

interface ProductRecommendationsProps {
  company: string
}

const salesMarkerProducts = [
  {
    id: "sales-intelligence-pro",
    name: "Sales Intelligence Pro",
    category: "Sales",
    description: "Advanced competitor tracking and sales intelligence platform",
    features: [
      "Real-time competitor activity monitoring",
      "Win/loss analysis and insights",
      "Sales opportunity scoring",
      "Competitive battle cards",
    ],
    benefits: ["25% increase in win rates", "30% reduction in sales cycle", "Better competitive positioning"],
    pricing: "$299/month per user",
    matchScore: 95,
    priority: "high",
    icon: Target,
  },
  {
    id: "market-opportunity-scanner",
    name: "Market Opportunity Scanner",
    category: "Strategy",
    description: "Identify untapped market segments and growth opportunities",
    features: [
      "Market gap analysis",
      "Customer needs assessment",
      "Competitive landscape mapping",
      "Opportunity prioritization",
    ],
    benefits: ["Discover new revenue streams", "Faster market entry", "Strategic advantage"],
    pricing: "$199/month per user",
    matchScore: 88,
    priority: "high",
    icon: TrendingUp,
  },
  {
    id: "competitive-pricing-analytics",
    name: "Competitive Pricing Analytics",
    category: "Pricing",
    description: "Optimize pricing strategies based on market dynamics",
    features: [
      "Real-time price monitoring",
      "Price elasticity analysis",
      "Competitive pricing alerts",
      "Revenue optimization",
    ],
    benefits: ["15% increase in margins", "Dynamic pricing capability", "Market-responsive pricing"],
    pricing: "$149/month per user",
    matchScore: 82,
    priority: "medium",
    icon: BarChart3,
  },
  {
    id: "customer-journey-mapper",
    name: "Customer Journey Mapper",
    category: "Marketing",
    description: "Understand customer decision-making and buying patterns",
    features: [
      "Journey visualization",
      "Touchpoint analysis",
      "Conversion optimization",
      "Competitor comparison points",
    ],
    benefits: ["Improved customer experience", "Higher conversion rates", "Better marketing ROI"],
    pricing: "$179/month per user",
    matchScore: 76,
    priority: "medium",
    icon: Users,
  },
  {
    id: "sales-enablement-suite",
    name: "Sales Enablement Suite",
    category: "Sales",
    description: "Equip sales teams with competitive intelligence tools",
    features: [
      "Dynamic battle cards",
      "Objection handling guides",
      "Competitive positioning",
      "Sales training modules",
    ],
    benefits: ["Faster rep onboarding", "Consistent messaging", "Improved close rates"],
    pricing: "$99/month per user",
    matchScore: 71,
    priority: "low",
    icon: Zap,
  },
]

const implementationPlan = [
  {
    phase: "Phase 1 (Month 1-2)",
    title: "Foundation Setup",
    products: ["Sales Intelligence Pro", "Market Opportunity Scanner"],
    activities: [
      "Initial platform setup and configuration",
      "Data integration and competitor identification",
      "Team training and onboarding",
      "Baseline metrics establishment",
    ],
  },
  {
    phase: "Phase 2 (Month 3-4)",
    title: "Optimization & Expansion",
    products: ["Competitive Pricing Analytics", "Customer Journey Mapper"],
    activities: [
      "Advanced feature activation",
      "Process optimization and automation",
      "Cross-team collaboration setup",
      "Performance monitoring and adjustment",
    ],
  },
  {
    phase: "Phase 3 (Month 5-6)",
    title: "Advanced Capabilities",
    products: ["Sales Enablement Suite"],
    activities: [
      "Full ecosystem integration",
      "Advanced analytics and reporting",
      "Strategic planning integration",
      "ROI measurement and optimization",
    ],
  },
]

export function ProductRecommendations({ company }: ProductRecommendationsProps) {
  const highPriorityProducts = salesMarkerProducts.filter((p) => p.priority === "high")
  const mediumPriorityProducts = salesMarkerProducts.filter((p) => p.priority === "medium")
  const lowPriorityProducts = salesMarkerProducts.filter((p) => p.priority === "low")

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Sales Marker Product Recommendations
          </CardTitle>
          <CardDescription>
            Personalized product recommendations based on {company}'s competitive analysis
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="recommendations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="implementation">Implementation</TabsTrigger>
          <TabsTrigger value="roi">ROI Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="space-y-6">
          {/* High Priority Products */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">High Priority Recommendations</h3>
              <Badge className="bg-red-600">Critical</Badge>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {highPriorityProducts.map((product) => {
                const IconComponent = product.icon
                return (
                  <Card key={product.id} className="border-red-200 bg-red-50">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-red-600 rounded-lg">
                            <IconComponent className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{product.name}</CardTitle>
                            <Badge variant="secondary">{product.category}</Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">Match Score</div>
                          <div className="text-2xl font-bold text-red-600">{product.matchScore}%</div>
                        </div>
                      </div>
                      <CardDescription>{product.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h5 className="font-semibold mb-2">Key Features</h5>
                        <ul className="text-sm space-y-1">
                          {product.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold mb-2">Expected Benefits</h5>
                        <ul className="text-sm space-y-1">
                          {product.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <TrendingUp className="h-3 w-3 text-blue-600" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div>
                          <div className="text-sm text-slate-600">Starting at</div>
                          <div className="font-semibold">{product.pricing}</div>
                        </div>
                        <Button className="bg-red-600 hover:bg-red-700">
                          Get Started
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Medium Priority Products */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Medium Priority Recommendations</h3>
              <Badge className="bg-orange-600">Important</Badge>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mediumPriorityProducts.map((product) => {
                const IconComponent = product.icon
                return (
                  <Card key={product.id} className="border-orange-200 bg-orange-50">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-orange-600 rounded-lg">
                            <IconComponent className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{product.name}</CardTitle>
                            <Badge variant="secondary">{product.category}</Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">Match Score</div>
                          <div className="text-2xl font-bold text-orange-600">{product.matchScore}%</div>
                        </div>
                      </div>
                      <CardDescription>{product.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h5 className="font-semibold mb-2">Key Features</h5>
                        <ul className="text-sm space-y-1">
                          {product.features.slice(0, 3).map((feature, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div>
                          <div className="text-sm text-slate-600">Starting at</div>
                          <div className="font-semibold">{product.pricing}</div>
                        </div>
                        <Button
                          variant="outline"
                          className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white bg-transparent"
                        >
                          Learn More
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Low Priority Products */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Additional Recommendations</h3>
              <Badge variant="secondary">Optional</Badge>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {lowPriorityProducts.map((product) => {
                const IconComponent = product.icon
                return (
                  <Card key={product.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-600 rounded-lg">
                            <IconComponent className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{product.name}</CardTitle>
                            <Badge variant="secondary">{product.category}</Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">Match Score</div>
                          <div className="text-2xl font-bold text-slate-600">{product.matchScore}%</div>
                        </div>
                      </div>
                      <CardDescription>{product.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between pt-4">
                        <div>
                          <div className="text-sm text-slate-600">Starting at</div>
                          <div className="font-semibold">{product.pricing}</div>
                        </div>
                        <Button variant="outline">Learn More</Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="implementation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Implementation Roadmap</CardTitle>
              <CardDescription>Phased approach to maximize value and minimize disruption</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {implementationPlan.map((phase, index) => (
                <div key={index} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">{phase.phase}</h4>
                      <p className="text-slate-600">{phase.title}</p>
                    </div>
                  </div>

                  <div className="ml-11 space-y-3">
                    <div>
                      <h5 className="font-medium mb-2">Recommended Products</h5>
                      <div className="flex flex-wrap gap-2">
                        {phase.products.map((product, productIndex) => (
                          <Badge key={productIndex} variant="outline" className="border-blue-200 text-blue-700">
                            {product}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium mb-2">Key Activities</h5>
                      <ul className="space-y-1">
                        {phase.activities.map((activity, activityIndex) => (
                          <li key={activityIndex} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            {activity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {index < implementationPlan.length - 1 && <div className="ml-4 w-0.5 h-8 bg-slate-200"></div>}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Success Metrics & KPIs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-semibold text-blue-800">Win Rate</h5>
                  <p className="text-2xl font-bold text-blue-600">+25%</p>
                  <p className="text-sm text-blue-700">Expected improvement</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h5 className="font-semibold text-green-800">Sales Cycle</h5>
                  <p className="text-2xl font-bold text-green-600">-30%</p>
                  <p className="text-sm text-green-700">Reduction in length</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h5 className="font-semibold text-purple-800">Deal Size</h5>
                  <p className="text-2xl font-bold text-purple-600">+15%</p>
                  <p className="text-sm text-purple-700">Average increase</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h5 className="font-semibold text-orange-800">Market Share</h5>
                  <p className="text-2xl font-bold text-orange-600">+5%</p>
                  <p className="text-sm text-orange-700">Growth target</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roi" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Investment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="font-medium">Sales Intelligence Pro</span>
                    <span className="font-semibold">$3,588/year</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="font-medium">Market Opportunity Scanner</span>
                    <span className="font-semibold">$2,388/year</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="font-medium">Competitive Pricing Analytics</span>
                    <span className="font-semibold">$1,788/year</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <span className="font-semibold text-blue-800">Total Annual Investment</span>
                    <span className="font-bold text-blue-600 text-lg">$7,764</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Expected Returns</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="font-medium">Increased Win Rate</span>
                    <span className="font-semibold">$125,000</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="font-medium">Faster Sales Cycles</span>
                    <span className="font-semibold">$85,000</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="font-medium">Larger Deal Sizes</span>
                    <span className="font-semibold">$65,000</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-100 rounded-lg border border-green-200">
                    <span className="font-semibold text-green-800">Total Annual Return</span>
                    <span className="font-bold text-green-600 text-lg">$275,000</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>ROI Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 mb-2">3,442%</div>
                  <div className="text-sm font-medium text-green-800">Return on Investment</div>
                  <div className="text-xs text-green-700 mt-1">Annual ROI</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">3.4</div>
                  <div className="text-sm font-medium text-blue-800">Payback Period</div>
                  <div className="text-xs text-blue-700 mt-1">Months to break even</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 mb-2">$267K</div>
                  <div className="text-sm font-medium text-purple-800">Net Benefit</div>
                  <div className="text-xs text-purple-700 mt-1">Annual net return</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Risk Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h5 className="font-semibold text-green-800 mb-2">Low Risk Investment</h5>
                  <p className="text-sm text-green-700">
                    Sales Marker products have a proven track record with similar companies in your industry. The
                    implementation is low-risk with strong vendor support and training programs.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h6 className="font-medium">Success Factors</h6>
                    <ul className="text-sm space-y-1">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        Strong vendor support
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        Proven ROI in similar companies
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        Scalable implementation
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h6 className="font-medium">Mitigation Strategies</h6>
                    <ul className="text-sm space-y-1">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-blue-600" />
                        Phased rollout approach
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-blue-600" />
                        Regular performance monitoring
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-blue-600" />
                        Continuous optimization
                      </li>
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
